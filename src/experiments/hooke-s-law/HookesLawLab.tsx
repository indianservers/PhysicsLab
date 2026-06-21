import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { PremiumMechanicsLab } from "../shared/PremiumMechanicsLab";
import { computePremiumMechanics, premiumMechanicsConfigs } from "../shared/mechanicsPremiumLibrary";
import "./hooke-s-law.css";

export function HookesLawLab({ experiment, learningLevel, experimentMode }: DedicatedExperimentLabProps) {
  const mode = experimentMode ?? (learningLevel === "Simple" ? "Beginner" : learningLevel === "Undergraduate" || learningLevel === "Research" ? "Advanced" : "Normal");
  const config = premiumMechanicsConfigs["hooke-s-law"];
  return <PremiumMechanicsLab experiment={experiment} config={config} mode={mode} compute={(values) => computePremiumMechanics("hooke-s-law", values)} />;
}
