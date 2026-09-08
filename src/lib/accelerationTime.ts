/** Raised-cosine edges make a finite acceleration pulse with finite jerk.
 * widthMs is the FWHM and area-equivalent width; total area is amplitude*width.
 */
export interface AccelerationInput { amplitude:number; widthMs:number; rate:number }
export const ACCELERATION_DEFAULTS:AccelerationInput={amplitude:2.5,widthMs:400,rate:500};
export const ACCELERATION_DURATION=3;
const clamp=(n:number,min:number,max:number,fallback:number)=>Math.max(min,Math.min(max,Number.isFinite(n)?n:fallback));
export function accelerationSettings(raw:AccelerationInput):AccelerationInput{return {amplitude:Math.round(clamp(raw.amplitude,-5,5,2.5)*100)/100,widthMs:Math.round(clamp(raw.widthMs,50,2000,400)),rate:Math.round(clamp(raw.rate,100,2000,500))}}
export function accelerationPulse(raw:AccelerationInput){const input=accelerationSettings(raw),width=input.widthMs/1000,ramp=Math.min(.02,width*.1),start=1.3-width/2,end=1.3+width/2;return {...input,width,ramp,start,end,totalDeltaV:input.amplitude*width}}
function step(u:number,r:number){if(u<=0)return {a:0,j:0,v:0,x:0};if(u>=r)return {a:1,j:0,v:u-r/2,x:u*u/2-r*u/2+r*r/4-r*r/(Math.PI*Math.PI)};const phase=Math.PI*u/r;return {a:(1-Math.cos(phase))/2,j:Math.PI/(2*r)*Math.sin(phase),v:u/2-r/(2*Math.PI)*Math.sin(phase),x:u*u/4+r*r/(2*Math.PI*Math.PI)*(Math.cos(phase)-1)}}
export function accelerationState(raw:AccelerationInput,time:number){const p=accelerationPulse(raw),t=clamp(time,0,ACCELERATION_DURATION,0),rise=step(t-p.start+p.ramp/2,p.ramp),fall=step(t-p.end+p.ramp/2,p.ramp),clean=(n:number)=>Math.abs(n)<1e-12?0:n;return {time:t,a:clean(p.amplitude*(rise.a-fall.a)),j:clean(p.amplitude*(rise.j-fall.j)),v:clean(p.amplitude*(rise.v-fall.v)),x:clean(p.amplitude*(rise.x-fall.x))}}
/** Ideal boxcar accelerometer samples: each value is the mean acceleration in
 * the preceding sample interval. The reported jerk is its backward difference.
 * Integrating these means reconstructs exact velocity at each sample boundary.
 */
export function accelerationSensor(raw:AccelerationInput,time:number){const input=accelerationSettings(raw),index=Math.floor(clamp(time,0,ACCELERATION_DURATION,0)*input.rate+1e-9),t=index/input.rate,dt=1/input.rate,current=accelerationState(input,t),previous=accelerationState(input,t-dt),before=accelerationState(input,t-2*dt),a=(current.v-previous.v)/dt,last=(previous.v-before.v)/dt;return {time:t,a:Math.abs(a)<1e-9?0:a,j:Math.abs(a-last)<1e-9?0:(a-last)/dt,deltaV:current.v}}
export function accelerationSensorSamples(raw:AccelerationInput){const input=accelerationSettings(raw);return Array.from({length:Math.floor(ACCELERATION_DURATION*input.rate)+1},(_,i)=>accelerationSensor(input,i/input.rate))}
