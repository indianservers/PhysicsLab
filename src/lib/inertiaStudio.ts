export type InertiaInput={drag:number;speed:number;mass:number};
export const INERTIA_DEFAULTS:InertiaInput={drag:.02,speed:.8,mass:.2};
export function inertiaSettings(v:InertiaInput):InertiaInput{return{drag:Math.round(Math.min(1,Math.max(0,Number.isFinite(v.drag)?v.drag:.02))*100)/100,speed:Math.round(Math.min(2,Math.max(0,Number.isFinite(v.speed)?v.speed:.8))*100)/100,mass:Math.round(Math.min(1,Math.max(.05,Number.isFinite(v.mass)?v.mass:.2))*100)/100}}
export function inertiaSolution(raw:InertiaInput){const input=inertiaSettings(raw),stop=input.drag>0?Math.min(1.5,input.speed/(input.drag*2.2)):null;return{input,stopTime:stop,stopDistance:stop===null?null:input.speed*stop/2,velocityAt:(t:number)=>stop===null?input.speed:Math.max(0,input.speed*(1-t/stop))}}
