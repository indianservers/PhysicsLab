import { runBenchmarkCases } from "../shared/validation";

export type ThermodynamicProcess =
  | "isothermal"
  | "adiabatic"
  | "isobaric"
  | "isochoric";

export interface ThermodynamicInput {
  pressureKPa: number;
  volumeL: number;
  temperatureK: number;
  endpointRatio: number;
  gamma: number;
}

export interface ThermodynamicState {
  pressureKPa: number;
  volumeL: number;
  temperatureK: number;
  moles: number;
  workJ: number;
  heatJ: number;
  deltaInternalEnergyJ: number;
}

export const GAS_CONSTANT = 8.314462618;

const positive = (value: number, name: string) => {
  if (!Number.isFinite(value) || value <= 0)
    throw new RangeError(`${name} must be positive.`);
  return value;
};

export function solveThermodynamicProcess(
  process: ThermodynamicProcess,
  input: ThermodynamicInput,
  fraction = 1,
): ThermodynamicState {
  const p1 = positive(input.pressureKPa, "Pressure");
  const v1 = positive(input.volumeL, "Volume");
  const t1 = positive(input.temperatureK, "Temperature");
  const gamma = input.gamma;
  if (gamma <= 1) throw new RangeError("Gamma must be greater than one.");
  const ratio = positive(input.endpointRatio, "Endpoint ratio");
  const progress = Math.min(1, Math.max(0, fraction));
  const n = (p1 * v1) / (GAS_CONSTANT * t1);
  const cv = GAS_CONSTANT / (gamma - 1);

  let pressureKPa = p1;
  let volumeL = v1;
  let temperatureK = t1;
  let workJ = 0;

  if (process === "isochoric") {
    const pressureRatio = 1 + (ratio - 1) * progress;
    pressureKPa = p1 * pressureRatio;
    temperatureK = t1 * pressureRatio;
  } else {
    const volumeRatio = 1 + (ratio - 1) * progress;
    volumeL = v1 * volumeRatio;
    if (process === "isobaric") {
      temperatureK = t1 * volumeRatio;
      workJ = p1 * (volumeL - v1);
    } else if (process === "isothermal") {
      pressureKPa = p1 / volumeRatio;
      workJ = p1 * v1 * Math.log(volumeRatio);
    } else {
      pressureKPa = p1 / volumeRatio ** gamma;
      temperatureK = t1 / volumeRatio ** (gamma - 1);
      workJ = (p1 * v1 - pressureKPa * volumeL) / (gamma - 1);
    }
  }

  const deltaInternalEnergyJ = n * cv * (temperatureK - t1);
  const heatJ = deltaInternalEnergyJ + workJ;
  return {
    pressureKPa,
    volumeL,
    temperatureK,
    moles: n,
    workJ,
    heatJ,
    deltaInternalEnergyJ,
  };
}

export function compareSameEndpoint(input: ThermodynamicInput) {
  const ratio = Math.max(1.05, input.endpointRatio);
  const p1 = input.pressureKPa;
  const v1 = input.volumeL;
  const finalPressure = p1 / ratio;
  const finalVolume = v1 * ratio;
  const directWorkJ = p1 * v1 * Math.log(ratio);
  const twoStepWorkJ = finalPressure * (finalVolume - v1);
  return {
    finalPressureKPa: finalPressure,
    finalVolumeL: finalVolume,
    finalTemperatureK: input.temperatureK,
    directWorkJ,
    twoStepWorkJ,
    directHeatJ: directWorkJ,
    twoStepHeatJ: twoStepWorkJ,
  };
}

export const thermodynamicProcessBenchmarks = runBenchmarkCases([
  {
    id: "ideal-gas",
    name: "Initial ideal-gas state is consistent",
    input: { p: 100, v: 2, t: 300 },
    expected: 200,
    unit: "J",
    tolerance: 1e-10,
    actual: ({ p, v, t }) => {
      const n = (Number(p) * Number(v)) / (GAS_CONSTANT * Number(t));
      return n * GAS_CONSTANT * Number(t);
    },
  },
  {
    id: "isothermal-work",
    name: "Isothermal work equals nRT ln(V2/V1)",
    input: { p: 100, v: 2, t: 300, r: 2, g: 1.4 },
    expected: 200 * Math.log(2),
    unit: "J",
    tolerance: 1e-10,
    actual: ({ p, v, t, r, g }) =>
      solveThermodynamicProcess("isothermal", {
        pressureKPa: Number(p), volumeL: Number(v), temperatureK: Number(t),
        endpointRatio: Number(r), gamma: Number(g),
      }).workJ,
  },
  {
    id: "isobaric-work",
    name: "Isobaric work equals P delta V",
    input: { p: 120, v: 3, t: 320, r: 1.5, g: 1.4 },
    expected: 180,
    unit: "J",
    tolerance: 1e-10,
    actual: ({ p, v, t, r, g }) =>
      solveThermodynamicProcess("isobaric", {
        pressureKPa: Number(p), volumeL: Number(v), temperatureK: Number(t),
        endpointRatio: Number(r), gamma: Number(g),
      }).workJ,
  },
  {
    id: "isochoric-work",
    name: "Isochoric work is zero",
    input: { p: 100, v: 2, t: 300, r: 1.6, g: 1.4 },
    expected: 0,
    unit: "J",
    tolerance: 0,
    actual: ({ p, v, t, r, g }) =>
      solveThermodynamicProcess("isochoric", {
        pressureKPa: Number(p), volumeL: Number(v), temperatureK: Number(t),
        endpointRatio: Number(r), gamma: Number(g),
      }).workJ,
  },
  {
    id: "adiabatic-invariant",
    name: "Adiabatic P V gamma is constant",
    input: { p: 100, v: 2, t: 300, r: 1.8, g: 1.4 },
    expected: 1,
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ p, v, t, r, g }) => {
      const state = solveThermodynamicProcess("adiabatic", {
        pressureKPa: Number(p), volumeL: Number(v), temperatureK: Number(t),
        endpointRatio: Number(r), gamma: Number(g),
      });
      return (state.pressureKPa * state.volumeL ** Number(g)) /
        (Number(p) * Number(v) ** Number(g));
    },
  },
  {
    id: "first-law",
    name: "First law residual is zero",
    input: { p: 180, v: 2.5, t: 340, r: 0.7, g: 1.33 },
    expected: 0,
    unit: "J",
    tolerance: 1e-10,
    actual: ({ p, v, t, r, g }) => {
      const state = solveThermodynamicProcess("adiabatic", {
        pressureKPa: Number(p), volumeL: Number(v), temperatureK: Number(t),
        endpointRatio: Number(r), gamma: Number(g),
      });
      return state.heatJ - state.workJ - state.deltaInternalEnergyJ;
    },
  },
]);

