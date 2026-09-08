export type EntropyInput={count:number;partition:number;deltaT:number;mixed:boolean};
export const ENTROPY_DEFAULTS:EntropyInput={count:500,partition:.5,deltaT:300,mixed:false};
export function entropySettings(v:EntropyInput){return{count:Math.max(100,Math.min(2000,Math.round(Number(v.count)||100))),partition:Math.max(0,Math.min(1,Number(v.partition)||0)),deltaT:Math.max(0,Math.min(1000,Number(v.deltaT)||0)),mixed:Boolean(v.mixed)}}
export function entropySolution(v:EntropyInput){const n=v.count;const s= v.mixed?2*n*1.380649e-23*Math.log(2)*1e22:0;const t1=300;const t2=t1+v.deltaT;return{N1:Math.round(n*v.partition),N2:Math.round(n*(1-v.partition)),t1,t2,pressureL:98.7*(t1/300),pressureR:197.4*(t2/600),S:s}}

