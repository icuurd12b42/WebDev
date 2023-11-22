//engineobject.js
class Engine extends Entity
{
    constructor()
    {

        super();
        //You the size of the engine defines it's final newton force
        this.setShape(rotateShape(degToRad(180), scaleShape(5,[[-2,-1],[1,-1],[1,-.25],[2,-1],[2,1],[1,.25],[1,1],[-2,1],[-2,-1]])));
        this.solid = false;

        this.power = 0; //fraction value, 0, off to 1, full power. calculated in ship
        
        //1N = 1Kg moved 1 meter/word unit in 1 second. mass is same a width*height of ship bounding rectangle
        this.newtons = 100; 

        //engine force mapped to engine mass
        //re-calculated in ship, 
        //sets the total force of the engine 
        //relative to mass of engine. Mass/volume in 2d is same as area...
        this.force = this.newtons * this.width*this.height; 
        
        //the flame effect
        this.flames = rotateShape(degToRad(0), scaleShape(5,[[0,-.25],[-.75,-.75],[-2,-1],[-1,-.5],[-3,-.75],[-2,-.25],[-4,0],[-2,.25],[-3,.75],[-1,.5],[-2,1],[-.75,.75],[0,.25]]));
        
    }
    onDrawSelf(ctx)
	{
		//draw this around the 0,0 axis untranslated, unrotated, the transform are already applied in onDraw
		drawShape(ctx,0,0,this.shape,this.shapeColor,1);
        ctx.save();
        ctx.translate(-this.radius ,0);
        var flameOn = this.power*.75 + Math.random() * this.power * .25;
        ctx.scale(this.radius*.25 * flameOn* flameOn, this.radius*.3 * Math.max(flameOn))
        drawShape(ctx,0,0,this.flames,"red",1*flameOn/2);
        ctx.restore();
	}
    setShape(s)
    {
        super.setShape(s);
        //recalculate force of engine since it was scaled
        this.force = this.newtons * this.width * this.height;
    }
}
class Bullet extends Entity
{
    constructor()
    {
        super();
        this.setShape([[0,0],[5,0]]);
        this.solid = false;
    }
    onDrawSelf(ctx)
	{
		//draw this around the 0,0 axis untranslated, unrotated, the transform are already applied in onDraw
		drawShape(ctx,0,0,this.shape,"red",1);
       
	}

}

