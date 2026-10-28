import assert from 'node:assert/strict';
const state=async page=>JSON.parse(await page.locator('[data-visual-model]').textContent());
async function textDownload(download){const chunks=[];for await(const c of await download.createReadStream())chunks.push(c);return Buffer.concat(chunks).toString('utf8');}
const near=(a,b)=>Math.abs(a-b)<=Math.max(Math.abs(a),Math.abs(b),Number.MIN_VALUE)*1e-9;

export async function checkAdditionalLabNative(page,route){
 if(route==='/optics/optical-elements')return optics(page);
 if(!route.startsWith('/practicals/'))return null;
 const id=route.split('/').at(-1),views=page.getByRole('tablist',{name:'Practical learning views'}),tab=name=>views.getByRole('tab',{name,exact:true});
 await tab('Graph').click();const charts=page.locator('.pr-charts [data-practical-plot]'),count=await charts.count();assert.ok(count>=1);
 for(let i=0;i<count;i++){
  const chart=charts.nth(i),slider=chart.getByRole('slider');await slider.focus();await page.keyboard.press('End');
  assert.equal(await slider.getAttribute('aria-valuenow'),await slider.getAttribute('aria-valuemax'),'End selects the final native plot point');
  const s=await state(page);
  if(!['wire','rule'].includes(id))assert.ok(near(s.scene.time,id==='springs'?4*s.quantities['s.period']:id==='capacitor'?5*s.quantities['s.tau']:s.quantities['s.end']),'Native plot cursor replays the real clock');
  await chart.getByText('Plot tools and point data',{exact:true}).click();
  await chart.getByRole('button',{name:'Pin plot baseline',exact:true}).click();
  const baseline=await chart.locator('path[stroke-dasharray="8 6"]').first().getAttribute('d');
  await slider.focus();await page.keyboard.press('Home');assert.equal(await slider.getAttribute('aria-valuenow'),'0');
  assert.equal(await chart.locator('path[stroke-dasharray="8 6"]').first().getAttribute('d'),baseline,'Baseline stays frozen during time/parameter inspection');
  await chart.getByRole('button',{name:'Zoom plot in',exact:true}).click();await chart.getByRole('button',{name:'Pan plot right',exact:true}).click();await chart.getByRole('button',{name:'Fit plot',exact:true}).click();
  const csvPromise=page.waitForEvent('download');await chart.getByRole('button',{name:'Export plot CSV',exact:true}).click();assert.ok((await textDownload(await csvPromise)).includes('baseline'));
  const svgPromise=page.waitForEvent('download');await chart.getByRole('button',{name:'Export plot SVG',exact:true}).click();const svg=await textDownload(await svgPromise);assert.ok(svg.includes('<svg')&&!/NaN|Infinity/.test(svg));
  await chart.getByText('Plot tools and point data',{exact:true}).click();
 }
 await page.getByRole('button',{name:/Reset apparatus/}).click();
 const presets=page.getByRole('group',{name:'Apparatus camera presets'}),canvas=page.locator('.pr-apparatus canvas');
 if(await canvas.count()){
  await page.waitForFunction(()=>!!document.querySelector('.pr-apparatus canvas')?.dataset.cameraPose);
  const initial=(await state(page)).input;
  await presets.getByRole('button',{name:'Front camera',exact:true}).click();await page.waitForTimeout(1100);const front=await canvas.getAttribute('data-camera-pose');
  await presets.getByRole('button',{name:'Left camera',exact:true}).click();await page.waitForFunction(old=>document.querySelector('.pr-apparatus canvas')?.dataset.cameraPose!==old,front);
  assert.deepEqual((await state(page)).input,initial,'Native camera presets preserve all physical parameters');
  await presets.getByRole('button',{name:'Reset camera',exact:true}).click();await page.waitForTimeout(1600);
  const first=await canvas.getAttribute('data-scene-renders');await page.waitForTimeout(1100);assert.equal(await canvas.getAttribute('data-scene-renders'),first,'A paused, unchanged scene does not redraw continuously');
 }
 const field=label=>page.getByRole('spinbutton',{name:label+' value',exact:true});
 const set=async(label,value)=>{await field(label).fill(String(value));await field(label).press('Tab');await page.waitForTimeout(60);};
 await tab('Data').click();const notebook=page.locator('.pr-notebook');
 if(await notebook.getByRole('button',{name:'Clear readings',exact:true}).isEnabled())await notebook.getByRole('button',{name:'Clear readings',exact:true}).click();
 if(id==='rule'){await set('Load position (cm)',20);}
 const firstTrial=await state(page);await page.getByRole('button',{name:/Record measurement/}).click();
 if(id==='springs')await set('Mass (kg)',.3);
 if(id==='capacitor')await set('Inspection time',.2);
 if(id==='wire')await set('Contact length (m)',1.5);
 if(id==='rule'){await set('Pivot position (cm)',60);await set('Load position (cm)',80);}
 if(id==='sphere')await set('Track distance (m)',1.3);
 if(id==='papers')await set('Nested papers',2);
 await page.getByRole('button',{name:/Record measurement/}).click();const rows=notebook.locator(':scope > .pr-table > table > tbody > tr');assert.equal(await rows.count(),2);
 await notebook.getByRole('button',{name:'Restore trial 1',exact:true}).click();assert.deepEqual((await state(page)).input,firstTrial.input);assert.equal((await state(page)).scene.time,firstTrial.scene.time);
 if(id!=='rule'){
  const recorded=notebook.locator('[data-practical-plot="Recorded measurements"]'),before=await state(page);
  await recorded.getByRole('slider').focus();await page.keyboard.press('End');assert.deepEqual((await state(page)).input,before.input,'Recorded-data inspection must not invent a new apparatus setting');
  await recorded.getByText('Plot tools and point data',{exact:true}).click();await recorded.getByRole('button',{name:'Pin plot baseline',exact:true}).click();assert.ok(await recorded.locator('rect[stroke="#ffc65b"]').count()>=2,'Repeated recorded readings are scatter points, not an interpolated curve');
  await recorded.getByText('Plot tools and point data',{exact:true}).click();
 }
 const dataCSV=page.waitForEvent('download');await notebook.getByRole('button',{name:'Export CSV',exact:true}).click();assert.ok(!(await textDownload(await dataCSV)).includes('NaN'));
 await notebook.getByRole('button',{name:'Clear readings',exact:true}).click();assert.equal(await rows.count(),0);await page.getByRole('button',{name:'Undo clear readings',exact:true}).click();assert.equal(await rows.count(),2);
 const desktop=page.viewportSize();await page.setViewportSize({width:390,height:844});await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await page.evaluate(()=>document.activeElement instanceof HTMLElement&&document.activeElement.blur());assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'Whole practical page fits a phone');await page.screenshot({path:`artifacts/studio-ux-audit/practical-${id}-mobile.png`,fullPage:true});await page.setViewportSize(desktop);
 await page.getByRole('button',{name:/Reset apparatus/}).click();await tab('Setup').click();
 return {plots:count,cursorReplay:true,baselines:true,exports:['CSV','SVG'],nativeCameraPreservesPhysics:true,pausedSceneRendersOnDemand:true,trialRestore:true,undoClear:true,mobileWidth:390};
}

