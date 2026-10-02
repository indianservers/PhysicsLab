import { runBenchmarkCases } from "../shared/validation";

export type EnsembleType = "microcanonical" | "canonical" | "grand-canonical";

export interface EnsembleSample {
  energyQuanta: number;
  particleCount: number;
}

export interface EnsembleTheory {
  ensemble: EnsembleType;
  targetParticles: number;
  excitationProbability: number;
  betaEpsilon: number;
  betaChemicalPotential?: number;
  fixedEnergyQuanta?: number;
  meanEnergyQuanta: number;
  energyVariance: number;
  meanParticles: number;
  particleVariance: number;
  relativeEnergyFluctuation: number;
  multiplicityLog: number;
  mostProbableEnergy: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const logFactorial = (n: number) => {
  let total = 0;
  for (let i = 2; i <= n; i += 1) total += Math.log(i);
  return total;
};

export const logBinomialCoefficient = (n: number, k: number) => {
  const integerN = Math.round(n);
  const integerK = Math.round(k);
  if (integerN < 0 || integerK < 0 || integerK > integerN)
    return Number.NEGATIVE_INFINITY;
  return (
    logFactorial(integerN) -
    logFactorial(integerK) -
    logFactorial(integerN - integerK)
  );
};

export const binomialProbability = (
  n: number,
  k: number,
  probability: number,
) => {
  if (probability < 0 || probability > 1)
    throw new RangeError("Probability must lie from zero to one.");
  if (probability === 0) return k === 0 ? 1 : 0;
  if (probability === 1) return k === n ? 1 : 0;
  return Math.exp(
    logBinomialCoefficient(n, k) +
      k * Math.log(probability) +
      (n - k) * Math.log(1 - probability),
  );
};

export const canonicalNormalization = (n: number, probability: number) => {
  let sum = 0;
  for (let energy = 0; energy <= n; energy += 1)
    sum += binomialProbability(n, energy, probability);
  return sum;
};

export function solveEnsembleTheory(
  ensemble: EnsembleType,
  targetParticles: number,
  energyPerParticle: number,
): EnsembleTheory {
  const particles = Math.max(1, Math.round(targetParticles));
  const probability = clamp(energyPerParticle, 0.01, 0.99);
  const betaEpsilon = Math.log((1 - probability) / probability);
  const fixedEnergy = Math.round(particles * probability);
  if (ensemble === "microcanonical") {
    return {
      ensemble,
      targetParticles: particles,
      excitationProbability: fixedEnergy / particles,
      betaEpsilon,
      fixedEnergyQuanta: fixedEnergy,
      meanEnergyQuanta: fixedEnergy,
      energyVariance: 0,
      meanParticles: particles,
      particleVariance: 0,
      relativeEnergyFluctuation: 0,
      multiplicityLog: logBinomialCoefficient(particles, fixedEnergy),
      mostProbableEnergy: fixedEnergy,
    };
  }
  if (ensemble === "canonical") {
    const meanEnergy = particles * probability;
    const variance = particles * probability * (1 - probability);
    return {
      ensemble,
      targetParticles: particles,
      excitationProbability: probability,
      betaEpsilon,
      meanEnergyQuanta: meanEnergy,
      energyVariance: variance,
      meanParticles: particles,
      particleVariance: 0,
      relativeEnergyFluctuation: Math.sqrt(variance) / meanEnergy,
      multiplicityLog: logBinomialCoefficient(
        particles,
        Math.floor((particles + 1) * probability),
      ),
      mostProbableEnergy: Math.min(
        particles,
        Math.floor((particles + 1) * probability),
      ),
    };
  }
  const meanEnergy = particles * probability;
  return {
    ensemble,
    targetParticles: particles,
    excitationProbability: probability,
    betaEpsilon,
    betaChemicalPotential: Math.log(particles * (1 - probability)),
    meanEnergyQuanta: meanEnergy,
    energyVariance: meanEnergy,
    meanParticles: particles,
    particleVariance: particles,
    relativeEnergyFluctuation: 1 / Math.sqrt(meanEnergy),
    multiplicityLog: particles,
    mostProbableEnergy: Math.floor(meanEnergy),
  };
}

const seededRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const sampleBinomial = (
  n: number,
  probability: number,
  random: () => number,
) => {
  let count = 0;
  for (let i = 0; i < n; i += 1) if (random() < probability) count += 1;
  return count;
};

const samplePoisson = (mean: number, random: () => number) => {
  const threshold = Math.exp(-mean);
  let product = 1;
  let count = 0;
  do {
    count += 1;
    product *= Math.max(random(), 1e-12);
  } while (product > threshold && count < mean * 5 + 100);
  return count - 1;
};

export function generateEnsembleSamples(
  ensemble: EnsembleType,
  targetParticles: number,
  energyPerParticle: number,
  sampleCount: number,
  seed = 6901,
): EnsembleSample[] {
  const theory = solveEnsembleTheory(
    ensemble,
    targetParticles,
    energyPerParticle,
  );
  const random = seededRandom(
    seed +
      theory.targetParticles * 17 +
      Math.round(theory.excitationProbability * 1000),
  );
  return Array.from({ length: Math.max(1, Math.round(sampleCount)) }, () => {
    if (ensemble === "microcanonical")
      return {
        energyQuanta: theory.fixedEnergyQuanta ?? 0,
        particleCount: theory.targetParticles,
      };
    const particleCount =
      ensemble === "canonical"
        ? theory.targetParticles
        : samplePoisson(theory.targetParticles, random);
    return {
      particleCount,
      energyQuanta: sampleBinomial(
        particleCount,
        theory.excitationProbability,
        random,
      ),
    };
  });
}

export const summarizeSamples = (samples: EnsembleSample[]) => {
  if (!samples.length) throw new RangeError("At least one sample is required.");
  const meanEnergy =
    samples.reduce((sum, item) => sum + item.energyQuanta, 0) / samples.length;
  const meanParticles =
    samples.reduce((sum, item) => sum + item.particleCount, 0) / samples.length;
  const energyVariance =
    samples.reduce(
      (sum, item) => sum + (item.energyQuanta - meanEnergy) ** 2,
      0,
    ) / samples.length;
  const particleVariance =
    samples.reduce(
      (sum, item) => sum + (item.particleCount - meanParticles) ** 2,
      0,
    ) / samples.length;
  return {
    meanEnergy,
    meanParticles,
    energyVariance,
    particleVariance,
    normalization: samples.length / samples.length,
  };
};

export const statisticalEnsembleBenchmarks = runBenchmarkCases([
  {
    id: "canonical-normalization",
    name: "Canonical energy probabilities normalize",
    input: { n: 48, p: 0.32 },
    expected: 1,
    unit: "probability",
    tolerance: 1e-12,
    actual: ({ n, p }) => canonicalNormalization(Number(n), Number(p)),
  },
  {
    id: "microcanonical-energy",
    name: "Microcanonical samples conserve energy",
    input: { n: 40, p: 0.3 },
    expected: 0,
    unit: "variance",
    tolerance: 0,
    actual: ({ n, p }) =>
      summarizeSamples(
        generateEnsembleSamples("microcanonical", Number(n), Number(p), 200),
      ).energyVariance,
  },
  {
    id: "canonical-particles",
    name: "Canonical samples conserve particle number",
    input: { n: 50, p: 0.4 },
    expected: 0,
    unit: "variance",
    tolerance: 0,
    actual: ({ n, p }) =>
      summarizeSamples(
        generateEnsembleSamples("canonical", Number(n), Number(p), 500),
      ).particleVariance,
  },
  {
    id: "grand-particle-fluctuation",
    name: "Grand-canonical particle number fluctuates",
    input: { n: 35, p: 0.3 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: ({ n, p }) =>
      Number(
        summarizeSamples(
          generateEnsembleSamples("grand-canonical", Number(n), Number(p), 500),
        ).particleVariance > 0,
      ),
  },
  {
    id: "canonical-convergence",
    name: "Canonical sample mean converges",
    input: { n: 60, p: 0.35 },
    expected: 21,
    unit: "energy quanta",
    tolerance: 0.15,
    actual: ({ n, p }) =>
      summarizeSamples(
        generateEnsembleSamples("canonical", Number(n), Number(p), 20000),
      ).meanEnergy,
  },
  {
    id: "relative-fluctuation",
    name: "Relative fluctuations shrink as inverse square root N",
    input: { small: 25, large: 100, p: 0.4 },
    expected: 0.5,
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ small, large, p }) =>
      solveEnsembleTheory("canonical", Number(large), Number(p))
        .relativeEnergyFluctuation /
      solveEnsembleTheory("canonical", Number(small), Number(p))
        .relativeEnergyFluctuation,
  },
]);

export const simulateStatisticalEnsemble = solveEnsembleTheory;
