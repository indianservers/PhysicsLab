import { deriveOrbit, EARTH_MASS, EARTH_RADIUS, GRAVITATIONAL_CONSTANT, initialOrbitState, stepOrbit, type SatelliteOrbitInput } from "./satelliteOrbitPhysics";
import { runBenchmarkCases } from "../shared/validation";

const earth400 = {
  planetMassEarths: 1,
  altitudeKm: 400,
  launchSpeedKmS: 7.672598648,
  directionDeg: 0,
  satelliteMassKg: 500,
};

export const satelliteOrbitBenchmarks = runBenchmarkCases<SatelliteOrbitInput>([
  {
    id: "earth-400-orbital-speed",
    name: "Circular speed at 400 km altitude",
    input: earth400,
    expected: Math.sqrt((GRAVITATIONAL_CONSTANT * EARTH_MASS) / (EARTH_RADIUS + 400_000)) / 1000,
    unit: "km/s",
    tolerance: 1e-8,
    actual: (input) => deriveOrbit(input, initialOrbitState(input)).circularSpeed / 1000,
  },
  {
    id: "earth-400-escape-speed",
    name: "Escape speed at 400 km altitude",
    input: earth400,
    expected: Math.sqrt((2 * GRAVITATIONAL_CONSTANT * EARTH_MASS) / (EARTH_RADIUS + 400_000)) / 1000,
    unit: "km/s",
    tolerance: 1e-8,
    actual: (input) => deriveOrbit(input, initialOrbitState(input)).escapeSpeed / 1000,
  },
  {
    id: "escape-over-orbit-ratio",
    name: "Escape speed is square root two times circular speed",
    input: earth400,
    expected: Math.SQRT2,
    unit: "ratio",
    tolerance: 1e-10,
    actual: (input) => {
      const result = deriveOrbit(input, initialOrbitState(input));
      return result.escapeSpeed / result.circularSpeed;
    },
  },
  {
    id: "bound-energy-negative",
    name: "Circular-orbit total energy is negative",
    input: earth400,
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) => Number(deriveOrbit(input, initialOrbitState(input)).totalEnergy < 0),
  },
  {
    id: "escape-energy-positive",
    name: "Above-escape total energy is positive",
    input: { ...earth400, launchSpeedKmS: 12 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) => Number(deriveOrbit(input, initialOrbitState(input)).totalEnergy > 0),
  },
  {
    id: "gravity-vector-inward",
    name: "Gravity accelerates toward the planet centre",
    input: { ...earth400, launchSpeedKmS: 0 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) => Number(stepOrbit(initialOrbitState(input), input, 1).vx < 0),
  },
]);
