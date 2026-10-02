import { mmToMeters, nmToMeters, sinc } from "../shared/waveMath";
import { runBenchmarkCases } from "../shared/validation";

export interface SingleSlitInput {
  wavelengthNm: number;
  slitWidthMm: number;
  screenDistanceM: number;
  order: number;
}

export function minimumForOrder(
  order: number,
  wavelengthM: number,
  slitWidthM: number,
  distanceM: number,
) {
  const sine = (order * wavelengthM) / slitWidthM;
  if (Math.abs(sine) >= 1)
    return { angleRad: Number.NaN, positionM: Number.NaN, sine };
  const angleRad = Math.asin(sine);
  return { angleRad, positionM: distanceM * Math.tan(angleRad), sine };
}

export function intensityAtPosition(
  positionM: number,
  wavelengthM: number,
  slitWidthM: number,
  distanceM: number,
) {
  const theta = Math.atan2(positionM, distanceM);
  const beta = (Math.PI * slitWidthM * Math.sin(theta)) / wavelengthM;
  return sinc(beta) ** 2;
}

export function simulateSingleSlit(input: SingleSlitInput) {
  if (!Number.isFinite(input.wavelengthNm) || input.wavelengthNm <= 0)
    throw new RangeError("Wavelength must be positive.");
  if (!Number.isFinite(input.slitWidthMm) || input.slitWidthMm <= 0)
    throw new RangeError("Slit width must be positive.");
  if (!Number.isFinite(input.screenDistanceM) || input.screenDistanceM <= 0)
    throw new RangeError("Screen distance must be positive.");
  const wavelengthM = nmToMeters(input.wavelengthNm);
  const slitWidthM = mmToMeters(input.slitWidthMm);
  const first = minimumForOrder(
    1,
    wavelengthM,
    slitWidthM,
    input.screenDistanceM,
  );
  const selected = minimumForOrder(
    input.order,
    wavelengthM,
    slitWidthM,
    input.screenDistanceM,
  );
  const firstMinimaPosition = first.positionM;
  const selectedMinimaPosition = selected.positionM;
  const angularSpreadRad = first.angleRad;
  const centralMaximumWidth = 2 * firstMinimaPosition;
  const plotHalfWidth = firstMinimaPosition * 3.25;
  const intensityPoints = Array.from({ length: 161 }, (_, index) => {
    const positionM = -plotHalfWidth + (index / 160) * 2 * plotHalfWidth;
    return {
      x: positionM,
      y: intensityAtPosition(
        positionM,
        wavelengthM,
        slitWidthM,
        input.screenDistanceM,
      ),
    };
  });
  return {
    wavelengthM,
    slitWidthM,
    angularSpreadRad,
    firstMinimaPosition,
    selectedMinimaPosition,
    selectedAngleRad: selected.angleRad,
    centralMaximumWidth,
    intensityPoints,
  };
}

const exactReference = 2 * Math.tan(Math.asin(500e-9 / 0.0001));
export const singleSlitBenchmarks = runBenchmarkCases<SingleSlitInput>([
  {
    id: "single-slit-first-minimum",
    name: "First minimum obeys exact sine geometry",
    input: {
      wavelengthNm: 500,
      screenDistanceM: 2,
      slitWidthMm: 0.1,
      order: 1,
    },
    expected: exactReference,
    unit: "m",
    tolerance: 1e-12,
    actual: (input) => simulateSingleSlit(input).firstMinimaPosition,
  },
  {
    id: "single-slit-minimum-equation",
    name: "Minimum satisfies a sin theta equals m lambda",
    input: {
      wavelengthNm: 650,
      screenDistanceM: 1.2,
      slitWidthMm: 0.08,
      order: 2,
    },
    expected: 0,
    unit: "m",
    tolerance: 1e-15,
    actual: (input) => {
      const result = simulateSingleSlit(input);
      return (
        result.slitWidthM * Math.sin(result.selectedAngleRad) -
        input.order * result.wavelengthM
      );
    },
  },
  {
    id: "single-slit-width-monotonic",
    name: "Narrower slit widens central maximum",
    input: {
      wavelengthNm: 500,
      screenDistanceM: 2,
      slitWidthMm: 0.2,
      order: 1,
    },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) =>
      simulateSingleSlit({ ...input, slitWidthMm: 0.1 }).centralMaximumWidth >
      simulateSingleSlit(input).centralMaximumWidth
        ? 1
        : 0,
  },
  {
    id: "single-slit-wavelength-monotonic",
    name: "Longer wavelength widens central maximum",
    input: {
      wavelengthNm: 450,
      screenDistanceM: 1,
      slitWidthMm: 0.08,
      order: 1,
    },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) =>
      simulateSingleSlit({ ...input, wavelengthNm: 650 }).centralMaximumWidth >
      simulateSingleSlit(input).centralMaximumWidth
        ? 1
        : 0,
  },
  {
    id: "single-slit-distance-monotonic",
    name: "Screen pattern scales with distance",
    input: {
      wavelengthNm: 550,
      screenDistanceM: 1,
      slitWidthMm: 0.1,
      order: 1,
    },
    expected: 2,
    unit: "ratio",
    tolerance: 1e-12,
    actual: (input) =>
      simulateSingleSlit({ ...input, screenDistanceM: 2 }).firstMinimaPosition /
      simulateSingleSlit(input).firstMinimaPosition,
  },
]);
