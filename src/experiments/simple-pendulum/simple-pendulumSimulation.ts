import { runBenchmarkCases } from "../shared/validation";

export type PendulumInput = {
  lengthM: number;
  amplitudeDeg: number;
  gravityMps2: number;
  dampingPerS: number;
  bobMassKg: number;
};
export type PendulumDynamic = { thetaRad: number; omegaRadS: number };
export const pendulumDefaults: PendulumInput = {
  lengthM: 1.2,
  amplitudeDeg: 15,
  gravityMps2: 9.81,
  dampingPerS: 0.01,
  bobMassKg: 0.2,
};
export const radians = (degrees: number) => (degrees * Math.PI) / 180;
export function smallAnglePeriod(lengthM: number, gravityMps2: number) {
  return 2 * Math.PI * Math.sqrt(lengthM / gravityMps2);
}
export function finiteAmplitudePeriod(input: PendulumInput) {
  const t = radians(input.amplitudeDeg),
    t0 = smallAnglePeriod(input.lengthM, input.gravityMps2);
  return t0 * (1 + (t * t) / 16 + (11 * t ** 4) / 3072);
}
export function pendulumStep(
  input: PendulumInput,
  state: PendulumDynamic,
  dt: number,
) {
  const alpha =
    -(input.gravityMps2 / input.lengthM) * Math.sin(state.thetaRad) -
    input.dampingPerS * state.omegaRadS;
  const omegaRadS = state.omegaRadS + alpha * dt;
  return { thetaRad: state.thetaRad + omegaRadS * dt, omegaRadS };
}
export function pendulumEnergy(input: PendulumInput, state: PendulumDynamic) {
  const potentialJ =
      input.bobMassKg *
      input.gravityMps2 *
      input.lengthM *
      (1 - Math.cos(state.thetaRad)),
    kineticJ = 0.5 * input.bobMassKg * (input.lengthM * state.omegaRadS) ** 2;
  return {
    potentialJ,
    kineticJ,
    totalJ: potentialJ + kineticJ,
    speedMps: input.lengthM * Math.abs(state.omegaRadS),
  };
}
export const simplePendulumBenchmarks = runBenchmarkCases([
  {
    id: "pendulum-period",
    name: "Small-angle period",
    input: { length: 1, gravity: 9.81 },
    expected: 2.0060666807106475,
    unit: "s",
    tolerance: 1e-12,
    actual: (i) => smallAnglePeriod(i.length ?? 1, i.gravity ?? 9.81),
  },
  {
    id: "pendulum-mass",
    name: "Period is mass independent",
    input: { length: 1, gravity: 9.81, mass: 0.2 },
    expected: 2.0060666807106475,
    unit: "s",
    tolerance: 1e-12,
    actual: (i) => smallAnglePeriod(i.length ?? 1, i.gravity ?? 9.81),
  },
  {
    id: "pendulum-large-angle",
    name: "Finite amplitude lengthens period",
    input: {},
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: () =>
      Number(
        finiteAmplitudePeriod({ ...pendulumDefaults, amplitudeDeg: 45 }) >
          smallAnglePeriod(
            pendulumDefaults.lengthM,
            pendulumDefaults.gravityMps2,
          ),
      ),
  },
  {
    id: "pendulum-gravity",
    name: "Gravity inferred from period",
    input: { length: 1, period: 2.0060666807106475 },
    expected: 9.81,
    unit: "m/s^2",
    tolerance: 1e-10,
    actual: (i) => (4 * Math.PI ** 2 * (i.length ?? 1)) / (i.period ?? 1) ** 2,
  },
  {
    id: "pendulum-bottom-speed",
    name: "Bottom speed from energy",
    input: { length: 1, gravity: 9.81, angle: 30 },
    expected: Math.sqrt(2 * 9.81 * (1 - Math.cos(Math.PI / 6))),
    unit: "m/s",
    tolerance: 1e-12,
    actual: (i) =>
      Math.sqrt(
        2 *
          (i.gravity ?? 9.81) *
          (i.length ?? 1) *
          (1 - Math.cos(radians(i.angle ?? 0))),
      ),
  },
]);
