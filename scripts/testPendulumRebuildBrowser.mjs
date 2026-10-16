import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1536,height:1024}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
const out='artifacts/physics-studio-audit/pendulum';await mkdir(out,{recursive:true});
const set=async(name,value)=>{const input=page.getByRole('spinbutton',{name:name+' value',exact:true});await input.fill(String(value));await input.blur();};
try{
 for(const route of ['/experiments/simple-pendulum','/motion/pendulum']){
  await page.goto('http://127.0.0.1:5173'+route,{waitUntil:'networkidle'});
  await page.locator('.pds-three-host canvas').waitFor();
  assert.equal(await page.locator('.sp-lab,.lesson-command-tabs,.studio-enhancement-dock').count(),0);
  assert.deepEqual(await page.locator('.pds-mode-bar nav button').allTextContents(),['Observe','Predict','Experiment','Explain']);
  if(await page.getByRole('button',{name:'Pause',exact:true}).count())await page.getByRole('button',{name:'Pause',exact:true}).click();
 }
 assert.equal(await page.locator('[data-theory-period]').textContent(),'1.794 s');
 await set('Length',1.6);assert.equal(await page.locator('[data-theory-period]').textContent(),(2*Math.PI*Math.sqrt(1.6/9.81)).toFixed(3)+' s');
 await set('Length',-4);assert.equal(await page.getByRole('slider',{name:'Length',exact:true}).inputValue(),'0.2');
 await page.getByRole('button',{name:'Reset',exact:true}).click();
 await page.getByRole('button',{name:'Predict',exact:true}).click();await page.getByRole('button',{name:'√2 times longer',exact:true}).click();assert.match(await page.getByRole('status').last().textContent(),/Correct/);await page.getByRole('button',{name:'Close dialog'}).click();
 await page.getByRole('button',{name:'Pendulum settings',exact:true}).click();await page.getByRole('spinbutton',{name:'Bob mass',exact:true}).fill('.5');await page.getByRole('spinbutton',{name:'Bob mass',exact:true}).blur();await page.getByRole('button',{name:'Close dialog'}).click();
 await page.getByRole('combobox',{name:'Pendulum type',exact:true}).selectOption('damped');assert.equal(await page.getByRole('combobox',{name:'Pendulum type',exact:true}).inputValue(),'damped');
 await page.getByRole('button',{name:'Reset',exact:true}).click();await set('Length',.2);await set('Gravity',24.79);
 await page.getByRole('button',{name:'Lab Mode',exact:true}).click();await page.waitForFunction(()=>Number(document.querySelector('[data-gate-count]').textContent)>=10,{},{timeout:20000});await page.getByRole('button',{name:'Play',exact:true}).waitFor();
 assert.equal(Number(await page.locator('[data-gate-count]').textContent()),10);const measured=Number.parseFloat(await page.locator('[data-measured-period]').textContent());assert(measured>.56&&measured<.58);
 const t=await page.locator('.pds-page').getAttribute('data-pendulum-time');await page.waitForTimeout(150);assert.equal(await page.locator('.pds-page').getAttribute('data-pendulum-time'),t);
 const trail=await page.locator('.pds-three-host canvas').screenshot();await page.getByRole('combobox',{name:'Motion display mode',exact:true}).selectOption('Continuous');const noTrail=await page.locator('.pds-three-host canvas').screenshot();assert(!trail.equals(noTrail),'Strobe control must change the actual renderer');
 await page.getByRole('button',{name:'Experiment',exact:true}).click();await page.getByRole('button',{name:'Record reading',exact:true}).click();assert.equal(await page.locator('.pds-trials tbody tr').count(),1);await page.getByRole('button',{name:'Close dialog'}).click();
 await page.getByRole('button',{name:'Zoom',exact:true}).click();assert.equal(await page.locator('.pds-bench').getAttribute('data-zoom'),'1.2');await page.getByRole('button',{name:'Zoom',exact:true}).click();
 await page.getByRole('button',{name:'Reset',exact:true}).click();await page.locator('.pds-three-host').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.getByRole('slider',{name:'Release Angle',exact:true}).inputValue(),'16');await page.getByRole('button',{name:'Reset',exact:true}).click();
 await page.getByRole('button',{name:'Play',exact:true}).click();await page.waitForFunction(()=>Number(document.querySelector('.pds-page').dataset.pendulumTime)>5.2);await page.getByRole('button',{name:'Pause',exact:true}).click();
 const sizes=[];
 for(const [width,height] of [[1536,1024],[1920,912],[1024,768],[768,1024],[390,844],[320,740]]){
  await page.setViewportSize({width,height});await page.evaluate(()=>scrollTo(0,0));
  const layout=await page.evaluate(()=>{const box=s=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};return {overflow:document.documentElement.scrollWidth-innerWidth,sidebar:box('.pds-sidebar'),stage:box('.pds-stage'),inspector:box('.pds-inspector'),toolbar:box('.pds-toolbar'),panels:[...document.querySelectorAll('.pds-panel')].map(e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom}})};});
  assert.equal(layout.overflow,0,`Overflow at ${width}`);for(let i=1;i<layout.panels.length;i++)assert(layout.panels[i].top>=layout.panels[i-1].bottom-1,`Inspector panels overlap at ${width}`);
  sizes.push({width,height,...layout});await page.screenshot({path:out+`/after-${width}.png`});
 }
 assert.deepEqual(errors,[]);await writeFile(out+'/browser.json',JSON.stringify({routes:['/experiments/simple-pendulum','/motion/pendulum'],measured,labModeTenCycles:true,strobeChangesRenderer:true,settings:true,prediction:true,trialRecording:true,zoom:true,keyboard:true,sizes,errors},null,2));console.log('PASS both URLs, numerical controls, measurement, ten-cycle lab mode, actual strobe rendering, prediction, settings, recording, zoom, keyboard and six viewports');
}finally{await browser.close();}
