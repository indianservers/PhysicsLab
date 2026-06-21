import { ELECTRON_CHARGE, ELECTRON_MASS, ELECTRON_VOLT_J, PLANCK_CONSTANT, REDUCED_PLANCK_CONSTANT, RYDBERG_ENERGY_EV, SPEED_OF_LIGHT } from "./quantumConstants";

export function evToJ(ev: number) {
  return ev * ELECTRON_VOLT_J;
}

export function jToEv(j: number) {
  return j / ELECTRON_VOLT_J;
}

export function nmToM(nm: number) {
  return nm * 1e-9;
}

export function mToNm(m: number) {
  return m * 1e9;
}

export function frequencyToPhotonEnergyEv(frequencyHz: number) {
  return jToEv(PLANCK_CONSTANT * frequencyHz);
}

export function wavelengthNmToEnergyEv(wavelengthNm: number) {
  return jToEv((PLANCK_CONSTANT * SPEED_OF_LIGHT) / nmToM(wavelengthNm));
}

export function energyEvToWavelengthNm(energyEv: number) {
  if (energyEv <= 0) return Infinity;
  return mToNm((PLANCK_CONSTANT * SPEED_OF_LIGHT) / evToJ(energyEv));
}

export function bohrEnergyLevelEv(n: number) {
  return -RYDBERG_ENERGY_EV / (n * n);
}

export function bohrTransitionEnergyEv(initialN: number, finalN: number) {
  if (initialN <= finalN) return 0;
  return RYDBERG_ENERGY_EV * (1 / (finalN * finalN) - 1 / (initialN * initialN));
}

export function bohrSeries(finalN: number) {
  if (finalN === 1) return "Lyman";
  if (finalN === 2) return "Balmer";
  if (finalN === 3) return "Paschen";
  if (finalN === 4) return "Brackett";
  if (finalN === 5) return "Pfund";
  return `n=${finalN} series`;
}

export function tunnelingKappaPerMeter(energyEv: number, barrierEv: number, massMultiplier = 1) {
  const deltaJ = evToJ(Math.max(0, barrierEv - energyEv));
  if (deltaJ <= 0) return 0;
  return Math.sqrt(2 * ELECTRON_MASS * massMultiplier * deltaJ) / REDUCED_PLANCK_CONSTANT;
}

export function tunnelingTransmissionEstimate(energyEv: number, barrierEv: number, widthNm: number, massMultiplier = 1) {
  if (energyEv <= 0 || barrierEv <= 0 || widthNm <= 0) return 0;
  if (energyEv < barrierEv) {
    const kappa = tunnelingKappaPerMeter(energyEv, barrierEv, massMultiplier);
    return clamp(Math.exp(-2 * kappa * nmToM(widthNm)), 0, 1);
  }
  const mismatch = ((barrierEv * barrierEv) / (4 * energyEv * Math.max(0.0001, energyEv - barrierEv)));
  return clamp(1 / (1 + mismatch * 0.08), 0, 1);
}

export function formatScientific(value: number, unit = "") {
  if (!Number.isFinite(value)) return `-- ${unit}`.trim();
  return `${value.toExponential(3)}${unit ? ` ${unit}` : ""}`;
}

export function formatEnergyEv(value: number) {
  if (!Number.isFinite(value)) return "-- eV";
  return `${value.toFixed(Math.abs(value) >= 10 ? 1 : 2)} eV`;
}

export function formatWavelengthNm(value: number) {
  if (!Number.isFinite(value)) return "-- nm";
  return `${value.toFixed(value >= 100 ? 1 : 2)} nm`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
