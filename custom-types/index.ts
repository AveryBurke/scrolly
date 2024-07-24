import { barChart } from "../src/visulizations/barChart";
import { Selection } from "d3-selection";
import { pizzaChart } from "../src/visulizations/pizzaChart";
declare global {
	

    interface Food {
        type: "fruit" | "vegetable";
        name: string;
        eaten: "cooked" | "raw" | "cooked and raw";
        component: string;
    }
}

export {};
