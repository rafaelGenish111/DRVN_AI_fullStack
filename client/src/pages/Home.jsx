import React, { useEffect, useState } from 'react';
import socket from '../services/socket';
import Popup from './Popup';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';


export default function Home() {
    const [lineData, setLineData] = useState(null);
    const [walletId, setwalletId] = useState(null);
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
        setwalletId(urlParams.get('walletId'));
        setUserID(urlParams.get('userid'));

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
        <div className='home-page'>
            <Box sx={{ flexGrow: 1}}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="#2fa362"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <img src="/img/logo.png" alt="" width='150px' />
                        </Typography>
                        <Typography>
                            {
                                userID ?
                                    (<div>
                                        <h3>Wallet ID: {walletId}</h3>
                                        <h3>ID: {userID}</h3>
                                    </div>
                                    )
                                    :
                                    (<h1>Guest</h1>)
                            }

                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box>
                    <div>
                        {lineData ? (
                            <Popup lineData={lineData} onClose={handleClosePopup} />
                        ) : (
                            <p>No betting lines available at the moment</p>
                        )}
                    </div>
                </Box>
            </Box>
        </div>
    );
};
