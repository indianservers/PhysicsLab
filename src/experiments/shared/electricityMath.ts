export const safeDivide = (numerator: number, denominator: number, fallback = 0) => (Math.abs(denominator) > 1e-12 ? numerator / denominator : fallback);

export function ohmCurrent(voltage: number, resistance: number) {
  return safeDivide(voltage, resistance);
}

export function electricPower(voltage: number, current: number) {
  return voltage * current;
}

export function seriesResistance(values: number[]) {
  return values.reduce((sum, value) => sum + Math.max(0, value), 0);
}

export function parallelResistance(values: number[]) {
  const reciprocal = values.reduce((sum, value) => sum + safeDivide(1, Math.max(0.000001, value)), 0);
  return safeDivide(1, reciprocal);
}

export function faradayEmf(turns: number, fluxChange: number, timeChange: number) {
  return -turns * safeDivide(fluxChange, timeChange);
}

export function generatorPeakEmf(turns: number, magneticField: number, area: number, angularSpeed: number) {
  return turns * magneticField * area * angularSpeed;
}

export function transformerSecondaryVoltage(primaryVoltage: number, primaryTurns: number, secondaryTurns: number, efficiency = 1) {
  return primaryVoltage * safeDivide(secondaryTurns, primaryTurns) * efficiency;
}

export function overloadState(power: number, limit: number) {
  if (power > limit * 1.25) return "overload";
  if (power > limit) return "warning";
  return "safe";
}
