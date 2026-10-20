import assert from "node:assert/strict";
import fs from "node:fs";
import { normalizedScaleUniverseObjects, SCALE_MIN_LOG, SCALE_MAX_LOG } from "../src/physics/scale-of-universe/scaleUniverseData.js";
import { discoverObjects, layoutObjects, physicalScreenSize } from "../src/physics/scale-of-universe/scaleUniverseLayout.js";
import { scaleJourneys } from "../src/physics/scale-of-universe/scaleUniverseJourney.js";
import { formatBestUnit } from "../src/physics/scale-of-universe/scaleUniverseUnits.js";
const objects = normalizedScaleUniverseObjects();
const byId = new Map(objects.map(object => [object.id, object]));
assert.equal(objects.length, 225);
assert.equal(byId.size, 225);
assert.equal(discoverObjects(objects, 0, 1366, 600, null, new Set()).length, 0, "Empty filter selection hides all categories");
assert.equal(formatBestUnit(100), "100 m");
assert.equal(formatBestUnit(1e9), "1 Gm");
assert.equal(formatBestUnit(1e-9), "1 nm");
const baseline = JSON.parse(fs.readFileSync("artifacts/scale-universe-upgrade/baseline-inventory.json", "utf8"));
for (const original of baseline) {
  const object = byId.get(original.id);
  assert(object, `Missing ${original.id}`); assert.equal(object.name, original.name); assert.equal(object.summary, original.summary);
}
let positions = 0;
for (let exponent = SCALE_MIN_LOG; exponent <= SCALE_MAX_LOG; exponent += .25) {
  for (const [width, height] of [[1366, 470], [1920, 700], [390, 450]]) {
    const candidates = discoverObjects(objects, exponent, width, height, null);
    const entries = layoutObjects(candidates, width, height);
    for (const entry of entries) {
      assert(Number.isFinite(entry.screenX) && Number.isFinite(entry.screenY));
      assert(Math.abs(entry.extent / 76 - entry.object.sizeMeters / 10 ** exponent) < 1e-8);
    }
  }
  positions++;
}
for (const [a, b] of [["proton", "hydrogen-atom"], ["dna-width", "red-blood-cell"], ["human", "giraffe"], ["earth", "jupiter"], ["jupiter", "sun"], ["moon", "earth"], ["solar-system", "milky-way"]]) assert(byId.get(a).sizeMeters < byId.get(b).sizeMeters, `${a} < ${b}`);
const expectedRatio = byId.get("school-bus").sizeMeters / byId.get("human").sizeMeters;
assert(Math.abs(physicalScreenSize(11, 1) / physicalScreenSize(1.7, 1) - expectedRatio) < 1e-12);
for (const object of objects) {
  assert.equal(object.log10Size, Math.log10(object.sizeMeters));
  assert(object.measurementDefinition && object.uncertainty && object.validationStatus && object.measurementType);
  assert(discoverObjects(objects, object.logSize, 1366, 600, object.id).some(entry => entry.object.id === object.id), `Cannot discover ${object.name}`);
}
for (const journey of scaleJourneys) for (const id of journey.objectIds) assert(byId.has(id), `Journey missing ${id}`);
const rows = objects.map(object => ({
  id: object.id, name: object.name, category: object.category, measurement: object.sizeMeters, unit: "m", measurementType: object.measurementType,
  definition: object.measurementDefinition, source: object.sourceName, sourceUrl: object.sourceUrl,
  uncertainty: object.uncertainty, validationStatus: object.validationStatus,
  assetPath: object.assetPath, assetAvailable: Boolean(object.assetPath && fs.existsSync(`public${object.assetPath}`)),
  rendering: object.sourceBox ? "AI-generated transparent cutout; calibrated visible bounds; procedural 3D inspection preview" : object.category === "Astronomical Distance" || ["electron", "quark-scale", "planck-length"].includes(object.id) ? "measurement path, not solid object" : "procedural model where supported; otherwise legacy illustrative asset or canvas schematic",
  visualReview: "Legacy sprites and non-water molecular structures need individual scientific art review; see verification report",
  checklist: { metadata: true, searchable: true, discoverableAtOwnExponent: true, numericalScaleVerified: true, independentSourceVerified: object.validationStatus === "source-checked reference" },
}));
fs.mkdirSync("artifacts/scale-universe-upgrade", { recursive: true });
fs.writeFileSync("artifacts/scale-universe-upgrade/object-coverage.json", JSON.stringify({ total: objects.length, sourceChecked: rows.filter(row => row.checklist.independentSourceVerified).length, positionsTested: positions, viewportSizes: 3, objects: rows }, null, 2));
const columns = ["id", "name", "category", "measurement", "unit", "measurementType", "definition", "source", "sourceUrl", "validationStatus", "assetAvailable", "rendering", "visualReview"];
assert(rows.every(row => row.assetAvailable), "Every catalog asset resolves on disk");
fs.writeFileSync("artifacts/scale-universe-upgrade/object-coverage.csv", columns.join(",") + "\n" + rows.map(row => columns.map(key => JSON.stringify(String(row[key] ?? ""))).join(",")).join("\n"));
console.log(`PASS: ${objects.length} preserved objects; ${positions} integer/fractional positions × 3 viewports; physical proportions; 7 scientific relationships; complete journey coverage.`);
console.log(`Source checked: ${rows.filter(row => row.checklist.independentSourceVerified).length}; remaining reference estimates explicitly flagged.`);
