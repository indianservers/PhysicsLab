export type CoupledExcitation='left'|'in-phase'|'out-of-phase';
export type CoupledInput={coupling:number;ratio:number;time:number;excitation?:CoupledExcitation};
export const COUPLED_DEFAULTS:CoupledInput={coupling:4,ratio:1.5,time:0,excitation:'left'};
export const COUPLED_SYSTEM={g:9.81,length:1,mass1:.25,attachment:.35,releaseAngle:10*Math.PI/180};
export function coupledSettings(v:CoupledInput):CoupledInput{const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,Number.isFinite(n)?n:min));return{coupling:clamp(v.coupling,0,10),ratio:clamp(v.ratio,.5,3),time:clamp(v.time,0,20),excitation:['left','in-phase','out-of-phase'].includes(v.excitation??'')?v.excitation:'left'}}
/** Exact normal-mode solution of two equal-length small-angle pendulums, with a spring at distance a below each pivot. */
export function coupledSolution(v:CoupledInput){
 const {g,length:L,mass1:m1,attachment:a,releaseAngle:A}=COUPLED_SYSTEM,m2=m1*v.ratio,M=m1+m2,c=v.coupling*a*a,w1=Math.sqrt(g/L),w2=Math.sqrt(g/L+c/(L*L)*(1/m1+1/m2)),t=Math.max(0,v.time);
 const initial1=v.excitation==='out-of-phase'?A*Math.min(1,v.ratio):A,initial2=v.excitation==='in-phase'?A:v.excitation==='out-of-phase'?-A*Math.min(1,1/v.ratio):0;
 const common=(m1*initial1+m2*initial2)/M,difference=initial1-initial2,q0=common*Math.cos(w1*t),qd=difference*Math.cos(w2*t),v0=-common*w1*Math.sin(w1*t),vd=-difference*w2*Math.sin(w2*t),theta1=q0+m2/M*qd,theta2=q0-m1/M*qd,vel1=v0+m2/M*vd,vel2=v0-m1/M*vd;
 const ke1=.5*m1*L*L*vel1*vel1,ke2=.5*m2*L*L*vel2*vel2,pe1=.5*m1*g*L*theta1*theta1,pe2=.5*m2*g*L*theta2*theta2,springEnergy=.5*c*(theta1-theta2)**2,kinetic=ke1+ke2,potential=pe1+pe2+springEnergy;
 return{w1,w2,beat:w2-w1<1e-12?Infinity:2*Math.PI/(w2-w1),th1:theta1*180/Math.PI,th2:theta2*180/Math.PI,theta1,theta2,vel1,vel2,acc1:-g/L*theta1-c/(m1*L*L)*(theta1-theta2),acc2:-g/L*theta2-c/(m2*L*L)*(theta2-theta1),kinetic,potential,springEnergy,energy:kinetic+potential,energy1:ke1+pe1+springEnergy/2,energy2:ke2+pe2+springEnergy/2,initial1,initial2};
}
