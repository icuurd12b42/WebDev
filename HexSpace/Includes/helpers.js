//All code written by me and/with open ai

// Maps a value from one range to another
// curVal: the value to map
// minVal: the minimum value of the input range
// maxVal: the maximum value of the input range
// minReturn: the minimum value of the output range
// maxReturn: the maximum value of the output range
function mapRange(curVal, minVal, maxVal, minReturn, maxReturn) 
{
    // Calculate the ratio of the current value's position within the input range
    const ratio = (curVal - minVal) / (maxVal - minVal);
    
    // Map the ratio to the output range and return the result
    return minReturn + (maxReturn - minReturn) * ratio;
}

// Returns a boolean indicating whether the argument is truthy or falsy
function exists(o) 
{
    return (o!==undefined &&o!==null);
}

// Returns a new index value each time it is called
var referenceindex = 0;
function newID() 
{
    return referenceindex++;
}

// Converts an angle in degrees to radians
function degToRad(a)
{
    return a * (Math.PI/180);
}

// Converts an angle in radians to degrees
function radToDeg(a)
{
    return (a * (180/Math.PI));
}
function radToDeg360(a)
{
    return ((((a * (180/Math.PI)) % 360) + 360) % 360);
}
// Calculates the difference between two angles
// a1: the first angle, in radians
// a2: the second angle, in radians
function angleDiff(a1, a2) 
{
    // Normalize the angles to the range of -pi to pi
    a1 = ((a1 % (2*Math.PI)) + (3*Math.PI)) % (2*Math.PI) - Math.PI;
    a2 = ((a2 % (2*Math.PI)) + (3*Math.PI)) % (2*Math.PI) - Math.PI;

    // Calculate the difference between the two angles
    var diff = a2 - a1;

    // Normalize the difference to the range of -pi to pi
    diff = ((diff % (2*Math.PI)) + (3*Math.PI)) % (2*Math.PI) - Math.PI;

    return diff;
}

// Calculates the difference between two angles, in degrees
// a1: the first angle, in degrees
// a2: the second angle, in degrees
function angleDiffDeg(a1, a2) 
{
    const degToRad = Math.PI / 180;

    // Convert the angles to radians and normalize to the range of -pi to pi
    a1 = ((a1 % 360) + 360) % 360 * degToRad;
    a2 = ((a2 % 360) + 360) % 360 * degToRad;

    // Calculate the difference between the two angles in radians
    var diff = a2 - a1;

    // Normalize the difference to the range of -pi to pi
    diff = ((diff % (2*Math.PI)) + (3*Math.PI)) % (2*Math.PI) - Math.PI;

    // Convert the difference back to degrees and return the result
    return diff / degToRad;
}

// Determines if two shapes, represented as arrays of points, overlap each other
// pos1: the position of the first shape as [x, y] coordinates
// angle1: the angle of the first shape in radians
// shape1: an array of points representing the first shape
// pos2: the position of the second shape as [x, y] coordinates
// angle2: the angle of the second shape in radians
// shape2: an array of points representing the second shape
// shape = [[x1,y1],[x2,y2],...]
function shapesOverlap(pos1, angle1, shape1, pos2, angle2, shape2) {
  // Rotate and translate shape1 and shape2 based on the positions and angles
  const trs1 = transformShape(pos1, angle1, shape1);
  const trs2 = transformShape(pos2, angle2, shape2);

  // Check if any lines of shape1 intersect with any lines of shape2
  for (let i = 0; i < trs1.length; i++) {
    const line1 = [trs1[i], trs1[(i + 1) % trs1.length]];
    for (let j = 0; j < trs2.length; j++) {
      const line2 = [trs2[j], trs2[(j + 1) % trs2.length]];
      if (linesIntersect(line1, line2)) {
        return true;
      }
    }
  }

  // Return false if no lines intersected
  return false;
}

// Resizes a shape and returns a new shape
// scale: The factor of the scale
// shape: an array of points representing the first shape
// shape = [[x1,y1],[x2,y2],...]
function scaleShape(scale,shape)
{
  return shape.map(([x, y]) => [x * scale, y*scale]);
}

// Rotates a shape and returns a new shape
// angle: the angle (as rad)
// shape: an array of points representing the first shape
// shape = [[x1,y1],[x2,y2],...]
function rotateShape(angle, shape) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return shape.map(([x, y]) => [    x * cos - y * sin,
    x * sin + y * cos,
  ]);
}

// Transforms a shape and returns a new shape
// pos: as vector2D or a {x:x,y:y}
// angle: the angle (as rad)
// shape: an array of points representing the first shape
// shape = [[x1,y1],[x2,y2],...]
function transformShape(pos, angle, shape) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return shape.map(([x, y]) => [    x * cos - y * sin + pos.x,
    x * sin + y * cos + pos.y,
  ]);
}

