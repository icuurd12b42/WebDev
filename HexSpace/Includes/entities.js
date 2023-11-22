"use strict";

class Impulse
{
	constructor()
	{
		this.pos = null// Vector2D(0, 0); //where to perform the impulse on the entity, entity relative, does not need rotating
		this.force = null// Vector2D(0, 0); //the impulse force, needs rotating to entiy's this.angle
	}
}

//a few stub impulse objects to use as temps
var aImpulse = new Impulse();
var bImpulse = new Impulse();
var cImpulse = new Impulse();
var dImpulse = new Impulse();
var eImpulse = new Impulse();
var fImpulse = new Impulse();
var gImpulse = new Impulse();

function _nothing() {;};

class Entity {
	constructor() 
	{
		//Identifiers
		this.id = newID();
		this.entityType = "ENTITY";
		
		//physical attibutes
		this.pos = new Vector2D(0, 0); 
		this.vel = new Vector2D(0, 0); 
		this.angle = 0; //remember angle 0 is facing right and *-90 is up *90 is down 180 is left. *angle are in radians though
		this.spin = 0; //the spin speed of angle
		
		this.parent = null; //parent container
		this.mass = 1; //mass of the entity
		this.centerMass = new Vector2D(0, 0); //AKA the pivot point
		this.materialFriction = .5; // and so on
		this.restitution = .5;
		this.entities = [];
		this.solid = true;
		//specifies if the instance is visible
		this.visibleSelf = true;
		//specifies if the children should be visible
		this.visibleChildren = true;
		//specifies if the fluff should be visible
		this.visibleFluff = true;

		this.shapeColor = "gray";

		//setShape will set this the longest axis position from 0,0, to encompass the shape event rotated;
		this.radius = 8; // the radius of the shape at all angles
		//min/max of the shape point, defining a rectangle, setshape will modify this
		this.minX = -this.radius;
		this.minY = -this.radius;
		this.maxX = this.radius;
		this.maxY = this.radius;
		//the exact width and height of the shape, unrotated. so does not resize by angle to encompase the entire shape
		this.width = this.radius*2;
		this.height = this.radius*2;
		this.mass = this.width*this.height; //mass per volume, per area in 2d space, assume 1kg unit per pixel/world unit.
		this.postDrawHook = _nothing;

		//this.shape = [];
		this.setShape([[-8,-8],[8,-8],[8,8],[-8,8],[-8,-8]])
		
		//TODO Verify what happens when children have children. 

		//physics engine setting for if the entity is a parent physics container


		//changing any of these value to a setting too difficult to compute, may cause the browser to hang
		//AND SO BEWARE that if you HAVE CHILD ENTITY that ALSO DOES PHYSICS inside another entity that does physics, the settings multiply
		//by proxy of the modified delta time and reach the compute limit cascadinly fast


		//this value propagates through the hiarchal/parental chain by proxi of the modified delta time passed by the parent
		//so setting the main parent to 2 and a children to 2 would make the children's children simulation run 4 times smaller in step
		//which can exponentialy slow things down

		//this is used to set the limit of the binary search when it reaches a value too small to matter in context of the application
		this.physicsRewindBail = 1/2/2/2/2/2/2/2; // about 7% error is acceptable. I'm using 1/2/2s to reflect the nature of its use in binary search. 
		//count the 2's and see the max number of times the code will move the instances to find the collision edge of interseting instances.
		//A larger number of halving (/2)s reduced the gap between instance to most exactly match the collision edge. 
		//You can increase it if you zoom in and start to see anoying gaps betweiin colliding instances... at the cost of slower execution. 
		//the precision of the rewind has little to do with the physics at that level

		//this is also used to bail out of the physics loop if it cought in an unresolvable state...
		this.physicsRewindBailCount = 8; //log2 should rarely reach 8 tries, default 8, matches in tries the default this.physicsRewindBail
		// you can use this as a simple way to limit how many times the rewind preforms its binary search. It is easier to use this as a precision selection, 
		// say as a zoom factor, than playing with physicsRewindBail's value.

		//this is the number of simulation steps to take each game frame
		this.physicsNumSteps = 1; //integer 1 or more. 2 would mean perform 2 small simulations per step instead of a single one
		//repeat(physicsNumSteps) pos+= vel*currentdt/physSteps;

		//this makes sure that if the frame rate drop lower than this, the simulation will use this value instead, 
		//so if your frame rate drops to 10 fps it will use not try to simulate with a huge delta time causing large instance jumps when moving
		this.physicsMinFPS = 30; //limit to 30 sims per seconds. 
		
	}


