import { runBenchmarkCases } from "../shared/validation";

export type OscillatorPreset =
  "symmetric" | "antisymmetric" | "beats" | "chaos";

export interface CoupledOscillatorParams {
  mass1Kg: number;
  mass2Kg: number;
  length1M: number;
  length2M: number;
  couplingNPerM: number;
  dampingNmsPerRad: number;
  angle1Deg: number;
  angle2Deg: number;
  driveAmplitudeNm: number;
  driveFrequencyRadS: number;
}

export interface OscillatorState {
  theta1: number;
  omega1: number;
  theta2: number;
  omega2: number;
}

export interface OscillatorSample extends OscillatorState {
  time: number;
  kinetic1: number;
  kinetic2: number;
  potential1: number;
  potential2: number;
  couplingEnergy: number;
  totalEnergy: number;
  divergence: number;
  nearbyTheta1: number;
  finite: boolean;
}

const G = 9.81;
const radians = (degrees: number) => (degrees * Math.PI) / 180;
const degrees = (radiansValue: number) => (radiansValue * 180) / Math.PI;

export const defaultCoupledParams: CoupledOscillatorParams = {
  mass1Kg: 0.25,
  mass2Kg: 0.25,
  length1M: 1,
  length2M: 1,
  couplingNPerM: 0.25,
  dampingNmsPerRad: 0.002,
  angle1Deg: 20,
  angle2Deg: 0,
  driveAmplitudeNm: 0,
  driveFrequencyRadS: 3.2,
};

export function accelerations(
  state: OscillatorState,
  params: CoupledOscillatorParams,
  time: number,
) {
  const x1 = params.length1M * Math.sin(state.theta1);
  const x2 = params.length2M * Math.sin(state.theta2);
  const extension = x1 - x2;
  const torque1 =
    -params.mass1Kg * G * params.length1M * Math.sin(state.theta1) -
    params.couplingNPerM *
      extension *
      params.length1M *
      Math.cos(state.theta1) -
    params.dampingNmsPerRad * state.omega1 +
    params.driveAmplitudeNm * Math.sin(params.driveFrequencyRadS * time);
  const torque2 =
    -params.mass2Kg * G * params.length2M * Math.sin(state.theta2) +
    params.couplingNPerM *
      extension *
      params.length2M *
      Math.cos(state.theta2) -
    params.dampingNmsPerRad * state.omega2;
  return {
    alpha1: torque1 / (params.mass1Kg * params.length1M ** 2),
    alpha2: torque2 / (params.mass2Kg * params.length2M ** 2),
  };
}

function derivative(
  state: OscillatorState,
  params: CoupledOscillatorParams,
  time: number,
) {
  const a = accelerations(state, params, time);
  return {
    theta1: state.omega1,
    omega1: a.alpha1,
    theta2: state.omega2,
    omega2: a.alpha2,
  };
}

function add(
  state: OscillatorState,
  slope: OscillatorState,
  scale: number,
): OscillatorState {
  return {
    theta1: state.theta1 + slope.theta1 * scale,
    omega1: state.omega1 + slope.omega1 * scale,
    theta2: state.theta2 + slope.theta2 * scale,
    omega2: state.omega2 + slope.omega2 * scale,
  };
}

export function rk4Step(
  state: OscillatorState,
  params: CoupledOscillatorParams,
  time: number,
  dt: number,
) {
  const k1 = derivative(state, params, time);
  const k2 = derivative(add(state, k1, dt / 2), params, time + dt / 2);
  const k3 = derivative(add(state, k2, dt / 2), params, time + dt / 2);
  const k4 = derivative(add(state, k3, dt), params, time + dt);
  return {
    theta1:
      state.theta1 +
      (dt / 6) * (k1.theta1 + 2 * k2.theta1 + 2 * k3.theta1 + k4.theta1),
    omega1:
      state.omega1 +
      (dt / 6) * (k1.omega1 + 2 * k2.omega1 + 2 * k3.omega1 + k4.omega1),
    theta2:
      state.theta2 +
      (dt / 6) * (k1.theta2 + 2 * k2.theta2 + 2 * k3.theta2 + k4.theta2),
    omega2:
      state.omega2 +
      (dt / 6) * (k1.omega2 + 2 * k2.omega2 + 2 * k3.omega2 + k4.omega2),
  };
}

