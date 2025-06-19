import * as CANNON from 'cannon-es';
import { 
    PLAYER_RADIUS, 
    BALL_RADIUS, 
    PLAYER_MASS, 
    BALL_MASS, 
    GRAVITY,
    FIELD_WIDTH,
    FIELD_HEIGHT,
    GOAL_WIDTH,
    GOAL_DEPTH
} from '../shared/constants.js';

export class PhysicsWorld {
    constructor() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, GRAVITY, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;
        
        // Materials
        this.ballMaterial = new CANNON.Material('ball');
        this.playerMaterial = new CANNON.Material('player');
        this.groundMaterial = new CANNON.Material('ground');
        
        // Contact materials
        this.world.addContactMaterial(
            new CANNON.ContactMaterial(
                this.ballMaterial,
                this.playerMaterial,
                { friction: 0.1, restitution: 0.7 }
            )
        );
        
        this.world.addContactMaterial(
            new CANNON.ContactMaterial(
                this.ballMaterial,
                this.groundMaterial,
                { friction: 0.3, restitution: 0.5 }
            )
        );
        
        // Create ground
        this.createField();
    }
    
    createField() {
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({ mass: 0 });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(1, 0, 0), -Math.PI/2
        );
        groundBody.material = this.groundMaterial;
        this.world.addBody(groundBody);
        
        // Field boundaries
        const wallProps = [
            { pos: [0, 1, FIELD_HEIGHT/2], size: [FIELD_WIDTH, 2, 1] }, // North
            { pos: [0, 1, -FIELD_HEIGHT/2], size: [FIELD_WIDTH, 2, 1] }, // South
            { pos: [FIELD_WIDTH/2, 1, 0], size: [1, 2, FIELD_HEIGHT] },  // East
            { pos: [-FIELD_WIDTH/2, 1, 0], size: [1, 2, FIELD_HEIGHT] }   // West
        ];
        
        wallProps.forEach(props => {
            const wallShape = new CANNON.Box(
                new CANNON.Vec3(...props.size)
            );
            const wallBody = new CANNON.Body({ mass: 0 });
            wallBody.addShape(wallShape);
            wallBody.position.set(...props.pos);
            this.world.addBody(wallBody);
        });
    }
    
    createPlayerBody(position) {
        const shape = new CANNON.Sphere(PLAYER_RADIUS);
        const body = new CANNON.Body({
            mass: PLAYER_MASS,
            material: this.playerMaterial
        });
        body.addShape(shape);
        body.position.copy(position);
        body.linearDamping = 0.9;
        body.angularDamping = 0.9;
        this.world.addBody(body);
        return body;
    }
    
    createBallBody(position) {
        const shape = new CANNON.Sphere(BALL_RADIUS);
        const body = new CANNON.Body({
            mass: BALL_MASS,
            material: this.ballMaterial
        });
        body.addShape(shape);
        body.position.copy(position);
        body.linearDamping = 0.4;
        body.angularDamping = 0.4;
        this.world.addBody(body);
        return body;
    }
    
    applyImpulse(body, direction, force) {
        const impulse = new CANNON.Vec3(
            direction.x * force,
            direction.y * force,
            direction.z * force
        );
        body.applyImpulse(impulse, body.position);
    }
    
    update(deltaTime) {
        this.world.step(deltaTime);
    }
}
