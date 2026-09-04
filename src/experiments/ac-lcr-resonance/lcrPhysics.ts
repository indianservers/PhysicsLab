export interface LcrInput {
  frequency: number;
  resistance: number;
  inductance: number;
  capacitance: number;
  sourceVoltage: number;
}
export interface LcrResult {
  omega: number;
  xL: number;
  xC: number;
  reactance: number;
  impedance: number;
  current: number;
  phaseRad: number;
  phaseDeg: number;
  currentRelation: "leads" | "lags" | "in phase";
  voltageR: number;
  voltageL: number;
  voltageC: number;
  powerFactor: number;
  realPower: number;
  resonanceFrequency: number;
  bandwidth: number;
  lowerHalfPower: number;
  upperHalfPower: number;
  qualityFactor: number;
}

export function sanitizeLcrInput(input: LcrInput): LcrInput {
  return {
    frequency: clamp(input.frequency, 1, 500),
    resistance: clamp(input.resistance, 1, 500),
    inductance: clamp(input.inductance, 0.001, 2),
    capacitance: clamp(input.capacitance, 1e-7, 0.001),
    sourceVoltage: clamp(input.sourceVoltage, 0.1, 100),
  };
}
export function computeLcr(raw: LcrInput): LcrResult {
  const i = sanitizeLcrInput(raw),
    omega = 2 * Math.PI * i.frequency,
    xL = omega * i.inductance,
    xC = 1 / (omega * i.capacitance),
    reactance = xL - xC,
    impedance = Math.hypot(i.resistance, reactance),
    current = i.sourceVoltage / impedance,
    phaseRad = Math.atan2(reactance, i.resistance),
    resonanceFrequency =
      1 / (2 * Math.PI * Math.sqrt(i.inductance * i.capacitance)),
    bandwidth = i.resistance / (2 * Math.PI * i.inductance),
    root = Math.sqrt(resonanceFrequency ** 2 + (bandwidth / 2) ** 2),
    lowerHalfPower = root - bandwidth / 2,
    upperHalfPower = root + bandwidth / 2;
  return {
    omega,
    xL,
    xC,
    reactance,
    impedance,
    current,
    phaseRad,
    phaseDeg: (phaseRad * 180) / Math.PI,
    currentRelation:
      Math.abs(phaseRad) < 0.005 ? "in phase" : phaseRad < 0 ? "leads" : "lags",
    voltageR: current * i.resistance,
    voltageL: current * xL,
    voltageC: current * xC,
    powerFactor: i.resistance / impedance,
    realPower: current ** 2 * i.resistance,
    resonanceFrequency,
    bandwidth,
    lowerHalfPower,
    upperHalfPower,
    qualityFactor: Math.sqrt(i.inductance / i.capacitance) / i.resistance,
  };
}
export function resonanceSeries(input: LcrInput, count = 181) {
  const safe = sanitizeLcrInput(input),
    f0 = computeLcr(safe).resonanceFrequency,
    min = Math.max(1, f0 * 0.2),
    max = Math.min(500, f0 * 3);
  return Array.from({ length: count }, (_, index) => {
    const frequency = min + (index / (count - 1)) * (max - min),
      r = computeLcr({ ...safe, frequency });
    return { frequency, current: r.current, phaseDeg: r.phaseDeg };
  });
}
const clamp = (value: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : min;
