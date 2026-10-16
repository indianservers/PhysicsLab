import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1536,height:1024}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const out='artifacts/physics-studio-audit/gravitational-field';await mkdir(out,{recursive:true});
try{
 await page.goto('http://127.0.0.1:5173/motion/gravitational-field',{waitUntil:'networkidle'});
 await page.locator('.splash-loader').waitFor({state:'hidden'});
 assert.equal(await page.locator('.studio-enhancement-dock').count(),0);
 const expected=6.674e-11*5.97e24/(2.08e7)**2;assert.equal(await page.locator('[data-field-reading]').textContent(),expected.toFixed(3)+' m/s²');
 const count=await page.locator('[data-field-vector]').count();
 await page.getByRole('spinbutton',{name:'Vector Density value',exact:true}).fill('30');await page.getByRole('spinbutton',{name:'Vector Density value',exact:true}).blur();assert(await page.locator('[data-field-vector]').count()>count);
 const inward=await page.locator('[data-field-vector]').evaluateAll(es=>es.every(e=>{const n=k=>Number(e.getAttribute(k));return (n('x2')-n('x1'))*(n('x1')-450)+(n('y2')-n('y1'))*(n('y1')-380)<0}));assert(inward);
 await page.getByRole('spinbutton',{name:'Probe Radius r value',exact:true}).fill('41600000');await page.getByRole('spinbutton',{name:'Probe Radius r value',exact:true}).blur();assert.equal(await page.locator('[data-field-reading]').textContent(),(expected/4).toFixed(3)+' m/s²');
 const before=await page.locator('[data-inverse-square]').getAttribute('points');await page.getByRole('spinbutton',{name:'Planet Mass M value',exact:true}).fill('11940000000000000000000000');await page.getByRole('spinbutton',{name:'Planet Mass M value',exact:true}).blur();assert.notEqual(await page.locator('[data-inverse-square]').getAttribute('points'),before);
 await page.getByRole('button',{name:'Potential View',exact:true}).click();assert.equal(await page.locator('[data-equipotential]').count(),7);assert.equal(await page.locator('[data-field-vector]').count(),0);
 await page.getByRole('button',{name:'Trajectories',exact:true}).click();assert.equal(await page.locator('[data-orbit-path]').count(),1);
 const initial=await page.locator('[data-gravity-probe]').getAttribute('data-world-x');await page.getByRole('button',{name:'Play',exact:true}).click();await page.waitForFunction(initial=>document.querySelector('[data-gravity-probe]').dataset.worldX!==initial,initial);await page.getByRole('button',{name:'Pause',exact:true}).click();const paused=await page.locator('[data-gravity-probe]').getAttribute('data-world-x');await page.waitForTimeout(150);assert.equal(await page.locator('[data-gravity-probe]').getAttribute('data-world-x'),paused);
 await page.getByRole('button',{name:'Predict',exact:true}).click();await page.getByRole('button',{name:'One quarter',exact:true}).click();assert.match(await page.getByRole('status').last().textContent(),/Correct/);await page.getByRole('button',{name:'Close dialog'}).click();await page.getByRole('button',{name:'Reset',exact:true}).click();
 const sizes=[];for(const width of [1536,1024,768,390]){await page.setViewportSize({width,height:1024});await page.evaluate(()=>scrollTo(0,0));const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);assert.equal(overflow,0);sizes.push({width,overflow});await page.screenshot({path:out+`/after-${width}.png`});}
 assert.deepEqual(errors,[]);await writeFile(out+'/verification.json',JSON.stringify({defaultField:expected,densityAffectsArrows:true,inward,quarterAtDoubleRadius:true,graphChangesWithMass:true,views:['Field View','Potential View','Trajectories'],playPause:true,sizes,errors},null,2));console.log('PASS field model, vector density/direction, graph, three views, play/pause, prediction and four viewports');
}finally{await browser.close();}
