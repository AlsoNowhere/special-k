
export const Line = function(
    x1,
    y1,
    x2,
    y2,
    colour = "lightgrey",
    strokeWidth = 10
){
    this.start = new function LineStart(){
        this.x = x1;
        this.y = y1;

        Object.freeze(this);
    }
    this.end = new function LineEnd(){
        this.x = x2;
        this.y = y2;

        Object.freeze(this);
    }

    this.percent = 0;

    this.x1 = function() { return this.percent <= 100 ? this.start.x : (this.start.x + (this.end.x - this.start.x) * (this.percent-100)/100); }
    this.y1 = function() { return this.percent <= 100 ? this.start.y : (this.start.y + (this.end.y - this.start.y) * (this.percent-100)/100); }

    this.x2 = function() { return this.percent >= 100 ? this.end.x : (this.start.x + (this.end.x - this.start.x) * this.percent/100); }
    this.y2 = function() { return this.percent >= 100 ? this.end.y : (this.start.y + (this.end.y - this.start.y) * this.percent/100); }

    this.colour = colour;
    this.strokeWidth = strokeWidth;

    Object.seal(this);
}
