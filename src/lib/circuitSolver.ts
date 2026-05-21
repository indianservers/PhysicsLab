import { PhysicsObjectInstance, TerminalKind } from "../types";

export type CircuitResult = Record<string, { current: number; voltage: number }>;

const CIRCUIT_KINDS = new Set(["battery", "resistor", "bulb", "switch", "ammeter", "voltmeter"]);

export function isCircuitObject(object: PhysicsObjectInstance) {
  return CIRCUIT_KINDS.has(object.kind);
}

export function isCircuitLike(object: PhysicsObjectInstance) {
  return isCircuitObject(object) || object.kind === "wire";
}

export function solveCircuit(objects: PhysicsObjectInstance[]): CircuitResult {
  const components = objects.filter(isCircuitObject);
  const wires = objects.filter((object) => object.kind === "wire" && object.fromId && object.toId);
  const parent = new Map<string, string>();
  const terminal = (id: string, side: TerminalKind) => `${id}:${side}`;
  const find = (key: string): string => {
    if (!parent.has(key)) parent.set(key, key);
    const value = parent.get(key) ?? key;
    if (value === key) return key;
    const root = find(value);
    parent.set(key, root);
    return root;
  };
  const union = (a: string, b: string) => parent.set(find(a), find(b));

  components.forEach((component) => {
    find(terminal(component.id, "pos"));
    find(terminal(component.id, "neg"));
  });
  wires.forEach((wire) => union(terminal(wire.fromId!, wire.fromTerminal ?? "pos"), terminal(wire.toId!, wire.toTerminal ?? "neg")));

  const roots = [...new Set([...parent.keys()].map(find))];
  if (roots.length <= 1) return {};
  const ground = roots[0];
  const nodeIndex = new Map<string, number>();
  roots.filter((root) => root !== ground).forEach((root, index) => nodeIndex.set(root, index));
  const voltageSources = components.filter((component) => component.kind === "battery" || component.kind === "ammeter" || (component.kind === "switch" && component.closed));
  const size = nodeIndex.size + voltageSources.length;
  const matrix = Array.from({ length: size }, () => Array(size).fill(0));
  const rhs = Array(size).fill(0);

  const node = (id: string, side: TerminalKind) => nodeIndex.get(find(terminal(id, side))) ?? -1;
  const stampConductance = (a: number, b: number, conductance: number) => {
    if (a >= 0) matrix[a][a] += conductance;
    if (b >= 0) matrix[b][b] += conductance;
    if (a >= 0 && b >= 0) {
      matrix[a][b] -= conductance;
      matrix[b][a] -= conductance;
    }
  };

  for (const component of components) {
    const a = node(component.id, "pos");
    const b = node(component.id, "neg");
    if (component.kind === "resistor" || component.kind === "bulb") stampConductance(a, b, 1 / Math.max(0.001, component.resistance ?? 1));
    if (component.kind === "battery" && (component.internalResistance ?? 0) > 0) stampConductance(a, b, 1 / Math.max(0.001, component.internalResistance ?? 0.001));
  }

  voltageSources.forEach((component, index) => {
    const row = nodeIndex.size + index;
    const a = node(component.id, "pos");
    const b = node(component.id, "neg");
    const volts = component.kind === "battery" ? component.emf ?? 0 : 0;
    if (a >= 0) {
      matrix[a][row] += 1;
      matrix[row][a] += 1;
    }
    if (b >= 0) {
      matrix[b][row] -= 1;
      matrix[row][b] -= 1;
    }
    rhs[row] = volts;
  });

  const solution = gaussianSolve(matrix, rhs);
  const voltageAt = (index: number) => (index >= 0 ? solution[index] ?? 0 : 0);
  const results: CircuitResult = {};

  for (const component of components) {
    const vp = voltageAt(node(component.id, "pos"));
    const vn = voltageAt(node(component.id, "neg"));
    const voltage = vp - vn;
    let current = 0;
    if (component.kind === "resistor" || component.kind === "bulb") current = voltage / Math.max(0.001, component.resistance ?? 1);
    if (component.kind === "battery" || component.kind === "ammeter" || component.kind === "switch") {
      const sourceIndex = voltageSources.findIndex((source) => source.id === component.id);
      current = sourceIndex >= 0 ? solution[nodeIndex.size + sourceIndex] ?? 0 : 0;
    }
    if (component.kind === "voltmeter" && component.connectedTo) {
      const [a, b] = component.connectedTo;
      const ca = components.find((item) => item.id === a);
      const cb = components.find((item) => item.id === b);
      current = 0;
      results[component.id] = { current, voltage: (ca ? voltageAt(node(ca.id, "pos")) : 0) - (cb ? voltageAt(node(cb.id, "pos")) : 0) };
    } else {
      results[component.id] = { current, voltage };
    }
  }

  for (const wire of wires) {
    const from = results[wire.fromId!]?.current ?? 0;
    const to = results[wire.toId!]?.current ?? 0;
    results[wire.id] = { current: Math.abs(from) > 0.0001 ? from : to, voltage: 0 };
  }

  return results;
}

function gaussianSolve(matrix: number[][], rhs: number[]) {
  const n = rhs.length;
  const a = matrix.map((row, i) => [...row, rhs[i]]);
  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let row = col + 1; row < n; row += 1) {
      if (Math.abs(a[row][col]) > Math.abs(a[pivot][col])) pivot = row;
    }
    if (Math.abs(a[pivot][col]) < 1e-10) continue;
    [a[col], a[pivot]] = [a[pivot], a[col]];
    const divisor = a[col][col];
    for (let j = col; j <= n; j += 1) a[col][j] /= divisor;
    for (let row = 0; row < n; row += 1) {
      if (row === col) continue;
      const factor = a[row][col];
      for (let j = col; j <= n; j += 1) a[row][j] -= factor * a[col][j];
    }
  }
  return a.map((row) => (Number.isFinite(row[n]) ? row[n] : 0));
}
