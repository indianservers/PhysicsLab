import assert from 'node:assert/strict';

export async function checkStudioWorkspace(page,route) {
 const launcher=page.getByRole('button',{name:'Lab notebook & tools',exact:false});
 await launcher.click();
 const panel=page.locator('[data-lab-workspace] .slw-panel');await panel.waitFor();
 const tabs=panel.getByRole('tablist',{name:'Notebook learning modes'}),tab=m=>tabs.getByRole('tab',{name:m,exact:true}),modes=[];
 for(const m of ['Observe','Predict','Experiment','Explain','Challenge']){
  await tab(m).click();assert.equal(await tab(m).getAttribute('aria-selected'),'true');
  const body=panel.getByRole('tabpanel');assert.ok((await body.innerText()).trim().length>60);
  assert.equal(await body.getAttribute('aria-labelledby'),await tab(m).getAttribute('id'));modes.push(m);
 }
 await tab('Predict').click();await panel.getByLabel('Your prediction and physical reasoning').fill(`Evidence prediction for ${route}`);
 await tab('Observe').click();await tab('Predict').click();assert.equal(await panel.getByLabel('Your prediction and physical reasoning').inputValue(),`Evidence prediction for ${route}`);
 await tab('Predict').focus();await page.keyboard.press('ArrowRight');assert.equal(await tab('Experiment').getAttribute('aria-selected'),'true');
 await panel.getByLabel('Plan, observations and units').fill('Controlled comparison with units.');await panel.getByRole('button',{name:'Record trial',exact:true}).click();await panel.getByRole('button',{name:'Pin current baseline',exact:true}).click();
 const visualComparison=panel.getByText('Visual comparison',{exact:true});
 const visualComparisonChecked=await visualComparison.count()===1;
 if(visualComparisonChecked){
  await visualComparison.click();await panel.getByRole('button',{name:'Capture current visual',exact:true}).click();
  for(const image of await panel.locator('.slw-visual-pair img').all())await image.evaluate(image=>image.decode());
 }
 const numeric=page.locator('[data-studio-apparatus] input[type="range"]:not(:disabled)').first();let controlRoundTrip=false;
 if(await numeric.count()){
  const original=await numeric.inputValue();await panel.getByText('Precise controls',{exact:true}).click();
  const editor=panel.locator('.slw-control').filter({has:page.locator('input[type="number"]:not(:disabled)')}).first();
  if(await editor.count()){
   const input=editor.locator('input[type="number"]'),old=await input.inputValue(),max=await input.getAttribute('max');
   await editor.getByRole('button',{name:max&&Number(old)>=Number(max)?/^Decrease /:/^Increase /}).click();
   await page.waitForFunction(({element,old})=>element.value!==old,{element:await input.elementHandle(),old},{timeout:10000});
   assert.notEqual(await input.inputValue(),old,'Precision control must reach real page state');await panel.getByRole('button',{name:'Restore baseline controls',exact:true}).click();assert.equal(await numeric.inputValue(),original,'Baseline must restore apparatus control');controlRoundTrip=true;
  }
 }
 await tab('Explain').click();await panel.getByRole('button',{name:'Next derivation step',exact:true}).click();await panel.getByRole('button',{name:'Next example step',exact:true}).click();
 await tab('Challenge').click();const reveal=panel.getByRole('button',{name:'Reveal reference reasoning',exact:true});assert.equal(await reveal.isDisabled(),true);await panel.getByLabel('Your result, units and reasoning').fill('My reasoning and units');await reveal.click();assert.equal(await panel.locator('.slw-mode .slw-notice').count(),1);
 const rubric=panel.getByRole('group',{name:'Self-assess result and reasoning separately'});
 const selfAssessment=await rubric.count()===1;
 if(selfAssessment){await rubric.getByLabel('Result and units',{exact:true}).selectOption('2');await rubric.getByLabel('Physical reasoning and assumptions',{exact:true}).selectOption('1');assert.equal(await rubric.getByLabel('Result and units',{exact:true}).inputValue(),'2');}
 await panel.getByRole('button',{name:'Close lab notebook',exact:true}).click();assert.equal(await launcher.evaluate(el=>el===document.activeElement),true);
 await launcher.click();await tab('Predict').click();assert.equal(await panel.getByLabel('Your prediction and physical reasoning').inputValue(),`Evidence prediction for ${route}`);
 if(['/optics/diffraction','/measurement/meter-scale','/modern-physics/matter-waves'].includes(route))await page.screenshot({path:`artifacts/studio-ux-audit/${route.split('/').at(-1)}-desktop.png`});
 await page.setViewportSize({width:390,height:844});assert.equal(await panel.evaluate(node=>node.scrollWidth>node.clientWidth+1),false,'Notebook must not overflow on mobile');
 if(['/optics/diffraction','/measurement/meter-scale','/modern-physics/matter-waves'].includes(route))await page.screenshot({path:`artifacts/studio-ux-audit/${route.split('/').at(-1)}-mobile.png`});
 await page.setViewportSize({width:1440,height:1000});await page.keyboard.press('Escape');assert.equal(await panel.count(),0);
 return {modes,controlRoundTrip,mobileWidth:390,selfAssessment,visualComparison:visualComparisonChecked};
}

export async function checkStudioHomes(page,chapters) {
 const homes=[];
 for(const studio of new Set(Object.values(chapters).map(c=>c.studio))){
  const route='/concept-studio/'+studio;await page.evaluate(route=>{history.pushState({},'',route);dispatchEvent(new PopStateEvent('popstate'));},route);
  const home=page.locator('.csh-labs-only');await home.waitFor();
  const expected=Object.entries(chapters).filter(([,c])=>c.studio===studio).map(([r])=>r).sort();
  const links=await home.locator('a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')).sort());assert.deepEqual(links,expected,'Studio home must contain only its six lab links');
  const search=home.getByRole('searchbox');await search.fill('no-matching-lab-xyz');assert.equal(await home.locator('.csh-lab-card').count(),0);await search.fill('');assert.equal(await home.locator('.csh-lab-card').count(),6);homes.push({route,status:'pass',labLinks:links.length});
 }
 return homes;
}
