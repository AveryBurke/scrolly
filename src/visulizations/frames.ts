import { barChart } from "./barChart";
import { onMove } from "./visluizations";
import { barChartData } from "../static/barChartData";
import _ from "lodash";
import { on } from "events";
//  |    0  |
//   -----------
//   -----------
//  |       |
//  |       |
//  |   1   |
//  |       |
//  |       |
//   ------------
//   ------------
//  |    2  |
export const frames: { [key: string]: Frame } = {
	// barChart grows and shrinks with scroll
	"0": {
		onEnterFromAbove: function (chart: ReturnType<typeof barChart>, value: number) {
            console.log("enter 0 from above", value);
			onMove(chart, "width", 900 * value);
		},
		onExitToAbove: function (chart: ReturnType<typeof barChart>, value: number) {
            console.log("exit 0 to above", value);
			onMove(chart, "width", 900 * value);
		},
		onEnterFromBelow: function (chart: ReturnType<typeof barChart>, value: number) {
            console.log("enter 0 from below", value);
			onMove(chart, "width", 900);
		},
		onExitToBelow: function (chart: ReturnType<typeof barChart>, value: number) {
            console.log("exit 0 to below", value);
			onMove(chart, "width", 900);
		},
		onCrossingBellowWhileScrollingDown: function (chart: ReturnType<typeof barChart>, value: number) {
            console.log("exited 0 out the bottom", value);
			onMove(chart, "fillColor", "coral");
		},
		onCrossingAboveWhileScrollingUp: function (chart: ReturnType<typeof barChart>, value: number) {
            console.log("exited 0 out the top", value);
			// console.log("left 0 from above");
		},
		onCrossingBellowWhileScrollingUp: function (chart: ReturnType<typeof barChart>, value: number) {
            console.log("entered 0 from below", value);
			chart.fillColor("steelblue");
		},
		onCrossingAboveWhileScrollingDown: function (chart: ReturnType<typeof barChart>, value: number) {
            console.log("entered 0 from above", value);
			// console.log("entered 0 from above");
		},
	},
	"1": {
		onEnterFromAbove: function (chart: ReturnType<typeof barChart>, value: number) {
			console.log("enter 1 from above", value);
			// onMove(chart, "fillColor", "coral");
			// onMove(chart, "width", );
		},
		onExitToAbove: function (chart: ReturnType<typeof barChart>, value: number) {
			console.log("exit 1 to above", value);
			// onMove(chart, "width", value);
		},
		onEnterFromBelow: function (chart: ReturnType<typeof barChart>, value: number) {
			console.log("enter 1 from below", value);
			// onMove(chart, "width", value);
		},
		onExitToBelow: function (chart: ReturnType<typeof barChart>, value: number) {
            console.log("exit 1 to below", value);
			// console.log("exit to below", value);
			// console.log("exit to below", value);
			// onMove(chart, "width", value);
		},
		onCrossingBellowWhileScrollingDown: function (chart: ReturnType<typeof barChart>, value: number) {
            console.log("exited 1 out the bottom", value);
			// onMove(chart, "width", 0)
		},
		onCrossingAboveWhileScrollingUp: function (chart: ReturnType<typeof barChart>, value: number) {
            console.log("exited 1 out the top", value);
			// chart.data(barChartData[0]);
			// console.log("left 1 from above");
		},
		onCrossingBellowWhileScrollingUp: function (chart: ReturnType<typeof barChart>, value: number) {
            console.log("entered 1 from below", value);
            // onMove(chart, "width", value * 900);

		},
		onCrossingAboveWhileScrollingDown: function (chart: ReturnType<typeof barChart>, value: number) {
            console.log("entered 1 from above", value);
			// chart.data(barChartData[1]);
		},
	},
};
