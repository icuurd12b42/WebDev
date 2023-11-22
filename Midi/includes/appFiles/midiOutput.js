///////////////////////////
//MIDI OUTPUT UI

//here
var midiOutputsPanel = newWindow(310,2,300,150,"Output Ports:")
midiOutputsPanel.setParent(myBase);
midiOutputsPanel.listPanel=newListBox(midiOutputsPanel.clientArea);








function midiOutputsListFill()
{
    //called when the midi system has initialised
    //add the devices in the midiOutputsList's itemsArray[]
    midiAccess.outputs.forEach(midiPort => {
        midiOutputsListAddUpdateItem(midiPort);
    });
    //and setting the array to the ui list box
    //uiDraw.Dirty("midiOutputsListFill");
}
function midiOutputToString(midiPort)
{
    //return the port (midiInout/midiOutput) formated text, indicating it's name and states.
    var txt = "";
    if (midiPort.manufacturer.length) txt += midiPort.manufacturer +": "
    txt+=midiPort.name;
    return txt + " " + midiPort.state + " " + midiPort.connection;
}



function midiOutputsListAddUpdateItem(midiPort)
{

    //called when an item in the midi inputs list needs adding or updating

    var uiItem;
    //if item exists, it's been linked to a children[] array index value
    if(midiPort.uiChildIndex!==undefined)
    {
        //get the ui from the list
        uiItem = midiOutputsPanel.listPanel.children[midiPort.uiChildIndex];
    }
    else
    {
        //add and link ui to the list and to the port
        //uiItem = new uiDebugPanel(); 
        //uiItem = newWindow(0,0,1,1,""); 
        uiItem = newMidiOutputUI(0,0);
        uiItem.uiChildIndex = midiPort.uiChildIndex = midiOutputsPanel.listPanel.children.length;
        uiItem.portOpened.midiPort=midiPort;
        uiItem.portOpened.setCallbacks({onmouse:onOutputPortOpenedMouse})
        //uiItem.setRegion({x:0,y:0,w:100,h:100});
        
        midiOutputsPanel.listPanel.addChild(uiItem);
    }
    uiItem.portName.styles.text = midiOutputToString(midiPort);
    uiItem.usbConnection.styles.index = 0;
    if(midiPort.state === "connected")
    {
        uiItem.usbConnection.styles.index = 1;
    }
    uiItem.portOpened.styles.index = 0;
    if(midiPort.connection === "open")
    {
        uiItem.portOpened.styles.index = 1;
    }
    
}
function midiOutputsListRefreshStates()
{
    
    //called when the state of any of the port devices changes
    
    for (var i = 0; i< midiOutputsPanel.listPanel.children.length; i++)
    {
        var item = midiOutputsPanel.listPanel.children[i];
        //I hate doing this. it made more sense with the other framework
        //call the add update item
        midiOutputsListAddUpdateItem(item.portOpened.midiPort);
    
    }
    
    //});
}
function onOutputPortOpenedMouse(e)
{
    if(uiMouse.isInside(e.uiSource))
    {
        
        if(uiMouse.isInside(e.uiSource))
        {
            if(e.type == "mouseup" && uiMouse.dist<4)
            {
                if(e.uiSource.midiPort.connection == "closed")
                {
                    e.uiSource.midiPort.open(); //the above line opened the port anyway... rude head scratcher nightmare
                    midiOutputPort = e.uiSource.midiPort;
                }
                else
                {
                    e.uiSource.midiPort.close();
                }
                e.uiCancel = true;
            }
        } 
    }
}
function newMidiOutputUI(x,y)
{
    var frame =new uiInertFramePanel();
    frame.setRegion({x:x,y:y,w:200,h:75});
    frame.setStyles(
    {
        color:"gadgetColor",
        corners:[8,8,8,8],
    });



    frame.portNameClip = new uiAlignedClippingRegion();
        frame.portNameClip.setParent(frame);
        frame.portNameClip.setRegion({x:0,y:0,w:10,h:10});
        frame.portNameClip.setStyles(
        {
            corners:[4,4,4,4],
            parentAlign:{x1:8,y1:8,x2:-32,y2:32+8}

        });
        
    
    frame.portName = new uiAlignedLabel();   
        frame.portName.setParent(frame.portNameClip);
        frame.portName.setRegion({x:0,y:0,w:1,h:1});
        frame.portName.setStyles(
        {
            text:"Item", 
            font:"default", color:"gadgetTextColor", alpha:1, 
            halign:"left", valign:"middle",
            parentAlign:{x1:0,y1:0,x2:0,y2:0}
        });

    frame.usbConnection = new uiAlignedPicture();  
    //frame.usbConnection.debug = true;   
        frame.usbConnection.setParent(frame);
        frame.usbConnection.setRegion({x:0,y:0,w:1,h:1});
        frame.usbConnection.setStyles(
        {
            index:0, //what image to display
            images:["usb_disconnected","usb_connected"], //named uiResource images
            parentAlign:{x1:-32+8,y1:8+32/2-16/2,x2:-8,y2:8+32/2-16/2+16},
            alpha:1
        });
    frame.portOpened = new uiAlignedPicture();
    //frame.portOpenend.debug = true;   
        frame.portOpened.setParent(frame);
        frame.portOpened.setRegion({x:0,y:0,w:1,h:1});
        frame.portOpened.setStyles(
        {
            index:0, //what image to display
            images:["toggle_off","toggle_on"], //named uiResource images
            parentAlign:{x1:-40-8,y1:32+8,x2:-8,y2:32+8+22},
            alpha:1
        });       
    return frame;
}






function setChannelVoice(midiPort, channel, voice)
{
    try{
        if(midiPort.connection == "open")
        {
            var midiMessage = new Uint8Array(2);
            midiMessage[0] = (midiMsgProgramChange << 4) + (Math.max(0,Math.min(15,channel)));
            midiMessage[1] = Math.max(0,Math.min(127,voice));
            midiPort.send(midiMessage, 0);
        }
    }
    catch{;}
    
    

}


//MIDI OUTPUT UI
///////////////////////////