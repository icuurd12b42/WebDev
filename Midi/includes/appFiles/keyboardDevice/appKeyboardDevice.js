

//KEYBOARD KEYS


//this class mirrors a physical midi keyboard which usually consist of piano keys and or drum pads 
//and other device options for system control (tremolo, volume, pitch, command buttons...)
class appKeyboardDevice extends uiPanel
{
    name = "appKeyboardDevice";
    midiChannels = [];      //mirror midi max 16 channels.
    midiFileReader = null;
    refKeyboard = null;

    //keyboard Shape Specs
    shapeSpecs = {keyboardLeft:0,keyboardRight:0, keysTop:18,keyboardW:0,sideEdges:10, bottomEdge:5,keyboardBottom:0};
    
    constructor() {
        super();
        this.refKeyboard = new kdKeyboard();
        //this.baseHeight = this.whiteKeyH + this.bottomEdge + this.keysTop;
        //mirror midi max 16 channels.
        for(var i = 0; i<16; i++)
        {
            this.midiChannels.push(new kdChannel(this,i));
        }
        
        //create KEYBOARD KEYS used to merge all the channels keyboard keys into one for visualisation
        this.mergedKeys = createPianoKeysArray(); 
    }
    hookToFileReader()
    {
        if(this.midiFileReader === null)
        {
            this.midiFileReader = midiFileReader;
            this.midiFileReader.addMidiMessageCallback(onMidiFileMessage);
            this.midiFileReader.addDumpAllEvents(onDumpAllMidiFileMessages);
            var me = this;
            function onMidiFileMessage(message /*midi message*/ , o /*midi*/)
            {
                me.onMidiFileMessage(message,o);
            }
            function onDumpAllMidiFileMessages(message /*midi message*/ , o /*midi*/)
            {
                me.onDumpAllMidiFileMessages(message,o);
            }
            midiInputAddMessageCallback(onMidiInputDeviceMessage);
            function onMidiInputDeviceMessage(message /*midi message*/ , o /*midi*/)
            {
                me.onMidiInputDeviceMessage(message,o);
            }

        }
    }
    //since songNotes, songPlayedNotes and devicePlayed Notes recording is the same method...
    recordMidiNote(message,keyNotesArr)
    {
        if(message.type == "MIDI")
        {
            if(message.midiEventType === 8 || (message.midiEventType === 9 && message.parameter2 === 0))
            {
                //note off
                var keyIndex = message.parameter1;
                var velocity = message.parameter2;
                var key = this.midiChannels[message.midiChannel].keyboard.keys[keyIndex];
                //edit the last Song Note we added on note down to set the time end to it
                //if(key.songNotes.length>0)
                if(keyNotesArr.length>0)
                {
                    if((message.timeIndex-keyNotesArr[keyNotesArr.length-1].timeIndexStart)>=this.microNotesCutOff) //hide micronotes
                    {
                        keyNotesArr[keyNotesArr.length-1].timeIndexEnd = message.timeIndex; //update the note time end

                        //add a note off to force a key release frame in the drawing processing
                        var newEntry = new kdNote (key,0,message.timeIndex,message.timeIndex,Math.max(0,key.songNotes.length-1));
                        //and add it to the channels[].keyboar.key[].songNotes
                        keyNotesArr.push(newEntry);
                    }
                    else
                    {
                        keyNotesArr.splice(keyNotesArr.length-1,1);
                    }
                    
                }
            }
            else if(message.midiEventType === 9)
            {
                //note on
                var keyIndex = message.parameter1;
                var velocity = message.parameter2;
                var key = this.midiChannels[message.midiChannel].keyboard.keys[keyIndex];
                //Create a new Note 
                var newEntry = new kdNote (key,velocity,message.timeIndex,message.timeIndex,Math.max(0,keyNotesArr.length-1));
                
                //and add it to the channels[].keyboar.key[].songNotes
                keyNotesArr.push(newEntry);
                
        
            }
        }
    }
    onDumpAllMidiFileMessages(message,msgDispatcher)
    {
        if(message.type == "MIDI" && (message.midiEventType === 8 || message.midiEventType === 9))
        {
            var keyIndex = message.parameter1;
            var key = this.midiChannels[message.midiChannel].keyboard.keys[keyIndex];
            this.recordMidiNote(message,key.songNotes);
        }
    }
    onMidiFileMessage(message,msgDispatcher)
    {
        
        if(message.type == "MIDI")
        {
            if(message.midiEventType === 8 || message.midiEventType === 9)
            {
                var keyIndex = message.parameter1;
                var key = this.midiChannels[message.midiChannel].keyboard.keys[keyIndex];
                this.recordMidiNote(message,key.songPlayedNotes);
                this.refKeyboard.keys[keyIndex].pressed = (message.midiEventType === 9) && (message.parameter2 !== 0);
                this.refKeyboard.keys[keyIndex].velocity = message.parameter2/127;
                if(!this.midiChannels[message.midiChannel].audible && message.midiEventType === 9 && message.parameter2!==0)
                    return;
            }
            if(message.midiEventType == 12)
            {
                //TODO Figure out the Channel 9 Percussion Instrument. never changes?.
                //if(message.midiChannel === 9)
                //    console.log("Percussion Change Event:" + message.midiEventType, "Channel: " + message.midiChannel, "P1P2: "+ message.parameter1,message.parameter2); 
                //TOTO update intrument in list on midid voice change
                //midiChannelsListAddUpdateItem({channelIndex:message.midiChannel, voiceIndex:message.parameter1});
            }
        }
        for (var i = 0; i< midiOutputsPanel.listPanel.children.length; i++)
        {
            var midiPort = midiOutputsPanel.listPanel.children[i].portOpened.midiPort;
            if(midiPort.connection == "open")
            {
                try {
                        midiPort.send(message.data,performance.now());
                    }
                    catch(e){
                        console.warn("MidiNoteOutputer Warning", e, message); //the message sent is not supported by the midi output device
                    }
            }
        
        }
    }
    lastNoteMidiChannel = -1;
    lastMessage = new midiMessage([0]);
    onMidiInputDeviceMessage(message)
    {

        if(message.type == "MIDI")
        {
            if(message.midiEventType === 8 || message.midiEventType === 9)
            {
                var keyIndex = message.parameter1;
                var key = this.midiChannels[message.midiChannel].keyboard.keys[keyIndex];
                this.recordMidiNote(message,key.devicePlayedNotes);
                this.refKeyboard.keys[keyIndex].pressed = (message.midiEventType === 9) && (message.parameter2 !== 0);
                this.refKeyboard.keys[keyIndex].velocity = message.parameter2/127;
                this.lastNoteMidiChannel = message.midiChannel;
                if(!this.midiChannels[message.midiChannel].audible && message.midiEventType === 9 && message.parameter2!==0)
                    return;
            }
            if(message.midiEventType == 12)
            {
                //TODO Figure out the Channel 9 Percussion Instrument. never changes?.
                //if(message.midiChannel === 9)
                //    console.log("Percussion Change Event:" + message.midiEventType, "Channel: " + message.midiChannel, "P1P2: "+ message.parameter1,message.parameter2); 
                midiChannelsListAddUpdateItem({channelIndex:message.midiChannel, voiceIndex:message.parameter1});
            }
            else if(message.midiEventType == 11) 
            {
                //midi controller state change event
                var controller = message.parameter1;
                var value = message.parameter2;
                if(controller == 50 || controller == 51 && message.midiChannel == 0)
                {
                    //prev/next channel messages, always occurd on channel 0. 
                    //Tells us the user pressed the channel dow/up buttons 
                    //no way to know what channel the device is currentl at. and value is 0 - 127 toggle. not the channel index
                    //Clear the notes on the last channel seen
                    if(this.lastNoteMidiChannel!=-1)
                    {
                        this.midiChannels[this.lastNoteMidiChannel].turnOff();
                    }

                }
                
            }
            
        }
        for (var i = 0; i< midiOutputsPanel.listPanel.children.length; i++)
        {
            var midiPort = midiOutputsPanel.listPanel.children[i].portOpened.midiPort;
            if(midiPort.connection == "open")
            {
                try {
                        midiPort.send(message.data,performance.now());
                    }
                    catch(e){
                        console.warn("MidiNoteOutputer Warning", e, message); //the message sent is not supported by the midi output device
                    }
            }
        
        }
        this.lastMessage = message;
    }
    
    
    drawDevice(e)
    {
        //draw base
        uiDraw.roundedRectWBorders(e.ctx,this.region.x, this.region.y, this.region.w,this.region.h, this.baseColor,this.baseLineColor,1,5);

        //draw the keyboard keys
        this.refKeyboard.drawKeyboard(e);
        
        //draw lid over keys
        uiDraw.fillRect(e.ctx,this.refKeyboard.region.x,this.refKeyboard.region.y-2,this.refKeyboard.region.w,4,this.baseColor);

        //this.refKeyboard.region.x = this.shapeSpecs.keyboardLeft;
        //this.refKeyboard.region.y = keysTop;
        //this.refKeyboard.region.w = this.shapeSpecs.keyboardW;
        //this.refKeyboard.region.h

        uiDraw.strokeLine(e.ctx,this.refKeyboard.region.x,this.refKeyboard.region.y+2,this.refKeyboard.region.x+this.refKeyboard.region.w,this.refKeyboard.region.y+2,this.shapeSpecs.baseLineColor,2);

        //draw the name of the kb
        uiDraw.drawEnhText(e.ctx,this.region.x+6,this.region.y+6,this.text,"black",1,this.styles.text.font,"left","top");
    }

