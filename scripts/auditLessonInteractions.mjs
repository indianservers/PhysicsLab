import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import * as THREE from "three";

const origin = process.env.LAB_ORIGIN || "http://localhost:5367";
const output = "artifacts/lesson-interactions";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", headless: true, args: ["--enable-webgl", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1365, height: 950 } });
const errors = [];
page.on("pageerror", error => errors.push(error.message));
await page.goto(`${origin}/experiments/de-broglie-wavelength`);
await page.locator(".db-three-mount canvas").waitFor({ timeout: 60000 });
const detailsOnly = process.argv.includes("--details-only");
const quick = process.argv.includes("--quick");
const catalog = detailsOnly ? [] : await page.evaluate(async () => (await import("/src/lib/experiments.ts")).experiments.map(({ id, title }) => ({ id, title })));
const hash = buffer => createHash("sha256").update(buffer).digest("hex");
const setRange = (label, value) => page.getByRole("slider", { name: label, exact: true }).evaluate((input, next) => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, String(next));
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}, value);
const rows = [];
for (const lesson of catalog) {
  const start = errors.length;
  try {
    await page.goto(`${origin}/experiments/${lesson.id}`, { waitUntil: "domcontentloaded" });
    await page.locator(".experiment-tab-pane").waitFor({ timeout: 30000 });
    await page.waitForTimeout(300);
    const stage = page.locator(".experiment-tab-pane canvas, .experiment-tab-pane svg").first();
    const hasStage = await stage.count() > 0;
    const liveInputs = page.locator(".live-lesson-controls input[type=number]");
    let changesMeasurements = null;
    let changesScene = null;
    if (await liveInputs.count()) {
      await page.getByRole("button", { name: "Pause simulation", exact: true }).click();
      await page.waitForTimeout(60);
      const before = await page.locator(".live-lesson-controls dl").innerText();
      const beforePixels = quick ? null : hash(await page.locator(".three-lab-canvas canvas").screenshot());
      const input = liveInputs.first();
      const current = Number(await input.inputValue());
      const minimum = Number(await input.getAttribute("min"));
      const maximum = Number(await input.getAttribute("max"));
      const step = Number(await input.getAttribute("step")) || 1;
      const candidate = current + Math.max(step, (maximum - minimum) * .2);
      const next = candidate <= maximum ? candidate : minimum;
      await input.fill(String(next));
      await page.waitForTimeout(140);
      changesMeasurements = (await page.locator(".live-lesson-controls dl").innerText()) !== before;
      changesScene = quick ? null : hash(await page.locator(".three-lab-canvas canvas").screenshot()) !== beforePixels;
    }
    const state = await page.evaluate(() => {
      const pane = document.querySelector(".experiment-tab-pane");
      return { canvases: pane.querySelectorAll("canvas").length, images: pane.querySelectorAll("img").length, inputs: pane.querySelectorAll("input, select, button").length, overflow: document.documentElement.scrollWidth > innerWidth + 2, fallback: !!pane.querySelector(".three-lab-fallback") };
    });
    const row = { ...lesson, ...state, hasStage, changesMeasurements, changesScene, errors: errors.slice(start) };
    rows.push(row);
    console.log(JSON.stringify(row));
  } catch (error) { const row = { ...lesson, failure: error.message, errors: errors.slice(start) }; rows.push(row); console.log(JSON.stringify(row)); }
}
await page.goto(`${origin}/experiments/de-broglie-wavelength`);
await page.locator(".db-three-mount canvas").waitFor();
await page.getByRole("button", { name: "Ⅱ Pause", exact: true }).click();
const phaseBefore = await page.locator(".db-live-apparatus").getAttribute("data-phase");
await page.waitForTimeout(250);
const phaseAfter = await page.locator(".db-live-apparatus").getAttribute("data-phase");
const initialWavelength = Number(await page.locator(".db-live-apparatus").getAttribute("data-wavelength-pm"));
await setRange("Accelerating voltage", 600);
const nextWavelength = Number(await page.locator(".db-live-apparatus").getAttribute("data-wavelength-pm"));
await page.getByRole("button", { name: "▷ Step", exact: true }).click();
const steppedPhase = await page.locator(".db-live-apparatus").getAttribute("data-phase");
await page.getByLabel("Particle type").selectOption("proton");
await setRange("Accelerating voltage", 300);
const retainedParticle = await page.getByLabel("Particle type").inputValue();
await page.getByLabel("Particle type").selectOption("neutron");
const neutralVoltageDisabled = await page.getByRole("slider", { name: "Accelerating voltage", exact: true }).isDisabled();
await page.getByRole("button", { name: "↻ Reset experiment", exact: true }).click();
const bounds = await page.locator(".db-three-mount canvas").boundingBox();
const camera = new THREE.PerspectiveCamera(39, bounds.width / bounds.height, .1, 80);
camera.position.set(7, 3.5, 10); camera.lookAt(0, 0, 0); camera.updateMatrixWorld();
const screenPoint = new THREE.Vector3(2.3, 0, 0).project(camera);
const screenX = bounds.x + (screenPoint.x + 1) * bounds.width / 2;
const screenY = bounds.y + (1 - screenPoint.y) * bounds.height / 2;
await page.mouse.move(screenX, screenY); await page.mouse.down(); await page.mouse.move(screenX + 60, screenY, { steps: 8 }); await page.mouse.up();
const dragChangesDistance = Number(await page.getByRole("slider", { name: "Screen distance", exact: true }).inputValue()) > .25;
await page.screenshot({ path: `${output}/de-broglie-desktop.png`, fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: `${output}/de-broglie-mobile.png`, fullPage: true });
const mobileOverflow = await page.evaluate(() => [...document.querySelectorAll(".db-lab, .db-stage, .db-controls, .db-readings")].some(element => element.getBoundingClientRect().right > innerWidth + 2));
const deBroglie = { paused: phaseBefore === phaseAfter, wavelengthRatio: nextWavelength / initialWavelength, stepChangesPhase: steppedPhase !== phaseAfter, retainedParticle, neutralVoltageDisabled, dragChangesDistance, mobileOverflow };
const failures = rows.filter(row => row.failure || row.fallback || row.errors?.length || !row.hasStage || !row.inputs || row.changesMeasurements === false || row.changesScene === false);
await writeFile(`${output}/${detailsOnly ? "de-broglie-report" : "report"}.json`, JSON.stringify({ lessons: rows.length, failures, deBroglie, rows }, null, 2));
console.log(JSON.stringify({ summary: { lessons: rows.length, failures: failures.length }, deBroglie }));
await browser.close();
if (failures.length || !deBroglie.paused || Math.abs(deBroglie.wavelengthRatio - .5) > 1e-6 || !deBroglie.stepChangesPhase || retainedParticle !== "proton" || !neutralVoltageDisabled || !dragChangesDistance || mobileOverflow) process.exitCode = 1;
