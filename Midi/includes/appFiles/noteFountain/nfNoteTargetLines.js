
class nfHSeperatorLine extends uiPanel
{
    moveMode = false;
    hover = false;
    deltaY = -1;
    name = "nfHSeperatorLine";
    cursor = "ns-resize";
    onMouseSelf(e)
    {
        e.uiCancel = true;
        if(uiMouse.haveCapture(this)) 
        {
            if(uiMouse.btn == 0)
            {
                this.hover = false;
                uiMouse.releaseCapture();
            }
            else if(uiMouse.btn == 1)
            {
                this.deltaY-=uiMouse.dy;

                var deltaTop = this.parent.region.h;
                var next = this.getNextSibling();
                if(next !== null && next.name=="nfHSeperatorLine") deltaTop = next.deltaY

                
                var deltaBottom = -midiKeyboardDevice.shapeSpecs.keysTop+this.region.h/2;
                var myIndex = this.parent.getChildIndex(this);
                if(myIndex == 0)
                {
                    deltaBottom = -midiKeyboardDevice.shapeSpecs.keysTop+this.region.h/2;
                }
                else if(myIndex == 1)
                {
                    deltaBottom = 0+this.region.h/2;
                    deltaBottom = Math.max(deltaBottom,this.getPrevSibling().deltaY);
                }
                else if(myIndex !=-1)
                {
                    deltaBottom = this.getPrevSibling().deltaY
                }

  
                this.deltaY = Math.min(this.deltaY,deltaTop);
                this.deltaY = Math.max(this.deltaY,deltaBottom);
                
            }
        }
        if(uiMouse.isInside(this) && uiMouse.isInside(this.parent))
        {
            if(uiMouse.nooneCapture())
            {
                uiMouse.setCapture(this);
                this.hover = true;
            }
        }
        
        
    }
    onDrawSelf(e)
    {
        
        this.region.y = this.parent.region.y+this.parent.region.h-this.deltaY;
        this.region.w = this.parent.region.w;
        e.ctx.save();
        
        e.ctx.globalAlpha = ((this.hover) ? 1 : this.styles.line.alpha);


        uiDraw.strokeLine(e.ctx,this.region.x,this.region.y+this.region.h/2,this.region.x+this.region.w,this.region.y+this.region.h/2,this.styles.line.color,this.styles.line.width);

        e.ctx.restore()
        if(this.hover)
        {
            this.region.y+=this.region.h/2;
            this.drawLabel(e);
            this.region.y-=this.region.h/2;
        }

    }
    styles ={
        text:{font:"12px Arial", color:"black", alpha:1, halign:"left", valign:"top"},
        line:{color:"lime", alpha:.1, width:3},
        panel:{color:"lime", alpha:0, movable:false}
        };
    
    
setStyles(
    styles ={
        text:{font:"12px Arial", color:"black", alpha:1, halign:"left", valign:"top"},
        line:{color:"lime", alpha:.1, width:3},
        panel:{color:"lime", alpha:0, movable:false}
        }
    )
    {
        //the only reason the function is here was to  show the possible values for this object in ms code 
        super.setStyles(styles);
    }
}


var off = 0;
off = 0;
var tooLateNoteLine = new nfHSeperatorLine()
//tooLateNoteLine.setRegion({x:fountainRegion.region.x,y:fountainRegion.region.h+midiKeyboardDevice.shapeSpecs.keysTop-off,w:window.innerWidth,h:30});
tooLateNoteLine.setRegion({x:fountainRegion.region.x,y:fountainRegion.region.h-off,w:window.innerWidth,h:15});
tooLateNoteLine.deltaY = off;
tooLateNoteLine.setStyles(defaultTextStyle);
tooLateNoteLine.setStyles({text:{color:"red", valign:"bottom"}});
tooLateNoteLine.setStyles({line:{color:"red", alpha:.1, width:3}});
tooLateNoteLine.setStyles({panel:{color:"lime", alpha:0, movable:false}});
tooLateNoteLine.setText("  Late Line");
fountainRegion.addChild(tooLateNoteLine);

off = 15;
var targetNoteLine = new nfHSeperatorLine()
targetNoteLine.setRegion({x:tooLateNoteLine.region.x,y:fountainRegion.region.h-off,w:window.innerWidth,h:15});
targetNoteLine.deltaY = off;
targetNoteLine.setStyles(defaultTextStyle);
targetNoteLine.setStyles({text:{color:"lime", valign:"bottom"}});
targetNoteLine.setStyles({line:{color:"lime", alpha:.1, width:3}});
targetNoteLine.setStyles({panel:{color:"lime", alpha:0, movable:false}});
targetNoteLine.setText("  Target Line");
fountainRegion.addChild(targetNoteLine);


off = 30;
var tooSoonNoteLine = new nfHSeperatorLine()
tooSoonNoteLine.setRegion({x:targetNoteLine.region.x,y:fountainRegion.region.h-off,w:window.innerWidth,h:15});
tooSoonNoteLine.deltaY = off;
tooSoonNoteLine.setStyles(defaultTextStyle);
tooSoonNoteLine.setStyles({text:{color:"orange", valign:"bottom"}});
tooSoonNoteLine.setStyles({line:{color:"orange", alpha:.1, width:3}});
tooSoonNoteLine.setStyles({panel:{color:"lime", alpha:0, movable:false}});
tooSoonNoteLine.setText("  Early Line");
fountainRegion.addChild(tooSoonNoteLine);

off = 45;
var hintNoteLine = new nfHSeperatorLine()
hintNoteLine.setRegion({x:tooSoonNoteLine.region.x,y:fountainRegion.region.h-off,w:window.innerWidth,h:15});
hintNoteLine.deltaY = off;
hintNoteLine.setStyles(defaultTextStyle);
hintNoteLine.setStyles({text:{color:"yellow", valign:"bottom"}});
hintNoteLine.setStyles({line:{color:"yellow", alpha:.1, width:3}});
hintNoteLine.setStyles({panel:{color:"lime", alpha:0, movable:false}});
hintNoteLine.setText("  Hint Line");
fountainRegion.addChild(hintNoteLine);

