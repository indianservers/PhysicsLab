import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';

const pages=fs.readdirSync('src/pages').filter(name=>name.endsWith('.tsx'));
const failures=[];
const buttons=[];
for(const page of pages){
 const text=fs.readFileSync(`src/pages/${page}`,'utf8');
 const source=ts.createSourceFile(page,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 if(/onClick=\{\(\)=>\{\}\}/.test(text))failures.push(`${page}: empty click handler`);
 if(/m!=='Observe'&&setPanel\(m\)/.test(text))failures.push(`${page}: Observe ignores selected state`);
 const visit=node=>{
  if(ts.isJsxAttribute(node)&&node.name.getText(source)==='onClick'&&node.initializer&&ts.isJsxExpression(node.initializer)){
   const expression=node.initializer.expression;
   if(expression&&(ts.isArrowFunction(expression)||ts.isFunctionExpression(expression))&&ts.isBlock(expression.body)&&expression.body.statements.length===0)failures.push(`${page}: empty click callback`);
  }
  if(ts.isJsxOpeningElement(node)||ts.isJsxSelfClosingElement(node)){
   const names=node.attributes.properties.filter(ts.isJsxAttribute).map(attribute=>attribute.name.getText(source));
   if(new Set(names).size!==names.length)failures.push(`${page}: duplicate JSX attributes`);
  }
  if(ts.isJsxElement(node)&&node.openingElement.tagName.getText(source)==='button'){
   const properties=node.openingElement.attributes.properties;
   const names=properties.map(attribute=>attribute.name?.getText(source));
   const submit=properties.some(attribute=>attribute.name?.getText(source)==='type'&&attribute.initializer?.getText(source)==='"submit"');
   if(!submit&&!names.includes('disabled')&&!names.some(name=>name?.startsWith('on'))&&!properties.some(attribute=>ts.isJsxSpreadAttribute(attribute))){
    const entry={page,line:source.getLineAndCharacterOfPosition(node.pos).line+1,text:node.getText(source).slice(0,160)};
    buttons.push(entry);failures.push(`${page}: button has no event handler at line ${entry.line}`);
   }
  }
  ts.forEachChild(node,visit);
 };
 visit(source);
}
const dialog=fs.readFileSync('src/components/MasteryChallengeDialog.tsx','utf8');
const panel=fs.readFileSync('src/components/StudioLearningPanel.tsx','utf8');
assert.ok(dialog.includes("import './mastery-dialog.css'"));
assert.ok(dialog.includes('<StudioLearningPanel'));
for(const mode of ['Observe','Predict','Experiment','Explain','Challenge'])assert.ok(panel.includes(`mode === '${mode}'`),`Missing ${mode} content`);
const css=fs.readFileSync('src/components/mastery-dialog.css','utf8');
assert.ok(/\.mc-backdrop\{position:fixed/.test(css));
const chapters=JSON.parse(fs.readFileSync('src/lib/studioTheoryContent.json','utf8'));
assert.equal(Object.keys(chapters).length,96);
fs.mkdirSync('artifacts/studio-physics-audit',{recursive:true});
fs.writeFileSync('artifacts/studio-physics-audit/page-interactions.json',JSON.stringify({pagesScanned:pages.length,studioChapters:96,learningModes:['Observe','Predict','Experiment','Explain','Challenge'],failures,unhandledButtons:buttons},null,2)+'\n');
for(const failure of failures)console.error(`FAIL ${failure}`);
console.log(`${pages.length} pages scanned; ${failures.length} dead-button/Observe-handler findings; 5 distinct contextual learning modes.`);
if(failures.length)process.exitCode=1;
