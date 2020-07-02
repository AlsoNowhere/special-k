import { Line } from "./Line.model"

export const PortfolioLine = function(){

    this.images = arguments[0];
    this.direction = arguments[1];

    const line = new Line(...[...arguments].slice(2));
    Object.assign(this,line);

    this.drawn = false;

    Object.seal(this);
}
