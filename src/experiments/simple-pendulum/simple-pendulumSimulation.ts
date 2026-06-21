import { computePremiumMechanics } from "../shared/mechanicsPremiumLibrary";

export function simulateSimplePendulum(values: Record<string, number>) {
  return computePremiumMechanics("simple-pendulum", values);
}
