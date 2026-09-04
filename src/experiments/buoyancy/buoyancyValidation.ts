import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { buoyancyBenchmarks as rawBuoyancyBenchmarks } from "./buoyancySimulation";

export const buoyancyBenchmarks = runBenchmarkCases(rawBuoyancyBenchmarks.map((item) => ({ ...item, input: item.actual, actual: (value: number) => value })));
export const buoyancyValidation = buoyancyBenchmarks;
export const buoyancyValidated = rawBuoyancyBenchmarks.every((item) => approximatelyEqual(item.actual, item.expected, item.tolerance));
