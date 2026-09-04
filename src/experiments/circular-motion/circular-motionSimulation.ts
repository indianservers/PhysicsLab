import { runBenchmarkCases } from "../shared/validation";

export interface CircularMotionInput {
  mass: number;
  radius: number;
  omega: number;
  direction?: 1 | -1;
}

export function simulateCircularMotion(input: CircularMotionInput) {
  const angularVelocity = input.omega * (input.direction ?? 1);
  const tangentialSpeed = input.radius * angularVelocity;
  const centripetalAcceleration = input.radius * input.omega ** 2;
  const centripetalForce = input.mass * centripetalAcceleration;
  const period = (2 * Math.PI) / input.omega;
  return {
    angularVelocity,
    tangentialSpeed,
    centripetalAcceleration,
    centripetalForce,
    period,
  };
}

export function circularVectors(input: CircularMotionInput, angle: number) {
  const solved = simulateCircularMotion(input);
  const radial = { x: Math.cos(angle), y: Math.sin(angle) };
  const direction = input.direction ?? 1;
  return {
    position: { x: input.radius * radial.x, y: input.radius * radial.y },
    velocity: {
      x: -direction * solved.tangentialSpeed * radial.y,
      y: direction * solved.tangentialSpeed * radial.x,
    },
    acceleration: {
      x: -solved.centripetalAcceleration * radial.x,
      y: -solved.centripetalAcceleration * radial.y,
    },
  };
}

export function tangentRelease(
  input: CircularMotionInput,
  angle: number,
  time: number,
) {
  const vectors = circularVectors(input, angle);
  return {
    x: vectors.position.x + vectors.velocity.x * time,
    y: vectors.position.y + vectors.velocity.y * time,
  };
}

export const circularMotionBenchmarks = runBenchmarkCases<CircularMotionInput>([
  {
    id: "circular-force",
    name: "Centripetal force",
    input: { mass: 2, radius: 3, omega: 4 },
    expected: 96,
    unit: "N",
    tolerance: 1e-9,
    actual: (input) => simulateCircularMotion(input).centripetalForce,
  },
  {
    id: "circular-speed",
    name: "Tangential speed",
    input: { mass: 1, radius: 2, omega: 5 },
    expected: 10,
    unit: "m/s",
    tolerance: 1e-9,
    actual: (input) => simulateCircularMotion(input).tangentialSpeed,
  },
  {
    id: "circular-acceleration-identity",
    name: "Acceleration identities agree",
    input: { mass: 1, radius: 2, omega: 3 },
    expected: 18,
    unit: "m/s²",
    tolerance: 1e-9,
    actual: (input) =>
      simulateCircularMotion(input).tangentialSpeed ** 2 / input.radius,
  },
  {
    id: "circular-tangent-release",
    name: "Released mass follows the tangent",
    input: { mass: 1, radius: 2, omega: 3 },
    expected: 6,
    unit: "m/s",
    tolerance: 1e-9,
    actual: (input) => tangentRelease(input, 0, 1).y / 1,
  },
  {
    id: "circular-constant-force",
    name: "Omega adjustment keeps force constant as radius doubles",
    input: { mass: 2, radius: 4, omega: Math.sqrt(8) },
    expected: 64,
    unit: "N",
    tolerance: 1e-9,
    actual: (input) => simulateCircularMotion(input).centripetalForce,
  },
]);
