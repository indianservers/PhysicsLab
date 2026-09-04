import { runBenchmarkCases } from "../shared/validation";

export type Vec2 = { x: number; y: number };
export type PlaneMirrorInput = {
  mirrorAngleDeg: number;
  object: Vec2;
  observer: Vec2;
  rayAngleDeg: number;
  mirrorHalfHeightCm?: number;
};

const toRad = (value: number) => (value * Math.PI) / 180;
const toDeg = (value: number) => (value * 180) / Math.PI;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });
const sub = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y });
const scale = (a: Vec2, value: number): Vec2 => ({
  x: a.x * value,
  y: a.y * value,
});
const dot = (a: Vec2, b: Vec2) => a.x * b.x + a.y * b.y;
const cross = (a: Vec2, b: Vec2) => a.x * b.y - a.y * b.x;
const length = (a: Vec2) => Math.hypot(a.x, a.y);
const unit = (a: Vec2): Vec2 => {
  const magnitude = length(a) || 1;
  return scale(a, 1 / magnitude);
};

export function mirrorBasis(mirrorAngleDeg: number) {
  const angle = toRad(mirrorAngleDeg);
  return {
    tangent: { x: Math.sin(angle), y: Math.cos(angle) },
    normal: { x: Math.cos(angle), y: -Math.sin(angle) },
  };
}

export function reflectPoint(point: Vec2, mirrorAngleDeg: number) {
  const { normal } = mirrorBasis(mirrorAngleDeg);
  return sub(point, scale(normal, 2 * dot(point, normal)));
}

export function reflectDirection(direction: Vec2, mirrorAngleDeg: number) {
  const { normal } = mirrorBasis(mirrorAngleDeg);
  const incoming = unit(direction);
  return unit(sub(incoming, scale(normal, 2 * dot(incoming, normal))));
}

function lineMirrorIntersection(
  origin: Vec2,
  direction: Vec2,
  mirrorAngleDeg: number,
) {
  const { tangent } = mirrorBasis(mirrorAngleDeg);
  const denominator = cross(direction, tangent);
  if (Math.abs(denominator) < 1e-10)
    return { valid: false, point: { x: 0, y: 0 }, rayT: NaN, mirrorT: NaN };
  const rayT = cross(scale(origin, -1), tangent) / denominator;
  const mirrorT = cross(scale(origin, -1), direction) / denominator;
  return {
    valid: Number.isFinite(rayT) && Number.isFinite(mirrorT),
    point: add(origin, scale(direction, rayT)),
    rayT,
    mirrorT,
  };
}

export function solvePlaneMirror(input: PlaneMirrorInput) {
  const mirrorHalfHeightCm = input.mirrorHalfHeightCm ?? 8;
  const basis = mirrorBasis(input.mirrorAngleDeg);
  const image = reflectPoint(input.object, input.mirrorAngleDeg);
  const objectNormalDistanceCm = Math.abs(dot(input.object, basis.normal));
  const imageNormalDistanceCm = Math.abs(dot(image, basis.normal));
  const objectTangentialCm = dot(input.object, basis.tangent);
  const imageTangentialCm = dot(image, basis.tangent);

  const incidentDirection = unit({
    x: Math.cos(toRad(input.rayAngleDeg)),
    y: Math.sin(toRad(input.rayAngleDeg)),
  });
  const probe = lineMirrorIntersection(
    input.object,
    incidentDirection,
    input.mirrorAngleDeg,
  );
  const reflectedDirection = reflectDirection(
    incidentDirection,
    input.mirrorAngleDeg,
  );
  const incidenceAngleDeg = toDeg(
    Math.acos(clamp(Math.abs(dot(incidentDirection, basis.normal)), -1, 1)),
  );
  const reflectionAngleDeg = toDeg(
    Math.acos(clamp(Math.abs(dot(reflectedDirection, basis.normal)), -1, 1)),
  );
  const probeHitsMirror =
    probe.valid &&
    probe.rayT >= 0 &&
    Math.abs(probe.mirrorT) <= mirrorHalfHeightCm;
  const observerVector = sub(input.observer, probe.point);
  const observerProjectionCm = dot(observerVector, reflectedDirection);
  const observerMissCm = probeHitsMirror
    ? observerProjectionCm >= 0
      ? Math.abs(cross(observerVector, reflectedDirection))
      : length(observerVector)
    : Infinity;

  const selectedObjectPoint = add(input.object, scale(basis.tangent, 1.8));
  const selectedImagePoint = reflectPoint(
    selectedObjectPoint,
    input.mirrorAngleDeg,
  );
  const sightDirection = unit(sub(selectedImagePoint, input.observer));
  const sight = lineMirrorIntersection(
    input.observer,
    sightDirection,
    input.mirrorAngleDeg,
  );
  const observerInFront = dot(input.observer, basis.normal) < 0;
  const selectedPointVisible =
    observerInFront &&
    sight.valid &&
    sight.rayT >= 0 &&
    Math.abs(sight.mirrorT) <= mirrorHalfHeightCm;

  return {
    ...input,
    mirrorHalfHeightCm,
    ...basis,
    image,
    selectedObjectPoint,
    selectedImagePoint,
    incidentDirection,
    reflectedDirection,
    probeHit: probe.point,
    probeMirrorCoordinateCm: probe.mirrorT,
    probeHitsMirror,
    incidenceAngleDeg,
    reflectionAngleDeg,
    angleResidualDeg: incidenceAngleDeg - reflectionAngleDeg,
    observerMissCm,
    sightHit: sight.point,
    sightMirrorCoordinateCm: sight.mirrorT,
    observerInFront,
    selectedPointVisible,
    objectNormalDistanceCm,
    imageNormalDistanceCm,
    distanceResidualCm: objectNormalDistanceCm - imageNormalDistanceCm,
    objectTangentialCm,
    imageTangentialCm,
    lateralNormalProduct:
      dot(input.object, basis.normal) * dot(image, basis.normal),
  };
}

