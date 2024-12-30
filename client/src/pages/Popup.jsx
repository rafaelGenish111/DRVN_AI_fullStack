import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Grid2,
    Box,
} from '@mui/material';

export default function Popup({ lineData, onClose }) {
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
        }
    }, [onClose]);

    return (
        <Dialog open={true} onClose={onClose} maxWidth='sm' fullWidth>
            <DialogTitle>
                <Typography variant='h6'>New Bet Available</Typography>
                <Typography variant='subtitle2' color='textSecondary'>
                    Time Left: {timeLeft} seconds
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ my: 2 }}>
                    <Typography variant='body1' gutterBottom>
                        Line ID: {lineData.line_id}
                    </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                    <Typography variant='h6'>Select Bet Amount:</Typography>
                    <Grid2 container spacing={2}>
                        {lineData.betAmount.map((amount) => (
                            <Grid2 item key={amount}>
                                <Button
                                    variant='outlined'
                                    onClick={() => console.log(`Selected Amount: ${amount}`)}
                                >
                                    {amount}$
                                </Button>
                            </Grid2>
                        ))}
                    </Grid2>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant='h6'>Choose Your Option:</Typography>
                    <Grid2 container spacing={2}>
                        {lineData.options.map((option) => (
                            <Grid2 item key={option}>
                                <Button
                                    variant='outlined'
                                    onClick={() => console.log(`Selected option: ${option}`)}
                                >
                                    {option}
                                </Button>
                            </Grid2>
                        ))}
                    </Grid2>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color='error' variant='outlined'>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}