// Figures out if 2 line Segments intersect
// Line1: and array [[x1, y1], [x2, y2]]
// Line2: and array [[x1, y1], [x2, y2]]
//also sets the intersect (NOT TESTED) and closest points (NOT TESTED)
var intersectPoint = new Vector2D();
var closestPoint1 = new Vector2D();
var closestPoint2 = new Vector2D();
function linesIntersect(line1, line2) {
  const [[x1, y1], [x2, y2]] = line1;
  const [[x3, y3], [x4, y4]] = line2;

  const ua =
    ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  const ub =
    ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  const cua = Math.max(0,Math.min(1,ua));
  const cub = Math.max(0,Math.min(1,ub));
  closestPoint1.x = x1 + (x2 - x1) * cua; 
  closestPoint1.y = y1 + (y2 - y1) * cua;
  closestPoint2.x = x3 + (x4 - x3) * cub;
  closestPoint2.y = y3 + (y4 - y3) * cub;
  intersectPoint.x = x1 + (x2 - x1) * ua;
  intersectPoint.y = y1 + (y2 - y1) * ua
  
  
  return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
}
function refractVector(vector, ballCenter, ballRadius, refractiveIndex) {
  /*
  Refracts a 2D vector off a 2D ball.

  Arguments:
  vector -- an array representing a 2D vector [x, y]
  ballCenter -- an array representing the center of the ball [x, y]
  ballRadius -- the radius of the ball
  refractiveIndex -- the refractive index of the ball

  Returns:
  An array representing the refracted vector [x, y].
  */

  const [x, y] = vector;
  const [cx, cy] = ballCenter;

  // Calculate the distance between the vector's origin and the ball's center
  const distanceToCenter = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

  // If the vector doesn't intersect the ball, return the original vector
  if (distanceToCenter >= ballRadius) {
    return vector;
  }

  // Calculate the angle of incidence
  const angleI = Math.atan2(y - cy, x - cx);

  // Calculate the angle of refraction using Snell's law
  const angleR = Math.asin(Math.sin(angleI) / refractiveIndex);

  // Calculate the refracted vector
  const rx = cx + ballRadius * Math.cos(angleR);
  const ry = cy + ballRadius * Math.sin(angleR);

  // Calculate the angle between the refracted vector and the x-axis
  const angleV = Math.atan2(ry - cy, rx - cx);

  // Calculate the magnitude of the refracted vector
  const magnitude = Math.sqrt(x ** 2 + y ** 2);

  // Calculate the x and y components of the refracted vector
  const refractedX = magnitude * Math.cos(angleV);
  const refractedY = magnitude * Math.sin(angleV);

  // Return the refracted vector
  return [refractedX, refractedY];
}


function lerpColor(color1, color2, t) {
  /*
  Lerps between two colors.

  Arguments:
  color1 -- a string representing a CSS color (e.g. "#FF0000")
  color2 -- a string representing a CSS color (e.g. "#00FF00")
  t -- a value between 0 and 1 representing the interpolation amount

  Returns:
  A string representing a CSS color that is a blend of the two colors.
  */

  // Parse the input colors into RGB values
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);

  // Interpolate the RGB values
  const r = lerp(r1, r2, t);
  const g = lerp(g1, g2, t);
  const b = lerp(b1, b2, t);

  // Convert the interpolated RGB values back to a hex color string
  return rgbToHex(r, g, b);
}

function hexToRgb(hex) {
  // Convert a hex color string to RGB values
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToHex(r, g, b) {
  // Convert RGB values to a hex color string
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function lerp(a, b, t) {
  // Linearly interpolate between two values
  return (1 - t) * a + t * b;
}


function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function smoothPoints(points, windowSize) {
  const smoothedPoints = [];
  const halfWindowSize = Math.floor(windowSize / 2);
  
  for (let i = 0; i < points.length; i++) {
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    for (let j = i - halfWindowSize; j <= i + halfWindowSize; j++) {
      if (j >= 0 && j < points.length) {
        sumX += points[j][0];
        sumY += points[j][1];
        count++;
      }
    }
    const averageX = sumX / count;
    const averageY = sumY / count;
    smoothedPoints.push([averageX, averageY]);
  }
  
  return smoothedPoints;
}

function smoothPointsVec2s(points, windowSize) {
  const smoothedPoints = [];
  const halfWindowSize = Math.floor(windowSize / 2);
  
  for (let i = 0; i < points.length; i++) {
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    for (let j = i - halfWindowSize; j <= i + halfWindowSize; j++) {
      if (j >= 0 && j < points.length) {
        sumX += points[j].x;
        sumY += points[j].y;
        count++;
      }
    }
    const averageX = sumX / count;
    const averageY = sumY / count;
    smoothedPoints.push(new Vector2D(averageX, averageY));
  }
  
  return smoothedPoints;
}


function snapToGrid(point, gridSize) {
  point.x = Math.round(point.x / gridSize) * gridSize;
  point.y = Math.round(point.y / gridSize) * gridSize;
  return point;
}


//end AI
