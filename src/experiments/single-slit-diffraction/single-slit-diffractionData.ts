import type { ControlPreset, ExperimentControl } from "../shared/ControlGroup";
import type { FormulaSymbol } from "../shared/FormulaAssumptionBox";

export const singleSlitDefaults = { wavelengthNm: 500, slitWidthMm: 0.1, screenDistanceM: 2, order: 1 };

export const singleSlitSymbols: FormulaSymbol[] = [
  { symbol: "a", meaning: "Slit width", unit: "m" },
  { symbol: "lambda", meaning: "Wavelength", unit: "m" },
  { symbol: "D", meaning: "Distance to screen", unit: "m" },
  { symbol: "ym", meaning: "Position of m-th minimum", unit: "m" },
];

export const singleSlitAssumptions = [
  "Small-angle screen position uses ym approximately m lambda D / a.",
  "Slit is narrow compared with screen distance.",
  "Intensity pattern is scalar Fraunhofer diffraction, not a full optical bench renderer.",
];

export const singleSlitPresets: ControlPreset[] = [
  { id: "benchmark", label: "Benchmark", values: { wavelengthNm: 500, screenDistanceM: 2, slitWidthMm: 0.1, order: 1 } },
  { id: "narrow", label: "Narrow slit", values: { slitWidthMm: 0.05 } },
  { id: "wide", label: "Wide slit", values: { slitWidthMm: 0.3 } },
];

export function singleSlitControls(values: typeof singleSlitDefaults, simple: boolean): ExperimentControl[] {
  const controls: ExperimentControl[] = [
    { id: "slitWidthMm", label: "Slit width", unit: "mm", min: 0.02, max: 0.5, step: 0.01, value: values.slitWidthMm, defaultValue: singleSlitDefaults.slitWidthMm },
    { id: "wavelengthNm", label: "Wavelength", unit: "nm", min: 380, max: 700, step: 5, value: values.wavelengthNm, defaultValue: singleSlitDefaults.wavelengthNm },
    { id: "screenDistanceM", label: "Screen distance", unit: "m", min: 0.5, max: 5, step: 0.1, value: values.screenDistanceM, defaultValue: singleSlitDefaults.screenDistanceM },
    { id: "order", label: "Minimum order", min: 1, max: 5, step: 1, value: values.order, defaultValue: singleSlitDefaults.order },
  ];
  return simple ? controls.filter((control) => control.id === "slitWidthMm") : controls;
}
