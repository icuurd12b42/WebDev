//02-towardsWaypoint.js
//this adds a waypoint system, right click to add left click to remove

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
        this.shapeColor = 'WHITE';
        this.maxSpeed = 200; //pixels/world units per second
        this.accelForce = 10;
        this.targetPos = new Vector2D(0, 0);
        this.startBreakingDistance = 15; // the distance for when to start breaking
        this.weapointRangeMax = 100;
        this.weapointRangeMin = 75;

        this.waypoints = []; //the array of waypoints
    }

    // Description: Performs the thinking and decision-making logic for the ship.
    // Moves toward targetPos and decelerates to reach it when in the breaking range
    // targetPos is a list of waypoints
    // Returns: void
    // Example: var ship = world.addEntity(new Ship())
    onThinkSelf() {
        //Move towards target
        const mousePos = this.pos.clone();
        if (exists(inputs.MOUSE.event.clientX)) {
          mousePos.x = inputs.MOUSE.event.clientX / globals.view.zoom.factor - world.pos.x;
          mousePos.y = inputs.MOUSE.event.clientY / globals.view.zoom.factor - world.pos.y;
        }
        const distanceToTarget = this.targetPos.sub(this.pos).magnitude();
        const breakingDistance = this.startBreakingDistance + this.vel.magnitude() / 5;
    
        let breakingFactor = 0;
        if (distanceToTarget < breakingDistance) {
          breakingFactor = (breakingDistance - distanceToTarget) / breakingDistance;
        }
    
       //aquire the direction to the target              
       const toTargetVector = vec2b.set(this.targetPos).subtract(this.pos);
       const toTargetNormals = toTargetVector.normalize();
       const toTargetDistance = toTargetVector.magnitude();
       
    
        const steeringForce = toTargetVector.sub(this.vel).limit(this.accelForce);
        const breakingForce = this.vel.normalize().mul(-this.accelForce / 2 * breakingFactor); // lower breaking force applied
        this.vel = this.vel.add(steeringForce)
        
        if (this.waypoints.length == 1) {

            this.vel = this.vel.add(breakingForce)
        }

        this.vel = this.vel.limit(this.maxSpeed);
        
        if (inputs.MOUSE.RIGHT.pressed() || inputs.MOUSE.RIGHT.downTime() > 100) {
          inputs.MOUSE.RIGHT.pressedStartTime = Date.now(); //make it trigger again and again 
          this.waypoints.push(mousePos);
        }
        //and remove the breapoint on left click
        if (inputs.MOUSE.LEFT.pressed() || inputs.MOUSE.LEFT.downTime() > 500) 
        {
            inputs.MOUSE.RIGHT.pressedStartTime = Date.now(); //make it trigger again and again 
            this.waypoints.pop();
            if(inputs.MOUSE.LEFT.downTime() > 500)
            {
                this.waypoints.length = 0; //clear the list
                
            }
            if(this.waypoints.length === 0)
            {
              this.waypoints.push(this.pos.clone());
            }
        }
        if (this.waypoints.length > 0) {
          this.targetPos = this.waypoints[0];
          if (this.pos.distance(this.targetPos) < mapRange(this.vel.magnitude()/this.maxSpeed,0,1,this.weapointRangeMin,this.weapointRangeMax)) {
            this.waypoints.shift();
          }
        }
        //turn towardd the target so it looks nice 
        var desired_angle = toTargetNormals.toAngle();
        var adif = angleDiff(this.angle,desired_angle);
        this.spin = adif * 2;
      
      }
    
    // Description: Draws other things in the canvas, such as special effects.
    // e has event detail and ctx.
    // e.ctx: CanvasRenderingContext2D, the rendering context to draw on, untranslated not rotated
    // see the call to world.onDraw() in main.js for detail about the event
    // e.view
    // Returns: void
    // Example: none
    onDrawFluff(e) 
    {
        e.ctx.save();

        //draw wayponts lines
        e.ctx.strokeStyle = "blue";
        e.ctx.lineWidth = 1/e.view.zoom.factor;
        e.ctx.beginPath();
        if (this.waypoints.length > 0) 
        {
            e.ctx.moveTo(this.pos.x, this.pos.y);
            for (let i = 0; i < this.waypoints.length; i++) 
            {
                e.ctx.lineTo(this.waypoints[i].x, this.waypoints[i].y);
            }
        }
        e.ctx.stroke();
        //end

        //draw waipoint circles
        e.ctx.fillStyle = "red";
        e.ctx.strokeStyle = "red";
        e.ctx.lineWidth = 1/e.view.zoom.factor;
        for (let i = 0; i < this.waypoints.length; i++) 
        {
            const wp = this.waypoints[i];
            drawCircleFrame(e.ctx, wp.x, wp.y, 5, "red", 1/e.view.zoom.factor);
        }
        //end


        e.ctx.restore();
    }
}

var ship = world.addEntity(new Ship())