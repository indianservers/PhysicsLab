import { runBenchmarkCases } from "../shared/validation";
import {
  computeCapacitor,
  EPSILON_0,
  type CapacitorInput,
} from "./capacitorPhysics";
const base: CapacitorInput = {
  plateArea: 0.02,
  spacing: 0.002,
  dielectric: 1,
  voltage: 12,
  arrangement: "single",
  count: 1,
  connected: true,
};
export const capacitorBenchmarks = runBenchmarkCases<CapacitorInput>([
  {
    id: "geometry",
    name: "Parallel-plate capacitance",
    input: base,
    expected: (EPSILON_0 * 0.02) / 0.002,
    unit: "F",
    tolerance: 1e-20,
    actual: (v) => computeCapacitor(v).singleCapacitance,
  },
  {
    id: "charge",
    name: "Q equals CV",
    input: base,
    expected: ((EPSILON_0 * 0.02) / 0.002) * 12,
    unit: "C",
    tolerance: 1e-18,
    actual: (v) => computeCapacitor(v).charge,
  },
  {
    id: "energy",
    name: "U equals one-half CV squared",
    input: base,
    expected: ((0.5 * EPSILON_0 * 0.02) / 0.002) * 144,
    unit: "J",
    tolerance: 1e-18,
    actual: (v) => computeCapacitor(v).energy,
  },
  {
    id: "series",
    name: "Three equal capacitors in series",
    input: { ...base, arrangement: "series", count: 3 },
    expected: (EPSILON_0 * 0.02) / 0.002 / 3,
    unit: "F",
    tolerance: 1e-20,
    actual: (v) => computeCapacitor(v).equivalentCapacitance,
  },
  {
    id: "parallel",
    name: "Three equal capacitors in parallel",
    input: { ...base, arrangement: "parallel", count: 3 },
    expected: ((EPSILON_0 * 0.02) / 0.002) * 3,
    unit: "F",
    tolerance: 1e-20,
    actual: (v) => computeCapacitor(v).equivalentCapacitance,
  },
]);
