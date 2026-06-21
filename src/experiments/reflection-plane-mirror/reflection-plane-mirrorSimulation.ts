import { computePremiumOft } from "../shared/opticsFluidsThermoPremiumLibrary";
import { mirrorReflectionAngle, planeMirrorImageDistance } from "../shared/opticsMath";
export const simulateReflectionPlaneMirror = (values: Record<string, number>) => computePremiumOft("reflection-plane-mirror", values);
export const reflectionPlaneMirrorBenchmarks = [
  { id: "angle", name: "Incidence 30 gives reflection 30", actual: mirrorReflectionAngle(30), expected: 30, tolerance: 0.000001, unit: "deg" },
  { id: "distance", name: "Image distance equals object distance", actual: planeMirrorImageDistance(25), expected: 25, tolerance: 0.000001, unit: "cm" },
];
