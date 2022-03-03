import { useState } from "react";
import PropTypes from 'prop-types';

export const CreateRoom = ({onCreated, onRoomToken, daily, state, handleLeave}) => {
    const [name, setName] = useState();
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState(false);

    const handleDisplayName = (name) => {
      setName(name);
    }

    const handleRoomCreate = async() => {
        setError(false);
        setFetching(true);
  
        console.log(`🚪 Creating new demo room...`);
  
        // Create a room server side (using Next JS serverless)
        const res = await fetch('/api/createRoom', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const resJson = await res.json();
        console.log("create room response", resJson)
        onCreated(resJson)
        if (resJson.name) {
          setFetching(false);
         // setRoom(resJson.name);
          return;
        }
  
        setError(resJson.error || 'An unknown error occured');
        setFetching(false);
    }
    const handleWatchNow = () => {
      onRoomToken(name, false)
    }

    return (
        <div>
             
              <div className="flex flex-wrap  mb-2">
              {/* <div className="w-full md:w-1/6 px-2 mb-2 md:mb-0">
                <button 
                  onClick={handleRoomCreate}
                  className="bg-blue-500 mt-2 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded"
                >
                    Go Live 
                </button>
              </div> */}
              {/* <div className="w-full md:w-1/5 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="roomID">
                  Room ID
                </label>
                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="roomID"
                  type="text"
                  onChange={(event) =>handleRoomIdChange(event.target.value)}
                  placeholder="textdemo" />
              </div> */}
              <div className="w-full md:w-4/6 flex px-3 mb-6 md:mb-0">
                {
                  state === 'joined' ? (
                    
                  <button 
                    className="bg-red-600 mt-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleLeave}>
                      Leave
                  </button>) : (
                  <><div className="w-full md:w-4/6  px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="roomID">
                    Display Name
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="roomID"
                    type="text"
                    onChange={(event) =>handleDisplayName(event.target.value)}
                    placeholder="Enter display Name" />
                </div>
                <button 
                    className="bg-blue-500 mt-2 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                    onClick={() => handleWatchNow()}>
                      Join Now
                  </button> </>)
                }
                
              </div>
        </div>
            {/* <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">Room ID</label> */}
            {/* <div className="mt-1 relative rounded-md shadow-sm"> */}
               
                {/* <input type="text" name="roomId" id="roomId"
                    value={room}
                    onChange={(event)=>handleRoomIdChange(event.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                     placeholder="demoroom" />

                <button onClick={handleRoomCreate}>Create</button> */}
            {/* </div> */}
        </div>
      );

}
CreateRoom.propTypes = {
    onCreated: PropTypes.func.isRequired,
};
export default CreateRoom