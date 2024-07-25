import { barChart } from "./visulizations/barChart";
import { barChartData } from "./static/barChartData";
import { select } from "d3-selection";


// barChart


const barChartControler = (direction: "downInc" | "downDec" | "upInc" | "upDec") => {
    switch (direction) {
        case "downInc":
            // do something
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
}

const barChartExit = (direction:"up" | "down") => {
    switch (direction) {
        case "down":
            // do something
            break;
        case "up":
            
            break;
        default:
            break;
    }
};

const barChartEnter = (direction: "up" | "down") => {
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
};

export const functions: Functions = {
    barChart: {
        function: barChart().data(barChartData[0]),
        groupId: "barGroup",
        needsInit: true,
    }
};
