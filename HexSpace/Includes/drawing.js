"use strict";
//context, x, y, width, height, color, pen size
function drawRectangleFrame(ctx, x, y, w, h, c, ps) 
{
    ctx.beginPath();
    ctx.lineWidth = ps;
    ctx.strokeStyle = c;
    ctx.rect(x, y, w, h);
    ctx.stroke();
}
function drawCircleFrame(ctx, x, y, r, c, ps) {
    ctx.beginPath();
    ctx.lineWidth = ps;
    ctx.strokeStyle = c;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
}
function drawLine(ctx, x1, y1, x2, y2, c, ps) 
{
    ctx.beginPath();
    ctx.lineWidth = ps;
    ctx.strokeStyle = c;
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}

function drawShape(ctx, x, y, shape, c, ps) 
{
    ctx.beginPath();
    ctx.lineWidth = ps;
    ctx.strokeStyle = c;
    for(var i = 0; i< shape.length; i++)
    {
        var point = shape[i];
        if(i !== 0) 
            ctx.lineTo(x+point[0],y+point[1]);
        else
            ctx.moveTo(x+point[0],y+point[1]);
    }
    ctx.stroke();
}


//arrow from - to at size s color c and pen size ps
function drawArrow(ctx, x1, y1, x2, y2, s, c, ps) {
    // Calculate the angle between the two points
    const angle = Math.atan2(y2 - y1, x2 - x1);
  
    // Set the line properties
    ctx.lineWidth = ps;
    ctx.strokeStyle = c;
  
    // Draw the arrow line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  
    // Draw the arrowhead
    ctx.beginPath();
    ctx.moveTo(x2 + s * Math.cos(angle), 
        y2 + s * Math.sin(angle));
    ctx.lineTo(x2 - s * Math.cos(angle - Math.PI / 6), y2 - s * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - s * Math.cos(angle + Math.PI / 6), y2 - s * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = c;
    ctx.fill();
  }

//context, x, y, radius, color, pen size
function drawHexagonFrame(ctx, x, y, r, c, ps) 
{
    var h = r * Math.sqrt(3);
    ctx.strokeStyle = c;
    ctx.lineWidth = ps;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + r / 2, y + h / 2);
    ctx.lineTo(x - r / 2, y + h / 2);
    ctx.lineTo(x - r, y);
    ctx.lineTo(x - r / 2, y - h / 2);
    ctx.lineTo(x + r / 2, y - h / 2);
    ctx.closePath();
    ctx.stroke();
}
