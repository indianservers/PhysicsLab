export const MU_0 = 4 * Math.PI * 1e-7;

export function straightWireField(current: number, radius: number) {
  return MU_0 * current / (2 * Math.PI * Math.max(radius, 0.000001));
}

export function relativeElectromagnetStrength(turns: number, current: number, coreFactor = 1) {
  return turns * current * coreFactor;
}

export function fieldPolarity(current: number) {
  return current >= 0 ? { north: "right", south: "left", direction: "counterclockwise" } : { north: "left", south: "right", direction: "clockwise" };
}

export function fluxEstimate(magneticField: number, area: number, angleDeg = 0) {
  return magneticField * area * Math.cos((angleDeg * Math.PI) / 180);
}

export function inductionDirection(speed: number, polarity: number) {
  if (Math.abs(speed) < 1e-9) return "none";
  return speed * polarity >= 0 ? "clockwise" : "counterclockwise";
}
