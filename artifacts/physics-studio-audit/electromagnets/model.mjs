// src/lib/electromagnetStudio.ts
var EM_DEFAULTS = { current: 2, turns: 800, gap: 5 };
var EM_MU0 = 4 * Math.PI * 1e-7;
var EM_CORE_LENGTH = 0.44;
var EM_CORE_SIDE = 0.02;
var EM_AREA = 4e-4;
var EM_MS = 12e5;
var EM_H0 = EM_MS / 1999;
var EM_RHO = 168e-10;
var EM_WIRE_DIAMETER = 95e-5;
var EM_PITCH = 1e-3;
var EM_WIND_LENGTH = 0.08;
var EM_PER_LAYER = 80;
var EM_PLAY_SECONDS = 4;
var EM_U_END = 14;
var EM_LOAD = 0.4;
var EM_ARMATURE_MASS = 0.12 * 0.02 * 0.02 * 7800;
function emSettings(v) {
  return { current: Number.isFinite(v.current) ? Math.max(0, Math.min(5, v.current)) : 2, turns: Number.isFinite(v.turns) ? Math.max(100, Math.min(2e3, Math.round(v.turns))) : 800, gap: Number.isFinite(v.gap) ? Math.max(0.5, Math.min(20, v.gap)) : 5 };
}
function emCoil(turns) {
  let remaining = turns, length = 0;
  const layers = [];
  for (let layer = 0; remaining > 0; layer++) {
    const n = Math.min(EM_PER_LAYER, remaining), offset = (layer + 0.5) * EM_PITCH;
    layers.push(n);
    length += n * (4 * EM_CORE_SIDE + 2 * Math.PI * offset);
    remaining -= n;
  }
  return { layers, length, resistance: EM_RHO * length / (Math.PI * (EM_WIRE_DIAMETER / 2) ** 2) };
}
function emB(H) {
  return EM_MU0 * (H + EM_MS * Math.tanh(H / EM_H0));
}
function emBPrime(H) {
  const t = Math.tanh(H / EM_H0);
  return EM_MU0 * (1 + EM_MS / EM_H0 * (1 - t * t));
}
function emH(input) {
  const v = emSettings(input);
  if (v.current === 0) return 0;
  const g = v.gap / 1e3, mmf = v.turns * v.current;
  let lo = 0, hi = mmf / EM_CORE_LENGTH;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (EM_CORE_LENGTH * mid + g * emB(mid) / EM_MU0 < mmf) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
var logcosh = (x) => {
  const a = Math.abs(x);
  return a < 1e-3 ? a * a / 2 - a ** 4 / 12 + a ** 6 / 45 : a + Math.log1p(Math.exp(-2 * a)) - Math.LN2;
};
function emSolution(input) {
  const v = emSettings(input), H = emH(v), B = emB(H), g = v.gap / 1e3, M = EM_MS * Math.tanh(H / EM_H0), prime = emBPrime(H), coil = emCoil(v.turns), flux = EM_AREA * B, linkage = v.turns * flux, coreEnergy = EM_AREA * EM_CORE_LENGTH * EM_MU0 * (H * H / 2 + EM_MS * (H * Math.tanh(H / EM_H0) - EM_H0 * logcosh(H / EM_H0))), gapEnergy = EM_AREA * g * B * B / (2 * EM_MU0), energy = coreEnergy + gapEnergy, coenergy = v.current * linkage - energy, inductance = v.turns * v.turns * EM_AREA * prime / (EM_CORE_LENGTH + g * prime / EM_MU0), force = EM_AREA * B * B / EM_MU0;
  return { ...v, g, H, B, M, sat: M / EM_MS * 100, force, power: coil.resistance * v.current * v.current, resistance: coil.resistance, wireLength: coil.length, layers: coil.layers, flux, linkage, coreEnergy, gapEnergy, energy, coenergy, inductance, holdingMargin: force - (EM_LOAD + EM_ARMATURE_MASS) * 9.80665 };
}
var G = [-0.8611363115940526, -0.3399810435848563, 0.3399810435848563, 0.8611363115940526];
var W = [0.3478548451374538, 0.6521451548625461, 0.6521451548625461, 0.3478548451374538];
function interval(input, a, b) {
  const R = emCoil(input.turns).resistance, mid = (a + b) / 2, h = (b - a) / 2;
  let time = 0, heat = 0, work = 0;
  for (let i = 0; i < 4; i++) {
    const u = mid + h * G[i], current = input.current * -Math.expm1(-u), s = emSolution({ ...input, current }), weight = h * W[i];
    time += weight * s.inductance / R;
    heat += weight * current * current * s.inductance;
    work += weight * input.current * current * s.inductance;
  }
  return { time, heat, work };
}
function emTrial(input, steps = 512) {
  const v = emSettings(input), nodes = [{ u: 0, time: 0, heat: 0, work: 0 }], R = emCoil(v.turns).resistance;
  if (v.current === 0) return { input: v, nodes, duration: 0, voltage: 0 };
  for (let i = 1; i <= steps; i++) {
    const a = nodes[i - 1], u = EM_U_END * i / steps, q = interval(v, a.u, u);
    nodes.push({ u, time: a.time + q.time, heat: a.heat + q.heat, work: a.work + q.work });
  }
  return { input: v, nodes, duration: nodes[nodes.length - 1].time, voltage: R * v.current };
}
function emFrame(input, trial, time, steady = false) {
  const v = emSettings(input);
  if (steady) return { ...emSolution(v), phase: "steady", time: 0, duration: trial.duration, voltage: trial.voltage, targetCurrent: v.current, sourceWork: null, heat: null, settled: true };
  if (v.current === 0) return { ...emSolution(v), phase: "energizing", time: 0, duration: 0, voltage: 0, targetCurrent: 0, sourceWork: 0, heat: 0, settled: true };
  const t = Math.max(0, Math.min(trial.duration, time)), nodes = trial.nodes;
  let lo = 0, hi = nodes.length - 1;
  while (hi - lo > 1) {
    const mid = lo + hi >> 1;
    if (nodes[mid].time < t) lo = mid;
    else hi = mid;
  }
  const a = nodes[lo], b = nodes[hi];
  let u = a.u + (b.u - a.u) * (t - a.time) / (b.time - a.time), left = a.u, right = b.u;
  for (let j = 0; j < 8; j++) {
    const q2 = interval(v, a.u, u), error = a.time + q2.time - t;
    if (Math.abs(error) < 1e-15) break;
    if (error > 0) right = u;
    else left = u;
    const s2 = emSolution({ ...v, current: v.current * -Math.expm1(-u) }), next = u - error / (s2.inductance / s2.resistance);
    u = next > left && next < right ? next : (left + right) / 2;
  }
  if (t === 0) u = 0;
  if (t >= trial.duration) u = EM_U_END;
  const q = interval(v, a.u, u), s = emSolution({ ...v, current: v.current * -Math.expm1(-u) });
  return { ...s, phase: "energizing", time: t, duration: trial.duration, voltage: trial.voltage, targetCurrent: v.current, sourceWork: a.work + q.work, heat: a.heat + q.heat, settled: t >= trial.duration - 1e-12 };
}
function emTurnPoint(r, t) {
  const a = EM_CORE_SIDE / 2, arc = Math.PI * r / 2;
  let s = (t % 1 + 1) % 1 * (8 * a + 2 * Math.PI * r);
  for (let side = 0; side < 4; side++) {
    if (s < 2 * a) {
      if (side === 0) return { y: a + r, z: -a + s };
      if (side === 1) return { y: a - s, z: a + r };
      if (side === 2) return { y: -a - r, z: a - s };
      return { y: -a + s, z: -a - r };
    }
    s -= 2 * a;
    if (s < arc) {
      const angle = side * Math.PI / 2 + s / r, cy = side === 0 || side === 3 ? a : -a, cz = side < 2 ? a : -a;
      return { y: cy + r * Math.cos(angle), z: cz + r * Math.sin(angle) };
    }
    s -= arc;
  }
  return { y: a + r, z: -a };
}
export {
  EM_AREA,
  EM_ARMATURE_MASS,
  EM_CORE_LENGTH,
  EM_CORE_SIDE,
  EM_DEFAULTS,
  EM_H0,
  EM_LOAD,
  EM_MS,
  EM_MU0,
  EM_PER_LAYER,
  EM_PITCH,
  EM_PLAY_SECONDS,
  EM_RHO,
  EM_U_END,
  EM_WIND_LENGTH,
  EM_WIRE_DIAMETER,
  emB,
  emBPrime,
  emCoil,
  emFrame,
  emH,
  emSettings,
  emSolution,
  emTrial,
  emTurnPoint
};
