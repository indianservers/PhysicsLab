import { runBenchmarkCases } from "../shared/validation";

export interface VectorResolutionInput {
  magnitude: number;
  angleDeg: number;
  axisRotationDeg: number;
}

export const radians = (degrees: number) => (degrees * Math.PI) / 180;

export function resolveVector(input: VectorResolutionInput) {
  const relativeAngleDeg = input.angleDeg - input.axisRotationDeg;
  const relativeAngleRad = radians(relativeAngleDeg);
  const xComponent = input.magnitude * Math.cos(relativeAngleRad);
  const yComponent = input.magnitude * Math.sin(relativeAngleRad);
  return {
    relativeAngleDeg,
    xComponent,
    yComponent,
    recombinedMagnitude: Math.hypot(xComponent, yComponent),
    recombinedAngleDeg:
      (Math.atan2(yComponent, xComponent) * 180) / Math.PI +
      input.axisRotationDeg,
  };
}

export const vectorResolutionBenchmarks =
  runBenchmarkCases<VectorResolutionInput>([
    {
      id: "vr-3-4-5-x",
      name: "3-4-5 x component",
      input: { magnitude: 5, angleDeg: 53.1301023542, axisRotationDeg: 0 },
      expected: 3,
      unit: "N",
      tolerance: 1e-9,
      actual: (input) => resolveVector(input).xComponent,
    },
    {
      id: "vr-3-4-5-y",
      name: "3-4-5 y component",
      input: { magnitude: 5, angleDeg: 53.1301023542, axisRotationDeg: 0 },
      expected: 4,
      unit: "N",
      tolerance: 1e-9,
      actual: (input) => resolveVector(input).yComponent,
    },
    {
      id: "vr-quadrant-two-sign",
      name: "Quadrant II gives negative x",
      input: { magnitude: 10, angleDeg: 120, axisRotationDeg: 0 },
      expected: -5,
      unit: "N",
      tolerance: 1e-9,
      actual: (input) => resolveVector(input).xComponent,
    },
    {
      id: "vr-rotated-axis",
      name: "Components use rotated axes",
      input: { magnitude: 20, angleDeg: 75, axisRotationDeg: 30 },
      expected: 20 / Math.sqrt(2),
      unit: "N",
      tolerance: 1e-9,
      actual: (input) => resolveVector(input).xComponent,
    },
    {
      id: "vr-recombine",
      name: "Pythagorean recombination",
      input: { magnitude: 73, angleDeg: -132, axisRotationDeg: 24 },
      expected: 73,
      unit: "N",
      tolerance: 1e-9,
      actual: (input) => resolveVector(input).recombinedMagnitude,
    },
  ]);
