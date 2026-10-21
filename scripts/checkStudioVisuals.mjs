import assert from 'node:assert/strict';
import fs from 'node:fs';

async function model(page){return JSON.parse(await page.locator('[data-visual-model]').textContent());}
const near=(a,b)=>typeof a==='number'&&typeof b==='number'?Math.abs(a-b)<=Math.max(Math.abs(b),1e-8)*1e-10:JSON.stringify(a)===JSON.stringify(b);
async function readDownload(download){const stream=await download.createReadStream();const chunks=[];for await(const chunk of stream)chunks.push(chunk);return Buffer.concat(chunks).toString('utf8');}

export async function checkStudioVisuals(page,route){
 await page.waitForFunction(route=>{const node=document.querySelector('[data-studio-visual-explorer]');return node?.getAttribute('data-route')===route&&!!node.querySelector('[data-visual-model]')?.textContent;},route);
 assert.equal(await page.locator('[data-studio-scene]').count(),1,'Exactly one primary apparatus viewport');
 const launch=page.getByRole('button',{name:'Graph & scene tools',exact:true});await launch.scrollIntoViewIfNeeded();await launch.click();
 const panel=page.getByRole('region',{name:/graph and scene tools$/});await panel.waitFor();
 const tabs=panel.getByRole('tablist',{name:'Graph and scene views'}),tab=name=>tabs.getByRole('tab',{name,exact:true});
 const modes=[];
 for(const name of ['Response plot','Point data','Scene view']){await tab(name).click();assert.equal(await tab(name).getAttribute('aria-selected'),'true');assert.ok((await panel.getByRole('tabpanel').innerText()).length>50);modes.push(name);}
 await panel.getByRole('button',{name:'Pause apparatus motion',exact:true}).click();
 await page.waitForTimeout(100);
 const initial=await model(page),d=initial.definition;
 assert.ok(d.quantity in initial.quantities,`${route}: declared ${d.quantity} exists in the real solver`);
 const x=(d.source==='scene'?initial.scene:initial.input)[d.parameter];assert.ok(typeof x==='number'||typeof x==='boolean',`${route}: physical parameter is numeric/discrete`);
 const nativeTransforms=await page.locator('[data-studio-scene] svg').evaluateAll(nodes=>nodes.map(n=>n.style.transform));
 const nestedTransforms=await page.locator('[data-studio-scene] svg svg').evaluateAll(nodes=>nodes.map(n=>[n.style.scale,n.style.translate]));
 await panel.getByRole('button',{name:'Magnify scene',exact:true}).click();assert.match(await panel.locator('[data-scene-view]').innerText(),/110%/);
 assert.deepEqual(await page.locator('[data-studio-scene] svg').evaluateAll(nodes=>nodes.map(n=>n.style.transform)),nativeTransforms,'Viewport tools preserve native apparatus transforms');
 assert.deepEqual(await page.locator('[data-studio-scene] svg svg').evaluateAll(nodes=>nodes.map(n=>[n.style.scale,n.style.translate])),nestedTransforms,'Nested SVG assets must not receive a second viewport magnification');
 await panel.getByRole('button',{name:'Pan scene right',exact:true}).click();assert.match(await panel.locator('[data-scene-view]').innerText(),/20, 0/);
 await panel.getByRole('button',{name:'Reset scene view',exact:true}).click();assert.match(await panel.locator('[data-scene-view]').innerText(),/100%; pan 0, 0/);
 const afterView=await model(page);for(const [key,value]of Object.entries(initial.input))assert.ok(near(afterView.input[key],value),`View reset must preserve ${key}`);
 await tab('Response plot').click();
 const collect=panel.getByRole('button',{name:'Collect response curve',exact:true});assert.equal(await collect.isEnabled(),true);
 await collect.click();await page.waitForFunction(()=>document.querySelector('.sve-panel [role="status"]')?.textContent?.startsWith('Sweep complete'),null,{timeout:60000});
 const after=await model(page);
 for(const [key,value]of Object.entries(initial.input))assert.ok(near(after.input[key],value),`${route}: sweep restores ${key}; expected ${JSON.stringify(value)}, got ${JSON.stringify(after.input[key])}`);
 await tab('Point data').click();const rows=panel.locator('tbody tr');
 assert.ok(await rows.count()>=2,`${route}: response has at least two sampled settings`);
 const xValues=await rows.evaluateAll(rows=>rows.map(r=>r.getAttribute('data-x')));assert.ok(new Set(xValues).size>=2,`${route}: varied parameter reaches solver`);
 const pointX=Number(await rows.first().getAttribute('data-x')),pointY=await rows.first().getAttribute('data-y');await rows.first().getByRole('button').click();
 await page.waitForFunction(({source,key,x})=>{const frame=JSON.parse(document.querySelector('[data-visual-model]').textContent),value=(source==='scene'?frame.scene:frame.input)[key];return Math.abs(Number(value)-x)<=Math.max(Math.abs(x),1e-8)*1e-10;},{source:d.source,key:d.parameter,x:pointX});
 const replayed=await model(page);assert.ok(pointY==='undefined'?replayed.quantities[d.quantity]===null:near(replayed.quantities[d.quantity],Number(pointY)),`${route}: graph cursor and apparatus share the same solver value`);
 await tab('Response plot').click();
 const plot=panel.getByRole('slider',{name:/interactive response plot$/});await plot.focus();await page.keyboard.press('End');assert.ok(Number(await plot.getAttribute('aria-valuenow'))>0);await page.keyboard.press('Home');assert.equal(await plot.getAttribute('aria-valuenow'),'0');
 await panel.getByRole('button',{name:'Restore pre-inspection setting',exact:true}).click();await page.waitForTimeout(100);
 const restored=await model(page);for(const [key,value]of Object.entries(initial.input))assert.ok(near(restored.input[key],value),`${route}: cursor inspection undo preserves ${key}`);
 await panel.getByRole('button',{name:'Pin baseline curve',exact:true}).click();assert.equal(await panel.getByRole('button',{name:'Clear baseline curve',exact:true}).isEnabled(),true);
 const beforeZoom=await plot.getAttribute('data-x-domain');await panel.getByRole('button',{name:'Zoom plot in',exact:true}).click();const afterZoom=await plot.getAttribute('data-x-domain');assert.notEqual(afterZoom,beforeZoom,'Plot zoom changes the data viewport');
 await panel.getByRole('button',{name:'Pan plot right',exact:true}).click();await panel.getByRole('button',{name:'Fit all samples',exact:true}).click();
 const csvPromise=page.waitForEvent('download');await panel.getByRole('button',{name:'Export curve CSV',exact:true}).click();const csv=await readDownload(await csvPromise);assert.ok(csv.includes(d.xUnit)&&csv.includes(d.yUnit)&&csv.includes('baseline'),'Export retains units and both traces');
 const svgPromise=page.waitForEvent('download');await panel.getByRole('button',{name:'Export plot SVG',exact:true}).click();const svg=await readDownload(await svgPromise);assert.ok(svg.includes('<svg')&&svg.includes('stroke-dasharray="7 5"'),'Vector export includes distinguishable baseline');assert.ok(!/NaN|Infinity/.test(svg),'Exported axes and paths are finite');
 const beforeMobile=await page.viewportSize();await page.setViewportSize({width:390,height:844});assert.equal(await panel.evaluate(n=>n.scrollWidth>n.clientWidth+1),false,'Graph tools fit mobile width');
 if(['/optics/diffraction','/modern-physics/atomic-spectra','/thermodynamics/temperature','/electronics/amplifiers'].includes(route)){await page.screenshot({path:`artifacts/studio-ux-audit/${route.split('/').at(-1)}-visual-mobile.png`});}
 await page.setViewportSize(beforeMobile);await page.keyboard.press('Escape');assert.equal(await panel.count(),0);assert.equal(await launch.evaluate(n=>n===document.activeElement),true,'Graph tools return focus');
 if(route==='/modern-physics/atomic-spectra'){
  await page.getByRole('combobox',{name:'Element',exact:true}).selectOption('helium');
  await launch.click();await tab('Point data').click();await page.waitForTimeout(100);
  assert.equal(await panel.locator('tbody tr').count(),1,'Changing a held parameter starts a separate current trace');
  await page.keyboard.press('Escape');
  await page.getByRole('combobox',{name:'Initial Level',exact:true}).selectOption('6');
  await page.getByRole('combobox',{name:'Transition Level',exact:true}).selectOption('4');await launch.click();await tab('Response plot').click();
  assert.equal(await panel.getByRole('spinbutton',{name:'Sweep minimum',exact:true}).inputValue(),'5','Quantum sweep excludes levels below the selected final state');
  await panel.getByRole('button',{name:'Collect response curve',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.sve-panel [role="status"]')?.textContent?.startsWith('Sweep complete'));
  await tab('Point data').click();assert.equal(await panel.locator('tbody tr').count(),2,'Only allowed discrete transitions are sampled');await page.keyboard.press('Escape');
 }
 return {modes,points:new Set(xValues).size,solverReplay:true,sweepRestore:true,viewPreservesPhysics:true,keyboardCursor:true,exports:['CSV','SVG'],mobileWidth:390,nativeScene:true};
}
