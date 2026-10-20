import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { normalizedScaleUniverseObjects } from '../src/physics/scale-of-universe/scaleUniverseData.js';
const directory = 'artifacts/scale-universe-upgrade/remaining-cutouts';
fs.mkdirSync(directory, { recursive: true });
const verification = JSON.parse(fs.readFileSync('artifacts/scale-universe-upgrade/remaining-alpha-verification.json', 'utf8'));
assert.equal(verification.rejected.length, 0, 'Generated assets must pass alpha verification');
const generated = verification.installed;
const objects = normalizedScaleUniverseObjects();
for (const asset of generated) {
  const object = objects.find(object => object.id === asset.id);
  assert.equal(object?.assetPath, asset.assetPath, asset.id);
  assert.deepEqual(object.sourceBox, asset.sourceBox, asset.id);
}
const executablePath = path.join(process.env.LOCALAPPDATA, 'ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe');
const browser = await chromium.launch({ executablePath, headless: true });
const report = { assets: generated.length, decodedAssets: [], screenshots: [], detailPreviews: [], galleryScreenshots: [], errors: [], brokenAssets: [] };
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && response.url().includes('/assets/scale-universe/')) report.brokenAssets.push(response.url()); });
  await page.route('**/*', route => ['127.0.0.1', 'localhost'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
  await page.goto('http://127.0.0.1:5181/physics/scale-of-universe', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.locator('.scale-explorer[data-visible-objects]').waitFor({ timeout: 120000 });
  for (let index = 0; index < generated.length; index += 8) {
    const batch = generated.slice(index, index + 8);
    report.decodedAssets.push(...await page.evaluate(async assets => Promise.all(assets.map(async asset => {
      const image = new Image(); image.src = asset.assetPath; await image.decode();
      if (!image.naturalWidth) throw new Error(`Cannot decode ${asset.id}`);
      return asset.id;
    })), batch));
  }
  for (const exponent of [-9.5, -3.5, -2, -.7, 0, .7, 1.3, 2, 2.7, 3.5, 4.5, 6, 7, 9, 11, 13, 17, 20, 22, 25, 26.9]) {
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
  for (const id of ['human', 'earth', 'ribosome', 'eiffel-tower']) {
    const object = objects.find(candidate => candidate.id === id);
    if (!object?.sourceBox) continue;
    await page.getByRole('searchbox').fill(object.name);
    await page.getByRole('searchbox').press('Enter');
    const preview = page.locator(`.scale-preview-canvas[data-object-id="${id}"]`);
    await preview.waitFor();
    assert.equal(await preview.getAttribute('data-visual-type'), 'transparent-cutout');
    assert((await preview.boundingBox()).height >= 150, 'Detail illustration must have a visible height');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${directory}/detail-${id}.png` });
    report.detailPreviews.push(id);
    await page.keyboard.press('Escape');
  }
  await page.unrouteAll();
  await page.goto(pathToFileURL(path.resolve('artifacts/scale-universe-upgrade/cutout-gallery.html')).href);
  await page.locator('img').evaluateAll(async images => {
    for (const image of images) image.loading = 'eager';
    await Promise.all(images.map(image => image.decode()));
  });
  for (const group of ['Molecules', 'Cells and Microbes', 'Animals', 'Planets and Moons', 'Stars', 'Galaxies', 'Cosmic Structures', 'Human Scale', 'Earth and Geography']) {
    const section = page.locator('section').filter({ has: page.getByRole('heading', { name: group, exact: true }) });
    if (!await section.count()) continue;
    const file = `${directory}/gallery-${group.toLowerCase().replaceAll(' ', '-')}.png`;
    await section.screenshot({ path: file });
    report.galleryScreenshots.push(file);
  }
  assert.deepEqual(report.brokenAssets, []);
  assert.deepEqual(report.errors, []);
  assert.equal(report.decodedAssets.length, generated.length);
} finally {
  await browser.close();
  fs.writeFileSync(`${directory}/browser-verification.json`, JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ decoded: report.decodedAssets.length, screenshots: report.screenshots.length, errors: report.errors, brokenAssets: report.brokenAssets }));
