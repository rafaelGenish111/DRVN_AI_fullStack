import React, { useEffect, useState } from 'react';
import socket from '../services/socket';
import Popup from './Popup';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useDesign } from '../context/DesignContext';
import { Button } from '@mui/material';
import axios from 'axios';

export default function Home({operatorId: propOperatorId}) {
    const { design, updateDesign } = useDesign();
    console.log('Current design:', design);

    const [lineData, setLineData] = useState(null);
    const [walletId, setWalletId] = useState(null);
    const [userID, setUserID] = useState(null);

    useEffect(() => {
        const fetchDesign = async () => {
            const operatorId = propOperatorId;
            if (!operatorId) return;

            try {
                const response = await axios.get(`http://localhost:3001/api/operators/${operatorId}/design-configuration`);
                const designConfig = response.data.designConfig;
                if (designConfig) {
                    updateDesign({
                        primaryColor: designConfig.color,
                        font: designConfig.font,
                        icon: designConfig.icon,
                        fontSize: designConfig.fontSize,
                    });
                }
            } catch (error) {
                console.error('Error fetching design configuration:', error);
            }
        };

        fetchDesign();
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server:', socket.id);
        });

        socket.on('line_update', (data) => {
            console.log('Received line update:', data);
            setLineData(data);
        });

        const urlParams = new URLSearchParams(window.location.search);
        const walletId = urlParams.get('walletId');
        const userId = urlParams.get('userid');

        setWalletId(walletId);
        setUserID(userId);

        const userData = { walletId, userId };
        socket.emit('user_data', userData);
        console.log(`User data sent via socket:`, userData);

        return () => {
            socket.off('line_update');
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    const handleClosePopup = () => {
        setLineData(null);
    };

    return (
        <div
            className="home-page"
            style={{
                fontFamily: design.font || 'Roboto, sans-serif',
            }}
        >
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" style={{ backgroundColor: design.primaryColor }}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            style={{ color: design.primaryColor }}
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <img src="/img/logo.png" alt="" width="150px" />
                        </Typography>
                        <Typography>
                            {userID ? (
                                <div>
                                    <h3>Wallet ID: {walletId}</h3>
                                    <h3>ID: {userID}</h3>
                                </div>
                            ) : (
                                <h1>Guest</h1>
                            )}
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
}