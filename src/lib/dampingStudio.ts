import {energySolution} from './energyExchangeStudio';
export type DampingInput={b:number;m:number;x0:number;time:number;k:number};
export const DAMPING_DEFAULTS:DampingInput={b:.8,m:.25,x0:.08,time:0,k:50};
export function dampingSettings(v:DampingInput):DampingInput{const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,Number.isFinite(n)?n:min));return{b:clamp(v.b,0,5),m:clamp(v.m,.05,2),x0:clamp(v.x0,0,.2),time:clamp(v.time,0,25),k:50}}
export function dampingSolution(v:DampingInput){
 const a=energySolution({amplitude:v.x0,mass:v.m,k:v.k,time:v.time,damping:v.b}),w0=a.w,delta=v.b/(2*v.m),discriminant=w0*w0-delta*delta,wd=Math.sqrt(Math.max(0,discriminant)),regime=Math.abs(discriminant)<1e-8?'Critical':discriminant>0?'Underdamped':'Overdamped';
 return{...a,w0,delta,wd,Q:v.b===0?Infinity:Math.sqrt(v.k*v.m)/v.b,regime,envelope:discriminant>1e-8?v.x0*Math.sqrt(1+delta*delta/(wd*wd))*Math.exp(-delta*Math.max(0,v.time)):null};
}
