import Head from 'next/head';
import styles from '../styles/Home.module.css';
import getDemoProps from '../lib/demoProps'
import { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import CreateRoom from '../components/prejoin/createRoom';
import DailyIframe from '@daily-co/daily-js';
import { useDeepCompareEffect, useDeepCompareMemo } from 'use-deep-compare';

import {
  ACCESS_STATE_LOBBY,
  ACCESS_STATE_NONE,
  ACCESS_STATE_UNKNOWN,
  MEETING_STATE_JOINED,
} from '../constants';
import VideoTile from '../components/shared/videoTile/videoTile';
import Chat from '../components/chat/chat';

export const CALL_STATE_READY = 'ready';
export const CALL_STATE_LOBBY = 'lobby';
export const CALL_STATE_JOINING = 'joining';
export const CALL_STATE_JOINED = 'joined';
export const CALL_STATE_ENDED = 'ended';
export const CALL_STATE_ERROR = 'error';
export const CALL_STATE_FULL = 'full';
export const CALL_STATE_EXPIRED = 'expired';
export const CALL_STATE_NOT_BEFORE = 'nbf';
export const CALL_STATE_REMOVED = 'removed-from-call';
export const CALL_STATE_REDIRECTING = 'redirecting';
export const CALL_STATE_NOT_FOUND = 'not-found';
export const CALL_STATE_NOT_ALLOWED = 'not-allowed';
export const CALL_STATE_AWAITING_ARGS = 'awaiting-args';

export let participantList = [];
export let chatList = [];

export default function Home({domain, isConfigured, apiKey}) {
  const audioEl = useRef(null);
  const [room, setRoom] = useState('');
  const [update, setUpdate] = useState(false)
  const [daily, setDaily] = useState(null);
  const [state, setState] = useState(CALL_STATE_READY);
  const [token, setToken] = useState("");
  const [redirectOnLeave, setRedirectOnLeave] = useState(false);
  const [subscribeToTracksAutomatically, setSubscribeToTracksAutomatically] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [creator, setCreator] = useState({});
  const [audioInput, setAudioInput] = useState([]);
  const [videoInput, setVideoInput] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  
  // const [url, setUrl] = useState('');
 
  const url =  `https://${domain}.daily.co/textdemo`;


  useEffect(() => {
    if (!audioEl) return;
    audioEl.current.srcObject = new MediaStream();
  }, [])

  // const trackIds = useDeepCompareMemo(
  //   () => Object.values(participants.audioTrack).map((t) => t?.persistentTrack?.id),
  //   [participants]
  // );

  // useDeepCompareEffect(() => {
  //   const audio = audioEl.current;
  //   if (!audio || !audio.srcObject) return;

  //   const stream = audio.srcObject;
  //   const allTracks = Object.values(participants.tracks);
  //   console.log("allTracks", allTracks)

  //   // allTracks.forEach((track) => {
  //   //   const persistentTrack = track?.persistentTrack;
  //   //   if (persistentTrack) {
  //   //     persistentTrack.addEventListener(
  //   //       'ended',
  //   //       (ev) => stream.removeTrack(ev.target),
  //   //       { once: true }
  //   //     );
  //   //     stream.addTrack(persistentTrack);
  //   //   }
  //   // });
    
  // }, [participants]);



  /**
   * Joins call (with the token, if applicable)
   */
   const join = useCallback(
    async (callObject) => {
      setState(CALL_STATE_JOINING);
      await callObject.join({ subscribeToTracksAutomatically, token, url });
      setState(CALL_STATE_JOINED);
    },
    [token, subscribeToTracksAutomatically, url]
  );


  /**
   * PreAuth checks whether we have access or need to knock
   */
   const preAuth = useCallback(
    async (co) => {
      const { access } = await co.preAuth({
        subscribeToTracksAutomatically,
        token,
        url,
      });

      // Private room and no `token` was passed
      if (
        access === ACCESS_STATE_UNKNOWN ||
        access?.level === ACCESS_STATE_NONE
      ) {
        return;
      }

      // Either `enable_knocking_ui` or `enable_prejoin_ui` is set to `true`
      if (
        access?.level === ACCESS_STATE_LOBBY 
      ) {
        setState(CALL_STATE_LOBBY);
        return;
      }

      // Public room or private room with passed `token` and `enable_prejoin_ui` is `false`
      join(co);
    },
    [join, subscribeToTracksAutomatically, token, url]
  );


  /**
   * Leave call
   */
   const leave = useCallback(() => {
    if (!daily) return;
    // If we're in the error state, we've already "left", so just clean up
    if (state === CALL_STATE_ERROR) {
      daily.destroy();
    } else {
      daily.leave();
    }
    setRoom('');
    setDaily(null);
    setState(CALL_STATE_READY);
    setToken("");
    setRedirectOnLeave(false);
    setParticipants([]);
    setCreator({});
    participantList = [];

  }, [daily, state]);





  /**
   * Listen for access state updates
   */
   const handleAccessStateUpdated = useCallback(
    async ({ access }) => {handleAccessStateUpdated
      console.log(`🔑 Access level: ${access?.level}`);

      /**
       * Ignore initial access-state-updated event
       */
      if (
        [CALL_STATE_ENDED, CALL_STATE_AWAITING_ARGS, CALL_STATE_READY].includes(
          state
        )
      ) {
        return;
      }

      if (
        access === ACCESS_STATE_UNKNOWN ||
        access?.level === ACCESS_STATE_NONE
      ) {
       // setState(CALL_STATE_NOT_ALLOWED);
        return;
      }

      const meetingState = daily.meetingState();
      if (
        access?.level === ACCESS_STATE_LOBBY &&
        meetingState === MEETING_STATE_JOINED
      ) {
        // Already joined, no need to call join(daily) again.
        return;
      }

      /**
       * 'full' access, we can now join the meeting.
       */
      join(daily, room);
    },
    [daily, join]
  ); 
  useEffect(() => {
    if (!daily) return false;

    daily.on('access-state-updated', handleAccessStateUpdated);
    daily.on('app-message', handleNewMessage);
    return () => {
      daily.off('access-state-updated', handleAccessStateUpdated);
      daily.off('app-message', handleNewMessage, handleNewMessage);
    }

  }, [daily, handleAccessStateUpdated])
  
  /**
  * Listen for and manage call state
  */
 useEffect(() => {
   if (!daily) return false;

   const events = [
     'joined-meeting',
     'joining-meeting',
     'left-meeting',
     'error',
   ];

   const handleMeetingState = async (ev) => {
     const { access } = daily.accessState();

     switch (ev.action) {
       /**
        * Don't transition to 'joining' or 'joined' UI as long as access is not 'full'.
        * This means a request to join a private room is not granted, yet.
        * Technically in requesting for access, the participant is already known
        * to the room, but not joined, yet.
        */
       case 'joining-meeting':
         if (
           access === ACCESS_STATE_UNKNOWN ||
           access.level === ACCESS_STATE_NONE ||
           access.level === ACCESS_STATE_LOBBY
         ) {
           return;
         }
         setState(CALL_STATE_JOINING);
         break;
       case 'joined-meeting':
         console.log("joined-meeting")
         if (
           access === ACCESS_STATE_UNKNOWN ||
           access.level === ACCESS_STATE_NONE ||
           access.level === ACCESS_STATE_LOBBY
         ) {
           return;
         }
         setCreator(ev.participants.local);
         setState(CALL_STATE_JOINED);
         break;
       case 'left-meeting':
         daily.destroy();
         setState(
           !redirectOnLeave ? CALL_STATE_ENDED : CALL_STATE_REDIRECTING
         );
         break;
       case 'error':
         switch (ev?.error?.type) {
           case 'nbf-room':
           case 'nbf-token':
             daily.destroy();
             setState(CALL_STATE_NOT_BEFORE);
             break;
           case 'exp-room':
           case 'exp-token':
             daily.destroy();
             setState(CALL_STATE_EXPIRED);
             break;
           case 'ejected':
             daily.destroy();
             setState(CALL_STATE_REMOVED);
             break;
           default:
             switch (ev?.errorMsg) {
               case 'Join request rejected':
                 // Join request to a private room was denied. We can end here.
                 setState(CALL_STATE_LOBBY);
                 daily.leave();
                 break;
               case 'Meeting has ended':
                 // Meeting has ended or participant was removed by an owner.
                 daily.destroy();
                 setState(CALL_STATE_ENDED);
                 break;
               case 'Meeting is full':
                 daily.destroy();
                 setState(CALL_STATE_FULL);
                 break;
               case "The meeting you're trying to join does not exist.":
                 daily.destroy();
                 setState(CALL_STATE_NOT_FOUND);
                 break;
               case 'You are not allowed to join this meeting':
                 daily.destroy();
                 setState(CALL_STATE_NOT_ALLOWED);
                 break;
               default:
                 setState(CALL_STATE_ERROR);
                 break;
             }
             break;
         }
         break;
       default:
         break;
     }
   };

   // Listen for changes in state
   events.forEach((event) => daily.on(event, handleMeetingState));

   // Stop listening for changes in state
   return () =>
     events.forEach((event) => daily.off(event, handleMeetingState));
 }, [daily, domain, room, redirectOnLeave]);


 const handleNewParticipantsState = useCallback(
  (event = null) => {
    switch (event?.action) {
      case 'participant-joined':
       console.log('participant joined', participants)
       const newParticipant = [...participantList, event.participant]
       console.log(newParticipant);
       setParticipants(newParticipant);
       participantList = newParticipant
        break;
      case 'participant-updated':
        console.log('participant updated', event);
        if(event.participant.local) {
          setCreator(event.participant)
        } else {
          const allParticipants = [...participantList];
          const index = allParticipants.findIndex((participant) => participant.user_id === event.participant.user_id);
          if(index !== -1) {
            allParticipants[index] = event.participant;
            setParticipants(allParticipants);
            participantList = allParticipants;
          }
        }
        
        setUpdate(!update)
        

        break;
      case 'participant-left':
        console.log('participant left', event)
        const updatedList = participantList.filter(participant => participant.user_id !== event.participant.user_id);
        setParticipants(updatedList);
        participantList = updatedList;
        break;

      case 'track-started': 
      console.log('track started', event)
        // const videoEl = document.getElementById(event.participant.user_id);
        // videoEl?.srcObject = new MediaStream([event.participant.videoTrack])
        break;
      default:
        break;
    }
  },
  []
);

 
  /**
   * Start listening for participant changes, when the callObject is set.
   */
   useEffect(() => {
    if (!daily) return false;

    console.log('👥 Participant provider events bound');

    const events = [
      'joined-meeting',
      'participant-joined',
      'participant-updated',
      'participant-left',
      'track-started'
    ];

    // Use initial state
    handleNewParticipantsState();

    // Listen for changes in state
    events.forEach((event) => daily.on(event, handleNewParticipantsState));

    // Stop listening for changes in state
    return () =>
      events.forEach((event) =>
        daily.off(event, handleNewParticipantsState)
      );
  }, [daily, handleNewParticipantsState]);



  const initDailyObject = async (name) => {
    
    // const url = `https://${domain}.daily.co/${roomID}`;
    console.log('url', url);
    const call = DailyIframe.createCallObject({
      url,
      dailyConfig: {
        experimentalChromeVideoMuteLightOff: true,
      },
    });
    console.log('daily object', call);
    setDaily(call);
    call.setUserName(name);
    const { devices } = await call.enumerateDevices();
    const videoDevices =  devices.filter(device => device.kind === 'videoinput');
    setVideoInput(videoDevices);
    setSelectedVideo(videoDevices[0].deviceId);
    const audioDevices = devices.filter(device => device.kind === 'audioinput');
    setAudioInput(audioDevices);
    setSelectedAudio(audioDevices[0].deviceId)

    const { camera, mic, speaker } = await call.getInputDevices();
    console.log("devices", devices);
    console.log("cam", camera);
    const dailyRoomInfo = await call.room();
    const { access } = call.accessState();
    console.log("dailyRoomInfo", dailyRoomInfo);
    console.log("access", access);
    preAuth(call);
  }

  // const preAuth = async(co, roomID) => {
  //   const url = `https://${domain}.daily.co/${roomID}`;
  //   console.log('preauthurl', url);
  //   const { access } = await co.preAuth({
  //     subscribeToTracksAutomatically: true,
  //     token,
  //     url,
  //   });
  //   console.log("access preauth", access);

  // }
  // const join = async(co, roomID) => {
  //   const url = `https://${domain}.daily.co/${roomID}`;
  //   co.join({
  //     subscribeToTracksAutomatically: true,
  //     token,
  //     url
  //   })
  // }

  // useEffect(() => {
  //   if(!creator.user_id) {
  //     return;
  //   }
  //   const video = document.getElementById(creator.user_id);
  //   video.srcObject = new MediaStream([creator.videoTrack]);
  //  // if (isChrome92) video.load();
  // }, [creator.user_id]);
  
  


  const getRoomToken = async(roomID, isOwner) => {
    if (!roomID) {
      return false;
    }
    try {
      // setUrl(`https://${domain}.daily.co/${room}`);
      setRoom(roomID);
      const res = await fetch('/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomName: roomID, isOwner }),
      });
      const resJson = await res.json();
      setToken(resJson.token)
    //  initDailyObject();
      console.log("resJson", resJson);
    } catch(error) {

    }
    
  }


  useEffect(() => {
    getRoomToken('textdemo', true);
  }, [])
  const handleRoomCreated = (roomInfo) => {
    getRoomToken(roomInfo.name)
  }

  const hanleVideoToggle = () => {
    if(!daily) return;
    daily.setLocalVideo(!creator.video);
  }
  const handleAudioToggle = () => {
    if(!daily) return;
    daily.setLocalAudio(!creator.audio);
  }

  const handleScreenShare = () => {
    if(!daily) return;
    daily.startScreenShare();
  }
  const handleAudioDeviceChange = async(id) => {
    console.log("audioId", id);
    setSelectedAudio(id);
    await daily.setInputDevicesAsync({
      audioDeviceId: id,
    });

  }

  const handleVideoDeviceChange = async(id) => {
    setSelectedVideo(id)
    await daily.setInputDevicesAsync({
      videoDeviceId: id,
    });
  }

  const uuid = () => {
    return Math.random().toString(16).slice(2);
  }
  const sendMessage = (message) => {
    if(!daily) return;
    daily.sendAppMessage({message}, '*');
    const participants = daily.participants();
      // Get the sender (local participant) name
      const sender = participants.local.user_name
        ? participants.local.user_name
        : 'Guest';
      const senderID = participants.local.user_id;
      const messages = [...chatList];
      messages.push({sender, senderID,message, id: uuid() })
      setChatHistory(messages)
      chatList = messages;
  }



  const handleNewMessage = (event) => {
    if (event?.data?.message?.type) return;
    const participants = daily.participants();
    const sender = participants[event.fromId].user_name
    ? participants[event.fromId].user_name
    : 'Guest';
    const messages = [...chatList];
    console.log("messages", messages);
    messages.push({sender, senderID: event.fromId,message: event.data.message, id: uuid() })
    setChatHistory(messages);
    chatList = messages;

  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Lounges App</title>
        <meta name="description" content="Lounges have fun" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="text-2xl text-center 
                   text-green-800 border-b-2 
                   border-grey-500">
      <CreateRoom 
      onCreated={handleRoomCreated} 
      onRoomToken={initDailyObject}
      handleLeave={leave}
       daily={daily}/>
    </header>

      {/* <main className={styles.main}> */}
        
       
        <div className="flex h-full">
          <div className='w-2/3 border-2 border-gray-400 relative'>
            <div className=' w-full h-96  min-h-full'>
              <div className="grid grid-cols-5 gap-6 ">
                {participants.map(participant => {
                  return (
                    <VideoTile key={participant.user_id} update={update} participant={participant} mirrored={false} />
                  )
                })}
                
              </div>
              <audio autoPlay playsInline ref={audioEl}>
                <track kind="captions" />
              </audio>
            </div>
            <div className='absolute bottom-0 left-0 w-full h-24 bg-slate-400'>
              This is sticky fixed Footer.
            </div>
          </div>
          
            <div className='w-1/3 border-2 border-gray-400'>
              <div className='grid gap-6'>
                <div className="" >
                  {creator.user_id && (
                      <VideoTile className="creator" 
                      audioToggle={handleAudioToggle}
                      toggleScreenShare={handleScreenShare}
                      videoToggle={hanleVideoToggle} id={creator.user_id} participant={creator} autoPlay/>
                  )}
                </div>
                {state === CALL_STATE_JOINED && (
                  <div className='flex'>
                  <div className="mb-3 w-full">
                        <select
                          value={selectedVideo}
                          onChange={(event)=>handleVideoDeviceChange(event.target.value)}
                         className="form-select appearance-none
                          block
                          w-full
                          px-3
                          py-1.5
                          text-base
                          font-normal
                          text-gray-700
                          bg-white bg-clip-padding bg-no-repeat
                          border border-solid border-gray-300
                          rounded
                          transition
                          ease-in-out
                          m-0
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                            <option >Select Camera</option>
                            {videoInput.map(input => {
                              return (
                                <option defaultValue={selectedVideo === input.deviceId} value={input.deviceId} key={input.deviceId}>{input.label}</option>
                              )
                            })}
                        </select>
                      </div>
                      <div className="mb-3 px-2 w-full">
                        <select 
                          onChange={(event)=>handleAudioDeviceChange(event.target.value)}
                          value={selectedAudio}
                        className="form-select appearance-none
                          block
                          w-full
                          px-3
                          py-1.5
                          text-base
                          font-normal
                          text-gray-700
                          bg-white bg-clip-padding bg-no-repeat
                          border border-solid border-gray-300
                          rounded
                          transition
                          ease-in-out
                          m-0
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                            <option >Select Mic</option>
                            {audioInput.map(input => {
                              return (
                                <option defaultValue={selectedAudio === input.deviceId} value={input.deviceId} key={input.deviceId}>{input.label}</option>
                              )
                            })}
                        </select>
                      </div>
                  </div>
                )}
                
                {state === CALL_STATE_JOINED && (
                  <div className='h-48 max-h-full'>
                        <Chat
                        localParticipant={creator}
                        chatHistory={chatHistory} sendMessage={sendMessage}/>
                  </div>
                )}
              </div>
                
             
            </div>
          </div>
          
          

        </div>
  )
}

export async function getStaticProps() {
  const defaultProps = getDemoProps();
  return {
    props: defaultProps,
  };
}
