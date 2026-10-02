import {simulateInclinedPlane} from '../experiments/inclined-plane/inclined-planeSimulation';
export const INCLINE_G=9.81,INCLINE_LENGTH=3,INCLINE_HALF_BLOCK=.225;
export interface InclineInput {angle:number;mass:number;mu:number}
export interface InclineMotion {position:number;velocity:number;time:number}
export interface InclineImpact {time:number;velocity:number;position:number}
export const INCLINE_DEFAULTS:InclineInput={angle:25,mass:2,mu:.3};
export const INCLINE_REST:InclineMotion={position:1,velocity:0,time:0};
const EPS=1e-10,LO=INCLINE_HALF_BLOCK,HI=INCLINE_LENGTH-INCLINE_HALF_BLOCK;
export function inclineSettings(i:InclineInput){const c=(n:number,min:number,max:number,d:number)=>Number.isFinite(n)?Math.min(max,Math.max(min,n)):d;return {angle:c(i.angle,0,60,25),mass:c(i.mass,.5,10,2),mu:c(i.mu,0,1,.3)};}
/** Reuse the established component resolution; this lesson explicitly uses μs = μk. */
export function solveIncline(input:InclineInput,motion:InclineMotion=INCLINE_REST){
 const i=inclineSettings(input),base=simulateInclinedPlane({angleDegrees:i.angle,massKg:i.mass,frictionCoefficient:0,appliedForceN:0,gravity:INCLINE_G});
 const normal=base.normalForceN,downhill=base.parallelWeightN,limit=i.mu*normal,moving=Math.abs(motion.velocity)>EPS;
 const friction=moving?-Math.sign(motion.velocity)*limit:-Math.min(downhill,limit);
 const freeNet=downhill+friction;
 const atBottom=motion.position>=HI-EPS&&motion.velocity>=-EPS&&freeNet>=0,atTop=motion.position<=LO+EPS&&motion.velocity<=EPS&&freeNet<=0;
 const bumper=atBottom||atTop?-freeNet:0,net=freeNet+bumper;
 return {...i,normal,downhill,weight:i.mass*INCLINE_G,friction,limit,bumper,net,acceleration:net/i.mass,regime:atBottom||atTop?'bumper':!moving&&Math.abs(net)<EPS?'static':'sliding',criticalAngle:Math.atan(i.mu)*180/Math.PI};
}
function travel(s:InclineMotion,a:number,t:number):InclineMotion{return {position:s.position+s.velocity*t+.5*a*t*t,velocity:s.velocity+a*t,time:s.time+t};}
function crossing(s:InclineMotion,a:number,end:number){
 if(Math.abs(a)<EPS)return Math.abs(s.velocity)>EPS?(end-s.position)/s.velocity:Infinity;
 const disc=s.velocity*s.velocity+2*a*(end-s.position);if(disc<0)return Infinity;
 const root=Math.sqrt(disc),q=-.5*(s.velocity+(s.velocity>=0?root:-root));
 const roots=q===0?[0]:[q/(.5*a),(s.position-end)/q];
 return Math.min(...roots.filter(t=>t>EPS),Infinity);
}
/** Exact constant-acceleration segments split at speed zero and inelastic end-stop impacts. */
export function stepIncline(input:InclineInput,motion:InclineMotion,dt:number):InclineMotion&{impact?:InclineImpact}{
 if(!Number.isFinite(dt)||dt<=0)return {...motion};
 const s={...motion,position:Math.max(LO,Math.min(HI,motion.position)),velocity:Math.abs(motion.velocity)<EPS?0:motion.velocity};
 if((s.position<=LO+EPS&&s.velocity<0)||(s.position>=HI-EPS&&s.velocity>0))s.velocity=0;
 const f=solveIncline(input,s),a=f.acceleration,stop=s.velocity*a<0?-s.velocity/a:Infinity;
 const low=crossing(s,a,LO),high=crossing(s,a,HI),hit=Math.min(low,high);
 if(stop<dt&&stop<hit){const at=travel(s,a,stop);return stepIncline(input,{...at,velocity:0},dt-stop);}
 if(hit<=dt){const at=travel(s,a,hit),position=low<high?LO:HI;return {...stepIncline(input,{...at,position,velocity:0},dt-hit),impact:{time:at.time,velocity:at.velocity,position}};}
 const out=travel(s,a,dt);return {...out,position:Math.max(LO,Math.min(HI,out.position)),velocity:Math.abs(out.velocity)<EPS?0:out.velocity};
}
export function inclineTrajectory(input:InclineInput,start:InclineMotion=INCLINE_REST,duration=4){
 let s=start;const rows:InclineMotion[]=[s];for(let n=1;n<=200;n++){const next=stepIncline(input,s,duration/200);if(next.impact){rows.push({time:next.impact.time,position:next.impact.position,velocity:next.impact.velocity},{time:next.impact.time,position:next.impact.position,velocity:0});}rows.push(next);s=next;}return rows;
}
