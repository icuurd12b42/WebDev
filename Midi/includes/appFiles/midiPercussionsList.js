///////////////////////////
//MIDI Percussions LIST UI

//these values whe set to start at 34. to end at 80... but the midi data I'm getting differs. 
//setting it from 0 to 
var midiPercussionsListArray = [
    {midiVoice:{id:-1, group:"Percussion"}},
    {midiVoice:{id:0, name:"Acoustic bass drum"}},
    {midiVoice:{id:1, name:"Bass drum 1"}},
    {midiVoice:{id:2, name:"Side stick"}},
    {midiVoice:{id:3, name:"Acoustic snare"}},
    {midiVoice:{id:4, name:"Hand clap"}},
    {midiVoice:{id:5, name:"Electric snare"}},
    {midiVoice:{id:6, name:"Low floor tom"}},
    {midiVoice:{id:7, name:"Closed hihat"}},
    {midiVoice:{id:8, name:"High floor tom"}},
    {midiVoice:{id:9, name:"Pedal hihat"}},
    {midiVoice:{id:10, name:"Low tom"}},
    {midiVoice:{id:11, name:"Open hihat"}},
    {midiVoice:{id:12, name:"Low-mid tom"}},
    {midiVoice:{id:13, name:"High-mid tom"}},
    {midiVoice:{id:14, name:"Crash cymbal 1"}},
    {midiVoice:{id:15, name:"High tom"}},
    {midiVoice:{id:16, name:"Ride cymbal 1"}},
    {midiVoice:{id:17, name:"Chinese cymbal"}},
    {midiVoice:{id:18, name:"Ride bell"}},
    {midiVoice:{id:19, name:"Tambourine"}},
    {midiVoice:{id:20, name:"Splash cymbal"}},
    {midiVoice:{id:21, name:"Cowbell"}},
    {midiVoice:{id:22, name:"Crash cymbal 2"}},
    {midiVoice:{id:23, name:"Vibraslap"}},
    {midiVoice:{id:24, name:"Ride cymbal 2"}},
    {midiVoice:{id:25, name:"High bongo"}},
    {midiVoice:{id:26, name:"Low bongo"}},
    {midiVoice:{id:27, name:"Mute high conga"}},
    {midiVoice:{id:28, name:"Open high conga"}},
    {midiVoice:{id:29, name:"Low conga"}},
    {midiVoice:{id:30, name:"High timbale"}},
    {midiVoice:{id:31, name:"Low timbale"}},
    {midiVoice:{id:32, name:"High agogo"}},
    {midiVoice:{id:33, name:"Low agogo"}},
    {midiVoice:{id:34, name:"Cabasa"}},
    {midiVoice:{id:35, name:"Maracas"}},
    {midiVoice:{id:36, name:"Short whistle"}},
    {midiVoice:{id:37, name:"Long whistle"}},
    {midiVoice:{id:38, name:"Short guiro"}},
    {midiVoice:{id:39, name:"Long guiro"}},
    {midiVoice:{id:40, name:"Claves"}},
    {midiVoice:{id:41, name:"High wood block"}},
    {midiVoice:{id:42, name:"Low wood block"}},
    {midiVoice:{id:43, name:"Mute cuica"}},
    {midiVoice:{id:44, name:"Open cuica"}},
    {midiVoice:{id:45, name:"Mute triangle"}},
    {midiVoice:{id:46, name:"Open triangle"}}

];

midiPercussionsListArray.forEach(item => { 
    item.itemSelected = false;
    item.itemHilighted = false;
    if(item.midiVoice.id == -1)
        item.itemText = item.midiVoice.group;
    else
        item.itemText = "    " + item.midiVoice.name;
});

function midiPercussionIndexToName(index)
{
    //because we need to skip over the groups entries. 
    //the desired item will be a few items further down the absolute list index

    for (var i = index;  i< midiPercussionsListArray.length; i++)
    {
        if(midiPercussionsListArray[i].midiVoice.id == index)
        {
            return midiPercussionsListArray[i].midiVoice.name;
        }
    }
    return midiPercussionsListArray[1].midiVoice.name;
}

var midiPercussionsPanel = new uiPanel()
midiPercussionsPanel.setStyles(defaultTextStyle);
midiPercussionsPanel.setStyles(defaultListPanelStyle);
midiPercussionsPanel.setText("Percussion Voices:");
midiPercussionsPanel.setRegion({x:618,y:160,w:300,h:366});

myBase.addChild(midiPercussionsPanel);

var midiPercussionsList = new uiListbox();
//midiPercussionsList.setRegion({x:8,y:24,w:300-16,h:366-24-8});
midiPercussionsList.setRegion({x:defaultTextStyle.text.hmargin,y:defaultTextStyle.text.vmargin*2,w:300-defaultTextStyle.text.hmargin*2,h:366-defaultTextStyle.text.vmargin*2-defaultTextStyle.text.hmargin});

midiPercussionsList.setCallbacks({onselected:midiPercussionsListOnSelected});
midiPercussionsList.setStyles({list:{toggleonoff:false,itemheight:20}});
midiPercussionsList.setStyles(defaultTextStyle);
midiPercussionsList.setStyles(defaultListColors);

midiPercussionsList.itemsArray = midiPercussionsListArray;
midiPercussionsPanel.addChild(midiPercussionsList);

function midiPercussionListScrollToIndex(voiceIndex)
{
    for(var i = 0; i <  midiPercussionsList.itemsArray.length; i++)
    {
        if(midiPercussionsList.itemsArray[i].midiVoice.id == voiceIndex)
        {
            midiPercussionsList.clearSelected();
            midiPercussionsList.scrollTo(i);
            midiPercussionsList.setSelected(i,true);
        }
    }
}
function midiPercussionsListOnSelected(e /*{ uiOldValue:, uiNewValue:this., uiSource:}*/) 
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
            if(midiChannelsList.selIndex===9) //only for the percussion channels
            {
                var midiChannel = midiChannelsList.itemsArray[midiChannelsList.selIndex].midiChannel;
                midiChannelsListAddUpdateItem({id:midiChannel.id, channelIndex:midiChannel.channelIndex, voiceIndex:e.uiSource.itemsArray[e.uiNewValue].midiVoice.id});
            }
            
        }
    }
    //uiDraw.Dirty("midiPercussionsListOnSelected");
}


//MIDI Percussions LIST UI
///////////////////////////