import { runBenchmarkCases } from "../shared/validation";

export type NewtonInput = {
  massKg: number;
  appliedForceN: number;
  frictionN: number;
  samplingIntervalS: number;
};
export type NewtonTrial = NewtonInput & {
  id: number;
  netForceN: number;
  accelerationMps2: number;
  durationS: number;
};
export const newtonDefaults: NewtonInput = {
  massKg: 1,
  appliedForceN: 6,
  frictionN: 1,
  samplingIntervalS: 0.25,
};

export function newtonState(input: NewtonInput) {
  const massKg = Math.max(0.1, input.massKg);
  const direction = Math.sign(input.appliedForceN);
  const netForceN =
    direction * Math.max(0, Math.abs(input.appliedForceN) - input.frictionN);
  return {
    massKg,
    netForceN,
    accelerationMps2: netForceN / massKg,
    inverseMassPerKg: 1 / massKg,
    staticHold: input.appliedForceN !== 0 && netForceN === 0,
  };
}

export function motionAt(accelerationMps2: number, timeS: number) {
  return {
    positionM: 0.5 * accelerationMps2 * timeS * timeS,
    velocityMps: accelerationMps2 * timeS,
  };
}

export function simulateNewtonsSecondLaw(values: Record<string, number>) {
  return newtonState({
    massKg: values.mass ?? values.massKg ?? 1,
    appliedForceN: values.force ?? values.appliedForceN ?? 0,
    frictionN: values.friction ?? values.frictionN ?? 0,
    samplingIntervalS: values.samplingIntervalS ?? 0.25,
  });
}

export const newtonSecondLawBenchmarks = runBenchmarkCases([
  {
    id: "newton-net",
    name: "Net force subtracts friction",
    input: { applied: 9, friction: 3 },
    expected: 6,
    unit: "N",
    tolerance: 1e-12,
    actual: (i) =>
      newtonState({
        massKg: 2,
        appliedForceN: i.applied ?? 0,
        frictionN: i.friction ?? 0,
        samplingIntervalS: 0.25,
      }).netForceN,
  },
  {
    id: "newton-acceleration",
    name: "Acceleration equals net force over mass",
    input: { net: 8, mass: 2 },
    expected: 4,
    unit: "m/s^2",
    tolerance: 1e-12,
    actual: (i) =>
      newtonState({
        massKg: i.mass ?? 1,
        appliedForceN: i.net ?? 0,
        frictionN: 0,
        samplingIntervalS: 0.25,
      }).accelerationMps2,
  },
  {
    id: "newton-static",
    name: "Friction threshold can hold the cart",
    input: { applied: 2, friction: 3 },
    expected: 0,
    unit: "m/s^2",
    tolerance: 1e-12,
    actual: (i) =>
      newtonState({
        massKg: 1,
        appliedForceN: i.applied ?? 0,
        frictionN: i.friction ?? 0,
        samplingIntervalS: 0.25,
      }).accelerationMps2,
  },
  {
    id: "newton-position",
    name: "Position from consistent rest conditions",
    input: { acceleration: 4, time: 2 },
    expected: 8,
    unit: "m",
    tolerance: 1e-12,
    actual: (i) => motionAt(i.acceleration ?? 0, i.time ?? 0).positionM,
  },
  {
    id: "newton-inverse-mass",
    name: "Acceleration is linear in inverse mass",
    input: { force: 6, inverseMass: 0.5 },
    expected: 3,
    unit: "m/s^2",
    tolerance: 1e-12,
    actual: (i) => (i.force ?? 0) * (i.inverseMass ?? 0),
  },
]);
