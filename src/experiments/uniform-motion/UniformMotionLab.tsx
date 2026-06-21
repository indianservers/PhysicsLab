import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { PremiumMechanicsLab } from "../shared/PremiumMechanicsLab";
import { computePremiumMechanics, premiumMechanicsConfigs } from "../shared/mechanicsPremiumLibrary";
import "./uniform-motion.css";

export function UniformMotionLab({ experiment, learningLevel, experimentMode }: DedicatedExperimentLabProps) {
  const mode = experimentMode ?? (learningLevel === "Simple" ? "Beginner" : learningLevel === "Undergraduate" || learningLevel === "Research" ? "Advanced" : "Normal");
  const config = premiumMechanicsConfigs["uniform-motion"];
  return <PremiumMechanicsLab experiment={experiment} config={config} mode={mode} compute={(values) => computePremiumMechanics("uniform-motion", values)} />;
}
