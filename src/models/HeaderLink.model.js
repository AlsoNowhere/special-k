
import { redirect } from "../services/redirect.service";

import { headerStore } from "../stores/header.store";

export const HeaderLink = function(
    label,
    url,
    onClick = () => {
        headerStore.showReturnButtonOnHeader = false;
        redirect.path[0] !== url[0] && (redirect.path = url);
    }
){
    this.label = label;
    this.url = url;
    this.onClick = onClick;
}
