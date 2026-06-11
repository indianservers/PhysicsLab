import { assertDimensions, quantity } from "../units";

export function photoelectricKineticEnergy(photonEnergyEv: number, workFunctionEv: number) {
  return assertDimensions(quantity(Math.max(0, photonEnergyEv - workFunctionEv), "eV", "energy"), "energy", "photoelectricKineticEnergy");
}

export function halfLifeRemaining(initialCount: number, elapsedTime: number, halfLife: number) {
  if (halfLife <= 0) throw new Error("Half-life must be positive.");
  return quantity(initialCount * 0.5 ** (elapsedTime / halfLife), "", "dimensionless");
}
