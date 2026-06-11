import { UnitSystem } from "../types";

export type Dimension =
  | "dimensionless"
  | "length"
  | "mass"
  | "time"
  | "velocity"
  | "acceleration"
  | "force"
  | "energy"
  | "pressure"
  | "charge"
  | "voltage"
  | "current"
  | "power"
  | "frequency"
  | "temperature"
  | "volume"
  | "density"
  | "momentum"
  | "angle"
  | "angularVelocity"
  | "angularAcceleration"
  | "electricField"
  | "magneticField"
  | "capacitance"
  | "resistance";

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  dimension: Dimension;
  toSI: (value: number) => number;
  fromSI: (value: number) => number;
}

export interface PhysicalQuantity {
  value: number;
  unit: string;
  dimension: Dimension;
}

const identity = (value: number) => value;
const scale = (factor: number) => ({
  toSI: (value: number) => value * factor,
  fromSI: (value: number) => value / factor,
});

export const unitRegistry: Record<string, UnitDefinition> = {
  "": { id: "dimensionless", name: "Dimensionless", symbol: "", dimension: "dimensionless", toSI: identity, fromSI: identity },
  m: { id: "meter", name: "meter", symbol: "m", dimension: "length", ...scale(1) },
  cm: { id: "centimeter", name: "centimeter", symbol: "cm", dimension: "length", ...scale(0.01) },
  mm: { id: "millimeter", name: "millimeter", symbol: "mm", dimension: "length", ...scale(0.001) },
  km: { id: "kilometer", name: "kilometer", symbol: "km", dimension: "length", ...scale(1000) },
  nm: { id: "nanometer", name: "nanometer", symbol: "nm", dimension: "length", ...scale(1e-9) },
  kg: { id: "kilogram", name: "kilogram", symbol: "kg", dimension: "mass", ...scale(1) },
  g: { id: "gram", name: "gram", symbol: "g", dimension: "mass", ...scale(0.001) },
  s: { id: "second", name: "second", symbol: "s", dimension: "time", ...scale(1) },
  ms: { id: "millisecond", name: "millisecond", symbol: "ms", dimension: "time", ...scale(0.001) },
  h: { id: "hour", name: "hour", symbol: "h", dimension: "time", ...scale(3600) },
  N: { id: "newton", name: "newton", symbol: "N", dimension: "force", ...scale(1) },
  dyn: { id: "dyne", name: "dyne", symbol: "dyn", dimension: "force", ...scale(1e-5) },
  J: { id: "joule", name: "joule", symbol: "J", dimension: "energy", ...scale(1) },
  kJ: { id: "kilojoule", name: "kilojoule", symbol: "kJ", dimension: "energy", ...scale(1000) },
  eV: { id: "electronvolt", name: "electronvolt", symbol: "eV", dimension: "energy", ...scale(1.602176634e-19) },
  erg: { id: "erg", name: "erg", symbol: "erg", dimension: "energy", ...scale(1e-7) },
  Pa: { id: "pascal", name: "pascal", symbol: "Pa", dimension: "pressure", ...scale(1) },
  kPa: { id: "kilopascal", name: "kilopascal", symbol: "kPa", dimension: "pressure", ...scale(1000) },
  bar: { id: "bar", name: "bar", symbol: "bar", dimension: "pressure", ...scale(100000) },
  Ba: { id: "barye", name: "barye", symbol: "Ba", dimension: "pressure", ...scale(0.1) },
  C: { id: "coulomb", name: "coulomb", symbol: "C", dimension: "charge", ...scale(1) },
  microC: { id: "microcoulomb", name: "microcoulomb", symbol: "microC", dimension: "charge", ...scale(1e-6) },
  V: { id: "volt", name: "volt", symbol: "V", dimension: "voltage", ...scale(1) },
  A: { id: "ampere", name: "ampere", symbol: "A", dimension: "current", ...scale(1) },
  mA: { id: "milliampere", name: "milliampere", symbol: "mA", dimension: "current", ...scale(0.001) },
  W: { id: "watt", name: "watt", symbol: "W", dimension: "power", ...scale(1) },
  Hz: { id: "hertz", name: "hertz", symbol: "Hz", dimension: "frequency", ...scale(1) },
  kHz: { id: "kilohertz", name: "kilohertz", symbol: "kHz", dimension: "frequency", ...scale(1000) },
  THz: { id: "terahertz", name: "terahertz", symbol: "THz", dimension: "frequency", ...scale(1e12) },
  K: { id: "kelvin", name: "kelvin", symbol: "K", dimension: "temperature", ...scale(1) },
  degC: { id: "celsius", name: "degree Celsius", symbol: "C", dimension: "temperature", toSI: (value) => value + 273.15, fromSI: (value) => value - 273.15 },
  "m^3": { id: "cubic-meter", name: "cubic meter", symbol: "m^3", dimension: "volume", ...scale(1) },
  L: { id: "liter", name: "liter", symbol: "L", dimension: "volume", ...scale(0.001) },
  "kg/m^3": { id: "kilogram-per-cubic-meter", name: "kilogram per cubic meter", symbol: "kg/m^3", dimension: "density", ...scale(1) },
  "kg m/s": { id: "kilogram-meter-per-second", name: "kilogram meter per second", symbol: "kg m/s", dimension: "momentum", ...scale(1) },
  "m/s": { id: "meter-per-second", name: "meter per second", symbol: "m/s", dimension: "velocity", ...scale(1) },
  "cm/s": { id: "centimeter-per-second", name: "centimeter per second", symbol: "cm/s", dimension: "velocity", ...scale(0.01) },
  "m/s^2": { id: "meter-per-second-squared", name: "meter per second squared", symbol: "m/s^2", dimension: "acceleration", ...scale(1) },
  "cm/s^2": { id: "centimeter-per-second-squared", name: "centimeter per second squared", symbol: "cm/s^2", dimension: "acceleration", ...scale(0.01) },
  rad: { id: "radian", name: "radian", symbol: "rad", dimension: "angle", ...scale(1) },
  deg: { id: "degree", name: "degree", symbol: "deg", dimension: "angle", toSI: (value) => (value * Math.PI) / 180, fromSI: (value) => (value * 180) / Math.PI },
  "rad/s": { id: "radian-per-second", name: "radian per second", symbol: "rad/s", dimension: "angularVelocity", ...scale(1) },
  "rad/s^2": { id: "radian-per-second-squared", name: "radian per second squared", symbol: "rad/s^2", dimension: "angularAcceleration", ...scale(1) },
  "N/C": { id: "newton-per-coulomb", name: "newton per coulomb", symbol: "N/C", dimension: "electricField", ...scale(1) },
  T: { id: "tesla", name: "tesla", symbol: "T", dimension: "magneticField", ...scale(1) },
  F: { id: "farad", name: "farad", symbol: "F", dimension: "capacitance", ...scale(1) },
  ohm: { id: "ohm", name: "ohm", symbol: "ohm", dimension: "resistance", ...scale(1) },
};

