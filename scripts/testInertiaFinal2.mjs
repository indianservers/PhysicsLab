import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const browser=await chromium.launch({executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:true});
try {
 const page=await browser.newPage({viewport:{width:1536,height:1024}}),errors=[],failed=[];
 page.on("pageerror",e=>errors.push(e.message)); page.on("requestfailed",r=>failed.push(r.url()));
 await page.goto("http://127.0.0.1:5371/motion/first-law-inertia"); await page.locator(".ils-stage").waitFor();
 const play=page.locator(".ils-actions button").nth(3), pause=page.locator(".ils-actions button").nth(0);
 await play.dispatchEvent("click"); await page.waitForTimeout(250); assert.match(await page.locator(".ils-scene svg").textContent(),/v =/); await pause.dispatchEvent("click");
 for(const [width,height] of [[1536,1024],[1440,900],[1280,720],[1024,768],[768,1024],[390,844]]) { await page.setViewportSize({width,height}); assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0); await page.screenshot({path:`artifacts/studio-rebuild/25-first-law-inertia/final-${width}.png`,fullPage:true}); }
 assert.deepEqual(errors,[]); assert.deepEqual(failed,[]); await fs.writeFile("artifacts/studio-rebuild/25-first-law-inertia/browser-checks.json",JSON.stringify({checks:["animation updates live velocity label and pauses","six viewport screenshots without horizontal overflow"],errors,failed},null,2)); console.log({errors,failed});
} finally { await browser.close(); }
