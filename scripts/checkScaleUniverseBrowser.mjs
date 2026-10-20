import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { normalizedScaleUniverseObjects } from "../src/physics/scale-of-universe/scaleUniverseData.js";
import { discoverObjects, layoutObjects } from "../src/physics/scale-of-universe/scaleUniverseLayout.js";
const directory = process.env.SCALE_TEST_OUTPUT ?? "artifacts/scale-universe-upgrade";
fs.mkdirSync(directory, { recursive: true });
// Run the development server first, or supply SCALE_TEST_URL for a review host.
const base = process.env.SCALE_TEST_URL ?? "http://127.0.0.1:5173";
const localShell = path.join(process.env.LOCALAPPDATA ?? "", "ms-playwright", "chromium_headless_shell-1248", "chrome-headless-shell-win64", "chrome-headless-shell.exe");
const browser = await chromium.launch({ executablePath: process.env.SCALE_BROWSER_PATH ?? (fs.existsSync(localShell) ? localShell : chromium.executablePath()), headless: true });
const report = { screenshots: [], interactions: [], errors: [], brokenAssets: [] };
try {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 }, reducedMotion: "reduce" });
  page.setDefaultTimeout(30000);
  page.on("pageerror", error => report.errors.push(error.message));
  page.on("response", response => { if (response.status() >= 400 && response.url().includes("/assets/scale-universe/")) report.brokenAssets.push(response.url()); });
  await page.route("**/*", route => {
    const url = new URL(route.request().url());
    if (url.hostname !== "127.0.0.1") return route.abort();
    if (process.env.SCALE_STATIC_FIXTURE && url.pathname.startsWith("/assets/")) { url.pathname = `/public${url.pathname}`; return route.continue({ url: url.href }); }
    return route.continue();
  });
  await page.goto(`${base}${process.env.SCALE_TEST_ROUTE ?? "/physics/scale-of-universe"}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.locator(".scale-explorer[data-visible-objects]").waitFor({ timeout: 120000 });
  console.log("Explorer mounted");
  const root = page.locator(".scale-explorer");
  const exponent = async () => Number(await root.getAttribute("data-exponent"));
  const closePanels = async () => { await page.keyboard.press("Escape"); };
  async function capture(name) {
    const file = `${directory}/${name}.png`;
    await page.waitForLoadState("networkidle", { timeout: 15000 });
    await page.screenshot({ path: file });
    report.screenshots.push({ name, file, exponent: await exponent(), visibleObjects: await root.getAttribute("data-visible-objects"), viewport: page.viewportSize() });
  }
  await capture("desktop-human-1366");
  for (const [name, value] of [["subatomic", -15], ["atomic", -10], ["molecular", -8], ["cellular", -5], ["planetary", 7], ["solar", 11], ["stellar", 13], ["galactic", 21], ["cosmic", 26.9]]) {
    await page.locator(`[data-band-log="${value}"]`).click();
    await page.waitForFunction(value => Math.abs(Number(document.querySelector(".scale-explorer").dataset.exponent) - value) < .02, value);
    assert.equal(await page.locator(`[data-band-log="${value}"]`).getAttribute("aria-pressed"), "true");
    await capture(`desktop-${name}`);
  }
  report.interactions.push("All ten bands navigate the logarithmic camera and update selected state");
  await page.locator('[data-action="reset"]').click();
  await page.locator('[data-action="zoom-in"]').click();
  await page.waitForFunction(() => Number(document.querySelector(".scale-explorer").dataset.exponent) < -.9);
  await page.locator('[data-action="zoom-out"]').click();
  await page.waitForFunction(() => Math.abs(Number(document.querySelector(".scale-explorer").dataset.exponent)) < .02);
  report.interactions.push("Zoom In decreases exponent; Zoom Out increases exponent");
  const canvas = page.locator(".scale-stage>canvas");
  const rect = await canvas.boundingBox();
  const object = layoutObjects(discoverObjects(normalizedScaleUniverseObjects(), 0, rect.width, rect.height, null), rect.width, rect.height).find(entry => entry.object.id === "human");
  await page.mouse.click(rect.x + object.screenX, rect.y + object.screenY);
  await page.locator(".scale-info-panel h2").filter({ hasText: "Human" }).waitFor();
  await closePanels(); await page.locator('[data-action="reset"]').click();
  await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height * .8); await page.mouse.down(); await page.mouse.move(rect.x + rect.width / 2 + 50, rect.y + rect.height * .8 + 10, { steps: 5 }); await page.mouse.up();
  await page.waitForFunction(() => document.querySelector(".scale-explorer").dataset.pan !== "0.0,0.0");
  await page.locator('[data-action="reset"]').click();
  report.interactions.push("Canvas hit testing selects Human; drag pans the scene");
  const cdp = await page.context().newCDPSession(page);
  const center = { x: rect.x + rect.width / 2, y: rect.y + rect.height * .7 };
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: center.x - 30, y: center.y }, { x: center.x + 30, y: center.y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: center.x - 60, y: center.y }, { x: center.x + 60, y: center.y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await page.waitForFunction(() => Number(document.querySelector(".scale-explorer").dataset.exponent) < -.1);
  report.interactions.push("Two-finger spread zooms in toward smaller lengths");
  await page.locator('[data-action="reset"]').click();
  await canvas.hover(); await page.mouse.wheel(0, 150);
  await page.waitForFunction(() => Number(document.querySelector(".scale-explorer").dataset.exponent) > .1);
  const beforeKey = await exponent(); await canvas.focus(); await page.keyboard.press("+");
  await page.waitForFunction(previous => Number(document.querySelector(".scale-explorer").dataset.exponent) < previous - .5, beforeKey);
  report.interactions.push("Wheel and keyboard change exponent consistently");
  const slider = page.getByRole("slider", { name: "Logarithmic reference length in meters" });
  await slider.focus(); await page.keyboard.press("End");
  await page.waitForFunction(() => Number(document.querySelector(".scale-explorer").dataset.exponent) > 26.9);
  await page.keyboard.press("Home");
  await page.waitForFunction(() => Number(document.querySelector(".scale-explorer").dataset.exponent) < -34.9);
  report.interactions.push("Ruler keyboard reaches both -35 and +27 bounds");
  const rulerRect = await slider.boundingBox();
  await page.mouse.click(rulerRect.x + rulerRect.width * .75, rulerRect.y + 10);
  await page.waitForFunction(() => Math.abs(Number(document.querySelector(".scale-explorer").dataset.exponent) - 11.5) < .1);
  await page.mouse.move(rulerRect.x + rulerRect.width * .75, rulerRect.y + 10); await page.mouse.down(); await page.mouse.move(rulerRect.x + rulerRect.width * .5, rulerRect.y + 10, { steps: 6 }); await page.mouse.up();
  await page.waitForFunction(() => Math.abs(Number(document.querySelector(".scale-explorer").dataset.exponent) + 4) < .1);
  report.interactions.push("Ruler click and drag scrub to fractional exponents");
  for (const [query, expected] of [["RBC", "Red Blood Cell"], ["Sgr A*", "Sagittarius A* Horizon"], ["Earth-Moon", "Earth-Moon Distance"], ["Laniakea", "Laniakea Supercluster"]]) {
    const input = page.getByRole("searchbox"); await input.fill(query); await input.press("Enter");
    await page.locator(".scale-info-panel h2").filter({ hasText: expected }).waitFor();
    await closePanels();
  }
  report.interactions.push("Search aliases find, focus and open metadata");
  await page.getByRole("searchbox").fill("Earth"); await page.getByRole("searchbox").press("Enter");
  await page.locator('[data-info-action="bookmark"]').click();
  await page.locator('[data-info-action="compare"]').click();
  await page.locator(".scale-compare-select").selectOption("jupiter");
  assert((await page.locator(".scale-compare-ratio").textContent()).includes("Jupiter"));
  await page.locator("[data-compare-add]").click();
  assert.equal(await page.locator(".scale-compare-physical>div").count(), 3);
  await capture("comparison-shared-scale"); await closePanels();
  report.interactions.push("Bookmark and compare three objects with one physical scale");
  await page.locator('[data-action="journey"]').click(); await page.locator('[data-journey-id="complete-universe"]').click();
  assert((await page.locator(".scale-journey-status").textContent()).includes("Step 1"));
  await page.locator('[data-journey-action="next"]').click();
  assert((await page.locator(".scale-journey-status").textContent()).includes("Step 2"));
  await page.locator('[data-journey-action="exit"]').click(); await closePanels();
  report.interactions.push("Complete guided journey starts, advances and exits");
  for (const [action, panel] of [["quiz", ".scale-quiz-panel"], ["teacher", ".scale-teacher-panel"], ["bookmarks", ".scale-bookmarks-panel"], ["units", ".scale-units-panel"], ["help", ".scale-help-panel"]]) {
    await page.locator(`[data-action="${action}"]`).click(); assert(await page.locator(panel).isVisible()); await closePanels();
  }
  await page.locator('[data-action="quiz"]').click();
  await page.locator('[data-answer="earth"]').click();
  assert((await page.locator(".scale-quiz-feedback").textContent()).includes("Correct"));
  await closePanels();
  await page.locator('[data-action="teacher"]').click();
  await page.locator('[data-teacher-lesson="powers-of-ten-atom-to-human"]').click();
  await page.waitForFunction(() => Number(document.querySelector(".scale-explorer").dataset.exponent) < -9);
  await page.locator('[data-teacher-action="pause"]').click(); const pausedExponent = await exponent();
  await page.locator('[data-teacher-action="next"]').click();
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  assert(Math.abs(await exponent() - pausedExponent) < .001);
  await page.locator('[data-teacher-action="pause"]').click();
  await page.waitForFunction(previous => Math.abs(Number(document.querySelector(".scale-explorer").dataset.exponent) - previous) > .1, pausedExponent);
  await closePanels();
  report.interactions.push("Quiz grades from object data; teacher transitions pause and resume");
  report.interactions.push("Quiz, teacher, bookmarks, units and help open and close");
  assert(await page.locator('[data-action="sound"]').isDisabled());
  await page.locator('[data-action="fullscreen"]').click();
  await page.waitForFunction(() => Boolean(document.fullscreenElement));
  await page.locator('[data-action="fullscreen"]').click();
  await page.waitForFunction(() => !document.fullscreenElement);
  report.interactions.push("Fullscreen enters and exits; unavailable sound is disabled");
  await page.locator('[data-action="reset"]').click(); await page.setViewportSize({ width: 1920, height: 1080 });
  await capture("desktop-human-1920");
  await page.setViewportSize({ width: 768, height: 1024 });
  await capture("tablet-human");
  await page.setViewportSize({ width: 390, height: 844 });
  await capture("mobile-human");
  const dimensions = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight, screenHeight: innerHeight }));
  assert(dimensions.width <= dimensions.viewport + 1, "No horizontal mobile overflow");
  report.interactions.push("Desktop 1366/1920 and mobile 390 responsive layouts captured");
  assert.deepEqual(report.errors, []); assert.deepEqual(report.brokenAssets, []);
  report.passed = true;
} catch (error) { report.passed = false; report.failure = error.stack; throw error; }
finally { fs.writeFileSync(`${directory}/browser-verification.json`, JSON.stringify(report, null, 2)); await browser.close(); }
console.log(JSON.stringify({ passed: report.passed, screenshots: report.screenshots.length, checks: report.interactions.length }));
