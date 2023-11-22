
///////////////////////////
//up next in task
var panelImgResStatus = new uiPanel();
panelImgResStatus.setRegion({x:100,y:250,w:100,h:50});
//panelImgResStatus.setCallbacks({onsettext:statusPanelTextChange});
//panelImgResStatus.setCallbacks({onmouse:statusPanelOneMouse});
panelImgResStatus.setText("Wello you");
panelImgResStatus.setStyles({text:{font:"20px Arial"}});

//myBase.addChild(panelImgResStatus);

var panelMidiStatus = new uiPanel();
panelMidiStatus.setRegion({x:120,y:260,w:100,h:50});
//panelMidiStatus.setCallbacks({onsettext:statusPanelTextChange});
//panelMidiStatus.setCallbacks({onmouse:statusPanelOneMouse});
panelMidiStatus.setText("Wello you too");
panelMidiStatus.setStyles({text:{font:"20px Arial"}});

//myBase.addChild(panelMidiStatus);






//The main UI
function onAppStart()
{
    //log.Off();
    //log.Push();
    //log.Write("onBodyLoad()");
    //log.Write(pianoKeys);

    //navigator.requestMIDIAccess().then(onMIDIAccessOK, onMIDIAccessFail);

    //setKBNotesArray();
    //fillInstrumentsList();
        
    ////uiDraw.Dirty("onAppStart");

    //set the drawing event to be called 60 times per sec...
    //var drawTimer = setInterval(onDraw, 1000/60);

    //log.Write("Done onBodyLoad()");
    //log.Pop();
    
}
//old stuff below


var pianoKeys = createPianoKeysArray();
var drawTimer = 0;

uiRes.addImageFile("clickdragR","includes/appResources/clickdragR.png");
uiRes.addImageFile("clickdragD","includes/appResources/clickdragD.png");
uiRes.addImageFile("clickdragL","includes/appResources/clickdragL.png");
uiRes.addImageFile("clickdragU","includes/appResources/clickdragU.png");
uiRes.addImageFile("clickdragLR","includes/appResources/clickdragLR.png");
uiRes.addImageFile("clickdragUD","includes/appResources/clickdragUD.png");
uiRes.loadImageFiles(onImagesLoaded);

var imagesOK = false;
function onImagesLoaded()
{
    imagesOK = true;
    uiRes.imagesArray.forEach (entry => {imagesOK = imagesOK && (entry.status == "loaded")});
    //if(imagesOK)
        //panelImgResStatus.showNewText("Success! All image resources loaded.");
    //else
        //panelImgResStatus.showNewText("Problem! Some image resources failed to load.");    
}















///old crap

function drawMusicScale(drawData)
{
    
    log.Push();
    log.Write("drawMusicScale()");
    
    //var canvas = document.getElementById("CanvasUI");
    //var ctx = canvas.getContext("2d");

    var ctx = drawData.ctx;

    ctx.font = "32px Arial";
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = "center";
    var left = 10,
        top = 10,
        spacing = 4,
        bottom = 300,
        left = 10
        right = window.innerWidth - 10; 
        var testx = 100;
        ctx.beginPath();       // Start a new path
        for (var i = 1; i<=44; i++)
        {
           
            if(i % 2 == 0)
            {
                ctx.moveTo(left, bottom - spacing * i);    // Move the pen to (30, 50)
                ctx.lineTo(right, bottom - spacing * i);  // Draw a line to (150, 100)
            }
           
            if (i == 2)
            {
                ctx.strokeStyle = 'gray';
                ctx.stroke();          // Render the path
                ctx.beginPath();
            }
            if (i == 12)
            {
                ctx.strokeStyle = 'black';
                ctx.stroke();          // Render the path
                ctx.beginPath();
            }
            
            if (i == 22)
            {
                ctx.strokeStyle = 'gray';
                ctx.stroke();          // Render the path
                ctx.beginPath();
            }
            if (i == 32)
            {
                ctx.strokeStyle = 'black';
                ctx.stroke();          // Render the path
                ctx.beginPath();
            }
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'gray';
        ctx.stroke();          // Render the path
        

        for (var i = 1; i<=44; i++)
        {
            ctx.fillText("\u{1D157}", testx, bottom - spacing * i - 1);
            ctx.fillText("\u{1D15E}", testx+30, bottom - spacing * i - 1);
            testx+=8;
        }
    
        ctx.font = "32px Arial";
        ctx.textBaseline = 'alphabetic';
        ctx.textAlign = "center";
        var sharpNotes = [0,1,0,1,0,0,1,0,1,0,1,0];
        var lanePositions = [];//[0,0,1,1,2,3,3,4,4,5,5,6];
        var lanepos = 0;
        for (i = 0; i < 126; i++)
        {
           
            lanePositions.push (lanepos);
            var octkey = (i+1) % 12;
            lanepos+=1 * (sharpNotes[octkey]!=1)

        }
        for(var i = 0; i< midiNotes.length;i++)
        {
            var pianokey = midiNotes[i].pitch-21;
            //if(pianoKey<0) piaokey = 0;
            var octkey = pianokey % 12;
            var lane = lanePositions[pianokey];
            if (lane < 0) lane = 0;
            if (sharpNotes[octkey])
            {
                ctx.fillText("\u{1D130}", 100-6, bottom - spacing * lane - spacing);
                pianokey--;
            }
            ctx.fillText("\u{1D157}", 100, bottom - spacing * lane - 1);
        }

    ctx.font = "66px Arial";
    ctx.fillText("\u{1D11E}", 35, 90);
    ctx.fillText("\u{1D122}", 35, 160);

    
    ctx.font = "32px Arial";

        ctx.textBaseline = 'alphabetic';
        ctx.textAlign = "left";
    
    
    log.Write("Notes to draw:" , midiNotes);
    




   
    log.Write("Done drawMusicScale()");
    log.Pop();
}