	addEntity(e) 
	{
		if(exists(e.parent))
		{
			e.parent.removeEntity(e);
		}
		this.entities.push(e); // add an entity to the array
		e.parent = this;
		return e; //return the argument so we can chain the functions call. eg t.addEntity(new entity()).solid = false
	}

	removeEntity(e)
	{
		for(var i = 0; i<this.entities.length; i++)
		{
			if(this.entities[i].id === e.id)
			{
					myArray.splice(i, 1);
				break;
			}
		}
		e.parent = null;
	}

	setShape(s) //a shape is a set of points pairs, defined around the 0,0 axis. see constructor default
	{
		this.radius = 0;
		this.shape = [];
		this.minX = Infinity;
		this.minY = Infinity;
		this.maxX = -Infinity;
		this.maxY = -Infinity;
		s.forEach(pair => {
			//the radius is the largest value, furthest x or y from 0,0
			this.radius = Math.max(this.radius,Math.max(Math.abs(pair[0]),Math.abs(pair[1])));
			this.shape.push(pair);
			this.minX = Math.min(this.minX,pair[0]);
			this.maxX = Math.max(this.maxX,pair[0]);
			this.minY = Math.min(this.minY,pair[1]);
			this.maxY = Math.max(this.maxY,pair[1]);
		});
		this.width = this.maxX-this.minX;
		this.height = this.maxY-this.minY;
		this.mass = this.width*this.height; //mass is area in 2d 
	}
	onThinkSelf()
	{
		//your logic code in your object goes here
	}

	onThink()
	{
		this.onThinkSelf();
		this.entities.forEach((entity) => {
			entity.onThink();
		});
	}

	// Description: Draws the entity on cavas.
    // e has event detail and ctx.
    // e.ctx: CanvasRenderingContext2D, the rendering context to draw on, translated and rotated
    // see the call to world.onDraw() in main.js for detail about the event
    // e.camera
    // Returns: void
    // Example: none
	onDrawSelf(e)
	{
		//draw this around the 0 axis untranslated, unrotated, the transform are already applied in on draw
		if(options.DEBUG.DRAWRADIUS.checked) drawCircleFrame(e.ctx,0,0,this.radius,"orange",1/e.camera.zoomFactor);
		if(options.DEBUG.DRAWRECTANGLE.checked) drawRectangleFrame(e.ctx,-this.width/2,-this.height/2,this.width,this.height,"orange",1/e.camera.zoomFactor);
		if(options.DEBUG.DRAWSHAPE.checked) drawShape(e.ctx,0,0,this.shape,this.shapeColor,1/e.camera.zoomFactor);
		
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
		;
	}
	//retuns if an instance is inside the view. radius check is used since the call can be done in 
	//translated/rotated drawing context so it's simplest to deal with is with circles intercting check
	inView(camera)
	{
		return camera.pos.distance(this.pos) < camera.radius+this.radius;
	}
	//use the _self, do touch this
	onDraw(e) 
	{
		//draw stuff other than the ship
		if((this.visibleFluff || options.DEBUG.DRAWINVISIBLEFLUFF.checked))
			this.onDrawFluff(e);
		// save the current canvas state
		e.ctx.save();
		// translate the canvas to the world position
		e.ctx.translate(this.pos.x, this.pos.y);
		// rotate the canvas around the world position
		e.ctx.rotate(this.angle);
		//var s = transformShape(this.pos, this.angle, this.shape);
		//drawShape(ctx,0,0,s,"red",2);

		if((this.visibleSelf || options.DEBUG.DRAWINVISIBLES.checked) && (this.inView(e.camera) || options.DEBUG.DRAWOUTOFVIEW.checked))
			this.onDrawSelf(e);

		// loop through the array of entities and call onDraw on each entity
		if(this.visibleChildren || options.DEBUG.DRAWINVISIBLECHILDREN.checked)
		{
			this.entities.forEach((entity) => {
				entity.onDraw(e);
			});
		}
		// restore the canvas to the saved state
		e.ctx.restore();
	}

