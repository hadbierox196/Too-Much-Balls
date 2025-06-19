import { updatePlayer } from './player.js';
import { updateCamera } from './camera.js';
import { gameState } from './game.js';

const socket = io();

export function initNetwork() {
    socket.on('playerId', (id) => {
        gameState.playerId = id;
    });
    
    socket.on('gameUpdate', (state) => {
        gameState.players = state.players;
        gameState.ball = state.ball;
        gameState.scores = state.scores;
    });
    
    return socket;
}

export function sendInput(input) {
    socket.emit('playerInput', input);
}
