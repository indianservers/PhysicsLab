/** SI internally: metres, seconds and radians. */
export type InterferenceInput={distance:number;frequency:number;phase:number;probe:number;probeZ?:number;time?:number;medium?:'water'|'membrane'};
export const INTERFERENCE_MEDIA={water:{name:'Water Waves',speed:.996},membrane:{name:'Membrane Waves',speed:1.5}};
export const INTERFERENCE_DEFAULTS:InterferenceInput={distance:.08,frequency:12,phase:0,probe:.12,probeZ:.12,time:0,medium:'water'};
export const INTERFERENCE_AMPLITUDE=.0015;
export function interferenceSettings(v:InterferenceInput):InterferenceInput{const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,Number.isFinite(n)?n:min));return{distance:clamp(v.distance,.02,.2),frequency:clamp(v.frequency,5,30),phase:clamp(v.phase,-Math.PI,Math.PI),probe:clamp(v.probe,0,.2),probeZ:clamp(v.probeZ??.12,.025,.155),time:clamp(v.time??0,0,30),medium:v.medium==='membrane'?'membrane':'water'}}
/** Ideal equal-amplitude coherent circular phase fronts; geometric spreading and dispersion omitted. */
export function interferenceField(v:InterferenceInput,x:number,z:number,time=v.time??0){const speed=INTERFERENCE_MEDIA[v.medium??'water'].speed,lambda=speed/v.frequency,r1=Math.hypot(x-(.1-v.distance/2),z),r2=Math.hypot(x-(.1+v.distance/2),z),signedDr=r2-r1,phaseDifference=2*Math.PI*signedDr/lambda+v.phase,omega=2*Math.PI*v.frequency,y1=INTERFERENCE_AMPLITUDE*Math.sin(2*Math.PI*r1/lambda-omega*time),y2=INTERFERENCE_AMPLITUDE*Math.sin(2*Math.PI*r2/lambda-omega*time+v.phase),I=Math.cos(phaseDifference/2)**2;return{speed,lambda,r1,r2,signedDr,dr:Math.abs(signedDr),phaseDifference,I,y1,y2,y:y1+y2}}
export function interferenceSolution(v:InterferenceInput){return interferenceField(v,v.probe,v.probeZ??.12)}
