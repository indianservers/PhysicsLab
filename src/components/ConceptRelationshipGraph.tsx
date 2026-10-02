import { useEffect, useRef } from 'react';
import { relationshipConcepts, relationshipEdges } from '../lib/conceptRelationships';

export type ConceptPositions=Record<string,{x:number;y:number}>;
const radii:Record<string,number>={force:37,acceleration:48,work:42,energy:42,oscillation:46,waves:43,fields:42,light:38};
export function ConceptRelationshipGraph({selected,strength,layer,zoom,running,positions,onSelect,onMove}:{selected:string;strength:number;layer:string;zoom:number;running:boolean;positions:ConceptPositions;onSelect:(id:string)=>void;onMove:(id:string,x:number,y:number)=>void}) {
 const svg=useRef<SVGSVGElement>(null),drag=useRef<{id:string;pointer:number}|null>(null);
 useEffect(()=>{if(running)svg.current?.unpauseAnimations();else svg.current?.pauseAnimations();},[running]);
 const visible=(id:string)=>{const c=relationshipConcepts.find(c=>c.id===id)!;return layer==='all'||(layer==='hide'?!c.prerequisite:!!c.prerequisite||id===selected);};
 function move(e:React.PointerEvent<SVGSVGElement>){if(!drag.current||e.pointerId!==drag.current.pointer)return;const point=svg.current!.createSVGPoint();point.x=e.clientX;point.y=e.clientY;const local=point.matrixTransform(svg.current!.getScreenCTM()!.inverse());onMove(drag.current.id,Math.max(45,Math.min(885,(local.x-468.5)/zoom+468.5)),Math.max(40,Math.min(540,(local.y-300)/zoom+300)));}
 return <svg ref={svg} className="cr-graph-svg" viewBox="0 0 937 620" role="group" aria-label="Interactive concept relationships" onPointerMove={move} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}>
  <defs>
   <pattern id="cr-grid" width="64" height="66" patternUnits="userSpaceOnUse"><path d="M64 0H0V66" fill="none" stroke="#163b54" strokeWidth=".6"/></pattern>
   <radialGradient id="cr-sky"><stop stopColor="#071e39"/><stop offset="1" stopColor="#020c17"/></radialGradient>
   <radialGradient id="cr-cyan" cx="35%" cy="22%"><stop stopColor="#063c56"/><stop offset=".55" stopColor="#032137"/><stop offset="1" stopColor="#003249"/></radialGradient>
   <radialGradient id="cr-blue" cx="35%" cy="22%"><stop stopColor="#063a76"/><stop offset=".6" stopColor="#061d41"/><stop offset="1" stopColor="#072c64"/></radialGradient>
   <radialGradient id="cr-purple" cx="35%" cy="22%"><stop stopColor="#482389"/><stop offset=".6" stopColor="#17123a"/><stop offset="1" stopColor="#321d66"/></radialGradient>
   <filter id="cr-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
   <filter id="cr-line-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="937" height="620" fill="url(#cr-sky)"/><rect width="937" height="620" fill="url(#cr-grid)"/>
  {Array.from({length:95},(_,i)=><circle key={i} cx={(i*137.23)%937} cy={(i*67.43)%620} r=".55" fill="#5486ab" opacity=".35"/>)}
  <g style={{transform:`translate(468.5px,300px) scale(${zoom}) translate(-468.5px,-300px)`}}>
  {relationshipEdges.filter(e=>visible(e.a)&&visible(e.b)).map((edge,i)=>{
   const a=positions[edge.a],b=positions[edge.b],dx=b.x-a.x,dy=b.y-a.y;
   const relative=edge.kind==='wave'?`M0 0C${dx*.1} ${dy+38} ${dx*.17} ${dy-42} ${dx*.26} ${dy-7}S${dx*.38} ${dy+16} ${dx*.45} ${dy+1}S${dx*.67} ${dy+30} ${dx*.8} ${dy+9}L${dx} ${dy}`:`M0 0L${dx} ${dy}`;
   const tone=i>7?'#8875ff':i<3?'#30caff':'#4897ff';
   return <g key={`${edge.a}-${edge.b}`} transform={`translate(${a.x} ${a.y})`} opacity={.35+.65*strength}>
    <path d={relative} fill="none" stroke={tone} strokeWidth={1+edge.strength*strength*2.1} filter={edge.strength>.8?'url(#cr-line-glow)':undefined}/>
    <circle r="1.5" fill="#b8efff"><animateMotion path={relative} dur={`${3+i*.12}s`} repeatCount="indefinite"/></circle>
   </g>;
  })}
  <g className="cr-map-equations" fill="#a9dcff" fontSize="18" fontFamily="Georgia,serif" fontStyle="italic"><text x="352" y="200">F = m a</text><text x="622" y="239">Wₙₑₜ = ΔK</text><text x="264" y="425">f = 1/T</text><text x="674" y="435">c = λ f</text></g>
  {relationshipConcepts.filter(c=>visible(c.id)).map(c=>{
   const point=positions[c.id],active=c.id===selected,tone=active?'cyan':c.tone,r=radii[c.id]??12,color=tone==='cyan'?'#00aeff':tone==='blue'?'#6b9cff':'#be92ff';
   const onLeft=['velocity','motion','period','frequency'].includes(c.id);
   return <g key={c.id} transform={`translate(${point.x} ${point.y})`} role="button" tabIndex={0} aria-label={`Select ${c.label}`} aria-pressed={active} className="cr-graph-node" onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);drag.current={id:c.id,pointer:e.pointerId};onSelect(c.id);}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(c.id);}if(e.key.startsWith('Arrow')){e.preventDefault();onMove(c.id,Math.max(45,Math.min(885,point.x+(e.key==='ArrowRight'?10:e.key==='ArrowLeft'?-10:0))),Math.max(40,Math.min(540,point.y+(e.key==='ArrowDown'?10:e.key==='ArrowUp'?-10:0))));}}}>
    <circle r={r} fill={`url(#cr-${tone})`} stroke={active?'#00e4f1':color} strokeWidth={c.main?2.7:1.8} filter={c.main?'url(#cr-glow)':undefined}/>
    <circle className="cr-node-focus" r={r+6} fill="transparent"/>
    <text textAnchor={c.main||c.id==='mass'?'middle':onLeft?'end':'start'} x={c.main?0:c.id==='mass'?-7:onLeft?-23:23} y={c.main?5:c.id==='mass'?35:4} fill={c.main?'#f1f5ff':'#a7c7e5'} fontSize={c.main?16:14} fontWeight={c.main?600:400}>{c.label}</text>
   </g>;
  })}
  </g>
 </svg>;
}
