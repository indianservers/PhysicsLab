import type { ControlPreset, ExperimentControl } from "../shared/ControlGroup";
import type { FormulaSymbol } from "../shared/FormulaAssumptionBox";

export const waveLabDefaults = { frequency: 10, speed: 20, sourceSeparation: 4, phaseDeg: 0, probeX: 2, probeY: 5 };

export const waveLabSymbols: FormulaSymbol[] = [
  { symbol: "v", meaning: "Wave speed", unit: "m/s" },
  { symbol: "f", meaning: "Frequency", unit: "Hz" },
  { symbol: "lambda", meaning: "Wavelength", unit: "m" },
  { symbol: "Delta r", meaning: "Path difference at probe", unit: "m" },
];

export const waveLabAssumptions = [
  "Two coherent point sources are visualized in 2D.",
  "Constructive interference occurs when path difference is an integer wavelength.",
  "Destructive interference occurs at half-integer wavelength path difference.",
];

export const waveLabPresets: ControlPreset[] = [
  { id: "single-source", label: "Single-source limit", values: { sourceSeparation: 0, phaseDeg: 0 } },
  { id: "in-phase", label: "In phase", values: { sourceSeparation: 4, phaseDeg: 0 } },
  { id: "opposite", label: "Opposite phase", values: { sourceSeparation: 4, phaseDeg: 180 } },
];

export function waveLabControls(values: typeof waveLabDefaults, simple: boolean): ExperimentControl[] {
  const controls: ExperimentControl[] = [
    { id: "frequency", label: "Frequency", unit: "Hz", min: 2, max: 30, step: 1, value: values.frequency, defaultValue: waveLabDefaults.frequency },
    { id: "speed", label: "Wave speed", unit: "m/s", min: 5, max: 60, step: 1, value: values.speed, defaultValue: waveLabDefaults.speed },
    { id: "sourceSeparation", label: "Source separation", unit: "m", min: 0, max: 10, step: 0.25, value: values.sourceSeparation, defaultValue: waveLabDefaults.sourceSeparation },
    { id: "phaseDeg", label: "Phase difference", unit: "deg", min: 0, max: 360, step: 15, value: values.phaseDeg, defaultValue: waveLabDefaults.phaseDeg },
    { id: "probeX", label: "Probe x", unit: "m", min: -8, max: 8, step: 0.5, value: values.probeX, defaultValue: waveLabDefaults.probeX },
    { id: "probeY", label: "Probe y", unit: "m", min: 1, max: 10, step: 0.5, value: values.probeY, defaultValue: waveLabDefaults.probeY },
  ];
  return simple ? controls.filter((control) => control.id === "frequency") : controls;
}
