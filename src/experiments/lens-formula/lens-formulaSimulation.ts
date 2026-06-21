import { computePremiumOft } from "../shared/opticsFluidsThermoPremiumLibrary";
import { thinLensImageDistance } from "../shared/opticsMath";
export const simulateLensFormula = (values: Record<string, number>) => computePremiumOft("lens-formula", values);
export const lensFormulaBenchmarks = [
  { id: "image-distance", name: "f=20,u=60 gives v=30", actual: thinLensImageDistance(20, 60), expected: 30, tolerance: 0.000001, unit: "cm" },
  { id: "virtual", name: "inside focal length gives negative virtual distance", actual: thinLensImageDistance(20, 10), expected: -20, tolerance: 0.000001, unit: "cm" },
];
