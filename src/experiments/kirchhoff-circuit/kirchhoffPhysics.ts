export type KirchhoffInput = {
  source1: number;
  source2: number;
  resistance1: number;
  resistance2: number;
  sharedResistance: number;
  resistance4: number;
  resistance5: number;
};

export type KirchhoffResult = {
  mesh1: number;
  mesh2: number;
  sharedCurrent: number;
  kclResidual: number;
  kvlLeftResidual: number;
  kvlRightResidual: number;
  determinant: number;
  sourcePower: number;
  resistorPower: number;
  powerResidual: number;
  balanceResistance5: number;
};

export const DEFAULT_KIRCHHOFF_INPUT: KirchhoffInput = {
  source1: 12,
  source2: 9,
  resistance1: 220,
  resistance2: 330,
  sharedResistance: 560,
  resistance4: 270,
  resistance5: 470,
};

export function normalizeKirchhoffInput(input: KirchhoffInput): KirchhoffInput {
  const clamp = (value: number, min: number, max: number, fallback: number) =>
    Math.max(min, Math.min(max, Number.isFinite(value) ? value : fallback));
  return {
    source1: clamp(input.source1, 0, 24, 12),
    source2: clamp(input.source2, 0, 24, 9),
    resistance1: clamp(input.resistance1, 10, 1000, 220),
    resistance2: clamp(input.resistance2, 10, 1000, 330),
    sharedResistance: clamp(input.sharedResistance, 10, 1000, 560),
    resistance4: clamp(input.resistance4, 10, 1000, 270),
    resistance5: clamp(input.resistance5, 10, 1000, 470),
  };
}

export function solveKirchhoff(input: KirchhoffInput): KirchhoffResult {
  const safe = normalizeKirchhoffInput(input);
  const a = safe.resistance1 + safe.resistance2 + safe.sharedResistance;
  const d = safe.resistance4 + safe.resistance5 + safe.sharedResistance;
  const b = -safe.sharedResistance;
  const determinant = a * d - b * b;
  const mesh1 = (safe.source1 * d - b * safe.source2) / determinant;
  const mesh2 = (a * safe.source2 - b * safe.source1) / determinant;
  const sharedCurrent = mesh1 - mesh2;
  const kclResidual = mesh1 - mesh2 - sharedCurrent;
  const kvlLeftResidual =
    safe.source1 -
    mesh1 * (safe.resistance1 + safe.resistance2) -
    sharedCurrent * safe.sharedResistance;
  const kvlRightResidual =
    safe.source2 -
    mesh2 * (safe.resistance4 + safe.resistance5) +
    sharedCurrent * safe.sharedResistance;
  const sourcePower = safe.source1 * mesh1 + safe.source2 * mesh2;
  const resistorPower =
    mesh1 ** 2 * (safe.resistance1 + safe.resistance2) +
    mesh2 ** 2 * (safe.resistance4 + safe.resistance5) +
    sharedCurrent ** 2 * safe.sharedResistance;
  const balanceResistance5 =
    safe.source1 > 0
      ? (safe.source2 * (safe.resistance1 + safe.resistance2)) / safe.source1 -
        safe.resistance4
      : Number.POSITIVE_INFINITY;
  return {
    mesh1,
    mesh2,
    sharedCurrent,
    kclResidual,
    kvlLeftResidual,
    kvlRightResidual,
    determinant,
    sourcePower,
    resistorPower,
    powerResidual: sourcePower - resistorPower,
    balanceResistance5,
  };
}
