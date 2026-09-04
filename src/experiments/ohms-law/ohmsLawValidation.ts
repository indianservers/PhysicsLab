import { runBenchmarkCases } from "../shared/validation";
import { DEFAULT_OHMS_INPUT, solveOhms } from "./ohmsLawPhysics";
export const ohmsLawBenchmarks = runBenchmarkCases([
  {
    id: "ohm-vir",
    name: "V equals I R",
    input: DEFAULT_OHMS_INPUT,
    expected: 6,
    unit: "V",
    tolerance: 1e-12,
    actual: (i) => {
      const s = solveOhms(i);
      return s.current * s.effectiveResistance;
    },
  },
  {
    id: "ohm-slope",
    name: "V-I slope equals resistance",
    input: { ...DEFAULT_OHMS_INPUT, voltage: 10 },
    expected: 11,
    unit: "Ω",
    tolerance: 1e-12,
    actual: (i) => i.voltage / solveOhms(i).current,
  },
  {
    id: "ohm-temp",
    name: "Positive coefficient raises resistance",
    input: { ...DEFAULT_OHMS_INPUT, temperature: 120 },
    expected: 1,
    unit: "trend",
    tolerance: 0,
    actual: (i) =>
      Number(
        solveOhms(i).effectiveResistance >
          solveOhms({ ...i, temperature: 20 }).effectiveResistance,
      ),
  },
  {
    id: "ohm-nonohmic",
    name: "Filament resistance rises with voltage",
    input: {
      ...DEFAULT_OHMS_INPUT,
      material: "filament" as const,
      voltage: 12,
    },
    expected: 1,
    unit: "trend",
    tolerance: 0,
    actual: (i) =>
      Number(
        solveOhms(i).effectiveResistance >
          solveOhms({ ...i, voltage: 2 }).effectiveResistance,
      ),
  },
  {
    id: "ohm-origin",
    name: "Zero voltage gives zero current",
    input: { ...DEFAULT_OHMS_INPUT, voltage: 0 },
    expected: 0,
    unit: "A",
    tolerance: 0,
    actual: (i) => solveOhms(i).current,
  },
]);
