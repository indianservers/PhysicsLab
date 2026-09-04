import { runBenchmarkCases } from "../shared/validation";

export interface HookesLawInput {
  springConstant: number;
  loadMassKg: number;
  naturalLengthM: number;
  damping: number;
  elasticLimitM: number;
  permanentDeformation: boolean;
}

export interface SpringState {
  forceN: number;
  equilibriumExtensionM: number;
  displayedExtensionM: number;
  totalLengthM: number;
  energyJ: number;
  beyondElasticLimit: boolean;
  permanentSetM: number;
}

export function springState(
  input: HookesLawInput,
  timeS = Infinity,
): SpringState {
  const forceN = input.loadMassKg * 9.81;
  const equilibriumExtensionM = forceN / input.springConstant;
  const beyondElasticLimit = equilibriumExtensionM > input.elasticLimitM;
  const permanentSetM =
    input.permanentDeformation && beyondElasticLimit
      ? 0.35 * (equilibriumExtensionM - input.elasticLimitM)
      : 0;
  const omega0 = Math.sqrt(
    input.springConstant / Math.max(0.01, input.loadMassKg),
  );
  const decay = Number.isFinite(timeS)
    ? Math.exp(
        (-input.damping * timeS) / (2 * Math.max(0.01, input.loadMassKg)),
      )
    : 0;
  const oscillation = Number.isFinite(timeS)
    ? 1 - decay * Math.cos(omega0 * timeS)
    : 1;
  const displayedExtensionM =
    equilibriumExtensionM * oscillation + permanentSetM;
  return {
    forceN,
    equilibriumExtensionM,
    displayedExtensionM,
    totalLengthM: input.naturalLengthM + displayedExtensionM,
    energyJ: 0.5 * input.springConstant * equilibriumExtensionM ** 2,
    beyondElasticLimit,
    permanentSetM,
  };
}

const H: HookesLawInput = {
  springConstant: 20,
  loadMassKg: 0.2,
  naturalLengthM: 0.12,
  damping: 0.5,
  elasticLimitM: 0.15,
  permanentDeformation: false,
};

export const hookesLawBenchmarks = runBenchmarkCases<HookesLawInput>([
  {
    id: "hooke-force",
    name: "F equals kx",
    input: H,
    expected: 1.962,
    unit: "N",
    tolerance: 1e-12,
    actual: (input) =>
      input.springConstant * springState(input).equilibriumExtensionM,
  },
  {
    id: "hooke-extension",
    name: "Equilibrium extension is mg over k",
    input: H,
    expected: 0.0981,
    unit: "m",
    tolerance: 1e-12,
    actual: (input) => springState(input).equilibriumExtensionM,
  },
  {
    id: "hooke-graph-slope",
    name: "Force-extension slope equals k",
    input: H,
    expected: 20,
    unit: "N/m",
    tolerance: 1e-12,
    actual: (input) =>
      springState(input).forceN / springState(input).equilibriumExtensionM,
  },
  {
    id: "hooke-energy",
    name: "Elastic potential energy",
    input: H,
    expected: 0.0962361,
    unit: "J",
    tolerance: 1e-12,
    actual: (input) => springState(input).energyJ,
  },
  {
    id: "hooke-elastic-limit",
    name: "Elastic limit warning",
    input: { ...H, loadMassKg: 0.4 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) => Number(springState(input).beyondElasticLimit),
  },
]);
