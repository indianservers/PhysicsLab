export type LogicLevel = 0 | 1;
export type LogicInput = LogicLevel | null;
export type GateType = "AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR" | "XNOR";

export const gateTypes: GateType[] = ["AND", "OR", "NOT", "NAND", "NOR", "XOR", "XNOR"];

export function evaluateGate(gate: GateType, a: LogicInput, b: LogicInput): LogicInput {
  if (a === null || (gate !== "NOT" && b === null)) return null;
  if (gate === "NOT") return a === 1 ? 0 : 1;
  const right = b as LogicLevel;
  if (gate === "AND") return (a & right) as LogicLevel;
  if (gate === "OR") return (a | right) as LogicLevel;
  if (gate === "NAND") return Number(!(a & right)) as LogicLevel;
  if (gate === "NOR") return Number(!(a | right)) as LogicLevel;
  if (gate === "XOR") return (a ^ right) as LogicLevel;
  return Number(!(a ^ right)) as LogicLevel;
}

export function truthTable(gate: GateType) {
  if (gate === "NOT") return ([0, 1] as LogicLevel[]).map((a) => ({ a, b: null, y: evaluateGate(gate, a, null) }));
  return ([0, 1] as LogicLevel[]).flatMap((a) => ([0, 1] as LogicLevel[]).map((b) => ({ a, b, y: evaluateGate(gate, a, b) })));
}

export function nandXor(a: LogicLevel, b: LogicLevel) {
  const n1 = evaluateGate("NAND", a, b) as LogicLevel;
  const n2 = evaluateGate("NAND", a, n1) as LogicLevel;
  const n3 = evaluateGate("NAND", b, n1) as LogicLevel;
  return evaluateGate("NAND", n2, n3) as LogicLevel;
}

export function validateNandXor() {
  return ([0, 1] as LogicLevel[]).flatMap((a) => ([0, 1] as LogicLevel[]).map((b) => ({ a, b, expected: (a ^ b) as LogicLevel, actual: nandXor(a, b) })));
}

export const hasInversionBubble = (gate: GateType) => gate === "NOT" || gate === "NAND" || gate === "NOR" || gate === "XNOR";
