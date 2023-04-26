
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

    this.strip = {
        x1: "31.9346",
        y1: "104.3906",
        x2: "167.8252",
        y2: "104.3906",
    }

    this.collapsey = "133.34,104.39 166.45,147.66 33.55,104.39 166.45,61.12"

    return dillx(
        <header header---="" style-="headerStyles">
            {/* <svg viewBox="0 0 16 16"
                click--="back"
                class="absolute z-index"
                style-="headerIconStyles"
                dill-if={headerStore.showReturnButtonOnHeader}>
                <g class="fade-in">
                    <path d-="headerIconPath" stroke="#808080" fill="none" stroke-width="1px" />
                </g> 
            </svg>*/}

            <svg viewBox="0 0 200 200"
                click--="back"
                class="absolute z-index"
                style-="headerIconStyles"
                dill-if={headerStore.showReturnButtonOnHeader}>

                <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" dill-extend="strip" >
                    <stop  offset="0" style="stop-color:#FFFFFF"/>
                    <stop  offset="1" style="stop-color:#3F3F3F;stop-opacity:0.2"/>
                </linearGradient>
                <polygon fill="#FFFFFF" stroke="url(#SVGID_1_)" stroke-linecap="round" stroke-miterlimit="10" points-="collapsey"/>
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
