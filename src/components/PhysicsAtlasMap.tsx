import { useEffect, useRef } from 'react';
import { atlasTopics } from '../lib/physicsAtlas';

// Conceptual links terminate behind the apparatus rather than crossing its face.
const connections = [
 'M487 281Q415 207 323 188', 'M555 247L563 127',
 'M616 283Q716 212 804 203', 'M475 308Q341 289 243 347',
 'M638 311Q769 280 862 365', 'M498 373Q439 411 405 463',
 'M612 373Q677 407 729 476',
];
const travelers=connections.map(path=>{
 const [x,y]=path.match(/-?\d+(?:\.\d+)?/g)!.slice(0,2).map(Number);
 let coordinate=0;
 const motion=path.replace(/-?\d+(?:\.\d+)?/g,value=>String(Number(value)-(coordinate++%2?y:x)));
 return {x,y,motion};
});
const labelY: Record<string,number> = {matter:84,motion:69,forces:85,waves:76,fields:81,heat:97,cosmos:94};

function dipoleLoop(size:number,azimuth:number) {
 return Array.from({length:49},(_,i)=>{
  const theta=i*Math.PI/48;
  const radius=size*Math.sin(theta)**3;
  const x=radius*Math.cos(azimuth);
  const y=(1.5*size*Math.sin(theta)**2+12)*Math.cos(theta)+radius*Math.sin(azimuth)*.22;
  return `${i?'L':'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
 }).join(' ');
}

function Pedestal({y=35,width=78}:{y?:number;width?:number}) {
 return <g><path d={`M${-width} ${y}v20a${width} 30 0 0 0 ${width*2} 0V${y}`} fill="url(#atlas-base)" stroke="#12334d"/><ellipse cy={y} rx={width} ry="29" fill="url(#atlas-top)" stroke="#3c688c"/><ellipse cy={y-3} rx={width-9} ry="24" fill="none" stroke="url(#atlas-rim)" strokeWidth="1.5"/><ellipse cy={y-3} rx={width-15} ry="20" fill="none" stroke="#6569b9" opacity=".4"/><path d={`M${-width} ${y+2}a${width} 29 0 0 0 ${width*2} 0`} fill="none" stroke="#315576" opacity=".65"/></g>;
}
function Apparatus({id}:{id:string}) {
 if(id==='matter')return <><Pedestal y={38}/><g className="pa-atom"><g filter="url(#atlas-glow)">{[0,60,120].map(a=><ellipse key={a} cy="-12" rx="75" ry="27" transform={`rotate(${a} 0 -12)`} fill="none" stroke={a===60?'#b981ff':'#40caff'} strokeWidth="1.2"/> )}</g>{[-1,0,1].flatMap(x=>[-1,0,1].map(y=><circle key={`${x}${y}`} cx={x*9+y*3} cy={-12+y*9} r="9" fill={(x+y)%2?'url(#atlas-proton)':'url(#atlas-electron)'}/>))}{[0,1,2,3,4,5].map(n=><circle key={n} cx={Math.cos(n*1.7)*64} cy={Math.sin(n*1.7)*53-12} r="4" fill="url(#atlas-electron)"/>)}</g></>;
 if(id==='motion')return <><Pedestal y={26} width={72}/><path d="M-2 -98L-64 23M-2 -98L64 23" stroke="#16243f" strokeWidth="5"/>{[0,1,2,3,4].map(n=><g key={n} className={n===0?'pa-pendulum':''}><path d={`M${(n-2)*6} -94L${(n-2)*25} -11`} stroke="#5d6b83" strokeWidth="2"/><circle cx={(n-2)*25} cy="-9" r="15" fill="url(#atlas-steel)"/></g>)}</>;
 if(id==='forces')return <><Pedestal y={42} width={70}/><g fill="none" stroke="#2687ff" opacity=".65" filter="url(#atlas-glow)">{[0,1,2,3,4,5].map(n=><path key={n} d={`M-17 29C${-115+n*12} ${50-n*9} ${-120+n*12} ${-139+n*13} 0 -35C${120-n*12} ${-139+n*13} ${115-n*12} ${50-n*9} 17 29`}/>)}</g><image href="/assets/physics-atlas/magnet.png" x="-39" y="-48" width="78" height="91" preserveAspectRatio="none"/></>;
 if(id==='waves')return <><Pedestal y={23} width={101}/><ellipse cy="4" rx="97" ry="38" fill="url(#atlas-water)"/><g fill="none">{[1,2,3,4,5,6].map(n=><g className="pa-ripple" key={n} style={{animationDelay:`${-n*.35}s`}}><ellipse rx={n*15} ry={n*6} cy="4" stroke="#078ede" strokeWidth="5" opacity=".5" filter="url(#atlas-soft)"/><ellipse rx={n*15} ry={n*6} cy="4" stroke="url(#atlas-water-rim)" strokeWidth="2.2"/><ellipse rx={n*15-2} ry={n*6-1} cy="4" stroke="#072d52" strokeWidth="1.2"/></g>)}</g><ellipse cy="4" rx="4" ry="2" fill="#b6faff" filter="url(#atlas-glow)"/></>;
 if(id==='fields')return <><Pedestal y={40} width={84}/><g fill="none" filter="url(#atlas-glow)">{[48,84].flatMap(size=>Array.from({length:18},(_,n)=><path key={`${size}-${n}`} d={dipoleLoop(size,n*Math.PI/9)} stroke={n%3?'#5966f7':'#9690ff'} strokeWidth={n%3?'.65':'1'} opacity={size===84?.65:.75}/>))}</g><ellipse rx="7" ry="26" fill="#558fff" filter="url(#atlas-glow)"/><ellipse rx="3" ry="19" fill="#d3fdff" filter="url(#atlas-glow)"/></>;
 if(id==='heat')return <><Pedestal y={57} width={95}/><image href="/assets/physics-atlas/sun.png" x="-86" y="-99" width="172" height="172"/></>;
 return <><Pedestal y={46} width={109}/><g transform="translate(0 -21) rotate(18)"><image href="/assets/physics-atlas/galaxy.png" x="-109" y="-95" width="218" height="190" preserveAspectRatio="none" filter="url(#atlas-galaxy-tint)"/></g></>;
}

export function PhysicsAtlasMap({running,scale,depth,filter,selected,onSelect}:{running:boolean;scale:number;depth:number;filter:string;selected:string;onSelect:(id:string)=>void}) {
 const svgRef=useRef<SVGSVGElement>(null);
 useEffect(()=>{const svg=svgRef.current;if(!svg)return;if(running)svg.unpauseAnimations();else svg.pauseAnimations();},[running]);
 return <svg ref={svgRef} className={`pa-map ${running?'':'pa-still'}`} viewBox="0 0 1050 742" role="group" aria-label="Interactive physics relationship map">
 <defs>
  <radialGradient id="atlas-nebula"><stop stopColor="#072754" stopOpacity=".8"/><stop offset="1" stopColor="#000716" stopOpacity="0"/></radialGradient>
  <linearGradient id="atlas-base"><stop stopColor="#010713"/><stop offset=".22" stopColor="#0b2038"/><stop offset=".4" stopColor="#030c1b"/><stop offset=".8" stopColor="#01050c"/><stop offset="1" stopColor="#081a2c"/></linearGradient>
  <radialGradient id="atlas-top"><stop stopColor="#071425"/><stop offset=".8" stopColor="#0b1b32"/><stop offset="1" stopColor="#31597e"/></radialGradient>
  <linearGradient id="atlas-rim"><stop stopColor="#468fd4"/><stop offset=".25" stopColor="#71d8ff"/><stop offset=".5" stopColor="#396d9c"/><stop offset=".85" stopColor="#9a6dff"/><stop offset="1" stopColor="#4e71bb"/></linearGradient>
  <radialGradient id="atlas-water"><stop stopColor="#063e66"/><stop offset=".75" stopColor="#021a35"/><stop offset="1" stopColor="#0b5d8f"/></radialGradient>
  <linearGradient id="atlas-water-rim" x1="0" y1="0" x2=".3" y2="1"><stop stopColor="#1879bb"/><stop offset=".3" stopColor="#59ceff"/><stop offset=".6" stopColor="#0964a0"/><stop offset=".9" stopColor="#41c5fd"/><stop offset="1" stopColor="#226493"/></linearGradient>
  <radialGradient id="atlas-steel" cx="30%" cy="25%"><stop stopColor="#daeaff"/><stop offset=".35" stopColor="#7487a6"/><stop offset=".75" stopColor="#26354c"/><stop offset="1" stopColor="#101a2c"/></radialGradient>
  <radialGradient id="atlas-electron" cx="30%" cy="20%"><stop stopColor="#e3f8ff"/><stop offset=".4" stopColor="#75a2ff"/><stop offset="1" stopColor="#5230a7"/></radialGradient>
  <radialGradient id="atlas-proton" cx="30%" cy="20%"><stop stopColor="#fff7b5"/><stop offset=".4" stopColor="#ffb55c"/><stop offset="1" stopColor="#b44353"/></radialGradient>
  <radialGradient id="atlas-sun"><stop stopColor="#5e1909"/><stop offset=".7" stopColor="#b03b09"/><stop offset=".94" stopColor="#ff790d"/><stop offset="1" stopColor="#ffcf6d"/></radialGradient>
  <radialGradient id="atlas-galaxy-core"><stop stopColor="#fffdf1"/><stop offset=".35" stopColor="#e0dbff"/><stop offset="1" stopColor="#9d9cff" stopOpacity="0"/></radialGradient>
  <filter id="atlas-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="atlas-soft"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="atlas-galaxy-tint"><feColorMatrix type="matrix" values=".85 0 0 0 0  0 .95 .05 0 0  .15 .1 .95 0 0  0 0 0 1 0"/></filter>
  <clipPath id="atlas-sun-clip"><circle cy="-7" r="70"/></clipPath>
 </defs>
 <rect width="1050" height="742" fill="#010918"/><image href="/assets/physics-atlas/starfield.png" width="1050" height="742" preserveAspectRatio="xMidYMid slice" opacity=".6"/><ellipse cx="535" cy="380" rx="570" ry="345" fill="url(#atlas-nebula)" opacity=".5"/>
 <g className="pa-map-world" style={{transform:`translate(525px, 365px) scale(${.8+scale*.04}) translate(-525px, -365px)`}}>
 {[1,2,3].map(n=><ellipse key={n} cx="530" cy="390" rx={40+n*155} ry={35+n*90} fill="none" stroke="#14457d" strokeWidth=".7" opacity=".65"/>)}
 {atlasTopics.map((node,i)=><g key={node.id} opacity={filter==='all'||filter===node.id?1:.12}>
  <path id={`atlas-edge-${i}`} d={connections[i]} fill="none" stroke={i===1||i===6?'#9e76ff':'#64cfff'} strokeWidth="1.7" filter="url(#atlas-glow)"/>
  <circle cx={travelers[i].x} cy={travelers[i].y} r="2.5" fill="#c5f9ff" filter="url(#atlas-glow)"><animateMotion path={travelers[i].motion} dur={`${3+i*.3}s`} repeatCount="indefinite"/></circle>
 </g>)}
 {depth>1&&<path d="M127 283Q145 221 190 199M334 174Q400 133 494 125M634 130Q741 142 801 201M939 246Q971 279 974 326M948 477Q932 526 871 563M654 586Q545 605 450 579M270 547Q158 523 131 421" fill="none" stroke="#51cfff" strokeWidth="1.7" filter="url(#atlas-glow)"/>}
 {depth>2&&<g fill="#78cfff" fontSize="14"><text x="422" y="225">energy</text><text x="157" y="265">structure</text><text x="660" y="220">interaction</text><text x="895" y="302">unification</text><text x="890" y="506">scale</text><text x="512" y="578">composition</text><text x="166" y="455">propagation</text></g>}
 {depth>3&&<g stroke="#886bdf" fill="none" opacity=".7"><path d="M260 184Q460 290 355 557M560 118Q805 350 770 608"/><text x="335" y="385" fill="#b7a5f8" stroke="none" fontSize="13">thermal motion</text><text x="733" y="452" fill="#b7a5f8" stroke="none" fontSize="13">orbital motion</text></g>}
 {depth>4&&<g stroke="#3dadcd" fill="none" opacity=".7"><path d="M148 348Q590 195 940 414"/><text x="650" y="273" fill="#89dfff" stroke="none" fontSize="13">electromagnetic waves</text></g>}
 <image href="/assets/physics-atlas/earth.png" x="454" y="225" width="201" height="201"/><text x="555" y="340" textAnchor="middle" fill="#9ce6ff" fontSize="19" fontWeight="600" letterSpacing="1">PHYSICS</text>
 {atlasTopics.map(node=><g key={node.id} transform={`translate(${node.x} ${node.y})`} className={`pa-map-node ${selected===node.id?'selected':''}`} role="button" tabIndex={0} aria-label={`Explore ${node.label}`} aria-pressed={selected===node.id} onClick={()=>onSelect(node.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(node.id);}}} opacity={filter==='all'||filter===node.id?1:.16}>
  <rect className="pa-node-focus" x="-110" y="-100" width="220" height="205" rx="25" fill="transparent"/>
  <Apparatus id={node.id}/><text y={labelY[node.id]} textAnchor="middle" fill="#def0ff" fontSize="16" fontWeight="600" letterSpacing=".6">{node.label.toUpperCase()}</text>
 </g>)}
 </g>
 <g transform="translate(74 77)" stroke="#578fb4" fill="none"><circle r="43" stroke="#163c5a"/><path d="M0 0v-45M0 0l-38 8M0 0l38 8M-15 -9l15-6 15 6v23L0 22l-15-8zM-15-9L0-2l15-7M0-2v24"/><g fill="#73d9ff" stroke="none" fontSize="13"><text x="-4" y="-49">z</text><text x="-51" y="13">x</text><text x="43" y="13">y</text></g></g>
 </svg>;
}
