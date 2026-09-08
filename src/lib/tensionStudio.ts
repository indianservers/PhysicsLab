export type TensionInput={angleA:number;angleB:number;mass:number};
export const TENSION_DEFAULTS={angleA:35,angleB:45,mass:10};
export function tensionSettings(v:TensionInput){return {angleA:Math.max(10,Math.min(80,Number(v.angleA)||0)),angleB:Math.max(10,Math.min(80,Number(v.angleB)||0)),mass:Math.max(1,Math.min(20,Number(v.mass)||1))}}
export function tensionSolution(v:TensionInput){const g=9.81,w=v.mass*g,a=v.angleA*Math.PI/180,b=v.angleB*Math.PI/180;const den=Math.sin(a)*Math.cos(b)+Math.sin(b)*Math.cos(a);const ta=w*Math.cos(b)/den,tb=w*Math.cos(a)/den;return {weight:w,ta,tb,normal:w}}
