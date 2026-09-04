import { runBenchmarkCases } from "../shared/validation";

export type SoundWaveform = "sine" | "triangle" | "square" | "sawtooth";
export interface SoundPitchInput {
  frequencyHz: number;
  peakPressurePa: number;
  waveform: SoundWaveform;
}

export const REFERENCE_PRESSURE_PA = 20e-6;
export const SAFE_CONTINUOUS_SPL_DB = 85;

export function solveSoundPitch(input: SoundPitchInput) {
  if (!Number.isFinite(input.frequencyHz) || input.frequencyHz <= 0)
    throw new RangeError("Frequency must be positive.");
  if (!Number.isFinite(input.peakPressurePa) || input.peakPressurePa < 0)
    throw new RangeError("Pressure amplitude cannot be negative.");
  const periodSeconds = 1 / input.frequencyHz;
  const rmsPressurePa = input.peakPressurePa / Math.sqrt(2);
  const soundPressureLevelDb =
    rmsPressurePa > 0
      ? 20 * Math.log10(rmsPressurePa / REFERENCE_PRESSURE_PA)
      : Number.NEGATIVE_INFINITY;
  const relativeIntensity = (input.peakPressurePa / 0.2) ** 2;
  return {
    periodSeconds,
    rmsPressurePa,
    soundPressureLevelDb,
    relativeIntensity,
    safe: soundPressureLevelDb <= SAFE_CONTINUOUS_SPL_DB,
    pitchBand:
      input.frequencyHz < 220
        ? "Low pitch"
        : input.frequencyHz < 600
          ? "Mid pitch"
          : "High pitch",
  };
}

export const soundPitchBenchmarks = runBenchmarkCases<SoundPitchInput>([
  {
    id: "period",
    name: "Period is reciprocal frequency",
    input: { frequencyHz: 500, peakPressurePa: 0.2, waveform: "sine" },
    expected: 0.002,
    unit: "s",
    tolerance: 1e-12,
    actual: (input) => solveSoundPitch(input).periodSeconds,
  },
  {
    id: "rms",
    name: "Sine RMS pressure is peak over root two",
    input: { frequencyHz: 440, peakPressurePa: Math.SQRT2, waveform: "sine" },
    expected: 1,
    unit: "Pa",
    tolerance: 1e-12,
    actual: (input) => solveSoundPitch(input).rmsPressurePa,
  },
  {
    id: "intensity-square",
    name: "Double amplitude gives fourfold relative intensity",
    input: { frequencyHz: 440, peakPressurePa: 0.4, waveform: "sine" },
    expected: 4,
    unit: "relative",
    tolerance: 1e-12,
    actual: (input) => solveSoundPitch(input).relativeIntensity,
  },
  {
    id: "frequency-independent-level",
    name: "Frequency alone does not change pressure level",
    input: { frequencyHz: 220, peakPressurePa: 0.2, waveform: "sine" },
    expected: 0,
    unit: "dB",
    tolerance: 1e-12,
    actual: (input) =>
      solveSoundPitch({ ...input, frequencyHz: 880 }).soundPressureLevelDb -
      solveSoundPitch(input).soundPressureLevelDb,
  },
  {
    id: "six-decibels",
    name: "Double pressure adds about six decibels",
    input: { frequencyHz: 440, peakPressurePa: 0.2, waveform: "sine" },
    expected: 20 * Math.log10(2),
    unit: "dB",
    tolerance: 1e-12,
    actual: (input) =>
      solveSoundPitch({ ...input, peakPressurePa: input.peakPressurePa * 2 })
        .soundPressureLevelDb - solveSoundPitch(input).soundPressureLevelDb,
  },
]);
