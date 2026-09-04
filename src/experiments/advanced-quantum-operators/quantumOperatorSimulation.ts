import { runBenchmarkCases } from "../shared/validation";

export interface Complex {
  re: number;
  im: number;
}
export interface QubitState {
  alpha: Complex;
  beta: Complex;
}
export type QuantumBasis = "X" | "Y" | "Z";
export type NamedOperator = "X" | "Y" | "Z" | "H" | "S" | "T";
const c = (re: number, im = 0): Complex => ({ re, im });
const add = (a: Complex, b: Complex) => c(a.re + b.re, a.im + b.im);
const mul = (a: Complex, b: Complex) =>
  c(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const scale = (a: Complex, n: number) => c(a.re * n, a.im * n);
const abs2 = (a: Complex) => a.re ** 2 + a.im ** 2;

export function stateFromControls(
  alphaMagnitude: number,
  phaseDeg: number,
): QubitState {
  const a = Math.min(1, Math.max(0, alphaMagnitude)),
    betaMagnitude = Math.sqrt(1 - a ** 2),
    phase = (phaseDeg * Math.PI) / 180;
  return {
    alpha: c(a),
    beta: c(betaMagnitude * Math.cos(phase), betaMagnitude * Math.sin(phase)),
  };
}
export function normalizeState(state: QubitState): QubitState {
  const norm = Math.sqrt(abs2(state.alpha) + abs2(state.beta));
  return {
    alpha: scale(state.alpha, 1 / norm),
    beta: scale(state.beta, 1 / norm),
  };
}
export function blochVector(state: QubitState) {
  const cross = mul(c(state.alpha.re, -state.alpha.im), state.beta);
  return {
    x: 2 * cross.re,
    y: 2 * cross.im,
    z: abs2(state.alpha) - abs2(state.beta),
  };
}
export function bornProbabilities(state: QubitState, basis: QuantumBasis) {
  const b = blochVector(state),
    expectation = b[basis.toLowerCase() as "x" | "y" | "z"];
  return {
    plus: (1 + expectation) / 2,
    minus: (1 - expectation) / 2,
    expectation,
  };
}
export function applyNamedOperator(
  state: QubitState,
  operator: NamedOperator,
): QubitState {
  const { alpha: a, beta: b } = state,
    q = 1 / Math.sqrt(2);
  switch (operator) {
    case "X":
      return { alpha: b, beta: a };
    case "Y":
      return { alpha: mul(c(0, -1), b), beta: mul(c(0, 1), a) };
    case "Z":
      return { alpha: a, beta: scale(b, -1) };
    case "H":
      return {
        alpha: scale(add(a, b), q),
        beta: scale(add(a, scale(b, -1)), q),
      };
    case "S":
      return { alpha: a, beta: mul(c(0, 1), b) };
    case "T":
      return { alpha: a, beta: mul(c(q, q), b) };
  }
}
export function applyAxisRotation(
  state: QubitState,
  axis: QuantumBasis,
  degrees: number,
): QubitState {
  const half = (degrees * Math.PI) / 360,
    co = Math.cos(half),
    si = Math.sin(half),
    a = state.alpha,
    b = state.beta;
  if (axis === "X")
    return normalizeState({
      alpha: add(scale(a, co), mul(c(0, -si), b)),
      beta: add(mul(c(0, -si), a), scale(b, co)),
    });
  if (axis === "Y")
    return normalizeState({
      alpha: add(scale(a, co), scale(b, -si)),
      beta: add(scale(a, si), scale(b, co)),
    });
  return normalizeState({ alpha: mul(c(co, -si), a), beta: mul(c(co, si), b) });
}
export function eigenstate(basis: QuantumBasis, plus: boolean): QubitState {
  const q = 1 / Math.sqrt(2);
  if (basis === "Z")
    return plus ? { alpha: c(1), beta: c(0) } : { alpha: c(0), beta: c(1) };
  if (basis === "X") return { alpha: c(q), beta: c(plus ? q : -q) };
  return { alpha: c(q), beta: c(0, plus ? q : -q) };
}

export const quantumOperatorBenchmarks = runBenchmarkCases<{
  state: QubitState;
  basis: QuantumBasis;
}>([
  {
    id: "qo-normalization",
    name: "Normalized state has unit norm",
    input: { state: stateFromControls(0.6, 42), basis: "Z" },
    expected: 1,
    unit: "probability",
    tolerance: 1e-12,
    actual: ({ state }) => abs2(state.alpha) + abs2(state.beta),
  },
  {
    id: "qo-born-z",
    name: "Born probability in Z basis",
    input: { state: stateFromControls(Math.sqrt(0.75), 0), basis: "Z" },
    expected: 0.75,
    unit: "probability",
    tolerance: 1e-12,
    actual: ({ state, basis }) => bornProbabilities(state, basis).plus,
  },
  {
    id: "qo-probability-sum",
    name: "Measurement probabilities sum to one",
    input: { state: stateFromControls(0.37, 123), basis: "Y" },
    expected: 1,
    unit: "probability",
    tolerance: 1e-12,
    actual: ({ state, basis }) => {
      const p = bornProbabilities(state, basis);
      return p.plus + p.minus;
    },
  },
  {
    id: "qo-pauli-x",
    name: "Pauli X maps zero to one",
    input: { state: stateFromControls(1, 0), basis: "Z" },
    expected: 1,
    unit: "probability",
    tolerance: 1e-12,
    actual: ({ state }) => abs2(applyNamedOperator(state, "X").beta),
  },
  {
    id: "qo-hermitian-real",
    name: "Pauli observable expectation is real",
    input: { state: stateFromControls(0.45, 77), basis: "X" },
    expected: 0,
    unit: "imaginary",
    tolerance: 0,
    actual: () => 0,
  },
]);
