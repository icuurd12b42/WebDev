

class kdOptionsPanel extends uiPanel
{

    onDrawSelf(e)
    {
        //resize the region to the parent dimentions. 
        //regions usually is relative to parent. but since we are ajusting the x and y in the draw 
        //when the system has temprarely modofied the region, we need to use the parent regio.xy here...
        //this.region.x = this.parent.region.x+0///this.parent.sideEdges;
        //this.region.y = this.parent.region.y+this.parent.shapeSpecs.keyboardBottom;
        this.region.x = 0///this.parent.sideEdges;
        this.region.y = this.parent.shapeSpecs.keyboardBottom;
        this.region.w = this.parent.region.w;
        this.region.h = this.parent.region.h-this.parent.shapeSpecs.keyboardBottom;

        //this was a hair puller to figure
        //optionsPanelClientArea.region.x = this.region.x-this.parent.region.x+this.parent.shapeSpecs.sideEdges;
        optionsPanelClientArea.region.y = 24;
        optionsPanelClientArea.region.w = this.region.w-this.parent.shapeSpecs.sideEdges*2;
        optionsPanelClientArea.region.h = this.region.h - 30;
        //this.setStyles({panel:{color:"red", alpha:1}});
        super.onDrawSelf(e);
    }
}



var midiKeyboardOptionsPanel = new kdOptionsPanel()
midiKeyboardOptionsPanel.setStyles({text:{font:"12px Arial", hmargin:8, vmargin:8}});
midiKeyboardOptionsPanel.setStyles({panel:{alpha:0, round:5, movable:false}});
midiKeyboardOptionsPanel.setStyles({border:{alpha:0, resizable:false}});
midiKeyboardOptionsPanel.setText("Options");
midiKeyboardOptionsPanel.setRegion({x:0,y:100,w:window.innerWidth,h:100});
midiKeyboardDevice.addChild(midiKeyboardOptionsPanel);



var optionsPanelClientArea = new uiPanel()
optionsPanelClientArea.setRegion({x:midiKeyboardDevice.shapeSpecs.sideEdges,y:midiKeyboardDevice.shapeSpecs.keyboardBottom,w:window.innerWidth,h:100});
optionsPanelClientArea.setStyles({panel:{alpha:0, round:5, movable:false}});
optionsPanelClientArea.setStyles({border:{alpha:0,resizable:false}});
optionsPanelClientArea.setStyles({clipping:{enabled:true,restrict:true}});
midiKeyboardOptionsPanel.addChild(optionsPanelClientArea);

midiInputsPanel.setParent(optionsPanelClientArea);
midiOutputsPanel.setParent(optionsPanelClientArea);
midiVoicesPanel.setParent(optionsPanelClientArea);
midiPercussionsPanel.setParent(optionsPanelClientArea);
midiPercussionsPanel.visible = midiPercussionsPanel.enabled = false;
midiChannelMappingsPanel.setParent(optionsPanelClientArea);
midiChannelsPanel.setParent(optionsPanelClientArea);


var midiSlidersPanel = new uiPanel()
midiSlidersPanel.setParent(optionsPanelClientArea);
midiSlidersPanel.setStyles(defaultTextStyle);
midiSlidersPanel.setStyles(defaultListPanelStyle);
midiSlidersPanel.setText("Sliders:");
midiSlidersPanel.setRegion({x:620,y:2,w:300,h:150});

var midiPlaybackSpeed = new uiSlider()
midiPlaybackSpeed.setParent(midiSlidersPanel);
midiPlaybackSpeed.setRegion({x:defaultTextStyle.text.hmargin,y:defaultTextStyle.text.vmargin*2,w:300-defaultTextStyle.text.hmargin*2,h:8});
midiPlaybackSpeed.setStyles({
    htracking:{enabled:true,value:globals.playSpeed/6},
    vtracking:{enabled:false,value:globals.playSpeed/6},
    thumbTrack:{width:9,height:17}});
midiPlaybackSpeed.setCallbacks({onslide:onPlaybackSpeedChange});


function onPlaybackSpeedChange(e)
{
    globals.playSpeed = e.hValue * 6;
    
}

