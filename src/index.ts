// import { scroller } from "./lib/scroller";
import { scrolly } from "./srcolly";
import { SmoothScroll } from "./utils/smoothScroll";
import { setScrollPercent } from "./utils/setScrollPercent";
import "./style.css";

// listen for scroll events and set css variable for parallax effects
window.addEventListener("scroll", setScrollPercent);
window.addEventListener("resize", setScrollPercent);

// listen for load event to initialize the smooth scroll, set the scroll percent and initialize the scroller observer
window.addEventListener("load", () => {
    // smooth the scroll
    new SmoothScroll(document.documentElement, 100, 8);
	// set the scroll percent or any parallax effects
    setScrollPercent();
	scrolly(document.documentElement);
});


