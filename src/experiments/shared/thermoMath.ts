export const GAS_R = 8.314462618;

export function idealGasPressure(moles: number, temperatureK: number, volumeM3: number) {
  return (moles * GAS_R * temperatureK) / Math.max(0.000001, volumeM3);
}

export function celsiusToKelvin(celsius: number) {
  return celsius + 273.15;
}

export function particleSpeedScale(temperatureK: number) {
  return Math.sqrt(Math.max(0, temperatureK) / 300);
}
