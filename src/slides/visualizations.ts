import { barChart } from "../visulizations/barChart";
import { Selection } from "d3-selection";

type Chart = "barChart" | "growingCircle";

interface Visulization {
	mounted: boolean;
	generator: typeof barChart;
	chart: ReturnType<typeof barChart> | null;
	init: (selection: Selection<SVGElement, number[], any, any>, data: number[], fillColor: string, width: number, height: number, padding: number) => void;
}

export const visulizations: { [key in Chart]: Visulization } = {
	barChart: {
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
};
