import { statusForBenchmarks } from "../shared/validation";
import { heatTransferBenchmarks } from "./heatTransferSimulation";

export const heatTransferValidation = heatTransferBenchmarks;
export const heatTransferIsValidated =
  statusForBenchmarks(heatTransferBenchmarks) === "validated";
