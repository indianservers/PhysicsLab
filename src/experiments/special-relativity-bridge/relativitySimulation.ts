import { runBenchmarkCases } from "../shared/validation";

export const C = 299792458;
export const gammaFor = (beta: number) => 1 / Math.sqrt(1 - beta ** 2);
export const lightClock = (beta: number, heightM: number) => {
  const gamma = gammaFor(beta);
  const properTimeS = heightM / C;
  const earthTimeS = gamma * properTimeS;
  const horizontalM = beta * C * earthTimeS;
  const lightPathM = Math.hypot(heightM, horizontalM);
  return {
    gamma,
    properTimeS,
    earthTimeS,
    horizontalM,
    lightPathM,
    measuredLightSpeed: lightPathM / earthTimeS,
  };
};
export function lorentzEvent(beta: number, xM: number, timeUs: number) {
  const g = gammaFor(beta),
    t = timeUs * 1e-6,
    v = beta * C;
  return {
    xPrimeM: g * (xM - v * t),
    timePrimeUs: g * (t - (v * xM) / C ** 2) * 1e6,
  };
}
export const intervalM2 = (xM: number, timeUs: number) =>
  (C * timeUs * 1e-6) ** 2 - xM ** 2;

export const relativityBenchmarks = runBenchmarkCases([
  {
    id: "rel-gamma-08",
    name: "gamma at 0.8c",
    input: { beta: 0.8 },
    expected: 5 / 3,
    unit: "unitless",
    tolerance: 1e-12,
    actual: (i) => gammaFor(i.beta!),
  },
  {
    id: "rel-low-speed",
    name: "gamma tends to one at low speed",
    input: { beta: 1e-6 },
    expected: 1.0000000000005,
    unit: "unitless",
    tolerance: 1e-15,
    actual: (i) => gammaFor(i.beta!),
  },
  {
    id: "rel-light-speed",
    name: "moving light clock still measures c",
    input: { beta: 0.8, h: 100 },
    expected: C,
    unit: "m/s",
    tolerance: 1e-6,
    actual: (i) => lightClock(i.beta!, i.h!).measuredLightSpeed,
  },
  {
    id: "rel-length",
    name: "length contracts by gamma",
    input: { beta: 0.8, length: 300 },
    expected: 180,
    unit: "m",
    tolerance: 1e-12,
    actual: (i) => i.length! / gammaFor(i.beta!),
  },
  {
    id: "rel-interval",
    name: "Lorentz transform preserves interval",
    input: { beta: 0.6, x: 400, t: 2 },
    expected: 0,
    unit: "m2",
    tolerance: 1e-7,
    actual: (i) => {
      const e = lorentzEvent(i.beta!, i.x!, i.t!);
      return intervalM2(e.xPrimeM, e.timePrimeUs) - intervalM2(i.x!, i.t!);
    },
  },
]);
