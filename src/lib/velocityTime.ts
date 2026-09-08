/** One constant-acceleration segment; signed area under v(t) is displacement. */
export interface VelocityInput { v0:number; acceleration:number; duration:number }
export const VELOCITY_DEFAULTS:VelocityInput={v0:.5,acceleration:.8,duration:4};
const finite=(n:number,f:number)=>Number.isFinite(n)?n:f;
export function velocitySettings(input:VelocityInput):VelocityInput{return {v0:Math.max(-2,Math.min(2,finite(input.v0,.5))),acceleration:Math.max(-3,Math.min(3,finite(input.acceleration,.8))),duration:Math.max(.5,Math.min(8,finite(input.duration,4)))}}
export function velocityState(input:VelocityInput,time:number){const s=velocitySettings(input),t=Math.max(0,Math.min(s.duration,finite(time,0))),v=s.v0+s.acceleration*t,displacement=s.v0*t+.5*s.acceleration*t*t;return {time:t,v:Math.abs(v)<1e-12?0:v,displacement:Math.abs(displacement)<1e-12?0:displacement,averageVelocity:t===0?null:s.v0+.5*s.acceleration*t,acceleration:s.acceleration}}
export function velocitySamples(input:VelocityInput){const s=velocitySettings(input),times=Array.from({length:81},(_,i)=>i*s.duration/80),turn=s.acceleration===0?-1:-s.v0/s.acceleration;if(turn>0&&turn<s.duration)times.push(turn);return [...new Set(times)].sort((a,b)=>a-b).map(t=>velocityState(s,t))}
/** Split at zero velocity so positive and negative areas can be rendered separately. */
export function velocityAreas(input:VelocityInput,time:number){const s=velocitySettings(input),end=velocityState(s,time).time,turn=s.acceleration===0?-1:-s.v0/s.acceleration,times=turn>0&&turn<end?[0,turn,end]:[0,end];return times.slice(1).map((t,i)=>{const first=velocityState(s,times[i]),last=velocityState(s,t);return {first,last,area:(first.v+last.v)*(last.time-first.time)/2}})}
