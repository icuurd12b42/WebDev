function crap()
{


//Midi File
///////////////////////////


//these are use to detect change of window size
var WindowW = 0;
var WindowH = 0;


///////////////////////////
// CANVAS AND UI UPDATE 
//we set a 60 fps draw event
var fps = 60;
var frameatt = 0;
var secondsAt = 0;
//var drawTimer = setInterval(onDraw, 1000/fps);
window.requestAnimationFrame(onDraw);
//this is now called in drawscene in initWebGL for now until I refactor
function onOldDraw(now)
{
    //uiDraw.Dirty("onDraw");
    //tell the midi file player the clock is ticking
    midiFile.onClockTick();
    if(midiFile.playState == "playing") //uiDraw.Dirty("onDraw");

    frameatt++;
    secondsAt += (frameatt % 60) == 0;
        
    
    
    //this is called 60 time/s
    //has window size changed
    var canvas = document.getElementById("layerUI");
    var ctx = canvas.getContext("2d");

    if(window.innerWidth !== WindowW|| window.innerHeight !== WindowH)
    {
        //update the ui main desktop size and the state variables
        WindowW = myBase.region.w = window.innerWidth;
        WindowH = myBase.region.h = window.innerHeight;

        //resize the canvas to match
        
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        
        //redraw required
        //uiDraw.Dirty("onDraw");
       
    }


    //this countdown clear the hilighted list items in midiChannelMappingsList. see midiInputOnMidiMessage when the value is set
    
    if(midiInputsListHilightsCountDown)
    {
        midiInputsListHilightsCountDown--;
        if(midiInputsListHilightsCountDown == 0)
        {
            midiInputsListHilightsClear();
        }
    }
    if(midiOutputsListHilightsCountDown)
    {
        midiOutputsListHilightsCountDown--;
        if(midiOutputsListHilightsCountDown == 0)
        {
            midiOutputsListHilightsClear();
        }
    }
    if(midiChannelMappingsListHilightsCountDown)
    {
        midiChannelMappingsListHilightsCountDown--;
        if(midiChannelMappingsListHilightsCountDown == 0)
        {
            midiChannelMappingHilightsClear();
        }
    }
    
    //debug gl context has resized
    //uiDraw.strokeRect(gl,10,10, canvas.width-20,canvas.height-20,"blue",4);

    // only draw if the ui is dirty
    var noteW = (canvas.width)/128;
    //smomehow noteW become null so. fuck that shit
    var nw = noteW;
    var i = 0;
    shaderPlayingNotes.forEach(note => 
    {
        note.x = (i++) * nw; //set the note position on canvas
        note.y *=.666;
        note.a *=.995;
    });
    if(0)
    {
        ////uiDraw.DirtyLogSetters(); //debug who triggered a draw
        //uiDraw.DirtyClear(); //clear the dirty flag
        //clear the screen and redraw the ui
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        uiDraw.dispatchDrawEvent(canvas, ctx);


        

        ctx.save();
        if(midiFile.playState == "playing")
        {
            

            midiFile.channelsData.forEach(channel => 
            {
                if(channel.playActive)
                {
                    var y =10; 
                    var EventsSourceArr = channel.events;// midiFile.flatMidiData;

                    for (var i = channel.playIndexAt;i< channel.playIndexAt+100 && i< EventsSourceArr.length; i++)
                    {
                        var event = EventsSourceArr[i]
                        if(event.type == "MIDI" && (event.midiEventType === 8 || (event.midiEventType === 9 && event.parameter2 == 0)))
                        {
                            var key = event.parameter1;
                            //if the keyboard key for that note is also playActive
                            if(channel.keys[key].playActive)
                            {
                                var x = shaderPlayingNotes[key].x;//(event.parameter1) * nw;
                                var w = nw-2
                                var y2;
                                var x2 = x;
                                
                                
                                //var eventtime =  ((event.ticks/midiFile.midiData.ticksPerBeat * 500000)/1000);
                                //y = 800+(midiFile.timeIndex * midiFile.tempo/120 - eventtime)*.3 ;
                                var y1 = 800+(midiFile.timeIndex - event.timeIndex)*.3 + w/2;
                                var y = y2 = y1;
                                var lasty = y;

                                ctx.beginPath();
                                ctx.arc(x, y, w/2, 0, Math.PI * 2);
                                ctx.fillStyle = "blue";
                                ctx.fill();
                                ctx.beginPath();
                                ctx.lineWidth = w;
                                ctx.strokeStyle = "blue";
                                ctx.moveTo(x, y);
                                
                                var eventNotesArray = channel.keys[key].events;
                                var notePosition = event.keyNotesArrayIndex;
                                
                                for (var noteIndex = notePosition-1; noteIndex>=0; noteIndex--)
                                {
                                    var searchEvent = eventNotesArray[noteIndex];
                                    
                                    if(searchEvent.midiEventType == 9)
                                    {

                                        var dtime = (midiFile.timeIndex - searchEvent.timeIndex);
                                        y2 = 800+(dtime) *.3;
                                        ctx.lineTo(x2, y2);
                                        ctx.stroke();  
                                        ctx.beginPath();
                                        ctx.arc(x2, y2, w/2, 0, Math.PI * 2);
                                        ctx.fillStyle = "blue";
                                        ctx.fill(); 
                                        var force = y2-800;

                                        if(dtime>=0)
                                        {
                                            
                                            force = (1-Math.min((dtime)/1000,1))/2;
                                            force *= searchEvent.parameter2/127;
                                            shaderPlayingNotes[searchEvent.parameter1].y +=force + .2; //.2 is sustain
                                            shaderPlayingNotes[searchEvent.parameter1].a += force *1.5 + .2;
                                            //force = (1-(Math.min(force,10) / 10)) * (searchEvent.parameter2/127);
                                            //shaderPlayingNotes[searchEvent.parameter1].y += searchEvent.parameter2/127;
                                            shaderPlayingNotes[searchEvent.parameter1].y = Math.min(shaderPlayingNotes[searchEvent.parameter1].y,1);
                                            shaderPlayingNotes[searchEvent.parameter1].a = Math.min(shaderPlayingNotes[searchEvent.parameter1].a,1);
                                        }
                                        break;
                                    }
                                    else if(searchEvent.midiEventType == 14)
                                    {
                                        var pitch = (((searchEvent.parameter2<<7) + searchEvent.parameter1) - 8192) / 8192;
                                        y2 = 800+(midiFile.timeIndex - searchEvent.timeIndex) *.3;
                                        x2 = x+pitch*nw;
                                        if((y2-lasty)>1)
                                        {
                                            ctx.lineTo(x2, y2);
                                            lasty = y2
                                        }
                                        

                                    }
                                    
                                    
                                }
                                

                                //var h = Math.max(8,y2-y1);
                                //uiDraw.strokeRoundedRect(ctx,x, y, w, h, "blue", 1, Math.min(w/2,h/2));
                            }
                        }
                        
                    }
                }
            });
        }

        uiDraw.fillRect(ctx,0,800,canvas.width,canvas.height-800,"white");
        uiDraw.strokeLine(ctx,0,800,canvas.width,800,"yellow",3);
        shaderPlayingNotes.forEach(note => 
            {
                uiDraw.strokeLine(ctx,note.x,800,note.x,800+note.y*30,"red",3);
            });
        ctx.restore();
        






        /*
        for(var i = 0; i< uiRes.imagesArray.length; i++)
        {
            var img = uiRes.getImage(i);
            ctx.drawImage(img,i * 100, i*100, img.width/3, img.height/3);
        }
        */

    }
    /*
    
    function compileShader(shaderSource, shaderType) {
        var shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
    
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw "Shader compile failed with: " + gl.getShaderInfoLog(shader);
        }
    
        return shader;
    }
    
    var vertexShader = compileShader('\n\
    attribute vec2 position;\n\
    \n\
    void main() {\n\
        // position specifies only x and y.\n\
        // We set z to be 0.0, and w to be 1.0\n\
        gl_Position = vec4(position, 0.0, 1.0);\n\
    }\
    ', gl.VERTEX_SHADER);
    
    var fragmentShader = compileShader('\n\
    \n\
    void main(){\n\
        gl_FragColor = vec4(gl_FragCoord.x/500.0, \n\
                            gl_FragCoord.y/400.0, \n\
                            0.0, 1.0);\n\
    }\n\
    ', gl.FRAGMENT_SHADER);
    
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    }
    */
}
// CANVAS AND UI UPDATE 
///////////////////////////

}
