class uiListbox extends uiPanel
{
    name = "uiListbox";
    scrollDY = 0;
    findIndexUnderThisY = -1;
    hoverIndex = -1;
    selIndex = -1;
    scrollSpdY = 0;
    itemsArray = [];
    //set the list array of items where items are obejcts with itemText and itemSelected as member data
    // [{itemText:"itemText",itemSelected:false, "itemHilighted:false, yourdata...},...] 
    setList(itemsArray)
    {
        this.itemsArray = itemsArray;
    }
    setSelected(index, selected)
    {
        var oldSel = this.selIndex;
        this.selIndex = -1; //singleton select set to none
        if (selected == -1) //toggle
        {
            if(this.styles.list.toggleonoff==true) //if -1, toggle the value and get the new value
                selected = this.itemsArray[index].itemSelected = !this.itemsArray[index].itemSelected;
            else
                selected = true;
        }
        
        
        if(selected) //turn the selection on for the item
        {
            if(selected && this.styles.list.multiSelect == false) //clear everyone but this one
            {
                this.itemsArray.forEach(item => {item.itemSelected = false});
            }
            this.selIndex = index;
            this.itemsArray[index].itemSelected = selected;
            this.setText(this.itemsArray[index].itemText);
            uig.callIfDefined(this.callbacks.onselected, { uiOldValue:oldSel, uiNewValue:this.selIndex, uiSource:this})
            
        }
        if(this.selIndex != oldSel)
        {
            uig.callIfDefined(this.callbacks.onselchanged, { uiOldValue:oldSel, uiNewValue:this.selIndex, uiSource:this})
        }
    }
    scrollTo(index)
    {
        this.scrollDY = -Math.max(0,Math.min(index, this.itemsArray.length-1)) * this.styles.list.itemheight;
    }
    clearSelected()
    {
        this.itemsArray.forEach(item => {item.itemSelected = false});
        this.selIndex = -1; 
    }
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
            if(this.itemsArray.length && this.styles.text.alpha > 0)
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
                e.ctx.save();
                this.drawList(e);
                e.ctx.restore();
                this.region.x-=ha;
                this.region.y-=va;
                //e.ctx.globalAlpha = this.styles.text.alpha;
                //uiDraw.drawEnhText(e.ctx, this.region.x+ha, this.region.y+va, this.text, this.styles.text.color, this.styles.text.alpha, this.styles.text.font, this.styles.text.halign, this.styles.text.valign);
                
