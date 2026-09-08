import {simulateCircularMotion,circularVectors} from '../experiments/circular-motion/circular-motionSimulation';
export type CircularStudioInput={omega:number;radius:number;mass:number};
export const CIRCULAR_STUDIO_DEFAULTS:CircularStudioInput={omega:3,radius:.25,mass:.2};
export const CIRCULAR_INITIAL_TIME=Math.PI/6;
const clamp=(n:number,lo:number,hi:number,fallback:number)=>Math.min(hi,Math.max(lo,Number.isFinite(n)?n:fallback));
export function circularStudioSettings(input:CircularStudioInput):CircularStudioInput{return{omega:Math.round(clamp(input.omega,0,10,3)*10)/10,radius:Math.round(clamp(input.radius,.05,.5,.25)*1000)/1000,mass:Math.round(clamp(input.mass,.05,1,.2)*1000)/1000}}
export function circularStudioSolution(raw:CircularStudioInput){const input=circularStudioSettings(raw),s=simulateCircularMotion({...input,direction:1});return{...s,input,period:input.omega===0?null:s.period}}
export function circularStudioState(raw:CircularStudioInput,seconds:number){const solution=circularStudioSolution(raw),t=Math.max(0,Number.isFinite(seconds)?seconds:0),angle=solution.input.omega*t-Math.PI/2,vectors=circularVectors({...solution.input,direction:1},angle);return{t,angle,...vectors,force:{x:vectors.acceleration.x*solution.input.mass,y:vectors.acceleration.y*solution.input.mass}}}
