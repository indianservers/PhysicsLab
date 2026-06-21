import type { ControlPreset, ExperimentControl } from "../shared/ControlGroup";
import type { FormulaSymbol } from "../shared/FormulaAssumptionBox";

export const hookesLawDefaults = { k: 100, x: 0.2, mass: 1 };

export const hookesLawSymbols: FormulaSymbol[] = [
  { symbol: "F", meaning: "Restoring force", unit: "N" },
  { symbol: "k", meaning: "Spring constant", unit: "N/m" },
  { symbol: "x", meaning: "Extension or compression", unit: "m" },
  { symbol: "U", meaning: "Elastic potential energy", unit: "J" },
];

export const hookesLawAssumptions = [
  "Spring remains inside its elastic limit.",
  "Extension is measured from equilibrium.",
  "Negative force means the spring pulls back toward equilibrium.",
];

export const hookesLawPresets: ControlPreset[] = [
  { id: "soft", label: "Soft spring", values: { k: 40, x: 0.25 } },
  { id: "benchmark", label: "Benchmark", values: { k: 100, x: 0.2 } },
  { id: "compressed", label: "Compressed", values: { k: 80, x: -0.15 } },
];

export function hookesLawControls(values: typeof hookesLawDefaults, simple: boolean): ExperimentControl[] {
  const controls: ExperimentControl[] = [
    { id: "x", label: "Extension", unit: "m", min: -0.4, max: 0.4, step: 0.01, value: values.x, defaultValue: hookesLawDefaults.x },
    { id: "k", label: "Spring constant", unit: "N/m", min: 10, max: 250, step: 5, value: values.k, defaultValue: hookesLawDefaults.k },
    { id: "mass", label: "Attached mass", unit: "kg", min: 0.1, max: 8, step: 0.1, value: values.mass, defaultValue: hookesLawDefaults.mass },
  ];
  return simple ? controls.filter((control) => control.id === "x") : controls;
}