export function oscillatorEnergy(
  state: OscillatorState,
  params: CoupledOscillatorParams,
) {
  const kinetic1 =
    0.5 * params.mass1Kg * params.length1M ** 2 * state.omega1 ** 2;
  const kinetic2 =
    0.5 * params.mass2Kg * params.length2M ** 2 * state.omega2 ** 2;
  const potential1 =
    params.mass1Kg * G * params.length1M * (1 - Math.cos(state.theta1));
  const potential2 =
    params.mass2Kg * G * params.length2M * (1 - Math.cos(state.theta2));
  const extension =
    params.length1M * Math.sin(state.theta1) -
    params.length2M * Math.sin(state.theta2);
  const couplingEnergy = 0.5 * params.couplingNPerM * extension ** 2;
  return {
    kinetic1,
    kinetic2,
    potential1,
    potential2,
    couplingEnergy,
    totalEnergy: kinetic1 + kinetic2 + potential1 + potential2 + couplingEnergy,
  };
}

export function normalModeMetrics(
  massKg: number,
  lengthM: number,
  couplingNPerM: number,
) {
  const omegaSymmetric = Math.sqrt(G / lengthM);
  const omegaAntisymmetric = Math.sqrt(
    G / lengthM + (2 * couplingNPerM) / massKg,
  );
  const frequencySymmetricHz = omegaSymmetric / (2 * Math.PI);
  const frequencyAntisymmetricHz = omegaAntisymmetric / (2 * Math.PI);
  const beatPeriodS =
    Math.PI / Math.max(1e-9, omegaAntisymmetric - omegaSymmetric);
  return {
    omegaSymmetric,
    omegaAntisymmetric,
    frequencySymmetricHz,
    frequencyAntisymmetricHz,
    beatPeriodS,
  };
}

function angularDifference(a: number, b: number) {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}

export function simulateCoupledOscillators(
  params: CoupledOscillatorParams,
  durationS = 40,
  sampleDt = 0.04,
  integrationDt = 0.004,
) {
  let state: OscillatorState = {
    theta1: radians(params.angle1Deg),
    omega1: 0,
    theta2: radians(params.angle2Deg),
    omega2: 0,
  };
  let nearby: OscillatorState = {
    ...state,
    theta1: state.theta1 + radians(0.05),
  };
  const samples: OscillatorSample[] = [];
  const substeps = Math.max(1, Math.round(sampleDt / integrationDt));
  const dt = sampleDt / substeps;
  const count = Math.round(durationS / sampleDt);
  for (let sampleIndex = 0; sampleIndex <= count; sampleIndex += 1) {
    const time = sampleIndex * sampleDt;
    const energy = oscillatorEnergy(state, params);
    const divergence = Math.hypot(
      angularDifference(state.theta1, nearby.theta1),
      angularDifference(state.theta2, nearby.theta2),
      (state.omega1 - nearby.omega1) * 0.2,
      (state.omega2 - nearby.omega2) * 0.2,
    );
    const finite = [
      ...Object.values(state),
      ...Object.values(nearby),
      energy.totalEnergy,
      divergence,
    ].every(Number.isFinite);
    samples.push({
      time,
      ...state,
      ...energy,
      divergence,
      nearbyTheta1: nearby.theta1,
      finite,
    });
    if (!finite) break;
    for (let j = 0; j < substeps; j += 1) {
      const subTime = time + j * dt;
      state = rk4Step(state, params, subTime, dt);
      nearby = rk4Step(nearby, params, subTime, dt);
    }
  }
  const initialEnergy = samples[0]?.totalEnergy ?? 0;
  const maximumEnergyDrift = samples.reduce(
    (max, sample) =>
      Math.max(max, Math.abs(sample.totalEnergy - initialEnergy)),
    0,
  );
  const maximumDivergence = samples.reduce(
    (max, sample) => Math.max(max, sample.divergence),
    0,
  );
  return {
    samples,
    initialEnergy,
    maximumEnergyDrift,
    relativeEnergyDrift:
      initialEnergy > 0 ? maximumEnergyDrift / initialEnergy : 0,
    maximumDivergence,
    stable:
      samples.length === count + 1 && samples.every((sample) => sample.finite),
  };
}

