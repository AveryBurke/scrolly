import { select, Selection, BaseType } from "d3-selection";
import "d3-transition";
export function createCircle() {
	let radius = 50,
		precent = 0,
		fill = "none",
		updatePercent: () => void,
		updateFill: () => void,
		exit: () => void;
	function circle(selection: Selection<BaseType, unknown, null, undefined>) {
		selection.each(function () {
			const svg = select(this);
			const boudnigRect = (select(this).node() as SVGAElement).getBoundingClientRect();
			svg
				.selectAll("*")
				.remove()

			const circleData = svg
				.selectAll(".custom-circle")
				.data([precent]);

			circleData
				.enter()
				.append("circle")
				.attr("class", "custom-circle")
				.attr("transform", `translate(${boudnigRect.width / 2},${boudnigRect.height / 2})`)
				.attr("r", (d) => +(d.toFixed(2)) * (Math.min(boudnigRect.width, boudnigRect.height) / 2))
				.attr("fill", "green");

			updatePercent = function () {
				const circleData = svg
				.selectAll(".custom-circle")
				.data([precent])

				circleData
					.transition()
					.duration(200)
					.attr("r", (d) => +(d.toFixed(2)) * (Math.min(boudnigRect.width, boudnigRect.height) / 2))
			};

			updateFill = function () {
				svg.select("circle").transition().duration(200).attr("fill", fill);
			};

			exit = function () {
				svg.selectAll(".custom-circle")
					.transition("exit")
					.duration(200)
					.attr("r", 0)
					.remove();
			};
		});
	}

	circle.radius = function (newRadius: number) {
		radius = newRadius;
		return circle;
	};

	circle.percent = function (newPercent: number) {
		precent = newPercent;
		if (typeof updatePercent === "function") updatePercent();
		return circle;
	};
	circle.fill = function (newFill: string) {
		fill = newFill;
		if (typeof updateFill === "function") updateFill();

		return circle;
	};
	circle.exit = function () {
		if (typeof exit === "function") exit();
	};
	return circle;
}
