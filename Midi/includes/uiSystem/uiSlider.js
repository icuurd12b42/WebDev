
class uiSlider extends uiPanel
{
    onMouseSelf(e)
    {
        //standard mousedown
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
                return;
            }
        }
        /////////////////
        //your code here
        //hover code here
        if(uiMouse.haveCapture(this))
        {
            if(uiMouse.btn == 1)
            {
                var x1 = this.region.x+this.styles.clipping.left+this.styles.thumbTrack.width/2;
                var x2 = this.region.x+this.region.w - (this.styles.clipping.left+this.styles.clipping.right+this.styles.thumbTrack.width/2);
                var y1 = this.region.y+this.styles.clipping.top+this.styles.thumbTrack.height/2;
                var y2 = this.region.y+this.region.h - (this.styles.clipping.top+this.styles.clipping.bottom+this.styles.thumbTrack.height/2);

                if(this.styles.htracking.enabled == false)
                {
                    x1 = x2 = (x1+x2)/2;
                }
                if(this.styles.vtracking.enabled == false)
                {
                    y1 = y2 = (y1+y2)/2;
                }
                
                this.styles.htracking.value = uig.clamp(0,1,(uiMouse.x-x1)/(x2-x1));
                this.styles.vtracking.value = uig.clamp(0,1,(uiMouse.y-y1)/(y2-y1));
                this.onSlide();
            }
        }
    }
    onDrawSelf(e)
    {
        
        this.styles.panel.movable = false;
        this.styles.border.resizable = false;
        super.onDrawSelf(e);
        //super.drawPanel(e);
        e.ctx.save();
        var x1 = this.region.x+this.styles.clipping.left+this.styles.thumbTrack.width/2;
        var x2 = this.region.x+this.region.w - (this.styles.clipping.left+this.styles.clipping.right+this.styles.thumbTrack.width/2);
        var y1 = this.region.y+this.styles.clipping.top+this.styles.thumbTrack.height/2;
        var y2 = this.region.y+this.region.h - (this.styles.clipping.top+this.styles.clipping.bottom+this.styles.thumbTrack.height/2);
        var cr = Math.min(this.styles.thumbTrack.width,this.styles.thumbTrack.height)/4;

        if(this.styles.htracking.enabled == false)
        {
            x1 = x2 = (x1+x2)/2;
        }
        if(this.styles.vtracking.enabled == false)
        {
            y1 = y2 = (y1+y2)/2;
        }

        var x = uig.lerp(x1,x2,this.styles.htracking.value)+1;
        var y = uig.lerp(y1,y2,this.styles.vtracking.value)+1;

        e.ctx.globalAlpha = this.styles.panel.alpha;
        uiDraw.roundedRectWBorders2(e.ctx, 
            x-this.styles.thumbTrack.width/2, 
            y-this.styles.thumbTrack.height/2, 
            x+this.styles.thumbTrack.width/2, 
            y+this.styles.thumbTrack.height/2,
            this.styles.panel.color,this.styles.border.color,this.styles.border.width,cr);
        e.ctx.restore();
    }
    
    onSlide()
    {
        var e = {hValue:this.styles.htracking.value, vValue:this.styles.vtracking.value, uiSource:this };
        uig.callIfDefined(this.callbacks.onslide,e)

    }
    setCallbacks(callbacks={onslide: function (){}})
    {
        //the only reason the function is here was to show the possible values for this object in ms code 
        super.setCallbacks(callbacks);
    }
    styles ={
        text:{font:"12px Arial", color:"black", alpha:1, halign:"left", valign:"top", hmargin:8, vmargin:8},
        panel:{color:"lightgray", alpha:1, round:5, movable:true},
        border:{width:1,color:"black",alpha:1, resizable:true},
        sizable:{left:true, right:true, top:true, bottom:true},
        clipping:{enabled:true,left:2,right:2,top:2,bottom:2},
        thumbTrack:{width:16,height:16},
        htracking:{enabled:true,value:0},
        vtracking:{enabled:true,value:0}
        }
    setStyles(
    styles={
        text:{font:"12px Arial", color:"black", alpha:1, halign:"left", valign:"top", hmargin:8, vmargin:8},
        panel:{color:"lightgray", alpha:1, round:5, movable:true},
        border:{width:1,color:"black",alpha:1, resizable:true},
        sizable:{left:true, right:true, top:true, bottom:true},
        clipping:{enabled:true,left:2,right:2,top:2,bottom:2},
        thumbTrack:{width:16,height:16},
        htracking:{enabled:true,value:0},
        vtracking:{enabled:true,value:0}
        }
    )
    {
        //the only reason the function is here was to  show the possible values for this object in ms code 
        super.setStyles(styles);
    }
}