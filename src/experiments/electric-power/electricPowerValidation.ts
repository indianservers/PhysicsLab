import { runBenchmarkCases } from "../shared/validation";
import {
  computeElectricPower,
  type ElectricPowerInput,
} from "./electricPowerPhysics";
const base: ElectricPowerInput = {
  voltage: 230,
  resistance: 46,
  operatingTimeHours: 2,
  appliance: "heater",
  fuseLimit: 10,
  enabled: true,
};
export const electricPowerBenchmarks = runBenchmarkCases([
  {
    id: "power-vi",
    name: "Power equals VI",
    input: base,
    expected: 1150,
    unit: "W",
    tolerance: 1e-12,
    actual: (i) => computeElectricPower(i).powerVI,
  },
  {
    id: "power-i2r",
    name: "Power equals I squared R",
    input: base,
    expected: 1150,
    unit: "W",
    tolerance: 1e-12,
    actual: (i) => computeElectricPower(i).powerI2R,
  },
  {
    id: "power-v2r",
    name: "Power equals V squared over R",
    input: base,
    expected: 1150,
    unit: "W",
    tolerance: 1e-12,
    actual: (i) => computeElectricPower(i).powerV2R,
  },
  {
    id: "energy-kwh",
    name: "Joules convert to kilowatt-hours",
    input: base,
    expected: 2.3,
    unit: "kWh",
    tolerance: 1e-12,
    actual: (i) => computeElectricPower(i).energyKWh,
  },
  {
    id: "overload",
    name: "Current above fuse limit trips overload",
    input: { ...base, fuseLimit: 4 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (i) => Number(computeElectricPower(i).overload),
  },
]);
