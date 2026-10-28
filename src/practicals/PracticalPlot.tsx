import {useId,useRef,useState} from 'react';
import {plotDomain,plotPath,plotValue,type PlotPoint} from '../lib/studioPlot';
import {downloadBlob} from '../physics/opticsWorkspace';

type Pair=[number,number];
type Props={title:string;xLabel:string;yLabel:string;points:Pair[];color?:string;secondary?:Pair[];cursor?:number;onInspect?:(p:Pair)=>void;scatter?:boolean};
/** Native practical charts share the solver samples used by the apparatus. */
export function PracticalPlot({title,xLabel,yLabel,points,color='#70e4ff',secondary,cursor,onInspect,scatter=false}:Props){
 const [baseline,setBaseline]=useState<{primary:Pair[];secondary:Pair[]}|null>(null),[zoom,setZoom]=useState(1),[pan,setPan]=useState(0),[log,setLog]=useState(false),[index,setIndex]=useState<number|null>(null);
 const svg=useRef<SVGSVGElement>(null),clip=useId().replace(/:/g,'');
 const primary=points.map(([x,y],id)=>({id,x,y:Number.isFinite(y)?y:null,input:{},scene:{}} as PlotPoint));
 const toPoints=(pairs:Pair[])=>pairs.map(([x,y],id)=>({id,x,y:Number.isFinite(y)?y:null,input:{},scene:{}} as PlotPoint));
 const all=[...points,...secondary??[],...baseline?.primary??[],...baseline?.secondary??[]];
 const [xl,xh]=plotDomain(all.map(p=>p[0])),[yl,yh]=plotDomain(all.map(p=>p[1]),log),span=(xh-xl)/zoom,lo=(xl+xh)/2-span/2+pan*(xh-xl),hi=lo+span;
 const x=(n:number)=>80+(n-lo)/(hi-lo)*500,y=(n:number)=>250-((log?Math.log10(n):n)-yl)/(yh-yl)*200;
 const valid=(p:PlotPoint)=>Number.isFinite(p.x)&&p.y!==null&&(!log||p.y>0);
 const selected=index===null?undefined:primary[Math.min(index,primary.length-1)];
 const inspect=(i:number)=>{const next=Math.max(0,Math.min(points.length-1,i));setIndex(next);if(points[next]?.every(Number.isFinite))onInspect?.(points[next]);};
 const current=cursor===undefined?selected:primary.reduce<PlotPoint|undefined>((best,p)=>!best||Math.abs(p.x-cursor)<Math.abs(best.x-cursor)?p:best,undefined);
 const file=title.toLowerCase().replace(/[^a-z0-9]+/g,'-');
 const csv=()=>{const lines=[['trace',xLabel,yLabel],...points.map(p=>['current',...p]),...(secondary??[]).map(p=>['secondary',...p]),...(baseline?.primary??[]).map(p=>['baseline',...p]),...(baseline?.secondary??[]).map(p=>['baseline-secondary',...p])];downloadBlob(new Blob([lines.map(r=>r.map(v=>'"'+String(typeof v==='number'&&!Number.isFinite(v)?'undefined':v).replace(/"/g,'""')+'"').join(',')).join('\r\n')],{type:'text/csv'}),file+'.csv');};
 return <article className="pr-panel pr-plot" data-practical-plot={title}>
  <h3>{title}</h3>
  <svg ref={svg} viewBox="0 0 620 310" role="slider" tabIndex={0} aria-label={`${title} point inspector`} aria-valuemin={0} aria-valuemax={Math.max(0,points.length-1)} aria-valuenow={Math.max(0,current?.id??0)} aria-valuetext={current?`${xLabel}: ${plotValue(current.x)}; ${yLabel}: ${plotValue(current.y)}`:'No point selected'}
   onKeyDown={e=>{const i=current?.id??0,next=e.key==='Home'?0:e.key==='End'?points.length-1:e.key==='ArrowRight'?i+1:e.key==='ArrowLeft'?i-1:null;if(next!==null){e.preventDefault();inspect(next);}}}
   onPointerDown={e=>{const matrix=e.currentTarget.getScreenCTM();if(!matrix||!points.length)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());const nearest=primary.reduce((a,b)=>Math.abs(x(a.x)-p.x)<Math.abs(x(b.x)-p.x)?a:b);inspect(nearest.id);e.currentTarget.focus({preventScroll:true});}}>
   <title>{title}</title><desc>{scatter?'Recorded samples are circles; pinned samples are amber squares.':'Current curve is solid cyan, secondary is dotted amber; pinned baselines are dashed.'} Select with pointer or arrows. Undefined values break paths. {onInspect?'Selection replays the current curve setting in the apparatus.':'Selection inspects recorded values only.'}</desc>
   <defs><clipPath id={clip}><rect x="80" y="50" width="500" height="200"/></clipPath></defs>
   <rect width="620" height="310" fill="#0c1929"/>
   {[0,.25,.5,.75,1].map(f=><g key={f} fill="#dae9f6" fontSize="13"><path d={`M80 ${250-f*200}H580M${80+f*500} 50V250`} stroke="#3d566c" strokeWidth="1"/><text x="72" y={254-f*200} textAnchor="end">{plotValue(log?10**(yl+f*(yh-yl)):yl+f*(yh-yl))}</text><text x={80+f*500} y="271" textAnchor="middle">{plotValue(lo+f*(hi-lo))}</text></g>)}
   <text x="330" y="300" textAnchor="middle" fill="#eaf3ff" fontSize="15">{xLabel}</text><text transform="translate(18 150) rotate(-90)" textAnchor="middle" fill="#eaf3ff" fontSize="15">{yLabel}{log?' · log₁₀':''}</text>
   <g clipPath={`url(#${clip})`}>
    {baseline&&[baseline.primary,baseline.secondary].map((p,i)=>scatter?<g key={i}>{toPoints(p).filter(valid).map(v=><rect key={v.id} x={x(v.x)-4} y={y(v.y!)-4} width="8" height="8" fill="none" stroke="#ffc65b"/>)}</g>:<path key={i} d={plotPath(toPoints(p),x,y,valid)} fill="none" stroke={i?'#e5b4fc':'#ffc65b'} strokeDasharray="8 6" strokeWidth="2.5"/>)}
    {!scatter&&<path d={plotPath(primary,x,y,valid)} fill="none" stroke={color} strokeWidth="3"/>}
    {scatter&&primary.filter(valid).map(p=><circle key={p.id} cx={x(p.x)} cy={y(p.y!)} r="4" fill={color}/>)}
    {secondary&&<path d={plotPath(toPoints(secondary),x,y,valid)} fill="none" stroke="#ffc65b" strokeWidth="3" strokeDasharray="2 5"/>}
    {current&&valid(current)&&<g><path d={`M${x(current.x)} 50V250`} stroke="#fff0bb" strokeDasharray="4 4"/><circle cx={x(current.x)} cy={y(current.y!)} r="6" fill="#101e30" stroke="#fff0bb" strokeWidth="2"/></g>}
   </g>
  </svg>
  <output className="pr-plot-selection">{current?`${xLabel}: ${plotValue(current.x)}; ${yLabel}: ${plotValue(current.y)}`:'Select a point; arrows or Home/End also inspect the curve.'}</output>
  {secondary&&<p className="pr-hint">Solid: first named quantity · dotted amber: second named quantity · dashed: pinned baseline</p>}
  {scatter&&<p className="pr-hint">Circles: recorded readings · amber squares: pinned readings. No interpolating line is assumed.</p>}
  <details className="pr-plot-tools"><summary>Plot tools and point data</summary><div className="pr-plot-actions">
   <button onClick={()=>setZoom(v=>Math.min(20,v*1.5))}>Zoom plot in</button><button onClick={()=>setZoom(v=>Math.max(1,v/1.5))}>Zoom plot out</button><button onClick={()=>setPan(v=>v-.15)}>Pan plot left</button><button onClick={()=>setPan(v=>v+.15)}>Pan plot right</button><button onClick={()=>{setZoom(1);setPan(0);setLog(false);}}>Fit plot</button>
   <button onClick={()=>setBaseline({primary:points.map(p=>[...p]),secondary:(secondary??[]).map(p=>[...p])})}>Pin plot baseline</button><button disabled={!baseline} onClick={()=>setBaseline(null)}>Clear plot baseline</button><button onClick={csv}>Export plot CSV</button><button onClick={()=>{if(svg.current)downloadBlob(new Blob([new XMLSerializer().serializeToString(svg.current)],{type:'image/svg+xml'}),file+'.svg');}}>Export plot SVG</button>
  </div><label><input type="checkbox" checked={log} disabled={!all.some(p=>p[1]>0)} onChange={e=>setLog(e.target.checked)}/>Logarithmic vertical axis</label>{log&&<p>Nonpositive values are excluded from logarithmic view and remain available in the table.</p>}
  <p>{onInspect?'Inspecting the current curve replays its setting; pinned curves remain unchanged.':'This chart inspects recorded data. Restore a saved trial in the notebook to replay its full apparatus setting.'}</p>
  <div className="pr-table"><table><thead><tr><th>{xLabel}</th><th>{yLabel}</th><th>Inspect</th></tr></thead><tbody>{points.map(([px,py],i)=><tr key={i}><td>{plotValue(px)}</td><td>{plotValue(Number.isFinite(py)?py:null)}</td><td><button onClick={()=>inspect(i)}>Point {i+1}</button></td></tr>)}</tbody></table></div></details>
 </article>;
}
