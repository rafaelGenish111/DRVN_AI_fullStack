import React, { useEffect, useState } from 'react';
import socket from '../services/socket';
import Popup from './Popup';

export default function Home() {
    const [lineData, setLineData] = useState(null);
    const [username, setUsername] = useState(null);
    const [userID, setUserID] = useState(null);

    useEffect(() => {
        socket.on('line_update', (data) => {
            console.log('New line data:', data);
            setLineData(data);
        });
    
        const urlParams = new URLSearchParams(window.location.search);
        setUsername(urlParams.get('username'));
        setUserID(urlParams.get('userid'));

        return () => {
            socket.disconnect();
        }
    }, [userID, username]);
    
    const handleClosePopup = () => {
        setLineData(null);
    }

  return (
      <div>
          <h1>Live Betting Lines</h1> 
          {
                userID ?
                    (<div>
                        <h1>hello {username}</h1>
                        <h3>, ID: {userID}</h3>
                    </div>
                    )
                    :
                    (<h1>Hello guest</h1>)
            }
         {lineData && <Popup lineData={lineData} onClose={handleClosePopup} />}
    </div>
  )
}
