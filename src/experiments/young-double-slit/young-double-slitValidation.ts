import { youngDoubleSlitBenchmarks } from "./young-double-slitSimulation";

export const youngDoubleSlitValidation = youngDoubleSlitBenchmarks;
export const youngDoubleSlitValidated = youngDoubleSlitBenchmarks.every(
  (benchmark) => benchmark.pass,
);
