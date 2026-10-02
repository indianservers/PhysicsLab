import { runBenchmarkCases } from "../shared/validation";

export const GAS_CONSTANT = 8.31446261815324;
export const BOLTZMANN_CONSTANT = 1.380649e-23;
export const AIR_MOLAR_MASS_KG_MOL = 0.02897;
export const REFERENCE_PRESSURE_KPA = 101.325;
export const REFERENCE_TEMPERATURE_K = 350;
export const REFERENCE_VOLUME_L = 2.5;
export const REFERENCE_PARTICLES = 200;

// One drawn particle is a packet representing many real molecules. This scale
// makes the mockup's 200-particle, 350 K, 2.50 L state equal one atmosphere.
export const MOLES_PER_DISPLAY_PARTICLE =
  (REFERENCE_PRESSURE_KPA * REFERENCE_VOLUME_L) /
  (REFERENCE_PARTICLES * GAS_CONSTANT * REFERENCE_TEMPERATURE_K);

export type GasProcessMode = "isothermal" | "isobaric" | "isochoric";

export interface GasStateInput {
  mode: GasProcessMode;
  requestedTemperatureK: number;
  requestedVolumeL: number;
  particleCount: number;
  lockedTemperatureK: number;
  lockedPressureKPa: number;
  lockedVolumeL: number;
}

export interface GasState {
  mode: GasProcessMode;
  temperatureK: number;
  volumeL: number;
  volumeM3: number;
  pressureKPa: number;
  amountMol: number;
  moleculeEquivalent: number;
  meanSpeedMS: number;
  rmsSpeedMS: number;
  meanKineticEnergyJ: number;
  collisionIndex: number;
  invariantValue: number;
  invariantLabel: string;
  invariantUnit: string;
}

