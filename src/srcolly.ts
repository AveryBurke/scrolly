import { select } from "d3-selection";
import { scrollViz } from "./scrollViz";
import { dispatch } from "d3-dispatch";
import { bisect, ticks } from "d3-array";
import "d3-transition";

export const scrolly = (root: Element) => {
	let activeId = "",
		direction: "up" | "down" = "down",
		missingFrameTolerance = 20;

	const vis = scrollViz().activeId(activeId);

	select("#chart").call(vis);

	// observer progress through the middle 60% of the viewport
	setupProgressObserver(root, "-30% 0px -30% 0px ", 100);
	setupIntersectionObserver(root);

	/** Observers */
	/**
	 * Setup an intersection observer to observe an element's intersection ratio relative to the root
	 * @param root the intersection root. The intersection percentage of each observed element is calculated relative to the root
	 * @param rootMargin the margin within which the intersection is calculated, e.g. "-10% 0px -10% 0px" sets the intersection area to the middle 80% of the root
	 * @param steps the number of steps to divide the intersection ratio
	 * @param elementClass the class of the elements to observe
	 */
	function setupProgressObserver(root: Element, rootMargin: string, steps: number, elementClass = ".step") {
		let previousY = 0,
			previousRatio = 0;

		const elements = [...root.querySelectorAll<HTMLDivElement>(elementClass)];

		const threshold = ((steps: number) =>
			Array(steps + 1)
				.fill(0)
				.map((_, index) => index / steps || 0))(steps);

		const handleProgress: IntersectionObserverCallback = (entries) => {
			entries.forEach((entry) => {
				const {
					isIntersecting,
					intersectionRatio: currentRatio,
					boundingClientRect: { y: currentY },
					target,
				} = entry;

				// if we want to fade elements in and out we can use the intersection ratio
				(target as HTMLDivElement).style.opacity = (currentRatio + .3).toString();

				if (!isIntersecting) return;
				if (!(target as HTMLDivElement).classList.contains("active")) return;


				// Scrolling down/up
				if (currentY < previousY) {
					direction = "down";
					if (currentRatio > previousRatio && isIntersecting) {
						// scrolling down enter
						vis.direction("downInc");
					} else {
						// scrolling down leave
						vis.direction("downDec");
					}
				} else if (currentY > previousY && isIntersecting) {
					direction = "up";
					if (currentRatio < previousRatio) {
						// scrolling up leave
						vis.direction("upDec");
					} else {
						// scrolling up enter
						vis.direction("upInc");
					}
				}

				// Fill in the steps that were passed over in fast scrolling
				const roundedRatio = +(Math.round(+(currentRatio + "e+2")) + "e-2"); // round to 2 decimal place
				const previousRoundedRatio = +(Math.round(+(previousRatio + "e+2")) + "e-2"); // round to 2 decimal place
				const previousBisectIndex = bisect(threshold, previousRoundedRatio); // find the index to the right of the previous ratio
				const currentBisectIndex = bisect(threshold, roundedRatio); // find the index to the right of the current ratio
				const scrollTicks =
					Math.abs(previousBisectIndex - currentBisectIndex) > missingFrameTolerance
						? ticks(previousRoundedRatio, roundedRatio, Math.abs(previousBisectIndex - currentBisectIndex))
						: [roundedRatio]; // find the ticks between the previous and current ratio
				vis.data(scrollTicks);  

				previousY = currentY;
				previousRatio = currentRatio;
			});
		};

		const options: IntersectionObserverInit = {
			rootMargin,
			threshold,
		};

		const observer = new IntersectionObserver(handleProgress, options);
		elements.forEach((el) => observer.observe(el));
	}

	/**
	 * Setup an intersection observer to observe when the top or bottom of an element intersects the vertical center of the viewport
	 * @param root the intersection root. The intersection percentage of each observed element is calculated relative to the root
	 * @param elementClass the class of the elements to observe
	 */
	function setupIntersectionObserver(root: Element, elementClass = ".step") {
		const elements = [...root.querySelectorAll<HTMLDivElement>(elementClass)];
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const { isIntersecting, target, intersectionRatio } = entry;
					if (isIntersecting && activeId !== target.getAttribute("data-id")) {
						root.querySelector<HTMLDivElement>(".active")?.classList.remove("active");
						(target as HTMLDivElement).classList.add("active");
						activeId = target.getAttribute("data-id");
						vis.activeId(activeId);
					}
				});
			},
			{ threshold: 0, rootMargin: "-50% 0px -50% 0px" }
		);
		elements.forEach((el) => observer.observe(el));
	}
};
