
import { dillx } from "dillx";

import { DrawBox } from "../common/DrawBox.component";

import { drawLines } from "../../services/draw-lines.service";

import { drawBoxStore } from "../../stores/draw-box.store";
import { siteStore } from "../../stores/site.store";

import { strokeWidth } from "../../data/draw-box.data";

const AboutContainer = function(){
    return dillx(
        <div class="about" style-="containerStyle">
            <h2 style-="antiSkew">About me</h2>
            <p style-="antiSkew">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p style-="antiSkew">Adipiscing bibendum est ultricies integer. Auctor elit sed vulputate mi sit amet mauris commodo quis. Sed risus pretium quam vulputate dignissim suspendisse. Aliquet nibh praesent tristique magna sit amet purus. Justo nec ultrices dui sapien eget mi proin sed. Amet volutpat consequat mauris nunc congue nisi vitae suscipit. Id volutpat lacus laoreet non curabitur gravida. Placerat orci nulla pellentesque dignissim enim sit amet. Cursus eget nunc scelerisque viverra mauris in aliquam sem fringilla. Sit amet nisl suscipit adipiscing bibendum. Pellentesque habitant morbi tristique senectus et netus et. Euismod lacinia at quis risus sed vulputate odio ut. Eget velit aliquet sagittis id consectetur purus ut faucibus pulvinar. Urna condimentum mattis pellentesque id nibh tortor id aliquet. Proin sed libero enim sed faucibus turpis in eu. Quisque id diam vel quam elementum.</p>
            <p style-="antiSkew">Nisl nunc mi ipsum faucibus. Porta non pulvinar neque laoreet suspendisse interdum consectetur libero. Egestas purus viverra accumsan in nisl nisi scelerisque eu. Cursus risus at ultrices mi tempus. Phasellus vestibulum lorem sed risus ultricies. Lectus quam id leo in vitae. Diam volutpat commodo sed egestas egestas fringilla phasellus faucibus. Eget velit aliquet sagittis id consectetur purus ut. Mi in nulla posuere sollicitudin aliquam ultrices sagittis. Proin libero nunc consequat interdum varius sit amet mattis. Blandit massa enim nec dui nunc mattis enim ut. Amet mattis vulputate enim nulla. Molestie ac feugiat sed lectus vestibulum mattis. Dolor morbi non arcu risus quis varius quam. Quis ipsum suspendisse ultrices gravida dictum fusce ut placerat orci. Id faucibus nisl tincidunt eget nullam non nisi est sit. Diam vulputate ut pharetra sit amet.</p>
        </div>
    )
}

export const About = function(){

    this.oninserted = function(){

        this.wrapperclasses = "";

        siteStore.urlChange = () => new Promise(resolve => {
            siteStore.clearAllTimeouts();
            this.wrapperclasses = "hide";
            const lowestLinePercent = this.lines.reduce((a,b)=>b.percent<a?b.percent:a,Infinity);
            drawLines(this,this.lines,lowestLinePercent,200,()=>{
                resolve();
            });
        });
    }

    this.lines = [];
    this.wrapperclasses = "";
    this.boxStyles = `position:relative;z-index:1;`;

    this.whenChange = function(){
        return new Promise(resolve=>{
            resolve();
        });
    }

    this.containerStyle = () => `
        height:100%;
        padding:7px;
        padding-left:${strokeWidth+7}px;
        overflow-y:auto;
        transform:skew(${drawBoxStore.leftSideAngle}deg);
        transform-origin:0 ${drawBoxStore.leftSideAngle < 0 ? 100 : 0}%;
    `;

    this.antiSkew = () => `transform:skew(${-drawBoxStore.leftSideAngle}deg);`;

    this.isCompleted = () => drawBoxStore.completed;

    this.aboutTemplate = dillx(
        <AboutContainer dill-if="isCompleted" />
    );

    return dillx(
        <div>
            <DrawBox template="aboutTemplate" whenchange="whenChange" />
        </div>
    )
};
