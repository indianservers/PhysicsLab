import { runBenchmarkCases } from "../shared/validation";

export interface CircularMotionInput {
  mass: number;
  radius: number;
  omega: number;
}

export function simulateCircularMotion(input: CircularMotionInput) {
  const tangentialSpeed = input.radius * input.omega;
  const centripetalAcceleration = input.radius * input.omega ** 2;
  const centripetalForce = input.mass * centripetalAcceleration;
  const period = (2 * Math.PI) / input.omega;
  return { tangentialSpeed, centripetalAcceleration, centripetalForce, period };
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
]);
