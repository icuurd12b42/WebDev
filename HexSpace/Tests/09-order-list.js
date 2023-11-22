//09-order-list.js
// 
//  This file changes the ship commandScrip to a order list system
//
//  Click a ship and then right click to add waypoint. Enable Instances AI Detail in the console to see the waypoint you added
//
//  CHANGE 1
//      Added setting the view to follow the clicked ship and added setting the script 
//          of the selected ship to mousecontrol in myGameControlCode() which was removed
//          from the mouseMousecontreolled code
//      Changed the view follow code to use a global set but the game controller script
//      Made the view follow smooth over old position to new position
//
//  CHANGE 2
//      Order List.
//          The Order List is a list of intructions that tell the ship's AI what to do. 
//          like drive to location and back
//              example list
//                    goto xat,yat,
//                    goto xto,yto,
//                    goto xat,yat
       
//          In the simple version the tell ship to reach a position on map but instead of having the mouse 
//          control path points in the ship directly we will have the game controller send the command to 
//          the ship's AI to go to a location
//                      
//  AT THIS POINT IN DEVELOPMENT I DRASTICALLY MODIFIED THE CORE FUNCTIONS. BREAKING THE PREVIOUS FILES
//
// Developing Concept:
// Have the asteroids match the level you are at with the 2 cycles, fromes with level 0 to 8 of world 1. it 1/1 to 2/1... and 8/1... and world 8 it/s 1/8 to 8/1
// when you shoot and asteroid you reduce the asteroid form from say 8/8 to 7/8 counting down all the way to 1/1... finaly 0/1 the asteroid disapears.
// possibly try splitting the astoroid
//
// Story concept:
// the story is, the player appear in flat land as a 4 vector ship 
// at world 1/1 you are along and figure out the control, and shoot a asteroid, and have the narator introduces himself
// the narator is surprized to see you there and asks If you come from above or from below. From the more or from the less...
// you anwser, I dont know. and the narator continues with, Ah, if you don't know, then you know how to know, other wise you would not... 
// A sentient is rare at this level of existance, you are from above then. 

// He sais this 2d land appeared when a all but 2 major vectors and few lesser ones dropped to 0 in a reality unknown, 
// where you or it are likely from. 

// As the level progresses the narator will discuss the origins of the blobs/asteroids, figure out why it takes more shots to take down and so on

// every (few) level(s) you can get a new ship to control, or a new vector for your ship, or twice the vector. have the story wonder 
// why the number of blobs is increasing as well as the interference patterns

// An invasion? an existancial threat? what is this 2d place?


//
//todo add properties to modify the ship settings and smoothing options
//AI DEBUG COLORS
//Red arrow Thrust applied to reach the target, intercept thrust.
//yellow arrow, the thrust used to avoid obstacles
//blue arrow, the combined force of the avoid and intercept thrusts
//yellow circle, the awareness radius
//orange circle is the waypoint detect range
//greenish circle and lines are waypoints

//function is passed a view to follow. see globals.view
function simpleFollowSmooth()
{
    console.log("UPDATE")
    //if the ships exists
    //CHANGE 1
    //if(exists(playerShip)) 
    if(exists(globals.world.selectedEntity));
    {
        //set the view's anchor towards the ship
        
        globals.camera.anchor.x += (globals.world.selectedEntity.pos.x - globals.camera.anchor.x)/16;
        globals.camera.anchor.y += (globals.world.selectedEntity.pos.y - globals.camera.anchor.y)/16;
        globals.camera.updatePos();
        //same for the view offset

    }
    
}
//the function that the system calls to update the view
globals.viewUpdateHook = simpleFollowSmooth;


function orderNothing()
{
    console.warn("Order: " + this.name + " has no script set.")
}
//CHANGE 2 
//the order class
class Order
{
    constructor(script = orderNothing, data = {}, type = "",name = "", reason="")
    {
        this.script = script; //the script to execute
        this.data = data; //it's data
        data.callCount = 0;
        this.type = type; //it's type, UI fluff really
        this.name = name; //it's name, ditto
        this.reason = reason; //it's reason, maybe hold comment on why this order was given
    }
}

