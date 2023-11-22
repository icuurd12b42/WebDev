//BUG: mouse count get to 2 so no 0 to 1 transition detected
// keyboard pressed and released is bugged for all mouse and keys

class input
{
    constructor()
    {
        this.prevCount = 0;
        this.heldCount = 0;
        this.pressedStartTime = 0;
        this.event = KeyboardEvent; //the javascript event when for that key, default stub
        this.keyState = 0; // Internal state of key, 1 down, -1 up, 0 no change
    }
    pressed()//transitioned from not pressed to pressed
    {
        return (this.prevCount == 0 && this.heldCount == 1)
    }
    released()//transitioned from down to up
    {
        return (this.prevCount != 0 && this.heldCount == 0)
    }
    down()//being held down, detected on the same frame as pressed
    {
        return this.heldCount!=0;
    }
    //returns how many times the hardware sent that key as it was held down for a period of time, 
    //this varies depending on user settings and so is not a reliable value to use as a game trigger
    //the value reset on key up
    downCount() 
    {
        return this.heldCount;
    }
    //returns the amount of time in ms the key has been held down for, 
    //the value holds after the key is released up to the next step
    //so you can figure out on released how long it was held prior to the release.
    downTime() 
    {
        if(this.pressedStartTime==0) return 0;

        return Date.now() - this.pressedStartTime;
    }
}


//all refences are capitalised when added and when read because adding 'a' vs adding 'A' would cause issues if the user has Shift or caps ON
//addInput("a");
//if(inputs["A"].pressed()) or if(inputs.A.pressed())
//addInput("Shift");
//example if(inputs["SHIFT"].pressed()) or if(inputs.SHIFT.pressed())

var inputs = {};
function addInput(key)
{
    if(key == " ") console.error("addInput() error: Use the word 'Space' instead of an actual space");
    inputs[key.toUpperCase()] = new input;
}
//debugging
addInput("MOUSE"); //the mouse is accessible the same way
addInput("SPACE");

inputs.MOUSE.event = MouseEvent;  //default stub
inputs.MOUSE.LEFT = new input();
inputs.MOUSE.RIGHT = new input();
inputs.MOUSE.MIDDLE = new input();
var oldMouseButtons = 0;
function stepMouse(e)
{
    if (e.type == "mousedown")
    {
        if(e.button == 0)
            inputs.MOUSE.LEFT.keyState = 1;
        else if(e.button == 1)
            inputs.MOUSE.MIDDLE.keyState = 1;
        else if(e.button == 2)
            inputs.MOUSE.RIGHT.keyState = 1;
    }
    else if(e.type == "mouseup")
    {
        if(e.button == 0)
            inputs.MOUSE.LEFT.keyState = -1;
        else if(e.button == 1)
            inputs.MOUSE.MIDDLE.keyState = -1;
        else if(e.button == 2)
            inputs.MOUSE.RIGHT.keyState = -1;
    }
    inputs.MOUSE.event = e;
    
}

