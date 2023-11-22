
class uiRes
{
    static imagesArray = [];
    static imageFileAt = 0;
    static imagesMap = new Map();
    static fontsMap = new Map(); 
    static colorsMap = new Map(); 
    static referenceMap = new Map(); //this can hold anything really

    //this adds a file to load to the list, you get the resource array index in return
    static addImageFile(name = "",fileName = "")
    {
        //add an entry to the images resourse list. .index stores the array position... .image is available as blank until loaded. .status goes from "pending" to "loading" to "loaded" or "failed"
        var entry = {"index": uiRes.imagesArray.length, "name": name, "file": fileName, "status":"pending", "image":new Image()};
        
        uiRes.imagesMap.set(name,entry.index);
        uiRes.imagesArray.push(entry);
        return entry; //return resource entry structure
    }
    //this triggers the loading. the callback is used to inform when the files are done loading.
    static loadImageFiles(onLoadedCallback)
    {
        //internal functiong for per file callback loop
        function LoadNextImg()
        {
            if(uiRes.imageFileAt < uiRes.imagesArray.length)
            {
                var entry = uiRes.imagesArray[uiRes.imageFileAt];

                entry.status = "loading";
                entry.image.src = entry.file; 
                entry.image.onload = onLoadSuccesImg;
                entry.image.onerror = onLoadErrorImg;
            }
            else
            {
                onLoadedCallback();
            }
        }
        function onLoadErrorImg()
        {
            var entry = uiRes.imagesArray[uiRes.imageFileAt];
            entry.status = "failed";
            entry.image.src = "";
            uiRes.imageFileAt++;
            console.warn("Failed to Load Image",entry.name,entry.fileName);

            LoadNextImg();
        }
        function onLoadSuccesImg()
        {
            var entry = uiRes.imagesArray[uiRes.imageFileAt];
            entry.status = "loaded";
            uiRes.imageFileAt++;
            LoadNextImg();
        }
        LoadNextImg();
    }
   
    //this gets the resource array entry {structure} found by index number (faster) or by name (slower)
    static getImageResource(nameorindex = "")
    {
        if(typeof nameorindex === 'string')
        {
            //return uiRes.imagesArray.find(element => element.name === nameorindex);
            var index = uiRes.imagesMap.get(nameorindex);
            if(index!==undefined)
                return uiRes.imagesArray[index];
        }
        else
        {
            if(nameorindex>= 0 && nameorindex<uiRes.imagesArray.length) 
                return uiRes.imagesArray[nameorindex];
        }
        return null;
    }
    //this gets the .image element from the resource array entry {structure} found by index number (faster) or by name (slower)
    static getImage(nameorindex = "")
    {
        var o = uiRes.getImageResource(nameorindex);
        if(o) o = o.image;
        return o;
    }
     //this gets the resource array index for the specified resource name, array index are faster to use than name
    static getImageResourceIndex(name="")
    {
        var o = uiRes.imagesArray.find(element => element.name === name);
        if(o) o = o.index;
        return o;
    }

    static setFont(name,v)
    {
        uiRes.fontsMap.set(name,v);
    }
    static getFont(name)
    {
        var r = uiRes.fontsMap.get(name);
        if(r === undefined)
            r = name;//uiRes.fontsMap.get("default");
        return r;
    }
    static setColor(name,v)
    {
        uiRes.colorsMap.set(name,v);
    }
    static getColor(name)
    {
        var r = uiRes.colorsMap.get(name);
        if(r === undefined)
            r = name;//uiRes.colorsMap.get("default");
        return r;
    }
    static setReference(name,v)
    {
        uiRes.referenceMap.set(name,v);
    }
    static getReference(name)
    {
        var r = uiRes.referenceMap.get(name);
        if(r === undefined)
            r = name;
        return r;
    }
    
}

uiRes.setFont("default", "12px Arial");
uiRes.setFont("frameTitleFont", "14px Arial");
uiRes.setFont("panelFont", "12px Arial");

uiRes.setColor("default", "black");
uiRes.setColor("frameColor", "gray");
uiRes.setColor("frameLightColor", "lightgray");
uiRes.setColor("frameDarkColor", "darkgray");
uiRes.setColor("fontColor", "black");
uiRes.setColor("panelColor", "lightgray");
uiRes.setColor("frameTitleColor", "silver");
uiRes.setColor("frameTitleTextColor", "black");
uiRes.setColor("panelTextColor", "blue");

uiRes.setReference("default", "default");
uiRes.setReference("frameColor", "frameColor");
uiRes.setReference("frameLightColor", "frameLightColor");
uiRes.setReference("frameDarkColor", "frameDarkColor");
uiRes.setReference("fontColor", "fontColor");
uiRes.setReference("panelColor", "panelColor");
uiRes.setReference("frameTitleColor", "frameTitleColor");
uiRes.setReference("frameTitleTextColor", "frameTitleTextColor");

uiRes.setReference("frameTitleFont", "frameTitleFont");
uiRes.setReference("panelFont", "panelFont");
uiRes.setReference("panelTextColor", "panelTextColor");