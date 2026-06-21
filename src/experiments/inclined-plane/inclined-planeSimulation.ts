import { runBenchmarkCases } from "../shared/validation";

export interface InclinedPlaneInput {
  angle: number;
  mass: number;
  mu: number;
  gravity: number;
}

const toRad = (degrees: number) => degrees * Math.PI / 180;

export function simulateInclinedPlane(input: InclinedPlaneInput) {
  const theta = toRad(input.angle);
  const parallelWeight = input.mass * input.gravity * Math.sin(theta);
  const normalForce = input.mass * input.gravity * Math.cos(theta);
  const friction = Math.min(input.mu * normalForce, Math.max(0, parallelWeight));
  const netForce = Math.max(0, parallelWeight - friction);
  const acceleration = netForce / input.mass;
  return { parallelWeight, normalForce, friction, netForce, acceleration };
}

export const inclinedPlaneBenchmarks = runBenchmarkCases<InclinedPlaneInput>([
  {
    id: "incline-thirty-no-friction",
    name: "30 degree frictionless acceleration",
    input: { angle: 30, mass: 2, mu: 0, gravity: 9.8 },
    expected: 4.9,
    unit: "m/s²",
    tolerance: 1e-9,
    actual: (input) => simulateInclinedPlane(input).acceleration,
  },
  {
    id: "incline-flat-no-false-acceleration",
    name: "Flat plane does not accelerate down plane",
    input: { angle: 0, mass: 2, mu: 0.2, gravity: 9.8 },
    expected: 0,
    unit: "m/s²",
    tolerance: 1e-9,
    actual: (input) => simulateInclinedPlane(input).acceleration,
  },
]);
