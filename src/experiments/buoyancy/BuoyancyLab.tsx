import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import type { ExperimentMode } from "../shared/experimentModes";
import { PremiumOpticsFluidsThermoLab } from "../shared/PremiumOpticsFluidsThermoLab";
import { premiumOftConfigs } from "../shared/opticsFluidsThermoPremiumLibrary";
import "./buoyancy.css";
function mode({ learningLevel, experimentMode }: DedicatedExperimentLabProps): ExperimentMode { if (experimentMode) return experimentMode; if (learningLevel === "Simple") return "Beginner"; if (learningLevel === "Undergraduate" || learningLevel === "Research") return "Advanced"; return "Normal"; }
export function BuoyancyLab(props: DedicatedExperimentLabProps) { return <PremiumOpticsFluidsThermoLab experiment={props.experiment} config={premiumOftConfigs.buoyancy} mode={mode(props)} />; }
