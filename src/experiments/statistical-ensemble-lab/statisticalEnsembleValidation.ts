import { statusForBenchmarks } from "../shared/validation";
import { statisticalEnsembleBenchmarks } from "./statisticalEnsembleSimulation";

export const statisticalEnsembleValidation = statisticalEnsembleBenchmarks;
export const statisticalEnsembleIsValidated =
  statusForBenchmarks(statisticalEnsembleBenchmarks) === "validated";