function inputsStateChanges(inp)
{
    //console.log(inp);
    //set the previous count to this count
    inp.prevCount = inp.heldCount;
    // set held count to 0 if released internal state -1
    if(inp.keyState == -1)
    {
        inp.heldCount = 0;
        inp.keyState = 0;
    }
    else if(inp.keyState == 1)
    {
        inp.heldCount++;
        inp.keyState = 0;
    }
    else
    {
        inp.heldCount+=(inp.heldCount>0)
    }
    //clear the internal key state
    //inp.keyState = 0;

    if(inp.pressed()) //if pressed reset start time
    {
        console.log("RecordT")
        inp.pressedStartTime = Date.now();
    }
    else if(inp.released())
    {
        console.log("ResetT")
        inp.pressedStartTime = 0;
    }
}
function stepInputs()
{
    //This is for the .released() to work so that 0 the onrelease set to heldCount to, to moved to the prevCount;
    for (var entry in inputs) //this does the keys and the MOUSE
    {
        inputsStateChanges(inputs[entry])

    }

    //this does the MOUSE buttons
    
     
     if(inputs.SHIFT.down())
     {
        console.log(["SLMR pCount", inputs.SPACE.prevCount,inputs.MOUSE.LEFT.prevCount,inputs.MOUSE.MIDDLE.prevCount,inputs.MOUSE.RIGHT.prevCount],
                    ["SLMR Count", inputs.SPACE.heldCount,inputs.MOUSE.LEFT.heldCount,inputs.MOUSE.MIDDLE.heldCount,inputs.MOUSE.RIGHT.heldCount],
                    ["SLMR Pressed", inputs.SPACE.pressed(), inputs.MOUSE.LEFT.pressed(),inputs.MOUSE.MIDDLE.pressed(),inputs.MOUSE.RIGHT.pressed()],
                    ["SLMR Down", inputs.SPACE.down(), inputs.MOUSE.LEFT.down(),inputs.MOUSE.MIDDLE.down(),inputs.MOUSE.RIGHT.down()],
                    ["SLMR Released", inputs.SPACE.released(), inputs.MOUSE.LEFT.released(),inputs.MOUSE.MIDDLE.released(),inputs.MOUSE.RIGHT.released()]);

     //console.log({"LMR Counts", inputs.MOUSE.LEFT.heldCount,inputs.MOUSE.MIDDLE.heldCount,inputs.MOUSE.RIGHT.heldCount})
     //console.log("LMR Pressed", inputs.MOUSE.LEFT.pressed(),inputs.MOUSE.MIDDLE.pressed(),inputs.MOUSE.RIGHT.pressed())
     //console.log("LMR Down", inputs.MOUSE.LEFT.down(),inputs.MOUSE.MIDDLE.down(),inputs.MOUSE.RIGHT.down())
     //console.log("LMR Released", inputs.MOUSE.LEFT.released(),inputs.MOUSE.MIDDLE.released(),inputs.MOUSE.RIGHT.released())
     }
     
     inputsStateChanges(inputs.MOUSE.LEFT);
     inputs.MOUSE.LEFT.keyState = 0;
     inputsStateChanges(inputs.MOUSE.MIDDLE);
     inputs.MOUSE.MIDDLE.keyState = 0;
     inputsStateChanges(inputs.MOUSE.RIGHT);
     inputs.MOUSE.RIGHT.keyState = 0;

    //inputs.MOUSE.LEFT.prevCount = inputs.MOUSE.LEFT.heldCount;
    //if(inputs.MOUSE.LEFT.heldCount == 0) inputs.MOUSE.LEFT.pressedStartTime = 0;
    //inputs.MOUSE.RIGHT.prevCount = inputs.MOUSE.RIGHT.heldCount;
    //if(inputs.MOUSE.RIGHT.heldCount == 0) inputs.MOUSE.RIGHT.pressedStartTime = 0;
    //inputs.MOUSE.MIDDLE.prevCount = inputs.MOUSE.MIDDLE.heldCount;
    //if(inputs.MOUSE.MIDDLE.heldCount == 0) inputs.MOUSE.MIDDLE.pressedStartTime = 0;

    //this does the MOUSE buttons
    //inputs.MOUSE.LEFT.heldCount+=(inputs.MOUSE.LEFT.heldCount!=0);
    //inputs.MOUSE.MIDDLE.heldCount+=(inputs.MOUSE.MIDDLE.heldCount!=0);
    //inputs.MOUSE.RIGHT.heldCount+=(inputs.MOUSE.RIGHT.heldCount!=0);
}

//https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_event_key_key
addInput("Control");
addInput("Shift");
addInput("Alt");
addInput("F1");
addInput("Space");
document.addEventListener('keydown', function(e) {
    var keyVal = e.key.toUpperCase();
    if(keyVal == " ") keyVal = "SPACE";
    const inp = inputs[keyVal];
    if(inp)
    {
        inp.keyState = 1;
    }
});
document.addEventListener('keyup', function(e) {
    var keyVal = e.key.toUpperCase();
    if(keyVal == " ") keyVal = "SPACE";
    const inp = inputs[keyVal];
    if(inp)
    {
        inp.keyState = -1;
    }
});

