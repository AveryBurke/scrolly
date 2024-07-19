import { barChart } from "../visulizations/barChart";
import { Selection } from "d3-selection";
import { pizzaChart } from "../visulizations/pizzaChart";

export const visulizations: Visulizations = {
	barChart: {
		name: "barChart",
		mounted: false,
		generator: barChart,
		chart: null,
		init: function (selection: Selection<SVGElement, number[], any, any>, data: number[], fillColor: string, width: number, height: number, padding: number) {
			this.chart = this.generator();
			this.chart.data(data);
			this.chart.fillColor(fillColor);
			this.chart.width(width);
			this.chart.height(height);
			this.chart.padding(padding);
			selection.call(this.chart);
		},
	},
	growingCircle: {
		name: "growingCircle",
		mounted: false,
		generator: barChart,
		chart: null,
		init: function (selection: Selection<SVGElement, number[], any, any>, data: number[], fillColor: string, width: number, height: number, padding: number) {
			this.chart = this.generator();
			this.chart.data(data);
			this.chart.fillColor(fillColor);
			this.chart.width(width);
			this.chart.height(height);
			this.chart.padding(padding);
			setTimeout(() => {
				selection.call(this.chart);
			}, 250);
		},
	},
	pizzaChart: {
		name: "pizzaChart",
		generator: pizzaChart,
		mounted: false,
		chart: null,
		init(
			selection: Selection<SVGElement, any[], HTMLElement, any>,
			data: any[],
			ringColumn: string,
			ringSet: string[],
			sliceColumn: string,
			sliceSet: string[]
		) {
			this.chart = this.generator();
			this.chart.data(data);
			this.chart.ringColumn(ringColumn);
			this.chart.ringSet(ringSet);
			this.chart.sliceColumn(sliceColumn);
			this.chart.sliceSet(sliceSet);
			selection.call(this.chart);
		},
	},
};
