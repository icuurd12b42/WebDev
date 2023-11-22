//03-towardsWaypointAvoid.js
// 
// This version uses the impulse system to move the ship arround. But basically same effect as previous code

// Moving arround imvolves setting an impulse in the wanted direction
// and avoiding things simply requires adding impulse the revese of the direction of the things to avoid

// the complex things are balancing the 2 forces

// the AI has a distance awareness which grows the faster it moves because reaction time vs distance matters.

// It will drive as fast as it can towards the target. The speed it capped via dampening as in other files but with member variable

// To avoid, the AI will keep track of all entities witing it's awareness range and add motion the opposite direction

// The amount of force used to avoid depends on how close the ship edge is to edge of the thing to avoid.

// The desired forces are a mix on how close it is and what min max thrust is set to apply.


//With the AI drawing ON in the debug:
// red arrow is the desired movement force and direction, usually towards a target pos
// Yellow circle is awareness radius
// Yellow lines point to things it's avoiding
// Yellow arrow shows the directions and amount of force that was used to avoid the things
// The blue arrow shows the combined forces of desired movement and avoidance. 
//    aka the direction and force of all impulse forces combined
// The lime arrow is the actual movement direction.


//
//Class: Ship, a class derived from Entity, representing a ship in the 2d top down game
//
//Example: This example show a ship going
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
        this.spinDampening=.05;
        this.speedDampening=.01;
        this.speed = 0;
        this.targetPos = null;

        //the awareness range changes by speed

        //the top speed when max avoid and trust as used starts to apply
        //it does not need to be the ships max speed. it's basically defines 
        //the ramp up from min to max with a speed/maxspeed formula. if you speen never reaches 100, then 
        this.awarenessRangeSpeed = 100; 

        this.awarenessRangeMax = this.radius*8;
        this.awarenessRangeMin = this.radius*2;
        this.awarenessRange = 0; //calculated from above
        this.accelForceMax = 1000;
        this.accelForceMin = 400;
        this.waypoints = []; //the array of waypoints
        this.nearThings = []; //the array of things nearby
        this.avoidVector = new Vector2D(0,0); //the avoid vector we used to avoid things
        this.towardsVector = new Vector2D(0,0);
    }

    
    // Description: Performs the thinking and decision-making logic for the ship.
    // Moves toward targetPos and decelerates to reach it when in the breaking range
    // targetPos is a list of waypoints
    // asteroids are the things to avoid
    // Returns: void
    // Example: var ship = world.addEntity(new Ship())
    onThinkSelf() 
    {
        //if no target set, target self
        if(!exists(this.targetPos)) this.targetPos = this.pos;

        //dampening
        //apply a spin fraction the opposite direction
        this.spin+=-this.spin*this.spinDampening;
        //apply a inverted fraction of the velocity
        this.vel.add_self(this.vel.multiply(-1).multiply_self(this.speedDampening));


        //the driving awareness range grows with speed up to max radius
        const spdRatio = clamp(this.speed/this.awarenessRangeSpeed,0,1);
        this.awarenessRange = mapRange(spdRatio,0,1,this.awarenessRangeMin,this.awarenessRangeMax);
        
        //If the mouse have valid data, add the mouse to the waypoints on down and while down every 100ms
        if (exists(inputs.MOUSE.event.clientX)) 
        {
            const mx = inputs.MOUSE.event.clientX / globals.view.zoom.factor - world.pos.x;
            const my = inputs.MOUSE.event.clientY / globals.view.zoom.factor - world.pos.y;
            if (inputs.MOUSE.RIGHT.pressed() || inputs.MOUSE.RIGHT.downTime() > 100) 
            {
                inputs.MOUSE.RIGHT.pressedStartTime = Date.now(); //make it trigger again and again 
                this.waypoints.push(new Vector2D(mx,my));
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
        }
        
        //aquire the direction to the target              
        const toTargetVector = vec2b.set(this.targetPos).subtract_self(this.pos).clone();
        const toTargetNormals = toTargetVector.normalize();
        const toTargetDistance = toTargetVector.magnitude();

        
        //whe have something in the wapoints list?    
        if (this.waypoints.length > 0) 
        {
            //are we close enough to get the next one
            if ( (this.waypoints.length>1) && (toTargetDistance < this.awarenessRange)) 
            {
                this.waypoints.shift();
            }
            //set targetpos to the first waypoint in the list
            this.targetPos = this.waypoints[0];
        }
        
        //get the current velocity
        this.towardsVector.set(this.vel);
        if(toTargetDistance>1)
        {
            //apply motion, to the best speed possible
            const accelRatio = toTargetDistance/this.awarenessRange;//clamp(toTargetDistance/this.awarenessRange,0,1);
            const force = mapRange(accelRatio,0,1,this.accelForceMin,this.accelForceMax);
            aImpulse.force = toTargetNormals.multiply_self(force);
            aImpulse.pos = vec2b.setXY(0,0);
            this.addImpulse(aImpulse);
        }
        //caluclate the driving direction we gave it 
        this.towardsVector.subtract_self(this.vel).multiply_self(-1);

        //get the current velocity
        this.avoidVector.set(this.vel);
        //get the entities to avoid in the range
        this.nearThings = world.nearest(this.pos, this.awarenessRange,this.index);
        this.nearThings.forEach(entity => 
        {

            const vectFromAvoid = vec2a.set(this.pos).sub(entity.pos);
            const vectNormal = vectFromAvoid.normalise();
            
            
            if(entity._nearest_d < this.awarenessRange)
            {
                const avoidRatio = entity._nearest_d / this.awarenessRange;//clamp(entity._nearest_d / this.awarenessRange,0,1);
                const force = mapRange(avoidRatio,0,1,this.accelForceMax*2,this.accelForceMin*2);
                aImpulse.force = vectNormal.multiply_self(force);
                aImpulse.pos = vec2b.setXY(0,0);
                this.addImpulse(aImpulse);
            }
        });

        //what's the speed values 
        this.speed = this.vel.magnitude();

        //and remember the avoid direction we created with all the inpulses
        //comparing with the velocity prior
        this.avoidVector.subtract_self(this.vel).multiply_self(-1);

        //turn toward the target so it looks nice 
        var desired_angle = toTargetNormals.toAngle();
        var adif = angleDiff(this.angle,desired_angle);
        this.spin = adif * 2 * spdRatio; 
            
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

        //draw a line to near things
        if(options.DEBUG.DRAWAIDETAILS.checked)
        {
            for (let i = 0; i < this.nearThings.length; i++) 
            {
                const a = this.nearThings[i];
                drawLine( e.ctx, this.pos.x,this.pos.y,a.pos.x, a.pos.y,  "yellow",  1/e.view.zoom.factor) 
            }
        }
        //end

        //draw the avoid radius
        if(options.DEBUG.DRAWAIDETAILS.checked)
        {
            drawCircleFrame(e.ctx, this.pos.x, this.pos.y, this.awarenessRange, "yellow", 1/e.view.zoom.factor);
        }
        
        //draw the avoidVector
        if(options.DEBUG.DRAWAIDETAILS.checked && this.avoidVector.magnitudeSquared()>0)
        {
            vec2.set(this.avoidVector).multiply_self(this.awarenessRange).add_self(this.pos)
            drawArrow(e.ctx, this.pos.x, this.pos.y, vec2.x, vec2.y, 8/e.view.zoom.factor, "yellow", 1/e.view.zoom.factor);
        }

        //draw the towards vector
        if(options.DEBUG.DRAWAIDETAILS.checked && this.towardsVector.magnitudeSquared()>0)
        {
            vec2.set(this.towardsVector).multiply_self(this.awarenessRange).add_self(this.pos)
            drawArrow(e.ctx, this.pos.x, this.pos.y, vec2.x, vec2.y, 8/e.view.zoom.factor, "red", 1/e.view.zoom.factor);
        }

        //draw the combined direction
        if(options.DEBUG.DRAWAIDETAILS.checked && this.speed>.1)
        {
            vec2.set(this.towardsVector).add_self(this.avoidVector).divide_self(2).normalize_self().multiply_self(this.speed/this.awarenessRangeSpeed).multiply_self(this.awarenessRange).add_self(this.pos)
            drawArrow(e.ctx, this.pos.x, this.pos.y, vec2.x, vec2.y, 8/e.view.zoom.factor, "blue", 1/e.view.zoom.factor);
        }

        if(options.DEBUG.DRAWAIDETAILS.checked && this.speed>.1)
        {
            vec2.set(this.vel).divide_self(this.awarenessRangeSpeed).multiply_self(this.awarenessRange).add_self(this.pos)
            drawArrow(e.ctx, this.pos.x, this.pos.y, vec2.x, vec2.y, 8/e.view.zoom.factor, "lime", 1/e.view.zoom.factor);
        }

        e.ctx.restore();
    }
}

