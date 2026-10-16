export type EnergyExchangeInput = { amplitude: number; mass: number; k: number; time: number; damping?: number };
export const ENERGY_DEFAULTS: EnergyExchangeInput = { amplitude: .2, mass: 1, k: 50, time: 0, damping: 0 };
export function energySettings(v: EnergyExchangeInput): EnergyExchangeInput {
 const clamp = (value:number,min:number,max:number) => Math.max(min,Math.min(max,Number.isFinite(value)?value:min));
 return { amplitude:clamp(v.amplitude,.05,.3), mass:clamp(v.mass,.1,2), k:clamp(v.k,10,200), time:clamp(v.time,0,10), damping:clamp(v.damping??0,0,2) };
}
/** Exact viscously damped oscillator, released at x=A with v=0. */
export function energySolution(v: EnergyExchangeInput) {
 const w=Math.sqrt(v.k/v.mass),alpha=(v.damping??0)/(2*v.mass),delta=w*w-alpha*alpha,t=Math.max(0,v.time);
 let x:number,vel:number;
 if(delta>1e-10){const wd=Math.sqrt(delta),decay=Math.exp(-alpha*t);x=v.amplitude*decay*(Math.cos(wd*t)+alpha/wd*Math.sin(wd*t));vel=-v.amplitude*decay*w*w/wd*Math.sin(wd*t);}
 else if(delta < -1e-10){const q=Math.sqrt(-delta),r1=-alpha+q,r2=-alpha-q,c1=-r2/(r1-r2)*v.amplitude,c2=r1/(r1-r2)*v.amplitude;x=c1*Math.exp(r1*t)+c2*Math.exp(r2*t);vel=r1*c1*Math.exp(r1*t)+r2*c2*Math.exp(r2*t);}
 else {const decay=Math.exp(-alpha*t);x=v.amplitude*(1+alpha*t)*decay;vel=-v.amplitude*alpha*alpha*t*decay;}
 const ke=.5*v.mass*vel*vel,pe=.5*v.k*x*x,total=ke+pe,initial=.5*v.k*v.amplitude*v.amplitude;
 return { w,T:2*Math.PI/w,x,vel,acc:-(v.k*x+(v.damping??0)*vel)/v.mass,ke,pe,total,initial,lost:Math.max(0,initial-total),phase:(w*t)%(2*Math.PI),dampedPeriod:delta>1e-10?2*Math.PI/Math.sqrt(delta):null };
}
