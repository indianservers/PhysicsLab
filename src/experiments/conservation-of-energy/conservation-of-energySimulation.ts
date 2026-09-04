import { runBenchmarkCases } from "../shared/validation";
export interface EnergyInput {
  massKg: number;
  startHeightM: number;
  friction: number;
  gravity: number;
  releasePosition: number;
}
export const trackHeight = (progress: number, startHeightM: number) => {
  const x = Math.max(0, Math.min(1, progress));
  if (x < 0.46)
    return (
      0.7 + ((startHeightM - 0.7) * (1 + Math.cos((Math.PI * x) / 0.46))) / 2
    );
  if (x < 0.72)
    return (
      0.7 + ((6 - 0.7) * (1 - Math.cos((Math.PI * (x - 0.46)) / 0.26))) / 2
    );
  return (
    0.55 + ((6 - 0.55) * (1 + Math.cos((Math.PI * (x - 0.72)) / 0.28))) / 2
  );
};
export const trackDistance = (from: number, to: number) =>
  Math.abs(to - from) * 24;
export function solveEnergy(input: EnergyInput, progress: number) {
  const massKg = Math.max(0.1, input.massKg),
    g = Math.max(1, input.gravity),
    start = trackHeight(input.releasePosition, input.startHeightM),
    heightM = trackHeight(progress, input.startHeightM),
    totalJ = massKg * g * start,
    thermalJ = Math.min(
      totalJ,
      Math.max(0, input.friction) *
        massKg *
        g *
        trackDistance(input.releasePosition, progress),
    ),
    potentialJ = Math.min(totalJ, massKg * g * heightM),
    kineticJ = Math.max(0, totalJ - potentialJ - thermalJ),
    speedMps = Math.sqrt((2 * kineticJ) / massKg);
  return {
    heightM,
    totalJ,
    thermalJ,
    potentialJ,
    kineticJ,
    speedMps,
    sumJ: potentialJ + kineticJ + thermalJ,
  };
}
export const requiredReleaseHeight = (
  targetHeight: number,
  friction: number,
  distance: number,
) => targetHeight + Math.max(0, friction) * distance;
export const energyBenchmarks = runBenchmarkCases([
  {
    id: "energy-sum",
    name: "Energy sum remains constant",
    input: solveEnergy(
      {
        massKg: 2,
        startHeightM: 10,
        friction: 0.1,
        gravity: 9.8,
        releasePosition: 0,
      },
      0.5,
    ).sumJ,
    expected: 196,
    tolerance: 1e-9,
    unit: "J",
    actual: (x: number) => x,
  },
  {
    id: "energy-frictionless",
    name: "Frictionless speed follows height drop",
    input: solveEnergy(
      {
        massKg: 3,
        startHeightM: 10,
        friction: 0,
        gravity: 9.8,
        releasePosition: 0,
      },
      0.46,
    ).speedMps,
    expected: Math.sqrt(2 * 9.8 * 9.3),
    tolerance: 1e-9,
    unit: "m/s",
    actual: (x: number) => x,
  },
  {
    id: "energy-mass-cancel",
    name: "Frictionless speed is mass independent",
    input:
      solveEnergy(
        {
          massKg: 0.5,
          startHeightM: 8,
          friction: 0,
          gravity: 9.8,
          releasePosition: 0,
        },
        0.46,
      ).speedMps -
      solveEnergy(
        {
          massKg: 4,
          startHeightM: 8,
          friction: 0,
          gravity: 9.8,
          releasePosition: 0,
        },
        0.46,
      ).speedMps,
    expected: 0,
    tolerance: 1e-9,
    unit: "m/s",
    actual: (x: number) => x,
  },
  {
    id: "energy-thermal",
    name: "Friction work becomes thermal energy",
    input: solveEnergy(
      {
        massKg: 2,
        startHeightM: 20,
        friction: 0.1,
        gravity: 10,
        releasePosition: 0,
      },
      0.5,
    ).thermalJ,
    expected: 24,
    tolerance: 1e-9,
    unit: "J",
    actual: (x: number) => x,
  },
  {
    id: "energy-target",
    name: "Minimum release height includes friction work",
    input: requiredReleaseHeight(5, 0.1, 12),
    expected: 6.2,
    tolerance: 1e-12,
    unit: "m",
    actual: (x: number) => x,
  },
]);
