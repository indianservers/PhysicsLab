import { runBenchmarkCases } from "../shared/validation";

export type ThermalMaterial =
  "water" | "oil" | "aluminium" | "copper" | "steel";

export const thermalMaterials: Record<
  ThermalMaterial,
  { label: string; specificHeatJkgK: number }
> = {
  water: { label: "Water", specificHeatJkgK: 4184 },
  oil: { label: "Vegetable oil", specificHeatJkgK: 2000 },
  aluminium: { label: "Aluminium", specificHeatJkgK: 897 },
  copper: { label: "Copper", specificHeatJkgK: 385 },
  steel: { label: "Steel", specificHeatJkgK: 470 },
};

export interface MixingInput {
  hotMassKg: number;
  hotTemperatureC: number;
  hotSpecificHeatJkgK: number;
  coldMassKg: number;
  coldTemperatureC: number;
  coldSpecificHeatJkgK: number;
  calorimeterHeatCapacityJK: number;
  calorimeterInitialTemperatureC?: number;
}

export function solveInsulatedMix(input: MixingInput) {
  const hotCapacity = input.hotMassKg * input.hotSpecificHeatJkgK;
  const coldCapacity = input.coldMassKg * input.coldSpecificHeatJkgK;
  const calorimeterCapacity = input.calorimeterHeatCapacityJK;
  const calorimeterTemperature =
    input.calorimeterInitialTemperatureC ?? input.coldTemperatureC;
  const totalCapacity = hotCapacity + coldCapacity + calorimeterCapacity;
  const finalTemperatureC =
    (hotCapacity * input.hotTemperatureC +
      coldCapacity * input.coldTemperatureC +
      calorimeterCapacity * calorimeterTemperature) /
    totalCapacity;
  const qHotJ = hotCapacity * (finalTemperatureC - input.hotTemperatureC);
  const qColdJ = coldCapacity * (finalTemperatureC - input.coldTemperatureC);
  const qCalorimeterJ =
    calorimeterCapacity * (finalTemperatureC - calorimeterTemperature);
  return {
    hotCapacity,
    coldCapacity,
    calorimeterCapacity,
    totalCapacity,
    finalTemperatureC,
    qHotJ,
    qColdJ,
    qCalorimeterJ,
    residualJ: qHotJ + qColdJ + qCalorimeterJ,
  };
}

export function thermalStateAtTime(
  input: MixingInput,
  timeS: number,
  heatLoss: boolean,
  ambientTemperatureC = 22,
  lossCoefficientWK = 1.4,
) {
  const equilibrium = solveInsulatedMix(input);
  const calorimeterTemperature =
    input.calorimeterInitialTemperatureC ?? input.coldTemperatureC;
  const exchangeTime = Math.max(0, timeS - 8);
  const mixProgress = 1 - Math.exp(-exchangeTime / 13);
  const lossTime = Math.max(0, timeS - 35);
  const lossOffset = heatLoss
    ? (ambientTemperatureC - equilibrium.finalTemperatureC) *
      (1 -
        Math.exp((-lossCoefficientWK * lossTime) / equilibrium.totalCapacity))
    : 0;
  const hotTemperatureC =
    input.hotTemperatureC +
    (equilibrium.finalTemperatureC - input.hotTemperatureC) * mixProgress +
    lossOffset;
  const coldTemperatureC =
    input.coldTemperatureC +
    (equilibrium.finalTemperatureC - input.coldTemperatureC) * mixProgress +
    lossOffset;
  const calorimeterTemperatureC =
    calorimeterTemperature +
    (equilibrium.finalTemperatureC - calorimeterTemperature) * mixProgress +
    lossOffset;
  const mixtureTemperatureC =
    (equilibrium.hotCapacity * hotTemperatureC +
      equilibrium.coldCapacity * coldTemperatureC +
      equilibrium.calorimeterCapacity * calorimeterTemperatureC) /
    equilibrium.totalCapacity;
  const qHotJ =
    equilibrium.hotCapacity * (hotTemperatureC - input.hotTemperatureC);
  const qColdJ =
    equilibrium.coldCapacity * (coldTemperatureC - input.coldTemperatureC);
  const qCalorimeterJ =
    equilibrium.calorimeterCapacity *
    (calorimeterTemperatureC - calorimeterTemperature);
  const qSurroundingsJ = -(qHotJ + qColdJ + qCalorimeterJ);
  return {
    ...equilibrium,
    timeS,
    mixProgress,
    lossOffset,
    hotTemperatureC,
    coldTemperatureC,
    calorimeterTemperatureC,
    mixtureTemperatureC,
    qHotJ,
    qColdJ,
    qCalorimeterJ,
    qSurroundingsJ,
    residualJ: qHotJ + qColdJ + qCalorimeterJ + qSurroundingsJ,
  };
}

