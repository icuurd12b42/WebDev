//Log.js. By Gilles Page
// mini helper ehance console log
//
class cLog {
    Enabled = false;
    Indent = "";
    numLogs = 0;

    On()
    {
        this.Enabled = true;
    }
    Off()
    {
        this.Enabled = false;
    }
    Push()
    {
        if(this.Enabled) 
            this.Indent += "-";
    }
    Pop()
    {

        if(this.Enabled) 
            if(this.Indent.length>0) 
                this.Indent = this.Indent.substring(0,this.Indent.length-1);
    }

    Write() {
        //this log function can be turned off by Enabled global var
        if(this.Enabled)
        {
            this.numLogs++;
            var a = arguments;
            var pre = this.Indent + " " + this.numLogs;
            switch (arguments.length)
            {
                case 1: console.log(pre,a[0]); break;
                case 2: console.log(pre,a[0],a[1]); break;
                case 3: console.log(pre,a[0],a[1],a[2]); break;
                case 4: console.log(pre,a[0],a[1],a[2],a[3]); break;
                case 5: console.log(pre,a[0],a[1],a[2],a[3],a[4]); break;
            }
            
        }
    }
}
var log = new cLog;