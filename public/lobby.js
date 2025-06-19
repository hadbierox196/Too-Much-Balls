const socket = io();

socket.on('playerConnected', (playerCount) => {
    if(playerCount >= 1) document.getElementById('p1-status').textContent = 'Connected';
    if(playerCount >= 2) document.getElementById('p2-status').textContent = 'Connected';
});

socket.on('startCountdown', () => {
    const countdownEl = document.getElementById('countdown');
    countdownEl.classList.remove('hidden');
    
    let count = 5;
    const timer = setInterval(() => {
        document.getElementById('timer').textContent = count;
        if(count-- <= 0) {
            clearInterval(timer);
            window.location.href = '/game.html';
        }
    }, 1000);
});
