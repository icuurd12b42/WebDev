class kdNote
{
    keyboardKey = null;
    timeIndexStart = 0;
    timeIndexEnd = 0;
    velocity = 0;
    noteIndex = -1;

    constructor(keyboardKey,velocity,timeIndexStart,timeIndexEnd,noteIndex)
    {
        this.keyboardKey = keyboardKey;
        this.velocity = velocity;
        this.timeIndexStart = timeIndexStart;
        this.timeIndexEnd = timeIndexEnd;
        this.noteIndex = noteIndex;
    }
}