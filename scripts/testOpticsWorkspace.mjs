import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
const compile = file => ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const data = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const engineUrl = data(compile('../src/physics/opticalElements.ts'));
const workspaceUrl = data(compile('../src/physics/opticsWorkspace.ts').replace(/(['"])\.\/opticalElements\1/g, JSON.stringify(engineUrl)));
const m = await import(workspaceUrl);
const hookUrl = data(compile('../src/hooks/useOpticsHistory.ts').replace(/(['"])\.\.\/physics\/opticsWorkspace\1/g, JSON.stringify(workspaceUrl)).replace(/(['"])react\1/g, JSON.stringify(import.meta.resolve('react'))));
const { opticsHistoryReducer: history } = await import(hookUrl);
const engine = await import(engineUrl);
const initial = m.defaultOpticsSetup();
assert.deepEqual(m.parseOpticsSetup(JSON.parse(JSON.stringify(initial))), initial);
assert.equal(m.traceOpticsSetup(initial).length, 3);
assert.equal(m.traceOpticsSetup({ ...initial, beams: 7, white: true }).length, 21);
const unsafe = [null, {}, { ...initial, version: 2 }, { ...initial, angle: NaN }, { ...initial, angle: 90 }, { ...initial, beams: 3.5 }, { ...initial, wavelength: 300 }, { ...initial, spacing: 0 }, { ...initial, on: 'yes' }, { ...initial, scene: [initial.scene[0], initial.scene[0]] }, { ...initial, scene: [{ ...initial.scene[0], material: 999 }] }, { ...initial, scene: [{ ...initial.scene[0], kind: 'unknown' }] }, { ...initial, scene: [{ ...initial.scene[0], x: 12 }] }, { ...initial, scene: [{ ...initial.scene[0], rotation: Infinity }] }];
for (const value of unsafe) assert.throws(() => m.parseOpticsSetup(value));
assert.throws(() => m.parseOpticsSetup({ ...initial, scene: [initial.scene[0], { ...initial.scene[0], id: 2 }] }), 'Overlapping solids with distinct IDs are invalid');
assert.deepEqual(m.parseOpticsSetup({ ...initial, scene: [] }).scene, []);
const copy = m.parseOpticsSetup(initial); copy.scene[0].x = 5; assert.equal(initial.scene[0].x, 0, 'Validation must copy mutable scene entries');
for (const shape of engine.opticalElementCatalog) {
  const setup = { ...initial, scene: [{ ...initial.scene[0], kind: shape.id, scale: .65 }] };
  assert.ok(['Lenses', 'Prisms', 'Blocks', 'Curved glass'].includes(m.shapeCategory(shape.id)));
  for (const wavelength of [450, 530, 650]) {
    const actual = m.traceOpticsSetup({ ...setup, wavelength, beams: 1 })[0];
    const expected = engine.traceScene([{ id: 1, polygon: engine.placedOutline(setup.scene[0]), index: engine.glassIndex(0, wavelength) }], { x: -18, y: 0 }, { x: 1, y: 0 });
    assert.deepEqual(actual.points, expected.points, `${shape.name}: workspace uses the physical engine`);
    assert.deepEqual(actual.events, expected.events);
  }
}
assert.notEqual(m.rayDash(450, true), m.rayDash(530, true));
assert.equal(m.rayDash(450, false), undefined);
let state = { present: initial, past: [], future: [], transaction: null };
state = history(state, { type: 'begin' });
for (let angle = 1; angle <= 10; angle++) state = history(state, { type: 'patch', patch: { angle } });
state = history(state, { type: 'end' }); assert.equal(state.past.length, 1, 'A continuous gesture is one undo operation');
state = history(state, { type: 'undo' }); assert.deepEqual(state.present, initial);
state = history(state, { type: 'redo' }); assert.equal(state.present.angle, 10);
state = history(state, { type: 'undo' }); state = history(state, { type: 'patch', patch: { angle: 11 } }); assert.equal(state.future.length, 0, 'Editing after undo clears redo');
for (let i = 0; i < 100; i++) state = history(state, { type: 'patch', patch: { angle: i % 60 } });
assert.ok(state.past.length <= 80, 'History is bounded');
const prior = state.present; state = history(state, { type: 'replace', setup: { ...initial, beams: 7, white: true } }); state = history(state, { type: 'undo' }); assert.deepEqual(state.present, prior, 'Loading a saved setup can be undone atomically');
console.log('PASS: undo/redo gestures, history bounds, save/load round trips, invalid imports, geometry protection, categories, patterns, and 132 workspace/physics equivalence checks.');
