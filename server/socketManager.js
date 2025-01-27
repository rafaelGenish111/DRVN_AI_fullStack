const redisClient = require('./services/redisService');

module.exports = (io) => {
    console.log('Socket.IO initialized'); 
    io.on('connection', (socket) => {
        console.log('A client connected:', socket.id);

        socket.on('user_data', async (data) => {
            try {
                const { walletId, userId } = data;
                if (!walletId || !userId) {
                    console.error('Invalid user data recived:', data);
                    return;
                }

                const key = `user:${userId}`;
                await redisClient.hSet(key, {
                    walletId,
                    socketId: socket.id
                });
                console.log(`User data saved for ${userId}:`, data);
            } catch (error) {
                console.error('Error saving user data to Redis:', error.message);
            }
        })

        socket.on('disconnect', () => {
            console.log('A client disconnected:', socket.id);
        });
    });
};