	//this allows drawing things at the end of a scene. 
	onPostDraw(e) 
	{
		this.postDrawHook(e); //specifically through a hook function so you can have the ability to hook a game step code without a class. see example 08
		
		this.entities.forEach((entity) => {
				entity.onPostDraw(e);
			});
		
	}

	sortEntities()
	{
		//sort on left edge of the entity
		this.entities.sort(function(e1, e2) {
			return (e1.pos.x-e1.radius) - (e2.pos.x-e2.radius);
		});
	}

	entitiesOverlapRadius(e1, e2) 
	{
		

		//checks if a and b overlaps		
		const tr = e1.radius+e2.radius;
		//start with rect
		if(Math.abs(e1.pos.y-e2.pos.y) <= tr && Math.abs(e1.pos.x-e2.pos.x) <=tr)
		{

			//a little more with the radius TODO, Check if it even helps (it don't)
			if ((Vecc2g.setXY(e1.pos.x - e2.pos.x, e1.pos.y - e2.pos.y)).magnitude() <= tr)
			{
				return true;
			}

		}
		return false;
	}
	entitiesOverlap(e1, e2) 
	{
		

		//checks if a and b overlaps		
		const tr = e1.radius+e2.radius;
		//start with rect
		if(Math.abs(e1.pos.y-e2.pos.y) <= tr && Math.abs(e1.pos.x-e2.pos.x) <=tr)
		{

			//a little more with the radius TODO, Check if it even helps (it don't)
			//if ((new Vector2D(e1.pos.x - e2.pos.x, e1.pos.y - e2.pos.y)).magnitude() <= tr)
			{
				return shapesOverlap(e1.pos, e1.angle, e1.shape, e2.pos, e2.angle, e2.shape);
			}

		}
		return false;
	}
	entitiesWouldOverlap(e1, e2) 
	{
		//same as above but taking the movement into consideration to ignore inatance going away each other.
		//checks if a and b overlaps		
		const tr = e1.radius+e2.radius;
		//start with rect
		if(Math.abs(e1.pos.y-e2.pos.y) <= tr && Math.abs(e1.pos.x-e2.pos.x) <=tr)
		{
			
			if(this.entitiesTowards(e1,e2))
			{
				
				return shapesOverlap(e1.pos, e1.angle, e1.shape, e2.pos, e2.angle, e2.shape);
			}
			//else
			{
			//	DebugText.innerText="AWAY";
			}

		}
		return false;
	}
	entitiesTowards(e1,e2)
	{
		//the next location
		const e1nv = e1.vel.normalize();
		const e2nv = e2.vel.normalize();
		const e1p1 =  e1.pos.add(e1nv);
		const e2p1 =  e2.pos.add(e2nv);

		//and a arbitrary location further in time
		const e1p2 =  e1.pos.add(e1nv.multiply(1.1));
		const e2p2 =  e2.pos.add(e2nv.multiply(1.1));

		//Compare if the distance separating them is growing
		const d1 = e1p1.subtract(e2p1).magnitude();
		const d2 = e1p2.subtract(e2p2).magnitude();
		

		return d1>=d2;
	}

	
	onMove(dt)
	{
		//dt can be negative on rewind
		//this.untangleEntities();

		var thisDT = Math.min(dt,1000/this.physicsMinFPS/1000);
		var stepDT = thisDT/this.physicsNumSteps;
		
		for (var stepAt = 0; stepAt< this.physicsNumSteps; stepAt++)
		{
			var dtPerformed = 0;
			var baillCount1 = this.physicsRewindBailCount;
			while(dtPerformed<stepDT && --baillCount1>0)
			{
				//move self
				const deltaPos = this.vel.multiply(stepDT);
				//this.pos.add_self(deltaPos);
				this.pos = this.pos.add_self(deltaPos);
				this.angle += this.spin * stepDT;

				//perform the children moving, and rewinding if collisions
				this.sortEntities(); //sort entities on position so the intersecting instance are next to each other in the list

				var baillCount2 = this.physicsRewindBailCount;
				var done = false;
				var binarySearchFraction = 1;
				var overlapFound = false;
				var thisStep = stepDT;
				var resolvingImpact = false;
				
				var e1 = null;
				var e2 = null;	
				while(!done)
				{
					dtPerformed+=thisStep;
					this.entities.forEach((entity) => {
						entity.onMove(thisStep);
					});
					for (var i = 0; i < this.entities.length; i++) 
					{
						const a = this.entities[i];
						for (var j = i + 1; j < this.entities.length; j++) 
						{
							const b = this.entities[j];
							if(a.pos.x-a.radius > b.pos.x +b.radius)
							{
								break; //break to next instance of i if no longer in collision range in the sorted list 
							}
							//even though the first found in the array may not be the insance that collided first/most...
							if (a.solid == true && b.solid == true && this.entitiesOverlap(a, b)) 
							{
								//... the rewind should eventually resolve so that the last set of intersecting instance
								// found during each rewind and forward steps should be the first pair that ever collided...
								e1 = a;
								e2 = b;
								//...as long as this is comented out
								//if(resolvingImpact == false)
								{
									///... the rewind should eventually resolve to the last touching instance pair
									thisStep = -Math.abs(thisStep/2)
									dtPerformed += thisStep;

									//half the fraction
									binarySearchFraction/=2; 
									//reduce the stepFraction to next between value; current + 1/2 of what remains then 1/2 of that and so on. never reaching
									resolvingImpact = true;
									overlapFound = true;
								}
								
								break; //just break on the first found. 
							}
						}
						if(overlapFound) break;
					}
					if(resolvingImpact && !overlapFound)
					{
						thisStep = Math.abs(thisStep/2);
						binarySearchFraction/=2;
					}
					//done if reach limit or the physics step found no collision to rewind;
					done = baillCount2-- < 1 || binarySearchFraction<this.physicsRewindBail || !resolvingImpact ;
				}
				
				if (resolvingImpact) 
				{
					this.entitiesCollide(e1,e2);
					//setup stepDT to finish off step in full
					stepDT = stepDT+dtPerformed;
				}
			}
		}

	}
	
