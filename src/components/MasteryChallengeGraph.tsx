import { useId } from 'react';
import { masteryPlot, masteryState, type MasteryGraph, type MasteryParameters } from '../lib/masteryChallenge';
export function MasteryChallengeGraph({p,time,kind,target}:{p:MasteryParameters;time:number;kind:MasteryGraph;target:number}) {
 const id=useId().replace(/:/g,''),data=masteryPlot(p,kind,time),low=data[0].x,high=data[data.length-1].x;
 const rawMax=Math.max(kind==='temperature'?Math.max(100,target):kind==='lens'?1:.1,...data.map(v=>v.y));
 const power=10**Math.floor(Math.log10(rawMax)),max=Math.ceil(rawMax/power)*power;
 const x=(v:number)=>54+(v-low)/(high-low)*326,y=(v:number)=>169-v/max*132;
 const path=data.map((v,i)=>`${i?'L':'M'}${x(v.x)} ${y(v.y)}`).join(' '),state=masteryState(p,time);
 const current=kind==='cart'?state.velocity:kind==='circuit'?state.voltage:state.temperature;
 const label=kind==='cart'?'v (m/s)':kind==='circuit'?'V (V)':kind==='lens'?'I (W/m²)':'T (°C)';
 const tick=(v:number)=>Math.abs(v)>=10000?v.toExponential(1):Number(v.toFixed(1)).toString();
 return <svg viewBox="0 0 405 215" className="mc-chart" role="img" aria-label={`${label} versus ${kind==='lens'?'radial position':'time'}`}><defs><pattern id={id+'grid'} x="54" y="37" width="32.6" height="26.4" patternUnits="userSpaceOnUse"><path d="M32.6 0H0V26.4" fill="none" stroke="#234866" strokeWidth=".6"/></pattern><clipPath id={id+'clip'}><rect x="54" y="37" width="326" height="132"/></clipPath></defs><rect x="54" y="37" width="326" height="132" fill={`url(#${id}grid)`} stroke="#315877"/><g clipPath={`url(#${id}clip)`}><path d={path} fill="none" stroke="#408aff" strokeWidth="2.5"/>{kind!=='lens'&&<circle cx={x(time)} cy={y(current)} r="3" fill="#89dfff"/>}{kind==='temperature'&&<path d={`M54 ${y(target)}H380`} stroke="#a3d9ff" strokeDasharray="6 5"/>}</g>{[0,1,2,3,4,5].map(i=><g key={i}><text x="43" y={y(max*i/5)+4} textAnchor="end" fill="#b2d3f0" fontSize="11">{tick(max*i/5)}</text><text x={x(low+(high-low)*i/5)} y="189" textAnchor="middle" fill="#b2d3f0" fontSize="11">{tick(low+(high-low)*i/5)}</text></g>)}{kind==='temperature'&&<text x="378" y={y(target)-7} textAnchor="end" fill="#dcf0ff" fontSize="11">Target {target} °C</text>}<text x="215" y="211" textAnchor="middle" fill="#c1ddf5" fontSize="12">{kind==='lens'?'Position (mm)':'Time (s)'}</text><text transform="translate(12 103) rotate(-90)" textAnchor="middle" fill="#c1ddf5" fontSize="12">{label}</text></svg>;
}
