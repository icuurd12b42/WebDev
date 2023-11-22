//08-game-controller-event-script.js
// 
//  This file shows how to setup a game controller script to eventually control the game at a higher level
//  in this file it is simply used to show entity details in the properties panel and the detection of clicked items
//  as the ship's drawFluff used to do.
//  
//  CHANGE 1
//      Streamlined the creation of things at bottom of file
//
//  CHANGE 2
//      Cloned the clicked entities code from the mouseControlled onto myGameControlCode script (bottom file)
//          as clickedItems
//      Moved the update of the selected entity detail, showing entity details in the properties window 
//          outside the ship class' onFluff event and into a control scrip hook

//
//todo add properties to modify the ship settings and smoothing options
//AI DEBUG COLORS
//Red arrow Thrust applied to reach the target, intercept thrust.
//yellow arrow, the thrust used to avoid obstacles
//blue arrow, the combined force of the avoid and intercept thrusts
//yellow circle, the awareness radius
//orange circle is the waypoint detect range

//function is passed a view to follow. see globals.view
function simpleFollow(view)
{
    //if the ships exists
    if(exists(playerShip)) 
    {
        //set the view's anchor on the ship
        view.anchor.x = playerShip.pos.x;
        view.anchor.y = playerShip.pos.y;
    }
}
//the function that the system calls to update the view
globals.view.calculateFunction = simpleFollow;


//CHANGE 3 
//Mouse control scrip, get's a ship to control
function mouseControlled(ship)
{
    ship.drawPath = true;
    if (exists(inputs.MOUSE.event.clientX))
    {
        const mx = inputs.MOUSE.event.clientX / globals.view.zoom.factor - world.pos.x;
        const my = inputs.MOUSE.event.clientY / globals.view.zoom.factor - world.pos.y;

        if (inputs.MOUSE.RIGHT.pressed() || inputs.MOUSE.RIGHT.downTime() > 100)
        {
            // no clicking a pop-up div window
            inputs.MOUSE.RIGHT.pressedStartTime = Date.now(); // make it trigger again and again 

            if (ship.pathPoints.length == 0)
            {
                ship.pathPoints.length = 0;
                ship.pathPoints.push(ship.pos.clone());
            }

            ship.pathPoints.push(new Vector2D(mx,my));
        }

        // and remove the breakpoint on left click
        if (inputs.MOUSE.LEFT.pressed() || inputs.MOUSE.LEFT.downTime() > 500)
        {
            // but only if nothing was clicked
            const foundThings = globals.world.entitiesAtPos(vec2.setXY(mx,my));

            if (foundThings.length)
            {
                ship.clickedEntities = foundThings;
            }

            if (foundThings.length)
            {
                //change script to comtrol to other ship and leave this one under AI control
                //if the first item in the found list is a ship but not me, set the movement to the other ship
                if(foundThings[0].entityType == "SHIP" && foundThings[0].index != this.index)
                {
                    console.log("Swap",foundThings[0])
                    
                    foundThings[0].controlScript = mouseControlled;
                    ship.controlScript = aiRandom;
                }
            }
            else
            {
                inputs.MOUSE.RIGHT.pressedStartTime = Date.now(); // make it trigger again and again 

                ship.pathPoints.pop();

                if (inputs.MOUSE.LEFT.downTime() > 500)
                {
                    ship.pathPoints.length = 0; // clear the list
                }

                if (ship.pathPoints.length === 0)
                {
                    ship.pathPoints.push(ship.pos.clone());
                }
            }
        }
    }
}
//aiRandom control script, get's a ship to control
function aiRandom(ship)
{
    ship.drawPath=false;
    if (ship.pathPoints.length == 0)
    {
        ship.pathPoints.push(this.pos.clone());
    }
    if (ship.pathPoints.length == 1)
    {
        ship.pathPoints.push(new Vector2D((Math.random()-.5)*2000,(Math.random()-.5)*2000));
    }
}


//maybe later I'll do hex grid. I'm too dumb for that right now
//var hexGrid = new HexGrid(0,0,16,new Vector2D(0,0));

