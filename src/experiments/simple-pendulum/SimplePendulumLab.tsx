import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { PremiumMechanicsLab } from "../shared/PremiumMechanicsLab";
import { computePremiumMechanics, premiumMechanicsConfigs } from "../shared/mechanicsPremiumLibrary";
import "./simple-pendulum.css";

export function SimplePendulumLab({ experiment, learningLevel, experimentMode }: DedicatedExperimentLabProps) {
  const mode = experimentMode ?? (learningLevel === "Simple" ? "Beginner" : learningLevel === "Undergraduate" || learningLevel === "Research" ? "Advanced" : "Normal");
  const config = premiumMechanicsConfigs["simple-pendulum"];
  return <PremiumMechanicsLab experiment={experiment} config={config} mode={mode} compute={(values) => computePremiumMechanics("simple-pendulum", values)} />;
}
