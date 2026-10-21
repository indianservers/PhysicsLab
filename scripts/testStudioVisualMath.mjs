import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
async function load(file){const result=await build({entryPoints:[file],bundle:true,write:false,platform:'node',format:'esm'});return import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));}
const {plotDomain,plotPath,plotValue}=await load('src/lib/studioPlotMath.ts');
let checks=0;const check=(value,message)=>{assert.ok(value,message);checks++;};
const tiny=plotDomain([1.38e-23]);check(tiny[0]>0&&tiny[1]<2e-23,'Microscopic SI axes retain their physical scale');
const negative=plotDomain([-12,-6]);check(negative[0]<-12&&negative[1]>-6,'Negative potentials retain signed axes');
check(JSON.stringify(plotDomain([0,-1,100],true))===JSON.stringify(plotDomain([100],true)),'Log domain excludes nonpositive values');
check(plotDomain([]).every(Number.isFinite),'Empty chart has finite bounds');
check(plotValue(null)==='undefined','Undefined physics is not reported as zero');
check(plotValue(0)==='0','Real zero remains a plotted value');
const p=(id,x,y,branch='same')=>({id,x,y,input:{},scene:{},branch});
check(plotPath([p(1,0,1),p(2,1,null),p(3,2,3)],x=>x,y=>y,p=>p.y!==null).match(/M/g).length===2,'Null results break curves');
check(plotPath([p(1,0,1,'real'),p(2,1,-1,'virtual')],x=>x,y=>y,()=>true).match(/M/g).length===2,'Physical branches are not joined through asymptotes');
check(plotPath([p(1,2,3),p(2,1,2)],x=>x,y=>y,()=>true).startsWith('M1.000,2.000'),'Curve samples sort by physical x coordinate');
const spectra=await load('src/lib/atomicSpectraStudio.ts');
for(const element of ['hydrogen','helium'])for(let ni=2;ni<=6;ni++)for(let nf=1;nf<ni;nf++){
 const s=spectra.spectraSolution({element,ni,nf});
 const difference=s.levels.find(n=>n.n===ni).energy-s.levels.find(n=>n.n===nf).energy;
 check(Math.abs(difference-s.energy)<1e-10,'Energy-level diagram matches the existing photon-energy solver');
 check(s.lines.some(line=>line.ni===ni&&Math.abs(line.lambda-s.lambda)<1e-9),'Selected spectral line is generated from the same transition');
}
const gas=await load('src/lib/gasLawsStudio.ts'),density=await load('src/lib/densityPressureStudio.ts');
check(gas.gasSolution(gas.GAS_DEFAULTS).P>100&&gas.gasSolution(gas.GAS_DEFAULTS).P<200,'Gas pressure uses kPa');
check(Math.abs(density.densitySolution(density.DENSITY_DEFAULTS).pressure-2.943)<1e-12,'Hydrostatic pressure uses kPa');
const definitions=JSON.parse(fs.readFileSync('src/lib/studioVisualDefinitions.json','utf8'));
check(Object.keys(definitions).length===96,'Every lab has an explicit dimensional graph definition');
check(Object.values(definitions).every(d=>d.xUnit&&d.yUnit&&!d.xUnit.includes('model')&&!d.yUnit.includes('model')),'No guessed or unlabeled model-unit axes');
const models=JSON.parse(fs.readFileSync('artifacts/studio-physics-audit/results.json','utf8')).labs;
check(models.every(m=>definitions[m.route].solverVersion===createHash('sha256').update(fs.readFileSync(`src/lib/${m.model}.ts`)).digest('hex').slice(0,12)),'Exported solver fingerprints match all 96 production model sources');
check(['/electronics/logic-gates','/modern-physics/atomic-spectra','/modern-physics/nuclear-structure'].every(route=>definitions[route].discrete),'Boolean and quantum/nucleon parameters cannot be interpolated');
fs.writeFileSync('artifacts/studio-ux-audit/visual-math-tests.json',JSON.stringify({status:'pass',checks},null,2));
console.log(`${checks} plot, singularity, dimensional and spectrum assertions passed.`);
