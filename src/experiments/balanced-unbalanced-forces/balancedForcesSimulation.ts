export type Surface = "ice" | "wood" | "rubber";
export interface ForceInput {
  leftForceN: number;
  rightForceN: number;
  massKg: number;
  frictionCoefficient: number;
  surface: Surface;
}
export interface MotionState {
  positionM: number;
  velocityMps: number;
  timeS: number;
}
export const G = 9.80665;
export const surfaceFriction: Record<Surface, number> = {
  ice: 0.02,
  wood: 0.15,
  rubber: 0.35,
};

export function solveForceBalance(input: ForceInput, velocityMps: number) {
  const massKg = Math.max(1, Math.min(100, input.massKg));
  const leftForceN = Math.max(0, Math.min(300, input.leftForceN));
  const rightForceN = Math.max(0, Math.min(300, input.rightForceN));
  const muK = Math.max(0, Math.min(0.5, input.frictionCoefficient));
  const muS = Math.min(0.7, muK * 1.25);
  const appliedNetN = rightForceN - leftForceN;
  const normalN = massKg * G;
  let frictionN = 0;
  let regime: "static" | "kinetic" = "kinetic";
  if (Math.abs(velocityMps) > 1e-4)
    frictionN = -Math.sign(velocityMps) * muK * normalN;
  else if (Math.abs(appliedNetN) <= muS * normalN) {
    frictionN = -appliedNetN;
    regime = "static";
  } else frictionN = -Math.sign(appliedNetN) * muK * normalN;
  const netForceN = appliedNetN + frictionN;
  const accelerationMps2 = netForceN / massKg;
  return {
    massKg,
    leftForceN,
    rightForceN,
    appliedNetN,
    normalN,
    weightN: normalN,
    frictionN,
    netForceN,
    accelerationMps2,
    regime,
    balanced: Math.abs(netForceN) < 1e-9,
  };
}

export function stepMotion(
  input: ForceInput,
  state: MotionState,
  dt: number,
): MotionState {
  const solved = solveForceBalance(input, state.velocityMps);
  let velocityMps = state.velocityMps + solved.accelerationMps2 * dt;
  if (
    state.velocityMps !== 0 &&
    Math.sign(velocityMps) !== Math.sign(state.velocityMps) &&
    Math.abs(input.rightForceN - input.leftForceN) <=
      solved.normalN * input.frictionCoefficient * 1.25
  )
    velocityMps = 0;
  const positionM = state.positionM + velocityMps * dt;
  return {
    positionM: Math.max(-10, Math.min(10, positionM)),
    velocityMps,
    timeS: state.timeS + dt,
  };
}

export const balancedForcesBenchmarks = [
  {
    id: "newton",
    name: "Net force equals mass times acceleration",
    actual: solveForceBalance(
      {
        leftForceN: 20,
        rightForceN: 100,
        massKg: 20,
        frictionCoefficient: 0,
        surface: "ice",
      },
      0,
    ).accelerationMps2,
    expected: 4,
    tolerance: 1e-12,
    unit: "m/s²",
  },
  {
    id: "balanced-moving",
    name: "Balanced forces permit constant nonzero velocity",
    actual: solveForceBalance(
      {
        leftForceN: 100,
        rightForceN: 100,
        massKg: 40,
        frictionCoefficient: 0,
        surface: "ice",
      },
      2,
    ).accelerationMps2,
    expected: 0,
    tolerance: 1e-12,
    unit: "m/s²",
  },
  {
    id: "friction-direction",
    name: "Kinetic friction opposes rightward motion",
    actual: Math.sign(
      solveForceBalance(
        {
          leftForceN: 0,
          rightForceN: 0,
          massKg: 10,
          frictionCoefficient: 0.2,
          surface: "wood",
        },
        1,
      ).frictionN,
    ),
    expected: -1,
    tolerance: 0,
    unit: "direction",
  },
  {
    id: "static",
    name: "Static friction balances a small applied force",
    actual: solveForceBalance(
      {
        leftForceN: 10,
        rightForceN: 20,
        massKg: 20,
        frictionCoefficient: 0.2,
        surface: "wood",
      },
      0,
    ).netForceN,
    expected: 0,
    tolerance: 1e-12,
    unit: "N",
  },
  {
    id: "reverse",
    name: "Force reversal reverses acceleration without friction",
    actual: solveForceBalance(
      {
        leftForceN: 90,
        rightForceN: 30,
        massKg: 30,
        frictionCoefficient: 0,
        surface: "ice",
      },
      0,
    ).accelerationMps2,
    expected: -2,
    tolerance: 1e-12,
    unit: "m/s²",
  },
];
