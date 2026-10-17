import{chromium}from'playwright-core';const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{const p=await b.newPage({viewport:{width:1536,height:1024},reducedMotion:'reduce'});await p.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());await p.goto('http://127.0.0.1:5173/magnetism/lorentz-force',{waitUntil:'domcontentloaded',timeout:120000});await p.locator('.lfx-native canvas').first().waitFor({timeout:120000});await p.screenshot({path:'artifacts/physics-studio-audit/lorentz-force/first.png',fullPage:true})}finally{await b.close()}








