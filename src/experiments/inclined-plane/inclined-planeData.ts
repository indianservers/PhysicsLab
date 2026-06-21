import type { ControlPreset, ExperimentControl } from "../shared/ControlGroup";
import type { FormulaSymbol } from "../shared/FormulaAssumptionBox";

export const inclinedPlaneDefaults = { angle: 30, mass: 5, mu: 0.2, gravity: 9.8 };

export const inclinedPlaneSymbols: FormulaSymbol[] = [
  { symbol: "a", meaning: "Acceleration down the plane", unit: "m/s²" },
  { symbol: "g", meaning: "Gravitational field strength", unit: "m/s²" },
  { symbol: "theta", meaning: "Incline angle", unit: "degrees" },
  { symbol: "mu", meaning: "Friction coefficient", unit: "unitless" },
];

export const inclinedPlaneAssumptions = [
  "Object is treated as a block sliding along a rigid plane.",
  "Friction acts up the plane and cannot exceed the downhill component.",
  "If the downhill component is fully balanced, acceleration is clamped to zero.",
];

export const inclinedPlanePresets: ControlPreset[] = [
  { id: "frictionless-30", label: "30° no friction", values: { angle: 30, mu: 0 } },
  { id: "flat", label: "Flat plane", values: { angle: 0, mu: 0.2 } },
  { id: "steep", label: "Steep slide", values: { angle: 55, mu: 0.1 } },
];

export function inclinedPlaneControls(values: typeof inclinedPlaneDefaults, simple: boolean): ExperimentControl[] {
  const controls: ExperimentControl[] = [
    { id: "angle", label: "Angle", unit: "deg", min: 0, max: 80, step: 1, value: values.angle, defaultValue: inclinedPlaneDefaults.angle },
    { id: "mass", label: "Mass", unit: "kg", min: 0.5, max: 30, step: 0.5, value: values.mass, defaultValue: inclinedPlaneDefaults.mass },
    { id: "mu", label: "Coefficient of friction", min: 0, max: 1.2, step: 0.01, value: values.mu, defaultValue: inclinedPlaneDefaults.mu },
    { id: "gravity", label: "Gravity", unit: "m/s²", min: 1, max: 20, step: 0.1, value: values.gravity, defaultValue: inclinedPlaneDefaults.gravity },
  ];
  return simple ? controls.filter((control) => control.id === "angle") : controls;
}
