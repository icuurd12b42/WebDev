
class uiLabel extends uiBaseObject
{
    name = "uiLabel";
    onDrawSelf(e)
    {
        if(this.text != "" && this.styles.text.alpha > 0)
        {
            e.ctx.save();
            this.drawLabel(e);
            e.ctx.restore();
        }
    }
    
    drawLabel(e)
    {
        //e.ctx.globalAlpha = this.styles.text.alpha;
        //uiDraw.strokeLine(e.ctx,this.region.x,this.region.y,this.region.x+10,this.region.y,"red",1); //debug position
        uiDraw.drawEnhText(e.ctx, 
            this.region.x, 
            this.region.y, 
            this.text, 
            this.styles.text.color,
            this.styles.text.alpha, 
            this.styles.text.font, 
            this.styles.text.halign, 
            this.styles.text.valign);
     }

    text = "";
    setText(text="")
    {
        var e = { uiOldValue:this.text, uiNewValue:text, uiSource:this};

        this.text = text;
        
        uig.callIfDefined(this.callbacks.onsettext,e);

       
    }

//font tips: https://www.w3schools.com/tags/canvas_font.asp
    styles ={text:{font:"12px Arial", color:"black", alpha:1, halign:"left", valign:"top"}}
    setStyles(styles=
            {text:{font:"12px Arial", color:"black", alpha:1, halign:"left", valign:"top"}})
    {
        //the only reason the function is here was to  show the possible values for this object in ms code 
        super.setStyles(styles);
    }
    
    setCallbacks(callbacks={onsettext: function (){}})
    {
        //the only reason the function is here was to show the possible values for this object in ms code 
        super.setCallbacks(callbacks);
    }
}