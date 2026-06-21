export const nmToMeters = (value: number) => value * 1e-9;
export const mmToMeters = (value: number) => value * 1e-3;
export const micrometerToMeters = (value: number) => value * 1e-6;
export const degreesToRadians = (value: number) => (value * Math.PI) / 180;

export function sinc(value: number) {
  if (Math.abs(value) < 1e-9) return 1;
  return Math.sin(value) / value;
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.hypot(x2 - x1, y2 - y1);
}

export function waveSpeed(frequency: number, wavelength: number) {
  return frequency * wavelength;
}

export function wavelengthFromSpeed(frequency: number, speed: number) {
  return speed / Math.max(1e-9, frequency);
}

export function singleSlitFirstMinimum(wavelengthNm: number, screenDistanceM: number, slitWidthMm: number) {
  return (nmToMeters(wavelengthNm) * screenDistanceM) / mmToMeters(slitWidthMm);
}

export function singleSlitCentralWidth(wavelengthNm: number, screenDistanceM: number, slitWidthMm: number) {
  return 2 * singleSlitFirstMinimum(wavelengthNm, screenDistanceM, slitWidthMm);
}

export function youngFringeWidth(wavelengthNm: number, screenDistanceM: number, slitSeparationMm: number) {
  return (nmToMeters(wavelengthNm) * screenDistanceM) / mmToMeters(slitSeparationMm);
}

export function chladniNodeScore(n: number, m: number) {
  return Math.max(0, n - 1) + Math.max(0, m - 1) + n * m;
}

export function detectorAmplitude(pathDifference: number, wavelength: number, phaseDifference = 0) {
  return Math.abs(2 * Math.cos((Math.PI * pathDifference) / Math.max(1e-9, wavelength) + phaseDifference / 2));
}
