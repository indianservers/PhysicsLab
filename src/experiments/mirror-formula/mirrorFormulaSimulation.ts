import { runBenchmarkCases } from "../shared/validation";

export type MirrorType = "concave" | "convex";

export function solveMirror({
  mirrorType,
  objectDistanceCm,
  focalLengthCm,
  objectHeightCm,
}: {
  mirrorType: MirrorType;
  objectDistanceCm: number;
  focalLengthCm: number;
  objectHeightCm: number;
}) {
  const uCm = -Math.max(0.1, Math.abs(objectDistanceCm));
  const fCm =
    mirrorType === "concave"
      ? -Math.max(0.1, Math.abs(focalLengthCm))
      : Math.max(0.1, Math.abs(focalLengthCm));
  const inverseV = 1 / fCm - 1 / uCm;
  const vCm = Math.abs(inverseV) < 1e-10 ? Infinity : 1 / inverseV;
  const magnification = Number.isFinite(vCm) ? -vCm / uCm : Infinity;
  const imageHeightCm = Number.isFinite(magnification)
    ? magnification * objectHeightCm
    : Infinity;
  const isReal = vCm < 0;
  const isVirtual = vCm > 0;
  return {
    uCm,
    fCm,
    vCm,
    magnification,
    imageHeightCm,
    radiusCm: 2 * fCm,
    isReal,
    isVirtual,
    orientation:
      magnification < 0 ? ("inverted" as const) : ("upright" as const),
    size:
      Math.abs(magnification) > 1.01
        ? ("magnified" as const)
        : Math.abs(magnification) < 0.99
          ? ("diminished" as const)
          : ("same size" as const),
    equationResidual: Number.isFinite(vCm) ? 1 / fCm - (1 / vCm + 1 / uCm) : 0,
  };
}

export const mirrorFormulaBenchmarks = runBenchmarkCases([
  {
    id: "concave-real",
    name: "concave f minus 20 u minus 60 gives v minus 30",
    input: { u: 60, f: 20 },
    expected: -30,
    unit: "cm",
    tolerance: 1e-12,
    actual: (x) =>
      solveMirror({
        mirrorType: "concave",
        objectDistanceCm: x.u!,
        focalLengthCm: x.f!,
        objectHeightCm: 3,
      }).vCm,
  },
  {
    id: "concave-virtual",
    name: "inside concave focus gives virtual upright magnified image",
    input: { u: 10, f: 20 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => {
      const s = solveMirror({
        mirrorType: "concave",
        objectDistanceCm: x.u!,
        focalLengthCm: x.f!,
        objectHeightCm: 3,
      });
      return s.isVirtual && s.orientation === "upright" && s.magnification > 1
        ? 1
        : 0;
    },
  },
  {
    id: "convex",
    name: "convex mirror image is always virtual upright diminished",
    input: { u: 40, f: 20 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => {
      const s = solveMirror({
        mirrorType: "convex",
        objectDistanceCm: x.u!,
        focalLengthCm: x.f!,
        objectHeightCm: 3,
      });
      return s.isVirtual && s.orientation === "upright" && s.magnification < 1
        ? 1
        : 0;
    },
  },
  {
    id: "magnification",
    name: "mirror magnification is minus v over u",
    input: { u: 60, f: 20 },
    expected: -0.5,
    unit: "unitless",
    tolerance: 1e-12,
    actual: (x) =>
      solveMirror({
        mirrorType: "concave",
        objectDistanceCm: x.u!,
        focalLengthCm: x.f!,
        objectHeightCm: 3,
      }).magnification,
  },
  {
    id: "residual",
    name: "mirror formula residual is zero",
    input: { u: 35, f: 15 },
    expected: 0,
    unit: "1/cm",
    tolerance: 1e-12,
    actual: (x) =>
      solveMirror({
        mirrorType: "concave",
        objectDistanceCm: x.u!,
        focalLengthCm: x.f!,
        objectHeightCm: 3,
      }).equationResidual,
  },
]);
