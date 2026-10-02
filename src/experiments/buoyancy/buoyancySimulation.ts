export const G = 9.80665;

export interface BuoyancyInput {
  objectDensity: number;
  fluidDensity: number;
  volumeCm3: number;
  immersionFraction: number;
}

export interface BuoyancyResult {
  objectVolumeM3: number;
  displacedVolumeM3: number;
  displacedVolumeCm3: number;
  massKg: number;
  weightN: number;
  buoyantForceN: number;
  apparentWeightN: number;
  netForceN: number;
  floatingFraction: number;
  equilibriumFraction: number;
  state: "floating" | "neutral" | "sinking" | "held";
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function solveBuoyancy(input: BuoyancyInput): BuoyancyResult {
  const objectVolumeM3 = clamp(input.volumeCm3, 20, 500) * 1e-6;
  const immersionFraction = clamp(input.immersionFraction, 0, 1);
  const objectDensity = clamp(input.objectDensity, 100, 8000);
  const fluidDensity = clamp(input.fluidDensity, 500, 1500);
  const displacedVolumeM3 = objectVolumeM3 * immersionFraction;
  const massKg = objectDensity * objectVolumeM3;
  const weightN = massKg * G;
  const buoyantForceN = fluidDensity * G * displacedVolumeM3;
  const netForceN = buoyantForceN - weightN;
  const floatingFraction = objectDensity / fluidDensity;
  const equilibriumFraction = clamp(floatingFraction, 0, 1);
  const balanced = Math.abs(netForceN) <= Math.max(0.002, weightN * 0.015);
  const state = objectDensity > fluidDensity && immersionFraction > 0.985 ? "sinking" : balanced && objectDensity < fluidDensity ? "floating" : balanced ? "neutral" : "held";
  return { objectVolumeM3, displacedVolumeM3, displacedVolumeCm3: displacedVolumeM3 * 1e6, massKg, weightN, buoyantForceN, apparentWeightN: Math.max(0, weightN - buoyantForceN), netForceN, floatingFraction, equilibriumFraction, state };
}

export function animatedImmersion(timeSeconds: number, equilibriumFraction: number, reducedMotion = false) {
  if (reducedMotion) return equilibriumFraction;
  const t = Math.max(0, timeSeconds);
  if (t < 2) return (t / 2) * Math.min(0.55, equilibriumFraction + 0.12);
  if (t < 3.2) {
    const start = Math.min(0.55, equilibriumFraction + 0.12);
    return start + ((t - 2) / 1.2) * (equilibriumFraction - start);
  }
  const oscillation = 0.13 * Math.exp(-(t - 3.2) * 0.75) * Math.cos((t - 3.2) * 5.2);
  return clamp(equilibriumFraction + oscillation, 0, 1);
}

export const buoyancyBenchmarks = [
  { id: "float", name: "Half-density body floats half submerged", actual: solveBuoyancy({ objectDensity: 500, fluidDensity: 1000, volumeCm3: 200, immersionFraction: 0.5 }).floatingFraction, expected: 0.5, tolerance: 1e-12, unit: "fraction" },
  { id: "force", name: "Buoyant force equals displaced fluid weight", actual: solveBuoyancy({ objectDensity: 800, fluidDensity: 1000, volumeCm3: 200, immersionFraction: 0.5 }).buoyantForceN, expected: 1000 * G * 100e-6, tolerance: 1e-12, unit: "N" },
  { id: "volume", name: "Immersion scales displaced volume", actual: solveBuoyancy({ objectDensity: 700, fluidDensity: 1000, volumeCm3: 250, immersionFraction: 0.4 }).displacedVolumeCm3, expected: 100, tolerance: 1e-12, unit: "cm3" },
  { id: "balance", name: "Floating equilibrium balances forces", actual: solveBuoyancy({ objectDensity: 650, fluidDensity: 1000, volumeCm3: 300, immersionFraction: 0.65 }).netForceN, expected: 0, tolerance: 1e-12, unit: "N" },
  { id: "sink", name: "Denser object requires full immersion", actual: solveBuoyancy({ objectDensity: 2700, fluidDensity: 1000, volumeCm3: 100, immersionFraction: 1 }).equilibriumFraction, expected: 1, tolerance: 0, unit: "fraction" },
];
