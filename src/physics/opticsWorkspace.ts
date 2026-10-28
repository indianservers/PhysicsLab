import { canPlaceElement, ElementKind, glasses, glassIndex, opticalElementCatalog, placedOutline, PlacedElement, traceScene } from './opticalElements';

export interface OpticsSetup { version: 1; scene: PlacedElement[]; angle: number; wavelength: number; beams: number; spacing: number; on: boolean; white: boolean; normals: boolean }
export const defaultOpticsSetup = (): OpticsSetup => ({ version: 1, scene: [{ id: 1, kind: 'prism', material: 0, rotation: 0, x: 0, y: 0, scale: .75 }], angle: 0, wavelength: 650, beams: 3, spacing: .65, on: true, white: false, normals: true });
const finite = (v: unknown, min: number, max: number): v is number => typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;
/** Validate saved/shared input before it reaches geometry or rendering. */
export function parseOpticsSetup(value: unknown): OpticsSetup {
  const s = value as OpticsSetup;
  if (!s || s.version !== 1 || !Array.isArray(s.scene) || s.scene.length > 6 || !finite(s.angle, -65, 65) || ![450, 530, 650].includes(s.wavelength) || !finite(s.beams, 1, 7) || !Number.isInteger(s.beams) || !finite(s.spacing, .15, .9) || ['on', 'white', 'normals'].some(k => typeof s[k as keyof OpticsSetup] !== 'boolean')) throw new Error('Invalid optics setup');
  const ids = new Set<number>();
  for (const e of s.scene) {
    if (!e || !finite(e.id, 1, 1e9) || !Number.isInteger(e.id) || ids.has(e.id) || !opticalElementCatalog.some(shape => shape.id === e.kind) || !finite(e.material, 0, glasses.length - 1) || !Number.isInteger(e.material) || !finite(e.rotation, -180, 180) || !finite(e.scale, .3, 1.4) || !finite(e.x, -11, 11) || !finite(e.y, -5.5, 5.5)) throw new Error('Invalid glass piece');
    ids.add(e.id);
  }
  if (s.scene.some(e => !canPlaceElement(e, s.scene))) throw new Error('Glass must be separated and inside the bench');
  return { version: 1, scene: s.scene.map(e => ({ id: e.id, kind: e.kind, material: e.material, rotation: e.rotation, x: e.x, y: e.y, scale: e.scale })), angle: s.angle, wavelength: s.wavelength, beams: s.beams, spacing: s.spacing, on: s.on, white: s.white, normals: s.normals };
}
export const rayKey = (ray: { beam: number; w: number }) => `${ray.beam}-${ray.w}`;
export function traceOpticsSetup(s: OpticsSetup) {
  const outlines = s.scene.map(e => ({ ...e, polygon: placedOutline(e) }));
  return Array.from({ length: s.beams }, (_, beam) => (s.white ? [450, 530, 650] : [s.wavelength]).map(w => {
    const t = s.angle * Math.PI / 180, d = { x: Math.cos(t), y: Math.sin(t) }, offset = (beam - (s.beams - 1) / 2) * s.spacing;
    return { ...traceScene(outlines.map(e => ({ id: e.id, polygon: e.polygon, index: glassIndex(e.material, w) })), { x: -18 * d.x - offset * d.y, y: -18 * d.y + offset * d.x }, d), color: w < 490 ? '#5364c8' : w < 580 ? '#13815b' : '#e33e51', beam, w };
  })).flat();
}
export type TracedRay = ReturnType<typeof traceOpticsSetup>[number];
/** Undefined exits and changes of interaction branch must not become plot lines. */
export function opticsResponse(setup:OpticsSetup,ray:TracedRay){
 const end=ray.points[ray.points.length-1],before=ray.points[ray.points.length-2];
 const valid=setup.on&&!ray.truncated&&ray.events.length>0&&!!end&&!!before;
 const raw=end&&before?Math.atan2(end.y-before.y,end.x-before.x)*180/Math.PI-setup.angle:0;
 return {deviation:valid?((raw+540)%360)-180:null,interfaces:setup.on?ray.events.length:0,tir:setup.on?ray.events.filter(e=>e.tir).length:0,
  branch:!setup.on?'laser off':ray.truncated?'trace limit':!ray.events.length?'misses glass':JSON.stringify([ray.beam,ray.w,Math.floor((raw+180)/360),ray.events.map(e=>[e.elementId,e.surfaceIndex,e.tir,e.fromIndex>e.toIndex])])};
}
export function shapeCategory(kind: ElementKind) {
  if (kind.includes('convex') || kind.includes('concave') || kind.includes('meniscus') || kind.includes('lens')) return 'Lenses';
  if (kind.includes('prism') || ['pentagon', 'hexagon', 'heptagon', 'octagon', 'nonagon', 'decagon', 'dodecagon', 'diamond', 'wedge'].includes(kind)) return 'Prisms';
  if (['block', 'thin-slab', 'square', 'wide-block', 'parallelogram', 'trapezoid', 'rounded-rectangle'].includes(kind)) return 'Blocks';
  return 'Curved glass';
}
export const rayDash = (w: number, accessible: boolean) => !accessible ? undefined : w < 490 ? '.06 .09' : w < 580 ? '.25 .12' : undefined;
export const downloadBlob = (blob: Blob, name: string) => { const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
export interface SavedOpticsSetup { id: string; name: string; setup: OpticsSetup }
export function readSavedSetups(): SavedOpticsSetup[] {
  try { const data = JSON.parse(localStorage.getItem('optics-saved-v1') ?? '[]'); return Array.isArray(data) ? data.slice(0, 30).flatMap(e => { try { return typeof e.id === 'string' && typeof e.name === 'string' ? [{ id: e.id, name: e.name.slice(0, 80), setup: parseOpticsSetup(e.setup) }] : []; } catch { return []; } }) : []; } catch { return []; }
}
