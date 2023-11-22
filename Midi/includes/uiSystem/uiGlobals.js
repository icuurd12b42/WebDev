//Global helper functions and variables used by the system

//this is used to genarate unique id for each element instance
class uig {
    //static IDAt = 0;
    //static newID() {return uig.idAt++}
    static newID() {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0];
    }
    


    //credit https://www.jscodetips.com/index.php/examples/js-recursive-object-assign
    static isObject(item) 
    {
        //tells if item is an object
        return (item && typeof item === 'object' && !Array.isArray(item));
    }
    //credit https://www.jscodetips.com/index.php/examples/js-recursive-object-assign  
    static assignRecursive(target, ...sources) 
    {
        //FLAW debugging setStyles, Cannot use an object ast a style value...
    //recursive Object.assign, for objects in objects in objects, like in the case of the styles in the uiObjects
        if (!sources.length) return target;
        const source = sources.shift();
        //use the name property to make sure the object is not a ui onbject
        if (uig.isObject(target) && uig.isObject(source)) 
        {   
            for (const key in source) 
            {
                if (uig.isObject(source[key])) 
                {
                    if (!target[key]) 
                    { 
                        Object.assign(target, { [key]: {} });
                    }
                    else
                    {          
                        target[key] = Object.assign({}, target[key])
                    }
                    uig.assignRecursive(target[key], source[key]);
                } 
                else 
                {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        return uig.assignRecursive(target, ...sources);
    }
    static callIfDefined(fn,e)
    {
        if(fn!=null) return fn(e);
    }
    static lerp (start, end, amt)
    {
        return (1-amt)*start+amt*end;
    }
    static clamp(min,max,val)
    {
        return Math.min(Math.max(val, min), max);
    }
    static bias(v,b)
    {
        return v / ((1 / b - 2) * (1 - v) + 1);
    }
    
    static findByName(o,name)
    {
        var at = o.parent;
        while( at !==null)
        {
            if(at.name == name)
            {
                return at;
            }
            else
            {
                for (var i = 0; i< at.children.length; i++)
                {
                    if(at.children[i].name == name)
                    {
                        return at.children[i];
                    }
                }
            }
            at = at.parent;
        }
        return null;
    }
    static findByID(o,ID)
    {
        var at = o.parent;
        while( at !==null)
        {
            if(at.id == ID)
            {
                return at;
            }
            else
            {
                for (var i = 0; i< at.children.length; i++)
                {
                    if(at.children[i].id == ID)
                    {

                        return at.children[i];
                    }
                }
            }
            at = at.parent;
        }
        return null;
    }
    static mapRegionXY(o)
    {
        var x = o.region.x;
        var y = o.region.y;
        var at = o.parent;
        while (at !== null)
        {
            x+=at.region.x;
            y+=at.region.y;
            at = at.parent;
        }
        return {x:x,y:y,w:o.region.w,h:o.region.h};
    }
    static mapYToScreen(o,_y)
    {
        var y = _y+o.region.y;
        var at = o.parent;
        while (at !== null)
        {
            y+=at.region.y;
            at = at.parent;
        }
        return screenY;
    }
    static numberTo2Dec(num)
    {
        return (Math.round(num * 100) / 100).toFixed(2);
    }
    static setAncestorTopMost(o,name)
    {
        
        var mainFrame = o;
        if(o.name != name)
            mainFrame = uig.findByName(o,name);

        if(mainFrame !== null)
            mainFrame.setTopMost();
    }
}


