import { runBenchmarkCases } from "../shared/validation";

export const PLANCK_J_S = 6.62607015e-34;
export const LIGHT_M_S = 299792458;
export const EV_J = 1.602176634e-19;
export const RYDBERG_EV = 13.605693122994;

export interface BohrTransitionInput {
  atomicNumber: number;
  initialLevel: number;
  finalLevel: number;
}

export const levelEnergyEv = (atomicNumber: number, level: number) =>
  (-RYDBERG_EV * atomicNumber ** 2) / level ** 2;

export function bohrTransition(input: BohrTransitionInput) {
  const initialEnergyEv = levelEnergyEv(input.atomicNumber, input.initialLevel);
  const finalEnergyEv = levelEnergyEv(input.atomicNumber, input.finalLevel);
  const atomEnergyChangeEv = finalEnergyEv - initialEnergyEv;
  const photonEnergyEv = Math.abs(atomEnergyChangeEv);
  const photonEnergyJ = photonEnergyEv * EV_J;
  const frequencyHz = photonEnergyJ / PLANCK_J_S;
  const wavelengthNm = (LIGHT_M_S / frequencyHz) * 1e9;
  return {
    initialEnergyEv,
    finalEnergyEv,
    atomEnergyChangeEv,
    photonEnergyEv,
    photonEnergyJ,
    frequencyHz,
    wavelengthNm,
    kind:
      atomEnergyChangeEv > 0
        ? "absorption"
        : atomEnergyChangeEv < 0
          ? "emission"
          : "none",
    visible: wavelengthNm >= 380 && wavelengthNm <= 750,
  } as const;
}

export const bohrModelBenchmarks = runBenchmarkCases<BohrTransitionInput>([
  {
    id: "bohr-ground",
    name: "Hydrogen ground-state energy",
    input: { atomicNumber: 1, initialLevel: 1, finalLevel: 2 },
    expected: -RYDBERG_EV,
    unit: "eV",
    tolerance: 1e-12,
    actual: (input) => bohrTransition(input).initialEnergyEv,
  },
  {
    id: "bohr-h-alpha",
    name: "Hydrogen H-alpha wavelength",
    input: { atomicNumber: 1, initialLevel: 3, finalLevel: 2 },
    expected: 656.112276419323,
    unit: "nm",
    tolerance: 1e-9,
    actual: (input) => bohrTransition(input).wavelengthNm,
  },
  {
    id: "bohr-energy-sign",
    name: "Inward transition lowers atom energy",
    input: { atomicNumber: 1, initialLevel: 4, finalLevel: 2 },
    expected: -2.551067460561375,
    unit: "eV",
    tolerance: 1e-12,
    actual: (input) => bohrTransition(input).atomEnergyChangeEv,
  },
  {
    id: "bohr-photon-identity",
    name: "Photon energy equals h frequency",
    input: { atomicNumber: 1, initialLevel: 4, finalLevel: 2 },
    expected: 0,
    unit: "J",
    tolerance: 1e-30,
    actual: (input) => {
      const t = bohrTransition(input);
      return t.photonEnergyJ - PLANCK_J_S * t.frequencyHz;
    },
  },
  {
    id: "bohr-z-squared",
    name: "Hydrogenic energy scales with Z squared",
    input: { atomicNumber: 2, initialLevel: 1, finalLevel: 2 },
    expected: -4 * RYDBERG_EV,
    unit: "eV",
    tolerance: 1e-12,
    actual: (input) => bohrTransition(input).initialEnergyEv,
  },
]);
