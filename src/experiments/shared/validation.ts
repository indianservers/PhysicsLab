import type { GraphShape } from "./GraphPanel";

export type BenchmarkToleranceMode = "absolute" | "relative";
export type GraphDirection = "increasing" | "decreasing" | "constant" | "non-monotonic";
export type ValidationClaimStatus = "validated" | "formula-only" | "qualitative-visual" | "needs-benchmark" | "unsafe-claim";
export type LegacyAccuracyStatus = "benchmark-pending" | "qualitative-only";
export type AccuracyStatus = ValidationClaimStatus | LegacyAccuracyStatus;

export interface BenchmarkCase<TInput = unknown> {
  id: string;
  name: string;
  input: TInput;
  expected: number;
  unit: string;
  tolerance: number;
  actual: (input: TInput) => number;
  toleranceMode?: BenchmarkToleranceMode;
  source?: string;
  assumptions?: string[];
}

export interface BenchmarkResult<TInput = unknown> extends Omit<BenchmarkCase<TInput>, "actual"> {
  actual: number;
  pass: boolean;
  error: number;
  toleranceMode: BenchmarkToleranceMode;
}

export interface ValidationRange {
  id: string;
  label: string;
  min?: number;
  max?: number;
  unit?: string;
  warning?: string;
}

export interface UnitGuardrail {
  id: string;
  label: string;
  displayUnit: string;
  siUnit: string;
  toSi?: (value: number) => number;
}

export interface GraphExpectation {
  id: string;
  label: string;
  xLabel: string;
  yLabel: string;
  shape?: GraphShape;
  direction?: GraphDirection;
  notes?: string;
}

export interface ExperimentValidationMetadata {
  experimentId: string;
  formulaName: string;
  formula: string;
  status: ValidationClaimStatus;
  assumptions: string[];
  inputUnits: UnitGuardrail[];
  outputUnits: UnitGuardrail[];
  validRanges: ValidationRange[];
  benchmarkCases: BenchmarkResult[];
  tolerance: number;
  graphExpectations: GraphExpectation[];
  warnings: string[];
}

export interface UnitGuardResult {
  ok: boolean;
  unit: string;
  message: string;
}

export interface GraphDirectionResult {
  ok: boolean;
  expected: GraphDirection;
  observed: GraphDirection;
  message: string;
}

export interface GraphShapeMetadata {
  shape: GraphShape;
  qualitative: boolean;
  description: string;
  accuracyStatus: ValidationClaimStatus;
}

export function approximatelyEqual(
  actual: number,
  expected: number,
  tolerance: number,
  toleranceMode: BenchmarkToleranceMode = "absolute",
) {
  if (!Number.isFinite(actual) || !Number.isFinite(expected) || tolerance < 0) {
    return false;
  }

  const error = Math.abs(actual - expected);
  if (toleranceMode === "relative") {
    const scale = Math.max(Math.abs(expected), Number.EPSILON);
    return error / scale <= tolerance;
  }

  return error <= tolerance;
}

export function runBenchmarkCases<TInput>(cases: BenchmarkCase<TInput>[]): BenchmarkResult<TInput>[] {
  return cases.map((benchmark) => {
    const toleranceMode = benchmark.toleranceMode ?? "absolute";
    const actual = benchmark.actual(benchmark.input);
    const error = Math.abs(actual - benchmark.expected);

    return {
      id: benchmark.id,
      name: benchmark.name,
      input: benchmark.input,
      expected: benchmark.expected,
      unit: benchmark.unit,
      tolerance: benchmark.tolerance,
      toleranceMode,
      source: benchmark.source,
      assumptions: benchmark.assumptions,
      actual,
      error,
      pass: approximatelyEqual(actual, benchmark.expected, benchmark.tolerance, toleranceMode),
    };
  });
}

export function allBenchmarksPassed(results: BenchmarkResult[]) {
  return results.length > 0 && results.every((result) => result.pass);
}

export function canonicalAccuracyStatus(status: AccuracyStatus): ValidationClaimStatus {
  if (status === "benchmark-pending") return "needs-benchmark";
  if (status === "qualitative-only") return "qualitative-visual";
  return status;
}

export function statusForBenchmarks(results: BenchmarkResult[], qualitative = false): ValidationClaimStatus {
  if (qualitative) return "qualitative-visual";
  if (results.length === 0) return "needs-benchmark";
  return results.every((result) => result.pass) ? "validated" : "unsafe-claim";
}

export function detectGraphDirection(values: number[], tolerance = 1e-9): GraphDirection {
  if (values.length < 2) {
    return "constant";
  }

  const deltas = values.slice(1).map((value, index) => value - values[index]);
  const positive = deltas.some((delta) => delta > tolerance);
  const negative = deltas.some((delta) => delta < -tolerance);
  const changing = positive || negative;

  if (!changing) return "constant";
  if (positive && !negative) return "increasing";
  if (negative && !positive) return "decreasing";
  return "non-monotonic";
}

export function validateGraphDirection(
  values: number[],
  expected: GraphDirection,
  tolerance = 1e-9,
): GraphDirectionResult {
  const observed = detectGraphDirection(values, tolerance);

  return {
    ok: observed === expected,
    expected,
    observed,
    message:
      observed === expected
        ? `Graph direction matches ${expected}.`
        : `Expected ${expected} graph direction but observed ${observed}.`,
  };
}

export function graphShapeMetadata(
  shape: GraphShape,
  options: { qualitative?: boolean; description?: string; accuracyStatus?: AccuracyStatus } = {},
): GraphShapeMetadata {
  return {
    shape,
    qualitative: options.qualitative ?? false,
    description: options.description ?? `${shape} response`,
    accuracyStatus: canonicalAccuracyStatus(options.accuracyStatus ?? (options.qualitative ? "qualitative-visual" : "needs-benchmark")),
  };
}

export function guardUnit(unit: string, allowedUnits: string[]): UnitGuardResult {
  const ok = allowedUnits.includes(unit);

  return {
    ok,
    unit,
    message: ok ? `Unit ${unit} is allowed.` : `Unit ${unit} is not in the allowed set: ${allowedUnits.join(", ")}.`,
  };
}

export function qualitativeOnlyWarning(reason = "This visual is a conceptual model, not an exact calculator.") {
  return {
    status: "qualitative-visual" as const,
    message:
      `${reason} Do not label qualitative visuals as validated accuracy unless benchmark cases pass.`,
  };
}

// Migration note: a dedicated lab should only display "validated" after its
// benchmark cases pass. Keep exact numerical labels separate from qualitative
// classroom visuals so students can trust what is measured versus illustrated.
