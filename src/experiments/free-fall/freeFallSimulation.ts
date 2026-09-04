import { runBenchmarkCases } from "../shared/validation";
export interface FreeFallInput {
  heightM: number;
  initialVelocityMps: number;
  gravity: number;
  airResistance: boolean;
}
export function idealImpactTime(input: FreeFallInput) {
  return (
    (input.initialVelocityMps +
      Math.sqrt(
        input.initialVelocityMps ** 2 + 2 * input.gravity * input.heightM,
      )) /
    input.gravity
  );
}
export function freeFallState(input: FreeFallInput, timeS: number) {
  const t = Math.max(0, timeS),
    g = Math.max(0.1, input.gravity);
  if (!input.airResistance) {
    const rawY = input.heightM + input.initialVelocityMps * t - 0.5 * g * t * t,
      v = input.initialVelocityMps - g * t;
    return {
      timeS: t,
      heightM: Math.max(0, rawY),
      velocityMps: rawY <= 0 ? 0 : v,
      accelerationMps2: rawY <= 0 ? 0 : -g,
      impacted: rawY <= 0,
    };
  }
  let y = input.heightM,
    v = input.initialVelocityMps,
    a = -g,
    elapsed = 0;
  const dt = 0.002,
    k = 0.035;
  while (elapsed < t && y > 0) {
    const step = Math.min(dt, t - elapsed);
    a = -g - k * v * Math.abs(v);
    v += a * step;
    y += v * step;
    elapsed += step;
  }
  return {
    timeS: t,
    heightM: Math.max(0, y),
    velocityMps: y <= 0 ? 0 : v,
    accelerationMps2: y <= 0 ? 0 : a,
    impacted: y <= 0,
  };
}
export function impactTime(input: FreeFallInput) {
  if (!input.airResistance) return idealImpactTime(input);
  let t = 0;
  while (t < 30 && !freeFallState(input, t).impacted) t += 0.01;
  return t;
}
export const freeFallBenchmarks = runBenchmarkCases([
  {
    id: "fall-position",
    name: "Ideal vertical position",
    input: freeFallState(
      {
        heightM: 100,
        initialVelocityMps: 0,
        gravity: 10,
        airResistance: false,
      },
      2,
    ).heightM,
    expected: 80,
    tolerance: 1e-12,
    unit: "m",
    actual: (x: number) => x,
  },
  {
    id: "fall-velocity",
    name: "Ideal vertical velocity",
    input: freeFallState(
      {
        heightM: 100,
        initialVelocityMps: 5,
        gravity: 10,
        airResistance: false,
      },
      2,
    ).velocityMps,
    expected: -15,
    tolerance: 1e-12,
    unit: "m/s",
    actual: (x: number) => x,
  },
  {
    id: "fall-acceleration",
    name: "Acceleration is gravity independent of mass",
    input: freeFallState(
      {
        heightM: 100,
        initialVelocityMps: 0,
        gravity: 9.81,
        airResistance: false,
      },
      1,
    ).accelerationMps2,
    expected: -9.81,
    tolerance: 1e-12,
    unit: "m/s²",
    actual: (x: number) => x,
  },
  {
    id: "fall-impact",
    name: "Impact time from quadratic root",
    input: idealImpactTime({
      heightM: 20,
      initialVelocityMps: 0,
      gravity: 10,
      airResistance: false,
    }),
    expected: 2,
    tolerance: 1e-12,
    unit: "s",
    actual: (x: number) => x,
  },
  {
    id: "fall-drag",
    name: "Air resistance delays impact",
    input: Number(
      impactTime({
        heightM: 20,
        initialVelocityMps: 0,
        gravity: 10,
        airResistance: true,
      }) > 2,
    ),
    expected: 1,
    tolerance: 0,
    unit: "boolean",
    actual: (x: number) => x,
  },
]);
