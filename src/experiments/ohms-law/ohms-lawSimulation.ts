import { computePremiumEm } from "../shared/electromagnetismPremiumLibrary";
import { ohmCurrent } from "../shared/electricityMath";

export const simulateOhmsLaw = (values: Record<string, number>) => computePremiumEm("ohms-law", values);

export const ohmsLawBenchmarks = [
  { id: "current", name: "V=10, R=5 gives I=2 A", actual: ohmCurrent(10, 5), expected: 2, tolerance: 0.000001, unit: "A" },
  { id: "slope", name: "V-I graph slope equals resistance", actual: 10 / ohmCurrent(10, 5), expected: 5, tolerance: 0.000001, unit: "ohm" },
];
