import { runBenchmarkCases } from "../shared/validation";
import { magneticFieldCurrentBenchmarks as raw } from "./magnetic-field-currentSimulation";
export const magneticFieldCurrentBenchmarks = runBenchmarkCases(
  raw.map((item) => ({
    ...item,
    input: item.actual,
    actual: (value: number) => value,
  })),
);
export const magneticFieldCurrentValidation = magneticFieldCurrentBenchmarks;
export const magneticFieldCurrentValidated =
  magneticFieldCurrentBenchmarks.every((item) => item.pass);
