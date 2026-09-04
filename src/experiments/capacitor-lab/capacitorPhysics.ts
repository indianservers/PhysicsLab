export const EPSILON_0 = 8.8541878128e-12;
export type Arrangement = "single" | "series" | "parallel";
export interface CapacitorInput {
  plateArea: number;
  spacing: number;
  dielectric: number;
  voltage: number;
  arrangement: Arrangement;
  count: number;
  connected: boolean;
}
export interface CapacitorResult {
  singleCapacitance: number;
  equivalentCapacitance: number;
  charge: number;
  energy: number;
  electricField: number;
  energyDensity: number;
  plateForce: number;
  voltagePerCapacitor: number;
  chargePerCapacitor: number;
}
export function sanitizeCapacitorInput(i: CapacitorInput): CapacitorInput {
  return {
    plateArea: clamp(i.plateArea, 0.005, 0.05),
    spacing: clamp(i.spacing, 0.0005, 0.01),
    dielectric: clamp(i.dielectric, 1, 10),
    voltage: clamp(i.voltage, 0, 24),
    arrangement: i.arrangement,
    count: Math.round(clamp(i.count, 1, 3)),
    connected: Boolean(i.connected),
  };
}
export function computeCapacitor(raw: CapacitorInput): CapacitorResult {
  const i = sanitizeCapacitorInput(raw);
  const activeVoltage = i.connected ? i.voltage : 0;
  const singleCapacitance = (i.dielectric * EPSILON_0 * i.plateArea) / i.spacing,
    equivalentCapacitance =
      i.arrangement === "parallel"
        ? singleCapacitance * i.count
        : i.arrangement === "series"
          ? singleCapacitance / i.count
          : singleCapacitance,
    charge = equivalentCapacitance * activeVoltage,
    energy = 0.5 * equivalentCapacitance * activeVoltage ** 2,
    electricField = activeVoltage / i.spacing,
    energyDensity = 0.5 * i.dielectric * EPSILON_0 * electricField ** 2,
    plateForce =
      0.5 * i.dielectric * EPSILON_0 * i.plateArea * electricField ** 2,
    voltagePerCapacitor =
      i.arrangement === "series" ? activeVoltage / i.count : activeVoltage,
    chargePerCapacitor =
      i.arrangement === "series" ? charge : singleCapacitance * activeVoltage;
  return {
    singleCapacitance,
    equivalentCapacitance,
    charge,
    energy,
    electricField,
    energyDensity,
    plateForce,
    voltagePerCapacitor,
    chargePerCapacitor,
  };
}
const clamp = (v: number, min: number, max: number) =>
  Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : min;
