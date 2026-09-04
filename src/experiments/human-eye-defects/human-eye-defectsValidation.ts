import { humanEyeDefectsBenchmarks } from "./human-eye-defectsSimulation";

export const humanEyeDefectsValidation = humanEyeDefectsBenchmarks;
export const humanEyeDefectsValidated = humanEyeDefectsBenchmarks.every(
  (item) => item.pass,
);
