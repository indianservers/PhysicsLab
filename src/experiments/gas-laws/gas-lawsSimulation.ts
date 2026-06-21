import { computePremiumOft } from "../shared/opticsFluidsThermoPremiumLibrary";
import { idealGasPressure } from "../shared/thermoMath";
export const simulateGasLaws = (values: Record<string, number>) => computePremiumOft("gas-laws", values);
export const gasLawsBenchmarks = [
  { id: "temperature", name: "Pressure rises with temperature", actual: idealGasPressure(1, 600, 1) / idealGasPressure(1, 300, 1), expected: 2, tolerance: 0.000001, unit: "ratio" },
  { id: "volume", name: "Pressure falls with volume", actual: idealGasPressure(1, 300, 1) / idealGasPressure(1, 300, 2), expected: 2, tolerance: 0.000001, unit: "ratio" },
];
