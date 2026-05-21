import { PhysicsObjectInstance } from "../types";

const PIXELS_PER_METER = 100;

type State = [number, number, number, number];

export function stepDoublePendulum(object: PhysicsObjectInstance, dt: number, gravity: number): PhysicsObjectInstance {
  const y: State = [object.angle1 ?? 1.2, object.angle2 ?? 1.9, object.omega1 ?? 0, object.omega2 ?? 0];
  const l1 = Math.max(0.1, (object.length1 ?? 120) / PIXELS_PER_METER);
  const l2 = Math.max(0.1, (object.length2 ?? 120) / PIXELS_PER_METER);
  const m1 = Math.max(0.01, object.mass1 ?? 1);
  const m2 = Math.max(0.01, object.mass2 ?? 1);
  const damping = Math.max(0, object.damping ?? 0);
  const next = rk4(y, dt, (state) => derivatives(state, l1, l2, m1, m2, gravity, damping));
  const pivotX = object.pivotX ?? object.x;
  const pivotY = object.pivotY ?? object.y;
  const bob1 = bobPosition(pivotX, pivotY, object.length1 ?? 120, next[0]);
  const bob2 = bobPosition(bob1.x, bob1.y, object.length2 ?? 120, next[1]);
  const trail = [...(object.trail ?? []).slice(-499), { x: bob2.x, y: bob2.y, t: performance.now() / 1000 }];
  return { ...object, angle1: next[0], angle2: next[1], omega1: next[2], omega2: next[3], x: bob2.x, y: bob2.y, trail };
}

export function doublePendulumPoints(object: PhysicsObjectInstance) {
  const pivotX = object.pivotX ?? object.x;
  const pivotY = object.pivotY ?? object.y;
  const bob1 = bobPosition(pivotX, pivotY, object.length1 ?? 120, object.angle1 ?? 0);
  const bob2 = bobPosition(bob1.x, bob1.y, object.length2 ?? 120, object.angle2 ?? 0);
  return { pivot: { x: pivotX, y: pivotY }, bob1, bob2 };
}

function bobPosition(x: number, y: number, length: number, angle: number) {
  return { x: x + length * Math.sin(angle), y: y + length * Math.cos(angle) };
}

function rk4(y: State, dt: number, f: (state: State) => State): State {
  const k1 = f(y);
  const k2 = f(add(y, scale(k1, dt / 2)));
  const k3 = f(add(y, scale(k2, dt / 2)));
  const k4 = f(add(y, scale(k3, dt)));
  return add(y, scale(add(add(k1, scale(k2, 2)), add(scale(k3, 2), k4)), dt / 6));
}

function derivatives([a1, a2, w1, w2]: State, l1: number, l2: number, m1: number, m2: number, g: number, damping: number): State {
  const delta = a1 - a2;
  const den1 = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * delta));
  const den2 = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * delta));
  const dw1 = (
    -g * (2 * m1 + m2) * Math.sin(a1)
    - m2 * g * Math.sin(a1 - 2 * a2)
    - 2 * Math.sin(delta) * m2 * (w2 * w2 * l2 + w1 * w1 * l1 * Math.cos(delta))
  ) / den1 - damping * w1;
  const dw2 = (
    2 * Math.sin(delta) * (w1 * w1 * l1 * (m1 + m2) + g * (m1 + m2) * Math.cos(a1) + w2 * w2 * l2 * m2 * Math.cos(delta))
  ) / den2 - damping * w2;
  return [w1, w2, dw1, dw2];
}

function add(a: State, b: State): State {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]];
}

function scale(a: State, scalar: number): State {
  return [a[0] * scalar, a[1] * scalar, a[2] * scalar, a[3] * scalar];
}
