import { totalInternalReflectionBenchmarks } from "./total-internal-reflectionSimulation";

export const totalInternalReflectionValidation =
  totalInternalReflectionBenchmarks;
export const totalInternalReflectionValidated =
  totalInternalReflectionBenchmarks.every((item) => item.pass);
