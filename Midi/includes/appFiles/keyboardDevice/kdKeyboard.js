

//pianoKeys are 128 entries in an array, given midi support - 0 to 127 
function createPianoKeysArray(keyboard)
{
    var pianoKeys = [];
    var sharpNotesPattern = [0,1,0,1,0,0,1,0,1,0,1,0];
    var midiOctave = -1;
    var isSharp = 0;
    var scoreLane = -1;
    //TODO, figure out if this is right for octaves because below the firt one is octave 1 instead of octave 0;
    var octaveKey = 0;
    for(var i = 0; i < 128; i++)
    {
        octaveKey = i % 12;
        isSharp = sharpNotesPattern[octaveKey];
        midiOctave += (octaveKey == 0); //HERE, is octave 1 or 0 the first one?
        scoreLane += (isSharp===false); //sharpNotesPattern[octaveKey];//(octaveKey !== 1 &&  octaveKey !== 3 &&  octaveKey !== 6 &&  octaveKey !== 8 &&  octaveKey !== 10);
        //new KEYBOARD KEY
        var key = new kdKeyboardKey(keyboard,i,isSharp,scoreLane,midiOctave-2,midiOctave,octaveKey)
        pianoKeys.push(key);
    }
    return pianoKeys;
}

//this class holds the key stattes of the channel midi keys of the physical device
//it is in charge of sending sounds to the output MIDI player
//it is planned that each key could map to any player instrument and any midi key
//as opposed to simply mirror the physical channel and midi key
//KEYBOARD
class kdKeyboard {
    keys = [];  //the keys or drum pads array
    channel = null;
    maxVelocity = 0;
    region = {x:0,y:0,w:0,h:0};
    active = true;
    constructor(channel) {
        this.channel = channel;
        this.keys = createPianoKeysArray(this);
    }
    drawKeyboard(e)
    {
        var keys = this.keys;
        for (var i = 0; i< 128; i++)
        {
            var key = keys[i];
            {
                if(!key.isSharp)
                {
                    key.drawKey(e);
                    if(i>0 && keys[i-1].isSharp)
                    {
                        key = keys[i-1];
                        key.drawKey(e);
                    }
                }
            }
        }
        //uiDraw.strokeRect( e.ctx, this.region.x,this.region.y,this.region.w,this.region.h,"red",2);
    }
//to deprecate
    downMessagesArray = []; //the keys currently down

    setActive(active)
    {
        this.active = active;
        for(var i = 0; i < 128; i++)
        {
            this.keys[i].setActive(active);
        }
    }
    turnOff()
    {
        for(var i = 0; i < 128; i++)
        {
            this.keys[i].turnOff()
        }
    }
}