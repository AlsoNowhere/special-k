
import { dillx } from "dillx";

import { App } from "./components/App.component";
import { siteStore } from "./stores/site.store";
import { redirect } from "./services/redirect.service";

const Data = function(){
    this.onpretemplate = function(){
        let timeout;
        window.addEventListener("resize", () => {
            clearTimeout(timeout);
            timeout = setTimeout(()=>{
                siteStore.urlChange().then(()=>{
                    const cut = redirect.path.slice();
                    redirect.path = [];
                    setTimeout(()=>{
                        redirect.path = [...cut];
                    },0);
                });
            },300);
        });
    }
};

dillx.create(document.body,Data,dillx(
    <App />
));
