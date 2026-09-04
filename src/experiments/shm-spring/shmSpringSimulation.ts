import { runBenchmarkCases } from "../shared/validation";

export interface ShmSpringInput {
  massKg: number;
  springConstantNm: number;
  amplitudeM: number;
  dampingNsM: number;
  driveFrequencyHz: number;
  driven: boolean;
  timeS: number;
}

function freeState(input: ShmSpringInput, omega0: number) {
  const gamma = input.dampingNsM / (2 * input.massKg);
  const A = input.amplitudeM;
  const t = input.timeS;
  const discriminant = omega0 ** 2 - gamma ** 2;
  if (Math.abs(discriminant) < 1e-10) {
    const decay = Math.exp(-gamma * t);
    return { x: A * decay * (1 + gamma * t), v: -A * gamma ** 2 * t * decay };
  }
  if (discriminant > 0) {
    const omegaD = Math.sqrt(discriminant);
    const decay = Math.exp(-gamma * t);
    const x =
      A *
      decay *
      (Math.cos(omegaD * t) + (gamma / omegaD) * Math.sin(omegaD * t));
    const v = -A * decay * ((omega0 ** 2 / omegaD) * Math.sin(omegaD * t));
    return { x, v };
  }
  const sigma = Math.sqrt(-discriminant);
  const r1 = -gamma + sigma;
  const r2 = -gamma - sigma;
  const c1 = (-r2 * A) / (r1 - r2);
  const c2 = A - c1;
  return {
    x: c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t),
    v: c1 * r1 * Math.exp(r1 * t) + c2 * r2 * Math.exp(r2 * t),
  };
}

export function solveShmSpring(input: ShmSpringInput) {
  if (input.massKg <= 0 || input.springConstantNm <= 0)
    throw new RangeError("Mass and spring constant must be positive.");
  if (
    input.amplitudeM < 0 ||
    input.dampingNsM < 0 ||
    input.driveFrequencyHz <= 0
  )
    throw new RangeError(
      "Amplitude and damping cannot be negative; drive frequency must be positive.",
    );
  const omega0 = Math.sqrt(input.springConstantNm / input.massKg);
  const naturalFrequencyHz = omega0 / (2 * Math.PI);
  const periodS = (2 * Math.PI) / omega0;
  const dampingRatio =
    input.dampingNsM / (2 * Math.sqrt(input.springConstantNm * input.massKg));
  const driveOmega = 2 * Math.PI * input.driveFrequencyHz;
  const driveForceN = 0.2;
  const denominator = Math.hypot(
    input.springConstantNm - input.massKg * driveOmega ** 2,
    input.dampingNsM * driveOmega,
  );
  const responseAmplitudeM = driveForceN / Math.max(denominator, 1e-9);
  const phaseLagRad = Math.atan2(
    input.dampingNsM * driveOmega,
    input.springConstantNm - input.massKg * driveOmega ** 2,
  );
  let x: number, v: number, acceleration: number;
  if (input.driven) {
    const phase = driveOmega * input.timeS - phaseLagRad;
    x = responseAmplitudeM * Math.cos(phase);
    v = -responseAmplitudeM * driveOmega * Math.sin(phase);
    acceleration = -responseAmplitudeM * driveOmega ** 2 * Math.cos(phase);
  } else {
    ({ x, v } = freeState(input, omega0));
    acceleration = -(input.dampingNsM / input.massKg) * v - omega0 ** 2 * x;
  }
  const kineticJ = 0.5 * input.massKg * v ** 2;
  const potentialJ = 0.5 * input.springConstantNm * x ** 2;
  const initialEnergyJ = 0.5 * input.springConstantNm * input.amplitudeM ** 2;
  return {
    omega0,
    naturalFrequencyHz,
    periodS,
    dampingRatio,
    responseAmplitudeM,
    phaseLagRad,
    driveForceN,
    x,
    v,
    acceleration,
    kineticJ,
    potentialJ,
    totalEnergyJ: kineticJ + potentialJ,
    initialEnergyJ,
  };
}

const base = {
  massKg: 0.5,
  springConstantNm: 20,
  amplitudeM: 0.15,
  dampingNsM: 0,
  driveFrequencyHz: 1,
  driven: false,
};
export const shmSpringBenchmarks = runBenchmarkCases([
  {
    id: "omega",
    name: "Natural angular frequency is root k over m",
    input: {},
    expected: Math.sqrt(40),
    unit: "rad/s",
    tolerance: 1e-12,
    actual: () => solveShmSpring({ ...base, timeS: 0 }).omega0,
  },
  {
    id: "period",
    name: "Period is two pi root m over k",
    input: {},
    expected: 2 * Math.PI * Math.sqrt(0.5 / 20),
    unit: "s",
    tolerance: 1e-12,
    actual: () => solveShmSpring({ ...base, timeS: 0 }).periodS,
  },
  {
    id: "turning-speed",
    name: "Speed is zero at release amplitude",
    input: {},
    expected: 0,
    unit: "m/s",
    tolerance: 1e-12,
    actual: () => solveShmSpring({ ...base, timeS: 0 }).v,
  },
  {
    id: "equilibrium-speed",
    name: "Speed is maximum at equilibrium",
    input: {},
    expected: 0.15 * Math.sqrt(40),
    unit: "m/s",
    tolerance: 1e-12,
    actual: () =>
      Math.abs(
        solveShmSpring({ ...base, timeS: Math.PI / 2 / Math.sqrt(40) }).v,
      ),
  },
  {
    id: "energy",
    name: "Undamped mechanical energy is conserved",
    input: {},
    expected: 0,
    unit: "J",
    tolerance: 1e-12,
    actual: () => {
      const r = solveShmSpring({ ...base, timeS: 0.37 });
      return r.totalEnergyJ - r.initialEnergyJ;
    },
  },
  {
    id: "phase",
    name: "Acceleration opposes displacement",
    input: {},
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: () => {
      const r = solveShmSpring({ ...base, timeS: 0.2 });
      return r.x * r.acceleration <= 0 ? 1 : 0;
    },
  },
]);
