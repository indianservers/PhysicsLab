import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { magneticFieldCurrentBenchmarks } from "./magnetic-field-currentSimulation";

export const magneticFieldCurrentValidation = runBenchmarkCases(magneticFieldCurrentBenchmarks.map((item) => ({ ...item, input: item.actual, actual: (value: number) => value })));
export const magneticFieldCurrentValidated = magneticFieldCurrentBenchmarks.every((item) => approximatelyEqual(item.actual, item.expected, item.tolerance));
