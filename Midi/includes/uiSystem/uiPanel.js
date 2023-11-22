
class uiPanel extends uiLabel
{
    name = "uiPanel";
    rightsizing = false;
    leftsizing = false;
    topsizing = false;
    bottomsizing = false;
    moving = false;
    onDrawSelf(e)
    {
        if(this.region.w > 0 && this.region.h > 0)
        {
            e.ctx.save();
            if(this.styles.panel.alpha>0)
            {
                this.drawPanel(e);
            }
            if(this.styles.border.width>0 && this.styles.border.alpha>0)
            {
                this.drawBorder(e);
            }
            if(this.text != "" && this.styles.text.alpha > 0)
            {
                if(this.styles.clipping.enabled)
                {
                    e.ctx.save();
                    this.setClipRegion(e);
                }
    
                var ha = this.region.w/2;
                if(this.styles.text.halign == "right") ha = this.region.w - this.styles.text.hmargin;
                else if (this.styles.text.halign == "left") ha = 0 + this.styles.text.hmargin;
                
                var va = this.region.h/2;
                if(this.styles.text.valign == "bottom") va = this.region.h - this.styles.text.vmargin;
                else if (this.styles.text.valign == "top") va = 0 + this.styles.text.vmargin;

                this.region.x+=ha;
                this.region.y+=va;
                this.drawLabel(e);
                this.region.x-=ha;
                this.region.y-=va;
                //e.ctx.globalAlpha = this.styles.text.alpha;
                
                if(this.styles.clipping.enabled)
                {
                    e.ctx.restore();
                }
            }
            e.ctx.restore();
        }
    }
    onMouseSelf(e)
    {
        //uiMouse.setMouseCursor("auto");
        if(!this.styles.border.resizable && !this.styles.panel.movable) 
        {
            return;
        }

        e.uiCancel = true;
        
        if(e.type == "mousedown" && uiMouse.isInside(this))
        {
            this.setTopMost();
            this.rightsizing = false;
            this.leftsizing = false;
            this.topsizing = false;
            this.bottomsizing = false;

            if (Math.abs(uiMouse.x - (this.region.x+this.region.w)) < this.styles.text.hmargin)
            {
                this.rightsizing = this.styles.border.resizable;
            }
            if (Math.abs(uiMouse.y - (this.region.y+this.region.h)) < this.styles.text.hmargin)
            {
                this.bottomsizing = this.styles.border.resizable;
            }
            if (Math.abs(uiMouse.x - this.region.x) < this.styles.text.hmargin)
            {
                this.leftsizing = this.styles.border.resizable;
            }
            if (Math.abs(uiMouse.y - this.region.y) < this.styles.text.hmargin)
            {
                this.topsizing = this.styles.border.resizable;
            }
            this.moving = this.styles.panel.movable && !this.rightsizing && !this.leftsizing && !this.topsizing && !this.bottomsizing;
            if(this.moving || this.rightsizing || this.leftsizing || this.topsizing || this.bottomsizing)
            {
                uiMouse.setCapture(this);
            }
        }
        
        if(uiMouse.haveCapture(this) )
        {
            
            e.uiCancel = true;
            if(e.type == "mouseup" || (e.type == "mouseenter" && uiMouse.btn == 0))
            {
                uiMouse.releaseCapture();
                return;
            }
            if (this.moving)
            {
                this.region.x+=uiMouse.dx;
                this.region.y+=uiMouse.dy;
                if(this.parent !== null && this.parent.styles.clipping !== undefined && this.parent.styles.clipping.restrict )
                {
                    //this.region.x = Math.min(this.region.x,this.parent.region.x+this.parent.region.w-this.parent.styles.clipping.right-this.region.w);
                    //this.region.y = Math.min(this.region.y,this.parent.region.y+this.parent.region.h-this.parent.styles.clipping.bottom-this.region.h);
                    //this.region.x = Math.max(this.region.x,this.parent.region.x+this.parent.styles.clipping.left);
                    //this.region.y = Math.max(this.region.y,this.parent.region.y+this.parent.styles.clipping.top);
                }
            }
            var resized = false;
            if(this.rightsizing)
            {
                this.region.w+=uiMouse.dx;
                resized = true;
                if(this.region.w < 100)
                {
                    uiMouse.dx-=(this.region.w-100);
                    this.region.w = 100;
                }
            }
            if(this.bottomsizing)
            {
                this.region.h+=uiMouse.dy;
                resized = true;
                if(this.region.h < 50)
                {
                    uiMouse.dy-=(this.region.h-50);
                    this.region.h = 50;
                }
            }
            if(this.leftsizing)
            {
                this.region.w-=uiMouse.dx;
                resized = true;
                if(this.region.w < 100)
                {
                    uiMouse.dx+=(this.region.w-100);
                    this.region.w = 100;
                }
                this.region.x+=uiMouse.dx;
                
            }
            if(this.topsizing)
            {
                this.region.h-=uiMouse.dy;
                resized = true;
                if(this.region.h < 50)
                {
                    uiMouse.dy+=(this.region.h-50);
                    this.region.h = 50;
                }
                this.region.y+=uiMouse.dy;
                
            }
            if(resized)
            {
                this.onResize({uiSource:this});
            }
        }
        
        if(uiMouse.isInside(this) && uiMouse.btn == 0)
        {
            var righthover = false;
            var lefthover = false;
            var tophover = false;
            var bottomhover = false;

            if (Math.abs(uiMouse.x - (this.region.x+this.region.w)) < this.styles.text.hmargin)
            {
                righthover = this.styles.border.resizable && this.styles.sizable.right;
            }
            if (Math.abs(uiMouse.y - (this.region.y+this.region.h)) < this.styles.text.hmargin)
            {
                bottomhover = this.styles.border.resizable && this.styles.sizable.bottom;
            }
            if (Math.abs(uiMouse.x - this.region.x) < this.styles.text.hmargin)
            {
                lefthover = this.styles.border.resizable && this.styles.sizable.left;
            }
            if (Math.abs(uiMouse.y - this.region.y) < this.styles.text.hmargin)
            {
                tophover = this.styles.border.resizable && this.styles.sizable.top;
            }

            if((righthover && tophover) || (lefthover && bottomhover) )
            {
                this.cursor = "nesw-resize";
                
            }    
            else if((righthover && bottomhover) || (lefthover && tophover) )
            {
                    this.cursor = ("nwse-resize");
                    e.uiCancel = true;
            }
            else if(righthover || lefthover)
            {
                    this.cursor = ("ew-resize");
                    e.uiCancel = true;
            }
            else if(tophover || bottomhover)
            {
                    this.cursor = ("ns-resize");
                    e.uiCancel = true;
            }
            else
            {
                    this.cursor = ("auto");
            }
        }
        else if(uiMouse.btn)
        {
            if((this.rightsizing && this.topsizing) || (this.leftsizing && this.bottomsizing) )
            {
                this.cursor = ("nesw-resize");
                e.uiCancel = true;
            }    
            else if((this.rightsizing && this.bottomsizing) || (this.leftsizing && this.topsizing) )
            {
                    this.cursor = ("nwse-resize");
                    e.uiCancel = true;
            }
            else if(this.rightsizing || this.leftsizing)
            {
                    this.cursor = ("ew-resize");
                    e.uiCancel = true;
            }
            else if(this.topsizing || this.bottomsizing)
            {
                    this.cursor = ("ns-resize");
                    e.uiCancel = true;
            }
            else
            {
                    this.cursor = ("auto");
            }
            
        }
        
    }
    drawPanel(e)
    {
        //e.ctx.globalAlpha = this.styles.panel.alpha;
        uiDraw.fillRoundedRect(e.ctx,this.region.x,this.region.y,this.region.w,this.region.h,this.styles.panel.color,this.styles.panel.alpha,this.styles.panel.round,this.styles.panel.round,this.styles.panel.round,this.styles.panel.round);
    }
    drawBorder(e)
    {
        e.ctx.globalAlpha = this.styles.border.alpha;
        uiDraw.strokeRoundedRect(e.ctx,this.region.x,this.region.y,this.region.w,this.region.h,this.styles.border.color,this.styles.border.alpha,this.styles.border.width,this.styles.panel.round,this.styles.panel.round,this.styles.panel.round,this.styles.panel.round);
    }
    
    styles ={
            text:{font:"12px Arial", color:"black", alpha:1, halign:"left", valign:"top", hmargin:8, vmargin:8},
            panel:{color:"lightgray", alpha:1, round:5, movable:true},
            border:{width:1,color:"black",alpha:1, resizable:true},
            sizable:{left:true, right:true, top:true, bottom:true},
            clipping:{enabled:true,restrict:false,left:2,right:2,top:2,bottom:2}
            }
    setStyles(
        styles={
            text:{font:"12px Arial", color:"black", alpha:1, halign:"left", valign:"top", hmargin:8, vmargin:8},
            panel:{color:"lightgray", alpha:1, round:5, movable:true},
            border:{width:1,color:"black",alpha:1, resizable:true},
            sizable:{left:true, right:true, top:true, bottom:true},
            clipping:{enabled:true,restrict:false,left:2,right:2,top:2,bottom:2}
            }
        )
    {
        //the only reason the function is here was to  show the possible values for this object in ms code 
        super.setStyles(styles);
    }
}

