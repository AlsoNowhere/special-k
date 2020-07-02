
import { dillx } from "dillx";

import { RADIANS } from "coriander";

import { drawLines } from "../../services/draw-lines.service";
import { getRGBA, generateRandomNumber } from "../../services/generate-stuff.service";

import { siteStore } from "../../stores/site.store";

import { Line } from "../../models/Line.model";
import { Polygon } from "../../models/Polygon.model";

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

    this.reload = function(){
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        const formWidth = width > 600 ? 600 : width * 0.8;
        const offsetLeft = (width - formWidth) / 2;

        this.lines.push(
            new Line(
                0, height * (topOffsetPercent * 1) / 100,
                width, height * (topOffsetPercent * 1) / 100 + Math.tan(0 / RADIANS) * width,
                getRGBA(generateRandomNumber(100,120)),
                strokeWidth
            ),
            new Line(
                0, height * (topOffsetPercent * 2) / 100,
                width, height * (topOffsetPercent * 2) / 100 + Math.tan(-1 / RADIANS) * width,
                getRGBA(generateRandomNumber(120,140)),
                strokeWidth
            ),
            new Line(
                0, height * (topOffsetPercent * 3) / 100,
                width, height * (topOffsetPercent * 3) / 100 + Math.tan(-2 / RADIANS) * width,
                getRGBA(generateRandomNumber(140,160)),
                strokeWidth
            ),
            new Line(
                0, height * (topOffsetPercent * 5) / 100,
                width, height * (topOffsetPercent * 5) / 100 + Math.tan(-3 / RADIANS) * width,
                getRGBA(generateRandomNumber(160,180)),
                strokeWidth
            ),
        );

        drawLines(this,this.lines,0,100,()=>{

            const emailTop = height * (topOffsetPercent * 1) / 100;
            const subjectTop = height * (topOffsetPercent * 2) / 100 - Math.tan(1 / RADIANS) * offsetLeft;
            const messageTop = height * (topOffsetPercent * 3) / 100 - Math.tan(2 / RADIANS) * offsetLeft;
            const baseLineTop = height * (topOffsetPercent * 5) / 100 - Math.tan(3 / RADIANS) * offsetLeft;

            const subjectTopAlong = height * (topOffsetPercent * 2) / 100 - Math.tan(1 / RADIANS) * (offsetLeft + formWidth);
            const messageTopAlong = height * (topOffsetPercent * 3) / 100 - Math.tan(2 / RADIANS) * (offsetLeft + formWidth);
            const baseLineTopAlong = height * (topOffsetPercent * 5) / 100 - Math.tan(3 / RADIANS) * (offsetLeft + formWidth);

            this.labels.push({
                label: "Email",
                styles: `
                top:${emailTop - strokeWidth / 2}px;
                left:${offsetLeft}px;
                line-height:${strokeWidth}px;
                font-size:${strokeWidth*0.8}px;
            `},{
                label: "Subject",
                styles: `
                top:${subjectTop - strokeWidth / 2}px;
                left:${offsetLeft}px;
                line-height:${strokeWidth}px;
                font-size:${strokeWidth*0.8}px;
                transform-origin:0% 0%;
                transform:rotate(-1deg);
            `},{
                label: "Message",
                styles: `
                top:${messageTop - strokeWidth / 2}px;
                left:${offsetLeft}px;
                line-height:${strokeWidth}px;
                font-size:${strokeWidth*0.8}px;
                transform-origin:0% 0%;
                transform:rotate(-2deg);
            `});

            this.emailInputStyles = `
                top:${emailTop + strokeWidth / 2}px;
                left:${offsetLeft}px;
                width:${formWidth}px;
                height:${subjectTop - emailTop - strokeWidth}px;
                font-size:${strokeWidth*0.8}px;
            `;

            this.subjectInputStyles = `
                top:${subjectTop + strokeWidth / 2}px;
                left:${offsetLeft}px;
                width:${formWidth}px;
                height:${messageTop - subjectTop - strokeWidth}px;
                font-size:${strokeWidth*0.8}px;
                transform-origin:0% 0%;
                transform:skewY(-1deg);
            `;

            this.messageInputStyles = `
                top:${messageTop + strokeWidth / 2}px;
                left:${offsetLeft}px;
                width:${formWidth}px;
                height:${baseLineTop - messageTop - strokeWidth}px;
                font-size:${strokeWidth*0.8}px;
                transform-origin:0% 0%;
                transform:skewY(-2deg);
            `;

            this.polygons.push(
                new Polygon(`
                    ${offsetLeft},${emailTop + strokeWidth / 2}
                    ${offsetLeft},${subjectTop - strokeWidth / 2}
                    ${offsetLeft + formWidth},${subjectTopAlong - strokeWidth / 2}
                    ${offsetLeft + formWidth},${emailTop + strokeWidth / 2}
                `,emailColour),
                new Polygon(`
                    ${offsetLeft},${subjectTop + strokeWidth / 2}
                    ${offsetLeft},${messageTop - strokeWidth / 2}
                    ${offsetLeft + formWidth},${messageTopAlong - strokeWidth / 2}
                    ${offsetLeft + formWidth},${subjectTopAlong + strokeWidth / 2}
                `,emailColour),
                new Polygon(`
                    ${offsetLeft},${messageTop + strokeWidth / 2}
                    ${offsetLeft},${baseLineTop - strokeWidth / 2}
                    ${offsetLeft + formWidth},${baseLineTopAlong - strokeWidth / 2}
                    ${offsetLeft + formWidth},${messageTopAlong + strokeWidth / 2}
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
            <svg class="absolute pinned top right width-full height-full">
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
