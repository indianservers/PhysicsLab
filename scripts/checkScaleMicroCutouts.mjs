import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { normalizedScaleUniverseObjects } from '../src/physics/scale-of-universe/scaleUniverseData.js';
const directory = 'artifacts/scale-universe-upgrade/micro-cutouts';
fs.mkdirSync(directory, { recursive: true });
const generated = JSON.parse(fs.readFileSync('artifacts/scale-universe-upgrade/micro-alpha-verification.json', 'utf8'));
const objects = normalizedScaleUniverseObjects();
for (const asset of generated) {
  const object = objects.find(object => object.id === asset.id);
  assert(object, asset.id);
  assert.equal(object.assetPath, asset.assetPath);
  assert.deepEqual(object.sourceBox, asset.sourceBox);
}
const executablePath = path.join(process.env.LOCALAPPDATA, 'ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe');
const browser = await chromium.launch({ executablePath, headless: true });
const report = { assets: generated.length, screenshots: [], errors: [], brokenAssets: [] };
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && response.url().includes('/assets/scale-universe/')) report.brokenAssets.push(response.url()); });
  await page.route('**/*', route => ['127.0.0.1', 'localhost'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
  await page.goto('http://127.0.0.1:5181/physics/scale-of-universe', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.locator('.scale-explorer[data-visible-objects]').waitFor({ timeout: 120000 });
  await page.evaluate(async paths => {
    await Promise.all(paths.map(async src => { const image = new Image(); image.src = src; await image.decode(); }));
  }, generated.map(asset => asset.assetPath));
  for (const exponent of [-7.92, -6.98, -6, -4.42]) {
    const slider = await page.locator('.scale-slider-track').boundingBox();
    await page.mouse.click(slider.x + slider.width * (exponent + 35) / 62, slider.y + slider.height / 2);
    await page.waitForFunction(value => Math.abs(Number(document.querySelector('.scale-explorer').dataset.exponent) - value) < .03, exponent);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => new Promise(resolve => {
      window.dispatchEvent(new Event('scale-asset-ready'));
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    }));
    const file = `${directory}/scale-${exponent}.png`;
    await page.screenshot({ path: file });
    report.screenshots.push({ exponent, file, visible: await page.locator('.scale-explorer').getAttribute('data-visible-objects') });
  }
  assert.deepEqual(report.brokenAssets, []);
  assert.deepEqual(report.errors, []);
} finally {
  await browser.close();
  fs.writeFileSync(`${directory}/browser-verification.json`, JSON.stringify(report, null, 2));
}
console.log(JSON.stringify(report, null, 2));
