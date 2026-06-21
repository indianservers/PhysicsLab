import { runBenchmarkCases } from "../shared/validation";

export interface ElasticCollisionInput {
  m1: number;
  m2: number;
  u1: number;
  u2: number;
}

export function simulateElasticCollision(input: ElasticCollisionInput) {
  const totalMass = input.m1 + input.m2;
  const v1 = ((input.m1 - input.m2) / totalMass) * input.u1 + ((2 * input.m2) / totalMass) * input.u2;
  const v2 = ((2 * input.m1) / totalMass) * input.u1 + ((input.m2 - input.m1) / totalMass) * input.u2;
  const momentumBefore = input.m1 * input.u1 + input.m2 * input.u2;
  const momentumAfter = input.m1 * v1 + input.m2 * v2;
  const kineticBefore = 0.5 * input.m1 * input.u1 ** 2 + 0.5 * input.m2 * input.u2 ** 2;
  const kineticAfter = 0.5 * input.m1 * v1 ** 2 + 0.5 * input.m2 * v2 ** 2;
  const conservationErrorPercent = Math.abs((kineticAfter - kineticBefore) / Math.max(kineticBefore, 1e-9)) * 100;
  return { v1, v2, momentumBefore, momentumAfter, kineticBefore, kineticAfter, conservationErrorPercent };
}

export const elasticCollisionBenchmarks = runBenchmarkCases<ElasticCollisionInput>([
  {
    id: "collision-equal-masses-v1",
    name: "Equal masses transfer velocity",
    input: { m1: 1, m2: 1, u1: 5, u2: 0 },
    expected: 0,
    unit: "m/s",
    tolerance: 1e-9,
    actual: (input) => simulateElasticCollision(input).v1,
  },
  {
    id: "collision-two-to-one-v2",
    name: "Two-to-one mass second velocity",
    input: { m1: 2, m2: 1, u1: 3, u2: 0 },
    expected: 4,
    unit: "m/s",
    tolerance: 1e-9,
    actual: (input) => simulateElasticCollision(input).v2,
  },
]);
