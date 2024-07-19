import { Selection, select } from "d3-selection";
import { pie, arc, Pie } from "d3-shape";
import { interpolate } from "d3-interpolate";
import { easeQuadIn } from "d3-ease";
import { pallet } from "../utils/pallet";
import makeSafeForCSS from "../utils/safeCss";


interface Arc {
	innerRadius: number;
	outerRadius: number;
	startAngle: number;
	endAngle: number;
	id: string;
	slice: string;
	ring: string;
}

//TODO: add exit transition
 
/**
 * Create a pizza chart
 * @returns a pizza chart
 */
export function pizzaChart() {
	// All options that should be accessible to caller
	let data: any[] = [],
		ringColumn: string,
		ringSet: string[],
		sliceColumn: string,
		sliceSet: string[],
		// update handlers, called when the corresponding option changes
		updateData: () => void,
		updateRingColumn: () => void,
		updateRingSet: () => void,
		updateSliceColumn: () => void,
		updateSliceSet: () => void,
		// exit handler
		exit: () => void;

	function chart(selection: Selection<SVGElement, unknown, HTMLElement, any>) {
		selection.each(function () {
			const { width, height } = selection.node()!.getBoundingClientRect(),
				radius = Math.min(width, height) / 2,
				current: { [key: string]: Arc } = {};

			let ringValue = (d: any): string => d[ringColumn],
				sliceValue = (d: any) => d[sliceColumn],
				// metrics
				ringCount: { [ring: string]: number },
				sliceCount: { [slice: string]: number },
				ringHeights: { [ring: string]: { innerRadius: number; outerRadius: number } },
				// generators
				pieGenerator: Pie<any, string>,
				sliceAngles: { [slice: string]: { startAngle: number; endAngle: number } };
			updateMetrics();
			updateGenerators();

			let // slice color pallet
				colorPallet = pallet(Math.max(ringSet.length, 8)),
				sliceColors = Object.fromEntries(sliceSet.map((slice, i) => [slice, colorPallet[i % colorPallet.length]]));
			// on init create a group element
			// append it to the selection
			// and move it to the center of the svg
			const arcGroup = selection
				.append("g")
				.attr("class", "arcs")
				.attr("transform", `translate(${width * (3 / 4)}, ${height / 2})`);

			updateData = function () {
				updateMetrics();
				updateGenerators();
				const arcData: Arc[] = sliceSet.flatMap((slice) => {
					const { startAngle, endAngle } = sliceAngles[slice];
					return ringSet.map((ring) => {
						const { innerRadius, outerRadius } = ringHeights[ring];
						return { slice, ring, startAngle, endAngle, innerRadius, outerRadius, id: makeSafeForCSS(`${slice}-${ring}`) };
					});
				});
				const arcs = arcGroup.selectAll<SVGElement, Arc>("path.arc").data(arcData, function (d) {
					return d.id || this.id;
				});

				arcs
					.enter()
					.append("path")
					.attr("class", "arc")
					.attr("id", (d) => d.id)
					.attr("d", function (d) {
						// start the slices from 0, then transition in
						current[d.id] = { ...d, startAngle: 0, endAngle: 0 };
						return arc()({ ...d, startAngle: 0, endAngle: 0 })!;
					})
					.style("stroke", "rgb(71 85 105)")
					.style("fill", (d) => {
						const { slice, ring } = d;
						return sliceColors[slice][ringSet.indexOf(ring)];
					});

				arcs
					.transition()
					.duration(200)
					.ease(easeQuadIn)
					.attrTween("d", function (a) {
						const from = { ...current[a.id] };
						const i = interpolate(from, a);
						return (t: number): string => {
							return arc()(i(t)) || "";
						};
					})
					.style("fill", (d) => {
						const { slice, ring } = d;
						return sliceColors[slice][ringSet.indexOf(ring)];
					})
					.end()
                    .catch(d => console.log(d))
					.then(() => {
						arcs.each(function (d) {
							current[d.id] = d;
						});
					});

				arcs
                .exit()
                .each(function () {
                    const id = select(this).attr("id");
                    delete current[id];
                })
                .remove();
			};
			updateRingColumn = function () {
				ringValue = (d) => d[ringColumn];
			};
			updateRingSet = function () {
				updateData();
			};
			updateSliceColumn = function () {
				sliceValue = (d) => d[sliceColumn];
			};
			updateSliceSet = function () {
				sliceColors = Object.fromEntries(sliceSet.map((slice, i) => [slice, colorPallet[i % colorPallet.length]]));
				updateData();
			};

			exit = function () {
				// updateMetrics();
				// updateGenerators();
				// sliceSet.forEach((slice) => {
				// 	sliceAngles[slice] = { startAngle: 2 * Math.PI, endAngle: 2 * Math.PI };
				// });
				// const arcData: Arc[] = sliceSet.flatMap((slice) => {
				// 	const { startAngle, endAngle } = sliceAngles[slice];
				// 	return ringSet.map((ring) => {
				// 		const { innerRadius, outerRadius } = ringHeights[ring];
				// 		return { slice, ring, startAngle, endAngle, innerRadius, outerRadius, id: makeSafeForCSS(`${slice}-${ring}`) };
				// 	});
				// });
				// const arcs = arcGroup.selectAll<SVGElement, Arc>("path.arc").data(arcData, function (d) {
				// 	return d.id || this.id;
				// });

				// // arcs
				// // 	.transition()
				// // 	.duration(300)
				// // 	.ease(easeQuadIn)
				// // 	.attrTween("d", function (a) {
				// // 		const from = { ...current[a.id] };
				// // 		const i = interpolate(from, a);
				// // 		return (t: number): string => {
				// // 			return arc()(i(t)) || "";
				// // 		};
				// // 	})
				// // 	.style("fill", (d) => {
				// // 		const { slice, ring } = d;
				// // 		return sliceColors[slice][ringSet.indexOf(ring)];
				// // 	})
				// // 	// .end()
                // //     // .catch(d => console.log(d))

                // //     arcs.remove();
                //     // .then(() => arcs.remove())
			};

			function updateMetrics() {
				ringCount = Object.fromEntries(ringSet.map((ring) => [ring, data.filter((d) => ringValue(d) === ring).length]));
				sliceCount = Object.fromEntries(sliceSet.map((slice) => [slice, data.filter((d) => sliceValue(d) === slice).length]));
				ringHeights = ringSet.reduce<{ [key: string]: { innerRadius: number; outerRadius: number } }>((acc, ring, i) => {
					const height = ringCount[ring]! * (radius / data.length);
					if (i === 0) {
						acc[ring] = { innerRadius: 0, outerRadius: height };
					} else {
						const prev = ringSet[i - 1];
						const { outerRadius: prevOuter } = acc[prev!] || { outerRadius: 0 };
						const outerRadius = height + prevOuter;
						acc[ring] = { innerRadius: prevOuter, outerRadius };
					}
					return acc;
				}, {});
			}

			function updateGenerators() {
				pieGenerator = pie<string>()
					.value((slice: string) => sliceCount[slice]!)
					.sort((a: string, b: string) => sliceSet.indexOf(a) - sliceSet.indexOf(b));
				sliceAngles = Object.fromEntries(
					pieGenerator(sliceSet).map((p) => {
						const { startAngle, endAngle } = p;
						return [p.data, { startAngle, endAngle }];
					})
				);
			}
		});

		// init
		updateData();
		updateData();
	}

	chart.data = function (value: any[]) {
		data = value;
		if (typeof updateData === "function") updateData();
		return chart;
	};

	chart.ringColumn = function (value: string) {
		ringColumn = value;
		if (typeof updateRingColumn === "function") updateRingColumn();
		return chart;
	};

	chart.ringSet = function (value: string[]) {
		ringSet = value;
		if (typeof updateRingSet === "function") updateRingSet();
		return chart;
	};

	chart.sliceColumn = function (value: string) {
		sliceColumn = value;
		if (typeof updateSliceColumn === "function") updateSliceColumn();
		return chart;
	};

	chart.sliceSet = function (value: string[]) {
		sliceSet = value;
		if (typeof updateSliceSet === "function") updateSliceSet();
		return chart;
	};

	chart.exit = function () {
		if (typeof exit === "function") exit();
		return;
	};
	return chart;
}
