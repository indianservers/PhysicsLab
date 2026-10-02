export type OhmsMaterial = "copper" | "nichrome" | "carbon" | "filament";
export interface OhmsInput {
  voltage: number;
  resistance: number;
  material: OhmsMaterial;
  temperature: number;
}
export interface OhmsPoint {
  voltage: number;
  current: number;
  resistance: number;
}
const materials: Record<
  OhmsMaterial,
  {
    label: string;
    factor: number;
    alpha: number;
    nonlinear: number;
    ohmic: boolean;
  }
> = {
  copper: {
    label: "Copper",
    factor: 0.35,
    alpha: 0.00393,
    nonlinear: 0,
    ohmic: true,
  },
  nichrome: {
    label: "Nichrome",
    factor: 1,
    alpha: 0.0004,
    nonlinear: 0,
    ohmic: true,
  },
  carbon: {
    label: "Carbon",
    factor: 1.35,
    alpha: -0.0005,
    nonlinear: 0,
    ohmic: true,
  },
  filament: {
    label: "Tungsten lamp",
    factor: 0.55,
    alpha: 0.0045,
    nonlinear: 0.035,
    ohmic: false,
  },
};
export const DEFAULT_OHMS_INPUT: OhmsInput = {
  voltage: 6,
  resistance: 11,
  material: "nichrome",
  temperature: 20,
};
export function solveOhms(input: OhmsInput) {
  const m = materials[input.material];
  const coldResistance = Math.max(
    0.1,
    input.resistance * m.factor * (1 + m.alpha * (input.temperature - 20)),
  );
  const effectiveResistance =
    coldResistance * (1 + m.nonlinear * input.voltage * input.voltage);
  const current = input.voltage / effectiveResistance;
  return {
    current,
    effectiveResistance,
    power: input.voltage * current,
    ohmic: m.ohmic,
    materialLabel: m.label,
    alpha: m.alpha,
  };
}
export function sweepOhms(input: OhmsInput, steps = 6): OhmsPoint[] {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const voltage = (12 * index) / steps;
    const solved = solveOhms({ ...input, voltage });
    return {
      voltage,
      current: solved.current,
      resistance: solved.effectiveResistance,
    };
  });
}
export { materials as ohmsMaterials };
