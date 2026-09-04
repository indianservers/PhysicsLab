export type FaradayInput = {
  magnetStrength: number;
  speed: number;
  turns: number;
  direction: -1 | 1;
  resistance: number;
  pole: -1 | 1;
  position: number;
};

export type FaradayResult = {
  flux: number;
  fluxRate: number;
  emf: number;
  current: number;
  velocity: number;
  phase: "approach" | "entry" | "centre" | "withdrawal" | "outside" | "rest";
  lenzDirection: "clockwise" | "counter-clockwise" | "none";
  opposingField: "left" | "right" | "none";
};

export const FARADAY_AREA = 0.004;
export const FARADAY_SIGMA = 0.085;
export const FARADAY_TRACK_LIMIT = 0.24;

const finite = (value: number, fallback: number) =>
  Number.isFinite(value) ? value : fallback;

export function normalizeFaradayInput(input: FaradayInput): FaradayInput {
  return {
    magnetStrength: Math.max(
      0.1,
      Math.min(1.2, finite(input.magnetStrength, 0.7)),
    ),
    speed: Math.max(0, Math.min(2, finite(input.speed, 0.8))),
    turns: Math.round(Math.max(100, Math.min(1000, finite(input.turns, 500)))),
    direction: input.direction < 0 ? -1 : 1,
    resistance: Math.max(1, Math.min(50, finite(input.resistance, 10))),
    pole: input.pole < 0 ? -1 : 1,
    position: Math.max(
      -FARADAY_TRACK_LIMIT,
      Math.min(
        FARADAY_TRACK_LIMIT,
        finite(input.position, -FARADAY_TRACK_LIMIT),
      ),
    ),
  };
}

/** Flux through one turn. A Gaussian axial field gives a smooth, symmetric pass. */
export function faradayFlux(
  position: number,
  magnetStrength: number,
  pole: -1 | 1,
  area = FARADAY_AREA,
) {
  return (
    pole * magnetStrength * area * Math.exp(-((position / FARADAY_SIGMA) ** 2))
  );
}

export function faradayFluxGradient(
  position: number,
  magnetStrength: number,
  pole: -1 | 1,
  area = FARADAY_AREA,
) {
  const flux = faradayFlux(position, magnetStrength, pole, area);
  return (-2 * position * flux) / FARADAY_SIGMA ** 2;
}

export function faradayEmf(turns: number, fluxRate: number) {
  return -turns * fluxRate;
}

export function computeFaraday(
  input: FaradayInput,
  moving = true,
): FaradayResult {
  const safe = normalizeFaradayInput(input);
  const velocity = moving ? safe.direction * safe.speed : 0;
  const flux = faradayFlux(safe.position, safe.magnetStrength, safe.pole);
  const rawFluxRate =
    faradayFluxGradient(safe.position, safe.magnetStrength, safe.pole) *
    velocity;
  const fluxRate = Math.abs(rawFluxRate) < 1e-12 ? 0 : rawFluxRate;
  const rawEmf = faradayEmf(safe.turns, fluxRate);
  const emf = Math.abs(rawEmf) < 1e-10 ? 0 : rawEmf;
  const current = emf / safe.resistance;
  const distance = Math.abs(safe.position);
  const phase =
    velocity === 0
      ? "rest"
      : distance < 0.012
        ? "centre"
        : distance > 0.19
          ? "outside"
          : safe.position * velocity < 0
            ? distance > 0.1
              ? "approach"
              : "entry"
            : "withdrawal";
  const lenzDirection =
    Math.abs(current) < 1e-8
      ? "none"
      : current > 0
        ? "counter-clockwise"
        : "clockwise";
  return {
    flux,
    fluxRate,
    emf,
    current,
    velocity,
    phase,
    lenzDirection,
    opposingField:
      lenzDirection === "none"
        ? "none"
        : emf * safe.pole > 0
          ? "right"
          : "left",
  };
}

export function sampleFaradayPass(input: FaradayInput, count = 81) {
  const safe = normalizeFaradayInput(input);
  const start = safe.direction > 0 ? -FARADAY_TRACK_LIMIT : FARADAY_TRACK_LIMIT;
  const distance = FARADAY_TRACK_LIMIT * 2;
  const duration = safe.speed > 0 ? distance / safe.speed : 1;
  return Array.from({ length: count }, (_, index) => {
    const progress = index / (count - 1);
    const position = start + safe.direction * distance * progress;
    const result = computeFaraday({ ...safe, position }, safe.speed > 0);
    return { time: progress * duration, position, ...result };
  });
}

const benchmarkInput: FaradayInput = {
  magnetStrength: 0.7,
  speed: 0.8,
  turns: 500,
  direction: 1,
  resistance: 10,
  pole: 1,
  position: -0.06,
};
const benchmarkResult = computeFaraday(benchmarkInput);

export const emiFaradayBenchmarks = [
  {
    id: "faraday-sign",
    name: "epsilon equals negative N dPhi/dt",
    actual: faradayEmf(500, 0.012),
    expected: -6,
    tolerance: 1e-9,
    unit: "V",
  },
  {
    id: "no-motion",
    name: "No motion gives zero emf",
    actual: computeFaraday(benchmarkInput, false).emf,
    expected: 0,
    tolerance: 1e-12,
    unit: "V",
  },
  {
    id: "centre",
    name: "Flux maximum has zero derivative",
    actual: computeFaraday({ ...benchmarkInput, position: 0 }).emf,
    expected: 0,
    tolerance: 1e-12,
    unit: "V",
  },
  {
    id: "reversal",
    name: "Opposite sides produce opposite emf",
    actual:
      benchmarkResult.emf +
      computeFaraday({ ...benchmarkInput, position: 0.06 }).emf,
    expected: 0,
    tolerance: 1e-9,
    unit: "V",
  },
  {
    id: "resistance",
    name: "Current equals emf over resistance",
    actual: benchmarkResult.current,
    expected: benchmarkResult.emf / 10,
    tolerance: 1e-12,
    unit: "A",
  },
];
