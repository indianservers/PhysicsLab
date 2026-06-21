export const uniformMotionValidationCases = [
  { id: "forward", input: { x0: 0, v: 5, t: 4 }, expected: 20, unit: "m" },
  { id: "negative-velocity", input: { x0: 10, v: -2, t: 3 }, expected: 4, unit: "m" },
];
