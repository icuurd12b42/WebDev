class uiMouse {
			
	static x = 0;
	static y = 0;
	static oldx = 0;
	static oldy = 0;

	static startx = 0;
	static starty = 0;
	static endx = 0;
	static endy = 0;

	static firstRead = true;

	static btn = 0;
	static oldbtn = 0;

	static spdx = 0;
	static spdy = 0;
	static spd = 0;

	static distx = 0;
	static disty = 0;
	static dist = 0;

	static dx = 0;
	static dy = 0;

	static accdist = 0;
	static accdistx = 0;
	static accdisty = 0;
    static element = null;
	static event = {};
	static _last = 0; //stub because I got tired of missing , error when adding new items to the end of the structure
	static distance(dx,dy)
	{
		var xs = dx*dx;
		var ys = dy*dy;
		var d = xs+ys;
		if(d!=0)
		d = Math.sqrt(d);
		return d;
	}

    //TODO:This singleton object is preventing having multiple root uiDesktop, because, 
    //     you can only have 1 hooked element and 
    //     you can't tell what desktop window the mouse is over is 2 desktop
    //     2 desktop would be fighting over the mouse cursor
	
    static getMouseData(e)
	{
		//this is called to transfer mouse data to structure and calculate speeds and distance and mouse button states
	
		
		//this resets start pos if the button is not held (to me: it resets every check unless the button is down, trust me. stop thinking this is wrong)
		if(uiMouse.oldbtn == false)// || uiMouse.firstRead)
		{
			uiMouse.accdist = 0;
			uiMouse.accdistx = 0;
			uiMouse.accdisty = 0;
			uiMouse.startx = e.clientX;
			uiMouse.starty = e.clientY;
			uiMouse.endx = e.clientX;
			uiMouse.endy = e.clientY;
		}
		uiMouse.btn = (e.which != 0);
	
		if(uiMouse.firstRead)
		{
			uiMouse.x = e.clientX; //to set oldx/y to mouse coord below...
			uiMouse.y = e.clientY;
			uiMouse.firstRead = false;
		}
	
		if(e.type === "mouseup")
			uiMouse.btn = 0;

		uiMouse.oldx = uiMouse.x; //...here
		uiMouse.oldy = uiMouse.y;
		uiMouse.x = e.clientX;
		uiMouse.y = e.clientY;
	
		uiMouse.endx = e.clientX;
		uiMouse.endy = e.clientY;
	
		uiMouse.spdx = uiMouse.x-uiMouse.oldx;
		uiMouse.spdy = uiMouse.y-uiMouse.oldy;
		uiMouse.spd = uiMouse.distance(uiMouse.spdx,uiMouse.spdy);
	
		uiMouse.dx = uiMouse.x-uiMouse.oldx;
		uiMouse.dy = uiMouse.y-uiMouse.oldy;
	
		uiMouse.accdistx+=Math.abs(uiMouse.spdx);
		uiMouse.accdisty+=Math.abs(uiMouse.spdy);
	
		uiMouse.accdist = uiMouse.distance(uiMouse.accdistx,uiMouse.accdisty);
	
		uiMouse.distx = uiMouse.endx-uiMouse.startx;
		uiMouse.disty = uiMouse.endy-uiMouse.starty;
		uiMouse.dist = uiMouse.distance(uiMouse.distx,uiMouse.disty);
		uiMouse.event = e;
        //pass e, the javascript event struct, since it's sufficient but uiMouse is global static so available if needed.
		uiMouse.dispatchMouseEvent(e);

		uiMouse.oldbtn = uiMouse.btn;
		
	}

	static hookToElement(e)
	{
		uiMouse.element = e;
		//call this to hook all the mouse event required to an element
		//e is usually the document.body, as the names of the hook functions imply. 
		//but it could be the canvas

		//Mouse data fetching fns and hooks
		function onBodyMouseDown(e)
		{
			//This is called when the mouse is pressed in the body of the page
			//force a restart mouse data reading
			uiMouse.firstRead = true;
			uiMouse.getMouseData(e);
		}
		function onBodyMouseMove(e)
		{
			//This is called when the mouse is moving in the body of the page
			uiMouse.getMouseData(e);
		}

		function onBodyMouseUp(e)
		{
			//This is called when the mouse is released in the body of the page
			uiMouse.getMouseData(e);
			uiMouse.btn = false;
			uiMouse.oldbtn = false;
		}


		function onBodyKeyboardEvent(e)
		{
			//uiDoKeyboardEvent(e);
		}


		function onMouseWheel(e)
		{

			uiMouse.dispatchMouseEvent(e);

		}


		e.addEventListener("keydown", onBodyKeyboardEvent);
		e.addEventListener("keyup", onBodyKeyboardEvent);
		e.addEventListener("keypress", onBodyKeyboardEvent);
		e.addEventListener("mousedown", onBodyMouseDown);
		e.addEventListener("mouseup", onBodyMouseUp);
		e.addEventListener("mousemove", onBodyMouseMove);
		e.addEventListener("mouseenter", onBodyMouseDown);
		e.addEventListener("mouseleave", onBodyMouseDown);
		e.addEventListener("wheel", onMouseWheel);
	}
	//this is the list of objects registered...
	static listenerObjects = [];
	//..by this function...
	static addListener(o)
	{
		uiMouse.listenerObjects.push(o);
	}
	//... which will receive mouse events. 
	//if a parent or any object in the ancestry chain is already registered, 
	//there is no need to register the object, else the object will receive 
	//multiple messages
	static dispatchMouseEvent(e)
	{
		e.uiCancel = false;
		if(uiMouse.mouseCapture != null) 
        {
            //map the region.x/y to be screen relative
            var element = uiMouse.mouseCapture
            var at = element;
            //while(at.parent !== null) {at = at.parent; element.region.x+=at.region.x; element.region.y+=at.region.y;}

            //also do it for the ancestry chane in case the code wants to use the parent positions
            //TODO, implement a relative coord to screen function to rid of this hack
            var ancestry = [];
            while(at !== null) {ancestry.push(at);at = at.parent};

            for (var i = ancestry.length-1; i>=1; i--)
            {
                ancestry[i-1].region.x+=ancestry[i].region.x;
                ancestry[i-1].region.y+=ancestry[i].region.y;
            }
             
            

            e.uiCancel = false;
            e.uiSource = element;
                
            uig.callIfDefined(element.callbacks.onmouse,e);
            
            if(!uiMouse.isMouseOver(element)) //uiDraw.Dirty("uiBaseObject.onMouse");
                uiMouse.setMouseOver(element);
            if(!e.uiCancel)
            {
                //then yourself if not handled
                element.onMouseSelf(e);

            }


            for (var i = 1; i<ancestry.length-1; i++)
            {
                ancestry[i-1].region.x-=ancestry[i].region.x;
                ancestry[i-1].region.y-=ancestry[i].region.y;
            }
            //hack to allow messages to go on the same event is release capture was done
            if(uiMouse.mouseCapture == null)
            {
                uiMouse.listenerObjects.forEach(o => {o.onMouse(e);});
            }
            //at = element;
            //while(at.parent !== null) {at = at.parent; element.region.x-=at.region.x; element.region.y-=at.region.y;}
        }
		else
			uiMouse.listenerObjects.forEach(o => {o.onMouse(e);});

        //the window that is under the mouse is used to set the cursor
        if(uiMouse.mouseOver)
        {
            uiMouse.setMouseCursor(uiMouse.mouseOver.cursor);
        }
        var n1 = uiMouse.mouseOver;
        if(n1!== null) n1 = uiMouse.mouseOver.name;
        var n2 = uiMouse.mouseCapture;
        if(n2!== null) n2 = uiMouse.mouseCapture.name;
        console.log("OVER", n1, "CAPTURE", n2)
	}
	
	//capture functions like in windows api
	static mouseCapture = null;
	static setCapture(o) //call to set this as the only one capturing the mouse inputs
	{
		uiMouse.mouseCapture = o;
	}
	static releaseCapture() //call this to stop capture
	{
		uiMouse.mouseCapture = null;
	}
	static getCapture() //call this to get how has mouse capture
	{
		return uiMouse.mouseCapture;
	}
	static nooneCapture() //call this see if no one has mouse capture
	{
		return uiMouse.mouseCapture === null;
	}
	static haveCapture(o) //call this to get how has mouse capture
	{
		if(uiMouse.mouseCapture != null) 
			return (o.id == uiMouse.mouseCapture.id );
		return false;
	}
	static releaseCaptureIfThis(o) //safely release capture if o is the capture...
	{
		if(uiMouse.mouseCapture != null) 
			if(o.id == uiMouse.mouseCapture.id )
				uiMouse.releaseCapture();
	}
	static mouseOver = null;
	static setMouseOver(o) 
	{
		uiMouse.mouseOver = o;
	}
	static getMouseOver(o) 
	{
		return uiMouse.mouseOver;
	}
	static isMouseOver(o) 
	{
		if(uiMouse.mouseOver != null) 
			return (o.id == uiMouse.mouseOver.id );
		return false;
	}
	static setMouseCursor(cursor)
	{
		uiMouse.element.style = "cursor: " + cursor;
	}
    //test if the uiMouse is inside an object
    static isInside(o)
    {
        return (uiMouse.x >= o.region.x && uiMouse.y >= o.region.y && uiMouse.x <= o.region.x+o.region.w  && uiMouse.y <= o.region.y+o.region.h);
    }
    static isCaptured()
    {
        return uiMouse.mouseCapture === null;
    }


};

