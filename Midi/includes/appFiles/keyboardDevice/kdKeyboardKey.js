class kdKeyboardKey 
{
    keyboard = null;
    keyIndex = 0;
    isSharp = false;
    scoreLane = 0;
    octave = 0;
    midiOctave = 0;
    octaveKey = 0;
    pressed = false;
    velocity = 0;
    songNotes = [];
    songPlayedNotes = [];
    devicePlayedNotes = [];
    frequency = 432;
    active = true;
    //shape specs set by uiKeyboardDevice calculateKeyboardLayout()

    region = {x:0,y:0,w:0,h:0};
    lineW = 1;
    radiusL = 1;

    whiteKeyColor = "#BBBBBB";
    whiteKeyHoverColor = "#DDDDDD";
    whiteKeyPressedColor = "#FFFFFF";
    whiteKeyLineColor = "#444444";
    
    blackKeyColor = "#222222";
    blackKeyHoverColor = "#444444";
    blackKeyPressedColor = "#666666";
    blackKeyLineColor = "#111111";
    
    drawKey(e)
    {
        var color = this.whiteKeyColor,
            pressedColor = this.whiteKeyPressedColor,
            lineColor = this.whiteKeyLineColor,
            hoverColor = this.whiteKeyHoverColor;
        if(this.isSharp)
        {
            color = this.blackKeyColor;
            pressedColor = this.blackKeyPressedColor;
            lineColor = this.blackKeyLineColor;
            hoverColor = this.blackKeyHoverColor;
        }
        if(this.pressed) 
            color = pressedColor;
        else if (this.hover)
            color = hoverColor;

        uiDraw.roundedRectWBorders(e.ctx,this.region.x, this.region.y, this.region.w,this.region.h+this.pressed,color,lineColor,this.lineW,this.radiusL);
    }
    terminateDataRecord(data)
    {
        if(data.length)
        {
            var entry = data[data.length-1];
            if(entry.velocity !=0)
            {
                if(entry.timeIndexEnd == entry.timeIndexStart)
                    entry.timeIndexEnd = globals.timeIndex;
                data.push(new kdNote(this,0,entry.timeIndexEnd,entry.timeIndexEnd,data.length));
            }
        }
    }
    setActive(active)
    {
        this.active = true;
        
        if(!active)
            this.turnOff();
    }
    turnOff()
    {
        this.terminateDataRecord(this.devicePlayedNotes);
        this.terminateDataRecord(this.songPlayedNotes);
        
        this.pressed = false;
        this.velocity = 0;
    }
    
//to deprecate
fallenNotes = [];

    constructor(keyboard,keyIndex,isSharp,scoreLane,octave,midiOctave,octaveKey)
    {
        this.keyboard = keyboard;
        this.keyIndex = keyIndex;
        this.isSharp = isSharp;
        this.scoreLane = scoreLane;
        this.octave = octave;
        this.midiOctave = midiOctave;
        this.octaveKey = octaveKey;
        this.pressed = false;
        this.velocity = false;
        this.songNotes = new Array;
        this.songPlayedNotes = new Array;
        this.devicePlayedNotes = new Array;
        this.frequency = noteFrequencies[keyIndex];

//to deprecate
this.fallenNotes = new Array;

    }
}
