	entitiesCollide(e1,e2) {
	
		const e1speed = e1.vel.magnitude()/2 + 1;
		const e2speed = e2.vel.magnitude()/2 + 1;
		//do default ball collision for now
		this.collisionBalls(e1,e2);
		if(this.entitiesOverlap(e1,e2))
		{
			//if the entities are still touching, move them away each other
			const centerPos = Vecc2a.set(e1.pos).add_self(e2.pos).div(2);
			//in opposite directions
			const e1norm = e1.pos.sub(centerPos).norm();
			const e2norm = e2.pos.sub(centerPos).norm();
			
			// do is by maximum .5 pixels at a time so it's not noticeable
			// and use the mass between the 2 to fivus how musch one pushes the other
			//calculate the displacement ratios from mass, use a vect2d to do the math
			const ratios = Vecc2b.setXY(e1.mass,e2.mass).norm();
			//move away e1 as pushed by e2
			e1.pos.add_self(e1norm.mul(ratios.y*.5)); //.y is e2's ratio
			//same for e2 as pushed by e1
			e2.pos.add_self(e2norm.mul(ratios.x*.5)); //.x is e1's ratio
		}
		//if the velocity is messed up, act like it worked by adding motion away each other
		if(this.entitiesTowards(e1,e2))
		{
			//stuck or catapulting each other, use the away direction but at the old speed
			Vecc2a.set(e1.pos).subtract_self(e2.pos).normalize_self();
			e1.vel = Vecc2a.multiply(e1speed);
			e2.vel = Vecc2a.multiply_self(-1).multiply(e2speed);
			
			
		}
		
	}

	//returns a list of objects in range up a number of instances matching maxResult
	//excludeIndex is the entity.id to exclude
	//will add a new variable to the entity... entity._nearest_d, the distance to pos
	//WARNING this.nearest() works on it's chidren's list
	//my example entities using this function use the world.nearest()
	//TODO: Do recursive search through hiearchy (scary)
	//TODO: re-add the sorted list walking method when your brain works properly

