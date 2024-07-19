import { barChart } from "../src/visulizations/barChart";
import { Selection } from "d3-selection";
import { pizzaChart } from "../src/visulizations/pizzaChart";
declare global {
	type Chart = "barChart" | "growingCircle" | "pizzaChart";

	type PizzaInit = (
		selection: Selection<SVGElement, any[], HTMLElement, any>,
		data: any[],
		ringColumn: string,
		ringSet: string[],
		sliceColumn: string,
		sliceSet: string[]
	) => void;
	type BarInit = (
		selection: Selection<SVGElement, any[], any, any>,
		data: number[],
		fillColor: string,
		width: number,
		height: number,
		padding: number
	) => void;

	interface VisulizationControler<C extends Chart, G, F, I> {
		name: C;
		mounted: boolean;
		generator: G;
		chart: F | null;
		init: I;
	}

	type BarChart = VisulizationControler<"barChart", typeof barChart, ReturnType<typeof barChart>, BarInit>;
	type GrowingCircle = VisulizationControler<"growingCircle", typeof barChart, ReturnType<typeof barChart>, BarInit>;
	type PizzaChart = VisulizationControler<"pizzaChart", typeof pizzaChart, ReturnType<typeof pizzaChart>, PizzaInit>;
	type Visulization = BarChart | GrowingCircle | PizzaChart;

	type Visulizations = { [key in Chart]: Visulization };

	interface SlideControler<C extends Chart, i> {
		visulization: C;
		mounted: boolean;
		width?: number;
		height?: number;
		/**
		 * The data associated with the slide.
		 * This will be sent to the chart when the slide is entered or the chart is initialized from the slide.
		 * In production there will be an async function that fetches the data from the server and initialize the slides.
		 * For now the data is hardcoded.
		 */
		data: any[];
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

	type BarSlide = SlideControler<"barChart", BarInit>;
	type PizzaSlide = SlideControler<"pizzaChart", PizzaInit>;
	type CircleSlide = SlideControler<"growingCircle", BarInit>;

	/**
	 * An interface for controlling the behavior of a reusable chart
	 * depending on the scroll ration and the direction of the scroll,
	 * The chart must be able to apply the scroll ration to it's data somehow
	 * @interface Slide
	 */
	type Slide = BarSlide | PizzaSlide | CircleSlide;

    interface Food {
        type: "fruit" | "vegetable";
        name: string;
        eaten: "cooked" | "raw" | "cooked and raw";
        component: string;
    }
}

export {};
