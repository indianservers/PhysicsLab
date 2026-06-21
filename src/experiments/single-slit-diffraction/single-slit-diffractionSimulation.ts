import { mmToMeters, nmToMeters, sinc } from "../shared/waveMath";
import { runBenchmarkCases } from "../shared/validation";

export interface SingleSlitInput {
  wavelengthNm: number;
  slitWidthMm: number;
  screenDistanceM: number;
  order: number;
}

export function simulateSingleSlit(input: SingleSlitInput) {
  const wavelengthM = nmToMeters(input.wavelengthNm);
  const slitWidthM = mmToMeters(input.slitWidthMm);
  const ratio = Math.min(0.999, wavelengthM / slitWidthM);
  const firstMinimaPosition = wavelengthM * input.screenDistanceM / slitWidthM;
  const selectedMinimaPosition = input.order * firstMinimaPosition;
  const angularSpreadRad = Math.asin(ratio);
  const centralMaximumWidth = 2 * firstMinimaPosition;
  const intensityPoints = Array.from({ length: 61 }, (_, index) => {
    const y = -3 * centralMaximumWidth + (index / 60) * 6 * centralMaximumWidth;
    const beta = Math.PI * slitWidthM * y / Math.max(1e-12, wavelengthM * input.screenDistanceM);
    return { x: y, y: sinc(beta) ** 2 };
  });

  return { wavelengthM, slitWidthM, angularSpreadRad, firstMinimaPosition, selectedMinimaPosition, centralMaximumWidth, intensityPoints };
}

export const singleSlitBenchmarks = runBenchmarkCases<SingleSlitInput>([
  {
    id: "single-slit-first-minimum",
    name: "First minimum position",
    input: { wavelengthNm: 500, screenDistanceM: 2, slitWidthMm: 0.1, order: 1 },
    expected: 0.01,
    unit: "m",
    tolerance: 1e-12,
    actual: (input) => simulateSingleSlit(input).firstMinimaPosition,
  },
  {
    id: "single-slit-width-monotonic",
    name: "Wider slit narrows central maximum",
    input: { wavelengthNm: 500, screenDistanceM: 2, slitWidthMm: 0.2, order: 1 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) => simulateSingleSlit(input).centralMaximumWidth < simulateSingleSlit({ ...input, slitWidthMm: 0.1 }).centralMaximumWidth ? 1 : 0,
  },
]);
