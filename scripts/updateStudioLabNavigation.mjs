import fs from 'node:fs';
import ts from 'typescript';
const app=fs.readFileSync('src/App.tsx','utf8');
const chapters=JSON.parse(fs.readFileSync('src/lib/studioTheoryContent.json','utf8'));
const imports=new Map([...app.matchAll(/(?:const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\(["'](\.\/pages\/[^"']+)["']\)|import\s+\{?\s*(\w+)\s*\}?\s+from\s+["'](\.\/pages\/[^"']+)["'])/g)].map(m=>[m[1]||m[3],(m[2]||m[4]).replace('./','src/')+'.tsx']));
const results=[];
for(const [route,chapter] of Object.entries(chapters)){
 const tag=app.match(new RegExp(`<Route path="${route}" element=\\{([^\\n]+)`))?.[1];
 const component=tag&&[...imports.keys()].find(name=>tag.includes(`<${name} `)||tag.includes(`<${name}/`));
 const file=imports.get(component);if(!file)throw Error('No source for '+route);
 let text=fs.readFileSync(file,'utf8');
 if(text.includes(`<StudioLabNav studioId="${chapter.studio}"`)){
  results.push({route,file,sidebarReplaced:false,sidebarScoped:true});continue;
 }
 const source=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 let target;
 const visit=(node,inAside=false)=>{
  if(ts.isJsxElement(node)){
   const tag=node.openingElement.tagName.getText(source);
   if(inAside&&tag==='nav'&&!target){target=node;return;}
   inAside=inAside||tag==='aside';
  }
  ts.forEachChild(node,child=>visit(child,inAside));
 };
 visit(source);
 if(target){text=text.slice(0,target.getStart(source))+`<StudioLabNav studioId="${chapter.studio}"/>`+text.slice(target.end);text=`import {StudioLabNav} from '../components/StudioLabNav';\n`+text;}
 // The brand remains a useful return link, scoped to the subject's lab directory.
 text=text.replace(/to=(["'])\/concept-studio\1/g,`to="/concept-studio/${chapter.studio}"`);
 if(text!==fs.readFileSync(file,'utf8'))fs.writeFileSync(file,text);
 results.push({route,file,sidebarReplaced:!!target,sidebarScoped:text.includes(`<StudioLabNav studioId="${chapter.studio}"`)});
}
fs.mkdirSync('artifacts/studio-ux-audit',{recursive:true});
fs.writeFileSync('artifacts/studio-ux-audit/navigation-source.json',JSON.stringify(results,null,2));
console.log(`${results.filter(r=>r.sidebarReplaced).length}/96 lab sidebars scoped to their six labs`);
