export type PendulumInput = { length: number; angle: number; gravity: number; damping?: number; mass?: number };
export const PENDULUM_DEFAULTS: PendulumInput = { length: .8, angle: 15, gravity: 9.81, damping: 0, mass: .2 };
const finite = (value: number | undefined, fallback: number) => Number.isFinite(value) ? Number(value) : fallback;
export function pendulumSettings(v: PendulumInput): PendulumInput {
 return { length: Math.max(.2, Math.min(2, finite(v.length,.8))), angle: Math.max(1, Math.min(60, finite(v.angle,15))), gravity: Math.max(1.62, Math.min(24.79, finite(v.gravity,9.81))), damping: Math.max(0, Math.min(.2, finite(v.damping,0))), mass: Math.max(.05, Math.min(1, finite(v.mass,.2))) };
}
export function pendulumSolution(v: PendulumInput) {
 const T = 2 * Math.PI * Math.sqrt(v.length / v.gravity);
 // Exact finite-amplitude period from the arithmetic-geometric mean.
 let a = 1, b = Math.cos(v.angle * Math.PI / 360);
 for (let i=0; i<12; i++) { const next=(a+b)/2; b=Math.sqrt(a*b); a=next; }
 const finiteT=T/a;
 return { T, finiteT, freq: 1/finiteT, energy: v.gravity*v.length*(1-Math.cos(v.angle*Math.PI/180)) };
}
export type PendulumRun = { angle:number; velocity:number; time:number; lastGate:number|null; periods:number[]; cycles:number };
export type PendulumSample = { time:number; angle:number };
export function initialPendulumRun(input:PendulumInput):PendulumRun {
 return { angle:input.angle*Math.PI/180,velocity:0,time:0,lastGate:null,periods:[],cycles:0 };
}
/** RK4 for theta'' = -(g/L) sin(theta) - b theta'; dt is in seconds. */
export function stepPendulum(input:PendulumInput,state:PendulumRun,dt:number):PendulumRun {
 const acceleration=(angle:number,velocity:number)=>-input.gravity/input.length*Math.sin(angle)-(input.damping??0)*velocity;
 const k1x=state.velocity,k1v=acceleration(state.angle,state.velocity);
 const k2x=state.velocity+dt*k1v/2,k2v=acceleration(state.angle+dt*k1x/2,k2x);
 const k3x=state.velocity+dt*k2v/2,k3v=acceleration(state.angle+dt*k2x/2,k3x);
 const k4x=state.velocity+dt*k3v,k4v=acceleration(state.angle+dt*k3x,k4x);
 const angle=state.angle+dt/6*(k1x+2*k2x+2*k3x+k4x),velocity=state.velocity+dt/6*(k1v+2*k2v+2*k3v+k4v);
 const next={...state,angle,velocity,time:state.time+dt};
 // Same-direction crossings measure full periods; interpolate the crossing time.
 if(state.angle<0&&angle>=0&&velocity>0){const crossing=state.time+dt*(-state.angle)/(angle-state.angle);next.lastGate=crossing;if(state.lastGate!==null){next.periods=[...state.periods.slice(-19),crossing-state.lastGate];next.cycles=state.cycles+1;}}
 return next;
}
