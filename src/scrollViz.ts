import { Selection, select } from "d3-selection";
import { functions } from "./functions";
import "d3-transition";
import { barChart } from "./visulizations/barChart";
import { exit } from "process";
import { findSourceMap } from "module";

// manage all the visualizations in this presentation
export function scrollViz() {
	// All options that should be accessible to caller
	let data: number[] = [],
		activeFunction = "",
		direction: "downInc" | "downDec" | "upInc" | "upDec" = "downInc",
		scroll: number[] = [],
		// update handlers, called when the corresponding option changes
		updateScroll: () => void,
		updateDirection: () => void,
		updateData: () => void,
		updateActiveId: () => void;

	function chart(selection: Selection<SVGElement, unknown, HTMLElement, any>) {
		selection.each(function () {
			const { width, height } = select(this).node()!.getBoundingClientRect();
			let previousActiveFunction = "";

			// initalize funcitons
			Object.keys(functions).forEach((key) => {
				const { function: func, needsInit } = functions[key];
				if (!needsInit) return;
				functions[key].function = functions[key].function.width(width).height(height);
				select(this).append("g").attr("id", functions[key].groupId).attr("opacity", 0).call(func);
				functions[key].needsInit = false;
			});

			// controlers

			const controlers = {
				barChart: {
					scroll: () => {
						switch (direction) {
							case "downInc":
								scroll.forEach((tick) => {
									select(`#${functions.barChart.groupId}`).transition().attr("opacity", tick);
								});
								break;
							case "downDec":
								// do something
								break;
							case "upInc":
								// do something
								break;
							case "upDec":
								// do something
								break;
							default:
								break;
						}
					},
					enter: (direction: "up" | "down") => {
						switch (direction) {
							case "down":
								// do something
								break;
							case "up":
								break;
							default:
								break;
						}
					},
					exit: (direction: "up" | "down") => {
						switch (direction) {
							case "down":
								// do something
								break;
							case "up":
								// do something
								break;
							default:
								break;
						}
					},
				},
			};

			// update handlers
			updateData = function () {};

			updateScroll = function () {
				if (controlers[activeFunction as "barChart"]) {
					controlers[activeFunction as "barChart"].scroll();
				}

				// update the activate new function and hide the previous active function
				updateActiveId = function () {
					console.log("should switch from ", previousActiveFunction, " to ", activeFunction);
					if (activeFunction !== previousActiveFunction) {
						if (functions[previousActiveFunction as "barChart"]) {
							switch (direction) {
								// the current function was tirggered by scrolling down
								// so the previous function is above the current function
								case "downInc":
								case "downDec":
									// functions[previousActiveFunction as "barChart"].group.transition().attr("opacity", 0);
									break;
								// the current function was tirggered by scrolling up
								// so the previous function is below the current function
								case "upInc":
								case "upDec":
									// functions[previousActiveFunction as "barChart"].group.transition().attr("opacity", 0);
									break;
								default:
									break;
							}
						}
						previousActiveFunction = activeFunction;
					}

					if (!functions[activeFunction as "barChart"]) return;
					// functions[activeFunction as "barChart"].group.raise();
				};

				updateDirection = function () {
					console.log("direction: ", direction);
				};

				// helper functions
			};
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

	/**
	 *  scroll the active function by the ticks
	 * @param ticks the ticks an ordered array of
	 * */
	chart.scroll = function (ticks: number[]) {
		scroll = ticks;
		if (typeof updateScroll === "function") updateScroll();
		return chart;
	};
	return chart;
}
