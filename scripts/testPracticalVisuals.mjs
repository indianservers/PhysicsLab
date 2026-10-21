import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import ts from 'typescript';
const dir=path.resolve('artifacts/practicals');fs.mkdirSync(dir,{recursive:true});
const modulePath=path.join(dir,'workshop-validation.mjs');
fs.writeFileSync(modulePath,ts.transpile(fs.readFileSync('src/practicals/workshop.ts','utf8'),{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}));
const {makeHelix}=await import(pathToFileURL(modulePath));
const spring=makeHelix(),position=spring.geometry.attributes.position,normal=spring.geometry.attributes.normal,buffer=position.array;
for(const length of [.25,.45,.8,1.22,1.5]){
 spring.update(length);assert.equal(position.array,buffer,'Coil vertex buffers must be reused');
 for(let i=0;i<position.count;i++){assert.ok(Number.isFinite(position.getX(i))&&Number.isFinite(position.getY(i))&&Number.isFinite(position.getZ(i)));assert.ok(Math.abs(Math.hypot(normal.getX(i),normal.getY(i),normal.getZ(i))-1)<1e-5,'Normals must stay normalized');}
 for(const ring of [0,100,300,544]){const f=ring/544,theta=f*Math.PI*34,center=[.079*Math.cos(theta),-f*length,.079*Math.sin(theta)];for(let j=0;j<=10;j++){const i=ring*11+j,d=Math.hypot(position.getX(i)-center[0],position.getY(i)-center[1],position.getZ(i)-center[2]);assert.ok(Math.abs(d-.009)<1e-6,'Wire thickness must remain constant through motion');}}
}
spring.geometry.dispose();console.log('Spring visual geometry: stable buffers, constant wire thickness, normalized normals and finite compression/extension passed.');
