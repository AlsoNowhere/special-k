
import { dillx } from "dillx";

import { getIntercept, Point as CP, Line as CL, RADIANS } from "coriander";

import { drawBoxStore } from "../../stores/draw-box.store";

import { generateRandomNumber, getRGBA } from "../../services/generate-stuff.service";
import { drawLines } from "../../services/draw-lines.service";
import { whichEverIsGreater, whichEverIsLess } from "../../services/whichever-is.service";

import { Line } from "../../models/Line.model";
import { Polygon } from "../../models/Polygon.model";

import { strokeWidth } from "../../data/draw-box.data";
import { siteStore } from "../../stores/site.store";
import { headerOffsetPercent } from "../../data/constants.data";
import { redirect } from "../../services/redirect.service";

/* This determines how much the lines could be offset by. A varience of 0 will make straight lines. */
let varience = 20;
const generateNewVarience = () => Math.floor(Math.random() * varience * 2) - varience;
/* This determines how long the image stays on the screen before the lines start drawing out. Only applies if this prop for this is true. */
const timeToPauseOnImage = 1000 * 1;

export const DrawBox = function(){

    this.oninserted = function(){

        this.completedDrawing = false;

        setTimeout(() => {
            this.startLines();
        }, 0);
    }

    this.circles = [];

    this.startLines = function(){

        this.polygonPoints = null;
        drawBoxStore.completed = false;

        const width = this.svgelement.clientWidth;
        const height = this.svgelement.clientHeight;

/*
    Find the total height of the header. We cannot draw lines in the header or above it, only below.
    First we add the distance between the top of the screen and the header. This is a percentage of the height of the screen.
    This variable is stored in 'constants' and can be changed by the Dev at any time.
*/
        const totalHeaderHeight = headerOffsetPercent * height / 100
    /* We next add the extra height add to the height by being rotated slightly. This rotation is randomly generated once per page load.*/
            + Math.tan(Math.abs(this.headerRotation) / RADIANS) * width
    /* Now we add the height of the header*/
            + this.header.clientHeight;

        const availableHeight = height - totalHeaderHeight;
        const availableSquare = width < availableHeight ? width : availableHeight;

/* Here we can see which length has overspill (top or left). */
        const isLandscape = width / availableHeight > 1;

        const offsetStart = Math.floor(Math.random() * (
            isLandscape ? width - availableHeight : availableHeight - width
        ));

/* This variable change allows us to set how big the angle can be for rotating the drawn in lines.
The greater then line length and angle the more the resulting square will be cropped. */
        varience = (isLandscape ? width : height) / 100;

        const firstWidth = (isLandscape ? offsetStart : 0) + availableSquare * 0.1;
        const firstHeight = totalHeaderHeight + (isLandscape ? 0 : offsetStart) + availableSquare * 0.1;
        const lastWidth = firstWidth + availableSquare * 0.8;
        const lastHeight = firstHeight + availableSquare * 0.8;





/*
    Where the points are. See the const below.
      _______a__________________________b___________
    |       ||                         ||           |
    |       ||                         ||           |
    |       ||                         ||           |
   h|=======||=========================||===========|c
    |       ||                         ||           |
    |       ||                         ||           |
    |       ||                         ||           |
    |       ||                         ||           |
    |       ||                         ||           |
    |       ||                         ||           |
    |       ||                         ||           |
    |       ||                         ||           |
    |       ||                         ||           |
    |       ||                         ||           |
   g|=======||=========================||===========|d
    |       ||                         ||           |
    |       ||                         ||           |
      _______f__________________________e___________
*/
        const points = {
            a: firstWidth + generateNewVarience(),
            b: lastWidth + generateNewVarience(),
            c: firstHeight + generateNewVarience(),
            d: lastHeight + generateNewVarience(),
            e: lastWidth + generateNewVarience(),
            f: firstWidth + generateNewVarience(),
            g: lastHeight + generateNewVarience(),
            h: firstHeight + generateNewVarience()
        };



/*
    Where the intercepts are. See the const below.
      ______________________________________________
    |       ||                         ||           |
    |       ||                         ||           |
    |       ||A                        ||B          |
    |=======||=========================||===========|
    |       ||                         ||           |
    |       ||                         ||           |
    |       ||                         ||           |
    |       ||                         ||           |
    |       ||                         ||           |
    |       ||                         ||           |
    |       ||                         ||           |
    |       ||                         ||           |
    |       ||                         ||           |
    |       ||D                        ||C          |
    |=======||=========================||===========|
    |       ||                         ||           |
    |       ||                         ||           |
      ______________________________________________
*/
        const intercepts = {
            A:getIntercept(
                new CL( new CP(points.a,0), new CP(points.f,height) ),
                new CL( new CP(0,points.h), new CP(width,points.c) )
            ),
            B:getIntercept(
                new CL( new CP(points.b,0), new CP(points.e,height) ),
                new CL( new CP(0,points.h), new CP(width,points.c) )
            ),
            C:getIntercept(
                new CL( new CP(points.b,0), new CP(points.e,height) ),
                new CL( new CP(0,points.g), new CP(width,points.d) )
            ),
            D:getIntercept(
                new CL( new CP(points.a,0), new CP(points.f,height) ),
                new CL( new CP(0,points.g), new CP(width,points.d) )
            ),
        };

        this.circles.length = 0;
        this.circles.push({ x: intercepts.A.x + strokeWidth / 2, y: intercepts.A.y + strokeWidth / 2 });
        this.circles.push({ x: intercepts.B.x - strokeWidth / 2, y: intercepts.B.y + strokeWidth / 2 });
        this.circles.push({ x: intercepts.C.x - strokeWidth / 2, y: intercepts.C.y - strokeWidth / 2 });
        this.circles.push({ x: intercepts.D.x + strokeWidth / 2, y: intercepts.D.y - strokeWidth / 2 });

        this.lines.length = 0;

        this.lines.push(
            new Line(points.a, 0, points.f, height, getRGBA(generateRandomNumber(150, 200)), strokeWidth),
            new Line(points.b, 0, points.e, height, getRGBA(generateRandomNumber(150, 200)), strokeWidth),
            new Line(0, points.h, width, points.c, getRGBA(generateRandomNumber(150, 200)), strokeWidth),
            new Line(0, points.g, width, points.d, getRGBA(generateRandomNumber(150, 200)), strokeWidth),

            new Line(points.a + strokeWidth / 2, 0, points.f + strokeWidth / 2, height, getRGBA(generateRandomNumber(100, 150)), 2),
            new Line(points.b + strokeWidth / 2, 0, points.e + strokeWidth / 2, height, getRGBA(generateRandomNumber(100, 150)), 2),
            new Line(0, points.h + strokeWidth / 2, width, points.c + strokeWidth / 2, getRGBA(generateRandomNumber(100, 150)), 2),
            new Line(0, points.g + strokeWidth / 2, width, points.d + strokeWidth / 2, getRGBA(generateRandomNumber(100, 150)), 2),
        );

        this.lines[1].percent -= 10;
        this.lines[2].percent -= 20;
        this.lines[3].percent -= 30;

        this.lines[5].percent -= 10;
        this.lines[6].percent -= 20;
        this.lines[7].percent -= 30;

        drawLines(this, this.lines, 0, 100, () => {

            const top = whichEverIsLess(intercepts.A.y, intercepts.B.y);
            const left = whichEverIsLess(intercepts.A.x, intercepts.D.x);

            const templateWidth = whichEverIsGreater(intercepts.B.x, intercepts.C.x) - left;
            const templateHeight = whichEverIsGreater(intercepts.D.y, intercepts.C.y) - top;

            // const strokeHalf = strokeWidth / 2 - 2;

            this.templateStyles = `
                top:${ top + strokeWidth /2 }px;
                left:${ left + strokeWidth / 2 }px;
                width:${ templateWidth - strokeWidth }px;
                height:${ templateHeight - strokeWidth }px;
            `;

            this.polygonPoints = new Polygon(`
                0,0
                ${width},0
                ${width},${height}
                0,${height}
                0,0

                ${intercepts.A.x+strokeWidth/2},${intercepts.A.y+strokeWidth/2}
                ${intercepts.D.x+strokeWidth/2},${intercepts.D.y-strokeWidth/2}
                ${intercepts.C.x-strokeWidth/2},${intercepts.C.y-strokeWidth/2}
                ${intercepts.B.x-strokeWidth/2},${intercepts.B.y+strokeWidth/2}
                ${intercepts.A.x+strokeWidth/2},${intercepts.A.y+strokeWidth/2}
            `).points;

            this.completedDrawing = true;
            this.contentClasses = "show";

// Finish drawing lines
            drawBoxStore.leftSideAngle = Math.atan((intercepts.D.x - intercepts.A.x) / (intercepts.D.y - intercepts.A.y)) * RADIANS;
            drawBoxStore.rightSideAngle = Math.atan((intercepts.C.x - intercepts.B.x) / (intercepts.C.y - intercepts.B.y)) * RADIANS;
            drawBoxStore.minimumWidth = whichEverIsLess(intercepts.B.x - intercepts.A.x, intercepts.C.x - intercepts.D.x)
                - strokeWidth
    // This is the width of the scroll bar on the right.
                - 5;
            drawBoxStore.completed = true;

            dillx.change(this);

            if (this.drawOut === true) {
                this.retainImage();
            }
        });
    }


    this.retainImage = function(){

// Show the image on the page for this long.
        siteStore.timeouts.push(setTimeout(() => {

// Start the animation out of the image. Wait 1 second for image to be drawn out.
            this.contentClasses = "hide";
            siteStore.timeouts.push(setTimeout(() => {

            /* Settings this makes the lines draw out at different times. */
                this.lines[1].percent -= 10;
                this.lines[2].percent -= 20;
                this.lines[3].percent -= 30;

                this.lines[5].percent -= 10;
                this.lines[6].percent -= 20;
                this.lines[7].percent -= 30;

// Start to draw the lines out. Set the line from 100% to 200%.
                drawLines(this, this.lines, 100, 200, () => {
                    const time = Date.now();

// Run the parents function after the image and lines have left.
                    this.whenChange().then(result => {

                    /* This conditional indicates whether to continue or not. */
                        if (!result) {
                            return;
                        }

// Either wait a second or for the next image to load, whichever is longer.
                        if (Date.now() - time > 1000) {
                            this.startLines();
                        }
                        else {
                            siteStore.timeouts.push(setTimeout(() => {
                                this.startLines();
                            }, Date.now() - time));
                        }
                    });
                });
            }, 1000));
        }, timeToPauseOnImage));
    }

    this.clearTimeout = function(){
        clearTimeout(this.timeout);
    }

    this.svgelement = null;

    this.polygonPoints = null;
    this.timeout = null;
    this.templateStyles = "";
    this.completedDrawing = false;
    this.contentClasses = "show";

    this.polygonStyles = "fill:#fbfbfb;";

    this.lineStyles = function(){
        return `
            opacity:0.5;
            stroke:${this.colour};
            stroke-width:${this.strokeWidth}px;
        `;
    }

    return dillx(
        <>
            <div class-="wrapperclasses" style-="boxStyles" dill-if="completedDrawing">
                <div class="absolute {contentClasses}"
                    style-="templateStyles"
                    dill-template="template"></div>
            </div>
            <svg class="draw-box" svgelement---="">
                <polygon points-="polygonPoints" style-="polygonStyles" dill-if={this.polygonPoints !== null} />
                <line x1-="x1" y1-="y1" x2-="x2" y2-="y2" style-="lineStyles" dill-for="lines" />
                {/* <circle cx-="x" cy-="y" r="3" fill="red" dill-for="circles" /> */}
            </svg>
        </>
    )
}
