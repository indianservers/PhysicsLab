export const conservationOfEnergyValidationCases = [
  { id: "energy-pe", input: { mass: 1, height: 10, gravity: 9.8, loss: 0 }, expected: 98, unit: "J" },
  { id: "energy-no-loss", input: { mass: 1, height: 10, gravity: 9.8, loss: 0 }, expected: "PE lost equals KE gained", unit: "qualitative equality" },
];
