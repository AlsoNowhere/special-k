
import { Store } from "../models/Store.model";

export const siteStore = new Store({
    urlChange: () => new Promise(resolve => resolve()),
    timeouts: [],
    clearAllTimeouts(){
        while(this.timeouts.length > 0){
            clearTimeout(this.timeouts.pop());
        }
    }
});
