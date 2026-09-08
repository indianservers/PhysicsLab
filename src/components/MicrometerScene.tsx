import { useId, useRef, type PointerEvent } from 'react';
import { micrometerState, type MicrometerInput } from '../lib/micrometer';

export function MicrometerScene({ input, zoom=1, onTurns }: { input:MicrometerInput; zoom?:number; onTurns?:(turns:number)=>void }) {
  const s=micrometerState(input),id=useId().replace(/:/g,''),drag=useRef<{y:number;turns:number}|null>(null);
  const unit=30,axis=175,anvil=180,tip=anvil+s.opening*unit,edge=390+s.raw*unit;
  const down=(e:PointerEvent<SVGGElement>)=>{if(!onTurns)return;drag.current={y:e.clientY,turns:s.turns};e.currentTarget.setPointerCapture(e.pointerId);};
  return <svg className="mcr-instrument" viewBox={`${450-450/zoom} ${280-280/zoom} ${900/zoom} ${560/zoom}`} role="img" aria-label={`Micrometer opening ${s.opening.toFixed(2)} millimeters; sleeve ${s.sleeve.toFixed(2)}, thimble division ${s.divisions}`}>
    <defs>
      <pattern id={`${id}enamel`} width="300" height="300" patternUnits="userSpaceOnUse"><image href="/assets/micrometer/hammered-enamel.png" width="300" height="300" preserveAspectRatio="none"/></pattern>
      <pattern id={`${id}steel`} width="440" height="240" patternUnits="userSpaceOnUse"><image href="/assets/vernier-caliper/brushed-steel.png" width="440" height="240" preserveAspectRatio="none"/></pattern>
      <linearGradient id={`${id}shaft`} x2="0" y2="1"><stop stopColor="#555c61"/><stop offset=".18" stopColor="#bcc1c4"/><stop offset=".43" stopColor="#fafbf6"/><stop offset=".57" stopColor="#858e94"/><stop offset=".82" stopColor="#333e45"/><stop offset="1" stopColor="#747c80"/></linearGradient>
      <linearGradient id={`${id}cast`}><stop stopColor="#102536"/><stop offset=".45" stopColor="#3a5263"/><stop offset=".8" stopColor="#182c3d"/><stop offset="1" stopColor="#091a27"/></linearGradient>
      <linearGradient id={`${id}copper`}><stop stopColor="#61351f"/><stop offset=".42" stopColor="#e8b882"/><stop offset=".65" stopColor="#b36c37"/><stop offset="1" stopColor="#57311d"/></linearGradient>
      <filter id={`${id}rough`}><feTurbulence baseFrequency=".65" numOctaves="3" seed="12"/><feColorMatrix type="saturate" values="0"/><feComposite in2="SourceGraphic" operator="in"/><feComponentTransfer><feFuncA type="linear" slope=".4"/></feComponentTransfer><feBlend in2="SourceGraphic" mode="soft-light"/></filter>
      <clipPath id={`${id}knurlclip`}><rect x={edge+172} y="90" width="115" height="180" rx="15"/></clipPath>
    </defs>
    <ellipse cx="203" cy="513" rx="150" ry="20" fill="#071017" opacity=".8"/>
    <ellipse cx="202" cy="503" rx="127" ry="20" fill={`url(#${id}shaft)`}/><rect x="163" y="461" width="76" height="37" fill={`url(#${id}shaft)`}/><ellipse cx="201" cy="491" rx="58" ry="13" fill={`url(#${id}steel)`}/>
    <path d="M96 145Q88 115 124 115h28v100q-37 81-28 118 10 61 74 66 78 5 101-47V132q0-24 24-24h38q24 0 24 28v152q20 140-55 177-111 64-224-17-72-58-37-178z" fill={`url(#${id}enamel)`} stroke="#6b8293" strokeWidth="2"/>
    <path d="M119 393q76 49 155 7 39 16 33 61-86 69-173 9-31-24-15-77z" fill="#101a21" stroke="#5d6a70"/>
    <text x="213" y="430" textAnchor="middle" fontSize="23" fill="#a9b6bf">0 – 25 mm</text><text x="213" y="460" textAnchor="middle" fontSize="20" fill="#a9b6bf">0.01 mm</text>
    <rect x="107" y={axis-19} width={anvil-107} height="38" rx="3" fill={`url(#${id}shaft)`}/><path d={`M${anvil} ${axis-19}v38`} stroke="#d3d5cf" strokeWidth="2"/>
    {input.wirePresent&&<rect x={anvil} y="20" width={s.wire*unit} height="264" fill={`url(#${id}copper)`} stroke="#d19b67" strokeWidth=".6"/>}
    <rect x={tip} y={axis-16} width={390-tip} height="32" fill={`url(#${id}shaft)`}/><path d={`M${tip} ${axis-16}v32`} stroke="#e1e5df" strokeWidth="2"/>
    <rect x="365" y="125" width={Math.max(1,edge-365)} height="105" fill={`url(#${id}steel)`}/><path d={`M365 ${axis}H${edge}`} stroke="#101e26"/>
    {Array.from({length:7},(_,n)=>n*.5-.5).filter(mm=>390+mm*unit<=edge).map(mm=><g key={mm}><path d={`M${390+mm*unit} ${axis}v${Number.isInteger(mm)?-24:20}`} stroke="#12232c"/>{Number.isInteger(mm)&&<text x={390+mm*unit} y={axis-31} textAnchor="middle" fontSize="13" fill="#15242c">{mm}</text>}</g>)}
    <circle cx="329" cy="259" r="22" fill={`url(#${id}shaft)`} stroke="#091621" strokeWidth="3"/><path d="M317 248l23 22m-24 0l24-23" stroke="#1e2b32" strokeWidth="4"/><path d="M337 274l24 47-13 7-26-49" fill={`url(#${id}steel)`} stroke="#75828a"/>
    <g className={onTurns?'mcr-thimble':undefined} role={onTurns?'slider':undefined} tabIndex={onTurns?0:undefined} aria-label={onTurns?'Rotate micrometer thimble':undefined} aria-valuenow={onTurns?s.turns:undefined} aria-valuemin={onTurns?(input.wirePresent?s.wire/.5:0):undefined} aria-valuemax={onTurns?4:undefined} onPointerDown={down} onPointerMove={e=>{if(drag.current)onTurns?.(drag.current.turns-(e.clientY-drag.current.y)/120);}} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onKeyDown={e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();onTurns?.(e.key==='Home'?0:e.key==='End'?4:s.turns+(e.key==='ArrowLeft'?-.02:.02));}}}>
      <path d={`M${edge} 125l47-31h145v176H${edge+47}l-47-40z`} fill={`url(#${id}steel)`} stroke="#9da9af"/>
      {Array.from({length:50},(_,n)=>{const delta=((n-s.divisions+75)%50)-25,angle=delta*Math.PI/25,y=axis+Math.sin(angle)*77;if(Math.cos(angle)<=.1)return null;return <g key={n}><path d={`M${edge+2} ${y}h${n%5===0?43:24}`} stroke="#25303a" strokeWidth="1"/>{n%5===0&&<text x={edge+61} y={y+6} fontSize="19" fill="#111f2a">{n}</text>}</g>;})}
      <rect x={edge+172} y="90" width="115" height="180" rx="15" fill={`url(#${id}shaft)`} stroke="#a4b0b5"/>
      <g clipPath={`url(#${id}knurlclip)`}>{Array.from({length:65},(_,n)=><g key={n}><path d={`M${edge+125+n*5} ${75+s.divisions*.3}l-75 215`} stroke="#c9d0d0" strokeWidth="1.5"/><path d={`M${edge+100+n*5} 75l90 215`} stroke="#27343d" strokeWidth="2"/></g>)}</g>
      <rect x={edge+287} y="151" width="39" height="48" fill={`url(#${id}shaft)`}/><rect x={edge+326} y="130" width="66" height="90" rx="12" fill={`url(#${id}shaft)`} stroke="#9ba7aa"/>{Array.from({length:14},(_,n)=><path key={n} d={`M${edge+330+n*4} 133v83`} stroke="#bec9cc" opacity=".6"/>)}
    </g>

  </svg>;
}
