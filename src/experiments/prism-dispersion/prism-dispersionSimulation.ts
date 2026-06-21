import { computePremiumOft } from "../shared/opticsFluidsThermoPremiumLibrary";
import { prismDeviation } from "../shared/opticsMath";
export const simulatePrismDispersion = (values: Record<string, number>) => computePremiumOft("prism-dispersion", values);
export const prismDispersionBenchmarks = [
  { id: "index-trend", name: "Larger index increases deviation", actual: prismDeviation(45, 1.6) - prismDeviation(45, 1.4), expected: 9, tolerance: 0.000001, unit: "deg" },
  { id: "angle-trend", name: "Larger prism angle increases deviation", actual: prismDeviation(60, 1.5) - prismDeviation(40, 1.5), expected: 10, tolerance: 0.000001, unit: "deg" },
];
