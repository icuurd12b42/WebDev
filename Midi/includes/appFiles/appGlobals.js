///////////////////////////
// the uiBase, eg the "Desktop"
var myBase = new uiBaseObject();
myBase.region.w =  window.innerWidth;
myBase.region.h =  window.innerHeight;

var defaultTextStyle = {text:{font:"12px Arial", hmargin:8, vmargin:16}};

var defaultListPanelStyle = {panel:{color:"#868686", alpha:.9, round:5},
                        border:{width:1,color:"#535353",alpha:.9},
                    };

var defaultListColors = {list:
                            {
                                itemheight:28,
                                selected:{color:"black",alpha:1,backColor:"silver",backalpha:1},
                                hover:{color:"black",alpha:1,backColor:"silver",backalpha:1},
                                hilighted:{color:"black",alpha:1,backColor:"silver",backalpha:1}
                            }
                        }

uiMouse.hookToElement(document.body);
uiMouse.addListener(myBase);
uiDraw.addListener(myBase);
///////////////////////////


///////////////////////////
//MIDI ACCESS CONNECTION

//this holds the access connection and other possibly useful objects set by the system
var midiAccess = null; // type MIDIAccess; 
var midiConnectionEvent = null; //type MIDIConnectionEvent
var midiInputPort = null;
var midiOutputPort = null;


var globals = {"timeIndex":0, "playSpeed":1};


var namedColorMap = new Map();




uiRes.setReference("frameLightColor","clr[6][6]");
uiRes.setReference("frameColor","clr[6][5]");
uiRes.setReference("frameDarkColor","clr[6][3]");


uiRes.setReference("gadgetBorderLightColor","clr[6][7]");
uiRes.setReference("gadgetColor","clr[6][6]");
uiRes.setReference("gadgetBorderDarkColor","clr[6][4]");
uiRes.setReference("gadgetTextColor","invclr[6][6]");

uiRes.setReference("panelColor","clr[6][4]");
uiRes.setReference("panelTextColor", "invclr[6][4]");


uiRes.setReference("frameTitleColor","clr[8][8]");
uiRes.setReference("frameTitleTextColor","invclr[8][8]");

uiRes.setReference("frameClientRegionColor","clr[6][3]");
uiRes.setReference("frameClientTextColor","invclr[6][3]");
uiRes.setReference("frameClientLineColor","invclr[10][3]");





function readStorage(storageId,def)
{
    var r = window.localStorage.getItem(storageId);
    if (r === undefined) 
        r = def;
    return r;
}
function writeStorage(storageId,v)
{
    window.localStorage.setItem(storageId,v);
}
var refColor = new uiColorHLS();
refColor.setColorHSL(readStorage("h",0),readStorage("s",.5),readStorage("l",.0));
function updateColorSet(h, s, l, row)
{
    var uiCol = new uiColorHLS();
    var hat = h;
    for (var i = 0; i < 13; i++)
    {
        uiCol.setColorHSL(hat,s,l);
        uiRes.setColor("clr["+i+"]["+row+"]",uiCol.color);
        uiCol.setColorHSL(hat+180,(s),(l+.5)%1);
        uiRes.setColor("invclr["+i+"]["+row+"]",uiCol.color);
        
        hat+=360/12;
    }
}


function recalcColors()
{
    var colorTick = 1/14;
    var j = 0;
    for(var i = 0; i< 13;i++)
    {
        //old
        //updateColorSet(refColor.h, refColor.s, refColor.l+colorTick*i, i);
        //new
        //var v = uig.bias(i/13,.3)*uig.bias(i/13,.9);
        //colorTick = uig.lerp(0,1,v*v);
        var v = uig.bias(i/13,.42)*uig.bias(i/13,.9);
        colorTick = uig.lerp(0,1,v*v);
        updateColorSet(refColor.h, refColor.s, refColor.l *i/13 +colorTick, i);

        //var v = i/12;
        //v = uig.bias(v,.3)
        //colorTick = uig.lerp(0,1,v*v);
        //updateColorSet(refColor.h, refColor.s, refColor.l *i/12+colorTick, i);
    }
    writeStorage("h",refColor.h);
    writeStorage("s",refColor.s);
    writeStorage("l",refColor.l);
//updateColorSet(refColor.h+180,  refColor.s, (refColor.l+.5) % 1, oppositeColorSet);
}
recalcColors();




//Holds the notes currently pressed, each entry is a midiFile event. populated by DownNoteToArray
var downNotesArray=[];


