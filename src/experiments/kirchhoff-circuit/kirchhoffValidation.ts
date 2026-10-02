import { runBenchmarkCases } from "../shared/validation";
import { DEFAULT_KIRCHHOFF_INPUT, solveKirchhoff } from "./kirchhoffPhysics";

const solved = solveKirchhoff(DEFAULT_KIRCHHOFF_INPUT);
const balanced = solveKirchhoff({
  ...DEFAULT_KIRCHHOFF_INPUT,
  resistance5: 142.5,
});

export const kirchhoffBenchmarks = runBenchmarkCases([
  {
    id: "kcl",
    name: "Junction current balance",
    input: DEFAULT_KIRCHHOFF_INPUT,
    expected: 0,
    unit: "A",
    tolerance: 1e-12,
    actual: (input) => solveKirchhoff(input).kclResidual,
  },
  {
    id: "kvl-left",
    name: "Left loop voltage balance",
    input: DEFAULT_KIRCHHOFF_INPUT,
    expected: 0,
    unit: "V",
    tolerance: 1e-12,
    actual: (input) => solveKirchhoff(input).kvlLeftResidual,
  },
  {
    id: "kvl-right",
    name: "Right loop voltage balance",
    input: DEFAULT_KIRCHHOFF_INPUT,
    expected: 0,
    unit: "V",
    tolerance: 1e-12,
    actual: (input) => solveKirchhoff(input).kvlRightResidual,
  },
  {
    id: "power",
    name: "Source and resistor power agree",
    input: DEFAULT_KIRCHHOFF_INPUT,
    expected: 0,
    unit: "W",
    tolerance: 1e-12,
    actual: (input) => solveKirchhoff(input).powerResidual,
  },
  {
    id: "balanced-bridge",
    name: "Balanced shared branch current is zero",
    input: { ...DEFAULT_KIRCHHOFF_INPUT, resistance5: 142.5 },
    expected: 0,
    unit: "A",
    tolerance: 1e-12,
    actual: (input) => solveKirchhoff(input).sharedCurrent,
  },
]);

export const kirchhoffReference = { solved, balanced };
