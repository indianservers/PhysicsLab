export const circularMotionValidationCases = [
  {
    id: "circular-force",
    input: { mass: 2, radius: 3, omega: 4 },
    expected: 96,
    unit: "N",
  },
  {
    id: "circular-speed",
    input: { radius: 2, omega: 5 },
    expected: 10,
    unit: "m/s",
  },
  {
    id: "acceleration-identity",
    input: { radius: 2, omega: 3 },
    expected: 18,
    unit: "m/s²",
  },
  {
    id: "tangent-release",
    input: { radius: 2, omega: 3, angle: 0 },
    expected: 0,
    unit: "m²/s",
  },
];
