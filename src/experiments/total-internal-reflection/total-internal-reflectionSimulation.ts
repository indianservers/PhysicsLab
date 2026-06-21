import { computePremiumOft } from "../shared/opticsFluidsThermoPremiumLibrary";
import { criticalAngleDeg } from "../shared/opticsMath";
export const simulateTotalInternalReflection = (values: Record<string, number>) => computePremiumOft("total-internal-reflection", values);
export const totalInternalReflectionBenchmarks = [
  { id: "critical", name: "n1=1.5,n2=1 critical angle approx 41.8", actual: criticalAngleDeg(1.5, 1), expected: 41.8103, tolerance: 0.01, unit: "deg" },
  { id: "rarer-denser", name: "Rarer to denser has no critical angle", actual: Number.isNaN(criticalAngleDeg(1, 1.5)) ? 1 : 0, expected: 1, tolerance: 0, unit: "bool" },
];