async function optics(page){
 const original=await state(page),field=page.getByRole('spinbutton',{name:'Beam direction value',exact:true}),angle=original.input.angle===12?13:12;
 await field.fill(String(angle));await field.press('Enter');
 const launcher=page.getByRole('button',{name:'Graph & scene tools',exact:true});await launcher.click();const panel=page.getByRole('region',{name:/graph and scene tools$/});
 await panel.getByRole('button',{name:'Collect response curve',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.sve-panel [role=status]')?.textContent.startsWith('Sweep complete'));
 assert.equal((await state(page)).input.angle,angle);await page.keyboard.press('Escape');
 await page.locator('.oe-setup-tools').getByRole('button',{name:/Undo/}).click();assert.deepEqual((await state(page)).input,original.input,'One native undo crosses the real edit, not 17 temporary solver samples');
 await page.getByRole('button',{name:'ON',exact:true}).click();assert.equal((await state(page)).quantities['s.deviation'],null);assert.equal(await page.locator('.oe-diagram .oe-ray-path').count(),0);await page.getByRole('button',{name:'OFF',exact:true}).click();
 while(await page.locator('.oe-glass-piece').count())await page.getByRole('button',{name:'Remove glass',exact:true}).click();
 assert.equal((await state(page)).quantities['s.deviation'],null);await launcher.click();await panel.getByRole('button',{name:'Collect response curve',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.sve-panel [role=status]')?.textContent.startsWith('Sweep complete'));
 await panel.getByRole('tab',{name:'Point data',exact:true}).click();const ys=await panel.locator('tbody tr').evaluateAll(rows=>rows.map(r=>r.getAttribute('data-y')));assert.ok(ys.length>=2,'No-hit sweep must finish collecting multiple settings: '+JSON.stringify(ys));assert.ok(ys.every(y=>y==='undefined'),'No-hit sweeps remain gaps, never fabricated zero deviations: '+JSON.stringify(ys));await page.keyboard.press('Escape');
 await page.getByLabel('Import setup JSON',{exact:true}).setInputFiles({name:'restored-setup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(original.input))});
 await page.waitForFunction(count=>JSON.parse(document.querySelector('[data-visual-model]').textContent).input.scene.length===count,original.input.scene.length);
 assert.deepEqual((await state(page)).input,original.input);
 return {sweepsPreserveUndo:true,laserOffUndefined:true,noHitCurveGaps:true,fullSetupRestore:true};
}
