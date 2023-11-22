///////////////////////////
//MIDI VOICES LIST UI

//the image for each instruments


uiRes.addImageFile("grandpiano","includes/appResources/Instruments/grandpiano.png?C="+Arrgh);
uiRes.addImageFile("accousticpiano","includes/appResources/Instruments/accousticpiano.png?C="+Arrgh);
uiRes.addImageFile("honkytonkpiano","includes/appResources/Instruments/honkytonkpiano.png?C="+Arrgh);
uiRes.addImageFile("electricgrandpiano","includes/appResources/Instruments/electricgrandpiano.png?C="+Arrgh);
uiRes.addImageFile("rhodespiano","includes/appResources/Instruments/rhodespiano.png?C="+Arrgh);
uiRes.addImageFile("harpsichord","includes/appResources/Instruments/harpsichord.png?C="+Arrgh);
uiRes.addImageFile("clavinet","includes/appResources/Instruments/clavinet.png?C="+Arrgh);

uiRes.addImageFile("glockenspiel","includes/appResources/Instruments/glockenspiel.png?C="+Arrgh);
uiRes.addImageFile("musicbox","includes/appResources/Instruments/musicbox.png?C="+Arrgh);
uiRes.addImageFile("vibraphone","includes/appResources/Instruments/vibraphone.png?C="+Arrgh);
uiRes.addImageFile("marimba","includes/appResources/Instruments/marimba.png?C="+Arrgh);
uiRes.addImageFile("xylophone","includes/appResources/Instruments/xylophone.png?C="+Arrgh);
uiRes.addImageFile("tubularbells","includes/appResources/Instruments/tubularbells.png?C="+Arrgh);
uiRes.addImageFile("dulcimer","includes/appResources/Instruments/dulcimer.png?C="+Arrgh);



uiRes.addImageFile("violin","includes/appResources/Instruments/violin.png?C="+Arrgh);


uiRes.addImageFile("celesta","includes/appResources/Instruments/celesta.png?C="+Arrgh);

