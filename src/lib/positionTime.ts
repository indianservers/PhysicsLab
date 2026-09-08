export type PositionProgram='accelerate-coast-brake'|'uniform'|'accelerating'|'return'|'rest';
export type PositionInput={x0:number;program:PositionProgram;window:number};
export const POSITION_DEFAULTS:PositionInput={x0:.5,program:'accelerate-coast-brake',window:10};
export const POSITION_PROGRAMS:Record<PositionProgram,{label:string;initialVelocity:number;phases:Array<{end:number;a:number}>;description:string}>={
 'accelerate-coast-brake':{label:'Accelerate → Constant → Decelerate',initialVelocity:0,phases:[{end:2,a:.12},{end:6,a:0},{end:8,a:-.12},{end:12,a:0}],description:'0–2 s: +0.12 m/s² · 2–6 s: 0 · 6–8 s: −0.12 m/s² · then rest'},
 uniform:{label:'Constant positive velocity',initialVelocity:.12,phases:[{end:12,a:0}],description:'v = +0.12 m/s throughout'},
 accelerating:{label:'Constant acceleration',initialVelocity:0,phases:[{end:12,a:.02}],description:'a = +0.02 m/s² from rest'},
 return:{label:'Move forward, turn, return',initialVelocity:.24,phases:[{end:2,a:0},{end:6,a:-.12},{end:12,a:0}],description:'0–2 s: v = +0.24 m/s · 2–6 s: a = −0.12 m/s² · then v = −0.24 m/s'},
 rest:{label:'Remain at rest',initialVelocity:0,phases:[{end:12,a:0}],description:'v = 0 m/s throughout'},
};
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
export function positionSettings(raw:PositionInput):PositionInput{return {x0:clamp(Number.isFinite(raw.x0)?raw.x0:.5,-1,2),program:Object.prototype.hasOwnProperty.call(POSITION_PROGRAMS,raw.program)?raw.program:'accelerate-coast-brake',window:clamp(Number.isFinite(raw.window)?raw.window:10,2,12)}}
export function positionState(raw:PositionInput,time:number){const input=positionSettings(raw),program=POSITION_PROGRAMS[input.program],t=clamp(Number.isFinite(time)?time:0,0,input.window);let x=input.x0,v=program.initialVelocity,start=0,a=program.phases[0].a;
 for(const phase of program.phases){const dt=Math.max(0,Math.min(t,phase.end)-start);x+=v*dt+.5*phase.a*dt*dt;v+=phase.a*dt;a=phase.a;if(t<phase.end)break;start=phase.end;}
 if(Math.abs(v)<1e-12)v=0;return {time:t,x,v,a,displacement:x-input.x0};
}
export function positionSamples(raw:PositionInput){const input=positionSettings(raw),program=POSITION_PROGRAMS[input.program],times=new Set(Array.from({length:121},(_,k)=>input.window*k/120));let start=0,v=program.initialVelocity;
 for(const phase of program.phases){if(phase.end<=input.window)times.add(phase.end);if(phase.a!==0){const zero=start-v/phase.a;if(zero>=start&&zero<=Math.min(phase.end,input.window))times.add(zero)}v+=phase.a*(phase.end-start);start=phase.end;}
 return [...times].sort((a,b)=>a-b).map(t=>positionState(input,t));
}
export function positionDifference(input:PositionInput,t1:number,t2:number){const first=positionState(input,t1),second=positionState(input,t2);return {first,second,dx:second.x-first.x,dt:second.time-first.time,averageVelocity:Math.abs(second.time-first.time)>1e-12?(second.x-first.x)/(second.time-first.time):null}}
