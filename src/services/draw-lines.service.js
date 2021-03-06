
import { siteStore } from "../stores/site.store";

import { rate } from "../data/draw-box.data";

export const drawLines = (scope, lines, percent, limit, onFinish) => {

// Update the percent of all lines.
    lines.filter(x=>x.percent<limit).forEach(x=>(x.percent += 100/25,x.percent>limit&&(x.percent=limit)));

    const lowestLinePercent = lines.reduce((a,b)=>b.percent<a?b.percent:a,Infinity);

    dillx.change(scope);

    if (lowestLinePercent < limit) {
        const newTimeout = setTimeout(()=>{
            siteStore.timeouts.splice(siteStore.timeouts.indexOf(newTimeout,1));
            drawLines(scope,lines,percent,limit,onFinish);
        },rate);
        siteStore.timeouts.push(newTimeout);
        return;
    }
    onFinish && onFinish();
}
