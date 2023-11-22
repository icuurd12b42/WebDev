

class appShaderToyEffect extends appModule
{
    canvas = null;
    gl = null;
    program = null;

    fragShader = "Fire";
    //fragShader = "Shadertoy New";
    iResolution = null;
    iTime = null;
    iTimeDelta = null;
    iFrame = null;
    iMouse = null;
    iDate = null;

    u_notesArray = null;
    
    timeOld = 0;
    frameAt = 0;
    newmx = 0;
    newmy = 0;
    oldmx = 0;
    oldmy = 0;

    canvasName = "";

    firstDraw = true;

    u_matrix = null;

    positionAttributeLocation = null;
    positionBuffer = null;
    
    constructor(canvasName = "")
    {
        super();
        this.canvasName = canvasName;
    }
    onNewFrame(now)
    {
    
        if(!this.gl)
        {
            this.initContext();
            if(!this.gl)
            {
                return;
            }
            
        }
        var portwidth = window.innerWidth;
        var portheight = window.innerHeight-midiKeyboardDevice.region.h;//window.innerHeight;
        portwidth = Math.max(portwidth,0);
        portheight = Math.max(portheight,0);
        this.resizeCanvas(portwidth,portheight);

        //canvas.height;
        this.gl.viewport(0, 0, portwidth,portheight);

        // Clear the canvas.
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
    onDrawFrame(now)
    {
        if(!this.gl) return;
        var portwidth = window.innerWidth;
        var portheight = window.innerHeight-midiKeyboardDevice.region.h;//window.innerHeight;
        portwidth = Math.max(portwidth,0);
        portheight = Math.max(portheight,0);
        //canvas.height;
        this.gl.viewport(0, 0, portwidth,portheight);

        // Tell it to use our program (pair of shaders)
        this.gl.useProgram(this.program);
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
        this.gl.enable(this.gl.BLEND);
        this.gl.disable(this.gl.DEPTH_TEST);

        // Turn on the attribute
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        var size = 2;          // 2 components per iteration
        var type = this.gl.FLOAT;   // the data is 32bit floats
        var normalize = true; // don't normalize the data
        var stride = 2*4;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        this.gl.vertexAttribPointer(
            this.positionAttributeLocation, size, type, normalize, stride, offset);

        
        // Compute the matrices
        var projectionMatrix = m3.projection(portwidth, portheight);

        // Set the matrix.
        this.gl.uniformMatrix3fv(this.u_matrix, false, projectionMatrix);

        
        ///
        var invertedMouseY = this.canvas.height-uiMouse.y 
        this.timeNow = now * 0.001; // convert to seconds
        if(this.firstDraw)
        {
            this.timeOld = this.timeNow;
            this.newmx = 0;//uiMouse.x;
            this.newmy = 0;//invertedMouseY;
            this.oldmx = 0;//Math.abs(newmx);
            this.oldmy = 0;//Math.abs(newmy);
        }
        ///////////////////////////
        //SHADERTOY
        //send the standard shadertoy uniforms to the shader
        
        this.gl.uniform3fv(this.iResolution,[portwidth,portheight,portwidth/portheight]);
        this.gl.uniform1f(this.iTime,this.timeNow);
        this.gl.uniform1f(this.iTimeDelta,this.timeNow-this.timeOld);
        this.timeOld = this.timeNow;
        this.gl.uniform1f(this.iFrame,this.frameAt++);
        this.gl.uniform1f(this.iFrameRate,60); //not accurate, but gets the thing working
        if(!uiMouse.getCapture())
        {
            if(uiMouse.oldbtn == 0 && uiMouse.btn == 1)
            {
                this.oldmx = uiMouse.x;
                this.oldmy = invertedMouseY;
                this.newmx = uiMouse.x;
                this.newmy = invertedMouseY;
            }
            else if(uiMouse.oldbtn == 1 && uiMouse.btn == 0)
            {
                this.oldmx = -Math.abs(this.oldmx);
                this.oldmy = -Math.abs(this.oldmy);
                this.newmx = uiMouse.x;
                this.newmy = invertedMouseY;
            }
            else if(uiMouse.btn == 1)
            {
                this.oldmx = Math.abs(this.oldmx);
                this.oldmy = -Math.abs(this.oldmy);
                this.newmx = uiMouse.x;
                this.newmy = invertedMouseY;
            }
            else
            {
                this.oldmx = -Math.abs(this.oldmx);
                this.oldmy = -Math.abs(this.oldmy);

            }
            this.gl.uniform4fv(this.iMouse,[this.newmx,this.newmy,this.oldmx,this.oldmy]);
        }
        //iDate
        const d = new Date();
        this.gl.uniform4fv(this.iDate,[d.getFullYear(),d.getMonth(),d.getDay(),d.getSeconds()+d.getMilliseconds() % 1000 /1000]);

        //SHADERTOY
        ///////////////////////////

        
        //by doing the drawing progressively line by line we bypass the array size limit given the one raster line cannot have more than 128 notes in the note fountain
        //all we need to do it send an array of notes in the fountain that intersects the raster line
        for (var i = 0; i<portheight; i+=1)
           this.drawVertices(this.gl.TRIANGLE_STRIP,[0,portheight*i,portwidth,portheight*i,0,portheight*(i+1),portwidth,portheight*(i+1)]);
        
        
        //draw a 2 facet rectangle the size of the port, causing the shader to perform on the entire canvas
        //the issue is the array limit and if the array is full, the number if tests again the note array is screenW*H *128...
        //and to do the complet arrya is > 128 you would have to another call with the remainder, in a look modulo 128...
        //this.drawVertices(this.gl.TRIANGLE_STRIP,[0,0,portwidth,0,0,portheight,portwidth,portheight]);
        
        //the best approoach would be to figure how to split the draw in multiple rectangles of varying heights, so that each rectangle has 0 note fountain or 1 or more notes, all having the length covering the rectangle height
        
        

        this.firstDraw = false;

    }
    resizeCanvas(width,height) 
    {
        // Lookup the size the browser is displaying the canvas in CSS pixels.
        const displayWidth  = width;//window.innerWidth;//canvas.clientWidth;
        const displayHeight = height;//window.innerHeight;//canvas.clientHeight;

        // Check if the canvas is not the same size.
        const needResize = this.canvas.width  !== displayWidth ||
                            this.canvas.height !== displayHeight;

        if (needResize) 
        {
            // Make the canvas the same size
            this.canvas.width  = displayWidth;
            this.canvas.height = displayHeight;
        
        }

        return needResize;
    }
    drawVertices(primitiveType,vertices_arr)
    {
        // Draw in red
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(vertices_arr),
            this.gl.STATIC_DRAW);
        this.gl.drawArrays(primitiveType, 0, 4);//vertices_arr.length/2);
    }
    initContext() 
    {
        // Get A WebGL context
        this.canvas = document.getElementById(this.canvasName);
        this.gl = this.canvas.getContext("webgl");
        if (!this.gl) {
            return;
        }

        // setup GLSL program
        this.program = gl_createProgramFromRegistered(this.gl,"Default Vertex Shader",this.fragShader);// webglUtils.createProgramFromScripts(this.gl, ["vertex-shader-2d", this.fragShader]);
        // look up where the vertex data needs to go.
        this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
        // lookup uniforms
        this.iResolution = this.gl.getUniformLocation(this.program, "iResolution");
        this.iTime = this.gl.getUniformLocation(this.program, "iTime");
        this.iTimeDelta  = this.gl.getUniformLocation(this.program, "iTimeDelta");
        this.iFrame = this.gl.getUniformLocation(this.program, "iFrame");
        this.iFrameRate = this.gl.getUniformLocation(this.program, "iFrameRate");
        this.iMouse = this.gl.getUniformLocation(this.program, "iMouse");
        this.iDate = this.gl.getUniformLocation(this.program, "iDate");

        this.u_notesArray = this.gl.getUniformLocation(this.program, "u_notesArray");
        
        //setup some vars
        this.timeOld = 0;
        this.frameAt = 0;
        this.invertedMouseY = 0;
        this.newmx = 0;
        this.newmy = 0;
        this.oldmx = 0;
        this.oldmy = 0;
               
        this.u_matrix = this.gl.getUniformLocation(this.program, "u_matrix");

        // Create a buffer to put three 2d clip space points in
        this.positionBuffer = this.gl.createBuffer();
    
        // Draw the scene.
    }
}
