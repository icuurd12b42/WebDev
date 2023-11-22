///////////////////////////
//MIDI SYSTEM CONNECTION
//initiate the connection request
navigator.requestMIDIAccess().then(midiAccessOnOK, midiAccessOnFail);

function midiAccessOnOK(e /*type MIDIAccess*/)
{
    //called when the midi system initialised with success.. fill up list boxes with the IO devices
    midiAccess = e;
    midiInputsListFill();
    midiOutputsListFill();
    //and setup the divesconneted/disconnecte callback
    midiAccess.onstatechange = midiAccessOnStateChange;
    //panelMidiStatus.showNewText("Success! Ready to Go!");
}

function midiAccessOnFail(err)
{
    panelMidiStatus.setText("Failed to cennect to the MIDI system: " + err.toString());
}

function midiAccessOnStateChange(e /*type MIDIConnectionEvent*/)
{
    //called when a device connects or disconnects. 
    midiConnectionEvent = e;
    midiInputsListRefreshStates();
    midiOutputsListRefreshStates();
    //panelMidiStatus.showNewText("MIDI Device " + e.port.name + " " + e.port.state);
}
//MIDI SYSTEM CONNECTION
///////////////////////////

///////////////////////////
//MIDI INPUT/OUTPUT/MAPPING UI

