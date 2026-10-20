export type InertiaInput={drag:number;speed:number;mass:number};
export const INERTIA_DEFAULTS:InertiaInput={drag:.02,speed:.8,mass:.2};
export function inertiaSettings(v:InertiaInput):InertiaInput {const c=(n:number,a:number,b:number,d:number)=>Number.isFinite(n)?Math.max(a,Math.min(b,n)):d;return {drag:c(v.drag,0,1,.02),speed:c(v.speed,0,2,.8),mass:c(v.mass,.05,1,.2)};}
/** Constant opposing resistance (N), not viscous drag. Stop at v=0 without reversing. */
export function inertiaSolution(raw:InertiaInput){const input=inertiaSettings(raw),deceleration=input.drag/input.mass,stop=input.speed===0?0:deceleration>0?input.speed/deceleration:null;
return {input,deceleration,stopTime:stop,stopDistance:stop===null?null:input.speed*stop/2,velocityAt:(t:number)=>Math.max(0,input.speed-deceleration*Math.max(0,t)),positionAt:(t:number)=>{const elapsed=Math.max(0,Math.min(t,stop??Infinity));return input.speed*elapsed-.5*deceleration*elapsed*elapsed;}};}
