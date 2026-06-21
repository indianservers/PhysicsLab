import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { PremiumMechanicsLab } from "../shared/PremiumMechanicsLab";
import { computePremiumMechanics, premiumMechanicsConfigs } from "../shared/mechanicsPremiumLibrary";
import "./elastic-collision.css";

export function ElasticCollisionLab({ experiment, learningLevel, experimentMode }: DedicatedExperimentLabProps) {
  const mode = experimentMode ?? (learningLevel === "Simple" ? "Beginner" : learningLevel === "Undergraduate" || learningLevel === "Research" ? "Advanced" : "Normal");
  const config = premiumMechanicsConfigs["elastic-collision"];
  return <PremiumMechanicsLab experiment={experiment} config={config} mode={mode} compute={(values) => computePremiumMechanics("elastic-collision", values)} />;
}
