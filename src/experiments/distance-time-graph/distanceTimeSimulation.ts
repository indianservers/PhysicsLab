import { runBenchmarkCases } from "../shared/validation";

export type DirectionMode = "distance" | "position";
export interface JourneySegment {
  id: number;
  durationS: number;
  speedMps: number;
}
export interface JourneyInterval extends JourneySegment {
  startTimeS: number;
  endTimeS: number;
  startDistanceM: number;
  endDistanceM: number;
}

export function compileJourney(
  segments: JourneySegment[],
  mode: DirectionMode = "distance",
) {
  let time = 0,
    distance = 0;
  const intervals: JourneyInterval[] = segments.map((segment) => {
    const durationS = Math.max(0.5, Math.min(8, segment.durationS));
    const speedMps = Math.max(
      mode === "distance" ? 0 : -5,
      Math.min(5, segment.speedMps),
    );
    const interval = {
      ...segment,
      durationS,
      speedMps,
      startTimeS: time,
      endTimeS: time + durationS,
      startDistanceM: distance,
      endDistanceM: distance + speedMps * durationS,
    };
    time = interval.endTimeS;
    distance = interval.endDistanceM;
    return interval;
  });
  return {
    intervals,
    totalTimeS: time,
    finalDistanceM: distance,
    continuous: intervals.every(
      (s, i) => i === 0 || s.startDistanceM === intervals[i - 1].endDistanceM,
    ),
  };
}
export function sampleJourney(
  segments: JourneySegment[],
  timeS: number,
  mode: DirectionMode = "distance",
) {
  const journey = compileJourney(segments, mode),
    t = Math.max(0, Math.min(journey.totalTimeS, timeS));
  const segment =
    journey.intervals.find((item) => t <= item.endTimeS) ??
    journey.intervals[journey.intervals.length - 1];
  if (!segment)
    return { timeS: 0, distanceM: 0, speedMps: 0, segmentIndex: -1 };
  return {
    timeS: t,
    distanceM:
      segment.startDistanceM + segment.speedMps * (t - segment.startTimeS),
    speedMps: segment.speedMps,
    segmentIndex: journey.intervals.indexOf(segment),
  };
}
export const distanceTimeBenchmarks = runBenchmarkCases([
  {
    id: "slope-speed",
    name: "Graph slope equals speed",
    input: (9 - 3) / (5 - 2),
    expected: 2,
    tolerance: 1e-12,
    unit: "m/s",
    actual: (x: number) => x,
  },
  {
    id: "horizontal-rest",
    name: "Horizontal segment means rest",
    input: sampleJourney([{ id: 1, durationS: 3, speedMps: 0 }], 2).speedMps,
    expected: 0,
    tolerance: 0,
    unit: "m/s",
    actual: (x: number) => x,
  },
  {
    id: "continuous",
    name: "Piecewise journey has no distance jumps",
    input: Number(
      compileJourney([
        { id: 1, durationS: 2, speedMps: 2 },
        { id: 2, durationS: 1, speedMps: 4 },
      ]).continuous,
    ),
    expected: 1,
    tolerance: 0,
    unit: "boolean",
    actual: (x: number) => x,
  },
  {
    id: "return",
    name: "Position mode permits return",
    input: compileJourney(
      [
        { id: 1, durationS: 2, speedMps: 3 },
        { id: 2, durationS: 2, speedMps: -3 },
      ],
      "position",
    ).finalDistanceM,
    expected: 0,
    tolerance: 1e-12,
    unit: "m",
    actual: (x: number) => x,
  },
  {
    id: "distance-no-negative",
    name: "Distance mode rejects negative slope",
    input: compileJourney([{ id: 1, durationS: 2, speedMps: -3 }], "distance")
      .finalDistanceM,
    expected: 0,
    tolerance: 0,
    unit: "m",
    actual: (x: number) => x,
  },
]);
