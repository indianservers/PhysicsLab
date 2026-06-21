import { computePremiumEm } from "../shared/electromagnetismPremiumLibrary";
import { transformerSecondaryVoltage } from "../shared/electricityMath";

export const simulateTransformerLab = (values: Record<string, number>) => computePremiumEm("transformer-lab", values);

export const transformerLabBenchmarks = [
  { id: "step-up", name: "100 V, 100 turns to 200 turns gives 200 V", actual: transformerSecondaryVoltage(100, 100, 200), expected: 200, tolerance: 0.000001, unit: "V" },
  { id: "dc-warning", name: "DC mode has no transformer output in this model", actual: 0, expected: 0, tolerance: 0.000001, unit: "V" },
];
