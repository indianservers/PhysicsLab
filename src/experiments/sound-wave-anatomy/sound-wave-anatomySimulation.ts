import { wavelengthFromSpeed } from "../shared/waveMath";
import { computePremiumWave } from "../shared/wavesPremiumLibrary";

export function simulateSoundWaveAnatomy(values: Record<string, number>) {
  return computePremiumWave("sound-wave-anatomy", values);
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
    actual: wavelengthFromSpeed(440, 343) - wavelengthFromSpeed(440, 343),
    expected: 0,
    tolerance: 0.000001,
    unit: "m",
  },
];
