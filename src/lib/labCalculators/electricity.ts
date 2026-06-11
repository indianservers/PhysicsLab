import { assertDimensions, quantity } from "../units";

export function ohmsLawVoltage(current: number, resistance: number) {
  return assertDimensions(quantity(current * resistance, "V", "voltage"), "voltage", "ohmsLawVoltage");
}

export function seriesResistance(...resistances: number[]) {
  return assertDimensions(quantity(resistances.reduce((sum, value) => sum + value, 0), "ohm", "resistance"), "resistance", "seriesResistance");
}

export function parallelResistance(...resistances: number[]) {
  if (resistances.some((value) => value <= 0)) throw new Error("Parallel resistances must be positive.");
  return assertDimensions(quantity(1 / resistances.reduce((sum, value) => sum + 1 / value, 0), "ohm", "resistance"), "resistance", "parallelResistance");
}
