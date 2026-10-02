import { runBenchmarkCases } from "../shared/validation";
import {
  DEFAULT_METER_BRIDGE_INPUT,
  solveMeterBridge,
} from "./meterBridgePhysics";

const exactBalance = {
  ...DEFAULT_METER_BRIDGE_INPUT,
  jockeyPositionCm:
    (100 * DEFAULT_METER_BRIDGE_INPUT.unknownResistance) /
    (DEFAULT_METER_BRIDGE_INPUT.knownResistance +
      DEFAULT_METER_BRIDGE_INPUT.unknownResistance),
};

export const meterBridgeBenchmarks = runBenchmarkCases([
  {
    id: "meter-ratio",
    name: "X/R equals l/(L-l) at balance",
    input: exactBalance,
    expected:
      DEFAULT_METER_BRIDGE_INPUT.unknownResistance /
      DEFAULT_METER_BRIDGE_INPUT.knownResistance,
    unit: "ratio",
    tolerance: 1e-12,
    actual: (input) => solveMeterBridge(input).lengthRatio,
  },
  {
    id: "meter-null",
    name: "Galvanometer current is zero at balance",
    input: exactBalance,
    expected: 0,
    unit: "A",
    tolerance: 1e-12,
    actual: (input) => solveMeterBridge(input).galvanometerCurrent,
  },
  {
    id: "meter-positive-sign",
    name: "Contact left of balance gives negative current",
    input: { ...DEFAULT_METER_BRIDGE_INPUT, jockeyPositionCm: 40 },
    expected: 1,
    unit: "sign",
    tolerance: 0,
    actual: (input) => Number(solveMeterBridge(input).galvanometerCurrent < 0),
  },
  {
    id: "meter-negative-sign",
    name: "Contact right of balance gives positive current",
    input: { ...DEFAULT_METER_BRIDGE_INPUT, jockeyPositionCm: 80 },
    expected: 1,
    unit: "sign",
    tolerance: 0,
    actual: (input) => Number(solveMeterBridge(input).galvanometerCurrent > 0),
  },
  {
    id: "meter-endpoint-guard",
    name: "Endpoint position is clamped away from zero length",
    input: { ...DEFAULT_METER_BRIDGE_INPUT, jockeyPositionCm: 0 },
    expected: 0.5,
    unit: "cm",
    tolerance: 0,
    actual: (input) => solveMeterBridge(input).leftWireResistance / 0.05,
  },
]);
