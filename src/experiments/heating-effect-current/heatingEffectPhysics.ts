export type WireMaterial = "Nichrome" | "Copper" | "Iron" | "Tungsten";

export type HeatingInput = {
  current: number;
  referenceResistance: number;
  material: WireMaterial;
  diameter: number;
  duration: number;
};

export type HeatingState = {
  elapsed: number;
  temperature: number;
  inputEnergy: number;
  heatLoss: number;
};

export type HeatingResult = {
  effectiveResistance: number;
  power: number;
  storedHeat: number;
  energyResidual: number;
  efficiency: number;
  meltingPoint: number;
  safeLimit: number;
  targetTemperature: number;
  status: "cool" | "warming" | "target" | "unsafe" | "melted";
};

export const AMBIENT_TEMPERATURE = 25;
export const THERMAL_CAPACITY = 42;
export const LOSS_COEFFICIENT = 0.24;
export const REFERENCE_DIAMETER_MM = 1;

export const MATERIALS: Record<
  WireMaterial,
  {
    resistanceFactor: number;
    alpha: number;
    meltingPoint: number;
    color: string;
  }
> = {
  Nichrome: {
    resistanceFactor: 1,
    alpha: 0.0004,
    meltingPoint: 1400,
    color: "#c26b3a",
  },
  Copper: {
    resistanceFactor: 0.12,
    alpha: 0.00393,
    meltingPoint: 1085,
    color: "#d97732",
  },
  Iron: {
    resistanceFactor: 0.58,
    alpha: 0.005,
    meltingPoint: 1538,
    color: "#8b9299",
  },
  Tungsten: {
    resistanceFactor: 0.78,
    alpha: 0.0045,
    meltingPoint: 3422,
    color: "#76727d",
  },
};

export const DEFAULT_HEATING_INPUT: HeatingInput = {
  current: 2,
  referenceResistance: 5,
  material: "Nichrome",
  diameter: 1,
  duration: 120,
};

export const INITIAL_HEATING_STATE: HeatingState = {
  elapsed: 0,
  temperature: AMBIENT_TEMPERATURE,
  inputEnergy: 0,
  heatLoss: 0,
};

export function normalizeHeatingInput(input: HeatingInput): HeatingInput {
  return {
    current: Math.max(
      0,
      Math.min(5, Number.isFinite(input.current) ? input.current : 2),
    ),
    referenceResistance: Math.max(
      0.5,
      Math.min(
        20,
        Number.isFinite(input.referenceResistance)
          ? input.referenceResistance
          : 5,
      ),
    ),
    material: input.material in MATERIALS ? input.material : "Nichrome",
    diameter: Math.max(
      0.2,
      Math.min(2, Number.isFinite(input.diameter) ? input.diameter : 1),
    ),
    duration: Math.round(
      Math.max(
        10,
        Math.min(300, Number.isFinite(input.duration) ? input.duration : 120),
      ),
    ),
  };
}

export function resistanceAtTemperature(
  input: HeatingInput,
  temperature: number,
) {
  const safe = normalizeHeatingInput(input);
  const material = MATERIALS[safe.material];
  const geometry = (REFERENCE_DIAMETER_MM / safe.diameter) ** 2;
  const temperatureFactor = Math.max(
    0.05,
    1 + material.alpha * (temperature - AMBIENT_TEMPERATURE),
  );
  return (
    safe.referenceResistance *
    material.resistanceFactor *
    geometry *
    temperatureFactor
  );
}

export function computeHeatingResult(
  input: HeatingInput,
  state: HeatingState,
): HeatingResult {
  const safe = normalizeHeatingInput(input);
  const material = MATERIALS[safe.material];
  const effectiveResistance = resistanceAtTemperature(safe, state.temperature);
  const power = safe.current ** 2 * effectiveResistance;
  const storedHeat =
    THERMAL_CAPACITY * (state.temperature - AMBIENT_TEMPERATURE);
  const energyResidual = state.inputEnergy - state.heatLoss - storedHeat;
  const efficiency = state.inputEnergy > 0 ? storedHeat / state.inputEnergy : 0;
  const safeLimit = Math.min(120, material.meltingPoint - 20);
  const targetTemperature = Math.min(60, safeLimit - 10);
  const status =
    state.temperature >= material.meltingPoint
      ? "melted"
      : state.temperature >= safeLimit
        ? "unsafe"
        : Math.abs(state.temperature - targetTemperature) <= 2
          ? "target"
          : state.temperature > AMBIENT_TEMPERATURE + 1
            ? "warming"
            : "cool";
  return {
    effectiveResistance,
    power,
    storedHeat,
    energyResidual,
    efficiency,
    meltingPoint: material.meltingPoint,
    safeLimit,
    targetTemperature,
    status,
  };
}

export function advanceHeating(
  input: HeatingInput,
  state: HeatingState,
  deltaSeconds: number,
  powered: boolean,
): HeatingState {
  const safe = normalizeHeatingInput(input);
  const dt = Math.max(0, Math.min(5, deltaSeconds));
  const resistance = resistanceAtTemperature(safe, state.temperature);
  const power = powered ? safe.current ** 2 * resistance : 0;
  const loss = Math.max(
    0,
    LOSS_COEFFICIENT * (state.temperature - AMBIENT_TEMPERATURE),
  );
  const netPower = power - loss;
  const material = MATERIALS[safe.material];
  const unclampedTemperature =
    state.temperature + (netPower * dt) / THERMAL_CAPACITY;
  const effectiveDt =
    powered && netPower > 0 && unclampedTemperature > material.meltingPoint
      ? ((material.meltingPoint - state.temperature) * THERMAL_CAPACITY) /
        netPower
      : dt;
  const storedDelta = netPower * effectiveDt;
  const nextTemperature = Math.max(
    AMBIENT_TEMPERATURE,
    state.temperature + storedDelta / THERMAL_CAPACITY,
  );
  return {
    elapsed: powered
      ? Math.min(safe.duration, state.elapsed + effectiveDt)
      : state.elapsed,
    temperature: nextTemperature,
    inputEnergy: state.inputEnergy + power * effectiveDt,
    heatLoss: state.heatLoss + loss * effectiveDt,
  };
}

export function simulateHeatingProfile(input: HeatingInput, step = 1) {
  const safe = normalizeHeatingInput(input);
  let state = INITIAL_HEATING_STATE;
  const points = [{ ...state, ...computeHeatingResult(safe, state) }];
  while (state.elapsed < safe.duration) {
    state = advanceHeating(
      safe,
      state,
      Math.min(step, safe.duration - state.elapsed),
      true,
    );
    points.push({ ...state, ...computeHeatingResult(safe, state) });
    if (state.temperature >= MATERIALS[safe.material].meltingPoint) break;
  }
  return points;
}
