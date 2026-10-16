export type ResonanceInput={frequency:number;drive:number;b:number;mass:number;k:number};
export const RESONANCE_DEFAULTS:ResonanceInput={frequency:2.2,drive:1,b:.5,mass:.25,k:40};
export function resonanceSettings(v:ResonanceInput):ResonanceInput {const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,Number.isFinite(n)?n:min));return{frequency:clamp(v.frequency,.1,5),drive:clamp(v.drive,0,5),b:clamp(v.b,0,2),mass:.25,k:40}}
export function resonanceSolution(v:ResonanceInput){
 const w=2*Math.PI*v.frequency,w0=Math.sqrt(v.k/v.mass),alpha=v.b/(2*v.mass),detuning=v.k-v.mass*w*w,den=Math.hypot(detuning,v.b*w),singular=v.b===0&&Math.abs(detuning)<1e-10&&v.drive>0;
 const amp=v.drive===0?0:singular?Infinity:v.drive/den,phase=v.drive===0?0:singular?null:-Math.atan2(v.b*w,detuning)*180/Math.PI,fr=Math.sqrt(Math.max(0,w0*w0-2*alpha*alpha))/(2*Math.PI),Q=v.b===0?Infinity:v.mass*w0/v.b;
 const split=2*alpha*Math.sqrt(Math.max(0,w0*w0-alpha*alpha)),center=w0*w0-2*alpha*alpha,lower=center-split,upper=center+split;
 const bandwidth=v.b===0?0:lower>=0?(Math.sqrt(upper)-Math.sqrt(lower))/(2*Math.PI):null;
 const peak=v.drive===0?0:v.b===0?Infinity:v.drive/(v.b*Math.sqrt(w0*w0-alpha*alpha));
 return{w,w0,alpha,amp,phase,fr,Q,bandwidth,peak,singular};
}
/** Exact response to F0 cos(wt). The optional transient satisfies x(0)=v(0)=0. */
export function resonanceMotion(v:ResonanceInput,time:number,fromRest=false){
 const s=resonanceSolution(v),t=Math.max(0,time);let x=0,vel=0;
 if(s.singular){const c=v.drive/(2*v.mass*s.w);x=c*t*Math.sin(s.w*t);vel=c*(Math.sin(s.w*t)+s.w*t*Math.cos(s.w*t));}
 else{const lag=(s.phase??0)*Math.PI/180;x=s.amp*Math.cos(s.w*t+lag);vel=-s.amp*s.w*Math.sin(s.w*t+lag);
 if(fromRest){const wd=Math.sqrt(s.w0*s.w0-s.alpha*s.alpha),c=-s.amp*Math.cos(lag),vp=-s.amp*s.w*Math.sin(lag),d=(-vp+s.alpha*c)/wd,co=Math.cos(wd*t),si=Math.sin(wd*t),decay=Math.exp(-s.alpha*t);x+=decay*(c*co+d*si);vel+=decay*((-s.alpha*c+wd*d)*co+(-s.alpha*d-wd*c)*si)}}
 const force=v.drive*Math.cos(s.w*t),acc=(force-v.b*vel-v.k*x)/v.mass;
 return{x,vel,acc,force,energy:.5*v.mass*vel*vel+.5*v.k*x*x};
}