//the midi instrument list
var midiVoicesListArray = [
{midiVoice:{id:-1, group: "Piano <e>img:1:grandpiano<e>"}},
{midiVoice:{id:0, group: "Piano" , name: "Acoustic Grand Piano <e>img:1:grandpiano<e>"}},
{midiVoice:{id:1, group: "Piano" , name: "Bright Acoustic Piano <e>img:1:accousticpiano<e>"}},
{midiVoice:{id:2, group: "Piano" , name: "Electric Grand Piano <e>img:1:electricgrandpiano<e>"}},
{midiVoice:{id:3, group: "Piano" , name: "Honky-tonk Piano <e>img:1:honkytonkpiano<e>"}},
{midiVoice:{id:4, group: "Piano" , name: "Rhodes Piano <e>img:1:rhodespiano<e>"}},
{midiVoice:{id:5, group: "Piano" , name: "Chorused Piano"}},
{midiVoice:{id:6, group: "Piano" , name: "Harpsichord <e>img:1:harpsichord<e>"}},
{midiVoice:{id:7, group: "Piano" , name: "Clavinet <e>img:1:clavinet<e>"}},
{midiVoice:{id:-1, group: "Chromatic Percussion"}},
{midiVoice:{id:8, group: "Chromatic Percussion" , name: "Celesta<e>img:1:celesta<e>"}},
{midiVoice:{id:9, group: "Chromatic Percussion" , name: "Glockenspiel<e>img:1:glockenspiel<e>"}},
{midiVoice:{id:10, group: "Chromatic Percussion" , name: "Music box<e>img:1:musicbox<e>"}},
{midiVoice:{id:11, group: "Chromatic Percussion" , name: "Vibraphone<e>img:1:vibraphone<e>"}},
{midiVoice:{id:12, group: "Chromatic Percussion" , name: "Marimba<e>img:1:marimba<e>"}},
{midiVoice:{id:13, group: "Chromatic Percussion" , name: "Xylophone<e>img:1:xylophone<e>"}},
{midiVoice:{id:14, group: "Chromatic Percussion" , name: "Tubular Bells<e>img:1:tubularbells<e>"}},
{midiVoice:{id:15, group: "Chromatic Percussion" , name: "Dulcimer<e>img:1:dulcimer<e>"}},
{midiVoice:{id:-1, group: "Organ"}},
{midiVoice:{id:16, group: "Organ" , name: "Hammond Organ"}},
{midiVoice:{id:17, group: "Organ" , name: "Percussive Organ"}},
{midiVoice:{id:18, group: "Organ" , name: "Rock Organ"}},
{midiVoice:{id:19, group: "Organ" , name: "Church Organ"}},
{midiVoice:{id:20, group: "Organ" , name: "Reed Organ"}},
{midiVoice:{id:21, group: "Organ" , name: "Accordion"}},
{midiVoice:{id:22, group: "Organ" , name: "Harmonica"}},
{midiVoice:{id:23, group: "Organ" , name: "Tango Accordion"}},
{midiVoice:{id:-1, group: "Guitar"}},
{midiVoice:{id:24, group: "Guitar" , name: "Acoustic Guitar (nylon)"}},
{midiVoice:{id:25, group: "Guitar" , name: "Acoustic Guitar (steel)"}},
{midiVoice:{id:26, group: "Guitar" , name: "Electric Guitar (jazz)"}},
{midiVoice:{id:27, group: "Guitar" , name: "Electric Guitar (clean)"}},
{midiVoice:{id:28, group: "Guitar" , name: "Electric Guitar (muted)"}},
{midiVoice:{id:29, group: "Guitar" , name: "Overdriven Guitar"}},
{midiVoice:{id:30, group: "Guitar" , name: "Distortion Guitar"}},
{midiVoice:{id:31, group: "Guitar" , name: "Guitar Harmonics"}},
{midiVoice:{id:-1, group: "Bass"}},
{midiVoice:{id:32, group: "Bass" , name: "Acoustic Bass"}},
{midiVoice:{id:33, group: "Bass" , name: "Electric Bass (finger)"}},
{midiVoice:{id:34, group: "Bass" , name: "Electric Bass (pick)"}},
{midiVoice:{id:35, group: "Bass" , name: "Fretless Bass"}},
{midiVoice:{id:36, group: "Bass" , name: "Slap Bass 1"}},
{midiVoice:{id:37, group: "Bass" , name: "Slap Bass 2"}},
{midiVoice:{id:38, group: "Bass" , name: "Synth Bass 1"}},
{midiVoice:{id:39, group: "Bass" , name: "Synth Bass 2"}},
{midiVoice:{id:-1, group: "Strings"}},
{midiVoice:{id:40, group: "Strings" , name: "Violin<e>img:1:violin<e>"}},
{midiVoice:{id:41, group: "Strings" , name: "Viola<e>img:1:violin<e>"}},
{midiVoice:{id:42, group: "Strings" , name: "Cello"}},
{midiVoice:{id:43, group: "Strings" , name: "Contrabass"}},
{midiVoice:{id:44, group: "Strings" , name: "Tremolo Strings"}},
{midiVoice:{id:45, group: "Strings" , name: "Pizzicato Strings"}},
{midiVoice:{id:46, group: "Strings" , name: "Orchestral Harp"}},
{midiVoice:{id:47, group: "Strings" , name: "Timpani"}},
{midiVoice:{id:-1, group: "Ensemble" , name: ""}},
{midiVoice:{id:48, group: "Ensemble" , name: "String Ensemble 1"}},
{midiVoice:{id:49, group: "Ensemble" , name: "String Ensemble 2"}},
{midiVoice:{id:50, group: "Ensemble" , name: "Synth Strings 1"}},
{midiVoice:{id:51, group: "Ensemble" , name: "Synth Strings 2"}},
{midiVoice:{id:52, group: "Ensemble" , name: "Choir Aahs"}},
{midiVoice:{id:53, group: "Ensemble" , name: "Voice Oohs"}},
{midiVoice:{id:54, group: "Ensemble" , name: "Synth Voice"}},
{midiVoice:{id:55, group: "Ensemble" , name: "Orchestra Hit"}},
{midiVoice:{id:-1, group: "Brass"}},
{midiVoice:{id:56, group: "Brass" , name: "Trumpet"}},
{midiVoice:{id:57, group: "Brass" , name: "Trombone"}},
{midiVoice:{id:58, group: "Brass" , name: "Tuba"}},
{midiVoice:{id:59, group: "Brass" , name: "Muted Trumpet"}},
{midiVoice:{id:60, group: "Brass" , name: "French Horn"}},
{midiVoice:{id:61, group: "Brass" , name: "Brass Section"}},
{midiVoice:{id:62, group: "Brass" , name: "Synth Brass 1"}},
{midiVoice:{id:63, group: "Brass" , name: "Synth Brass 2"}},
{midiVoice:{id:-1, group: "Reed"}},
{midiVoice:{id:64, group: "Reed" , name: "Soprano Sax"}},
{midiVoice:{id:65, group: "Reed" , name: "Alto Sax"}},
{midiVoice:{id:66, group: "Reed" , name: "Tenor Sax"}},
{midiVoice:{id:67, group: "Reed" , name: "Baritone Sax"}},
{midiVoice:{id:68, group: "Reed" , name: "Oboe"}},
{midiVoice:{id:69, group: "Reed" , name: "English Horn"}},
{midiVoice:{id:70, group: "Reed" , name: "Bassoon"}},
{midiVoice:{id:71, group: "Reed" , name: "Clarinet"}},
{midiVoice:{id:-1, group: "Pipe"}},
{midiVoice:{id:72, group: "Pipe" , name: "Piccolo"}},
{midiVoice:{id:73, group: "Pipe" , name: "Flute"}},
{midiVoice:{id:74, group: "Pipe" , name: "Recorder"}},
{midiVoice:{id:75, group: "Pipe" , name: "Pan Flute"}},
{midiVoice:{id:76, group: "Pipe" , name: "Bottle Blow"}},
{midiVoice:{id:77, group: "Pipe" , name: "Shakuhachi"}},
{midiVoice:{id:78, group: "Pipe" , name: "Whistle"}},
{midiVoice:{id:79, group: "Pipe" , name: "Ocarina"}},
{midiVoice:{id:-1, group: "Synth Lead"}},
{midiVoice:{id:80, group: "Synth Lead" , name: "Lead 1 (square)"}},
{midiVoice:{id:81, group: "Synth Lead" , name: "Lead 2 (sawtooth)"}},
{midiVoice:{id:82, group: "Synth Lead" , name: "Lead 3 (calliope lead)"}},
{midiVoice:{id:83, group: "Synth Lead" , name: "Lead 4 (chiffer lead)"}},
{midiVoice:{id:84, group: "Synth Lead" , name: "Lead 5 (charang)"}},
{midiVoice:{id:85, group: "Synth Lead" , name: "Lead 6 (voice)"}},
{midiVoice:{id:86, group: "Synth Lead" , name: "Lead 7 (fifths)"}},
{midiVoice:{id:87, group: "Synth Lead" , name: "Lead 8 (brass + lead)"}},
{midiVoice:{id:-1, group: "Synth Pad"}},
{midiVoice:{id:88, group: "Synth Pad" , name: "Pad 1 (new age)"}},
{midiVoice:{id:89, group: "Synth Pad" , name: "Pad 2 (warm)"}},
{midiVoice:{id:90, group: "Synth Pad" , name: "Pad 3 (polysynth)"}},
{midiVoice:{id:91, group: "Synth Pad" , name: "Pad 4 (choir)"}},
{midiVoice:{id:92, group: "Synth Pad" , name: "Pad 5 (bowed)"}},
{midiVoice:{id:93, group: "Synth Pad" , name: "Pad 6 (metallic)"}},
{midiVoice:{id:94, group: "Synth Pad" , name: "Pad 7 (halo)"}},
{midiVoice:{id:95, group: "Synth Pad" , name: "Pad 8 (sweep)"}},
{midiVoice:{id:-1, group: "Synth Effects"}},
{midiVoice:{id:96, group: "Synth Effects" , name: "FX 1 (rain)"}},
{midiVoice:{id:97, group: "Synth Effects" , name: "FX 2 (soundtrack)"}},
{midiVoice:{id:98, group: "Synth Effects" , name: "FX 3 (crystal)"}},
{midiVoice:{id:99, group: "Synth Effects" , name: "FX 4 (atmosphere)"}},
{midiVoice:{id:100, group: "Synth Effects" , name: "FX 5 (brightness)"}},
{midiVoice:{id:101, group: "Synth Effects" , name: "FX 6 (goblins)"}},
{midiVoice:{id:102, group: "Synth Effects" , name: "FX 7 (echoes)"}},
{midiVoice:{id:103, group: "Synth Effects" , name: "FX 8 (sci-fi)"}},
{midiVoice:{id:-1, group: "Ethnic"}},
{midiVoice:{id:104, group: "Ethnic" , name: "Sitar"}},
{midiVoice:{id:105, group: "Ethnic" , name: "Banjo"}},
{midiVoice:{id:106, group: "Ethnic" , name: "Shamisen"}},
{midiVoice:{id:107, group: "Ethnic" , name: "Koto"}},
{midiVoice:{id:108, group: "Ethnic" , name: "Kalimba"}},
{midiVoice:{id:109, group: "Ethnic" , name: "Bagpipe"}},
{midiVoice:{id:110, group: "Ethnic" , name: "Fiddle"}},
{midiVoice:{id:111, group: "Ethnic" , name: "Shana"}},
{midiVoice:{id:-1, group: "Percussive"}},
{midiVoice:{id:112, group: "Percussive" , name: "Tinkle Bell"}},
{midiVoice:{id:113, group: "Percussive" , name: "Agogo"}},
{midiVoice:{id:114, group: "Percussive" , name: "Steel Drums"}},
{midiVoice:{id:115, group: "Percussive" , name: "Woodblock"}},
{midiVoice:{id:116, group: "Percussive" , name: "Taiko Drum"}},
{midiVoice:{id:117, group: "Percussive" , name: "Melodic Tom"}},
{midiVoice:{id:118, group: "Percussive" , name: "Synth Drum"}},
{midiVoice:{id:119, group: "Percussive" , name: "Reverse Cymbal"}},
{midiVoice:{id:-1, group: "Sound Effects"}},
{midiVoice:{id:120, group: "Sound Effects" , name: "Guitar Fret Noise"}},
{midiVoice:{id:121, group: "Sound Effects" , name: "Breath Noise"}},
{midiVoice:{id:122, group: "Sound Effects" , name: "Seashore"}},
{midiVoice:{id:123, group: "Sound Effects" , name: "Bird Tweet"}},
{midiVoice:{id:124, group: "Sound Effects" , name: "Telephone Ring"}},
{midiVoice:{id:125, group: "Sound Effects" , name: "Helicopter"}},
{midiVoice:{id:126, group: "Sound Effects" , name: "Applause"}},
{midiVoice:{id:127, group: "Sound Effects" , name: "Gunshot"}}];

