import { computePremiumEm } from "../shared/electromagnetismPremiumLibrary";
import { generatorPeakEmf } from "../shared/electricityMath";

export const simulateAcGenerator = (values: Record<string, number>) => computePremiumEm("ac-generator", values);

export const acGeneratorBenchmarks = [
  { id: "peak", name: "Peak emf follows NBAomega", actual: generatorPeakEmf(50, 0.5, 0.1, 20), expected: 50, tolerance: 0.000001, unit: "V" },
  { id: "omega-trend", name: "Higher omega increases peak emf", actual: generatorPeakEmf(50, 0.5, 0.1, 40) - generatorPeakEmf(50, 0.5, 0.1, 20), expected: 50, tolerance: 0.000001, unit: "V" },
];
