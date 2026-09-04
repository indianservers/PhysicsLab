import { runBenchmarkCases } from "../shared/validation";
import {
  coulombInteraction,
  ELECTRON_CHARGE,
  solveStaticElectricity,
  type StaticInput,
} from "./staticElectricityPhysics";
const standard: StaticInput = {
  pair: "pvc-wool",
  rubbing: 80,
  grounded: false,
  separation: 0.5,
};
export const staticElectricityBenchmarks = runBenchmarkCases([
  {
    id: "electron-transfer",
    name: "Transferred charge is an integer electron count",
    input: standard,
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) =>
      Number(
        Number.isInteger(
          Math.round(solveStaticElectricity(input).transferredElectrons),
        ) && ELECTRON_CHARGE > 0,
      ),
  },
  {
    id: "charge-conservation",
    name: "Friction conserves total charge",
    input: standard,
    expected: 0,
    unit: "C",
    tolerance: 1e-18,
    actual: (input) => solveStaticElectricity(input).totalCharge,
  },
  {
    id: "unlike-attract",
    name: "Opposite charges attract",
    input: standard,
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) =>
      Number(solveStaticElectricity(input).interaction === "attraction"),
  },
  {
    id: "like-repel",
    name: "Like charges repel",
    input: standard,
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: () =>
      Number(coulombInteraction(1e-6, 2e-6, 1).interaction === "repulsion"),
  },
  {
    id: "inverse-square",
    name: "Doubling separation quarters force",
    input: standard,
    expected: 4,
    unit: "ratio",
    tolerance: 1e-12,
    actual: (input) =>
      solveStaticElectricity({ ...input, separation: 0.5 }).force /
      solveStaticElectricity({ ...input, separation: 1 }).force,
  },
]);
