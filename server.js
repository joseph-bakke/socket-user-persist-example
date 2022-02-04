const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cache = require('memory-cache');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(socket.handshake.auth);
    const { sessionId, user } = socket.handshake.auth;
    
    if (sessionId && user) {
        console.log('got a new user, setting in session cache');
        cache.put(sessionId, user);
    } else if (sessionId) {
        console.log('got a sessionId, returning user');
        const user = cache.get(sessionId);
        console.log(user);
        socket.emit('user_found', user);
    }
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
