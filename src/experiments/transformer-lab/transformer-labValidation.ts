import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { transformerLabBenchmarks } from "./transformer-labSimulation";

export const transformerLabValidation = runBenchmarkCases(transformerLabBenchmarks.map((item) => ({ ...item, input: item.actual, actual: (value: number) => value })));
export const transformerLabValidated = transformerLabBenchmarks.every((item) => approximatelyEqual(item.actual, item.expected, item.tolerance));
