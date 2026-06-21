import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { buoyancyBenchmarks } from "./buoyancySimulation";
export const buoyancyValidation = runBenchmarkCases(buoyancyBenchmarks.map((item) => ({ ...item, input: item.actual, actual: (value: number) => value })));
export const buoyancyValidated = buoyancyBenchmarks.every((item) => approximatelyEqual(item.actual, item.expected, item.tolerance));
