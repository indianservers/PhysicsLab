import {chromium} from 'playwright-core';
import {mkdir,writeFile} from 'node:fs/promises';
const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const p=await b.newPage({viewport:{width:1536,height:1024}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
await mkdir('artifacts/physics-studio-audit/pendulum',{recursive:true});
try{
 await p.goto('http://127.0.0.1:5173/experiments/simple-pendulum',{waitUntil:'networkidle'});
 await p.locator('.pds-three-host canvas').waitFor();
 await p.waitForFunction(()=>Number(document.querySelector('.pds-page')?.getAttribute('data-pendulum-time'))>5.24);
 await p.getByRole('button',{name:'Pause',exact:true}).click();
 await p.screenshot({path:'artifacts/physics-studio-audit/pendulum/desktop-first.png'});
 console.log(JSON.stringify({heading:await p.locator('h1').textContent(),time:await p.locator('.pds-page').getAttribute('data-pendulum-time'),period:await p.locator('[data-measured-period]').textContent(),overflow:await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth),errors}));
 await writeFile('artifacts/physics-studio-audit/pendulum/first-render.json',JSON.stringify({errors},null,2));
}finally{await b.close();}
