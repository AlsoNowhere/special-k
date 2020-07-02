
import { dillx } from "dillx";

import { RADIANS } from "coriander";

import { DrawBox } from "../common/DrawBox.component";

import { generateRandomNumber, getRGBA } from "../../services/generate-stuff.service";
import { drawLines } from "../../services/draw-lines.service";
import { redirect } from "../../services/redirect.service";

import { headerStore } from "../../stores/header.store";
import { siteStore } from "../../stores/site.store";

import { PortfolioLine } from "../../models/PortfolioLine.model";
import { Polygon } from "../../models/Polygon.model";

// import data from "../../data/test-k-data";
import data from "../../data/k-data";

const strokeWidth = 20;

export const Portfolio = function(){

    this.oninserted = function(){

        headerStore.back = this.headerBackForPortfolio.bind(this);

        this.polygons.length = 0;
        this.labels.length = 0;
        this.images.length = 0;

        if (redirect.path.length === 3) {
            this.showPieceUrl = "dist/images/portfolio/" + redirect.path[1] + "/"
                + Object.entries(
                    data.portfolio[redirect.path[1]].images
                ).reduce((a,b)=>a!==null?a:b[1]===redirect.path[2].replace(/%20/g," ")?b[0]:a,null);
        }
        else {
            this.reload();
        }

        this.showReturnButtonOnHeader = redirect.path.length > 1;
        dillx.change(headerStore.context);

        siteStore.urlChange = () => new Promise(resolve => {

            siteStore.clearAllTimeouts();

            this.fadeClasses = "hide";

            const lines = this.lines.filter(x=>x.percent!==0);
            const lowestLinePercent = lines.reduce((a,b)=>b.percent<a?b.percent:a,Infinity);

            drawLines(this,lines,lowestLinePercent,200,()=>{
                resolve();
            });
        });
    }

    this.onremove = function(){
        headerStore.back = () => {};
    }

    this.lines = [];
    this.polygons = [];
    this.labels = [];
    this.images = [];
    this.svgStyles = ``;
    this.wrapperStyles = ``;
    this.highestScrollReached = 0;
    this.containerelement = null;
    this.imgTemplate = dillx(
        <img src-="showPieceUrl" class="block absolute width-full" />
    );
    this.showPieceUrl = "";
    this.fadeClasses = "";

    this.headerBackForPortfolio = function(){

        headerStore.back = () => {};

        siteStore.urlChange().then(()=>{
            headerStore.back = this.headerBackForPortfolio.bind(this);

            redirect.path = redirect.path.slice(0,-1);

            this.showReturnButtonOnHeader = redirect.path.length > 1;
            dillx.change(headerStore.context);

            this.reload();
        });
    }

    this.scrollEvent = function(_,element){
        if (this.highestScrollReached < element.scrollTop) {
            const height = document.body.clientHeight;
            this.highestScrollReached = element.scrollTop;

            const lines = this.lines.filter(x=>!x.drawn&&x.y1()<height+this.highestScrollReached);
            lines.forEach(x=>{
                x.drawn = true;
            });

            drawLines(this,lines,0,100);
        }
    }

    this.reload = function(){

        this.fadeClasses = "";

        this.polygons.length = 0;
        this.labels.length = 0;
        this.images.length = 0;

        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        const ratio = width/height;

        const allImages = redirect.path.length === 1
            ? Object.entries(data.portfolio).map(x=>({label:x[0],url:`${x[0]}/${x[1].main}`}))
            : Object.entries(data.portfolio[redirect.path[1]].images).map(x=>({label:x[1],url:`${redirect.path[1]}/${x[0]}`}));

        const rows = 7;
        const topOffsetPercent = 20;
        const rowsByScreen = 2;
        const imagesPerRow = 3;
        const heightPerRowPercent = (100 - topOffsetPercent * 2) / rowsByScreen;
        const top = height * topOffsetPercent / 100;
        const gap = height * heightPerRowPercent / 100;
        const heightFromAngle = Math.tan(1 / RADIANS) * width;

        this.highestScrollReached = this.containerelement.scrollTop;

        this.wrapperStyles = `width:${width}px;height:${top + rows * gap + heightFromAngle + top}px;`;

        this.lines.length = 0;

        this.lines.push(
            ...Array(rows + 1).fill(null).map((_, i) => new PortfolioLine(

                allImages.slice(i*imagesPerRow,(i+1)*imagesPerRow),
                i % 2,

                i % 2 === 0 ? width : 0, top + i * gap,
                i % 2 === 1 ? width : 0, top + i * gap + heightFromAngle,
                getRGBA(generateRandomNumber(150,200)),
                strokeWidth
            ))
        );

        const lines = this.lines.filter(x=>!x.drawn&&x.y1()<height+this.highestScrollReached);
        lines.forEach(x=>{
            x.drawn = true;
        });

        drawLines(this,lines,0,100,()=>{
            lines.forEach(line=>{
                line.images.forEach((image,index)=>{

                    const fromSide = width / imagesPerRow * index + width / imagesPerRow * 5 / 100;
                    const fromSideInverse = width - fromSide;
                    const top = line.y1() + Math.tan(1 / RADIANS) * fromSide + strokeWidth / 2;

                    const bottom = (line.y1() + gap) + Math.tan(1 / RADIANS) * fromSideInverse - strokeWidth / 2;

                    const leftOrRight = `${line.direction === 1 ? "left" : "right"}:${fromSide}px;`;
                    const itemHeight = bottom - top;
                    const fromSideAlong = fromSide + itemHeight;
                    const fromSideAlongInverse = width - fromSideAlong;
                    const topAlong = line.y1() + Math.tan(1 / RADIANS) * fromSideAlong + strokeWidth / 2;

                    const bottomAlong = (line.y1() + gap) + Math.tan(1 / RADIANS) * fromSideAlongInverse - strokeWidth / 2;

                    const _fromSide = line.direction === 1 ? fromSide : fromSideInverse;
                    const _fromSideAlong = line.direction === 1 ? fromSideAlong : fromSideAlongInverse;

                    const itemStyles = `
                        top:${top}px;
                        ${leftOrRight}
                        height:${itemHeight}px;
                    `;

                    this.images.push({
                        url:"./dist/images/portfolio/" + image.url,
                        itemStyles
                    });

                    this.polygons.push(new Polygon(`
                        ${_fromSide},${top}
                        ${_fromSideAlong},${topAlong}
                        ${_fromSideAlong},${bottomAlong}
                        ${_fromSide},${bottom}
                    `));

                    this.labels.push({
                        label: image.label,
                        labelStyles: `
                            top:${top-strokeWidth}px;
                            ${leftOrRight}
                            line-height:${strokeWidth}px;
                            font-size:${strokeWidth-2}px;
                            transform-origin:${line.direction === 1 ? 0 : 100}% 0%;
                            transform:rotate(${line.direction === 1 ? 1 : -1}deg);
                        `
                    });
                });
            });

            dillx.change(this);
        });

    }

    this.lineStyles = function(){
        return `
            stroke:${this.colour};
            stroke-width:${this.strokeWidth}px;
        `;
    }

    this.openShowPiece = function(){
        
        this.showReturnButtonOnHeader = true;

        siteStore.urlChange().then(()=>{

            redirect.path = [...redirect.path, this.labels[this._index].label];

            if (redirect.path.length === 3) {
                this.showPieceUrl = "dist/images/portfolio/" + redirect.path[1] + "/"
                    + Object.entries(
                        data.portfolio[redirect.path[1]].images
                    ).reduce((a,b)=>a!==null?a:b[1]===redirect.path[2].replace(/%20/g," ")?b[0]:a,null);
            }

            this.reload();
        });
    }

    this.whenChange = function(){
        return new Promise(resolve=>{
            resolve();
        });
    }

    return dillx(
        <div class="height-full" style="overflow-x:hidden;overflow-y:auto;" scroll--="scrollEvent" containerelement---="">
            <div class="relative" style-="wrapperStyles" dill-if={redirect.path.length !== 3}>
                <ul class="reset-list absolute pinned top right width-full height-full {fadeClasses}">
                    <li class="absolute" style-="itemStyles" dill-for="images">
                        <img src-="url" class="relative height-full fade-in" />
                    </li>
                </ul>
                <svg class="absolute pinned top right width-full height-full" style-="svgStyles">
                    <line x1-="x1" y1-="y1" x2-="x2" y2-="y2" style-="lineStyles" dill-for="lines" />
                </svg>
                <ul class="reset-list absolute pinned top right width-full height-full {fadeClasses}">
                    <li class="absolute fade-in" style-="labelStyles" dill-for="labels">
                        <span class="snow-text">{label}</span>
                    </li>
                </ul>
                <svg class="portfolio absolute pinned top right width-full height-full {fadeClasses}" style-="svgStyles">
                    <polygon points-="points" click--="openShowPiece" dill-for="polygons" />
                </svg>
            </div>

            <DrawBox template="imgTemplate" whenchange="whenChange" wrapperclasses="fadeClasses" dill-if={redirect.path.length === 3} />
        </div>
    )
}
