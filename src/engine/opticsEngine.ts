export interface Vec2 {
  x: number;
  y: number;
}

export interface Ray {
  origin: Vec2;
  direction: Vec2;
  wavelength: number;
  intensity: number;
}

export interface RayPath {
  from: Vec2;
  to: Vec2;
  wavelength: number;
  intensity: number;
}

export type OpticsObject =
  | { type: "mirror"; x: number; y: number; angle: number; width: number; reflectivity: number }
  | { type: "concave-mirror"; x: number; y: number; angle: number; width: number; reflectivity: number }
  | { type: "lens"; x: number; y: number; angle: number; height: number; focalLength: number; refractiveIndex: number }
  | { type: "prism"; x: number; y: number; angle: number; width: number; height: number; refractiveIndex: number }
  | { type: "surface"; x: number; y: number; angle: number; width: number; n1: number; n2: number };

export function castRay(ray: Ray, objects: OpticsObject[], maxBounces = 10): RayPath[] {
  const rays = ray.wavelength === 0 ? [410, 450, 490, 530, 580, 620, 680].map((wavelength, index) => ({
    ...ray,
    wavelength,
    direction: rotate(ray.direction, (index - 3) * 0.018),
    intensity: ray.intensity * 0.72,
  })) : [ray];
  return rays.flatMap((item) => castSingleRay({ ...item, direction: normalize(item.direction) }, objects, maxBounces));
}

export function wavelengthToRgba(wavelength: number, alpha = 1) {
  if (wavelength === 0) return `rgba(255,255,255,${alpha})`;
  const t = clamp((wavelength - 380) / 320, 0, 1);
  const r = clamp(1.5 - Math.abs(4 * t - 3), 0, 1);
  const g = clamp(1.5 - Math.abs(4 * t - 2), 0, 1);
  const b = clamp(1.5 - Math.abs(4 * t - 1), 0, 1);
  return `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${alpha})`;
}

function castSingleRay(ray: Ray, objects: OpticsObject[], maxBounces: number) {
  const paths: RayPath[] = [];
  let current = { ...ray, mediumN: 1 };
  for (let bounce = 0; bounce <= maxBounces && current.intensity > 0.02; bounce += 1) {
    const hit = nearestHit(current, objects);
    const end = hit ? hit.point : add(current.origin, scale(current.direction, 1600));
    paths.push({ from: current.origin, to: end, wavelength: current.wavelength, intensity: current.intensity });
    if (!hit) break;
    const object = hit.object;
    if (object.type === "mirror" || object.type === "concave-mirror") {
      const normal = object.type === "concave-mirror" ? normalize({ x: object.x - hit.point.x, y: object.y - hit.point.y }) : hit.normal;
      current = { ...current, origin: add(hit.point, scale(normal, 0.1)), direction: reflect(current.direction, normal), intensity: current.intensity * object.reflectivity };
    } else if (object.type === "lens") {
      const opticalAxis = { x: Math.cos(object.angle), y: Math.sin(object.angle) };
      const focal = add({ x: object.x, y: object.y }, scale(opticalAxis, object.focalLength));
      const refracted = normalize({ x: focal.x - hit.point.x, y: focal.y - hit.point.y });
      current = { ...current, origin: add(hit.point, scale(refracted, 0.1)), direction: refracted, intensity: current.intensity * 0.92 };
    } else if (object.type === "prism") {
      const dispersion = (540 - current.wavelength) / 16000;
      const prismIndex = object.refractiveIndex + dispersion;
      const entering = current.mediumN <= 1.001;
      const n1 = entering ? 1 : prismIndex;
      const n2 = entering ? prismIndex : 1;
      const refracted = refract(current.direction, hit.normal, n1, n2);
      if (refracted) {
        current = { ...current, mediumN: n2, origin: add(hit.point, scale(refracted, 0.1)), direction: refracted, intensity: current.intensity * 0.9 };
      } else {
        const reflected = reflect(current.direction, hit.normal);
        current = { ...current, origin: add(hit.point, scale(reflected, 0.1)), direction: reflected, intensity: current.intensity * 0.86 };
      }
    } else if (object.type === "surface") {
      const refracted = refract(current.direction, hit.normal, object.n1, object.n2);
      const direction = refracted ?? reflect(current.direction, hit.normal);
      current = { ...current, origin: add(hit.point, scale(direction, 0.1)), direction, intensity: current.intensity * 0.9 };
    } else {
      break;
    }
  }
  return paths;
}

