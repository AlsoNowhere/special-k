
import { define } from "sage";

import { siteStore } from "../stores/site.store";

export const redirect = new function ReDirect(){
    define(
        this,
        "path",
        () => window.location.hash
            .replace("#", "")
            .split("/")
            .filter(x => x !== ""),
        value => {
            if (!(value instanceof Array)) {
                return;
            }
            if (value[0] !== redirect.path[0]) {
                siteStore.urlChange().then(()=>{
                    window.location.hash = value.join("/");
                    setTimeout(()=>dillx.change(siteStore.context),0);
                });
            }
            else {
                window.location.hash = value.join("/");
            }
        }
    )
}
