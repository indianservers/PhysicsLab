import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
const browser=await chromium.launch({executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",headless:true});
const page=await browser.newPage({viewport:{width:1536,height:1024}});
const errors=[];page.on("pageerror",e=>errors.push(e.message));
const read=async()=>page.getByTestId("newton-cart").evaluate(el=>({x:Number(el.dataset.position),t:Number(el.dataset.time)}));
const range=async(name,value)=>page.getByRole("slider",{name,exact:true}).evaluate((el,v)=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(el,String(v));el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}));},value);
try {
  await page.goto("http://127.0.0.1:5367/experiments/newton-s-second-law");
  await page.locator(".n2-webgl canvas").waitFor();
  await page.getByRole("button",{name:"▶ Play",exact:true}).click();
  await page.waitForTimeout(850);
  await page.getByRole("button",{name:"Ⅱ Pause",exact:true}).click();
  await page.waitForTimeout(100);
  const moving=await read();assert.ok(moving.x>0);assert.ok(Math.abs(moving.x-2.5*moving.t**2)<1e-8);
  await page.waitForTimeout(250);assert.deepEqual(await read(),moving);
  await page.getByRole("button",{name:"▷ Step",exact:true}).click();await page.waitForTimeout(100);assert.ok((await read()).x>moving.x);
  await page.getByRole("button",{name:"↻ Reset experiment",exact:true}).click();await page.waitForTimeout(100);assert.equal((await read()).x,0);
  await range("Applied force",-6);
  await page.getByRole("button",{name:"▷ Step",exact:true}).click();await page.waitForTimeout(100);assert.ok((await read()).x<0);
  await range("Friction",10);
  await page.getByRole("button",{name:"▷ Step",exact:true}).click();await page.waitForTimeout(100);assert.equal((await read()).x,0);
  await page.getByRole("button",{name:"↻ Reset experiment",exact:true}).click();
  await page.getByRole("combobox",{name:"Playback speed"}).selectOption("2");
  await page.getByRole("button",{name:"▶ Play",exact:true}).click();
  await page.waitForFunction(()=>Number(document.querySelector('[data-testid="newton-cart"]')?.dataset.time)===3,{},{timeout:15000});
  assert.equal((await read()).x,22.5);
  await page.getByRole("button",{name:"▶ Play",exact:true}).click();await page.waitForTimeout(100);assert.ok((await read()).t<3);
  await page.getByRole("button",{name:"↻ Reset experiment",exact:true}).click();
  await page.getByRole("button",{name:"Reset view",exact:true}).click();
  await mkdir("artifacts/newton-animation",{recursive:true});
  await page.screenshot({path:"artifacts/newton-animation/desktop.png",fullPage:true});
  await page.getByRole("tab",{name:"3D",exact:true}).click();await page.locator(".n2-webgl canvas").waitFor();
  for(const width of [820,390]){await page.setViewportSize({width,height:1000});await page.waitForTimeout(200);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));await page.screenshot({path:`artifacts/newton-animation/${width}.png`,fullPage:true});}
  await page.goto("http://127.0.0.1:5367/experiments/atomic-interactions");await page.locator(".atomic-objects canvas").waitFor();
  assert.deepEqual(errors,[]);
  console.log("PASS: real 3D cart moves; x=½at²; pause/step/reset/reverse/friction hold/end/replay; 3D tab; tablet/mobile; unrelated atomic route; no page errors.");
} finally {await browser.close();}
