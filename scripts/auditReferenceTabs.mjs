import {chromium} from 'playwright-core';
import {readFile,writeFile} from 'node:fs/promises';
const root='artifacts/physics-studio-audit';
const rows=JSON.parse(await readFile(root+'/studio-inventory.json','utf8'));
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const context=await browser.newContext({viewport:{width:1536,height:1024},serviceWorkers:'block'});
const wanted=process.argv.find(a=>a.startsWith('--routes='))?.slice(9).split(',')??[];
const previous=wanted.length?await readFile(root+'/reference-tabs.json','utf8').then(JSON.parse).catch(()=>[]):[];
const results=previous.filter(r=>!wanted.includes(r.route));
const queue=wanted.length?rows.filter(r=>wanted.includes(r.currentRoute)):rows;
try{for(const row of queue){
 const page=await context.newPage();
 const result={reference:row.mockup,route:row.currentRoute};
 try{
 await page.goto('http://127.0.0.1:5173'+row.currentRoute,{waitUntil:'domcontentloaded'});
 await page.locator('main#content').waitFor();
 await page.locator('h1,h2').first().waitFor();
 Object.assign(result,await page.evaluate(()=>{
  const labels=[...document.querySelectorAll('button')].filter(b=>b.getClientRects().length).filter(b=>{
   let el=b.parentElement;
   for(let i=0;el&&i<3;i++,el=el.parentElement)if(/(?:^|[\s_-])(?:modes?|tabs?|views?|learning)(?:[\s_-]|$)/i.test(el.className)||el.getAttribute('role')==='tablist')return true;
   return b.getAttribute('role')==='tab'||b.hasAttribute('aria-pressed');
  }).map(b=>({text:b.textContent.trim(),label:b.getAttribute('aria-label'),group:b.closest('[role=tablist]')?.getAttribute('aria-label')||b.parentElement.className}));
  const assets=[...new Set([...document.querySelectorAll('img')].map(i=>i.src).concat([...document.querySelectorAll('svg image')].map(i=>i.getAttribute('href')).filter(Boolean).map(href=>new URL(href,location.href).href)).concat([...document.querySelectorAll('*')].map(e=>getComputedStyle(e).backgroundImage).filter(s=>s.startsWith('url(')).map(s=>s.slice(5,-2))))];
  return {tabs:labels,assets,dock:document.querySelectorAll('.studio-enhancement-dock').length};
 }));
 if(result.dock)throw new Error('Extra studio tools dock is visible');
 }catch(e){result.failure=e.message;}
 results.push(result);await page.close();
 await writeFile(root+'/reference-tabs.json',JSON.stringify(results,null,2));
 if(results.length%20===0)console.log('Inspected',results.length,'/',rows.length);
}}finally{await browser.close();}
