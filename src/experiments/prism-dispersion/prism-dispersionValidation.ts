import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { prismDispersionBenchmarks } from "./prism-dispersionSimulation";
export const prismDispersionValidation = runBenchmarkCases(prismDispersionBenchmarks.map((item) => ({ ...item, input: item.actual, actual: (value: number) => value })));
export const prismDispersionValidated = prismDispersionBenchmarks.every((item) => approximatelyEqual(item.actual, item.expected, item.tolerance));
