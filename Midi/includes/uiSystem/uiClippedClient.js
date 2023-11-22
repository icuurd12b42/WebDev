
//this is used to to create a client area usually in another panel
//to clip any child windows that would draw outside the region
//if the styles.clipping.enabled is true, children windows will be clipped. 
//We have a separate object for clipping children because the way the uiPanel clipping works only does the 
//clipping for the things it draws, eg, the text for the base uiPanel
//think Windows client area...
//TODO, phaze out this class since the clipping has been added to the basedobject
class uiClippedClient extends uiPanel
{
    name = "uiClippedClient";


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
            
            e.ctx.restore();
        }
    }
    
    drawPanel(e)
    {
        //e.ctx.globalAlpha = this.styles.panel.alpha;
        uiDraw.fillRoundedRect(e.ctx,this.region.x,this.region.y,this.region.w,this.region.h,this.styles.panel.color,this.styles.panel.alpha,this.styles.panel.round,this.styles.panel.round,this.styles.panel.round,this.styles.panel.round);
    }
    drawBorder(e)
    {
        //e.ctx.globalAlpha = this.styles.border.alpha;
        uiDraw.strokeRoundedRect(e.ctx,this.region.x,this.region.y,this.region.w,this.region.h,this.styles.border.color,this.styles.border.alpha, this.styles.border.width,this.styles.panel.round,this.styles.panel.round,this.styles.panel.round,this.styles.panel.round);
    }
    
    styles ={
            text:{font:"12px Arial", color:"black", alpha:1, halign:"left", valign:"top", hmargin:3, vmargin:3},
            panel:{color:"lightgray", alpha:1, round:5, movable:false},
            border:{width:1,color:"black",alpha:1, resizable:false},
            clipping:{enabled:true,left:2,right:2,top:2,bottom:2},
            }
    setStyles(
        styles={
            text:{font:"12px Arial", color:"black", alpha:1, halign:"left", valign:"top", hmargin:3, vmargin:3},
            panel:{color:"lightgray", alpha:1, round:5, movable:false},
            border:{width:1,color:"black",alpha:1, resizable:false},
            clipping:{enabled:true,left:2,right:2,top:2,bottom:2}
            }
        )
    {
        //the only reason the function is here was to  show the possible values for this object in ms code 
        super.setStyles(styles);
    }
}