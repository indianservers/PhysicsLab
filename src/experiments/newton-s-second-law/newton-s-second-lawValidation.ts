export const newtonsSecondLawValidationCases = [
  { id: "newton-a-basic", input: { force: 20, mass: 5, friction: 0 }, expected: 4, unit: "m/s^2" },
  { id: "newton-friction", input: { force: 50, friction: 10, mass: 10 }, expected: 4, unit: "m/s^2" },
];