const cgsDisplay: Record<string, string> = {
  m: "cm",
  kg: "g",
  N: "dyn",
  J: "erg",
  Pa: "Ba",
  "m/s": "cm/s",
  "m/s^2": "cm/s^2",
};

export function quantity(value: number, unit: string, dimension?: Dimension): PhysicalQuantity {
  const definition = unitRegistry[unit];
  const resolvedDimension = dimension ?? definition?.dimension;
  if (!resolvedDimension) {
    console.warn(`[units] Unknown unit "${unit}". Treating as dimensionless.`);
    return { value, unit, dimension: "dimensionless" };
  }
  if (definition && definition.dimension !== resolvedDimension) {
    console.warn(`[units] Unit "${unit}" has dimension ${definition.dimension}, expected ${resolvedDimension}.`);
  }
  return { value, unit, dimension: resolvedDimension };
}

export function convert(value: number, fromUnit: string, toUnit: string) {
  const from = unitRegistry[fromUnit];
  const to = unitRegistry[toUnit];
  if (!from || !to) throw new Error(`Unknown unit conversion: ${fromUnit} -> ${toUnit}`);
  if (from.dimension !== to.dimension) throw new Error(`Cannot convert ${from.dimension} to ${to.dimension}`);
  return to.fromSI(from.toSI(value));
}

export function convertQuantity(input: PhysicalQuantity, toUnit: string): PhysicalQuantity {
  return quantity(convert(input.value, input.unit, toUnit), toUnit, input.dimension);
}

export function validateDimensions(result: PhysicalQuantity, expected: Dimension, context = "calculation") {
  if (result.dimension !== expected) {
    const message = `[dimension] ${context} returned ${result.dimension}; expected ${expected}.`;
    console.warn(message);
    return message;
  }
  return "";
}

export function assertDimensions(result: PhysicalQuantity, expected: Dimension, context = "calculation") {
  const warning = validateDimensions(result, expected, context);
  if (warning) throw new Error(warning);
  return result;
}

export function formatValue(value: number, unit = "", system: UnitSystem = "SI", significantFigures = 4) {
  const cgsUnit = system === "CGS" ? cgsDisplay[unit] : undefined;
  const converted = cgsUnit ? convert(value, unit, cgsUnit) : value;
  const suffix = cgsUnit ?? unit;
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
  const definition = unitRegistry[unit];
  if (!definition && unit) return `Unknown unit: ${unit}`;
  if (unit === "K" && value < 0) return "Temperature below absolute zero.";
  if (unit === "kg" && value <= 0) return "Mass must be positive.";
  return "";
}
