export const ATWOOD_G=9.81,ATWOOD_RADIUS=.05,ATWOOD_TRAVEL=.08;
export interface AtwoodInput {massA:number;massB:number;inertia:number}
export interface AtwoodMotion {q:number;velocity:number;time:number;braked:boolean;dissipated:number}
export const ATWOOD_DEFAULTS:AtwoodInput={massA:1,massB:1.5,inertia:.01};
export const ATWOOD_REST:AtwoodMotion={q:0,velocity:0,time:0,braked:false,dissipated:0};
export function atwoodSettings(i:AtwoodInput){const clamp=(n:number,a:number,b:number,d:number)=>Number.isFinite(n)?Math.max(a,Math.min(b,n)):d;return {massA:clamp(i.massA,.1,5,1),massB:clamp(i.massB,.1,5,1.5),inertia:clamp(i.inertia,0,.1,.01)};}
/** q and v are positive with B down, A up, and clockwise rotation. */
export function solveAtwood(input:AtwoodInput,motion:AtwoodMotion=ATWOOD_REST){
 const i=atwoodSettings(input),effectiveMass=i.massA+i.massB+i.inertia/ATWOOD_RADIUS**2,freeAcceleration=(i.massB-i.massA)*ATWOOD_G/effectiveMass,acceleration=motion.braked?0:freeAcceleration,velocity=motion.braked?0:motion.velocity;
 const tensionA=i.massA*(ATWOOD_G+acceleration),tensionB=i.massB*(ATWOOD_G-acceleration),omega=velocity/ATWOOD_RADIUS,alpha=acceleration/ATWOOD_RADIUS,translation=.5*(i.massA+i.massB)*velocity**2,rotation=.5*i.inertia*omega**2,potential=(i.massA-i.massB)*ATWOOD_G*motion.q;
 return {...i,effectiveMass,freeAcceleration,acceleration,tensionA,tensionB,omega,alpha,angle:motion.q/ATWOOD_RADIUS,translation,rotation,potential,kinetic:translation+rotation,totalEnergy:translation+rotation+potential+motion.dissipated,brakeTorque:motion.braked?-(tensionB-tensionA)*ATWOOD_RADIUS:0};
}
function hitTime(q:number,v:number,a:number,target:number){
 if(Math.abs(a)<1e-12)return Math.abs(v)>1e-12?(target-q)/v:Infinity;
 const d=v*v+2*a*(target-q);if(d<0)return Infinity;
 const root=Math.sqrt(d),z=-.5*(v+(v>=0?root:-root));
 const roots=z===0?[0]:[z/(.5*a),(q-target)/z];return Math.min(...roots.filter(t=>t>1e-10),Infinity);
}
/** An automatic zero-restitution axle brake engages at either ±8 cm travel limit. */
export function stepAtwood(input:AtwoodInput,motion:AtwoodMotion,dt:number):AtwoodMotion{
 if(!Number.isFinite(dt)||dt<=0)return {...motion};
 const s={...motion,q:Math.max(-ATWOOD_TRAVEL,Math.min(ATWOOD_TRAVEL,motion.q))};
 if(s.braked)return {...s,velocity:0,time:s.time+dt};
 const f=solveAtwood(input,s),a=f.acceleration;
 const outward=Math.abs(s.q)>=ATWOOD_TRAVEL-1e-12&&(s.q*s.velocity>0||(Math.abs(s.velocity)<1e-12&&s.q*a>0));
 const lo=hitTime(s.q,s.velocity,a,-ATWOOD_TRAVEL),hi=hitTime(s.q,s.velocity,a,ATWOOD_TRAVEL),hit=outward?0:Math.min(lo,hi);
 if(hit<=dt){const v=s.velocity+a*hit,q=outward?s.q:lo<hi?-ATWOOD_TRAVEL:ATWOOD_TRAVEL;return {q,velocity:0,time:s.time+dt,braked:true,dissipated:s.dissipated+.5*f.effectiveMass*v*v};}
 return {...s,q:s.q+s.velocity*dt+.5*a*dt*dt,velocity:s.velocity+a*dt,time:s.time+dt};
}
