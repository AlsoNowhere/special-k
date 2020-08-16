
import { dillx } from "dillx";

import { DrawBox } from "../common/DrawBox.component";

import { redirect } from "../../services/redirect.service";
import { loadImage } from "../../services/load-image.service";
import { drawLines } from "../../services/draw-lines.service";

import { siteStore } from "../../stores/site.store";

// import data from "../../data/test-k-data";
import data from "../../data/k-data";

export const Showcase = function(){

    this.oninit = function(){
        if (redirect.path.length === 1) {
            redirect.path = ["showcase", "0"];
        }
        this.whenChange(parseInt(redirect.path[1]));
    };

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
    this.imageIndex = null;
    this.imgSource = null;
    this.drawOut = true;
    this.containerelement = null;

    this.whenChange = function(index){
        if (index === undefined) {
            this.imageIndex = parseInt(redirect.path[1]);
            this.imageIndex = this.imageIndex === data.showcase.length-1
                ? 0
                : this.imageIndex+1;
        }
        else {
            this.imageIndex = index;
        }
        const url = `dist/images/showcase/${data.showcase[this.imageIndex]}`;

        return new Promise(resolve => {
            if (redirect.path[0] !== "showcase") {
                return resolve(false);
            }
            loadImage(url).then(()=>{
                if (redirect.path[0] !== "showcase") {
                    return resolve(false);
                }
                redirect.path = ["showcase", this.imageIndex];
                this.imgSource = url;
                resolve(true);
                dillx.change(this);
            });
        });
    }

    this.isImgSource = function(){
        return this.imgSource !== null;
    }

    this.imgClass = function(){
        return this.containerelement.clientWidth > this.containerelement.clientHeight ? "width-full" : "height-full";
    }

    this.imgTemplate = dillx(
        <div class="width-full height-full" containerelement---="">
            <img src-="imgSource"
                class="block absolute {imgClass}"
                dill-if="isImgSource" />
        </div>
    );

    return dillx(
        <div>
            <DrawBox template="imgTemplate" whenchange="whenChange" />
        </div>
    )
};