const finitePositive = (value: number, name: string) => {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be finite and greater than zero.`);
  }
  return value;
};

export const molesFromDisplayParticles = (particleCount: number) =>
  finitePositive(particleCount, "Particle count") * MOLES_PER_DISPLAY_PARTICLE;

/** In kPa because one kPa·L is exactly one joule. */
export const idealGasPressureKPa = (
  amountMol: number,
  temperatureK: number,
  volumeL: number,
) =>
  (finitePositive(amountMol, "Amount") *
    GAS_CONSTANT *
    finitePositive(temperatureK, "Absolute temperature")) /
  finitePositive(volumeL, "Volume");

export const meanMolecularSpeedMS = (
  temperatureK: number,
  molarMassKgMol = AIR_MOLAR_MASS_KG_MOL,
) =>
  Math.sqrt(
    (8 * GAS_CONSTANT * finitePositive(temperatureK, "Absolute temperature")) /
      (Math.PI * finitePositive(molarMassKgMol, "Molar mass")),
  );

export const rmsMolecularSpeedMS = (
  temperatureK: number,
  molarMassKgMol = AIR_MOLAR_MASS_KG_MOL,
) =>
  Math.sqrt(
    (3 * GAS_CONSTANT * finitePositive(temperatureK, "Absolute temperature")) /
      finitePositive(molarMassKgMol, "Molar mass"),
  );

export const meanTranslationalKineticEnergyJ = (temperatureK: number) =>
  1.5 *
  BOLTZMANN_CONSTANT *
  finitePositive(temperatureK, "Absolute temperature");

export const maxwellSpeedDensity = (
  speedMS: number,
  temperatureK: number,
  molarMassKgMol = AIR_MOLAR_MASS_KG_MOL,
) => {
  const speed = Math.max(0, speedMS);
  const temperature = finitePositive(temperatureK, "Absolute temperature");
  const mass = finitePositive(molarMassKgMol, "Molar mass");
  const coefficient =
    4 *
    Math.PI *
    Math.pow(mass / (2 * Math.PI * GAS_CONSTANT * temperature), 1.5);
  return (
    coefficient *
    speed *
    speed *
    Math.exp((-mass * speed * speed) / (2 * GAS_CONSTANT * temperature))
  );
};

export function solveGasState(input: GasStateInput): GasState {
  const amountMol = molesFromDisplayParticles(input.particleCount);
  let temperatureK = finitePositive(
    input.requestedTemperatureK,
    "Absolute temperature",
  );
  let volumeL = finitePositive(input.requestedVolumeL, "Volume");

  if (input.mode === "isothermal") {
    temperatureK = finitePositive(
      input.lockedTemperatureK,
      "Locked temperature",
    );
  } else if (input.mode === "isobaric") {
    const pressure = finitePositive(input.lockedPressureKPa, "Locked pressure");
    volumeL = (amountMol * GAS_CONSTANT * temperatureK) / pressure;
  } else {
    volumeL = finitePositive(input.lockedVolumeL, "Locked volume");
  }

  const pressureKPa = idealGasPressureKPa(amountMol, temperatureK, volumeL);
  const meanSpeedMS = meanMolecularSpeedMS(temperatureK);
  const invariant =
    input.mode === "isothermal"
      ? {
          value: pressureKPa * volumeL,
          label: "PV",
          unit: "kPa·L = J",
        }
      : input.mode === "isobaric"
        ? { value: volumeL / temperatureK, label: "V/T", unit: "L/K" }
        : {
            value: pressureKPa / temperatureK,
            label: "P/T",
            unit: "kPa/K",
          };

  return {
    mode: input.mode,
    temperatureK,
    volumeL,
    volumeM3: volumeL / 1000,
    pressureKPa,
    amountMol,
    moleculeEquivalent: amountMol * 6.02214076e23,
    meanSpeedMS,
    rmsSpeedMS: rmsMolecularSpeedMS(temperatureK),
    meanKineticEnergyJ: meanTranslationalKineticEnergyJ(temperatureK),
    collisionIndex:
      (input.particleCount / REFERENCE_PARTICLES) *
      (meanSpeedMS / meanMolecularSpeedMS(REFERENCE_TEMPERATURE_K)) *
      Math.pow(REFERENCE_VOLUME_L / volumeL, 1 / 3),
    invariantValue: invariant.value,
    invariantLabel: invariant.label,
    invariantUnit: invariant.unit,
  };
}

export const processWorkJ = (
  mode: GasProcessMode,
  amountMol: number,
  initialTemperatureK: number,
  initialPressureKPa: number,
  initialVolumeL: number,
  finalVolumeL: number,
) => {
  if (mode === "isochoric") return 0;
  if (mode === "isobaric") {
    return initialPressureKPa * (finalVolumeL - initialVolumeL);
  }
  return (
    amountMol *
    GAS_CONSTANT *
    initialTemperatureK *
    Math.log(finalVolumeL / initialVolumeL)
  );
};

export const gasLawsBenchmarks = runBenchmarkCases([
  {
    id: "reference-state",
    name: "Reference state is one atmosphere",
    input: { particles: 200, temperatureK: 350, volumeL: 2.5 },
    expected: REFERENCE_PRESSURE_KPA,
    unit: "kPa",
    tolerance: 1e-9,
    actual: ({ particles, temperatureK, volumeL }) =>
      idealGasPressureKPa(
        molesFromDisplayParticles(Number(particles)),
        Number(temperatureK),
        Number(volumeL),
      ),
  },
  {
    id: "boyle-law",
    name: "Isothermal halving of volume doubles pressure",
    input: { amountMol: 0.1, temperatureK: 350, v1: 4, v2: 2 },
    expected: 2,
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ amountMol, temperatureK, v1, v2 }) =>
      idealGasPressureKPa(Number(amountMol), Number(temperatureK), Number(v2)) /
      idealGasPressureKPa(Number(amountMol), Number(temperatureK), Number(v1)),
  },
  {
    id: "charles-law",
    name: "At constant pressure volume is proportional to Kelvin temperature",
    input: { amountMol: 0.1, pressureKPa: 100, t1: 250, t2: 500 },
    expected: 2,
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ amountMol, pressureKPa, t1, t2 }) =>
      (Number(amountMol) * GAS_CONSTANT * Number(t2)) /
      Number(pressureKPa) /
      ((Number(amountMol) * GAS_CONSTANT * Number(t1)) / Number(pressureKPa)),
  },
  {
    id: "pressure-law",
    name: "At constant volume pressure is proportional to Kelvin temperature",
    input: { amountMol: 0.1, volumeL: 2, t1: 300, t2: 600 },
    expected: 2,
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ amountMol, volumeL, t1, t2 }) =>
      idealGasPressureKPa(Number(amountMol), Number(t2), Number(volumeL)) /
      idealGasPressureKPa(Number(amountMol), Number(t1), Number(volumeL)),
  },
  {
    id: "kinetic-energy",
    name: "Mean translational energy is three halves kBT",
    input: { temperatureK: 400 },
    expected: 1.5 * BOLTZMANN_CONSTANT * 400,
    unit: "J molecule^-1",
    tolerance: 1e-32,
    actual: ({ temperatureK }) =>
      meanTranslationalKineticEnergyJ(Number(temperatureK)),
  },
  {
    id: "speed-temperature",
    name: "Molecular speed scales as square root of Kelvin temperature",
    input: { t1: 300, t2: 600 },
    expected: Math.sqrt(2),
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ t1, t2 }) =>
      meanMolecularSpeedMS(Number(t2)) / meanMolecularSpeedMS(Number(t1)),
  },
]);

export const simulateGasLaws = solveGasState;
