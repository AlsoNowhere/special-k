
export const drawBoxStore = new function(){
    this.leftSideAngle = 0;
    this.rightSideAngle = 0;
    this.minimumWidth = 0;
    this.completed = false;

    Object.seal(this);
};
