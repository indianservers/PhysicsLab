import ts from 'typescript';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('../src/physics/opticalElements.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const physics = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
let interfaces = 0, reflections = 0;
assert.ok(physics.opticalElementCatalog.length === 44);
assert.ok(physics.glasses.length >= 26);
for (const { id: kind } of physics.opticalElementCatalog) {
  for (const rotation of [-70, 0, 35, 80]) for (const angle of [-60, -20, 0, 30, 60]) for (let material = 0; material < physics.glasses.length; material++) {
    const n = physics.glassIndex(material, 530), t = angle * Math.PI / 180;
    const direction = { x: Math.cos(t), y: Math.sin(t) };
    const trace = physics.traceElement(physics.elementOutline(kind, rotation), { x: -8 * direction.x, y: -8 * direction.y }, direction, n);
    let inside = false;
    for (const event of trace.events) {
      const eventIndex = trace.events.indexOf(event);
      const a = trace.points[eventIndex], hit = trace.points[eventIndex + 1], b = trace.points[eventIndex + 2];
      if (b) {
        const incoming = { x: hit.x - a.x, y: hit.y - a.y }, outgoing = { x: b.x - hit.x, y: b.y - hit.y };
        const il = Math.hypot(incoming.x, incoming.y), ol = Math.hypot(outgoing.x, outgoing.y);
        const normal = event.normal;
        const crossIn = (incoming.x * normal.y - incoming.y * normal.x) / il;
        const crossOut = (outgoing.x * normal.y - outgoing.y * normal.x) / ol;
        if (event.tir) {
          assert.ok(Math.abs(crossIn - crossOut) < 1e-7, `${kind}: tangential reflection direction`);
          const dotIn = (incoming.x * normal.x + incoming.y * normal.y) / il;
          const dotOut = (outgoing.x * normal.x + outgoing.y * normal.y) / ol;
          assert.ok(Math.abs(dotIn + dotOut) < 1e-7, `${kind}: equal reflection angles`);
        } else {
          assert.ok(Math.abs(event.fromIndex * crossIn - event.toIndex * crossOut) < 1e-7, `${kind}: actual drawn path obeys signed Snell law`);
        }
      }
      if (event.tir) {
        assert.ok(inside);
        assert.ok(event.incidence > Math.asin(1 / n) * 180 / Math.PI);
        reflections++;
      } else {
        const incident = (inside ? n : 1) * Math.sin(event.incidence * Math.PI / 180);
        const refracted = (inside ? 1 : n) * Math.sin(event.refraction * Math.PI / 180);
        assert.ok(Math.abs(incident - refracted) < 1e-9, `${kind}: Snell's law`);
        inside = !inside;
      }
      interfaces++;
    }
    assert.ok(trace.points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y)));
  }
}
assert.ok(reflections > 0);
const slab = physics.traceElement(physics.elementOutline('block'), { x: -7, y: -2 }, { x: Math.cos(.3), y: Math.sin(.3) }, 1.5);
assert.equal(slab.events.length, 2);
const p = slab.points;
assert.ok(Math.abs(Math.atan2(p.at(-1).y - p.at(-2).y, p.at(-1).x - p.at(-2).x) - .3) < 1e-9);
for (let i = 0; i < physics.glasses.length; i++) assert.ok(physics.glassIndex(i, 450) > physics.glassIndex(i, 650));
for (const [kind, sign] of [['convex', -1], ['concave', 1], ['biconcave', 1]]) {
  const ray = physics.traceElement(physics.elementOutline(kind), { x: -7, y: .6 }, { x: 1, y: 0 }, 1.5).points;
  assert.ok((ray.at(-1).y - ray.at(-2).y) * sign > 0, `${kind}: focusing direction`);
}
// Catalog-index fit preserves the reference d-line index and Abbe number.
assert.ok(Math.abs(physics.glassIndex(5, 587.5618) - 1.52249) < 1e-10);
assert.ok(Math.abs((physics.glassIndex(5, 587.5618) - 1) / (physics.glassIndex(5, 486.1327) - physics.glassIndex(5, 656.2725)) - 59.48) < 1e-8);

