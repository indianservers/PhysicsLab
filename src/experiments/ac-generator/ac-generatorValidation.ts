import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { acGeneratorBenchmarks } from "./ac-generatorSimulation";

export const acGeneratorValidation = runBenchmarkCases(acGeneratorBenchmarks.map((item) => ({ ...item, input: item.actual, actual: (value: number) => value })));
export const acGeneratorValidated = acGeneratorBenchmarks.every((item) => approximatelyEqual(item.actual, item.expected, item.tolerance));
