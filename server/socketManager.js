module.exports = (io) => {
    console.log('Socket.IO initialized'); // לוג נוסף
    io.on('connection', (socket) => {
        console.log('A client connected:', socket.id);

        // const lineData = {
        //     id: '123',
        //     name: 'Example Line',
        //     odds: [1.5, 2.3],
        //     type: 'goal_kick',
        // };
        
        // socket.emit('line_update', lineData);

        socket.on('disconnect', () => {
            console.log('A client disconnected:', socket.id);
        });
    });
};