/*
//BUG: mouse count get to 2 so no 0 to 1 transition detected
// keyboard pressed and released is bugged for all mouse and keys

class input
{
    constructor()
    {
        this.prevCount = 0;
        this.heldCount = 0;
        this.pressedStartTime = 0;
        this.event = KeyboardEvent; //the javascript event when for that key, default stub
    }
    pressed()//transitioned from not pressed to pressed
    {
        return (this.prevCount == 0 && this.heldCount == 1)
    }
    released()//transitioned from down to up
    {
        return (this.prevCount != 0 && this.heldCount == 0)
    }
    down()//being held down, detected on the same frame as pressed
    {
        return this.heldCount!=0;
    }
    //returns how many times the hardware sent that key as it was held down for a period of time, 
    //this varies depending on user settings and so is not a reliable value to use as a game trigger
    //the value reset on key up
    downCount() 
    {
        return this.heldCount;
    }
    //returns the amount of time in ms the key has been held down for, 
    //the value holds after the key is released up to the next step
    //so you can figure out on released how long it was held prior to the release.
    downTime() 
    {
        if(this.pressedStartTime==0) return 0;

        return Date.now() - this.pressedStartTime;
    }
}


//all refences are capitalised when added and when read because adding 'a' vs adding 'A' would cause issues if the user has Shift or caps ON
//addInput("a");
//if(inputs["A"].pressed()) or if(inputs.A.pressed())
//addInput("Shift");
//example if(inputs["SHIFT"].pressed()) or if(inputs.SHIFT.pressed())

var inputs = {};
function addInput(key)
{
    if(key == " ") console.error("addInput() error: Use the word 'Space' instead of an actual space");
    inputs[key.toUpperCase()] = new input;
}
//debugging
addInput("MOUSE"); //the mouse is accessible the same way
addInput("SPACE");

inputs.MOUSE.event = MouseEvent;  //default stub
inputs.MOUSE.LEFT = new input();
inputs.MOUSE.RIGHT = new input();
inputs.MOUSE.MIDDLE = new input();
var oldMouseButtons = 0;
function stepMouse(e)
{
    var inp = inputs.MOUSE.LEFT
    //var detected = "none";
    if(((e.buttons & 1) == 1) || ((oldMouseButtons & 1) == 1))
    {
        inp = inputs.MOUSE.LEFT;
        //detected = ("LEFT");
    }
    else if(((e.buttons & 2) == 2) || ((oldMouseButtons & 2) == 2))
    {
        inp = inputs.MOUSE.RIGHT;
        //detected = ("RIGHT");
    }
    else if(((e.buttons & 4 )== 4) || ((oldMouseButtons & 4) == 4))
    {
        inp = inputs.MOUSE.MIDDLE;
        //detected = ("MIDDLE");
    }
    oldMouseButtons = e.buttons;
  
    if (e.type == "mousedown")
    {
        if(inp.pressedStartTime == 0) inp.pressedStartTime = Date.now();
        inp.prevCount = inp.heldCount;
        inp.heldCount++;

        //the MOUSE also records the value for the combined buttons, not that it's going to be any use
        inputs.MOUSE.prevCount = inputs.MOUSE.heldCount;
        inputs.MOUSE.heldCount++;
    }
    else if(e.type == "mouseup")
    {
        inp.prevCount = inp.heldCount;
        inp.heldCount = 0;

        inputs.MOUSE.prevCount = inputs.MOUSE.heldCount;
        inputs.MOUSE.heldCount = 0;
    }

    inputs.MOUSE.event = e;
}

function stepInputs()
{
    //This is for the .released() to work so that 0 the onrelease set to heldCount to, to moved to the prevCount;
    for (var entry in inputs) //this does the keys and the MOUSE
    {
        inputs[entry].prevCount = inputs[entry].heldCount;
        if(inputs[entry].heldCount == 0) inputs[entry].pressedStartTime = 0;
        inputs[entry].heldCount+=(inputs[entry].heldCount!=0);
    }

    //this does the MOUSE buttons
    
     
     if(inputs.SHIFT.down())
     {
        console.log(["SLMR pCount", inputs.SPACE.prevCount,inputs.MOUSE.LEFT.prevCount,inputs.MOUSE.MIDDLE.prevCount,inputs.MOUSE.RIGHT.prevCount],
                    ["SLMR Count", inputs.SPACE.heldCount,inputs.MOUSE.LEFT.heldCount,inputs.MOUSE.MIDDLE.heldCount,inputs.MOUSE.RIGHT.heldCount],
                    ["SLMR Pressed", inputs.SPACE.pressed(), inputs.MOUSE.LEFT.pressed(),inputs.MOUSE.MIDDLE.pressed(),inputs.MOUSE.RIGHT.pressed()],
                    ["SLMR Down", inputs.SPACE.down(), inputs.MOUSE.LEFT.down(),inputs.MOUSE.MIDDLE.down(),inputs.MOUSE.RIGHT.down()],
                    ["SLMR Released", inputs.SPACE.released(), inputs.MOUSE.LEFT.released(),inputs.MOUSE.MIDDLE.released(),inputs.MOUSE.RIGHT.released()]);

     //console.log({"LMR Counts", inputs.MOUSE.LEFT.heldCount,inputs.MOUSE.MIDDLE.heldCount,inputs.MOUSE.RIGHT.heldCount})
     //console.log("LMR Pressed", inputs.MOUSE.LEFT.pressed(),inputs.MOUSE.MIDDLE.pressed(),inputs.MOUSE.RIGHT.pressed())
     //console.log("LMR Down", inputs.MOUSE.LEFT.down(),inputs.MOUSE.MIDDLE.down(),inputs.MOUSE.RIGHT.down())
     //console.log("LMR Released", inputs.MOUSE.LEFT.released(),inputs.MOUSE.MIDDLE.released(),inputs.MOUSE.RIGHT.released())
     }
     
    inputs.MOUSE.LEFT.prevCount = inputs.MOUSE.LEFT.heldCount;
    if(inputs.MOUSE.LEFT.heldCount == 0) inputs.MOUSE.LEFT.pressedStartTime = 0;
    inputs.MOUSE.RIGHT.prevCount = inputs.MOUSE.RIGHT.heldCount;
    if(inputs.MOUSE.RIGHT.heldCount == 0) inputs.MOUSE.RIGHT.pressedStartTime = 0;
    inputs.MOUSE.MIDDLE.prevCount = inputs.MOUSE.MIDDLE.heldCount;
    if(inputs.MOUSE.MIDDLE.heldCount == 0) inputs.MOUSE.MIDDLE.pressedStartTime = 0;

    //this does the MOUSE buttons
    inputs.MOUSE.LEFT.heldCount+=(inputs.MOUSE.LEFT.heldCount!=0);
    inputs.MOUSE.MIDDLE.heldCount+=(inputs.MOUSE.MIDDLE.heldCount!=0);
    inputs.MOUSE.RIGHT.heldCount+=(inputs.MOUSE.RIGHT.heldCount!=0);
}

//https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_event_key_key
addInput("Control");
addInput("Shift");
addInput("Alt");
addInput("F1");
addInput("Space");
document.addEventListener('keydown', function(e) {
    var keyVal = e.key.toUpperCase();
    if(keyVal == " ") keyVal = "SPACE";
    const inp = inputs[keyVal];
    if(inp)
    {
        if(inp.pressedStartTime == 0) inp.pressedStartTime = Date.now();
        inp.prevCount = inp.heldCount;
        
        inp.heldCount++;
    }
});
document.addEventListener('keyup', function(e) {
    var keyVal = e.key.toUpperCase();
    if(keyVal == " ") keyVal = "SPACE";
    const inp = inputs[keyVal];
    if(inp)
    {
        inp.prevCount = inp.heldCount;
        inp.heldCount = 0;
    }
});


ARRRRRRRRRRRRRRGH
document.addEventListener('keydown', function(e) {
    var keyVal = e.key.toUpperCase();
    if(keyVal == " ") keyVal = "SPACE";
    const inp = inputs[keyVal];
    if(inp)
    {
        inp.heldCount++;
    }
});
document.addEventListener('keyup', function(e) {
    var keyVal = e.key.toUpperCase();
    if(keyVal == " ") keyVal = "SPACE";
    const inp = inputs[keyVal];
    if(inp)
    {
        inp.keyState = -1;
    }
});


ARRRRRRGH


 //For every registered keys
    for (var inp in inputs) //this does the keys and the MOUSE
    {
        console.log(inp);
        //set the previous count to this count
        inp.prevCount = inp.heldCount;
        // set held count to 0 if released internal state -1
        if(inp.keyState == -1)
        {
            inp.heldCount = 0;
        }
        else //and inc held count if internal state is 1... down or 0 no change
        {
            inp.heldCount++;
        }
        //clear the internal key state
        inp.keyState = 0;

        if(inp.pressed()) //if pressed reset start time
        {
            inp.pressedStartTime = Date.now();
        }
        else id(inp.released())
        {
            inp.pressedStartTime = 0;
        }

    }
*/