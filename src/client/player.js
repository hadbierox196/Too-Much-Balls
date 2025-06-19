import * as THREE from 'three';
import { PLAYER_RADIUS } from '../shared/constants.js';

export let playerMesh;
export let playerId;

export function initPlayer(scene, id, color) {
    playerId = id;
    
    // Create player ball
    const geometry = new THREE.SphereGeometry(PLAYER_RADIUS, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color });
    playerMesh = new THREE.Mesh(geometry, material);
    playerMesh.castShadow = true;
    scene.add(playerMesh);
    
    return playerMesh;
}

export function updatePlayer(input) {
    if (!playerMesh) return;
    
    // Apply movement based on input
    // (Actual movement is handled server-side, this is for prediction)
    if (input) {
        const speed = input.sprinting ? 
            PLAYER_SPEED * SPRINT_MULTIPLIER : 
            PLAYER_SPEED;
        
        playerMesh.position.x += input.direction.x * speed * 0.016;
        playerMesh.position.z += input.direction.z * speed * 0.016;
    }
}
