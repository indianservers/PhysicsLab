export type WaveMode='transverse'|'longitudinal';
/** All lengths and displacements are in metres; UI conversion to cm happens at the boundary. */
export type WaveInput={amplitude:number;frequency:number;speed:number;time:number;mode?:WaveMode};
export const WAVE_DEFAULTS:WaveInput={amplitude:.02,frequency:1.5,speed:.6,time:0,mode:'transverse'};
export function waveAmplitudeLimit(v:Pick<WaveInput,'frequency'|'speed'|'mode'>){return v.mode==='longitudinal'?Math.min(.05,Math.floor(.9*v.speed/(2*Math.PI*v.frequency)*10000)/10000):.05}
export function waveSettings(v:WaveInput):WaveInput{
 const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,Number.isFinite(n)?n:min));
 const frequency=clamp(v.frequency,.5,5),speed=clamp(v.speed,.2,1.5),mode=v.mode==='longitudinal'?'longitudinal':'transverse';
 return{amplitude:clamp(v.amplitude,.005,waveAmplitudeLimit({frequency,speed,mode})),frequency,speed,time:clamp(v.time,0,30),mode};
}
/** Right-traveling nondispersive sinusoidal displacement at equilibrium position x. */
export function waveAt(v:WaveInput,position:number,time=v.time){const k=2*Math.PI*v.frequency/v.speed,omega=2*Math.PI*v.frequency,phase=k*position-omega*time,displacement=v.amplitude*Math.sin(phase);return{displacement,particleVelocity:-omega*v.amplitude*Math.cos(phase),particleAcceleration:-omega*omega*displacement,spatialDerivative:k*v.amplitude*Math.cos(phase),spatialSecondDerivative:-k*k*displacement,k,omega,phase}}
export function waveSolution(v:WaveInput,probe=.6){const a=waveAt(v,probe);return{lambda:v.speed/v.frequency,T:1/v.frequency,x:a.displacement,...a}}
