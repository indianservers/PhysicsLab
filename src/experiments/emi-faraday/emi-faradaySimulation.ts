import { computePremiumEm } from "../shared/electromagnetismPremiumLibrary";
import { faradayEmf } from "../shared/electricityMath";

export const simulateEmiFaraday = (values: Record<string, number>) => computePremiumEm("emi-faraday", values);

export const emiFaradayBenchmarks = [
  { id: "turns-trend", name: "More turns increases emf", actual: Math.abs(faradayEmf(200, 0.02, 0.5)) - Math.abs(faradayEmf(100, 0.02, 0.5)), expected: 4, tolerance: 0.000001, unit: "V" },
  { id: "speed-trend", name: "Faster flux change increases emf", actual: Math.abs(faradayEmf(100, 0.02, 0.25)) - Math.abs(faradayEmf(100, 0.02, 0.5)), expected: 4, tolerance: 0.000001, unit: "V" },
  { id: "no-change", name: "No flux change gives zero emf", actual: faradayEmf(100, 0, 1), expected: 0, tolerance: 0.000001, unit: "V" },
];
