"use strict";





//onFrame globals
var oldtime = -1;
var avgfps = 60;
var numAccFps = 10;
var fpsAvgAt = numAccFps;


window.requestAnimationFrame(onFrame);

var stabalize = 60;
function onFrame(now) 
{
	//draw
	ctx.fillStyle = "#06002A";
	ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if(stabalize) 
	{
		stabalize--;
		window.requestAnimationFrame(onFrame);
		return;
	}

	//calculate delta t
	if (oldtime === -1) oldtime = now;
	const dt = (now - oldtime)/1000; // elapsed time since last frame
	oldtime = now;
	if(dt!==0)
	{
		avgfps += (1000/(dt*1000));
		fpsAvgAt--;
		if(fpsAvgAt == 1)
		{
			fpsAvgAt = numAccFps;
			//options.FPS.text = "fps:" + Math.floor(avgfps/numAccFps);
			//fpsText.innerHTML = "fps:" + Math.floor(avgfps/numAccFps);
			options.PERFORMANCE.FPS.text = "fps:" + Math.floor(avgfps/numAccFps);
			avgfps = (1000/(dt*1000));
		}
	}

	if(exists(globals.viewUpdateHook))
	{
		globals.viewUpdateHook();
	}
	//Update Instances position
	world.onMove(dt); // update the entities based on elapsed time

	ctx.save();
	globals.camera.updateRadius();
	globals.camera.setCanvasTransform(ctx)
	const eve = {ctx:ctx,camera:globals.camera};
	world.onDraw(eve); // draw the entities
	world.onPostDraw(eve)
	ctx.restore();

	//game Logic
	world.onThink();

	//update inputs to count the number of frames the key is held
	stepInputs();

	window.requestAnimationFrame(onFrame);

}

//resize canvas and set listener
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
function resizeCanvas() 
{
    if(canvas.width !== window.innerWidth)
	{
        canvas.width = window.innerWidth;
		
	}
    if(canvas.height !== window.innerHeight)
	{
        canvas.height = window.innerHeight;
	}
	globals.camera.updateRadius();
}


//the exit warning
window.onbeforeunload = function(event) {
    event.returnValue = "Are you sure you want to leave?";
    return  event.returnValue;
};
window.onbeforeunload = undefined;///disable the above for now






