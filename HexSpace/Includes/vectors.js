//TIP
// ONLY use the _self version AFTER you know your 
// math works by using the regular methods.

//same for using the globals listed at the end.

//Using those globals and the _self when possible
//should technically cost less. 

//However sometimes the math looks right, should work, 
//but does not because soemwhere in the chain of call like
// whatever.somefunc_self().whatnot.somefunc_self(something).norm();
//something stepped on another's toes.

//best use
//whatever.somefunc().whatnot.somefunc(something).norm();
//beforehand and slowly optimize with the use of _self 
//and temp globals after you know it works







class Vector2D {
    set(otherVector)
    {
        this.x = otherVector.x;
        this.y = otherVector.y;
        return this;
    }
    set_self(otherVector) {
        return this.set(otherVector);
    }
    setXY(x,y)
    {
        this.x = x;
        this.y = y;
        return this;
    }
    //////////////////
    add(otherVector) {
        return new Vector2D(
            this.x + otherVector.x,
            this.y + otherVector.y
        );
    }
    add_self(otherVector) {
        this.x += otherVector.x;
        this.y += otherVector.y;
        return this;
    }
    //////////////////
    sub(otherVector) {
        return new Vector2D(
            this.x - otherVector.x,
            this.y - otherVector.y
        );
    }
    subtract(otherVector) {
        return this.sub(otherVector);
    }
    sub_self(otherVector) {
        this.x -= otherVector.x;
        this.y -= otherVector.y;
        return this;
    }
    subtract_self(otherVector) {
        return this.sub_self(otherVector);
    }
    //////////////////
    mul(scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }
    mult(scalar) {
        return this.mul(scalar);
    }
    multiply(scalar) {
        return this.mul(scalar);
    }
    mul_self(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    multiply_self(scalar) {
        return this.mul_self(scalar);
    }
    mult_self(scalar) {
        return this.mul_self(scalar);
    }
    //////////////////
    div(scalar) {
        if (scalar === 0) throw new Error("Division by zero");
        return new Vector2D(this.x / scalar, this.y / scalar);
    }
    divide(scalar) {
        return this.div(scalar);
    }
    div_self(scalar) {
        if (scalar === 0) throw new Error("Division by zero");
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }
    divide_self(scalar) {
        return this.div_self(scalar);
    }
    //////////////////
    norm() {
        var magnitude = this.magnitude();
        if (magnitude === 0) magnitude = 1;
        return new Vector2D(this.x / magnitude, this.y / magnitude);
    }
    normalise() {
        
        return this.norm();
    }
    normalize() {
        
        return this.norm();
    }
    norm_self() {
        var magnitude = this.magnitude();
        if (magnitude === 0) magnitude = 1;

        this.x /= magnitude;
        this.y /= magnitude;

        return this;
    }
    normalise_self() {
        
        return this.norm_self();
    }
    normalize_self() {
        
        return this.norm_self();
    }
    //////////////////
    rotate(angle) //radians!
    {
        const x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        const y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        return new Vector2D(x,y);
    }
    rotate_self(angle) //radians!
    {
        const x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        const y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        this.x = x;
        this.y = y;
        return this;
    }
    //////////////////
    toAngle()
    {
        return Math.atan2(this.y, this.x);
    }
    angle()
    {
        return Math.atan2(this.y, this.x);
    }
    fromAngle_self(angle)
    {
        this.x = Math.cos(angle);
        this.y = Math.sin(angle);
        return this;
    }
    fromAngle(angle)
    {
        return new Vector2D(
            Math.cos(angle),
            Math.sin(angle)
        );
    }
    /////////////////
    dist(otherVector) {
        return this.subtract(otherVector).magnitude();
    }
    distance(otherVector) {
        return this.dist(otherVector);
    }
    length() {
        const m = this.x * this.x + this.y * this.y;
        if(m!==0)
            return Math.sqrt(m);
        return 0;
    }
    magnitude()
    {
        return this.length();
    }
    mag()
    {
        return this.length();
    }
    mag_squared() 
    {
        return this.x * this.x + this.y * this.y;
    }
    magnitude_squared() 
    {
        return this.mag_squared();
    }
    //////////////////
    limit(pScalar) 
    {
        return this.normalise().multiply(Math.min(this.magnitude(), pScalar));
    };
    /////////////////
    dot(otherVector) 
    {
        return (
            this.x * otherVector.x +
            this.y * otherVector.y
        );
    }
    cross(otherVector) 
    {
        return this.x * otherVector.y - this.y * otherVector.x;
    }
    /////////////////
    clone() 
    {
        return new Vector2D(this.x, this.y);
    }
    /////////////////
    snapToGrid_self(size)
    {
        this.x = Math.round(this.x / size) * size;
        this.y = Math.round(this.y / size) * size;
        return this
    }
    constructor(x = 0, y = 0) 
    {
        this.x = x;
        this.y = y;
    }
}
//a few stub for doing math on arbitrary vector without having to waste cycle creating a new one
var vec = new Vector2D(0,0);
var vect = new Vector2D(0,0);

var vec2 = new Vector2D(0,0);
var vec2a = new Vector2D(0,0);
var vec2b = new Vector2D(0,0);
var vec2c = new Vector2D(0,0);
var vec2d = new Vector2D(0,0);
var vec2e = new Vector2D(0,0);
var vec2f = new Vector2D(0,0);
var vec2g = new Vector2D(0,0);

//and all possible typoed variant ARRRGH
var Vec = new Vector2D(0,0);
var Vect = new Vector2D(0,0);

var Vec2 = new Vector2D(0,0);
var Vec2a = new Vector2D(0,0);
var Vec2b = new Vector2D(0,0);
var Vec2c = new Vector2D(0,0);
var Vec2d = new Vector2D(0,0);
var Vec2e = new Vector2D(0,0);
var Vec2f = new Vector2D(0,0);
var Vec2g = new Vector2D(0,0);

var vect2 = new Vector2D(0,0);
var vect2a = new Vector2D(0,0);
var vect2b = new Vector2D(0,0);
var vect2c = new Vector2D(0,0);
var vect2d = new Vector2D(0,0);
var vect2e = new Vector2D(0,0);
var vect2f = new Vector2D(0,0);
var vect2g = new Vector2D(0,0);

var Vect2 = new Vector2D(0,0);
var Vect2a = new Vector2D(0,0);
var Vect2b = new Vector2D(0,0);
var Vect2c = new Vector2D(0,0);
var Vect2d = new Vector2D(0,0);
var Vect2e = new Vector2D(0,0);
var Vect2f = new Vector2D(0,0);
var Vect2g = new Vector2D(0,0);

//this are used in the core functions 
var Vecc2a = new Vector2D(0,0);
var Vecc2b = new Vector2D(0,0);
var Vecc2c = new Vector2D(0,0);
var Vecc2d = new Vector2D(0,0);
var Vecc2e = new Vector2D(0,0);
var Vecc2f = new Vector2D(0,0);
var Vecc2g = new Vector2D(0,0);