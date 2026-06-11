import { assertDimensions, quantity } from "../units";

export function snellRefractionAngle(incidentAngleDegrees: number, n1: number, n2: number) {
  const argument = (n1 * Math.sin((incidentAngleDegrees * Math.PI) / 180)) / n2;
  if (Math.abs(argument) > 1) throw new Error("Total internal reflection; no refracted ray.");
  return assertDimensions(quantity((Math.asin(argument) * 180) / Math.PI, "deg", "angle"), "angle", "snellRefractionAngle");
}

export function mirrorImageDistance(focalLength: number, objectDistance: number) {
  const denominator = 1 / focalLength - 1 / objectDistance;
  if (denominator === 0) throw new Error("Image at infinity.");
  return assertDimensions(quantity(1 / denominator, "m", "length"), "length", "mirrorImageDistance");
}

export function lensImageDistance(focalLength: number, objectDistance: number) {
  const denominator = 1 / focalLength + 1 / objectDistance;
  if (denominator === 0) throw new Error("Image at infinity.");
  return assertDimensions(quantity(1 / denominator, "m", "length"), "length", "lensImageDistance");
}
