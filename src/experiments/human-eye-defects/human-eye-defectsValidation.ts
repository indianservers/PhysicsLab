import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { humanEyeDefectsBenchmarks } from "./human-eye-defectsSimulation";
export const humanEyeDefectsValidation = runBenchmarkCases(humanEyeDefectsBenchmarks.map((item) => ({ ...item, input: item.actual, actual: (value: number) => value })));
export const humanEyeDefectsValidated = humanEyeDefectsBenchmarks.every((item) => approximatelyEqual(item.actual, item.expected, item.tolerance));
