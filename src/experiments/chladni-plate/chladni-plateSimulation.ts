import { runBenchmarkCases } from "../shared/validation";

export interface ChladniPlateInput {
  modeN: number;
  modeM: number;
  frequency: number;
  amplitude: number;
  damping: number;
}

export function simulateChladniPlate(input: ChladniPlateInput) {
  const nodeLineCount = Math.max(0, input.modeN - 1) + Math.max(0, input.modeM - 1);
  const complexity = input.modeN * input.modeM;
  const sandParticles = Array.from({ length: 80 }, (_, index) => {
    const band = index % Math.max(1, nodeLineCount + 1);
    const x = 48 + ((index * 37) % 420);
    const y = 52 + ((band + 1) / Math.max(2, nodeLineCount + 2)) * 210 + Math.sin(index) * 5 * (1 - input.damping);
    return { x, y };
  });
  const heatCells = Array.from({ length: 10 }, (_, row) => Array.from({ length: 10 }, (_, col) => {
    const x = (col + 0.5) / 10;
    const y = (row + 0.5) / 10;
    return Math.abs(Math.sin(input.modeN * Math.PI * x) * Math.sin(input.modeM * Math.PI * y)) * input.amplitude;
  }));

  return { nodeLineCount, complexity, sandParticles, heatCells, qualitativeWarning: "This is a school-level qualitative Chladni model, not a full finite-element plate solver." };
}

export const chladniBenchmarks = runBenchmarkCases<ChladniPlateInput>([
  {
    id: "chladni-higher-mode-more-lines",
    name: "Higher mode gives more node lines",
    input: { modeN: 3, modeM: 4, frequency: 440, amplitude: 1, damping: 0.35 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) => simulateChladniPlate(input).nodeLineCount > simulateChladniPlate({ ...input, modeN: 1, modeM: 1 }).nodeLineCount ? 1 : 0,
  },
  {
    id: "chladni-simple-mode",
    name: "1,1 simpler than 3,4",
    input: { modeN: 1, modeM: 1, frequency: 220, amplitude: 1, damping: 0.5 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) => simulateChladniPlate(input).complexity < simulateChladniPlate({ ...input, modeN: 3, modeM: 4 }).complexity ? 1 : 0,
  },
]);
