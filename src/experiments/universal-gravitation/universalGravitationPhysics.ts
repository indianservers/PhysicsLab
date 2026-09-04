export const G = 6.67430e-11;

export interface GravitationInput {
  massA: number;
  massB: number;
  separation: number;
  probeX: number;
  probeY: number;
  softening: number;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface GravitationResult {
  forceMagnitude: number;
  forceOnA: Vector2;
  forceOnB: Vector2;
  fieldFromA: Vector2;
  fieldFromB: Vector2;
  netField: Vector2;
  netFieldMagnitude: number;
  potential: number;
  zeroFieldX: number;
  distanceToA: number;
  distanceToB: number;
}

export function sanitizeGravitationInput(input: GravitationInput): GravitationInput {
  return {
    massA: clamp(input.massA, 1e20, 1e32),
    massB: clamp(input.massB, 1e20, 1e32),
    separation: clamp(input.separation, 1e7, 1e13),
    probeX: clamp(input.probeX, -2e13, 2e13),
    probeY: clamp(input.probeY, -2e13, 2e13),
    softening: clamp(input.softening, 1e6, 1e11),
  };
}

export function computeGravitation(raw: GravitationInput): GravitationResult {
  const input = sanitizeGravitationInput(raw);
  const xA = -input.separation / 2;
  const xB = input.separation / 2;
  const forceMagnitude = (G * input.massA * input.massB) / input.separation ** 2;
  const fieldFromA = softenedField(input.massA, { x: xA, y: 0 }, { x: input.probeX, y: input.probeY }, input.softening);
  const fieldFromB = softenedField(input.massB, { x: xB, y: 0 }, { x: input.probeX, y: input.probeY }, input.softening);
  const netField = { x: fieldFromA.x + fieldFromB.x, y: fieldFromA.y + fieldFromB.y };
  const distanceToA = Math.hypot(input.probeX - xA, input.probeY);
  const distanceToB = Math.hypot(input.probeX - xB, input.probeY);
  const zeroFromA = input.separation * Math.sqrt(input.massA) / (Math.sqrt(input.massA) + Math.sqrt(input.massB));
  return {
    forceMagnitude,
    forceOnA: { x: forceMagnitude, y: 0 },
    forceOnB: { x: -forceMagnitude, y: 0 },
    fieldFromA,
    fieldFromB,
    netField,
    netFieldMagnitude: Math.hypot(netField.x, netField.y),
    potential: -(G * input.massA) / Math.sqrt(distanceToA ** 2 + input.softening ** 2) - (G * input.massB) / Math.sqrt(distanceToB ** 2 + input.softening ** 2),
    zeroFieldX: xA + zeroFromA,
    distanceToA,
    distanceToB,
  };
}

export function softenedField(mass: number, source: Vector2, probe: Vector2, softening: number): Vector2 {
  const dx = source.x - probe.x;
  const dy = source.y - probe.y;
  const softenedR2 = dx ** 2 + dy ** 2 + Math.max(1, softening) ** 2;
  const scale = (G * mass) / softenedR2 ** 1.5;
  return { x: dx * scale, y: dy * scale };
}

export function samplePotentialLine(input: GravitationInput, count = 121) {
  const safe = sanitizeGravitationInput(input);
  return Array.from({ length: count }, (_, index) => {
    const x = -safe.separation * 1.5 + (index / (count - 1)) * safe.separation * 3;
    const result = computeGravitation({ ...safe, probeX: x, probeY: 0 });
    return { x, potential: result.potential, field: result.netField.x };
  });
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}
