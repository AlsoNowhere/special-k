
import { Store } from "../models/Store.model";

// When a new Component is inserted it will change the value of this function.
export const headerStore = new Store({
    back(){},
    showReturnButtonOnHeader: false
});
