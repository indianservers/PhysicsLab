import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { PremiumWaveLab } from "../shared/PremiumWaveLab";
import type { ExperimentMode } from "../shared/experimentModes";
import { premiumWaveConfigs } from "../shared/wavesPremiumLibrary";
import "./chladni-plate.css";

function resolveMode({ learningLevel, experimentMode }: DedicatedExperimentLabProps): ExperimentMode {
  if (experimentMode) return experimentMode;
  if (learningLevel === "Simple") return "Beginner";
  if (learningLevel === "Undergraduate" || learningLevel === "Research") return "Advanced";
  return "Normal";
}

export function ChladniPlateLab(props: DedicatedExperimentLabProps) {
  return <PremiumWaveLab experiment={props.experiment} config={premiumWaveConfigs["chladni-plate"]} mode={resolveMode(props)} />;
}
