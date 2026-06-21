import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { electromagnetBenchmarks } from "./electromagnetSimulation";

export const electromagnetValidation = runBenchmarkCases(electromagnetBenchmarks.map((item) => ({ ...item, input: item.actual, actual: (value: number) => value })));
export const electromagnetValidated = electromagnetBenchmarks.every((item) => approximatelyEqual(item.actual, item.expected, item.tolerance));
