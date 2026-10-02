export type Instrument = "ruler" | "vernier" | "micrometer";
export interface MeasurementInput {
  trueMm: number;
  instrument: Instrument;
  leastCountMm: number;
  zeroErrorMm: number;
  trials: number;
  parallax: number;
  seed: number;
}
export const instrumentDefaults: Record<Instrument, number> = {
  ruler: 1,
  vernier: 0.02,
  micrometer: 0.01,
};
const roundStep = (value: number, step: number) =>
  Math.round(value / step) * step;
const deviation = (seed: number, index: number) => {
  const value = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
  return (value - Math.floor(value) - 0.5) * 2;
};
export function roundUncertainty(value: number, uncertainty: number) {
  if (!(uncertainty > 0)) return { value, uncertainty: 0, decimals: 0 };
  const exponent = Math.floor(Math.log10(uncertainty)),
    leading = uncertainty / 10 ** exponent,
    sig = leading < 3 ? 2 : 1,
    roundedUncertainty = Number(uncertainty.toPrecision(sig)),
    decimals = Math.max(
      0,
      -Math.floor(Math.log10(roundedUncertainty)) + sig - 1,
    );
  return {
    value: Number(value.toFixed(decimals)),
    uncertainty: roundedUncertainty,
    decimals,
  };
}
export function solveMeasurements(input: MeasurementInput) {
  const trueMm = Math.max(1, Math.min(100, input.trueMm)),
    leastCount = Math.max(0.01, Math.min(1, input.leastCountMm)),
    trials = Math.max(1, Math.min(12, Math.round(input.trials)));
  const parallaxBias =
    input.instrument === "ruler" ? input.parallax * leastCount * 0.6 : 0;
  const readings = Array.from({ length: trials }, (_, index) => {
    const noise = deviation(input.seed, index) * leastCount * 1.2;
    const raw = roundStep(
      trueMm + input.zeroErrorMm + parallaxBias + noise,
      leastCount,
    );
    return { trial: index + 1, raw, corrected: raw - input.zeroErrorMm };
  });
  const mean =
    readings.reduce((sum, reading) => sum + reading.corrected, 0) / trials;
  const sampleStd =
    trials > 1
      ? Math.sqrt(
          readings.reduce(
            (sum, reading) => sum + (reading.corrected - mean) ** 2,
            0,
          ) /
            (trials - 1),
        )
      : 0;
  const randomUncertainty = trials > 1 ? sampleStd / Math.sqrt(trials) : 0;
  const instrumentUncertainty = leastCount / 2;
  const combinedUncertainty = Math.hypot(
    randomUncertainty,
    instrumentUncertainty,
  );
  const absoluteError = Math.abs(mean - trueMm),
    percentageError = (absoluteError / trueMm) * 100;
  const area = mean ** 2,
    areaUncertainty = (area * 2 * combinedUncertainty) / mean;
  const report = roundUncertainty(mean, combinedUncertainty);
  return {
    trueMm,
    leastCount,
    trials,
    readings,
    mean,
    sampleStd,
    randomUncertainty,
    instrumentUncertainty,
    combinedUncertainty,
    absoluteError,
    percentageError,
    area,
    areaUncertainty,
    parallaxBias,
    report,
    reportText: `(${report.value.toFixed(report.decimals)} ± ${report.uncertainty.toFixed(report.decimals)}) mm`,
  };
}
const base: MeasurementInput = {
  trueMm: 24.48,
  instrument: "vernier",
  leastCountMm: 0.02,
  zeroErrorMm: 0.02,
  trials: 5,
  parallax: 0,
  seed: 31,
};
export const measurementErrorBenchmarks = [
  {
    id: "zero-correction",
    name: "Positive zero error is subtracted",
    actual:
      solveMeasurements({ ...base, trials: 1, seed: 1 }).readings[0].raw -
      solveMeasurements({ ...base, trials: 1, seed: 1 }).readings[0].corrected,
    expected: 0.02,
    tolerance: 1e-12,
    unit: "mm",
  },
  {
    id: "mean",
    name: "Mean retains unrounded corrected readings",
    actual: solveMeasurements(base).mean,
    expected:
      solveMeasurements(base).readings.reduce((s, r) => s + r.corrected, 0) / 5,
    tolerance: 1e-12,
    unit: "mm",
  },
  {
    id: "percentage",
    name: "Percentage error uses absolute error over true value",
    actual: solveMeasurements(base).percentageError,
    expected: (solveMeasurements(base).absoluteError / base.trueMm) * 100,
    tolerance: 1e-12,
    unit: "%",
  },
  {
    id: "propagation",
    name: "Squared length doubles relative uncertainty",
    actual:
      solveMeasurements(base).areaUncertainty / solveMeasurements(base).area,
    expected:
      (2 * solveMeasurements(base).combinedUncertainty) /
      solveMeasurements(base).mean,
    tolerance: 1e-12,
    unit: "ratio",
  },
  {
    id: "round-end",
    name: "Reported value matches uncertainty decimal place",
    actual: roundUncertainty(20.4837, 0.0271).value,
    expected: 20.484,
    tolerance: 1e-12,
    unit: "mm",
  },
];
