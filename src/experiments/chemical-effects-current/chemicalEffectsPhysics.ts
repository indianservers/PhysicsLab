export const FARADAY_CONSTANT = 96485.33212;
export type Electrolyte =
  | "copper-sulfate"
  | "acidified-water"
  | "sodium-chloride";

export interface ChemicalEffectsInput {
  voltage: number;
  electrodeGap: number;
  concentration: number;
  duration: number;
  electrolyte: Electrolyte;
  polarityReversed: boolean;
}

export interface ChemicalEffectsResult {
  resistance: number;
  current: number;
  charge: number;
  depositedMassKg: number;
  depositedMassG: number;
  electronMoles: number;
  cationEquivalentMoles: number;
  temperatureC: number;
  overheated: boolean;
  cathodeProduct: string;
  anodeProduct: string;
  cathodeGasMl: number;
  anodeGasMl: number;
}

const PROPERTIES: Record<
  Electrolyte,
  {
    resistance: number;
    molarMass: number;
    electrons: number;
    deposits: boolean;
    cathode: string;
    anode: string;
  }
> = {
  "copper-sulfate": {
    resistance: 5,
    molarMass: 0.063546,
    electrons: 2,
    deposits: true,
    cathode: "Copper metal, Cu(s)",
    anode: "Oxygen, O₂(g)",
  },
  "acidified-water": {
    resistance: 8,
    molarMass: 0,
    electrons: 2,
    deposits: false,
    cathode: "Hydrogen, H₂(g)",
    anode: "Oxygen, O₂(g)",
  },
  "sodium-chloride": {
    resistance: 6.2,
    molarMass: 0,
    electrons: 2,
    deposits: false,
    cathode: "Hydrogen, H₂(g)",
    anode: "Chlorine, Cl₂(g)",
  },
};

const clamp = (value: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : min;

export function sanitizeChemicalEffectsInput(
  input: ChemicalEffectsInput,
): ChemicalEffectsInput {
  return {
    voltage: clamp(input.voltage, 0, 12),
    electrodeGap: clamp(input.electrodeGap, 0.01, 0.05),
    concentration: clamp(input.concentration, 0.25, 2),
    duration: clamp(input.duration, 0, 600),
    electrolyte: input.electrolyte,
    polarityReversed: Boolean(input.polarityReversed),
  };
}

export function computeChemicalEffects(
  raw: ChemicalEffectsInput,
): ChemicalEffectsResult {
  const input = sanitizeChemicalEffectsInput(raw);
  const properties = PROPERTIES[input.electrolyte];
  const resistance =
    (properties.resistance * (input.electrodeGap / 0.03)) / input.concentration;
  const current = input.voltage / resistance;
  const charge = current * input.duration;
  const electronMoles = charge / FARADAY_CONSTANT;
  const cationEquivalentMoles = electronMoles / properties.electrons;
  const depositedMassKg = properties.deposits
    ? properties.molarMass * cationEquivalentMoles
    : 0;
  const cathodeGasMoles =
    input.electrolyte === "copper-sulfate" ? 0 : electronMoles / 2;
  const anodeGasMoles =
    input.electrolyte === "sodium-chloride"
      ? electronMoles / 2
      : electronMoles / 4;
  const molarGasMl = 24450;
  const temperatureC = 25 + (input.voltage * current * input.duration) / 140;
  return {
    resistance,
    current,
    charge,
    depositedMassKg,
    depositedMassG: depositedMassKg * 1000,
    electronMoles,
    cationEquivalentMoles,
    temperatureC,
    overheated: temperatureC > 42,
    cathodeProduct: properties.cathode,
    anodeProduct: properties.anode,
    cathodeGasMl: cathodeGasMoles * molarGasMl,
    anodeGasMl: anodeGasMoles * molarGasMl,
  };
}
