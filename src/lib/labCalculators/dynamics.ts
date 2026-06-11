import { assertDimensions, quantity } from "../units";

export function newtonSecondLaw(force: number, mass: number) {
  if (mass <= 0) throw new Error("Mass must be positive.");
  return assertDimensions(quantity(force / mass, "m/s^2", "acceleration"), "acceleration", "newtonSecondLaw");
}

export function hookeForce(springConstant: number, extension: number) {
  return assertDimensions(quantity(-springConstant * extension, "N", "force"), "force", "hookeForce");
}

export function pendulumPeriod(length: number, gravity: number) {
  if (length <= 0 || gravity <= 0) throw new Error("Length and gravity must be positive.");
  return assertDimensions(quantity(2 * Math.PI * Math.sqrt(length / gravity), "s", "time"), "time", "pendulumPeriod");
}
