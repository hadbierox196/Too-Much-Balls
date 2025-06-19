import * as THREE from 'three';
import { playerMesh } from './player.js';

export let camera;

export function initCamera(scene) {
    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.set(0, 15, 20);
    camera.lookAt(0, 0, 0);
    scene.add(camera);
    return camera;
}

export function updateCamera() {
    if (!playerMesh) return;
    
    // Third-person follow
    const targetPosition = playerMesh.position.clone();
    targetPosition.y += 5;
    targetPosition.z += 10;
    
    camera.position.lerp(targetPosition, 0.1);
    camera.lookAt(playerMesh.position);
}
    // Offset behind and above player
    const offset = new THREE.Vector3(0, 3, -7);
    offset.applyQuaternion(playerMesh.quaternion);
    targetPosition.add(offset);
    
    // Smooth camera movement
    camera.position.lerp(targetPosition, 0.1);
    camera.lookAt(playerMesh.position);
}
