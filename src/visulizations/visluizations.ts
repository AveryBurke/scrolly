import { barChart } from "./barChart";

export const onMove = (visulization: ReturnType<typeof barChart>, method: keyof ReturnType<typeof barChart>, value: unknown) => {
	switch (method) {
		case "data":
			if (Array.isArray(value)) {
				visulization.data(value as number[]);
			}

			break;
		case "fillColor":
			if (typeof value === "string") {
				visulization.fillColor(value as string);
			}
			break;
		case "width":
		case "height":
		case "padding":
			if (typeof value === "number") {
				visulization[method](value);
			}
			break;
		case "exit":
			visulization.exit();
			break;
		default:
			const exustiveCheck: never = method;
			throw new Error(`unhandled method: ${exustiveCheck}`);
	}
};
