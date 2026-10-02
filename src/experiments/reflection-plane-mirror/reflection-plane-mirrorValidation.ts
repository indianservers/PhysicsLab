import { reflectionPlaneMirrorBenchmarks } from "./reflection-plane-mirrorSimulation";

export const reflectionPlaneMirrorValidation = reflectionPlaneMirrorBenchmarks;
export const reflectionPlaneMirrorValidated =
  reflectionPlaneMirrorBenchmarks.every((item) => item.pass);
