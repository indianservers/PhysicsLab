import { runBenchmarkCases } from "../shared/validation";
import { balancedForcesBenchmarks as raw } from "./balancedForcesSimulation";
export const balancedForcesBenchmarks = runBenchmarkCases(
  raw.map((item) => ({
    ...item,
    input: item.actual,
    actual: (value: number) => value,
  })),
);
export const balancedForcesValidation = balancedForcesBenchmarks;
export const balancedForcesValidated = balancedForcesBenchmarks.every(
  (item) => item.pass,
);
