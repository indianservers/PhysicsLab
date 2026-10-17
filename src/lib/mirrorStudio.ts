export type MirrorInput = { radius: number; object: number; type: 'concave' | 'convex' };
export const MIRROR_DEFAULTS: MirrorInput = { radius: 40, object: 30, type: 'concave' };
export const MIRROR_OBJECT_HEIGHT = .02;
export const MIRROR_SCREEN_HEIGHT = .15;
export const MIRROR_C = 299792458;
export type MirrorPoint = { x: number; y: number };
export type MirrorRayId = 'parallel' | 'focal' | 'center';
export type MirrorSegment = { start: MirrorPoint; end: MirrorPoint; length: number };
export type MirrorRay = { id: MirrorRayId; hit: MirrorPoint | null; slopeIn: number | null; slopeOut: number | null; available: boolean; reason: string | null; segments: MirrorSegment[]; extension: MirrorSegment | null };
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
export function mirrorSettings(v: MirrorInput): MirrorInput { return { radius: clamp(Number.isFinite(Number(v.radius)) ? Number(v.radius) : 40, 10, 100), object: clamp(Number.isFinite(Number(v.object)) ? Number(v.object) : 30, 5, 80), type: v.type === 'convex' ? 'convex' : 'concave' }; }
const segment = (start: MirrorPoint, end: MirrorPoint): MirrorSegment => ({ start, end, length: Math.hypot(end.x - start.x, end.y - start.y) });
function clipped(start: MirrorPoint, slope: number, x: number) { const y = start.y + slope * (x - start.x); if (Math.abs(y) <= .24 || Math.abs(slope) < 1e-15) return { x, y }; const endX = start.x + ((y > 0 ? .24 : -.24) - start.y) / slope; return { x: endX, y: start.y + slope * (endX - start.x) }; }
/** Gaussian paraxial mirror model; world x points toward the mirror, vertex x=0. Lengths are SI. */
export function mirrorSolution(value: MirrorInput) {
  const input = mirrorSettings(value), radiusMeters = input.radius / 100 * (input.type === 'concave' ? 1 : -1), focalMeters = radiusMeters / 2, objectMeters = input.object / 100;
  const atInfinity = Math.abs(objectMeters - focalMeters) <= 1e-13;
  const imageDistance = atInfinity ? null : focalMeters * objectMeters / (objectMeters - focalMeters);
  const magnification = imageDistance === null ? null : -imageDistance / objectMeters;
  const imageHeight = magnification === null ? null : MIRROR_OBJECT_HEIGHT * magnification;
  const kind: 'real' | 'virtual' | 'infinity' = imageDistance === null ? 'infinity' : imageDistance > 0 ? 'real' : 'virtual';
  const aperture = Math.min(.085, Math.abs(radiusMeters) * .22), objectTip = { x: -objectMeters, y: MIRROR_OBJECT_HEIGHT };
  const rays: MirrorRay[] = (['parallel', 'focal', 'center'] as const).map(id => {
    const denominator = id === 'focal' ? focalMeters - objectMeters : radiusMeters - objectMeters;
    if (id !== 'parallel' && Math.abs(denominator) <= 1e-13) return { id, hit: null, slopeIn: null, slopeOut: null, available: false, reason: `The ${id === 'focal' ? 'focal point' : 'center of curvature'} construction is parallel to the vertex plane here.`, segments: [], extension: null };
    const hitY = id === 'parallel' ? MIRROR_OBJECT_HEIGHT : MIRROR_OBJECT_HEIGHT * (id === 'focal' ? focalMeters : radiusMeters) / denominator;
    const hit = { x: 0, y: hitY }, slopeIn = (hitY - MIRROR_OBJECT_HEIGHT) / objectMeters, slopeOut = hitY / focalMeters - slopeIn;
    if (Math.abs(hitY) > aperture + 1e-12) return { id, hit, slopeIn, slopeOut, available: false, reason: 'This principal ray misses the finite mirror aperture.', segments: [], extension: null };
    const endX = kind === 'real' ? Math.max(-1.25, -imageDistance!) : -1.25;
    const end = clipped(hit, slopeOut, endX);
    const extension = kind === 'virtual' ? segment(hit, clipped(hit, slopeOut, Math.min(.8, -imageDistance!))) : null;
    return { id, hit, slopeIn, slopeOut, available: true, reason: null, segments: [segment(objectTip, hit), segment(hit, end)], extension };
  });
  const imageOnBench = imageDistance !== null && Math.abs(imageDistance) <= 1.2 && Math.abs(imageHeight!) <= (kind === 'real' ? MIRROR_SCREEN_HEIGHT / 2 : .16);
  return { input, radiusMeters, focalMeters, objectMeters, imageDistance, imageHeight, magnification, aperture, objectTip, rays, kind, atInfinity, real: kind === 'real', imageOnBench, screen: kind === 'real' && imageOnBench ? { x: -imageDistance!, y: imageHeight! } : null, f: focalMeters * 100, di: imageDistance === null ? null : imageDistance * 100, m: magnification, hi: imageHeight === null ? null : imageHeight * 100 };
}
/** Representative geometric packets travel on real incoming/reflected segments, never on virtual extensions. */
export function mirrorPackets(s: ReturnType<typeof mirrorSolution>, time: number, spacing = 1e-9) {
  if (!Number.isFinite(time) || !Number.isFinite(spacing) || spacing <= 0) return [];
  const phase = ((time % spacing) + spacing) % spacing;
  const points: { point: MirrorPoint; ray: MirrorRayId }[] = [];
  for (const ray of s.rays.filter(r => r.available)) {
    const total = ray.segments.reduce((sum, g) => sum + g.length, 0);
    for (let age = phase, count = 0; age * MIRROR_C < total && count < 128; age += spacing, count++) {
      let distance = age * MIRROR_C;
      for (const g of ray.segments) { if (distance <= g.length) { const t = g.length > 0 ? distance / g.length : 0; points.push({ ray: ray.id, point: { x: g.start.x + t * (g.end.x - g.start.x), y: g.start.y + t * (g.end.y - g.start.y) } }); break; } distance -= g.length; }
    }
  }
  return points;
}
