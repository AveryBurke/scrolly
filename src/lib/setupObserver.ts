import { select } from "d3-selection";
import { scrollViz } from "../scrollViz";
import { dispatch } from "d3-dispatch";
import { bisect, bisectLeft, bisector, bisectRight } from "d3-array";
import "d3-transition";

/**
 * Setup an intersection observer to observe elements with the given class
 * @param root the intersection root. The intersection percentage of each observed element is calculated relative to the root
 * @param rootMargin the margin within which the intersection is calculated, e.g. "-10% 0px -10% 0px" sets the intersection area to the middle 80% of the root
 * @param steps the number of steps to divide the intersection ratio
 * @param elementClass the class of the elements to observe
 */
export const setupObserver = (root: Element, rootMargin: string, steps: number, elementClass = ".step") => {
	const dispatcher = dispatch("active", "scrollingDownFromTop", "scrollingUpFromBottom", "scrollingDownFromCenter", "scrollingUpFromCenter");
	// const barChartVis = barChart().data(barChartData[0]).width(0);
	const viz = scrollViz();
	select("#chart").call(viz);

	const elements = [...root.querySelectorAll<HTMLDivElement>(elementClass)];
	// console.log(elements)
	let previousY = 0;
	let previousRatio = 0;
	let previousId = "";

	const threshold = ((steps: number) =>
		Array(steps + 1)
			.fill(0)
			.map((_, index) => index / steps || 0))(steps);

	const handleIntersect: IntersectionObserverCallback = (entries) => {
		entries.forEach((entry) => {
			const {
				isIntersecting,
				intersectionRatio: currentRatio,
				boundingClientRect: { y: currentY },
				target,
			} = entry;
			if (!isIntersecting) return;

			const currentId = target.getAttribute("data-id") || "";

			if (currentId !== previousId) viz.activeIndex(currentId);
			// fade the element in and out according to visibility on the screen
			(target as HTMLDivElement).style.opacity = currentRatio.toString();

			// handle fast scrolling. Load the data that has been scrolled past
			const roundedRatio = +(Math.round(+(currentRatio + "e+2")) + "e-2"); // round to 2 decimal place
			const previousRoundedRatio = +(Math.round(+(previousRatio + "e+2")) + "e-2"); // round to 2 decimal place
			const previousBisectIndex = bisect(threshold, previousRoundedRatio); // find the index to the right of the previous ratio
			const currentBisectIndex = bisect(threshold, roundedRatio); // find the index to the right of the current ratio

			// const currentFrame: Frame | null = currentId in frames ? frames[currentId] : null;
			// // Scrolling down/up
			if (currentY < previousY && currentId === previousId) {
				// scrolling down from the top twoard the center of the current element
				if (currentRatio > previousRatio && isIntersecting) {
					console.log("scrolling down from the top twoard the center of fram " + currentId);
					if (threshold[currentBisectIndex - 1] !== roundedRatio) {
						viz.data(threshold.slice(previousBisectIndex - 1, currentBisectIndex));
					} else {
						viz.data([roundedRatio]);
					}
				} else {
					if (threshold[currentBisectIndex - 1] !== roundedRatio) {
						// const data = threshold.slice(currentBisectIndex - 1, previousBisectIndex + 1)
						// console.log('missing bisection', data.reverse())
						viz.data(threshold.slice(currentBisectIndex, previousBisectIndex + 1).reverse());
					} else {
						viz.data([roundedRatio]);
					}
					// scrolling down from the center to the bottom of the current element
					console.log("scrolling down from the center to the bottom of frame " + currentId);
					// the missingbisection is to the left of the current ratio in the reverse threshold
					// console.log(currentId + " Scrolling down leave " + currentRatio);
					// if (currentFrame) currentFrame.onExitToAbove(barChartVis, currentRatio);
				}
			} else if (currentY > previousY && isIntersecting && currentId === previousId) {
				// scrolling up from the center toward the top of the current element
				if (currentRatio < previousRatio) {
					console.log("scrolling up from the center to the top of frame " + currentId);
					if (threshold[currentBisectIndex - 1] !== roundedRatio) {
						// const data = threshold.slice(currentBisectIndex - 1, previousBisectIndex + 1)
						// console.log('missing bisection', data.reverse())
						viz.data(threshold.slice(currentBisectIndex, previousBisectIndex + 1).reverse());
					} else {
						viz.data([roundedRatio]);
					}

					// console.log(currentId + " Scrolling up leave");
					// if (currentFrame) currentFrame.onExitToBelow(barChartVis, currentRatio);
				} else {
					// console.log("scrolling up from the bottom to the center of frame " + currentId);
					// console.log("scrolling down from the top twoard the center of fram " + currentId);
					if (threshold[currentBisectIndex - 1] !== roundedRatio) {
						viz.data(threshold.slice(previousBisectIndex - 1, currentBisectIndex));
					} else {
						viz.data([roundedRatio]);
					}
					// scrolling up from the bottom to the center of the current element

					// console.log(currentId + " Scrolling up enter");
					// if (currentFrame) currentFrame.onEnterFromBelow(barChartVis, currentRatio);
				}
			}
			// // Frame edges
			// if (currentY < previousY && currentId !== previousId) {
			// 	/** scrolling up, corssing previous fame to current frame */
			// 	if (currentRatio > previousRatio) {
			// 		// console.log("crossing while moving up Entering " + currentId + " out of " + previousId);

			// 		// if (previousId in frames) frames[previousId].onCrossingAboveWhileScrollingUp(barChartVis, currentRatio);
			// 		// if (currentFrame) currentFrame.onCrossingBellowWhileScrollingUp(barChartVis, currentRatio);
			// 	// } else {
			// 		// console.log("crossing while moving up Leaving " + previousId + " into " + currentId);
			// 		// leaving out of the top of previous and entering through the bottom of current while scrolling up
			// 		if (previousId in frames) frames[previousId].onCrossingAboveWhileScrollingUp(barChartVis, currentRatio);
			// 		if (currentFrame) currentFrame.onCrossingBellowWhileScrollingUp(barChartVis, currentRatio);
			// 	}
			// 	/** scrolling down, corssing previous fame to current frame */
			// } else if (currentY > previousY && currentId !== previousId) {
			// 		if (previousId in frames) frames[previousId].onCrossingBellowWhileScrollingDown(barChartVis, currentRatio);
			// 		if (currentFrame) currentFrame.onCrossingAboveWhileScrollingDown(barChartVis, currentRatio);
			// 	// if (currentRatio < previousRatio) {
			// 	// 	console.log("Scrolling down corssing into " + currentId + " out of " + previousId);

			// 	// 	if (previousId in frames) frames[previousId].onCrossingBellowWhileScrollingDown(barChartVis, currentRatio);
			// 	// 	if (currentFrame) currentFrame.onCrossingAboveWhileScrollingDown(barChartVis, currentRatio);
			// 	// } else {
			// 	// 	console.log("Scrolling down leave out of " + previousId + " into " + currentId);

			// 	// 	if (previousId in frames) frames[previousId].onCrossingBellowWhileScrollingDown(barChartVis, currentRatio);
			// 	// 	if (currentFrame) currentFrame.onCrossingAboveWhileScrollingDown(barChartVis, currentRatio);
			// 	// }
			// }
			previousId = currentId;
			previousY = currentY;
			previousRatio = currentRatio;
		});
	};
	const options: IntersectionObserverInit = {
		rootMargin,
		threshold,
	};

	const observer = new IntersectionObserver(handleIntersect, options);
	elements.forEach((el) => observer.observe(el));
};
