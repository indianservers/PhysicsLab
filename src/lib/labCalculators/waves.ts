import { assertDimensions, quantity } from "../units";

export function waveSpeed(frequency: number, wavelength: number) {
  return assertDimensions(quantity(frequency * wavelength, "m/s", "velocity"), "velocity", "waveSpeed");
}
