import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { reflectionPlaneMirrorBenchmarks } from "./reflection-plane-mirrorSimulation";
export const reflectionPlaneMirrorValidation = runBenchmarkCases(reflectionPlaneMirrorBenchmarks.map((item) => ({ ...item, input: item.actual, actual: (value: number) => value })));
export const reflectionPlaneMirrorValidated = reflectionPlaneMirrorBenchmarks.every((item) => approximatelyEqual(item.actual, item.expected, item.tolerance));
