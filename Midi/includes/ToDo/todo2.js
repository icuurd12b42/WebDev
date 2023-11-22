//these arrays replace the dropdown html containers. Not sure it's needed, duplicate data is not smart
var intrumentsArray = [];
var inputsArray = [];

var tone = _tone_0000_JCLive_sf2_file;
var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContextFunc();
var player = new WebAudioFontPlayer();
var midiNotes = [];
player.loader.decodeAfterLoading(audioContext, '_tone_0000_JCLive_sf2_file');

function requestMIDIAccessFailure(e) {
    log.Push();
    log.Write("requestMIDIAccessFailure()");
    log.Push();
    log.Write("Error:" , e);
    log.Pop();
    log.Write("Done requestMIDIAccessFailure()");
    log.Pop();
    
}
function logKeys(){
    var s = 'Keys';
    for (var i = 0; i < midiNotes.length; i++) {
        s = s + ' ' + midiNotes[i].pitch;
    }
}
function midNoteOn(pitch, velocity) {
    //This is called when on note pressed
    log.Push();
    log.Write("midNoteOn()");
    log.Push();
    log.Write("Pitch:", pitch, "Vel:", velocity);
    log.Write("cancel the note if already playing");
    midiNoteOff(pitch);
    var envelope = player.queueWaveTable(audioContext, audioContext.destination, tone, 0, pitch, 123456789, velocity / 100);
    var note = {
        pitch: pitch,
        envelope: envelope
    };
    var arrIndex = pitch;
    pianoKeys[arrIndex].pressed = true;
    pianoKeys[arrIndex].velocity = velocity;

    log.Write("Added note:", note);
    //SEEMS A STATIC ARRAY WOULD BE EASIER TO MANAGE, AS WELL AS TO HOLD THE STATE WHILE DOWN
    midiNotes.push(note);
    log.Pop();
    log.Write("Note Status Changed, force a redraw");
    //uiDraw.Dirty("midNoteOn");
    log.Write("Done midNoteOn()");
    log.Pop();
}
function midiNoteOff(pitch) {
    //This is called on Note Release
    log.Push();
    log.Write("midiNoteOff()");
    log.Push();
    log.Write("Pitch:", pitch);
    log.Write("loop through array and turn off the note of that value");
    //THIS SEEMS A BIT CONVOLUTED TO ASSOCIATE A NOTE BY PITCH. TO INVESTIGATE FIRTHER...
    //...LATER... FOUND THAT PITCH IS ACTUALLY THE NOTE ID, 0 to 127
    log.Push();
    for (var i = 0; i < midiNotes.length; i++) {
        if (midiNotes[i].pitch == pitch) {
            if (midiNotes[i].envelope) {
                midiNotes[i].envelope.cancel();
                log.Write("Turn Off Note:", i, midiNotes[i])
            }
            midiNotes.splice(i, 1);

            var arrIndex = pitch;
            pianoKeys[arrIndex].pressed = false;
            pianoKeys[arrIndex].velocity = 0;


            break; //exit loop
        }
    }

    log.Pop();
    log.Write("Done Loop");
    log.Pop();

    log.Write("Note Status Changed, force a redraw");
    uig.canvasSetDirty("midiNoteOff");
    
    log.Write("Done midiNoteOff()");
    log.Pop();
}
function midiOnStateChange(event) {
    //This is called when the state of a midi input device changes
    log.Push();
    log.Write("midiOnStateChange()");
    log.Push();
    log.Write('Event:', event);
    //msg.innerHTML = event.port.manufacturer + ' ' + event.port.name + ' ' + event.port.state;
   

    log.Pop();
    log.Write("Done midiOnStateChange()");
    log.Pop();
}
function onMIDIMessage(event) {
    //This is called when a MIDI message is detected
    log.Push();
    log.Write("onMIDIMessage()");
    log.Push();
    log.Write('Event:', event);
    var data = event.data;
    var cmd = data[0] >> 4;
    var channel = data[0] & 0xf;
    var type = data[0] & 0xf0;
    var pitch = data[1];
    var velocity = data[2];
    switch (type) {
        case 144:
            midNoteOn(pitch, velocity);
            logKeys();
            break;
        case 128:
            midiNoteOff(pitch);
            logKeys();
            break;
    }
    log.Pop();
    log.Write("Done onMIDIMessage()");
    log.Pop();
}
function fillInputsList(midi) {
    //This is called to fill the midi input devices list, at startup
    log.Push();
    log.Write("fillInputsList()");
    log.Push();
    log.Write("Fill Input Instruments List");
    //var sel = document.getElementById('inputs');
    log.Write("Clear input list");
    //sel.innerText = "";
    inputsArray = [];

    log.Write("Loop through inputs collection");
    log.Push();
    var inputs = midi.inputs.values();
    var i = 0;
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        log.Write("Midi Input:", input);
        input.value.onmidimessage = onMIDIMessage;
        //var opt = document.createElement('option');
        //opt.innerHTML = ''+(i+1)+'. '+input.value.name;
        //if(input.value.manufacturer.toString() !== "")
        //opt.innerHTML += ' by ' + input.value.manufacturer;
        //sel.appendChild(opt);
        inputsArray.push(input.value);

        log.Write("Added:", input.value.name);
        i++
    }
    log.Pop();
    log.Write("Done Loop");
    log.Pop();
    log.Write("Done fillInputsList()");
    log.Pop();
}
function requestMIDIAccessSuccess(midi) {
    //This is Called when MIDI connection is made, at startup
    log.Push();
    log.Write("requestMIDIAccessSuccess()");
    
    fillInputsList(midi);
    
    //set the state change event funtion
    midi.onstatechange = midiOnStateChange;

    log.Write("Done requestMIDIAccessSuccess()");
    log.Pop();
}
function fillInstrumentsList() {
    //This is called to fill the midi instruments list, at startup
    log.Push();
    log.Write("fillInstrumentsList()");
    log.Push();
    //var sel = document.getElementById('ins');
    log.Write("Clear instruments list");
    //sel.innerText = "";
    instrumentsArray = [];

    log.Write("Loop through instruments collection");
    log.Push();
    for(var i = 0; i < player.loader.instrumentKeys().length; i++) {
        var instrument = player.loader.instrumentInfo(i);
        log.Write("Midi Instrument:", instrument);
        //var opt = document.createElement('option');
        //opt.innerHTML = ''+(i+1)+'. '+instrument.title;
        //sel.appendChild(opt);
        instrumentsArray.push(instrument);

        log.Write("Added:", instrument.title);
    }
    log.Pop();
    log.Write("Done Loop");

    selectInstrument(1);
    log.Pop();
    log.Write("Done fillInstrumentsList()");
    log.Pop();
}
function selectInstrument(n){
    log.Push();
    log.Write("selectInstrument()");
    log.Push();
    log.Write("Set Instrument:", n);
    //var n=document.getElementById('ins').selectedIndex;
    var info=player.loader.instrumentInfo(n);
    log.Write("info:", info);
    

    player.loader.startLoad(audioContext, info.url, info.variable);
    player.loader.waitLoad(function () {

        tone=window[info.variable];
    player.cancelQueue(audioContext);
    });

    log.Pop();
    log.Write("Done selectInstrument()");
    log.Pop();
}

