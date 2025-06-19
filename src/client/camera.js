import * as THREE from 'three';
import { playerMesh } from './player.js';

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 15);

export function initCamera(scene) {
    scene.add(camera);
    return camera;
}

export function updateCamera() {
    if (!playerMesh) return;
    
    // Third-person follow with smoothing
    const targetPosition = new THREE.Vector3();
    playerMesh.getWorldPosition(targetPosition);
    
    // Offset behind and above player
    const offset = new THREE.Vector3(0, 3, -7);
    offset.applyQuaternion(playerMesh.quaternion);
    targetPosition.add(offset);
    
    // Smooth camera movement
    camera.position.lerp(targetPosition, 0.1);
    camera.lookAt(playerMesh.position);
}