//this function smooths the points, using point defined by window size. fration is how much to move, 
//fade after will make the fraction drop to 0 after the index specified is reached, reducing the smoothing to 0 changes in position
//making the smoothing merge with the existing path smoothness as opposed to smoothing it all
function smoothPointsVect2sKeepEdgesFractionFadeAfter(points, windowSize = 2, fraction = 1, fadeAfter = 4) 
{

    if (points.length < 2) {
        return points;
      }
    
      const smoothedPoints = [];
      const halfWindowSize = Math.floor(windowSize / 2);
    
      smoothedPoints.push(points[0]);
      let curfraction = fraction;
      for (let i = 1; i < points.length - 1; i++) {
        let sumX = 0;
        let sumY = 0;
        let sumWeights = 0;
        if(i>fadeAfter)
        {
            curfraction*=.6;
            if(curfraction <.01) curfraction = 0;
        }
        for (let j = i - halfWindowSize; j <= i + halfWindowSize; j++) {
          if (j >= 0 && j < points.length) {
            const weight = Math.pow(curfraction, Math.abs(j - i) / halfWindowSize);
            sumX += points[j].x * weight;
            sumY += points[j].y * weight;
            sumWeights += weight;
          }
        }
    
        const averageX = sumX / sumWeights;
        const averageY = sumY / sumWeights;
        const point = new Vector2D(averageX, averageY);
        smoothedPoints.push(point);
      }
    
      smoothedPoints.push(points[points.length - 1]);
    
      return smoothedPoints;
}
class Ship extends Entity 
{
    constructor() 
    {
        super();

        //Identifiers
        this.entityType = "SHIP";

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

        //ditto for pathPoint detect range
        this.pathPointDetectRangeSpeed = 128; 
        this.pathPointDetectRangeMax  = this.radius*4
        this.pathPointDetectRangeMin = this.radius*2
        this.pathPointDetectRange = 0;
        this.pathPointsSpacing = 128;
        this.drawPath = false;
        
        this.accelForceMax = 1024;
        this.accelForceMin = 512;
       
        this.pathPoints = []; //the array of pathPoints
        this.nearThings = []; //the array of things nearby
        this.clickedEntities = []; //the array of things the user clicked

        this.fixWaypointsCt = 0;
        this.fixWaypointEvery = 16;

        this.thrustToIntercept = new Vector2D();
        this.thrustToAvoid = new Vector2D();
        this.thrustCombined = new Vector2D();

        //script switching 
        this.controlScript = aiRandom;
    }

