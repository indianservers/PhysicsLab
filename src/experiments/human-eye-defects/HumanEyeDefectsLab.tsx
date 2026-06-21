import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import type { ExperimentMode } from "../shared/experimentModes";
import { PremiumOpticsFluidsThermoLab } from "../shared/PremiumOpticsFluidsThermoLab";
import { premiumOftConfigs } from "../shared/opticsFluidsThermoPremiumLibrary";
import "./human-eye-defects.css";
function mode({ learningLevel, experimentMode }: DedicatedExperimentLabProps): ExperimentMode { if (experimentMode) return experimentMode; if (learningLevel === "Simple") return "Beginner"; if (learningLevel === "Undergraduate" || learningLevel === "Research") return "Advanced"; return "Normal"; }
export function HumanEyeDefectsLab(props: DedicatedExperimentLabProps) { return <PremiumOpticsFluidsThermoLab experiment={props.experiment} config={premiumOftConfigs["human-eye-defects"]} mode={mode(props)} />; }
