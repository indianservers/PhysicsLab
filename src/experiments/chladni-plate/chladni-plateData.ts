import type { ControlPreset, ExperimentControl } from "../shared/ControlGroup";
import type { FormulaSymbol } from "../shared/FormulaAssumptionBox";

export const chladniDefaults = { modeN: 2, modeM: 3, frequency: 440, amplitude: 1, damping: 0.35 };

export const chladniSymbols: FormulaSymbol[] = [
  { symbol: "z", meaning: "Vertical displacement in qualitative mode model", unit: "relative" },
  { symbol: "n, m", meaning: "Mode numbers along plate axes", unit: "integer" },
  { symbol: "omega", meaning: "Angular frequency", unit: "rad/s" },
  { symbol: "A", meaning: "Relative vibration amplitude", unit: "relative" },
];

export const chladniAssumptions = [
  "Uses z(x,y,t) = A sin(n pi x/L) sin(m pi y/L) cos(omega t).",
  "Sand is visualized as migrating toward low-amplitude node lines.",
  "Qualitative classroom model only; not a finite-element plate solver.",
];

export const chladniPresets: ControlPreset[] = [
  { id: "simple", label: "Simple 1,1", values: { modeN: 1, modeM: 1, frequency: 220 } },
  { id: "cross", label: "Cross mode", values: { modeN: 2, modeM: 2, frequency: 440 } },
  { id: "complex", label: "Complex 3,4", values: { modeN: 3, modeM: 4, frequency: 880 } },
];

export function chladniControls(values: typeof chladniDefaults, simple: boolean): ExperimentControl[] {
  const controls: ExperimentControl[] = [
    { id: "modeN", label: "Mode n", min: 1, max: 6, step: 1, value: values.modeN, defaultValue: chladniDefaults.modeN },
    { id: "modeM", label: "Mode m", min: 1, max: 6, step: 1, value: values.modeM, defaultValue: chladniDefaults.modeM },
    { id: "frequency", label: "Frequency", unit: "Hz", min: 100, max: 1200, step: 10, value: values.frequency, defaultValue: chladniDefaults.frequency },
    { id: "amplitude", label: "Amplitude", min: 0.1, max: 2, step: 0.1, value: values.amplitude, defaultValue: chladniDefaults.amplitude },
    { id: "damping", label: "Particle settling", min: 0, max: 1, step: 0.05, value: values.damping, defaultValue: chladniDefaults.damping },
  ];
  return simple ? controls.filter((control) => control.id === "modeN") : controls;
}
