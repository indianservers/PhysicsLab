import { runBenchmarkCases } from "../shared/validation";

export type WaveMode = "traveling" | "standing" | "fixed" | "free";

export interface WaveLabInput {
  amplitudeM: number;
  frequencyHz: number;
  wavelengthM: number;
  phaseDeg: number;
  secondWave: boolean;
  mode: WaveMode;
  timeS: number;
  sampleXM: number;
  lengthM?: number;
}

const TAU = Math.PI * 2;
export const wrapDegrees = (degrees: number) =>
  ((((degrees + 180) % 360) + 360) % 360) - 180;

export function nodePhaseDegrees(xM: number, wavelengthM: number) {
  return wrapDegrees((-720 * xM) / wavelengthM);
}

export function solveWaveLab(input: WaveLabInput) {
  const lengthM = input.lengthM ?? 1;
  const omega = TAU * input.frequencyHz;
  const waveNumber = TAU / input.wavelengthM;
  const phaseRad = (input.phaseDeg * Math.PI) / 180;
  const speedMs = input.frequencyHz * input.wavelengthM;
  const firstAt = (xM: number, timeS = input.timeS) =>
    input.amplitudeM * Math.sin(waveNumber * xM - omega * timeS);
  const secondAt = (xM: number, timeS = input.timeS) => {
    if (!input.secondWave) return 0;
    if (input.mode === "fixed") {
      return (
        -input.amplitudeM *
        Math.sin(waveNumber * (2 * lengthM - xM) - omega * timeS)
      );
    }
    if (input.mode === "free") {
      return (
        input.amplitudeM *
        Math.sin(waveNumber * (2 * lengthM - xM) - omega * timeS)
      );
    }
    if (input.mode === "standing") {
      return (
        input.amplitudeM * Math.sin(waveNumber * xM + omega * timeS + phaseRad)
      );
    }
    return (
      input.amplitudeM * Math.sin(waveNumber * xM - omega * timeS + phaseRad)
    );
  };
  const resultantAt = (xM: number, timeS = input.timeS) =>
    firstAt(xM, timeS) + secondAt(xM, timeS);
  const y1 = firstAt(input.sampleXM);
  const y2 = secondAt(input.sampleXM);
  const resultant = y1 + y2;
  const fixedBoundaryResidual =
    input.mode === "fixed" ? resultantAt(lengthM) : 0;
  const freeBoundarySlope =
    input.mode === "free"
      ? (resultantAt(lengthM + 1e-5) - resultantAt(lengthM - 1e-5)) / 2e-5
      : 0;
  const targetNodePhaseDeg = nodePhaseDegrees(
    input.sampleXM,
    input.wavelengthM,
  );
  const nodeEnvelopeM =
    input.secondWave && input.mode === "standing"
      ? 2 *
        input.amplitudeM *
        Math.abs(Math.sin(waveNumber * input.sampleXM + phaseRad / 2))
      : Math.abs(resultant);
  return {
    omega,
    waveNumber,
    speedMs,
    periodS: 1 / input.frequencyHz,
    y1,
    y2,
    resultant,
    fixedBoundaryResidual,
    freeBoundarySlope,
    targetNodePhaseDeg,
    nodeEnvelopeM,
    firstAt,
    secondAt,
    resultantAt,
  };
}

const reference: WaveLabInput = {
  amplitudeM: 0.005,
  frequencyHz: 12,
  wavelengthM: 0.0417,
  phaseDeg: 0,
  secondWave: true,
  mode: "standing",
  timeS: 0,
  sampleXM: 0.6,
};

export const waveLabBenchmarks = runBenchmarkCases<WaveLabInput>([
  {
    id: "wave-speed-relation",
    name: "Wave speed equals frequency times wavelength",
    input: reference,
    expected: 0.5004,
    unit: "m/s",
    tolerance: 1e-12,
    actual: (input) => solveWaveLab(input).speedMs,
  },
  {
    id: "wave-superposition",
    name: "Resultant equals algebraic component sum",
    input: { ...reference, timeS: 0.017, sampleXM: 0.41 },
    expected: 0,
    unit: "m",
    tolerance: 1e-12,
    actual: (input) => {
      const r = solveWaveLab(input);
      return r.resultant - r.y1 - r.y2;
    },
  },
  {
    id: "fixed-boundary-inversion",
    name: "Fixed-end reflection cancels at the boundary",
    input: { ...reference, mode: "fixed", timeS: 0.013 },
    expected: 0,
    unit: "m",
    tolerance: 1e-12,
    actual: (input) => solveWaveLab(input).fixedBoundaryResidual,
  },
  {
    id: "free-boundary-slope",
    name: "Free-end reflection has zero boundary slope",
    input: { ...reference, mode: "free", timeS: 0.013 },
    expected: 0,
    unit: "m/m",
    tolerance: 1e-6,
    actual: (input) => solveWaveLab(input).freeBoundarySlope,
  },
  {
    id: "standing-node-phase",
    name: "Solved phase creates a stationary node",
    input: {
      ...reference,
      wavelengthM: 0.08,
      phaseDeg: nodePhaseDegrees(0.6, 0.08),
    },
    expected: 0,
    unit: "m",
    tolerance: 1e-12,
    actual: (input) => solveWaveLab(input).nodeEnvelopeM,
  },
]);
