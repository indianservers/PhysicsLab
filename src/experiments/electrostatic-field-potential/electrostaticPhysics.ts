export const COULOMB_CONSTANT = 8.9875517923e9;
export interface ElectrostaticInput {
  charge1: number;
  charge2: number;
  separation: number;
  probeX: number;
  probeY: number;
  testCharge: number;
}
export interface ElectrostaticResult {
  probeX: number;
  probeY: number;
  fieldX: number;
  fieldY: number;
  fieldMagnitude: number;
  potential: number;
  referencePotential: number;
  workByField: number;
  potentialEnergyChange: number;
  singularityPrevented: boolean;
}
const clamp = (v: number, min: number, max: number) =>
  Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : min;
export function sanitizeElectrostaticInput(
  i: ElectrostaticInput,
): ElectrostaticInput {
  return {
    charge1: clamp(i.charge1, -20e-6, 20e-6),
    charge2: clamp(i.charge2, -20e-6, 20e-6),
    separation: clamp(i.separation, 0.2, 4),
    probeX: clamp(i.probeX, -4, 4),
    probeY: clamp(i.probeY, -3, 3),
    testCharge: clamp(i.testCharge, -10e-6, 10e-6),
  };
}
function safeProbe(x: number, y: number, cx: number) {
  const dx = x - cx,
    dy = y,
    r = Math.hypot(dx, dy),
    minimum = 0.08;
  if (r >= minimum) return { x, y, blocked: false };
  const angle = r > 1e-9 ? Math.atan2(dy, dx) : Math.PI / 2;
  return {
    x: cx + minimum * Math.cos(angle),
    y: minimum * Math.sin(angle),
    blocked: true,
  };
}
export function fieldAndPotential(
  input: Pick<ElectrostaticInput, "charge1" | "charge2" | "separation">,
  x: number,
  y: number,
) {
  const sources = [
    { q: input.charge1, x: -input.separation / 2 },
    { q: input.charge2, x: input.separation / 2 },
  ];
  let ex = 0,
    ey = 0,
    potential = 0;
  for (const source of sources) {
    const dx = x - source.x,
      dy = y,
      r = Math.max(0.08, Math.hypot(dx, dy));
    potential += (COULOMB_CONSTANT * source.q) / r;
    ex += (COULOMB_CONSTANT * source.q * dx) / r ** 3;
    ey += (COULOMB_CONSTANT * source.q * dy) / r ** 3;
  }
  return {
    fieldX: ex,
    fieldY: ey,
    fieldMagnitude: Math.hypot(ex, ey),
    potential,
  };
}
export function computeElectrostatic(
  raw: ElectrostaticInput,
): ElectrostaticResult {
  const i = sanitizeElectrostaticInput(raw),
    p1 = safeProbe(i.probeX, i.probeY, -i.separation / 2),
    p2 = safeProbe(p1.x, p1.y, i.separation / 2),
    probe = { x: p2.x, y: p2.y, blocked: p1.blocked || p2.blocked },
    local = fieldAndPotential(i, probe.x, probe.y),
    reference = fieldAndPotential(i, 0, 2.5).potential,
    potentialEnergyChange = i.testCharge * (local.potential - reference);
  return {
    probeX: probe.x,
    probeY: probe.y,
    ...local,
    referencePotential: reference,
    workByField: -potentialEnergyChange,
    potentialEnergyChange,
    singularityPrevented: probe.blocked,
  };
}
