import { assertDimensions, quantity } from "../units";

export function freeFallDistance(initialVelocity: number, gravity: number, time: number) {
  return assertDimensions(quantity(initialVelocity * time + 0.5 * gravity * time * time, "m", "length"), "length", "freeFallDistance");
}

export function freeFallVelocity(initialVelocity: number, gravity: number, time: number) {
  return assertDimensions(quantity(initialVelocity + gravity * time, "m/s", "velocity"), "velocity", "freeFallVelocity");
}

export function projectileRange(speed: number, angleDegrees: number, gravity: number) {
  const theta = (angleDegrees * Math.PI) / 180;
  return assertDimensions(quantity((speed * speed * Math.sin(2 * theta)) / gravity, "m", "length"), "length", "projectileRange");
}

export function projectileTimeOfFlight(speed: number, angleDegrees: number, gravity: number) {
  const theta = (angleDegrees * Math.PI) / 180;
  return assertDimensions(quantity((2 * speed * Math.sin(theta)) / gravity, "s", "time"), "time", "projectileTimeOfFlight");
}
