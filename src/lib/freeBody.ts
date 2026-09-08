import { G } from '../experiments/balanced-unbalanced-forces/balancedForcesSimulation';
export { G as FREE_BODY_G };
export interface FreeBodyInput { force:number;angle:number;mu:number;mass:number }
export interface FreeBodyMotion { x:number;y:number;vx:number;vy:number;time:number }
export const FREE_BODY_DEFAULTS:FreeBodyInput={force:100,angle:30,mu:.4,mass:2};
export const FREE_BODY_REST:FreeBodyMotion={x:0,y:0,vx:0,vy:0,time:0};
const EPS=1e-10;
export function freeBodySettings(input:FreeBodyInput){const clamp=(v:number,lo:number,hi:number,fallback:number)=>Number.isFinite(v)?Math.max(lo,Math.min(hi,v)):fallback;return {force:clamp(input.force,0,200,100),angle:clamp(input.angle,0,90,30),mu:clamp(input.mu,0,1,.4),mass:clamp(input.mass,.5,50,2)};}
/** One ideal Coulomb coefficient is used for both the static limit and sliding friction. */
export function solveFreeBody(input:FreeBodyInput,motion:FreeBodyMotion=FREE_BODY_REST){
 const s=freeBodySettings(input),theta=s.angle*Math.PI/180,fx=Math.abs(s.force*Math.cos(theta))<EPS?0:s.force*Math.cos(theta),fy=s.force*Math.sin(theta),weight=s.mass*G,contact=motion.y<=EPS&&motion.vy<=EPS&&fy<=weight+EPS,normal=contact?Math.max(0,weight-fy):0,limit=s.mu*normal;
 let friction=0,regime:'static'|'sliding'|'airborne'=contact?'static':'airborne';
 if(contact){if(Math.abs(motion.vx)>EPS){friction=-Math.sign(motion.vx)*limit;regime='sliding';}else if(Math.abs(fx)<=limit+EPS)friction=-fx;else{friction=-Math.sign(fx)*limit;regime='sliding';}}
 const netX=fx+friction,netY=contact?0:fy-weight;
 return {...s,fx,fy,weight,contact,normal,friction,frictionLimit:limit,netX,netY,ax:netX/s.mass,ay:netY/s.mass,regime};
}
function integrate(s:FreeBodyMotion,ax:number,ay:number,dt:number):FreeBodyMotion{return {x:s.x+s.vx*dt+.5*ax*dt*dt,y:s.y+s.vy*dt+.5*ay*dt*dt,vx:s.vx+ax*dt,vy:s.vy+ay*dt,time:s.time+dt};}
function landingTime(y:number,vy:number,ay:number){
 if(Math.abs(ay)<EPS)return vy<0?-y/vy:Infinity;
 const a=.5*ay,disc=vy*vy-4*a*y;if(disc<0)return Infinity;
 const q=-.5*(vy+(vy>=0?1:-1)*Math.sqrt(disc)),roots=q===0?[0]:[q/a,y/q];
 return Math.min(...roots.filter(t=>t>EPS&&vy+ay*t<=EPS),Infinity);
}
/** Event-split constant-force integration: exact flight, zero-restitution landing, then ground friction. */
export function stepFreeBody(input:FreeBodyInput,motion:FreeBodyMotion,dt:number):FreeBodyMotion{
 if(!Number.isFinite(dt)||dt<=0)return {...motion};
 const state={...motion,y:Math.max(0,motion.y),vx:Math.abs(motion.vx)<EPS?0:motion.vx,vy:motion.y<=EPS&&motion.vy<0?0:motion.vy},f=solveFreeBody(input,state);
 if(f.contact){
  const stop=state.vx*f.ax<0?-state.vx/f.ax:Infinity;
  if(stop>EPS&&stop<dt){const at=integrate({...state,y:0,vy:0},f.ax,0,stop);return stepFreeBody(input,{...at,vx:0},dt-stop);}
  return {...integrate({...state,y:0,vy:0},f.ax,0,dt),y:0,vy:0};
 }
 const hit=landingTime(state.y,state.vy,f.ay);
 if(hit<=dt){const at=integrate(state,f.ax,f.ay,hit);return stepFreeBody(input,{...at,y:0,vy:0},dt-hit);}
 const result=integrate(state,f.ax,f.ay,dt);return {...result,y:Math.max(0,result.y)};
}
