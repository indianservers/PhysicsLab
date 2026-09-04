import { runBenchmarkCases } from "../shared/validation";

export type RotationalInput = {
  forceN: number;
  leverArmM: number;
  pointMassKg: number;
  massRadiusM: number;
  axleDampingNmS: number;
};
export const rotationalDefaults: RotationalInput = {
  forceN: 2,
  leverArmM: 0.25,
  pointMassKg: 0.25,
  massRadiusM: 0.15,
  axleDampingNmS: 0.02,
};
export const diskMassKg = 2,
  diskRadiusM = 0.25;

export function rotationalState(
  input: RotationalInput,
  omegaRadS = 0,
  forceApplied = true,
) {
  const diskInertiaKgm2 = 0.5 * diskMassKg * diskRadiusM ** 2;
  const pointMassInertiaKgm2 = 2 * input.pointMassKg * input.massRadiusM ** 2;
  const inertiaKgm2 = diskInertiaKgm2 + pointMassInertiaKgm2;
  const appliedTorqueNm = forceApplied ? input.leverArmM * input.forceN : 0;
  const frictionTorqueNm = input.axleDampingNmS * omegaRadS;
  const netTorqueNm = appliedTorqueNm - frictionTorqueNm;
  const angularAccelerationRadS2 = netTorqueNm / inertiaKgm2;
  return {
    diskInertiaKgm2,
    pointMassInertiaKgm2,
    inertiaKgm2,
    appliedTorqueNm,
    frictionTorqueNm,
    netTorqueNm,
    angularAccelerationRadS2,
    angularMomentumKgM2S: inertiaKgm2 * omegaRadS,
    rotationalEnergyJ: 0.5 * inertiaKgm2 * omegaRadS ** 2,
  };
}

export const rotationalDynamicsBenchmarks = runBenchmarkCases([
  {
    id: "rotation-torque",
    name: "Tangential torque equals rF",
    input: { r: 0.25, force: 2 },
    expected: 0.5,
    unit: "N m",
    tolerance: 1e-12,
    actual: (i) => (i.r ?? 0) * (i.force ?? 0),
  },
  {
    id: "rotation-disk-I",
    name: "Solid disk inertia",
    input: { mass: 2, radius: 0.25 },
    expected: 0.0625,
    unit: "kg m^2",
    tolerance: 1e-12,
    actual: (i) => 0.5 * (i.mass ?? 0) * (i.radius ?? 0) ** 2,
  },
  {
    id: "rotation-points-I",
    name: "Two point masses inertia",
    input: { mass: 0.25, radius: 0.2 },
    expected: 0.02,
    unit: "kg m^2",
    tolerance: 1e-12,
    actual: (i) => 2 * (i.mass ?? 0) * (i.radius ?? 0) ** 2,
  },
  {
    id: "rotation-alpha",
    name: "Angular acceleration equals net torque over inertia",
    input: { torque: 0.5, inertia: 0.1 },
    expected: 5,
    unit: "rad/s^2",
    tolerance: 1e-12,
    actual: (i) => (i.torque ?? 0) / (i.inertia ?? 1),
  },
  {
    id: "rotation-angular-momentum",
    name: "Angular momentum equals I omega",
    input: { inertia: 0.1, omega: 3 },
    expected: 0.3,
    unit: "kg m^2/s",
    tolerance: 1e-12,
    actual: (i) => (i.inertia ?? 0) * (i.omega ?? 0),
  },
]);
