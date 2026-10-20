export type FirstLawInput={Q:number;P:number;process:string;work?:number};export const FIRST_DEFAULTS:FirstLawInput={Q:2,P:101.3,process:'isobaric',work:2};
export const FIRST_R=8.31446261815324,FIRST_N=2,FIRST_T0=300;
export function firstSettings(v:FirstLawInput){const c=(x:number,a:number,b:number,d:number)=>Number.isFinite(x)?Math.max(a,Math.min(b,x)):d;return {Q:c(v.Q,-5,5,2),P:c(v.P,50,300,101.3),process:['isobaric','isochoric','isothermal','adiabatic'].includes(v.process)?v.process:'isobaric',work:c(v.work??2,-5,5,2)};}
/** Two moles of monatomic ideal gas, work positive BY the gas. Inputs/outputs kJ, kPa, L, K. */
export function firstSolution(raw:FirstLawInput){const v=firstSettings(raw),Cv=1.5*FIRST_R,Cp=2.5*FIRST_R,V0=FIRST_N*FIRST_R*FIRST_T0/v.P;let Q=v.process==='adiabatic'?0:v.Q,W=0,T=FIRST_T0,V=V0;
if(v.process==='isothermal'){W=Q;V=V0*Math.exp(Q*1000/(FIRST_N*FIRST_R*FIRST_T0));}
else if(v.process==='adiabatic'){W=v.work;T=FIRST_T0-W*1000/(FIRST_N*Cv);V=V0*(FIRST_T0/T)**1.5;}
else if(v.process==='isobaric'){W=Q*FIRST_R/Cp;T=FIRST_T0+Q*1000/(FIRST_N*Cp);V=V0*T/FIRST_T0;}
else T=FIRST_T0+Q*1000/(FIRST_N*Cv);
return{Q,W,dU:Q-W,T,V,pressure:FIRST_N*FIRST_R*T/V,V0};}
