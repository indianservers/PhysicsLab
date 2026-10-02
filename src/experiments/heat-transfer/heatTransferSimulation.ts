import { runBenchmarkCases } from "../shared/validation";

export const STEFAN_BOLTZMANN = 5.670374419e-8;

export type TransferMode = "conduction" | "convection" | "radiation";
export type HeaterSide = "left" | "right";

export interface ConductiveMaterial {
  id: string;
  name: string;
  conductivityWMK: number;
  color: string;
}

export const CONDUCTIVE_MATERIALS: Record<string, ConductiveMaterial> = {
  copper: {
    id: "copper",
    name: "Copper",
    conductivityWMK: 401,
    color: "#c96733",
  },
  aluminium: {
    id: "aluminium",
    name: "Aluminium",
    conductivityWMK: 205,
    color: "#9aa4ab",
  },
  steel: { id: "steel", name: "Steel", conductivityWMK: 50, color: "#667078" },
  glass: {
    id: "glass",
    name: "Glass",
    conductivityWMK: 1.05,
    color: "#50a4b5",
  },
  wood: { id: "wood", name: "Wood", conductivityWMK: 0.12, color: "#9b6638" },
};

export const INSULATION_MATERIALS = {
  fiberglass: { name: "Fiberglass", conductivityWMK: 0.038 },
  wool: { name: "Mineral wool", conductivityWMK: 0.044 },
  cork: { name: "Cork", conductivityWMK: 0.043 },
  wood: { name: "Wood", conductivityWMK: 0.12 },
} as const;

const positive = (value: number, label: string) => {
  if (!Number.isFinite(value) || value <= 0)
    throw new RangeError(`${label} must be finite and greater than zero.`);
  return value;
};

export const kelvinFromCelsius = (celsius: number) => {
  const kelvin = celsius + 273.15;
  if (!Number.isFinite(kelvin) || kelvin < 0)
    throw new RangeError("Temperature cannot be below absolute zero.");
  return kelvin;
};

/** One-dimensional steady conduction through a uniform slab/rod. */
export const fourierHeatRateW = (
  conductivityWMK: number,
  areaM2: number,
  temperatureDifferenceK: number,
  lengthM: number,
) =>
  (positive(conductivityWMK, "Conductivity") *
    positive(areaM2, "Area") *
    Math.max(0, temperatureDifferenceK)) /
  positive(lengthM, "Length");

/** Net diffuse-grey exchange with large surroundings; view factor supplied explicitly. */
export const radiationHeatRateW = (
  emissivity: number,
  areaM2: number,
  surfaceC: number,
  surroundingsC: number,
  viewFactor = 1,
) => {
  if (emissivity < 0 || emissivity > 1)
    throw new RangeError("Emissivity must lie from zero to one.");
  if (viewFactor < 0 || viewFactor > 1)
    throw new RangeError("View factor must lie from zero to one.");
  const surfaceK = kelvinFromCelsius(surfaceC);
  const surroundingsK = kelvinFromCelsius(surroundingsC);
  return (
    emissivity *
    STEFAN_BOLTZMANN *
    positive(areaM2, "Area") *
    viewFactor *
    (surfaceK ** 4 - surroundingsK ** 4)
  );
};

/** Positive is clockwise on screen: heat at left rises, crosses the top, then sinks at right. */
export const convectionCirculationSign = (heaterSide: HeaterSide) =>
  heaterSide === "left" ? 1 : -1;

export const convectionState = (
  heaterPowerW: number,
  heaterSide: HeaterSide,
  areaM2 = 0.18,
) => {
  const power = positive(heaterPowerW, "Heater power");
  const area = positive(areaM2, "Area");
  const efficiency = 0.68;
  const coefficientWM2K = 35 + 0.45 * power;
  const heatRateW = power * efficiency;
  return {
    heatRateW,
    coefficientWM2K,
    temperatureDifferenceK: heatRateW / (coefficientWM2K * area),
    circulationSign: convectionCirculationSign(heaterSide),
    regime:
      power < 180
        ? "gentle laminar"
        : power < 420
          ? "steady circulation"
          : "vigorous circulation",
  };
};

export const insulationHeatLossW = (
  conductivityWMK: number,
  thicknessM: number,
  emissivity: number,
  hotC = 20,
  coldC = -20,
  areaM2 = 1.2,
) => {
  const conductionW = fourierHeatRateW(
    conductivityWMK,
    areaM2,
    hotC - coldC,
    thicknessM,
  );
  const radiationW = Math.max(
    0,
    radiationHeatRateW(emissivity, areaM2, hotC, coldC, 0.92),
  );
  return { conductionW, radiationW, totalW: conductionW + radiationW };
};

export const heatTransferBenchmarks = runBenchmarkCases([
  {
    id: "fourier-reference",
    name: "Fourier rate for aluminium rod",
    input: { k: 205, a: 7.85e-5, dt: 60, l: 0.3 },
    expected: 3.2185,
    unit: "W",
    tolerance: 1e-9,
    actual: ({ k, a, dt, l }) =>
      fourierHeatRateW(Number(k), Number(a), Number(dt), Number(l)),
  },
  {
    id: "fourier-conductivity",
    name: "Doubling conductivity doubles heat rate",
    input: { k: 50 },
    expected: 2,
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ k }) =>
      fourierHeatRateW(Number(k) * 2, 0.01, 40, 0.2) /
      fourierHeatRateW(Number(k), 0.01, 40, 0.2),
  },
  {
    id: "fourier-thickness",
    name: "Doubling thickness halves heat rate",
    input: { l: 0.2 },
    expected: 0.5,
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ l }) =>
      fourierHeatRateW(50, 0.01, 40, Number(l) * 2) /
      fourierHeatRateW(50, 0.01, 40, Number(l)),
  },
  {
    id: "convection-direction",
    name: "Left heater makes clockwise circulation",
    input: { side: 1 },
    expected: 1,
    unit: "direction",
    tolerance: 0,
    actual: () => convectionCirculationSign("left"),
  },
  {
    id: "radiation-emissivity",
    name: "Radiation rate is proportional to emissivity",
    input: { epsilon: 0.4 },
    expected: 2,
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ epsilon }) =>
      radiationHeatRateW(Number(epsilon) * 2, 0.02, 500, 20) /
      radiationHeatRateW(Number(epsilon), 0.02, 500, 20),
  },
  {
    id: "radiation-fourth-power",
    name: "Hotter absolute source radiates much faster",
    input: { low: 300, high: 500 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: ({ low, high }) =>
      Number(
        radiationHeatRateW(0.8, 0.02, Number(high), 20) >
          radiationHeatRateW(0.8, 0.02, Number(low), 20) * 2,
      ),
  },
]);

export const simulateHeatTransfer = fourierHeatRateW;
