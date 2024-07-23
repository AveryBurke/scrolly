import { setupObserver } from "./setupObserver";
import { dispatch } from "d3-dispatch";

export function scroller() {
	const root = document.body;
	if (!root) {
		throw new Error("No root element found");
	}
	// set the root the body element, the intersection for 80% of the screen height and 5 steps per element intersection

	setupObserver(root, "-35% 0px -35% 0px ", 10);
	const dispatcher = dispatch("scroll", "active");
}
