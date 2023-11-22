class uiFrame extends uiBaseObject
{
    name = "uiFrame";
    onDrawSelf(e)
    {
        
        //e.ctx.save(); //this is already called in the onDraw() prior this
        uiDraw.fillRoundedRect(e.ctx,
                            this.region.x,this.region.y,
                            this.region.w,this.region.h,
                            uiRes.getColor(uiRes.getReference(this.styles.color)),
                            this.styles.alpha,
                            this.styles.corners[0],this.styles.corners[1],this.styles.corners[2],this.styles.corners[3]);
        //e.ctx.restore(); //this is already called in the onDraw() after this
    }
    onMouseSelf(e)
    {
        super.onMouseSelf(e);
        this.onMouseDoSetTopmost(e);
    }
    
    onMouseDoSetTopmost(e)
    {
        if(e.type === "mousedown" && uiMouse.haveCapture(this))
        {
            var mainFrame = this;
            if(this.name != "uiFrame")
                mainFrame = uig.findByName(this,"uiFrame");

            if(mainFrame !== null)
                mainFrame.setTopMost();

            e.uiCancel = true;
        }

    }
    styles = {
        corners:[8,8,8,8],
        color:"frameColor", //colors are stored in the uiRes and referenced by name
        alpha:1
            };

    setStyles(
        styles = {
            corners:[8,8,8,8],
            color:"frameColor", //colors are stored in the uiRes and referenced by name
            alpha:1
        }
        )
        {
            //the only reason the function is here was to  show the possible values for this object in ms code 
            super.setStyles(styles);
        }
}

class uiFramePanel extends uiFrame
{
    name = "uiFramePanel";
    onMouseSelf(e)
    {
        //console.log(e)
        this.onMouseDoMouseCapture(e);
        this.onMouseDoHover(e);
        if(e.type == "mousedown")
            uig.setAncestorTopMost(this,"uiFrame");
    }
    styles = {
        corners:[8,8,8,8],
        color:"frameColor", //colors are stored in the uiRes and referenced by name
        alpha:1
            };

    setStyles(
        styles = {
            corners:[8,8,8,8],
            color:"frameColor", //colors are stored in the uiRes and referenced by name
            alpha:1
        }
        )
        {
            //the only reason the function is here was to  show the possible values for this object in ms code 
            super.setStyles(styles);
        }
}
class uiInertFramePanel extends uiFramePanel
{
    name = "uiFramePanel";
    onMouseSelf(e)
    {
        //console.log(e)
        //this.onMouseDoMouseCapture(e);
        this.onMouseDoHover(e);
        if(e.type == "mousedown")
            uig.setAncestorTopMost(this,"uiFrame");
    }
    styles = {
        corners:[8,8,8,8],
        color:"frameColor", //colors are stored in the uiRes and referenced by name
        alpha:1
            };

    setStyles(
        styles = {
            corners:[8,8,8,8],
            color:"frameColor", //colors are stored in the uiRes and referenced by name
            alpha:1
        }
        )
        {
            //the only reason the function is here was to  show the possible values for this object in ms code 
            super.setStyles(styles);
        }
}


//this one follow the parent dimentions
class uiAlignedPanel extends uiFramePanel
{
    name = "uiAlignedPanel";
    onDrawSelf(e)
    {
        this.adjustRegion();
        
        this.onDrawPanel(e);
        
    }
    onDrawPanel(e)
    {
        
        uiDraw.fillRoundedRect(e.ctx,
            this.region.x,this.region.y,
            this.region.w,this.region.h,
            uiRes.getColor(uiRes.getReference(this.styles.color)),
            this.styles.alpha,
            this.styles.corners[0],this.styles.corners[1],this.styles.corners[2],this.styles.corners[3]);
    }
    adjustRegion()
    {
        if(this.parent!== null && this.styles.parentAlign!==undefined)
        {
            var x1 = this.styles.parentAlign.x1;
            if(x1<0) x1+=this.parent.region.w;
            var y1 = this.styles.parentAlign.y1;
            if(y1<0) y1+=this.parent.region.h;

            var x2 = this.styles.parentAlign.x2;
            if(x2<=0) x2+=this.parent.region.w;
            var y2 = this.styles.parentAlign.y2;
            if(y2<=0) y2+=this.parent.region.h;


            this.region.x = Math.min(x1,x2);
            this.region.y = Math.min(y1,y2);

            this.region.w = Math.abs(x2-x1);
            this.region.h = Math.abs(y2-y1);

           
        }
    }
    styles = {
        corners:[8,8,8,8],
        color:"panelColor", //colors are stored in the uiRes and referenced by name
        alpha:1,
        parentAlign:{x1:4,y1:4,x2:-4,y2:-4}  //if negative, align with region.w/h
            };

