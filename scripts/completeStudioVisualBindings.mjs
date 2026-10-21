import fs from 'node:fs';
import ts from 'typescript';
const records=JSON.parse(fs.readFileSync('artifacts/studio-ux-audit/visual-model-inventory.json','utf8'));
let changed=0;
for(const record of records){
 let text=fs.readFileSync(record.file,'utf8'),source=ts.createSourceFile(record.file,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const main=source.statements.find(n=>ts.isFunctionDeclaration(n)&&n.modifiers?.some(m=>m.kind===ts.SyntaxKind.DefaultKeyword));
 const refs=new Map();
 for(const st of main.body.statements)if(ts.isVariableStatement(st))for(const d of st.declarationList.declarations)if(d.initializer&&ts.isCallExpression(d.initializer)&&d.initializer.expression.getText(source)==='useRef'&&d.initializer.arguments[0]&&ts.isIdentifier(d.initializer.arguments[0]))refs.set(d.initializer.arguments[0].getText(source),d.name.getText(source));
 let hook;const find=n=>{if(ts.isCallExpression(n)&&n.expression.getText(source)==='useStudioVisualModel')hook=n;ts.forEachChild(n,find);};find(main);
 const setters=hook.arguments[0].properties.find(n=>n.name?.getText(source)==='sceneSetters').initializer;
 const edits=[];
 for(const p of setters.properties){
  if(!ts.isIdentifier(p.initializer))continue;
  const key=p.name.getText(source),setter=p.initializer.getText(source);let replacement;
  if(key==='running'&&record.variables.includes('stop')&&record.variables.includes('play'))replacement='(value)=>{if(value){if(!running)play();}else stop();}';
  else if(key==='running'&&record.variables.includes('togglePlay'))replacement='(value)=>{if(value!==running)togglePlay();}';
  else if(key==='time'&&record.variables.includes('setClock'))replacement='setClock';
  else if(key==='time'&&record.variables.includes('chooseTime'))replacement='chooseTime';
  else if(key==='time'&&text.includes('clock.current.time')&&record.variables.includes('stop'))replacement=`(value)=>{stop();clock.current.time=value;${setter}(value);}`;
  else if(refs.has(key)&&['time','t','motion','run'].includes(key))replacement=`(value)=>{${refs.get(key)}.current=value;${setter}(value);}`;
  if(replacement){edits.push({start:p.initializer.getStart(source),end:p.initializer.end,replacement});}
 }
 for(const edit of edits.sort((a,b)=>b.start-a.start))text=text.slice(0,edit.start)+edit.replacement+text.slice(edit.end);
 if(edits.length){fs.writeFileSync(record.file,text);changed++;}
}
console.log(`Connected native playback clocks and integration refs on ${changed} pages.`);