midiVoicesListArray.forEach(item => { 
    item.itemSelected = false;
    item.itemHilighted = false;
    if(item.midiVoice.id == -1)
        item.itemText = item.midiVoice.group;
    else
        item.itemText = "    " + item.midiVoice.name;
});
function midiVoiceIndexToName(index)
{
    //because we need to skip over the groups entries. 
    //the desired item will be a few items further down the absolute list index

    for (var i = index;  i< midiVoicesListArray.length; i++)
    {
        if(midiVoicesListArray[i].midiVoice.id == index)
        {
            return midiVoicesListArray[i].midiVoice.name;
        }
    }
    return "undefined";
}

var midiVoicesPanel = newWindow(618,160,300,366,"Instrument Voices:");// new uiPanel();
//midiVoicesPanel.setStyles(defaultTextStyle);
//midiVoicesPanel.setStyles(defaultListPanelStyle);
//midiVoicesPanel.setText("Instrument Voices:");
//midiVoicesPanel.setRegion({x:618,y:160,w:300,h:366});

myBase.addChild(midiVoicesPanel);

var midiVoicesList = new uiListbox();
//midiVoicesList.setRegion({x:8,y:24,w:300-16,h:366-24-8});
midiVoicesList.setRegion({x:defaultTextStyle.text.hmargin,y:defaultTextStyle.text.vmargin*2,w:300-defaultTextStyle.text.hmargin*2,h:366-defaultTextStyle.text.vmargin*2-defaultTextStyle.text.hmargin});
midiVoicesList.setCallbacks({onselected:midiVoicesListOnSelected});
midiVoicesList.setStyles({list:{toggleonoff:false,itemheight:20}});
midiVoicesList.setStyles(defaultTextStyle);
midiVoicesList.setStyles(defaultListColors);