function midiChannelNumberToString(midiChannelNumber)
{
    // formats 0 to 00, 1 to 01 and so on
    if(midiChannelNumber < 10) 
        return "0"+midiChannelNumber;
    else 
        return  ""+midiChannelNumber;
}



function timeIndex()
{
    globals.timeIndex = performance.now();
}
timeIndex();


function newWindow(x,y,w,h,title)
{
    var frame =new uiFrame();
    frame.setRegion({x:x,y:y,w:w,h:h});
    frame.setStyles(
    {
        corners:[8,8,8,8],
    });


    frame.frameBorder = new uiAlignedBeveledEdges();
    frame.frameBorder.setParent(frame);
    frame.frameBorder.setRegion({x:0,y:0,w:1,h:1});
    frame.frameBorder.setStyles(
    {
        corners:[8,8,8,8],
        lineWidth:2,
        parentAlign:{x1:0,y1:0,x2:0,y2:0}
    });

    frame.titleBar =  new uiAlignedPanel();
    frame.titleBar.setParent(frame);
    frame.titleBar.setRegion({x:0,y:0,w:1,h:1});
    frame.titleBar.setStyles(
    {
        corners:[6,6,0,0],
        color:"frameTitleColor",
        parentAlign:{x1:6,y1:6,x2:-6,y2:30}
    });

    frame.titleText = new uiAlignedLabel();
    frame.titleText.setParent(frame.titleBar);
    frame.titleText.setRegion({x:0,y:0,w:1,h:1});
    frame.titleText.setStyles(
    {
        text:title,
        halign:"left", 
        valign:"middle",
        color:"frameTitleTextColor",
        font: "frameTitleFont",
        parentAlign:{x1:4,y1:4,x2:-4,y2:-4}
    });

    

    frame.clientAreaBk =  new uiAlignedClippingRegion();
    frame.clientAreaBk.setParent(frame);
    frame.clientAreaBk.setRegion({x:0,y:0,w:1,h:1});
    frame.clientAreaBk.setStyles(
    {
        corners:[0,0,6,6],
        parentAlign:{x1:6,y1:34,x2:-6,y2:-6}
    });

    frame.clientArea =  new uiAlignedPanel();
    frame.clientArea.setParent(frame.clientAreaBk);
    frame.clientArea.setRegion({x:0,y:0,w:1,h:1});
    frame.clientArea.setStyles(
    {
        color:"panelColor",
        corners:[0,0,6,6],
        parentAlign:{x1:0,y1:0,x2:0,y2:0}
    });

    frame.titleBarMoveWindowRegion =  new uiAlignedMoveWindowRegion();
    frame.titleBarMoveWindowRegion.setParent(frame);
    frame.titleBarMoveWindowRegion.setRegion({x:0,y:0,w:1,h:1});
    frame.titleBarMoveWindowRegion.setStyles(
    {
        frameID:frame.id,
        corners:[6,6,0,0],
        parentAlign:{x1:4,y1:4,x2:-4,y2:30}
    });

    
    return frame;
}

function newListBox(parent)
{
    parent.listPanel = new uiVListPanel();
    parent.listPanel.setRegion({x:4,y:4,w:1,h:1});
    parent.listPanel.setParent(parent);
    //parent.listPanel.debug = true;

    parent.scrollRegion = new uiAlignedVScrollRegion();
    parent.scrollRegion.setParent(parent);
    parent.scrollRegion.setRegion({x:0,y:0,w:1,h:1});
    //parent.scrollRegion.debug = true;
    parent.scrollRegion.setStyles(
    {
        value:0,
        frameID:parent.listPanel.id,
        parentAlign:{x1:4,y1:4,x2:-20,y2:-4}
    });
    parent.scrollRegion.setCallbacks({onchange:onListScrollPosChange});

    
    
    parent.listSlider =  new uiAlignedVSlider();
    parent.listSlider.setParent(parent);
    parent.listSlider.setRegion({x:0,y:0,w:1,h:1});
    parent.listSlider.setStyles(
    {
        value:0,
        //color:"gadgetColor",
        //frameLightColor:"gadgetBorderframeLightColor",
        //frameDarkColor:"gadgetBorderDarkColor",
        corners:[0,0,0,0],
        parentAlign:{x1:-18,y1:0,x2:0,y2:0}
    });
    parent.listSlider.setCallbacks({onchange:onListScrollPosChange});

    function onListScrollPosChange(e)
    {
        parent.scrollRegion.styles.value = e.uiNewValue;
        parent.listSlider.styles.value = e.uiNewValue;
    }
    return parent.listPanel;
}