class nfUINoteFountain extends uiPanel
{
    name = "nfUINoteFountain";
    noteFountainDensity = .3;
    whiteFountainNoteEdgeColor = "#AFD31D";
    whiteFountainNoteFillColor = "#E16218";
    blackFountainNoteEdgeColor = "#7F9A15";
    blackFountainNoteFillColor = "#AC4B12";
    songMode = 0;
    songPlayedMode = 1;
    devicePlayedMode = 2;

    colorSpecs = [
        //white edge, white fill, black edge, black fill
        [uiDraw.hslToHex(50, 1, .3), uiDraw.hslToHex(50, 1, .5),uiDraw.hslToHex(50, .5, .3), uiDraw.hslToHex(50, .5, .5)],
        [uiDraw.hslToHex(70, 1, .3), uiDraw.hslToHex(70, 1, .5),uiDraw.hslToHex(70, .5, .3), uiDraw.hslToHex(70, .5, .5)],
        [uiDraw.hslToHex(90, 1, .3), uiDraw.hslToHex(90, 1, .5),uiDraw.hslToHex(90, .5, .3), uiDraw.hslToHex(90, .5, .5)],
        [uiDraw.hslToHex(110, 1, .3), uiDraw.hslToHex(110, 1, .5),uiDraw.hslToHex(110, .5, .3), uiDraw.hslToHex(110, .5, .5)],
        [uiDraw.hslToHex(130, 1, .3), uiDraw.hslToHex(130, 1, .5),uiDraw.hslToHex(130, .5, .3), uiDraw.hslToHex(130, .5, .5)],
        [uiDraw.hslToHex(150, 1, .3), uiDraw.hslToHex(150, 1, .5),uiDraw.hslToHex(150, .5, .3), uiDraw.hslToHex(150, .5, .5)],
        [uiDraw.hslToHex(170, 1, .3), uiDraw.hslToHex(170, 1, .5),uiDraw.hslToHex(170, .5, .3), uiDraw.hslToHex(170, .5, .5)],
        [uiDraw.hslToHex(190, 1, .3), uiDraw.hslToHex(190, 1, .5),uiDraw.hslToHex(190, .5, .3), uiDraw.hslToHex(190, .5, .5)],
        [uiDraw.hslToHex(210, 1, .3), uiDraw.hslToHex(210, 1, .5),uiDraw.hslToHex(210, .5, .3), uiDraw.hslToHex(210, .5, .5)],
        [uiDraw.hslToHex(230, 1, .3), uiDraw.hslToHex(230, 1, .5),uiDraw.hslToHex(230, .5, .3), uiDraw.hslToHex(230, .5, .5)],
        [uiDraw.hslToHex(250, 1, .3), uiDraw.hslToHex(250, 1, .5),uiDraw.hslToHex(250, .5, .3), uiDraw.hslToHex(250, .5, .5)],
        [uiDraw.hslToHex(270, 1, .3), uiDraw.hslToHex(270, 1, .5),uiDraw.hslToHex(270, .5, .3), uiDraw.hslToHex(270, .5, .5)],
        [uiDraw.hslToHex(290, 1, .3), uiDraw.hslToHex(290, 1, .5),uiDraw.hslToHex(290, .5, .3), uiDraw.hslToHex(290, .5, .5)],
        [uiDraw.hslToHex(310, 1, .3), uiDraw.hslToHex(310, 1, .5),uiDraw.hslToHex(310, .5, .3), uiDraw.hslToHex(310, .5, .5)],
        [uiDraw.hslToHex(330, 1, .3), uiDraw.hslToHex(330, 1, .5),uiDraw.hslToHex(330, .5, .3), uiDraw.hslToHex(330, .5, .5)],
        [uiDraw.hslToHex(350, 1, .3), uiDraw.hslToHex(350, 1, .5),uiDraw.hslToHex(350, .5, .3), uiDraw.hslToHex(350, .5, .5)]
    ];
    