	nearest(pos,range, radius = 0, excludeIndex = -1)
	{
		
		/*
		for (var i = 0; i < this.entities.length; i++) 
		{
			const a = this.entities[i];
			//are we dealing with intance in range on x
			if(a.pos.x+a.radius>pos.x-range)
			{
				if(a.pos.x-a.radius<pos.x+range)
				{
					
					if(excludeIndex!=a.id)
					{
						const d = Vecc2g.setXY(a.pos.x-pos.x,a.pos.y-pos.y).magnitude()-a.radius;
						if(d<range)
						{
							a._d=d;
							ret.push(a);
						}
					}
				}
				else if(a.pos.x-a.radius>pos.x+range)
				{
					//since we are sorted on x-shapereadius axis we can now bail as the left edge of the last instance crossed over thr right ridge og the range
					break;
				}
			}
		}
		*/
		//now sort byt distance to pos... argh
		//sort on left edge of the entity

		const ret = [];
		for (var i = 0; i < this.entities.length; i++) 
		{

			const a = this.entities[i];
			if(a.id!==excludeIndex )
			{
				a._nearest_d = Vecc2g.setXY(a.pos.x-pos.x,a.pos.y-pos.y).magnitude()-a.radius-radius;
				if(a._nearest_d<range)
				{
					ret.push(a);
				}
			}
		}
		ret.sort(function(e1, e2) 
		{
			return (e1._d) - (e2._d)
		});
		return ret;
	}
	//like nearest, but this one returns every entirin that pos is inside of
	entitiesAtPos(pos,excludeIndex=-1, extra_radius=0)
	{
		const ret = [];
		for (var i = 0; i < this.entities.length; i++) 
		{
			const a = this.entities[i];
			if(a.id!==excludeIndex )
			{
				a._entitiesAtPos_d = Vecc2g.setXY(a.pos.x-pos.x,a.pos.y-pos.y).magnitude()-a.radius-extra_radius;
				if(a._entitiesAtPos_d<=0)
				{
					ret.push(a);
				}
			}
		}
		ret.sort(function(e1, e2) 
		{
			return (e1._d) - (e2._d)
		});
		return ret;
	}
	untangleEntities(numpass = 1000)
	{
		
		const arrlen = this.entities.length;
		//now loop through and check if the neighbours in the pos.x sorted array touch
		var done = false;
		var numLoops = 0;
		var dir = new Vector2D(0,0);
		while(!done && numLoops < numpass)
		{
			done = true;
			for (var i = 0; i < arrlen; i++) {
				for (var j = i + 1; j < arrlen; j++) {
					if (this.entitiesOverlap(this.entities[i], this.entities[j])) {
						var a =this.entities[i];
						var b = this.entities[j];
						var xc = (a.pos.x+b.pos.x)/2;
						var yc = (a.pos.y+b.pos.y)/2;
						
						dir.x = a.pos.x-xc;
						dir.y = a.pos.y-yc;
						
						if(dir.x == 0 && dir.y == 0)
						{
							dir.x = -1+Math.random() + 2;
							dir.y = -1+Math.random() + 2;
						}
						dir.normalize_self();
						
						dir.multiply_self(a.radius)
						
						done = false;
						var numLoops2 = 0;
						for (var k = 0; k < arrlen; k++) 
						{
							if (k !=i && this.entitiesOverlap(a, this.entities[k])) 
							{
								a.pos.add_self(dir);
							}
						}	
					}
				}
			}
			numLoops++;
		}
		
	}

	addImpulse(imp)
	{
		//Calculate the point of contact in world/this instance's coordinates
		const contactPoint = this.pos.add(this.centerMass.rotate(this.angle)).add(imp.pos.rotate(this.angle));

		//Calculate the linear impulse
		const linearImpulse = imp.force.multiply(1 / this.mass);

		//Apply the linear impulse
		this.vel = this.vel.add(linearImpulse);

		//Calculate the angular impulse
		const r = contactPoint.subtract(this.pos);
		const torque = r.cross(linearImpulse);
		const angularImpulse = torque / (this.mass / 2);

		//Apply the angular impulse
		
		this.spin += angularImpulse;
		
	}

