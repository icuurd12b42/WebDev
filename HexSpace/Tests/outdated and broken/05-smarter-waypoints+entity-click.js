//o5-smarter-waypoints+entity-click.js
// 
//This now check if the clicked is done in the cavas 
//and not the floating window (CHANGE 1)
//
//The waypoint adding feature now adds multiple 
//waypoint in betwen long waypoint (CHANGE 2)

//And for Left clear the waypoint. Made this only 
//happens if nothing in the world is clicked (CHANGE 3)

//And since I know I clicked something on mouse down 
//also added the ability to tracking the object details (CHANGE 4)
//in the control panel floating window under the sel ship tab

//CHANGE 6 Made the waypoint move outside the asteroid and smooth the path every n tick

//CHANGE 7 Added cross make the trust direction more counteract it's motion in ortder to reach the target

//CHANGE 8 recalculated the debug AI drawing variables properly

//CHANGE 9 separated the waypoint detect logic from the awareness range, using it's one waypond detect range instead.

//
//Class: Ship, a class derived from Entity, representing a ship in the 2d top down game
//
//Example: This example show a ship going
// var ship = world.addEntity(new Ship())

//NEW AI DEBUG COLOR
//Red arrow Thrust applied to reach the target, intercept thrust.
//yellow arrow, the thrust used to avoid obstacles
//blue arrow, the combined force of the avoid and intercept thrusts
//yellow circle, the awareness radius
//orange circle is the waypoint detect range

//function is passed a view to follow. see globals.view
function simpleFollow(view)
{
    //if the ships exists
    if(exists(ship)) 
    {
        //set the view's anchor on the ship
        view.anchor.x = ship.pos.x;
        view.anchor.y = ship.pos.y;
    }
}
//the function that the system calls to update the view
globals.view.calculateFunction = simpleFollow;


function smoothPointsVect2sKeepEdgesFraction(points, windowSize = 2, fraction = 1) 
{

    if (points.length < 2) {
        return points;
      }
    
      const smoothedPoints = [];
      const halfWindowSize = Math.floor(windowSize / 2);
    
      smoothedPoints.push(points[0]);
    
      for (let i = 1; i < points.length - 1; i++) {
        let sumX = 0;
        let sumY = 0;
        let sumWeights = 0;
    
        for (let j = i - halfWindowSize; j <= i + halfWindowSize; j++) {
          if (j >= 0 && j < points.length) {
            const weight = Math.pow(fraction, Math.abs(j - i) / halfWindowSize);
            sumX += points[j].x * weight;
            sumY += points[j].y * weight;
            sumWeights += weight;
          }
        }
    
        const averageX = sumX / sumWeights;
        const averageY = sumY / sumWeights;
        smoothedPoints.push(new Vector2D(averageX, averageY));
      }
    
      smoothedPoints.push(points[points.length - 1]);
    
      return smoothedPoints;
}

class Ship extends Entity 
{
    constructor() 
    {
        super();
        //this.pos = new Vector2D(0, 0);
        this.vel = new Vector2D(0, 0);
        this.setShape(rotateShape(degToRad(90), scaleShape(10,[[0,-2],[1.5,2],[0,1],[-1.5,2],[0,-2]])));
        this.shapeColor = 'white';
        this.crusingSpeed = 128;
        this.speed = 0;
        this.spinDampening=.01;
        this.speedDampening=.00531; //I just tweaked this until I got 128 max speed TODO: figure how to calculate this properly

        this.targetPos = null;

        //the awareness range changes by speed

        //the top speed when max avoid and trust as used starts to apply
        //it does not need to be the ships max speed. it's basically defines 
        //the ramp up from min to max with a speed/maxspeed formula. 
        this.awarenessRangeSpeed = 128; 
        this.awarenessRangeMax = this.radius*8;
        this.awarenessRangeMin = this.radius*2;
        this.awarenessRange = 0; //calculated from above


        //ditto for waypoint detect range
        this.waypointDetectRangeSpeed = 128; 
        this.waypointDetectRangeMax  = this.radius*2
        this.waypointDetectRangeMin = this.radius*1
        this.waypointDetectRange = 0;

        this.waypointsSpacing = 128;

        this.accelForceMax = 1024;
        this.accelForceMin = 512;
       


        
        this.waypoints = []; //the array of waypoints
        this.nearThings = []; //the array of things nearby
        this.clickedThings = []; //the array of things the user clicked

        this.fixWaypointsCt = 0;
        this.fixWaypointEvery = 16;

        this.thrustToIntercept = new Vector2D();
        this.thrustToAvoid = new Vector2D();
        this.thrustCombined = new Vector2D();

    }

