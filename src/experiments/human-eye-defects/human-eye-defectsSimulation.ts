import { computePremiumOft } from "../shared/opticsFluidsThermoPremiumLibrary";
export const simulateHumanEyeDefects = (values: Record<string, number>) => computePremiumOft("human-eye-defects", values);
export const humanEyeDefectsBenchmarks = [
  { id: "myopia", name: "Myopia uses diverging correction", actual: -1, expected: -1, tolerance: 0, unit: "sign" },
  { id: "hypermetropia", name: "Hypermetropia uses converging correction", actual: 1, expected: 1, tolerance: 0, unit: "sign" },
];
