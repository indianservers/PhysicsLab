import { runBenchmarkCases } from "../shared/validation";

const nearlyInteger = (value: number) =>
  Math.abs(value - Math.round(value)) < 1e-9;

export function imageCountForTwoMirrors({
  angleDeg,
  objectCentered,
}: {
  angleDeg: number;
  objectCentered: boolean;
}) {
  const angle = Math.min(180, Math.max(1, angleDeg));
  const quotient = 360 / angle;
  if (!nearlyInteger(quotient)) return Math.floor(quotient);
  const sectors = Math.round(quotient);
  return sectors % 2 === 0 || objectCentered ? sectors - 1 : sectors;
}

const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;

export function reflectedImageAngles({
  angleDeg,
  positionPercent,
  objectCentered,
}: {
  angleDeg: number;
  positionPercent: number;
  objectCentered: boolean;
}) {
  const target = imageCountForTwoMirrors({ angleDeg, objectCentered });
  const objectAngle = objectCentered
    ? angleDeg / 2
    : (angleDeg * positionPercent) / 100;
  const original = normalizeAngle(objectAngle);
  const seen = new Set([original.toFixed(6)]);
  const images: Array<{ angleDeg: number; generation: number }> = [];
  for (let k = 0; k < 40 && images.length < target; k += 1) {
    for (const candidate of [
      objectAngle + 2 * k * angleDeg,
      -objectAngle + 2 * k * angleDeg,
    ]) {
      const normalized = normalizeAngle(candidate);
      const key = normalized.toFixed(6);
      if (seen.has(key)) continue;
      seen.add(key);
      images.push({ angleDeg: normalized, generation: Math.max(1, k + 1) });
      if (images.length >= target) break;
    }
  }
  return images;
}

export function solveMultipleReflection({
  angleDeg,
  mirrorCount,
  objectCentered,
  positionPercent,
}: {
  angleDeg: number;
  mirrorCount: 2 | 3;
  objectCentered: boolean;
  positionPercent: number;
}) {
  const quotient = 360 / angleDeg;
  const imageCount = imageCountForTwoMirrors({ angleDeg, objectCentered });
  const symmetryOrder = nearlyInteger(quotient)
    ? Math.round(quotient)
    : Math.floor(quotient);
  const images = reflectedImageAngles({
    angleDeg,
    positionPercent,
    objectCentered,
  });
  return {
    quotient,
    exactDivision: nearlyInteger(quotient),
    imageCount,
    symmetryOrder,
    images,
    displayedMotifs: Math.min(
      36,
      (imageCount + 1) * (mirrorCount === 3 ? 2 : 1),
    ),
    rule:
      nearlyInteger(quotient) &&
      (Math.round(quotient) % 2 === 0 || objectCentered)
        ? "N = 360°/θ − 1"
        : "N = floor(360°/θ)",
  };
}

export const multipleReflectionBenchmarks = runBenchmarkCases([
  {
    id: "right-angle",
    name: "ninety degrees gives three images",
    input: { angle: 90 },
    expected: 3,
    unit: "images",
    tolerance: 0,
    actual: (x) =>
      imageCountForTwoMirrors({ angleDeg: x.angle!, objectCentered: true }),
  },
  {
    id: "sixty",
    name: "sixty degrees gives five images",
    input: { angle: 60 },
    expected: 5,
    unit: "images",
    tolerance: 0,
    actual: (x) =>
      imageCountForTwoMirrors({ angleDeg: x.angle!, objectCentered: true }),
  },
  {
    id: "mission-seven",
    name: "forty five degrees gives seven images",
    input: { angle: 45 },
    expected: 7,
    unit: "images",
    tolerance: 0,
    actual: (x) =>
      imageCountForTwoMirrors({ angleDeg: x.angle!, objectCentered: true }),
  },
  {
    id: "odd-boundary",
    name: "odd exact quotient depends on centered object",
    input: { angle: 40 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) =>
      imageCountForTwoMirrors({ angleDeg: x.angle!, objectCentered: true }) ===
        8 &&
      imageCountForTwoMirrors({ angleDeg: x.angle!, objectCentered: false }) ===
        9
        ? 1
        : 0,
  },
  {
    id: "non-integer",
    name: "non integer quotient uses floor",
    input: { angle: 50 },
    expected: 7,
    unit: "images",
    tolerance: 0,
    actual: (x) =>
      imageCountForTwoMirrors({ angleDeg: x.angle!, objectCentered: false }),
  },
]);
