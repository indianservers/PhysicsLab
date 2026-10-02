import { lensFormulaBenchmarks } from "./lens-formulaSimulation";
export const lensFormulaValidation = lensFormulaBenchmarks;
export const lensFormulaValidated = lensFormulaBenchmarks.every(
  (item) => item.pass,
);
