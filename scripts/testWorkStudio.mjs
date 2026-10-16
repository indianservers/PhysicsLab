import assert from 'node:assert/strict';
import {buildSync} from 'esbuild';
import {chromium} from 'playwright-core';
import {mkdir,writeFile} from 'node:fs/promises';
const code=buildSync({stdin:{contents:"export * from './src/lib/workStudio';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'cjs',write:false}).outputFiles[0].text;
const module={exports:{}};new Function('module','exports',code)(module,module.exports);
const {workSolution,workSettings}=module.exports;
const cases=[{force:50,angle:30,distance:2,expected:86.6025403784},{force:40,angle:60,distance:3,expected:60},{force:25,angle:0,distance:4,expected:100},{force:100,angle:90,distance:5,expected:0},{force:0,angle:45,distance:5,expected:0},{force:200,angle:0,distance:0,expected:0}];
for(const c of cases){const s=workSolution(c);assert(Math.abs(s.work-c.expected)<1e-8);assert(Math.abs(s.fx*s.fx+s.fy*s.fy-c.force*c.force)<1e-8);}
assert.deepEqual(workSettings({force:-20,angle:120,distance:10}),{force:0,angle:90,distance:5});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1536,height:1024}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const dir='artifacts/physics-studio-audit/work';await mkdir(dir,{recursive:true});
try{
 await page.goto('http://127.0.0.1:5173/motion/work',{waitUntil:'networkidle'});
 await page.locator('.splash-loader').waitFor({state:'hidden'});
 assert.equal(await page.locator('.frs-stage img').count(),0);
 const initialCart=await page.locator('[data-work-cart]').getAttribute('transform');
 await page.getByRole('spinbutton',{name:'Distance d value',exact:true}).fill('4');await page.getByRole('spinbutton',{name:'Distance d value',exact:true}).blur();
 assert.notEqual(await page.locator('[data-work-cart]').getAttribute('transform'),initialCart);
 await page.getByRole('spinbutton',{name:'Pull Angle θ value',exact:true}).fill('90');await page.getByRole('spinbutton',{name:'Pull Angle θ value',exact:true}).blur();
 assert.equal(await page.locator('.frs-readings p').last().locator('b').textContent(),'0.0 J');
 assert(Math.abs(Number(await page.locator('[data-work-force]').getAttribute('x2'))-Number(await page.locator('[data-work-force]').getAttribute('x1')))<1e-8);
 await page.getByRole('button',{name:'Predict',exact:true}).click();await page.getByRole('spinbutton',{name:'Predicted work'}).fill('0');await page.getByRole('button',{name:'Check answer',exact:true}).click();assert.match(await page.getByRole('status').last().textContent(),/Correct/);await page.getByRole('button',{name:'Close dialog'}).click();
 await page.getByRole('button',{name:'Experiment',exact:true}).click();await page.getByRole('spinbutton',{name:'Experiment pull angle value'}).fill('60');await page.getByRole('spinbutton',{name:'Experiment pull angle value'}).blur();await page.getByRole('button',{name:'Return to apparatus'}).click();assert.equal(await page.locator('.frs-readings p').last().locator('b').textContent(),'100.0 J');
 await page.getByRole('button',{name:'Next Challenge',exact:true}).click();await page.getByRole('spinbutton',{name:'Predicted work'}).fill('60');await page.getByRole('button',{name:'Check answer',exact:true}).click();assert.match(await page.getByRole('status').last().textContent(),/Correct/);await page.getByRole('button',{name:'Next question'}).click();assert.equal(await page.getByRole('spinbutton',{name:'Predicted work'}).inputValue(),'');await page.getByRole('button',{name:'Close dialog'}).click();
 await page.getByRole('button',{name:'Play',exact:true}).click();await page.waitForFunction(()=>Number(document.querySelector('[data-work-cart]').dataset.distance)>.05);await page.getByRole('button',{name:'Pause',exact:true}).click();const paused=Number(await page.locator('[data-work-cart]').getAttribute('data-distance'));await page.waitForTimeout(150);assert.equal(Number(await page.locator('[data-work-cart]').getAttribute('data-distance')),paused);await page.getByRole('button',{name:'Play',exact:true}).click();await page.waitForFunction(previous=>Number(document.querySelector('[data-work-cart]').dataset.distance)>previous,paused);await page.getByRole('button',{name:'Pause',exact:true}).click();
 await page.getByRole('button',{name:'Reset',exact:true}).click();assert.equal(await page.getByRole('spinbutton',{name:'Distance d value',exact:true}).inputValue(),'2');
 await page.getByRole('button',{name:'Zoom',exact:true}).click();assert.equal(await page.locator('.work-apparatus.zoomed').count(),1);await page.getByRole('button',{name:'Reset Zoom',exact:true}).click();
 const sizes=[];for(const width of [1536,1024,768,390]){await page.setViewportSize({width,height:1024});const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);assert.equal(overflow,0);const boxes=await page.locator('.frs-layout .frs-panel').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom}}));for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];assert(!(a.x<b.right&&b.x<a.right&&a.y<b.bottom&&b.y<a.bottom),'Panels overlap');}
await page.evaluate(()=>scrollTo(0,0));sizes.push({width,overflow});await page.screenshot({path:dir+`/after-${width}.png`});}
 assert.deepEqual(errors,[]);await writeFile(dir+'/verification.json',JSON.stringify({physicsCases:cases,controls:'distance, angle, live work, prediction, experiment, challenge, reset, zoom',sizes,errors},null,2));console.log('PASS Work reference cases, scene synchronization, controls, four viewports');
}finally{await browser.close();}
