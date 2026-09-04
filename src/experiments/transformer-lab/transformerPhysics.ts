export type CoreMaterial = "silicon-steel" | "ferrite" | "air";

export interface TransformerInput {
  primaryVoltage: number;
  frequency: number;
  primaryTurns: number;
  secondaryTurns: number;
  loadResistance: number;
  coreMaterial: CoreMaterial;
}

export interface TransformerResult {
  turnsRatio: number;
  inducedSecondaryVoltage: number;
  terminalVoltage: number;
  primaryCurrent: number;
  secondaryCurrent: number;
  inputPower: number;
  outputPower: number;
  coreLoss: number;
  copperLoss: number;
  totalLoss: number;
  efficiency: number;
  primaryFrequency: number;
  secondaryFrequency: number;
  peakFluxMilliWeber: number;
  classification: "step-up" | "step-down" | "isolation";
}

export const coreMaterials: Record<
  CoreMaterial,
  { label: string; coupling: number; lossFactor: number }
> = {
  "silicon-steel": {
    label: "Grain-oriented silicon steel",
    coupling: 0.992,
    lossFactor: 1,
  },
  ferrite: { label: "Ferrite core", coupling: 0.985, lossFactor: 0.58 },
  air: { label: "Air core (weak coupling)", coupling: 0.32, lossFactor: 0.08 },
};

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

export function idealSecondaryVoltage(
  primaryVoltage: number,
  primaryTurns: number,
  secondaryTurns: number,
) {
  if (primaryTurns <= 0) return 0;
  return primaryVoltage * (secondaryTurns / primaryTurns);
}

export function solveTransformer(input: TransformerInput): TransformerResult {
  const primaryVoltage = clamp(input.primaryVoltage, 0, 240);
  const frequency = clamp(input.frequency, 20, 100);
  const primaryTurns = clamp(input.primaryTurns, 50, 1200);
  const secondaryTurns = clamp(input.secondaryTurns, 20, 1200);
  const loadResistance = clamp(input.loadResistance, 5, 500);
  const core = coreMaterials[input.coreMaterial];
  const turnsRatio = secondaryTurns / primaryTurns;
  const inducedSecondaryVoltage = idealSecondaryVoltage(
    primaryVoltage,
    primaryTurns,
    secondaryTurns,
  );

  // Winding resistance rises with wire length. Coupling is applied to the
  // loaded terminal, while the ideal induced-emf meter preserves Faraday's
  // turns-ratio law for direct comparison.
  const secondaryResistance = secondaryTurns * 0.0012;
  const coupledVoltage = inducedSecondaryVoltage * core.coupling;
  const terminalVoltage =
    coupledVoltage * (loadResistance / (loadResistance + secondaryResistance));
  const secondaryCurrent = terminalVoltage / loadResistance;
  const outputPower = terminalVoltage * secondaryCurrent;
  const secondaryCopperLoss = secondaryCurrent ** 2 * secondaryResistance;

  const coreLoss =
    input.coreMaterial === "air"
      ? 0
      : core.lossFactor *
        0.9 *
        (frequency / 50) ** 1.55 *
        (primaryVoltage / 230) ** 2 *
        (920 / primaryTurns) ** 0.35;
  const transferredPower = outputPower + secondaryCopperLoss;
  const magnetizingCurrent =
    primaryVoltage === 0
      ? 0
      : (0.012 * (primaryVoltage / 230) * (50 / frequency)) /
        Math.max(core.coupling, 0.25);
  const idealPrimaryCurrent =
    primaryVoltage === 0 ? 0 : transferredPower / primaryVoltage;
  const primaryResistance = primaryTurns * 0.001;
  const primaryCopperLoss =
    (idealPrimaryCurrent ** 2 + magnetizingCurrent ** 2) * primaryResistance;
  const copperLoss = secondaryCopperLoss + primaryCopperLoss;
  const totalLoss = coreLoss + copperLoss;
  const inputPower = outputPower + totalLoss;
  const primaryCurrent =
    primaryVoltage === 0 ? 0 : inputPower / primaryVoltage;
  const efficiency = inputPower === 0 ? 0 : (outputPower / inputPower) * 100;
  const peakFluxMilliWeber =
    frequency === 0 || primaryTurns === 0
      ? 0
      : (primaryVoltage / (4.44 * frequency * primaryTurns)) * 1000;

  return {
    turnsRatio,
    inducedSecondaryVoltage,
    terminalVoltage,
    primaryCurrent,
    secondaryCurrent,
    inputPower,
    outputPower,
    coreLoss,
    copperLoss,
    totalLoss,
    efficiency,
    primaryFrequency: frequency,
    secondaryFrequency: frequency,
    peakFluxMilliWeber,
    classification:
      Math.abs(turnsRatio - 1) < 0.001
        ? "isolation"
        : turnsRatio > 1
          ? "step-up"
          : "step-down",
  };
}
