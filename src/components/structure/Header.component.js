
import { dillx } from "dillx";

import { HeaderLink } from "../../models/HeaderLink.model";

import { redirect } from "../../services/redirect.service";
import { generateRandomNumber, getRGBA } from "../../services/generate-stuff.service";

import { headerStore } from "../../stores/header.store";

import { rate } from "../../data/draw-box.data";
import { headerOffsetPercent } from "../../data/constants.data";
import { siteStore } from "../../stores/site.store";

export const Header = function(){

    this.oninit = function(){
        headerStore.context = this;
        this.headerRotation = generateRandomNumber(-100, 100) / 100;
        const headerColour = generateRandomNumber(125, 175);
        this.headerColour = getRGBA(headerColour, 0.7);
        this.headerBorderColour = getRGBA(headerColour - 25, 0.7);
        this.recurseHeaderWidth();
    };

    this.onchange = function(){
        if (this.drawnHeader) {
            setTimeout(()=>{
                if (this.headerListStyles !== "") {
                    return;
                }
                this.headerListStyles = `
                    width: ${this.headertitlespan.clientWidth}px;
                `;
                this.showHeaderList = true;
                dillx.change(this);
            },0);
        }
    }

    this.headerColour = null;
    this.headerTextColour = "#fff";
    this.headerBorderColour = null;
    this.headerWidth = 0;
    this.headertitlespan = null;
    this.headerListStyles = "";
    this.showHeaderList = false;
    this.headerh1 = null;

    this.recurseHeaderWidth = function(){
        if (this.headerWidth < 110) {
            this.headerWidth += 5;
            dillx.change(this);
            setTimeout(() => this.recurseHeaderWidth(), rate);
        }
        else {
            this.drawnHeader = true;
            dillx.change();
        }
    }

    this.headerStyles = function(){
        return `
            top:${headerOffsetPercent}%;
            width:${this.headerWidth}%;
            background-color:${this.headerColour};
            border-bottom: 2px solid ${this.headerBorderColour};
            color:${this.headerTextColour};
            transform-origin:0% 0%;
            transform:rotate(${this.headerRotation}deg);
        `;
    }

    this.headerIconStyles = function() {
        return `
            right: 85%;
            height: ${this.headerh1.clientHeight}px;
        `;
    }
    this.headerIconPath = "M8,2 L8,5 L15,5 L15,12 L8,12 L8,15 L2,8 Z";

    this.headerLinks = [
        // new HeaderLink("Showcase",["showcase","0"]),
        new HeaderLink("About",["about"]),
        new HeaderLink("Portfolio",["portfolio"],() => {
            const isPortfolio = redirect.path[0] === "portfolio";
            if (isPortfolio && redirect.path.length === 1) {
                return;
            }
            if (!isPortfolio) {
                redirect.path = ["portfolio"]
            }
            else {
                siteStore.urlChange().then(()=>{
                    window.location.hash = "";
                    dillx.change();
                    setTimeout(()=>{
                        window.location.hash = "portfolio";
                        dillx.change();
                    },0);
                });
            }
        }),
        new HeaderLink("Contact",["contact"]),
    ];

    this.back = () => headerStore.back();

    return dillx(
        <header header---="" style-="headerStyles">
            <svg viewBox="0 0 16 16"
                click--="back"
                class="absolute z-index"
                style-="headerIconStyles"
                dill-if={headerStore.showReturnButtonOnHeader}>
                <g class="fade-in">
                    <path d-="headerIconPath" stroke="#808080" fill="none" stroke-width="1px" />
                </g>
            </svg>

            <h1 class="fade-in"
                click--={headerStore.showReturnButtonOnHeader = false, redirect.path = ["showcase","0"]}
                headerh1---=""
                dill-if="drawnHeader">
                <span class="inline-block" headertitlespan---="">Kyenen Radford</span>
            </h1>

            <ul class="fade-in" style-="headerListStyles" dill-if="showHeaderList">
                <li dill-for="headerLinks" click--="onClick">
                    <span>{label}</span>
                </li>
            </ul>
        </header>
    )
}
