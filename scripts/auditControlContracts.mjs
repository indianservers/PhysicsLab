import { chromium } from 'playwright-core';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
const output='artifacts/additional-issues';await mkdir(output,{recursive:true});
const source=await readFile('src/App.tsx','utf8');
const routes=[...new Set([...source.matchAll(/path="([^":*]+)"/g)].map(m=>m[1]))].filter(r=>/^\/(motion|mechanics|measurement|electricity|magnetism|optics|thermodynamics|fluid-mechanics|modern-physics|astrophysics|electronics)\//.test(r));
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const page=await browser.newPage({viewport:{width:1365,height:950},serviceWorkers:'block'});const results=[];
try{for(const route of routes){
 await page.goto(`http://127.0.0.1:5367${route}`,{waitUntil:'domcontentloaded'});await page.locator('#content').waitFor();
 const controls=await page.evaluate(()=>[...document.querySelectorAll('input[type=number]')].map(input=>{
  const label=input.closest('label'),range=label?.querySelector('input[type=range]');if(!range)return null;
  const step=Number(input.step||1),rangeStep=Number(range.step||1);
  return {name:input.getAttribute('aria-label')||label.textContent.trim(),number:{min:input.min,max:input.max,step:input.step,value:input.value},range:{min:range.min,max:range.max,step:range.step,value:range.value},stepMismatch:step!==rangeStep,boundsMismatch:input.min!==range.min||input.max!==range.max};
 }).filter(Boolean));results.push({route,controls});console.log(JSON.stringify({route,pairs:controls.length,mismatches:controls.filter(c=>c.stepMismatch||c.boundsMismatch).length}));
 await writeFile(`${output}/${process.argv.includes('--verify')?'after':'before'}-controls.json`,JSON.stringify(results,null,2));
}}finally{await browser.close();}
