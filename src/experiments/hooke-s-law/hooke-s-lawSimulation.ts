import { runBenchmarkCases } from "../shared/validation";

export interface HookesLawInput {
  k: number;
  x: number;
  mass: number;
}

export function simulateHookesLaw(input: HookesLawInput) {
  const restoringForce = -input.k * input.x;
  const forceMagnitude = Math.abs(restoringForce);
  const energyStored = 0.5 * input.k * input.x ** 2;
  const direction = input.x > 0 ? "toward equilibrium" : input.x < 0 ? "away from compression" : "balanced";
  const points = Array.from({ length: 9 }, (_, index) => {
    const x = -0.4 + index * 0.1;
    return { x, y: -input.k * x };
  });
  return { restoringForce, forceMagnitude, energyStored, direction, points };
}

export const hookesLawBenchmarks = runBenchmarkCases<HookesLawInput>([
  {
    id: "hooke-force",
    name: "Restoring force magnitude",
    input: { k: 100, x: 0.2, mass: 1 },
    expected: 20,
    unit: "N",
    tolerance: 1e-9,
    actual: (input) => simulateHookesLaw(input).forceMagnitude,
  },
  {
    id: "hooke-energy",
    name: "Elastic potential energy",
    input: { k: 50, x: 0.1, mass: 1 },
    expected: 0.25,
    unit: "J",
    tolerance: 1e-9,
    actual: (input) => simulateHookesLaw(input).energyStored,
  },
]);
