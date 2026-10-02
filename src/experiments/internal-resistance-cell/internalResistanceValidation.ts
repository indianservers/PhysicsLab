import { runBenchmarkCases } from "../shared/validation";
import {
  computeInternalResistance,
  fitTerminalVoltage,
  makeTerminalReading,
  type InternalResistanceInput,
} from "./internalResistancePhysics";

const closed = (
  emf: number,
  internalResistance: number,
  externalResistance: number,
): InternalResistanceInput => ({
  emf,
  internalResistance,
  externalResistance,
  switchClosed: true,
  meterConnectionsCorrect: true,
});

const line = [20, 10, 5, 2, 1]
  .map((externalResistance) =>
    makeTerminalReading(closed(1.5, 0.8, externalResistance)),
  )
  .filter((reading) => reading !== null);

export const internalResistanceBenchmarks = runBenchmarkCases([
  {
    id: "cell-current",
    name: "Current follows E/(R+r)",
    input: closed(1.5, 0.8, 5),
    expected: 1.5 / 5.8,
    unit: "A",
    tolerance: 1e-12,
    actual: (input) => computeInternalResistance(input).current,
  },
  {
    id: "cell-terminal-voltage",
    name: "Terminal voltage follows V=E-Ir",
    input: closed(1.5, 0.8, 5),
    expected: 1.5 - (1.5 / 5.8) * 0.8,
    unit: "V",
    tolerance: 1e-12,
    actual: (input) => computeInternalResistance(input).terminalVoltage,
  },
  {
    id: "cell-open-switch",
    name: "Open switch gives zero current and V=E",
    input: { ...closed(1.5, 0.8, 5), switchClosed: false },
    expected: 1.5,
    unit: "V",
    tolerance: 1e-12,
    actual: (input) => computeInternalResistance(input).terminalVoltage,
  },
  {
    id: "cell-short-protection",
    name: "Protected short circuit interrupts current",
    input: closed(1.5, 0.8, 0),
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) =>
      Number(computeInternalResistance(input).shortCircuitProtected),
  },
  {
    id: "cell-line-slope",
    name: "V-I slope recovers negative internal resistance",
    input: closed(1.5, 0.8, 5),
    expected: -0.8,
    unit: "V/A",
    tolerance: 1e-10,
    actual: () => fitTerminalVoltage(line)?.slope ?? Number.NaN,
  },
]);
