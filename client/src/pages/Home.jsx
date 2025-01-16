import React, { useEffect, useState } from 'react';
import socket from '../services/socket';
import Popup from './Popup';

export default function Home() {
    const [lineData, setLineData] = useState(null);
    const [username, setUsername] = useState(null);
    const [userID, setUserID] = useState(null);

    useEffect(() => {
      
    
        socket.on();
        socket.on('connect', () => {
            console.log('Connected to server:', socket.id);
        });
        socket.on('line_update', (data) => {
            console.log('Received line update:', data); 
            setLineData(data);
            console.log('line data client:', lineData);
        });

        const urlParams = new URLSearchParams(window.location.search);
        setUsername(urlParams.get('username') || 'Guest');
        setUserID(urlParams.get('userid') || 'Unknown');

        return () => {
            socket.on('disconnect', () => {
                console.log('Disconnected from server');
            });
        }
    }, [lineData]);
    
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
          {lineData ? (
              <Popup lineData={lineData} onClose={handleClosePopup} />
          ) : (
                  <p>No betting lines available at the moment</p>
          )}
    </div>
  )
}
