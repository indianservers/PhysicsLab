import { runBenchmarkCases } from "../shared/validation";

export type MediumShape = "semicircle" | "slab" | "fibre";

const radians = (degrees: number) => (degrees * Math.PI) / 180;
const degrees = (radiansValue: number) => (radiansValue * 180) / Math.PI;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function criticalAngleDeg(n1: number, n2: number) {
  if (!(n1 > n2) || n2 <= 0) return Number.NaN;
  return degrees(Math.asin(n2 / n1));
}

export function fresnelPower(incidenceDeg: number, n1: number, n2: number) {
  const incidence = radians(clamp(incidenceDeg, 0, 89.9));
  const sinTransmission = (n1 / n2) * Math.sin(incidence);
  if (sinTransmission >= 1) {
    return { reflectance: 1, transmittance: 0, transmissionDeg: Number.NaN };
  }
  const transmission = Math.asin(sinTransmission);
  const cosI = Math.cos(incidence);
  const cosT = Math.cos(transmission);
  const rs = (n1 * cosI - n2 * cosT) / (n1 * cosI + n2 * cosT);
  const rp = (n2 * cosI - n1 * cosT) / (n2 * cosI + n1 * cosT);
  const reflectance = clamp((rs * rs + rp * rp) / 2, 0, 1);
  return {
    reflectance,
    transmittance: 1 - reflectance,
    transmissionDeg: degrees(transmission),
  };
}

export function solveTir({
  incidenceDeg,
  n1,
  n2,
}: {
  incidenceDeg: number;
  n1: number;
  n2: number;
}) {
  const criticalDeg = criticalAngleDeg(n1, n2);
  const power = fresnelPower(incidenceDeg, n1, n2);
  const hasCriticalAngle = Number.isFinite(criticalDeg);
  const delta = hasCriticalAngle ? incidenceDeg - criticalDeg : Number.NaN;
  const regime = !hasCriticalAngle
    ? "ordinary-refraction"
    : Math.abs(delta) <= 0.05
      ? "critical"
      : delta > 0
        ? "total-internal-reflection"
        : "refraction";
  return {
    ...power,
    criticalDeg,
    regime,
    reflectedDeg: incidenceDeg,
    snellResidual: Number.isFinite(power.transmissionDeg)
      ? n1 * Math.sin(radians(incidenceDeg)) -
        n2 * Math.sin(radians(power.transmissionDeg))
      : Number.NaN,
  };
}

export function solveFibre({
  couplingDeg,
  bendDeg,
  nCore,
  nCladding,
  bounceCount = 5,
}: {
  couplingDeg: number;
  bendDeg: number;
  nCore: number;
  nCladding: number;
  bounceCount?: number;
}) {
  const criticalDeg = criticalAngleDeg(nCore, nCladding);
  const bendPenaltyDeg = bendDeg * 0.22;
  const minimumIncidenceDeg = 90 - couplingDeg - bendPenaltyDeg;
  const bounce = solveTir({
    incidenceDeg: clamp(minimumIncidenceDeg, 0, 89.9),
    n1: nCore,
    n2: nCladding,
  });
  const couplingEfficiency = Math.cos(radians(couplingDeg)) ** 2;
  const outputFraction =
    couplingEfficiency * bounce.reflectance ** Math.max(1, bounceCount);
  return {
    criticalDeg,
    bendPenaltyDeg,
    minimumIncidenceDeg,
    allBouncesTrapped: minimumIncidenceDeg > criticalDeg,
    outputFraction,
    bounceCount,
  };
}

export const totalInternalReflectionBenchmarks = runBenchmarkCases([
  {
    id: "critical-angle",
    name: "n1=1.5 and n2=1 gives critical angle 41.8103 degrees",
    input: { n1: 1.5, n2: 1 },
    expected: 41.8103148958,
    unit: "deg",
    tolerance: 1e-9,
    actual: (input) => criticalAngleDeg(input.n1, input.n2),
  },
  {
    id: "no-critical-rarer-to-denser",
    name: "rarer-to-denser travel has no critical angle",
    input: { n1: 1, n2: 1.5 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) =>
      Number.isNaN(criticalAngleDeg(input.n1, input.n2)) ? 1 : 0,
  },
  {
    id: "snell-below-critical",
    name: "Snell law is satisfied below the critical angle",
    input: { incidence: 30, n1: 1.5, n2: 1 },
    expected: 0,
    unit: "unitless",
    tolerance: 1e-12,
    actual: (input) =>
      solveTir({ incidenceDeg: input.incidence!, n1: input.n1!, n2: input.n2! })
        .snellResidual,
  },
  {
    id: "tir-energy",
    name: "above critical angle reflection is complete",
    input: { incidence: 56, n1: 1.516, n2: 1 },
    expected: 1,
    unit: "fraction",
    tolerance: 0,
    actual: (input) =>
      solveTir({ incidenceDeg: input.incidence!, n1: input.n1!, n2: input.n2! })
        .reflectance,
  },
  {
    id: "reflection-angle",
    name: "reflection angle equals incidence angle",
    input: { incidence: 63, n1: 1.6, n2: 1.2 },
    expected: 63,
    unit: "deg",
    tolerance: 0,
    actual: (input) =>
      solveTir({ incidenceDeg: input.incidence!, n1: input.n1!, n2: input.n2! })
        .reflectedDeg,
  },
]);

export const simulateTotalInternalReflection = solveTir;
