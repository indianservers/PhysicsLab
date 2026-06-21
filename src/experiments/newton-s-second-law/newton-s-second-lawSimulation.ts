import { computePremiumMechanics } from "../shared/mechanicsPremiumLibrary";

export function simulateNewtonsSecondLaw(values: Record<string, number>) {
  return computePremiumMechanics("newton-s-second-law", values);
}
