//this js is only used as a quick reference. not included in html page
//https://developer.mozilla.org/en-US/docs/Web/API/MIDIPort
var MIDIInput  = {
        connection: "closed",
        id: "input-3",
        manufacturer: "",
        name: "My KB Mirror 2",
        onmidimessage: null,
        onstatechange: null,
        state: "connected",
        type: "input",
        version: "1.0"
    };

var MIDIOutput = {
        connection: "closed",
        id: "output-0",
        manufacturer: "",
        name: "VirtualMIDISynth #1",
        onstatechange: null,
        state: "connected",
        type: "output",
        version: "2.12"
    }; 
var MIDIInputMap = [];
var MIDIOutputMap = [];
var MIDIAccess = {
        inputs: MIDIInputMap,
        onstatechange: null,
        outputs: MIDIOutputMap,
        sysexEnabled: false
    };

var MIDIConnectionEvent = {
        isTrusted: true,
        bubbles: false,
        cancelBubble: false,
        cancelable: false,
        composed: false,
        currentTarget: MIDIAccess,
        defaultPrevented: false,
        eventPhase: 0,
        path: [],
        port: MIDIInput || MIDIOutput,
        returnValue: true,
        srcElement: MIDIAccess,
        target: MIDIAccess,
        timeStamp: 2497.1999999997206,
        type: "statechange"
}

var MIDIMessageEvent = {
    isTrusted: true,
    bubbles: true,
    cancelBubble: false,
    cancelable: false,
    composed: false,
    currentTarget: MIDIInput,
    data: Uint8Array(3) [144, 56, 51],
    defaultPrevented: false,
    eventPhase: 0,
    path: [],
    returnValue: true,
    srcElement: MIDIInput,
    target: MIDIInput,
    timeStamp: 61177.30000000447,
    type: "midimessage"
}

//midiFile struct
var MIDIMessage =
{
    decoder: "decodeMIDIEvent",
    delta: 0,
    keyNotesArrayIndex: 13,
    midiChannel: 0,
    midiEventType: 8,
    midiMsgArr: Uint8Array,
    parameter1: 45,
    parameter2: 0,
    rawarr: (3) [128, 45, 0],
    tempo: 100,
    ticks: 2457.6,
    timeIndex: 4800,
    trackIndex: 1,
    trackName: null,
    type: "MIDI",
}


//KEYBOARD KEY
var keyboardKey = keyDownEffectKey =
{   
    "index" : i, // 0-127
    "channel": channel, //0-15
    "isSharp":isSharp, 
    "scoreLane": scoreLane,
    "octave": midiOctave-2,
    "midiOctave": midiOctave, 
    "octaveKey": octaveKey, //0-11
    "pressed": 0-1-2, //0 is not pressed, 2 is pressed, 1 is transition state
    "velocity":0,
    "timeIndex":0,
    "x":x, //in effect, canvas position on x axis;
    "hw":hw,  //in effect, note half width in pixels
    "ndeVel":0, //in notedown effect, note velocity fraction for ramping up the Force value gradually of a few frames
    "ndeForce":0-2, //in notedown effect, the force of the effect is += vaccel for ramping up when ON and  *=.9 on it's way OFF
    "ndeFastForce": 0-1, //like ndeForce but faster ramp up and down
    "songNotes":[], //array of all the notes played on that key for the fountain 
    "fallenNotes":[], //array of note taken out of the fountain once fallen
};


//FOUNTAIN NOTE
//set by keyboard device's note dump fn
fountainNote = fallenNote =  
{
    timeIndexStart: microsec,
    timeIndexEnd: microsec,
    channel: midiChannel,
    key: midikey,
    velocity: velocity
}


midiFile = 
{
}
