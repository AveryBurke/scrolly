import { select } from "d3-selection";
import { slides } from "../slides/slide";
import "d3-transition";
import { throttle } from "lodash";

export const setupObserver = (root: Element, rootMargin: string, elementClass = ".caption", backgroundSelector = ".background") => {
	const elements = [...root.querySelectorAll<HTMLDivElement>(elementClass)];
	const background = root.querySelector(`${backgroundSelector}`);
	let previousY = 0;
	let previousRatio = 0;
	let previousScrollDirection: "up" | "down" = "down";
	let previousId = "";
	let currentVisulization: Chart | null = null;
	let currentSlide: (typeof slides)["0"] | null = null;

	let observerCallback: IntersectionObserverCallback = function (entries, observer) {
		console.log("entries", entries);
		entries.forEach(async (entry, i) => {
			const {
				intersectionRatio: currentRatio,
				isIntersecting,
				boundingClientRect: { y: currentY },
			} = entry;
			const id = entry.target.getAttribute("data-id");
			if (!id) return;
			if (isIntersecting) entry.target.classList.add("active");
			// scroll logic
			if (isIntersecting) {
				if (id === "0") (entry.target as HTMLDivElement).style.opacity = "1";
				if (id !== "0") (entry.target as HTMLDivElement).style.opacity = entry.intersectionRatio.toString();
				if (currentY < previousY) {
					previousScrollDirection = "down";
					if (currentRatio > previousRatio && isIntersecting) {
						console.log(id + " Scrolling down enter");
						currentSlide?.onEnterScrollDown(currentRatio);
					} else {
						console.log(id + " Scrolling down leave");
						currentSlide?.onExitScrollDown(currentRatio);
					}
				} else if (currentY > previousY && isIntersecting) {
					previousScrollDirection = "up";
					if (currentRatio < previousRatio) {
						console.log(id + " Scrolling up leave");
						// currentSlide?.onDecrement(currentRatio);
						currentSlide?.onExitScrollUp(currentRatio);
					} else {
						console.log(id + " Scrolling up enter ");
						currentSlide?.onEnterScrollUp(currentRatio);
					}
				}
			} else {
				(entry.target as HTMLDivElement).style.opacity = "0";
			}
			previousY = currentY;
			previousRatio = currentRatio;
		});
	};
	const options: IntersectionObserverInit = {
		rootMargin,
		threshold: [0, 0.25, 0.35, 0.5, 0.75, 0.85, 1], // think of these as keyframes
	};

	const observer = new IntersectionObserver(observerCallback, options);
	elements.forEach((el) => observer.observe(el));
};
