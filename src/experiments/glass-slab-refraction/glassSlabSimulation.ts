import { runBenchmarkCases } from "../shared/validation";

export const wavelengthAdjustedIndex = (
  referenceIndex: number,
  wavelengthNm: number,
) => referenceIndex + 0.004 * ((589.3 / Math.max(380, wavelengthNm)) ** 2 - 1);

export function solveGlassSlab({
  incidenceDeg,
  referenceIndex,
  wavelengthNm,
  thicknessCm,
  surroundingIndex = 1,
}: {
  incidenceDeg: number;
  referenceIndex: number;
  wavelengthNm: number;
  thicknessCm: number;
  surroundingIndex?: number;
}) {
  const incidenceRad = (incidenceDeg * Math.PI) / 180;
  const slabIndex = wavelengthAdjustedIndex(referenceIndex, wavelengthNm);
  const sineR = (surroundingIndex * Math.sin(incidenceRad)) / slabIndex;
  const transmitted = Math.abs(sineR) <= 1;
  const refractionRad = transmitted ? Math.asin(sineR) : Number.NaN;
  const refractionDeg = transmitted
    ? (refractionRad * 180) / Math.PI
    : Number.NaN;
  const lateralShiftCm = transmitted
    ? (thicknessCm * Math.sin(incidenceRad - refractionRad)) /
      Math.cos(refractionRad)
    : Number.NaN;
  return {
    incidenceDeg,
    incidenceRad,
    refractionDeg,
    refractionRad,
    emergentDeg: transmitted ? incidenceDeg : Number.NaN,
    lateralShiftCm,
    slabIndex,
    surroundingIndex,
    transmitted,
    snellLeft: surroundingIndex * Math.sin(incidenceRad),
    snellRight: transmitted ? slabIndex * Math.sin(refractionRad) : Number.NaN,
    lightSpeedMps: 299_792_458 / slabIndex,
  };
}

export const glassSlabBenchmarks = runBenchmarkCases([
  {
    id: "slab-snell",
    name: "Snell law at 40 degrees",
    input: { i: 40, n: 1.5, lambda: 589.3, t: 1.5 },
    expected: 0,
    unit: "unitless",
    tolerance: 1e-12,
    actual: (x) => {
      const s = solveGlassSlab({
        incidenceDeg: x.i!,
        referenceIndex: x.n!,
        wavelengthNm: x.lambda!,
        thicknessCm: x.t!,
      });
      return s.snellLeft - s.snellRight;
    },
  },
  {
    id: "slab-refraction",
    name: "air to glass refraction angle",
    input: { i: 30, n: 1.5, lambda: 589.3, t: 1 },
    expected: 19.471220634491,
    unit: "deg",
    tolerance: 1e-12,
    actual: (x) =>
      solveGlassSlab({
        incidenceDeg: x.i!,
        referenceIndex: x.n!,
        wavelengthNm: x.lambda!,
        thicknessCm: x.t!,
      }).refractionDeg,
  },
  {
    id: "slab-parallel",
    name: "emergent ray remains parallel",
    input: { i: 55, n: 1.62, lambda: 520, t: 2 },
    expected: 0,
    unit: "deg",
    tolerance: 1e-12,
    actual: (x) => {
      const s = solveGlassSlab({
        incidenceDeg: x.i!,
        referenceIndex: x.n!,
        wavelengthNm: x.lambda!,
        thicknessCm: x.t!,
      });
      return s.emergentDeg - s.incidenceDeg;
    },
  },
  {
    id: "slab-normal",
    name: "normal incidence has zero shift",
    input: { i: 0, n: 1.5, lambda: 520, t: 3 },
    expected: 0,
    unit: "cm",
    tolerance: 1e-12,
    actual: (x) =>
      solveGlassSlab({
        incidenceDeg: x.i!,
        referenceIndex: x.n!,
        wavelengthNm: x.lambda!,
        thicknessCm: x.t!,
      }).lateralShiftCm,
  },
  {
    id: "slab-dispersion",
    name: "violet bends more toward normal than red",
    input: { i: 50, n: 1.5, t: 1.5 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => {
      const violet = solveGlassSlab({
        incidenceDeg: x.i!,
        referenceIndex: x.n!,
        wavelengthNm: 400,
        thicknessCm: x.t!,
      });
      const red = solveGlassSlab({
        incidenceDeg: x.i!,
        referenceIndex: x.n!,
        wavelengthNm: 700,
        thicknessCm: x.t!,
      });
      return violet.refractionDeg < red.refractionDeg ? 1 : 0;
    },
  },
]);