export function presetParams(
  preset: OscillatorPreset,
): Partial<CoupledOscillatorParams> {
  if (preset === "symmetric")
    return {
      angle1Deg: 20,
      angle2Deg: 20,
      dampingNmsPerRad: 0,
      driveAmplitudeNm: 0,
    };
  if (preset === "antisymmetric")
    return {
      angle1Deg: 20,
      angle2Deg: -20,
      dampingNmsPerRad: 0,
      driveAmplitudeNm: 0,
    };
  if (preset === "beats")
    return {
      angle1Deg: 20,
      angle2Deg: 0,
      couplingNPerM: 0.25,
      dampingNmsPerRad: 0.002,
      driveAmplitudeNm: 0,
    };
  return {
    angle1Deg: 112,
    angle2Deg: -38,
    couplingNPerM: 1.4,
    dampingNmsPerRad: 0,
    driveAmplitudeNm: 0.08,
    driveFrequencyRadS: 3.2,
  };
}

const conservative = {
  ...defaultCoupledParams,
  dampingNmsPerRad: 0,
  driveAmplitudeNm: 0,
};

export const chaoticCoupledOscillatorBenchmarks = runBenchmarkCases([
  {
    id: "symmetric-mode",
    name: "equal angles have equal acceleration",
    input: { theta: 0.2 },
    expected: 0,
    unit: "rad/s2",
    tolerance: 1e-12,
    actual: (input) => {
      const a = accelerations(
        { theta1: input.theta!, theta2: input.theta!, omega1: 0, omega2: 0 },
        conservative,
        0,
      );
      return a.alpha1 - a.alpha2;
    },
  },
  {
    id: "antisymmetric-mode",
    name: "opposite angles have opposite acceleration",
    input: { theta: 0.2 },
    expected: 0,
    unit: "rad/s2",
    tolerance: 1e-12,
    actual: (input) => {
      const a = accelerations(
        { theta1: input.theta!, theta2: -input.theta!, omega1: 0, omega2: 0 },
        conservative,
        0,
      );
      return a.alpha1 + a.alpha2;
    },
  },
  {
    id: "energy-conservation",
    name: "undamped RK4 trajectory conserves total energy",
    input: { duration: 20 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) =>
      simulateCoupledOscillators(conservative, input.duration!, 0.04, 0.004)
        .relativeEnergyDrift < 1e-6
        ? 1
        : 0,
  },
  {
    id: "beat-period",
    name: "energy-transfer period follows normal-mode splitting",
    input: { mass: 0.25, length: 1, coupling: 0.25 },
    expected: 10.31802701278396,
    unit: "s",
    tolerance: 1e-10,
    actual: (input) =>
      normalModeMetrics(input.mass!, input.length!, input.coupling!)
        .beatPeriodS,
  },
  {
    id: "bounded-sensitivity",
    name: "nearby nonlinear starts diverge without numerical explosion",
    input: { duration: 30 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) => {
      const result = simulateCoupledOscillators(
        { ...conservative, ...presetParams("chaos") },
        input.duration!,
        0.04,
        0.004,
      );
      return result.stable && result.maximumDivergence > radians(0.05) ? 1 : 0;
    },
  },
]);

export const toDegrees = degrees;
