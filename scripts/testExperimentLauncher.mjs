import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out='artifacts/studio-rebuild/04-experiment-launcher';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1536,height:1024}}),errors=[],existingWarnings=[],checks=[],viewports=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(['error','warning'].includes(m.type())){if(m.text().includes('React Router Future Flag Warning'))existingWarnings.push(m.text());else errors.push(m.text())}});
const button=(name)=>page.getByRole('button',{name,exact:true});
const close=()=>button('Close panel').click();
try{
 await page.goto('http://127.0.0.1:5371/experiments',{waitUntil:'domcontentloaded',timeout:60000});
 await page.locator('.el-page').waitFor({timeout:60000});
 await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));
 assert.match(await page.locator('.el-values').innerText(),/19.2/);
 const svgAssets=await page.evaluate(async()=>Promise.all([...new Set([...document.querySelectorAll('svg image')].map(e=>e.href.baseVal))].map(async url=>{const image=new Image();image.src=url;await image.decode();return {url,width:image.naturalWidth}})));assert.ok(svgAssets.length>=2&&svgAssets.every(a=>a.width>0));checks.push('Every SVG raster asset decodes successfully');
 await button('Pause').click();const stopped=await page.locator('time').innerText();await page.waitForTimeout(250);assert.equal(await page.locator('time').innerText(),stopped);await button('Play').click();await page.waitForTimeout(250);assert.notEqual(await page.locator('time').innerText(),stopped);checks.push('Default Snell reading and pause/resume clock');
 for(const [studio,count] of [['mechanics',3],['optics',4],['circuits',2],['thermal',2],['waves',2]]){
  await page.getByLabel('Studio Type',{exact:true}).selectOption(studio);
  await page.locator('.el-tabs').getByRole('button',{name:'Setup',exact:true}).click();
  const inputs=page.locator('.el-setup input');assert.equal(await inputs.count(),count);
  for(let i=0;i<count;i++){const input=inputs.nth(i);for(const boundary of ['min','max']){const value=await input.getAttribute(boundary);await input.fill(value);assert.equal(await input.inputValue(),value)}}
  await page.getByLabel('Equipment Set',{exact:true}).selectOption('precision');
  assert.ok(Number(await inputs.first().getAttribute('step'))>0);
  await button('Reset').click();assert.equal(await page.getByLabel('Equipment Set',{exact:true}).inputValue(),'standard');
 }
 checks.push('All five studios, every parameter minimum/maximum, precision kit and reset');
 await page.getByLabel('Studio Type',{exact:true}).selectOption('optics');
 await page.getByLabel('Equipment Set',{exact:true}).selectOption('white-light');
 assert.match(await page.locator('.el-values').innerText(),/410.680/);
 await page.locator('.el-tabs').getByRole('button',{name:'Setup',exact:true}).click();assert.equal(await page.getByLabel('Wavelength',{exact:true}).count(),0);
 await button('Reset').click();
 for(const [level,answer] of [['Beginner','No, it remains monochromatic'],['Intermediate','19.2 degrees'],['Advanced','Total internal reflection']]){
  await page.getByLabel('Difficulty',{exact:true}).selectOption(level);await page.locator('.el-modes').getByRole('button',{name:/Predict/}).click();await button(answer).click();await button('Check answer').click();assert.match(await page.getByRole('status').innerText(),/^Correct/);await close();
 }
 checks.push('Three difficulty-specific challenges and answer feedback');
 await page.getByLabel('Difficulty',{exact:true}).selectOption('Intermediate');await button('Challenges').click();await button('18.1 degrees').click();await button('Check answer').click();assert.match(await page.getByRole('status').innerText(),/^Try again/);await button('Test the prediction').click();assert.equal(await page.getByRole('dialog').count(),0);assert.equal(await page.locator('.el-setup input').count(),4);
 for(const [name,value] of [['Mechanics','mechanics'],['Optics','optics'],['Circuits','circuits'],['Thermal','thermal'],['Waves','waves']]){await page.locator('.el-gallery').getByRole('button',{name:new RegExp(name)}).click();assert.equal(await page.getByLabel('Studio Type',{exact:true}).inputValue(),value)}
 await page.getByLabel('Studio Type',{exact:true}).selectOption('optics');await button('Reset').click();checks.push('Wrong-answer feedback, prediction-to-experiment transition and five gallery controls');
 await button('Analytics').click();assert.match(await page.getByRole('dialog').innerText(),/3 correct from 4 attempts/);await close();
 await button('Lab Notebook').click();await page.getByLabel('Lab observations').fill('A single laser remains monochromatic.');await button('Save notes').click();await close();
 await page.reload({waitUntil:'domcontentloaded'});await button('Lab Notebook').click();assert.equal(await page.getByLabel('Lab observations').inputValue(),'A single laser remains monochromatic.');await page.keyboard.press('Escape');
 checks.push('Measured analytics, saved notebook, direct refresh and Escape dismissal');
 await page.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('Blocked','SecurityError')}});await button('Lab Notebook').click();await button('Save notes').click();assert.match(await page.getByRole('status').innerText(),/could not be saved/);await button('Dismiss notice').click();await close();await page.reload({waitUntil:'domcontentloaded'});checks.push('Notebook storage failure presents a recoverable message');
 await button('Light').click();assert.equal(await page.locator('.el-page').getAttribute('data-ui-theme'),'light');await page.waitForTimeout(500);await page.screenshot({path:`${out}/light.png`});await button('Toggle color theme').click();
 await page.getByLabel('Zoom',{exact:true}).selectOption('1.4');assert.match(await page.locator('.el-lab>.el-scene [data-apparatus]').getAttribute('transform'),/1.4/);await button('Reset').click();
 await button('Toggle fullscreen').click();assert.ok(await page.evaluate(()=>!!document.fullscreenElement));await page.locator('.el-modes').getByRole('button',{name:/Explain/}).click();assert.ok(await page.getByRole('dialog').isVisible());await close();await button('Toggle fullscreen').click();
 await page.locator('.el-modes').getByRole('button',{name:/Explain/}).click();assert.match(await page.getByRole('dialog').innerText(),/Fresnel/);await close();
 for(const phase of ['Setup','Investigate','Analyze','Conclude']){await page.locator('.el-footer').getByRole('button',{name:phase,exact:true}).click();if(await page.getByRole('dialog').count())await close()}
 await page.locator('.el-modes').getByRole('button',{name:/Experiment/}).click();assert.equal(await page.locator('.el-setup input').count(),4);await page.locator('.el-modes').getByRole('button',{name:/Observe/}).click();assert.equal(await page.locator('.el-setup input').count(),0);await button('Settings').click();await button('Use light theme').click();assert.equal(await page.locator('.el-page').getAttribute('data-ui-theme'),'light');await button('Use dark theme').click();await button('Restore experiment defaults').click();
 await button('Next Challenge').click();assert.equal(await page.getByLabel('Studio Type',{exact:true}).inputValue(),'circuits');await close();await page.getByLabel('Studio Type',{exact:true}).selectOption('optics');await button('Reset').click();
 checks.push('Theme, zoom, fullscreen, explanations, stages, settings and next challenge');
 for(const [width,height] of [[1536,1024],[1440,900],[1280,720],[1024,768],[768,1024],[390,844]]){
  await page.setViewportSize({width,height});await page.screenshot({path:`${out}/${width}x${height}.png`,fullPage:true});
  const measure=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,graphHeight:document.querySelector('.el-inspector>.el-graph svg').getBoundingClientRect().height,missing:[...document.images].filter(i=>!i.naturalWidth).length}));assert.ok(measure.overflow<=1,`Overflow at ${width}: ${measure.overflow}`);assert.equal(measure.missing,0);assert.ok(measure.graphHeight>=150,`Graph compressed at ${width}: ${measure.graphHeight}`);viewports.push({width,height,...measure});
  await page.locator('.el-tabs').getByRole('button',{name:'Setup',exact:true}).click();await page.getByLabel('Beam radius',{exact:true}).fill('3');await button('Reset').click();
 }
 await page.locator('.el-modes').getByRole('button',{name:/Explain/}).click();assert.ok((await page.locator('.el-explain-ray').boundingBox()).width>=250);assert.equal(await page.locator('.el-dialog p').first().evaluate(e=>getComputedStyle(e).color),'rgb(203, 228, 251)');const dialogBounds=await page.getByRole('dialog').boundingBox();assert.ok(dialogBounds.y>=0&&dialogBounds.y+dialogBounds.height<=844,'Mobile dialog must stay inside the viewport');await page.screenshot({path:`${out}/mobile-explain.png`});await close();
 const targets=await page.evaluate(async()=>{const {experiments}=await import('/src/lib/experiments.ts');const {launcherStudios}=await import('/src/lib/experimentLauncher.ts');return launcherStudios.map(s=>({route:s.route,exists:experiments.some(e=>e.id===s.route)}))});assert.ok(targets.every(s=>s.exists));
 for(const query of ['view=library','q=pendulum']){await page.goto('http://127.0.0.1:5371/experiments?'+query,{waitUntil:'domcontentloaded'});await page.getByRole('heading',{name:'Guided Experiments',exact:true}).waitFor();assert.equal(await page.locator('.el-page').count(),0);if(query.startsWith('q='))assert.equal(await page.getByPlaceholder('Search by topic, class, formula, domain...').inputValue(),'pendulum')}
 checks.push('Catalog and filtered query routes retained; every full-lab link resolves to a registered experiment');
 assert.deepEqual(errors,[]);checks.push('Six viewport overflow, image loading and setup-control smoke checks; no page-specific browser errors/warnings');
 await fs.writeFile(`${out}/interaction-results.json`,JSON.stringify({checks,viewports,errors,existingWarnings},null,2));console.log({checks,viewports,errors,existingWarnings});
}finally{await browser.close()}
