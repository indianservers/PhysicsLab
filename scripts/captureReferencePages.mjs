import {chromium} from 'playwright-core';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const root='artifacts/physics-studio-audit';
const inventory=JSON.parse(await readFile(root+'/studio-inventory.json','utf8'));
await mkdir(root+'/reference-captures',{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const context=await browser.newContext({reducedMotion:'reduce',serviceWorkers:'block'});
const previous=await readFile(root+'/reference-captures.json','utf8').then(JSON.parse).catch(()=>[]);
const recapture=process.argv.find(a=>a.startsWith('--recapture='))?.slice(12).split(',')??[];
const results=previous.filter(r=>!recapture.includes(r.route)&&!r.failure&&inventory.some(i=>i.mockup===r.reference&&i.currentRoute===r.route&&r.actualWidth===i.width&&r.actualHeight===i.height));
const queue=inventory.filter(i=>!results.some(r=>r.reference===i.mockup));
try{for(const row of queue){
 const page=await context.newPage();
 await page.setViewportSize({width:row.width,height:row.height});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const key=row.mockup.replaceAll('/','__').replace(/\.png$/,'');
 const result={reference:row.mockup,route:row.currentRoute,width:row.width,height:row.height,key};
 try{
  await page.goto('http://127.0.0.1:5173'+row.currentRoute,{waitUntil:'networkidle',timeout:60000});
  await page.locator('h1,h2').first().waitFor();
  await page.locator('.splash-loader').waitFor({state:'hidden'});
  await page.evaluate(()=>document.fonts.ready);
  const pause=page.getByRole('button',{name:/^(Pause|Ⅱ Pause)$/});
  if(await pause.count()===1 && await pause.isVisible())await pause.click();
  await page.addStyleTag({content:'*,*::before,*::after{animation-play-state:paused!important;transition:none!important}'});
  await page.screenshot({path:root+'/reference-captures/'+key+'.png'});
  Object.assign(result,await page.evaluate(()=>({actualWidth:innerWidth,actualHeight:innerHeight,heading:document.querySelector('h1,h2')?.textContent,mainLeft:document.querySelector('main#content')?.getBoundingClientRect().left??0,overflow:document.documentElement.scrollWidth-innerWidth,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)})),{errors});
 }catch(e){result.failure=e.message;}
 results.push(result);await page.close();
 await writeFile(root+'/reference-captures.json',JSON.stringify(results,null,2));
 if(results.length%10===0)console.log('Captured',results.length,'/',inventory.length);
}}finally{await browser.close();}
