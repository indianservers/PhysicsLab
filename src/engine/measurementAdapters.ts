import { GraphPoint, GraphSourceType, GraphVariable } from "../types";
import { Dimension, PhysicalQuantity, quantity } from "../lib/units";

export interface MeasurementAdapter {
  id: GraphVariable;
  name: string;
  symbol: string;
  unit: string;
  dimension: Dimension;
  sourceModel: GraphSourceType;
  assumptions: string[];
  validRange: string;
  confidence: number;
  compute: (point: GraphPoint) => PhysicalQuantity | null;
}

const adapter = (
  id: GraphVariable,
  name: string,
  symbol: string,
  unit: string,
  dimension: Dimension,
  sourceModel: GraphSourceType,
  confidence: number,
  assumptions: string[],
  validRange: string,
): MeasurementAdapter => ({
  id,
  name,
  symbol,
  unit,
  dimension,
  sourceModel,
  confidence,
  assumptions,
  validRange,
  compute: (point) => {
    const value = point[id];
    return typeof value === "number" && Number.isFinite(value) ? quantity(value, unit, dimension) : null;
  },
});

export const measurementAdapters = [
  adapter("t", "Time", "t", "s", "time", "Validated Simulation", 92, ["Monotonic simulation clock"], "t >= 0"),
  adapter("x", "Horizontal position", "x", "m", "length", "Educational Approximation", 80, ["Canvas x is converted from pixels using the Matter engine scale"], "finite tracked object position"),
  adapter("y", "Height above floor", "y", "m", "length", "Educational Approximation", 80, ["Height uses the configured floor reference"], "y >= 0"),
  adapter("vx", "Horizontal velocity", "vx", "m/s", "velocity", "Educational Approximation", 72, ["Velocity is converted from Matter.js internal velocity"], "finite tracked object velocity"),
  adapter("vy", "Vertical velocity", "vy", "m/s", "velocity", "Educational Approximation", 72, ["Positive vertical velocity is upward in graph convention"], "finite tracked object velocity"),
  adapter("speed", "Speed", "v", "m/s", "velocity", "Educational Approximation", 76, ["Computed from vx and vy"], "speed >= 0"),
  adapter("acceleration", "Gravitational acceleration", "a", "m/s^2", "acceleration", "Formula Calculation", 85, ["Uses current gravity setting; other accelerations are not inferred"], "a >= 0"),
  adapter("force", "Weight force", "F", "N", "force", "Formula Calculation", 84, ["Computed as m g for the tracked body"], "m > 0, g >= 0"),
  adapter("momentum", "Momentum magnitude", "p", "kg m/s", "momentum", "Formula Calculation", 82, ["Computed from tracked body mass and speed"], "m > 0"),
  adapter("kineticEnergy", "Kinetic energy", "K", "J", "energy", "Formula Calculation", 84, ["Computed as 1/2 m v^2"], "m > 0"),
  adapter("potentialEnergy", "Gravitational potential energy", "U", "J", "energy", "Educational Approximation", 76, ["Floor is zero-potential reference"], "height >= 0"),
  adapter("totalEnergy", "Mechanical energy", "E", "J", "energy", "Educational Approximation", 74, ["Sum of kinetic and floor-referenced potential energy"], "finite KE and PE"),
  adapter("angle", "Rotation angle", "theta", "deg", "angle", "Educational Approximation", 76, ["Converted from object render angle"], "finite angle"),
  adapter("volume", "Estimated geometry volume", "V", "m^3", "volume", "Educational Approximation", 55, ["Only available when object geometry provides a physical estimate"], "model-specific"),
  adapter("temperature", "Temperature", "T", "K", "temperature", "Educational Approximation", 60, ["Only available when the object carries an explicit temperature property"], "T >= 0 K"),
] as const satisfies readonly MeasurementAdapter[];

export const measurementAdapterMap = Object.fromEntries(measurementAdapters.map((item) => [item.id, item])) as Partial<Record<GraphVariable, MeasurementAdapter>>;

export const graphableVariables = measurementAdapters.map((item) => item.id);

export function getMeasurementAdapter(key: GraphVariable) {
  return measurementAdapterMap[key] ?? null;
}

export function isGraphableVariable(key: GraphVariable) {
  return Boolean(getMeasurementAdapter(key));
}

export function measurementUnavailable(key: GraphVariable) {
  return `Measurement unavailable: ${String(key)} has no registered validated measurement adapter.`;
}

export function sanitizeGraphPoint(point: GraphPoint): GraphPoint {
  const sanitized = { t: point.t } as GraphPoint;
  for (const variable of graphableVariables) {
    const adapter = getMeasurementAdapter(variable);
    if (!adapter) continue;
    const measured = adapter.compute(point);
    if (measured) {
      (sanitized as unknown as Record<string, number>)[variable] = measured.value;
    }
  }
  return sanitized;
}

export function serializeGraphPoint(point: GraphPoint) {
  const output: Record<string, number | string> = {};
  for (const adapter of measurementAdapters) {
    const measured = adapter.compute(point);
    output[adapter.id] = measured?.value ?? "measurement unavailable";
  }
  return output;
}