    // 127 midi keys has 75 whites
    numWhiteKeys = 75; 
    //these are scaled to fit the base
    whiteKeyH = 5.0
    blackKeyH = 3.5
    whiteKeyW = 7/8;
    blackKeyW = .5;

    calculateKeyboardLayout()
    {
        //figure out the ratio for the scaled dimentions
        //var ratio1 = Math.min(1,this.region.h/this.baseHeight);
        this.shapeSpecs.keyboardW = (this.numWhiteKeys*this.whiteKeyW);
        var ratio = (this.region.w-this.shapeSpecs.sideEdges*2)/(this.shapeSpecs.keyboardW);
        this.shapeSpecs.keyboardBottom = this.shapeSpecs.keysTop+this.shapeSpecs.bottomEdge+ this.whiteKeyH * ratio;
        while(this.shapeSpecs.keyboardBottom > this.region.h)
        {
            ratio *= .999;
            this.shapeSpecs.keyboardBottom = this.shapeSpecs.keysTop+this.shapeSpecs.bottomEdge+ this.whiteKeyH * ratio;
        }
        this.shapeSpecs.keyboardW*=ratio;

        

        var whiteKeyW = this.whiteKeyW * ratio;
        var whiteKeyH = this.whiteKeyH * ratio;

        var blackKeyW = this.blackKeyW * ratio;
        var blackHalfW = blackKeyW/2;
        var blackKeyH = this.blackKeyH * ratio;

        

        var keysTop = this.region.y+this.shapeSpecs.keysTop;
       
        this.shapeSpecs.keyboardLeft = this.region.x+this.region.w/2-this.shapeSpecs.keyboardW/2;
        this.shapeSpecs.keyboardRight = this.region.x+this.region.w/2+this.shapeSpecs.keyboardW/2;
        var lineW = .06*ratio;
        var radiusL = .15*ratio;

        this.refKeyboard.region.x = this.shapeSpecs.keyboardLeft;
        this.refKeyboard.region.y = keysTop;
        this.refKeyboard.region.w = this.shapeSpecs.keyboardW;
        this.refKeyboard.region.h = this.shapeSpecs.keyboardBottom-this.shapeSpecs.keysTop;

        var xat = this.shapeSpecs.keyboardLeft;
        var keys = this.refKeyboard.keys;
        for (var i = 0; i<128; i++)
        {

            var key = keys[i];
            if(key.isSharp == false)
            {
                key.region.x = xat;
                key.region.y = keysTop;
                key.region.w = whiteKeyW;
                key.region.h = whiteKeyH;
                key.lineW = lineW;
                key.radiusL = radiusL;
                //We could have had a separate loop for the black keys... Not really sure if this is more efficient, but a bit more manageble 
                
                //look back and see if the previous key is a black note and do the same we did above for it...
                if(i!=0 && keys[i-1].isSharp) 
                {

                    xat -= blackHalfW; //backtrack xat a bit
                    key = keys[i-1];
                    key.region.x = xat;
                    key.region.y = keysTop;
                    key.region.w = blackKeyW;
                    key.region.h = blackKeyH;
                    key.lineW = lineW;
                    key.radiusL = radiusL;
                    xat+=blackHalfW; //and set back xat
                }
                xat+=whiteKeyW;
            }
        }
    }
    
