import { runBenchmarkCases } from "../shared/validation";

export interface YoungDoubleSlitInput {
  wavelengthM: number;
  slitSeparationM: number;
  screenDistanceM: number;
  coherence: number;
  probeYM: number;
}

export function solveYoungDoubleSlit(input: YoungDoubleSlitInput) {
  const betaM =
    (input.wavelengthM * input.screenDistanceM) / input.slitSeparationM;
  const rUpperM = Math.hypot(
    input.screenDistanceM,
    input.probeYM - input.slitSeparationM / 2,
  );
  const rLowerM = Math.hypot(
    input.screenDistanceM,
    input.probeYM + input.slitSeparationM / 2,
  );
  const pathDifferenceM = rUpperM - rLowerM;
  const phaseDifferenceRad =
    (2 * Math.PI * pathDifferenceM) / input.wavelengthM;
  const intensityAt = (yM: number) => {
    const r1 = Math.hypot(
      input.screenDistanceM,
      yM - input.slitSeparationM / 2,
    );
    const r2 = Math.hypot(
      input.screenDistanceM,
      yM + input.slitSeparationM / 2,
    );
    return Math.max(
      0,
      (1 +
        input.coherence *
          Math.cos((2 * Math.PI * (r1 - r2)) / input.wavelengthM)) /
        2,
    );
  };
  const intensity = intensityAt(input.probeYM);
  const order = pathDifferenceM / input.wavelengthM;
  const nearestBrightOrder = Math.round(order);
  const brightError = Math.abs(order - nearestBrightOrder);
  const nearestDarkOrder = Math.round(order - 0.5);
  const darkError = Math.abs(order - (nearestDarkOrder + 0.5));
  const classification =
    input.coherence < 0.1
      ? "incoherent"
      : brightError < 0.08
        ? "bright"
        : darkError < 0.08
          ? "dark"
          : "between";
  const smallAngleRatio = Math.abs(input.probeYM) / input.screenDistanceM;
  return {
    betaM,
    rUpperM,
    rLowerM,
    pathDifferenceM,
    phaseDifferenceRad,
    intensity,
    intensityAt,
    order,
    classification,
    smallAngleRatio,
    smallAngleValid: smallAngleRatio <= 0.1,
  };
}

const reference: YoungDoubleSlitInput = {
  wavelengthM: 500e-9,
  slitSeparationM: 0.5e-3,
  screenDistanceM: 2,
  coherence: 1,
  probeYM: 0,
};

export const youngDoubleSlitBenchmarks =
  runBenchmarkCases<YoungDoubleSlitInput>([
    {
      id: "numeric-fringe-width",
      name: "500 nm, 2 m, 0.5 mm gives 2 mm fringe width",
      input: reference,
      expected: 0.002,
      tolerance: 1e-12,
      unit: "m",
      actual: (input) => solveYoungDoubleSlit(input).betaM,
    },
    {
      id: "central-bright",
      name: "Equal central paths give a bright maximum",
      input: reference,
      expected: 1,
      tolerance: 1e-12,
      unit: "relative",
      actual: (input) => solveYoungDoubleSlit(input).intensity,
    },
    {
      id: "first-dark-small-angle",
      name: "Half-fringe position is dark in the small-angle regime",
      input: { ...reference, probeYM: 0.001 },
      expected: 0,
      tolerance: 1e-7,
      unit: "relative",
      actual: (input) => solveYoungDoubleSlit(input).intensity,
    },
    {
      id: "double-distance",
      name: "Doubling screen distance doubles fringe spacing",
      input: reference,
      expected: 2,
      tolerance: 1e-12,
      unit: "ratio",
      actual: (input) =>
        solveYoungDoubleSlit({
          ...input,
          screenDistanceM: input.screenDistanceM * 2,
        }).betaM / solveYoungDoubleSlit(input).betaM,
    },
    {
      id: "incoherent-flat",
      name: "Incoherent sources remove fringe contrast",
      input: { ...reference, coherence: 0, probeYM: 0.001 },
      expected: 0.5,
      tolerance: 1e-12,
      unit: "relative",
      actual: (input) => solveYoungDoubleSlit(input).intensity,
    },
  ]);
