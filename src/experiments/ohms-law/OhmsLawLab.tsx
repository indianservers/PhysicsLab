import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { PremiumElectromagnetismLab } from "../shared/PremiumElectromagnetismLab";
import type { ExperimentMode } from "../shared/experimentModes";
import { premiumEmConfigs } from "../shared/electromagnetismPremiumLibrary";
import "./ohms-law.css";

function resolveMode({ learningLevel, experimentMode }: DedicatedExperimentLabProps): ExperimentMode {
  if (experimentMode) return experimentMode;
  if (learningLevel === "Simple") return "Beginner";
  if (learningLevel === "Undergraduate" || learningLevel === "Research") return "Advanced";
  return "Normal";
}

export function OhmsLawLab(props: DedicatedExperimentLabProps) {
  return <PremiumElectromagnetismLab experiment={props.experiment} config={premiumEmConfigs["ohms-law"]} mode={resolveMode(props)} />;
}
