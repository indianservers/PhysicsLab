import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { soundWaveAnatomyBenchmarks } from "./sound-wave-anatomySimulation";

export const soundWaveAnatomyValidation = runBenchmarkCases(
  soundWaveAnatomyBenchmarks.map((benchmark) => ({
    id: benchmark.id,
    name: benchmark.name,
    input: benchmark.actual,
    actual: (value: number) => value,
    expected: benchmark.expected,
    tolerance: benchmark.tolerance,
    unit: benchmark.unit,
  })),
);

export const soundWaveAnatomyValidated = soundWaveAnatomyBenchmarks.every((benchmark) => approximatelyEqual(benchmark.actual, benchmark.expected, benchmark.tolerance));
