import { simulateUniformMotion } from '../experiments/uniform-motion/uniform-motionSimulation';
export interface MassTimeInput { massG: number; spacingCm: number; trialCount: number; setup: 'A'|'B'; seed: number }
export const MASS_TIME_DEFAULTS: MassTimeInput = { massG:250, spacingCm:50, trialCount:5, setup:'A', seed:31 };
export const MASS_TIME_GATE_JITTER = .002; // Independent uniform timestamp jitter, seconds; explicit simulated sensor model.
export const MASS_TIME_CLOCK_STEP = .0001;
export function massTimeSettings(input: MassTimeInput) {
  return { ...input, massG:Math.max(50,Math.min(500,input.massG)), spacingCm:Math.max(10,Math.min(100,input.spacingCm)), trialCount:Math.max(1,Math.min(20,Math.round(input.trialCount))), velocity:input.setup==='B'?.8:1.54 };
}
function sample(seed:number,index:number) { let x=(seed+Math.imul(index+1,0x9e3779b9))|0;x=Math.imul(x^(x>>>16),0x21f0aaad);x=Math.imul(x^(x>>>15),0x735a2d97);return ((x^(x>>>15))>>>0)/4294967296; }
export function massTimeTrial(input:MassTimeInput,index:number) {
  const s=massTimeSettings(input),distance=s.spacingCm/100,trueGate1=.2,trueGate2=trueGate1+distance/s.velocity;
  const quantize=(t:number)=>Math.round(t/MASS_TIME_CLOCK_STEP)*MASS_TIME_CLOCK_STEP;
  const gate1=quantize(trueGate1+(sample(s.seed,index*2)*2-1)*MASS_TIME_GATE_JITTER),gate2=quantize(trueGate2+(sample(s.seed,index*2+1)*2-1)*MASS_TIME_GATE_JITTER);
  return { trial:index+1,gate1,gate2,trueGate1,trueGate2,elapsed:Number((gate2-gate1).toFixed(4)),flagDuration:.03/s.velocity };
}
export function massTimeStatistics(trials:ReturnType<typeof massTimeTrial>[]) {
  const n=trials.length;if(!n)return {n,mean:null,std:null,last:null};
  const mean=trials.reduce((sum,t)=>sum+t.elapsed,0)/n;
  return {n,mean,std:n>1?Math.sqrt(trials.reduce((sum,t)=>sum+(t.elapsed-mean)**2,0)/(n-1)):null,last:trials[n-1].elapsed};
}
export function massTimePosition(input:MassTimeInput,time:number) {
  const s=massTimeSettings(input);return simulateUniformMotion({x0:-.2*s.velocity,velocity:s.velocity,time}).finalPosition;
}
export function balanceReading(massG:number,tareG=0,powered=true) {return powered?Math.round((massG-tareG)*100)/100:null;}
