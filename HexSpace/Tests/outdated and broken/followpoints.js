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
    }
    onDrawSelf(ctx)
	{
		//draw this around the 0,0 axis untranslated, unrotated, the transform are already applied in onDraw
		drawShape(ctx,0,0,this.shape,"lime",1);
	}
}
class Ship extends Entity
{
    constructor()
    {
        super();
        this.setShape(rotateShape(degToRad(90), scaleShape(5,[[0,-2],[1.5,2],[0,1],[-1.5,2],[0,-2]])));
        this.mass = this.radius*this.radius;
        this.max_speed = 200;
        this.max_force = 200;
        this.slowing_distance = 200;
        this.points = [];
    }
    onDrawSelf(ctx)
	{
		//draw this around the 0,0 axis untranslated, unrotated, the transform are already applied in onDraw
		drawShape(ctx,0,0,this.shape,"blue",1);
        
        
	}
    onDrawFluff(ctx)
	{
		//untranslated draw
        if( this.points.length)
        {

            
            //ctx.strokeStyle = "lime";
            //ctx.lineWidth = 1;
            //ctx.beginPath();
            //ctx.moveTo(0,0);
            //ctx.lineTo(10,10);
            //ctx.lineTo(10,-10);
            //ctx.closePath();
            //ctx.stroke();

            //ctx.strokeStyle = "lime";
            //ctx.lineWidth = 1;
            //ctx.beginPath();
            //ctx.moveTo(this.points[0].x, this.points[0].y);
            this.points.forEach(point => {
                ctx.lineTo(point.x,point.y);

                drawCircleFrame(ctx, point.x, point.y, 5, "red", 2);
            });
            //ctx.closePath();
            //ctx.stroke();
        }
        
	}
    onThink()
    {
        
        if(inputs.MOUSE.event.clientX!=undefined)
        {
            //to mouse
            var targetX = inputs.MOUSE.event.clientX /  zoomFactor - world.pos.x;
            var targetY = inputs.MOUSE.event.clientY / zoomFactor - world.pos.y;

            //or to waypoint if one exists
            if(this.points.length)
            {
                //git it
                targetX = this.points[0].x;
                targetY = this.points[0].y;
                //remove it if close enough
                if(vec2.setXY(targetX-this.pos.x,targetY-this.pos.y).magnitude()< 50)
                {
                    this.points.splice(0,1);
                }
               
                
            }
            
            //drive towards point/mouse

            var targetPos = new Vector2D(targetX,targetY);
            
            

            //stearing behaviour
            //https://www.red3d.com/cwr/steer/gdc99/

            //target_offset = target - position
            //distance = length (target_offset)
            //ramped_speed = max_speed * (distance / slowing_distance)
            //clipped_speed = minimum (ramped_speed, max_speed)
            //desired_velocity = (clipped_speed / distance) * target_offset
            //steering = desired_velocity - velocity

            //target_offset = target - position
            var target_offset = targetPos.subtract(this.pos);
            //distance = length (target_offset)
            var distance = target_offset.magnitude();
            //ramped_speed = max_speed * (distance / slowing_distance)
            var ramped_speed = this.max_speed * (distance/this.slowing_distance);
            //clipped_speed = minimum (ramped_speed, max_speed)
            var clipped_speed = Math.min(ramped_speed, this.max_speed);
            //desired_velocity = (clipped_speed / distance) * target_offset
            var desired_velocity = target_offset.multiply(clipped_speed / distance);
            //steering = desired_velocity - velocity
            var steering_direction = desired_velocity.subtract(this.vel);
            
            //it started to look messy when I added code to make it turn to thrust against its drift with cross
            //anyway, this crap will do for now
            //steering_force = truncate (steering_direction, max_force)
            var steering_force = steering_direction;
            if(steering_force.magnitude()>this.max_force)
            {
                steering_force.normalize_self().multiply_self(this.max_force);
            }
            //acceleration = steering_force / mass
            var acceleration = steering_force.divide(this.mass);
            //velocity = truncate (velocity + acceleration, max_speed)
            //this.vel.add_self(acceleration);
            //if(this.vel.magnitude()>this.max_speed)
            //{
            //    //this.vel.normalize_self().multiply_self(this.max_speed);
            //}
            
            //we add cross product to over steer
            var cross = target_offset.normalize().cross(this.vel.normalize());
            
            
            var desired_angle = target_offset.toAngle() - cross*2;
            var adif = angleDiff(this.angle,desired_angle);
            this.spin = adif * 2;
            //add the cross product to the mix to counter straffing
            //the more perpendicual the ship angle is to the desired direction, the more it will overturn and add motion relative to how off it is
            acceleration.add(vec2.fromAngle_self(this.angle).multiply_self(Math.abs(cross) * this.max_force) /this.mass);
            this.vel.add_self(acceleration);

            if(inputs.MOUSE.LEFT.pressed())
            {
                //create a bullet at speed 10 + whatever the the ship is drifting
                var bullet = world.addEntity(new Bullet());
                bullet.pos = this.pos.clone();
                bullet.angle = this.angle;
                bullet.vel = this.vel.clone();
                bullet.vel.add_self(vec2.fromAngle_self(this.angle).multiply_self(100));
            }


            if(inputs.MOUSE.RIGHT.pressed() || inputs.MOUSE.RIGHT.downTime()>200)
            {
                inputs.MOUSE.RIGHT.pressedStartTime = Date.now(); //make it trigger again and again 

                this.points.push(new Vector2D(inputs.MOUSE.event.clientX /  zoomFactor - world.pos.x,
                                            inputs.MOUSE.event.clientY / zoomFactor - world.pos.y));
            }
        }
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