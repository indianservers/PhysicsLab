import { premiumWaveConfigs } from "../shared/wavesPremiumLibrary";

export const soundWaveAnatomyData = premiumWaveConfigs["sound-wave-anatomy"];
export const soundWaveAnatomyDefaults = soundWaveAnatomyData.defaults;
export const soundWaveAnatomyControls = soundWaveAnatomyData.controls;
export const soundWaveAnatomyPresets = soundWaveAnatomyData.presets;
export const soundWaveAnatomyAssumptions = [
  "Medium speed is treated as uniform during each run.",
  "Particle dots show local oscillation, not long-distance particle travel.",
  "The pressure graph is a school-level visualization of compression and rarefaction.",
];
