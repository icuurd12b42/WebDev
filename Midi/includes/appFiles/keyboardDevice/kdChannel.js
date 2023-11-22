
//this class mirrors the midi channel data of the physical device
//consisting of the channel index and the midi keys send by the device
class kdChannel {
    keyboardDevice = null;
    channelIndex = 0;
    keyboard = null;
    visible = true;
    audible = true;
    constructor(keyboardDevice,channelIndex) {
        this.keyboardDevice = keyboardDevice;
        this.channelIndex = channelIndex;
        this.keyboard = new kdKeyboard(this,channelIndex);
    }

//to deprecate
    active = false;


    
    
    
    
    getActive()
    {
        return this.active;
    }
    setActive(active)
    {
        this.active = active;
        this.keyboard.setActive(active);
    }
    turnOff()
    {
        this.keyboard.turnOff();
    }
}