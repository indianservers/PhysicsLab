import { chromium } from 'playwright-core';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const output='artifacts/additional-issues';await mkdir(output,{recursive:true});
const baseline=JSON.parse(await readFile(`${output}/control-candidates.json`,'utf8'));
assert.ok(baseline.length>=200,'At least 200 independently identified numeric controls');
const groups=Map.groupBy(baseline,x=>x.route);
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const page=await browser.newPage({viewport:{width:1365,height:950},serviceWorkers:'block'});const verified=process.argv.includes('--resume') ? JSON.parse(await readFile(`${output}/verified-controls.json`,'utf8')) : [],errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('RUNTIME ERROR',e.message);});
try{for(const [route,controls]of groups){
 if(controls.every(c=>verified.some(v=>v.route===route&&v.name===c.name)))continue;
 await page.goto(`http://127.0.0.1:5367${route}`,{waitUntil:'domcontentloaded'});await page.locator('#content').waitFor();
 for(const control of controls){
  const number=page.getByRole('spinbutton',{name:control.name,exact:true});await number.waitFor();
  const contract=await number.evaluate(input=>{const range=input.closest('label').querySelector('input[type=range]');return {min:input.min,max:input.max,step:input.step,range:{min:range.min,max:range.max,step:range.step},value:input.value};});
  assert.equal(Number(contract.min),Number(contract.range.min),`${route}: ${control.name} minimum`);assert.equal(Number(contract.max),Number(contract.range.max),`${route}: ${control.name} maximum`);assert.equal(Number(contract.step||1),Number(contract.range.step||1),`${route}: ${control.name} increment`);
  const before=Number(contract.value),step=Number(contract.step||1),min=Number(contract.min),max=Number(contract.max);
  const expected=before+step<=max ? min+(Math.floor((before-min)/step+1e-9)+1)*step : min+(Math.ceil((before-min)/step-1e-9)-1)*step;
  await number.evaluate(input=>{if(Number(input.value)+Number(input.step||1)<=Number(input.max))input.stepUp();else input.stepDown();const raw=input.value;Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,raw);input.dispatchEvent(new Event('input',{bubbles:true}));});
  const after=Number(await number.inputValue());assert.ok(Math.abs(after-expected)<Math.max(1e-8,step*.001),`${route} ${control.name}: spinner uses ${step}`);
  await number.focus();await number.fill('');assert.equal(await number.inputValue(),'');await number.blur();assert.ok(Number.isFinite(Number(await number.inputValue())),`${route}: clearing leaves model finite`);
  await number.fill(String(max+step*5));await number.blur();assert.ok(Number(await number.inputValue())<=max,`${route}: clamps high edit`);
  await number.fill(String(min-step*5));await number.blur();assert.ok(Number(await number.inputValue())>=min,`${route}: clamps low edit`);
  verified.push({route,name:control.name,passed:true,min,max,step});
 }
 console.log(JSON.stringify({route,verified:controls.length,total:verified.length}));await writeFile(`${output}/verified-controls.json`,JSON.stringify(verified,null,2));
}assert.deepEqual(errors,[]);console.log(`PASS ${verified.length} numeric controls across ${groups.size} routes`);
}finally{await browser.close();}
