import { runBenchmarkCases } from "../shared/validation";

export type PrismMaterial = "bk7" | "silica" | "sf10" | "sf6";
export type SpectrumMode = "white" | "lines" | "single";

export const prismMaterials: Record<
  PrismMaterial,
  { label: string; a: number; b: number }
> = {
  bk7: { label: "Crown glass (BK7)", a: 1.5046, b: 0.0042 },
  silica: { label: "Fused silica", a: 1.4519, b: 0.00384 },
  sf10: { label: "Flint glass (SF10)", a: 1.6939, b: 0.01316 },
  sf6: { label: "Dense flint (SF6)", a: 1.7569, b: 0.01472 },
};

export const spectralLines = [
  { wavelengthNm: 410, label: "Violet", color: "#7654d8" },
  { wavelengthNm: 486.1, label: "Blue", color: "#3180e9" },
  { wavelengthNm: 546.1, label: "Green", color: "#28a55f" },
  { wavelengthNm: 589.3, label: "Yellow", color: "#e2b72a" },
  { wavelengthNm: 656.3, label: "Red", color: "#ef5b43" },
  { wavelengthNm: 706.5, label: "Deep red", color: "#c83435" },
];

const toRad = (degrees: number) => (degrees * Math.PI) / 180;
const toDeg = (radians: number) => (radians * 180) / Math.PI;

export function refractiveIndex(material: PrismMaterial, wavelengthNm: number) {
  const wavelengthUm = wavelengthNm / 1000;
  const model = prismMaterials[material];
  return model.a + model.b / (wavelengthUm * wavelengthUm);
}

export function solvePrismRay({
  apexAngleDeg,
  incidenceAngleDeg,
  material,
  wavelengthNm,
}: {
  apexAngleDeg: number;
  incidenceAngleDeg: number;
  material: PrismMaterial;
  wavelengthNm: number;
}) {
  const n = refractiveIndex(material, wavelengthNm);
  const iRad = toRad(incidenceAngleDeg);
  const r1Rad = Math.asin(Math.sin(iRad) / n);
  const r2Rad = toRad(apexAngleDeg) - r1Rad;
  const exitSine = n * Math.sin(r2Rad);
  const totalInternalReflection = Math.abs(exitSine) > 1;
  const emergenceAngleDeg = totalInternalReflection
    ? NaN
    : toDeg(Math.asin(exitSine));
  const deviationDeg = totalInternalReflection
    ? NaN
    : incidenceAngleDeg + emergenceAngleDeg - apexAngleDeg;
  return {
    wavelengthNm,
    n,
    r1Deg: toDeg(r1Rad),
    r2Deg: toDeg(r2Rad),
    emergenceAngleDeg,
    deviationDeg,
    totalInternalReflection,
    entrySnellResidual: Math.sin(iRad) - n * Math.sin(r1Rad),
    exitSnellResidual: totalInternalReflection
      ? NaN
      : n * Math.sin(r2Rad) - Math.sin(toRad(emergenceAngleDeg)),
  };
}

export function solvePrismSpectrum({
  apexAngleDeg,
  incidenceAngleDeg,
  material,
}: {
  apexAngleDeg: number;
  incidenceAngleDeg: number;
  material: PrismMaterial;
}) {
  const rays = spectralLines.map((line) => ({
    ...line,
    ...solvePrismRay({
      apexAngleDeg,
      incidenceAngleDeg,
      material,
      wavelengthNm: line.wavelengthNm,
    }),
  }));
  const safe = rays.filter((ray) => !ray.totalInternalReflection);
  const violet = rays[0],
    red = rays[rays.length - 1];
  const angularDispersionDeg =
    violet.totalInternalReflection || red.totalInternalReflection
      ? NaN
      : violet.deviationDeg - red.deviationDeg;
  const referenceIndex = refractiveIndex(material, 589.3);
  const minimumArgument = referenceIndex * Math.sin(toRad(apexAngleDeg / 2));
  const minimumIncidenceDeg =
    minimumArgument <= 1 ? toDeg(Math.asin(minimumArgument)) : NaN;
  const minimumDeviationDeg = Number.isFinite(minimumIncidenceDeg)
    ? 2 * minimumIncidenceDeg - apexAngleDeg
    : NaN;
  return {
    rays,
    safeRayCount: safe.length,
    hasTir: safe.length !== rays.length,
    angularDispersionDeg,
    referenceIndex,
    minimumIncidenceDeg,
    minimumDeviationDeg,
  };
}

export const prismDispersionBenchmarks = runBenchmarkCases([
  {
    id: "entry-snell",
    name: "Snell law residual at first face",
    input: { A: 60, i: 50, wavelength: 589.3 },
    expected: 0,
    unit: "unitless",
    tolerance: 1e-12,
    actual: (x) =>
      solvePrismRay({
        apexAngleDeg: x.A!,
        incidenceAngleDeg: x.i!,
        material: "bk7",
        wavelengthNm: x.wavelength!,
      }).entrySnellResidual,
  },
  {
    id: "exit-snell",
    name: "Snell law residual at second face",
    input: { A: 60, i: 50, wavelength: 589.3 },
    expected: 0,
    unit: "unitless",
    tolerance: 1e-12,
    actual: (x) =>
      solvePrismRay({
        apexAngleDeg: x.A!,
        incidenceAngleDeg: x.i!,
        material: "bk7",
        wavelengthNm: x.wavelength!,
      }).exitSnellResidual,
  },
  {
    id: "violet-order",
    name: "violet deviates more than red",
    input: { A: 60, i: 50 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => {
      const s = solvePrismSpectrum({
        apexAngleDeg: x.A!,
        incidenceAngleDeg: x.i!,
        material: "bk7",
      });
      return s.rays[0].deviationDeg > s.rays[s.rays.length - 1].deviationDeg
        ? 1
        : 0;
    },
  },
  {
    id: "minimum-deviation",
    name: "minimum deviation is symmetric",
    input: { A: 60 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => {
      const s = solvePrismSpectrum({
        apexAngleDeg: x.A!,
        incidenceAngleDeg: 50,
        material: "bk7",
      });
      const ray = solvePrismRay({
        apexAngleDeg: x.A!,
        incidenceAngleDeg: s.minimumIncidenceDeg,
        material: "bk7",
        wavelengthNm: 589.3,
      });
      return Math.abs(ray.r1Deg - ray.r2Deg) < 1e-9 &&
        Math.abs(ray.deviationDeg - s.minimumDeviationDeg) < 1e-9
        ? 1
        : 0;
    },
  },
  {
    id: "tir",
    name: "steep second-face incidence triggers total internal reflection",
    input: { A: 75, i: 20 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) =>
      solvePrismRay({
        apexAngleDeg: x.A!,
        incidenceAngleDeg: x.i!,
        material: "sf6",
        wavelengthNm: 410,
      }).totalInternalReflection
        ? 1
        : 0,
  },
]);
