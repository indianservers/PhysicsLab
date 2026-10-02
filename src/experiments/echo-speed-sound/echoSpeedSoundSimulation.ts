import { runBenchmarkCases } from "../shared/validation";

export type PulseShape = "short" | "click" | "tone-burst";
export interface EchoInput {
  distanceM: number;
  temperatureC: number;
  frequencyHz: number;
  amplitudePercent: number;
  pulseShape: PulseShape;
}

export function speedOfSoundMps(temperatureC: number) {
  if (!Number.isFinite(temperatureC) || temperatureC <= -273.15)
    throw new RangeError("Temperature must be above absolute zero.");
  return 331.3 * Math.sqrt((temperatureC + 273.15) / 273.15);
}

export function solveEcho(input: EchoInput) {
  if (!Number.isFinite(input.distanceM) || input.distanceM <= 0)
    throw new RangeError("Wall distance must be positive.");
  const soundSpeedMps = speedOfSoundMps(input.temperatureC);
  const roundTripDistanceM = 2 * input.distanceM;
  const echoDelayS = roundTripDistanceM / soundSpeedMps;
  const distinctThresholdS = 0.1;
  return {
    soundSpeedMps,
    roundTripDistanceM,
    echoDelayS,
    echoDelayMs: echoDelayS * 1000,
    minimumDistinctDistanceM: (soundSpeedMps * distinctThresholdS) / 2,
    distinctEcho: echoDelayS >= distinctThresholdS,
    inferredDistanceM: (soundSpeedMps * echoDelayS) / 2,
  };
}

export function inferSoundSpeed(distanceM: number, echoDelayS: number) {
  if (distanceM <= 0 || echoDelayS <= 0)
    throw new RangeError("Distance and echo delay must be positive.");
  return (2 * distanceM) / echoDelayS;
}

export const echoSpeedSoundBenchmarks = runBenchmarkCases([
  {
    id: "speed-zero-c",
    name: "Dry-air speed at zero Celsius",
    input: { t: 0 },
    expected: 331.3,
    unit: "m/s",
    tolerance: 1e-10,
    actual: ({ t }) => speedOfSoundMps(Number(t)),
  },
  {
    id: "round-trip",
    name: "Echo delay uses round-trip distance",
    input: { d: 34.3, t: 20 },
    expected: 0.2,
    unit: "s",
    tolerance: 0.001,
    actual: ({ d, t }) =>
      solveEcho({
        distanceM: Number(d),
        temperatureC: Number(t),
        frequencyHz: 2000,
        amplitudePercent: 80,
        pulseShape: "short",
      }).echoDelayS,
  },
  {
    id: "inverse",
    name: "Measured delay recovers sound speed",
    input: { d: 30, dt: 0.17483 },
    expected: 343.19,
    unit: "m/s",
    tolerance: 0.05,
    actual: ({ d, dt }) => inferSoundSpeed(Number(d), Number(dt)),
  },
  {
    id: "temperature",
    name: "Sound speed rises with temperature",
    input: { cold: 0, warm: 30 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: ({ cold, warm }) =>
      Number(speedOfSoundMps(Number(warm)) > speedOfSoundMps(Number(cold))),
  },
  {
    id: "distinct",
    name: "Distinct echo threshold is one tenth second",
    input: { t: 20 },
    expected: 0.1,
    unit: "s",
    tolerance: 1e-12,
    actual: ({ t }) => {
      const v = speedOfSoundMps(Number(t)),
        d = (v * 0.1) / 2;
      return solveEcho({
        distanceM: d,
        temperatureC: Number(t),
        frequencyHz: 1000,
        amplitudePercent: 50,
        pulseShape: "click",
      }).echoDelayS;
    },
  },
]);
