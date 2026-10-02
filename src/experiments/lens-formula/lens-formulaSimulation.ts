import { runBenchmarkCases } from "../shared/validation";

export type LensType = "convex" | "concave";
export function solveLens({
  objectDistanceCm,
  focalLengthCm,
  objectHeightCm,
  lensType,
}: {
  objectDistanceCm: number;
  focalLengthCm: number;
  objectHeightCm: number;
  lensType: LensType;
}) {
  const uCm = -Math.abs(objectDistanceCm);
  const fCm =
    lensType === "convex" ? Math.abs(focalLengthCm) : -Math.abs(focalLengthCm);
  const inverseV = 1 / fCm + 1 / uCm;
  const vCm = Math.abs(inverseV) < 1e-12 ? Infinity : 1 / inverseV;
  const magnification = vCm / uCm;
  const imageHeightCm = magnification * objectHeightCm;
  return {
    uCm,
    fCm,
    vCm,
    magnification,
    imageHeightCm,
    powerD: 100 / fCm,
    isReal: vCm > 0,
    isVirtual: vCm < 0,
    isInverted: imageHeightCm < 0,
    equationResidual: Number.isFinite(vCm) ? 1 / fCm - (1 / vCm - 1 / uCm) : 0,
  };
}

export const focalLengthFromPositions = (uCm: number, vCm: number) =>
  1 / (1 / vCm - 1 / uCm);

export const lensFormulaBenchmarks = runBenchmarkCases([
  {
    id: "lens-real",
    name: "convex f 20 u minus 60 gives v 30",
    input: { u: 60, f: 20, h: 2 },
    expected: 30,
    unit: "cm",
    tolerance: 1e-12,
    actual: (x) =>
      solveLens({
        objectDistanceCm: x.u!,
        focalLengthCm: x.f!,
        objectHeightCm: x.h!,
        lensType: "convex",
      }).vCm,
  },
  {
    id: "lens-virtual",
    name: "inside convex focus gives virtual image",
    input: { u: 10, f: 20, h: 2 },
    expected: -20,
    unit: "cm",
    tolerance: 1e-12,
    actual: (x) =>
      solveLens({
        objectDistanceCm: x.u!,
        focalLengthCm: x.f!,
        objectHeightCm: x.h!,
        lensType: "convex",
      }).vCm,
  },
  {
    id: "lens-mag",
    name: "magnification equals v over u",
    input: { u: 30, f: 15, h: 2 },
    expected: -1,
    unit: "unitless",
    tolerance: 1e-12,
    actual: (x) =>
      solveLens({
        objectDistanceCm: x.u!,
        focalLengthCm: x.f!,
        objectHeightCm: x.h!,
        lensType: "convex",
      }).magnification,
  },
  {
    id: "lens-concave",
    name: "concave lens makes upright diminished virtual image",
    input: { u: 30, f: 15, h: 3 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => {
      const s = solveLens({
        objectDistanceCm: x.u!,
        focalLengthCm: x.f!,
        objectHeightCm: x.h!,
        lensType: "concave",
      });
      return s.isVirtual && s.imageHeightCm > 0 && Math.abs(s.magnification) < 1
        ? 1
        : 0;
    },
  },
  {
    id: "lens-mission",
    name: "u minus 24 v 48 implies f 16",
    input: { u: -24, v: 48 },
    expected: 16,
    unit: "cm",
    tolerance: 1e-12,
    actual: (x) => focalLengthFromPositions(x.u!, x.v!),
  },
]);
