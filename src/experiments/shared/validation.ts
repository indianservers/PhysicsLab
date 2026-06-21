import type { GraphShape } from "./GraphPanel";

export type BenchmarkToleranceMode = "absolute" | "relative";
export type GraphDirection = "increasing" | "decreasing" | "constant" | "non-monotonic";
export type AccuracyStatus = "validated" | "benchmark-pending" | "qualitative-only";

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
  accuracyStatus: AccuracyStatus;
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
    accuracyStatus: options.accuracyStatus ?? (options.qualitative ? "qualitative-only" : "benchmark-pending"),
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
    status: "qualitative-only" as const,
    message:
      `${reason} Do not label qualitative visuals as validated accuracy unless benchmark cases pass.`,
  };
}

// Migration note: a dedicated lab should only display "validated" after its
// benchmark cases pass. Keep exact numerical labels separate from qualitative
// classroom visuals so students can trust what is measured versus illustrated.
