export type MaterialPair = "pvc-wool" | "glass-silk" | "balloon-hair";
export const ELECTRON_CHARGE = 1.602176634e-19;
export const COULOMB_CONSTANT = 8.9875517923e9;
export const AIR_BREAKDOWN_FIELD = 3e6;

export const materialPairs: Record<
  MaterialPair,
  { negative: string; positive: string; strength: number }
> = {
  "pvc-wool": { negative: "PVC", positive: "Wool", strength: 1 },
  "glass-silk": { negative: "Silk", positive: "Glass", strength: 0.75 },
  "balloon-hair": { negative: "Balloon", positive: "Hair", strength: 0.6 },
};

export interface StaticInput {
  pair: MaterialPair;
  rubbing: number;
  grounded: boolean;
  separation: number;
}
export interface StaticResult {
  packets: number;
  transferredElectrons: number;
  negativeCharge: number;
  positiveCharge: number;
  totalCharge: number;
  force: number;
  interaction: "attraction" | "repulsion" | "none";
  electricField: number;
  lightning: boolean;
}

export function coulombInteraction(q1: number, q2: number, distance: number) {
  const force =
    (COULOMB_CONSTANT * Math.abs(q1 * q2)) / Math.max(distance, 0.001) ** 2;
  const interaction =
    q1 === 0 || q2 === 0 ? "none" : q1 * q2 < 0 ? "attraction" : "repulsion";
  return { force, interaction } as const;
}

export function solveStaticElectricity(input: StaticInput): StaticResult {
  const pair = materialPairs[input.pair];
  const packets = Math.round(
    (Math.max(0, Math.min(100, input.rubbing)) / 4) * pair.strength,
  );
  const magnitude = packets * 0.05e-6;
  const negativeCharge = -magnitude;
  const positiveCharge = magnitude;
  const { force, interaction } = coulombInteraction(
    negativeCharge,
    positiveCharge,
    input.separation,
  );
  const electricField =
    (COULOMB_CONSTANT * magnitude) / Math.max(input.separation, 0.05) ** 2;
  return {
    packets,
    transferredElectrons: magnitude / ELECTRON_CHARGE,
    negativeCharge,
    positiveCharge,
    totalCharge: negativeCharge + positiveCharge,
    force,
    interaction,
    electricField,
    lightning: !input.grounded && electricField >= AIR_BREAKDOWN_FIELD,
  };
}
