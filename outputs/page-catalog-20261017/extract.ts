import fs from 'node:fs';
import { appDirectoryEntries } from '../../src/lib/appDirectory';
import { studioHomes } from '../../src/lib/conceptStudioHomes';
import { particlePhysicsConcepts } from '../../src/lib/particlePhysics';
import { rocketParts } from '../../src/data/rocketParts';
const app=fs.readFileSync('src/App.tsx','utf8');
const routes=[...app.matchAll(/<Route\s+path="([^"]+)"\s+element=\{([^\n]+)/g)].map(m=>({path:m[1],element:m[2]}));
const topics=JSON.parse('['+app.match(/const topics = \[([\s\S]*?)\];/)![1].replace(/,\s*$/,'')+']');
const pretty=(s:string)=>s.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
const rows=new Map();
function add(path:string,title:string,topic:string,type:string,description:string,source:string,notes='') {if(!rows.has(path))rows.set(path,{path,title,topic,type,description,source,notes,url:'https://physics.aimersociety.com'+path});}
const valid=(p:string)=>routes.some(r=>new RegExp('^'+r.path.replace(/:[^/]+/g,'[^/]+')+'$').test(p.split(/[?#]/)[0]))||p.startsWith('/topics/');
for(const e of appDirectoryEntries){if(!valid(e.path))continue;if(e.path.startsWith('/concept-studio/')&&!studioHomes.some(s=>e.path==='/concept-studio/'+s.id))continue; add(e.path,e.title,e.group,e.path.includes('?')||e.path.includes('#')?'Linked view':e.section,e.description,'src/lib/appDirectory.ts');}
for(const r of routes.filter(r=>!r.path.includes(':'))){
 const found=appDirectoryEntries.find(e=>e.path===r.path);if(found)continue;
 const comp=[...r.element.matchAll(/<([A-Z]\w+)/g)].map(m=>m[1]).find(x=>!['Suspense','RouteErrorBoundary','Navigate'].includes(x));
 const imp=comp&&app.match(new RegExp('(?:import \\{ '+comp+' \\} from|const '+comp+' = lazy\\(\\(\\) => import\\()\\s*"([^"]+)"'));
 const source=imp?'src/'+imp[1].replace(/^\.\//,'')+'.tsx':'src/App.tsx';
 const text=fs.existsSync(source)?fs.readFileSync(source,'utf8'):'';
 const title=text.match(/document.title\s*=\s*["']([^"']+)["']/)?.[1]?.split(' · ')[0]||text.match(/<h1[^>]*>([^<{]+)<\/h1>/)?.[1]||r.element.match(/title="([^"]+)"/)?.[1]||pretty(r.path.split('/').pop()||'Home');
 const desc=text.match(/(?:description|subtitle|summary):\s*"([^"]{25,})"/)?.[1]||text.match(/<p[^>]*>\s*([^<{\n]{30,})\s*<\/p>/)?.[1]||`Explore ${title.toLowerCase()} through its interactive page.`;
 add(r.path,title,pretty(r.path.split('/')[1]||'Home'),'Page',desc,source,r.path==='/topics'?'Redirects to /topics/mechanics':'');
}
for(const t of topics)add('/topics/'+t,pretty(t),pretty(t),'Topic hub',`Browse ${pretty(t).toLowerCase()} concepts and related experiments.`,'src/App.tsx');
for(const s of studioHomes)add('/concept-studio/'+s.id,s.name,s.name,'Concept studio',s.tagline+' '+s.concepts.map(c=>c.title+': '+c.detail).join(' '),'src/lib/conceptStudioHomes.ts');
for(const c of particlePhysicsConcepts)add('/particle-physics/'+c.id,c.title,'Particle Physics / '+c.category,'Particle concept',c.summary,'src/lib/particlePhysics.ts');
for(const p of rocketParts)add('/rocket-lab/parts/'+p.id,p.name,p.system+' / '+p.subsystem,'Rocket component',p.purpose,'src/data/rocketParts/index.ts');
const result=[...rows.values()].sort((a,b)=>a.type.localeCompare(b.type)||a.topic.localeCompare(b.topic)||a.title.localeCompare(b.title));
fs.writeFileSync('outputs/page-catalog-20261017/pages.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({pages:result.length,types:result.reduce((o,r)=>(o[r.type]=(o[r.type]||0)+1,o),{}),dynamicRoutes:routes.filter(r=>r.path.includes(':')).map(r=>r.path)}));
