import { BaseType, select, Selection } from "d3-selection";
export function barChart() {
	// All options that should be accessible to caller
	let data: number[] = [],
		width = 900,
		height = 200,
		padding = 1,
		fillColor = "steelblue",
		// update handlers
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
			let svg = select(this).append("g");

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

				bars
					.transition()
					.duration(200)
					.attr("d", (d, i) => `M ${boundingRect.width} ${i * barSpacing} h -${d * widthScale} v ${barHeight} h ${d * widthScale} z`);
	

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
					.transition("width")
					.duration(200)
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
					.duration(200)
					.attr("d", (d, i) => `M ${boundingRect.width} ${i * barSpacing} h -${d * widthScale} v ${barHeight} h ${d * widthScale} z`);
			};

			updatepadding = function () {
				barSpacing = height / data.length;
				barHeight = barSpacing - padding;
				svg
					.selectAll("path.bar")
					.data(data)
					.transition()
					.duration(200)
					.attr("d", (d, i) => `M ${boundingRect.width} ${i * barSpacing} h -${d * widthScale} v ${barHeight} h ${d * widthScale} z`);
			};

			updateFillColor = function () {
				console.log("fillColor", fillColor);
				svg.selectAll("path.bar").data(data).transition().style("fill", fillColor);
			};

			exit = function () {
				svg
					.selectAll("path.bar")
					.data(data)
					.transition("exit")
					.duration(200)
					.attr("d", (d, i) => `M ${boundingRect.width} ${i * barSpacing} h 0 v ${barHeight} h 0 z`)
					.remove()
					.end()
					.then(() => svg.remove());
			};

			//init
			updateData();
			updateData();
		});
	}

	chart.data = function (newData: number[]) {
		data = newData;
		if (typeof updateData === "function") updateData();
		return chart;
	};

	chart.width = function (newWidth: number) {
		width = newWidth;
		if (typeof updateWidth === "function") updateWidth();
		return chart;
	};

	chart.height = function (newHeight: number) {
		height = newHeight;
		if (typeof updateHeight === "function") updateHeight();
		return chart;
	};

	chart.padding = function (newpadding: number) {
		padding = newpadding;
		if (typeof updatepadding === "function") updatepadding();
		return chart;
	};

	chart.fillColor = function (newFill: string) {
		fillColor = newFill;
		if (typeof updateFillColor === "function") updateFillColor();
		return chart;
	};

	chart.exit = function () {
		if (typeof exit === "function") exit();
	};

	return chart;
}
