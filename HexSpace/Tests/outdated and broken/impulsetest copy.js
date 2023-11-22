//impulsetest.js
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

        

        addInput("W");
        addInput("A");
        addInput("S");
        addInput("D");

        addInput("Q");
        addInput("E");

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
            this.points.forEach(point => {
                ctx.lineTo(point.x,point.y);

                drawCircleFrame(ctx, point.x, point.y, 5, "red", 2);
            });
        }
        
	}
    onThink()
    {
        var mode = "impulse main thrusters & tip & tail thrusters thrust rotate & dampen";
        if(mode === "impulse main thrusters & Spin") 
        {
            //rotate with spin directly, use impulse function for thrust
            var lr = (inputs.D.down()-inputs.A.down()); // -1 -> 0 -> 1
            var ud = (inputs.W.down()-inputs.S.down()); //ditto
            
            //rotate
            this.spin+=lr/20; //+= -.02 -> 0 -> .02
            vec2a.y = 0; //only using x as thrusts parameter as ship is facing right at 0 angle
            vec2a.x = ud * 200; //set the x to -200 -> 0 -> 200, for thrust
            vec2a.rotate_self(this.angle); //rotate the thrust to match angle

            //apply dead center on the ship centerMass
            vec2b.x = this.centerMass.x;
            vec2b.y = this.centerMass.y;

            aImpulse.force = vec2a;
            aImpulse.pos = vec2b;
            this.addImpulse(aImpulse); //go
        }
        if(mode === "impulse main thrusters & Spin & dampen") 
        {
            //rotate with spin directly, use impulse function for thrust

            //But first apply the dampening
            //apply a spin fraction the opposite direction
            this.spin+=-this.spin*.05;
            //apply a inverted fraction of the velocity
            this.vel.add_self(this.vel.multiply(-1).divide_self(100));

            var lr = (inputs.D.down()-inputs.A.down()); // -1 -> 0 -> 1
            var ud = (inputs.W.down()-inputs.S.down()); //ditto

            //rotate
            this.spin+=lr/10; //+= -.1 -> 0 -> .1

            //thrust
            vec2a.y = 0; //only using x as thrusts parameter as ship is facing right at 0 angle
            vec2a.x = ud * 200; //set the x to -200 -> 0 -> 200, for thrust
            vec2a.rotate_self(this.angle); //rotate the thrust to match angle

            //apply dead center on the ship centerMass
            vec2b.x = this.centerMass.x;
            vec2b.y = this.centerMass.y;

            aImpulse.force = vec2a;
            aImpulse.pos = vec2b;
            this.addImpulse(aImpulse); //go

        }
        if(mode === "impulse main thrusters & tip thuster rotate & dampen") 
        {
            //use impulse to rotate with a lateral truster at the nose of the ship, and impulse to move 
            //more like straffing than turning

            //But first apply the dampening
            //apply a spin fraction the opposite direction
            this.spin+=-this.spin*.05;
            //apply a inverted fraction of the velocity
            this.vel.add_self(this.vel.multiply(-1).divide_self(100));


            var lrt = (inputs.E.down()-inputs.Q.down()); // -1 -> 0 -> 1
            //old rotate with Q E to test
            this.spin+=lrt/10; 

            var lr = (inputs.D.down()-inputs.A.down()); // -1 -> 0 -> 1
            var ud = (inputs.W.down()-inputs.S.down()); //ditto

            //rotate using tip lateral truster
            vec2a.y = lr * 200; //set the x to -200 -> 0 -> 200, for thrust
            vec2a.x = 0; //only using y as tip rotating thrusts parameter as ship is facing right at 0 angle
            vec2a.rotate_self(this.angle); //rotate the thrust to match angle

            //position of tip truster is x10,y0, but it too close it will push the ship, to 100 to prove a point
            vec2b.x = 100;
            vec2b.y = 0;
            aImpulse.force = vec2a;
            aImpulse.pos = vec2b;
            this.addImpulse(aImpulse); //go



            //thrust
            vec2a.y = 0; //only using x as thrusts parameter as ship is facing right at 0 angle
            vec2a.x = ud * 200; //set the x to -200 -> 0 -> 200, for thrust
            vec2a.rotate_self(this.angle); //rotate the thrust to match angle

            //apply dead center on the ship centerMass
            vec2b.x = this.centerMass.x;
            vec2b.y = this.centerMass.y;

            aImpulse.force = vec2a;
            aImpulse.pos = vec2b;
            this.addImpulse(aImpulse); //go

        }
        if(mode === "impulse main thrusters & tip & tail thrusters thrust rotate & dampen") 
        {
            //use impulse to rotate with a lateral truster at the nose of the ship, and impulse to move 
            //proper turning whe ther are 2 truster opposit sides for turning

            //But first apply the dampening
            //apply a spin fraction the opposite direction
            this.spin+=-this.spin*.05;
            //apply a inverted fraction of the velocity
            this.vel.add_self(this.vel.multiply(-1).divide_self(100));


            var lrt = (inputs.E.down()-inputs.Q.down()); // -1 -> 0 -> 1
            //old rotate with Q E to test
            this.spin+=lrt/10; 

            var lr = (inputs.D.down()-inputs.A.down()); // -1 -> 0 -> 1
            var ud = (inputs.W.down()-inputs.S.down()); //ditto

            //here we can put the truster back to the physical location and boost the power instead
            //rotate a-d using tip lateral truster
            vec2a.y = lr * 4000; //set the x to -200 -> 0 -> 200, for thrust
            vec2a.x = 0; //only using y as tip rotating thrusts parameter as ship is facing right at 0 angle
            vec2a.rotate_self(this.angle); //rotate the thrust to match angle

            //position of tip truster is x10,y0 unrotated
            vec2b.x = 10;
            vec2b.y = 0;
            aImpulse.force = vec2a;
            aImpulse.pos = vec2b;
            this.addImpulse(aImpulse); //go

            //rotate using rear tip lateral truster
            vec2a.y = lr * 4000; //set the x to -2000 -> 0 -> 2000, for thrust
            vec2a.x = 0; //only using y as tip rotating thrusts parameter as ship is facing right at 0 angle
            vec2a.rotate_self(this.angle); //rotate the thrust to match angle

            //position another at the read 
            vec2b.x = -10;
            vec2b.y = 0;
            aImpulse.force = vec2a.multiply_self(-1); //inverse of the other one
            aImpulse.pos = vec2b;
            this.addImpulse(aImpulse); //go

            //thrust
            vec2a.y = 0; //only using x as thrusts parameter as ship is facing right at 0 angle
            vec2a.x = ud * 200; //set the x to -200 -> 0 -> 200, for thrust
            vec2a.rotate_self(this.angle); //rotate the thrust to match angle

            //apply dead center on the ship centerMass
            vec2b.x = this.centerMass.x;
            vec2b.y = this.centerMass.y;

            aImpulse.force = vec2a;
            aImpulse.pos = vec2b;
            this.addImpulse(aImpulse); //go

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