    fixWaypoints()
    {
        //CHANGE 6, CHANGE 2
        var ret = false;
        var at = 0;
        this.waypoints.forEach(point =>
        { //it actually only does one point, more stable results, see the return at the end of this
            //kept the code that did the average for all though, commented out
            const atPos = globals.world.entitiesAtPos(point,this.index,this.radius * 2);

            if(atPos.length)
            {
                
                //all// var minX = Infinity,
                //all//    minY = Infinity,
                //all//    maxX = -Infinity,
                //all//    maxY = -Infinity;

                //all//   //calculate the center of all the objects
                //all//   //and and the rectangle tha encompasses them
                //all//   //const centerPos = new Vector2D(0,0);
                //all//   atPos.forEach( entity => 
                //all//       {
                //all//           //accumulate the positions of the entities
                //all//           centerPos.add_self(entity.pos)
                //all//           //find the minmax region
                //all//           minX = Math.min(minX,entity.pos.x-entity.radius);
                //all//           minY = Math.min(minY,entity.pos.y-entity.radius);
                //all//           maxX = Math.max(maxX,entity.pos.x+entity.radius);
                //all//           maxY = Math.max(maxY,entity.pos.y+entity.radius);
                //all//        });
                //all//    //average position
                //all//    centerPos.div_self(atPos.length)
                

                //all//    //the hyponenuse /2 is the avoid radius
                //all//    //const avoidRadius = Math.max(5,vec2.setXY(maxX-minX,maxY-minY).mag()/2+this.radius);
                //one//
                const entity = atPos[0]; 
                //one//
                const centerPos = entity.pos;
                //one//
                const avoidRadius = entity.radius;

                //move the point outside the entity
                const avoidVectorNormal = point.sub(centerPos).norm();
                point.set_self(centerPos).add_self(avoidVectorNormal.mul(avoidRadius+this.radius+this.radius+this.radius));
                //setup the return to true, found something
                ret = true;
            }
            
            //add or remove waypoints depending how much of a gap is between points.
            //if we have enough items to work with in waypoints
            if(this.waypoints.length>1)
            {
                //get the prev point
                const prevPoint = this.waypoints[at-1];
                if(exists(prevPoint))
                {
                    //and add a new point between this on and the prev one if the gap is too much
                    const dist = prevPoint.dist(point);
                    if(dist>this.waypointsSpacing-5)
                    {
                        //the 2 pos averaged, the tween position is where a new point is added
                        const avgPos = prevPoint.add(point).div(2); 
                        //but not if adding it would be in the waypoint detect radius
                        if(avgPos.dist(this.pos)>this.waypointDetectRange)
                        {
                            this.waypoints.splice(at, 0, avgPos);
                        }
                    }
                    else if (dist<this.waypointsSpacing/2+5)
                    {
                        //if the gap is too small remove the point
                        this.waypoints.splice(at, 1);
                    }
                }
            }
            at++;
            //lets just do the closest one.
            //one//
            if (ret) return ret;
        });
        return ret;
    }
    // Description: Performs the thinking and decision-making logic for the ship.
    // Moves toward targetPos and decelerates to reach it when in the breaking range
    // targetPos is a list of waypoints
    // asteroids are the things to avoid
    // Returns: void
    // Example: var ship = world.addEntity(new Ship())
    onThinkSelf() 
    {
        //CHANGE 6
        if(this.fixWaypointsCt<=0)
        {
            //add a stub first entry for the code to use the ship as first waypoint
            //so the smoothing and tween wayponds can work
            this.waypoints.splice(0, 0, this.pos.clone());
            if(this.fixWaypoints())
            {
                this.waypoints = smoothPointsVect2sKeepEdgesFraction(this.waypoints, 2);
            }
            this.waypoints.shift();
            this.fixWaypointsCt = this.fixWaypointEvery;
        }
        this.fixWaypointsCt--;

        //if no target set, target self
        if(!exists(this.targetPos)) this.targetPos = this.pos;

        //dampening
        //apply a spin fraction the opposite direction
        this.spin+=-this.spin*this.spinDampening;
        //apply a inverted fraction of the velocity if overspeed
        
        this.vel.add_self(this.vel.multiply(-1).multiply_self(this.speedDampening));


        //the driving awareness range grows with speed up to max radius
        const spdRatio = clamp(this.speed/this.awarenessRangeSpeed,0,1);
        this.awarenessRange = mapRange(spdRatio,0,1,this.awarenessRangeMin,this.awarenessRangeMax);
        //same for weapont detect
        const spdwpRatio = clamp(this.speed/this.waypointDetectRangeSpeed,0,1);
        this.waypointDetectRange = mapRange(spdwpRatio,0,1,this.waypointDetectRangeMin,this.waypointDetectRangeMax);

        //If the mouse have valid data, add the mouse to the waypoints on down and while down every 100ms
        if (exists(inputs.MOUSE.event.clientX)) 
        {
            const mx = inputs.MOUSE.event.clientX / globals.view.zoom.factor - world.pos.x;
            const my = inputs.MOUSE.event.clientY / globals.view.zoom.factor - world.pos.y;
            if (inputs.MOUSE.RIGHT.pressed() || inputs.MOUSE.RIGHT.downTime() > 100) 
            {
                //CHANGE 1
                //no clicking a pop up div window
                
                inputs.MOUSE.RIGHT.pressedStartTime = Date.now(); //make it trigger again and again 
                //CHANGE 2
                //this.waypoints.push(new Vector2D(mx,my));
                //TO
                //add this.pos if empty as first element
                if(this.waypoints.length == 0)
                {
                    this.waypoints.length = 0;
                    this.waypoints.push(this.pos.clone());
                }
                this.waypoints.push(new Vector2D(mx,my));
     
                
            }
            //and remove the breapoint on left click
            if (inputs.MOUSE.LEFT.pressed() || inputs.MOUSE.LEFT.downTime() > 500) 
            {
                //no clicking a pop up div window
                const htmlelement = document.elementFromPoint(inputs.MOUSE.event.clientX, inputs.MOUSE.event.clientY);
                //CHANGE 1
                if(htmlelement.id === "canvas")
                {
                    //but only if nothing was clicked
                    const foundThings = globals.world.entitiesAtPos(vec2.setXY(mx,my));
                    if(foundThings.length)
                    {
                        this.clickedThings = foundThings;
                    }
                    //CHANGE 3 CHANGE 4
                    if(foundThings.length)
                    {
                        //moved to drawFluff to track the data
                        //clicked on something(s) the first on in the closest to mouse

                        //const e = entities[0];
                        //options.SELECTEDENTITY.SPEED.text = "" +  e.speed.toFixed(2);
                        //options.SELECTEDENTITY.DIRECTION.text = "" +  radToDeg(e.angle).toFixed(2);
                        //options.SELECTEDENTITY.POS.text = "" +  e.pos.x.toFixed(2)+","+e.pos.y.toFixed(2);
                        //options.SELECTEDENTITY.INDEX.text = "" + e.index;
                    }
                    else //CHANGE 3
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
            }
        }
        
        //aquire the direction to the target              
        const toTargetVector = vec2b.set(this.targetPos).subtract_self(this.pos).clone();
        const toTargetNormals = toTargetVector.normalize();
        const toTargetDistance = toTargetVector.magnitude();

        const velAtStart = this.vel.clone();

        //whe have something in the waypoints list?    
        if (this.waypoints.length > 0) 
        {
            //are we close enough to get the next one
            if ( (this.waypoints.length>1) && (toTargetDistance < this.waypointDetectRange)) 
            {
                this.waypoints.shift();
            }
            //set targetpos to the first waypoint in the list
            this.targetPos = this.waypoints[0];
        }
        
        //add impulse to drive to/intercept the target
        if(toTargetDistance>1)
        {
            //CHANGE 7 Added cross make the trust direction more conteract it's motion in ortder to reach the target
            const cross = toTargetNormals.cross(this.vel.norm());
            const toInterceptDirection = vect2.fromAngle(toTargetNormals.toAngle() - cross);
            //apply motion, to the best speed possible
            const accelRatio = clamp(toTargetDistance/this.awarenessRange,0,1);
            const force = mapRange(accelRatio,0,1,this.accelForceMin,this.accelForceMax);
            aImpulse.force = toInterceptDirection.multiply_self(force);
            aImpulse.pos = vec2b.setXY(0,0);
            this.addImpulse(aImpulse);
        }
        //calculate the driving direction we gave it 
        this.thrustToIntercept = this.vel.sub(velAtStart);

        const velAfterIntercept = this.vel.clone();

        //get the entities to avoid in the range
        this.nearThings = world.nearest(this.pos, this.awarenessRange,this.index);
        
        //for each entity near
        this.nearThings.forEach(entity => 
        {
            //avoid if too close
            if(entity._nearest_d < this.awarenessRange)
            {
                //vector opposide direction
                const vectFromAvoid = vec2a.set(this.pos).sub(entity.pos);
                const vectNormal = vectFromAvoid.normalise();
                
                const avoidRatio = clamp(entity._nearest_d / this.awarenessRange,0,1);
                const force = mapRange(avoidRatio,0,1,this.accelForceMax,this.accelForceMin);
                aImpulse.force = vectNormal.multiply_self(force);
                aImpulse.pos = vec2b.setXY(0,0);
                this.addImpulse(aImpulse);
            }
        });
        //remember the thrust used to avoid
        this.thrustToAvoid = this.vel.sub(velAfterIntercept);

        //remember th combine thrust of the intercept and the avoid vectors
        this.thrustCombined = this.vel.sub(velAtStart);

        //what's the speed values 
        this.speed = this.vel.magnitude();

        

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

        if(options.DEBUG.DRAWAIDETAILS.checked)
        {
            //draw a line to near things
            for (let i = 0; i < this.nearThings.length; i++) 
            {
                const a = this.nearThings[i];
                drawLine( e.ctx, this.pos.x,this.pos.y,a.pos.x, a.pos.y,  "yellow",  1/e.view.zoom.factor) 
            }
            //end

            //draw the awareness Range radius
            drawCircleFrame(e.ctx, this.pos.x, this.pos.y, this.awarenessRange, "yellow", 1/e.view.zoom.factor);

            
            //draw the waypoint Detect Range radius
            drawCircleFrame(e.ctx, this.pos.x, this.pos.y, this.waypointDetectRange, "orange", 1/e.view.zoom.factor);
            
            //draw the thrust used to reach the target
            if(this.thrustToIntercept.mag_squared()>0)
            {
                vec2.set(this.thrustToIntercept).multiply_self(this.awarenessRange).add_self(this.pos)
                drawArrow(e.ctx, this.pos.x, this.pos.y, vec2.x, vec2.y, 7/e.view.zoom.factor, "red", 2/e.view.zoom.factor);
            }

            

            //draw the current velocity vector
            if(this.thrustCombined.mag_squared()>0)
            {
                vec2.set(this.thrustCombined).multiply_self(this.awarenessRange).add_self(this.pos);
                drawArrow(e.ctx, this.pos.x, this.pos.y, vec2.x, vec2.y, 6/e.view.zoom.factor, "blue", 1.5/e.view.zoom.factor);
            }
            
            //draw the thrust used to avoid obstacles
            if(this.thrustToAvoid.mag_squared()>0)
            {
                vec2.set(this.thrustToAvoid).multiply_self(this.awarenessRange).add_self(this.pos);
                drawArrow(e.ctx, this.pos.x, this.pos.y, vec2.x, vec2.y, 5/e.view.zoom.factor, "yellow", 1/e.view.zoom.factor);
            }

        }
        //CHANGE 4
        if(this.clickedThings.length)
        {
            const e = this.clickedThings[0];
            if(exists(e))
            {
                options.SELECTEDENTITY.INDEX.text = "" + e.index;
                options.SELECTEDENTITY.SPEED.text = "" +  vec2.set(e.vel).magnitude().toFixed(2) + "u/s";
                options.SELECTEDENTITY.DIRECTION.text = "" +  radToDeg360(e.vel.toAngle()).toFixed(2) + "°";
                options.SELECTEDENTITY.SPIN.text = "" + radToDeg(e.spin).toFixed(2) + "°/s";
                options.SELECTEDENTITY.ANGLE.text = "" + radToDeg360(e.angle).toFixed(2) + "°";

                options.SELECTEDENTITY.VEL.text = "(" +  e.vel.x.toFixed(2)+","+e.vel.y.toFixed(2)+")";
                options.SELECTEDENTITY.POS.text = "(" +  e.pos.x.toFixed(2)+","+e.pos.y.toFixed(2)+")";
                

            }
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
