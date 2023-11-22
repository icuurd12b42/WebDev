


///////////////////////////
//MIDI CHANNELS UI
var midiChannelsPanel = newWindow(310,160,300,366,"Channels Voice:")//new uiPanel()
//midiChannelsPanel.setStyles(defaultTextStyle);
//midiChannelsPanel.setStyles(defaultListPanelStyle);
//midiChannelsPanel.setText("Channels Voice:");
//midiChannelsPanel.setRegion({x:310,y:160,w:300,h:366});

myBase.addChild(midiChannelsPanel);

midiChannelsPanel.listPanel=newListBox(midiChannelsPanel.clientArea);

for (var i = 0; i<16; i++)
{
    var item = newChannelItem(i);
    midiChannelsPanel.listPanel.addChild(item);
    item.channelIndex = i;
    item.fountainVisible.channelIndex = i;
    item.fountainVisible.styles.index = (midiKeyboardDevice.midiChannels[i].visible * 1);
    item.fountainVisible.setCallbacks({onmouse:onToggleInvisibleChannel});
    item.audible.channelIndex = i;
    item.audible.styles.index = (midiKeyboardDevice.midiChannels[i].audible * 1);
    item.audible.setCallbacks({onmouse:onToggleMutedChannel})
}
function onToggleInvisibleChannel(e)
{
    if(uiMouse.isInside(e.uiSource))
    {
        if(e.type == "mouseup" && uiMouse.dist<4)
        {
            midiKeyboardDevice.midiChannels[e.uiSource.channelIndex].visible = !midiKeyboardDevice.midiChannels[e.uiSource.channelIndex].visible;
            e.uiSource.styles.index = (midiKeyboardDevice.midiChannels[e.uiSource.channelIndex].visible * 1);

            e.uiCancel = true;
        }

    } 
}
function onToggleMutedChannel(e)
{
    if(uiMouse.isInside(e.uiSource))
    {
        if(e.type == "mouseup" && uiMouse.dist<4)
        {
            midiKeyboardDevice.midiChannels[e.uiSource.channelIndex].audible = !midiKeyboardDevice.midiChannels[e.uiSource.channelIndex].audible;
            e.uiSource.styles.index = ( midiKeyboardDevice.midiChannels[e.uiSource.channelIndex].audible * 1);
            e.uiCancel = true;
        }

    } 
}
function newChannelItem(i)
{

    var frame =new uiInertFramePanel();
    frame.setRegion({x:0,y:0,w:200,h:75});
    frame.setStyles(
    {
        color:"gadgetColor",
        corners:[8,8,8,8],
    });



    frame.channelNameClip = new uiAlignedClippingRegion();
        frame.channelNameClip.setParent(frame);
        frame.channelNameClip.setRegion({x:0,y:0,w:10,h:10});
        //frame.channelNameClip.debug = true;
        frame.channelNameClip.setStyles(
        {
            corners:[4,4,4,4],
            parentAlign:{x1:8,y1:8,x2:32,y2:32+8}

        });
        
    
    frame.channelName = new uiAlignedLabel();   
        frame.channelName.setParent(frame.channelNameClip);
        frame.channelName.setRegion({x:0,y:0,w:1,h:1});
        //frame.channelName.debug = true;
        frame.channelName.setStyles(
        {
            text:midiChannelNumberToString(i), 
            font:"default", color:"gadgetTextColor", alpha:1, 
            halign:"left", valign:"middle",
            parentAlign:{x1:0,y1:0,x2:0,y2:0}
        });

    frame.voiceNameClip = new uiAlignedClippingRegion();
        frame.voiceNameClip.setParent(frame);
        frame.voiceNameClip.setRegion({x:0,y:0,w:10,h:10});
        //frame.voiceNameClip.debug = true;
        frame.voiceNameClip.setStyles(
        {
            corners:[4,4,4,4],
            parentAlign:{x1:32,y1:8,x2:-40-8,y2:8+32}

        });
        
    
    frame.voiceName = new uiAlignedLabel();   
        frame.voiceName.setParent(frame.voiceNameClip);
        frame.voiceName.setRegion({x:0,y:0,w:1,h:1});
        frame.voiceName.setStyles(
        {
            text:"Voice Name Here", 
            font:"default", color:"gadgetTextColor", alpha:1, 
            halign:"left", valign:"middle",
            parentAlign:{x1:0,y1:0,x2:0,y2:0}
        });

    frame.fountainVisible = new uiAlignedPicture();  
    //frame.usbConnection.debug = true;   
        frame.fountainVisible.setParent(frame);
        frame.fountainVisible.setRegion({x:0,y:0,w:1,h:1});
        //frame.fountainVisible.debug = true;
        frame.fountainVisible.setStyles(
        {
            index:1, //what image to display
            images:["hide","show"], //named uiResource images
            parentAlign:{x1:-32-8,y1:8,x2:-8,y2:8+32},
            alpha:1
        });
    frame.audible = new uiAlignedPicture();
    //frame.portOpenend.debug = true;   
        frame.audible.setParent(frame);
        frame.audible.setRegion({x:0,y:0,w:1,h:1});
        frame.audible.setStyles(
        {
            index:1, //what image to display
            images:["mute","unmute"], //named uiResource images
            parentAlign:{x1:-32-8,y1:32+8,x2:-8,y2:8+32+32},
            alpha:1
        }); 
        
    frame.sliderBack = new uiAlignedClippingRegion();
        frame.sliderBack.setParent(frame);
        frame.sliderBack.setRegion({x:0,y:0,w:10,h:10});
        //frame.sliderBack.debug = true;
        frame.sliderBack.setStyles(
        {
            corners:[4,4,4,4],
            parentAlign:{x1:32,y1:8+32,x2:-40-8,y2:8+32+32}

        });

    frame.volumeSlider =  new uiAlignedHSlider();
        frame.volumeSlider.setParent(frame.sliderBack);
        frame.volumeSlider.setRegion({x:0,y:0,w:1,h:1});
        //frame.volumeSlider.debug = true;
        frame.volumeSlider.setStyles(
        {
            value:0,
            //color:"gadgetColor",
            //frameLightColor:"gadgetBorderframeLightColor",
            //frameDarkColor:"gadgetBorderDarkColor",
            //corners:[0,0,0,0],
            parentAlign:{x1:0,y1:8,x2:0,y2:-8}
        });
        //frame.volumeSlider.setCallbacks({onchange:onListScrollPosChange});
    return frame;
}
/*
var midiChannelsList = new uiListbox();
//midiChannelsList.setRegion({x:8,y:24,w:300-16,h:366-24-8});
midiChannelsList.setRegion({x:0,y:0,w:300-defaultTextStyle.text.hmargin*2,h:366-defaultTextStyle.text.vmargin*2-defaultTextStyle.text.hmargin});

midiChannelsList.setCallbacks({onselected:midiChannelsOnSelected, onpostdrawitem:onPostDrawChannelItem});
midiChannelsList.setStyles({list:{toggleonoff:false,itemheight:20}});
midiChannelsList.setStyles(defaultTextStyle);
midiChannelsList.setStyles(defaultListColors);

midiChannelsPanel.clientArea.addChild(midiChannelsList);
midiChannelsListFill();
function midiChannelsListFill()
{
    //called to initially fill the channel list with 16 channels: in 0 to out 10, 1 to 1, ... 15 to 15
    //add the a new channel mapping in the midiChannelsList's itemsArray[]
    for(var i = 0; i<16; i++)
    {
        if(i!=9)
        midiChannelsListAddUpdateItem({channelIndex:i, voiceIndex:i*8});
        else
        midiChannelsListAddUpdateItem({channelIndex:i, voiceIndex:0});
    }
}
function midiChannelToListItemString(midiChannel)
{
    if(midiChannel.channelIndex!=9)
        return midiChannelNumberToString(midiChannel.channelIndex) + " - " + midiVoiceIndexToName(midiChannel.voiceIndex);
    else
        return midiChannelNumberToString(midiChannel.channelIndex) + " - " + midiPercussionIndexToName(midiChannel.voiceIndex);
}
function onPostDrawChannelItem(e)
{
    //e={drawData:event data of the draw event, listItem:the array item, itemRegion:{x:x, y:y,w:w,h:h}}
    var ctx = e.drawData.ctx;
    var r = e.itemRegion;
    var midiChannel = e.listItem.midiChannel;

    if(midiChannel.maxVelocity!==undefined)
        uiDraw.strokeLine(ctx,r.x+r.w,r.y+r.h/2,r.x+r.w - 50* midiChannel.maxVelocity,r.y+r.h/2,"blue",3);

}
function midiChannelsListAddUpdateItem(midiChannel)
{
    //called when an item in the midiChannelsList needs adding or updating
    //var item = midiChannelsList.itemsArray.find(item => item.midiChannel.id == midiChannel.id );
    //in this version of a list lookup, we use the array index to match the chnnel index. no .id search in this case
    //so if we ha 16 channelse we created all we will need and now we can directly update them without a search
    
    var item;
    if(midiChannelsList.itemsArray.length === 16)
    {
        item = midiChannelsList.itemsArray[midiChannel.channelIndex];
        item.itemText = midiChannelToListItemString(midiChannel);
        item.midiChannel = midiChannel;
        item.maxVelocity = 0;
    }
    else
    {
        //still creating list
        item = {};
        item.itemText = midiChannelToListItemString(midiChannel);
        item.midiChannel = midiChannel;
        item.itemSelected = false;
        item.maxVelocity = 0;
        midiChannelsList.itemsArray.push(item);
    }
    //if(midiChannel.channelIndex ===9)
    //{
    //    item.midiChannel.voiceIndex = Math.max(item.midiChannel.voiceIndex,34, Math.min(item.midiChannel.voiceIndex,80));
    //}
}


function midiChannelsOnSelected(e)
{
    //called when the user selects/deselects an item in the channel list box
    if(e.uiOldValue !=-1)
    {
        ;
    }
    //
    if(e.uiNewValue !=-1)// && e.uiNewValue == e.uiOldValue)
    {
         var midiChannel = e.uiSource.itemsArray[e.uiNewValue].midiChannel;
        if (midiChannel.channelIndex!=9)
        {
            midiPercussionsPanel.visible = midiPercussionsPanel.enabled =false;
            midiVoicesPanel.visible = midiVoicesPanel.enabled  = true;
            midiVoiceListScrollToIndex(midiChannel.voiceIndex);
        }
        else
        {
            midiVoicesPanel.visible = midiVoicesPanel.enabled  = false;
            midiPercussionsPanel.visible = midiPercussionsPanel.enabled  = true;
            midiPercussionListScrollToIndex(midiChannel.voiceIndex);
        }
        

        
    }
    else
    {
        //midiOutputPort = null;
    }
    //uiDraw.Dirty("midiChannelMappingsOnSelected");
}
//this is used to clear the hilighted items in the midiChannels List
var midiChannelsListHilightsCountDown = 0;
function midiChannelHilightsClear()
{
    midiChannelsList.itemsArray.forEach(item=>{item.itemSelected = item.itemHilighted =false;});
    //uiDraw.Dirty("midiChannelMappingHilightClear");
}
//MIDI CHANNELs UI
///////////////////////////

*/