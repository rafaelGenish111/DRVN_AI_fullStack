const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Server } = require('socket.io');
const redisClient = require('./services/redisService');

const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.use(bodyParser.json());
app.use(cors());

io.on('connection', (socket) => {
    console.log('Client connected', socket.id);

    redisClient.subscribe('line_updates', (err, count) => {
        if (err) {
            console.error('Failed to subscribe to Redis channel:', err);
        }
    });
    redisClient.on('message', (channel, message) => {
        if (channel === 'line_updates') {
            socket.emit('line_update', JSON.parse(message));
        }
    });
    socket.on('disconnect', () => {
        console.log('client disconnect:', socket.id);
    });
});

app.use('/api/webhook', require('./routes/webhook'));
app.use('/api/game', require('./routes/game'));
app.use('/api/line', require('./routes/line'));

const port = process.env.PORT || 3001;

server.listen(port, () => {
    console.log(`server running on port ${port}`);
});