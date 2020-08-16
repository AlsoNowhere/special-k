
import { dillx } from "dillx";

import { RADIANS } from "coriander";

import { DrawBox } from "../common/DrawBox.component";

import { generateRandomNumber, getRGBA } from "../../services/generate-stuff.service";
import { drawLines } from "../../services/draw-lines.service";
import { redirect } from "../../services/redirect.service";
import { whichEverIsLess } from "../../services/whichever-is.service";

import { headerStore } from "../../stores/header.store";
import { siteStore } from "../../stores/site.store";

import { PortfolioLine } from "../../models/PortfolioLine.model";
import { Polygon } from "../../models/Polygon.model";

import { headerOffsetPercent } from "../../data/constants.data";

// import data from "../../data/test-k-data";
import data from "../../data/k-data";

const strokeWidth = 20;
const maxImagesPerRow = 3;
const scrollBarWidth = 5;

const portfolioStore = {
    imagesPerRow: 0
}

export const Portfolio = function(){

    this.oninserted = function(){

        headerStore.back = this.headerBackForPortfolio.bind(this);

        this.polygons.length = 0;
        this.labels.length = 0;
        this.images.length = 0;

        if (redirect.path.length === 3) {
            const fileLocation = redirect.path[1] === "showcase" ? "showcase" : `portfolio/${redirect.path[1]}`;
            this.showPieceUrl = `dist/images/${fileLocation}/`
                + Object.entries(
                    data.portfolio[redirect.path[1]].images
                ).reduce((a, b) => a !== null ? a : b[1] === redirect.path[2].replace(/%20/g, " ") ? b[0] : a, null);
        }
        else {
            this.reload();
        }

        headerStore.showReturnButtonOnHeader = redirect.path.length > 1;
        dillx.change(headerStore.context);

        siteStore.urlChange = () => new Promise(resolve => {
            siteStore.clearAllTimeouts();
            this.fadeClasses = "hide";
            const lines = this.lines.filter(x => x.percent !== 0);
            const lowestLinePercent = lines.reduce((a, b) => b.percent < a ? b.percent : a, Infinity);
            drawLines(this, lines, lowestLinePercent, 200, () => {
                resolve();
            });
        });
    }

    this.onremove = function(){
        headerStore.back = () => {};
    }

    this.path = [];
    this.lines = [];
    this.polygons = [];
    this.labels = [];
    this.images = [];
    this.svgStyles = ``;
    this.wrapperStyles = ``;
    this.highestScrollReached = 0;
    this.containerelement = null;
    this.imageslistelement = null;
    this.imageelement = null;
    this.imagesPerRow = 0;
    this.gap = 0;
    this.imgClass = function(){
        return this.imageelement.clientWidth > this.imageelement.clientHeight ? "width-full" : "height-full";
    }
    this.imgTemplate = dillx(
        <div class="width-full height-full" imageelement---="">
            <img src-="showPieceUrl" class="block middle {imgClass}" />
        </div>
    );
    this.showPieceUrl = "";
    this.fadeClasses = "";

    this.headerBackForPortfolio = function(){
        headerStore.back = () => {};
        siteStore.urlChange().then(() => {
            headerStore.back = this.headerBackForPortfolio.bind(this);
            redirect.path = redirect.path.slice(0, -1);
            headerStore.showReturnButtonOnHeader = redirect.path.length > 1;
            dillx.change(headerStore.context);
            this.reload();
        });
    }

    this.scrollEvent = function(_, element){
        if (this.highestScrollReached < element.scrollTop) {
            const height = document.body.clientHeight;
            this.highestScrollReached = element.scrollTop;
            const lines = this.lines.filter(x => !x.drawn && x.y1() < height + this.highestScrollReached);
            lines.forEach(x => {
                x.drawn = true;
            });
            drawLines(this, lines, 0, 100, () => {
                lines.forEach((line, lineIndex) => {
                    this.addImages(line, lineIndex);
                });
    
                dillx.change(this);
            });
        }
    }

    this.reload = function(){

        this.fadeClasses = "";
        this.polygons.length = 0;
        this.labels.length = 0;
        this.images.length = 0;

        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        const allImages = redirect.path.length === 1
            ? Object.entries(data.portfolio).map(x => ({
                label: x[1].label || x[0],
                target: x[0],
                url: `${x[0]}/${x[1].main}`,
                added: false
            }))
            : Object.entries(data.portfolio[redirect.path[1]].images).map(x => ({
                label: x[1],
                url: `${redirect.path[1]}/${x[0]}`,
                added: false
            }));

/* Changeable stats */
        const rowsPerScreenHeight = Math.ceil( height / 500 );
        this.imagesPerRow = whichEverIsLess(Math.ceil( width / 500 ), maxImagesPerRow);
        portfolioStore.imagesPerRow = this.imagesPerRow;
        const rows = Math.ceil(allImages.length / this.imagesPerRow);

/*
    Find the total height of the header. We cannot draw lines in the header or above it, only below.
    First we add the distance between the top of the screen and the header. This is a percentage of the height of the screen.
    This variable is stored in 'constants' and can be changed by the Dev at any time.
*/
    const totalHeaderHeight = headerOffsetPercent * height / 100
    /* We next add the extra height add to the height by being rotated slightly. This rotation is randomly generated once per page load.*/
            + Math.tan(Math.abs(this.headerRotation) / RADIANS) * width
    /* Now we add the height of the header*/
            + this.header.clientHeight
            + strokeWidth;

        const top = totalHeaderHeight;
        this.gap = (height - top) / rowsPerScreenHeight;
        const heightFromAngle = Math.tan(1 / RADIANS) * width;

        this.highestScrollReached = this.containerelement.scrollTop;

        this.wrapperStyles = `width:${width}px;height:${top + rows * this.gap + heightFromAngle + top}px;`;

        this.lines.length = 0;

        this.lines.push(
            ...Array(rows + 1).fill(null).map((_, i) => new PortfolioLine(
                allImages.slice(i * this.imagesPerRow, (i + 1) * this.imagesPerRow),
                i % 2,
                i % 2 === 0 ? width : 0, top + i * this.gap,
                i % 2 === 1 ? width : 0, top + i * this.gap + heightFromAngle,
                getRGBA(generateRandomNumber(150, 200)),
                strokeWidth
            ))
        );

        const lines = this.lines.filter(x => !x.drawn && x.y1() < height + this.highestScrollReached);
        lines.forEach(x => {
            x.drawn = true;
        });

        drawLines(this, lines, 0, 100, () => {
            lines.forEach((line, lineIndex) => {
                this.addImages(line, lineIndex);
            });

            dillx.change(this);
        });
    }

    this.addImages = function(line, lineIndex){

        const directionIsLeft = line.direction === 1;

        const screenHasScrollBar = this.containerelement.children[0].clientHeight > document.body.clientHeight;

/* This is the width minus the scrollbar if it is there. */
        const screenWidth = screenHasScrollBar
            ? (document.body.clientWidth - scrollBarWidth)
            : document.body.clientWidth;

        line.images.forEach((image, index) => {

/* Find the percentage in that the image is. If images per row is 3 then this will be 0%, 33% 66% */
            const fromSide = screenWidth / this.imagesPerRow * index
/* Add an offset otherwise the image will be drawn at left|right 0%. In the case images per row 3 then 33% * 0.6. In the case images per row 2 then 50% * 0.4. */
            + screenWidth / this.imagesPerRow * 0.2
/* If screen has a scroll bar, factor this in here. */
            // + screenHasScrollBar ? scrollBarWidth : 0;
/* Polygons only use top and left, they can't use right. We can use the following as the left value. */
            const fromSideInverse = screenWidth - fromSide;

/* Get the value of top for where the image will be drawn in. */
            const top = line.y1()
/* We add the change in height as we move down the line. */
            + Math.tan(1 / RADIANS) * fromSide
/* We add half the height of the line because lines grow out from the centre. */
            + strokeWidth / 2;
            const bottom = (line.y1() + this.gap) + Math.tan(1 / RADIANS) * fromSideInverse - strokeWidth / 2;

            const leftOrRight = `${directionIsLeft ? "left" : "right"}:${directionIsLeft ? fromSide : (fromSide + scrollBarWidth)}px;`;
            const itemHeight = bottom - top;

/* This relies on all images being square. */
            const fromSideAlong = fromSide + itemHeight;
            const fromSideAlongInverse = screenWidth - fromSideAlong;

            const topAlong = line.y1() + Math.tan(1 / RADIANS) * fromSideAlong + strokeWidth / 2;
            const bottomAlong = (line.y1() + this.gap) + Math.tan(1 / RADIANS) * fromSideAlongInverse - strokeWidth / 2;

/* Check if line is slanting to the left or to the right. */
            const fromSide_polygon = directionIsLeft ? fromSide : fromSideInverse;
            const fromSideAlong_polygon = directionIsLeft ? fromSideAlong : fromSideAlongInverse;

            const itemStyles = `
                top:${top}px;
                ${leftOrRight}
                height:${itemHeight}px;
            `;

            const fileLocation = image.url.split("/")[0] === "showcase"
                ? image.url
                : `portfolio/${image.url}`;

            this.images.push({
                url: `./dist/${data.target}/${fileLocation}`,
                itemStyles
            });

            this.polygons.push(new Polygon(`
                ${fromSide_polygon},${top}
                ${fromSideAlong_polygon},${topAlong}
                ${fromSideAlong_polygon},${bottomAlong}
                ${fromSide_polygon},${bottom}
            `));

            setTimeout(() => {

                const labelLeft = (directionIsLeft ? fromSide : fromSideInverse)
                + (directionIsLeft ? 0 : -this.imageslistelement.children[this.imagesPerRow * lineIndex + index].children[0].clientWidth)

                const labelTop = line.y1()
                    + Math.tan(1 / RADIANS) * (directionIsLeft ? labelLeft : (screenWidth - labelLeft))
                    - strokeWidth / 2;

                const labelStyles = `
                    top:${labelTop + 2}px;
                    left:${labelLeft}px;
                    line-height:${strokeWidth - 4}px;
                    font-size:${strokeWidth - 4 - 2}px;
                    transform-origin:${directionIsLeft ? 0 : 100}% 0%;
                    transform:rotate(${directionIsLeft ? 1 : -1}deg);
                `;

                this.labels.push({
                    label: image.label,
                    labelStyles
                });

                dillx.change(this);
            }, 100);
        });
    }

    this.lineStyles = function(){
        return `
            stroke:${this.colour};
            stroke-width:${this.strokeWidth}px;
        `;
    }

    this.openShowPiece = function(){
        const image = this.lines[Math.floor(this._index/ this.imagesPerRow)].images[this._index % this.imagesPerRow];
        headerStore.showReturnButtonOnHeader = true;
        siteStore.urlChange().then(()=>{
            redirect.path = [...redirect.path, image.target || image.label];
            if (redirect.path.length === 3) {
                const fileLocation = redirect.path[1] === "showcase" ? "showcase" : `portfolio/${redirect.path[1]}`;
                this.showPieceUrl = `dist/images/${fileLocation}/`
                    + Object.entries(
                        data.portfolio[redirect.path[1]].images
                    ).reduce((a, b) => a !== null ? a : b[1] === redirect.path[2].replace(/%20/g, " ") ? b[0] : a, null);
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
        <div class="portfolio height-full" style="overflow-x:hidden;overflow-y:auto;" scroll--="scrollEvent" containerelement---="">
            <div class="relative" style-="wrapperStyles" dill-if={redirect.path.length !== 3}>
                <ul class="reset-list absolute pinned top right width-full height-full {fadeClasses}" imageslistelement---="">
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

            <DrawBox template="imgTemplate"
                whenchange="whenChange"
                wrapperclasses="fadeClasses"
                dill-if={redirect.path.length === 3} />
        </div>
    )
}
