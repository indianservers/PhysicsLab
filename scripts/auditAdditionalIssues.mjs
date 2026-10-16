import { chromium } from 'playwright-core';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
const output='artifacts/additional-issues'; await mkdir(output,{recursive:true});
const source=await readFile('src/App.tsx','utf8');
const routes=[...new Set([...source.matchAll(/path="([^":*]+)"/g)].map(m=>m[1]))].filter(r=>r!=='/'&&!r.includes('/pro-lab/'));
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1365,height:950},serviceWorkers:'block'});
const results=[], errors=[];page.on('pageerror',e=>errors.push(e.message));
try {
 for(const route of routes){
  const start=errors.length;
  try {
   await page.goto(`http://127.0.0.1:5367${route}`,{waitUntil:'domcontentloaded'});
   await page.locator('#content').waitFor({timeout:12000}); await page.waitForTimeout(120);
   const desktop=await page.evaluate(()=>{
    const visible=e=>e.getClientRects().length>0;
    return {
     title:document.querySelector('h1')?.textContent,
     overflow:document.documentElement.scrollWidth-innerWidth,
     images:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>({src:i.getAttribute('src'),alt:i.alt})),
     inputs:[...document.querySelectorAll('input,select,textarea')].filter(visible).map((e,index)=>({index,tag:e.tagName,type:e.type,name:e.getAttribute('aria-label')||[...e.labels||[]].map(l=>l.textContent.trim()).join(' ')||e.title||e.placeholder||'',value:e.value,min:e.min,max:e.max,step:e.step,invalid:!!e.validity&&!e.validity.valid,stepMismatch:e.validity?.stepMismatch,rangeUnderflow:e.validity?.rangeUnderflow,rangeOverflow:e.validity?.rangeOverflow,html:e.outerHTML.slice(0,600)})),
     links:[...document.querySelectorAll('a[href]')].filter(visible).map(e=>({href:e.getAttribute('href'),text:e.textContent.trim()})),
     buttons:[...document.querySelectorAll('button')].filter(visible).filter(e=>!e.textContent.trim()&&!e.getAttribute('aria-label')&&!e.title).map(e=>e.outerHTML.slice(0,350)),
     duplicateIds:[...new Set([...document.querySelectorAll('[id]')].map(e=>e.id))].filter(id=>document.querySelectorAll(`[id="${CSS.escape(id)}"]`).length>1),
     mathErrors:[...document.querySelectorAll('.katex-error')].map(e=>e.textContent)
    };
   });
   await page.setViewportSize({width:390,height:844});await page.waitForTimeout(40);
   const mobile=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,offscreen:[...document.querySelectorAll('input,select,textarea,button')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&(r.left < -3||r.right>innerWidth+3)&&getComputedStyle(e).position!=='fixed';}).map(e=>({label:e.getAttribute('aria-label')||e.textContent.trim().slice(0,80),html:e.outerHTML.slice(0,300)}))}));
   await page.setViewportSize({width:1365,height:950});
   const row={route,desktop,mobile,errors:errors.slice(start)};results.push(row);console.log(JSON.stringify({route,inputs:desktop.inputs.length,invalid:desktop.inputs.filter(i=>i.invalid).length,unnamed:desktop.inputs.filter(i=>!i.name).length,buttons:desktop.buttons.length,images:desktop.images.length,mobileOverflow:mobile.overflow,offscreen:mobile.offscreen.length,errors:row.errors}));
  }catch(e){results.push({route,failure:e.message});console.log(JSON.stringify({route,failure:e.message}));}
  await writeFile(`${output}/${process.argv.includes('--verify')?'after':'before'}-routes.json`,JSON.stringify(results,null,2));
 }
}finally{await browser.close();}
