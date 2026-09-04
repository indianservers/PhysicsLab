import { runBenchmarkCases } from "../shared/validation";
import {
  computeElectrostatic,
  fieldAndPotential,
  type ElectrostaticInput,
} from "./electrostaticPhysics";
const dipole: ElectrostaticInput = {
  charge1: 3e-6,
  charge2: -3e-6,
  separation: 2,
  probeX: 0,
  probeY: 1.5,
  testCharge: 1e-6,
};
export const electrostaticBenchmarks = runBenchmarkCases([
  {
    id: "dipole-zero-v",
    name: "Equal opposite charges have zero midpoint-plane potential",
    input: dipole,
    expected: 0,
    unit: "V",
    tolerance: 1e-9,
    actual: (i) => computeElectrostatic(i).potential,
  },
  {
    id: "dipole-nonzero-e",
    name: "Dipole midpoint-plane field is nonzero",
    input: dipole,
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (i) => Number(computeElectrostatic(i).fieldMagnitude > 0),
  },
  {
    id: "scalar-superposition",
    name: "Like charges add scalar potential",
    input: { ...dipole, charge2: 3e-6 },
    expected: (2 * 8.9875517923e9 * 3e-6) / Math.hypot(1, 1.5),
    unit: "V",
    tolerance: 1e-9,
    actual: (i) => computeElectrostatic(i).potential,
  },
  {
    id: "vector-cancel",
    name: "Like charges cancel horizontal field on bisector",
    input: { ...dipole, charge2: 3e-6 },
    expected: 0,
    unit: "N/C",
    tolerance: 1e-9,
    actual: (i) => computeElectrostatic(i).fieldX,
  },
  {
    id: "negative-gradient",
    name: "Electric field equals negative potential gradient",
    input: dipole,
    expected: fieldAndPotential(dipole, 0, 1.5).fieldX,
    unit: "N/C",
    tolerance: 1,
    actual: (i) => {
      const h = 1e-5;
      return (
        -(
          fieldAndPotential(i, h, 1.5).potential -
          fieldAndPotential(i, -h, 1.5).potential
        ) /
        (2 * h)
      );
    },
  },
]);
