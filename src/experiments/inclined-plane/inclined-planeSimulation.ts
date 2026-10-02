import { runBenchmarkCases } from "../shared/validation";

export interface InclinedPlaneInput {
  angleDegrees: number;
  massKg: number;
  frictionCoefficient: number;
  appliedForceN: number;
  gravity: number;
}

export function simulateInclinedPlane(
  input: InclinedPlaneInput,
  velocityDownMps = 0,
) {
  const theta = (input.angleDegrees * Math.PI) / 180;
  const weightN = input.massKg * input.gravity;
  const parallelWeightN = weightN * Math.sin(theta);
  const normalForceN = weightN * Math.cos(theta);
  const maximumStaticFrictionN = input.frictionCoefficient * normalForceN;
  const kineticFrictionN = 0.8 * maximumStaticFrictionN;
  const downSlopeTendencyN = parallelWeightN - input.appliedForceN;
  const moving = Math.abs(velocityDownMps) > 0.005;
  const held =
    !moving && Math.abs(downSlopeTendencyN) <= maximumStaticFrictionN;
  const direction =
    Math.sign(moving ? velocityDownMps : downSlopeTendencyN) || 1;
  const frictionForceN = held
    ? -downSlopeTendencyN
    : -direction * kineticFrictionN;
  const netDownSlopeN = held ? 0 : downSlopeTendencyN + frictionForceN;
  return {
    weightN,
    parallelWeightN,
    normalForceN,
    maximumStaticFrictionN,
    kineticFrictionN,
    frictionForceN,
    netDownSlopeN,
    accelerationDownMps2: netDownSlopeN / input.massKg,
    criticalAngleDegrees:
      (Math.atan(input.frictionCoefficient) * 180) / Math.PI,
    motionState: held
      ? Math.abs(downSlopeTendencyN) / Math.max(0.001, maximumStaticFrictionN) >
        0.92
        ? "impending"
        : "held"
      : "sliding",
  } as const;
}

const I: InclinedPlaneInput = {
  angleDegrees: 30,
  massKg: 2,
  frictionCoefficient: 0,
  appliedForceN: 0,
  gravity: 9.8,
};

export const inclinedPlaneBenchmarks = runBenchmarkCases<InclinedPlaneInput>([
  {
    id: "incline-parallel-weight",
    name: "Parallel weight is mg sin theta",
    input: I,
    expected: 9.8,
    unit: "N",
    tolerance: 1e-9,
    actual: (input) => simulateInclinedPlane(input).parallelWeightN,
  },
  {
    id: "incline-normal-force",
    name: "Normal force is mg cos theta",
    input: I,
    expected: 16.974097914174997,
    unit: "N",
    tolerance: 1e-9,
    actual: (input) => simulateInclinedPlane(input).normalForceN,
  },
  {
    id: "incline-frictionless-acceleration",
    name: "Frictionless acceleration is g sin theta",
    input: I,
    expected: 4.9,
    unit: "m/s²",
    tolerance: 1e-9,
    actual: (input) => simulateInclinedPlane(input).accelerationDownMps2,
  },
  {
    id: "incline-angle-of-repose",
    name: "Critical angle satisfies tan theta equals mu",
    input: { ...I, frictionCoefficient: 0.5 },
    expected: 0.5,
    unit: "unitless",
    tolerance: 1e-12,
    actual: (input) =>
      Math.tan(
        (simulateInclinedPlane(input).criticalAngleDegrees * Math.PI) / 180,
      ),
  },
  {
    id: "incline-static-hold",
    name: "Static friction holds below critical angle",
    input: { ...I, angleDegrees: 20, frictionCoefficient: 0.5 },
    expected: 0,
    unit: "m/s²",
    tolerance: 1e-12,
    actual: (input) => simulateInclinedPlane(input).accelerationDownMps2,
  },
]);
