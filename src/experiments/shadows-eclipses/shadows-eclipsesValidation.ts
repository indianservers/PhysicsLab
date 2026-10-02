import { shadowsEclipsesBenchmarks } from "./shadows-eclipsesSimulation";

export const shadowsEclipsesValidation = shadowsEclipsesBenchmarks;
export const shadowsEclipsesValidated = shadowsEclipsesBenchmarks.every(
  (item) => item.pass,
);