    setStyles(
    styles = {
        corners:[8,8,8,8],
        color:"panelColor", //colors are stored in the uiRes and referenced by name
        alpha:1,
        parentAlign:{x1:4,y1:4,x2:-4,y2:-4} //if negative, align with region.w/h
            }
        )
        {
            //the only reason the function is here was to  show the possible values for this object in ms code 
            super.setStyles(styles);
        }
}

//this one follow the parent dimentions
class uiAlignedInertPanel extends uiAlignedPanel
{
    name = "uiAlignedPanel";
    onMouseSelf(e)
    {
        //console.log(e)
        //this.onMouseDoMouseCapture(e);
        this.onMouseDoHover(e);
        if(e.type == "mousedown")
            uig.setAncestorTopMost(this,"uiFrame");
    }
}

class uiAlignedClippingRegion extends uiAlignedInertPanel
{
    name = "uiAlignedClippingRegion";
    onDrawSelf(e)
    {
        this.adjustRegion();
        uiDraw.clipRoundedRect(e.ctx,
            this.region.x,this.region.y,
            this.region.w,this.region.h,
            this.styles.corners[0],this.styles.corners[1],this.styles.corners[2],this.styles.corners[3]);
        if(this.debug) this.debugDraw(e);
//e.ctx.restore(); //this is already called in the onDraw() after this
    }

    styles = {
        corners:[8,8,8,8],
        parentAlign:{x1:4,y1:4,x2:-4,y2:-4}  //if negative, align with region.w/h
            };

    setStyles(
    styles = {
        corners:[8,8,8,8],
        parentAlign:{x1:4,y1:4,x2:-4,y2:-4}  //if negative, align with region.w/h
            }
        )
        {
            //the only reason the function is here was to  show the possible values for this object in ms code 
            super.setStyles(styles);
        }
}

class uiClippingRegion extends uiFramePanel
{
    name = "uiClippingRegion";
    onDrawSelf(e)
    {
        uiDraw.clipRoundedRect(e.ctx,
            this.region.x,this.region.y,
            this.region.w,this.region.h,
            this.styles.corners[0],this.styles.corners[1],this.styles.corners[2],this.styles.corners[3]);
        if(this.debug) this.debugDraw(e);
//e.ctx.restore(); //this is already called in the onDraw() after this
    }

    styles = {
        corners:[8,8,8,8]
            };

    setStyles(
    styles = {
        corners:[8,8,8,8]
            }
        )
        {
            //the only reason the function is here was to  show the possible values for this object in ms code 
            super.setStyles(styles);
        }
}

class uiAlignedEdges extends uiAlignedPanel
{
    name = "uiAlignedEdges";
    onDrawSelf(e)
    {
        this.adjustRegion();
        //e.ctx.save(); //this is already called in the onDraw() prior this
        uiDraw.strokeRoundedRect(e.ctx,
                            this.region.x,this.region.y,
                            this.region.w,this.region.h,
                            uiRes.getColor(uiRes.getReference(this.styles.color)),
                            this.styles.alpha,
                            this.styles.lineWidth,
                            this.styles.corners[0],this.styles.corners[1],this.styles.corners[2],this.styles.corners[3]);
        //e.ctx.restore(); //this is already called in the onDraw() after this
    }
    styles = {
        corners:[8,8,8,8],
        color:"frameColor", //colors are stored in the uiRes and referenced by name
        alpha:1,
        lineWidth: 1,
        parentAlign:{x1:4,y1:4,x2:-4,y2:-4}   //if negative, align with region.w/h
            };

