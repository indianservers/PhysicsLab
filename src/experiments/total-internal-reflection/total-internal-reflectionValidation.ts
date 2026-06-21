import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { totalInternalReflectionBenchmarks } from "./total-internal-reflectionSimulation";
export const totalInternalReflectionValidation = runBenchmarkCases(totalInternalReflectionBenchmarks.map((item) => ({ ...item, input: item.actual, actual: (value: number) => value })));
export const totalInternalReflectionValidated = totalInternalReflectionBenchmarks.every((item) => approximatelyEqual(item.actual, item.expected, item.tolerance));
