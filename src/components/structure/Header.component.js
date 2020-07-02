
import { dillx } from "dillx";

import { HeaderLink } from "../../models/HeaderLink.model";

import { redirect } from "../../services/redirect.service";
import { generateRandomNumber, getRGBA } from "../../services/generate-stuff.service";

import { headerStore } from "../../stores/header.store";

const headerOffsetPercent = 5;

export const Header = function(){

    this.oninit = function(){
        headerStore.context = this;
        this.rotation = generateRandomNumber(-100, 100) / 100;
        const headerColour = generateRandomNumber(125, 175);
        this.headerColour = getRGBA(headerColour, 0.7);
        this.headerBorderColour = getRGBA(headerColour - 25, 0.7);

        this.recurseHeaderWidth();
    };

    this.rotation = null;
    this.headerColour = null;
    this.headerTextColour = "#fff";
    this.headerBorderColour = null;
    this.headerWidth = 0;

    this.recurseHeaderWidth = function(){
        if (this.headerWidth < 110) {
            this.headerWidth+=5;
            dillx.change(this);
            setTimeout(()=>this.recurseHeaderWidth(),1000/30);
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
            transform:rotate(${this.rotation}deg);
        `;
    }

    this.headerIconStyles = `
        top:5%;
        left:12%;
        height:90%;
    `;
    this.headerIconPath = "M8,2 L8,5 L15,5 L15,12 L8,12 L8,15 L2,8 Z";

    this.headerLinks = [
        new HeaderLink("Showcase",["showcase","0"]),
        new HeaderLink("About",["about"]),
        new HeaderLink("Portfolio",["portfolio"]),
        new HeaderLink("Contact",["contact"]),
    ];

    this.back = () => headerStore.back();

    return dillx(
        <header header---="" style-="headerStyles">
            <svg viewBox="0 0 16 16" click--="back" class="absolute z-index" style-="headerIconStyles" dill-if="showReturnButtonOnHeader">
                <g class="fade-in">
                    <path d-="headerIconPath" stroke="#808080" fill="none" stroke-width="1px" />
                </g>
            </svg>

            <h1 class="fade-in" dill-if="drawnHeader">
                <span href="#showcase" click--="updateRoute">Kyenen Radford</span>
            </h1>

            <ul class="fade-in" dill-if="drawnHeader">
                <li dill-for="headerLinks" click--={redirect.path[0] !== this.url[0] && (redirect.path = this.url)}>
                    <span>{label}</span>
                </li>
            </ul>
        </header>
    )
}
