import { computePremiumWave } from "../shared/wavesPremiumLibrary";
import { youngFringeWidth } from "../shared/waveMath";

export function simulateYoungDoubleSlit(values: Record<string, number>) {
  return computePremiumWave("young-double-slit", values);
}

export const youngDoubleSlitBenchmarks = [
  {
    id: "numeric-fringe-width",
    name: "500 nm, 2 m, 0.5 mm gives 0.002 m fringe width",
    actual: youngFringeWidth(500, 2, 0.5),
    expected: 0.002,
    tolerance: 0.00005,
    unit: "m",
  },
  {
    id: "wavelength-trend",
    name: "Higher wavelength increases fringe width",
    actual: youngFringeWidth(650, 2, 0.5) - youngFringeWidth(450, 2, 0.5),
    expected: 0.0008,
    tolerance: 0.00005,
    unit: "m",
  },
  {
    id: "separation-trend",
    name: "Higher slit separation decreases fringe width",
    actual: youngFringeWidth(500, 2, 0.3) - youngFringeWidth(500, 2, 0.8),
    expected: 0.0020833333,
    tolerance: 0.00008,
    unit: "m",
  },
];