    onResizeSelf(e)
    {
        //e.uiSource, the one that triggered the resize request use it in the parent region to resise yourself if your size is relative
        //this.region.y = e.uiSource.region.y+e.uiSource.region.h - this.region.h;
        //this.region.w = e.uiSource.region.w;

        this.region.y = this.parent.region.h - this.region.h;
        this.region.w = this.parent.region.w - this.region.x;
    }

    firstDraw = true;
    oldWidth = 0;
    oldHeight = 0;
    onDrawSelf(e)
    {
        //super.onDrawSelf(e);
        e.ctx.save();
        
        
        this.hookToFileReader();

        if(this.oldWidth !== this.region.w || this.oldHeight !== this.region.h)
        {
            this.oldWidth = this.region.w; this.oldHeight = this.region.h;
            this.calculateKeyboardLayout()
        }
        this.drawDevice(e)
        if(this.firstDraw===false)
        {
            //this.drawNoteFountain(e);

            //this.drawSongNoteFountain(e);
        }
        
        var timeIndex = this.midiFileReader.timeIndex;
        
        

        e.ctx.restore();
        this.firstDraw=false;
    }

    onMouseSelf(e)
    {
        //with mouvable false but resizable true. this should handle the resize
        super.onMouseSelf(e);
        var minHeight = this.shapeSpecs.keyboardBottom+this.shapeSpecs.bottomEdge;
        if(this.region.h<minHeight)
        {
            this.region.h = minHeight;
            this.region.y = this.parent.region.h-this.region.h;
        }
        this.region.h = Math.max(this.region.h,);
        if(e.uiCancel===false)
        {
            //if no resize, do the piano keys handling here
        }
        e.uiCancel = true;
    }

