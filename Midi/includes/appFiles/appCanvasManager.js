//this manages the UI canvas, resizing it and cause uiDraw to dispatch drawing events to its registered elements
class appCanvasManager extends appModule
{
    canvasName = "";
    canvas = null;
    ctx = null;
    uiDesktop = null;
    constructor(canvasName = "", uiDesktop = null)
    {
        super();
        this.canvasName = canvasName;
        this.uiDesktop = uiDesktop
    }
    onNewFrame(now)
    {
        timeIndex();
        if(!this.ctx)
        {
            this.initContext();
        }
        this.resizeCanvas();
        //uiDraw.DirtyClear(); //clear the dirty flag, TODO:Deprecate the flag. it proved a useless optimisation nightmare.
        //clear the screen and redraw the ui
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    onDrawFrame(now) //every animation frame, check the canvas size and reflect changes
    {
        if(!this.ctx) return;
        this.ctx.save();
        uiDraw.dispatchDrawEvent(this.canvas, this.ctx, now);

        //dubug draw images
        //for(var i = 0; i< uiRes.imagesArray.length; i++)
        //{
        //    var img = uiRes.getImage(i);
        //    this.ctx.drawImage(img,i * 30, i*30, img.width, img.height);
        //}


        this.ctx.restore();
    }
    initContext() 
    {
        
        this.canvas = document.getElementById(this.canvasName);
        if(!this.canvas)
        {
            console.error("Could not get the canvas:", this.canvasName);
        }
        this.ctx = this.canvas.getContext("2d");
        if (!this.ctx) {
            console.error("Could not get the context for canvas:", this.canvasName);
        }
    }
    resizeCanvas() 
    {
        // Lookup the size the browser is displaying the canvas in CSS pixels.
        const displayWidth  = window.innerWidth;//canvas.clientWidth;
        const displayHeight = window.innerHeight;//canvas.clientHeight;

        // Check if the canvas is not the same size.
        const needResize = this.canvas.width  !== displayWidth ||
                            this.canvas.height !== displayHeight;
        if (needResize) 
        {
            
            // Make the canvas the same size
            this.canvas.width  = displayWidth;
            this.canvas.height = displayHeight;
            this.canvas.style.width = window.innerWidth + 'px';
            this.canvas.style.height = window.innerHeight + 'px';

            this.uiDesktop.region.w = displayWidth;
            this.uiDesktop.region.h = displayHeight;
            this.uiDesktop.onResize({uiSource:this.uiDesktop})
        
        }
        return needResize;
    }
    onReset()
    {
        this.uiDesktop.onAppMessage({message:"reset",uiSource:this})
    }
}