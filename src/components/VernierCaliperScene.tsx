import { useId, useRef, type PointerEvent } from 'react';
import { vernierState, type VernierInput } from '../lib/vernierCaliper';
export function VernierCaliperScene({ input, zoom, onJaw }: { input: VernierInput; zoom: number; onJaw: (jaw: number) => void }) {
  const s=vernierState(input), id=useId().replace(/:/g,''), svg=useRef<SVGSVGElement>(null), drag=useRef<{x:number;jaw:number}|null>(null), unit=8.5, fixed=170, moving=fixed+s.jaw*unit, zero=fixed+s.raw*unit, width=s.diameter*unit;
  const point=(e:PointerEvent<SVGGElement>)=>{const p=svg.current!.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.current!.getScreenCTM()!.inverse()).x;};
  return <svg className="vnc-instrument" ref={svg} viewBox={`${365-365/zoom} ${365-365/zoom} ${730/zoom} ${730/zoom}`} role="img" aria-label={`Vernier caliper jaw opening ${s.jaw.toFixed(2)} millimeters; ${s.contact?'contact with object':'no contact'}`}>
    <defs><pattern id={`${id}surface`} width="440" height="240" patternUnits="userSpaceOnUse"><image href="/assets/vernier-caliper/brushed-steel.png" width="440" height="240" preserveAspectRatio="none"/></pattern><linearGradient id={`${id}steel`} x2=".2" y2="1"><stop stopColor="#d1d3d2"/><stop offset=".25" stopColor="#9da2a3"/><stop offset=".55" stopColor="#b9bdbb"/><stop offset="1" stopColor="#656b6d"/></linearGradient><linearGradient id={`${id}dark`} x2="0" y2="1"><stop stopColor="#737879"/><stop offset=".5" stopColor="#343a3c"/><stop offset="1" stopColor="#9a9d98"/></linearGradient><linearGradient id={`${id}brass`}><stop stopColor="#675124"/><stop offset=".1" stopColor="#a78d4a"/><stop offset=".28" stopColor="#f6e4a7"/><stop offset=".43" stopColor="#b79c54"/><stop offset=".8" stopColor="#a08c4d"/><stop offset="1" stopColor="#514222"/></linearGradient><filter id={`${id}metal`}><feTurbulence type="fractalNoise" baseFrequency=".02 .8" numOctaves="3" seed="8"/><feColorMatrix type="saturate" values="0"/><feComposite in2="SourceGraphic" operator="in"/><feComponentTransfer><feFuncA type="linear" slope=".18"/></feComponentTransfer><feBlend in2="SourceGraphic" mode="multiply"/></filter></defs>
    <path d="M78 177Q73 152 96 151H128V40l31 37 11 63v48H970v110H170V652l-40-36-48-180z" fill={`url(#${id}surface)`} stroke="#ccd0cf" strokeWidth="1.5" filter={`url(#${id}metal)`}/>
    <path d="M128 40v94h-25" fill="none" stroke="#e8e9e4"/><path d="M151 298H970" stroke="#626968" strokeWidth="3"/>
    {Array.from({length:101},(_,n)=><g key={n} fill="#171d1d"><path d={`M${fixed+n*unit} 298v${n%10===0?-41:n%5===0?-31:-24}`} stroke="#171d1d" strokeWidth="1"/>{n%10===0&&<text x={fixed+n*unit} y="250" textAnchor="middle" fontSize="21">{n}</text>}</g>)}
    {input.objectPresent&&<g aria-label="Brass cylindrical specimen"><rect x={fixed} y="397" width={width} height="225" fill={`url(#${id}brass)`} filter={`url(#${id}metal)`}/><ellipse cx={fixed+width/2} cy="397" rx={width/2} ry="14" fill="#b19a59" stroke="#d8c786"/><path d={`M${fixed} 622q${width/2} 22 ${width} 0`} fill="#665627" stroke="#a68d4d"/></g>}
    <g className="vnc-jaw" role="slider" tabIndex={0} aria-label="Drag caliper jaw" aria-valuemin={input.objectPresent?s.diameter:0} aria-valuemax={50} aria-valuenow={s.jaw} onPointerDown={e=>{drag.current={x:point(e),jaw:s.jaw};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{if(drag.current)onJaw(drag.current.jaw+(point(e)-drag.current.x)/unit);}} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onKeyDown={e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();onJaw(e.key==='Home'?0:e.key==='End'?50:s.jaw+(e.key==='ArrowLeft'?-.02:.02));}}}>
      <path d={`M${moving} 176V141l12-64 31-37v109h56v28z`} fill={`url(#${id}surface)`} stroke="#d2d6d4" filter={`url(#${id}metal)`}/>
      <path d={`M${moving} 292h470v82H${moving+68}l-15 202-53 76V374z`} fill={`url(#${id}surface)`} stroke="#bfc5c1" filter={`url(#${id}metal)`}/>
      <rect x={moving+8} y="155" width="473" height="66" rx="5" fill={`url(#${id}dark)`} stroke="#abb0ac"/><rect x={moving+10} y="156" width="470" height="27" rx="4" fill={`url(#${id}surface)`}/>
      <rect x={moving+177} y="114" width="16" height="40" fill={`url(#${id}surface)`}/><rect x={moving+153} y="91" width="63" height="29" rx="6" fill={`url(#${id}surface)`}/>{Array.from({length:16},(_,n)=><path key={n} d={`M${moving+155+n*3.8} 93l-2 25`} stroke="#454e50" strokeWidth="1.2"/>)}
      <rect x={moving+2} y="299" width="468" height="48" fill="#ced2cf" filter={`url(#${id}metal)`}/>
      {Array.from({length:51},(_,n)=><g key={n}><path d={`M${zero+n*.98*unit} 299v${n%5===0?25:16}`} stroke={n===s.coincidence?'#05a9ef':'#1b2120'} strokeWidth={n===s.coincidence?1.8:1}/>{n%5===0&&<text x={zero+n*.98*unit} y="341" fontSize="13" textAnchor="middle" fill="#172020">{n}</text>}</g>)}
      {[moving+24,moving+444].map(cx=><g key={cx}><circle cx={cx} cy="360" r="8" fill="#3c4141" stroke="#c5cac9"/><path d={`M${cx-4} 356l8 8m-8 0l8-8`} stroke="#a9adab"/></g>)}
    </g>

  </svg>;
}

