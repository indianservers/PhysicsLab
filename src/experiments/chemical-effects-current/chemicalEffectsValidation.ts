import { runBenchmarkCases } from "../shared/validation";
import {
  computeChemicalEffects,
  FARADAY_CONSTANT,
  type ChemicalEffectsInput,
} from "./chemicalEffectsPhysics";

const base: ChemicalEffectsInput = {
  voltage: 6,
  electrodeGap: 0.03,
  concentration: 1,
  duration: 300,
  electrolyte: "copper-sulfate",
  polarityReversed: false,
};
export const chemicalEffectsBenchmarks = runBenchmarkCases([
  {
    id: "electrolysis-ohm",
    name: "Current follows electrolyte resistance",
    input: base,
    expected: 1.2,
    unit: "A",
    tolerance: 1e-12,
    actual: (input) => computeChemicalEffects(input).current,
  },
  {
    id: "electrolysis-charge",
    name: "Charge equals current times duration",
    input: base,
    expected: 360,
    unit: "C",
    tolerance: 1e-10,
    actual: (input) => computeChemicalEffects(input).charge,
  },
  {
    id: "faraday-copper",
    name: "Copper mass follows MIt over nF",
    input: base,
    expected: (0.063546 * 360) / (2 * FARADAY_CONSTANT),
    unit: "kg",
    tolerance: 1e-15,
    actual: (input) => computeChemicalEffects(input).depositedMassKg,
  },
  {
    id: "faraday-time",
    name: "Doubling time doubles deposit",
    input: base,
    expected: 2,
    unit: "ratio",
    tolerance: 1e-12,
    actual: (input) =>
      computeChemicalEffects({ ...input, duration: 600 }).depositedMassKg /
      computeChemicalEffects(input).depositedMassKg,
  },
  {
    id: "reaction-water",
    name: "Water electrolysis has no solid deposit",
    input: { ...base, electrolyte: "acidified-water" as const },
    expected: 0,
    unit: "kg",
    tolerance: 0,
    actual: (input) => computeChemicalEffects(input).depositedMassKg,
  },
]);