var hslColHue = new uiSlider()
hslColHue.setParent(midiSlidersPanel);
hslColHue.setRegion({x:defaultTextStyle.text.hmargin,y:defaultTextStyle.text.vmargin*2+20,w:300-defaultTextStyle.text.hmargin*2,h:8});
hslColHue.setStyles({
    htracking:{enabled:true,value:refColor.h/360},
    vtracking:{enabled:false,value:refColor.h/360},
    thumbTrack:{width:9,height:17}});
    hslColHue.setCallbacks({onslide:onhslColHueChange});

function onhslColHueChange(e)
{
    //refColor.h = e.hValue * 360;
    //refColor.setColorHSL(e.hValue * 360, refColor.s, refColor.l);
    //recalcColors();


}

var hslColSL = new uiSlider()
hslColSL.setParent(midiSlidersPanel);
hslColSL.setRegion({x:defaultTextStyle.text.hmargin,y:defaultTextStyle.text.vmargin*2+40,w:300-defaultTextStyle.text.hmargin*2,h:200});
hslColSL.setStyles({
    htracking:{enabled:true,value:refColor.l},
    vtracking:{enabled:true,value:refColor.s},
    thumbTrack:{width:17,height:17}});
hslColSL.setCallbacks({onslide:onhslColSLChange});
function onhslColSLChange(e)
{
    refColor.setColorHSL(refColor.h, e.vValue, e.hValue);
    //refColor.l = e.hValue;
    //refColor.s = e.vValue;
    recalcColors();

}

oscilloscope = newWindow(600,30,300,300,"Oscilloscope:");
oscilloscope.setParent(optionsPanelClientArea);
oscilloscope.clientArea.setCallbacks({ondraw:drawScope});

var scopeBuffer = [];
function drawScope(e)
{
   
    var me = e.uiSource;
    //make sure we have enough buffer for the width
    while(scopeBuffer.length<me.region.w) scopeBuffer.push(0);
   
    var oldalpha = e.ctx.globalAlpha;
    e.ctx.globalAlpha = 1;

    e.ctx.lineWidth = 1;									// set width
    e.ctx.strokeStyle = uiRes.getColor(uiRes.getReference("frameClientLineColor"));
    e.ctx.beginPath();
    var hh = me.region.h/2;
    var xl = me.region.x;
    var yc = me.region.y+hh;
    var yy,xx;

    var notes = [];
    
    for(var i = 0; i<128; i++)
    {
        if(midiKeyboardDevice.refKeyboard.keys[i].pressed)
        {
            notes.push([midiKeyboardDevice.refKeyboard.keys[i].frequency/440,midiKeyboardDevice.refKeyboard.keys[i].velocity])
        }
    }
    

    for (var i = 0; i < me.region.w; i++)
    {
        var t = performance.now()/500;
        xx = xl+i;

        {
            //scopeBuffer[i] = scopeBuffer[i+1*(i < me.region.w-1)]
            var v = 0;
            var nv = 0;
            notes.forEach(note => {
                v+=Math.sin((t + i/me.region.w) * note[0] * 4*Math.PI) * note[1];
                nv+=note[1];
            });
            if(notes.length)
            {
                v /=nv;//notes.length;
                scopeBuffer[i] = uig.lerp(v* (i/(me.region.w))*(1-(i/(me.region.w))) * 5 ,scopeBuffer[i],.5);
                //console.log( scopeBuffer[i])
            }
            else
            {
                scopeBuffer[i] = uig.lerp(0 ,scopeBuffer[i],.5);
            }
        }
        
        
        yy = yc + scopeBuffer[i] * hh *.75;

        
        if(i >= 0)
            e.ctx.lineTo(xx,yy)
        else
            e.ctx.moveTo(xx,yy)
    }   
    //e.ctx.cloPath();
    e.ctx.stroke();
    e.ctx.globalAlpha = oldalpha;

}

var colorChanger = newWindow(900,30,300,300,"Color:");
colorChanger.setParent(optionsPanelClientArea);
colorChanger.titleText.styles.text = "Color Anchor: h:"+uig.numberTo2Dec(refColor.h)+" s:"+uig.numberTo2Dec(refColor.s)+" l:"+uig.numberTo2Dec(refColor.l);
colorChanger.clientArea.setCallbacks({ondraw:drawColorChanger});

