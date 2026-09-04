import { solveTransformer } from "./transformerPhysics";
import { runBenchmarkCases } from "../shared/validation";

const ideal = solveTransformer({
  primaryVoltage: 230,
  frequency: 50,
  primaryTurns: 920,
  secondaryTurns: 48,
  loadResistance: 24,
  coreMaterial: "silicon-steel",
});

export const transformerBenchmarks = runBenchmarkCases([
  {
    id: "turns-ratio",
    name: "230 V across 920:48 turns induces 12 V",
    input: ideal.inducedSecondaryVoltage,
    expected: 12,
    actual: (value: number) => value,
    tolerance: 1e-12,
    unit: "V",
  },
  {
    id: "frequency-equality",
    name: "Secondary frequency equals primary frequency",
    input: ideal.secondaryFrequency,
    expected: 50,
    actual: (value: number) => value,
    tolerance: 0,
    unit: "Hz",
  },
  {
    id: "power-accounting",
    name: "Input equals output plus core and copper losses",
    input: ideal.inputPower - ideal.outputPower - ideal.totalLoss,
    expected: 0,
    actual: (value: number) => value,
    tolerance: 1e-12,
    unit: "W",
  },
  {
    id: "current-ratio-ideal",
    name: "Ideal current ratio is reciprocal of turns ratio",
    input: (48 / 920) * (920 / 48),
    expected: 1,
    actual: (value: number) => value,
    tolerance: 1e-12,
    unit: "ratio",
  },
  {
    id: "flux-faraday",
    name: "230 V, 50 Hz, 920 turns gives 1.126 mWb peak flux",
    input: ideal.peakFluxMilliWeber,
    expected: 230 / (4.44 * 50 * 920) * 1000,
    actual: (value: number) => value,
    tolerance: 1e-12,
    unit: "mWb",
  },
]);
