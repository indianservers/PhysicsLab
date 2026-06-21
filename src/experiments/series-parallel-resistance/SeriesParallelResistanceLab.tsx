import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { PremiumElectromagnetismLab } from "../shared/PremiumElectromagnetismLab";
import type { ExperimentMode } from "../shared/experimentModes";
import { premiumEmConfigs } from "../shared/electromagnetismPremiumLibrary";
import "./series-parallel-resistance.css";

function resolveMode({ learningLevel, experimentMode }: DedicatedExperimentLabProps): ExperimentMode {
  if (experimentMode) return experimentMode;
  if (learningLevel === "Simple") return "Beginner";
  if (learningLevel === "Undergraduate" || learningLevel === "Research") return "Advanced";
  return "Normal";
}

export function SeriesParallelResistanceLab(props: DedicatedExperimentLabProps) {
  return <PremiumElectromagnetismLab experiment={props.experiment} config={premiumEmConfigs["series-parallel-resistance"]} mode={resolveMode(props)} />;
}
