import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { seriesParallelResistanceBenchmarks } from "./series-parallel-resistanceSimulation";

export const seriesParallelResistanceValidation = runBenchmarkCases(seriesParallelResistanceBenchmarks.map((item) => ({ ...item, input: item.actual, actual: (value: number) => value })));
export const seriesParallelResistanceValidated = seriesParallelResistanceBenchmarks.every((item) => approximatelyEqual(item.actual, item.expected, item.tolerance));
