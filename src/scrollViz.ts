import { Selection, select } from "d3-selection";
import { barChart } from "./visulizations/barChart";
import { barChartData } from "./static/barChartData";
import "d3-transition";
import { functions } from "lodash";

// manage all the visualizations in this presentation
export function scrollViz() {
	// All options that should be accessible to caller
	let data: number[] = [],
		activeFunction = "",
		direction: "downInc" | "downDec" | "upInc" | "upDec" = "downInc",
		updateDirection: () => void,
		// update handlers, called when the corresponding option changes
		updateData: () => void,
		updateActiveId: () => void;

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
					function: barChart().data(barChartData[0]).width(width),
					group: barGroup,
				},
			};
			// init funcitons
			Object.keys(funcitons).forEach((key) => {
				// call the function and append the group to the selection
				funcitons[key as "barChart"].group.call(funcitons[key as "barChart"].function);
			});

			let previousActiveFunction = "";

			
			updateData = function() {
                // console.log('updating data ', data);
				switch (activeFunction) {
					case "barChart":
						switch (direction) {
							case "downInc":
                                console.log('should increase opacity by ', data);
								data.forEach((d) => {
                                    funcitons[activeFunction as "barChart"].group.transition().attr("opacity", d * 100);
								});
								break;
							case "downDec":
								data.forEach((d) => {
									funcitons[activeFunction as "barChart"].function.width(d * width);
								});
								break;
							case "upInc":
								// data.forEach((d) => {
								// 	funcitons[activeFunction as "barChart"].function.width(d * width);
								// });
								break;
							case "upDec":
								data.forEach((d) => {
                                    console.log('should decrease opacity by ', data);
                                    funcitons[activeFunction as "barChart"].group.transition().attr("opacity", d * 100);
								});
								break;
							default:
								break;
						}
						break;
					default:
						break;
				}
			};


			// update the active index and hide the previous active function
			updateActiveId = function() {
				console.log("should switch from ", previousActiveFunction, " to ", activeFunction);
				if (!funcitons[previousActiveFunction as "barChart"]) return;
				if (activeFunction !== previousActiveFunction) {
                    funcitons[previousActiveFunction as "barChart"].function.exit();
					funcitons[previousActiveFunction as "barChart"].group.transition().attr("opacity", 0);
                    funcitons[previousActiveFunction as "barChart"].group.lower();
					activeFunction = previousActiveFunction;
				}
				if (!funcitons[activeFunction as "barChart"]) return;
                funcitons[activeFunction as "barChart"].group.raise();
			};

            updateDirection = function() {
                console.log(direction);
            };

			// helper functions
		});


	}
	// setters

	/** set and update the active function's data array */
	chart.data = function (value: number[]) {
		data = value;
		if (typeof updateData === "function") updateData();
		return chart;
	};
	/** set and update the scroll direction of the active function, this will determin how the active function handles new data */
	chart.direction = function (value: "downInc" | "downDec" | "upInc" | "upDec") {
		direction = value;
		if (typeof updateDirection === "function") updateDirection();
		return chart;
	};
	/** set and update the name of the active function */
	chart.activeId = function (value: string) {
		activeFunction = value;
		if (typeof updateActiveId === "function") updateActiveId();
		return chart;
	};
	return chart;
}
