//investigate what the meta events needs handing. only tempo is handled rn
//This class reads in a midi file and creates data structures and provides healper fuinctions to help handle the content
class mfMidiFile extends appModule
{
    //the full blown structure
    midiData = {};
    //a 1d array of all the events for all the tracks and all the channels
    flatMidiData = [];

    

    channelsData = [];
    //channelsData[0-16].events=[0 to n channel events]
    //channelsData[0-16].keys[0-127].playActive=true if playing of this key on the keyboard is active
    //channelsData[0-16].keys[0-127].events = [0 to n key specific channel events]
    //channelsData[0=15].playIndexAt = 0-n the index the playing of the channel is at, resets every load and every stop
    //channelsData[0=15].playActive=true if the playing of events is active for this channel, resets every load

    //playing specs
    playSpeed = 1;
    timeSignature = 4/4;
    songTime = 0; //the time ins usec the sond lasts

    //notification functions 
    midiMessageCallbacks = [];
    dumpAllEventsCallbacks = [];
    playStateChangedCallback  = null;
    onFileReadCallback = null;

    //read and playing states
    readState = "nofile"; //possible states nofile, pending, reading, ready, error
    readError = "";
    playState = "nofile"; //possible states nofile, ready, play, playing, stop, stopped, pause, unpause, paused

    //the number of midi ticks in total for the whole song
    numTicks = 0;

    //the playing position in microseconds 
    timeIndex = 0;
    lastTime = performance.now();

    //the next item tp play in the array

    constructor()
    {
        super();
        this.resetVars();
    }
    //this opens a file, given a file object provided by a file dialog or file drop event
    openFile(file)
    {

        this.resetVars();
        this.readState = "pending";
        this.setPlayState("nofile"); 
        this.lastTime = performance.now();


        //with a reader, read the file as binary 
        //and decode the midi content, 
        //and flatten the conetent to a 1d array of events
        //then notify the caller via the callback function
        var reader = new FileReader();
        var me = this;
        reader.onload = function (event) {

            me.readState = "reading";

            me.decodeSMF(event.target.result);
            
            me.processMidiFileData();
            me.readState = "ready";
            me.setPlayState("ready");
            me.timeIndex = 0;
            me.lastTime = performance.now();
            if(me.onFileReadCallback != null) me.onFileReadCallback(me);
            
        };
        reader.onerror = function (event) {
            me.readState = "error"
            me.readError = "" + reader.error;
            if(me.onFileReadCallback != null) me.onFileReadCallback(me);
        };
        reader.readAsArrayBuffer(file);
    }
    //set the play state, only if midi data is ready
    setPlayState(playState = "") //play, playing, stop, 
    {
        if(this.readState == "ready")
            this.playState = playState;
        if(this.playStateChangedCallback != null) this.playStateChangedCallback(this);
    }
    //functions to set the callbacks
    addMidiMessageCallback(midiMessageCallback = function(e,o){})
    {
        this.midiMessageCallbacks.push( midiMessageCallback);
    }
    addDumpAllEvents(DumpAllEventsCallback = function(e,o){})
    {
        this.dumpAllEventsCallbacks.push( DumpAllEventsCallback);
    }
    setPlayStateChangedCallback(playStateChangedCallback = function(o){})
    {
        this.playStateChangedCallback = playStateChangedCallback;
    }
    
