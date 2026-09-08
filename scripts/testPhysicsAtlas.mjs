import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const output='artifacts/studio-rebuild/01-physics-atlas';
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1536,height:1024},deviceScaleFactor:1});
const errors=[],failedRequests=[],checks=[],relatedRouteWarnings=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(['error','warning'].includes(m.type())&&!m.text().includes('React Router Future Flag Warning'))(page.url().includes('/waves-sound')?relatedRouteWarnings:errors).push(m.text());});
page.on('response',r=>{if(r.status()>=400)failedRequests.push(`${r.status()} ${r.url()}`);});
async function check(name,fn){await fn();checks.push(name);console.log('PASS '+name);}
const button=name=>page.getByRole('button',{name,exact:true});
const close=()=>button('Close panel').click();
async function range(label,value){const input=page.getByRole('slider',{name:label,exact:true});await input.fill(String(value));}
try {
 await page.goto('http://127.0.0.1:5371/concept-studio',{waitUntil:'networkidle'});
 await check('Direct route and default readings',async()=>{assert.equal(await page.locator('h1').innerText(),'PHYSICS ATLAS');assert.match(await page.locator('.pa-readings').innerText(),/24.0 m\/s/);assert.match(await page.locator('.pa-readings').innerText(),/12.0 N/);});
 await page.locator('h1').click();await page.screenshot({path:`${output}/desktop-1536x1024.png`});
 await check('Connection particles start on their paths and visibly travel',async()=>{
  const positions=()=>page.locator('animateMotion').evaluateAll(es=>es.map(e=>{const b=e.parentElement.getBoundingClientRect();return {x:b.x,y:b.y};}));
  const initial=await positions();assert.ok(initial.every(p=>p.x>300&&p.y>100),'Particles must never flash at the SVG origin');
  await page.waitForTimeout(250);const next=await positions();
  assert.ok(next.some((p,i)=>Math.hypot(p.x-initial[i].x,p.y-initial[i].y)>3),'Playback moves the particles');
 });
 await check('Pause freezes SVG and CSS; Play resumes',async()=>{await button('Pause').click();const a=await page.locator('.pa-map').evaluate(e=>e.getCurrentTime());await page.waitForTimeout(150);const b=await page.locator('.pa-map').evaluate(e=>e.getCurrentTime());assert.equal(a,b);assert.equal(await page.locator('.pa-pendulum').evaluate(e=>getComputedStyle(e).animationPlayState),'paused');await button('Play').click();});
 await check('Scale min/max and Zoom',async()=>{await range('Scale Level',1);assert.match(await page.locator('.pa-map-world').getAttribute('style'),/0.84/);await range('Scale Level',10);await button('Zoom').click();assert.equal(await page.getByRole('slider',{name:'Scale Level'}).inputValue(),'5');});
 await check('All five depth settings have distinct content',async()=>{const values=[];for(let n=1;n<=5;n++){await range('Connection Depth',n);values.push(await page.locator('.pa-map').innerHTML());}assert.equal(new Set(values).size,5);await range('Connection Depth',3);});
 await check('Every topic filters and selects; keyboard selection',async()=>{for(const id of ['matter','motion','forces','waves','fields','heat','cosmos']){await page.getByRole('combobox',{name:'Topic Filter'}).selectOption(id);assert.equal(await page.locator('.pa-map-node.selected').count(),1);}await page.getByRole('combobox',{name:'Topic Filter'}).selectOption('all');await button('Explore Matter').focus();await page.keyboard.press('Enter');assert.match(await page.locator('.pa-selection').innerText(),/Matter/);await button('Clear selected topic').click();});
 await check('Every navigation panel opens and closes with Escape',async()=>{for(const label of ['Topics','Simulations','Challenges','Notebook','Resources','Settings']){await page.locator('.pa-navigation').getByRole('button',{name:label,exact:true}).click();assert.equal(await page.getByRole('dialog').count(),1);await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);}});
 await check('Search handles match and empty results',async()=>{await button('Search physics topics').click();await page.getByPlaceholder('Search matter, motion, waves…').fill('waves');assert.ok(await page.locator('.pa-topic-list a').count()>0);await page.getByPlaceholder('Search matter, motion, waves…').fill('zzzz');assert.match(await page.getByRole('dialog').innerText(),/No topics found/);await close();});
 await check('Prediction wrong/right answers and next challenge',async()=>{await button('Next Challenge →').click();await button('2F').click();await button('Check prediction').click();assert.match(await page.getByRole('dialog').getByRole('status').innerText(),/Try again/);await button('F / 4').click();await button('Check prediction').click();assert.match(await page.getByRole('dialog').getByRole('status').innerText(),/Correct/);await close();});
 await check('Six physics controls: zero, negative, extrema, inverse square, reset',async()=>{await page.locator('.pa-modes').getByRole('button',{name:'Experiment',exact:true}).click();await range('Acceleration',0);assert.match(await page.locator('.pa-experiment-values').innerText(),/0.00 N/);await range('Acceleration',-10);assert.match(await page.locator('.pa-experiment-values').innerText(),/-30.00 N/);await range('Mass',10);assert.match(await page.locator('.pa-experiment-values').innerText(),/-100.00 N/);await range('Mass',.1);await range('Wave frequency',0);assert.match(await page.locator('.pa-experiment-values').innerText(),/0.00 m\/s/);await range('Wave frequency',100);await range('Wavelength',2);assert.match(await page.locator('.pa-experiment-values').innerText(),/200.00 m\/s/);await range('Wavelength',.1);await range('Temperature',0);await range('Temperature',1000);assert.match(await page.locator('.pa-readings').innerText(),/1000 K/);await button('Reset experiment').click();const gravity=()=>page.locator('.pa-experiment-values dd').last().innerText();const g1=parseFloat(await gravity());await range('Mass separation',4);const g2=parseFloat(await gravity());assert.ok(Math.abs(g1/4-g2)<.001);await range('Mass separation',1);await range('Mass separation',10);await button('Reset experiment').click();assert.equal(await page.getByRole('slider',{name:'Mass separation'}).inputValue(),'2');await close();});
 await check('Explain, settings animation, observe, and mode step buttons',async()=>{await page.locator('.pa-modes').getByRole('button',{name:'Explain',exact:true}).click();assert.match(await page.getByRole('dialog').innerText(),/conceptual links/);await close();await page.locator('.pa-navigation').getByRole('button',{name:'Settings'}).click();await page.getByRole('checkbox').uncheck();await close();assert.equal(await button('Play').count(),1);await page.locator('.pa-footer').getByRole('button',{name:'Predict mode'}).click();await close();await page.locator('.pa-modes').getByRole('button',{name:'Observe',exact:true}).click();});
 await check('Notes save and persist across direct refresh',async()=>{await page.locator('.pa-navigation').getByRole('button',{name:'Notebook'}).click();await page.locator('textarea').fill('Doubling r quarters the gravitational force.');await button('Save notes').click();await page.reload({waitUntil:'networkidle'});await page.locator('.pa-navigation').getByRole('button',{name:'Notebook'}).click();assert.match(await page.locator('textarea').inputValue(),/quarters/);await close();});
 await check('Reset restores state and restarts map clock',async()=>{await range('Scale Level',10);await button('Reset').click();assert.equal(await page.getByRole('slider',{name:'Scale Level'}).inputValue(),'5');assert.equal(await page.getByRole('slider',{name:'Connection Depth'}).inputValue(),'3');assert.equal(await page.getByRole('combobox').inputValue(),'all');assert.equal(await button('Pause').count(),1);assert.ok(await page.locator('.pa-map').evaluate(e=>e.getCurrentTime())<1);});
 const responsive=[];
 for(const [width,height] of [[1536,1024],[1440,900],[1280,720],[1024,768],[768,1024],[390,844]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(100);
  const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,clipped:[...document.querySelectorAll('.pa-inspector section')].filter(e=>e.scrollHeight>e.clientHeight+2).map(e=>e.className),documentHeight:document.documentElement.scrollHeight}));
  assert.ok(layout.overflow<=1,`${width}: horizontal overflow ${layout.overflow}`);
  assert.deepEqual(layout.clipped,[],`${width}: clipped panels`);
  if(width>800)assert.ok(layout.documentHeight<=height+1,`${width}: unnecessary desktop scrolling`);
  await page.locator('h1').click();await page.screenshot({path:`${output}/${width}x${height}.png`,fullPage:true});
  await page.locator('.pa-modes').getByRole('button',{name:'Experiment',exact:true}).click();await range('Mass',5);await close();await button('Reset').click();
  responsive.push({width,height,...layout});
 }
 checks.push('All requested viewports: screenshots, no overflow/clipping, live control use');
 await page.setViewportSize({width:1536,height:1024});
 await check('Topic links resolve to preserved studio routes',async()=>{await button('Explore Waves').click();await page.locator('.pa-selection a').click();assert.ok(page.url().endsWith('/concept-studio/waves-sound'));assert.ok(await page.locator('h1').count());await page.goto('http://127.0.0.1:5371/concept-studio',{waitUntil:'networkidle'});});
 await fs.writeFile(`${output}/results.json`,JSON.stringify({checks,responsive,errors,failedRequests,relatedRouteWarnings},null,2));
 assert.deepEqual(errors,[],'Console warnings/errors');assert.deepEqual(failedRequests,[],'Failed requests');
 console.log(`Verified ${checks.length} interaction groups; six responsive viewports.`);
} catch(e){await page.locator('h1').click();await page.screenshot({path:`${output}/failure.png`,fullPage:true});await fs.writeFile(`${output}/failure.json`,JSON.stringify({checks,error:String(e),errors,failedRequests},null,2));throw e;}finally{await browser.close();}




