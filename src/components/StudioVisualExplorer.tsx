import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { theoryForRoute } from '../lib/studioTheory';
import uxContent from '../lib/studioUxContent.json';
import { readStudioVisualFrame, useStudioVisualFrame, type VisualState } from '../lib/studioVisualModel';
import { parameterBounds, plotDomain, plotPath, plotValue, pointFromFrame, visualDefinitions, type PlotPoint, type VisualDefinition } from '../lib/studioPlot';
import { downloadLab, labRoot } from '../lib/studioLabEvidence';
import './studio-visual-explorer.css';

const views=['Response plot','Point data','Scene view'] as const;
type View=typeof views[number];
export function StudioVisualExplorer(){
  const {pathname}=useLocation(),definition=visualDefinitions[pathname];
  return definition?<Explorer key={pathname} route={pathname} definition={definition}/>:null;
}
function Explorer({route,definition:d}:{route:string;definition:VisualDefinition}) {
  const frame=useStudioVisualFrame(route),theory=theoryForRoute(route)!;
  const ux=(uxContent as Record<string,{visual:string;evidence:string}>)[route];
  const [host,setHost]=useState<HTMLElement|null>(null),[open,setOpen]=useState(false),[view,setView]=useState<View>('Response plot');
  const [points,setPoints]=useState<PlotPoint[]>([]),[baseline,setBaseline]=useState<PlotPoint[]>([]),[cursor,setCursor]=useState<number|null>(null);
  const [sweeping,setSweeping]=useState(false),[notice,setNotice]=useState(''),[wide,setWide]=useState(false),[plotZoom,setPlotZoom]=useState(1),[plotPan,setPlotPan]=useState(0),[xLog,setXLog]=useState(false),[yLog,setYLog]=useState(false);
  const [magnification,setMagnification]=useState(1),[pan,setPan]=useState({x:0,y:0}),[enlarged,setEnlarged]=useState(false),[detail,setDetail]=useState(true);
  const [bounds,setBounds]=useState({min:0,max:1,values:null as number[]|null}),[range,setRange]=useState({min:'0',max:'1'});
  const id=useId(),sequence=useRef(0),cancel=useRef(false),panel=useRef<HTMLElement>(null),plot=useRef<SVGSVGElement>(null),trigger=useRef<HTMLButtonElement>(null),restoring=useRef(false);
  const lastSample=useRef(''),firstFrame=useRef(true),beforeSweep=useRef<{input:VisualState;scene:VisualState}|null>(null);
  const inspectionOrigin=useRef<{input:VisualState;scene:VisualState}|null>(null);
  const constraint=useRef('');
  const traceContext=useRef('');
  const ordered=useMemo(()=>[...points].sort((a,b)=>a.x-b.x||a.id-b.id),[points]);
  const currentPoint=frame&&pointFromFrame(frame,d,-1);
  const selected=ordered.find(p=>p.id===cursor)??(currentPoint?ordered.find(p=>p.x===currentPoint.x&&p.y===currentPoint.y):undefined);
  useEffect(()=>{
    const root=labRoot();if(!root)return;
    const find=()=>setHost(root.querySelector<HTMLElement>('[data-studio-scene]'));
    find();const observer=new MutationObserver(find);observer.observe(root,{childList:true,subtree:true});return()=>observer.disconnect();
  },[route]);
  useEffect(()=>{
    if(!frame)return;
    const nextConstraint=route==='/modern-physics/atomic-spectra'?String(frame.input.nf):'fixed';
    if(firstFrame.current||constraint.current!==nextConstraint){const b=parameterBounds(labRoot(),frame,d);setBounds(b);setRange({min:String(b.min),max:String(b.max)});firstFrame.current=false;constraint.current=nextConstraint;}
    const p=pointFromFrame(frame,d,sequence.current++);if(!p)return;
    const context=JSON.stringify(Object.fromEntries(Object.entries(frame.input).filter(([key])=>d.source!=='input'||key!==d.parameter)));
    const signature=JSON.stringify([p.x,p.y,context]);
    if(lastSample.current===signature||restoring.current)return;lastSample.current=signature;setCursor(null);
    const contextChanged=traceContext.current!==''&&traceContext.current!==context;
    traceContext.current=context;
    setPoints(list=>{
      if(contextChanged&&!sweeping)return [p];
      if(list.some(item=>item.x===p.x&&item.y===p.y))return list;
      return [...list.filter(item=>item.x!==p.x),p].slice(-256);
    });
  },[frame,d]);
  useEffect(()=>{
    if(!host)return;
    const graphics=[...host.querySelectorAll<HTMLElement>('canvas,svg')].filter(n=>{const r=n.getBoundingClientRect();return r.width>100&&r.height>75&&!n.closest('[data-visual-toolbar]')&&!n.parentElement?.closest('svg');});
    const prior=graphics.map(node=>({node,scale:node.style.scale,translate:node.style.translate}));
    // Individual transforms compose with the apparatus's own transform/zoom.
    graphics.forEach(node=>{node.style.translate=`${pan.x}px ${pan.y}px`;node.style.scale=String(magnification);});
    host.classList.toggle('sve-scene-enlarged',enlarged);
    return()=>{prior.forEach(({node,scale,translate})=>{node.style.scale=scale;node.style.translate=translate;});host.classList.remove('sve-scene-enlarged');};
  },[host,magnification,pan,enlarged,frame?.scene.camera,frame?.scene.view]);
  useEffect(()=>{
    if(!host)return;
    const oldRole=host.getAttribute('role'),oldTab=host.getAttribute('tabindex'),oldLabel=host.getAttribute('aria-label'),oldDescription=host.getAttribute('aria-describedby'),oldPosition=host.style.position;
    if(getComputedStyle(host).position==='static')host.style.position='relative';
    host.setAttribute('role','group');host.setAttribute('tabindex','0');host.setAttribute('aria-label',`${d.title} apparatus viewport`);host.setAttribute('aria-describedby',`${id}-scene-guide`);
    const key=(e:KeyboardEvent)=>{if(e.target!==host)return;if(e.key==='Home'){e.preventDefault();resetView();}else if(e.key==='+'||e.key==='='){e.preventDefault();setMagnification(v=>Math.min(3,v+.1));}else if(e.key==='-'){e.preventDefault();setMagnification(v=>Math.max(.5,v-.1));}else if(e.key.startsWith('Arrow')){e.preventDefault();const n=e.shiftKey?30:10;setPan(p=>({x:Math.max(-300,Math.min(300,p.x+(e.key==='ArrowLeft'?-n:e.key==='ArrowRight'?n:0))),y:Math.max(-300,Math.min(300,p.y+(e.key==='ArrowUp'?-n:e.key==='ArrowDown'?n:0)))}));}};
    host.addEventListener('keydown',key);
    return()=>{host.removeEventListener('keydown',key);host.style.position=oldPosition;for(const [name,value]of [['role',oldRole],['tabindex',oldTab],['aria-label',oldLabel],['aria-describedby',oldDescription]])value===null?host.removeAttribute(name!):host.setAttribute(name!,value!);};
  },[host,id,d.title]);
  useEffect(()=>{
    if(!open)return;
    panel.current?.focus({preventScroll:true});
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape'&&!document.querySelector('[aria-modal="true"]')){cancel.current=true;setOpen(false);setEnlarged(false);trigger.current?.focus();}};
    document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key);
  },[open]);
  useEffect(()=>()=>{cancel.current=true;const previous=beforeSweep.current;if(previous){const current=readStudioVisualFrame(route);current?.applyInput(previous.input);current?.applyScene(previous.scene);}},[route]);
  const resetView=()=>{setMagnification(1);setPan({x:0,y:0});setEnlarged(false);readStudioVisualFrame(route)?.resetView();};
  const pause=()=>{const current=readStudioVisualFrame(route);if(!current)return;const patch:VisualState={};for(const key of ['running','run','scanning'])if(typeof current.scene[key]==='boolean')patch[key]=false;current.applyScene(patch);};
  const replay=(point:PlotPoint)=>{
    if(!frame||sweeping)return;
    if(!inspectionOrigin.current)inspectionOrigin.current={input:frame.input,scene:frame.scene};
    pause();restoring.current=true;frame.applyInput(point.input);frame.applyScene({...point.scene,...Object.fromEntries(['running','run'].filter(key=>typeof point.scene[key]==='boolean').map(key=>[key,false]))});
    setCursor(point.id);setNotice(frame.locked?'Cursor inspected; assignment locks prevented parameter replay.':`Replayed ${d.xLabel} ${plotValue(point.x)} ${d.xUnit}; the apparatus and live readings use that saved setting.`);
    setTimeout(()=>{restoring.current=false;},100);
  };
  const sweep=async()=>{
    const current=readStudioVisualFrame(route);if(!current||current.locked||sweeping)return;
    const lo=Number(range.min),hi=Number(range.max);
    if(!Number.isFinite(lo)||!Number.isFinite(hi)||lo>=hi||lo<bounds.min||hi>bounds.max){setNotice(`Choose an increasing range within ${plotValue(bounds.min)} to ${plotValue(bounds.max)} ${d.xUnit}.`);return;}
    const steps=bounds.values?bounds.values.filter(n=>n>=lo&&n<=hi):[...new Set(Array.from({length:17},(_,i)=>d.discrete?Math.round(lo+(hi-lo)*i/16):lo+(hi-lo)*i/16))];
    if(steps.length<2){setNotice('Choose at least two available parameter settings.');return;}
    beforeSweep.current={input:current.input,scene:current.scene};cancel.current=false;setPoints([]);setCursor(null);lastSample.current='';setSweeping(true);pause();
    try{
      for(const value of steps){
        if(cancel.current)break;
        const active=readStudioVisualFrame(route);if(!active)break;
        const original=(d.source==='scene'?active.scene:active.input)[d.parameter];
        const fixed=beforeSweep.current;
        const patch={...(d.source==='scene'?{}:fixed?.input),[d.parameter]:typeof original==='boolean'?value!==0:value};
        if(d.source==='scene')active.applyScene(patch);else active.applyInput(patch);
        await new Promise(resolve=>setTimeout(resolve,60));
        const updated=readStudioVisualFrame(route);const point=updated&&pointFromFrame(updated,d,sequence.current++);
        if(point)setPoints(list=>list.some(p=>p.x===point.x&&p.y===point.y)?list:[...list,point].slice(-256));
      }
      setNotice(cancel.current?'Sweep stopped; original settings restored.':'Sweep complete. Points are actual solver evaluations; original settings restored.');
    }finally{
      const previous=beforeSweep.current;beforeSweep.current=null;
      const active=readStudioVisualFrame(route);if(previous&&active){active.applyInput(previous.input);active.applyScene(previous.scene);}
      setSweeping(false);
    }
  };
  const exportCSV=()=>{
    const escape=(v:unknown)=>'"'+String(v).replace(/"/g,'""')+'"';
    const rows=[['trace',`${d.xLabel} (${d.xUnit})`,`${d.yLabel} (${d.yUnit})`],...ordered.map(p=>['current',p.x,p.y??'undefined']),...baseline.map(p=>['baseline',p.x,p.y??'undefined'])];
    const url=URL.createObjectURL(new Blob([rows.map(r=>r.map(escape).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`${d.title}-response.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const exportPlot=()=>{if(!plot.current)return;const copy=plot.current.cloneNode(true) as SVGSVGElement;copy.setAttribute('xmlns','http://www.w3.org/2000/svg');copy.removeAttribute('tabindex');const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=url;a.download=`${d.title}-response.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  const toggleAnnotations=(detailed:boolean)=>{
    setDetail(detailed);if(!frame)return;
    const patch:VisualState={};
    for(const key of ['overlays','visibility','layers']){
      const existing=frame.scene[key];if(existing&&typeof existing==='object'&&!Array.isArray(existing)){const next={...existing};for(const name of Object.keys(next))if(typeof next[name]==='boolean'&&/grid|trail|path|ghost|particle/i.test(name))next[name]=detailed;patch[key]=next;}
    }
    frame.applyScene(patch);
  };
  const toolbar=<div className={`sve-native-toolbar${open?' sve-toolbar-open':''}`} data-visual-toolbar><button ref={trigger} onClick={()=>{if(open){cancel.current=true;setEnlarged(false)}setOpen(v=>!v)}} aria-expanded={open} aria-controls={`${id}-panel`}>Graph &amp; scene tools</button><span id={`${id}-scene-guide`} className="sve-scene-guide">{detail?ux.visual:'Apparatus view'} · focus viewport: arrows pan, +/− magnify, Home resets.</span>{selected&&cursor!==null&&<output className="sve-native-probe">Selected: {d.xLabel} {plotValue(selected.x)} {d.xUnit} → {d.yLabel} {plotValue(selected.y)} {d.yUnit}</output>}</div>;
  return <div className="sve" data-studio-visual-explorer data-route={route} data-ui-theme="dark">
    <output hidden data-visual-model>{frame?JSON.stringify({input:frame.input,scene:frame.scene,quantities:frame.quantities,definition:d}):''}</output>
    {host?createPortal(toolbar,host):<button className="sve-fallback-launch" ref={trigger} onClick={()=>{if(open){cancel.current=true;setEnlarged(false)}setOpen(v=>!v)}}>Graph &amp; scene tools</button>}
    {open&&<section className={`sve-panel${wide?' sve-wide':''}`} ref={panel} tabIndex={-1} aria-label={`${d.title} graph and scene tools`} id={`${id}-panel`}>
      <header><div><small>{theory.studio?.name}</small><h2>{d.title}: graphs &amp; scene</h2></div><button onClick={()=>{cancel.current=true;setOpen(false);setEnlarged(false);trigger.current?.focus();}} aria-label="Close graph and scene tools">×</button></header>
      <p>{d.yLabel} versus {d.xLabel}. Every point comes from this lab’s existing solver.</p>
      {!frame&&<p role="status">Waiting for the apparatus model…</p>}
      <div className="sve-tabs" role="tablist" aria-label="Graph and scene views">{views.map((name,i)=><button role="tab" id={`${id}-tab-${i}`} aria-controls={`${id}-view-${i}`} aria-selected={view===name} tabIndex={view===name?0:-1} key={name} onClick={()=>setView(name)} onKeyDown={e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?views.length-1:(i+(e.key==='ArrowRight'?1:-1)+views.length)%views.length;setView(views[next]);(e.currentTarget.parentElement?.children[next] as HTMLElement)?.focus();}}>{name}</button>)}</div>
      <div role="tabpanel" tabIndex={0} aria-labelledby={`${id}-tab-${views.indexOf(view)}`} id={`${id}-view-${views.indexOf(view)}`}>
        {view==='Response plot'&&<>
          <div className="sve-sweep"><label>{d.xLabel}: minimum ({d.xUnit})<input aria-label="Sweep minimum" type="number" value={range.min} min={bounds.min} max={bounds.max} step="any" onChange={e=>setRange(r=>({...r,min:e.target.value}))}/></label><label>Maximum ({d.xUnit})<input aria-label="Sweep maximum" type="number" value={range.max} min={bounds.min} max={bounds.max} step="any" onChange={e=>setRange(r=>({...r,max:e.target.value}))}/></label><button disabled={!frame||frame.locked||sweeping} onClick={sweep}>Collect response curve</button>{sweeping&&<button onClick={()=>{cancel.current=true;}}>Stop sweep</button>}</div>
          <p className="sve-note">Sweep changes the real apparatus temporarily and restores the original input and playback state. Lines join sampled evaluations; they are not independent measurements. Undefined results remain gaps.</p>
          {d.discrete&&<p>Discrete settings are shown as individual points. Values between allowed logic states or quantum/nucleon numbers are not interpolated.</p>}
          <ResponsePlot refNode={plot} points={ordered} baseline={baseline} selected={selected} definition={d} zoom={plotZoom} pan={plotPan} xLog={xLog} yLog={yLog} select={replay}/>
          {points.some(p=>p.y===null)&&<p>{points.filter(p=>p.y===null).length} sampled outputs are undefined in this model state. They remain gaps; inspect their rows and review the model assumptions.</p>}
          <div className="sve-legend"><span>{d.discrete?'○':'━ ○'} Current samples</span><span>{d.discrete?'□':'┄ □'} Pinned baseline</span></div>
          <div className="sve-actions"><button onClick={()=>setPlotZoom(z=>Math.min(20,z*1.5))}>Zoom plot in</button><button onClick={()=>setPlotZoom(z=>Math.max(1,z/1.5))}>Zoom plot out</button><button onClick={()=>setPlotPan(p=>p-.15)}>Pan plot left</button><button onClick={()=>setPlotPan(p=>p+.15)}>Pan plot right</button><button onClick={()=>{setPlotZoom(1);setPlotPan(0);setXLog(false);setYLog(false);}}>Fit all samples</button></div>
          <div className="sve-actions"><label><input type="checkbox" checked={xLog} disabled={!ordered.some(p=>p.x>0)} onChange={e=>setXLog(e.target.checked)}/>Logarithmic {d.xLabel} axis</label><label><input type="checkbox" checked={yLog} disabled={!ordered.some(p=>p.y!==null&&p.y>0)} onChange={e=>setYLog(e.target.checked)}/>Logarithmic {d.yLabel} axis</label></div>
          {(xLog||yLog)&&<p>Nonpositive values have no logarithm and are shown as gaps in logarithmic view.</p>}
          <div className="sve-actions"><button disabled={!points.length} onClick={()=>{setBaseline([...ordered]);setNotice('Baseline curve pinned. Change another variable and collect a comparison.');}}>Pin baseline curve</button><button disabled={!baseline.length} onClick={()=>setBaseline([])}>Clear baseline curve</button><button disabled={sweeping} onClick={()=>{lastSample.current='';setPoints([]);setCursor(null);setNotice('Current trace cleared; the next model change records a new point.');}}>Clear current samples</button><button aria-pressed={wide} onClick={()=>setWide(v=>!v)}>{wide?'Dock plot panel':'Expand plot panel'}</button></div>
        </>}
        {view==='Point data'&&<><h3>Recorded solver evaluations</h3><p>Choose a row to replay its input and inspection time in the apparatus. Model limits remain those of the selected lab.</p><div className="sve-table"><table><caption>{d.yLabel} versus {d.xLabel}</caption><thead><tr><th>Point</th><th>{d.xLabel} ({d.xUnit})</th><th>{d.yLabel} ({d.yUnit})</th><th>Replay</th></tr></thead><tbody>{ordered.map((p,i)=><tr key={p.id} data-x={p.x} data-y={p.y??'undefined'} aria-selected={selected?.id===p.id}><th>{i+1}</th><td>{plotValue(p.x)}</td><td>{plotValue(p.y)}</td><td><button disabled={sweeping} onClick={()=>replay(p)}>Inspect point {i+1}</button></td></tr>)}</tbody></table></div></>}
        {view==='Scene view'&&<><h3>Inspect the apparatus</h3><p>{ux.visual}. {theory.chapter.core}</p><div className="sve-actions"><button onClick={()=>setMagnification(v=>Math.min(3,v+.1))}>Magnify scene</button><button onClick={()=>setMagnification(v=>Math.max(.5,v-.1))}>Reduce scene</button><button onClick={()=>setPan(p=>({...p,x:Math.max(-300,p.x-20)}))}>Pan scene left</button><button onClick={()=>setPan(p=>({...p,x:Math.min(300,p.x+20)}))}>Pan scene right</button><button onClick={()=>setPan(p=>({...p,y:Math.max(-300,p.y-20)}))}>Pan scene up</button><button onClick={()=>setPan(p=>({...p,y:Math.min(300,p.y+20)}))}>Pan scene down</button><button onClick={resetView}>Reset scene view</button><button aria-pressed={enlarged} onClick={()=>setEnlarged(v=>!v)}>{enlarged?'Restore scene size':'Enlarge scene'}</button><button onClick={pause}>Pause apparatus motion</button></div><output data-scene-view>Magnification {Math.round(magnification*100)}%; pan {pan.x}, {pan.y} screen px</output><label><input type="checkbox" checked={detail} onChange={e=>toggleAnnotations(e.target.checked)}/>Detailed scene guide and optional grid/trail layers</label><p>Magnification and screen pan change presentation only; axis units and physical distances stay unchanged. Native camera controls remain available in the apparatus.</p><details><summary>Scene legend and model assumptions</summary><p>{ux.evidence}</p><p>{theory.chapter.assumptions}</p><p>{theory.chapter.misconception}</p></details></>}
      </div>
      <output className="sve-selection" data-selected-point>{selected?`${d.xLabel}: ${plotValue(selected.x)} ${d.xUnit}; ${d.yLabel}: ${plotValue(selected.y)} ${d.yUnit}`:'Collect a curve or change an apparatus control to record points.'}</output>
      <button disabled={!inspectionOrigin.current} onClick={()=>{const original=inspectionOrigin.current,current=readStudioVisualFrame(route);if(original&&current){current.applyInput(original.input);current.applyScene(original.scene);inspectionOrigin.current=null;setCursor(null);setNotice('Pre-inspection input and scene state restored.');}}}>Restore pre-inspection setting</button>
      {frame?.locked&&<p>Assignment variables are locked. Graph inspection remains available; parameter sweeps and input replay are disabled.</p>}
      <div className="sve-actions"><button onClick={exportCSV}>Export curve CSV</button><button disabled={view!=='Response plot'} onClick={exportPlot}>Export plot SVG</button><button onClick={()=>downloadLab(`${d.title}-visual-evidence.json`,{version:1,route,definition:d,points:ordered,baseline,assumptions:theory.chapter.assumptions})}>Export reproducible point data</button></div>
      <p role="status" aria-live="polite">{notice||`${points.length} recorded model points; ${baseline.length} baseline points.`}</p>
    </section>}
  </div>;
}

function ResponsePlot({refNode,points,baseline,selected,definition:d,zoom,pan,xLog,yLog,select}:{refNode:React.RefObject<SVGSVGElement>;points:PlotPoint[];baseline:PlotPoint[];selected?:PlotPoint;definition:VisualDefinition;zoom:number;pan:number;xLog:boolean;yLog:boolean;select:(p:PlotPoint)=>void}) {
  const [xl,xh]=plotDomain([...points,...baseline].map(p=>p.x),xLog),[yl,yh]=plotDomain([...points,...baseline].flatMap(p=>p.y===null?[]:[p.y]),yLog);
  const span=(xh-xl)/zoom,center=(xl+xh)/2+pan*(xh-xl),lo=center-span/2,hi=center+span/2;
  const x=(v:number)=>74+((xLog?Math.log10(v):v)-lo)/(hi-lo)*560,y=(v:number)=>292-((yLog?Math.log10(v):v)-yl)/(yh-yl)*236;
  const valid=(p:PlotPoint)=>p.y!==null&&(!xLog||p.x>0)&&(!yLog||p.y>0);
  const index=selected?points.findIndex(p=>p.id===selected.id):Math.max(0,points.length-1);
  const clip=useId().replace(/:/g,'');
  const discreteTicks=[...new Set([...points,...baseline].map(p=>p.x))].sort((a,b)=>a-b).filter(v=>(!xLog||v>0)&&x(v)>=74&&x(v)<=634);
  const xTicks=d.discrete?discreteTicks.filter((_,i)=>i%Math.max(1,Math.ceil(discreteTicks.length/6))===0):[0,.25,.5,.75,1].map(f=>xLog?10**(lo+f*(hi-lo)):lo+f*(hi-lo));
  return <svg ref={refNode} className="sve-plot" data-x-domain={`${lo},${hi}`} viewBox="0 0 680 365" role="slider" tabIndex={0} aria-label={`${d.title} interactive response plot`} aria-valuemin={0} aria-valuemax={Math.max(0,points.length-1)} aria-valuenow={Math.max(0,index)} aria-valuetext={selected?`${d.xLabel} ${plotValue(selected.x)} ${d.xUnit}; ${d.yLabel} ${plotValue(selected.y)} ${d.yUnit}`:'No samples yet'} onKeyDown={e=>{if(!points.length)return;const next=e.key==='ArrowRight'?Math.min(points.length-1,index+1):e.key==='ArrowLeft'?Math.max(0,index-1):e.key==='Home'?0:e.key==='End'?points.length-1:null;if(next!==null){e.preventDefault();select(points[next]);}else if(e.key==='Enter'&&selected){e.preventDefault();select(selected);}}} onPointerDown={e=>{if(!points.length)return;const matrix=e.currentTarget.getScreenCTM();if(!matrix)return;const pos=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());const nearest=points.filter(valid).reduce<PlotPoint|undefined>((best,p)=>!best||Math.abs(x(p.x)-pos.x)<Math.abs(x(best.x)-pos.x)?p:best,undefined);if(nearest)select(nearest);e.currentTarget.focus({preventScroll:true});}}>
    <title>{d.title}: {d.yLabel} against {d.xLabel}</title><desc>{d.discrete?'Cyan circles show discrete current samples; amber squares show the baseline.':'Solid cyan line and circles show current samples; dashed amber line and squares show the baseline.'} Arrows or Home/End select and replay a point. Undefined values and physical branch changes break the curve.</desc><rect width="680" height="365" rx="9" fill="#0c1929"/>
    <defs><clipPath id={clip}><rect x="74" y="56" width="560" height="236"/></clipPath></defs>
    {[0,.25,.5,.75,1].map(f=><g key={f}><path d={`M74 ${292-f*236}H634`} stroke="#35506d" strokeWidth=".7"/><text x="66" y={296-f*236} fill="#c7d7e9" fontSize="11" textAnchor="end">{plotValue(yLog?10**(yl+f*(yh-yl)):yl+f*(yh-yl))}</text></g>)}
    {xTicks.map(v=><g key={v}><path d={`M${x(v)} 56V292`} stroke="#35506d" strokeWidth=".7"/><text x={x(v)} y="311" fill="#c7d7e9" fontSize="11" textAnchor="middle">{plotValue(v)}</text></g>)}
    <text x="354" y="340" fill="#edf5ff" fontSize="13" textAnchor="middle">{d.xLabel} ({d.xUnit}){xLog?' · log₁₀':''}</text><text x="20" y="174" transform="rotate(-90 20 174)" fill="#edf5ff" fontSize="13" textAnchor="middle">{d.yLabel} ({d.yUnit}){yLog?' · log₁₀':''}</text><text x="74" y="28" fill="#d3e5f6" fontSize="13">Recorded solver response · {points.length} samples</text>
    <g clipPath={`url(#${clip})`}><path d={d.discrete?'':plotPath(baseline,x,y,valid)} fill="none" stroke="#ffd47b" strokeWidth="2.5" strokeDasharray="7 5"/>{baseline.filter(valid).map(p=><rect key={p.id} x={x(p.x)-3} y={y(p.y!)-3} width="6" height="6" stroke="#ffd47b" fill="#0c1929"/>)}<path d={d.discrete?'':plotPath(points,x,y,valid)} fill="none" stroke="#70e4ff" strokeWidth="2.5"/>{points.filter(valid).map(p=><circle key={p.id} cx={x(p.x)} cy={y(p.y!)} r="3" fill="#70e4ff"/>)}{selected&&valid(selected)&&<g><path d={`M${x(selected.x)} 56V292M74 ${y(selected.y!)}H634`} stroke="#fff2b0" strokeDasharray="3 3"/><circle cx={x(selected.x)} cy={y(selected.y!)} r="6" stroke="#fff2b0" strokeWidth="2" fill="#0c1929"/></g>}</g>
    {!points.length&&<text x="354" y="175" textAnchor="middle" fill="#d3e5f6" fontSize="14">Collect a curve or change a physical control.</text>}
  </svg>;
}