    setStyles(
        styles = {
            corners:[8,8,8,8],
            color:"frameColor", //colors are stored in the uiRes and referenced by name
            alpha:1,
            lineWidth: 1,
            parentAlign:{x1:4,y1:4,x2:-4,y2:-4}  //if negative, align with region.w/h
            }
        )
        {
            //the only reason the function is here was to  show the possible values for this object in ms code 
            super.setStyles(styles);
        }
}


class uiAlignedBeveledEdges extends uiAlignedPanel
{
    name = "uiAlignedBeveledEdges";
    onDrawSelf(e)
    {
        this.adjustRegion();
        var frameLightColor = uiRes.getColor(uiRes.getReference(this.styles.frameLightColor));
        var frameDarkColor = uiRes.getColor(uiRes.getReference(this.styles.frameDarkColor));
        //todo: fix the drawing so it's inside. attempt 1 failed because the line thickness changed the radius
        // of a corner making it not match with the base fill panel of same specs
        //var x1 = this.region.x + this.styles.lineWidth/2,
        //    x2 = this.region.w - this.styles.lineWidth/2,
        //    y1 = this.region.y + this.styles.lineWidth/2,
        //    y2 = this.region.h - this.styles.lineWidth/2;
        //var w = x2-x1,
        //    h = y2-y1;
        uiDraw.strokeRoundedRect(e.ctx,
            this.region.x-1,this.region.y-1,
            //x1,y1,
            this.region.w+1.5,this.region.h+1.5,
            //w,h,
            frameLightColor,
            this.styles.alpha,
            this.styles.lineWidth,
            this.styles.corners[0],this.styles.corners[1],this.styles.corners[2],this.styles.corners[3]);
        uiDraw.strokeRoundedRect(e.ctx,
            this.region.x,this.region.y,
            //x1+1,y1+1,
            this.region.w+.5,this.region.h+.5,
            //w-1.5,h-1.5,
                frameDarkColor,
                this.styles.alpha,
                this.styles.lineWidth,
                this.styles.corners[0],this.styles.corners[1],this.styles.corners[2],this.styles.corners[3]);

    }
    styles = {
        corners:[8,8,8,8],
        frameLightColor:"frameLightColor",
        frameDarkColor:"frameDarkColor",

        alpha:1,
        lineWidth: 1,
        parentAlign:{x1:4,y1:4,x2:-4,y2:-4}  //if negative, align with region.w/h
            };

    setStyles(
        styles = {
            corners:[8,8,8,8],
            linesCol : [
                "frameLightColor","frameLightColor","frameDarkColor","frameDarkColor"
            ], 
            alpha:1,
            lineWidth: 1,
            parentAlign:{x1:4,y1:4,x2:-4,y2:-4}  //if negative, align with region.w/h
            }
        )
        {
            //the only reason the function is here was to  show the possible values for this object in ms code 
            super.setStyles(styles);
        }
}


class uiAlignedMoveWindowRegion extends uiAlignedPanel
{
    name = "uiAlignedMoveWindowRegion";
    frame = null;
    onMouseSelf(e)
    {
        if(this.frame == null)
            this.frame = uig.findByID(this,this.styles.frameID);
        super.onMouseSelf(e);
        if(uiMouse.haveCapture(this) && uiMouse.btn)
        {
            
            this.frame.region.x += uiMouse.dx;
            this.frame.region.y += uiMouse.dy;
        }
    }
    onDrawSelf(e)
    {
        this.adjustRegion();
    }
    styles = {
        frameID:null, //the frame.id of frame to effect the move on, must be an ancestor
        corners:[8,8,8,8],
        parentAlign:{x1:4,y1:4,x2:-4,y2:-4}    //if negative, align with region.w/h
            };

