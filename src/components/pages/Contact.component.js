
import { dillx } from "dillx";

import { RADIANS } from "coriander";

import { drawLines } from "../../services/draw-lines.service";
import { getRGBA, generateRandomNumber } from "../../services/generate-stuff.service";

import { siteStore } from "../../stores/site.store";

import { Line } from "../../models/Line.model";
import { Polygon } from "../../models/Polygon.model";

import { headerOffsetPercent } from "../../data/constants.data";

const topOffsetPercent = 18;
const strokeWidth = 30;

const emailColour = "lightgrey";

export const Contact = function(){

    this.oninserted = function(){
        this.reload();

        siteStore.urlChange = () => new Promise(resolve => {
            this.formClasses = "fade-out";

            siteStore.clearAllTimeouts();

            drawLines(this,this.lines,this.lines[0].percent,200,()=>{
                this.formClasses = "";
                resolve();
            });


        });
    }

    this.lines = [];
    this.polygons = [];
    this.labels = [];
    this.linesComplete = false;
    this.emailLabelStyles = ``;
    this.emailInputStyles = ``;
    this.formelement = null;
    this.formClasses = "";
    this.timeout = null;

    this.svgStyles = "";

    this.reload = function(){
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        const formWidth = width > 600 ? 600 : width * 0.8;
        const offsetLeft = (width - formWidth) / 2;

/* Find the total height of the header. We cannot draw lines in the header or above it, only below.
    First we add the distance between the top of the screen and the header. This is a percentage of the height of the screen.
    This variable is stored in 'constants' and can be changed by the Dev at any time.*/
    const totalHeaderHeight = headerOffsetPercent * height / 100
    /* We next add the extra height add to the height by being rotated slightly. This rotation is randomly generated once per page load.*/
            + Math.tan(Math.abs(this.headerRotation) / RADIANS) * width
    /* Now we add the height of the header*/
            + this.header.clientHeight;

        const fieldHeight = 50;

        const emailTop = totalHeaderHeight + strokeWidth/2 + 20;
        const subjectTop = emailTop + strokeWidth/2 + 20 + strokeWidth + fieldHeight;
        const messageTop = subjectTop + strokeWidth/2 + 20 + strokeWidth + fieldHeight;
        const baseLineTop = messageTop + strokeWidth/2 + 20 + strokeWidth + fieldHeight * 3;

        this.svgStyles = `height:${baseLineTop + strokeWidth}px;`;

        this.lines.length = 0;

        this.lines.push(
            new Line(
                // 0, height * (topOffsetPercent * 1) / 100,
                // width, height * (topOffsetPercent * 1) / 100 + Math.tan(0 / RADIANS) * width,
                0, emailTop,
                width, emailTop + Math.tan(0 / RADIANS) * width,
                getRGBA(generateRandomNumber(100,120)),
                strokeWidth
            ),
            new Line(
                // 0, height * (topOffsetPercent * 2) / 100,
                // width, height * (topOffsetPercent * 2) / 100 + Math.tan(-1 / RADIANS) * width,
                0, subjectTop,
                width, subjectTop + Math.tan(-1 / RADIANS) * width,
                getRGBA(generateRandomNumber(120,140)),
                strokeWidth
            ),
            new Line(
                // 0, height * (topOffsetPercent * 3) / 100,
                // width, height * (topOffsetPercent * 3) / 100 + Math.tan(-2 / RADIANS) * width,
                0, messageTop,
                width, messageTop + Math.tan(-2 / RADIANS) * width,
                getRGBA(generateRandomNumber(140,160)),
                strokeWidth
            ),
            new Line(
                // 0, height * (topOffsetPercent * 5) / 100,
                // width, height * (topOffsetPercent * 5) / 100 + Math.tan(-3 / RADIANS) * width,
                0, baseLineTop,
                width, baseLineTop + Math.tan(-3 / RADIANS) * width,
                getRGBA(generateRandomNumber(160,180)),
                strokeWidth
            ),
        );

        drawLines(this,this.lines,0,100,()=>{

            // const emailTopLeft = height * (topOffsetPercent * 1) / 100;
            // const subjectTopLeft = height * (topOffsetPercent * 2) / 100 - Math.tan(1 / RADIANS) * offsetLeft;
            // const messageTopLeft = height * (topOffsetPercent * 3) / 100 - Math.tan(2 / RADIANS) * offsetLeft;
            // const baseLineTopLeft = height * (topOffsetPercent * 5) / 100 - Math.tan(3 / RADIANS) * offsetLeft;

            // const subjectTopRight = height * (topOffsetPercent * 2) / 100 - Math.tan(1 / RADIANS) * (offsetLeft + formWidth);
            // const messageTopRight = height * (topOffsetPercent * 3) / 100 - Math.tan(2 / RADIANS) * (offsetLeft + formWidth);
            // const baseLineTopRight = height * (topOffsetPercent * 5) / 100 - Math.tan(3 / RADIANS) * (offsetLeft + formWidth);

            const emailTopLeft = emailTop;
            const subjectTopLeft = subjectTop - Math.tan(1 / RADIANS) * offsetLeft;
            const messageTopLeft = messageTop - Math.tan(2 / RADIANS) * offsetLeft;
            const baseLineTopLeft = baseLineTop - Math.tan(3 / RADIANS) * offsetLeft;

            const subjectTopRight = subjectTop - Math.tan(1 / RADIANS) * (offsetLeft + formWidth);
            const messageTopRight = messageTop - Math.tan(2 / RADIANS) * (offsetLeft + formWidth);
            const baseLineTopRight = baseLineTop - Math.tan(3 / RADIANS) * (offsetLeft + formWidth);

            this.labels.length = 0;

            this.labels.push({
                label: "Email",
                styles: `
                top:${emailTopLeft - strokeWidth / 2}px;
                left:${offsetLeft}px;
                line-height:${strokeWidth}px;
                font-size:${strokeWidth*0.8}px;
            `},{
                label: "Subject",
                styles: `
                top:${subjectTopLeft - strokeWidth / 2}px;
                left:${offsetLeft}px;
                line-height:${strokeWidth}px;
                font-size:${strokeWidth*0.8}px;
                transform-origin:0% 0%;
                transform:rotate(-1deg);
            `},{
                label: "Message",
                styles: `
                top:${messageTopLeft - strokeWidth / 2}px;
                left:${offsetLeft}px;
                line-height:${strokeWidth}px;
                font-size:${strokeWidth*0.8}px;
                transform-origin:0% 0%;
                transform:rotate(-2deg);
            `});

            this.emailInputStyles = `
                top:${emailTopLeft + strokeWidth / 2}px;
                left:${offsetLeft}px;
                width:${formWidth}px;
                height:${subjectTopLeft - emailTopLeft - strokeWidth}px;
                font-size:${strokeWidth*0.8}px;
            `;

            this.subjectInputStyles = `
                top:${subjectTopLeft + strokeWidth / 2}px;
                left:${offsetLeft}px;
                width:${formWidth}px;
                height:${messageTopLeft - subjectTopLeft - strokeWidth}px;
                font-size:${strokeWidth*0.8}px;
                transform-origin:0% 0%;
                transform:skewY(-1deg);
            `;

            this.messageInputStyles = `
                top:${messageTopLeft + strokeWidth / 2}px;
                left:${offsetLeft}px;
                width:${formWidth}px;
                height:${baseLineTopLeft - messageTopLeft - strokeWidth}px;
                font-size:${strokeWidth*0.8}px;
                transform-origin:0% 0%;
                transform:skewY(-2deg);
            `;

            this.polygons.length = 0;

            this.polygons.push(
                new Polygon(`
                    ${offsetLeft},${emailTopLeft + strokeWidth / 2}
                    ${offsetLeft},${subjectTopLeft - strokeWidth / 2}
                    ${offsetLeft + formWidth},${subjectTopRight - strokeWidth / 2}
                    ${offsetLeft + formWidth},${emailTopLeft + strokeWidth / 2}
                `,emailColour),
                new Polygon(`
                    ${offsetLeft},${subjectTopLeft + strokeWidth / 2}
                    ${offsetLeft},${messageTopLeft - strokeWidth / 2}
                    ${offsetLeft + formWidth},${messageTopRight - strokeWidth / 2}
                    ${offsetLeft + formWidth},${subjectTopRight + strokeWidth / 2}
                `,emailColour),
                new Polygon(`
                    ${offsetLeft},${messageTopLeft + strokeWidth / 2}
                    ${offsetLeft},${baseLineTopLeft - strokeWidth / 2}
                    ${offsetLeft + formWidth},${baseLineTopRight - strokeWidth / 2}
                    ${offsetLeft + formWidth},${messageTopRight + strokeWidth / 2}
                `,emailColour),
            );

            this.linesComplete = true;

            dillx.change(this);

            setTimeout(()=>this.formelement.children[0].focus(),0);
        });
    }

    this.lineStyles = function(){
        return `
            stroke:${this.colour};
            stroke-width:${this.strokeWidth}px;
        `;
    }

    this.completeContactForm = function(event){
        event.preventDefault();
    }

    return dillx(
        <>
            <svg class="absolute pinned top right width-full" style-="svgStyles">
                <polygon class="fade-in {formClasses}" points-="points" fill-="fill" dill-for="polygons" />
                <line x1-="x1" y1-="y1" x2-="x2" y2-="y2" style-="lineStyles" dill-for="lines" />
            </svg>
            <ul class="reset-list absolute pinned top right width-full height-full">
                <li class="block absolute snow-text fade-in" style-="styles" dill-for="labels">{label}</li>
            </ul>
            <form class="contact fade-in absolute pinned top right width-full height-full {formClasses}"
                submit--="completeContactForm"
                formelement---=""
                dill-if="linesComplete">
                <input class="absolute" style-="emailInputStyles" />
                <input class="absolute" style-="subjectInputStyles" />
                <textarea class="absolute" style-="messageInputStyles"></textarea>
            </form>
        </>
    )
}
