
export const Polygon = function(
    points,
    fill = "#444"
){
    this.points = points;
    this.fill = fill;

    Object.freeze(this);
}
