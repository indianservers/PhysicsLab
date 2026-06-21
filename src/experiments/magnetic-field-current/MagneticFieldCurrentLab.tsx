import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { PremiumElectromagnetismLab } from "../shared/PremiumElectromagnetismLab";
import type { ExperimentMode } from "../shared/experimentModes";
import { premiumEmConfigs } from "../shared/electromagnetismPremiumLibrary";
import "./magnetic-field-current.css";

function resolveMode({ learningLevel, experimentMode }: DedicatedExperimentLabProps): ExperimentMode {
  if (experimentMode) return experimentMode;
  if (learningLevel === "Simple") return "Beginner";
  if (learningLevel === "Undergraduate" || learningLevel === "Research") return "Advanced";
  return "Normal";
}

export function MagneticFieldCurrentLab(props: DedicatedExperimentLabProps) {
  return <PremiumElectromagnetismLab experiment={props.experiment} config={premiumEmConfigs["magnetic-field-current"]} mode={resolveMode(props)} />;
}