class Asteroid extends Entity 
{
  constructor() {
    super();

    this.vel = new Vector2D(Math.random() * 4 - 2, Math.random() * 4 - 2);
    this.shape = this.createShape();
    //this array define all the interference patterns that make nice shapes. the number of point 
    //is too low to make actual cratored astoriod, so I went for the estitically pleasing instead.
    var arr = [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[4,3],[5,3],[6,3],[7,3],[8,3],[5,4],[6,4],[7,4],[8,4],[6,5],[7,5],[8,5],[7,6],[8,6],[8,7]];
    var idx = Math.floor(Math.random() * arr.length);
    this.setShape(scaleShape(50+Math.random()*50,this.createShape(arr[idx][0],arr[idx][1])));
  }

  onThinkSelf() {
    // add code here to update the Asteroid's behavior
  }

  
  createShape(intw1, intw2) 
  {
    const numPoints = 72;
    const angle = (2 * Math.PI) / numPoints;
    const shape = [];
    for (let i = 0; i < numPoints; i++) 
    {
      
      const a1 = (i*angle*intw1); //interference wave 1
      const a2 = (i*angle*intw2); //interference wave 2
      const r = .6 + mapRange(Math.cos(a1),-1,1, 0,.2) +  mapRange(Math.sin(a2),-1,1, 0,.2)
      const x = r * Math.cos(i * angle);
      const y = r * Math.sin(i * angle);
      shape.push([x, y]);
    }

    // Close the shape by adding the first point again
    shape.push(shape[0]);

    return shape;
  }

///
}
///

var ship = world.addEntity(new Ship())

var ar = 400;
var a;
for(var i = 0; i< 100; i++)
{
    a = world.addEntity(new Asteroid());

    a.pos.x = -2000 + Math.random() * 4000
    a.pos.y = -2000 + Math.random() * 4000
    a.spin = -2 + Math.random() * 4;
}
