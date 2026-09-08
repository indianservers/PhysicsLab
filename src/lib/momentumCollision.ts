import {simulateElasticCollision} from '../experiments/elastic-collision/elastic-collisionSimulation';
export type MomentumInput={ratio:number;u1:number;u2:number;e:number};
export const MOMENTUM_DEFAULTS:MomentumInput={ratio:1,u1:.6,u2:0,e:.8};
export const CART_LENGTH=.24, CART_BODY_LENGTH=.18, INITIAL_X1=.3, INITIAL_X2=.6;
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
export function momentumSettings(i:MomentumInput):MomentumInput {return {ratio:clamp(Number.isFinite(i.ratio)?i.ratio:1,.5,5),u1:clamp(Number.isFinite(i.u1)?i.u1:.6,-1,1),u2:clamp(Number.isFinite(i.u2)?i.u2:0,-1,1),e:clamp(Number.isFinite(i.e)?i.e:.8,0,1)}}
export function collisionTrial(raw:MomentumInput){
 const input=momentumSettings(raw),m1=1,m2=input.ratio,closing=input.u1-input.u2;
 const contactTime=closing>0?(INITIAL_X2-INITIAL_X1-CART_LENGTH)/closing:Infinity;
 // A prescribed compliant bumper pulse, not a measured material law. At high
 // approach speeds shorten contact so maximum compression fits the bumpers.
 const duration=.18/Math.max(1,closing/.6),endTime=contactTime+duration;
 const result=simulateElasticCollision({m1,m2,u1:input.u1,u2:input.u2,restitution:input.e});
 const impulse=closing>0?m2*(result.v2-input.u2):0;
 return {input,m1,m2,closing,contactTime,duration,endTime,impulse,result};
}
export type CollisionTrial=ReturnType<typeof collisionTrial>;
export function collisionState(trial:CollisionTrial,time:number){
 const {input,m1,m2,contactTime,duration,impulse}=trial,t=Math.max(0,Number.isFinite(time)?time:0),s=clamp(t-contactTime,0,duration);
 const fraction=(1-Math.cos(Math.PI*s/duration))/2;
 const integratedFraction=(s-duration/Math.PI*Math.sin(Math.PI*s/duration))/2+Math.max(0,t-contactTime-duration);
 const j=impulse*fraction,v1=input.u1-j/m1,v2=input.u2+j/m2;
 const x1=INITIAL_X1+input.u1*t-impulse/m1*integratedFraction,x2=INITIAL_X2+input.u2*t+impulse/m2*integratedFraction;
 const force2=t>contactTime&&t<trial.endTime?impulse*Math.PI/(2*duration)*Math.sin(Math.PI*s/duration):0;
 const kinetic=.5*m1*v1*v1+.5*m2*v2*v2,initialK=.5*m1*input.u1**2+.5*m2*input.u2**2;
 const phase=trial.closing<=0?'No collision':t<contactTime?'Approach':t<trial.endTime?'Contact':'After collision';
 return {time:t,x1,x2,v1,v2,p1:m1*v1,p2:m2*v2,momentum:m1*v1+m2*v2,kinetic,kineticChange:kinetic-initialK,impulse1:-j,impulse2:j,force1:-force2,force2,compression:t>=trial.endTime?trial.closing*duration*(1-input.e)/2:Math.max(0,CART_LENGTH-(x2-x1)),phase};
}
export function collisionForceSamples(trial:CollisionTrial,end=1){
 // Include contact boundaries and the exact peak, even for contact between ticks.
 const times=new Set(Array.from({length:201},(_,k)=>end*k/200));
 for(const t of [trial.contactTime,trial.contactTime+trial.duration/2,trial.endTime])if(t>=0&&t<=end)times.add(t);
 return [...times].sort((a,b)=>a-b).map(t=>collisionState(trial,t));
}
