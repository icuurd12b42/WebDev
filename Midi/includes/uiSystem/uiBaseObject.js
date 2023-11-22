 //the base UI object, no visual interface
class uiBaseObject
{
//identifier, use this to fastly compare if 2 object are the same 
    id = null;
    name = "uiBaseObject";
    debug = false;
//children and parent
    children = [];
    parent = null;
//callback functions
    callbacks = {};
//physical attributes
    //region
    region={x: 0, y:0, w: 0, h: 0}
    //visible
    visible = true;
    enabled = true;

    cursor = "auto";
    


    //Constructor... with default setting

    //I decided the constructors ALWAYS take no argument. requiring to call setFunctions AFTER creating an instance to change the defaults
    constructor()
    {
        this.id = uig.newID();
    }
    //Functions that are rarely overriden
    //a destructor function that simply removes from the parent's children array
    destroy()
    {
        if(this.parent != null)
        {
            this.parent.removeChild(this);
        }
        this.parent = null;
        uiMouse.releaseCaptureIfThis(this);
    }
    //this adds a child in children array
    addChild(o) 
    { 
        o.parent = this; 
        this.children.push(o); 
    }
    //this sets the parent of an object
    setParent(o)
    {
        if(this.parent != null)
            this.parent.removeChild(this);
        o.addChild(this);
    }
    //this to remove a child
    removeChild(o) 
    {
        for (var i=0; i<this.children.length;i++)
        {
            if(this.children[i].id == o.id)
            {
                o.parent = null;
                this.children.splice(i,1);
                break;
            }
        }
    }
    getChildIndex(o) 
    {
        for (var i=0; i<this.children.length;i++)
        {
            if(this.children[i].id == o.id)
            {
                return i;
            }
        }
        return -1;
    }
    setBottomMostChild(o) 
    {
                
        for (var i=0; i<this.children.length;i++)
        {
            if(this.children[i].id == o.id)
            {
                if(i == 0) return;
                this.children.splice(i,1);
                this.children.splice( 0, 0, o );
                break;
            }
        }
    }
    setTopMostChild(o) 
    {
        for (var i=0; i<this.children.length;i++)
        {
            if(this.children[i].id == o.id)
            {
                
                if(i == this.children.length-1) return;
                this.children.splice(i,1);
                this.children.push(o);
                break;
            }
        }
    }
    getNextSibling(o) 
    {
        if(this.parent != null)
        {
            for (var i=0; i<this.parent.children.length;i++)
            {
                if(this.parent.children[i].id == this.id)
                {
                    if(i+1<this.parent.children.length)
                    {
                        return this.parent.children[i+1];
                    }
                    break;
                }
            }
        }
        return null;
    }
    getPrevSibling(o) 
    {
        if(this.parent != null)
        {
            for (var i=0; i<this.parent.children.length;i++)
            {
                if(this.parent.children[i].id == this.id)
                {
                    if(i-1>=0)
                    {
                        return this.parent.children[i-1];
                    }
                    break;
                }
            }
        }
        return null;
    }
    setTopMost()
    {
        if(this.parent != null)
        {
            this.parent.setTopMostChild(this);
        }
    }
    setBottomMost()
    {
        if(this.parent != null)
        {
            this.parent.setBottomMostChild(this);
        }
    }
    //and set the styles by merging values as opposed to overwrite them
    styles ={
        clipping:{enabled:false,left:0,right:0,top:0,bottom:0}
        }
    setStyles(styles={clipping:{enabled:false,restrict:false,left:0,right:0,top:0,bottom:0}})
    {
        //this.styles = Object.assign(this.styles,styles);
        uig.assignRecursive(this.styles,styles);
    }
    //and set the callbacks by merging values as opposed to overwrite them
    setCallbacks(callbacks={onmouse: function (e){},onkeyboard: function (e){},onsetvisible: function (e){},ondraw: function (e){}})
    {
        Object.assign(this.callbacks,callbacks);
    }
    //and set the region by merging values as opposed to overwrite them
    setRegion(region={x:0,y:0,w:0,h:0})
    {
        Object.assign(this.region,region);
    }
    //this shows or hide the object. you need to cause a canvas redraw yourself for the change to be seen
    setVisible(visible=true)
    {
        var e = {uiOldValue:this.visible, uiNewValue:visible, uiSource:this };
        this.visible = visible;
        uig.callIfDefined(this.callbacks.onsetvisible,e)
    }
    //this is called on draw
    onDraw(e)
    {
        //Careful this code is duplicated in uiClippedClient. changes here could apply there 
        if(this.visible && this.region.w>0 && this.region.h>0) //only if visible
        {
            //offset the position parent relative
            e.ctx.save();
            //if(this.parent != null) {this.region.x+=this.parent.region.x; this.region.y+=this.parent.region.y};
            if(this.parent != null) e.ctx.translate(this.parent.region.x,this.parent.region.y);
            this.onDrawSelf(e); //draw self
            e.uiSource=this;
            this.setClipRegion(e); //todo REMOVE THIS
            uig.callIfDefined(this.callbacks.ondraw,e)
            this.children.forEach(child => {child.onDraw(e);}); //draw children
            //undo the parent relative offest
            //if(this.parent != null) {this.region.x-=this.parent.region.x; this.region.y-=this.parent.region.y};
            if(this.parent != null) e.ctx.translate(-this.parent.region.x,-this.parent.region.y);
            e.ctx.restore();
        }
    }
    setClipRegion(e)
    {
        if(this.styles.clipping === undefined||this.styles.clipping.enabled === false) return;
        //var olda = e.ctx.globalAlpha;
        //e.ctx.globalAlpha = 0;
        uiDraw.clipRoundedRect(
            e.ctx,
            this.region.x+this.styles.clipping.left,
            this.region.y+this.styles.clipping.top,
            this.region.w-this.styles.clipping.left-this.styles.clipping.right,
            this.region.h-this.styles.clipping.top-this.styles.clipping.bottom,
            this.styles.panel.round,this.styles.panel.round,this.styles.panel.round,this.styles.panel.round);
        //e.ctx.clip();
        //e.ctx.globalAlpha - olda;
    }
    onAppMessage(e)
    {
        if(this.visible) //only if visible
        {
            //offset the position parent relative
            if(this.parent != null) {this.region.x+=this.parent.region.x; this.region.y+=this.parent.region.y};
            this.onAppMessageSelf(e); //message self
            e.uiSource=this;
            this.children.forEach(child => {child.onAppMessage(e);}); //message children
            //undo the parent relative offest
            if(this.parent != null) {this.region.x-=this.parent.region.x; this.region.y-=this.parent.region.y};
        }
    }
    onResize(e)
    {
        //if(this.visible) //only if visible
        {
            //offset the position parent relative
            if(this.parent != null) {this.region.x+=this.parent.region.x; this.region.y+=this.parent.region.y};
            this.onResizeSelf(e); //resize self
            //e.uiSource=this; not this time, preserve the initial cause object of the resize
            this.children.forEach(child => {child.onResize(e);}); //resize children
            //undo the parent relative offest
            if(this.parent != null) {this.region.x-=this.parent.region.x; this.region.y-=this.parent.region.y};
        }
    }
    onMouse(e)
    {
        if(this.parent == null) //root parent. set the cancel fag
            e.uiCancel = false;

        if(e.uiCancel) return;

        if(!this.enabled) return;
        //offset the position parent relative
        if(this.parent != null) {this.region.x+=this.parent.region.x; this.region.y+=this.parent.region.y};
        if(uiMouse.haveCapture(this))
        {
            //moved to uiMouse dispatch 
            
        }
        else if(uiMouse.isInside(this))
        {
            //do the children first
            for(var i = this.children.length-1; i>=0; i--) { //reverse so it goes top to bottom on the draw order
                this.children[i].onMouse(e);
                if(e.uiCancel) break;
            };
            if(!e.uiCancel)
            {
                //call registered event handler
                e.uiSource = this;
                uig.callIfDefined(this.callbacks.onmouse,e);
            }

            if(!e.uiCancel)
            {
                //then yourself if not handled
                this.onMouseSelf(e);
                if(!uiMouse.isMouseOver(this)) //uiDraw.Dirty("uiBaseObject.onMouse");
                    uiMouse.setMouseOver(this);
            }
            
            
        }
        //undo the parent relative offest
        if(this.parent != null) {this.region.x-=this.parent.region.x; this.region.y-=this.parent.region.y};

    }
    onKeyboard(e)
    {
        if(this.parent == null) //root parent. set the cancel fag
            e.uiCancel = false;

        if(e.uiCancel) return;
        //offset the position parent relative
        if(this.parent != null) {this.region.x+=this.parent.region.x; this.region.y+=this.parent.region.y};
        //do the children first
        this.children.forEach(child => {
            child.onKeyboard(e);
            if(e.uiCancel)
                return;
        });
        if(!e.uiCancel)
        {
            //call registered event handler
            e.uiSource = this;
            uig.callIfDefined(this.callbacks.onkeyboard,e);
        }
        if(!e.uiCancel)
        {
            //then yourself if not handled
            this.onKeyboardSelf(e);
        }
        //undo the parent relative offest
        if(this.parent != null) {this.region.x-=this.parent.region.x; this.region.y-=this.parent.region.y};
    }

