import { PhysicsWorld } from './collision.js';
import { 
    PLAYER_RADIUS, 
    PLAYER_COLORS,
    FIELD_WIDTH,
    FIELD_HEIGHT,
    GOAL_WIDTH,
    PLAYER_SPEED,
    SPRINT_MULTIPLIER,
    SHOOT_FORCE,
    PASS_FORCE
} from '../shared/constants.js';

export class GameLogic {
    constructor() {
        this.players = {};
        this.ball = null;
        this.physics = new PhysicsWorld();
        this.lastUpdate = Date.now();
        
        // Create soccer ball
        this.ball = {
            body: this.physics.createBallBody(new CANNON.Vec3(0, 1, 0))
        };
        
        // Game state
        this.scores = [0, 0];
        
        // Start game loop
        setInterval(() => this.update(), 1000/60);
    }
    
    addPlayer(playerId) {
        const spawnPosition = new CANNON.Vec3(
            playerId % 2 === 0 ? -FIELD_WIDTH/4 : FIELD_WIDTH/4,
            PLAYER_RADIUS,
            0
        );
        
        this.players[playerId] = {
            id: playerId,
            body: this.physics.createPlayerBody(spawnPosition),
            color: PLAYER_COLORS[Object.keys(this.players).length % PLAYER_COLORS.length],
            input: { x: 0, z: 0 },
            sprinting: false
        };
        
        return this.players[playerId];
    }
    
    removePlayer(playerId) {
        this.physics.world.removeBody(this.players[playerId].body);
        delete this.players[playerId];
    }
    
    processInput(playerId, input) {
        if (!this.players[playerId]) return;
        
        const player = this.players[playerId];
        player.input = input.direction || { x: 0, z: 0 };
        player.sprinting = input.sprinting || false;
        
        // Handle ball interaction
        if (input.action) {
            const ballPos = this.ball.body.position;
            const playerPos = player.body.position;
            
            // Check if player is near the ball
            const distance = Math.sqrt(
                Math.pow(ballPos.x - playerPos.x, 2) +
                Math.pow(ballPos.z - playerPos.z, 2)
            );
            
            if (distance < PLAYER_RADIUS + BALL_RADIUS + 1) {
                const force = input.action === 'shoot' ? SHOOT_FORCE : PASS_FORCE;
                const direction = new CANNON.Vec3(
                    ballPos.x - playerPos.x,
                    0.5, // Add upward force
                    ballPos.z - playerPos.z
                ).normalize();
                
                this.physics.applyImpulse(this.ball.body, direction, force);
            }
        }
    }
    
    update() {
        const now = Date.now();
        const deltaTime = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        
        // Update physics
        this.physics.update(deltaTime);
        
        // Update player positions based on input
        Object.values(this.players).forEach(player => {
            const speed = player.sprinting ? 
                PLAYER_SPEED * SPRINT_MULTIPLIER : 
                PLAYER_SPEED;
            
            player.body.velocity.x = player.input.x * speed;
            player.body.velocity.z = player.input.z * speed;
        });
        
        // Check for goals
        this.checkGoals();
        
        // Return game state
        return this.getState();
    }
    
    checkGoals() {
        const ballPos = this.ball.body.position;
        
        // Goal detection
        if (Math.abs(ballPos.z) > FIELD_HEIGHT/2) {
            const isPlayer1Goal = ballPos.z > 0;
            
            // Check if ball is within goal width
            if (Math.abs(ballPos.x) < GOAL_WIDTH/2) {
                // Update score
                if (isPlayer1Goal) this.scores[0]++;
                else this.scores[1]++;
                
                // Reset ball
                this.ball.body.position.set(0, 1, 0);
                this.ball.body.velocity.set(0, 0, 0);
                this.ball.body.angularVelocity.set(0, 0, 0);
            }
        }
    }
    
    getState() {
        const players = {};
        
        Object.entries(this.players).forEach(([id, player]) => {
            players[id] = {
                position: { 
                    x: player.body.position.x, 
                    y: player.body.position.y, 
                    z: player.body.position.z 
                },
                rotation: {
                    x: player.body.quaternion.x,
                    y: player.body.quaternion.y,
                    z: player.body.quaternion.z,
                    w: player.body.quaternion.w
                },
                color: player.color
            };
        });
        
        return {
            players,
            ball: {
                position: { 
                    x: this.ball.body.position.x, 
                    y: this.ball.body.position.y, 
                    z: this.ball.body.position.z 
                },
                rotation: {
                    x: this.ball.body.quaternion.x,
                    y: this.ball.body.quaternion.y,
                    z: this.ball.body.quaternion.z,
                    w: this.ball.body.quaternion.w
                }
            },
            scores: [...this.scores]
        };
    }
}
