import { statusForBenchmarks } from "../shared/validation";
import { echoSpeedSoundBenchmarks } from "./echoSpeedSoundSimulation";
export const echoSpeedSoundValidation = echoSpeedSoundBenchmarks;
export const echoSpeedSoundIsValidated =
  statusForBenchmarks(echoSpeedSoundBenchmarks) === "validated";
