import {useEffect,useRef,useState} from 'react';
import {projectileStudioFlight,projectileStudioState,type ProjectileStudioInput} from '../lib/projectileStudio';
export function ProjectileStudioScene({input,time,zoom}:{input:ProjectileStudioInput;time:number;zoom:number}){
 const flight=projectileStudioFlight(input),point=projectileStudioState(input,time),ref=useRef<HTMLDivElement>(null),[width,setWidth]=useState(1264);
 useEffect(()=>{const o=new ResizeObserver(entries=>setWidth(entries[0].contentRect.width));if(ref.current)o.observe(ref.current);return()=>o.disconnect()},[]);
 const mobile=width<600,W=mobile?600:width*470/(ref.current?.clientHeight||470),H=470,ox=mobile?92:160,ground=380,right=W-95,usable=right-ox;
 const span=Math.max(20,flight.rangeM*1.07),sx=usable/span,sy=Math.min(280/Math.max(1,flight.peakM),sx*(mobile?5:2.1));
 const cx=ox+point.x*sx,cy=ground-point.y*sy,tx=ox+flight.rangeM*sx,apexX=ox+flight.rangeM*sx/2,apexY=ground-flight.peakM*sy;
 const x=(v:number)=>ox+v*sx,y=(v:number)=>ground-v*sy;
 const path=flight.points.map((p,i)=>`${i?'L':'M'}${x(input.angle===90?0:p.x)},${y(Math.max(0,p.y))}`).join(' ');
 const step=span>3000?1000:span>1000?500:span>500?100:span>200?50:span>100?25:span>50?10:5,ticks=Array.from({length:Math.floor(span/step)+1},(_,i)=>i*step);
 const tubeScale=Math.min(mobile?100:165,72/Math.max(.25,Math.sin(input.angle*Math.PI/180)))/165;
 const standScale=mobile?.65:1,mountX=-84*tubeScale*Math.cos(input.angle*Math.PI/180)/standScale,mountY=(84*tubeScale*Math.sin(input.angle*Math.PI/180)+8)/standScale;
 const rangeLabelX=tx<ox+180?W-160:Math.min(W-150,tx+12);
 const vectorScale=90/input.speed, vx=flight.vx*vectorScale,vy=flight.vy*vectorScale;
 // Zoom is a uniform camera transform; the disclosed graph scale ratio remains unchanged.
 const camera=zoom===1?'':`translate(${W/2} ${H/2}) scale(${zoom}) translate(${-cx} ${-cy})`;
 return <div ref={ref} className="pjs-scene" aria-label={`Projectile at x ${point.x.toFixed(2)} metres, height ${point.y.toFixed(2)} metres`}><img src="/assets/projectile-studio/field-v2.png" alt=""/><svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Projectile trajectory, initial velocity components and landing range"><defs><radialGradient id="pjs-ball" cx="30%" cy="25%"><stop stopColor="white"/><stop offset=".45" stopColor="#e6edf6"/><stop offset="1" stopColor="#64738b"/></radialGradient><linearGradient id="pjs-steel"><stop stopColor="#101f29"/><stop offset=".4" stopColor="#71828e"/><stop offset=".55" stopColor="#172931"/><stop offset="1" stopColor="#40555f"/></linearGradient>{[['red','#ff604d'],['blue','#04baff'],['green','#36f771']].map(([name,color])=><marker key={name} id={'pjs-'+name} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L7 3.5L0 7Z" fill={color}/></marker>)}</defs><g transform={camera}>
 <path d={path} fill="none" stroke="#68dcff" strokeWidth="2" strokeDasharray="9 8"/>
 <line x1={ox} y1={ground} x2={right+12} y2={ground} stroke="#ffffffa0" strokeDasharray="5 6"/>
 <g transform={`translate(${ox} ${ground})`}><g transform={mobile?'scale(.65)':undefined}><path d={`M-120 74L${mountX} ${mountY}L-20 76M${mountX} ${mountY}L-74 77`} fill="none" stroke="url(#pjs-steel)" strokeWidth="9"/><path d="M-135 79H-20" stroke="#21333b" strokeWidth="8"/><circle cx="-65" cy="75" r="13" fill="#202e35" stroke="#a1b0b7" strokeWidth="3"/><circle cx="-65" cy="75" r="5" fill="#687e88"/></g><g transform={`rotate(${-input.angle}) scale(${tubeScale})`}><image href="/assets/projectile-studio/launch-tube.png" x="-165" y="-28.2" width="168" height="63.06"/></g></g>
 <ellipse cx={tx} cy={ground+3} rx="42" ry="7" fill="#eee" stroke="#5b2929"/><ellipse cx={tx} cy={ground+3} rx="33" ry="5" fill="#c21c2a"/><ellipse cx={tx} cy={ground+3} rx="21" ry="3.5" fill="#fff"/><ellipse cx={tx} cy={ground+3} rx="9" ry="2" fill="#bc1729"/>
 <line x1={apexX} y1={apexY} x2={apexX} y2={ground} stroke="#d8f4ff" strokeDasharray="7 6"/>
 <text x={Math.min(W-170,apexX+10)} y={flight.peakM<.1?230:Math.max(145,apexY+65)} className="pjs-white">Hₘₐₓ<tspan x={Math.min(W-170,apexX+10)} dy="23">{flight.peakM.toFixed(1)} m</tspan></text>
 <text x={rangeLabelX} y={ground-37} className="pjs-white">Range<tspan x={rangeLabelX} dy="21">{flight.rangeM.toFixed(1)} m</tspan></text>
 <g className="pjs-launch-vectors"><line x1={ox} y1={ground} x2={ox+vx} y2={ground} stroke="#04baff" strokeWidth="3" markerEnd="url(#pjs-blue)"/><line x1={ox} y1={ground} x2={ox} y2={ground-vy} stroke="#36f771" strokeWidth="3" markerEnd="url(#pjs-green)"/><line x1={ox} y1={ground} x2={ox+vx} y2={ground-vy} stroke="#ff604d" strokeWidth="3" markerEnd="url(#pjs-red)"/><text x={ox+vx+8} y={ground+18} fill="#3dccff">v₀ₓ = {flight.vx.toFixed(1)} m/s</text><text x={ox+5} y={ground-vy-14} fill="#8fffa9">v₀ᵧ = {flight.vy.toFixed(1)} m/s</text><text x={ox+(vx<20?35:vx+8)} y={ground-vy+(vx<20?15:-3)} fill="white">v₀ = {input.speed.toFixed(1)} m/s</text><text x={ox+26} y={ground-30} fill="white">θ = {input.angle}°</text></g>
 <line x1={ox} y1="420" x2={right} y2="420" stroke="white"/>{ticks.map(v=><g key={v}><line x1={x(v)} y1="415" x2={x(v)} y2="428" stroke="white"/><text x={x(v)} y="446" textAnchor="middle" fill="white">{v}</text></g>)}<text x={right+17} y="446" fill="white">m</text>
 <circle cx={cx} cy={cy} r="7" fill="url(#pjs-ball)" stroke="#dbe7f7" strokeWidth=".5"/>
 </g></svg><div className="pjs-legend"><span><i style={{color:'#ff604d'}}>⟶</i>Launch velocity v₀</span><span><i style={{color:'#04baff'}}>⟶</i>Horizontal v₀ₓ</span><span><i style={{color:'#36f771'}}>⟶</i>Vertical v₀ᵧ</span><span><i style={{color:'#68dcff'}}>┄</i>Trajectory</span></div><small className="pjs-scene-note">Level launch/landing · no drag · vertical scale {(sy/sx).toPrecision(3)}× horizontal{zoom>1?' · camera follows ball':''}</small></div>
}
