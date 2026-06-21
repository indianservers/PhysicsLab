import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { emiFaradayBenchmarks } from "./emi-faradaySimulation";

export const emiFaradayValidation = runBenchmarkCases(emiFaradayBenchmarks.map((item) => ({ ...item, input: item.actual, actual: (value: number) => value })));
export const emiFaradayValidated = emiFaradayBenchmarks.every((item) => approximatelyEqual(item.actual, item.expected, item.tolerance));
