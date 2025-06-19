import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { GameLogic } from './gameLogic.js';

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static('public'));

// Game instance
const game = new GameLogic();

io.on('connection', (socket) => {
    // Add player to game
    const player = game.addPlayer(socket.id);
    socket.emit('playerId', socket.id);
    
    // Handle player input
    socket.on('playerInput', (input) => {
        game.processInput(socket.id, input);
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
        game.removePlayer(socket.id);
    });
});

// Game loop
setInterval(() => {
    const state = game.update();
    io.emit('gameUpdate', state);
}, 1000/60);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
