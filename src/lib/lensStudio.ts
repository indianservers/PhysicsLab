export type LensType = 'convex' | 'concave' | 'plano';
/** Instrument controls are centimetres; all ray geometry and propagation use metres/seconds. */
export type LensInput = { focal: number; object: number; type: LensType };
export const LENS_DEFAULTS: LensInput = { focal: 10, object: 20, type: 'convex' };
export const LENS_OBJECT_HEIGHT = .02;
export const LENS_APERTURE = .065;
export const LENS_SCREEN_HEIGHT = .12;
export const LENS_C = 299792458;
export type LensPoint = { x: number; y: number };
export type LensRayId = 'parallel' | 'center' | 'focal';
export type LensSegment = { start: LensPoint; end: LensPoint; length: number };
export type LensRay = { id: LensRayId; hit: LensPoint | null; slopeIn: number | null; slopeOut: number | null; available: boolean; reason: string | null; segments: LensSegment[]; extension: LensSegment | null };
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
export function lensSettings(v: LensInput): LensInput {
  return { focal: clamp(Number.isFinite(Number(v.focal)) ? Number(v.focal) : 10, 5, 20), object: clamp(Number.isFinite(Number(v.object)) ? Number(v.object) : 20, 5, 50), type: v.type === 'concave' || v.type === 'plano' ? v.type : 'convex' };
}
const segment = (start: LensPoint, end: LensPoint): LensSegment => ({ start, end, length: Math.hypot(end.x - start.x, end.y - start.y) });
/** Clip a forward line at the finite plotting envelope, without moving the calculated image. */
function endpoint(start: LensPoint, slope: number, endX: number, limitY = .22) {
  let x = endX;
  const y = start.y + slope * (x - start.x);
  if (Math.abs(y) > limitY && Math.abs(slope) > 1e-15) {
    const candidate = start.x + ((y > 0 ? limitY : -limitY) - start.y) / slope;
    if ((endX - start.x) * (candidate - start.x) >= 0 && Math.abs(candidate - start.x) < Math.abs(x - start.x)) x = candidate;
  }
  return { x, y: start.y + slope * (x - start.x) };
}
export function lensSolution(value: LensInput) {
  const input = lensSettings(value), focalMeters = input.focal / 100 * (input.type === 'concave' ? -1 : 1), objectMeters = input.object / 100;
  // Difference form avoids cancellation in 1/f - 1/do and treats exact instrument equality explicitly.
  const denominator = objectMeters - focalMeters;
  const atInfinity = Math.abs(denominator) <= 1e-13;
  const imageDistance = atInfinity ? null : focalMeters * objectMeters / denominator;
  const magnification = imageDistance === null ? null : -imageDistance / objectMeters;
  const imageHeight = magnification === null ? null : LENS_OBJECT_HEIGHT * magnification;
  const kind: 'real' | 'virtual' | 'infinity' = imageDistance === null ? 'infinity' : imageDistance > 0 ? 'real' : 'virtual';
  const objectTip = { x: -objectMeters, y: LENS_OBJECT_HEIGHT };
  const rays: LensRay[] = (['parallel', 'center', 'focal'] as const).map(id => {
    if (id === 'focal' && atInfinity) return { id, hit: null, slopeIn: null, slopeOut: null, available: false, reason: 'The focal principal ray is parallel to the lens plane at this object position.', segments: [], extension: null };
    const hitY = id === 'parallel' ? LENS_OBJECT_HEIGHT : id === 'center' ? 0 : LENS_OBJECT_HEIGHT * focalMeters / (focalMeters - objectMeters);
    const hit = { x: 0, y: hitY }, slopeIn = (hitY - LENS_OBJECT_HEIGHT) / objectMeters, slopeOut = slopeIn - hitY / focalMeters;
    if (Math.abs(hitY) > LENS_APERTURE + 1e-12) return { id, hit, slopeIn, slopeOut, available: false, reason: 'This principal ray misses the finite lens aperture.', segments: [], extension: null };
    const targetX = kind === 'real' ? Math.min(.56, imageDistance!) : .56;
    const outgoing = endpoint(hit, slopeOut, targetX);
    const extension = kind === 'virtual' ? segment(hit, endpoint(hit, slopeOut, Math.max(-.56, imageDistance!))) : null;
    return { id, hit, slopeIn, slopeOut, available: true, reason: null, segments: [segment(objectTip, hit), segment(hit, outgoing)], extension };
  });
  const imageOnBench = imageDistance !== null && Math.abs(imageDistance) <= .55 && Math.abs(imageHeight!) <= (kind === 'real' ? LENS_SCREEN_HEIGHT / 2 : .14);
  return { input, focalMeters, objectMeters, imageDistance, imageHeight, magnification, objectTip, rays, atInfinity, kind, real: kind === 'real', imageOnBench, screen: kind === 'real' && imageOnBench ? { x: imageDistance!, y: imageHeight! } : null, di: imageDistance === null ? null : imageDistance * 100, m: magnification, hi: imageHeight === null ? null : imageHeight * 100, size: magnification === null ? 'Unbounded' : Math.abs(Math.abs(magnification) - 1) < 1e-10 ? 'Same size' : Math.abs(magnification) > 1 ? 'Enlarged' : 'Reduced', orientation: magnification === null ? 'No finite image' : magnification < 0 ? 'Inverted' : 'Upright' };
}
/** Packets only propagate forward along real rays; virtual extensions carry no light. */
export function lensPackets(solution: ReturnType<typeof lensSolution>, time: number, spacing = 1e-9) {
  if (!Number.isFinite(time) || !Number.isFinite(spacing) || spacing <= 0) return [];
  const phase = ((time % spacing) + spacing) % spacing;
  const points: { point: LensPoint; ray: LensRayId }[] = [];
  for (const ray of solution.rays.filter(r => r.available)) {
    const total = ray.segments.reduce((sum, s) => sum + s.length, 0);
    for (let age = phase, count = 0; age * LENS_C < total && count < 128; age += spacing, count++) {
      let remaining = age * LENS_C;
      for (const s of ray.segments) {
        if (remaining <= s.length) { const fraction = s.length > 0 ? remaining / s.length : 0; points.push({ point: { x: s.start.x + fraction * (s.end.x - s.start.x), y: s.start.y + fraction * (s.end.y - s.start.y) }, ray: ray.id }); break; }
        remaining -= s.length;
      }
    }
  }
  return points;
}
