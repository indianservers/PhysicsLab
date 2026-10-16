export type SuperMedium='water'|'membrane';
export type SuperpositionInput={a:number;b:number;fa:number;fb:number;phase:number;x:number;time?:number;medium?:SuperMedium};
export const SUPER_MEDIA={water:{label:'Water Surface',speed:1.5},membrane:{label:'Elastic Membrane',speed:3}};
export const SUPER_SOURCES={a:{x:.5,z:0},b:{x:2.5,z:0},core:.15};
export const SUPER_DEFAULTS:SuperpositionInput={a:.08,b:.08,fa:1.5,fb:1.5,phase:Math.PI/2,x:2.2,time:0,medium:'water'};
export function superSettings(v:SuperpositionInput):SuperpositionInput{const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,Number.isFinite(n)?n:min));return{a:clamp(v.a,0,.2),b:clamp(v.b,0,.2),fa:clamp(v.fa,.5,5),fb:clamp(v.fb,.5,5),phase:clamp(v.phase,0,2*Math.PI),x:clamp(v.x,0,3),time:clamp(v.time??0,0,30),medium:v.medium==='membrane'?'membrane':'water'}}
/** Linear cylindrical far-field approximation with a finite source core; all quantities use SI units. */
export function superField(v:SuperpositionInput,x:number,z=0,time=v.time??0){
 const speed=SUPER_MEDIA[v.medium??'water'].speed,rA=Math.hypot(x-SUPER_SOURCES.a.x,z),rB=Math.hypot(x-SUPER_SOURCES.b.x,z),localA=v.a*Math.sqrt(SUPER_SOURCES.core/Math.max(SUPER_SOURCES.core,rA)),localB=v.b*Math.sqrt(SUPER_SOURCES.core/Math.max(SUPER_SOURCES.core,rB)),phaseA=2*Math.PI*(v.fa*rA/speed-v.fa*time),phaseB=2*Math.PI*(v.fb*rB/speed-v.fb*time)+v.phase,ya=localA*Math.sin(phaseA),yb=localB*Math.sin(phaseB);
 return{ya,yb,y:ya+yb,localA,localB,envelope:Math.sqrt(Math.max(0,localA*localA+localB*localB+2*localA*localB*Math.cos(phaseB-phaseA))),phaseA,phaseB,rA,rB};
}
export function superSolution(v:SuperpositionInput){const speed=SUPER_MEDIA[v.medium??'water'].speed;return{lambdaA:speed/v.fa,lambdaB:speed/v.fb,speed,coherent:Math.abs(v.fa-v.fb)<1e-10,...superField(v,v.x)}}
