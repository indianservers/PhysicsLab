import { runBenchmarkCases } from "../shared/validation";
export type PlateShape = "circular" | "square";
export type BoundaryCondition = "free" | "clamped" | "supported";
export interface ChladniPlateInput {
  modeN: number;
  modeM: number;
  frequency: number;
  amplitude: number;
  damping: number;
  shape?: PlateShape;
  boundary?: BoundaryCondition;
}
const boundaryFactor: Record<BoundaryCondition, number> = {
  free: 0.72,
  supported: 0.86,
  clamped: 1,
};
export function modeFrequencyHz(
  n0: number,
  m0: number,
  shape: PlateShape = "circular",
  boundary: BoundaryCondition = "clamped",
) {
  const n = Math.max(1, Math.round(n0)),
    m = Math.max(1, Math.round(m0));
  const eigen = shape === "square" ? n * n + m * m : (n + 0.55 * m) ** 2;
  return 42 * eigen * boundaryFactor[boundary];
}
export function resonanceResponse(
  f: number,
  f0: number,
  q: number,
  drive: number,
) {
  const r = f / Math.max(f0, 1e-9);
  return drive / Math.sqrt((1 - r * r) ** 2 + (r / q) ** 2);
}
export function modalDisplacement(
  x: number,
  y: number,
  input: ChladniPlateInput,
) {
  const n = Math.max(1, Math.round(input.modeN)),
    m = Math.max(1, Math.round(input.modeM));
  if ((input.shape ?? "circular") === "square") {
    const u = (x + 1) / 2,
      v = (y + 1) / 2;
    return (
      input.amplitude * Math.sin(n * Math.PI * u) * Math.sin(m * Math.PI * v)
    );
  }
  const r = Math.hypot(x, y);
  if (r > 1) return 0;
  return (
    input.amplitude * Math.sin(n * Math.PI * r) * Math.cos(m * Math.atan2(y, x))
  );
}
export function nearestNodePoint(
  x: number,
  y: number,
  input: ChladniPlateInput,
) {
  const n = Math.max(1, Math.round(input.modeN)),
    m = Math.max(1, Math.round(input.modeM));
  if ((input.shape ?? "circular") === "square") {
    const u = (x + 1) / 2,
      v = (y + 1) / 2,
      nx = Math.round(u * n) / n,
      ny = Math.round(v * m) / m;
    return Math.abs(nx - u) < Math.abs(ny - v)
      ? { x: nx * 2 - 1, y }
      : { x, y: ny * 2 - 1 };
  }
  const r = Math.max(0.02, Math.hypot(x, y)),
    theta = Math.atan2(y, x),
    nodeR = Math.max(1, Math.min(n, Math.round(r * n))) / n;
  const k = Math.round(((theta - Math.PI / (2 * m)) * m) / Math.PI),
    nodeTheta = Math.PI / (2 * m) + (k * Math.PI) / m;
  return Math.abs(nodeR - r) < (Math.abs(Math.sin(m * theta)) * r) / m
    ? { x: nodeR * Math.cos(theta), y: nodeR * Math.sin(theta) }
    : { x: r * Math.cos(nodeTheta), y: r * Math.sin(nodeTheta) };
}
export function simulateChladniPlate(input: ChladniPlateInput) {
  const shape = input.shape ?? "circular",
    boundary = input.boundary ?? "clamped",
    eigenfrequencyHz = modeFrequencyHz(
      input.modeN,
      input.modeM,
      shape,
      boundary,
    ),
    quality = 18 + 44 * (1 - Math.min(1, Math.max(0, input.damping))),
    response = resonanceResponse(
      input.frequency,
      eigenfrequencyHz,
      quality,
      input.amplitude,
    );
  const nodeLineCount =
      shape === "square"
        ? Math.max(0, input.modeN - 1) + Math.max(0, input.modeM - 1)
        : input.modeN + input.modeM,
    complexity = input.modeN * input.modeM;
  const sandParticles = Array.from({ length: 130 }, (_, i) => {
    const a = i * 2.399963229728653,
      r = shape === "circular" ? Math.sqrt((i + 0.5) / 130) * 0.94 : 0,
      x = shape === "circular" ? r * Math.cos(a) : ((i * 73) % 127) / 63.5 - 1,
      y = shape === "circular" ? r * Math.sin(a) : ((i * 47) % 131) / 65.5 - 1,
      node = nearestNodePoint(x, y, input);
    return { x, y, nodeX: node.x, nodeY: node.y };
  });
  const heatCells = Array.from({ length: 14 }, (_, row) =>
    Array.from({ length: 14 }, (_, col) =>
      Math.abs(
        modalDisplacement((col + 0.5) / 7 - 1, (row + 0.5) / 7 - 1, input),
      ),
    ),
  );
  return {
    nodeLineCount,
    complexity,
    sandParticles,
    heatCells,
    eigenfrequencyHz,
    response,
    quality,
    detuningHz: input.frequency - eigenfrequencyHz,
    coherence:
      1 /
      (1 +
        Math.abs(input.frequency - eigenfrequencyHz) /
          Math.max(8, eigenfrequencyHz / quality)),
    qualitativeWarning:
      "Calibrated membrane-like mode shapes illustrate plate nodes; this is not a finite-element Kirchhoff-Love plate solver.",
  };
}
export const chladniBenchmarks = runBenchmarkCases<ChladniPlateInput>([
  {
    id: "higher-mode",
    name: "Higher mode gives more node lines",
    input: { modeN: 3, modeM: 4, frequency: 440, amplitude: 1, damping: 0.35 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (i) =>
      Number(
        simulateChladniPlate(i).nodeLineCount >
          simulateChladniPlate({ ...i, modeN: 1, modeM: 1 }).nodeLineCount,
      ),
  },
  {
    id: "simple-mode",
    name: "Basic mode is simpler",
    input: { modeN: 1, modeM: 1, frequency: 220, amplitude: 1, damping: 0.5 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (i) =>
      Number(
        simulateChladniPlate(i).complexity <
          simulateChladniPlate({ ...i, modeN: 3, modeM: 4 }).complexity,
      ),
  },
  {
    id: "node-stationary",
    name: "Square model nodes have zero displacement",
    input: {
      modeN: 3,
      modeM: 2,
      frequency: 546,
      amplitude: 1,
      damping: 0.3,
      shape: "square",
      boundary: "clamped",
    },
    expected: 0,
    unit: "relative",
    tolerance: 1e-12,
    actual: (i) => modalDisplacement(-1 / 3, 0.22, i),
  },
  {
    id: "resonance-peak",
    name: "Response peaks at eigenfrequency",
    input: {
      modeN: 2,
      modeM: 3,
      frequency: 0,
      amplitude: 0.5,
      damping: 0.3,
      shape: "circular",
      boundary: "clamped",
    },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (i) => {
      const f = modeFrequencyHz(i.modeN, i.modeM, i.shape, i.boundary);
      return Number(
        resonanceResponse(f, f, 48, i.amplitude) >
          resonanceResponse(f * 1.2, f, 48, i.amplitude),
      );
    },
  },
]);
