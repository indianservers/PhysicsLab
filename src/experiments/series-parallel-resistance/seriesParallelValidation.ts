import { runBenchmarkCases } from "../shared/validation";
import { DEFAULT_NETWORK_INPUT, solveNetwork } from "./seriesParallelPhysics";

export const seriesParallelBenchmarks = runBenchmarkCases([
  {
    id: "series-sum",
    name: "Series resistances add",
    input: DEFAULT_NETWORK_INPUT,
    expected: 11,
    unit: "Ω",
    tolerance: 1e-12,
    actual: (input) => solveNetwork(input).equivalentResistance,
  },
  {
    id: "parallel-reciprocal",
    name: "Parallel reciprocal rule",
    input: { ...DEFAULT_NETWORK_INPUT, topology: "parallel" as const },
    expected: 1,
    unit: "Ω",
    tolerance: 1e-12,
    actual: (input) => solveNetwork(input).equivalentResistance,
  },
  {
    id: "parallel-kcl",
    name: "Parallel branch currents satisfy KCL",
    input: { ...DEFAULT_NETWORK_INPUT, topology: "parallel" as const },
    expected: 0,
    unit: "A",
    tolerance: 1e-12,
    actual: (input) => solveNetwork(input).kclResidual,
  },
  {
    id: "series-power",
    name: "Series power is conserved",
    input: DEFAULT_NETWORK_INPUT,
    expected: 0,
    unit: "W",
    tolerance: 1e-12,
    actual: (input) => solveNetwork(input).powerResidual,
  },
  {
    id: "parallel-power",
    name: "Parallel power is conserved",
    input: { ...DEFAULT_NETWORK_INPUT, topology: "parallel" as const },
    expected: 0,
    unit: "W",
    tolerance: 1e-12,
    actual: (input) => solveNetwork(input).powerResidual,
  },
]);
