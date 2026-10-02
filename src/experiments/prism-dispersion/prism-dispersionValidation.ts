import { prismDispersionBenchmarks } from "./prism-dispersionSimulation";

export const prismDispersionValidation = prismDispersionBenchmarks;
export const prismDispersionValidated = prismDispersionBenchmarks.every(
  (item) => item.pass,
);
