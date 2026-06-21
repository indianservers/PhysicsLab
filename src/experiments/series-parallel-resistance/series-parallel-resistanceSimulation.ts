import { computePremiumEm } from "../shared/electromagnetismPremiumLibrary";
import { parallelResistance, seriesResistance } from "../shared/electricityMath";

export const simulateSeriesParallelResistance = (values: Record<string, number>) => computePremiumEm("series-parallel-resistance", values);

export const seriesParallelResistanceBenchmarks = [
  { id: "series", name: "10 and 20 ohm series gives 30 ohm", actual: seriesResistance([10, 20]), expected: 30, tolerance: 0.000001, unit: "ohm" },
  { id: "parallel", name: "10 and 20 ohm parallel gives 6.666 ohm", actual: parallelResistance([10, 20]), expected: 6.6666667, tolerance: 0.00001, unit: "ohm" },
];
