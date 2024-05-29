import { select } from "d3-selection";
import { slides } from "../slides/slide";
import "d3-transition";

export const setupObserver = (root: Element, rootMargin: string, elementClass = ".caption", backgroundSelector = ".background") => {
	const elements = [...root.querySelectorAll(elementClass)];
	const background = root.querySelector(`${backgroundSelector}`);
	let previousY = 0;
	let previousRatio = 0;
	let previousScrollDirection: "up" | "down" = "down";
	let previousId = "";
	let currentVisulization: "barChart" | "growingCircle" | null = null;
	let currentSlide: (typeof slides)["0"] | null = null;

	let observerCallback: IntersectionObserverCallback = function (entries, observer) {
		entries.forEach(async (entry, i) => {
			const {
				intersectionRatio: currentRatio,
				isIntersecting,
				boundingClientRect: { y: currentY },
			} = entry;
			const id = entry.target.getAttribute("data-id");
			if (!background || !id) return;
            if (isIntersecting) entry.target.classList.add("active");
			// scroll logic
			if (previousId !== id) {
				if (id in slides) {
					const slide = slides[id as "0" | "1" | "2"];
					currentSlide = slide;
					if (currentVisulization !== slide.visulization) {
						if (slides[previousId] && isIntersecting) slides[previousId].onExit();
                        // prevent slide from initializing multiple times if the scroll is too fast
						if (isIntersecting && !slide.mounted) slide.onInit(select<Element, number[]>(background).select("#viz"));
						currentVisulization = slide.visulization;
					} else {
						// a new slide with the same visulization as previous slide
						slide.onEnter();
					}
				} else {
					currentSlide = null;
				}
				previousId = id;
			} else if (currentY < previousY) {
				previousScrollDirection = "down";
				if (currentRatio > previousRatio && isIntersecting) {
					console.log("Scrolling down enter");
					currentSlide?.onEnterScrollDown(currentRatio);
				} else {
					console.log("Scrolling down leave");
					currentSlide?.onExitScrollDown(currentRatio);
				}
			} else if (currentY > previousY && isIntersecting) {
				previousScrollDirection = "up";
				if (currentRatio < previousRatio) {
					console.log("Scrolling up leave");
					// currentSlide?.onDecrement(currentRatio);
					currentSlide?.onExitScrollUp(currentRatio);
				} else {
					console.log("Scrolling up enter ");
					currentSlide?.onEnterScrollUp(currentRatio);
				}
			}
			if (!isIntersecting) {
				// change styles
                entry.target.classList.remove("active");
			}
			previousY = currentY;
			previousRatio = currentRatio;
		});
	};
	const options: IntersectionObserverInit = {
		root,
		rootMargin,
		threshold: [0, 0.25, 0.35, 0.5, 0.75, 0.85, 1], // think of these as keyframes
	};

	const observer = new IntersectionObserver(observerCallback, options);
	elements.forEach((el) => observer.observe(el));
};
