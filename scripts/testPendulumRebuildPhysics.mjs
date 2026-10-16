import assert from 'node:assert/strict';
import {buildSync} from 'esbuild';
import {writeFile,mkdir} from 'node:fs/promises';
const code=buildSync({stdin:{contents:"export * from './src/lib/pendulumStudio';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'cjs',write:false}).outputFiles[0].text;
const module={exports:{}};new Function('module','exports',code)(module,module.exports);
const {PENDULUM_DEFAULTS,pendulumSolution,initialPendulumRun,stepPendulum}=module.exports;
const results=[];
const energy=(input,s)=>(input.mass??.2)*(input.length**2*s.velocity**2/2+input.gravity*input.length*(1-Math.cos(s.angle)));
for(const patch of [{},{length:.2,gravity:24.79,angle:60},{length:2,gravity:1.62,angle:60},{angle:1},{angle:45}]){
 const input={...PENDULUM_DEFAULTS,...patch},theory=pendulumSolution(input);let state=initialPendulumRun(input),e0=energy(input,state),drift=0;
 const dt=1/240;
 for(let i=0;i<Math.ceil(theory.finiteT*7/dt);i++){state=stepPendulum(input,state,dt);drift=Math.max(drift,Math.abs(energy(input,state)-e0)/e0);}
 const measured=state.periods.reduce((a,b)=>a+b,0)/state.periods.length;
 assert(Math.abs(measured-theory.finiteT)<2e-5);assert(drift<2e-6);results.push({input,smallAngle:theory.T,finiteAmplitude:theory.finiteT,measured,relativeEnergyDrift:drift});
}
const ratio=pendulumSolution({...PENDULUM_DEFAULTS,length:1.6}).finiteT/pendulumSolution(PENDULUM_DEFAULTS).finiteT;assert(Math.abs(ratio-Math.SQRT2)<1e-12);
let a=initialPendulumRun(PENDULUM_DEFAULTS),b=initialPendulumRun(PENDULUM_DEFAULTS);for(let i=0;i<1000;i++){a=stepPendulum({...PENDULUM_DEFAULTS,mass:.05},a,1/240);b=stepPendulum({...PENDULUM_DEFAULTS,mass:1},b,1/240);}assert.equal(a.angle,b.angle);
let state=initialPendulumRun({...PENDULUM_DEFAULTS,damping:.1}),previous=energy(PENDULUM_DEFAULTS,state);for(let i=0;i<5000;i++){state=stepPendulum({...PENDULUM_DEFAULTS,damping:.1},state,1/240);const e=energy(PENDULUM_DEFAULTS,state);assert(e<=previous+1e-10);previous=e;}
await mkdir('artifacts/physics-studio-audit/pendulum',{recursive:true});await writeFile('artifacts/physics-studio-audit/pendulum/physics.json',JSON.stringify({cases:results,lengthScaling:ratio,massIndependence:true,dampingDissipatesEnergy:true},null,2));console.log('PASS pendulum finite-amplitude periods, energy conservation, length scaling, mass independence and damping');
