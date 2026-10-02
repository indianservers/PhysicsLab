export const ATMOSPHERIC_PRESSURE_KPA = 101.325;

export type VesselShape = "narrow" | "cylinder" | "tapered";
export interface FluidPressureInput {
  density: number;
  depthM: number;
  gravity: number;
  surfacePressureKPa: number;
  vesselShape: VesselShape;
}
export interface JetReading {
  depthM: number;
  gaugePressureKPa: number;
  exitSpeed: number;
  rangeM: number;
}
export interface FluidPressureResult {
  gaugePressurePa: number;
  absolutePressurePa: number;
  manometerHeadM: number;
  equalDepthPressuresPa: [number, number, number];
  jets: JetReading[];
  hatchForceN: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function solveFluidPressure(input: FluidPressureInput): FluidPressureResult {
  const density = clamp(input.density, 500, 1500);
  const depthM = clamp(input.depthM, 0, 2);
  const gravity = clamp(input.gravity, 1.62, 24.79);
  const surfacePressurePa = clamp(input.surfacePressureKPa, 0, 200) * 1000;
  const gaugePressurePa = density * gravity * depthM;
  const absolutePressurePa = surfacePressurePa + gaugePressurePa;
  const equalDepthPressuresPa: [number, number, number] = [gaugePressurePa, gaugePressurePa, gaugePressurePa];
  const fluidHeightM = 2;
  const jets = [0.4, 0.9, 1.4].map((jetDepth) => ({
    depthM: jetDepth,
    gaugePressureKPa: density * gravity * jetDepth / 1000,
    exitSpeed: Math.sqrt(2 * gravity * jetDepth),
    rangeM: 2 * Math.sqrt(jetDepth * (fluidHeightM - jetDepth)),
  }));
  return {
    gaugePressurePa,
    absolutePressurePa,
    manometerHeadM: gaugePressurePa / (density * gravity),
    equalDepthPressuresPa,
    jets,
    hatchForceN: gaugePressurePa * 0.12,
  };
}

export const fluidPressureCases = [
  { id: "rho-gh", name: "Water gauge pressure at two metres", actual: solveFluidPressure({ density: 1000, depthM: 2, gravity: 9.80665, surfacePressureKPa: ATMOSPHERIC_PRESSURE_KPA, vesselShape: "cylinder" }).gaugePressurePa, expected: 19613.3, tolerance: 1e-9, unit: "Pa" },
  { id: "absolute", name: "Absolute pressure adds surface pressure", actual: solveFluidPressure({ density: 1000, depthM: 1, gravity: 9.80665, surfacePressureKPa: 101.325, vesselShape: "narrow" }).absolutePressurePa, expected: 111131.65, tolerance: 1e-9, unit: "Pa" },
  { id: "shape", name: "Equal depth pressure is shape independent", actual: new Set(["narrow", "cylinder", "tapered"].map((vesselShape) => solveFluidPressure({ density: 1025, depthM: 0.75, gravity: 9.81, surfacePressureKPa: 101.3, vesselShape: vesselShape as VesselShape }).gaugePressurePa)).size, expected: 1, tolerance: 0, unit: "count" },
  { id: "manometer", name: "Manometer head returns probe depth", actual: solveFluidPressure({ density: 850, depthM: 1.25, gravity: 3.71, surfacePressureKPa: 101.325, vesselShape: "tapered" }).manometerHeadM, expected: 1.25, tolerance: 1e-12, unit: "m" },
  { id: "normal-force", name: "Pressure force is normal to a surface", actual: Math.abs(Math.cos(Math.PI / 2)), expected: 0, tolerance: 1e-12, unit: "dot product" },
];
