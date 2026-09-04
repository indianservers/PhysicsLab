export type NetworkTopology = "series" | "parallel";

export interface NetworkInput {
  voltage: number;
  resistors: [number, number, number];
  switches: [boolean, boolean, boolean];
  topology: NetworkTopology;
}

export const DEFAULT_NETWORK_INPUT: NetworkInput = {
  voltage: 12,
  resistors: [2, 3, 6],
  switches: [true, true, true],
  topology: "series",
};

export function solveNetwork(input: NetworkInput) {
  const active = input.resistors
    .map((resistance, index) => ({ resistance, index }))
    .filter(({ index }) => input.switches[index]);
  const equivalentResistance =
    active.length === 0
      ? Infinity
      : input.topology === "series"
        ? active.reduce((sum, item) => sum + item.resistance, 0)
        : 1 / active.reduce((sum, item) => sum + 1 / item.resistance, 0);
  const totalCurrent = Number.isFinite(equivalentResistance)
    ? input.voltage / equivalentResistance
    : 0;
  const branchCurrents = input.resistors.map((resistance, index) =>
    !input.switches[index]
      ? 0
      : input.topology === "series"
        ? totalCurrent
        : input.voltage / resistance,
  ) as [number, number, number];
  const voltageDrops = input.resistors.map((resistance, index) =>
    !input.switches[index]
      ? 0
      : input.topology === "series"
        ? totalCurrent * resistance
        : input.voltage,
  ) as [number, number, number];
  const resistorPower = input.resistors.reduce(
    (sum, resistance, index) => sum + branchCurrents[index] ** 2 * resistance,
    0,
  );
  return {
    equivalentResistance,
    totalCurrent,
    branchCurrents,
    voltageDrops,
    sourcePower: input.voltage * totalCurrent,
    resistorPower,
    kclResidual:
      input.topology === "parallel"
        ? totalCurrent -
          branchCurrents.reduce((sum, current) => sum + current, 0)
        : 0,
    powerResidual: input.voltage * totalCurrent - resistorPower,
    activeCount: active.length,
  };
}
