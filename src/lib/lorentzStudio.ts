export type LorentzInput={sign:number;speed:number;B:number};
export const LORENTZ_DEFAULTS:LorentzInput={sign:1,speed:5e6,B:.2};
export const LORENTZ_Q=1.602176634e-19,LORENTZ_MASS=1.67262192595e-27,LORENTZ_CLOCK=1e-7;
export function lorentzSettings(v:LorentzInput):LorentzInput{return{sign:v.sign<0?-1:1,speed:Number.isFinite(v.speed)?Math.max(1e6,Math.min(1e7,v.speed)):5e6,B:Number.isFinite(v.B)?Math.max(.05,Math.min(.5,v.B)):.2}}
export function lorentzSolution(input:LorentzInput){const v=lorentzSettings(input),q=v.sign*LORENTZ_Q,m=LORENTZ_MASS,F=Math.abs(q)*v.speed*v.B,r=m*v.speed/(Math.abs(q)*v.B),T=2*Math.PI*m/(Math.abs(q)*v.B),omega=q*v.B/m;return{...v,q,m,F,r,T,freq:1/T,omega,energy:.5*m*v.speed**2,relativisticRadiusCorrection:1/Math.sqrt(1-(v.speed/299792458)**2)-1}}
export function lorentzState(input:LorentzInput,time:number){const s=lorentzSolution(input),t=Math.max(0,time),phase=s.omega*t,vx=s.speed*Math.cos(phase),vz=-s.speed*Math.sin(phase),x=s.speed*Math.sin(phase)/s.omega,z=-2*s.speed*Math.sin(phase/2)**2/s.omega,fx=s.q*s.B*vz,fz=-s.q*s.B*vx;return{...s,time:t,x,y:0,z,vx,vy:0,vz,fx,fy:0,fz,phase,centerZ:-s.speed/s.omega}}
export function lorentzOrbit(input:LorentzInput,n=181){const s=lorentzSolution(input);return Array.from({length:n},(_,i)=>lorentzState(input,s.T*i/(n-1)))}
