import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const origin='http://127.0.0.1:5367';
const output='artifacts/issue-report';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1365,height:950},serviceWorkers:'block'});
const errors=[]; page.on('pageerror',e=>errors.push(e.message));
const rows=[];
try {
 await page.goto(origin);
 const all=await page.evaluate(async()=> (await import('/src/lib/experiments.ts')).experiments.map(({id,title,category})=>({id,title,category})));
 const catalog=process.argv.includes('--actions') ? [] : process.argv.includes('--focused') ? all.filter(e=>['atomic-interactions','newton-s-second-law','chaotic-coupled-oscillators','bernoulli-fluid-flow','build-a-nucleus','rutherford-scattering','diffusion','states-of-matter','molecules-and-light','electrostatic-field-potential','ac-generator'].includes(e.id)) : all;
 for(const lesson of catalog){
  const start=errors.length;
  await page.goto(`${origin}/experiments/${lesson.id}`);
  await page.getByRole('tab',{name:'Simulate',exact:true}).click();
  await page.waitForTimeout(100);
  const simulate=await page.locator('.experiment-tab-pane').evaluate(e=>({controls:e.querySelectorAll('button,input,select').length,visuals:e.querySelectorAll('svg,canvas').length,overflow:document.documentElement.scrollWidth>innerWidth+2}));
  await page.getByRole('tab',{name:'Guide',exact:true}).click();
  const guide=await page.locator('.experiment-tab-pane').evaluate(e=>({math:e.querySelectorAll('.katex').length,mathErrors:[...e.querySelectorAll('.katex-error')].map(e=>e.textContent)}));
  await page.getByRole('tab',{name:/^3D/}).click();
  await page.waitForTimeout(100);
  const three=await page.locator('.experiment-tab-pane').evaluate(e=>({canvas:e.querySelectorAll('canvas').length,unavailable:!!e.querySelector('.pending-visualization-card'),text:e.textContent.slice(0,180)}));
  rows.push({...lesson,simulate,guide,three,errors:errors.slice(start)});
 }
 if(rows.length) await writeFile(`${output}/${process.argv.includes('--focused')?'focused':'catalog'}.json`,JSON.stringify(rows,null,2));
 console.log('Catalog',JSON.stringify({count:rows.length,errors:rows.filter(r=>r.errors.length),mathErrors:rows.filter(r=>r.guide.mathErrors.length),overflow:rows.filter(r=>r.simulate.overflow),noControls:rows.filter(r=>r.simulate.controls===0),missing3DStatus:rows.filter(r=>!r.three.canvas&&!r.three.unavailable)}));
 await page.goto(`${origin}/experiments/photoelectric-equation`);
 await page.getByRole('tab',{name:'Simulate',exact:true}).click();
 await page.getByRole('button',{name:'Ⅱ Pause',exact:true}).click();
 const photon=page.locator('.pe-photons i').first();
 const before=await photon.getAttribute('style'); await page.waitForTimeout(250); assert.equal(await photon.getAttribute('style'),before);
 await page.getByRole('button',{name:'▶ Play',exact:true}).click(); await page.waitForTimeout(200); assert.notEqual(await photon.getAttribute('style'),before);
 await page.goto(`${origin}/experiments/bohr-model`); await page.getByRole('tab',{name:'Simulate',exact:true}).click();
 await page.getByRole('button',{name:'▶ Play',exact:true}).click(); await page.waitForTimeout(1300);
 const electron=page.locator('.bm-electron');
 const electronBefore=await electron.getAttribute('style'); await page.waitForTimeout(160); assert.notEqual(await electron.getAttribute('style'),electronBefore);
 await page.getByRole('button',{name:'Ⅱ Pause',exact:true}).click(); const stopped=await electron.getAttribute('style'); await page.waitForTimeout(160); assert.equal(await electron.getAttribute('style'),stopped);
 await page.getByRole('button',{name:'▶ Play',exact:true}).click(); await page.waitForTimeout(100); assert.notEqual(await electron.getAttribute('style'),stopped);
 await page.goto(`${origin}/experiments/fourier-making-waves`); await page.getByRole('tab',{name:'Simulate',exact:true}).click();
 const wave=page.locator('.expansion-stage polyline'); const waveBefore=await wave.getAttribute('points'); await page.getByRole('button',{name:'Step',exact:true}).click(); assert.notEqual(await wave.getAttribute('points'),waveBefore);
 await page.getByRole('button',{name:'Play',exact:true}).click(); await page.waitForTimeout(200); await page.getByRole('button',{name:'Pause',exact:true}).click(); const frozen=await wave.getAttribute('points'); await page.waitForTimeout(160); assert.equal(await wave.getAttribute('points'),frozen);
 await page.screenshot({path:`${output}/fourier.png`,fullPage:true});
 await page.goto(`${origin}/experiments/computational-physics-workflow`); await page.getByRole('tab',{name:'Guide',exact:true}).click(); await page.screenshot({path:`${output}/guide.png`,fullPage:true});
 await page.goto(`${origin}/settings`); assert.equal(await page.locator('select').count(),3); assert.equal(await page.locator('input[type=checkbox]').count(),4);
 for(const [query,title] of [['torque','Rotational Dynamics'],['calorimetry','Calorimetry'],['kirchhoff','Kirchhoff'],['echo','Echo'],['bohr','Bohr']]) {
  await page.goto(`${origin}/experiments?q=${query}`);
  assert.ok((await page.locator('#content').innerText()).includes(title),`${query} search across subjects`);
 }
 await page.goto(`${origin}/experiments`);
 await page.locator('.el-playback-button').waitFor();
 await page.getByRole('button',{name:'Pause',exact:true}).click();
 const pulse=page.locator('[data-light-pulse]'); const pulseX=await pulse.getAttribute('cx'); await page.waitForTimeout(200); assert.equal(await pulse.getAttribute('cx'),pulseX);
 await page.getByRole('button',{name:'Play',exact:true}).click(); await page.waitForTimeout(200); assert.notEqual(await pulse.getAttribute('cx'),pulseX);
 await page.goto(`${origin}/experiments/bernoulli-fluid-flow`); await page.getByRole('tab',{name:'Simulate',exact:true}).click(); await page.locator('.learning-level-selector select').selectOption('Simple'); const simple=await page.locator('.bernoulli-level-guide').innerText(); await page.locator('.learning-level-selector select').selectOption('Research'); assert.notEqual(await page.locator('.bernoulli-level-guide').innerText(),simple);
 await page.goto(`${origin}/experiments/logic-gates`); await page.getByRole('tab',{name:'Simulate',exact:true}).click(); assert.equal(await page.getByLabel('Gate type').locator('option').count(),7); await page.getByLabel('Gate type').selectOption('XOR');
 for(const id of ['density-float-sink','vector-resolution','mass-and-weight']){
  await page.goto(`${origin}/experiments/${id}`);await page.getByRole('tab',{name:'Simulate',exact:true}).click();
  const slider=page.locator('.experiment-tab-pane input[type=range]').first();const initial=await slider.inputValue();
  await slider.evaluate(input=>{const next=Number(input.value)===Number(input.max)?input.min:input.max;Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,next);input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));});
  assert.notEqual(await slider.inputValue(),initial);await page.locator('.experiment-tab-pane').getByRole('button',{name:/Reset experiment|Reset$/}).first().click();assert.equal(await slider.inputValue(),initial,`${id} reset`);
 }
 await page.goto(`${origin}/experiments/measurement-errors`);await page.getByRole('tab',{name:'Simulate',exact:true}).click();const measure=page.locator('.measure-main');const measureBefore=await measure.innerHTML();await page.getByRole('button',{name:'▷ Step',exact:true}).click();assert.notEqual(await measure.innerHTML(),measureBefore);
 await page.getByRole('tab',{name:/^3D/}).click();await page.getByRole('button',{name:'Pause simulation',exact:true}).click();const clock=page.locator('[data-simulation-time]');await page.waitForTimeout(100);const timeBefore=Number(await clock.getAttribute('data-simulation-time'));await page.getByRole('button',{name:'Step simulation',exact:true}).click();await page.waitForTimeout(100);assert.ok(Number(await clock.getAttribute('data-simulation-time'))>timeBefore);await page.getByRole('button',{name:'Restart simulation',exact:true}).click();await page.waitForTimeout(100);assert.equal(Number(await clock.getAttribute('data-simulation-time')),0);
 await page.goto(`${origin}/experiments/build-a-nucleus`);await page.getByRole('tab',{name:'Simulate',exact:true}).click();await page.getByRole('slider',{name:'Neutrons N',exact:true}).fill('0');assert.equal(await page.locator('.expansion-stage .neutron').count(),0);assert.equal(await page.locator('.expansion-stage .proton').count(),6);
 await page.goto(`${origin}/experiments/diffusion`);await page.getByRole('tab',{name:'Simulate',exact:true}).click();const diffusionBefore=await page.locator('.expansion-stage svg[role=img]').innerHTML();await page.getByRole('button',{name:'Step',exact:true}).click();assert.notEqual(await page.locator('.expansion-stage svg[role=img]').innerHTML(),diffusionBefore);
 await page.goto(`${origin}/experiments/balanced-unbalanced-forces`);await page.getByRole('tab',{name:'Simulate',exact:true}).click();for(let i=0;i<10;i++)await page.getByRole('button',{name:'▷ Step',exact:true}).click();const graphPoints=await page.locator('.force-graph polyline').getAttribute('points');assert.ok(graphPoints.split(' ').length>1);assert.ok(graphPoints.split(' ').every(p=>{const [x,y]=p.split(',').map(Number);return x>=0&&x<=380&&y>=0&&y<=130;}));
 await page.setViewportSize({width:390,height:844});
 for(const id of ['computational-physics-workflow','fourier-making-waves','electrostatic-field-potential','build-a-nucleus']){
  await page.goto(`${origin}/experiments/${id}`);await page.getByRole('tab',{name:id==='computational-physics-workflow'?'Guide':'Simulate',exact:true}).click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),`${id} mobile overflow`);await page.screenshot({path:`${output}/${id}-mobile.png`,fullPage:true});
 }
 assert.equal(rows.filter(r=>r.errors.length).length,0); assert.equal(rows.filter(r=>r.guide.mathErrors.length).length,0); assert.equal(rows.filter(r=>r.simulate.controls===0).length,0); assert.equal(rows.filter(r=>!r.three.canvas&&!r.three.unavailable).length,0);
 assert.deepEqual(errors,[], 'No browser runtime errors');
 await writeFile(`${output}/interaction-checks.json`,JSON.stringify({passed:true,runtimeErrors:errors,checks:['photoelectric play/pause','Bohr orbit/pause/replay','Fourier step/play/pause','all settings','five subject searches','launcher play/pause','learning level content','seven logic gates','density/vector/mass reset','measurement step and 3D transport','zero-neutron nucleus','diffusion step','bounded force graph','four mobile layouts']},null,2));
 console.log('PASS issue report browser checks');
} finally {await browser.close();}
