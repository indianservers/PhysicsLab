import { computePremiumMechanics } from "../shared/mechanicsPremiumLibrary";

export function simulateConservationOfEnergy(values: Record<string, number>) {
  return computePremiumMechanics("conservation-of-energy", values);
}
