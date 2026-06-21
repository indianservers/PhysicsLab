export const PLANCK_CONSTANT = 6.62607015e-34;
export const REDUCED_PLANCK_CONSTANT = 1.054571817e-34;
export const SPEED_OF_LIGHT = 299792458;
export const ELECTRON_CHARGE = 1.602176634e-19;
export const ELECTRON_MASS = 9.1093837015e-31;
export const ELECTRON_VOLT_J = 1.602176634e-19;
export const RYDBERG_ENERGY_EV = 13.6;
export const RYDBERG_CONSTANT = 1.0973731568508e7;

export const PHOTOELECTRIC_METALS = {
  Cesium: 2.1,
  Potassium: 2.25,
  Sodium: 2.3,
  Zinc: 4.3,
  Copper: 4.7,
  Gold: 5.1,
} as const;

export type PhotoelectricMetal = keyof typeof PHOTOELECTRIC_METALS;
