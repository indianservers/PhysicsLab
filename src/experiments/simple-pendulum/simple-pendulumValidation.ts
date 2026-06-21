export const simplePendulumValidationCases = [
  { id: "pendulum-period", input: { length: 1, gravity: 9.8 }, expected: 2.006, tolerance: 0.01, unit: "s" },
  { id: "pendulum-mass-invariant", input: { length: 1, gravity: 9.8, massA: 1, massB: 5 }, expected: "same period", unit: "qualitative equality" },
];
