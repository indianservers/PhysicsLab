import { runBenchmarkCases } from "../shared/validation";
import { computeLcr, type LcrInput } from "./lcrPhysics";
const base: LcrInput = {
  frequency: 50.3292121045,
  resistance: 40,
  inductance: 0.2,
  capacitance: 50e-6,
  sourceVoltage: 10,
};
export const lcrBenchmarks = runBenchmarkCases<LcrInput>([
  {
    id: "resonance-frequency",
    name: "f0 analytic value",
    input: base,
    expected: 1 / (2 * Math.PI * Math.sqrt(base.inductance * base.capacitance)),
    unit: "Hz",
    tolerance: 1e-10,
    actual: (v) => computeLcr(v).resonanceFrequency,
  },
  {
    id: "resonance-impedance",
    name: "Z equals R at resonance",
    input: base,
    expected: 40,
    unit: "ohm",
    tolerance: 1e-8,
    actual: (v) => computeLcr(v).impedance,
  },
  {
    id: "resonance-phase",
    name: "Phase is zero at resonance",
    input: base,
    expected: 0,
    unit: "rad",
    tolerance: 1e-9,
    actual: (v) => computeLcr(v).phaseRad,
  },
  {
    id: "below-leading",
    name: "Current leads below resonance",
    input: { ...base, frequency: 25 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (v) => Number(computeLcr(v).currentRelation === "leads"),
  },
  {
    id: "above-lagging",
    name: "Current lags above resonance",
    input: { ...base, frequency: 100 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (v) => Number(computeLcr(v).currentRelation === "lags"),
  },
]);
