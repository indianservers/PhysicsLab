import type { ControlPreset, ExperimentControl } from "../shared/ControlGroup";
import type { FormulaSymbol } from "../shared/FormulaAssumptionBox";

export const uniformMotionDefaults = { x0: 0, velocity: 5, time: 4 };

export const uniformMotionSymbols: FormulaSymbol[] = [
  { symbol: "x", meaning: "Final position", unit: "m" },
  { symbol: "x0", meaning: "Initial position", unit: "m" },
  { symbol: "v", meaning: "Constant velocity", unit: "m/s" },
  { symbol: "t", meaning: "Elapsed time", unit: "s" },
];

export const uniformMotionAssumptions = [
  "Velocity is constant during the measured time interval.",
  "Motion is one-dimensional along a straight track.",
  "Position is signed, so negative velocity can move the object left.",
];

export function uniformMotionControls(values: typeof uniformMotionDefaults, simple: boolean): ExperimentControl[] {
  const controls: ExperimentControl[] = [
    { id: "x0", label: "Initial position", unit: "m", min: -20, max: 20, step: 1, value: values.x0, defaultValue: uniformMotionDefaults.x0 },
    { id: "velocity", label: "Velocity", unit: "m/s", min: -10, max: 15, step: 0.5, value: values.velocity, defaultValue: uniformMotionDefaults.velocity },
    { id: "time", label: "Time", unit: "s", min: 0, max: 12, step: 0.5, value: values.time, defaultValue: uniformMotionDefaults.time },
  ];
  return simple ? controls.filter((control) => control.id === "velocity") : controls;
}

export const uniformMotionPresets: ControlPreset[] = [
  { id: "steady-runner", label: "Steady runner", values: { x0: 0, velocity: 6, time: 5 } },
  { id: "reverse-cart", label: "Reverse cart", values: { x0: 10, velocity: -2, time: 3 } },
  { id: "parked", label: "Parked object", values: { x0: -5, velocity: 0, time: 8 } },
];
