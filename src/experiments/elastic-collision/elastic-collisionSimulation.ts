import { runBenchmarkCases } from "../shared/validation";

export interface ElasticCollisionInput {
  m1: number;
  m2: number;
  u1: number;
  u2: number;
  restitution?: number;
}

export function simulateElasticCollision(input: ElasticCollisionInput) {
  const m1 = Math.max(0.05, input.m1),
    m2 = Math.max(0.05, input.m2),
    e = Math.max(0, Math.min(1, input.restitution ?? 1));
  const totalMass = m1 + m2;
  const relative = input.u1 - input.u2;
  const v1 = (m1 * input.u1 + m2 * input.u2 - m2 * e * relative) / totalMass;
  const v2 = (m1 * input.u1 + m2 * input.u2 + m1 * e * relative) / totalMass;
  const momentumBefore = m1 * input.u1 + m2 * input.u2;
  const momentumAfter = m1 * v1 + m2 * v2;
  const kineticBefore = 0.5 * m1 * input.u1 ** 2 + 0.5 * m2 * input.u2 ** 2;
  const kineticAfter = 0.5 * m1 * v1 ** 2 + 0.5 * m2 * v2 ** 2;
  const conservationErrorPercent =
    Math.abs((kineticAfter - kineticBefore) / Math.max(kineticBefore, 1e-9)) *
    100;
  return {
    v1,
    v2,
    momentumBefore,
    momentumAfter,
    kineticBefore,
    kineticAfter,
    dissipatedEnergy: kineticBefore - kineticAfter,
    conservationErrorPercent,
    restitution: e,
  };
}

export const elasticCollisionBenchmarks =
  runBenchmarkCases<ElasticCollisionInput>([
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
    {
      id: "collision-momentum",
      name: "Momentum is conserved for any restitution",
      input: { m1: 1.2, m2: 0.8, u1: 3, u2: -1, restitution: 0.4 },
      expected: 0,
      unit: "kg·m/s",
      tolerance: 1e-12,
      actual: (input) => {
        const r = simulateElasticCollision(input);
        return r.momentumAfter - r.momentumBefore;
      },
    },
    {
      id: "collision-elastic-ke",
      name: "Elastic collision conserves kinetic energy",
      input: { m1: 1.2, m2: 0.8, u1: 3, u2: -1, restitution: 1 },
      expected: 0,
      unit: "J",
      tolerance: 1e-12,
      actual: (input) => {
        const r = simulateElasticCollision(input);
        return r.kineticAfter - r.kineticBefore;
      },
    },
    {
      id: "collision-stop-first",
      name: "Equal masses stop first cart against stationary second",
      input: { m1: 1, m2: 1, u1: 3, u2: 0, restitution: 1 },
      expected: 0,
      unit: "m/s",
      tolerance: 1e-12,
      actual: (input) => simulateElasticCollision(input).v1,
    },
  ]);
