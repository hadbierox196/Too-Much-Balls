export function initUI() {
    const joystick = document.getElementById('joystick');
    const handle = document.createElement('div');
    handle.style.width = '40px';
    handle.style.height = '40px';
    handle.style.background = 'rgba(255,255,255,0.5)';
    handle.style.borderRadius = '50%';
    handle.style.position = 'absolute';
    handle.style.top = '40px';
    handle.style.left = '40px';
    joystick.appendChild(handle);
    
    let active = false;
    const center = { x: 60, y: 60 };
    const maxDist = 40;
    
    const inputState = {
        direction: { x: 0, z: 0 },
        sprinting: false,
        action: null
    };
    
    // Touch/mouse events
    const startControl = (e) => {
        active = true;
        updateControl(e);
    };
    
    const endControl = () => {
        active = false;
        handle.style.transform = 'translate(0px, 0px)';
        inputState.direction = { x: 0, z: 0 };
    };
    
    const updateControl = (e) => {
        if (!active) return;
        
        const rect = joystick.getBoundingClientRect();
        const x = e.clientX || e.touches[0].clientX;
        const y = e.clientY || e.touches[0].clientY;
        
        const pos = {
            x: x - rect.left - center.x,
            y: y - rect.top - center.y
        };
        
        // Limit to max distance
        const dist = Math.min(Math.sqrt(pos.x*pos.x + pos.y*pos.y), maxDist);
        const angle = Math.atan2(pos.y, pos.x);
        
        const finalPos = {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist
        };
        
        handle.style.transform = `translate(${finalPos.x}px, ${finalPos.y}px)`;
        
        // Normalize direction
        inputState.direction = {
            x: finalPos.x / maxDist,
            z: -finalPos.y / maxDist // Invert for 3D space
        };
    };
    
    // Event listeners
    joystick.addEventListener('mousedown', startControl);
    joystick.addEventListener('touchstart', startControl);
    
    window.addEventListener('mousemove', updateControl);
    window.addEventListener('touchmove', updateControl);
    
    window.addEventListener('mouseup', endControl);
    window.addEventListener('touchend', endControl);
    
    // Action buttons
    document.getElementById('sprint-btn').addEventListener('touchstart', () => {
        inputState.sprinting = true;
    });
    
    document.getElementById('sprint-btn').addEventListener('touchend', () => {
        inputState.sprinting = false;
    });
    
    document.getElementById('shoot-btn').addEventListener('touchstart', () => {
        inputState.action = 'shoot';
        setTimeout(() => inputState.action = null, 100);
    });
    
    document.getElementById('pass-btn').addEventListener('touchstart', () => {
        inputState.action = 'pass';
        setTimeout(() => inputState.action = null, 100);
    });
    
    // Send input to server
    setInterval(() => {
        sendInput(inputState);
    }, 1000/60);
}