    setStyles(
        styles = {
            frameID:null, //the frame to effect the move on
             corners:[8,8,8,8],
             parentAlign:{x1:4,y1:4,x2:-4,y2:-4}  //if negative, align with region.w/h
            }
        )
        {
            //the only reason the function is here was to  show the possible values for this object in ms code 
            super.setStyles(styles);
        }
}


class uiAlignedLabel extends uiAlignedInertPanel
{
    name = "uiAlignedLabel";
    onDrawSelf(e)
    {
        this.adjustRegion();
        this.drawLabel(e);
        if(this.debug) this.debugDraw(e);
    }
    drawLabel(e)
    {

        
        var x = this.region.x;
        var y = this.region.y;
        if(this.styles.halign == "center")
        {
            x+=this.region.w/2;
        }
        else if(this.styles.halign == "right")
        {
            x+=this.region.w;
        }
        if(this.styles.valign == "middle")
        {
            y+=this.region.h/2;
        }
        else if(this.styles.valign == "bottom")
        {
            y+=this.region.h;
        }
        
        uiDraw.drawEnhText(e.ctx, 
            x, 
            y, 
            this.styles.text, 
            uiRes.getColor(uiRes.getReference(this.styles.color)),
            this.styles.alpha,
            uiRes.getFont(this.styles.font),
            this.styles.halign,
            this.styles.valign
            );

    }
    styles ={text:"", 
                font:"default", color:"fontColor", alpha:1, 
                halign:"left", valign:"top",
                parentAlign:{x1:4,y1:4,x2:-4,y2:-4}}; //if negative, align with region.w/h
    setStyles(
    styles ={text:"", 
                font:"default", color:"fontColor", alpha:1, 
                halign:"left", valign:"top",
                parentAlign:{x1:4,y1:4,x2:-4,y2:-4}}) //if negative, align with region.w/h
    {
        //the only reason the function is here was to  show the possible values for this object in ms code 
        super.setStyles(styles);
    }
}

