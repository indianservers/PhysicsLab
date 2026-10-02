import { runBenchmarkCases } from "../shared/validation";

export type InputPolarization = "unpolarized" | "linear" | "circular";
export interface PolarizationInput {
  inputType: InputPolarization;
  inputIntensityMw: number;
  polarizerDeg: number;
  analyzerDeg: number;
}

const cos2 = (degrees: number) => {
  const radians = (degrees * Math.PI) / 180;
  return Math.cos(radians) ** 2;
};

export function axialDifferenceDeg(a: number, b: number) {
  const raw = Math.abs((((a - b) % 180) + 180) % 180);
  return Math.min(raw, 180 - raw);
}

export function solvePolarization(input: PolarizationInput) {
  if (!Number.isFinite(input.inputIntensityMw) || input.inputIntensityMw < 0)
    throw new RangeError("Input intensity cannot be negative.");
  const polarizerFraction =
    input.inputType === "linear" ? cos2(input.polarizerDeg) : 0.5;
  const afterPolarizerMw = input.inputIntensityMw * polarizerFraction;
  const relativeAngleDeg = axialDifferenceDeg(
    input.analyzerDeg,
    input.polarizerDeg,
  );
  const analyzerFraction = cos2(relativeAngleDeg);
  const transmittedMw = afterPolarizerMw * analyzerFraction;
  return {
    polarizerFraction,
    afterPolarizerMw,
    relativeAngleDeg,
    analyzerFraction,
    transmittedMw,
    inputFraction: input.inputIntensityMw
      ? transmittedMw / input.inputIntensityMw
      : 0,
    state:
      analyzerFraction < 1e-6
        ? "Extinction"
        : analyzerFraction > 0.999
          ? "Maximum transmission"
          : "Partially transmitted",
  };
}

export const polarizationBenchmarks = runBenchmarkCases([
  {
    id: "parallel",
    name: "Parallel axes transmit all polarized light",
    input: { p: 25, a: 25 },
    expected: 1,
    unit: "fraction",
    tolerance: 1e-12,
    actual: ({ p, a }) =>
      solvePolarization({
        inputType: "unpolarized",
        inputIntensityMw: 1,
        polarizerDeg: Number(p),
        analyzerDeg: Number(a),
      }).analyzerFraction,
  },
  {
    id: "sixty",
    name: "Sixty degrees transmits one quarter",
    input: { p: 0, a: 60 },
    expected: 0.25,
    unit: "fraction",
    tolerance: 1e-12,
    actual: ({ p, a }) =>
      solvePolarization({
        inputType: "unpolarized",
        inputIntensityMw: 1,
        polarizerDeg: Number(p),
        analyzerDeg: Number(a),
      }).analyzerFraction,
  },
  {
    id: "extinction",
    name: "Crossed axes produce extinction",
    input: { p: 10, a: 100 },
    expected: 0,
    unit: "mW",
    tolerance: 1e-12,
    actual: ({ p, a }) =>
      solvePolarization({
        inputType: "unpolarized",
        inputIntensityMw: 2,
        polarizerDeg: Number(p),
        analyzerDeg: Number(a),
      }).transmittedMw,
  },
  {
    id: "unpolarized-half",
    name: "Ideal polarizer halves unpolarized intensity",
    input: { i: 2 },
    expected: 1,
    unit: "mW",
    tolerance: 1e-12,
    actual: ({ i }) =>
      solvePolarization({
        inputType: "unpolarized",
        inputIntensityMw: Number(i),
        polarizerDeg: 37,
        analyzerDeg: 37,
      }).afterPolarizerMw,
  },
  {
    id: "linear-first",
    name: "Linear input follows Malus law at first polarizer",
    input: { p: 60 },
    expected: 0.25,
    unit: "fraction",
    tolerance: 1e-12,
    actual: ({ p }) =>
      solvePolarization({
        inputType: "linear",
        inputIntensityMw: 1,
        polarizerDeg: Number(p),
        analyzerDeg: Number(p),
      }).polarizerFraction,
  },
  {
    id: "axial-period",
    name: "Polarizer axes repeat after 180 degrees",
    input: { p: 0, a: 180 },
    expected: 0,
    unit: "degrees",
    tolerance: 0,
    actual: ({ p, a }) => axialDifferenceDeg(Number(p), Number(a)),
  },
]);
