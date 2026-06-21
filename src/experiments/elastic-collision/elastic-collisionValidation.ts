export const elasticCollisionValidationCases = [
  { id: "equal-masses-v1", input: { m1: 1, m2: 1, u1: 5, u2: 0 }, expected: 0, unit: "m/s" },
  { id: "unequal-masses-v2", input: { m1: 2, m2: 1, u1: 3, u2: 0 }, expected: 4, unit: "m/s" },
];
