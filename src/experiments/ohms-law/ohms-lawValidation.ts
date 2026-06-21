import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { ohmsLawBenchmarks } from "./ohms-lawSimulation";

export const ohmsLawValidation = runBenchmarkCases(ohmsLawBenchmarks.map((item) => ({ ...item, input: item.actual, actual: (value: number) => value })));
export const ohmsLawValidated = ohmsLawBenchmarks.every((item) => approximatelyEqual(item.actual, item.expected, item.tolerance));
