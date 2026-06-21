import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { PremiumWaveLab } from "../shared/PremiumWaveLab";
import type { ExperimentMode } from "../shared/experimentModes";
import { premiumWaveConfigs } from "../shared/wavesPremiumLibrary";
import "./young-double-slit.css";

function resolveMode({ learningLevel, experimentMode }: DedicatedExperimentLabProps): ExperimentMode {
  if (experimentMode) return experimentMode;
  if (learningLevel === "Simple") return "Beginner";
  if (learningLevel === "Undergraduate" || learningLevel === "Research") return "Advanced";
  return "Normal";
}

export function YoungDoubleSlitLab(props: DedicatedExperimentLabProps) {
  return <PremiumWaveLab experiment={props.experiment} config={premiumWaveConfigs["young-double-slit"]} mode={resolveMode(props)} />;
}
