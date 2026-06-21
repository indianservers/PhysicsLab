import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { youngDoubleSlitBenchmarks } from "./young-double-slitSimulation";

export const youngDoubleSlitValidation = runBenchmarkCases(
  youngDoubleSlitBenchmarks.map((benchmark) => ({
    id: benchmark.id,
    name: benchmark.name,
    input: benchmark.actual,
    actual: (value: number) => value,
    expected: benchmark.expected,
    tolerance: benchmark.tolerance,
    unit: benchmark.unit,
  })),
);

export const youngDoubleSlitValidated = youngDoubleSlitBenchmarks.every((benchmark) => approximatelyEqual(benchmark.actual, benchmark.expected, benchmark.tolerance));
