const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Server } = require('socket.io');
const redisClient = require('./services/redisService');
const webhookRoutes = require('./routes/webhookRoutes');
const userRoutes = require('./routes/userRoutes');
const configRoutes = require('./routes/configRoutes');
const socketManager = require('./socketManager');

const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    },
    pingTimeout: 60000, 
    pingInterval: 25000
})
socketManager(io);

app.use(bodyParser.json());
app.use(cors());

app.use('/webhook', webhookRoutes(redisClient, io));
app.use('/users', userRoutes(redisClient));
app.use('/api/config', configRoutes)

const port = process.env.PORT || 3001;

server.listen(port, () => {
    console.log(`server running on port ${port}`);
});