    constructor()
    {
        super();
        
        this.updateColors();
        
    }
    updateColors()
    {
        var base = 66.6;
        var skip = 33.3;
        for(var i = 0; i<16; i++)
        {
            
            var c = (base+i*skip)%360;
            this.colorSpecs[i] = [
                uiDraw.hslToHex( refColor.h+c, (refColor.s+.6)/2, (refColor.l+.5)/2),
                uiDraw.hslToHex( refColor.h+c, (refColor.s+.6)/2, (refColor.l+.6)/2),
                uiDraw.hslToHex( refColor.h+c, (refColor.s+.6)/2, (refColor.l+.4)/2),
                uiDraw.hslToHex( refColor.h+c, (refColor.s+.6)/2, (refColor.l+.5)/2)];
            
        }
        
    }
    onDrawSelf(e)
    {
        this.region.x = 0;//this.parent.region.x;
        this.region.y = 0;//this.parent.region.y;
        this.region.w = this.parent.region.w;
        this.region.h = this.parent.region.h;
        super.onDrawSelf(e);
        this.drawNoteFountain(e);
    }
    drawNoteFountain(e)
    {
        e.ctx.save();
        e.ctx.globalAlpha = 1;
        var refKeys = midiKeyboardDevice.refKeyboard.keys;
        for (var i = 0; i<128; i++)
        {
            if(!refKeys[i].isSharp)
            {
                //this.drawKeyNote(e,i,this.songPlayedMode);
                this.drawKeyNote(e,i,this.songMode);
                this.drawKeyNote(e,i,this.devicePlayedMode);
                if(i!=0 && refKeys[i-1].isSharp)
                {
                    //this.drawKeyNote(e,i-1, this.songPlayedMode);
                    this.drawKeyNote(e,i-1, this.songMode);
                    this.drawKeyNote(e,i-1, this.devicePlayedMode);
                }
            }
        }    
        e.ctx.restore();
    }
    drawKeyNote(e,keyindex, mode)
    {
        //need the time index which is the global uSecs or the midi file's
        //TODO: Maybe a better way to consolidate the midi file times and the global time
        var timeIndex = midiFileReader.timeIndex;
        if(mode == this.devicePlayedMode)
        {
            timeIndex = globals.timeIndex; 
        }
        for(var i = midiKeyboardDevice.midiChannels.length-1;i>=0; i--)
        {
            var channel = midiKeyboardDevice.midiChannels[i];
            if(channel.visible)
            {
                //midiKeyboardDevice.midiChannels.forEach(channel => {
                var key = channel.keyboard.keys[keyindex];
                var array = [];

                if(mode == this.songMode)
                    array = key.songNotes;
                else if(mode == this.songPlayedMode)
                    array = key.songPlayedNotes;//songNotes;
                else if(mode == this.devicePlayedMode)
                    array = key.devicePlayedNotes;
                
                array.forEach(note => 
                {
                    if(note.velocity)
                    {
                        //todo figure out why I have a tiny rectangle on the green target after a note passed through
                        var refkey = midiKeyboardDevice.refKeyboard.keys[key.keyIndex]; //grab the mergedkey positions which updates live
                        //draw the key's visible FOUNTAIN NOTE in the fountain if in view, 
                        var y1 = 0;
                        var y2 = 0;
                        if(mode === this.songMode)
                        {
                            //[y1, y2] = [y2, y1]; //swap
                            var y1 = (timeIndex - note.timeIndexStart)  * this.noteFountainDensity + targetNoteLine.region.y + targetNoteLine.region.h/2;
                            var y2 = (timeIndex - note.timeIndexEnd) * this.noteFountainDensity + targetNoteLine.region.y + targetNoteLine.region.h/2;
                            if(y1<0 || !(y1>0 && y2<this.region.h)) return; //not visible yet, exit forEach() function
                            y1 = Math.min(y1,targetNoteLine.region.y+targetNoteLine.region.h/2);
                            y2 = Math.min(y2,targetNoteLine.region.y+targetNoteLine.region.h/2);
                                //console.log("note")
                        }
                        else if((mode === this.songPlayedMode) || (mode === this.devicePlayedMode))
                        {
                            //TODO, figure out why I see more notes in this mode when using the same data as this.songMode. 
                            //[y1, y2] = [y2, y1]; //swap
                            var y1 = (note.timeIndexStart-timeIndex)  * this.noteFountainDensity + targetNoteLine.region.y + targetNoteLine.region.h/2;
                            var y2 =  y1+ (note.timeIndexEnd - note.timeIndexStart) * this.noteFountainDensity;
                            if(y1 == y2) y2 = targetNoteLine.region.y + targetNoteLine.region.h/2;
                            y2 = Math.min(y2,targetNoteLine.region.y + targetNoteLine.region.h/2);
                            if(y2<0 || y1>targetNoteLine.region.y + targetNoteLine.region.h/2) return; //not visible yet, exit forEach() function
                                //console.log("note")
                        }
                    
                        //key used to be used for the positions before using refkey for live drawing
                        var edgeColor = this.colorSpecs[channel.channelIndex][0];
                        var fillColor = this.colorSpecs[channel.channelIndex][1];
                        if(refkey.isSharp)
                        {
                            edgeColor = this.colorSpecs[channel.channelIndex][2];
                            fillColor = this.colorSpecs[channel.channelIndex][3];
                        }
                        var hw = refkey.region.w/2;
                        var cx = refkey.region.x + hw;

                        uiDraw.strokeLine(e.ctx,cx,y1,cx,y2,edgeColor,hw*1);
                        uiDraw.strokeLine(e.ctx,cx,y1,cx,y2,fillColor,hw*.6);
                        uiDraw.strokeLine(e.ctx,cx-hw*.6,y1,cx+hw*.6,y1,edgeColor,3);
                        uiDraw.strokeLine(e.ctx,cx-hw*.6,y2,cx+hw*.6,y2,edgeColor,3);
                    }
                });
            }
        }//});
    }
}

var noteFountain = new nfUINoteFountain()
noteFountain.setStyles(defaultTextStyle);
noteFountain.setStyles(defaultListPanelStyle);
noteFountain.setStyles({border:{alpha:0, resizable:false}})
noteFountain.setStyles({panel:{alpha:0, round:5, movable:false}})
//noteFountain.setText("Note Fountain");
noteFountain.setRegion({x:0,y:0,w:fountainRegion.region.w,h:fountainRegion.region.h});
noteFountain.setParent(fountainRegion)
