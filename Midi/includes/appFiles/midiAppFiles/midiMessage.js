//this quick class is used to convert from midi/output port to the structure used in app
class midiMessage
{
    data = null;
    constructor(data)
    {
        this.data = data;
        this.decode();
        this.timeIndex = globals.timeIndex;
    }

    decode()
    {
        if (this.data[0] & 0x80)
        {
            this.type = "MIDI";
            this.midiEventType = (this.data[0] & 0xf0)>>4;
            this.midiChannel = this.data[0] & 0x0f;
            if(this.data.length>1)
            {
                this.parameter1 = this.data[1];
            }
            if(this.data.length>2)
            {
                this.parameter2 = this.data[2];
            }
        }
        else
        {
            //todo, see if we can merge this structure thoughout instead of dealing with various versions of this data
            //not yet implements
        }
    }
}