class uiAlignedVSlider extends uiAlignedPanel
{
    name = "uiAlignedVSlider";
    onDrawSelf(e)
    {
        this.adjustRegion();
        this.drawSlider(e);
        if(this.debug) this.debugDraw(e);
    }
    drawSlider(e)
    {

        
        
        var oldalpha = e.ctx.globalAlpha;
        e.ctx.globalAlpha = 1;

        

        //uiDraw.strokeLine(e.ctx,x1,0,x2,1000,uiRes.getColor(uiRes.getReference("gadgetBorderframeLightColor")),2);

        var col = uiRes.getColor(uiRes.getReference(this.styles.color)),
            lightCol = uiRes.getColor(uiRes.getReference(this.styles.frameLightColor)),
            darkCol = uiRes.getColor(uiRes.getReference(this.styles.frameDarkColor));

        var sw = this.region.w-2
        var shw = sw/2;
        var sh = sw/2;
        var shh = sh/2; 
        var scrnr = shh/2
        var xc = this.region.x+this.region.w/2;

        var y1 = this.region.y+sh;
        var y2 = this.region.y+this.region.h-sh;
        var ty = y1 + (this.styles.value) * (y2-y1);
        
        

        var bw = 2;
        var bhw = bw/2;
        var bh = y2-y1;
        var bhh = bh/2; 
        var cy = y1+bhh;
        

        uiDraw.strokeRoundedRect(e.ctx,xc-bhw-.5,cy-bhh-.5-1,bw,bh,darkCol,1,1,4,4,4,4);
        uiDraw.strokeRoundedRect(e.ctx,xc-bhw+.5,cy-bhh+.5-1,bw,bh,lightCol,1,1,4,4,4,4);
        uiDraw.fillRoundedRect(e.ctx,xc-bhw,cy-bhh-1,bw,bh,col,1,4,4,4,4);
        

        uiDraw.strokeRoundedRect(e.ctx,xc-shw-.5,ty-shh-.5,sw,sh,lightCol,1,1,scrnr,scrnr,scrnr,scrnr);
        uiDraw.strokeRoundedRect(e.ctx,xc-shw+.5,ty-shh+.5,sw,sh,darkCol,1,1,scrnr,scrnr,scrnr,scrnr);
        uiDraw.fillRoundedRect(e.ctx,xc-shw,ty-shh,sw,sh,col,1,scrnr,scrnr,scrnr,scrnr);
    
        
        e.ctx.globalAlpha = oldalpha;
        if(uiMouse.haveCapture(this))
        {
            var region = uig.mapRegionXY(this);

            var oldv = this.styles.value;

            var slideH = y2-y1-shh;
            var mouseY = (uiMouse.y-region.y) - y1;
            this.styles.value = uig.clamp(0,1,mouseY/slideH);
            
            if(oldv != this.styles.value)
            {
                var e = {uiOldValue:oldv, uiNewValue:this.styles.value, uiSource:this };
                uig.callIfDefined(this.callbacks.onchange,e)
            }

            
        }

        //refColor.setColorHSL(refColor.h, 1-e.vValue, refColor.l);
        //console.log("SLIDE!",refColor.s)
        //refColor.l = e.hValue;
        //refColor.s = e.vValue;
    // recalcColors();
        
    }
    styles ={
            value:0, 
                color:"frameColor",
                frameLightColor:"frameLightColor",
                frameDarkColor:"frameDarkColor",
                parentAlign:{x1:4,y1:4,x2:-4,y2:-4}}; //if negative, align with region.w/h
    setStyles(
    styles ={
            value:0, 
                color:"frameColor",
                frameLightColor:"frameLightColor",
                frameDarkColor:"frameDarkColor",
                parentAlign:{x1:4,y1:4,x2:-4,y2:-4}}) //if negative, align with region.w/h
    {
        //the only reason the function is here was to  show the possible values for this object in ms code 
        super.setStyles(styles);
    }

    setCallbacks(callbacks={onchange: function (){}})
    {
        //the only reason the function is here was to show the possible values for this object in ms code 
        super.setCallbacks(callbacks);
    }
}


