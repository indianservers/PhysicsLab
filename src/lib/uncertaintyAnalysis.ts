import { roundUncertainty } from '../experiments/measurement-errors/measurementErrorsSimulation';
export type UncertaintyErrorModel='normal'|'systematic'|'mixed';
export interface UncertaintyInput { count:number;precision:number;model:UncertaintyErrorModel;seed:number;correctBias:boolean }
export const UNCERTAINTY_REFERENCE=66.4;
export const UNCERTAINTY_DEFAULTS:UncertaintyInput={count:10,precision:.5,model:'normal',seed:31,correctBias:false};
export function uncertaintySettings(input:UncertaintyInput){return {...input,count:Math.max(1,Math.min(50,Math.round(input.count))),precision:Math.max(.1,Math.min(1,input.precision))};}
function uniform(seed:number,index:number){let x=(seed+Math.imul(index+1,0x9e3779b9))|0;x=Math.imul(x^(x>>>16),0x21f0aaad);x=Math.imul(x^(x>>>15),0x735a2d97);return (((x^(x>>>15))>>>0)+.5)/4294967296;}
export function uncertaintyReading(input:UncertaintyInput,index:number){
 const s=uncertaintySettings(input),normal=Math.sqrt(-2*Math.log(uniform(s.seed,index*2)))*Math.cos(2*Math.PI*uniform(s.seed,index*2+1)),bias=s.model==='normal'?0:.8,random=s.model==='systematic'?0:.45*normal;
 const raw=Math.round((UNCERTAINTY_REFERENCE+bias+random)*10)/10;
 return {trial:index+1,raw,value:Number((raw-(s.correctBias?bias:0)).toFixed(1)),bias};
}
export type UncertaintyReading=ReturnType<typeof uncertaintyReading>;
export function uncertaintyStatistics(readings:UncertaintyReading[],precision:number){
 const n=readings.length,uB=precision/Math.sqrt(3);if(!n)return {n,mean:null,std:null,sem:null,uB,combined:null,percent:null};
 const mean=readings.reduce((a,r)=>a+r.value,0)/n,std=n>1?Math.sqrt(readings.reduce((a,r)=>a+(r.value-mean)**2,0)/(n-1)):null,sem=std===null?null:std/Math.sqrt(n);
 return {n,mean,std,sem,uB,combined:sem===null?null:Math.hypot(sem,uB),percent:(mean-UNCERTAINTY_REFERENCE)/UNCERTAINTY_REFERENCE*100};
}
export function uncertaintyHistogram(readings:UncertaintyReading[]){
 const values=readings.map(r=>r.value),lo=Math.floor(((values.length?Math.min(...values):66)-.2)*5)/5,hi=Math.ceil(((values.length?Math.max(...values):67)+.2)*5)/5,count=Math.min(10,Math.max(4,Math.ceil(Math.sqrt(values.length)))),width=(hi-lo)/count;
 const bins=Array.from({length:count},(_,i)=>({lo:lo+i*width,hi:lo+(i+1)*width,count:0}));for(const value of values)bins[Math.min(count-1,Math.max(0,Math.floor((value-lo)/width)))].count++;return {lo,hi,bins};
}
export function formatUncertainty(value:number,uncertainty:number){
 if(!Number.isFinite(value)||!Number.isFinite(uncertainty)||uncertainty<1e-9||uncertainty>1e6||Math.abs(value)>1e9)return null;
 const result=roundUncertainty(value,uncertainty);return `${result.value.toFixed(result.decimals)} ± ${result.uncertainty.toFixed(result.decimals)} mL`;
}
