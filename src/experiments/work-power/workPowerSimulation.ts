import { runBenchmarkCases } from "../shared/validation";

export interface WorkPowerInput {
  massKg: number;
  forceN: number;
  distanceM: number;
  angleDeg: number;
  durationS: number;
  frictionCoefficient: number;
}

const radians = (degrees: number) => (degrees * Math.PI) / 180;

export function workPowerState(
  input: WorkPowerInput,
  elapsedS = input.durationS,
) {
  const theta = radians(input.angleDeg);
  const parallelForceN = input.forceN * Math.cos(theta);
  const normalForceN = Math.max(
    0,
    input.massKg * 9.81 - input.forceN * Math.sin(theta),
  );
  const frictionForceN = input.frictionCoefficient * normalForceN;
  const netForceN = Math.max(0, parallelForceN - frictionForceN);
  const accelerationMps2 = netForceN / input.massKg;
  const timeToTargetS =
    accelerationMps2 > 0
      ? Math.sqrt((2 * input.distanceM) / accelerationMps2)
      : Infinity;
  const activeTimeS = Math.min(elapsedS, timeToTargetS);
  const travelledM = Math.min(
    input.distanceM,
    0.5 * accelerationMps2 * activeTimeS ** 2,
  );
  const speedMps = accelerationMps2 * activeTimeS;
  const appliedWorkJ = parallelForceN * travelledM;
  const frictionWorkJ = -frictionForceN * travelledM;
  const netWorkJ = netForceN * travelledM;
  const kineticEnergyJ = 0.5 * input.massKg * speedMps ** 2;
  return {
    parallelForceN,
    normalForceN,
    frictionForceN,
    netForceN,
    accelerationMps2,
    timeToTargetS,
    travelledM,
    speedMps,
    appliedWorkJ,
    frictionWorkJ,
    netWorkJ,
    kineticEnergyJ,
    averageNetPowerW: activeTimeS > 0 ? netWorkJ / activeTimeS : 0,
    instantaneousAppliedPowerW: parallelForceN * speedMps,
    reachedTarget: elapsedS >= timeToTargetS,
  };
}

export const workPowerBenchmarks = runBenchmarkCases<WorkPowerInput>([
  {
    id: "wp-dot-product",
    name: "Applied work uses dot product",
    input: {
      massKg: 10,
      forceN: 20,
      distanceM: 5,
      angleDeg: 60,
      durationS: 10,
      frictionCoefficient: 0,
    },
    expected: 50,
    unit: "J",
    tolerance: 1e-9,
    actual: (input) => workPowerState(input, 100).appliedWorkJ,
  },
  {
    id: "wp-zero-work",
    name: "Perpendicular force does zero work",
    input: {
      massKg: 10,
      forceN: 20,
      distanceM: 5,
      angleDeg: 90,
      durationS: 10,
      frictionCoefficient: 0,
    },
    expected: 0,
    unit: "J",
    tolerance: 1e-9,
    actual: (input) => workPowerState(input, 100).appliedWorkJ,
  },
  {
    id: "wp-negative-work",
    name: "Opposing force has negative work",
    input: {
      massKg: 10,
      forceN: 20,
      distanceM: 5,
      angleDeg: 120,
      durationS: 10,
      frictionCoefficient: 0,
    },
    expected: -50,
    unit: "J",
    tolerance: 1e-9,
    actual: (input) =>
      input.forceN * input.distanceM * Math.cos(radians(input.angleDeg)),
  },
  {
    id: "wp-work-energy",
    name: "Net work equals kinetic-energy change",
    input: {
      massKg: 50,
      forceN: 200,
      distanceM: 8,
      angleDeg: 0,
      durationS: 20,
      frictionCoefficient: 0.2,
    },
    expected: 0,
    unit: "J",
    tolerance: 1e-9,
    actual: (input) => {
      const state = workPowerState(input, 100);
      return state.netWorkJ - state.kineticEnergyJ;
    },
  },
  {
    id: "wp-average-power",
    name: "Average power is work over time",
    input: {
      massKg: 20,
      forceN: 100,
      distanceM: 10,
      angleDeg: 0,
      durationS: 10,
      frictionCoefficient: 0,
    },
    expected: 500,
    unit: "W",
    tolerance: 1e-9,
    actual: (input) => {
      const state = workPowerState(input, 2);
      return state.netWorkJ / 2;
    },
  },
]);
