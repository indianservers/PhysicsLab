export type Point = { x: number; y: number };
export const opticalElementCatalog = [
  { id: 'convex', name: 'Convex lens', description: 'Converging', detail: 'A thick centre bends parallel rays toward a focus. Marginal and paraxial rays reveal spherical aberration.' },
  { id: 'concave', name: 'Concave lens', description: 'Diverging', detail: 'A thin centre spreads parallel rays, producing a virtual focus on the source side.' },
  { id: 'semicircle', name: 'Semicircular lens', description: 'Half cylinder', detail: 'A curved face and a flat face reveal local normals and total internal reflection.' },
  { id: 'prism', name: 'Prism', description: 'Deviation & dispersion', detail: 'Angled faces deviate rays. Wavelength-dependent indices separate the colours.' },
  { id: 'biconcave', name: 'Biconcave lens', description: 'Strong divergence', detail: 'Two deeply concave faces spread a parallel beam more strongly than the shallow concave lens.' },
  { id: 'block', name: 'Rectangular block', description: 'Parallel displacement', detail: 'A ray crossing the two parallel broad faces emerges parallel to its original direction with lateral displacement.' },
  { id: 'planoconvex', name: 'Plano-convex lens', description: 'Flat + convex', detail: 'One flat and one convex face form a converging lens. Rotate it to compare the two orientations.' },
  { id: 'planoconcave', name: 'Plano-concave lens', description: 'Flat + concave', detail: 'One flat and one concave face form a diverging lens.' },
  { id: 'positive-meniscus', name: 'Positive meniscus', description: 'Converging crescent', detail: 'Curved faces with a thicker centre form a positive meniscus lens in air.' },
  { id: 'negative-meniscus', name: 'Negative meniscus', description: 'Diverging crescent', detail: 'Curved faces with a thinner centre form a negative meniscus lens in air.' },
  { id: 'circle', name: 'Circular glass', description: 'Cylinder section', detail: 'The local normal is radial. A ray through the centre meets the circular surface normally.' },
  { id: 'ellipse', name: 'Elliptical glass', description: 'Oval cylinder', detail: 'The changing curvature of an ellipse changes refraction across the beam.' },
  { id: 'cone', name: 'Cone', description: 'Axial section', detail: 'The axial section of a solid cone is triangular. Rays in this plane meet its sloping sides or flat base; this is a 2D section, not a full 3D cone simulation.' },
  { id: 'truncated-cone', name: 'Truncated cone', description: 'Axial section', detail: 'A cone with its tip removed has a trapezoidal axial section, with parallel end faces and sloping sides.' },
  { id: 'right-prism', name: 'Right-angle prism', description: '90° triangle', detail: 'A right-angle triangular section can redirect rays by refraction and total internal reflection.' },
  { id: 'equilateral-prism', name: 'Equilateral prism', description: '60° apex', detail: 'An equilateral triangular prism provides equal 60° apex angles for deviation and dispersion experiments.' },
  { id: 'wedge', name: 'Optical wedge', description: 'Small apex angle', detail: 'Two nearly parallel broad faces form a thin wedge that gently redirects transmitted rays.' },
  { id: 'trapezoid', name: 'Trapezoidal glass', description: 'Four angled faces', detail: 'Parallel top and bottom faces and angled side faces give different paths as the glass rotates.' },
  { id: 'diamond', name: 'Diamond shape', description: 'Rhombus section', detail: 'This is a glass rhombus, not diamond material. Opposite faces are parallel and neighbouring faces meet at an angle.' },
  { id: 'pentagon', name: 'Pentagonal prism', description: 'Five faces', detail: 'Five polished faces allow several possible sequences of refraction and internal reflection.' },
  { id: 'hexagon', name: 'Hexagonal prism', description: 'Six faces', detail: 'Opposite faces are parallel. Rotating the glass selects parallel-face or angled-face transmission.' },
  { id: 'octagon', name: 'Octagonal prism', description: 'Eight faces', detail: 'Eight planar faces approximate a circular section while retaining distinct surface normals.' },
  { id: 'thin-slab', name: 'Thin glass plate', description: 'Narrow parallel slab', detail: 'A thin parallel plate produces less lateral displacement than a thick block of the same material.' },
  { id: 'parabolic-lens', name: 'Parabolic-profile lens', description: 'Aspheric section', detail: 'A quadratic surface profile changes curvature across the aperture. Refraction is traced at the actual profile rather than assuming an ideal focus.' },
  { id: 'square', name: 'Square glass', description: 'Equal-sided block', detail: 'Four perpendicular faces form a square section. Rays crossing opposite faces emerge parallel; rays crossing neighbouring faces can deviate or reflect internally.' },
  { id: 'parallelogram', name: 'Parallelogram glass', description: 'Oblique parallel faces', detail: 'Both pairs of opposite faces are parallel. Tilted edges change the local incidence angles.' },
  { id: 'wide-block', name: 'Wide glass block', description: 'Long optical path', detail: 'A broad rectangular block gives a longer path through glass and a different lateral displacement at oblique incidence.' },
  { id: 'prism30', name: '30° apex prism', description: 'Narrow triangular prism', detail: 'A symmetric triangular section with a 30° apex. The narrow angle produces a different deviation from the 45°, 60° and 90° prism sections.' },
  { id: 'prism45', name: '45° apex prism', description: 'Medium triangular prism', detail: 'A symmetric triangular section with a 45° apex. Compare its deviation and internal reflection with other apex angles.' },
  { id: 'prism90', name: '90° apex prism', description: 'Wide triangular prism', detail: 'A symmetric triangle with a 90° apex and two 45° base angles. Rotate the section to explore internal reflection.' },
  { id: 'scalene-prism', name: 'Scalene prism', description: 'Unequal face angles', detail: 'Three unequal sides create distinct incidence angles for each orientation. The rays follow the actual local face normals.' },
  { id: 'heptagon', name: 'Heptagonal prism', description: 'Seven faces', detail: 'Seven planar faces offer different entry and exit orientations without parallel opposite faces.' },
  { id: 'nonagon', name: 'Nonagonal prism', description: 'Nine faces', detail: 'A regular nine-sided section gives nine distinct surface normals and multiple possible internal paths.' },
  { id: 'decagon', name: 'Decagonal prism', description: 'Ten faces', detail: 'Ten planar faces form five pairs of parallel opposite faces.' },
  { id: 'dodecagon', name: 'Dodecagonal prism', description: 'Twelve faces', detail: 'A twelve-sided section approaches a cylinder while keeping distinct planar interfaces.' },
  { id: 'stadium', name: 'Capsule glass', description: 'Flat sides + round ends', detail: 'Parallel straight side faces join semicircular end faces. Compare refraction at the flat and curved portions.' },
  { id: 'quarter-circle', name: 'Quarter-cylinder glass', description: '90° circular sector', detail: 'Two perpendicular flat faces and a quarter-circle boundary allow mixed flat and curved interface paths.' },
  { id: 'circular-segment', name: 'Circular segment', description: 'Shallow curved cap', detail: 'A circular arc closed by a chord forms a shallow glass segment. The normal changes continuously along its curved face.' },
  { id: 'half-ellipse', name: 'Half-elliptical glass', description: 'Flat + oval face', detail: 'An elliptical arc and a flat face produce a different range of local normals from a semicircular element.' },
  { id: 'teardrop', name: 'Teardrop glass', description: 'Asymmetric curved body', detail: 'A smooth asymmetric section changes curvature along the beam path. This is a shaped glass body, not a water droplet model.' },
  { id: 'rounded-rectangle', name: 'Rounded glass block', description: 'Polished round corners', detail: 'A rectangular section with circular corner arcs. Broad-face transmission and corner transmission behave differently.' },
  { id: 'superellipse', name: 'Superelliptical glass', description: 'Continuous squircle', detail: 'A fourth-order superellipse has flatter central faces and smoothly curved corners. Rays use the sampled local boundary.' },
  { id: 'thick-convex', name: 'Thick convex lens', description: 'Deep converging profile', detail: 'A thicker convex section bends rays at two curved faces. The model follows the finite lens rather than an ideal thin-lens approximation.' },
  { id: 'asymmetric-convex', name: 'Asymmetric convex lens', description: 'Unequal face curvature', detail: 'Two convex faces with different curvatures form a converging section. Flip the lens to compare aberration and ray paths.' },
] as const;
export type ElementKind = typeof opticalElementCatalog[number]['id'];
export const GLASS_CATALOG_SOURCE = 'https://www.schott.com/en-in/products/optical-glass/-/media/project/onex/products/o/optical-glass/downloads/schott-optical-glass-pocket-catalog-2020_row.pdf?rev=99782b6a921545a18c5c75d0a5c06a0b';
// SCHOTT catalog (2020), pp. 102–108: d-line index and Abbe number.
// Two-term Cauchy fits reproduce nd and nF−nC; they are educational visible-band
// approximations, not the manufacturer's full Sellmeier dispersion curves.
const catalogGlass = (name: string, nd: number, vd: number) => {
  const b = (nd - 1) / (vd * (1 / .4861327 ** 2 - 1 / .6562725 ** 2));
  return { name, a: nd - b / .5875618 ** 2, b };
};
export const glasses = [
  { name: 'Crown glass', a: 1.5046, b: .0042 },
  { name: 'Flint glass', a: 1.594, b: .009 },
  { name: 'Fused silica', a: 1.448, b: .00354 },
  { name: 'Borosilicate', a: 1.462, b: .004 },
  { name: 'Acrylic', a: 1.479, b: .0045 },
  catalogGlass('N-K5 · Crown', 1.52249, 59.48),
  catalogGlass('K7 · Crown', 1.51112, 60.41),
  catalogGlass('K10 · Crown', 1.50137, 56.41),
  catalogGlass('N-ZK7A · Zinc crown', 1.50805, 61.04),
  catalogGlass('N-BAK1 · Barium crown', 1.57250, 57.55),
  catalogGlass('N-BAK2 · Barium crown', 1.53996, 59.71),
  catalogGlass('N-BAK4 · Barium crown', 1.56883, 55.98),
  catalogGlass('N-SK2 · Dense crown', 1.60738, 56.65),
  catalogGlass('N-SK4 · Dense crown', 1.61272, 58.63),
  catalogGlass('N-SK5 · Dense crown', 1.58913, 61.27),
  catalogGlass('N-SK11 · Dense crown', 1.56384, 60.80),
  catalogGlass('N-SK14 · Dense crown', 1.60311, 60.60),
  catalogGlass('N-SK16 · Dense crown', 1.62041, 60.32),
  catalogGlass('N-KF9 · Crown flint', 1.52346, 51.54),
  catalogGlass('N-BALF4 · Barium light flint', 1.57956, 53.87),
  catalogGlass('N-BALF5 · Barium light flint', 1.54739, 53.63),
  catalogGlass('N-SSK2 · Very dense crown', 1.62229, 53.27),
  catalogGlass('N-SSK5 · Very dense crown', 1.65844, 50.88),
  catalogGlass('N-SSK8 · Very dense crown', 1.61773, 49.83),
  catalogGlass('N-LAK7 · Lanthanum crown', 1.65160, 58.52),
  catalogGlass('N-LAK8 · Lanthanum crown', 1.71300, 53.83),
];
// Representative visible-band Cauchy fits, wavelength in micrometres.
export const glassIndex = (material: number, wavelength: number) => glasses[material].a + glasses[material].b / (wavelength / 1000) ** 2;
const add = (a: Point, b: Point): Point => ({ x: a.x + b.x, y: a.y + b.y });
const mul = (a: Point, t: number): Point => ({ x: a.x * t, y: a.y * t });
const dot = (a: Point, b: Point) => a.x * b.x + a.y * b.y;
const cross = (a: Point, b: Point) => a.x * b.y - a.y * b.x;
export function elementOutline(kind: ElementKind, rotation = 0): Point[] {
  let p: Point[] = [];
  if (kind === 'square' || kind === 'wide-block') {
    const w = kind === 'square' ? 1.5 : 2.25, h = kind === 'square' ? 1.5 : .9;
    p = [{ x: -w, y: -h }, { x: w, y: -h }, { x: w, y: h }, { x: -w, y: h }];
  }
  else if (kind === 'parallelogram') p = [{ x: -.7, y: -1.7 }, { x: 1.8, y: -1.7 }, { x: .7, y: 1.7 }, { x: -1.8, y: 1.7 }];
  else if (kind === 'prism30' || kind === 'prism45' || kind === 'prism90') {
    const apex = kind === 'prism30' ? 30 : kind === 'prism45' ? 45 : 90;
    const height = apex === 90 ? 2 : 3.4, width = height * Math.tan(apex * Math.PI / 360);
    p = [{ x: 0, y: -height / 2 }, { x: width, y: height / 2 }, { x: -width, y: height / 2 }];
  }
  else if (kind === 'scalene-prism') p = [{ x: -.65, y: -2.1 }, { x: 2.1, y: 1.2 }, { x: -1.7, y: 1.7 }];
  else if (kind === 'stadium') {
    for (let i = 0; i <= 120; i++) { const t = Math.PI * i / 120; p.push({ x: .8 * Math.cos(t), y: 1.1 + .8 * Math.sin(t) }); }
    for (let i = 0; i <= 120; i++) { const t = Math.PI + Math.PI * i / 120; p.push({ x: .8 * Math.cos(t), y: -1.1 + .8 * Math.sin(t) }); }
  }
  else if (kind === 'quarter-circle') {
    p.push({ x: -.9, y: .9 });
    for (let i = 0; i <= 240; i++) { const t = -Math.PI / 2 + Math.PI * i / 480; p.push({ x: -.9 + 2.4 * Math.cos(t), y: .9 + 2.4 * Math.sin(t) }); }
  }
  else if (kind === 'circular-segment') {
    for (let i = 0; i <= 240; i++) { const t = -Math.PI / 3 + 2 * Math.PI * i / 720; p.push({ x: 2.2 * Math.cos(t) - 1.6, y: 2.2 * Math.sin(t) }); }
  }
  else if (kind === 'half-ellipse') {
    for (let i = 0; i <= 240; i++) { const t = -Math.PI / 2 + Math.PI * i / 240; p.push({ x: .5 - 1.6 * Math.cos(t), y: 2.1 * Math.sin(t) }); }
  }
  else if (kind === 'teardrop' || kind === 'superellipse') {
    for (let i = 0; i < 480; i++) {
      const t = 2 * Math.PI * i / 480, c = Math.cos(t), s = Math.sin(t), radius = 1.25 * (1 + .65 * c);
      p.push(kind === 'teardrop' ? { x: radius * c - .65, y: radius * s } : { x: 1.6 * Math.sign(c) * Math.sqrt(Math.abs(c)), y: 1.6 * Math.sign(s) * Math.sqrt(Math.abs(s)) });
    }
  }
  else if (kind === 'rounded-rectangle') {
    for (let corner = 0; corner < 4; corner++) {
      const centers = [{ x: .8, y: -1.3 }, { x: .8, y: 1.3 }, { x: -.8, y: 1.3 }, { x: -.8, y: -1.3 }];
      for (let i = 0; i <= 60; i++) { const t = -Math.PI / 2 + corner * Math.PI / 2 + i * Math.PI / 120; p.push({ x: centers[corner].x + .4 * Math.cos(t), y: centers[corner].y + .4 * Math.sin(t) }); }
    }
  }
  else if (kind === 'prism') p = [{ x: 0, y: -2.3 }, { x: 2, y: 1.6 }, { x: -2, y: 1.6 }];
  else if (kind === 'block' || kind === 'thin-slab') {
    const w = kind === 'block' ? .85 : .22;
    p = [{ x: -w, y: -2 }, { x: w, y: -2 }, { x: w, y: 2 }, { x: -w, y: 2 }];
  }
  else if (kind === 'cone') p = [{ x: -1.5, y: -2 }, { x: 1.8, y: 0 }, { x: -1.5, y: 2 }];
  else if (kind === 'truncated-cone') p = [{ x: -1.6, y: -2 }, { x: 1.3, y: -.7 }, { x: 1.3, y: .7 }, { x: -1.6, y: 2 }];
  else if (kind === 'right-prism') p = [{ x: -1.7, y: -1.7 }, { x: 1.7, y: 1.7 }, { x: -1.7, y: 1.7 }];
  else if (kind === 'equilateral-prism') p = [{ x: 0, y: -2 }, { x: Math.sqrt(3), y: 1 }, { x: -Math.sqrt(3), y: 1 }];
  else if (kind === 'wedge') p = [{ x: -.3, y: -2 }, { x: .6, y: -2 }, { x: .1, y: 2 }, { x: -.3, y: 2 }];
  else if (kind === 'trapezoid') p = [{ x: -1, y: -1.5 }, { x: 1, y: -1.5 }, { x: 2, y: 1.5 }, { x: -2, y: 1.5 }];
  else if (kind === 'diamond') p = [{ x: 0, y: -2.2 }, { x: 1.4, y: 0 }, { x: 0, y: 2.2 }, { x: -1.4, y: 0 }];
  else if (['circle', 'ellipse', 'pentagon', 'hexagon', 'octagon', 'heptagon', 'nonagon', 'decagon', 'dodecagon'].includes(kind)) {
    const count = kind === 'pentagon' ? 5 : kind === 'hexagon' ? 6 : kind === 'heptagon' ? 7 : kind === 'octagon' ? 8 : kind === 'nonagon' ? 9 : kind === 'decagon' ? 10 : kind === 'dodecagon' ? 12 : 480;
    for (let i = 0; i < count; i++) { const t = 2 * Math.PI * i / count - Math.PI / 2; p.push({ x: (kind === 'ellipse' ? 1.25 : 2) * Math.cos(t), y: 2 * Math.sin(t) }); }
  }
  else if (kind === 'semicircle') {
    for (let i = 0; i <= 240; i++) { const t = -Math.PI / 2 + Math.PI * i / 240; p.push({ x: -2 * Math.cos(t), y: 2 * Math.sin(t) }); }
  } else {
    for (const side of [-1, 1]) for (let i = 0; i <= 240; i++) {
      const y = side === -1 ? -2 + 4 * i / 240 : 2 - 4 * i / 240;
      const sag = Math.sqrt(25 - y * y) - Math.sqrt(21);
      const halfWidth = kind === 'convex' ? .08 + sag : (kind === 'biconcave' ? .9 - 1.7 * sag : .65 - sag);
      let x = side * halfWidth;
      if (kind === 'planoconvex') x = side === -1 ? -.1 : .1 + sag * 1.7;
      if (kind === 'planoconcave') x = side === -1 ? -.1 : .95 - sag * 1.7;
      if (kind === 'positive-meniscus') x = side === -1 ? -.9 + .8 * sag : -.6 + 1.6 * sag;
      if (kind === 'negative-meniscus') x = side === -1 ? -.9 + 1.6 * sag : .1 + .8 * sag;
      if (kind === 'parabolic-lens') x = side * (.12 + .65 * (1 - y * y / 4));
      if (kind === 'thick-convex') x = side * (.3 + 2 * sag);
      if (kind === 'asymmetric-convex') x = side * (.12 + (side === -1 ? .6 : 1.8) * sag);
      p.push({ x, y });
    }
  }
  const t = rotation * Math.PI / 180;
  return p.map(v => ({ x: v.x * Math.cos(t) - v.y * Math.sin(t), y: v.x * Math.sin(t) + v.y * Math.cos(t) }));
}
export interface InterfaceEvent { surfaceIndex:number; point: Point; normal: Point; incidence: number; refraction: number | null; tir: boolean; elementId: number; fromIndex: number; toIndex: number }
export interface OpticalBody { id: number; polygon: Point[]; index: number }
export interface PlacedElement { id: number; kind: ElementKind; material: number; rotation: number; x: number; y: number; scale: number }
export function placedOutline(element: PlacedElement): Point[] {
  return elementOutline(element.kind, element.rotation).map(p => ({ x: p.x * element.scale + element.x, y: p.y * element.scale + element.y }));
}
export function containsPoint(polygon: Point[], point: Point) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i], b = polygon[j];
    if ((a.y > point.y) !== (b.y > point.y) && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}
