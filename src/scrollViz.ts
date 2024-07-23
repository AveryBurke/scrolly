import { Selection, select } from "d3-selection";
import { barChart } from "./visulizations/barChart";
import { barChartData } from "./static/barChartData";
import "d3-transition";

/**
 * Create a pizza chart
 * @returns a pizza chart
 */
// manage all the visualizations in this presentation
export function scrollViz() {
	// All options that should be accessible to caller
	let data: number[] = [],
		activeFunction: string,
		// update handlers, called when the corresponding option changes
		updateData: () => void,
		updateActiveIndex: () => void;

	function chart(selection: Selection<SVGElement, unknown, HTMLElement, any>) {
		selection.each(function () {
			const { width, height } = select(this).node()!.getBoundingClientRect();

            // setup functions and associated groups
			const barGroup = select(this)
				.append("g")
				.attr("class", "bar-group")
				.attr("transform", `translate(${width}, ${height / 2})`)
				.attr("opacity", 0);
            
            
			let funcitons = {
				barChart: {
					function: barChart().data(barChartData[0]).width(0),
					group: barGroup,
				},
			};
            // init funcitons
			Object.keys(funcitons).forEach((key) => {
                // call the function and append the group to the selection
                funcitons[key as "barChart"].group.call(funcitons[key as "barChart"].function);
            });

			let previousActiveFunction = "";

			// iterte over the data and apply the data to the active function
			updateData = () => {
				if (!funcitons[activeFunction as "barChart"]) return;
				data.forEach((d, i) => {
					funcitons[activeFunction as "barChart"].function.width(width * d);
				});
			};
			// update the active index and hide the previous active function
			updateActiveIndex = () => {
                console.log(activeFunction, previousActiveFunction)
                if (!funcitons[previousActiveFunction as "barChart"]) return;
				if (activeFunction !== previousActiveFunction) {
					// hide the current active function beofre switching to the next
					// hide the previous active function
					// show the current active function
					funcitons[previousActiveFunction as "barChart"].group.transition().duration(100).attr("opacity", 0);
					funcitons[previousActiveFunction as "barChart"].function.exit();
					activeFunction = previousActiveFunction;
				}
                if (!funcitons[activeFunction as "barChart"]) return;
                funcitons[activeFunction as "barChart"].group.transition().duration(100).attr("opacity", 100);
			};

			// helper functions
		});
	}
	// setters

	/** set and update the active function's data array */
	chart.data = function (value: number[]) {
		if (typeof updateData === "function") updateData();
		data = value;
		return chart;
	};

	/** set and update the name of the active function */
	chart.activeIndex = function (value: string) {
		if (typeof updateActiveIndex === "function") updateActiveIndex();
		activeFunction = value;
		return chart;
	};
	return chart;
}
