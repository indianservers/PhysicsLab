import { runBenchmarkCases } from "../shared/validation";

export const PLANCK_EV_S = 4.135667696e-15;
export const LIGHT_M_S = 299792458;

export function photoelectricState(
  frequencyHz: number,
  workFunctionEv: number,
  intensityPercent: number,
  appliedVoltage: number,
) {
  const photonEnergyEv = PLANCK_EV_S * frequencyHz;
  const kineticMaxEv = Math.max(0, photonEnergyEv - workFunctionEv);
  const thresholdHz = workFunctionEv / PLANCK_EV_S;
  const stoppingPotentialV = kineticMaxEv;
  const saturationCurrentUa = kineticMaxEv > 0 ? intensityPercent * 0.18 : 0;
  const collection =
    stoppingPotentialV <= 0
      ? 0
      : appliedVoltage >= 0
        ? 1
        : Math.max(0, Math.min(1, 1 + appliedVoltage / stoppingPotentialV));
  return {
    photonEnergyEv,
    kineticMaxEv,
    thresholdHz,
    stoppingPotentialV,
    saturationCurrentUa,
    photocurrentUa: saturationCurrentUa * collection,
    emission: kineticMaxEv > 0 && intensityPercent > 0,
  };
}

export const frequencyFromWavelengthNm = (wavelengthNm: number) =>
  LIGHT_M_S / (wavelengthNm * 1e-9);
export const wavelengthNmFromFrequency = (frequencyHz: number) =>
  (LIGHT_M_S / frequencyHz) * 1e9;

export const photoelectricBenchmarks = runBenchmarkCases([
  {
    id: "pe-einstein",
    name: "Kmax equals hf minus phi",
    input: { f: 1e15, phi: 2, intensity: 50, v: 0 },
    expected: PLANCK_EV_S * 1e15 - 2,
    unit: "eV",
    tolerance: 1e-12,
    actual: (i) =>
      photoelectricState(i.f!, i.phi!, i.intensity!, i.v!).kineticMaxEv,
  },
  {
    id: "pe-threshold",
    name: "threshold frequency equals phi over h",
    input: { f: 5e14, phi: 4.31, intensity: 70, v: 0 },
    expected: 4.31 / PLANCK_EV_S,
    unit: "Hz",
    tolerance: 1e-3,
    actual: (i) =>
      photoelectricState(i.f!, i.phi!, i.intensity!, i.v!).thresholdHz,
  },
  {
    id: "pe-below-threshold",
    name: "below threshold emits no electrons",
    input: { f: 5e14, phi: 4.31, intensity: 100, v: 0 },
    expected: 0,
    unit: "eV",
    tolerance: 0,
    actual: (i) =>
      photoelectricState(i.f!, i.phi!, i.intensity!, i.v!).kineticMaxEv,
  },
  {
    id: "pe-intensity-ke",
    name: "intensity does not change maximum kinetic energy",
    input: { f: 1e15, phi: 2, intensity: 10, v: 0 },
    expected: 0,
    unit: "eV",
    tolerance: 1e-12,
    actual: (i) =>
      photoelectricState(i.f!, i.phi!, 10, i.v!).kineticMaxEv -
      photoelectricState(i.f!, i.phi!, 90, i.v!).kineticMaxEv,
  },
  {
    id: "pe-stopping",
    name: "negative stopping potential reduces current to zero",
    input: { f: 1e15, phi: 2, intensity: 80, v: 0 },
    expected: 0,
    unit: "microampere",
    tolerance: 1e-12,
    actual: (i) => {
      const s = photoelectricState(i.f!, i.phi!, i.intensity!, 0);
      return photoelectricState(
        i.f!,
        i.phi!,
        i.intensity!,
        -s.stoppingPotentialV,
      ).photocurrentUa;
    },
  },
]);
