import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { GameLogic } from './gameLogic.js';

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files
app.use(express.static('public'));

// Game and Lobby state
const game = new GameLogic();
const lobby = {
  players: {},
  emitUpdate() {
    io.emit('lobbyUpdate', {
      playerCount: Object.keys(this.players).length,
      playerIds: Object.keys(this.players)
    });
  }
};

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  
  // Add to lobby
  lobby.players[socket.id] = true;
  lobby.emitUpdate();

  // Start game when 2 players join
  if (Object.keys(lobby.players).length >= 2) {
    io.emit('startGame');
    
    // Initialize game with both players
    Object.keys(lobby.players).forEach(id => {
      game.addPlayer(id);
      io.to(id).emit('playerId', id); // Send individual player IDs
    });
    
    lobby.players = {}; // Clear lobby
  }

  // Gameplay events
  socket.on('playerInput', (input) => {
    game.processInput(socket.id, input);
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    
    // Remove from lobby if still there
    if (lobby.players[socket.id]) {
      delete lobby.players[socket.id];
      lobby.emitUpdate();
    }
    
    // Remove from game if playing
    game.removePlayer(socket.id);
  });
});

// Game state updates
setInterval(() => {
  const state = game.update();
  io.emit('gameUpdate', state);
}, 1000/60);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