export function alignedObserver(input: PlaneMirrorInput, distanceCm = 13) {
  const solved = solvePlaneMirror(input);
  if (!solved.probeHitsMirror) return input.observer;
  return add(solved.probeHit, scale(solved.reflectedDirection, distanceCm));
}

export const reflectionPlaneMirrorBenchmarks = runBenchmarkCases([
  {
    id: "equal-angles",
    name: "incidence equals reflection for a tilted mirror",
    input: { mirrorAngle: 13, rayAngle: 24 },
    expected: 0,
    unit: "degrees",
    tolerance: 1e-12,
    actual: (value) =>
      solvePlaneMirror({
        mirrorAngleDeg: value.mirrorAngle!,
        rayAngleDeg: value.rayAngle!,
        object: { x: -12, y: -2 },
        observer: { x: -12, y: 5 },
      }).angleResidualDeg,
  },
  {
    id: "equal-distances",
    name: "image and object have equal perpendicular distances",
    input: { mirrorAngle: -17 },
    expected: 0,
    unit: "centimetres",
    tolerance: 1e-12,
    actual: (value) =>
      solvePlaneMirror({
        mirrorAngleDeg: value.mirrorAngle!,
        rayAngleDeg: 10,
        object: { x: -14, y: 4 },
        observer: { x: -10, y: -3 },
      }).distanceResidualCm,
  },
  {
    id: "tangent-preserved",
    name: "reflection preserves coordinate along the mirror",
    input: { mirrorAngle: 19 },
    expected: 0,
    unit: "centimetres",
    tolerance: 1e-12,
    actual: (value) => {
      const solved = solvePlaneMirror({
        mirrorAngleDeg: value.mirrorAngle!,
        rayAngleDeg: 15,
        object: { x: -11, y: 5 },
        observer: { x: -16, y: -1 },
      });
      return solved.objectTangentialCm - solved.imageTangentialCm;
    },
  },
  {
    id: "lateral-inversion",
    name: "reflection reverses the normal coordinate",
    input: { mirrorAngle: 0 },
    expected: -1,
    unit: "sign",
    tolerance: 0,
    actual: (value) => {
      const solved = solvePlaneMirror({
        mirrorAngleDeg: value.mirrorAngle!,
        rayAngleDeg: 12,
        object: { x: -9, y: 1 },
        observer: { x: -12, y: 4 },
      });
      return Math.sign(solved.lateralNormalProduct);
    },
  },
  {
    id: "finite-mirror-visibility",
    name: "selected point visibility uses the finite mirror segment",
    input: { observerY: 5 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (value) =>
      solvePlaneMirror({
        mirrorAngleDeg: 0,
        rayAngleDeg: 15,
        object: { x: -12, y: -2 },
        observer: { x: -13, y: value.observerY! },
      }).selectedPointVisible
        ? 1
        : 0,
  },
]);

export const simulateReflectionPlaneMirror = solvePlaneMirror;
