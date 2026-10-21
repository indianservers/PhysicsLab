import fs from 'node:fs';
import ts from 'typescript';
const inventory=JSON.parse(fs.readFileSync('artifacts/studio-ux-audit/visual-model-inventory.json','utf8'));
const sceneNames=new Set(['camera','zoom','view','overlays','visibility','layers','bright','light','display','primary','secondary','vectors','flow','tangent','area','equation','trails','values','speed','slow','rate','running','run','scanPhase','time','t','motion','baseAngle','probe','cursor','cell','phase','displacement','charge','steady','fromRest']);
for(const r of inventory){
 let text=fs.readFileSync(r.file,'utf8');if(text.includes('useStudioVisualModel({'))continue;
 const source=ts.createSourceFile(r.file,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const main=source.statements.find(st=>ts.isFunctionDeclaration(st)&&st.modifiers?.some(m=>m.kind===ts.SyntaxKind.DefaultKeyword));
 if(!main)throw Error(r.route+' missing main');
 const setters={};
 for(const st of main.body.statements)if(ts.isVariableStatement(st))for(const declaration of st.declarationList.declarations){
  if(ts.isArrayBindingPattern(declaration.name)&&declaration.name.elements.length===2){const [value,setter]=declaration.name.elements.map(n=>n.getText(source));if(sceneNames.has(value))setters[value]=setter;}
 }
 const updater=r.variables.includes('update')?'update':r.variables.includes('configure')?'configure':'change';
 const ret=main.body.statements.find(ts.isReturnStatement);if(!ret)throw Error(r.route+' missing return');
 const call=`useStudioVisualModel({route:${JSON.stringify(r.route)},input,outputs:{${r.models.join(',')}},apply:${updater},scene:{${Object.keys(setters).join(',')}},sceneSetters:{${Object.entries(setters).map(([k,v])=>k+':'+v).join(',')}}});\n`;
 text=text.slice(0,ret.getStart(source))+call+text.slice(ret.getStart(source));
 // Mark the actual native scene, rather than guessing canvas data from pixels.
 const sceneNodes=[];
 const visit=node=>{if(ts.isJsxOpeningElement(node)){const tag=node.tagName.getText(source);const cls=node.attributes.properties.find(p=>ts.isJsxAttribute(p)&&p.name.getText(source)==='className');if(['section','div'].includes(tag)&&cls&&/(?:stage|apparatus|scene|bench|visual)/i.test(cls.getText(source)))sceneNodes.push(node);}ts.forEachChild(node,visit);};visit(main);
 const native=sceneNodes.find(n=>n.pos>ret.pos)??sceneNodes[0];
 // Offsets above refer to the original source; attach the marker before adding the hook.
 if(native){const original=fs.readFileSync(r.file,'utf8');const markAt=native.end-1;const marked=original.slice(0,markAt)+' data-studio-scene'+original.slice(markAt);text=marked.slice(0,ret.getStart(source))+call+marked.slice(ret.getStart(source));}
 text="import {useStudioVisualModel} from '../lib/studioVisualModel';\n"+text;
 fs.writeFileSync(r.file,text);
 r.modelAdapter={updater,outputs:r.models,scene:Object.keys(setters),nativeScene:!!native};
}
fs.writeFileSync('artifacts/studio-ux-audit/visual-model-inventory.json',JSON.stringify(inventory,null,2));
console.log(`Connected ${inventory.length} real solver/scene adapters.`);
