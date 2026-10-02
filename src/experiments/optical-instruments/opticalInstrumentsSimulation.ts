import { runBenchmarkCases } from "../shared/validation";

export type InstrumentMode = "microscope" | "telescope";
export type FocusMode = "normal" | "near-point";

export const NEAR_POINT_MM = 250;

export function eyepieceObjectDistanceMm(
  eyepieceFocalMm: number,
  focusMode: FocusMode,
) {
  return focusMode === "normal"
    ? eyepieceFocalMm
    : (eyepieceFocalMm * NEAR_POINT_MM) / (NEAR_POINT_MM + eyepieceFocalMm);
}

export function solveOpticalInstrument({
  mode,
  focusMode,
  objectiveFocalMm,
  eyepieceFocalMm,
  tubeLengthMm,
  focusOffsetMm = 0,
  apertureMm = 8,
}: {
  mode: InstrumentMode;
  focusMode: FocusMode;
  objectiveFocalMm: number;
  eyepieceFocalMm: number;
  tubeLengthMm: number;
  focusOffsetMm?: number;
  apertureMm?: number;
}) {
  const fo = Math.max(0.1, objectiveFocalMm);
  const fe = Math.max(0.1, eyepieceFocalMm);
  const eyepieceObjectMm = eyepieceObjectDistanceMm(fe, focusMode);
  if (mode === "microscope") {
    const intermediateDistanceMm = Math.max(
      fo + 0.1,
      tubeLengthMm - eyepieceObjectMm + focusOffsetMm,
    );
    const specimenDistanceMm =
      (fo * intermediateDistanceMm) / (intermediateDistanceMm - fo);
    const objectiveMagnification = -intermediateDistanceMm / specimenDistanceMm;
    const eyepieceMagnification =
      focusMode === "normal" ? NEAR_POINT_MM / fe : 1 + NEAR_POINT_MM / fe;
    const magnification = objectiveMagnification * eyepieceMagnification;
    const numericalAperture = Math.min(
      0.95,
      Math.max(0.01, apertureMm / (2 * fo)),
    );
    const resolutionUm = (0.61 * 0.55) / numericalAperture;
    const focusScore = Math.max(0, 100 - Math.abs(focusOffsetMm) * 12.5);
    return {
      mode,
      focusMode,
      targetTubeLengthMm: tubeLengthMm,
      intermediateDistanceMm,
      specimenDistanceMm,
      objectiveMagnification,
      eyepieceMagnification,
      magnification,
      orientation: "inverted" as const,
      focusErrorMm: focusOffsetMm,
      focusScore,
      numericalAperture,
      resolutionUm,
      finalImage: focusMode === "normal" ? "at infinity" : "at 25 cm",
    };
  }

  const targetTubeLengthMm = fo + eyepieceObjectMm;
  const effectiveTubeLengthMm = tubeLengthMm + focusOffsetMm;
  const focusErrorMm = effectiveTubeLengthMm - targetTubeLengthMm;
  const magnification =
    -(fo / fe) * (focusMode === "near-point" ? 1 + fe / NEAR_POINT_MM : 1);
  return {
    mode,
    focusMode,
    targetTubeLengthMm,
    intermediateDistanceMm: fo,
    specimenDistanceMm: Infinity,
    objectiveMagnification: -fo / fe,
    eyepieceMagnification: 1,
    magnification,
    orientation: "inverted" as const,
    focusErrorMm,
    focusScore: Math.max(0, 100 - Math.abs(focusErrorMm) * 2),
    numericalAperture: 0,
    resolutionUm: 0,
    finalImage: focusMode === "normal" ? "at infinity" : "at 25 cm",
  };
}

export const opticalInstrumentsBenchmarks = runBenchmarkCases([
  {
    id: "microscope-normal",
    name: "microscope normal adjustment includes objective and eyepiece magnification",
    input: { fo: 10, fe: 25, L: 160 },
    expected: -125,
    unit: "times",
    tolerance: 1e-10,
    actual: (x) =>
      solveOpticalInstrument({
        mode: "microscope",
        focusMode: "normal",
        objectiveFocalMm: x.fo!,
        eyepieceFocalMm: x.fe!,
        tubeLengthMm: x.L!,
      }).magnification,
  },
  {
    id: "microscope-near",
    name: "near-point eyepiece magnification is one plus D over fe",
    input: { fe: 25 },
    expected: 11,
    unit: "times",
    tolerance: 1e-12,
    actual: (x) =>
      solveOpticalInstrument({
        mode: "microscope",
        focusMode: "near-point",
        objectiveFocalMm: 10,
        eyepieceFocalMm: x.fe!,
        tubeLengthMm: 160,
      }).eyepieceMagnification,
  },
  {
    id: "telescope-normal",
    name: "astronomical telescope angular magnification is minus fo over fe",
    input: { fo: 500, fe: 25 },
    expected: -20,
    unit: "times",
    tolerance: 1e-12,
    actual: (x) =>
      solveOpticalInstrument({
        mode: "telescope",
        focusMode: "normal",
        objectiveFocalMm: x.fo!,
        eyepieceFocalMm: x.fe!,
        tubeLengthMm: 525,
      }).magnification,
  },
  {
    id: "telescope-length",
    name: "normal telescope length is fo plus fe",
    input: { fo: 500, fe: 25 },
    expected: 525,
    unit: "mm",
    tolerance: 1e-12,
    actual: (x) =>
      solveOpticalInstrument({
        mode: "telescope",
        focusMode: "normal",
        objectiveFocalMm: x.fo!,
        eyepieceFocalMm: x.fe!,
        tubeLengthMm: 525,
      }).targetTubeLengthMm,
  },
  {
    id: "orientation",
    name: "both compound instruments invert the final image",
    input: {},
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: () =>
      ["microscope", "telescope"].every(
        (mode) =>
          solveOpticalInstrument({
            mode: mode as InstrumentMode,
            focusMode: "normal",
            objectiveFocalMm: mode === "microscope" ? 10 : 500,
            eyepieceFocalMm: 25,
            tubeLengthMm: mode === "microscope" ? 160 : 525,
          }).magnification < 0,
      )
        ? 1
        : 0,
  },
]);
