import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { buildSync } from 'esbuild';
import { chromium } from 'playwright-core';

// Enumerate the actual registries, rather than maintaining a sample of lesson URLs.
const exportsToLoad = ['concepts','experiments','curriculum','astrophysics','particlePhysics','stringTheoryStudio','conceptStudioHomes','appDirectory','experimentVisualizationSpecs'];
const bundle = buildSync({stdin:{contents:exportsToLoad.map(name=>`export * from './src/lib/${name}';`).join('\n')+"\nexport * from './src/data/rocketParts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'cjs',write:false});
const loaded={exports:{}};
new Function('module','exports','require',bundle.outputFiles[0].text)(loaded,loaded.exports,createRequire(import.meta.url));
const data=loaded.exports;
const app=fs.readFileSync('src/App.tsx','utf8');
const expandedDynamicRoutes=new Set(['/concept-studio/:conceptId','/rocket-lab/parts/:partId','/experiments/:id','/particle-physics/:conceptId']);
for(const match of app.matchAll(/<Route\s+path="([^"]+)"/g))if(match[1].includes(':')&&!expandedDynamicRoutes.has(match[1]))throw new Error(`Missing lesson enumeration for ${match[1]}`);
const routes=new Map();
function add(url,group,title,expected='inspect'){routes.set(url,{url,group,title,expected});}
for(const match of app.matchAll(/<Route\s+path="([^"]+)"/g)){
  if(!/[:*]/.test(match[1]))add(match[1],'Standalone route',match[1]);
}
for(const item of data.appDirectoryEntries) if(!item.path.includes(':'))add(item.path,item.section,item.title);
for(const item of data.buildConceptCards())add(`/concepts?concept=${item.id}`,'Curriculum concept',item.title);
for(const item of data.experiments){
  add(`/experiments/${item.id}`,'Experiment',item.title);
  add(`/experiments/${item.id}#three-d`,'Experiment 3D tab',item.title,data.requiresCustom3D(item.id)?'upcoming':'specific');
}
for(const item of data.astrophysicsConcepts)add(`/astrophysics?concept=${item.id}`,'Astrophysics concept',item.title,['gravity-orbits','solar-system','black-holes','accretion-disks','gravitational-waves','galaxy-structure','milky-way'].includes(item.id)?'specific':'upcoming');
for(const item of data.particlePhysicsConcepts){
  add(`/particle-physics/${item.id}`,'Particle concept',item.title,'upcoming');
  add(`/particle-physics?concept=${item.id}`,'Particle query route',item.title,'upcoming');
}
for(const item of data.rocketParts)add(`/rocket-lab/parts/${item.id}`,'Rocket component lesson',item.name);
for(const item of data.stringTheoryLessons)add(`/string-theory?concept=${item.id}`,'String theory lesson',item.title,['scale','network'].includes(item.visual)?'specific':'inspect');
for(const item of data.studioHomes)add(`/concept-studio/${item.id}`,'Concept studio',item.name,'upcoming');
const topicBlock=app.match(/const topics = \[([\s\S]*?)\];/)?.[1]??'';
for(const match of topicBlock.matchAll(/"([^"]+)"/g))add(`/topics/${match[1]}`,'Topic page',match[1]);

// Include every source file that can create a 3D context in the coverage report.
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(path.join(dir,entry.name)):[path.join(dir,entry.name)]);}
const renderers=files('src').filter(file=>/\.[jt]sx?$/.test(file)).filter(file=>/from\s+["']three|(?:getContext\(["']webgl)|new THREE\.WebGLRenderer/.test(fs.readFileSync(file,'utf8')));
const animation=fs.readFileSync('src/components/Experiment3DAnimation.tsx','utf8');
if(/fallback3DConfig|fallback3DKind/.test(animation))throw new Error('Generic experiment 3D fallback has returned');
const configBlock=animation.slice(animation.indexOf('const animationConfigs'),animation.indexOf('interface Experiment3DAnimationProps'));
const configIds=new Set([...configBlock.matchAll(/(?:"([^"]+)"|(\w+)):\s*\{\s*kind:/g)].map(match=>match[1]??match[2]));
for(const item of data.experiments){
  if(!data.requiresCustom3D(item.id) && item.id!=='atomic-interactions' && !configIds.has(item.id))throw new Error(`Ready 3D status has no scene: ${item.id}`);
  if(data.requiresCustom3D(item.id) && configIds.has(item.id))throw new Error(`Retired 3D config can be revived accidentally: ${item.id}`);
}
if(!data.assertVisualizationSpecCoverage().ok)throw new Error('Experiment visualization coverage is incomplete');
const pending = data.experimentVisualizationSpecs.filter(item=>data.requiresCustom3D(item.experimentId)).map(item=>item.experimentId);
fs.mkdirSync('artifacts',{recursive:true});
const inventory={routes:[...routes.values()],renderers,pending,studioConcepts:data.studioHomes.map(item=>({id:item.id,concepts:item.concepts.map(c=>c.title)}))};
fs.writeFileSync('artifacts/lesson-3d-inventory.json',JSON.stringify(inventory,null,2));
console.log(`Inventory: ${routes.size} routes, ${renderers.length} 3D source files, ${pending.length} upcoming experiment tabs.`);
if(process.argv.includes('--inventory-only'))process.exit(0);

const origin=process.env.AUDIT_ORIGIN??'http://127.0.0.1:5173';
const executablePath=process.env.CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser=await chromium.launch({executablePath,headless:true});
process.once('SIGINT',async()=>{await browser.close();process.exit(130);});
const context=await browser.newContext({viewport:{width:1366,height:900},reducedMotion:'reduce',serviceWorkers:'block'});
await context.addInitScript(()=>{
  const getContext=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(type,...args){
    const result=getContext.call(this,type,...args);
    if(result && /^webgl|experimental-webgl/.test(type))this.dataset.auditWebgl='true';
    return result;
  };
});
const previous=process.argv.includes('--resume') && fs.existsSync('artifacts/lesson-3d-results.json') ? JSON.parse(fs.readFileSync('artifacts/lesson-3d-results.json','utf8')) : [];
const results=previous.filter(item=>item.pass && item.heading && routes.get(item.url)?.expected===item.expected);
const completed=new Set(results.map(item=>item.url));
const queue=[...routes.values()].filter(item=>!completed.has(item.url));
console.log(`Resuming with ${results.length} verified routes; ${queue.length} left.`);
try{
  await Promise.all(Array.from({length:Math.max(1,Number(process.env.AUDIT_WORKERS??3))},async()=>{
    const page=await context.newPage();
    while(queue.length){
      const route=queue.shift();const errors=[];
      const onError=error=>errors.push(error.message);page.on('pageerror',onError);
      let result={...route,pass:true,errors};
      try{
        await page.goto(origin+route.url,{waitUntil:'domcontentloaded',timeout:60000});
        await page.waitForFunction(()=>Boolean(document.querySelector('h1,h2,h3')) && !/^Loading/.test(document.body.innerText.trim()),{},{timeout:20000});
        if(route.expected==='upcoming')await page.getByRole('heading',{name:'3D simulation upcoming',exact:true}).waitFor({timeout:15000});
        if(route.expected==='specific')await page.waitForFunction(()=>document.querySelector('canvas[data-audit-webgl],.three-lab-fallback'),{},{timeout:15000});
        const rendered=await page.evaluate(()=>({
          heading:document.querySelector('h1')?.textContent?.trim()??document.querySelector('h2')?.textContent?.trim()??document.querySelector('h3')?.textContent?.trim()??'',
          webgl:document.querySelectorAll('canvas[data-audit-webgl]').length,
          upcoming:[...document.querySelectorAll('h3')].filter(e=>e.textContent==='3D simulation upcoming').length,
          error:/Something went wrong|Experiment not found|Page not found/.test(document.body.innerText),
        }));
        Object.assign(result,rendered);
        if(rendered.error)throw new Error('Route rendered an error page');
        if(route.expected==='upcoming' && await page.locator('.three-lab-card canvas,.particle-three-lab canvas,.csh-three:not(.csh-three-atlas) canvas').count())throw new Error('Generic 3D canvas still mounted');
        // Studio concept buttons are additional lessons within each route.
        if(route.group==='Concept studio'){
          const studio=data.studioHomes.find(item=>route.url.endsWith('/'+item.id));
          result.conceptsChecked=[];
          for(const title of studio.concepts.map(item=>item.title)){
            await page.locator('.csh-concept-grid button').filter({has:page.locator('b',{hasText:title})}).first().click();
            await page.getByRole('region',{name:`${title} 3D simulation upcoming`,exact:true}).waitFor();
            result.conceptsChecked.push(title);
          }
        }
        if(errors.length)throw new Error(errors.join('; '));
      }catch(error){result.pass=false;result.failure=error.message.slice(0,450);}
      page.off('pageerror',onError);results.push(result);
      try { fs.writeFileSync('artifacts/lesson-3d-results.json',JSON.stringify(results,null,2)); }
      catch(error) { console.warn(`Checkpoint deferred: ${error.code??error.message}`); }
      if(results.length%20===0)console.log(`Checked ${results.length}/${routes.size}; failures ${results.filter(item=>!item.pass).length}`);
    }
    await page.close();
  }));
}finally{await browser.close();}
results.sort((a,b)=>a.group.localeCompare(b.group)||a.url.localeCompare(b.url));
const failures=results.filter(item=>!item.pass);
const conceptCount=results.reduce((sum,item)=>sum+(item.conceptsChecked?.length??0),0);
const counts=Object.fromEntries([...new Set(results.map(item=>item.group))].sort().map(group=>[group,results.filter(item=>item.group===group).length]));
const report=['# Full lesson 3D audit','',`Checked ${results.length} routes and ${conceptCount} in-page studio concepts.`,`${failures.length} route failures. ${pending.length} experiment 3D tabs are Upcoming.`,'','This audit checks route coverage, rendering, Upcoming notices, and absence of removed generic 3D canvases. It is not a numerical validation of every retained physics model.','', '## Coverage','',...Object.entries(counts).map(([group,count])=>`- ${group}: ${count}`),'','## Retired preview findings','',...Object.entries(JSON.parse(fs.readFileSync('scripts/lesson3DReviewFindings.json','utf8'))).map(([id,reason])=>`- ${id}: ${reason}`),'','## 3D source inventory','','Includes active renderers, unused implementations, and commented legacy scenes. Shared educational 2D/SVG views and decorative home-page graphics are outside the retired 3D simulation list.','',...renderers.map(file=>`- ${file.replaceAll('\\','/')}`),'','## Every route','', '| Route | Group | Rendered 3D canvases | Upcoming notices | Result |','|---|---|---:|---:|---|',...results.map(item=>`| ${item.url} | ${item.group} | ${item.webgl??'—'} | ${item.upcoming??'—'} | ${item.pass?'PASS':item.failure?.replaceAll('|','/').replaceAll('\n',' ')} |`),'','## In-page studio lessons','',...results.filter(item=>item.conceptsChecked).map(item=>`- ${item.url}: ${item.conceptsChecked.join(', ')}`)].join('\n');
fs.writeFileSync('LESSON_3D_AUDIT.md',report+'\n');
console.log(JSON.stringify({routes:results.length,studioConcepts:conceptCount,failures:failures.map(item=>({url:item.url,error:item.failure})),report:'LESSON_3D_AUDIT.md'},null,2));
if(failures.length)process.exitCode=1;
