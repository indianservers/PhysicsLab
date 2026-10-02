import { statusForBenchmarks } from "../shared/validation";
import { heatTemperatureBenchmarks } from "./heatTemperatureSimulation";

export const heatTemperatureValidation = heatTemperatureBenchmarks;
export const heatTemperatureIsValidated =
  statusForBenchmarks(heatTemperatureBenchmarks) === "validated";
