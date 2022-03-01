import { useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import classNames from 'classnames';
import Video from "./video";
import { DEFAULT_ASPECT_RATIO } from "../../../constants";

const VideoTile = ({participant, update, mirrored = true, videoToggle, audioToggle, toggleScreenShare}) => {
    const videoRef = useRef(null);
    const videoFit = 'contain';
    const aspectRatio =  DEFAULT_ASPECT_RATIO;
    const [videoTrack, setVideoTrack] = useState(null)
    // useEffect(() => {
    //   console.log("track", participant.videoTrack, videoTrack)
    //   if(participant.videoTrack) {
    //     setVideoTrack(videoTrack)
    //   }
    // }, [participant.videoTrack,videoTrack, update])

    const cx = classNames('tile', videoFit, {
        mirrored,
        avatar:  !participant?.video?.persistentTrack,
        screenShare: participant.isScreenShare,
        active: participant.isActiveSpeaker,
      });

    return (
        <div className={cx}>
            <div className="content">
                <div className="name">
                    {participant.user_name}
                    {participant.local ? (
                      <>
                          <button
                          onClick={audioToggle}
                        className="bg-white hover:bg-grey text-grey-darkest font-bold py-2 px-2 rounded-full inline-flex items-center">
                          {participant.audio ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15C9.2 15 7 12.8 7 10V6C7 3.2 9.2 1 12 1C14.8 1 17 3.2 17 6V10C17 12.8 14.8 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 10C21 15 17 19 12 19C7 19 3 15 3 10" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 23H17" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 19V23" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.00024 10V6C6.9937 5.34157 7.11855 4.68845 7.36751 4.07886C7.61646 3.46928 7.98451 2.91547 8.45011 2.44987C8.91572 1.98427 9.46952 1.61622 10.0791 1.36726C10.6887 1.11831 11.3418 0.993451 12.0002 1V1C12.6587 0.993451 13.3118 1.11831 13.9214 1.36726C14.531 1.61622 15.0848 1.98427 15.5504 2.44987C16.016 2.91547 16.384 3.46928 16.633 4.07886C16.8819 4.68845 17.0068 5.34157 17.0002 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 23H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 19V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M17.0001 7V6C17.0001 4.67392 16.4733 3.40215 15.5356 2.46447C14.598 1.52678 13.3262 1 12.0001 1C10.674 1 9.40225 1.52678 8.46457 2.46447C7.52689 3.40215 7.0001 4.67392 7.0001 6V10C6.99432 10.9 7.23494 11.7843 7.6959 12.5573C8.15686 13.3303 8.82056 13.9623 9.6151 14.385" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13.4839 14.758C14.258 14.526 14.9624 14.1054 15.5338 13.5339C16.1052 12.9625 16.5258 12.2581 16.7579 11.484" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3.00005 10C2.99536 11.4223 3.32952 12.8254 3.97485 14.0929C4.62018 15.3604 5.55813 16.456 6.71105 17.289" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9.57715 18.665C10.366 18.8855 11.1811 18.9982 12.0001 19C13.1834 19.0049 14.3559 18.7754 15.4501 18.3249C16.5442 17.8743 17.5383 17.2116 18.375 16.3749C19.2117 15.5382 19.8745 14.5441 20.325 13.4499C20.7756 12.3558 21.005 11.1833 21.0001 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 21L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) }
                          
                        </button>
                          <button
                            onClick={videoToggle}
                          className="bg-white hover:bg-grey text-grey-darkest font-bold py-2 px-2 rounded-full inline-flex items-center">
                            {participant.video ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M16 10L23 7V17L16 14" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M14 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H14C15.1046 20 16 19.1046 16 18V6C16 4.89543 15.1046 4 14 4Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M16 8V6C16 5.46957 15.7893 4.96086 15.4142 4.58579C15.0391 4.21071 14.5304 4 14 4H3C2.46957 4 1.96086 4.21071 1.58579 4.58579C1.21071 4.96086 1 5.46957 1 6V18C1 18.5304 1.21071 19.0391 1.58579 19.4142C1.96086 19.7893 2.46957 20 3 20H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8.24219 20H14.0002C14.5306 20 15.0393 19.7893 15.4144 19.4142C15.7895 19.0391 16.0002 18.5304 16.0002 18V15L23.0002 17V7L20.5392 7.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M22 2L2 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            ) }
                          </button>
                          <button
                          onClick={toggleScreenShare}
                          className="bg-white hover:bg-grey text-grey-darkest font-bold py-2 px-2 rounded-full inline-flex items-center">
                              S
                          </button>
                      </>
                    ) : null}
                    {!participant.local && !participant.audio && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.00024 10V6C6.9937 5.34157 7.11855 4.68845 7.36751 4.07886C7.61646 3.46928 7.98451 2.91547 8.45011 2.44987C8.91572 1.98427 9.46952 1.61622 10.0791 1.36726C10.6887 1.11831 11.3418 0.993451 12.0002 1V1C12.6587 0.993451 13.3118 1.11831 13.9214 1.36726C14.531 1.61622 15.0848 1.98427 15.5504 2.44987C16.016 2.91547 16.384 3.46928 16.633 4.07886C16.8819 4.68845 17.0068 5.34157 17.0002 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 23H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 19V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17.0001 7V6C17.0001 4.67392 16.4733 3.40215 15.5356 2.46447C14.598 1.52678 13.3262 1 12.0001 1C10.674 1 9.40225 1.52678 8.46457 2.46447C7.52689 3.40215 7.0001 4.67392 7.0001 6V10C6.99432 10.9 7.23494 11.7843 7.6959 12.5573C8.15686 13.3303 8.82056 13.9623 9.6151 14.385" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M13.4839 14.758C14.258 14.526 14.9624 14.1054 15.5338 13.5339C16.1052 12.9625 16.5258 12.2581 16.7579 11.484" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3.00005 10C2.99536 11.4223 3.32952 12.8254 3.97485 14.0929C4.62018 15.3604 5.55813 16.456 6.71105 17.289" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.57715 18.665C10.366 18.8855 11.1811 18.9982 12.0001 19C13.1834 19.0049 14.3559 18.7754 15.4501 18.3249C16.5442 17.8743 17.5383 17.2116 18.375 16.3749C19.2117 15.5382 19.8745 14.5441 20.325 13.4499C20.7756 12.3558 21.005 11.1833 21.0001 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 21L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                </div>
                {
                  participant.video ? (
                    <Video 
                    participantId={participant?.user_id}
                    videoTrack={participant.videoTrack}
                    audioTrack={participant.audioTrack}
                    update={update}
                    local={participant.local}
                    refElement={videoRef}
                />
                  ) : (
                    <div className="avatar">
                      <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0)">
                        <path d="M16.75 32.5C12.5188 32.6114 8.30606 31.9031 4.344 30.414C4.16718 30.3354 4.01695 30.2073 3.91151 30.0451C3.80608 29.8828 3.74998 29.6935 3.75 29.5C3.75291 26.8487 4.80742 24.3069 6.68215 22.4321C8.55688 20.5574 11.0987 19.5029 13.75 19.5H19.75C22.4013 19.5029 24.9431 20.5574 26.8179 22.4321C28.6926 24.3069 29.7471 26.8487 29.75 29.5C29.75 29.6935 29.6939 29.8828 29.5885 30.0451C29.4831 30.2073 29.3328 30.3354 29.156 30.414C25.1939 31.9031 20.9812 32.6114 16.75 32.5Z" fill="currentColor"/>
                        <path d="M16.75 17.5C12.171 17.5 8.75 12.749 8.75 8.5C8.75 6.37827 9.59285 4.34344 11.0931 2.84315C12.5934 1.34285 14.6283 0.5 16.75 0.5C18.8717 0.5 20.9066 1.34285 22.4069 2.84315C23.9071 4.34344 24.75 6.37827 24.75 8.5C24.75 12.749 21.329 17.5 16.75 17.5Z" fill="currentColor"/>
                        </g>
                        <defs>
                        <clipPath id="clip0">
                        <rect width="32" height="32" fill="white" transform="translate(0.75 0.5)"/>
                        </clipPath>
                        </defs>
                        </svg>

                    </div>
                  )
                }
                
                
            </div>
            <style jsx>{`
          .tile .content {
            padding-bottom: ${100 / aspectRatio}%;
          }
        `}</style>
        <style jsx>{`
          .tile {
            background: var(--blue-dark);
            min-width: 1px;
            overflow: hidden;
            position: relative;
            width: 100%;
            box-sizing: border-box;
          }

          .tile.active:before {
            content: '';
            position: absolute;
            top: 0px;
            right: 0px;
            left: 0px;
            bottom: 0px;
            border: 2px solid var(--primary-default);
            box-sizing: border-box;
            pointer-events: none;
            z-index: 2;
          }

          .tile .name {
            position: absolute;
            bottom: 0px;
            display: flex;
            align-items: center;
            left: 0px;
            z-index: 2;
            line-height: 1;
            font-size: 0.875rem;
            color: white;
            font-weight: var(--weight-medium);
            padding: var(--spacing-xxs);
            text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.45);
            gap: var(--spacing-xxs);
          }

          .tile .name :global(svg) {
            color: var(--red-default);
          }

          .tile.small .name {
            font-size: 12px;
          }

          .tile :global(video) {
            height: calc(100% + 4px);
            left: -2px;
            object-position: center;
            position: absolute;
            top: -2px;
            width: calc(100% + 4px);
            z-index: 1;
          }

          .tile.contain :global(video) {
            object-fit: contain;
          }

          .tile.cover :global(video) {
            object-fit: cover;
          }

          .tile.mirrored :global(video) {
            transform: scale(-1, 1);
          }

          .tile .avatar {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
        </div>
    )
}
export default VideoTile;