midiVoicesList.itemsArray = midiVoicesListArray;
midiVoicesPanel.clientArea.addChild(midiVoicesList);

function midiVoiceListScrollToIndex(voiceIndex)
{
    for(var i = 0; i <  midiVoicesList.itemsArray.length; i++)
    {
        if(midiVoicesList.itemsArray[i].midiVoice.id == voiceIndex)
        {
            midiVoicesList.clearSelected();
            midiVoicesList.scrollTo(i);
            midiVoicesList.setSelected(i,true);
        }
    }
}
function midiVoicesListOnSelected(e /*{ uiOldValue:, uiNewValue:this., uiSource:}*/) 
{
    if(e.uiNewValue!=-1)
    {
        if(e.uiSource.itemsArray[e.uiNewValue].midiVoice.id == -1)
        {
            e.uiSource.clearSelected();
            e.uiSource.scrollTo(e.uiNewValue);
            e.uiSource.setSelected(e.uiNewValue+1,true);
        }
        else
        {
            if(midiChannelsList.selIndex!==-1)
            {
                var midiChannel = midiChannelsList.itemsArray[midiChannelsList.selIndex].midiChannel;
                midiChannelsListAddUpdateItem({id:midiChannel.id, channelIndex:midiChannel.channelIndex, voiceIndex:e.uiSource.itemsArray[e.uiNewValue].midiVoice.id});


                for (var i = 0; i< midiOutputsPanel.listPanel.children.length; i++)
                {
                    var midiPort = midiOutputsPanel.listPanel.children[i].portOpened.midiPort;
                    if(midiPort.connection == "open")
                    {
                        setChannelVoice(midiPort, midiChannel.channelIndex, e.uiSource.itemsArray[e.uiNewValue].midiVoice.id)
                    }
                
                }
                
            }
            
           
        }
    }
    //uiDraw.Dirty("midiVoicesListOnSelected");
}


//MIDI VOICES LIST UI
///////////////////////////