var noteFrequencies = new Array(128);
noteFrequencies[	0	] = 	8.18	;
noteFrequencies[	1	] = 	8.66	;
noteFrequencies[	2	] = 	9.18	;
noteFrequencies[	3	] = 	9.72	;
noteFrequencies[	4	] = 	10.3	;
noteFrequencies[	5	] = 	10.91	;
noteFrequencies[	6	] = 	11.56	;
noteFrequencies[	7	] = 	12.25	;
noteFrequencies[	8	] = 	12.98	;
noteFrequencies[	9	] = 	13.75	;
noteFrequencies[	10	] = 	14.57	;
noteFrequencies[	11	] = 	15.43	;
noteFrequencies[	12	] = 	16.35	;
noteFrequencies[	13	] = 	17.32	;
noteFrequencies[	14	] = 	18.35	;
noteFrequencies[	15	] = 	19.45	;
noteFrequencies[	16	] = 	20.6	;
noteFrequencies[	17	] = 	21.83	;
noteFrequencies[	18	] = 	23.12	;
noteFrequencies[	19	] = 	24.5	;
noteFrequencies[	20	] = 	25.96	;
noteFrequencies[	21	] = 	27.5	;
noteFrequencies[	22	] = 	29.14	;
noteFrequencies[	23	] = 	30.87	;
noteFrequencies[	24	] = 	32.7	;
noteFrequencies[	25	] = 	34.65	;
noteFrequencies[	26	] = 	36.71	;
noteFrequencies[	27	] = 	38.89	;
noteFrequencies[	28	] = 	41.2	;
noteFrequencies[	29	] = 	43.65	;
noteFrequencies[	30	] = 	46.25	;
noteFrequencies[	31	] = 	49	;
noteFrequencies[	32	] = 	51.91	;
noteFrequencies[	33	] = 	55	;
noteFrequencies[	34	] = 	58.27	;
noteFrequencies[	35	] = 	61.74	;
noteFrequencies[	36	] = 	65.41	;
noteFrequencies[	37	] = 	69.3	;
noteFrequencies[	38	] = 	73.42	;
noteFrequencies[	39	] = 	77.78	;
noteFrequencies[	40	] = 	82.41	;
noteFrequencies[	41	] = 	87.31	;
noteFrequencies[	42	] = 	92.5	;
noteFrequencies[	43	] = 	98	;
noteFrequencies[	44	] = 	103.83	;
noteFrequencies[	45	] = 	110	;
noteFrequencies[	46	] = 	116.54	;
noteFrequencies[	47	] = 	123.47	;
noteFrequencies[	48	] = 	130.81	;
noteFrequencies[	49	] = 	138.59	;
noteFrequencies[	50	] = 	146.83	;
noteFrequencies[	51	] = 	155.56	;
noteFrequencies[	52	] = 	164.81	;
noteFrequencies[	53	] = 	174.61	;
noteFrequencies[	54	] = 	185	;
noteFrequencies[	55	] = 	196	;
noteFrequencies[	56	] = 	207.65	;
noteFrequencies[	57	] = 	220	;
noteFrequencies[	58	] = 	233.08	;
noteFrequencies[	59	] = 	246.94	;
noteFrequencies[	60	] = 	261.63	;
noteFrequencies[	61	] = 	277.18	;
noteFrequencies[	62	] = 	293.66	;
noteFrequencies[	63	] = 	311.13	;
noteFrequencies[	64	] = 	329.63	;
noteFrequencies[	65	] = 	349.23	;
noteFrequencies[	66	] = 	369.99	;
noteFrequencies[	67	] = 	392	;
noteFrequencies[	68	] = 	415.3	;
noteFrequencies[	69	] = 	440	;
noteFrequencies[	70	] = 	466.16	;
noteFrequencies[	71	] = 	493.88	;
noteFrequencies[	72	] = 	523.25	;
noteFrequencies[	73	] = 	554.37	;
noteFrequencies[	74	] = 	587.33	;
noteFrequencies[	75	] = 	622.25	;
noteFrequencies[	76	] = 	659.26	;
noteFrequencies[	77	] = 	698.46	;
noteFrequencies[	78	] = 	739.99	;
noteFrequencies[	79	] = 	783.99	;
noteFrequencies[	80	] = 	830.61	;
noteFrequencies[	81	] = 	880	;
noteFrequencies[	82	] = 	932.33	;
noteFrequencies[	83	] = 	987.77	;
noteFrequencies[	84	] = 	1046.5	;
noteFrequencies[	85	] = 	1108.73	;
noteFrequencies[	86	] = 	1174.66	;
noteFrequencies[	87	] = 	1244.51	;
noteFrequencies[	88	] = 	1318.51	;
noteFrequencies[	89	] = 	1396.91	;
noteFrequencies[	90	] = 	1479.98	;
noteFrequencies[	91	] = 	1567.98	;
noteFrequencies[	92	] = 	1661.22	;
noteFrequencies[	93	] = 	1760	;
noteFrequencies[	94	] = 	1864.66	;
noteFrequencies[	95	] = 	1975.53	;
noteFrequencies[	96	] = 	2093	;
noteFrequencies[	97	] = 	2217.46	;
noteFrequencies[	98	] = 	2349.32	;
noteFrequencies[	99	] = 	2489.02	;
noteFrequencies[	100	] = 	2637.02	;
noteFrequencies[	101	] = 	2793.83	;
noteFrequencies[	102	] = 	2959.96	;
noteFrequencies[	103	] = 	3135.96	;
noteFrequencies[	104	] = 	3322.44	;
noteFrequencies[	105	] = 	3520	;
noteFrequencies[	106	] = 	3729.31	;
noteFrequencies[	107	] = 	3951.07	;
noteFrequencies[	108	] = 	4186.01	;
noteFrequencies[	109	] = 	4434.92	;
noteFrequencies[	110	] = 	4698.64	;
noteFrequencies[	111	] = 	4978.03	;
noteFrequencies[	112	] = 	5274.04	;
noteFrequencies[	113	] = 	5587.65	;
noteFrequencies[	114	] = 	5919.91	;
noteFrequencies[	115	] = 	6271.93	;
noteFrequencies[	116	] = 	6644.88	;
noteFrequencies[	117	] = 	7040	;
noteFrequencies[	118	] = 	7458.62	;
noteFrequencies[	119	] = 	7902.13	;
noteFrequencies[	120	] = 	8372.02	;
noteFrequencies[	121	] = 	8869.84	;
noteFrequencies[	122	] = 	9397.27	;
noteFrequencies[	123	] = 	9956.06	;
noteFrequencies[	124	] = 	10548.08	;
noteFrequencies[	125	] = 	11175.3	;
noteFrequencies[	126	] = 	11839.82	;
noteFrequencies[	127	] = 	12543.85	;
//top of MIDI tuning range		13289.75	