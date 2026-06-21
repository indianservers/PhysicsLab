import { computePremiumOft } from "../shared/opticsFluidsThermoPremiumLibrary";
import { buoyantForce, floatingFraction } from "../shared/fluidMath";
export const simulateBuoyancy = (values: Record<string, number>) => computePremiumOft("buoyancy", values);
export const buoyancyBenchmarks = [
  { id: "float", name: "Less dense object floats", actual: floatingFraction(500, 1000), expected: 0.5, tolerance: 0.000001, unit: "fraction" },
  { id: "force", name: "Buoyant force equals displaced fluid weight", actual: buoyantForce(1000, 9.8, 0.02), expected: 196, tolerance: 0.000001, unit: "N" },
];