    debugDraw(e)
    {
        var x = this.region.x;
        var y = this.region.y;
        var w = this.region.w;
        var h = this.region.h;

        for (i = 0; i< 5; i++)
        {
            uiDraw.strokeRect(e.ctx,x,y,w,h,"red",1);
            x+= w/10;
            y+= h/10;
            w-=w/5;
            h-=h/5;
        }
    }
    //Functions you usually implement
    onMouseSelf(e)
    {
        //remember e.uiCancel = true; if you handled the message event
        this.onMouseDoMouseCapture(e);
        this.onMouseDoHover(e);
    }
    onMouseDoHover(e)
    {
        if(uiMouse.isInside(this) && uiMouse.btn == 0)
        {
            e.uiCancel = true; //please stop commenting this out everytime something weird happens. this is not the problem
        }
    }
    onMouseDoMouseCapture(e)
    {
        if(e.type === "mousedown" && uiMouse.isInside(this))
        {
            uiMouse.setCapture(this);
        }
        //standard release capture
        if(uiMouse.haveCapture(this) )
        {
            e.uiCancel = true;
            if(e.type == "mouseup" || (e.type == "mouseenter" && uiMouse.btn == 0))
            {
                uiMouse.releaseCapture();
            }
        }
    }
    onKeyboardSelf(e)
    {
        //e is the javascript event structure so e.n, e.uiSource
        e.uiCancel = false; ; //use true to cancel the event for others
    }
    onDrawSelf(e) 
    {
        //e.canvas, e.ctx, e.uiSource
        //lineRoundedRect(e.ctx,x,y,20,20,5,1,"red");
    }
    onAppMessageSelf(e)
    {
        //e.message, e.uiSource then your own data
        //called to reset the parameters to de
    }
    onResizeSelf(e)
    {
        //e.uiSource, the one that triggered the resize event down the parenting chain
        //Use It, along with the this.parent region to resize
        //yourself if your size is relative
    }
}

