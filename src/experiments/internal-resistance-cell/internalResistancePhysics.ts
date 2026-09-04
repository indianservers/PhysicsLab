export interface InternalResistanceInput {
  emf: number;
  internalResistance: number;
  externalResistance: number;
  switchClosed: boolean;
  meterConnectionsCorrect: boolean;
}

export interface InternalResistanceResult {
  current: number;
  terminalVoltage: number;
  lostVoltage: number;
  internalPower: number;
  loadPower: number;
  shortCircuitProtected: boolean;
  circuitComplete: boolean;
}

export interface TerminalReading {
  resistance: number;
  current: number;
  voltage: number;
}

export interface LineFit {
  intercept: number;
  slope: number;
  estimatedInternalResistance: number;
  rSquared: number;
}

const clamp = (value: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : min;

export function sanitizeInternalResistanceInput(
  input: InternalResistanceInput,
): InternalResistanceInput {
  return {
    emf: clamp(input.emf, 0.5, 12),
    internalResistance: clamp(input.internalResistance, 0.05, 5),
    externalResistance: clamp(input.externalResistance, 0, 20),
    switchClosed: Boolean(input.switchClosed),
    meterConnectionsCorrect: Boolean(input.meterConnectionsCorrect),
  };
}

export function computeInternalResistance(
  raw: InternalResistanceInput,
): InternalResistanceResult {
  const input = sanitizeInternalResistanceInput(raw);
  const shortCircuitProtected =
    input.switchClosed &&
    input.meterConnectionsCorrect &&
    input.externalResistance < 0.1;
  const circuitComplete =
    input.switchClosed &&
    input.meterConnectionsCorrect &&
    !shortCircuitProtected;
  const current = circuitComplete
    ? input.emf / (input.externalResistance + input.internalResistance)
    : 0;
  const lostVoltage = current * input.internalResistance;
  return {
    current,
    terminalVoltage: input.emf - lostVoltage,
    lostVoltage,
    internalPower: current ** 2 * input.internalResistance,
    loadPower: current ** 2 * input.externalResistance,
    shortCircuitProtected,
    circuitComplete,
  };
}

export function makeTerminalReading(
  input: InternalResistanceInput,
): TerminalReading | null {
  const result = computeInternalResistance(input);
  if (!result.circuitComplete) return null;
  return {
    resistance: sanitizeInternalResistanceInput(input).externalResistance,
    current: result.current,
    voltage: result.terminalVoltage,
  };
}

export function fitTerminalVoltage(
  readings: TerminalReading[],
): LineFit | null {
  if (readings.length < 2) return null;
  const n = readings.length;
  const sumX = readings.reduce((sum, point) => sum + point.current, 0);
  const sumY = readings.reduce((sum, point) => sum + point.voltage, 0);
  const sumXX = readings.reduce((sum, point) => sum + point.current ** 2, 0);
  const sumXY = readings.reduce(
    (sum, point) => sum + point.current * point.voltage,
    0,
  );
  const denominator = n * sumXX - sumX ** 2;
  if (Math.abs(denominator) < 1e-12) return null;
  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;
  const meanY = sumY / n;
  const total = readings.reduce(
    (sum, point) => sum + (point.voltage - meanY) ** 2,
    0,
  );
  const residual = readings.reduce(
    (sum, point) =>
      sum + (point.voltage - (intercept + slope * point.current)) ** 2,
    0,
  );
  return {
    intercept,
    slope,
    estimatedInternalResistance: -slope,
    rSquared: total < 1e-15 ? 1 : 1 - residual / total,
  };
}