                if(this.styles.clipping.enabled)
                {
                    e.ctx.restore();
                }
            }
            e.ctx.restore();
        }
    }
    drawList(e)
    {
        var mouseOver = uiMouse.isMouseOver(this);
        var itemHalfHeight = this.styles.list.itemheight/2;
        var itemQuarterHeight = itemHalfHeight/2;
        var width = this.region.w-this.styles.text.hmargin*2;//-this.styles.text.hmargin;
        var height = this.region.h-this.styles.text.vmargin*2;//-this.styles.text.vmargin;
        
        this.scrollDY+=this.scrollSpdY;
        var sdy = this.scrollSpdY*=this.styles.list.flingscroll;
        if(Math.abs(sdy)<.01 || this.styles.list.flingscroll == 0)
            sdy = 0;
        else
        {
            //uiDraw.Dirty("uiListbox.drawList");
        }
        var dy = this.scrollDY;
        

        var backx = this.region.x;
        var normalcap = true;
        var itemsListHeight = this.itemsArray.length*this.styles.list.itemheight;

        var yyy = 0;
        
        if(this.styles.text.halign == "center")
        {
            backx-=width/2;
        }
        else if(this.styles.text.halign == "right")
        {
            backx-=width;
        }
        var yyy = 0;
        if(this.styles.text.valign == "middle")
        {
            yyy-=height/2;
            if(itemsListHeight<height)
            {
                dy = (height-itemsListHeight)/2;
                normalcap = false;
            }
        }
        else if(this.styles.text.valign == "bottom")
        {

            yyy-=height;
            if(itemsListHeight<height)
            {
                dy = (height-itemsListHeight);
                normalcap = false;
            }
        }
        
        if(normalcap)
        {
            dy = Math.max(dy,height-itemsListHeight); 
            dy = Math.min(dy,0);

            //stop the speed based scroll if reach top or bottom
            if(dy == height-itemsListHeight || dy == 0) 
            {
                sdy = 0;
            }
        }
        var mapRegion = uig.mapRegionXY(this);
        var yStart = this.region.y + this.styles.list.itemheight/2 + dy;
        //uiDraw.strokeLine(e.ctx,this.region.x,yStart,this.region.x+10,yStart,"red",1); //debug position
        for(var i = 0; i < this.itemsArray.length; i++)
        {
            var listItem = this.itemsArray[i];
            var itemText = listItem.itemText;
            var yy = yStart+i*this.styles.list.itemheight;
             if(yy>this.region.y-itemHalfHeight-itemHalfHeight && yy < this.region.y+height+itemHalfHeight + itemHalfHeight) //only draw if inside the view port
            {
                if(this.findIndexUnderThisY>-1)
                {
                    if(this.findIndexUnderThisY>=yy+yyy-itemHalfHeight && this.findIndexUnderThisY < yy+yyy+itemHalfHeight)
                    {
                        this.hoverIndex = i;
                    }
                }
                if(this.itemsArray[i].itemHilighted)
                {
                    //e.ctx.globalAlpha = this.styles.list.hilighted.backalpha;
                    uiDraw.fillRoundedRect(e.ctx,backx,yy+yyy-itemHalfHeight,width,this.styles.list.itemheight,this.styles.list.hilighted.backColor,this.styles.list.hilighted.backalpha,0,0,0,0);
                    e.ctx.globalAlpha = this.styles.list.hilighted.alpha;
                    uiDraw.drawEnhText(e.ctx,this.region.x,yy+yyy, itemText, this.styles.list.hilighted.color, this.styles.text.alpha, this.styles.text.font, this.styles.text.halign, "middle", this.styles.list.itemheight);
                }
                else if(this.itemsArray[i].itemSelected)
                {
                    //e.ctx.globalAlpha = this.styles.list.selected.backalpha;
                    uiDraw.fillRoundedRect(e.ctx,backx,yy+yyy-itemHalfHeight,width,this.styles.list.itemheight,this.styles.list.selected.backColor,this.styles.list.selected.backalpha,0,0,0,0);
                    e.ctx.globalAlpha = this.styles.list.selected.alpha;
                    uiDraw.drawEnhText(e.ctx,this.region.x,yy+yyy, itemText, this.styles.list.selected.color, this.styles.text.alpha, this.styles.text.font, this.styles.text.halign, "middle", this.styles.list.itemheight);
                }
                else if(this.hoverIndex == i && mouseOver)
                {
                    //e.ctx.globalAlpha = this.styles.list.hover.backalpha;
                    uiDraw.fillRoundedRect(e.ctx,backx,yy+yyy-itemHalfHeight,width,this.styles.list.itemheight,this.styles.list.hover.backColor,this.styles.list.hover.backalpha,0,0,0,0);
                    e.ctx.globalAlpha = this.styles.list.hover.alpha;
                    uiDraw.drawEnhText(e.ctx,this.region.x,yy+yyy, itemText, this.styles.list.hover.color, this.styles.text.alpha, this.styles.text.font, this.styles.text.halign, "middle", this.styles.list.itemheight);
                }
                else
                {
                    e.ctx.globalAlpha = this.styles.text.alpha;
                    
                    uiDraw.drawEnhText(e.ctx,this.region.x,yy+yyy, itemText, this.styles.text.color, this.styles.text.alpha, this.styles.text.font, this.styles.text.halign, "middle", this.styles.list.itemheight);
                    //uiDraw.strokeLine(e.ctx,this.region.x,yy,this.region.x+10,yy,"red",1); //debug position
                }

                
                if(this.callbacks.onpostdrawitem != null) 
                {
                    this.callbacks.onpostdrawitem({drawData:e, listItem:this.itemsArray[i], itemRegion:{x:backx, y:yy+yyy-itemHalfHeight,w:width,h:this.styles.list.itemheight}});
                }

                
            }
        }
        this.scrollDY = dy; //fix it so that if dy change during the draw
        this.scrollSpdY = sdy; //fix it so that if dy change during the draw
    }
    onMouseSelf(e)
    {
        
        if(e.type == "mousedown" && uiMouse.isInside(this))
        {
            //if(this.parent.styles.panel.movable) 
            //{
            //    this.parent.setTopMost();
            //}
            uig.setAncestorTopMost(this,"uiFrame");
            uiMouse.setCapture(this);
        }
        if(uiMouse.haveCapture(this))
        {
            e.uiCancel = true;
            if(e.type == "mouseup")
            {
                uiMouse.releaseCapture();
                if(uiMouse.accdisty < 3 && this.hoverIndex>-1)
                {
                    this.setSelected(this.hoverIndex, -1)
                }

            }
            else if (e.type == "mouseleave")
            {
                uiMouse.releaseCapture();
            }
            else
            {
                if(this.styles.list.flingscroll == 0)
                {
                    this.scrollDY+=uiMouse.dy;
                    this.scrollSpdY = 0;
                }
                else
                {
                    this.scrollDY+=uiMouse.dy/2;
                    this.scrollSpdY=uiMouse.dy/2;
                }
                if(uiMouse.accdisty>3)
                {
                    this.hoverIndex = -1;
                    this.findIndexUnderThisY = -1;
                }
            }
            //uiDraw.Dirty("uiListbox.onMouseSelf");
        }
        else if(uiMouse.isInside(this))
        {
            this.hoverIndex = -1;
            this.findIndexUnderThisY = -1;
            if(uiMouse.btn == 0)
            {
                this.findIndexUnderThisY = uiMouse.y;
            }
            if(e.type == "wheel" && uiMouse.isInside(this))
            {
                //this.scrollDY += Math.sign(-e.deltaY) * this.styles.list.itemheight*2.25;
                
                this.scrollDY += Math.sign(-e.deltaY) * Math.max(this.styles.list.itemheight/2,this.region.h/5);
            }
            e.uiCancel = true;
            
            //uiDraw.Dirty("uiListbox.onMouseSelf");
        }
        else
        {
            //if(this.hoverIndex >-1 || this.findIndexUnderThisY>-1) //uiDraw.Dirty("uiListbox.onMouseSelf");
            this.hoverIndex = -1;
            this.findIndexUnderThisY = -1;
        }
       
    }
    styles ={
            text:{font:"12px Arial", color:"black", alpha:1, halign:"left", valign:"top", hmargin:4, vmargin:4},
            panel:{color:"lightgray", alpha:1, round:5},
            border:{width:1,color:"black",alpha:1},
            clipping:{enabled:true,left:2,right:2,top:2,bottom:2},
            list:{multiSelect:false, toggleonoff:false, itemheight:16, flingscroll:.98, 
                selected:{color:"lightgray",alpha:1,backColor:"blue",backalpha:1},
                hover:{color:"black",alpha:1,backColor:"silver",backalpha:1},
                hilighted:{color:"black",alpha:1,backColor:"silver",backalpha:1}
                }
            }
        
        
    setStyles(
        styles={
            text:{font:"12px Arial", color:"black", alpha:1, halign:"left", valign:"top", hmargin:4, vmargin:4},
            panel:{color:"lightgray", alpha:1, round:5},
            border:{width:1,color:"black",alpha:1},
            clipping:{enabled:true,left:2,right:2,top:2,bottom:2},
            list:{multiSelect:false, toggleonoff:false, itemheight:16, flingscroll:.98, 
                selected:{color:"lightgray",alpha:1,backColor:"blue",backalpha:1},
                hover:{color:"black",alpha:1,backColor:"silver",backalpha:1},
                hilighted:{color:"black",alpha:1,backColor:"silver",backalpha:1}
                }
            }
        )
    {
        //the only reason the function is here was to  show the possible values for this object in ms code 
        super.setStyles(styles);
    }
    
    setCallbacks(callbacks={onselchanged: function (){},onselected: function (){}, onpostdrawitem:function (){}})
    {
        //the only reason the function is here was to show the possible values for this object in ms code 
        super.setCallbacks(callbacks);
    }

    onResizeSelf(e)
    {
        if(e.uiSource == this.parent)
        {
            if(this.parent.rightsizing)
            {
                this.region.w += uiMouse.dx;
            }
            if(this.parent.bottomsizing)
            {
                this.region.h += uiMouse.dy;
            }
            if(this.parent.leftsizing)
            {
                this.region.w -= uiMouse.dx;
            }
            if(this.parent.topsizing)
            {
                this.region.h -= uiMouse.dy;
            }
        }
    }
}


