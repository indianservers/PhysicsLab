import { computePremiumEm } from "../shared/electromagnetismPremiumLibrary";
import { straightWireField } from "../shared/magnetismMath";

export const simulateMagneticFieldCurrent = (values: Record<string, number>) => computePremiumEm("magnetic-field-current", values);

export const magneticFieldCurrentBenchmarks = [
  { id: "double-current", name: "Double current doubles field", actual: straightWireField(10, 0.2) / straightWireField(5, 0.2), expected: 2, tolerance: 0.000001, unit: "ratio" },
  { id: "double-distance", name: "Double distance halves field", actual: straightWireField(5, 0.2) / straightWireField(5, 0.1), expected: 0.5, tolerance: 0.000001, unit: "ratio" },
];
