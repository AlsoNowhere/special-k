
import { Store } from "../models/Store.model";

export const siteStore = new Store({

// This value will be changed by the Component that is currently active.
    urlChange: () => new Promise(resolve => resolve()),

    timeouts: [],
    clearAllTimeouts(){
        while(this.timeouts.length > 0){
            clearTimeout(this.timeouts.pop());
        }
    }
});
