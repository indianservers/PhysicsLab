import { statusForBenchmarks } from "../shared/validation";
import { gasLawsBenchmarks } from "./gas-lawsSimulation";

export const gasLawsValidation = gasLawsBenchmarks;
export const gasLawsValidated =
  statusForBenchmarks(gasLawsBenchmarks) === "validated";