function nearestHit(ray: Ray, objects: OpticsObject[]) {
  let best: { object: OpticsObject; point: Vec2; normal: Vec2; distance: number } | undefined;
  for (const object of objects) {
    const hit = intersectObject(ray, object);
    if (hit && hit.distance > 0.001 && (!best || hit.distance < best.distance)) best = { object, ...hit };
  }
  return best;
}

function intersectObject(ray: Ray, object: OpticsObject) {
  const segments = objectSegments(object);
  let best: { point: Vec2; normal: Vec2; distance: number } | undefined;
  for (const segment of segments) {
    const hit = intersectRaySegment(ray.origin, ray.direction, segment.a, segment.b);
    if (!hit || hit.distance <= 0.001 || (best && hit.distance >= best.distance)) continue;
    const tangent = normalize({ x: segment.b.x - segment.a.x, y: segment.b.y - segment.a.y });
    let normal = normalize({ x: -tangent.y, y: tangent.x });
    if (dot(normal, ray.direction) > 0) normal = scale(normal, -1);
    best = { point: hit.point, normal, distance: hit.distance };
  }
  return best;
}

function objectSegments(object: OpticsObject) {
  if (object.type === "prism") {
    const w = object.width;
    const h = object.height;
    const local = [
      { x: 0, y: -h / 2 },
      { x: w / 2, y: h / 2 },
      { x: -w / 2, y: h / 2 },
    ].map((point) => rotateAround(add(point, { x: object.x, y: object.y }), { x: object.x, y: object.y }, object.angle));
    return [
      { a: local[0], b: local[1] },
      { a: local[1], b: local[2] },
      { a: local[2], b: local[0] },
    ];
  }
  const length = object.type === "lens" ? object.height : object.width;
  const normalAngle = object.angle + Math.PI / 2;
  const half = { x: Math.cos(normalAngle) * length / 2, y: Math.sin(normalAngle) * length / 2 };
  return [{ a: { x: object.x - half.x, y: object.y - half.y }, b: { x: object.x + half.x, y: object.y + half.y } }];
}

function intersectRaySegment(origin: Vec2, direction: Vec2, a: Vec2, b: Vec2) {
  const v1 = { x: origin.x - a.x, y: origin.y - a.y };
  const v2 = { x: b.x - a.x, y: b.y - a.y };
  const cross = direction.x * v2.y - direction.y * v2.x;
  if (Math.abs(cross) < 1e-8) return undefined;
  const t = (v2.x * v1.y - v2.y * v1.x) / cross;
  const u = (direction.x * v1.y - direction.y * v1.x) / cross;
  if (t < 0 || u < 0 || u > 1) return undefined;
  return { point: add(origin, scale(direction, t)), distance: t };
}

function refract(direction: Vec2, normal: Vec2, n1: number, n2: number) {
  const ratio = n1 / n2;
  const cosI = -dot(normal, direction);
  const sinT2 = ratio * ratio * (1 - cosI * cosI);
  if (sinT2 > 1) return undefined;
  return normalize(add(scale(direction, ratio), scale(normal, ratio * cosI - Math.sqrt(1 - sinT2))));
}

function reflect(direction: Vec2, normal: Vec2) {
  return normalize(add(direction, scale(normal, -2 * dot(direction, normal))));
}

function rotate(v: Vec2, angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
}

function rotateAround(point: Vec2, center: Vec2, angle: number) {
  const rotated = rotate({ x: point.x - center.x, y: point.y - center.y }, angle);
  return add(center, rotated);
}

function normalize(v: Vec2) {
  const length = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / length, y: v.y / length };
}

function add(a: Vec2, b: Vec2) {
  return { x: a.x + b.x, y: a.y + b.y };
}

function scale(v: Vec2, scalar: number) {
  return { x: v.x * scalar, y: v.y * scalar };
}

function dot(a: Vec2, b: Vec2) {
  return a.x * b.x + a.y * b.y;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
