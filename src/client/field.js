import * as THREE from 'three';
import { FIELD_WIDTH, FIELD_HEIGHT } from '../shared/constants.js';

export function createField(scene) {
    // Field surface
    const fieldGeometry = new THREE.PlaneGeometry(FIELD_WIDTH, FIELD_HEIGHT);
    const fieldMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00aa00,
        roughness: 0.8,
        metalness: 0.2
    });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.rotation.x = -Math.PI / 2;
    field.receiveShadow = true;
    scene.add(field);

    // White lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    
    // Center circle
    const circleGeometry = new THREE.CircleGeometry(5, 32);
    circleGeometry.vertices.shift(); // Remove center point
    const circle = new THREE.Line(circleGeometry, lineMaterial);
    circle.rotation.x = -Math.PI / 2;
    scene.add(circle);

    // Goals (MUST BE ADDED TO SCENE)
    const goalGeometry = new THREE.BoxGeometry(10, 2, 2);
    const goalMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    
    const goal1 = new THREE.Mesh(goalGeometry, goalMaterial);
    goal1.position.set(0, 1, -FIELD_HEIGHT/2);
    scene.add(goal1);

    const goal2 = new THREE.Mesh(goalGeometry, goalMaterial);
    goal2.position.set(0, 1, FIELD_HEIGHT/2);
    scene.add(goal2);
}
    
    // Goal D areas
    const dAreaShape = new THREE.Shape();
    dAreaShape.absarc(0, 0, 10, -Math.PI/2, Math.PI/2, false);
    dAreaShape.lineTo(0, 0);
    
    const dAreaGeometry = new THREE.ShapeGeometry(dAreaShape);
    const dArea = new THREE.Mesh(dAreaGeometry, new THREE.MeshPhongMaterial({
        color: 0x00aa00,
        side: THREE.DoubleSide
    }));
    dArea.rotation.x = Math.PI / 2;
    dArea.position.set(0, 0.1, FIELD_HEIGHT/2 - 10);
    scene.add(dArea);
    
    const dArea2 = dArea.clone();
    dArea2.rotation.z = Math.PI;
    dArea2.position.z = -FIELD_HEIGHT/2 + 10;
    scene.add(dArea2);
}
