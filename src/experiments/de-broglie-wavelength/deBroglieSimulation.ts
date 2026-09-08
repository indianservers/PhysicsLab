import { runBenchmarkCases } from "../shared/validation";

export const PLANCK = 6.62607015e-34;
export const ELEMENTARY_CHARGE = 1.602176634e-19;
export const ELECTRON_MASS = 9.1093837015e-31;

export const particles = {
  electron: { label: "Electron (e⁻)", massKg: ELECTRON_MASS, chargeE: -1 },
  proton: { label: "Proton (p⁺)", massKg: 1.67262192369e-27, chargeE: 1 },
  neutron: { label: "Neutron (n⁰)", massKg: 1.67492749804e-27, chargeE: 0 },
} as const;
export type ParticleKey = keyof typeof particles;

export function diffractionRadius(wavelengthPm: number, spacingNm: number, distanceM: number, order = 1) {
  const sine = order * wavelengthPm / (2000 * spacingNm);
  if (!Number.isFinite(sine) || sine < 0 || sine >= Math.SQRT1_2 || distanceM <= 0) return null;
  return distanceM * Math.tan(2 * Math.asin(sine));
}

export function matterWave(
  particle: ParticleKey,
  speedMps: number,
  spacingNm: number,
  screenDistanceM = 0.25,
) {
  const massKg = particles[particle].massKg;
  const momentum = massKg * speedMps;
  const wavelengthM = PLANCK / momentum;
  const spacingM = spacingNm * 1e-9;
  const angularSpacingRad = wavelengthM / spacingM;
  return {
    massKg,
    momentum,
    wavelengthM,
    wavelengthPm: wavelengthM * 1e12,
    kineticEnergyJ: 0.5 * massKg * speedMps ** 2,
    equivalentVoltageV: (0.5 * massKg * speedMps ** 2) / ELEMENTARY_CHARGE,
    angularSpacingRad,
    fringeSpacingMm: screenDistanceM * angularSpacingRad * 1e3,
    beta: speedMps / 299792458,
  };
}

export const electronSpeedFromVoltage = (voltageV: number) =>
  Math.sqrt((2 * ELEMENTARY_CHARGE * voltageV) / ELECTRON_MASS);

export const deBroglieBenchmarks = runBenchmarkCases([
  {
    id: "db-lambda-h-over-p",
    name: "lambda equals h over p",
    input: { particle: "electron" as ParticleKey, speed: 1e7, spacing: 0.335 },
    expected: 0,
    unit: "m",
    tolerance: 1e-25,
    actual: (i) =>
      matterWave(i.particle!, i.speed!, i.spacing!).wavelengthM -
      PLANCK / (ELECTRON_MASS * i.speed!),
  },
  {
    id: "db-electron-150v",
    name: "electron wavelength at 150 V",
    input: { voltage: 150 },
    expected: 100.13726081291121,
    unit: "pm",
    tolerance: 1e-9,
    actual: (i) =>
      matterWave("electron", electronSpeedFromVoltage(i.voltage!), 0.335)
        .wavelengthPm,
  },
  {
    id: "db-voltage-root",
    name: "quadrupling voltage halves wavelength",
    input: { voltage: 200 },
    expected: 0.5,
    unit: "ratio",
    tolerance: 1e-12,
    actual: (i) =>
      matterWave("electron", electronSpeedFromVoltage(i.voltage! * 4), 0.335)
        .wavelengthM /
      matterWave("electron", electronSpeedFromVoltage(i.voltage!), 0.335)
        .wavelengthM,
  },
  {
    id: "db-fringe-spacing",
    name: "fringe spacing is L lambda over d",
    input: { speed: 1e7, spacing: 0.4 },
    expected: 0,
    unit: "mm",
    tolerance: 1e-12,
    actual: (i) => {
      const w = matterWave("electron", i.speed!, i.spacing!);
      return (
        w.fringeSpacingMm - ((0.25 * w.wavelengthM) / (i.spacing! * 1e-9)) * 1e3
      );
    },
  },
  {
    id: "db-momentum",
    name: "momentum equals mv",
    input: { speed: 2e7 },
    expected: ELECTRON_MASS * 2e7,
    unit: "kg m/s",
    tolerance: 1e-35,
    actual: (i) => matterWave("electron", i.speed!, 0.335).momentum,
  },
]);
