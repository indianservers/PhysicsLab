import { runBenchmarkCases } from "../shared/validation";
import { lorentzForceBenchmarks as raw } from "./lorentzForceSimulation";

export const lorentzForceBenchmarks = runBenchmarkCases(
  raw.map((test) => ({
    ...test,
    input: test.actual,
    actual: (value: number) => value,
  })),
);
export const lorentzForceValidation = lorentzForceBenchmarks;
export const lorentzForceValidated = lorentzForceBenchmarks.every(
  (test) => test.pass,
);
