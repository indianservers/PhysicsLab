// Keep useful lab actions while replacing cross-subject navigation links.
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import ts from 'typescript';
const records=JSON.parse(fs.readFileSync('artifacts/studio-ux-audit/navigation-source.json','utf8'));
let restored=0;
for(const {file} of records){
 const current=fs.readFileSync(file,'utf8');if(current.includes('aria-label="Lab tools"'))continue;
 const original=execFileSync('git',['show',`HEAD:${file}`],{encoding:'utf8',maxBuffer:2e6});
 const source=ts.createSourceFile(file,original,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 let nav;
 const visit=(node,inAside=false)=>{if(ts.isJsxElement(node)){const name=node.openingElement.tagName.getText(source);if(inAside&&name==='nav'&&!nav){nav=node;return;}inAside=inAside||name==='aside';}ts.forEachChild(node,n=>visit(n,inAside));};visit(source);
 let utilities=[];
 if(nav)utilities=nav.children.filter(node=>(ts.isJsxElement(node)&&node.openingElement.tagName.getText(source)==='button')||(ts.isJsxExpression(node)&&node.getText(source).includes('<button')&&!node.getText(source).includes('<Link'))).map(node=>node.getText(source));
 else {
  // Three measurement pages put utilities directly in the sidebar.
  let aside;const find=node=>{if(ts.isJsxElement(node)&&node.openingElement.tagName.getText(source)==='aside'&&node.openingElement.getText(source).includes('-sidebar')&&!aside)aside=node;ts.forEachChild(node,find);};find(source);
  if(aside)utilities=aside.children.filter(node=>(ts.isJsxElement(node)&&node.openingElement.tagName.getText(source)==='button')||(ts.isJsxExpression(node)&&node.getText(source).includes('<button')&&!node.getText(source).includes('<Link'))).map(node=>node.getText(source));
 }
 if(utilities.length){fs.writeFileSync(file,current.replace(/<StudioLabNav studioId="[^"]+"\/>/,match=>`${match}<nav aria-label="Lab tools">${utilities.join('')}</nav>`));restored++;}
}
console.log(`Preserved functional sidebar tools on ${restored} lab pages; cross-subject links remain removed.`);
