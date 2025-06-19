import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { initPlayer, updatePlayer } from './player.js';
import { initNetwork } from './network.js';
import { initPhysics } from './physics.js';
import { initCamera } from './camera.js';
import { createField } from './field.js';
import { initUI } from './ui.js';
import { PLAYER_COLORS } from '../shared/constants.js';

let scene, renderer, camera, controls;
let playerId, playerColor;
let gameState = { players: {}, ball: null };

export function initGame() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('game-canvas'),
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(30, 50, 30);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Create soccer field
    createField(scene);
    
    // Initialize systems
    initCamera(scene);
    initPhysics(scene);
    initNetwork();
    initUI();
    
    // Start game loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    // Update player based on input
    updatePlayer();
    
    // Update physics
    // (Physics updates happen on server for multiplayer sync)
    
    renderer.render(scene, camera);
}

// Start the game
initGame();
