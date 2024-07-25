import { barChart } from "../src/visulizations/barChart";
import { Selection } from "d3-selection";
import { pizzaChart } from "../src/visulizations/pizzaChart";
declare global {
	
	interface Functions {
		[funcitonName: string]: {
			function: ReturnType<typeof barChart>;
			/** 
			 * when called on the svg a function will create a group element with this id. 
			 * Use the id to select the group element for the visualization
			 * */
			groupId: string;
			needsInit?: boolean;
		};
	}

    interface Food {
        type: "fruit" | "vegetable";
        name: string;
        eaten: "cooked" | "raw" | "cooked and raw";
        component: string;
    }
}

export {};
