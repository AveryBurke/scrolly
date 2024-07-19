import { scroller } from "./lib/scroller";
import { SmoothScroll } from "./utils/smoothScroll";
import { setScrollPercent } from "./utils/setScrollPercent";
import "./style.css";


window.addEventListener("scroll", setScrollPercent);
window.addEventListener("load", () => {
    // smooth the scroll
    new SmoothScroll(document.documentElement, 120, 15);
	// set the scroll percent or any parallax effects
    setScrollPercent();
    // initialize the scroller observer
	scroller();
});
window.addEventListener("resize", setScrollPercent);
