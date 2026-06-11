import { assertDimensions, quantity } from "../units";
import { physicsConstants } from "../physicsConstants";

export function idealGasPressure(moles: number, temperatureKelvin: number, volume: number) {
  if (volume <= 0 || temperatureKelvin < 0) throw new Error("Volume must be positive and temperature must be absolute.");
  return assertDimensions(quantity((moles * physicsConstants.R.value * temperatureKelvin) / volume, "Pa", "pressure"), "pressure", "idealGasPressure");
}
