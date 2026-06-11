import { assertDimensions, quantity } from "../units";

export function pressure(force: number, area: number) {
  if (area <= 0) throw new Error("Area must be positive.");
  return assertDimensions(quantity(force / area, "Pa", "pressure"), "pressure", "pressure");
}

export function hydrostaticPressure(density: number, gravity: number, depth: number, atmosphericPressure = 0) {
  return assertDimensions(quantity(atmosphericPressure + density * gravity * depth, "Pa", "pressure"), "pressure", "hydrostaticPressure");
}

export function buoyantForce(fluidDensity: number, gravity: number, displacedVolume: number) {
  return assertDimensions(quantity(fluidDensity * gravity * displacedVolume, "N", "force"), "force", "buoyantForce");
}
