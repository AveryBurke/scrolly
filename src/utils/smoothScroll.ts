// adapted from https://stackoverflow.com/questions/47011055/smooth-vertical-scrolling-on-mouse-wheel-in-vanilla-javascript
/** controle the speed and smoothness of the scolling */
export class SmoothScroll {
	speed: number;
	smooth: number;
	moving = false;
	pos: number;
	frame: Element;
	target: Element;
	/**
	 * @param target the element to scroll
	 * @param speed the number of pixels to per scroll step
	 * @param smooth the smoothness of the scroll, the higher the number the smoother the scroll
	 */
	constructor(target: Document | Element, speed: number, smooth: number) {
		this.speed = speed;
		this.smooth = smooth;
		if (target === document) {
			target = document.scrollingElement || document.documentElement || document.body;
		}
		this.target = target as Element;
		target.addEventListener("wheel", this.scrolled, { passive: false });
		this.frame = target === document.body && document.documentElement ? document.documentElement : (target as Element); // safari is the new IE
		this.pos = this.target.scrollTop;
	}

	scrolled = (e: WheelEvent) => {
		e.preventDefault(); // disable default scrolling
		let delta = this.normalizeWheelDelta(e);
		this.pos += delta * this.speed;
		this.pos = Math.max(0, Math.min(this.pos, this.target.scrollHeight - this.frame.clientHeight)); // limit scrolling
		if (!this.moving) this.update(); // start animation
	};

	/** normalize the wheel delta accross browsers */
	normalizeWheelDelta = (e: WheelEvent) => {
		if (e.detail) {
			if (e.deltaY) return (e.deltaY / e.detail / 40) * (e.detail > 0 ? 1 : -1); // Opera
			else return -e.detail / 3; // Firefox
		} else return e.deltaY / 120; // IE,Safari,Chrome
	};

    /** update the scroll position and animate based on the smooth value */
	update = () => {
		this.moving = true;
		let delta = (this.pos - this.target.scrollTop) / this.smooth;
		this.target.scrollTop += delta;
        // requestAnimationFrame is widely supported and should be cors-browser compatible
		if (Math.abs(delta) > 0.5) window.requestAnimationFrame(this.update);
		else this.moving = false;
	};
}