export function VernierMagnifier({ input }: { input: VernierInput }) {
  const s=vernierState(input), start=Math.max(0,Math.min(38,s.coincidence-6)), unit=36, zero=35-start*.98*unit, mainStart=Math.floor(s.raw+start*.98)-1;
  return <svg className="vnc-magnifier" viewBox="0 0 510 242" role="img" aria-label={`Magnified vernier: division ${s.coincidence} coincides; detail ${start} through ${start+12} of 50`}>
    <defs><linearGradient id="vnc-magnified-metal" x2="0" y2="1"><stop stopColor="#a1a7a8"/><stop offset=".47" stopColor="#d7d9d6"/><stop offset="1" stopColor="#898e8d"/></linearGradient></defs>
    <rect width="510" height="202" fill="url(#vnc-magnified-metal)"/><image href="/assets/vernier-caliper/brushed-steel.png" width="510" height="202" preserveAspectRatio="none" opacity=".65"/>
    {Array.from({length:18},(_,i)=>mainStart+i).map(n=><g key={n} fill="#151b1c"><path d={`M${zero+(n-s.raw)*unit} 113v${n%5===0?-49:-30}`} stroke="#1a2022" strokeWidth="1.5"/>{n%5===0&&<text x={zero+(n-s.raw)*unit} y="55" fontSize="34" textAnchor="middle">{n}</text>}</g>)}
    <path d="M0 114H510" stroke="#303c40"/>
    {Array.from({length:13},(_,i)=>start+i).map(n=><g key={n}><path d={`M${zero+n*.98*unit} 114v38`} stroke="#212a2b"/><text x={zero+n*.98*unit} y="178" textAnchor="middle" fontSize="21" fill="#192324">{n}</text></g>)}
    <path d={`M${zero+s.coincidence*.98*unit} 78v111`} stroke="#36c9ff" strokeWidth="2"/>
    <text x="255" y="225" fontSize="14" fill="#5dceff" textAnchor="middle">Division {s.coincidence} coincides · detail {start}–{start+12} / 50</text>
  </svg>;
}