class uiAlignedHSlider extends uiAlignedPanel
{
    name = "uiAlignedHSlider";
    onDrawSelf(e)
    {
        this.adjustRegion();
        this.drawSlider(e);
        if(this.debug) this.debugDraw(e);
    }
    drawSlider(e)
    {

        
        
        var oldalpha = e.ctx.globalAlpha;
        e.ctx.globalAlpha = 1;

        

        //uiDraw.strokeLine(e.ctx,x1,0,x2,1000,uiRes.getColor(uiRes.getReference("gadgetBorderframeLightColor")),2);

        var col = uiRes.getColor(uiRes.getReference(this.styles.color)),
            lightCol = uiRes.getColor(uiRes.getReference(this.styles.frameLightColor)),
            darkCol = uiRes.getColor(uiRes.getReference(this.styles.frameDarkColor));

        var sh = this.region.h-2
        var shh = sh/2; 


        var sw = sh/2
        var shw = sw/2;
        var scrnr = shw/2  
        

        var cy = this.region.y+this.region.h/2;

        var x1 = this.region.x+shw;
        var x2 = this.region.x+this.region.w-shw;
        var tx = x1 + (this.styles.value) * (x2-x1);
        
        

        var bh = 2;
        var bhh = bh/2;
        var bw = x2-x1;
        var bhw = bw/2; 
        var cx = x1+bhw;
        

        uiDraw.strokeRoundedRect(e.ctx,cx-bhw-.5,cy-bhh-.5+1,bw,bh,darkCol,1,1,4,4,4,4);
        uiDraw.strokeRoundedRect(e.ctx,cx-bhw+.5,cy-bhh+.5+1,bw,bh,lightCol,1,1,4,4,4,4);
        uiDraw.fillRoundedRect(e.ctx,cx-bhw,cy-bhh+1,bw,bh,col,2,4,4,4,4);

        
        

        uiDraw.strokeRoundedRect(e.ctx,tx-shw-.5,cy-shh-.5,sw,sh,lightCol,1,1,scrnr,scrnr,scrnr,scrnr);
        uiDraw.strokeRoundedRect(e.ctx,tx-shw+.5,cy-shh+.5,sw,sh,darkCol,1,1,scrnr,scrnr,scrnr,scrnr);
        uiDraw.fillRoundedRect(e.ctx,tx-shw,cy-shh,sw,sh,col,1,scrnr,scrnr,scrnr,scrnr);
    
        
        e.ctx.globalAlpha = oldalpha;
        if(uiMouse.haveCapture(this))
        {
            var region = uig.mapRegionXY(this);

            var oldv = this.styles.value;

            var slideW = x2-x1-shh;
            var mouseX = (uiMouse.x-region.x) - x1;
            this.styles.value = uig.clamp(0,1,mouseX/slideW);
            
            if(oldv != this.styles.value)
            {
                var e = {uiOldValue:oldv, uiNewValue:this.styles.value, uiSource:this };
                uig.callIfDefined(this.callbacks.onchange,e)
            }

            
        }

        //refColor.setColorHSL(refColor.h, 1-e.vValue, refColor.l);
        //console.log("SLIDE!",refColor.s)
        //refColor.l = e.hValue;
        //refColor.s = e.vValue;
    // recalcColors();
       
    }
    styles ={
            value:0, 
                color:"frameColor",
                frameLightColor:"frameLightColor",
                frameDarkColor:"frameDarkColor",
                parentAlign:{x1:4,y1:4,x2:-4,y2:-4}}; //if negative, align with region.w/h
    setStyles(
    styles ={
            value:0, 
                color:"frameColor",
                frameLightColor:"frameLightColor",
                frameDarkColor:"frameDarkColor",
                parentAlign:{x1:4,y1:4,x2:-4,y2:-4}}) //if negative, align with region.w/h
    {
        //the only reason the function is here was to  show the possible values for this object in ms code 
        super.setStyles(styles);
    }

    setCallbacks(callbacks={onchange: function (){}})
    {
        //the only reason the function is here was to show the possible values for this object in ms code 
        super.setCallbacks(callbacks);
    }
}

