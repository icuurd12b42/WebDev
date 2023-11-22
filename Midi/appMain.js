

var shaderPlayingNotes = []; //playing notes(x,value)\
function initPlayingNotes()
{
    for(var i = 0; i< 128; i++)
    {
        shaderPlayingNotes.push({x:0,y:0,a:0}); //x is position on cavas, y is a strength value
    }
}
initPlayingNotes();






//this object is in charge of sending midi messages to the opened midiOutputs
//deprecated, moved to keyboard device
class MidiNoteOutputer extends appModule
{
    midiFileReader = null;
    constructor(midiFileReader)
    {
        super();
        //given the midi file reader, register the on midid not event to it
        this.midiFileReader = midiFileReader;
        //midiFileReader.addMidiMessageCallback(onMidiFileMidiMessage);


        var me = this;

       
        function onMidiFileMidiMessage(event /*event*/ , o /*midiFile*/)
        {
            
            for (var i = 0; i< midiOutputsPanel.listPanel.children.length; i++)
            {
                var midiPort = midiOutputsPanel.listPanel.children[i].portOpened.midiPort;
                if(midiPort.connection == "open")
                {
                    try {
                         midiPort.send(event.data,performance.now());
                        }
                        catch(e){
                            console.warn("MidiNoteOutputer Warning", e, event); //the message sent is not supported by the midi output device
                        }
                }
            
            }

            
        }
    }

 
}
function stopAllChannelNotes()
{
    for(var channel = 0; channel < 16; channel++)
    {
        for(var key = 0; key<128; key++)
        {
            var midiBuffer = new Uint8Array(3);
            //0x8c noteNumber, velocity
            //var midibuffer = new Uint8Array
            midiBuffer[0] = (8<<4) + channel;
            midiBuffer[1] = key;
            midiBuffer[2] = 0;
            midiOutputsShortList.forEach(midiOutputListIndex =>
                {
                    var midiOutputListItem = midiOutputsList.itemsArray[midiOutputListIndex];
                    midiOutputListItem.itemHilighted = true;
                    
                    try {
                        midiOutputListItem.midiOutput.send(midiBuffer,performance.now());
                    }
                    catch(e){
                        console.warn("warning", e, "stopAllChannelNotes"); //the message sent is not supported by the midi output device
                    }
                });
        }
    }
    
}
//global handlers to respond to midi file loaded and status changes
//no object specifically in charge of that rn
///////////////////////////
//Midi File
function midiFileOnRead(e)
{
    //ResetModules();
    e.dumpAllEvents();
    //stopAllChannelNotes();

    //TODO: this is not working. prevents everthing from even stating
    //myBase.onAppMessage({message:"reset",uiSource:myBase});

    e.setPlayState("play");
    //e.setChannelsPlayingActive(false,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
    //e.setChannelKeysPlayingActive(false,[0], [50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69]);
    e.setTimeIndex(e.getFirstPlayingNoteTimeIndex()-5000);
    console.warn("TIMEINDEX:",e.getFirstPlayingNoteTimeIndex())
}

function onMidiFilePlayStateChanged(o/*midiFile*/)
{
    if(["nofile", "ready", "play", "stopped"].findIndex(item => {return (item == o.playState);} )>=0)
    {
        
        console.warn("StateChanged");
       
        ResetModules();
    }
}
function onDumpAllEvents(e,o)
{
    
    //load all in one shot event

}
var midiFileReader = new mfMidiFile();

midiFileReader.setPlayStateChangedCallback(onMidiFilePlayStateChanged)
midiFileReader.setOnFileReadCallback(midiFileOnRead);
midiFileReader.addDumpAllEvents(onDumpAllEvents);

var keyDownArrayEffect = new appKeyDownArrayEffect("layer0");
var modules = [];
modules.push(midiFileReader);


modules.push(keyDownArrayEffect);
modules.push(new appShaderToyEffect("layer1")); //set the canvas layer to the shadertoy system


modules.push(new MidiNoteOutputer(midiFileReader));
modules.push(new appCanvasManager("layerUI",myBase)); //set the ui layer to ui manager system, using myBase as base desktop ui

//var drawTimer = setInterval(onDraw, 1000/fps);
window.requestAnimationFrame(onFrame);
function onFrame(now)
{
    modules.forEach(module => {module.onNewFrame(now)});
    modules.forEach(module => {module.onDrawFrame(now)});
    window.requestAnimationFrame(onFrame);
}

function ResetModules()
{
    modules.forEach(module => {module.onReset()});
}

