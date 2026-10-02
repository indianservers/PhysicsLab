export type ChargeSpecies = "electron" | "proton";

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface LorentzInput {
  species: ChargeSpecies;
  speed: number;
  velocityAngleDeg: number;
  electricField: number;
  magneticField: number;
}

export interface ParticleState {
  position: Vec3;
  velocity: Vec3;
}

export const ELEMENTARY_CHARGE = 1.602176634e-19;
export const ELECTRON_MASS = 9.1093837139e-31;
export const PROTON_MASS = 1.67262192369e-27;

const add = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.x + b.x,
  y: a.y + b.y,
  z: a.z + b.z,
});
const scale = (a: Vec3, k: number): Vec3 => ({
  x: a.x * k,
  y: a.y * k,
  z: a.z * k,
});
const cross = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});
export const magnitude = (a: Vec3) => Math.hypot(a.x, a.y, a.z);

export function particleConstants(species: ChargeSpecies) {
  return species === "electron"
    ? { charge: -ELEMENTARY_CHARGE, mass: ELECTRON_MASS, label: "electron" }
    : { charge: ELEMENTARY_CHARGE, mass: PROTON_MASS, label: "proton" };
}

export function initialVelocity(speed: number, angleDeg: number): Vec3 {
  const angle = (Math.max(0, Math.min(180, angleDeg)) * Math.PI) / 180;
  return { x: speed * Math.sin(angle), y: 0, z: speed * Math.cos(angle) };
}

export function lorentzForce(
  charge: number,
  velocity: Vec3,
  electric: Vec3,
  magnetic: Vec3,
): Vec3 {
  return scale(add(electric, cross(velocity, magnetic)), charge);
}

function acceleration(input: LorentzInput, velocity: Vec3): Vec3 {
  const { charge, mass } = particleConstants(input.species);
  const force = lorentzForce(
    charge,
    velocity,
    { x: 0, y: input.electricField, z: 0 },
    { x: 0, y: 0, z: input.magneticField },
  );
  return scale(force, 1 / mass);
}

export function rk4Step(
  input: LorentzInput,
  state: ParticleState,
  dt: number,
): ParticleState {
  const a1 = acceleration(input, state.velocity);
  const v2 = add(state.velocity, scale(a1, dt / 2));
  const a2 = acceleration(input, v2);
  const v3 = add(state.velocity, scale(a2, dt / 2));
  const a3 = acceleration(input, v3);
  const v4 = add(state.velocity, scale(a3, dt));
  const a4 = acceleration(input, v4);
  const velocity = add(
    state.velocity,
    scale(add(add(a1, scale(a2, 2)), add(scale(a3, 2), a4)), dt / 6),
  );
  const position = add(
    state.position,
    scale(
      add(add(state.velocity, scale(v2, 2)), add(scale(v3, 2), v4)),
      dt / 6,
    ),
  );
  return { position, velocity };
}

export function solveLorentz(input: LorentzInput) {
  const speed = Math.max(1e4, Math.min(5e6, input.speed));
  const safeInput = { ...input, speed };
  const velocity = initialVelocity(speed, input.velocityAngleDeg);
  const electric = { x: 0, y: input.electricField, z: 0 };
  const magnetic = { x: 0, y: 0, z: input.magneticField };
  const { charge, mass } = particleConstants(input.species);
  const force = lorentzForce(charge, velocity, electric, magnetic);
  const perpendicularSpeed = Math.abs(velocity.x);
  const absB = Math.abs(input.magneticField);
  const radius =
    absB > 0 && perpendicularSpeed > 0
      ? (mass * perpendicularSpeed) / (Math.abs(charge) * absB)
      : Infinity;
  const period =
    absB > 0 ? (2 * Math.PI * mass) / (Math.abs(charge) * absB) : Infinity;
  const pitch = Number.isFinite(period)
    ? Math.abs(velocity.z) * period
    : Infinity;
  const selectorSpeed =
    absB > 0 ? Math.abs(input.electricField / input.magneticField) : Infinity;
  const magneticForce = lorentzForce(
    charge,
    velocity,
    { x: 0, y: 0, z: 0 },
    magnetic,
  );
  const electricForce = scale(electric, charge);
  const selectorResidual = Math.abs(
    input.electricField - velocity.x * input.magneticField,
  );
  const selectorPass =
    absB > 0 &&
    perpendicularSpeed > 0 &&
    selectorResidual <= Math.max(1, Math.abs(input.electricField) * 0.01);
  let trajectory:
    "straight" | "circular" | "helical" | "crossed-field" | "selector-pass";
  if (selectorPass) trajectory = "selector-pass";
  else if (Math.abs(input.electricField) > 1) trajectory = "crossed-field";
  else if (absB === 0 || perpendicularSpeed < speed * 1e-6)
    trajectory = "straight";
  else if (Math.abs(velocity.z) < speed * 1e-6) trajectory = "circular";
  else trajectory = "helical";

  return {
    input: safeInput,
    charge,
    mass,
    velocity,
    electric,
    magnetic,
    force,
    magneticForce,
    electricForce,
    forceMagnitude: magnitude(force),
    magneticForceMagnitude: magnitude(magneticForce),
    perpendicularSpeed,
    parallelSpeed: Math.abs(velocity.z),
    radius,
    period,
    pitch,
    selectorSpeed,
    selectorResidual,
    selectorPass,
    trajectory,
  };
}

export function simulateTrajectory(input: LorentzInput, steps = 240) {
  const solved = solveLorentz(input);
  const baseTime = Number.isFinite(solved.period)
    ? solved.period / 72
    : 0.24 / solved.input.speed;
  const dt = Math.min(baseTime, 0.004 / solved.input.speed);
  let state: ParticleState = {
    position: { x: -0.12, y: 0, z: 0 },
    velocity: solved.velocity,
  };
  const points = [state.position];
  for (let i = 0; i < steps; i += 1) {
    state = rk4Step(solved.input, state, dt);
    points.push(state.position);
  }
  return { points, dt, final: state, solved };
}

const proton: LorentzInput = {
  species: "proton",
  speed: 2e6,
  velocityAngleDeg: 90,
  electricField: 0,
  magneticField: 0.2,
};

export const lorentzForceBenchmarks = [
  {
    id: "vector-law",
    name: "F equals q times E plus v cross B",
    actual: solveLorentz(proton).force.y,
    expected: -ELEMENTARY_CHARGE * 2e6 * 0.2,
    tolerance: 1e-25,
    unit: "N",
  },
  {
    id: "sign-reversal",
    name: "Electron reverses the transverse force",
    actual:
      solveLorentz({ ...proton, species: "electron" }).force.y /
      solveLorentz(proton).force.y,
    expected: -1,
    tolerance: 1e-12,
    unit: "ratio",
  },
  {
    id: "radius",
    name: "Circular radius is mv over absolute q B",
    actual: solveLorentz(proton).radius,
    expected: (PROTON_MASS * 2e6) / (ELEMENTARY_CHARGE * 0.2),
    tolerance: 1e-12,
    unit: "m",
  },
  {
    id: "parallel-zero",
    name: "Parallel velocity has zero magnetic force",
    actual: solveLorentz({ ...proton, velocityAngleDeg: 0 })
      .magneticForceMagnitude,
    expected: 0,
    tolerance: 1e-30,
    unit: "N",
  },
  {
    id: "velocity-selector",
    name: "Crossed fields select speed E over B",
    actual: solveLorentz({ ...proton, electricField: 3e5, magneticField: 0.15 })
      .selectorSpeed,
    expected: 2e6,
    tolerance: 1e-9,
    unit: "m/s",
  },
];
