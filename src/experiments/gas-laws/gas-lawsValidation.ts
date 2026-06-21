import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { gasLawsBenchmarks } from "./gas-lawsSimulation";
export const gasLawsValidation = runBenchmarkCases(gasLawsBenchmarks.map((item) => ({ ...item, input: item.actual, actual: (value: number) => value })));
export const gasLawsValidated = gasLawsBenchmarks.every((item) => approximatelyEqual(item.actual, item.expected, item.tolerance));
