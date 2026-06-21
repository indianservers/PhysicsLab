import { premiumWaveConfigs } from "../shared/wavesPremiumLibrary";

export const youngDoubleSlitData = premiumWaveConfigs["young-double-slit"];
export const youngDoubleSlitDefaults = youngDoubleSlitData.defaults;
export const youngDoubleSlitControls = youngDoubleSlitData.controls;
export const youngDoubleSlitPresets = youngDoubleSlitData.presets;
export const youngDoubleSlitAssumptions = [
  "Slits are coherent and narrow compared with screen distance.",
  "Small-angle approximation is used for fringe spacing.",
  "Inputs are converted to SI units before applying beta = lambda D / d.",
];
