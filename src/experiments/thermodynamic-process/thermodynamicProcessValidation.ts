import { statusForBenchmarks } from "../shared/validation";
import { thermodynamicProcessBenchmarks } from "./thermodynamicProcessSimulation";

export const thermodynamicProcessValidation = thermodynamicProcessBenchmarks;
export const thermodynamicProcessIsValidated =
  statusForBenchmarks(thermodynamicProcessBenchmarks) === "validated";

