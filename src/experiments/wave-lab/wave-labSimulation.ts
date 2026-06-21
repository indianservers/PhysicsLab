import { degreesToRadians, distance } from "../shared/waveMath";
import { runBenchmarkCases } from "../shared/validation";

export interface WaveLabInput {
  frequency: number;
  speed: number;
  sourceSeparation: number;
  phaseDeg: number;
  probeX: number;
  probeY: number;
}

export function simulateWaveLab(input: WaveLabInput) {
  const wavelength = input.speed / input.frequency;
  const sourceA = { x: -input.sourceSeparation / 2, y: 0 };
  const sourceB = { x: input.sourceSeparation / 2, y: 0 };
  const r1 = distance(sourceA.x, sourceA.y, input.probeX, input.probeY);
  const r2 = distance(sourceB.x, sourceB.y, input.probeX, input.probeY);
  const pathDifference = r2 - r1;
  const phaseAtProbe = (2 * Math.PI * pathDifference / wavelength) + degreesToRadians(input.phaseDeg);
  const detectorAmplitude = Math.sqrt(Math.max(0, 2 + 2 * Math.cos(phaseAtProbe)));
  const patternType = Math.abs(Math.cos(phaseAtProbe)) > 0.85 ? "constructive" : Math.abs(Math.cos(phaseAtProbe)) < 0.2 ? "destructive" : "partial";
  const graphPoints = Array.from({ length: 32 }, (_, index) => {
    const t = index / 31;
    return { x: t, y: detectorAmplitude * Math.sin(2 * Math.PI * t) };
  });
  return { wavelength, sourceA, sourceB, pathDifference, phaseAtProbe, detectorAmplitude, patternType, graphPoints };
}

export const waveLabBenchmarks = runBenchmarkCases<WaveLabInput>([
  {
    id: "wave-frequency-wavelength",
    name: "Frequency increase lowers wavelength at fixed speed",
    input: { frequency: 10, speed: 20, sourceSeparation: 4, phaseDeg: 0, probeX: 2, probeY: 5 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) => simulateWaveLab({ ...input, frequency: 20 }).wavelength < simulateWaveLab(input).wavelength ? 1 : 0,
  },
  {
    id: "wave-zero-separation-single-source",
    name: "Zero separation same phase acts like stronger single source",
    input: { frequency: 10, speed: 20, sourceSeparation: 0, phaseDeg: 0, probeX: 2, probeY: 5 },
    expected: 2,
    unit: "relative amplitude",
    tolerance: 1e-9,
    actual: (input) => simulateWaveLab(input).detectorAmplitude,
  },
]);
