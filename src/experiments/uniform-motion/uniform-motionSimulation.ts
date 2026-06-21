import { runBenchmarkCases } from "../shared/validation";

export interface UniformMotionInput {
  x0: number;
  velocity: number;
  time: number;
}

export function simulateUniformMotion(input: UniformMotionInput) {
  const finalPosition = input.x0 + input.velocity * input.time;
  const distancePoints = Array.from({ length: 7 }, (_, index) => {
    const t = (input.time / 6) * index;
    return { x: t, y: input.x0 + input.velocity * t };
  });
  const velocityPoints = Array.from({ length: 7 }, (_, index) => {
    const t = (input.time / 6) * index;
    return { x: t, y: input.velocity };
  });

  return {
    finalPosition,
    displacement: finalPosition - input.x0,
    distancePoints,
    velocityPoints,
    slopeExplanation: `The distance-time graph slope is ${input.velocity.toFixed(2)} m/s, equal to velocity.`,
  };
}

export const uniformMotionBenchmarks = runBenchmarkCases<UniformMotionInput>([
  {
    id: "uniform-motion-position-positive",
    name: "Positive velocity position",
    input: { x0: 0, velocity: 5, time: 4 },
    expected: 20,
    unit: "m",
    tolerance: 1e-9,
    actual: (input) => simulateUniformMotion(input).finalPosition,
  },
  {
    id: "uniform-motion-position-negative",
    name: "Negative velocity position",
    input: { x0: 10, velocity: -2, time: 3 },
    expected: 4,
    unit: "m",
    tolerance: 1e-9,
    actual: (input) => simulateUniformMotion(input).finalPosition,
  },
]);
