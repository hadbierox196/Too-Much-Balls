document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const playerStatus = {
    p1: document.getElementById('p1-status'),
    p2: document.getElementById('p2-status')
  };
  const countdownEl = document.getElementById('countdown');

  // Connection established
  socket.on('connect', () => {
    console.log('Connected to lobby with ID:', socket.id);
  });

  // Lobby updates
  socket.on('lobbyUpdate', (data) => {
    console.log('Lobby state:', data);
    
    playerStatus.p1.textContent = data.playerCount >= 1 ? 'Connected ✔️' : 'Waiting...';
    playerStatus.p2.textContent = data.playerCount >= 2 ? 'Connected ✔️' : 'Waiting...';
    
    playerStatus.p1.className = data.playerCount >= 1 ? 'connected' : '';
    playerStatus.p2.className = data.playerCount >= 2 ? 'connected' : '';
  });

  // Game start sequence
  socket.on('startGame', () => {
    console.log('Game starting!');
    
    countdownEl.classList.remove('hidden');
    let count = 3;
    
    const timer = setInterval(() => {
      document.getElementById('timer').textContent = count;
      
      if (count <= 0) {
        clearInterval(timer);
        window.location.href = '/game.html';
      }
      count--;
    }, 1000);
  });

  // Error handling
  socket.on('connect_error', (err) => {
    console.error('Connection error:', err);
    playerStatus.p1.textContent = 'Connection failed';
    playerStatus.p2.textContent = 'Connection failed';
  });

  // Reconnect logic
  socket.io.on('reconnect_attempt', () => {
    console.log('Attempting to reconnect...');
  });
});
