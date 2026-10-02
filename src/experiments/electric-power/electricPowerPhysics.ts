export type Appliance = "lamp" | "fan" | "kettle" | "heater" | "television" | "refrigerator" | "iron";
export const APPLIANCES: Record<
  Appliance,
  { label: string; ratedPower: number; resistance: number }
> = {
  lamp: {
    label: "Living room lamp",
    ratedPower: 60,
    resistance: 230 ** 2 / 60,
  },
  fan: { label: "Ceiling fan", ratedPower: 75, resistance: 230 ** 2 / 75 },
  kettle: {
    label: "Electric kettle",
    ratedPower: 2000,
    resistance: 230 ** 2 / 2000,
  },
  heater: {
    label: "Room heater",
    ratedPower: 1500,
    resistance: 230 ** 2 / 1500,
  },
  television: { label: "Television", ratedPower: 120, resistance: 230 ** 2 / 120 },
  refrigerator: { label: "Refrigerator", ratedPower: 180, resistance: 230 ** 2 / 180 },
  iron: { label: "Clothes iron", ratedPower: 1100, resistance: 230 ** 2 / 1100 },
};

export interface ElectricPowerInput {
  voltage: number;
  resistance: number;
  operatingTimeHours: number;
  appliance: Appliance;
  fuseLimit: number;
  enabled: boolean;
}
export interface ElectricPowerResult {
  current: number;
  powerVI: number;
  powerI2R: number;
  powerV2R: number;
  energyJ: number;
  energyKWh: number;
  heatJ: number;
  overload: boolean;
}
const clamp = (v: number, min: number, max: number) =>
  Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : min;
export function sanitizeElectricPowerInput(
  input: ElectricPowerInput,
): ElectricPowerInput {
  return {
    voltage: clamp(input.voltage, 0, 240),
    resistance: clamp(input.resistance, 1, 1000),
    operatingTimeHours: clamp(input.operatingTimeHours, 0, 24),
    appliance: input.appliance,
    fuseLimit: clamp(input.fuseLimit, 1, 20),
    enabled: Boolean(input.enabled),
  };
}
export function computeElectricPower(
  raw: ElectricPowerInput,
): ElectricPowerResult {
  const input = sanitizeElectricPowerInput(raw);
  const current = input.enabled ? input.voltage / input.resistance : 0;
  const powerVI = input.voltage * current;
  const powerI2R = current ** 2 * input.resistance;
  const powerV2R = input.enabled ? input.voltage ** 2 / input.resistance : 0;
  const energyJ = powerVI * input.operatingTimeHours * 3600;
  return {
    current,
    powerVI,
    powerI2R,
    powerV2R,
    energyJ,
    energyKWh: energyJ / 3.6e6,
    heatJ: energyJ,
    overload: current > input.fuseLimit,
  };
}
