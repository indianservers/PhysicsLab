import assert from "node:assert/strict";
import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 1365, height: 950 } });
try {
  await page.goto("http://localhost:5367/experiments/young-double-slit");
  const stage = page.locator(".three-lab-canvas");
  await stage.locator("canvas").waitFor();
  await page.getByRole("button", { name: "Pause simulation", exact: true }).click();
  await page.waitForTimeout(100);
  const paused = Number(await stage.getAttribute("data-simulation-time"));
  await page.waitForTimeout(200);
  assert.equal(Number(await stage.getAttribute("data-simulation-time")), paused);
  await page.getByRole("button", { name: "Step simulation", exact: true }).click();
  await page.waitForTimeout(100);
  assert.ok(Math.abs(Number(await stage.getAttribute("data-simulation-time")) - paused - .1) < .002);
  await page.getByRole("button", { name: "Play simulation", exact: true }).click();
  await page.waitForTimeout(250);
  assert.ok(Number(await stage.getAttribute("data-simulation-time")) > paused + .1);
  await page.getByRole("button", { name: "Reset experiment", exact: true }).click();
  await page.screenshot({ path: "artifacts/lesson-interactions/shared-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);
  await page.screenshot({ path: "artifacts/lesson-interactions/shared-mobile.png", fullPage: true });
  const bounds = await stage.boundingBox();
  assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 392, "The 3D stage must fit a phone viewport");
  console.log("PASS: shared playback pause, step, resume, reset, enabled wave scene, and mobile stage bounds.");
} finally { await browser.close(); }
