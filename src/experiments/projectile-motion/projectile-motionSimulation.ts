import { computePremiumMechanics } from "../shared/mechanicsPremiumLibrary";

export function simulateProjectileMotion(values: Record<string, number>) {
  return computePremiumMechanics("projectile-motion", values);
}
