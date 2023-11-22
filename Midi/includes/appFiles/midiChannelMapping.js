


///////////////////////////
//MIDI CHANNEL MAPPING UI
var midiChannelMappingsPanel = newWindow(2,160,300,366,"Channels Mapping:"); // new uiPanel();
//midiChannelMappingsPanel.setStyles(defaultTextStyle);
//midiChannelMappingsPanel.setStyles(defaultListPanelStyle);
//midiChannelMappingsPanel.setText("Channels Mapping:");
//midiChannelMappingsPanel.setRegion({x:2,y:160,w:300,h:366});

myBase.addChild(midiChannelMappingsPanel);

var midiChannelMappingsList = new uiListbox();
//midiChannelMappingsList.setRegion({x:8,y:24,w:300-16,h:366-24-8});
midiChannelMappingsList.setRegion({x:defaultTextStyle.text.hmargin,y:defaultTextStyle.text.vmargin*2,w:300-defaultTextStyle.text.hmargin*2,h:366-defaultTextStyle.text.vmargin*2-defaultTextStyle.text.hmargin});

midiChannelMappingsList.setCallbacks({onselected:midiChannelMappingsOnSelected});
midiChannelMappingsList.setStyles({list:{toggleonoff:false,itemheight:20}});
midiChannelMappingsList.setStyles(defaultTextStyle);
midiChannelMappingsList.setStyles(defaultListColors);

midiChannelMappingsPanel.clientArea.addChild(midiChannelMappingsList);
midiChannelMappingsListFill();
function midiChannelMappingsListFill()
{
    //called to initially fill the channel mappings list with 16 default mapping: in 0 to out 10, 1 to 1, ... 15 to 15
    //add the a new channel mapping in the midiChannelMappingsList's itemsArray[]
    for(var i = 0; i<16; i++)
    {
         midiChannelMappingsListAddUpdateItem({id:uig.newID(), channelIn:i, channelOut:i, enabled:true});
    }
    midiChannelMappingsToShortList();
    //and setting the array to the ui list box
    //uiDraw.Dirty("midiChannelMappingsListFill");
}

function midiChannelMappingsListAddUpdateItem(midiChannelMapping)
{
    //called when an item in the midiChannelMappingsList needs adding or updating
    var item = midiChannelMappingsList.itemsArray.find(item => item.midiChannelMapping.id == midiChannelMapping.id );
    if(item)
    {
        item.itemText = midiChannelMappingToString(midiChannelMapping);
        item.midiChannelMapping = midiChannelMapping;
    }
    else
    {
        item = {};
        item.itemText = midiChannelMappingToString(midiChannelMapping);
        item.midiChannelMapping = midiChannelMapping;
        item.itemSelected = false;
        midiChannelMappingsList.itemsArray.push(item);
    }
   
}

function midiChannelEnabledToString(midiChannelEnabled)
{
    // formats 0 to 00, 1 to 01 and so on
    if(midiChannelEnabled) 
        return "enabled";
    else 
        return "disabled";
}
function midiChannelMappingToString(midiChannelMapping)
{
    //return the channel mapping in and out values, formated for display
    return "in: " + midiChannelNumberToString(midiChannelMapping.channelIn) + " => out: " +  midiChannelNumberToString(midiChannelMapping.channelOut) + "  (" + midiChannelEnabledToString(midiChannelMapping.enabled) +")";
}
function midiChannelMappingsToShortList()
{
    channelMappingsShortList = [];
    for(var i = 0; i< midiChannelMappingsList.itemsArray.length; i++)
    {
        if(midiChannelMappingsList.itemsArray[i].midiChannelMapping.enabled)
            channelMappingsShortList.push(i);
    }

        
}
function midiChannelMappingsOnSelected(e /*{uiOldValue, uiNewValue, uiSource}*/)
{
    //called when the user selects/deselects an item in the channel mapping list box
    if(e.uiOldValue !=-1)
    {
        ;
    }
    //toggle enabled on off the mapping
    if(e.uiNewValue !=-1)// && e.uiNewValue == e.uiOldValue)
    {
        var midiChannelMapping = e.uiSource.itemsArray[e.uiNewValue].midiChannelMapping;
        midiChannelMapping.enabled = !midiChannelMapping.enabled;
        midiChannelMappingsListAddUpdateItem(midiChannelMapping);
        //e.uiSource.itemsArray[e.uiNewValue].itemSelected = false;

        midiChannelMappingsToShortList();
    }
    else
    {
        //midiOutputPort = null;
    }
    //uiDraw.Dirty("midiChannelMappingsOnSelected");
}
//this is used to clear the hilighted items in the midiChannelMappingsList
var midiChannelMappingsListHilightsCountDown = 0;
function midiChannelMappingHilightsClear()
{
    midiChannelMappingsList.itemsArray.forEach(item=>{item.itemSelected = item.itemHilighted =false;});
    //uiDraw.Dirty("midiChannelMappingHilightClear");
}
//MIDI CHANNEL MAPPING UI
///////////////////////////
