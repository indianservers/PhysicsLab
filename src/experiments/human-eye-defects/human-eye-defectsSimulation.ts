import { runBenchmarkCases } from "../shared/validation";

export type EyeDefect = "normal" | "myopia" | "hyperopia" | "presbyopia";
export const RETINA_DISTANCE_M = 0.017;

export const requiredPower = (
  objectDistanceM: number,
  retinaDistanceM = RETINA_DISTANCE_M,
) => 1 / objectDistanceM + 1 / retinaDistanceM;

export function solveEye({
  objectDistanceM,
  eyePowerD,
  correctionPowerD,
  retinaDistanceM = RETINA_DISTANCE_M,
  accommodationD = 0,
}: {
  objectDistanceM: number;
  eyePowerD: number;
  correctionPowerD: number;
  retinaDistanceM?: number;
  accommodationD?: number;
}) {
  const totalPowerD = eyePowerD + accommodationD + correctionPowerD;
  const denominator = totalPowerD - 1 / objectDistanceM;
  const imageDistanceM = denominator > 0 ? 1 / denominator : Infinity;
  const focusErrorM = imageDistanceM - retinaDistanceM;
  const neededCorrectionD =
    requiredPower(objectDistanceM, retinaDistanceM) -
    eyePowerD -
    accommodationD;
  return {
    totalPowerD,
    imageDistanceM,
    focusErrorM,
    neededCorrectionD,
    onRetina: Math.abs(focusErrorM) <= 0.00005,
    focusPosition:
      Math.abs(focusErrorM) <= 0.00005
        ? "on retina"
        : focusErrorM < 0
          ? "before retina"
          : "behind retina",
    magnification: -imageDistanceM / objectDistanceM,
  };
}

export const farPointM = (
  eyePowerD: number,
  retinaDistanceM = RETINA_DISTANCE_M,
) => {
  const excess = eyePowerD - 1 / retinaDistanceM;
  return excess > 0 ? 1 / excess : Infinity;
};

export const nearPointM = (
  eyePowerD: number,
  accommodationRangeD: number,
  retinaDistanceM = RETINA_DISTANCE_M,
) => {
  const objectVergence = eyePowerD + accommodationRangeD - 1 / retinaDistanceM;
  return objectVergence > 0 ? 1 / objectVergence : Infinity;
};

export const correctionForMyopicFarPoint = (farPointMetres: number) =>
  -1 / farPointMetres;

export const humanEyeDefectsBenchmarks = runBenchmarkCases([
  {
    id: "eye-retina-focus",
    name: "required power focuses on retina",
    input: { u: 2, v: RETINA_DISTANCE_M },
    expected: 0,
    unit: "m",
    tolerance: 1e-12,
    actual: (x) =>
      solveEye({
        objectDistanceM: x.u!,
        eyePowerD: requiredPower(x.u!, x.v!),
        correctionPowerD: 0,
        retinaDistanceM: x.v!,
      }).focusErrorM,
  },
  {
    id: "eye-myopia-sign",
    name: "myopia needs negative correction",
    input: { u: 10, p: 61 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) =>
      solveEye({
        objectDistanceM: x.u!,
        eyePowerD: x.p!,
        correctionPowerD: 0,
      }).neededCorrectionD < 0
        ? 1
        : 0,
  },
  {
    id: "eye-hyperopia-sign",
    name: "hyperopia needs positive correction",
    input: { u: 2, p: 56 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) =>
      solveEye({
        objectDistanceM: x.u!,
        eyePowerD: x.p!,
        correctionPowerD: 0,
      }).neededCorrectionD > 0
        ? 1
        : 0,
  },
  {
    id: "eye-far-point",
    name: "80 cm myopic far point needs minus 1.25 D",
    input: { far: 0.8 },
    expected: -1.25,
    unit: "D",
    tolerance: 1e-12,
    actual: (x) => correctionForMyopicFarPoint(x.far!),
  },
  {
    id: "eye-presbyopia",
    name: "reduced accommodation moves near point farther",
    input: { p: 1 / RETINA_DISTANCE_M, low: 3, normal: 4 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) =>
      nearPointM(x.p!, x.low!) > nearPointM(x.p!, x.normal!) ? 1 : 0,
  },
]);
