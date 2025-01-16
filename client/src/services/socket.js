import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
    transports: ['websocket'], // שימוש בפרוטוקול WebSocket בלבד
});







export default socket;