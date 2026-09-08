import { projectileFlight } from '../experiments/projectile-motion/projectile-motionSimulation';

export type ProjectileStudioInput = { speed: number; angle: number; gravity: number };
export const PROJECTILE_STUDIO_DEFAULTS: ProjectileStudioInput = { speed: 46.4, angle: 33, gravity: 9.81 };
const clamp = (n: number, lo: number, hi: number, fallback: number) => Math.min(hi, Math.max(lo, Number.isFinite(n) ? n : fallback));
export function sanitizeProjectileStudio(input: ProjectileStudioInput): ProjectileStudioInput {
  return { speed: Math.round(clamp(input.speed,10,100,46.4)*10)/10, angle: Math.round(clamp(input.angle,0,90,33)*10)/10, gravity: Math.round(clamp(input.gravity,1.62,24.79,9.81)*100)/100 };
}
export function projectileStudioFlight(raw: ProjectileStudioInput) {
  const input = sanitizeProjectileStudio(raw);
  const flight = projectileFlight({ speedMps: input.speed, angleDeg: input.angle, gravityMps2: input.gravity, heightM: 0, airResistance: false, dragCoefficient: 0 });
  const angle = input.angle * Math.PI / 180;
  const vx = input.angle === 90 ? 0 : input.speed * Math.cos(angle);
  const vy = input.angle === 0 ? 0 : input.speed * Math.sin(angle);
  // Exact endpoint handling removes the floating cosine residue at 90 degrees.
  return { ...flight, rangeM: input.angle === 90 ? 0 : flight.rangeM, vx, vy, peakTime: vy / input.gravity, input };
}
export function projectileStudioState(raw: ProjectileStudioInput, seconds: number) {
  const flight = projectileStudioFlight(raw);
  const t = clamp(seconds, 0, flight.timeS, 0);
  const vy = flight.vy - flight.input.gravity * t;
  return { t, x: flight.vx * t, y: t === flight.timeS ? 0 : Math.max(0, flight.vy*t - .5*flight.input.gravity*t*t), vx: flight.vx, vy, speed: Math.hypot(flight.vx, vy), ax: 0, ay: -flight.input.gravity };
}
