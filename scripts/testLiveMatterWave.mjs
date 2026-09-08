import assert from "node:assert/strict";
import { build } from "esbuild";

const compiled = await build({ entryPoints: ["src/experiments/de-broglie-wavelength/deBroglieSimulation.ts"], bundle: true, platform: "node", format: "esm", write: false });
const { matterWave, electronSpeedFromVoltage, diffractionRadius, deBroglieBenchmarks } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString("base64")}`);
assert.ok(deBroglieBenchmarks.every(result => result.pass));
const reference = matterWave("electron", electronSpeedFromVoltage(150), .335);
const faster = matterWave("electron", electronSpeedFromVoltage(600), .335);
assert.ok(Math.abs(faster.wavelengthPm / reference.wavelengthPm - .5) < 1e-12);
assert.ok(diffractionRadius(faster.wavelengthPm, .335, .25) < diffractionRadius(reference.wavelengthPm, .335, .25));
assert.equal(diffractionRadius(100, .335, .5), 2 * diffractionRadius(100, .335, .25));
assert.ok(diffractionRadius(100, .67, .25) < diffractionRadius(100, .335, .25));
assert.equal(diffractionRadius(1000, .2, .25), null);
assert.equal(diffractionRadius(100, 0, .25), null);
const proton = matterWave("proton", 1e6, .335);
assert.ok(proton.wavelengthPm < matterWave("electron", 1e6, .335).wavelengthPm);
console.log("PASS: de Broglie benchmarks, voltage scaling, ring contraction, screen distance, lattice spacing, forbidden diffraction orders and particle mass.");
