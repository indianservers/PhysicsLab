export function mirrorReflectionAngle(incidenceDeg: number) {
  return incidenceDeg;
}

export function planeMirrorImageDistance(objectDistance: number) {
  return objectDistance;
}

export function thinLensImageDistance(focalLength: number, objectDistance: number) {
  const denominator = objectDistance - focalLength;
  if (Math.abs(denominator) < 1e-9) return Number.POSITIVE_INFINITY;
  return (focalLength * objectDistance) / denominator;
}

export function thinLensMagnification(imageDistance: number, objectDistance: number) {
  return -imageDistance / Math.max(0.000001, objectDistance);
}

export function prismDeviation(prismAngleDeg: number, refractiveIndex: number) {
  return Math.max(0, (refractiveIndex - 1) * prismAngleDeg);
}

export function criticalAngleDeg(n1: number, n2: number) {
  if (n1 <= n2) return Number.NaN;
  return (Math.asin(n2 / n1) * 180) / Math.PI;
}

export function lensPower(focalLengthMeters: number) {
  return 1 / Math.max(0.000001, focalLengthMeters);
}
