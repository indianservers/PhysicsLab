export type CurrentInput={voltage:number;diameter:number;temperature:number};
export const CURRENT_DEFAULTS:CurrentInput={voltage:5,diameter:.5,temperature:20};
export const CURRENT_LENGTH=186; // m, effective series wire length, not displayed segment
export const CURRENT_DENSITY=8.5e28;
export const ELECTRON_CHARGE=1.602176634e-19;
export const CURRENT_RHO20=1.68e-8;
export const CURRENT_ALPHA=.0039;
export const CURRENT_DISPLAY_SCALE=1200; // diagram units per metre of mean drift
const clamp=(v:number,min:number,max:number,fallback:number)=>Number.isFinite(v)?Math.max(min,Math.min(max,v)):fallback;
export function currentSettings(v:CurrentInput):CurrentInput{return{voltage:clamp(v.voltage,0,12,5),diameter:clamp(v.diameter,.1,2,.5),temperature:clamp(v.temperature,0,200,20)}}
export function currentSolution(input:CurrentInput){const v=currentSettings(input),rho=CURRENT_RHO20*(1+CURRENT_ALPHA*(v.temperature-20)),L=CURRENT_LENGTH,A=Math.PI*(v.diameter*1e-3/2)**2,R=rho*L/A,I=v.voltage/R,J=I/A,vd=J/(CURRENT_DENSITY*ELECTRON_CHARGE),E=v.voltage/L,power=v.voltage*I;return{...v,rho,L,A,R,I,J,vd,E,power}}
export type CurrentSolution=ReturnType<typeof currentSolution>;
export function currentCurve(input:CurrentInput){const s=currentSolution(input);return Array.from({length:25},(_,i)=>({voltage:i/2,current:(i/2)/s.R}))}
export function currentAdvance(displacement:number,vd:number,seconds:number){return displacement+Math.max(0,seconds)*vd}
export function currentElectronX(index:number,displacement:number,length=3.4){const initial=((index*.618033988749895)%1)*length;return ((initial-displacement*CURRENT_DISPLAY_SCALE)%length+length)%length-length/2}
