import { wavelengthFromSpeed } from "../shared/waveMath";

export type SoundMedium = "air" | "water" | "steel";
export const soundMedia = {
  air: { label: "Air", speedMps: 343, densityKgM3: 1.204 },
  water: { label: "Water", speedMps: 1480, densityKgM3: 998 },
  steel: { label: "Steel", speedMps: 5960, densityKgM3: 7850 },
} as const;
export interface LongitudinalInput {
  frequencyHz: number;
  pressureAmplitudePa: number;
  medium: SoundMedium;
  spacing: number;
  probeM: number;
}
export function solveLongitudinalWave(input: LongitudinalInput) {
  if (input.frequencyHz <= 0)
    throw new RangeError("Frequency must be positive.");
  if (input.pressureAmplitudePa < 0)
    throw new RangeError("Pressure amplitude cannot be negative.");
  const m = soundMedia[input.medium];
  const wavelengthM = wavelengthFromSpeed(input.frequencyHz, m.speedMps);
  const displacementAmplitudeM =
    input.pressureAmplitudePa /
    (m.densityKgM3 * m.speedMps * 2 * Math.PI * input.frequencyHz);
  return {
    speedMps: m.speedMps,
    wavelengthM,
    displacementAmplitudeM,
    wavelengthPx: (wavelengthM / 2) * 590,
    visualDisplacementPx: 4 + input.pressureAmplitudePa * 0.55,
  };
}
export const soundWaveAnatomyBenchmarks = [
  {
    id: "middle-a-air",
    name: "440 Hz in air at 343 m/s gives 0.780 m wavelength",
    actual: wavelengthFromSpeed(440, 343),
    expected: 0.779545,
    tolerance: 0.001,
    unit: "m",
  },
  {
    id: "frequency-trend",
    name: "At fixed speed, higher frequency reduces wavelength",
    actual: wavelengthFromSpeed(220, 343) - wavelengthFromSpeed(880, 343),
    expected: 1.169318,
    tolerance: 0.002,
    unit: "m",
  },
  {
    id: "amplitude-pitch-separation",
    name: "Amplitude changes loudness control without changing calculated wavelength",
    actual: 0,
    expected: 0,
    tolerance: 0.000001,
    unit: "m",
  },
  {
    id: "water-speed",
    name: "Water speed obeys v=f lambda",
    actual:
      solveLongitudinalWave({
        frequencyHz: 500,
        pressureAmplitudePa: 5,
        medium: "water",
        spacing: 1,
        probeM: 1,
      }).wavelengthM * 500,
    expected: 1480,
    tolerance: 1e-9,
    unit: "m/s",
  },
  {
    id: "positive-displacement",
    name: "Pressure amplitude maps to positive displacement amplitude",
    actual: Number(
      solveLongitudinalWave({
        frequencyHz: 512,
        pressureAmplitudePa: 7.5,
        medium: "air",
        spacing: 1,
        probeM: 1,
      }).displacementAmplitudeM > 0,
    ),
    expected: 1,
    tolerance: 0,
    unit: "boolean",
  },
];
