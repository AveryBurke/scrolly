import { Selection } from "d3-selection";
import { visulizations } from "./visualizations";

/**
 * An interface for controlling the behavior of a reusable chart
 * depending on the scroll ration and the direction of the scroll,
 * The chart must be able to apply the scroll ration to it's data somehow
 * @interface Slide
 */
interface Slide {
	visulization: "barChart" | "growingCircle";
	mounted: boolean;
	width?: number;
	height?: number;
    /**
     * The data associated with the slide.
     * This will be sent to the chart when the slide is entered or the chart is initialized from the slide.
     * In production there will be an async function that fetches the data from the server and initialize the slides.
     * For now the data is hardcoded.
     */
	data: number[];
	/**
	 * Initialize a chart when the slide is entered
	 * @param selection - d3 selection of the chart container
	 * @returns void
	 */
	onInit: (selection: Selection<SVGElement, number[], any, any>) => void;
	/**
	 * Modify an already mounted chart when the slide is entered
	 * @returns void
	 */
	onEnter: () => void;
	/**
	 * Remove a chart when the slide is exited
	 * @returns void
	 */
	onExit: () => void;
	/**
	 * Modify an already mounted chart when the slide is scrolled down and the ratio is increasing
	 * @param ratio - the intersection ratio of the slide
	 * @returns void
	 */
	onEnterScrollUp: (ratio: number) => void;
	/**
	 * Modify an already mounted chart when the slide is scrolled down and the ratio is decreasing
	 * @param ratio - the intersection ratio of the slide
	 * @returns void
	 */
	onExitScrollUp: (ratio: number) => void;
	/**
	 * Modify an already mounted chart when the slide is scrolled up and the ratio is increasing
	 * @param ratio - the intersection ratio of the slide
	 * @returns void
	 */
	onEnterScrollDown: (ration: number) => void;
	/**
	 * Modify an already mounted chart when the slide is scrolled up and the ratio is decreasing
	 * @param ratio - the intersection ratio of the slide
	 * @returns void
	 */
	onExitScrollDown: (ration: number) => void;
}

export const slides: { [key: string]: Slide } = {
	"0": {
		visulization: "barChart",
		mounted: false,
		data: [2, 5, 4, 1, 2, 6, 5],
		onInit: function (selection) {
            const boundingRect = selection.node()!.getBoundingClientRect();
            this.width = boundingRect.width * 3/4;
            this.height = boundingRect.height;
			visulizations.barChart.init(selection, this.data, "steelblue", 0, this.height, 1);
		},
		onEnter: function () {
			if (!visulizations.barChart.chart) return;
			visulizations.barChart.chart.data(this.data);
            // const width = this.width || slides["1"].width;
			setTimeout(() => {
				if (visulizations.barChart.chart) visulizations.barChart.chart.fillColor("steelblue");
				// if (visulizations.barChart.chart ) visulizations.barChart.chart.width(900);
			}, 250);
		},
		onExit: function () {
			if (visulizations.barChart.chart) visulizations.barChart.chart.exit();
		},
		onEnterScrollDown: function (ratio: number) {
			if (visulizations.barChart.chart) visulizations.barChart.chart.width(ratio * this.width);
		},
		onExitScrollDown: (ratio: number) => {
			console.log("scrolling down exit", ratio);
		},
		onEnterScrollUp: (ratio: number) => {
			console.log("scrolling up enter", ratio);
		},
		onExitScrollUp: function(ratio: number) {
			console.log("scrolling up exit", ratio);
			if (visulizations.barChart.chart) visulizations.barChart.chart.width(ratio * this.width);
            if (ratio < .3 && visulizations.barChart.chart) visulizations.barChart.chart.width(0);
		},
	},
	"1": {
		visulization: "barChart",
		mounted: false,
		data: [17, 4, 18, 9, 2, 21, 88, 9, 12, 75, 33, 20, 18, 15, 17, 16, 18, 23],
		onInit: function (selection) {
            const boundingRect = selection.node()!.getBoundingClientRect();
            this.width = boundingRect.width;
            this.height = boundingRect.height;
			visulizations.barChart.init(selection, this.data, "coral", this.width , this.height, 1);
			this.mounted = true;
		},

		onEnter: function () {
			if (!visulizations.barChart.chart) return;
			visulizations.barChart.chart.data(this.data);
            const width = slides["0"].width;
			setTimeout(() => {
				if (visulizations.barChart.chart) visulizations.barChart.chart.fillColor("coral");
				if (visulizations.barChart.chart && width) visulizations.barChart.chart.width(width);
			}, 250);
		},
		onExit: function () {
			if (visulizations.barChart.chart) visulizations.barChart.chart.exit();
			this.mounted = false;
		},
		onEnterScrollDown: (ratio: number) => {},
		onExitScrollDown: (ratio: number) => {
			console.log("scrolling down exit", ratio);
		},
		onEnterScrollUp: (ratio: number) => {
			console.log("scrolling up enter", ratio);
		},
		onExitScrollUp: (ratio: number) => {},
	},
	"2": {
		visulization: "growingCircle",
		mounted: false,
		data: [0.5],
		onInit: function (selection) {},
		onEnter: () => {},
		onExit: () => {},
		onEnterScrollDown: (ratio: number) => {
			console.log("scrolling down enter", ratio);
		},
		onExitScrollDown: (ratio: number) => {
			console.log("scrolling down exit", ratio);
		},
		onEnterScrollUp: (ratio: number) => {
			console.log("scrolling up enter", ratio);
		},
		onExitScrollUp: (ratio: number) => {
			console.log("scrolling up exit", ratio);
		},
	},
};