    setOnFileReadCallback(onFileReadCallback = function(o){})
    {
        this.onFileReadCallback = onFileReadCallback;
    }
    //turns a set of channels' playing flag on or off, defaults to ON for all
    //the settings resets to true on loading a new file
    setChannelsPlayingActive(active = true, channels = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])
    {
        channels.forEach(activeIndex => {this.channelsData[activeIndex].playActive = active});
    }
   
    //turns a set of channels' set of keys on or off. default is ON for all keys
    setChannelKeysPlayingActive(active = true, channels = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], keys = [])
    {
        var zekeys = keys;
        if(zekeys.length == 0)
        {
            for (var i = 0; i < 128; i++) {zekeys.push(i)};
        }
        else
        {
            channels.forEach(activeIndex => 
            {
                zekeys.forEach(key => 
                {
                    this.channelsData[activeIndex].keys[key].playActive = active;
                });
            });
        }
    }
    getTimeIndex()
    {
        return this.timeIndex;
    }

    //usueful to set the position to the first note that are to be played
    getFirstPlayingNoteTimeIndex()
    {
        //find the first Note ON event of all the playActive channel. 
        var rtime = 99999999999999;
        this.channelsData.forEach(channel => 
        {
            if(channel.playActive)
            {
                channel.events.forEach( event =>
                {
                    if(event.type === "MIDI" && event.midiEventType === 9)
                    {
                        var key = event.parameter1;
                        //if the keyboard key for that note is also playActive
                        if(channel.keys[key].playActive)
                        {
                            //set the rtime to whatever is smaller, this or last found
                            rtime = Math.min(rtime,event.timeIndex);
                            return; //aka forEach break;
                        }
                    }
                });
            }
        });
        if(rtime === 99999999999999) 
            return 0;

        return rtime;
    }
    setTimeIndex(timeIndex)
    {
        this.timeIndex = timeIndex;
    }
    getSongTime()
    {
        return this.songTime;
    }

    //useful to manually stop the playing when the time index is higher than this value when not playing all channels
    getLastPlayingNoteTimeIndex()
    {
        var rtime = 0;
        //find the Last Note Off event of all the playActive channel. 
        this.channelsData.forEach(channel => 
        {
            if(channel.playActive)
            {
                //channel.events.forEach( event =>
                for(var i = channel.events.lenght-1; i>=0; i--)
                {
                    var event = channel.events[i];
                    if(event.eventType === "MIDI" && event.midiEventType === 8)
                    {
                        var key = event.parameter1;
                        //if the keyboard key for that note is also playActive
                        if(channel.keys[key].playActive)
                        {
                            //set the rtime to whatever is larger, this or last found
                            rtime = Math.max(rtime,event.timeIndex);
                            return; //aka forEach break;
                        }
                    }
                }
                //});
            }
        });
        return rtime;
    }
    //this is called in a timer loop, suggested in the animationframe draw
    //by the user to the object. as opposed to creating our own timer...
    onDrawFrame(now)
    {
        //depeneding on the state, pocess the file respecting the tempo
        var thisTime = performance.now();
        var deltaTime = thisTime-this.lastTime;
        this.lastTime = thisTime;
        
        if(this.playState === "playing")
        {
            var done = this.playFileData();
            
            if(done)
            {
                this.setPlayState("stop");
            }
            //next time
            this.timeIndex += deltaTime * globals.playSpeed;
        }
        else if(this.playState === "play")
        {
            this.setPlayState("playing");
        }
        else if(this.playState === "stop")
        {
            this.timeIndex= 0;

            this.channelsData.forEach( channel => {channel.playIndexAt = 0;});
           
            this.setPlayState("stopped");
        }
        else if(this.playState === "pause")
        {
            this.setPlayState("paused");
        }
    }
    dumpAllEvents()
    {
        this.playFileData(true);
    }
    playFileData(dumpAll = false)
    {
        var done = true;
        this.channelsData.forEach(channel => 
        {
            if(channel.playActive)
            {
                var EventsSourceArr = channel.events;// this.flatMidiData;
                if(channel.playIndexAt < EventsSourceArr.length)
                {
                    var event = EventsSourceArr[channel.playIndexAt];
                    //for all midi events that should be handled at this time

                    while( channel.playIndexAt < EventsSourceArr.length && 
                        (
                            dumpAll ||
                            //((event.ticks/this.midiData.ticksPerBeat * 500000)/1000)
                            (event.timeIndex
                            <=  
                            (this.timeIndex) * this.playSpeed))// this.tempo/120 )
                        )
                    {
                        var sendIt = true;
                        if(event.type==="MIDI")
                        {
                            if(event.midiEventType=== 8 || event.midiEventType === 9 || event.midiEventType === 10)
                            {
                                var key = event.parameter1;
                                    sendIt = channel.keys[key].playActive;
                                
                            }
                        }
                        if(sendIt)
                        {
                            if(dumpAll)
                                this.dumpAllEventsCallbacks.forEach(callback => {callback(event,this);} );
                            else
                                this.midiMessageCallbacks.forEach(callback => {callback(event,this);} );
                            //if(this.midiMessageCallback!=null) 
                            //{
                            //    this.midiMessageCallback(event,this);
                            //}
                        }
                        //next item
                        channel.playIndexAt++;
                        if(channel.playIndexAt <  EventsSourceArr.length)
                        {
                            event = EventsSourceArr[channel.playIndexAt];
                        }
                        else
                        {
                        }
                    }
                    done = done && (channel.playIndexAt >= EventsSourceArr.length);
                }
            }
        });
        if(done)
        {
            this.timeIndex= 0;
            this.channelsData.forEach(channel => {channel.playIndexAt = 0;});
        }
        return done;
    }
    processMidiFileData()
    {
        //this flattens the midi content into a single 1 d array
        if(this.midiData.tracks != null)
        {
            for(var i = 0; i< this.midiData.tracks.length; i++)
            {
                var track = this.midiData.tracks[i];
                var ticks = 0;
                track.events.forEach( event => 
                {
                    //read in the ticks delta and create a absolute ticks position entry in the structure, 
                    //so its easier to process while playing the file
                    event.tempo = this.lasttempo;
                    ticks += event.delta/(event.tempo/120);
                    event.ticks=ticks;
                    
                    event.timeIndex = ((event.ticks/this.midiData.ticksPerBeat * (500000))/1000)  ;
                    if(event.type == "meta" && event.metaType == 0x51) //added tempo reading right way
                    {
                        this.lasttempo = Math.round(60000000/this.intFromMetaDataArray(event.metaData));
                    }
                    
                    event.trackName = track.trackName;
                    event.trackIndex = i;
                    this.flatMidiData.push(event);
                    this.numTicks = Math.max(this.numTicks,ticks);
                    this.songTime = Math.max(this.songTime, event.timeIndex)
                });
            }
        } 
        //sort the array based on the ticks value placing every message in the right order regarless of the track
        this.flatMidiData.sort((a, b) => a.ticks - b.ticks);
        
        //this now take the sorted data and populates the channelsData array structure
        this.flatMidiData.forEach( event => 
        {
            if(event.midiChannel!=null)
            {
                var channelIndex = event.midiChannel;
                //add the event to the channel events array
                this.channelsData[channelIndex].events.push(event); 
                if(event.midiEventType === 8 || event.midiEventType === 9 || event.midiEventType === 10)
                {
                    var keyIndex = event.parameter1;
                    
                    event.keyNotesArrayIndex = this.channelsData[channelIndex].keys[keyIndex].events.length;
                    
                    //add the event in the keys's events array
                    this.channelsData[channelIndex].keys[keyIndex].events.push(event);
                    
                    
                }
                else
                {
                    //add the all keys related event to all the keys (pitch bend for example)
                    this.channelsData[channelIndex].keys.forEach( key =>
                    {
                        key.events.push(event);
                    });
                }
            }
        });
        
        
    }
    resetVars()
    {
        this.lasttempo = 120
        this.numTicks = 0;
        this.songTime = 0;
        this.events = [];
        this.speed = 1;
        this.songTime = 0;
        this.timeSignature = 4/4;
        this.timeIndex = 0;

        this.flatMidiData = [];
        this.channelsData = [];
        this.midiData = {};
        //this completely defines the structure as described in the var channelsData comment
        for (var channelIndex = 0; channelIndex<16; channelIndex++)
        {
            //make channelsData[0-15] = {events:[], keys:[]}
            //or
            //channelsData[0-15].events = [];
            //channelsData[0-15].keys = {}};
            this.channelsData.push({events:[], keys:[], playActive:true, playIndexAt:0});
            for(var keyIndex = 0; keyIndex < 128; keyIndex++)
            {
                //make channelsData[channelIndex].keys[0-127] = [];
                this.channelsData[channelIndex].keys.push({playActive:true,events:[]});
                //this.channelsData[channelIndex].keys[keyIndex].events
            }
        }
        
    }
    //helper for integer and string extraction from meta data
    stringFromMetaDataArray(array)
    {
        return array.map(function(b) { 
            return String.fromCharCode(b);
        } ).join("");
    }
    intFromMetaDataArray(array)
    {
        //var numbytes = array[0];
        var val = 0;
        for (var i = 0; i<array.length; i++)
        {
            val = (val<<8) + array[i];
        }
        return val;
    }

    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    //FILE READER
    //objectized and tweaked form of SMFReader.js
    //https://github.com/cwilso/Standard-MIDI-File-reader
    
    lasttempo = 120;
    error(str) {
        this.readStatus = "error"
        this.readError = "" + str;
    }

    appendText( e, text ) {
        e.appendChild( document.createTextNode( text ) );
    }

    decodeVariableLengthValue(data, trackOffset ) {
        var i;
        var idx = trackOffset;
        var result = 0;
        
        do   {
            i = data.getUint8(idx++);
            result = result << 7;		// left-shift by 7 bits
            result += (i & 0x7f);	// mask off the top bit
        } while (i>=0x80);
        
        return {idx:idx,result:result};
    }

    decodeMetaEvent( data, trackOffset, track, trackEvent ) {
        var idx = trackOffset + 1;  // we already know the first byte is 0xff
        var result;
        var length;
        var end;
        var metaData = [];
        
        trackEvent.type = "meta";
        
        trackEvent.rawarr.push(data.getUint8(idx));
        trackEvent.metaType = data.getUint8(idx++);
        
    /*	Type	Event	Type	Event
        0x00	 Sequence number	 
        0x01	 Text event	 
        0x02	 Copyright notice	 
        0x03	 Sequence or track name	 
        0x04	 Instrument name	 
        0x05	 Lyric text	 
        0x06	 Marker text	 
        0x07	 Cue point
        0x20	 MIDI channel prefix assignment
        0x2F	 End of track
        0x51	 Tempo setting
        0x54	 SMPTE offset
        0x58	 Time signature
        0x59	 Key signature
        0x7F	 Sequencer specific event */
        
        trackEvent.rawarr.push(data.getUint8(idx));
        result = this.decodeVariableLengthValue( data, idx );
        idx = result.idx;
        length = result.result;
        end = idx + length;

        while (idx < end) {
            metaData.push(data.getUint8(idx));
            trackEvent.rawarr.push(data.getUint8(idx++));
        }
        
        trackEvent.metaData = metaData;
        
        if (trackEvent.metaType == 0x03) {
            var str = "";
            var i;
            for (i=0; i<metaData.length; i++)
            str += String.fromCharCode( metaData[i]);
            track.trackName = str;
        }
        else if(trackEvent.metaType == 0x51) //added tempo reading right way
        {
            trackEvent.tempo = Math.round(60000000/this.intFromMetaDataArray(metaData));
        }
        trackEvent.decoder = "decodeMetaEvent";
        return idx;
    }

    decodeSysexEvent( data, trackOffset, track, trackEvent ) {
        var idx = trackOffset;
        var metaData = [];
        var d;

        trackEvent.type = "sysex";
        
        //trackEvent.rawarr.push(data.getUint8(idx));
        metaData.push(data.getUint8(idx++));
        //trackEvent.rawarr.push(ddd);

        do {
            d = data.getUint8(idx++);
            trackEvent.rawarr.push(d);
            metaData.push(d);
        } while (d!=0xf7);

        trackEvent.metaData = metaData;
        trackEvent.decoder = "decodeSysexEvent";
        return idx;
    }

    decodeMIDIEvent( data, idx, trackEvent ) {
        var eventType = data.getUint8(idx++);
        //trackEvent.rawarr.push(eventType);

        trackEvent.type = "MIDI";

        trackEvent.midiEventType = (eventType & 0xf0)>>4;
        trackEvent.midiChannel = eventType & 0x0f;
        
        trackEvent.rawarr.push(data.getUint8(idx));
        trackEvent.parameter1 = data.getUint8(idx++);
        

        // program change and channel aftertouch don't have a param2
        if ((trackEvent.midiEventType != 0x0c)&&(trackEvent.midiEventType != 0x0d))
        {
            trackEvent.rawarr.push(data.getUint8(idx));
            trackEvent.parameter2 = data.getUint8(idx++);
        }
        trackEvent.decoder = "decodeMIDIEvent";
        return (idx);
    }

    decodeRunningModeMIDIEvent( data, idx, trackEvent, lastEvent ) {
        
        trackEvent.type = "MIDI";
        trackEvent.midiEventType = lastEvent.midiEventType;
        trackEvent.midiChannel = lastEvent.midiChannel;
        trackEvent.rawarr[trackEvent.rawarr.length-1] = ((trackEvent.midiEventType<<4)+trackEvent.midiChannel);

        trackEvent.rawarr.push(data.getUint8(idx));
        trackEvent.parameter1 = data.getUint8(idx++);
        // program change and channel aftertouch don't have a param2
        if ((trackEvent.midiEventType != 0x0c)&&(trackEvent.midiEventType != 0x0d))
        {
            trackEvent.rawarr.push(data.getUint8(idx));
            trackEvent.parameter2 = data.getUint8(idx++);
        }
        trackEvent.decoder = "decodeRunningModeMIDIEvent";
        return (idx);
    }

    decodeTrackEvent( data, track, trackOffset ) {
        var eventLength; // in bytes
        var time;		// time this event occurs (delta)
        var trackEvent = {};
        var result;
        var idx = trackOffset;
        var lastEventIdx = track.events.length;

        result = this.decodeVariableLengthValue( data, idx );
        idx = result.idx;
        trackEvent.delta = result.result;
        trackEvent.rawarr = []; 
        trackEvent.tempo = this.lasttempo;

        trackEvent.decoder = "decodeTrackEvent";


        // figure out what type of event we have - DON'T increment the index!!
        var i = data.getUint8(idx);
        trackEvent.rawarr.push(i);
        if (i==0xff)
        idx = this.decodeMetaEvent( data, idx, track, trackEvent );
        else if ((i==0xf0)||(i==0xf7))
        idx = this.decodeSysexEvent( data, idx, track, trackEvent );
        else if (i & 0x80) // non-running-mode MIDI Event
        idx = this.decodeMIDIEvent( data, idx, trackEvent );
        else if (lastEventIdx > 0)
        idx = this.decodeRunningModeMIDIEvent( data, idx, trackEvent, track.events[track.events.length-1] );
        else {this.error("Running mode event with no previous event!"); return -1;}

        trackEvent.data = new Uint8Array(trackEvent.rawarr.length);
        for (var i = 0; i< trackEvent.rawarr.length; i++)
        {
            trackEvent.data[i] = trackEvent.rawarr[i];
        }
        track.events.push(trackEvent);

        return idx;
    }

    decodeTrack( data, track, trackOffset ) {
        var idx = trackOffset;
        var length;
        var end;
        this.lasttempo = 120;
        
        //   char           ID[4];  // Track header "MTrk" 
        if ( (data.getUint8(idx++) != 0x4d) ||
            (data.getUint8(idx++) != 0x54) ||
            (data.getUint8(idx++) != 0x72) ||
            (data.getUint8(idx++) != 0x6b) )
        {this.error("malformed track header"); return -1;}
                
        //   unsigned long length;  // length of track chunk in bytes
        track.byteLength = data.getUint32(idx);
        idx+=4;
        end = idx + track.byteLength;

        track.events = [];	// creates an empty array
        
        // any number of trackEvents.
        while (idx < end) {
            idx = this.decodeTrackEvent( data, track, idx );
            if (idx == -1)
                {this.error("this.error decoding track event"); return -1;}
        }
        
    //	{this.error("this.error"); return -1;}
        return idx;
    }

    decodeSMF( buffer ) {
        var data = new DataView(buffer);
        var idx=0;
        this.midiData = {}; // clear the midi file object if it's already allocated
        
    //	document.getElementById("updates").innerHTML = "";
    //  alert( "File is " + buffer.byteLength + " bytes long.");

    //   char           ID[4];  // File header "MThd" 
        if ( (data.getUint8(idx++) != 0x4d) ||
            (data.getUint8(idx++) != 0x54) ||
            (data.getUint8(idx++) != 0x68) ||
            (data.getUint8(idx++) != 0x64) )
        return(this.error("malformed file header"));
            
    //   unsigned long  Length; /* This should be 6 */
        if (data.getUint32(idx) != 6)
        return(this.error("file header length is not 6."));
        idx+=4;

    //   unsigned short format;
        this.midiData.format = data.getUint16(idx);
        idx+=2;
        
        if ((this.midiData.format < 0) || (this.midiData.format > 2) )
            return(this.error("MIDI file format " + this.midiData.format + " unrecognized."));
        
            if (this.midiData.format == 2 )
                return(this.error("MIDI file format type 2 not supported."));

    //   unsigned short numTracks;
        this.midiData.numTracks = data.getUint16(idx);
        idx+=2;

    //   unsigned short ticksPerBeat;
        this.midiData.ticksPerBeat = data.getUint16(idx);
        idx+=2;

        this.midiData.tracks=new Array(this.midiData.numTracks);
        for (var iTrack=0; iTrack<this.midiData.numTracks; iTrack++) {
            this.midiData.tracks[iTrack] = {};
            idx = this.decodeTrack( data, this.midiData.tracks[iTrack], idx);
            if (idx == -1)
                return(this.error("this.error reading track #" + iTrack));
        }
        
    }
}


