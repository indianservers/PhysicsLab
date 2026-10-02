import { computeGravitation, G, softenedField, type GravitationInput } from "./universalGravitationPhysics";
import { runBenchmarkCases } from "../shared/validation";

const input: GravitationInput = { massA: 5.972e24, massB: 7.342e22, separation: 3.844e8, probeX: 0, probeY: 0, softening: 1e6 };

export const universalGravitationBenchmarks = runBenchmarkCases<GravitationInput>([
  { id: "earth-moon-force", name: "Earth-Moon attraction", input, expected: (G * input.massA * input.massB) / input.separation ** 2, unit: "N", tolerance: 1e10, actual: (value) => computeGravitation(value).forceMagnitude },
  { id: "newton-third-law", name: "Force vectors are equal and opposite", input, expected: 0, unit: "N", tolerance: 1e-6, actual: (value) => computeGravitation(value).forceOnA.x + computeGravitation(value).forceOnB.x },
  { id: "inverse-square", name: "Doubling separation quarters force", input, expected: 0.25, unit: "ratio", tolerance: 1e-12, actual: (value) => computeGravitation({ ...value, separation: value.separation * 2 }).forceMagnitude / computeGravitation(value).forceMagnitude },
  { id: "superposition", name: "Net field is vector sum", input, expected: 0, unit: "N/kg", tolerance: 1e-12, actual: (value) => { const result = computeGravitation(value); return result.netField.x - result.fieldFromA.x - result.fieldFromB.x; } },
  { id: "singularity-protection", name: "Softening keeps source field finite", input, expected: 1, unit: "boolean", tolerance: 0, actual: (value) => Number(Number.isFinite(softenedField(value.massA, { x: 0, y: 0 }, { x: 0, y: 0 }, value.softening).x)) },
]);
