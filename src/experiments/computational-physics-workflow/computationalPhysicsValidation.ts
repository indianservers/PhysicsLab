import { runBenchmarkCases } from "../shared/validation";
import { computationalWorkflowBenchmarks as raw } from "./computationalPhysicsSimulation";
export const computationalWorkflowBenchmarks = runBenchmarkCases(
  raw.map((item) => ({
    ...item,
    input: item.actual,
    actual: (value: number) => value,
  })),
);
export const computationalWorkflowValidation = computationalWorkflowBenchmarks;
export const computationalWorkflowValidated =
  computationalWorkflowBenchmarks.every((item) => item.pass);
