export type RefractionInput = { n1: number; n2: number; angle: number };
export type OpticalVector = { x: number; y: number; z: number };
export const LIGHT_SPEED = 299792458;
export const REFRACTION_DEFAULTS: RefractionInput = { n1: 1.333, n2: 1.49, angle: 40 };
const RAD = Math.PI / 180;
const EPS = 1e-9;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const finite = (v: number, fallback: number) => Number.isFinite(v) ? v : fallback;
export function refractionSettings(v: RefractionInput): RefractionInput {
  return { n1: clamp(finite(Number(v.n1), 1.333), 1, 2.5), n2: clamp(finite(Number(v.n2), 1.49), 1, 2.5), angle: clamp(finite(Number(v.angle), 40), 0, 90) };
}
export const opticalAdd = (a: OpticalVector, b: OpticalVector): OpticalVector => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
export const opticalScale = (a: OpticalVector, s: number): OpticalVector => ({ x: a.x * s, y: a.y * s, z: a.z * s });
export const opticalDot = (a: OpticalVector, b: OpticalVector) => a.x * b.x + a.y * b.y + a.z * b.z;
const sub = (a: OpticalVector, b: OpticalVector) => opticalAdd(a, opticalScale(b, -1));
const cross = (a: OpticalVector, b: OpticalVector): OpticalVector => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x });
const norm = (a: OpticalVector) => {
  const length = Math.hypot(a.x, a.y, a.z);
  if (!Number.isFinite(length) || length < 1e-15) throw new Error('An optical direction must be finite and nonzero.');
  return opticalScale(a, 1 / length);
};
/** Normal points against the incoming unit direction. Lossless, isotropic, nonmagnetic media. */
export function refractInterface(direction: OpticalVector, opposingNormal: OpticalVector, nIn: number, nOut: number) {
  if (!(nIn > 0 && nOut > 0 && Number.isFinite(nIn + nOut))) throw new Error('Indices must be finite and positive.');
  const d = norm(direction), normal = norm(opposingNormal), cosI = clamp(-opticalDot(d, normal), 0, 1);
  if (opticalDot(d, normal) > 1e-10) throw new Error('Interface normal must oppose the incident ray.');
  const tangent = opticalAdd(d, opticalScale(normal, cosI));
  const sinI = Math.hypot(tangent.x, tangent.y, tangent.z);
  const incident = Math.atan2(sinI, cosI) / RAD;
  const reflected = norm(opticalAdd(d, opticalScale(normal, 2 * cosI)));
  if (nIn === nOut) return { incident, refracted: incident, transmitted: d, reflected, tir: false, critical: false, reflectance: 0, transmittance: 1 };
  const eta = nIn / nOut, sinT = eta * sinI, k = 1 - sinT * sinT;
  const tir = k < -1e-13, critical = !tir && Math.abs(k) <= 1e-13;
  if (tir) return { incident, refracted: null, transmitted: null, reflected, tir: true, critical: false, reflectance: 1, transmittance: 0 };
  const cosT = critical ? 0 : Math.sqrt(Math.max(0, k));
  const transmitted = norm(opticalAdd(opticalScale(tangent, eta), opticalScale(normal, -cosT)));
  const rs = (nIn * cosI - nOut * cosT) / (nIn * cosI + nOut * cosT);
  const rp = (nIn * cosT - nOut * cosI) / (nIn * cosT + nOut * cosI);
  const reflectance = clamp((rs * rs + rp * rp) / 2, 0, 1);
  return { incident, refracted: Math.atan2(Math.min(1, sinT), cosT) / RAD, transmitted, reflected, tir: false, critical, reflectance, transmittance: 1 - reflectance };
}
export type OpticalFace = { normal: OpticalVector; limit: number };
export type OpticalSolid = { id: 'A' | 'B'; vertices: OpticalVector[]; faces: OpticalFace[] };
function solid(id: 'A' | 'B', vertices: OpticalVector[], indices: number[][]): OpticalSolid {
  const center = opticalScale(vertices.reduce(opticalAdd, { x: 0, y: 0, z: 0 }), 1 / vertices.length);
  return { id, vertices, faces: indices.map(face => {
    const a = vertices[face[0]];
    let normal = norm(cross(sub(vertices[face[1]], a), sub(vertices[face[2]], a)));
    if (opticalDot(normal, sub(center, a)) > 0) normal = opticalScale(normal, -1);
    return { normal, limit: opticalDot(normal, a) };
  }) };
}
const boxVertices = (lo: OpticalVector, hi: OpticalVector) => [
  { x: lo.x, y: lo.y, z: lo.z }, { x: hi.x, y: lo.y, z: lo.z }, { x: hi.x, y: hi.y, z: lo.z }, { x: lo.x, y: hi.y, z: lo.z },
  { x: lo.x, y: lo.y, z: hi.z }, { x: hi.x, y: lo.y, z: hi.z }, { x: hi.x, y: hi.y, z: hi.z }, { x: lo.x, y: hi.y, z: hi.z },
];
const yaw = 10.8 * RAD;
const front = [[.257, .061], [.4225, .061], [.3215, .1832]].map(([x, y]) => ({ x, y, z: .255 - Math.tan(yaw) * (x - .33) }));
/** Dimensions in metres. Parallel prism faces yawed 10.8 degrees; air gap is explicit. */
export const REFRACTION_SOLIDS: OpticalSolid[] = [
  solid('A', boxVertices({ x: .07, y: .0375, z: 0 }, { x: .273, y: .1195, z: .17 }), [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]]),
  solid('B', [...front, ...front.map(p => opticalAdd(p, { x: .025 * Math.sin(yaw), y: 0, z: .025 * Math.cos(yaw) }))], [[0, 1, 2], [3, 4, 5], [0, 1, 4, 3], [1, 2, 5, 4], [2, 0, 3, 5]]),
];
function intersect(origin: OpticalVector, direction: OpticalVector, object: OpticalSolid, entering: boolean) {
  let nearest: { distance: number; point: OpticalVector; normal: OpticalVector } | null = null;
  for (const face of object.faces) {
    const denominator = opticalDot(face.normal, direction);
    if (entering ? denominator >= -1e-12 : denominator <= 1e-12) continue;
    const distance = (face.limit - opticalDot(face.normal, origin)) / denominator;
    if (distance <= EPS || (nearest && distance >= nearest.distance)) continue;
    const point = opticalAdd(origin, opticalScale(direction, distance));
    if (object.faces.some(f => opticalDot(f.normal, point) > f.limit + 1e-10)) continue;
    nearest = { distance, point, normal: face.normal };
  }
  return nearest;
}
export type OpticalSegment = { start: OpticalVector; end: OpticalVector; direction: OpticalVector; length: number; n: number; speed: number; duration: number; power: number; medium: 'air' | 'A' | 'B' };
export type OpticalEvent = ReturnType<typeof refractInterface> & { point: OpticalVector; normal: OpticalVector; from: 'air' | 'A' | 'B'; to: 'air' | 'A' | 'B' };
export function traceRefraction(value: RefractionInput) {
  const input = refractionSettings(value);
  let direction = { x: Math.sin(input.angle * RAD), y: 0, z: input.angle === 90 ? 0 : Math.cos(input.angle * RAD) };
  let origin = opticalAdd({ x: .17, y: .085, z: 0 }, opticalScale(direction, -.245));
  if (input.angle === 90) origin.z = -2e-6;
  const source = { ...origin };
  let medium: 'air' | 'A' | 'B' = 'air', power = 1;
  const segments: OpticalSegment[] = [], events: OpticalEvent[] = [];
  let terminal: 'screen' | 'escaped' | 'limit' = 'limit';
  const addSegment = (end: OpticalVector) => {
    const length = Math.hypot(end.x - origin.x, end.y - origin.y, end.z - origin.z);
    const n = medium === 'A' ? input.n1 : medium === 'B' ? input.n2 : 1;
    segments.push({ start: origin, end, direction, length, n, speed: LIGHT_SPEED / n, duration: length * n / LIGHT_SPEED, power, medium });
  };
  for (let bounce = 0; bounce < 16; bounce++) {
    let next: { distance: number; point: OpticalVector; normal: OpticalVector; object: OpticalSolid } | null = null;
    for (const object of REFRACTION_SOLIDS) {
      if (medium !== 'air' && medium !== object.id) continue;
      const hit = intersect(origin, direction, object, medium === 'air');
      if (hit && (!next || hit.distance < next.distance)) next = { ...hit, object };
    }
    const screenDistance = direction.z > 1e-12 ? (.5156 - origin.z) / direction.z : Infinity;
    const screenPoint = opticalAdd(origin, opticalScale(direction, Number.isFinite(screenDistance) ? screenDistance : 0));
    if (screenDistance > EPS && screenPoint.x >= .5 && screenPoint.x <= .59 && screenPoint.y >= .0465 && screenPoint.y <= .18 && (!next || screenDistance < next.distance)) {
      addSegment(screenPoint); terminal = 'screen'; break;
    }
    if (!next) {
      // Finite visualization envelope, not a reflecting physical surface.
      const distances = [direction.x > 1e-12 ? (.70 - origin.x) / direction.x : direction.x < -1e-12 ? (-.15 - origin.x) / direction.x : Infinity, direction.z > 1e-12 ? (.70 - origin.z) / direction.z : direction.z < -1e-12 ? (-.30 - origin.z) / direction.z : Infinity].filter(t => t > EPS);
      addSegment(opticalAdd(origin, opticalScale(direction, Math.min(...distances, 1)))); terminal = 'escaped'; break;
    }
    addSegment(next.point);
    const to: 'air' | 'A' | 'B' = medium === 'air' ? next.object.id : 'air';
    const normal = medium === 'air' ? next.normal : opticalScale(next.normal, -1);
    const nIn = medium === 'A' ? input.n1 : medium === 'B' ? input.n2 : 1;
    const nOut = to === 'A' ? input.n1 : to === 'B' ? input.n2 : 1;
    const result = refractInterface(direction, normal, nIn, nOut);
    events.push({ ...result, point: next.point, normal, from: medium, to });
    origin = next.point;
    if (result.tir || result.critical) direction = result.reflected;
    else { direction = result.transmitted!; medium = to; power *= result.transmittance; }
  }
  return { input, source, segments, events, terminal, duration: segments.reduce((sum, s) => sum + s.duration, 0) };
}
/** Representative steady pulse train: physical seconds, with transit time integrated through every medium. */
export function refractionPackets(trace: ReturnType<typeof traceRefraction>, time: number, spacing = 1e-9) {
  if (!(spacing > 0 && Number.isFinite(spacing) && Number.isFinite(time))) return [];
  const positions: { point: OpticalVector; power: number; medium: OpticalSegment['medium'] }[] = [];
  const phase = ((time % spacing) + spacing) % spacing;
  for (let age = phase, count = 0; age < trace.duration && count < 512; age += spacing, count++) {
    let remaining = age;
    for (const segment of trace.segments) {
      if (remaining <= segment.duration) {
        positions.push({ point: opticalAdd(segment.start, opticalScale(segment.direction, remaining * segment.speed)), power: segment.power, medium: segment.medium }); break;
      }
      remaining -= segment.duration;
    }
  }
  return positions;
}
export function refractionSolution(v: RefractionInput) {
  const input = refractionSettings(v), trace = traceRefraction(input);
  const direct = refractInterface({ x: Math.sin(input.angle * RAD), y: 0, z: Math.cos(input.angle * RAD) }, { x: 0, y: 0, z: -1 }, input.n1, input.n2);
  const entry = (id: 'A' | 'B') => trace.events.find(e => e.from === 'air' && e.to === id && !e.tir && !e.critical)?.refracted ?? null;
  return { refracted: direct.refracted, tir: direct.tir, critical: direct.critical, speed1: LIGHT_SPEED / input.n1, speed2: LIGHT_SPEED / input.n2, angleA: entry('A'), angleB: entry('B'), criticalAngle: input.n1 > input.n2 ? Math.asin(input.n2 / input.n1) / RAD : null, trace };
}