    //move the pathPoints outside the asteroids, away from them
    fixWaypoints()
    {
        var ret = false;
        var at = 0;
        this.pathPoints.forEach(point =>
        { 
            //find all in entities that would touch the pathPoint at twice+1/2 it's surface (enough distance for the ship to graze it)
            const atPos = globals.world.entitiesAtPos(point,this.index,this.radius * 2 + this.radius/2);
            if(atPos.length)
            {
                //CHANGE 4
                
                const entity = atPos[0]; 
                //one//
                const centerPos = entity.pos;
                //one//
                const avoidRadius = entity.radius;
                //CHANGE 1
                //move the point outside the entity
                const vectDist = point.sub(centerPos);
                const vectNorm = vectDist.norm();
                const dist = vectDist.mag();
                const totRadius = avoidRadius+this.radius;
                const intersect = dist-totRadius;

                //TODO: Still working on improving this
                if(intersect<0)
                {
                    point.add_self(vectNorm.mul(-intersect));
                    //point.snapToGrid_self(8);
                    //point.toSmooth = true;
                }
                //point.set_self(centerPos).add_self(avoidVectorNormal.mul(avoidRadius+this.radius+this.radius+this.radius));
                //point.add_self(point.sub(centerPos).norm().mul(intersectDist));
                //point.add_self(avoidVectorNormal.mult(intersectDist/totRadius * (totRadius)));
                //point.add_self(avoidVectorNormal.mult(avoidRadius/2+this.radius));
                //setup the return to true, found something
                ret = at;
            }
            
            //add or remove pathPoints depending how much of a gap is between points.
            //if we have enough items to work with in pathPoints
            if(this.pathPoints.length>1)
            {
                //get the prev point
                const prevPoint = this.pathPoints[at-1];
                if(exists(prevPoint))
                {
                    //and add a new point between this on and the prev one if the gap is too much
                    const dist = prevPoint.dist(point);
                    if(dist>this.pathPointsSpacing-5)
                    {
                        //the 2 pos averaged, the tween position is where a new point is added
                        const avgPos = prevPoint.add(point).div(2); 
                        //prevPoint.snapToGrid_self(8);
                        //but not if adding it would be in the pathPoint detect radius
                        if(avgPos.dist(this.pos)>this.pathPointDetectRange-this.pathPointDetectRange/4)
                        {
                            this.pathPoints.splice(at, 0, avgPos);
                        }
                    }
                    else if (dist<this.pathPointsSpacing/2)
                    {
                        //if the gap is too small remove the point
                        //REMOVAL is STILL OFF
                        //this.pathPoints.splice(at, 1);
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
    // targetPos is a list of pathPoints
    // asteroids are the things to avoid
    // Returns: void
    // Example: var ship = world.addEntity(new Ship())
    onThinkSelf() 
    {
        if(this.fixWaypointsCt<=0)
        {
            //add a stub first entry for the code to use the ship as first pathPoint
            //so the smoothing and tween wayponds can work
            this.pathPoints.splice(0, 0, this.pos.clone());
            const pathPointFixedAt = this.fixWaypoints()
            if(pathPointFixedAt)
            {
                this.pathPoints = smoothPointsVect2sKeepEdgesFractionFadeAfter(this.pathPoints, 2,.01,pathPointFixedAt);
            }
            this.pathPoints.shift();
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
        const spdwpRatio = clamp(this.speed/this.pathPointDetectRangeSpeed,0,1);
        this.pathPointDetectRange = mapRange(spdwpRatio,0,1,this.pathPointDetectRangeMin,this.pathPointDetectRangeMax);

        //Call the controlScript to perform that script
        this.controlScript(this);
        
        //aquire the direction to the target              
        const toTargetVector = vec2b.set(this.targetPos).subtract_self(this.pos).clone();
        const toTargetNormals = toTargetVector.normalize();
        const toTargetDistance = toTargetVector.magnitude();

        const velAtStart = this.vel.clone();

        //whe have something in the pathPoints list?    
        if (this.pathPoints.length > 0) 
        {
            //are we close enough to get the next one
            if ( (this.pathPoints.length>1) && (toTargetDistance < this.pathPointDetectRange)) 
            {
                this.pathPoints.shift();
                this.pathPoints = smoothPointsVect2sKeepEdgesFractionFadeAfter(this.pathPoints, 4,.1,1);
            }
            //set targetpos to the first pathPoint in the list
            this.targetPos = this.pathPoints[0];
        }
        
        //add impulse to drive to/intercept the target
        if(toTargetDistance>1)
        {
            //cross make the trust direction more conteract it's motion in ortder to reach the target
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


        //draw pathPoints lines
        if(this.drawPath || options.DEBUG.DRAWAIDETAILS.checked)
        {
            e.ctx.strokeStyle = "blue";
            e.ctx.lineWidth = 1/e.view.zoom.factor;
            e.ctx.beginPath();
            if (this.pathPoints.length > 0) 
            {
                e.ctx.moveTo(this.pos.x, this.pos.y);
                for (let i = 0; i < this.pathPoints.length; i++) 
                {
                    //ATTEMPTS TO STABALIZE PATH POINTS
                    //hexGrid.snapToHex(this.pathPoints[i]);
                    //snapToGrid(this.pathPoints[i],8);
                    e.ctx.lineTo(this.pathPoints[i].x, this.pathPoints[i].y);
                }
            }
            e.ctx.stroke();
            //end

            //draw pathPoint circles
            e.ctx.fillStyle = "red";
            e.ctx.strokeStyle = "red";
            e.ctx.lineWidth = 1/e.view.zoom.factor;
            for (let i = 0; i < this.pathPoints.length; i++) 
            {
                const wp = this.pathPoints[i];
                drawCircleFrame(e.ctx, wp.x, wp.y, 5, "red", 1/e.view.zoom.factor);
            }
            
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

            
            //draw the pathPoint Detect Range radius
            drawCircleFrame(e.ctx, this.pos.x, this.pos.y, this.pathPointDetectRange, "orange", 1/e.view.zoom.factor);
            
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
        
        e.ctx.restore();
    }
}

class Asteroid extends Entity 
{
  constructor() {
    super();

    //Identifiers
    this.entityType = "ASTEROID";

    this.vel = new Vector2D(Math.random() * 4 - 2, Math.random() * 4 - 2);
    this.shape = this.createShape();
    //this array define all the interference patterns that make nice shapes. the number of point 
    //is too low to make actual cratored astoriod, so I went for the estitically pleasing instead.
    var arr = [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[4,3],[5,3],[6,3],[7,3],[8,3],[5,4],[6,4],[7,4],[8,4],[6,5],[7,5],[8,5],[7,6],[8,6],[8,7],[8,8]];
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
//CHANGE 2
////////////
//The game controller code, using the globals world hook on post draw.
function myGameControlCode(e)
{
    //initialise our globals
    if(!exists(globals.world.clickedEntities))
    {
        //add our globals to the global object and sub objects
        globals.world.clickedEntities = []; //the things the user clicked
    }
    //if the mouse is ready and willing
    if (exists(inputs.MOUSE.event.clientX))
    {
        if (inputs.MOUSE.LEFT.pressed() || inputs.MOUSE.LEFT.downTime() > 500)
        {
             //get the mouse pos
            const mx = inputs.MOUSE.event.clientX / globals.view.zoom.factor - world.pos.x;
            const my = inputs.MOUSE.event.clientY / globals.view.zoom.factor - world.pos.y;
            // but only if nothing was clicked
            globals.world.clickedEntities = globals.world.entitiesAtPos(vec2.setXY(mx,my));

            if (globals.world.clickedEntities.length)
            {
                //we clicked on something(s)!!!
            }
        }
    }
    //update ui properties window with the data of the first entity in the clickedEntities array
    if(globals.world.clickedEntities.length)
    {
        const entity = globals.world.clickedEntities[0];
        if(exists(entity))
        {
            options.SELECTEDENTITY.INDEX.text = "" + entity.index;
            options.SELECTEDENTITY.TYPE.text = "" + entity.entityType;


            options.SELECTEDENTITY.SPEED.text = "" +  vec2.set(entity.vel).magnitude().toFixed(2) + "u/s";
            options.SELECTEDENTITY.DIRECTION.text = "" +  radToDeg360(entity.vel.toAngle()).toFixed(2) + "°";
            options.SELECTEDENTITY.SPIN.text = "" + radToDeg(entity.spin).toFixed(2) + "°/s";
            options.SELECTEDENTITY.ANGLE.text = "" + radToDeg360(entity.angle).toFixed(2) + "°";

            options.SELECTEDENTITY.VEL.text = "(" +  entity.vel.x.toFixed(2)+","+entity.vel.y.toFixed(2)+")";
            options.SELECTEDENTITY.POS.text = "(" +  entity.pos.x.toFixed(2)+","+entity.pos.y.toFixed(2)+")";
        }
    }
}
globals.world.postDrawHook = myGameControlCode
////////////

// CHANGE 1
// a temp var to help the standardize the code
var entity;
//player ship
entity = world.addEntity(new Ship())
entity.controlScript = mouseControlled;
entity.drawPath = true;
var playerShip = entity;

//ai ship
entity = world.addEntity(new Ship())
entity.controlScript = aiRandom;
entity.pos.x = (Math.random()-.5)*2000;
entity.pos.y = (Math.random()-.5)*2000;
var aiShip = entity;

var numAss = 100; // :)
for(var ass = 0; ass< numAss; ass++) // :)^2
{
    entity = world.addEntity(new Asteroid());

    entity.pos.x = (Math.random()-.5)*8000;
    entity.pos.y = (Math.random()-.5)*8000;
    entity.spin = -2 + Math.random() * 4;
}
