import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { bernoulliFluidFlowBenchmarks } from "./bernoulli-fluid-flowSimulation";
export const bernoulliFluidFlowValidation = runBenchmarkCases(bernoulliFluidFlowBenchmarks.map((item) => ({ ...item, input: item.actual, actual: (value: number) => value })));
export const bernoulliFluidFlowValidated = bernoulliFluidFlowBenchmarks.every((item) => approximatelyEqual(item.actual, item.expected, item.tolerance));
