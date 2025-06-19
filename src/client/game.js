import * as THREE from 'three';
import { initPlayer } from './player.js';
import { initNetwork } from './network.js';
import { initCamera } from './camera.js';
import { createField } from './field.js';
import { initUI } from './ui.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lighting (CRUCIAL FOR VISIBILITY)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(30, 50, 30);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Initialize systems
createField(scene);  // Must create field first
initCamera(scene);
initPlayer(scene);   // Player depends on scene
initNetwork();
initUI();           // UI controls

// Game loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
