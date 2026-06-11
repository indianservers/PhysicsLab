import { assertDimensions, quantity } from "../units";

export function kineticEnergy(mass: number, speed: number) {
  if (mass <= 0) throw new Error("Mass must be positive.");
  return assertDimensions(quantity(0.5 * mass * speed * speed, "J", "energy"), "energy", "kineticEnergy");
}

export function gravitationalPotentialEnergy(mass: number, gravity: number, height: number) {
  if (mass <= 0) throw new Error("Mass must be positive.");
  return assertDimensions(quantity(mass * gravity * height, "J", "energy"), "energy", "gravitationalPotentialEnergy");
}
