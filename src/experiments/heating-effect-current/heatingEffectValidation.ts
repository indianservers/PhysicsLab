import { runBenchmarkCases } from "../shared/validation";
import {
  advanceHeating,
  computeHeatingResult,
  DEFAULT_HEATING_INPUT,
  INITIAL_HEATING_STATE,
  resistanceAtTemperature,
} from "./heatingEffectPhysics";

export const heatingEffectBenchmarks = runBenchmarkCases([
  {
    id: "joule-law",
    name: "Electrical heat input equals I squared R t without loss",
    input: {
      ...DEFAULT_HEATING_INPUT,
      current: 2,
      referenceResistance: 5,
      duration: 10,
    },
    expected: 200,
    unit: "J",
    tolerance: 1e-12,
    actual: ({ current, referenceResistance, duration }) =>
      current ** 2 * referenceResistance * duration,
  },
  {
    id: "diameter",
    name: "Halving diameter quadruples resistance",
    input: DEFAULT_HEATING_INPUT,
    expected: 4,
    unit: "ratio",
    tolerance: 1e-12,
    actual: (input) =>
      resistanceAtTemperature({ ...input, diameter: 0.5 }, 25) /
      resistanceAtTemperature({ ...input, diameter: 1 }, 25),
  },
  {
    id: "material",
    name: "Nichrome resistance exceeds copper for equal geometry",
    input: DEFAULT_HEATING_INPUT,
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) =>
      Number(
        resistanceAtTemperature({ ...input, material: "Nichrome" }, 25) >
          resistanceAtTemperature({ ...input, material: "Copper" }, 25),
      ),
  },
  {
    id: "energy-balance",
    name: "Input equals stored heat plus thermal loss",
    input: DEFAULT_HEATING_INPUT,
    expected: 0,
    unit: "J",
    tolerance: 1e-9,
    actual: (input) => {
      const state = advanceHeating(input, INITIAL_HEATING_STATE, 1, true);
      return computeHeatingResult(input, state).energyResidual;
    },
  },
  {
    id: "cooldown",
    name: "Switch off lowers an elevated temperature",
    input: DEFAULT_HEATING_INPUT,
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) => {
      const elevated = { ...INITIAL_HEATING_STATE, temperature: 80 };
      return Number(
        advanceHeating(input, elevated, 1, false).temperature <
          elevated.temperature,
      );
    },
  },
]);
