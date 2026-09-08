import {chromium} from 'playwright-core';const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{const p=await b.newPage({viewport:{width:1536,height:1024}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:5371/measurement/uncertainty');await p.locator('.unc-page').waitFor();await p.screenshot({path:'artifacts/studio-rebuild/12-uncertainty/first-pass.png',fullPage:true});console.log({errors,geometry:await p.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,clipped:[...document.querySelectorAll('.unc-side>section,.unc-lower>section')].filter(e=>e.scrollWidth>e.clientWidth+3||e.scrollHeight>e.clientHeight+3).map(e=>e.className)}))});}finally{await b.close()}