class Ship extends Entity
{
    constructor()
    {
        super();
        this.setShape(rotateShape(degToRad(90), scaleShape(10,[[0,-2],[1.5,2],[0,1],[-1.5,2],[0,-2]])));
        
        this.arrive_radius = 200;

        this.targetPos = new Vector2D;


        this.points = [];

        this.engines = [];

        addInput("W");
        addInput("A");
        addInput("S");
        addInput("D");

        addInput("Q");
        addInput("E");

        addInput("R");
        var mainThruster = this.addEntity(new Engine);
        mainThruster.pos.x = -10;
        mainThruster.pos.y = 0;
        mainThruster.angle = 0;
        mainThruster.setShape(scaleShape(.5,mainThruster.shape));

        this.engines.push(mainThruster);

        var tipRevThruster = this.addEntity(new Engine);
        tipRevThruster.pos.x = 15;
        tipRevThruster.pos.y = 0;
        tipRevThruster.angle = degToRad(180);
        tipRevThruster.setShape(scaleShape(.3,tipRevThruster.shape));
        
        this.engines.push(tipRevThruster);

        var tipTruster1 = this.addEntity(new Engine);
        tipTruster1.pos.x = 10;
        tipTruster1.pos.y = -3;
        tipTruster1.angle = degToRad(90);
        tipTruster1.setShape(scaleShape(.3,tipTruster1.shape));
        
        this.engines.push(tipTruster1);

        var tipTruster2 = this.addEntity(new Engine);
        tipTruster2.pos.x = 10;
        tipTruster2.pos.y = 3;
        tipTruster2.angle = degToRad(-90);
        tipTruster2.setShape(scaleShape(.3,tipTruster2.shape));
        

        this.engines.push(tipTruster2);

        var tailTruster1 = this.addEntity(new Engine);
        tailTruster1.pos.x = -10;
        tailTruster1.pos.y = -10;
        tailTruster1.angle = degToRad(90);
        tailTruster1.setShape(scaleShape(.3,tailTruster1.shape));
        
        this.engines.push(tailTruster1);

        var tailTruster2 = this.addEntity(new Engine);
        tailTruster2.pos.x = -10;
        tailTruster2.pos.y = 10;
        tailTruster2.angle = degToRad(-90);
        tailTruster2.setShape(scaleShape(.3,tailTruster2.shape));
        
        this.engines.push(tailTruster2);

      
    }
    onDrawSelf(ctx)
	{
		//draw this around the 0,0 axis untranslated, unrotated, the transform are already applied in onDraw
		drawShape(ctx,0,0,this.shape,this.shapeColor,1);
        drawCircleFrame(ctx,0,0,this.radius,"blue",1);

        drawCircleFrame(ctx,0,0,this.arrive_radius,"grey",1);
        drawRectangleFrame(ctx,-this.width/2,-this.height/2,this.width,this.height,"blue",1);
        
	}
    onDrawFluff(ctx)
	{
		//untranslated draw
        if( this.points.length)
        {
            this.points.forEach(point => {
                ctx.lineTo(point.x,point.y);

                drawCircleFrame(ctx, point.x, point.y, 5, "red", 2);
            });
        }
        
	}
    onThink()
    {
    }
    onOldThink()
    {

        //The ship's 3 movement controls, rotation direction, straffe and forward-back variables. all can be set from -1 to 1, fractions allowed for smoother movement
        var rotdir = 0;
        var straffe = 0;
        var forbk = 0;
        
        //dampening
        //apply a spin fraction the opposite direction
        this.spin+=-this.spin*.05;
        //apply a inverted fraction of the velocity
        this.vel.add_self(this.vel.multiply(-1).divide_self(100));
        
        
        if(options.CONTROLMODE.WAYPOINTS.checked) //follow mouse or waypoint
        {
            
            // Set targetPos to random values
            this.targetPos.x = inputs.MOUSE.event.clientX /  globals.view.zoom.factor - world.pos.x;
            this.targetPos.y = inputs.MOUSE.event.clientY / globals.view.zoom.factor - world.pos.y;

            // Calculate the direction to the target
            const target = new Vector2D(this.targetPos.x, this.targetPos.y);
            const relativeTarget = target.subtract(new Vector2D(this.pos.x, this.pos.y));
            const distance = relativeTarget.length();
            const speed = 1; // 1 unit per second
            const timeToTarget = distance / speed;
            const requiredDeceleration = this.vel.lengthSquared / (2 * distance);
            const changeInVelocity = relativeTarget.normalize().multiplyScalar(requiredDeceleration * timeToTarget);
            const newVelocity = this.vel.add(changeInVelocity);

            // Update the position
            this.pos = this.pos.add(newVelocity);

            //get the mouse pos
            var targetX = inputs.MOUSE.event.clientX /  globals.view.zoom.factor - world.pos.x;
            var targetY = inputs.MOUSE.event.clientY / globals.view.zoom.factor - world.pos.y;

            //add the position to the waypoint if mouse is down
            if(inputs.MOUSE.RIGHT.pressed() || inputs.MOUSE.RIGHT.downTime()>100)
            {
                inputs.MOUSE.RIGHT.pressedStartTime = Date.now(); //make it trigger again and again 
                this.points.push(new Vector2D(targetX,targetY));
            }
            //there there are waypoints in the list
            if(this.points.length)
            {
                //git it, set target x/y to the first point
                targetX = this.points[0].x;
                targetY = this.points[0].y;
                //remove it if close enough
                if(vec2.setXY(targetX-this.pos.x,targetY-this.pos.y).magnitude()< this.arrive_radius)
                {
                    if(this.points.length>1) this.points.splice(0,1);
                }

                //so various cros/dots/angle diffs to convet the target direction to the 3 movement controlvariables
                var targetPos = new Vector2D(targetX,targetY);
                var targetVector= new Vector2D(targetPos.x-this.pos.x, targetPos.y-this.pos.y);
                var targetDistance = targetVector.magnitude();
                //convert that vector into movement control
                var targetDirection = targetVector.normalize_self();
                var facingDirection = vec2b.fromAngle(this.angle);
                var straffeDirection = vec2b.fromAngle(this.angle+90);
                

                const crossToTarget = -targetDirection.cross(facingDirection); //the more inline in front or back the more the value is 0, and to the side, -1 to 1
                rotdir = angleDiff(this.angle,targetDirection.toAngle()) / degToRad(45); //angledif makes for a more solid value/ plust we can tell the angle when max power from back to the side uo to +-45 degrees, ists 1 then goes to 0
                rotdir += crossToTarget*2; //boost the turn
                rotdir = Math.max(-1,Math.min(rotdir,1)); //cap to -1 -> 0 > 1
                straffe = targetDirection.dot(straffeDirection); //what is the dot to the side. the more aligned the more the value is 1

                //set the values
                straffe = straffe //* (Math.abs(straffe)>.3);
                forbk = targetDirection.dot(facingDirection);
                forbk = forbk //* (Math.abs(forbk)>.3);

                //lower the values using * 1 at arriveRadius... down to * 0 at distance 0
                this.arrive_radius = 200;
                var arriveFactor = Math.max(0,Math.min(targetDistance/this.arrive_radius,1));
                forbk*=arriveFactor;
                straffe*=arriveFactor;
                //also dampen the need to strafe with the need to turn
                straffe*=(Math.abs(crossToTarget));
                //same with the foreward/back
                forbk*=(1-Math.abs(crossToTarget));
            }
            

            
        }
        if(options.CONTROLMODE.WASDQE.checked) //wasd+qe
        {
            //keyboard qe rotate, ad straffe, ws forward/back
            rotdir = (inputs.E.down()-inputs.Q.down()); // -1 -> 0 -> 1
            straffe = (inputs.D.down()-inputs.A.down()); // -1 -> 0 -> 1
            forbk = (inputs.W.down()-inputs.S.down()); // -1 -> 0 -> 1
        }
        //do the engines from the 3 control variables
        {
            this.engines.forEach(engine => 
            {
                //TODO, IT's still not working right, rotating the engines with R. not all startes are detected all around
                /////////////////////////////////////
                //Turn the right engine on according to disired movement

                //Start with all Off
                engine.power = 0;
                engine.shapeColor="purple";
                var maxPower = 0;

                ////////////////////////////////////
                //rotate ship
                //Figure out the engines used to rotate for 
                //the engine facing direction
                var engineFacingDirection = vec2.fromAngle(engine.angle);
                //how much perpendiculart to the ship x axis is it? so we know if it's point towards the ship or way from it
                var perpOnX = engineFacingDirection.cross(vec2.fromAngle(0));
                //how much perpendiculart to the ship y axis is it? so we know if it's point towards the ship or way from it
                var perpOnY = engineFacingDirection.cross(vec2.fromAngle(90));


                ///////////////
                //Rotate Right
                //does this thruster contribute to right turning
                if((perpOnX<-.77 && engine.pos.x>0)     //it's cross on x > 1 and is right of ship axis on x (front of ship)
                    || (perpOnX>.77 && engine.pos.x<0) //it's cross on x < 1 and is left of ship axis on x (back of ship)
                    || (perpOnY<-.77 && engine.pos.y>0) //it's cross on y > 1 and is bellow of ship axis on y (back of ship)
                    || (perpOnY>.77 && engine.pos.y<0) //it's cross on y < 1 and is left of ship axis on y (back of ship)
                ) 
                {
                    engine.shapeColor="blue";
                    //apply thrust in that direction according the value of dir, if dir is turn right
                    engine.power = Math.max(Math.abs(perpOnX),Math.abs(perpOnY))  * rotdir * (rotdir > 0);
                    if(engine.power!== 0)
                    {
                        //for special effect
                        maxPower = Math.max(maxPower,engine.power);
                        //thrust
                        vec2a.y = 0; //only using x as thrust parameter the engine is facing right at angle 0
                        vec2a.x = engine.force*engine.power; //add the engine thrust at power set
                        vec2a.rotate_self(engine.angle+this.angle); //rotate the thrust to match angle

                        //apply where the engine is located on the ship
                        vec2b.x = engine.pos.x;
                        vec2b.y = engine.pos.y;

                        aImpulse.force = vec2a;
                        aImpulse.pos = vec2b;
                        this.addImpulse(aImpulse); //go
                    }
                }
                //Rotate Right
                ///////////////

                ///////////////
                //Rotate Left
                //does this thruster contribute to left turning
                
                if((perpOnX>.77 && engine.pos.x>0)     //it's cross on x > 1 and is right of ship axis on x (front of ship)
                    || (perpOnX<-.77 && engine.pos.x<0) //it's cross on x < 1 and is left of ship axis on x (back of ship)
                    || (perpOnY>.77 && engine.pos.y>0) //it's cross on y > 1 and is bellow of ship axis on y (back of ship)
                    || (perpOnY<-.77 && engine.pos.y<0) //it's cross on y < 1 and is left of ship axis on y (back of ship)
                ) 
                {
                    engine.shapeColor="red";
                    //apply thrust in that direction according the value of dir, if dir is turn left
                    engine.power = -(Math.max(Math.abs(perpOnX),Math.abs(perpOnY))  * rotdir * (rotdir < 0));
                    if(engine.power!== 0)
                    {
                        //for special effect
                        maxPower = Math.max(maxPower,engine.power);
                        //thrust
                        vec2a.y = 0; //only using x as thrust parameter the engine is facing right at angle 0
                        vec2a.x = engine.force*engine.power; //add the engine thrust at power set
                        vec2a.rotate_self(engine.angle+this.angle); //rotate the thrust to match angle

                        //apply where the engine is located on the ship
                        vec2b.x = engine.pos.x;
                        vec2b.y = engine.pos.y;

                        aImpulse.force = vec2a;
                        aImpulse.pos = vec2b;
                        this.addImpulse(aImpulse); //go
                    }
                }
                //Rotate Left
                ///////////////

                    
                //rotate end
                //////////////////////////////////

                //////////////////////////////////
                //Forward and back
                var dotForward = engineFacingDirection.dot(vec2.fromAngle(0));
                engine.power =  (Math.abs(dotForward) >.77) * (Math.sign(forbk) == Math.sign(dotForward)) * Math.abs(forbk);;
                if(engine.power!== 0)
                    {
                        //for special effect
                        maxPower = Math.max(maxPower,engine.power);
                        //thrust
                        vec2a.y = 0; //only using x as thrust parameter the engine is facing right at angle 0
                        vec2a.x = engine.force*engine.power; //add the engine thrust at power set
                        vec2a.rotate_self(engine.angle+this.angle); //rotate the thrust to match angle

                        //apply where the engine is located on the ship
                        vec2b.x = engine.pos.x;
                        vec2b.y = engine.pos.y;

                        aImpulse.force = vec2a;
                        aImpulse.pos = vec2b;
                        this.addImpulse(aImpulse); //go
                    }
                //end forward and back
                //////////////////////////////////

                //////////////////////////////////
                //Straffe
                var dotSideward = engineFacingDirection.dot(vec2.fromAngle(90));
                engine.power =  (Math.abs(dotSideward)>.77) * (Math.sign(straffe) == Math.sign(dotSideward)) * Math.abs(straffe);
               
                if(engine.power!== 0)
                    {
                        //for special effect
                        maxPower = Math.max(maxPower,engine.power);
                        //thrust
                        vec2a.y = 0; //only using x as thrust parameter the engine is facing right at angle 0
                        vec2a.x = engine.force*engine.power; //add the engine thrust at power set
                        vec2a.rotate_self(engine.angle+this.angle); //rotate the thrust to match angle

                        //apply where the engine is located on the ship
                        vec2b.x = engine.pos.x;
                        vec2b.y = engine.pos.y;

                        aImpulse.force = vec2a;
                        aImpulse.pos = vec2b;
                        this.addImpulse(aImpulse); //go
                    }
                //end strafe
                //////////////////////////////////

                //Tell the engine to use the lagest power we thrusted
                engine.power = maxPower;

                engine.angle+=degToRad(1) * (inputs.R.down());
                
            });
            
        }

    }
}