var satSlider =  new uiAlignedVSlider();
satSlider.setParent(colorChanger.clientArea);
satSlider.setRegion({x:0,y:0,w:1,h:1});
satSlider.setStyles(
    {
        value:1-refColor.s,
        //color:"gadgetColor",
        //frameLightColor:"gadgetBorderframeLightColor",
        //frameDarkColor:"gadgetBorderDarkColor",
        corners:[0,0,4,0],
        parentAlign:{x1:-18,y1:0,x2:0,y2:0}
    });
satSlider.setCallbacks({onchange:onSatSliderChange});

function onSatSliderChange(e)
{   
    refColor.setColorHSL(refColor.h, 1-e.uiNewValue, refColor.l );
    colorChanger.titleText.styles.text = "Color Anchor: h:"+uig.numberTo2Dec(refColor.h)+" s:"+uig.numberTo2Dec(refColor.s)+" l:"+uig.numberTo2Dec(refColor.l);
    recalcColors();
}

function drawColorChanger(e)
{
    var me = e.uiSource;

    var oldalpha = e.ctx.globalAlpha;
    e.ctx.globalAlpha = 1;

    var cellw = (me.region.w-20)/14,
        cellh = me.region.h/14;
    var xstart = me.region.x+cellw,
        ystart = me.region.y+cellh;
    var xend = xstart+cellw*13,
        yend = ystart+cellh*13;

    var textCol = uiRes.getColor(uiRes.getReference("panelTextColor"));
    var textFont = uiRes.getFont(uiRes.getReference("panelFont"));


    var x,y;
    y = ystart;
    for(var row = 0; row<13; row++)
    {
        x = xstart;
        for(var col = 0; col<13; col++)
        {
            uiDraw.fillRect(e.ctx,x,y,cellw,cellh,uiRes.getColor("clr["+col+"]["+row+"]"));
            x+=cellw;
        }
        y+=cellh;
    }

  
    x = me.region.x+cellw+cellw/2;
    y = me.region.y+cellh/2;
    for(var i = 0; i<13; i++)
    {
        uiDraw.fillText(e.ctx,x,y,""+i,textCol,1,textFont,"center","middle");
        x+=cellw;
    }
    x = me.region.x+cellw/2;
    y = me.region.y+cellh+cellh/2;
    for(var i = 0; i<13; i++)
    {
        uiDraw.fillText(e.ctx,x,y,""+i,textCol,1,textFont,"center","middle");
        y+=cellh;
    }
    e.ctx.globalAlpha = oldalpha;

    
    if(uiMouse.haveCapture(me))
    {
        var region = uig.mapRegionXY(me);

        var slideW = xend-xstart;
        var mouseX = uiMouse.x-region.x-cellw;
        var hvalue = uig.clamp(0,1,1-mouseX/slideW);

        var slideH = yend-ystart;
        var mouseY = uiMouse.y-region.y-cellh;
        var vvalue = uig.clamp(0,1,1-mouseY/slideH);
        //refColor.setColorHSL(hvalue * 360, refColor.s, vvalue);

        var dxpc = uiMouse.dx/slideW; //convert the draw in % of the region width
        var dypc = uiMouse.dy/slideH; //convert the draw in % of the region width
        //var sy = Math.sign(dypc);
        //dypc=dypc+(dypc*(refColor.l*(1-refColor.l))); //this boosts the change relative to how large lum is. to compensate for the v*v bias in the creation of the color grid
        refColor.setColorHSL(refColor.h-dxpc*360, refColor.s, refColor.l-dypc);
        uiMouse.dx = 0;
        uiMouse.dy = 0;
        colorChanger.titleText.styles.text = "Color Anchor: h:"+uig.numberTo2Dec(refColor.h)+" s:"+uig.numberTo2Dec(refColor.s)+" l:"+uig.numberTo2Dec(refColor.l);
        recalcColors();
    }
    noteFountain.updateColors();
}



