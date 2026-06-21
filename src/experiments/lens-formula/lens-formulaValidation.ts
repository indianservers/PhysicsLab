import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { lensFormulaBenchmarks } from "./lens-formulaSimulation";
export const lensFormulaValidation = runBenchmarkCases(lensFormulaBenchmarks.map((item) => ({ ...item, input: item.actual, actual: (value: number) => value })));
export const lensFormulaValidated = lensFormulaBenchmarks.every((item) => approximatelyEqual(item.actual, item.expected, item.tolerance));
