import { runBenchmarkCases } from "../shared/validation";

export type CelestialBody = "Moon" | "Mars" | "Earth" | "Jupiter";
export interface MassWeightInput {
  massKg: number;
  body: CelestialBody;
  altitudeKm: number;
  elevatorAccelerationMps2: number;
}
export const bodyData: Record<
  CelestialBody,
  { gravity: number; radiusKm: number }
> = {
  Moon: { gravity: 1.62, radiusKm: 1737.4 },
  Mars: { gravity: 3.71, radiusKm: 3389.5 },
  Earth: { gravity: 9.81, radiusKm: 6371 },
  Jupiter: { gravity: 24.79, radiusKm: 69911 },
};
export function massWeightState(input: MassWeightInput) {
  const body = bodyData[input.body];
  const localGravityMps2 =
    body.gravity * (body.radiusKm / (body.radiusKm + input.altitudeKm)) ** 2;
  const trueWeightN = input.massKg * localGravityMps2;
  const apparentWeightN = Math.max(
    0,
    input.massKg * (localGravityMps2 + input.elevatorAccelerationMps2),
  );
  return {
    localGravityMps2,
    trueWeightN,
    apparentWeightN,
    massKg: input.massKg,
    weightless: apparentWeightN === 0,
  };
}
const E: MassWeightInput = {
  massKg: 2,
  body: "Earth",
  altitudeKm: 0,
  elevatorAccelerationMps2: 0,
};
export const massWeightBenchmarks = runBenchmarkCases<MassWeightInput>([
  {
    id: "earth-weight",
    name: "Weight equals mg",
    input: E,
    expected: 19.62,
    unit: "N",
    tolerance: 1e-12,
    actual: (i) => massWeightState(i).trueWeightN,
  },
  {
    id: "mass-invariant",
    name: "Mass is invariant across bodies",
    input: { ...E, body: "Moon" },
    expected: 2,
    unit: "kg",
    tolerance: 0,
    actual: (i) => massWeightState(i).massKg,
  },
  {
    id: "elevator-up",
    name: "Upward elevator apparent weight",
    input: { ...E, elevatorAccelerationMps2: 2 },
    expected: 23.62,
    unit: "N",
    tolerance: 1e-12,
    actual: (i) => massWeightState(i).apparentWeightN,
  },
  {
    id: "elevator-down",
    name: "Downward elevator apparent weight",
    input: { ...E, elevatorAccelerationMps2: -2 },
    expected: 15.62,
    unit: "N",
    tolerance: 1e-12,
    actual: (i) => massWeightState(i).apparentWeightN,
  },
  {
    id: "freefall",
    name: "Free fall apparent weight is zero",
    input: { ...E, elevatorAccelerationMps2: -9.81 },
    expected: 0,
    unit: "N",
    tolerance: 1e-12,
    actual: (i) => massWeightState(i).apparentWeightN,
  },
]);
