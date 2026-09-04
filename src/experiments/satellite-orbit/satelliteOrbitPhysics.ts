export const GRAVITATIONAL_CONSTANT = 6.67430e-11;
export const EARTH_MASS = 5.972e24;
export const EARTH_RADIUS = 6_371_000;

export interface SatelliteOrbitInput {
  planetMassEarths: number;
  altitudeKm: number;
  launchSpeedKmS: number;
  directionDeg: number;
  satelliteMassKg: number;
}

export interface OrbitVectorState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  elapsed: number;
}

export type OrbitRegime = "collision" | "elliptical" | "circular" | "escape";

export interface OrbitDerived {
  mu: number;
  radius: number;
  speed: number;
  circularSpeed: number;
  escapeSpeed: number;
  period: number;
  acceleration: number;
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
  specificEnergy: number;
  angularMomentum: number;
  eccentricity: number;
  periapsis: number;
  regime: OrbitRegime;
}

export function clampOrbitInput(input: SatelliteOrbitInput): SatelliteOrbitInput {
  return {
    planetMassEarths: clamp(input.planetMassEarths, 0.2, 3),
    altitudeKm: clamp(input.altitudeKm, 200, 36_000),
    launchSpeedKmS: clamp(input.launchSpeedKmS, 0, 30),
    directionDeg: clamp(input.directionDeg, -90, 90),
    satelliteMassKg: clamp(input.satelliteMassKg, 100, 10_000),
  };
}

export function initialOrbitState(rawInput: SatelliteOrbitInput): OrbitVectorState {
  const input = clampOrbitInput(rawInput);
  const radius = EARTH_RADIUS + input.altitudeKm * 1000;
  const speed = input.launchSpeedKmS * 1000;
  const theta = (input.directionDeg * Math.PI) / 180;
  return {
    x: radius,
    y: 0,
    vx: speed * Math.sin(theta),
    vy: speed * Math.cos(theta),
    elapsed: 0,
  };
}

export function deriveOrbit(rawInput: SatelliteOrbitInput, state = initialOrbitState(rawInput)): OrbitDerived {
  const input = clampOrbitInput(rawInput);
  const mu = GRAVITATIONAL_CONSTANT * EARTH_MASS * input.planetMassEarths;
  const radius = Math.hypot(state.x, state.y);
  const speed = Math.hypot(state.vx, state.vy);
  const specificEnergy = 0.5 * speed ** 2 - mu / radius;
  const angularMomentumSigned = state.x * state.vy - state.y * state.vx;
  const angularMomentum = Math.abs(angularMomentumSigned);
  const rv = state.x * state.vx + state.y * state.vy;
  const ex = ((speed ** 2 - mu / radius) * state.x - rv * state.vx) / mu;
  const ey = ((speed ** 2 - mu / radius) * state.y - rv * state.vy) / mu;
  const eccentricity = Math.hypot(ex, ey);
  const periapsis = angularMomentum === 0 ? 0 : (angularMomentum ** 2 / mu) / (1 + eccentricity);
  const circularSpeed = Math.sqrt(mu / radius);
  const escapeSpeed = Math.sqrt((2 * mu) / radius);
  const angleIsTangent = Math.abs(input.directionDeg) <= 1.5;
  let regime: OrbitRegime;
  if (specificEnergy >= 0) regime = "escape";
  else if (periapsis <= EARTH_RADIUS) regime = "collision";
  else if (Math.abs(speed - circularSpeed) / circularSpeed <= 0.002 && angleIsTangent) regime = "circular";
  else regime = "elliptical";

  return {
    mu,
    radius,
    speed,
    circularSpeed,
    escapeSpeed,
    period: 2 * Math.PI * Math.sqrt(radius ** 3 / mu),
    acceleration: mu / radius ** 2,
    kineticEnergy: 0.5 * input.satelliteMassKg * speed ** 2,
    potentialEnergy: -(mu * input.satelliteMassKg) / radius,
    totalEnergy: input.satelliteMassKg * specificEnergy,
    specificEnergy,
    angularMomentum: angularMomentumSigned,
    eccentricity,
    periapsis,
    regime,
  };
}

export function stepOrbit(state: OrbitVectorState, input: SatelliteOrbitInput, dtSeconds: number): OrbitVectorState {
  const mu = GRAVITATIONAL_CONSTANT * EARTH_MASS * clampOrbitInput(input).planetMassEarths;
  const acceleration = (x: number, y: number) => {
    const r = Math.max(EARTH_RADIUS * 0.25, Math.hypot(x, y));
    const factor = -mu / r ** 3;
    return { ax: factor * x, ay: factor * y };
  };
  const a0 = acceleration(state.x, state.y);
  const x = state.x + state.vx * dtSeconds + 0.5 * a0.ax * dtSeconds ** 2;
  const y = state.y + state.vy * dtSeconds + 0.5 * a0.ay * dtSeconds ** 2;
  const a1 = acceleration(x, y);
  return {
    x,
    y,
    vx: state.vx + 0.5 * (a0.ax + a1.ax) * dtSeconds,
    vy: state.vy + 0.5 * (a0.ay + a1.ay) * dtSeconds,
    elapsed: state.elapsed + dtSeconds,
  };
}

export function buildSpeedCurves(planetMassEarths: number) {
  const mu = GRAVITATIONAL_CONSTANT * EARTH_MASS * clamp(planetMassEarths, 0.2, 3);
  return Array.from({ length: 42 }, (_, index) => {
    const altitudeKm = 200 * (36_000 / 200) ** (index / 41);
    const radius = EARTH_RADIUS + altitudeKm * 1000;
    return {
      altitudeKm,
      circularKmS: Math.sqrt(mu / radius) / 1000,
      escapeKmS: Math.sqrt((2 * mu) / radius) / 1000,
    };
  });
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}
