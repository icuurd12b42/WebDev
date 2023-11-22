class uiDraw
{
    //remember to ctx.save and ctx.restore accordingly when using these functions
    static restoreContext(ctx, oldSettings)
    {
        ctx.fillStyle = oldSettings.fillStyle;
        ctx.lineWidth = oldSettings.lineWidth;
        ctx.strokeStyle = oldSettings.strokeStyle;
        ctx.font = oldSettings.font;
        ctx.textBaseline = oldSettings.textBaseline;
        ctx.textAlign = oldSettings.textAlign;
        ctx.globalAlpha = oldSettings.globalAlpha;
    }
    static strokeLine(ctx,x1,y1,x2,y2,color, lineWidth)
    {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    static fillCircle(ctx, x, y, radius, color) {
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
        ctx.fillStyle = color
        ctx.fill()
        
      }
    static strokeCircle(ctx, x, y, radius, color, lineWidth) {
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = color
        ctx.stroke()
      }
    //draw a colored rectangle.
    static strokeRect(ctx, x, y, w, h, color, lineWidth)
    {
        if(w<=0 || h<=0) return;
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.stroke();
    }
    static fillRect(ctx, x, y, w, h, color)
    {
        if(w<=0 || h<=0) return;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fill();
    }


    static strokeRoundedRect(ctx, x, y, w, h, color, alpha, lineWidth, cr1,cr2,cr3,cr4)
    {
        uiDraw.buildRoundedRect(ctx, x, y, w, h, lineWidth, cr1,cr2,cr3,cr4);
        ctx.lineWidth = lineWidth;									// set width
        ctx.strokeStyle = color;									// and color
        ctx.globalAlpha = alpha;									// and alpha
        ctx.stroke();                     							// and Draw it
    }
    static strokeRoundedRectLinesCol(ctx, x, y, w, h, alpha, lineWidth, cr1,cr2,cr3,cr4, col1, col2, col3, col4)
    {
        //col1 is left, col2 is top, colr3 is right, col4 is bottom
        if(w<=0 || h<=0) return;
        var lw = lineWidth;
        ctx.save();
        ctx.beginPath();  
        ctx.moveTo(x-lw,y-lw);
        ctx.lineTo(x+w+lw,y+lw);
        ctx.lineTo(x+w/2,y+h/2)
        ctx.closePath();
        ctx.clip();
        uiDraw.strokeRoundedRect(ctx, x, y, w, h, col2, alpha, lineWidth, cr1,cr2,cr3,cr4)
        ctx.restore()   ; 
        
        ctx.save();
        ctx.beginPath();  
        ctx.moveTo(x+w+lw,y-lw);
        ctx.lineTo(x+w+lw,y+h+lw);
        ctx.lineTo(x+w/2,y+h/2)
        ctx.closePath();
        ctx.clip();
        uiDraw.strokeRoundedRect(ctx, x, y, w, h, col3, alpha, lineWidth, cr1,cr2,cr3,cr4)
        ctx.restore();
        
        ctx.save();
        ctx.beginPath();  
        ctx.moveTo(x+w+lw,y+h+lw);
        ctx.lineTo(x-lw,y+h+lw)
        ctx.lineTo(x+w/2,y+h/2)
        ctx.closePath();
        ctx.clip();
        uiDraw.strokeRoundedRect(ctx, x, y, w, h, col4, alpha, lineWidth, cr1,cr2,cr3,cr4)
        ctx.restore();
        
        ctx.save();
        ctx.beginPath();  
        ctx.moveTo(x-lw,y+w+lw);
        ctx.lineTo(x-lw,y-lw)
        ctx.lineTo(x+w/2,y+h/2)
        ctx.closePath();
        ctx.clip();
        uiDraw.strokeRoundedRect(ctx, x, y, w, h, col1, alpha, lineWidth, cr1,cr2,cr3,cr4)
        ctx.restore();
    }
    static fillRoundedRect(ctx, x, y, w, h, color, alpha, cr1,cr2,cr3,cr4)
    {
        if(w<=0 || h<=0) return;
        uiDraw.buildRoundedRect(ctx, x, y, w, h, 1, cr1,cr2,cr3,cr4);
        ctx.fillStyle = color;										// set color
        ctx.globalAlpha = alpha;									// and alpha
        ctx.fill();                     							// and Draw it
    }
    static clipRoundedRect(ctx, x, y, w, h, cr1,cr2,cr3,cr4)
    {
        if(w<=0 || h<=0) return;
        uiDraw.buildRoundedRect(ctx, x, y, w, h, 1, cr1,cr2,cr3,cr4);
        ctx.clip();                     							// Clip it
    }
    static buildRoundedRect(ctx, x, y, w, h, lineWidth, cr1,cr2,cr3,cr4)
    {
        var ww = Math.max(0,w),
            hh = Math.max(0,h);
        var c1 = Math.min(ww/2,hh/2,cr1),
            c2 = Math.min(ww/2,hh/2,cr2),
            c3 = Math.min(ww/2,hh/2,cr3),
            c4 = Math.min(ww/2,hh/2,cr4);
    
        
        var offset = lineWidth/2 * (lineWidth>1); //if the line is >1 calculate an offets
        ctx.beginPath();     

        var r = c1
        ctx.moveTo(x+c1, y+offset);
        ctx.arcTo(x+ww-offset, y+offset,   x+ww-offset, y+hh-offset, c2);
        ctx.arcTo(x+ww-offset, y+hh-offset, x+offset,   y+hh-offset, c3);
        ctx.arcTo(x+offset,   y+hh-offset, x+offset,   y+offset,   c4);
        ctx.arcTo(x+offset,   y+offset,   x+ww, y+offset,   c1);
            
        ctx.closePath();    
    }

    static OLD_strokeRoundedRect(ctx, x, y, w, h, color, lineWidth, cr)
    {
        if(w<=0 || h<=0) return;
        var r = Math.min(cr,w/2,h/2);
        //if(cr<1) uiDraw.strokeRect(ctx, x, y, w, h, color, lineWidth);
        
        ctx.beginPath();
        ctx.moveTo(x+cr, y);
        ctx.arcTo(x+w, y, x+w, y+h, r);
        ctx.arcTo(x+w, y+h, x, y+h, r);
        ctx.arcTo(x, y+h, x, y, r);
        ctx.arcTo(x, y, x+w, y, r);
        ctx.closePath();
        
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke(); 
    }
    static OLD_fillRoundedRect(ctx, x, y, w, h, color, cr)
    {
        if(w<=0 || h<=0) return;
        var r = Math.min(cr,w/2,h/2);
        //if(r<1) uiDraw.fillRect(ctx, x, y, w, h, color);

        ctx.beginPath();
        ctx.moveTo(x+cr, y);
        ctx.arcTo(x+w, y, x+w, y+h, r);
        ctx.arcTo(x+w, y+h, x, y+h, r);
        ctx.arcTo(x, y+h, x, y, r);
        ctx.arcTo(x, y, x+w, y, r);
        ctx.closePath();
        
        ctx.fillStyle = color;
        ctx.fill();
    }
    static roundedRectWBorders2(ctx, x1, y1,x2,y2,bc,lc,lw,cr) 
    {
        if(x2-x1<=0 || y2-y1<=0) return;
        
        var r = Math.min(cr,(x2-x1)/2,(y2-y1)/2);
        ctx.beginPath();
        ctx.moveTo(x1+r, y1);
        ctx.arcTo( x2,   y1,   x2, y2, r);
        ctx.arcTo( x2,   y2,   x1, y2, r);
        ctx.arcTo( x1,   y2,   x1, y1, r);
        ctx.arcTo( x1,   y1,   x2, y1, r);
        ctx.closePath();
        ctx.lineWidth = lw;
        ctx.fillStyle = bc;
        ctx.strokeStyle = lc;
        
        ctx.fill()
        ctx.stroke();     

    }
    static roundedRectWBorders(ctx, x, y,w,h,bc,lc,lw,cr) 
    {
        if(w<=0 || h<=0) return;
        var r = Math.min(cr,w/2,h/2);
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.arcTo(x+w, y,   x+w, y+h, r);
        ctx.arcTo(x+w, y+h, x,   y+h, r);
        ctx.arcTo(x,   y+h, x,   y,   r);
        ctx.arcTo(x,   y,   x+w, y,   r);
        ctx.closePath();
        ctx.lineWidth = lw;
        ctx.fillStyle = bc;
        ctx.strokeStyle = lc;
        
        ctx.fill()
        ctx.stroke();     

    }
    static fillText(ctx, x, y, text, fontColor="black", alpha=1, font="12px Arial", hAlign="left", vAlign="top")
    {
        var oldA = ctx.globalAlpha;
        ctx.globalAlpha = alpha;
        ctx.textBaseline = vAlign;
        ctx.textAlign = hAlign;
        ctx.fillStyle = fontColor;
        ctx.font = font;
        ctx.fillText(text,x,y)
        ctx.globalAlpha = oldA;
    }
    static strokeText(ctx, x, y, text, fontColor="black", alpha=1, font="12px Arial", hAlign="left", vAlign="top")
    {
        var oldA = ctx.globalAlpha;
        ctx.globalAlpha = alpha;
        ctx.textBaseline = vAlign;
        ctx.textAlign = hAlign;
        ctx.strokeStyle = fontColor;
        ctx.lineWidth = lineWidth;
        ctx.font = font;
        ctx.strokeText(text,x,y)
        ctx.globalAlpha = oldA;
    }
    static drawImage(ctx,img,x,y,w,h,alpha = 1)
    {
        if(alpha<.001) return;
        var oldA = ctx.globalAlpha;
        ctx.globalAlpha = alpha;
        ctx.drawImage(img, x, y, w, h); 
        ctx.globalAlpha = oldA;            
    }
    //draw enhanced text. may contain tags for images and such
    //todo, add support for text alignement
    static drawEnhText(ctx, x, y, text, fontColor="black", alpha=1, font="12px Arial", hAlign="left", vAlign="top", h = 0)
    {
        if(alpha <.001) return;

        var arr = text.split('<e>');
        if(arr.length==1)
        {
            uiDraw.fillText(ctx, x, y, text, fontColor, alpha, font, hAlign, vAlign);
            return;
        }
        //"Instrument <e>img:THEIMAGE<e> Piano"
        var xx = x,
            yy = y;
        ctx.font = font;
        var itemHeight = h;
        if(h = 0)
            itemHeight = ctx.measureText("W").height;
        arr.forEach( element => 
        {
            var header = element.substring(0,4);
            if(header == "img:")
            {
                var imgData = element.substring(4);
                var imgName = imgData;
                var dataArr = imgData.split(":");
                var ratioItem = 1;
                if(dataArr.length>1)
                {
                    ratioItem = parseInt(dataArr[0]);
                    imgName = dataArr[1];
                }
                
                var img = uiRes.getImage(imgName);
                if(img)
                {
                    
                    var ratio = itemHeight/img.height * ratioItem;
                    uiDraw.drawImage(ctx,img, xx, yy-img.height/2*ratio, img.width*ratio, img.height*ratio,alpha);
                    xx+=img.width;
                }
            }
            else
            {
                uiDraw.fillText(ctx, xx, yy, element, fontColor, alpha, font, hAlign, vAlign);
                var w = ctx.measureText(element).width;
                xx+=w
            }
        });
    }
    //this is the list of objects registered...
	static listenerObjects = [];
	//..by this function...
	static addListener(o)
	{
		uiDraw.listenerObjects.push(o);
	}
	//... which will receive draw events. 
	//if a parent or any object in the ancestry chain is already registered, 
	//there is no need to register the object, else the object will receive 
	//multiple messages
	static dispatchDrawEvent(canvas, ctx, now)
	{
        var e = {canvas: canvas, ctx: ctx, now:now};
        uiDraw.listenerObjects.forEach(o => {o.onDraw(e);});
	}

    static hslToHex(hue,s,l) 
    { 
        //0-360,0-1,0-1
        //s /= 100; //0-100 goest to 0-1
        //l /= 100; //0-100 goest to 0-1
        let h = hue % 360;
        let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0, 
        b = 0; 

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        // Having obtained RGB, convert channels to hex
        r = Math.round((r + m) * 255).toString(16);
        g = Math.round((g + m) * 255).toString(16);
        b = Math.round((b + m) * 255).toString(16);

        // Prepend 0s, if necessary
        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;

        return "#" + r + g + b;
    }

}


/*
https://www.w3schools.com/tags/tryit.asp?filename=tryhtml5_canvas_arcto


<!DOCTYPE html>
<html>
<body>

<canvas id="myCanvas" width="540" height="540" style="border:1px solid #d3d3d3;">
Your browser does not support the HTML5 canvas tag.</canvas>

<script>
fillRoundedRect(ctx,x,y,w,h,"red",1,1,20,20,20,20);
//strokeRoundedRect(ctx,x+1,y+1,w-2,h-2,"yellow",1,10,14,14,14,14);
//strokeRoundedRect(ctx,x+11,y+11,w-22,h-22,"blue",1,10,14,14,14,14);
function strokeRoundedRect(ctx, x, y, w, h, color, alpha, lineWidth, cr1,cr2,cr3,cr4)
{
	buildRoundedRect(ctx, x, y, w, h, color, alpha, lineWidth, cr1,cr2,cr3,cr4);
    ctx.lineWidth = lineWidth;									// set width
    ctx.strokeStyle = color;									// and color
    ctx.globalAlpha = alpha;									// and alpha
    ctx.stroke();                     							// and Draw it
}
function fillRoundedRect(ctx, x, y, w, h, color, alpha, cr1,cr2,cr3,cr4)
{
	buildRoundedRect(ctx, x, y, w, h, 1, cr1,cr2,cr3,cr4);
    ctx.fillStyle = color;										// set color
    ctx.globalAlpha = alpha;									// and alpha
    ctx.fill();                     							// and Draw it
}
function clipRoundedRect(ctx, x, y, w, h, cr1,cr2,cr3,cr4)
{
	buildRoundedRect(ctx, x, y, w, h, 1, cr1,cr2,cr3,cr4);
    ctx.clip();                     							// Clip it
}
function buildRoundedRect(ctx, x, y, w, h, lineWidth, cr1,cr2,cr3,cr4)
{
	var c1 = Math.min(w/2,h/2,cr1),
    	c2 = Math.min(w/2,h/2,cr2),
    	c3 = Math.min(w/2,h/2,cr3),
    	c4 = Math.min(w/2,h/2,cr4);
    var ww = Math.max(0,w),
    	hh = Math.max(0,h);
	var offset = lineWidth/2 * (lineWidth>1); //if the line is >1 calculate an offets
    ctx.beginPath();     
    ctx.moveTo(x+c1,y+offset);               					// Create a starting point
    ctx.lineTo(x+ww-c2, y+offset);								// top line
    ctx.arcTo(x+ww-offset, y+offset, x+ww-offset, y+hh, c2);  	// upper right corner
    ctx.lineTo(x+ww-offset,y+hh-c3)								// right line
    ctx.arcTo(x+ww-offset, y+hh-offset, x, y+hh-offset, c3);  	// bottom right corner
    ctx.lineTo(x+c4,y+hh-offset);             					// bottom line
    ctx.arcTo(x+offset, y+hh-offset, x+offset, y, c4);  		// bottom left corner
    ctx.lineTo(x+offset,y+c1+offset)							// left line
    ctx.arcTo(x+offset, y+offset, x+cr1, y+offset, c1);  		// upper left corner
}
</script> 

</body>
</html>
*/
