import assert from "node:assert/strict";
import { build } from "esbuild";
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
const compiled = await build({ entryPoints: ["src/experiments/expansion-labs/atomicInteractionPhysics.ts"], bundle: true, platform: "node", format: "esm", write: false });
const { atomicInteraction } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString("base64")}`);
const equilibrium = 2 ** (1/6) * 3.4;
assert.ok(Math.abs(atomicInteraction(equilibrium,3.4,10).potential + 10) < 1e-10);
assert.equal(atomicInteraction(equilibrium,3.4,10).force, 0);
for (const separation of [2.8, 3.8, 4.5, 7]) {
  const delta = 1e-5;
  const derivative = -(atomicInteraction(separation+delta,3.4,10).potential-atomicInteraction(separation-delta,3.4,10).potential)/(2*delta);
  assert.ok(Math.abs(derivative-atomicInteraction(separation,3.4,10).force)<1e-4);
}
const browser = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 1672, height: 945 } });
const errors = []; page.on("pageerror", error=>errors.push(error.message));
try {
  await page.goto("http://127.0.0.1:5367/experiments/atomic-interactions");
  await page.locator(".atomic-objects canvas").waitFor({timeout:60000});
  await page.getByRole("tab", { name: "3D", exact: true }).click();
  await page.locator(".atomic-objects canvas").waitFor();
  await page.getByRole("tab", { name: "Simulate", exact: true }).click();
  await page.locator(".atomic-objects canvas").waitFor();
  assert.equal(await page.getByTestId("atomic-interaction").textContent(),"REPULSIVE");
  assert.ok((await page.getByTestId("atomic-potential").textContent()).includes("-9.99"));
  await page.getByRole("button",{name:"Equilibrium",exact:true}).click();
  assert.equal(await page.getByTestId("atomic-interaction").textContent(),"BALANCED");
  assert.equal(await page.getByTestId("atomic-force").textContent(),"0.00 meV/Å");
  await page.getByRole("button",{name:"Attractive",exact:true}).click();
  assert.equal(await page.getByTestId("atomic-interaction").textContent(),"ATTRACTIVE");
  await page.getByRole("button",{name:"Nuclei only",exact:true}).click();
  assert.equal(await page.getByRole("button",{name:"Nuclei only",exact:true}).getAttribute("aria-pressed"),"true");
  const graph = page.getByRole("slider",{name:"Separation on potential energy graph"});
  const old = Number(await graph.getAttribute("aria-valuenow")); await graph.press("ArrowRight");
  assert.ok(Number(await graph.getAttribute("aria-valuenow")) > old);
  const bounds = await page.locator(".atomic-objects canvas").boundingBox();
  await page.mouse.move(bounds.x+bounds.width*.7,bounds.y+bounds.height*.5); await page.mouse.down(); await page.mouse.move(bounds.x+bounds.width*.8,bounds.y+bounds.height*.5,{steps:5}); await page.mouse.up();
  assert.ok(Number(await graph.getAttribute("aria-valuenow"))>6);
  await page.getByRole("button",{name:/Reset/,exact:false}).click();
  await mkdir("artifacts/atomic-interactions",{recursive:true});
  await page.screenshot({path:"artifacts/atomic-interactions/desktop.png",fullPage:true});
  await page.setViewportSize({width:390,height:844}); await page.waitForTimeout(150);
  await page.screenshot({path:"artifacts/atomic-interactions/mobile.png",fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
  assert.deepEqual(errors,[]);
  console.log("PASS: Lennard–Jones derivative and equilibrium; presets, appearance toggle, graph keyboard control, atom drag, mobile layout; no browser errors.");
} finally {await browser.close();}
