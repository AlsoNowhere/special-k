
import { dillx } from "dillx";

import { Header } from "./structure/Header.component";
import { Showcase } from "./pages/Showcase.component";
import { About } from "./pages/About.component";
import { Portfolio } from "./pages/Portfolio.component";

import { redirect } from "../services/redirect.service";
import { Contact } from "./pages/Contact.component";
import { siteStore } from "../stores/site.store";

const routes = [
    "showcase",
    "about",
    "portfolio",
    "contact"
];

export const App = function(){

	this.onpretemplate = () => {
		if (redirect.path.length === 0 || !routes.includes(redirect.path[0])) {
			redirect.path = ["showcase"];
		}
    }

    this.oninit = function(){
        siteStore.context = this;
    }

    this.header = null;
    this.headerRotation = null;
    this.drawnHeader = false;
    this.showShowcase = () => redirect.path[0] === "showcase";
    this.showAbout = () => redirect.path[0] === "about";
    this.showPortfolio = () => redirect.path[0] === "portfolio";
    this.showContact = () => redirect.path[0] === "contact";

    return dillx(
        <>
            <Header />
            <main dill-if="drawnHeader">
                <Showcase dill-if="showShowcase" />
                <About dill-if="showAbout" />
                <Portfolio dill-if="showPortfolio" />
                <Contact dill-if="showContact" />
            </main>
        </>
    )
}