export function polygonsOverlap(a: Point[], b: Point[]) {
  const bounds = (p: Point[]) => ({ left: Math.min(...p.map(v => v.x)), right: Math.max(...p.map(v => v.x)), top: Math.min(...p.map(v => v.y)), bottom: Math.max(...p.map(v => v.y)) });
  const aa = bounds(a), bb = bounds(b);
  if (aa.right < bb.left || bb.right < aa.left || aa.bottom < bb.top || bb.bottom < aa.top) return false;
  if (a.some(p => containsPoint(b, p)) || b.some(p => containsPoint(a, p))) return true;
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) {
    const start = a[i], end = b[j], da = add(a[(i + 1) % a.length], mul(start, -1)), db = add(b[(j + 1) % b.length], mul(end, -1));
    const denominator = cross(da, db), offset = add(end, mul(start, -1));
    if (Math.abs(denominator) < 1e-10) continue;
    const t = cross(offset, db) / denominator, u = cross(offset, da) / denominator;
    if (t >= -1e-8 && t <= 1 + 1e-8 && u >= -1e-8 && u <= 1 + 1e-8) return true;
  }
  return false;
}
export function canPlaceElement(candidate: PlacedElement, scene: PlacedElement[]) {
  const outline = placedOutline(candidate);
  return outline.every(p => Math.abs(p.x) <= 11 && Math.abs(p.y) <= 5.5) && scene.every(other => other.id === candidate.id || !polygonsOverlap(outline, placedOutline(other)));
}
// Non-overlapping homogeneous solids separated by air. Find the next surface
// globally: tracing elements in list order would fail after a reflected ray.
export function traceScene(bodies: OpticalBody[], origin: Point, direction: Point) {
  const points = [origin]; const events: InterfaceEvent[] = [];
  let active = bodies.find(body => containsPoint(body.polygon, origin)) ?? null;
  const magnitude = Math.hypot(direction.x, direction.y);
  if (!Number.isFinite(magnitude) || magnitude === 0) throw new Error('Ray direction must be finite and non-zero');
  let d = mul(direction, 1 / magnitude), o = origin;
  for (let bounce = 0; bounce < 64; bounce++) {
    let nearest = Infinity; let surfaceIndex=0; let normal: Point | null = null; let surface: OpticalBody | null = null;
    for (const body of bodies) for (let i = 0; i < body.polygon.length; i++) {
      const polygon = body.polygon;
      const a = polygon[i], b = polygon[(i + 1) % polygon.length];
      const edge = add(b, mul(a, -1)), offset = add(a, mul(o, -1)), denominator = cross(d, edge);
      if (Math.abs(denominator) < 1e-10) continue;
      const t = cross(offset, edge) / denominator, u = cross(offset, d) / denominator;
      if (t > 1e-6 && u >= 0 && u <= 1 && t < nearest) {
        nearest = t; surface = body; surfaceIndex=i; const length = Math.hypot(edge.x, edge.y); normal = { x: -edge.y / length, y: edge.x / length };
      }
    }
    if (!normal || !surface) { points.push(add(o, mul(d, 50))); return { points, events, truncated: false }; }
    if (dot(d, normal) > 0) normal = mul(normal, -1);
    const hit = add(o, mul(d, nearest)); points.push(hit);
    const next = active?.id === surface.id ? null : surface;
    const fromIndex = active?.index ?? 1, toIndex = next?.index ?? 1;
    const cosine = Math.min(1, Math.max(0, -dot(d, normal))), sine = Math.min(1, Math.abs(cross(d, normal))), eta = fromIndex / toIndex;
    // At the critical angle round-off must not turn grazing transmission into
    // total internal reflection. Preserve genuinely supercritical incidence.
    const rawDiscriminant = 1 - (eta * sine) ** 2, tir = rawDiscriminant < -1e-12;
    const discriminant = Math.max(0, rawDiscriminant);
    events.push({ surfaceIndex, point: hit, normal, incidence: Math.atan2(sine, cosine) * 180 / Math.PI, refraction: tir ? null : Math.atan2(eta * sine, Math.sqrt(discriminant)) * 180 / Math.PI, tir, elementId: surface.id, fromIndex, toIndex });
    d = tir ? add(d, mul(normal, 2 * cosine)) : add(mul(d, eta), mul(normal, eta * cosine - Math.sqrt(discriminant)));
    d = mul(d, 1 / Math.hypot(d.x, d.y));
    if (!tir) active = next;
    o = add(hit, mul(d, 1e-5));
  }
  return { points, events, truncated: true };
}
export function traceElement(polygon: Point[], origin: Point, direction: Point, index: number) {
  return traceScene([{ id: 0, polygon, index }], origin, direction);
}