	collisionBalls(ball1,ball2)
	{
		const restitution = Math.max(ball1.restitution, ball2.restitution);

		// Calculate the point of contact
		//const contactPoint = ball1.pos.add(ball2.pos).multiply(0.5);
		const contactPoint = Vecc2a.setXY(ball1.pos.x-ball2.pos.x,ball1.pos.y-ball2.pos.y).normalize_self().multiply_self(ball1.radius).add_self(ball1.pos);
		// Calculate the collision normal
		const collisionNormal = Vecc2b.set(ball2.pos).subtract_self(ball1.pos).normalize_self();

		// Calculate the relative velocity
		const relativeVelocity = Vecc2c.set(ball2.vel).subtract_self(ball1.vel);

		// Calculate the impulse magnitude
		const impulseMagnitude = -(1 + restitution) * relativeVelocity.dot(collisionNormal) / ((1 / ball1.mass) + (1 / ball2.mass));
		
		// Create the impulses
		aImpulse.pos = contactPoint
		aImpulse.force = collisionNormal.multiply(-impulseMagnitude);
		ball1.addImpulse(aImpulse);
		aImpulse.pos = contactPoint
		aImpulse.force = collisionNormal.multiply(impulseMagnitude);
		ball2.addImpulse(aImpulse);

		const MAX_SPIN = degToRad(45);
		if (Math.abs(ball1.spin) > MAX_SPIN) {
			ball1.spin = Math.sign(ball1.spin) * MAX_SPIN;
		  }
		if (Math.abs(ball2.spin) > MAX_SPIN) {
			ball2.spin = Math.sign(ball2.spin) * MAX_SPIN;
		  }
	}
	
}

	
	
