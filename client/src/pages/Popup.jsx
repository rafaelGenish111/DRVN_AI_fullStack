import React, { useEffect, useState } from 'react';
import socket from '../services/socket';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Grid2,
    Box

} from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import Alert from '@mui/material/Alert';


export default function Popup({ lineData, onClose }) {
    const totalTime = 60;
    const [timeLeft, setTimeLeft] = useState(totalTime);
    // const [progress, setProgress] = useState(100);
    const [color, setColor] = useState('green');
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null)

    const changeColor = (progress) => {
        if (progress < 10) {
            setColor('red')
        } else if (progress < 40) {
            setColor('yellow')
        } else {
            setColor('green')
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                const newTimeLeft = prev - 0.1;
                const progress = (newTimeLeft / totalTime) * 100;
                changeColor(progress);
                if (newTimeLeft <= 0) {
                    clearInterval(timer);
                    onClose();
                    return 0;
                }
                return newTimeLeft;
            });
        }, 100);

        return () => {
            clearInterval(timer);
        }
    }, [onClose]);

    if (!lineData ||
        typeof lineData !== 'object' ||
        !lineData.amount ||
        !lineData.options) {
        console.error('invalid line data:', lineData);
        return <div>Error: Invalid data</div>
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const bet = {
            userId: 1,
            lineId: lineData.id,
            amount: selectedAmount,
            selectedOption: selectedOption,
            timestamp: new Date()
        }
        if (!selectedAmount || !selectedOption) {

            setAlertMessage('Choose option and amount')
            return console.error('choose option and amount')

        }
        socket.emit('player_bet', bet)
        console.log('Bet sended successfully', bet);

        onClose()
    }
    const progress = (timeLeft / totalTime) * 100;

    return (
        <Dialog
            open={true}
            onClose={(event, reson) => {
                if (reson !== 'backdropClick') {
                    onClose()
                }
            }}
            maxWidth='sm'
            fullWidth
            disableEscapeKeyDown
        >
            <DialogTitle
                sx={{
                    backgroundColor: 'green',
                    color: 'white',
                    height: '15%'
                }}
            >
                <Typography variant='h6'>New Bet Available</Typography>
            </DialogTitle>
            <DialogTitle>
                <DialogActions>
                </DialogActions>
                {alertMessage && (
                    <Alert severity='error' onClose={() => setAlertMessage(null)}>
                        {alertMessage}
                    </Alert>
                )}
                <Typography variant='subtitle2' color='textSecondary'>

                    <Box
                        sx={{
                            width: '100%',
                            height: '30px',
                            backgroundColor: '#e0e0e0',
                            borderRadius: '5px',
                            overflow: 'hidden',
                            marginTop: '10px',
                        }}
                    >
                        <Box
                            sx={{
                                width: `${progress}%`,
                                height: '100%',
                                backgroundColor: color,
                                transition: 'width 0.1s linear, background-color 0.3s ease-in-out',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >

                            <TimerIcon /> {formatTime(timeLeft)}
                        </Box>
                    </Box>
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ my: 2 }}>
                    <Typography variant='body1' gutterBottom>
                        {lineData.line_question} from {lineData.line_type_name}
                    </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Grid2 container spacing={2}
                        sx={12}
                    >
                        {lineData.options.map((option, index) => {
                                const label = index === 0 ? 'Yes' : 'No';
                                return (
                                    <Grid2 item xs={12} key={option} sx={{ width: '100%' }}>
                                        <Button
                                            variant={'contained'}
                                            color={index === 0 ? 'primary' : 'secondary'}
                                            onClick={() => setSelectedOption(option)}
                                            sx={{
                                                width: '100%',
                                                color: 'white',
                                                boxShadow: selectedOption === option ? '0px 0px 10px 2px rgba(0,0,0,0.5)' : 'none',
                                                border: selectedOption === option ? '1px solid #45A049' : 'none',
                                                transition: 'all 0.3s ease-in-out',
                                                '&:hover': {
                                                    backgroundColor: index === 0 ? '#45A049' : '#E64A19',
                                                },
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <span>{label}</span>
                                            <span>{option}</span>
                                        </Button>
                                    </Grid2>
                                )
                            })}
                    </Grid2>
                </Box>
            </DialogContent>
            <DialogContent>

                <Box sx={{ mb: 3 }}>
                    <Grid2 container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
                        {lineData.amount
                            .map((amount) => (
                                <Grid2 item key={amount} sx={{ flexGrow: 1 }}>
                                    <Button
                                        variant={selectedAmount === amount ? 'contained' : 'outlined'}
                                        color='primary'
                                        onClick={() => setSelectedAmount(amount)}
                                        sx={{
                                            width: '100%',
                                            color: selectedAmount === amount ? 'white' : 'primary.main',
                                            borderColor: 'primary.main',
                                            '&:hover': {
                                                backgroundColor: selectedAmount === amount ? 'primary.main' : 'rgba(0, 0, 255, 0.1)',
                                                color: 'white',
                                            },
                                            transition: 'all 0.3s ease-in-out',
                                        }}
                                    >
                                        {amount}$
                                    </Button>
                                </Grid2>
                            ))}
                    </Grid2>
                </Box>
            </DialogContent>


            <DialogActions>
                <Button onClick={handleSubmit}
                    color='primary'
                    variant='contained'
                    sx={{
                        backgroundColor: '#77B254',
                        width: '100%',
                        justifyContent: 'center',
                        color: 'white'
                    }}
                >
                    PLACE BET {selectedAmount}$
                </Button>
            </DialogActions>
        </Dialog>
    )
}
