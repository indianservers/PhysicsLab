import { runBenchmarkCases } from "../shared/validation";
import { measurementErrorBenchmarks as raw } from "./measurementErrorsSimulation";
export const measurementErrorBenchmarks = runBenchmarkCases(
  raw.map((item) => ({
    ...item,
    input: item.actual,
    actual: (value: number) => value,
  })),
);
export const measurementErrorsValidation = measurementErrorBenchmarks;
export const measurementErrorsValidated = measurementErrorBenchmarks.every(
  (item) => item.pass,
);
