import { chromium } from 'playwright-core';
import { mkdir,writeFile } from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',headless:true});
let page=await browser.newPage();
await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
const labs=await page.evaluate(async()=>{const {experiments}=await import('/src/lib/experiments.ts');const {has3DAnimation}=await import('/src/components/Experiment3DAnimation.tsx');return experiments.map(e=>({id:e.id,three:has3DAnimation(e.id)}));});
await mkdir('artifacts/physics-studio-audit',{recursive:true});
const results=[];
for(const lab of labs){
 await page.close();
 page=await browser.newPage();
 await page.goto(`http://127.0.0.1:5173/experiments/${lab.id}${lab.three ? "#coach" : "#three-d"}`,{waitUntil:'domcontentloaded'});
 if(lab.id==='simple-pendulum'){
  await page.locator('.pds-mode-bar').waitFor();
  const tabs=await page.locator('.pds-mode-bar nav button').allTextContents();
  const pass=tabs.join(',')==='Observe,Predict,Experiment,Explain'&&await page.locator('.lesson-command-tabs').count()===0;
  results.push({...lab,tabs,active:'Observe',layout:'reference pendulum studio',pass});
  await writeFile('artifacts/physics-studio-audit/lab-tabs.json',JSON.stringify(results,null,2));console.log(lab.id,pass?'PASS':'FAIL');continue;
 }
 await page.locator('.lesson-command-tabs').waitFor();
 const tabs=await page.locator('.lesson-command-tabs [role=tab]').allTextContents();
 const active=await page.locator('.lesson-command-tabs [aria-selected=true]').textContent();
 const pass=tabs.some(t=>t.trim()==='3D')===lab.three && (lab.three||active?.trim()==='Simulate') && !tabs.some(t=>/Upcoming/.test(t));
 results.push({...lab,tabs,active,pass});
 await writeFile('artifacts/physics-studio-audit/lab-tabs.json',JSON.stringify(results,null,2));
 console.log(lab.id,pass?'PASS':'FAIL');
}
await writeFile('artifacts/physics-studio-audit/lab-tabs.json',JSON.stringify(results,null,2));
await browser.close();
if(results.some(r=>!r.pass))process.exitCode=1;
