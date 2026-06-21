import { runBenchmarkCases } from "../shared/validation";

export interface FrictionInput {
  mass: number;
  gravity: number;
  mu: number;
  appliedForce: number;
}

export function simulateFriction(input: FrictionInput) {
  const normalForce = input.mass * input.gravity;
  const frictionForce = input.mu * normalForce;
  const opposingFriction = Math.min(Math.abs(input.appliedForce), frictionForce) * Math.sign(input.appliedForce || 1);
  const netForce = input.appliedForce - opposingFriction;
  const acceleration = Math.abs(input.appliedForce) <= frictionForce ? 0 : netForce / input.mass;
  const motionState = Math.abs(input.appliedForce) <= frictionForce ? "stuck" : Math.abs(acceleration) < 0.05 ? "sliding" : "accelerating";

  return { normalForce, frictionForce, netForce, acceleration, motionState };
}

export const frictionBenchmarks = runBenchmarkCases<FrictionInput>([
  {
    id: "friction-mu-normal",
    name: "Friction from coefficient and normal",
    input: { mass: 100 / 9.8, gravity: 9.8, mu: 0.3, appliedForce: 60 },
    expected: 30,
    unit: "N",
    tolerance: 1e-9,
    actual: (input) => simulateFriction(input).frictionForce,
  },
  {
    id: "friction-mass-gravity",
    name: "Friction from mass and gravity",
    input: { mass: 10, gravity: 9.8, mu: 0.5, appliedForce: 80 },
    expected: 49,
    unit: "N",
    tolerance: 1e-9,
    actual: (input) => simulateFriction(input).frictionForce,
  },
]);
