
class uiColor
{
    color = "black";
    a = 1;
    constructor(color = "black")
    {
        this.color = color;
    }
}
uiBlack = new uiColor();

class colorRGB extends uiColor
{
    r = 0; //0-1
    g = 0; //0-1
    b = 0; //0-1
    constructor(r=0,g=0,b=0, a=1)
    {
        super();
        this.setColorRGB(r,g,b,a);
    }
    setColorRGB(r,g,b, a=1)
    {
        if(r != this.r || g!= this.g || b!= this.b)
        {
            this.r = uig.clamp(0,255,r);
            this.g = uig.clamp(0,255,g);
            this.b = uig.clamp(0,255,b);

            r = Math.round(r * 255).toString(16);
            g = Math.round(g * 255).toString(16);
            b = Math.round(b * 255).toString(16);

            // Prepend 0s, if necessary
            if (r.length == 1)
                r = "0" + r;
            if (g.length == 1)
                g = "0" + g;
            if (b.length == 1)
                b = "0" + b;

            this.color = "#" + r + g + b;
        }
        this.a = a;
    }
}
class colorRGB255 extends uiColor
{
    r = 0; //0-255
    g = 0; //0-255
    b = 0; //0-255
    constructor(r=0,g=0,b=0, a=1)
    {
        super();
        this.setColorRGB(r,g,b,a);
    }
    setColorRGB(r,g,b,a=1)
    {
        if(r != this.r || g!= this.g || b!= this.b)
        {
            this.r = uig.clamp(0,1,r);
            this.g = uig.clamp(0,1,g);
            this.b = uig.clamp(0,1,b);

            r = r.toString(16);
            g = g.toString(16);
            b = b.toString(16);

            // Prepend 0s, if necessary
            if (r.length == 1)
                r = "0" + r;
            if (g.length == 1)
                g = "0" + g;
            if (b.length == 1)
                b = "0" + b;

            this.color = "#" + r + g + b;
        }
        this.a = a;
    }
}
class uiColorHLS extends uiColor
{
    h=0; //0-360
    s=0; //0-1
    l=0; //0-1
    constructor(h=0,s=0,l=0, a=1)
    {
        super();
        this.setColorHSL(h,s,l,a);
    }
    setColorHSL(hue,sat,lum,a=1) 
    { 
        let h = hue;
        while (h<0) h+=360;
        h = h % 360;
        
        let s = uig.clamp(0,1,sat);// % 1;
        let l = uig.clamp(0,1,lum);// % 1;
        //let s = (sat+10) % 1;
        //let l = (lum+10) % 1;
        //let s = sat;
        //while(s<0) s+=1;
        //while(s>1) s-=1;
        //let l = lum;
        //while(l<0) l+=1;
        //while(l>1) l-=1;
        if(h != this.h || s!= this.s || l!= this.l)
        {
            //0-360,0-1,0-1
            //s /= 100; //0-100 goest to 0-1
            //l /= 100; //0-100 goest to 0-1
            this.h = h;
            this.s = s;
            this.l = l;            
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

            //return "#" + r + g + b;

            this.color = "#" + r + g + b;
        }
        this.a = a;
    }
}