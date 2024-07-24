import { select, Selection } from "d3-selection";
import "d3-transition";

/**
 * initialize a bar chart
 * @example
 * const barChart = barChart().data([1, 2, 3, 4, 5]).width(900).height(200).padding(1).fillColor("steelblue"); // then calling any method on the barChart will update the chart accordingly
 * @returns an updateable bar chart
 */
export function barChart() {
	// All options that should be accessible to caller
	let data: number[] = [],
		width = 900,
		height = 200,
		padding = 1,
		fillColor = "steelblue",
		// update handlers, called when the corresponding value changes
		updateData: () => void,
		updateWidth: () => void,
		updateHeight: () => void,
		updatepadding: () => void,
		updateFillColor: () => void,
		// exit handler
		exit: () => void;

	function chart(selection: Selection<SVGElement, unknown, HTMLElement, any>) {
		selection.each(function () {
			let barSpacing = height / data.length,
				barHeight = barSpacing - padding,
				maxValue = Math.max(...data),
				widthScale = width / maxValue,
				boundingRect = select(this).node()!.getBoundingClientRect();
			let svg = select(this);

			updateData = function () {
				barSpacing = height / data.length;
				barHeight = barSpacing - padding;
				maxValue = Math.max(...data);
				widthScale = width / maxValue;

				const bars = svg.selectAll("path.bar").data(data);
				bars
					.enter()
					.append("path")
					.attr("pointer-events", "all")
					.on("mouseover", function () {
						select(this).transition().duration(200).style("fill", "orange");
					})
					.on("mouseout", function () {
						select(this).transition().duration(200).style("fill", fillColor);
					})
					.attr("class", "bar")
					.attr("d", (d, i) => `M ${boundingRect.width} ${i * barSpacing} h 0 v ${barHeight} h 0 z`)
					.style("fill", fillColor);

				bars.transition().attr("d", (d, i) => `M ${boundingRect.width} ${i * barSpacing} h -${d * widthScale} v ${barHeight} h ${d * widthScale} z`);

				bars
					.exit()
					.transition()
					.attr("d", (d, i) => `M ${boundingRect.width} ${i * barSpacing} h 0 v ${barHeight} h 0 z`)
					.remove();
			};

			updateWidth = function () {
				widthScale = width / maxValue;
				svg
					.attr("width", width)
					.selectAll("path.bar")
					.data(data)
					.transition()
					.attr("d", (d, i) => `M ${boundingRect.width} ${i * barSpacing} h -${d * widthScale} v ${barHeight} h ${d * widthScale} z`);
			};

			updateHeight = function () {
				barSpacing = height / data.length;
				barHeight = barSpacing - padding;
				svg
					.attr("height", height)
					.selectAll("path.bar")
					.data(data)
					.transition()
					.attr("d", (d, i) => `M ${boundingRect.width} ${i * barSpacing} h -${d * widthScale} v ${barHeight} h ${d * widthScale} z`);
			};

			updatepadding = function () {
				barSpacing = height / data.length;
				barHeight = barSpacing - padding;
				svg
					.selectAll("path.bar")
					.data(data)
					.transition()
					.attr("d", (d, i) => `M ${boundingRect.width} ${i * barSpacing} h -${d * widthScale} v ${barHeight} h ${d * widthScale} z`);
			};

			updateFillColor = function () {
				svg.selectAll("path.bar").data(data).transition().style("fill", fillColor);
			};

			exit = function () {
				width = 0;
				updateWidth();
				// data = [];
			};

			//init
			updateData();
			updateData();
		});
	}

	// setter methods

	/**
	 * set and update barchart data
	 * The identity of each bar is determined by the index of the number in the data array
	 * @example
	 * barChart.data([1, 2, 3, 4, 5]); // creates 5 bars with heights 1, 2, 3, 4, 5
	 * barChart.data([2, 3, 1]); // lengthens the frist 2 bars, shortens the 3rd bar and removes the last 2 bars
	 * @param newData each number determins the relative height of a coresponding bar bar
	 * @returns the barChart
	 */
	chart.data = function (newData: number[]) {
		data = newData;
		if (typeof updateData === "function") updateData();
		return chart;
	};

	/**
	 * set and update barchart's width. 
	 * Since this is a horizontal barchart you''ll use this most often 
	 * @param newWidth the width of the barchart
	 * @returns the barChart
	 */
	chart.width = function (newWidth: number) {
		width = newWidth;
		if (typeof updateWidth === "function") updateWidth();
		return chart;
	};

	/**
	 * set and update barchart's height
	 * @param newHeight the height of the barchart
	 * @returns returns the barChart
	 */
	chart.height = function (newHeight: number) {
		height = newHeight;
		if (typeof updateHeight === "function") updateHeight();
		return chart;
	};

	/**
	 * set and update the space between the bars
	 * @param newpadding the padding between bars
	 * @returns the barChart
	 */
	chart.padding = function (newpadding: number) {
		padding = newpadding;
		if (typeof updatepadding === "function") updatepadding();
		return chart;
	};

	/**
	 * set and update the fill color of the bars
	 * @param newFill the fill color of the bars
	 * @returns the barChart
	 */
	chart.fillColor = function (newFill: string) {
		fillColor = newFill;
		if (typeof updateFillColor === "function") updateFillColor();
		return chart;
	};

	/**
	 * remove the barchart from the DOM
	 * @returns the barChart
	 */
	chart.exit = function () {
		if (typeof exit === "function") exit();
	};

	return chart;
}
