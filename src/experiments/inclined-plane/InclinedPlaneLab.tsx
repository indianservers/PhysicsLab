import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { PremiumMechanicsLab } from "../shared/PremiumMechanicsLab";
import { computePremiumMechanics, premiumMechanicsConfigs } from "../shared/mechanicsPremiumLibrary";
import "./inclined-plane.css";

export function InclinedPlaneLab({ experiment, learningLevel, experimentMode }: DedicatedExperimentLabProps) {
  const mode = experimentMode ?? (learningLevel === "Simple" ? "Beginner" : learningLevel === "Undergraduate" || learningLevel === "Research" ? "Advanced" : "Normal");
  const config = premiumMechanicsConfigs["inclined-plane"];
  return <PremiumMechanicsLab experiment={experiment} config={config} mode={mode} compute={(values) => computePremiumMechanics("inclined-plane", values)} />;
}
