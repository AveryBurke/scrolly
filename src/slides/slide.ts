import { Selection } from "d3-selection";
import { visulizations } from "./visualizations";
import { pizzaData } from "../utils/pizzaData";
import { barChart } from "../visulizations/barChart";
import { pizzaChart } from "../visulizations/pizzaChart";
import { debounce } from "lodash";

const debouncedPizzaInit = debounce(function(selection:Selection<SVGElement, any[], any, any>,data:any[], ringColumn:string, ringSet:string[], sliceColumn:string, sliceSet:string[], vis:Visulizations){
    (vis.pizzaChart as PizzaChart).init(selection, data, ringColumn, ringSet, sliceColumn, sliceSet);
},200)

const debounceBarInit = debounce(function(selection:Selection<SVGElement, number[], any, any>, data:number[], fillColor:string, width:number, height:number, padding:number, vis:Visulizations){
    (vis.barChart as BarChart).init(selection, data, fillColor, width, height, padding);

},200)

const debouncedBarEnter = debounce(function(data:any[], fillColor:string, vis:Visulizations, width?:number){
    
    (vis.barChart.chart as ReturnType<typeof barChart>).data(data);
    if (width) (vis.barChart.chart as ReturnType<typeof barChart>).width(width);
    setTimeout(() => {
        (vis.barChart.chart as ReturnType<typeof barChart>).fillColor(fillColor);
    }, 200);
}, 100);

const debouncePizzaEnter = debounce(function({data, ringColumn, ringSet, sliceColumn, sliceSet, vis}:{data?:Food[], ringColumn?:string, ringSet?:string[], sliceColumn?:string, sliceSet?:string[], vis:Visulizations} ){
    if (data) (vis.pizzaChart.chart as ReturnType<typeof pizzaChart>).data(data);
    if (ringColumn) (vis.pizzaChart.chart as ReturnType<typeof pizzaChart>).ringColumn(ringColumn);
    if (ringSet) (vis.pizzaChart.chart as ReturnType<typeof pizzaChart>).ringSet(ringSet);
    if (sliceColumn) (vis.pizzaChart.chart as ReturnType<typeof pizzaChart>).sliceColumn(sliceColumn);
    if (sliceSet) (vis.pizzaChart.chart as ReturnType<typeof pizzaChart>).sliceSet(sliceSet);
}, 200);

export const slides: { [key: string]: Slide } = {
	"0": {
		visulization: "barChart",
		mounted: false,
		data: [2, 5, 4, 1, 2, 6, 5],
		onInit: function (selection) {
			const boundingRect = selection.node()!.getBoundingClientRect();
			this.width = (boundingRect.width * 3) / 4;
			this.height = boundingRect.height;
			debounceBarInit(selection, this.data, "steelblue", 0, this.height, 1, visulizations);
			this.mounted = true;
		},
		onEnter: function () {
			if (!visulizations.barChart.chart) return;
			debouncedBarEnter(this.data, "steelblue", visulizations);
		},
		onExit: function () {
			if (visulizations.barChart.chart) visulizations.barChart.chart.exit();
		},
		onEnterScrollDown: function (ratio: number) {
			if (visulizations.barChart.chart) (visulizations.barChart.chart as ReturnType<typeof barChart>).width(ratio * this.width);
		},
		onExitScrollDown: (ratio: number) => {
			// console.log("scrolling down exit", ratio);
		},
		onEnterScrollUp: (ratio: number) => {
			// console.log("scrolling up enter", ratio);
		},
		onExitScrollUp: function (ratio: number) {
			// console.log("scrolling up exit", ratio);
			if (visulizations.barChart.chart) (visulizations.barChart.chart as ReturnType<typeof barChart>).width(ratio * this.width);
			if (ratio < 0.3 && visulizations.barChart.chart) (visulizations.barChart.chart as ReturnType<typeof barChart>).width(0);
		},
	},
	"1": {
		visulization: "barChart",
		mounted: false,
		data: [17, 4, 18, 9, 2, 21, 88, 9, 12, 75, 33, 20, 18, 15, 17, 16, 18, 23],
		onInit: function (selection) {
			// don't initilize if the previous slide was not mounted
			if (!slides[0].mounted) return
			const boundingRect = selection.node()!.getBoundingClientRect();
			this.width = boundingRect.width;
			this.height = boundingRect.height;
			debounceBarInit(selection, this.data, "coral", this.width, this.height, 1, visulizations);
			this.mounted = true;
		},

		onEnter: function () {
			if (!visulizations.barChart.chart) return;
			
			const width = slides["0"].width;
			debouncedBarEnter(this.data, "coral", visulizations, width);
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
		visulization: "pizzaChart",
		mounted: false,
		data: pizzaData,
		onInit: function (selection) {
            this.mounted = true;
			const data: Food[] = this.data;
			let sliceColumn: string = "eaten",
				ringColumn: string = "component",
				sliceSet = [...new Set(data.map((d: any) => d[sliceColumn]))],
				ringSet = [...new Set(data.map((d: any) => d[ringColumn]))];
                setTimeout(() => {
                    debouncedPizzaInit(selection, this.data, ringColumn, ringSet, sliceColumn, sliceSet, visulizations);
                }, 200);
			
		},
		onEnter: () => {},
		onExit: function() {
            if (visulizations.pizzaChart.chart) debouncePizzaEnter({vis: visulizations, data:[]});
            this.mounted = false;
        },
		onEnterScrollDown: (ratio: number) => {
            // if (!visulizations.pizzaChart.chart) return;
			// debouncePizzaEnter({ringSet:['meat', 'topping', 'leaf', 'flower', 'whole', 'root', 'fruit', 'top', 'bulb'], vis: visulizations});
		},
		onExitScrollDown: (ratio: number) => {
			console.log("scrolling down exit", ratio);
            if (!visulizations.pizzaChart.chart) return;
			debouncePizzaEnter({ringSet:['meat', 'topping', 'leaf', 'flower', 'whole', 'root', 'fruit', 'top', 'bulb'], vis: visulizations});
		},
		onEnterScrollUp: (ratio: number) => {
			if (!visulizations.pizzaChart.chart) return;
			debouncePizzaEnter({ringSet:['whole', 'meat', 'topping', 'leaf', 'flower', 'root', 'fruit', 'top', 'bulb'], vis: visulizations});
		},
		onExitScrollUp: (ratio: number) => {
			console.log("scrolling up exit", ratio);
		},
	},
};
