import { runBenchmarkCases } from "../shared/validation";
import { evaluateGate, hasInversionBubble, nandXor, truthTable } from "./logicGatesPhysics";

export const logicGatesBenchmarks = runBenchmarkCases([
  { id: "and-table", name: "AND truth table", input: 0, expected: 1, unit: "boolean", tolerance: 0, actual: () => Number(truthTable("AND").map((row) => row.y).join("") === "0001") },
  { id: "xor-table", name: "XOR truth table", input: 0, expected: 1, unit: "boolean", tolerance: 0, actual: () => Number(truthTable("XOR").map((row) => row.y).join("") === "0110") },
  { id: "nand-xor", name: "Four NAND gates implement XOR", input: 0, expected: 1, unit: "boolean", tolerance: 0, actual: () => Number(([[0,0],[0,1],[1,0],[1,1]] as const).every(([a,b]) => nandXor(a,b) === (a ^ b))) },
  { id: "floating-input", name: "Floating input yields unknown", input: 0, expected: 1, unit: "boolean", tolerance: 0, actual: () => Number(evaluateGate("AND", 1, null) === null) },
  { id: "inversion-bubbles", name: "Inverting gate families have output bubbles", input: 0, expected: 1, unit: "boolean", tolerance: 0, actual: () => Number((["NOT","NAND","NOR","XNOR"] as const).every(hasInversionBubble) && !hasInversionBubble("AND")) },
]);
