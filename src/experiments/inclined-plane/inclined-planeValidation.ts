export const inclinedPlaneValidationCases = [
  { id: "frictionless-30", input: { angle: 30, mu: 0, gravity: 9.8 }, expected: 4.9, unit: "m/s^2" },
  { id: "flat-plane-edge", input: { angle: 0, mu: 0.2 }, expected: 0, unit: "m/s^2" },
];