const placed = (id, x, material = 0) => ({ id, kind: 'block', material, rotation: 0, x, y: 0, scale: .65 });
const pair = [placed(1, -3), placed(2, 3, 1)];
const bodies = pair.map(e => ({ id: e.id, polygon: physics.placedOutline(e), index: physics.glassIndex(e.material, 530) }));
const pairTrace = physics.traceScene(bodies, { x: -10, y: .4 }, { x: 1, y: 0 });
assert.deepEqual(pairTrace.events.map(e => e.elementId), [1, 1, 2, 2]);
assert.deepEqual(pairTrace.events.map(e => [e.fromIndex, e.toIndex]), [[1, bodies[0].index], [bodies[0].index, 1], [1, bodies[1].index], [bodies[1].index, 1]]);
assert.deepEqual(physics.traceScene([...bodies].reverse(), { x: -10, y: .4 }, { x: 1, y: 0 }), pairTrace, 'Scene order cannot affect intersections');
const reverse = physics.traceScene(bodies, { x: 10, y: .4 }, { x: -1, y: 0 });
assert.deepEqual(reverse.events.map(e => e.elementId), [2, 2, 1, 1]);
const internal = physics.traceScene(bodies, { x: -3, y: 0 }, { x: 1, y: 0 });
assert.equal(internal.events[0].fromIndex, bodies[0].index);
assert.equal(physics.traceScene([], { x: -10, y: 0 }, { x: 1, y: 0 }).events.length, 0);
assert.ok(physics.canPlaceElement(placed(3, 0), pair));
assert.ok(!physics.canPlaceElement(placed(3, -3), pair), 'Overlapping glass must be rejected');
assert.ok(!physics.canPlaceElement(placed(3, 12), pair), 'Off-bench glass must be rejected');
assert.ok(physics.canPlaceElement({ ...pair[0], x: -4 }, pair), 'An element can move without colliding with its previous position');
assert.ok(physics.polygonsOverlap([{x:-2,y:-.2},{x:2,y:-.2},{x:2,y:.2},{x:-2,y:.2}], [{x:-.2,y:-2},{x:.2,y:-2},{x:.2,y:2},{x:-.2,y:2}]), 'Crossing edges overlap even without contained vertices');
// A global translation must move the whole ray path without changing angles.
const shift = { x: 2.1, y: -1.3 };
const shifted = physics.traceScene(bodies.map(body => ({ ...body, polygon: body.polygon.map(p => ({ x: p.x + shift.x, y: p.y + shift.y })) })), { x: -10 + shift.x, y: .4 + shift.y }, { x: 1, y: 0 });
assert.equal(shifted.events.length, pairTrace.events.length);
for (let i = 0; i < shifted.points.length; i++) {
  assert.ok(Math.hypot(shifted.points[i].x - pairTrace.points[i].x - shift.x, shifted.points[i].y - pairTrace.points[i].y - shift.y) < 1e-8);
}
// At and around the glass-air critical angle, independently check the outcome.
for (const delta of [-1e-7, 0, 1e-7]) {
  const critical = Math.asin(1 / 1.5) + delta;
  const result = physics.traceElement(physics.elementOutline('block'), { x: 0, y: 0 }, { x: Math.cos(critical), y: Math.sin(critical) }, 1.5);
  assert.equal(result.events[0].tir, delta > 0);
  if (delta === 0) assert.ok(Math.abs(result.events[0].refraction - 90) < 1e-5);
}
// Reversing a transmitted ray must retrace its interfaces (optical reciprocity).
for (const { id: kind } of physics.opticalElementCatalog) {
  const polygon = physics.elementOutline(kind, 13);
  const forward = physics.traceElement(polygon, { x: -8, y: .231 }, { x: 1, y: .037 }, 1.52);
  if (forward.truncated || !forward.events.length) continue;
  const last = forward.points.at(-1), previous = forward.points.at(-2);
  const backward = physics.traceElement(polygon, last, { x: previous.x - last.x, y: previous.y - last.y }, 1.52);
  assert.equal(backward.events.length, forward.events.length, `${kind}: reciprocity surface count`);
  for (let i = 0; i < forward.events.length; i++) {
    const a = forward.events[i].point, b = backward.events.at(-1 - i).point;
    assert.ok(Math.hypot(a.x - b.x, a.y - b.y) < 1e-6, `${kind}: reciprocity intersection`);
  }
}
console.log(`PASS: ${physics.opticalElementCatalog.length} shapes × ${physics.glasses.length} materials; ${interfaces} interface checks; ${reflections} TIR events; drawn Snell/reflection directions, critical-angle threshold, translation invariance, optical reciprocity, multi-glass paths, lens focusing and dispersion.`);