class Asteroid extends Entity
{
    constructor()
    {
        super();
        this.shape = [];
        //around a cicle, create points at random distances
        for(var i = 0; i < 360; i+=10)
        {
            var d = 4+Math.random() * 2;
            this.shape.push([d*Math.cos(degToRad(i)),d*Math.sin(degToRad(i))]);
        }
        this.shape.push(this.shape[0]); //last point same as first
        //random scale
        this.shape = scaleShape(5+Math.random() * 10, this.shape);
        this.setShape(this.shape);
        this.mass = this.radius*this.radius;
        this.shapeColor = "lime"
    }
    onDrawSelf(ctx)
	{
		//draw this around the 0,0 axis untranslated, unrotated, the transform are already applied in onDraw
		drawShape(ctx,0,0,this.shape,this.shapeColor,1);
        drawCircleFrame(ctx,0,0,this.radius,"blue",1);
        drawRectangleFrame(ctx,-this.width/2,-this.height/2,this.width,this.height,"blue",1);
	}
}

//var debugThing = world.addEntity(new Bullet());

var ship;
ship = world.addEntity(new Ship());

var ar = 400;
var a;
for(var i = 0; i< 10; i++)
{
    a = world.addEntity(new Asteroid());
    var d = 200+Math.random() * 200;
       

    a.pos.x = Math.cos(degToRad(i*36)) * d
    a.pos.y = Math.sin(degToRad(i*36)) * d
    a.spin = -2 + Math.random() * 4;
}



//error this shit