export interface MeterBridgeInput {
  knownResistance: number;
  unknownResistance: number;
  wireLengthCm: number;
  jockeyPositionCm: number;
  supplyVoltage: number;
}

export interface MeterBridgeResult {
  leftWireResistance: number;
  rightWireResistance: number;
  resistorJunctionPotential: number;
  wireContactPotential: number;
  galvanometerCurrent: number;
  galvanometerMicroamps: number;
  sourceCurrent: number;
  lengthRatio: number;
  resistanceRatio: number;
  calculatedUnknown: number;
  balancePositionCm: number;
  nullErrorCm: number;
  endpointLimited: boolean;
}

export const DEFAULT_METER_BRIDGE_INPUT: MeterBridgeInput = {
  knownResistance: 15,
  unknownResistance: 23.4,
  wireLengthCm: 100,
  jockeyPositionCm: 62.4,
  supplyVoltage: 2,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

export function normalizeMeterBridgeInput(
  input: MeterBridgeInput,
): MeterBridgeInput {
  const wireLengthCm = clamp(input.wireLengthCm, 50, 200);
  return {
    knownResistance: clamp(input.knownResistance, 1, 100),
    unknownResistance: clamp(input.unknownResistance, 1, 100),
    wireLengthCm,
    jockeyPositionCm: clamp(input.jockeyPositionCm, 0.5, wireLengthCm - 0.5),
    supplyVoltage: clamp(input.supplyVoltage, 0.5, 6),
  };
}

export function solveMeterBridge(raw: MeterBridgeInput): MeterBridgeResult {
  const input = normalizeMeterBridgeInput(raw);
  const endpointLimited =
    raw.jockeyPositionCm < 0.5 ||
    raw.jockeyPositionCm > input.wireLengthCm - 0.5;
  const resistancePerCm = 0.05;
  const leftWireResistance = input.jockeyPositionCm * resistancePerCm;
  const rightWireResistance =
    (input.wireLengthCm - input.jockeyPositionCm) * resistancePerCm;
  const galvanometerResistance = 2000;

  // The unknown X is the left gap and known R the right gap. Solve the two
  // bridge mid-point node potentials with the finite galvanometer connected.
  const a11 =
    1 / input.unknownResistance +
    1 / input.knownResistance +
    1 / galvanometerResistance;
  const a22 =
    1 / leftWireResistance +
    1 / rightWireResistance +
    1 / galvanometerResistance;
  const offDiagonal = -1 / galvanometerResistance;
  const b1 = input.supplyVoltage / input.unknownResistance;
  const b2 = input.supplyVoltage / leftWireResistance;
  const determinant = a11 * a22 - offDiagonal * offDiagonal;
  const resistorJunctionPotential = (b1 * a22 - offDiagonal * b2) / determinant;
  const wireContactPotential = (a11 * b2 - offDiagonal * b1) / determinant;
  const galvanometerCurrent =
    (resistorJunctionPotential - wireContactPotential) / galvanometerResistance;
  const sourceCurrent =
    (input.supplyVoltage - resistorJunctionPotential) /
      input.unknownResistance +
    (input.supplyVoltage - wireContactPotential) / leftWireResistance;
  const lengthRatio =
    input.jockeyPositionCm / (input.wireLengthCm - input.jockeyPositionCm);
  const resistanceRatio = input.unknownResistance / input.knownResistance;
  const balancePositionCm =
    (input.wireLengthCm * input.unknownResistance) /
    (input.knownResistance + input.unknownResistance);

  return {
    leftWireResistance,
    rightWireResistance,
    resistorJunctionPotential,
    wireContactPotential,
    galvanometerCurrent,
    galvanometerMicroamps: galvanometerCurrent * 1e6,
    sourceCurrent,
    lengthRatio,
    resistanceRatio,
    calculatedUnknown: input.knownResistance * lengthRatio,
    balancePositionCm,
    nullErrorCm: input.jockeyPositionCm - balancePositionCm,
    endpointLimited,
  };
}