/*
	onStep(dt) {

		//sort the array of entities on x and acquire some data for the spacial indexing
		this.sortEntities();
		this.untangleEntities();
		
		
		var e1 = null, e2 = null;
		var done = false;
		var loopct = 0;
		var thisdt = dt;
		var overlaps = false;
		//perform the step, and rewind is collisions
		while (!done) {
			// loop through the array of entities and call onStep on each entity
			this.entities.forEach((entity) => {
				entity.onStep(thisdt);
			});
			const arrlen = this.entities.length;
			overlaps = false;
			//now loop through and check if the neighbours in the pos.x sorted array touch
			for (var i = 0; i < arrlen; i++) {
				for (var j = i + 1; j < arrlen; j++) {
					if (this.entitiesOverlaps(this.entities[i], this.entities[j])) {
						//if they touch set the dt to -half, which will cause the instances to rewind
						thisdt = -Math.abs(thisdt);
						e1 = this.entities[i];
						e2 = this.entities[j];
						
						overlaps = true;
						break;
					}
				}
				if (overlaps) break;
			}
			if (!overlaps && thisdt !== dt) //whe did not overlap doing a rewind but the last intersect check yielded no collision
			{
				thisdt = Math.abs(thisdt) / 2; //so now we set the dt to half again but going forward
			}
			loopct++; //deadlock prevention
			done = !overlaps || loopct > 8 || Math.abs(thisdt) < .0001; //we are done when the dt is too small or when the failsave triggers or there was never an overlaped instance
		}
		if(e1!==null && e2!==null)
		{
			this.entitiesCollide(e1,e2);
		}
		

		this.angle += this.spin * dt;
		//clear the active grid
		//this.clearGrid(); 
		//swap the Future Grid to be the active one
		//this.gridSwap();
	
	}
	untangleEntities(numpass = 10000)
	{
		const arrlen = this.entities.length;
		//now loop through and check if the neighbours in the pos.x sorted array touch
		var done = false;
		var numLoops = 0;
		
		while(!done && numLoops < numpass)
		{
			done = true;
			for (var i = 0; i < arrlen; i++) {
				for (var j = i + 1; j < arrlen; j++) {
					if (this.entitiesOverlaps(this.entities[i], this.entities[j])) {
						//if they touch set the dt to -half, which will cause the instances to rewind
						
						const e1 = this.entities[i];
						const e2 = this.entities[j];

						//get the distance and direction by which the 2 entities are separated
						var dist = new Vector2D(e1.pos.x - e2.pos.x, e1.pos.y - e2.pos.y);
						const distMagnitude = dist.magnitude();
						
						if(distMagnitude === 0)
						{
							dist.x=-.5+Math.random();
							dist.y=-.5+Math.random();
							
						}

						// Calculate the direction of the collision
						const collisionDirection = dist.normalize();

						const minDist = e1.radius + e2.radius;

						//did the rewind fail? Still intersecting
						if(distMagnitude<minDist+1)
						{
							
							//we still need to force the object apart from each other by the intersecting amount
							const moveApart = collisionDirection.multiply((1+minDist-distMagnitude)/2);
							
							e1.pos.add_self(moveApart);
							e2.pos.subtract_self(moveApart);
							done = false;
						}
					}
				}
			}
			numLoops++;
		}
	}
	
	entitiesCollide(e1,e2) {

		//get the distance and direction by which the 2 entities are separated
		const dist1 = new Vector2D(e1.pos.x - e2.pos.x, e1.pos.y - e2.pos.y);
		const dist2 = new Vector2D(e2.pos.x-e1.pos.x, e2.pos.y, e1.pos.y);


 		// Calculate the direction of the collision
		const collisionDirection = dist1.normalize();
		

		// Calculate the component of the velocity along the collision direction
		const e1VelAlongDirection = collisionDirection.dot(e1.vel);
		const e2VelAlongDirection = collisionDirection.dot(e2.vel);

		// Calculate the total mass of the balls
		const totalMass = e1.mass + e2.mass;

		// Calculate the new velocities of the balls after the collision
		const e1VelAfterCollision = collisionDirection
			.multiply((e1VelAlongDirection * (e1.mass - e2.mass) + (1 + e1.restitution) * e2.mass * e2VelAlongDirection) / totalMass)
			.add(new Vector2D(e1.vel.x - collisionDirection.x * e1VelAlongDirection, e1.vel.y - collisionDirection.y * e1VelAlongDirection));

		const e2VelAfterCollision = collisionDirection
			.multiply((e2VelAlongDirection * (e2.mass - e1.mass) + (1 + e2.restitution) * e1.mass * e1VelAlongDirection) / totalMass)
			.add(new Vector2D(e2.vel.x - collisionDirection.x * e2VelAlongDirection, e2.vel.y - collisionDirection.y * e2VelAlongDirection));

		// Set the new velocities
		e1.vel = e1VelAfterCollision;
		e2.vel = e2VelAfterCollision;



		// Calculate the moment of inertia of the balls
		const e1MomentOfInertia = .5 * e1.mass * e1.radius * e1.radius;
		const e2MomentOfInertia = .5 * e2.mass * e2.radius * e2.radius;

		// Calculate the angular momentum of the balls
		const e1AngularMomentum = e1MomentOfInertia * e1.spinSpeed;
		const e2AngularMomentum = e2MomentOfInertia * e2.spinSpeed;

		// Exchange the angular momentum of the balls (spin exchange)
		const totalFriction = e1.materialFriction * e2.materialFriction;
		const totalAngularMomentum = e1AngularMomentum + e2AngularMomentum;
		e1.spinSpeed = (-totalAngularMomentum / e1MomentOfInertia) * (totalFriction/2);
		e2.spinSpeed = (-totalAngularMomentum / e2MomentOfInertia) * (totalFriction/2);


		// Calculate the collisional spin induced by the impact (impact to spin exchange)
		const k = .5; //(e1.restitution * e2.restitution);
		const collisionNormal1 = dist1.normalize();
		const collisionNormal2 = dist2.normalize();
		const collisionTangent1 = new Vector2D(-collisionNormal1.y, collisionNormal1.x);
		const collisionTangent2 = new Vector2D(-collisionNormal2.y, collisionNormal2.x);
		const relativeVelocity = e1.vel.subtract(e2.vel);
		const relativePosition = e1.pos.subtract(e2.pos);
		const totalAngularMomentum1 = relativeVelocity.cross(collisionTangent1) * relativePosition.magnitude() * k;
		const totalAngularMomentum2 = relativeVelocity.cross(collisionTangent2) * relativePosition.magnitude() * k;
		var m1ratio = e1.mass / e2.mass;
		var m2ratio = e2.mass / e1.mass;
		const maxRatio = Math.max(m1ratio, m2ratio)
		//fudging it for mass and bounce factor
		m1ratio /= maxRatio;
		m2ratio /= maxRatio;
		const totalRestitution = (.5+e1.restitution + e2.restitution) / 3; //tweekin
		e1.spinSpeed += totalAngularMomentum1 / e1MomentOfInertia * m2ratio * totalRestitution;
		e2.spinSpeed += totalAngularMomentum2 / e2MomentOfInertia * m1ratio * totalRestitution;

		
	}
}

*/