//this container aligns puts all the children one under the other and resizes to fit them
class uiVListPanel extends uiInertFramePanel
{
    name = "uiVListPanel";
    onDrawSelf(e)
    {
        var h =0;
        for(var i =0; i < this.children.length; i++)
        {
            var ui = this.children[i];
            ui.region.y = h;
            h+=ui.region.h;
            ui.region.x = 0;
            ui.region.w = this.region.w;
            if(i<this.children.length-1)
            {
                h+=this.styles.itemGap;
            }
        }

        this.region.h = Math.max(1,h);
        if(this.debug) this.debugDraw(e);
    }
    styles ={
        itemGap: 2
       };
    setStyles(
        styles ={
            itemGap: 2
        })
    {
        //the only reason the function is here was to  show the possible values for this object in ms code 
        super.setStyles(styles);
    }
}


        
//this scrolls a frame up and down withing limits set by parentAlign. must be on top of and a child ancestry of the frame it scrolls
//the target should not be of type uiAlignedPanel since this will also do the alignement
class uiAlignedVScrollRegion extends uiAlignedPanel
{
    name = "uiAlignedVScrollRegion";
    frame = null;
    onDrawSelf(e)
    {
        this.setBottomMost();

        this.adjustRegion();
        
        //perform the parent alignment on the target frame and its parent
        if(this.frame == null)
        {
            this.frame = uig.findByID(this,this.styles.frameID);
        }
        //align to parent 

        var x1 = this.styles.parentAlign.x1;
        if(x1<0) x1+=this.parent.region.w;
        var y1 = this.styles.parentAlign.y1;
        if(y1<0) y1+=this.parent.region.h;

        var x2 = this.styles.parentAlign.x2;
        if(x2<=0) x2+=this.parent.region.w;
        var y2 = this.styles.parentAlign.y2;
        if(y2<=0) y2+=this.parent.region.h;


        this.region.x = Math.min(x1,x2);
        this.region.y = Math.min(y1,y2);

        this.region.w = Math.abs(x2-x1);
        this.region.h = Math.abs(y2-y1);


        this.frame.region.x = this.region.x;
        this.frame.region.w = this.region.w;

                
        var oldv = this.styles.value;
        if(uiMouse.haveCapture(this))
        {
            //TODO, test with larger list to see if the logaritmic scrolling works properly
            //"logaritmic" scroll, the further from the start of the drag the faster the scrolling
            var p = uiMouse.dy/(this.frame.region.h) * 2;
            var disty = Math.max(this.region.h,Math.abs(uiMouse.disty));
            p*=disty/this.region.h;
            this.styles.value -= p// * Math.max(1,Math.abs(uiMouse.disty)/this.region.h);
            this.styles.value = uig.clamp(0,1,this.styles.value);
            uiMouse.dy = 0;
        }

        this.frame.region.y = this.styles.parentAlign.y1-(this.styles.value * (this.frame.region.h - this.frame.parent.region.h + this.styles.parentAlign.y1 - this.styles.parentAlign.y2));
        
        if(oldv != this.styles.value)
        {
            var e = {uiOldValue:oldv, uiNewValue:this.styles.value, uiSource:this };
            uig.callIfDefined(this.callbacks.onchange,e)
        }
    }
    styles ={
        value:1,
        frameID:null, //the frame.id of frame to effect the move on, must be an ancestor
        parentAlign:{x1:4,y1:4,x2:-4,y2:-4}};
    setStyles(
        styles ={
            value:1,
            frameID:null, //the frame.id of frame to effect the move on, must be an ancestor
            parentAlign:{x1:4,y1:4,x2:-4,y2:-4}}) //if negative, align with region.w/h
    {
        //the only reason the function is here was to  show the possible values for this object in ms code 
        super.setStyles(styles);
    }
    setCallbacks(callbacks={onchange: function (){}})
    {
        //the only reason the function is here was to show the possible values for this object in ms code 
        super.setCallbacks(callbacks);
    }
}


class uiAlignedPicture extends uiAlignedInertPanel
{
    name = "uiAlignedPicture";
    images = [];
    onDrawSelf(e)
    {
        this.adjustRegion();
        this.drawImage(e);
    }
    drawImage(e)
    {

        
        var cx = this.region.x+this.region.w/2;
        var cy = this.region.y+this.region.h/2;
        if(this.images.length == 0)
        {
            for (var i = 0; i < this.styles.images.length; i++)
            {
                this.images.push(uiRes.getImage(this.styles.images[i]));
            }
        }
        var img = this.images[this.styles.index];
        
        if(img)
        {
            
            var ratioH = this.region.h/img.height;
            var ratioW = this.region.w/img.width;
            var ratio = Math.min(ratioH,ratioW);
            uiDraw.drawImage(e.ctx,img, cx-img.width/2*ratio, cy-img.height/2*ratio, img.width*ratio, img.height*ratio,this.styles.alpha);
        }
        if(this.debug) this.debugDraw(e);
    }
    styles ={
        index:0, //what image to display
        images:["image1","image2"], //named uiResource images
        alpha:1,
        parentAlign:{x1:4,y1:4,x2:-4,y2:-4}};
    setStyles(
    styles ={
        index:0, //what image to display
        images:["image1","image2"], //named uiResource images
        alpha:1,
        parentAlign:{x1:4,y1:4,x2:-4,y2:-4}},
        ) //if negative, align with region.w/h
    {
        //the only reason the function is here was to  show the possible values for this object in ms code 
        super.setStyles(styles);
    }
}