export function inferUnknownSpecificHeat({
  metalMassKg,
  metalInitialTemperatureC,
  waterMassKg,
  waterSpecificHeatJkgK,
  waterInitialTemperatureC,
  calorimeterHeatCapacityJK,
  finalTemperatureC,
}: {
  metalMassKg: number;
  metalInitialTemperatureC: number;
  waterMassKg: number;
  waterSpecificHeatJkgK: number;
  waterInitialTemperatureC: number;
  calorimeterHeatCapacityJK: number;
  finalTemperatureC: number;
}) {
  const gained =
    (waterMassKg * waterSpecificHeatJkgK + calorimeterHeatCapacityJK) *
    (finalTemperatureC - waterInitialTemperatureC);
  return (
    gained / (metalMassKg * (metalInitialTemperatureC - finalTemperatureC))
  );
}

export const unknownSpecificHeatScenario = (() => {
  const metalMassKg = 0.08,
    metalInitialTemperatureC = 95,
    waterMassKg = 0.12,
    waterSpecificHeatJkgK = 4184,
    waterInitialTemperatureC = 20,
    calorimeterHeatCapacityJK = 20,
    specificHeatJkgK = 385;
  const finalTemperatureC =
    (metalMassKg * specificHeatJkgK * metalInitialTemperatureC +
      (waterMassKg * waterSpecificHeatJkgK + calorimeterHeatCapacityJK) *
        waterInitialTemperatureC) /
    (metalMassKg * specificHeatJkgK +
      waterMassKg * waterSpecificHeatJkgK +
      calorimeterHeatCapacityJK);
  return {
    metalMassKg,
    metalInitialTemperatureC,
    waterMassKg,
    waterSpecificHeatJkgK,
    waterInitialTemperatureC,
    calorimeterHeatCapacityJK,
    specificHeatJkgK,
    finalTemperatureC,
  };
})();

const waterMix: MixingInput = {
  hotMassKg: 0.15,
  hotTemperatureC: 80,
  hotSpecificHeatJkgK: 4184,
  coldMassKg: 0.15,
  coldTemperatureC: 20,
  coldSpecificHeatJkgK: 4184,
  calorimeterHeatCapacityJK: 0,
};

export const calorimetryMixingBenchmarks = runBenchmarkCases([
  {
    id: "equal-water-mix",
    name: "equal water masses mix to arithmetic midpoint",
    input: { hot: 80, cold: 20 },
    expected: 50,
    unit: "degC",
    tolerance: 1e-12,
    actual: () => solveInsulatedMix(waterMix).finalTemperatureC,
  },
  {
    id: "energy-closure",
    name: "insulated heat changes sum to zero",
    input: { hotMass: 0.2, coldMass: 0.1 },
    expected: 0,
    unit: "J",
    tolerance: 1e-9,
    actual: (x) =>
      solveInsulatedMix({
        ...waterMix,
        hotMassKg: x.hotMass!,
        coldMassKg: x.coldMass!,
        calorimeterHeatCapacityJK: 35,
      }).residualJ,
  },
  {
    id: "temperature-bounds",
    name: "equilibrium lies between initial temperatures",
    input: { hot: 90, cold: 10 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => {
      const t = solveInsulatedMix({
        ...waterMix,
        hotTemperatureC: x.hot!,
        coldTemperatureC: x.cold!,
        hotSpecificHeatJkgK: 897,
      }).finalTemperatureC;
      return t > x.cold! && t < x.hot! ? 1 : 0;
    },
  },
  {
    id: "q-equals-mcdt",
    name: "heat equals mass times specific heat times temperature change",
    input: { mass: 0.2, c: 4184, delta: 15 },
    expected: 12552,
    unit: "J",
    tolerance: 1e-9,
    actual: (x) => x.mass! * x.c! * x.delta!,
  },
  {
    id: "unknown-specific-heat",
    name: "mixing data recovers hidden specific heat",
    input: { final: unknownSpecificHeatScenario.finalTemperatureC },
    expected: 385,
    unit: "J/(kg K)",
    tolerance: 1e-9,
    actual: (x) =>
      inferUnknownSpecificHeat({
        ...unknownSpecificHeatScenario,
        finalTemperatureC: x.final!,
      }),
  },
]);
