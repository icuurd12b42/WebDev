class nfNoteFountainRegion extends uiPanel //uiClippedClient
{
    name = "nfNoteFountainRegion";
    onDrawSelf(e)
    {
        this.region.x = 0;
        this.region.y = 0;
        this.region.w = window.innerWidth;
        this.region.h = window.innerHeight - midiKeyboardDevice.region.h;
        //super.onDrawSelf(e);
    }
    onMouseSelf(e)
    {
        e.uiCancel = true;
        if(e.type == "mousedown" && uiMouse.isInside(this))
        {
            uiMouse.setCapture(this);
            this.children.forEach(child => {child.hover = true;});
        }
        if(uiMouse.haveCapture(this))
        {
            if(e.type == "mouseup")
            {
                uiMouse.releaseCapture();
                this.children.forEach(child => {child.hover = false;});
            }
            else if(e.type == "mouseenter" && uiMouse.btn == 0)
            {
                uiMouse.releaseCapture();
                this.children.forEach(child => {child.hover = false;});
            }
            else
            {

                this.children.forEach(child => {child.deltaY-=uiMouse.dy;});
                if(targetNoteLine.deltaY < -0+targetNoteLine.region.h/2)
                {
                    var adjDelta = targetNoteLine.region.h/2-targetNoteLine.deltaY;
                    this.children.forEach(child => {child.deltaY+=adjDelta;});
                }
                else if(tooLateNoteLine.deltaY < -midiKeyboardDevice.shapeSpecs.keysTop+tooLateNoteLine.region.h/2)
                {
                    var adjDelta = -midiKeyboardDevice.shapeSpecs.keysTop+tooLateNoteLine.region.h/2 -tooLateNoteLine.deltaY;
                    this.children.forEach(child => {child.deltaY+=adjDelta;});
                }

            }
            //uiDraw.Dirty("uiListbox.onMouseSelf");
        }
        
    }
}

var fountainRegion = new nfNoteFountainRegion();
fountainRegion.setStyles({text:{font:"12px Arial", hmargin:8, vmargin:8}});
fountainRegion.setStyles({panel:{alpha:1, round:5, movable:false}});
fountainRegion.setStyles({border:{alpha:1, resizable:false}});
//fountainRegion.setStyles({clipping:{enabled:true,left:2,right:2,top:2,bottom:2}});

//fountainRegion.setText("Fountain Region");
fountainRegion.setRegion({x:0,y:100,w:window.innerWidth,h:window.innerHeight - midiKeyboardDevice.region.h});
myBase.addChild(fountainRegion);