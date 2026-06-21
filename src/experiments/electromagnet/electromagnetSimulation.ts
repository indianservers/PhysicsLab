import { computePremiumEm } from "../shared/electromagnetismPremiumLibrary";
import { relativeElectromagnetStrength } from "../shared/magnetismMath";

export const simulateElectromagnet = (values: Record<string, number>) => computePremiumEm("electromagnet", values);

export const electromagnetBenchmarks = [
  { id: "turns-current", name: "More turns/current increases relative strength", actual: relativeElectromagnetStrength(200, 4, 1) - relativeElectromagnetStrength(100, 2, 1), expected: 600, tolerance: 0.000001, unit: "arb" },
  { id: "reverse", name: "Reversing current keeps strength magnitude", actual: Math.abs(relativeElectromagnetStrength(100, -2, 1)), expected: 200, tolerance: 0.000001, unit: "arb" },
];
