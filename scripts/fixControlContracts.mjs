import ts from 'typescript';
import { readFile,writeFile,readdir,mkdir } from 'node:fs/promises';
import path from 'node:path';
async function files(dir){const entries=await readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?files(path.join(dir,e.name)):e.name.endsWith('.tsx')?[path.join(dir,e.name)]:[]))).flat();}
const results=[];
for(const file of await files('src')){
 if(file.endsWith('NumberInput.tsx'))continue;
 const text=await readFile(file,'utf8'),source=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),edits=[];
 function attrs(node){return node.attributes?.properties.filter(ts.isJsxAttribute)||[];}
 function attr(node,name){return attrs(node).find(a=>a.name.getText(source)===name);}
 function type(node){const a=attr(node,'type');return a?.initializer&&ts.isStringLiteral(a.initializer)?a.initializer.text:'';}
 function walk(node){
  if(ts.isJsxSelfClosingElement(node)&&node.tagName.getText(source)==='input'&&type(node)==='number'){
   let label=node.parent;while(label&&!((ts.isJsxElement(label))&&label.openingElement.tagName.getText(source)==='label'))label=label.parent;
   if(label){const ranges=[];function find(n){if(ts.isJsxSelfClosingElement(n)&&n.tagName.getText(source)==='input'&&type(n)==='range')ranges.push(n);ts.forEachChild(n,find);}find(label);
    if(ranges.length===1){const range=ranges[0],missing=['min','max','step'].filter(name=>!attr(node,name)&&attr(range,name));
     if(missing.length){edits.push({start:node.tagName.getStart(source),end:node.tagName.getEnd(),text:'NumberInput'});edits.push({start:node.attributes.end,end:node.attributes.end,text:' '+missing.map(name=>attr(range,name).getText(source)).join(' ')});results.push({file:file.replaceAll('\\','/'),line:source.getLineAndCharacterOfPosition(node.getStart(source)).line+1,attributes:missing,number:node.getText(source),range:range.getText(source)});}
    }
   }
  }ts.forEachChild(node,walk);
 }walk(source);
 if(edits.length){let updated=text;for(const e of edits.sort((a,b)=>b.start-a.start))updated=updated.slice(0,e.start)+e.text+updated.slice(e.end);let relative=path.relative(path.dirname(file),'src/components/NumberInput').replaceAll('\\','/');if(!relative.startsWith('.'))relative='./'+relative;updated=`import { NumberInput } from "${relative}";\n`+updated;await writeFile(file,updated);}
}
await mkdir('artifacts/additional-issues',{recursive:true});await writeFile('artifacts/additional-issues/control-source-fixes.json',JSON.stringify(results,null,2));console.log(JSON.stringify({sourceControls:results.length,files:new Set(results.map(r=>r.file)).size}));
