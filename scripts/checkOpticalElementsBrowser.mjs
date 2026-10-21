import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const executablePath = process.env.OPTICS_BROWSER_PATH ?? path.join(process.env.LOCALAPPDATA, 'ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe');
const browser = await chromium.launch({ executablePath, headless: true });
const output = 'artifacts/optical-elements';
fs.mkdirSync(output, { recursive: true });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'reduce' });
  page.setDefaultTimeout(15000);
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${process.env.OPTICS_TEST_URL ?? 'http://127.0.0.1:5173'}/optics/optical-elements`, { waitUntil: 'commit', timeout: 30000 });
  console.log('Optics document received');
  await page.locator('.oe-lab').waitFor({ timeout: 120000 });
  console.log('Optics lab mounted');
  assert.equal(await page.locator('.oe-elements button[aria-label^="Add "]').count(), 44);
  assert.equal(await page.getByLabel('Optical material').locator('option').count(), 26);
  const worldPoint = async (x, y) => page.locator('.oe-diagram').evaluate((svg, point) => {
    const result = new DOMPoint(point.x, point.y).matrixTransform(svg.getScreenCTM());
    return { x: result.x, y: result.y };
  }, { x, y });
  await page.locator('.oe-diagram').scrollIntoViewIfNeeded();
  const target = await worldPoint(4, -3);
  const benchBox = await page.locator('.oe-diagram').boundingBox();
  await page.getByRole('button', { name: 'Add Thin glass plate', exact: true }).dragTo(page.locator('.oe-diagram'), { targetPosition: { x: target.x - benchBox.x, y: target.y - benchBox.y } });
  assert.equal(await page.locator('.oe-glass-piece').count(), 2, 'Library drag must add exactly one shape');
  assert.ok(Math.abs(Number(await page.getByRole('slider', { name: 'Horizontal position', exact: true }).inputValue()) - 4) < .1);
  assert.ok(Math.abs(Number(await page.getByRole('slider', { name: 'Vertical position', exact: true }).inputValue()) + 3) < .1);
  // Grab just outside the thin plate's visible edge, inside its enlarged target.
  const edge = await worldPoint(4 + .22 * .65, -3);
  await page.mouse.move(edge.x + 4, edge.y);
  await page.mouse.down();
  await page.mouse.move(edge.x + 28, edge.y, { steps: 5 });
  await page.mouse.up();
  assert.ok(Number(await page.getByRole('slider', { name: 'Horizontal position', exact: true }).inputValue()) > 4.3, 'Thin glass must be easy to grab near its edge');
  await page.getByRole('button', { name: 'Remove glass', exact: true }).click();
  for (const name of ['Square glass', 'Parallelogram glass', 'Wide glass block', '30° apex prism', '45° apex prism', '90° apex prism', 'Scalene prism', 'Heptagonal prism', 'Nonagonal prism', 'Decagonal prism', 'Dodecagonal prism', 'Capsule glass', 'Quarter-cylinder glass', 'Circular segment', 'Half-elliptical glass', 'Teardrop glass', 'Rounded glass block', 'Superelliptical glass', 'Thick convex lens', 'Asymmetric convex lens']) {
    await page.getByRole('button', { name: `Add ${name}`, exact: true }).click();
    assert.equal(await page.locator('.oe-glass-piece').count(), 2, `${name}: can be added to the bench`);
    assert.ok((await page.locator('.oe-about h2').textContent()).includes(name));
    assert.equal(await page.locator('.oe-glass-piece .oe-glass-finish').count(), 2, `${name}: has glass rendering`);
    await page.getByRole('button', { name: 'Remove glass', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Add Cone', exact: true }).click();
  assert.equal(await page.locator('.oe-glass-piece').count(), 2);
  await page.getByLabel('Optical material').selectOption('25');
  await page.getByRole('slider', { name: 'Element rotation', exact: true }).fill('25');
  await page.getByRole('button', { name: 'Duplicate', exact: true }).click();
  assert.equal(await page.locator('.oe-glass-piece').count(), 3);
  assert.equal(await page.getByLabel('Optical material').inputValue(), '25');
  await page.getByRole('button', { name: '1 · Prism', exact: true }).click();
  assert.equal(await page.getByLabel('Optical material').inputValue(), '0', 'Materials must be independent');
  await page.getByRole('button', { name: 'Lens pair', exact: true }).click();
  assert.equal(await page.locator('.oe-glass-piece').count(), 2);
  const firstPiece = page.getByRole('button', { name: 'Select glass 1: Convex lens', exact: true });
  await firstPiece.focus();
  await page.keyboard.press('ArrowDown');
  assert.ok(Math.abs(Number(await page.getByRole('slider', { name: 'Vertical position', exact: true }).inputValue()) - .1) < .001);
  const box = await firstPiece.boundingBox();
  assert.ok(box);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height * .6);
  await page.mouse.down();
  const beforeDrag = await page.locator('.oe-diagram polyline').first().getAttribute('points');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height * .6 + 24, { steps: 5 });
  assert.ok(await page.locator('.oe-diagram').evaluate(svg => svg.classList.contains('oe-dragging')));
  assert.notEqual(await page.locator('.oe-diagram polyline').first().getAttribute('points'), beforeDrag, 'Rays must update while the mouse is still held');
  await page.mouse.up();
  assert.ok(await page.locator('.oe-diagram').evaluate(svg => !svg.classList.contains('oe-dragging')));
  assert.ok(Number(await page.getByRole('slider', { name: 'Vertical position', exact: true }).inputValue()) > .3, 'Pointer dragging must move the piece');
  const labelBox = await firstPiece.locator('.oe-glass-label').boundingBox();
  const beforeLabelDrag = Number(await page.getByRole('slider', { name: 'Horizontal position', exact: true }).inputValue());
  await page.mouse.move(labelBox.x + labelBox.width / 2, labelBox.y + labelBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(labelBox.x + labelBox.width / 2 + 24, labelBox.y + labelBox.height / 2, { steps: 5 });
  await page.mouse.up();
  assert.ok(Number(await page.getByRole('slider', { name: 'Horizontal position', exact: true }).inputValue()) > beforeLabelDrag + .3, 'Labels must also act as drag handles');
  await page.getByRole('button', { name: 'Two-glass spectrum', exact: true }).click();
  assert.ok(await page.getByLabel('Three-colour spectrum').isChecked());
  assert.ok(await page.locator('.oe-readings tbody tr').count() >= 4);
  assert.ok((await page.locator('.oe-readings tbody').textContent()).includes('#2'), 'The spectrum preset must trace through both prisms');
  await page.evaluate(() => { window.scrollTo(0, 0); document.querySelector('.oe-elements').scrollTop = 0; });
  await page.screenshot({ path: `${output}/multi-glass-desktop.png`, fullPage: true });
  await page.getByLabel('Search glass shapes').fill('cone');
  assert.equal(await page.locator('.oe-elements button[aria-label^="Add "]').count(), 2);
  await page.getByLabel('Search glass shapes').fill('');
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Add Thin glass plate', exact: true }).click();
  assert.equal(await page.locator('.oe-glass-piece').count(), 6);
  assert.ok(await page.getByRole('button', { name: 'Add Cone', exact: true }).isDisabled());
  await page.getByRole('button', { name: 'Remove glass', exact: true }).click();
  assert.equal(await page.locator('.oe-glass-piece').count(), 5);
  await page.getByRole('button', { name: 'Reset experiment', exact: false }).click();
  assert.equal(await page.locator('.oe-glass-piece').count(), 1);
  await page.getByRole('button', { name: 'Remove glass', exact: true }).click();
  assert.equal(await page.locator('.oe-glass-piece').count(), 0);
  await page.getByRole('button', { name: 'Add Cone', exact: true }).click();
  assert.equal(await page.locator('.oe-glass-piece').count(), 1);
  await page.setViewportSize({ width: 390, height: 844 });
  if (await page.getByRole('button', { name: 'Close controls', exact: true }).isVisible()) await page.getByRole('button', { name: 'Close controls', exact: true }).click();
  await page.getByRole('button', { name: 'Lens pair', exact: true }).click();
  await page.evaluate(() => { window.scrollTo(0, 0); document.querySelector('.oe-elements').scrollTop = 0; });
  await page.screenshot({ path: `${output}/multi-glass-mobile.png`, fullPage: true });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile page must not overflow horizontally');
  // Real browser touch events exercise pointer capture, not mouse emulation.
  const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const touchPage = await touchContext.newPage();
  touchPage.on('pageerror', error => errors.push(error.message));
  await touchPage.goto(`${process.env.OPTICS_TEST_URL ?? 'http://127.0.0.1:5173'}/optics/optical-elements`, { waitUntil: 'domcontentloaded' });
  await touchPage.locator('.oe-diagram').scrollIntoViewIfNeeded();
  const touchPoints = await touchPage.locator('.oe-diagram').evaluate(svg => [new DOMPoint(0, .2), new DOMPoint(2, -.8)].map(p => {
    const result = p.matrixTransform(svg.getScreenCTM()); return { x: result.x, y: result.y };
  }));
  const cdp = await touchContext.newCDPSession(touchPage);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [touchPoints[0]] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [touchPoints[1]] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await touchPage.getByRole('button', { name: 'Open controls', exact: true }).click();
  assert.ok(Math.abs(Number(await touchPage.getByRole('slider', { name: 'Horizontal position', exact: true }).inputValue()) - 2) < .1, 'Touch drag must move glass horizontally');
  assert.ok(Math.abs(Number(await touchPage.getByRole('slider', { name: 'Vertical position', exact: true }).inputValue()) + 1) < .1, 'Touch drag must preserve the grab offset');
  await touchContext.close();
  assert.deepEqual(errors, []);
  console.log('PASS: library drag/drop, live ray updates during mouse drag, touch dragging, 44 shapes, 26 materials, independent settings, keyboard movement, six-piece limit, presets and mobile width.');
} finally {
  await browser.close();
}


