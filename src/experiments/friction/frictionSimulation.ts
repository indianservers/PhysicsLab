import { runBenchmarkCases } from "../shared/validation";

export interface FrictionInput {
  mass: number;
  gravity: number;
  muS: number;
  muK: number;
  appliedForce: number;
  inclineDegrees: number;
}

export interface FrictionState {
  normalForce: number;
  gravityAlongPlane: number;
  maximumStaticFriction: number;
  kineticFriction: number;
  frictionForce: number;
  netForce: number;
  acceleration: number;
  thresholdAppliedForce: number;
  motionState: "static" | "impending" | "sliding";
}

const radians = (degrees: number) => (degrees * Math.PI) / 180;

export function simulateFriction(
  input: FrictionInput,
  velocity = 0,
): FrictionState {
  const angle = radians(input.inclineDegrees);
  const normalForce = input.mass * input.gravity * Math.cos(angle);
  const gravityAlongPlane = input.mass * input.gravity * Math.sin(angle);
  const maximumStaticFriction = input.muS * normalForce;
  const kineticFriction = input.muK * normalForce;
  const tendency = input.appliedForce - gravityAlongPlane;
  const isMoving = Math.abs(velocity) > 0.005;
  const held = !isMoving && Math.abs(tendency) <= maximumStaticFriction;
  const direction = Math.sign(isMoving ? velocity : tendency) || 1;
  const frictionForce = held ? -tendency : -direction * kineticFriction;
  const netForce = tendency + frictionForce;
  const ratio = maximumStaticFriction
    ? Math.abs(tendency) / maximumStaticFriction
    : Infinity;
  return {
    normalForce,
    gravityAlongPlane,
    maximumStaticFriction,
    kineticFriction,
    frictionForce,
    netForce: held ? 0 : netForce,
    acceleration: held ? 0 : netForce / input.mass,
    thresholdAppliedForce: gravityAlongPlane + maximumStaticFriction,
    motionState: held ? (ratio >= 0.9 ? "impending" : "static") : "sliding",
  };
}

const F: FrictionInput = {
  mass: 10,
  gravity: 9.8,
  muS: 0.5,
  muK: 0.3,
  appliedForce: 30,
  inclineDegrees: 0,
};

export const frictionBenchmarks = runBenchmarkCases<FrictionInput>([
  {
    id: "static-friction-matches-applied",
    name: "Static friction matches the force tendency",
    input: F,
    expected: -30,
    unit: "N",
    tolerance: 1e-9,
    actual: (input) => simulateFriction(input).frictionForce,
  },
  {
    id: "maximum-static-friction",
    name: "Static friction limit is mu_s N",
    input: F,
    expected: 49,
    unit: "N",
    tolerance: 1e-9,
    actual: (input) => simulateFriction(input).maximumStaticFriction,
  },
  {
    id: "kinetic-friction",
    name: "Sliding friction is mu_k N",
    input: { ...F, appliedForce: 60 },
    expected: -29.4,
    unit: "N",
    tolerance: 1e-9,
    actual: (input) => simulateFriction(input).frictionForce,
  },
  {
    id: "friction-opposes-negative-motion",
    name: "Kinetic friction opposes negative motion",
    input: { ...F, appliedForce: 0 },
    expected: 29.4,
    unit: "N",
    tolerance: 1e-9,
    actual: (input) => simulateFriction(input, -1).frictionForce,
  },
  {
    id: "incline-normal-force",
    name: "Incline normal force is mg cos theta",
    input: { ...F, inclineDegrees: 60 },
    expected: 49,
    unit: "N",
    tolerance: 1e-9,
    actual: (input) => simulateFriction(input).normalForce,
  },
]);
