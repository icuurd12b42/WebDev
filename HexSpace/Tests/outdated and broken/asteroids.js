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
        addInput("W");
        addInput("A");
        addInput("S");
        addInput("D");
        addInput("SPACE");
        super();
        this.setShape(rotateShape(degToRad(90), scaleShape(5,[[0,-2],[1.5,2],[0,1],[-1.5,2],[0,-2]])));
        this.thrustDir = new Vector2D; //we reuse this instead of abusing the garbage collector with new vectors each step
        this.thrustForce = 0;
        this.mass = this.radius*this.radius;
    }
    onDrawSelf(ctx)
	{
		//draw this around the 0,0 axis untranslated, unrotated, the transform are already applied in onDraw
		drawShape(ctx,0,0,this.shape,"blue",1);
	}
    onThink()
    {
        //turn
        this.spin = (inputs.D.down()-inputs.A.down()) * 5; //5 -> 0 -> -5
        //thrust strenght
        this.thrustForce = (inputs.W.down()*1)-(inputs.S.down()*.5); //1 -> 0 -> -0.5
        
        //set thrust vector in the direction of angle at the thurst force
        this.thrustDir.fromAngle_self(this.angle).multiply_self(this.thrustForce); //{1,0,0} -> {0,0,0} -> {-0.5,0,0}

        //and add to vel
        this.vel.add_self(this.thrustDir);
        
        if(inputs.SPACE.released())
        {
            //create a bullet at speed 10 + whatever the the ship is drifting
            var bullet = world.addEntity(new Bullet());
            bullet.pos = this.pos.clone();
            bullet.angle = this.angle;
            bullet.vel = this.vel.clone();
            bullet.vel.add_self(vec2.fromAngle_self(this.angle).multiply_self(100));
        }
    }
    
}


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