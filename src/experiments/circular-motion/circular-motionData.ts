import type { ControlPreset, ExperimentControl } from "../shared/ControlGroup";
import type { FormulaSymbol } from "../shared/FormulaAssumptionBox";

export const circularMotionDefaults = { mass: 2, radius: 3, omega: 4 };

export const circularMotionSymbols: FormulaSymbol[] = [
  { symbol: "Fc", meaning: "Centripetal force", unit: "N" },
  { symbol: "m", meaning: "Mass", unit: "kg" },
  { symbol: "r", meaning: "Radius", unit: "m" },
  { symbol: "omega", meaning: "Angular speed", unit: "rad/s" },
  { symbol: "T", meaning: "Period", unit: "s" },
];

export const circularMotionAssumptions = [
  "Object moves at constant angular speed in a horizontal circle.",
  "Centripetal force is always directed toward the center.",
  "Air resistance and vertical forces are not shown in the top-view model.",
];

export const circularMotionPresets: ControlPreset[] = [
  { id: "benchmark", label: "Benchmark", values: { mass: 2, radius: 3, omega: 4 } },
  { id: "fast-small", label: "Fast small circle", values: { mass: 1, radius: 1.5, omega: 6 } },
  { id: "wide-slow", label: "Wide slow circle", values: { mass: 3, radius: 5, omega: 2 } },
];

export function circularMotionControls(values: typeof circularMotionDefaults, simple: boolean): ExperimentControl[] {
  const controls: ExperimentControl[] = [
    { id: "omega", label: "Angular speed", unit: "rad/s", min: 0.5, max: 8, step: 0.1, value: values.omega, defaultValue: circularMotionDefaults.omega },
    { id: "mass", label: "Mass", unit: "kg", min: 0.2, max: 10, step: 0.1, value: values.mass, defaultValue: circularMotionDefaults.mass },
    { id: "radius", label: "Radius", unit: "m", min: 0.5, max: 8, step: 0.1, value: values.radius, defaultValue: circularMotionDefaults.radius },
  ];
  return simple ? controls.filter((control) => control.id === "omega") : controls;
}
