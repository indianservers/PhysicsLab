export type CircuitInput={voltage:number;r1:number;r2:number;closed:boolean};
export const CIRCUIT_DEFAULTS:CircuitInput={voltage:6,r1:220,r2:470,closed:true};
export const CIRCUIT_RESISTORS=[100,220,470,1000];
export const CIRCUIT_LAMP_RESISTANCE=47; // ohm: fixed-resistance lamp approximation
export const CIRCUIT_CHARGE_PER_CYCLE=.04; // C per schematic marker circuit traversal
export function circuitSettings(v:CircuitInput):CircuitInput{return{voltage:Number.isFinite(v.voltage)?Math.max(0,Math.min(12,v.voltage)):6,r1:CIRCUIT_RESISTORS.includes(v.r1)?v.r1:220,r2:CIRCUIT_RESISTORS.includes(v.r2)?v.r2:470,closed:Boolean(v.closed)}}
export function circuitSolution(input:CircuitInput){const v=circuitSettings(input),lampR=CIRCUIT_LAMP_RESISTANCE,b1=v.r1+lampR,b2=v.r2+lampR,i1=v.closed?v.voltage/b1:0,i2=v.closed?v.voltage/b2:0,total=i1+i2,pR1=i1*i1*v.r1,pR2=i2*i2*v.r2,pL1=i1*i1*lampR,pL2=i2*i2*lampR,power=v.voltage*total;return{...v,lampR,b1,b2,i1,i2,total,pR1,pR2,pL1,pL2,power,VA:v.voltage,VB:0,VC:v.closed?0:v.voltage,VAB:v.voltage,switchDrop:v.closed?0:v.voltage,vR1:i1*v.r1,vR2:i2*v.r2,vL1:i1*lampR,vL2:i2*lampR,equivalentResistance:v.closed?1/(1/b1+1/b2):Infinity}}
export type CircuitSolution=ReturnType<typeof circuitSolution>;
export type CircuitCharge={q1:number;q2:number};
export function circuitAdvance(charge:CircuitCharge,s:CircuitSolution,dt:number):CircuitCharge{const t=Math.max(0,dt);if(t===0||s.total===0)return charge;return{q1:charge.q1+s.i1*t,q2:charge.q2+s.i2*t}}
export function circuitPhase(charge:number,index=0,count=10){return ((charge/CIRCUIT_CHARGE_PER_CYCLE+index/count)%1+1)%1}
export function circuitBrightness(power:number){const p=Math.max(0,power);return Math.sqrt(p/(p+.01))}
