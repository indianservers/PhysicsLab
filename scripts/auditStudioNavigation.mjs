import {chromium} from 'playwright-core';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',headless:true});
const page=await browser.newPage();
await page.goto('http://127.0.0.1:5173/');
const ids=await page.evaluate(async()=>{const {studioHomes}=await import('/src/lib/conceptStudioHomes.ts');return studioHomes.map(s=>s.id)});
const referenceLabs=await page.evaluate(async()=>{const {referenceLabsByStudio}=await import('/src/lib/studioReferenceLabs.ts');return referenceLabsByStudio});
const results=[];
for(const id of ids){
 await page.goto('http://127.0.0.1:5173/concept-studio/'+id,{waitUntil:'domcontentloaded'});
 await page.locator('.csh-concepts').waitFor();
 const nav=await page.locator('.csh-top nav button').allTextContents();
 const labLinks=await page.locator('.csh-reference-labs a').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
 const correctLabLinks=labLinks.length===6&&referenceLabs[id].every(l=>labLinks.includes(l.route));
 const layouts=[];for(const width of [1366,390]){await page.setViewportSize({width,height:900});layouts.push({width,overflow:await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),visible:await page.locator('.csh-reference-labs a').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().width>0))});}
 const placeholders=await page.getByText('3D simulation upcoming',{exact:false}).count();
 const before=await page.locator('.csh-hero-focus').textContent();
 await page.locator('.csh-concept-grid button').nth(1).click();
 const after=await page.locator('.csh-hero-focus').textContent();
 results.push({id,nav,labLinks,layouts,placeholders,conceptSelection:before!==after,pass:correctLabLinks&&layouts.every(l=>l.overflow===0&&l.visible)&&placeholders===0&&before!==after&&nav.join(',')==='Concepts,Activities'});
}
await writeFile('artifacts/physics-studio-audit/studio-navigation.json',JSON.stringify(results,null,2));
console.log(results);
await browser.close();
if(results.some(r=>!r.pass))process.exitCode=1;
