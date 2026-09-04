import { runBenchmarkCases } from "../shared/validation";

export type MaterialId =
  "water" | "aluminium" | "copper" | "iron" | "glass" | "oil";

export interface ThermalMaterial {
  id: MaterialId;
  name: string;
  specificHeat: number;
  color: string;
}

export const THERMAL_MATERIALS: Record<MaterialId, ThermalMaterial> = {
  water: { id: "water", name: "Water", specificHeat: 4184, color: "#2799d0" },
  aluminium: {
    id: "aluminium",
    name: "Aluminium",
    specificHeat: 897,
    color: "#9aa5ad",
  },
  copper: { id: "copper", name: "Copper", specificHeat: 385, color: "#cf6b36" },
  iron: { id: "iron", name: "Iron", specificHeat: 449, color: "#606a70" },
  glass: { id: "glass", name: "Glass", specificHeat: 840, color: "#58a9b5" },
  oil: { id: "oil", name: "Oil", specificHeat: 2000, color: "#d8a82d" },
};

const finite = (value: number, label: string) => {
  if (!Number.isFinite(value)) throw new RangeError(`${label} must be finite.`);
  return value;
};

export const heatCapacity = (massKg: number, specificHeatJKgK: number) => {
  if (massKg <= 0 || specificHeatJKgK <= 0)
    throw new RangeError("Mass and specific heat must be positive.");
  return massKg * specificHeatJKgK;
};

export const temperatureAfterHeat = (
  initialC: number,
  heatJ: number,
  massKg: number,
  specificHeatJKgK: number,
) =>
  finite(initialC, "Initial temperature") +
  finite(heatJ, "Heat") / heatCapacity(massKg, specificHeatJKgK);

export const heatRequired = (
  initialC: number,
  finalC: number,
  massKg: number,
  specificHeatJKgK: number,
) =>
  heatCapacity(massKg, specificHeatJKgK) *
  (finite(finalC, "Final temperature") -
    finite(initialC, "Initial temperature"));

export const equilibriumTemperature = (
  temperatureAC: number,
  capacityAJK: number,
  temperatureBC: number,
  capacityBJK: number,
) => {
  if (capacityAJK <= 0 || capacityBJK <= 0)
    throw new RangeError("Heat capacities must be positive.");
  return (
    (capacityAJK * temperatureAC + capacityBJK * temperatureBC) /
    (capacityAJK + capacityBJK)
  );
};

export const celsiusToKelvin = (celsius: number) => {
  const kelvin = finite(celsius, "Temperature") + 273.15;
  if (kelvin < 0)
    throw new RangeError("Temperature cannot be below absolute zero.");
  return kelvin;
};

export const celsiusToFahrenheit = (celsius: number) =>
  (finite(celsius, "Temperature") * 9) / 5 + 32;

export const heatTemperatureBenchmarks = runBenchmarkCases([
  {
    id: "q-mc-delta-t",
    name: "Q=mcΔT for aluminium",
    input: { m: 0.5, c: 897, dt: 20 },
    expected: 8970,
    unit: "J",
    tolerance: 1e-9,
    actual: ({ m, c, dt }) => heatRequired(0, Number(dt), Number(m), Number(c)),
  },
  {
    id: "equal-energy-mass",
    name: "Doubling mass halves temperature rise",
    input: { q: 9000, m: 0.5, c: 900 },
    expected: 0.5,
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ q, m, c }) =>
      (temperatureAfterHeat(20, Number(q), Number(m) * 2, Number(c)) - 20) /
      (temperatureAfterHeat(20, Number(q), Number(m), Number(c)) - 20),
  },
  {
    id: "equilibrium",
    name: "Equal heat capacities equilibrate at mean temperature",
    input: { ta: 80, tb: 20, ca: 500, cb: 500 },
    expected: 50,
    unit: "°C",
    tolerance: 1e-12,
    actual: ({ ta, tb, ca, cb }) =>
      equilibriumTemperature(Number(ta), Number(ca), Number(tb), Number(cb)),
  },
  {
    id: "kelvin-scale",
    name: "Zero Celsius equals 273.15 kelvin",
    input: { c: 0 },
    expected: 273.15,
    unit: "K",
    tolerance: 1e-12,
    actual: ({ c }) => celsiusToKelvin(Number(c)),
  },
  {
    id: "fahrenheit-scale",
    name: "Boiling point converts to Fahrenheit",
    input: { c: 100 },
    expected: 212,
    unit: "°F",
    tolerance: 1e-12,
    actual: ({ c }) => celsiusToFahrenheit(Number(c)),
  },
]);

export const simulateHeatAndTemperature = temperatureAfterHeat;
