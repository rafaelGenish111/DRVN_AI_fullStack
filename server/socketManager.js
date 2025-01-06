module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A client connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('A client disconnected:', socket.id);
        });
    });
};