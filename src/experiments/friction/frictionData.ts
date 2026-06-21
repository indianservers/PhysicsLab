import type { ControlPreset, ExperimentControl } from "../shared/ControlGroup";
import type { FormulaSymbol } from "../shared/FormulaAssumptionBox";

export const frictionDefaults = { mass: 10, gravity: 9.8, mu: 0.4, appliedForce: 25 };

export const frictionSymbols: FormulaSymbol[] = [
  { symbol: "f", meaning: "Kinetic friction", unit: "N" },
  { symbol: "mu", meaning: "Coefficient of friction", unit: "unitless" },
  { symbol: "N", meaning: "Normal force on flat surface", unit: "N" },
  { symbol: "m", meaning: "Mass", unit: "kg" },
  { symbol: "g", meaning: "Gravitational field strength", unit: "m/s²" },
];

export const frictionAssumptions = [
  "Flat horizontal surface, so N = mg.",
  "The friction force opposes the applied force.",
  "Static sticking is modeled with the same coefficient as a classroom simplification.",
];

export const frictionPresets: ControlPreset[] = [
  { id: "ice", label: "Ice", values: { mu: 0.05, appliedForce: 10 } },
  { id: "wood", label: "Wood", values: { mu: 0.4, appliedForce: 30 } },
  { id: "rubber", label: "Rubber", values: { mu: 0.85, appliedForce: 80 } },
];

export function frictionControls(values: typeof frictionDefaults, simple: boolean): ExperimentControl[] {
  const controls: ExperimentControl[] = [
    { id: "appliedForce", label: "Applied force", unit: "N", min: -100, max: 100, step: 1, value: values.appliedForce, defaultValue: frictionDefaults.appliedForce },
    { id: "mass", label: "Mass", unit: "kg", min: 1, max: 40, step: 0.5, value: values.mass, defaultValue: frictionDefaults.mass },
    { id: "gravity", label: "Gravity", unit: "m/s²", min: 1, max: 20, step: 0.1, value: values.gravity, defaultValue: frictionDefaults.gravity },
    { id: "mu", label: "Coefficient of friction", min: 0, max: 1.5, step: 0.01, value: values.mu, defaultValue: frictionDefaults.mu },
  ];
  return simple ? controls.filter((control) => control.id === "appliedForce") : controls;
}
