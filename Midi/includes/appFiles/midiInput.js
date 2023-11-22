///////////////////////////callback
//MIDI INPUT UI

var midiInputsPanel = newWindow(2,2,300,150,"Input Ports:")
midiInputsPanel.setParent(myBase);
midiInputsPanel.listPanel=newListBox(midiInputsPanel.clientArea);







const midiInputMessageCallback = [];

function midiInputAddMessageCallback(fn = function(){})
{
    midiInputMessageCallback.push(fn);
}

function midiInputsListFill()
{
    //called when the midi system has initialised
    //add the devices in the midiInputsList's itemsArray[]
    midiAccess.inputs.forEach(midiPort => {
        midiInputsListAddUpdateItem(midiPort);
    });
    //and setting the array to the ui list box
    //uiDraw.Dirty("midiInputsListFill");
}
function midiInputToString(midiPort)
{
    //return the port (midiInout/midiOutput) formated text, indicating it's name and states.
    var txt = "";
    if (midiPort.manufacturer.length) txt += midiPort.manufacturer +": "
    txt+=midiPort.name;
    return txt + " " + midiPort.state + " " + midiPort.connection;
}



function midiInputsListAddUpdateItem(midiPort)
{

    //called when an item in the midi inputs list needs adding or updating

    var uiItem;
    //if item exists, it's been linked to a children[] array index value
    if(midiPort.uiChildIndex!==undefined)
    {
        //get the ui from the list
        uiItem = midiInputsPanel.listPanel.children[midiPort.uiChildIndex];
    }
    else
    {
        //add and link ui to the list and to the port
        //uiItem = new uiDebugPanel(); 
        //uiItem = newWindow(0,0,1,1,""); 
        uiItem = newMidiInputUI(0,0);
        uiItem.uiChildIndex = midiPort.uiChildIndex = midiInputsPanel.listPanel.children.length;
        uiItem.portOpened.midiPort=midiPort;
        uiItem.portOpened.setCallbacks({onmouse:onInputPortOpenedMouse})
        //uiItem.setRegion({x:0,y:0,w:100,h:100});
        
        midiInputsPanel.listPanel.addChild(uiItem);
    }
    uiItem.portName.styles.text = midiInputToString(midiPort);
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
function midiInputsListRefreshStates()
{
    
    //called when the state of any of the input devices changes
    for (var i = 0; i< midiInputsPanel.listPanel.children.length; i++)
    {
        var item = midiInputsPanel.listPanel.children[i];
        //I hate doing this. it made more sense with the other framework
        //call the add update item
        midiInputsListAddUpdateItem(item.portOpened.midiPort);
        
    }

}
function onInputPortOpenedMouse(e)
{
    if(uiMouse.isInside(e.uiSource))
    {
        if(e.type == "mouseup" && uiMouse.dist<4)
        {
            if(e.uiSource.midiPort.connection == "closed")
            {
                e.uiSource.midiPort.onmidimessage = midiInputOnMidiMessage; //setup the midi message callback function here... for now
                e.uiSource.midiPort.open(); //the above line opened the port anyway... rude head scratcher nightmare
                midiInputPort = e.uiSource.midiPort;
                
            }
            else
            {
                e.uiSource.midiPort.close();
            }
            e.uiCancel = true;
        }

    } 
}
function newMidiInputUI(x,y)
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


var channelMappingsShortList = [];
var midiOutputsShortList = [];

//byte[0]     byte[1]     byte[2]
//1000nnnn	0kkkkkkk	0vvvvvvv	Note Off	        n=channel* k=key # 0-127(60=middle C) v=velocity (0-127)
//1001nnnn	0kkkkkkk	0vvvvvvv	Note On	            n=channel k=key # 0-127(60=middle C) v=velocity (0-127)
//1010nnnn	0kkkkkkk	0ppppppp	Poly Key Pressure	n=channel k=key # 0-127(60=middle C) p=pressure (0-127)
//1011nnnn	0ccccccc	0vvvvvvv	Controller Change	n=channel c=controller v=controller value(0-127)
//1100nnnn	0ppppppp	[none]	    Program Change	    n=channel p=preset number (0-127)
//1101nnnn	0ppppppp	[none]	    Channel Pressure	n=channel p=pressure (0-127)
//1101nnnn	0ccccccc	0fffffff	Pitch Bend	        n=channel c=coarse f=fine (c+f = 14-bit resolution)

const midiMsgKeyOn = parseInt("1000", 2);
const midiMsgKeyOff = parseInt("1001", 2);
const midiMsgKeyPolyPressure = parseInt("1010", 2);
const midiMsgControllerChange = parseInt("1011", 2);
const midiMsgProgramChange = parseInt("1100", 2);
const midiMsgChannelPressure = parseInt("1101", 2);
const midiMsgPitchBend = parseInt("1001", 2); //same value as channel Pressure


var midiMessagelastChannel = 0;

class midiData
{
    data = null
    constructor(data)
    {
        this.data = data;
    }
}

function midiInputOnMidiMessage(e)
{

    var message = new midiMessage(e.data);
    //if(message.type == "MIDI")
    //{
    //    if(message.midiEventType == 9)
    //    {
    //        message.parameter2 = 127;
    //        message.data[2] = 127;
    //    }
    //}
    midiInputMessageCallback.forEach(callback => {callback(message);});

    return;

    //the rest is moved the the keyboard device
    //to depricate
     //called when a connected input device is sending data
     
     
    var channelIn = e.data[0] & 0xf;
    
    
    
    //go through the faster short lists to play the note on all the opened ouput for all the enabled mapping
    channelMappingsShortList.forEach(channelMappingListIndex =>
    {
        var channelMappingListItem = midiChannelMappingsList.itemsArray[channelMappingListIndex];
        if(channelMappingListItem.midiChannelMapping.enabled && channelIn == channelMappingListItem.midiChannelMapping.channelIn)
        {
            channelMappingListItem.itemHilighted = true;
            //change the channel element of the midi data
            e.data[0] = (e.data[0] & 0xf0) + channelMappingListItem.midiChannelMapping.channelOut
            channelMappingListItem.itemHilighted = true; //show the channel mapping being used in the channel mapping list 
            var channelOut = e.data[0] & 0xf; //double check

            for (var i = 0; i< midiOutputsPanel.listPanel.children.length; i++)
            {
                var midiPort = midiOutputsPanel.listPanel.children[i].portOpened.midiPort;
                if(midiPort.connection == "open")
                {
                    midiPort.send(e.data,performance.now());
                }
            
            }
            /*
            //loop through the opened outputs short array and get the output port from the outputs list box and play the note
            midiOutputsShortList.forEach(midiOutputListIndex =>
            {
                var midiOutputListItem = midiOutputsList.itemsArray[midiOutputListIndex];
                midiOutputListItem.itemHilighted = true;
                midiOutputListItem.midiOutput.send(e.data,performance.now());
            });
            */
        }
    });
    midiInputsListHilightsCountDown = midiOutputsListHilightsCountDown = midiChannelMappingsListHilightsCountDown = 60;
    //uiDraw.Dirty("midiInputOnMidiMessage");

    //midiOutputPort.send(e.data,performance.now());
        
    
}

//called when the keyboard changes the program (aka voice, aka instrument) of the channel. Not all keyboards have this ability
function midiInputOnProgrameChangeMsg(e)
{
    //find the the matching voice id in the list and select the item. taking into account the array item
    //is not exactly the the specifiec position but a bit further given the intrument group sections also in the list
    midiVoicesList.clearSelected();
    for(var i = e.presetnumber; i<midiVoicesList.itemsArray.length; i++)
    {
        if(midiVoicesList.itemsArray[i].midiVoice.id == e.presetnumber)
        {
            midiVoicesList.setSelected(i, true);
            midiVoicesList.scrollTo(i);
            break;        
        }
    }

    //uiDraw.Dirty("midiInputOnProgrameChangeMsg");
}
//MIDI INPUT UI
///////////////////////////


