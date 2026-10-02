import { runBenchmarkCases } from "../shared/validation";

export const decayConstant = (halfLife: number) => Math.LN2 / halfLife;
export const expectedRemaining = (
  initial: number,
  time: number,
  halfLife: number,
) => initial * 2 ** (-time / halfLife);
export const expectedActivity = (remaining: number, halfLife: number) =>
  decayConstant(halfLife) * remaining;

export function seededUniforms(count: number, seed: number) {
  let state = seed >>> 0;
  return Array.from({ length: count }, () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  });
}

export function decayTimes(count: number, halfLife: number, seed: number) {
  const lambda = decayConstant(halfLife);
  return seededUniforms(count, seed).map(
    (u) => -Math.log(Math.max(1e-12, 1 - u)) / lambda,
  );
}

export function observedRemaining(
  count: number,
  halfLife: number,
  time: number,
  seed: number,
) {
  return decayTimes(count, halfLife, seed).filter((t) => t > time).length;
}

export const nuclearDecayBenchmarks = runBenchmarkCases([
  {
    id: "decay-one-half",
    name: "expected count halves after one half-life",
    input: { n: 1000, t: 30, half: 30 },
    expected: 500,
    unit: "nuclei",
    tolerance: 1e-12,
    actual: (i) => expectedRemaining(i.n!, i.t!, i.half!),
  },
  {
    id: "decay-two-halves",
    name: "expected count quarters after two half-lives",
    input: { n: 800, t: 10, half: 5 },
    expected: 200,
    unit: "nuclei",
    tolerance: 1e-12,
    actual: (i) => expectedRemaining(i.n!, i.t!, i.half!),
  },
  {
    id: "decay-activity",
    name: "activity equals lambda N",
    input: { n: 400, half: 20 },
    expected: Math.LN2 * 20,
    unit: "events/unit",
    tolerance: 1e-12,
    actual: (i) => expectedActivity(i.n!, i.half!),
  },
  {
    id: "decay-seed-repeat",
    name: "same seed reproduces every lifetime",
    input: { seed: 137 },
    expected: 0,
    unit: "difference",
    tolerance: 0,
    actual: (i) =>
      decayTimes(40, 12, i.seed!).reduce(
        (s, v, k) => s + Math.abs(v - decayTimes(40, 12, i.seed!)[k]),
        0,
      ),
  },
  {
    id: "decay-seed-change",
    name: "different seeds change a stochastic run",
    input: { seed: 137 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (i) =>
      Number(
        decayTimes(30, 12, i.seed!).some(
          (v, k) => v !== decayTimes(30, 12, i.seed! + 1)[k],
        ),
      ),
  },
]);
