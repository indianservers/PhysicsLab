export const MU0 = 4 * Math.PI * 1e-7;
export type FieldGeometry = "wire" | "loop" | "solenoid" | "two-wire";
export interface Point2 {
  x: number;
  y: number;
}
export interface MagneticFieldInput {
  geometry: FieldGeometry;
  currentA: number;
  direction: 1 | -1;
  probeX: number;
  probeY: number;
  secondCurrentA: number;
}

const clampDistance = (value: number) => Math.max(value, 0.005);

export function straightWireFieldVector(
  currentA: number,
  point: Point2,
  wire: Point2 = { x: 0, y: 0 },
) {
  const dx = point.x - wire.x,
    dy = point.y - wire.y;
  const r2 = Math.max(dx * dx + dy * dy, 0.005 ** 2);
  const factor = (MU0 * currentA) / (2 * Math.PI * r2);
  return { x: -dy * factor, y: dx * factor };
}

export function straightWireField(currentA: number, radiusM: number) {
  return (
    (MU0 * Math.abs(currentA)) /
    (2 * Math.PI * clampDistance(Math.abs(radiusM)))
  );
}

export function circularLoopAxisField(
  currentA: number,
  axialDistanceM: number,
  radiusM = 0.06,
) {
  return (
    (MU0 * currentA * radiusM ** 2) /
    (2 * (radiusM ** 2 + axialDistanceM ** 2) ** 1.5)
  );
}

export function finiteSolenoidAxisField(
  currentA: number,
  axialDistanceM: number,
  turns = 600,
  lengthM = 0.12,
  radiusM = 0.03,
) {
  const a = axialDistanceM + lengthM / 2,
    b = axialDistanceM - lengthM / 2;
  return (
    ((MU0 * (turns / lengthM) * currentA) / 2) *
    (a / Math.hypot(radiusM, a) - b / Math.hypot(radiusM, b))
  );
}

export function solveMagneticField(input: MagneticFieldInput) {
  const current = Math.max(0, Math.min(5, input.currentA)) * input.direction;
  const point = {
    x: Math.max(-0.1, Math.min(0.1, input.probeX)),
    y: Math.max(-0.1, Math.min(0.1, input.probeY)),
  };
  let vector = { x: 0, y: 0 },
    axial = 0;
  if (input.geometry === "wire")
    vector = straightWireFieldVector(current, point);
  if (input.geometry === "two-wire") {
    const first = straightWireFieldVector(current, point, { x: -0.06, y: 0 });
    const second = straightWireFieldVector(
      input.secondCurrentA * input.direction,
      point,
      { x: 0.06, y: 0 },
    );
    vector = { x: first.x + second.x, y: first.y + second.y };
  }
  if (input.geometry === "loop")
    axial = circularLoopAxisField(current, point.x);
  if (input.geometry === "solenoid")
    axial = finiteSolenoidAxisField(current, point.x);
  const magnitudeT =
    input.geometry === "wire" || input.geometry === "two-wire"
      ? Math.hypot(vector.x, vector.y)
      : Math.abs(axial);
  const angleDeg =
    input.geometry === "wire" || input.geometry === "two-wire"
      ? ((Math.atan2(vector.y, vector.x) * 180) / Math.PI + 360) % 360
      : axial >= 0
        ? 0
        : 180;
  const radiusM = Math.hypot(point.x, point.y);
  return {
    current,
    point,
    vector,
    axial,
    magnitudeT,
    magnitudeMicroT: magnitudeT * 1e6,
    angleDeg,
    radiusM,
    directionLabel: input.direction === 1 ? "out of board" : "into board",
  };
}

export function twoWireNullX(
  current1: number,
  current2: number,
  leftX = -0.06,
  rightX = 0.06,
) {
  return (
    (Math.abs(current1) * rightX + Math.abs(current2) * leftX) /
    (Math.abs(current1) + Math.abs(current2))
  );
}

export const magneticFieldCurrentBenchmarks = [
  {
    id: "wire-formula",
    name: "Long wire follows mu zero I over two pi r",
    actual: straightWireField(3, 0.026),
    expected: (MU0 * 3) / (2 * Math.PI * 0.026),
    tolerance: 1e-15,
    unit: "T",
  },
  {
    id: "double-current",
    name: "Double current doubles field",
    actual: straightWireField(4, 0.08) / straightWireField(2, 0.08),
    expected: 2,
    tolerance: 1e-12,
    unit: "ratio",
  },
  {
    id: "double-distance",
    name: "Double distance halves field",
    actual: straightWireField(3, 0.1) / straightWireField(3, 0.05),
    expected: 0.5,
    tolerance: 1e-12,
    unit: "ratio",
  },
  {
    id: "right-hand-rule",
    name: "Positive current gives counterclockwise field at positive x",
    actual: Math.sign(straightWireFieldVector(3, { x: 0.05, y: 0 }).y),
    expected: 1,
    tolerance: 0,
    unit: "direction",
  },
  {
    id: "superposition-null",
    name: "Equal two-wire fields cancel at midpoint",
    actual: solveMagneticField({
      geometry: "two-wire",
      currentA: 3,
      direction: 1,
      probeX: 0,
      probeY: 0,
      secondCurrentA: 3,
    }).magnitudeT,
    expected: 0,
    tolerance: 1e-18,
    unit: "T",
  },
];