//ship.addOrder(new Order(goTo,{pos:new Vector2D(mx,my)},"MOUSEGOTO","", "Player right clicked there"));
function goTo(ship,data)
{
    if(data.callCount == 0)
    {
        //init, set a path from the ship to the target location
        ship.pathPoints.length = 0;
        ship.pathPoints.push(ship.pos.clone());
        ship.pathPoints.push(data.pos.clone());
        //the ship ai should smooth the path to it
    }
    console.log("count:",data.callCount,ship.pathPoints.length)
    data.callCount++
    return (ship.pathPoints.length==1 && ship.pos.distance(data.pos)<= Math.max(ship.pathPointDetectRange*1.5,ship.radius)); //return if done or not
}
/*
//Mouse control scrip, get's a ship to control
function mouseControlled(ship)
{
    ship.drawPath = true;
    if (exists(inputs.MOUSE.event.clientX))
    {
        const mx = inputs.MOUSE.event.clientX / globals.camera.zoomFactor - world.pos.x;
        const my = inputs.MOUSE.event.clientY / globals.camera.zoomFactor - world.pos.y;

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
                if(foundThings[0].entityType == "SHIP" && foundThings[0].id != this.id)
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
*/


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
        //this.controlScript = aiRandom;
        //CHANGE 2 
        //Orders List
        this.ordersList = [];
    }

    //move the pathPoints outside the asteroids, away from them
    fixWaypoints()
    {
        var ret = false;
        var at = 0;
        this.pathPoints.forEach(point =>
        { 
            //find all in entities that would touch the pathPoint at twice+1/2 it's surface (enough distance for the ship to graze it)
            const atPos = globals.world.entitiesAtPos(point,this.id,this.radius * 2 + this.radius/2);
            if(atPos.length)
            {
               
                const entity = atPos[0]; 

                const centerPos = entity.pos;

                const avoidRadius = entity.radius;

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
    //CHANGE 2
    addOrder(order)
    {
        //adds the order to the order list
        this.ordersList.push(order);
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

        //CHANGE 2
        ////Call the controlScript to perform that script
        //this.controlScript(this);
        //if order in list?      && calling it's script with this ship and the orders data...
        while(this.ordersList.length && this.ordersList[0].script(this,this.ordersList[0].data))
        {
            //...returned a I'm Done result, set the next command to perform
            this.ordersList.shift(); //shift to next order
        } //sorry for the while(buncha calls()), but it was simpler to setup for the next script to run right away instead of the next think step.
        //console.log(this.ordersList.length);

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
        this.nearThings = world.nearest(this.pos, this.awarenessRange,this.id);
        
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
            e.ctx.lineWidth = 1/e.camera.zoomFactor;
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
            e.ctx.lineWidth = 1/e.camera.zoomFactor;
            for (let i = 0; i < this.pathPoints.length; i++) 
            {
                const wp = this.pathPoints[i];
                drawCircleFrame(e.ctx, wp.x, wp.y, 5, "red", 1/e.camera.zoomFactor);
            }
            //CHANGE 2
            //Draw the waypoints lines
            var firstpt = true;
            e.ctx.strokeStyle = "#8AC99A";
            e.ctx.lineWidth = 1/e.camera.zoomFactor;
            this.ordersList.forEach( order => 
            {
                //find a type WAYPOINT
                if(order.type == "WAYPOINT")
                {
                    if(firstpt) //first found
                    {
                        //first point stars on ship
                        firstpt = false;
                        e.ctx.beginPath();
                        e.ctx.moveTo(this.pos.x, this.pos.y);
                    }
                    //then on the data.pos of the WAYPOINT order
                    e.ctx.lineTo(order.data.pos.x, order.data.pos.y);
                }
            });
            //we added lines to draw?
            if(firstpt == false)
            {
                //draw it, dont have it...
                e.ctx.stroke();
            }
            //draw waypoints circles
            this.ordersList.forEach( order => 
            {
                if(order.type == "WAYPOINT")
                    drawCircleFrame(e.ctx, order.data.pos.x, order.data.pos.y, (this.pathPointDetectRangeMax+this.pathPointDetectRangeMin)/2, "#79C96E", 1/e.camera.zoomFactor);
            });
            
            
        }
        //end

        if(options.DEBUG.DRAWAIDETAILS.checked)
        {
            //draw a line to near things
            for (let i = 0; i < this.nearThings.length; i++) 
            {
                const a = this.nearThings[i];
                drawLine( e.ctx, this.pos.x,this.pos.y,a.pos.x, a.pos.y,  "yellow",  1/e.camera.zoomFactor) 
            }
            //end

            //draw the awareness Range radius
            drawCircleFrame(e.ctx, this.pos.x, this.pos.y, this.awarenessRange, "yellow", 1/e.camera.zoomFactor);

            
            //draw the pathPoint Detect Range radius
            drawCircleFrame(e.ctx, this.pos.x, this.pos.y, this.pathPointDetectRange, "orange", 1/e.camera.zoomFactor);
            
            //draw the thrust used to reach the target
            if(this.thrustToIntercept.mag_squared()>0)
            {
                vec2.set(this.thrustToIntercept).multiply_self(this.awarenessRange).add_self(this.pos)
                drawArrow(e.ctx, this.pos.x, this.pos.y, vec2.x, vec2.y, 7/e.camera.zoomFactor, "red", 2/e.camera.zoomFactor);
            }

            //draw the current velocity vector
            if(this.thrustCombined.mag_squared()>0)
            {
                vec2.set(this.thrustCombined).multiply_self(this.awarenessRange).add_self(this.pos);
                drawArrow(e.ctx, this.pos.x, this.pos.y, vec2.x, vec2.y, 6/e.camera.zoomFactor, "blue", 1.5/e.camera.zoomFactor);
            }
            
            //draw the thrust used to avoid obstacles
            if(this.thrustToAvoid.mag_squared()>0)
            {
                vec2.set(this.thrustToAvoid).multiply_self(this.awarenessRange).add_self(this.pos);
                drawArrow(e.ctx, this.pos.x, this.pos.y, vec2.x, vec2.y, 5/e.camera.zoomFactor, "yellow", 1/e.camera.zoomFactor);
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
////////////
//The game controller code, using the globals world hook on post draw.
function myGameControlCode(e)
{
    drawCircleFrame(globals.drawing.ctx,globals.camera.anchor.x,globals.camera.anchor.y,20,"yellow",1)
    drawCircleFrame(globals.drawing.ctx,globals.camera.anchor.x+globals.camera.offset.x,globals.camera.anchor.y+globals.camera.offset.y,20,"orange",1)
    //initialise our globals
    if(!exists(globals.world.clickedEntities))
    {
        //add our globals to the global object and sub objects
        globals.world.clickedEntities = []; //the things the user clicked
        
    }
    //if the mouse is ready and willing
    if (exists(inputs.MOUSE.event.clientX))
    {
        if (inputs.MOUSE.LEFT.pressed())
        {
            //get the mouse pos
            const mousePos = e.camera.portToWorldPos(vec2.setXY(inputs.MOUSE.event.clientX,inputs.MOUSE.event.clientY));

            console.log(mousePos)
            // but only if nothing was clicked
            globals.world.clickedEntities = globals.world.entitiesAtPos(mousePos);
            console.log(globals.world.clickedEntities)
            //the list of entities the mouse clicked has something
            if (globals.world.clickedEntities.length)
            {
                //we clicked on something(s)!!!
                const entity = globals.world.clickedEntities[0];
                
                //if the entity is a ship, to swithc scripts for human control
                if(entity.entityType == "SHIP")
                {
                    if(exists(globals.world.selectedEntity) && globals.world.selectedEntity.entityType == "SHIP" )
                    {
                        console.log("switch")
                        //CHANGE 2
                        //globals.world.selectedEntity.controlScript = aiRandom;
                    }
                    //CHANGE 2
                    //entity.controlScript = mouseControlled;
                    
                }
                //if it's a new selection, reset the view offset to 0,0
                if(globals.world.selectedEntity.id !== entity.id)
                {
                    globals.world.selectedEntity = entity;
                }
            }
        }
        //CHANGE 2
        if (inputs.MOUSE.RIGHT.pressed())
        {
            //get the entity the left click got
            if (globals.world.clickedEntities.length)
            {
                const entity = globals.world.clickedEntities[0];
                if(entity.entityType == "SHIP")
                {
                    //get the mouse pos
                    const mousePos = e.camera.portToWorldPos(vec2.setXY(inputs.MOUSE.event.clientX,inputs.MOUSE.event.clientY));
                    entity.addOrder(new Order(goTo,{pos:mousePos},"WAYPOINT","Mouse Goto", "Player right clicked there"));
                }
            }
        }
    }
    //update ui properties window with the data of the first entity in the clickedEntities array
    if(globals.world.clickedEntities.length)
    {
        const entity = globals.world.clickedEntities[0];
        if(exists(entity))
        {
            options.SELECTEDENTITY.id.text = "" + entity.id;
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

// a temp var to help the standardize the code
var entity;
//player ship
entity = world.addEntity(new Ship())
//entity.controlScript = mouseControlled;
var playerShip = entity;
globals.world.selectedEntity = playerShip;

//ai ship
entity = world.addEntity(new Ship())
//entity.controlScript = aiRandom;
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