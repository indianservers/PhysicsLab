import type { ControlPreset, ExperimentControl } from "../shared/ControlGroup";
import type { FormulaSymbol } from "../shared/FormulaAssumptionBox";

export const elasticCollisionDefaults = { m1: 2, m2: 1, u1: 3, u2: 0 };

export const elasticCollisionSymbols: FormulaSymbol[] = [
  { symbol: "m1, m2", meaning: "Cart masses", unit: "kg" },
  { symbol: "u1, u2", meaning: "Initial velocities", unit: "m/s" },
  { symbol: "v1, v2", meaning: "Final velocities after collision", unit: "m/s" },
];

export const elasticCollisionAssumptions = [
  "Collision is one-dimensional and perfectly elastic.",
  "External horizontal forces are ignored during the short impact.",
  "Both momentum and kinetic energy should be conserved.",
];

export const elasticCollisionPresets: ControlPreset[] = [
  { id: "equal-transfer", label: "Equal transfer", values: { m1: 1, m2: 1, u1: 5, u2: 0 } },
  { id: "heavy-light", label: "Heavy into light", values: { m1: 2, m2: 1, u1: 3, u2: 0 } },
  { id: "head-on", label: "Head-on", values: { m1: 1.5, m2: 1, u1: 4, u2: -2 } },
];

export function elasticCollisionControls(values: typeof elasticCollisionDefaults, simple: boolean): ExperimentControl[] {
  const controls: ExperimentControl[] = [
    { id: "u1", label: "Initial velocity 1", unit: "m/s", min: -8, max: 8, step: 0.5, value: values.u1, defaultValue: elasticCollisionDefaults.u1 },
    { id: "m1", label: "Mass 1", unit: "kg", min: 0.2, max: 8, step: 0.1, value: values.m1, defaultValue: elasticCollisionDefaults.m1 },
    { id: "m2", label: "Mass 2", unit: "kg", min: 0.2, max: 8, step: 0.1, value: values.m2, defaultValue: elasticCollisionDefaults.m2 },
    { id: "u2", label: "Initial velocity 2", unit: "m/s", min: -8, max: 8, step: 0.5, value: values.u2, defaultValue: elasticCollisionDefaults.u2 },
  ];
  return simple ? controls.filter((control) => control.id === "u1") : controls;
}
