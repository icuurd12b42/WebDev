//01-towardsMouse.js
//this shows a simple move towards mouse code
//Class: Ship, a class derived from Entity, representing a ship in the 2d top down game
//
//Example: 
// var ship = world.addEntity(new Ship())

class Ship extends Entity 
{
    constructor() 
    {
        super();
        //this.pos = new Vector2D(0, 0);
        this.vel = new Vector2D(0, 0);
        this.setShape(rotateShape(degToRad(90), scaleShape(10,[[0,-2],[1.5,2],[0,1],[-1.5,2],[0,-2]])));
        this.shapeColor = 'white';
        this.maxSpeed = 200; //pixels/world units per second
        this.accelForce = 10;
        this.targetPos = new Vector2D(0, 0);
        this.startBreakingDistance = 50; // the distance for when to start breaking
    }

    // Description: Performs the thinking and decision-making logic for the ship.
    // Sets the acceleration force and rotates the ship to face the target position.
    // dt: number, the delta time since the last move in seconds
    // Returns: void
    // Example: var ship = world.addEntity(new Ship())
    onThinkSelf() 
    {

        //Move towards target

        if(exists(inputs.MOUSE.event.clientX))
        {
            this.targetPos.x = inputs.MOUSE.event.clientX /  globals.view.zoom.factor - world.pos.x;
            this.targetPos.y = inputs.MOUSE.event.clientY / globals.view.zoom.factor - world.pos.y;
        }  
        const distanceToTarget = this.targetPos.sub(this.pos).magnitude();
        const breakingDistance = this.startBreakingDistance + this.vel.magnitude() / 5;

        let breakingFactor = 0;
        if (distanceToTarget < breakingDistance) {
            breakingFactor = (breakingDistance - distanceToTarget) / breakingDistance;
        }

        const toTargetVector = vec2b.set(this.targetPos).subtract(this.pos);
        const toTargetNormals = toTargetVector.normalize();
        
        const steeringForce = toTargetVector.sub(this.vel).limit(this.accelForce);
        const breakingForce = this.vel.normalize().mul(-this.accelForce/2 * breakingFactor); // lower breaking force applied
        this.vel = this.vel.add(steeringForce).add(breakingForce).limit(this.maxSpeed);

        //turn towardd the target so it looks nice 
        var desired_angle = toTargetNormals.toAngle();
        var adif = angleDiff(this.angle,desired_angle);
        this.spin = adif * 2;
    }
    
    
}

var ship = world.addEntity(new Ship())