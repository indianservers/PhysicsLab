import { computePremiumOft } from "../shared/opticsFluidsThermoPremiumLibrary";
import { bernoulliPressure, continuitySpeed } from "../shared/fluidMath";
export const simulateBernoulliFluidFlow = (values: Record<string, number>) => computePremiumOft("bernoulli-fluid-flow", values);
export const bernoulliFluidFlowBenchmarks = [
  { id: "speed", name: "Narrow section has higher speed", actual: continuitySpeed(1, 0.25) - continuitySpeed(1, 1), expected: 3, tolerance: 0.000001, unit: "m/s" },
  { id: "pressure", name: "Narrow section has lower pressure", actual: bernoulliPressure(100000, 1000, 1) - bernoulliPressure(100000, 1000, 4), expected: 7500, tolerance: 0.000001, unit: "Pa" },
];
