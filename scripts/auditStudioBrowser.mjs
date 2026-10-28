import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { checkStudioWorkspace, checkStudioHomes } from './checkStudioWorkspace.mjs';
import { checkStudioVisuals } from './checkStudioVisuals.mjs';
import { checkStudioNativeTabs } from './checkStudioNativeTabs.mjs';
import {checkAdditionalLabNative} from './checkAdditionalLabNative.mjs';

const root='artifacts/studio-physics-audit';
fs.mkdirSync(root,{recursive:true});
const chapters=JSON.parse(fs.readFileSync('src/lib/studioTheoryContent.json','utf8'));
const skip=Number(process.env.STUDIO_AUDIT_SKIP??0),limit=Number(process.env.STUDIO_AUDIT_LIMIT??Object.keys(chapters).length);
const requested=process.env.STUDIO_AUDIT_ROUTES?JSON.parse(process.env.STUDIO_AUDIT_ROUTES):null;
const entries=Object.entries(chapters).filter(([route])=>!requested||requested.includes(route)).slice(skip,skip+limit);
const resultFile=process.env.STUDIO_AUDIT_RESULT_FILE??(requested?`${root}/browser-results-filtered.json`:process.env.STUDIO_AUDIT_SKIP!==undefined?`${root}/browser-results-${skip}.json`:`${root}/browser-results.json`);
const staticRoot=path.resolve(`${root}/browser-build`);
const publicRoot=path.resolve('public');
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
 let file=[staticRoot,publicRoot].map(base=>path.resolve(base,`.${pathname}`)).find(file=>(file.startsWith(staticRoot+path.sep)||file.startsWith(publicRoot+path.sep))&&fs.existsSync(file)&&fs.statSync(file).isFile());
 if(!file)file=path.join(staticRoot,'index.html');
 const types={'.js':'text/javascript','.css':'text/css','.html':'text/html','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf'};
 response.setHeader('Content-Type',types[path.extname(file)]??'application/octet-stream');
 fs.createReadStream(file).pipe(response);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const baseURL=process.env.STUDIO_AUDIT_URL??`http://127.0.0.1:${server.address().port}${entries[0]?.[0]??'/measurement/meter-scale'}`;
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:Number(process.env.STUDIO_AUDIT_PIXEL_RATIO??1),reducedMotion:'reduce',serviceWorkers:'block'});
// This audit checks UI state, not animation frame rate. Bound continuous 3D
// rendering so headless software WebGL does not starve input/focus checks.
await context.addInitScript(() => {
 window.requestAnimationFrame = callback => window.setTimeout(() => callback(performance.now()), 500);
 window.cancelAnimationFrame = id => window.clearTimeout(id);
});
const page=await context.newPage();
const results=[];
let errors=[];
page.on('pageerror',error=>errors.push(error.message));
page.setDefaultTimeout(40000);
async function clickVisible(locator){
 await locator.scrollIntoViewIfNeeded();
 const reachable=await locator.evaluate(node=>{
  const box=node.getBoundingClientRect();
  const hit=document.elementFromPoint(box.left+box.width/2,box.top+box.height/2);
  return hit!==null&&(hit===node||node.contains(hit));
 });
 if(!reachable)throw Error('Control is covered by another element');
 await locator.click({force:true});
}
try {
await page.goto(baseURL,{waitUntil:'domcontentloaded',timeout:60000});
await page.locator('.str-launch').waitFor({timeout:60000});
for(const [route,chapter] of entries){
 const stage=name=>{if(process.env.STUDIO_AUDIT_TRACE==='1')console.log(`${route}: ${name}`)};
 stage('load');
 errors=[];
 try{
  await page.evaluate(route=>{window.history.pushState({},'',route);window.dispatchEvent(new PopStateEvent('popstate'));},route);
  const button=page.getByRole('button',{name:'Theory & worked examples',exact:false});
  await button.waitFor({state:'visible'});
  await page.locator('h1').first().waitFor({state:'visible'});
  await page.waitForFunction(route=>{const node=document.querySelector('[data-studio-visual-explorer]');return node?.getAttribute('data-route')===route&&!!node.querySelector('[data-visual-model]')?.textContent;},route);
  if(process.env.STUDIO_ADDITIONAL_ONLY==='1'){const additional=await checkAdditionalLabNative(page,route);if(errors.length)throw Error(errors.join('; '));results.push({route,status:'pass',additional});fs.writeFileSync(resultFile,JSON.stringify({routes:entries.length,results},null,2));continue;}
  if(process.env.STUDIO_NATIVE_TABS_ONLY==='1'){
   const nativeTabs=await checkStudioNativeTabs(page);
   results.push({route,status:'pass',nativeTabs});
   fs.writeFileSync(resultFile,JSON.stringify({routes:entries.length,results},null,2));
   continue;
  }
  if(process.env.STUDIO_VISUAL_INVENTORY==='1'){
   await page.waitForFunction(route=>{const node=document.querySelector('[data-studio-visual-explorer]');return node?.getAttribute('data-route')===route&&!!node.querySelector('[data-visual-model]')?.textContent;},route);
   const model=JSON.parse(await page.locator('[data-visual-model]').textContent());
   results.push({route,status:'pass',model,nativeScenes:await page.locator('[data-studio-scene]').count()});
   fs.writeFileSync(resultFile,JSON.stringify({routes:entries.length,results},null,2));
   if(results.length%12===0)console.log(`Inventoried ${results.length}/${entries.length} real model frames`);
   continue;
  }
  if(process.env.STUDIO_VISUALS_ONLY==='1'){
   const nativeTabs=await checkStudioNativeTabs(page);
   const visuals=await checkStudioVisuals(page,route);
   if(errors.length)throw Error(errors.join('; '));
   results.push({route,status:'pass',nativeTabs,visuals});
   fs.writeFileSync(resultFile,JSON.stringify({routes:entries.length,results},null,2));
   if(results.length%6===0)console.log(`Checked graph, scene and native tabs ${results.length}/${entries.length}`);
   continue;
  }
  stage('native tabs');const nativeTabs=await checkStudioNativeTabs(page);
  if(route==='/optics/diffraction'){
   const choices=page.getByRole('group',{name:'Experiment aperture',exact:true});
   await clickVisible(choices.getByRole('button',{name:'Circular Aperture',exact:true}));
   if(await choices.getByRole('button',{name:'Circular Aperture',exact:true}).getAttribute('aria-pressed')!=='true')throw Error('Circular aperture did not activate');
   const circleWidth=parseFloat(await page.locator('[data-reading="width"]').innerText());
   await clickVisible(choices.getByRole('button',{name:'Single Slit',exact:true}));
   const slitWidth=parseFloat(await page.locator('[data-reading="width"]').innerText());
   if(!(circleWidth>slitWidth*1.20&&circleWidth<slitWidth*1.24))throw Error('Aperture content does not match physics');
   for(const camera of ['Top','Front','Side']){
    const cameraButton=page.getByRole('group',{name:'Preview camera'}).getByRole('button',{name:camera,exact:true});
    await clickVisible(cameraButton);
    if(await cameraButton.getAttribute('aria-pressed')!=='true')throw Error(camera+' camera did not activate');
   }
   await page.getByRole('combobox',{name:'Learning level'}).selectOption('Advanced');
   await clickVisible(page.getByRole('button',{name:'Reset',exact:true}));
   await clickVisible(page.getByRole('button',{name:'Next Challenge',exact:false}));
   await page.getByRole('dialog',{name:'Challenge',exact:true}).waitFor({state:'visible'});
   await page.keyboard.press('Escape');
  }
  const modeResults=[];
  for(const mode of ['Predict','Experiment','Explain']){
   const modeButton=page.getByRole('button',{name:mode,exact:true}).first();
   if(await modeButton.count()){
    await clickVisible(modeButton);
    const modeDialog=page.locator('.mc-dialog');
    await modeDialog.waitFor({state:'visible'});
    const styled=await page.locator('.mc-backdrop').evaluate(node=>getComputedStyle(node).position==='fixed');
    if(!styled)throw Error(mode+' dialog is not a visible fixed overlay');
    if(!await modeDialog.locator('[data-learning-mode="'+mode+'"]').count()&&!(await modeDialog.innerText()).trim())throw Error(mode+' has no content');
    modeResults.push(mode);
    await page.keyboard.press('Escape');
    await modeDialog.waitFor({state:'hidden'});
   }
  }
  if(route==='/electronics/logic-gates'){
   const headings={Predict:'Predict the settled output',Experiment:'Inspect and record transitions',Explain:'Boolean network with event-driven propagation'};
   for(const mode of ['Predict','Experiment','Explain']){
    const tab=page.getByRole('tab',{name:mode,exact:true});
    await clickVisible(tab);
    if(await tab.getAttribute('aria-selected')!=='true')throw Error(mode+' tab did not activate');
    await page.getByRole('heading',{name:headings[mode],exact:true}).waitFor({state:'visible'});
    modeResults.push(mode);
   }
   await clickVisible(page.getByRole('tab',{name:'Observe',exact:true}));
   if(await page.locator('.lgx-learning').isVisible())throw Error('Observe did not return to apparatus');
  }
  const inlineLearning={
   '/electricity/electric-potential':'.epv-learning','/electricity/current':'.ecs-learning','/electricity/circuits':'.cts-learning','/electricity/capacitors':'.cps-learning',
   '/magnetism/field-lines':'.mfl-learning','/magnetism/lorentz-force':'.lfx-learning','/magnetism/current-wire':'.cwr-learning','/magnetism/solenoids':'.slx-learning','/magnetism/induction':'.idx-learning','/magnetism/electromagnets':'.emx-learning',
   '/electronics/semiconductors':'.scx-learning','/electronics/diodes':'.ddx-learning','/electronics/transistors':'.btx-learning','/electronics/amplifiers':'.apx-learning',
  }[route];
  if(inlineLearning){
   const content=[];
   for(const mode of ['Predict','Experiment','Explain']){
    const tab=page.getByRole('tab',{name:new RegExp('^'+mode+'(?:\\s|$)')}).first();
    await clickVisible(tab);
    if(await tab.getAttribute('aria-selected')!=='true')throw Error(mode+' tab did not activate');
    const panel=page.locator(inlineLearning);
    await panel.waitFor({state:'visible'});
    content.push((await panel.innerText()).trim());modeResults.push(mode);
   }
   if(content.some(text=>text.length<40)||new Set(content).size!==3)throw Error('Inline modes need distinct substantive content');
   await clickVisible(page.getByRole('tab',{name:/^Observe(?:\s|$)/}).first());
  }
  stage('native workflows');const additional=await checkAdditionalLabNative(page,route);
  stage('notebook');const workspace=await checkStudioWorkspace(page,route);
  stage('graphs and scene');const visuals=await checkStudioVisuals(page,route);
  stage('theory');
  await clickVisible(button);
  const dialog=page.getByRole('dialog',{name:/.+/});
  await dialog.waitFor({state:'visible'});
  // Wait for this route's chapter rather than trusting a previous route's dialog.
  await dialog.getByText(chapter.core,{exact:true}).waitFor({state:'visible'});
  if(await dialog.locator('article>section').count()!==6)throw Error('Missing theory sections');
  await dialog.getByRole('button',{name:'Investigate & practise',exact:true}).click({force:true});
  await dialog.getByText('Reveal reasoning',{exact:true}).click({force:true});
  if(!await dialog.getByText(chapter.answer,{exact:true}).isVisible())throw Error('Answer not revealed');
  await page.keyboard.press('Escape');
  await dialog.waitFor({state:'hidden'});
  // Rendering may finish after the reader, especially for lazy WebGL scenes.
  if(errors.length)throw Error(errors.join('; '));
  results.push({route,status:'pass',modes:modeResults,nativeTabs,additional,workspace,visuals});
 }catch(error){results.push({route,status:'fail',error:error.message,stack:error.stack,errors:[...errors]});console.error(`FAIL ${route}: ${error.stack}`);await page.keyboard.press('Escape');await page.setViewportSize({width:1440,height:1000});}
 fs.writeFileSync(resultFile,JSON.stringify({routes:entries.length,results},null,2)+'\n');
 if(results.length%6===0)console.log(`Checked ${results.length}/${entries.length} routes (offset ${skip})`);
}
for(const [name,route,width,height] of skip===0&&!requested?[['theory-desktop','/motion/conservation-energy',1440,1000],['theory-mobile','/modern-physics/matter-waves',390,844]]:[]){
 await page.setViewportSize({width,height});
 await page.evaluate(route=>{window.history.pushState({},'',route);window.dispatchEvent(new PopStateEvent('popstate'));},route);
 await page.getByRole('button',{name:'Theory & worked examples',exact:false}).click({force:true});
 await page.getByRole('dialog').waitFor();
 await page.screenshot({path:`${root}/${name}.png`});
 const overflow=await page.getByRole('dialog').evaluate(node=>node.scrollWidth>node.clientWidth+1);
 if(overflow)results.push({route,status:'fail',error:`Theory horizontal overflow at ${width}px`});
 await page.keyboard.press('Escape');
}
if(skip===0&&!requested){
 const homes=await checkStudioHomes(page,chapters);
 fs.mkdirSync('artifacts/studio-ux-audit',{recursive:true});
 fs.writeFileSync('artifacts/studio-ux-audit/studio-homes.json',JSON.stringify(homes,null,2));
}
fs.writeFileSync(resultFile,JSON.stringify({routes:entries.length,results},null,2)+'\n');
const failed=results.filter(item=>item.status==='fail');
console.log(`${results.length-failed.length}/${results.length} browser checks passed.`);
if(failed.length)process.exitCode=1;
}finally{await browser.close();server.close();}
