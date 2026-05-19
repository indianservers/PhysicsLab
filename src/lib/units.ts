import { UnitSystem } from "../types";

const conversions: Record<string, { cgs: string; factor: number }> = {
  m: { cgs: "cm", factor: 100 },
  kg: { cgs: "g", factor: 1000 },
  N: { cgs: "dyn", factor: 100000 },
  J: { cgs: "erg", factor: 10000000 },
  Pa: { cgs: "Ba", factor: 10 },
  "m/s": { cgs: "cm/s", factor: 100 },
  "m/s^2": { cgs: "cm/s^2", factor: 100 },
};

export function formatValue(value: number, unit = "", system: UnitSystem = "SI", significantFigures = 4) {
  const conversion = system === "CGS" ? conversions[unit] : undefined;
  const converted = conversion ? value * conversion.factor : value;
  const suffix = conversion ? conversion.cgs : unit;
  const formatted = Math.abs(converted) >= 10000 || (Math.abs(converted) > 0 && Math.abs(converted) < 0.001)
    ? converted.toExponential(significantFigures - 1)
    : Number(converted.toPrecision(significantFigures)).toString();
  return `${formatted}${suffix ? ` ${suffix}` : ""}`;
}

export function percentageError(measured: number, expected: number) {
  if (expected === 0) return Number.NaN;
  return Math.abs((measured - expected) / expected) * 100;
}

export function validateUnit(value: number, unit: string) {
  if (!Number.isFinite(value)) return "Value is not finite.";
  if (unit === "K" && value < 0) return "Temperature below absolute zero.";
  if (unit === "kg" && value <= 0) return "Mass must be positive.";
  return "";
}