    setActive(active) 
    {
        this.active = active;
        if(active == false)
        {
            for(var i = 0; i<16; i++)
            {
                this.midiChannels[i].setActive(active);
            }
        }
    }

    onAppMessageSelf(e)
    {
        console.warn("RESET", e);
        if(e.message === "reset")
        {
            this.setActive(false);
            this.setActive(true);
            //midiOutputsListClearNotes();
        }
    }
//to refactor    
    physicalPortName = "";  //the manifacture name of to the physical midi device connected
    physicalPortIndex = 0;  //the port index the device is comunicating through
    displayName = "";       //The name the user will give the device
    active = false;         //is the device active
    activeChannel = 0;
    topEdge = 38;

    resizeMode = false;
    findIndexUnderThisX = -1;
    findIndexUnderThisY = -1;
    hoverIndex =-1;
    mergedKeys = [];
    firstDraw = true;

    microNotesCutOff = 0; //ms... this to cut out notes smaller than 



    //sideEdges = 10
    //bottomEdge = 5;

    //keyboardBottom = 0;
    



    baseColor = "#333333";
    baseLineColor = "#111111";

    keyHintColor = "lime";
    keyForceHintColor = "blue";
    keyHintTime = 500;



    noteFountainDensity = .3;



    //OG gets and sets
    getPhysicalPortName() {
        return this.physicalPortName;
    }
    setPhysicalPortName(physicalPortName) {
        this.physicalPortName = physicalPortName;
    }
    getPhysicalPortIndex() {
        return this.physicalPortIndex;
    }
    setPhysicalPortIndex(physicalPortIndex) {
        this.physicalPortIndex = physicalPortIndex;
    }
    getActive() {
        return this.active;
    }
    OLD_setActive(active) {
        this.active = active;
        if(active == false)
        {
            for(var i = 0; i<16; i++)
            {
                this.midiChannels[i].turnOff();
            }
        }
    }
    setActiveChannel(channel)
    {
        for(var i = 0; i<16; i++)
        {
            this.midiChannels[i].turnOff();
        }
        this.midiChannels[channel].turnOn();
    }
    OLD_onMidiFileMessage(message,msgDispatcher)
    {
        if(message.type == "MIDI")
        {
            if(message.midiEventType === 8 || message.midiEventType === 9)
            {
                //you have a temporary dynamic array because often note Off messages are followed by a note On message at the same time index
                //which meens we need to store the message for processing over a few frames...
                //remove the note if there already
                var i = this.midiChannels[message.midiChannel].keyboard.downMessagesArray.findIndex(item => {return (item.midiChannel == message.midiChannel && item.parameter1 == message.parameter1);});
                if(i>=0)
                {
                    this.midiChannels[message.midiChannel].keyboard.downMessagesArray.splice(i,1);
                }
                //if it's a note pressed, add it in
                if(message.midiEventType == 9 && message.parameter2 !=0)
                {
                    this.midiChannels[message.midiChannel].keyboard.downMessagesArray.push(message);
                    this.midiChannels[message.midiChannel].maxVelocity = Math.max(message.parameter2/127,this.midiChannels[message.midiChannel].maxVelocity);
                }
             
                
            }
            else if(message.midiEventType == 12)
            {
                //if(message.midiChannel === 9)
                //    console.log("Percussion Change Event:" + message.midiEventType, "Channel: " + message.midiChannel, "P1P2: "+ message.parameter1,message.parameter2); 
                midiChannelsListAddUpdateItem({channelIndex:message.midiChannel, voiceIndex:message.parameter1});
            }
            else
            {
                //consoleaa.log("MIDI Event:" + message.midiEventType, "Channel: " + message.midiChannel, "P1P2: "+ message.parameter1,message.parameter2); 
            }
         }
        else
        { 
            //consoleaa.log("Event: " + message.type,message); 
        }
    }
    OLD_onDumpAllEvents(message,msgDispatcher)
    {
        //populate fontain[]  for each channels.keyboard.keys.key...
        if(message.type == "MIDI")
        {
            if(message.midiEventType === 8 || (message.midiEventType === 9 && message.parameter2 === 0))
            {
                //note off

                //edit the last FOUNTAIN NOTE we added on note down to se the time end to it
                var songNotes = this.midiChannels[message.midiChannel].keyboard.keys[message.parameter1].songNotes;
                if(songNotes.length>0)
                {
                    if((message.timeIndex-songNotes[songNotes.length-1].timeIndexStart)>=this.microNotesCutOff) //hide micronotes
                        songNotes[songNotes.length-1].timeIndexEnd = message.timeIndex;
                    else
                        songNotes.splice(songNotes.length-1,1);
                }
            }
            else if(message.midiEventType === 9)
            {
                //note on
                var songNotes = this.midiChannels[message.midiChannel].keyboard.keys[message.parameter1].songNotes;
                //Create a new FOUNTAIN NOTE 
                var newEntry = {
                    timeIndexStart:message.timeIndex, 
                    timeIndexEnd:message.timeIndex, 
                    channel:message.midiChannel, 
                    key:message.parameter1, 
                    velocity:message.parameter2
                };
                //and add it to the channels[].keyboar.key[].songNotes
                songNotes.push(newEntry);
            }

        }

    }

    
    OLD_drawSongNoteFountain(e)
    {
        var timeIndex = this.midiFileReader.timeIndex;
        e.ctx.globalAlpha = 1;
        this.midiChannels.forEach(channel => 
        {
            channel.keyboard.keys.forEach(key => 
            {
                key.songNotes.forEach(note => 
                {
                    
                    if(!key.isSharp)
                    {
                        var refkey = this.mergedKeys[key.keyIndex]; //grab the mergedkey positions which updates live
                        //draw the key's visible FOUNTAIN NOTE in the fountain if in view, 
                        var y1 = (timeIndex - note.timeIndexStart)  * this.noteFountainDensity + targetNoteLine.region.y + targetNoteLine.region.h/2;
                        if(y1<0) return; //not visible yet, exit forEach() function
                        var y2 =  (timeIndex - note.timeIndexEnd) * this.noteFountainDensity + targetNoteLine.region.y + targetNoteLine.region.h/2;
                        if(y1>0 && y2<this.region.y)
                        {
                            y1 = Math.min(y1,targetNoteLine.region.y+targetNoteLine.region.h/2);
                            y2 = Math.min(y2,targetNoteLine.region.y+targetNoteLine.region.h/2);
                            //key used to be used for the positions before using refkey for live drawing
                            uiDraw.strokeLine(e.ctx,refkey.x,y1,refkey.x,y2,this.whiteFountainNoteEdgeColor,refkey.hw*1.6);
                            uiDraw.strokeLine(e.ctx,refkey.x,y1,refkey.x,y2,this.whiteFountainNoteFillColor,refkey.hw*1.2);
                            uiDraw.strokeLine(e.ctx,refkey.x-refkey.hw*.8,y1,refkey.x+refkey.hw*.8,y1,this.whiteFountainNoteEdgeColor,5);
                            uiDraw.strokeLine(e.ctx,refkey.x-refkey.hw*.8,y2,refkey.x+refkey.hw*.8,y2,this.whiteFountainNoteEdgeColor,5);
                        }
                    }
                });
            });
        });
        this.midiChannels.forEach(channel => 
            {
                channel.keyboard.keys.forEach(key => 
                {
                    key.songNotes.forEach(note => 
                    {
                        if(key.isSharp)
                        {
                            var refkey = this.mergedKeys[key.keyIndex]; //grab the mergedkey positions which updates live
                            //draw the key's visible FOUNTAIN NOTE in the fountain if in view, 
                            var y1 = (timeIndex - note.timeIndexStart) * this.noteFountainDensity + targetNoteLine.region.y + targetNoteLine.region.h/2;
                            if(y1<0) return; //not visible yet, exit forEach() function
                            var y2 =  (timeIndex - note.timeIndexEnd) * this.noteFountainDensity  + targetNoteLine.region.y + targetNoteLine.region.h/2;
                            if(y1>0 && y2<this.region.y)
                            {
                                y1 = Math.min(y1,targetNoteLine.region.y+targetNoteLine.region.h/2);
                                y2 = Math.min(y2,targetNoteLine.region.y+targetNoteLine.region.h/2);
                                //key used to be used for the positions before using refkey for live drawing
                                uiDraw.strokeLine(e.ctx,refkey.x,y1,refkey.x,y2,this.blackFountainNoteEdgeColor,refkey.hw*1.6);
                                uiDraw.strokeLine(e.ctx,refkey.x,y1,refkey.x,y2,this.blackFountainNoteFillColor,refkey.hw*1.2);
                                uiDraw.strokeLine(e.ctx,refkey.x-refkey.hw*.8,y1,refkey.x+refkey.hw*.8,y1,this.blackFountainNoteEdgeColor,5);
                                uiDraw.strokeLine(e.ctx,refkey.x-refkey.hw*.8,y2,refkey.x+refkey.hw*.8,y2,this.blackFountainNoteEdgeColor,5);
                                
                            }
                        }
                    });
                });
            });
        e.ctx.globalAlpha = 1;
    }
    
    
    
    
OLD_drawNoteFountain(e)
    {
        

        var timeIndex = this.midiFileReader.timeIndex;
        e.ctx.globalAlpha = 1;
        this.midiChannels.forEach(channel => 
        {
            channel.keyboard.keys.forEach(key => 
            {
                key.songNotes.forEach(note => 
                {
                     if(!key.isSharp)
                    {
                        var refkey = this.mergedKeys[key.keyIndex]; //grab the mergedkey positions which updates live
                        //draw the key's visible FOUNTAIN NOTE in the fountain if in view, 
                        var y1 = (timeIndex - note.timeIndexStart)  * this.noteFountainDensity + targetNoteLine.region.y + targetNoteLine.region.h/2;
                        if(y1<0) return; //not visible yet, exit forEach() function
                        var y2 =  (timeIndex - note.timeIndexEnd) * this.noteFountainDensity + targetNoteLine.region.y + targetNoteLine.region.h/2;
                        if(y1>0 && y2<this.region.y)
                        {
                            y1 = Math.min(y1,targetNoteLine.region.y+targetNoteLine.region.h/2);
                            y2 = Math.min(y2,targetNoteLine.region.y+targetNoteLine.region.h/2);
                            //key used to be used for the positions before using refkey for live drawing
                            uiDraw.strokeLine(e.ctx,refkey.x,y1,refkey.x,y2,this.whiteFountainNoteEdgeColor,refkey.hw*1.6);
                            uiDraw.strokeLine(e.ctx,refkey.x,y1,refkey.x,y2,this.whiteFountainNoteFillColor,refkey.hw*1.2);
                            uiDraw.strokeLine(e.ctx,refkey.x-refkey.hw*.8,y1,refkey.x+refkey.hw*.8,y1,this.whiteFountainNoteEdgeColor,5);
                            uiDraw.strokeLine(e.ctx,refkey.x-refkey.hw*.8,y2,refkey.x+refkey.hw*.8,y2,this.whiteFountainNoteEdgeColor,5);
                        }
                    }
                });
            });
        });
        this.midiChannels.forEach(channel => 
            {
                channel.keyboard.keys.forEach(key => 
                {
                    key.songNotes.forEach(note => 
                    {
                        if(key.isSharp)
                        {
                            var refkey = this.mergedKeys[key.keyIndex]; //grab the mergedkey positions which updates live
                            //draw the key's visible FOUNTAIN NOTE in the fountain if in view, 
                            var y1 = (timeIndex - note.timeIndexStart) * this.noteFountainDensity + targetNoteLine.region.y + targetNoteLine.region.h/2;
                            if(y1<0) return; //not visible yet, exit forEach() function
                            var y2 =  (timeIndex - note.timeIndexEnd) * this.noteFountainDensity  + targetNoteLine.region.y + targetNoteLine.region.h/2;
                            if(y1>0 && y2<this.region.y)
                            {
                                y1 = Math.min(y1,targetNoteLine.region.y+targetNoteLine.region.h/2);
                                y2 = Math.min(y2,targetNoteLine.region.y+targetNoteLine.region.h/2);
                                //key used to be used for the positions before using refkey for live drawing
                                uiDraw.strokeLine(e.ctx,refkey.x,y1,refkey.x,y2,this.blackFountainNoteEdgeColor,refkey.hw*1.6);
                                uiDraw.strokeLine(e.ctx,refkey.x,y1,refkey.x,y2,this.blackFountainNoteFillColor,refkey.hw*1.2);
                                uiDraw.strokeLine(e.ctx,refkey.x-refkey.hw*.8,y1,refkey.x+refkey.hw*.8,y1,this.blackFountainNoteEdgeColor,5);
                                uiDraw.strokeLine(e.ctx,refkey.x-refkey.hw*.8,y2,refkey.x+refkey.hw*.8,y2,this.blackFountainNoteEdgeColor,5);
                                
                            }
                        }
                    });
                });
            });
        e.ctx.globalAlpha = 1;
    }
    OLD_onDrawSelf(e)
    {
        //super.onDrawSelf(e);
        e.ctx.save();
        
        
        this.hookToFileReader();



        if(this.firstDraw===false)
        {
            this.drawNoteFountain(e);

            //this.drawSongNoteFountain(e);
        }

        var timeIndex = this.midiFileReader.timeIndex;
        
        var ctx = e.ctx;



        //figure out the ratio for the scaled dimentions
        //var ratio1 = Math.min(1,this.region.h/this.baseHeight);
        var keyboardW = (this.numWhiteKeys*this.whiteKeyW);
        var ratio = (this.region.w-this.shapeSpecs.sideEdges*2)/(keyboardW);
        this.keyboardBottom = this.keysTop+this.shapeSpecs.bottomEdge+ this.whiteKeyH * ratio;
        while(this.keyboardBottom > this.region.h)
        {
            ratio *= .999;
            this.keyboardBottom = this.keysTop+this.shapeSpecs.bottomEdge+ this.whiteKeyH * ratio;
        }
        keyboardW*=ratio;
        var whiteKeyW = this.whiteKeyW * ratio;
        var whiteHalfW = whiteKeyW/2;
        var whiteKeyH = this.whiteKeyH * ratio;

        var blackKeyW = this.blackKeyW * ratio;
        var blackHalfW = blackKeyW/2;
        var blackKeyH = this.blackKeyH * ratio;

        

        var keysTop = this.region.y+this.keysTop;
       
        var keyboardLeft = this.region.x+this.region.w/2-keyboardW/2;
        var keyboardRight = this.region.x+this.region.w/2+keyboardW/2;
        
        var lineW = .06*ratio;
        var radiusL = .15*ratio;

        

        //draw base
        uiDraw.roundedRectWBorders(e.ctx,this.region.x, this.region.y, this.region.w,this.region.h, this.baseColor,this.baseLineColor,1,5);
        
        //draw notes while calculating other things
        var xat = keyboardLeft;

        

        //for each KEYBOARD KEY in KEYBOARD KEYS of merge keys KEYBOARD
        for (var i = 0; i<128; i++)
        {
            //merge the channels keys into one keyboard
            var key = this.mergedKeys[i];
            
            //we use mergeKeys.[i].songNotes. so store the "combined" channels playing notes
            if(key.songNotes.length) //if there is a note 
            {
                //In the mergedKeys'  key[i]'s fountain there should be only 0 or 1 note. 
                //it is passed its pressed time and we preoseed the pressed state already
                if(key.songNotes[0].timeIndexEnd<timeIndex &&  key.pressed == true)
                {
                    //and the time has passed, pressed is off
                    key.songNotes.splice(0,1);
                    key.pressed = false;
                    key.velocity = 0;
                }
                else
                {
                    //it is still playing or we did not process it's (fast) pressed state... pressed is true
                    key.pressed = true;
                    key.velocity = key.songNotes[0].velocity;
                }

                //function getRandomInt(max) {
                //    return Math.round(Math.random() * max);
                //  }
                //key.pressed = getRandomInt(1);
            }
            else //we use an else so that we skip for a frame to see the state changes on screen
            {
                //if the key has no note, fetch a new one from the channels[any] keyboard keys[matching index]'s note fountain
                var foundOne = false;
                //these will be used the stub FOUNTAIN NOTE 
                var maxTimeIndex = timeIndex;
                var minTimeIndex = timeIndex;
                var channel = 0;
                var velocity = 0;
                this.midiChannels.forEach(channel => 
                {
                    var chanKey = channel.keyboard.keys[i];
                    
                    //while we are at it, updtae their x and hw values
                    chanKey.x = key.x;
                    chanKey.hw = key.hw;

                    // Find the longest timeIndexEnd value
                    
                    if(chanKey.songNotes.length)
                    {
                        var note = chanKey.songNotes[0];
                        //of the notes that should be on
                        if(note.timeIndexStart<timeIndex)
                        {
                            minTimeIndex = Math.min(minTimeIndex,note.timeIndexStart);
                            maxTimeIndex = Math.max(maxTimeIndex,note.timeIndexEnd);
                            velocity = Math.max(velocity,note.velocity);
                            foundOne = true; //set the pressed
                        }
                        if(note.timeIndexEnd<timeIndex)
                        {
                            //and if that not ha passed it's end time, mode it to the fallen array
                            chanKey.fallenNotes.push(note);
                            chanKey.songNotes.splice(0,1);
                        }
                    }
                });
                if(foundOne)
                {
                    //add the stub FOUNTAIN NOTE to the mergeKeys.[i].songNotes
                    key.songNotes.push({timeIndexStart:minTimeIndex,timeIndexEnd:maxTimeIndex,channel:channel,key:key.keyIndex,velocity:velocity});
                }
            }
            
            //In case you forgot we are still in the for all KEYBOARD KEY in KEYBOARB KEYS of mergedKeys
            //In this part of the loop we draw the white notes (first) and the black notes (second) according to the key pressed state while updating the structure with screen position and dimentions of the keys
            if(key.isSharp == false)
            {
                key.hw = whiteHalfW;
                key.x = xat+whiteHalfW;
                //if(i==0) keyDownArrayEffect.addNote(key);
                if(key.pressed) 
                {
                    uiDraw.roundedRectWBorders(e.ctx,xat, keysTop, whiteKeyW,whiteKeyH+1,this.whiteKeyPressedColor,this.whiteKeyLineColor,lineW,radiusL);
                    keyDownArrayEffect.addNote(key);
                }
                else if(this.hoverIndex == i) //hover highligting
                {
                    uiDraw.roundedRectWBorders(e.ctx,xat, keysTop, whiteKeyW,whiteKeyH,this.whiteKeyHoverColor,this.whiteKeyLineColor,lineW,radiusL);
                }
                else //normal up state
                {
                    uiDraw.roundedRectWBorders(e.ctx,xat, keysTop, whiteKeyW,whiteKeyH,this.whiteKeyColor,this.whiteKeyLineColor,lineW,radiusL);
                }
                //We could have had a separate loop for the black keys... Not really sure if this is more efficient 
                //look back and see if the previous key is a black note and do the same we did above for it...
                if(i!=0 && this.mergedKeys[i-1].isSharp) 
                {

                    xat -= blackHalfW; //backtrack xat a bit
                    key = this.mergedKeys[i-1];
                    key.hw = blackHalfW;
                    key.x = xat+blackHalfW;
                    if(key.pressed) 
                    {
                        uiDraw.roundedRectWBorders(e.ctx,xat, keysTop, blackKeyW,blackKeyH+1,this.blackKeyPressedColor,this.blackKeyLineColor,lineW,radiusL);
                        keyDownArrayEffect.addNote(key);
                    }
                    else if(this.hoverIndex == i)
                    {
                        uiDraw.roundedRectWBorders(e.ctx,xat, keysTop, blackKeyW,blackKeyH,this.blackKeyHoverColor,this.blackKeyLineColor,lineW,radiusL);
                    }
                    else
                    {
                        uiDraw.roundedRectWBorders(e.ctx,xat, keysTop, blackKeyW,blackKeyH,this.blackKeyColor,this.blackKeyLineColor,lineW,radiusL);
                    }
                    xat+=blackHalfW; //and set back xat
                }
                xat+=whiteKeyW;
            }
            //add to the note down effect
            if(key.pressed)
            {
                keyDownArrayEffect.addNote(key);
            }
        }
        
        //draw lid over note
        uiDraw.fillRect(e.ctx,keyboardLeft,keysTop-2,keyboardW,4,this.baseColor);
        uiDraw.strokeLine(e.ctx,keyboardLeft,keysTop+2,keyboardRight,keysTop+2,this.baseLineColor,2);

        //draw the name of the kb
        uiDraw.drawEnhText(e.ctx,this.region.x+6,this.region.y+6,this.text,"black",1,this.styles.text.font,"left","top");

        //Post processing for fluff 
        //so for each channel
        var chanIndex = 0; 
        this.midiChannels.forEach(channel => 
        {
            //dampen the max velocity and the channel list volume per channel indicator. maxVelicity per channel was calculated in the onMidiMessage

            
            
            var vel = 0|midiChannelsList.itemsArray[chanIndex].midiChannel.maxVelocity;
            vel+= channel.maxVelocity/2;
            if(channel.keyboard.downMessagesArray.length ===0)
            {
                channel.maxVelocity *= .9;
            }
            else
            {
                channel.maxVelocity *=.98;
                channel.maxVelocity = Math.max(channel.maxVelocity,.2);
            }
            vel=Math.min(1,vel);
            midiChannelsList.itemsArray[chanIndex].midiChannel.maxVelocity = vel;
            chanIndex++;
            //Now the velocity for each key... find the KEYBOARKEY in KEYBOARD KEYS and
            //draw the comming notes hint above the key, still need to hash out the multiple channels thing
            this.mergedKeys.forEach(key => {
        
                //if there are notes in the that channel's keyboard key
                if(channel.keyboard.keys[key.keyIndex].songNotes.length)
                {
                    var note = channel.keyboard.keys[key.keyIndex].songNotes[0];
                    var noteY =  (timeIndex - note.timeIndexStart) * this.noteFountainDensity + targetNoteLine.region.y + targetNoteLine.region.h/2;
                    //if((note.timeIndexStart-timeIndex) < this.keyHintTime)
                    if(noteY > hintNoteLine.region.y+hintNoteLine.region.h/2)
                    {
                        var y = this.region.y+1 ///keysTop;
                        //uiDraw.strokeLine(e.ctx,key.x,y,key.x,y+2,this.keyHintColor,3);
                        uiDraw.strokeLine(e.ctx,key.x,y,key.x,y+2,hintNoteLine.styles.line.color,3);
                        return;
                    }
                }
            });
        });

        //draw the note down array velocity/force on the keyboard base, extra fluff
        keyDownArrayEffect.notesArray.forEach(note => {
            var y = keysTop;
            uiDraw.strokeLine(e.ctx,note.x-.5,y,note.x-.5,y-note.ndeFastForce*this.keysTop*.7,this.keyForceHintColor,3);
        });
        
        e.ctx.restore();
        this.firstDraw = false;
    }
    
}



var midiKeyboardDevice = new appKeyboardDevice()
midiKeyboardDevice.setStyles({text:{font:"12px Arial", hmargin:8, vmargin:12}});
midiKeyboardDevice.setStyles({panel:{movable:false}});
midiKeyboardDevice.setStyles({border:{resizable:true}});
midiKeyboardDevice.setStyles({sizable:{left:false, right:false, top:true, bottom:false}});
midiKeyboardDevice.setText("KB: MIDI-ALL");
midiKeyboardDevice.setRegion({x:0,y:800,w:window.innerWidth,h:600});

myBase.addChild(midiKeyboardDevice);