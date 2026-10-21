import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { theoryForRoute } from '../lib/studioTheory';
import content from '../lib/studioUxContent.json';
import { safeStorage } from '../lib/safeStorage';
import { captureLab, captureLabPreview, downloadEvidenceImage, downloadLab, labRoot, locateLabQuantity, locateLabSymbol, restoreLab, safeLabPreview, setLabControl, validSnapshot, type LabSnapshot } from '../lib/studioLabEvidence';
import './studio-lab-workspace.css';

const modes = ['Observe','Predict','Experiment','Explain','Challenge'] as const;
type Mode = typeof modes[number];
type Trial = { id: string; snapshot: LabSnapshot; note: string };
type Notebook = { prediction: string; notes: string; trials: Trial[]; baseline: LabSnapshot|null; checks: boolean[]; revealed: boolean; reason: string; resultScore:string; reasoningScore:string };
const empty: Notebook = {prediction:'',notes:'',trials:[],baseline:null,checks:[false,false,false,false],revealed:false,reason:'',resultScore:'',reasoningScore:''};
function readNotebook(key:string,route:string):Notebook {
  const v=safeStorage.readJSON<Partial<Notebook>|null>(key,null);
  return {prediction:typeof v?.prediction==='string'?v.prediction:'',notes:typeof v?.notes==='string'?v.notes:'',reason:typeof v?.reason==='string'?v.reason:'',revealed:v?.revealed===true,resultScore:['0','1','2'].includes(v?.resultScore??'')?v!.resultScore!:'',reasoningScore:['0','1','2'].includes(v?.reasoningScore??'')?v!.reasoningScore!:'',baseline:validSnapshot(v?.baseline,route)?v.baseline:null,trials:Array.isArray(v?.trials)?v.trials.filter(t=>t&&typeof t.id==='string'&&typeof t.note==='string'&&validSnapshot(t.snapshot,route)).slice(-40):[],checks:Array.isArray(v?.checks)&&v.checks.length===4?v.checks.map(v=>v===true):empty.checks};
}
export function StudioLabWorkspace(){
  const {pathname}=useLocation();
  const theory=theoryForRoute(pathname);
  return theory ? <Workspace key={pathname} route={pathname} theory={theory}/> : null;
}

function Workspace({route,theory}:{route:string;theory:NonNullable<ReturnType<typeof theoryForRoute>>}) {
  const {chapter,lab,labs,studio}=theory;
  const ux=(content as Record<string,{controls:string;evidence:string;visual:string}>)[route];
  const key=`studio-notebook-v1:${route}`,id=useId();
  const [book,setBook]=useState(()=>readNotebook(key,route));
  const [open,setOpen]=useState(false),[mode,setMode]=useState<Mode>(()=>{const m=new URLSearchParams(location.search).get('learning');return modes.includes(m as Mode)?m as Mode:'Observe'});
  const [snapshot,setSnapshot]=useState<LabSnapshot|null>(null),[removed,setRemoved]=useState<Trial|null>(null),[undo,setUndo]=useState<LabSnapshot|null>(null);
  const [message,setMessage]=useState(''),[stored,setStored]=useState(true),[step,setStep]=useState(0),[exampleStep,setExampleStep]=useState(0),[showAll,setShowAll]=useState(false),[hint,setHint]=useState(false);
  const [simple,setSimple]=useState(false),[contrast,setContrast]=useState(false),[essential,setEssential]=useState(false),[reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [imported,setImported]=useState<LabSnapshot|null>(null),[inspected,setInspected]=useState(0);
  const [visual,setVisual]=useState<string>();
  const launcher=useRef<HTMLButtonElement>(null),panel=useRef<HTMLElement>(null);
  const patch=(p:Partial<Notebook>)=>setBook(b=>({...b,...p}));
  const refresh=()=>{const s=captureLab(route);setSnapshot(s);setTimeout(()=>{if(location.pathname===route)setSnapshot(captureLab(route));},0);return s};
  useEffect(()=>{const saved={...book,baseline:book.baseline?{...book.baseline,preview:undefined}:null};setStored(safeStorage.writeJSON(key,saved));},[book,key]);
  useEffect(()=>{
    const root=labRoot();if(!root)return;
    const refreshOnInput=(event:Event)=>{if((event.target as Element)?.matches('input,select,button'))setSnapshot(captureLab(route));};
    root.addEventListener('change',refreshOnInput);root.addEventListener('input',refreshOnInput);
    const timer=setInterval(()=>{if(open)setSnapshot(captureLab(route));},1000);
    // Reuse each page's real handlers for keyboard navigation between existing tabs.
    const keyboard=(e:KeyboardEvent)=>{
      if(e.defaultPrevented||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
      const target=e.target as HTMLElement;if(target.getAttribute('role')!=='tab')return;
      const list=target.closest('[role="tablist"]');if(!list)return;
      const tabs=[...list.querySelectorAll<HTMLButtonElement>('[role="tab"]')].filter(t=>!t.disabled);
      const index=tabs.indexOf(target as HTMLButtonElement);if(index<0)return;
      const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
      e.preventDefault();tabs[next].focus();tabs[next].click();
    };
    root.addEventListener('keydown',keyboard);
    const linkFocus=(e:FocusEvent)=>{const node=e.target as HTMLInputElement;if(node.matches('input,select'))locateLabQuantity(node.getAttribute('aria-label')||node.closest('label')?.textContent||'');};
    const clearFocus=()=>root.querySelectorAll('.slw-linked-quantity').forEach(node=>node.classList.remove('slw-linked-quantity'));
    root.addEventListener('focusin',linkFocus);root.addEventListener('focusout',clearFocus);
    return()=>{clearInterval(timer);root.removeEventListener('change',refreshOnInput);root.removeEventListener('input',refreshOnInput);root.removeEventListener('keydown',keyboard);root.removeEventListener('focusin',linkFocus);root.removeEventListener('focusout',clearFocus);clearFocus();};
  },[route,open]);
  useEffect(()=>{
    const root=labRoot();if(!root)return;
    root.classList.toggle('slw-simple-view',simple);root.classList.toggle('slw-contrast-view',contrast);root.classList.toggle('slw-reduced-motion',reduced);root.classList.toggle('slw-essential-view',essential);
    return()=>root.classList.remove('slw-simple-view','slw-contrast-view','slw-reduced-motion','slw-essential-view');
  },[simple,contrast,reduced,essential]);
  useEffect(()=>{
    const raw=new URLSearchParams(location.hash.slice(1)).get('lab-state');
    if(!raw||raw.length>50000)return;
    try{const v=JSON.parse(raw);if(validSnapshot(v,route)){setImported(v);setOpen(true);}}catch{/* Invalid shared state never changes the apparatus. */}
  },[route]);
  useEffect(()=>{
    if(!open)return;
    panel.current?.focus({preventScroll:true});refresh();
    const close=(e:KeyboardEvent)=>{if(e.key==='Escape'&&!document.querySelector('[aria-modal="true"]')){setOpen(false);launcher.current?.focus();}};
    document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close);
  },[open]);
  const selectMode=(m:Mode)=>{setMode(m);const url=new URL(location.href);url.searchParams.set('learning',m);history.replaceState(history.state,'',url);};
  const restore=(s:LabSnapshot)=>{setUndo(captureLab(route));const result=restoreLab(s,route);refresh();setMessage(`${result.applied} exposed controls restored${result.skipped?`; ${result.skipped} unavailable or locked controls skipped`:''}.`);};
  const record=()=>{const s=refresh();patch({trials:[...book.trials,{id:crypto.randomUUID(),snapshot:s,note:book.notes}].slice(-40)});setMessage('Trial recorded with current displayed readings. Up to 40 trials are kept.');};
  const share=async()=>{
    const s=refresh(),url=new URL(location.href);url.hash=new URLSearchParams({'lab-state':JSON.stringify(s)}).toString();
    try{await navigator.clipboard.writeText(url.href);setMessage('Link copied with exposed controls. Hidden scene state is not included.');}catch{downloadLab(`${lab?.title}-shared-state.json`,s);setMessage('Clipboard unavailable. Shared state downloaded instead.');}
  };
  const exportBook=()=>downloadLab(`${lab?.title}-notebook.json`,{version:1,route,lab:lab?.title,exportedAt:new Date().toISOString(),equation:chapter.equation,units:chapter.symbols,assumptions:chapter.assumptions,...book,current:refresh()});
  const readings=snapshot?.readings??[];
  const next=labs[(labs.findIndex(l=>l.route===route)+1)%labs.length];
  const compare=book.baseline;
  const steps=['Record the initial settings and displayed readings.',chapter.investigation,`Compare the evidence with ${chapter.equation}.`,`Explain your result within these limits: ${chapter.assumptions}`];
  return <div className="slw" data-lab-workspace data-ui-theme="dark">
    <button className="slw-launch" ref={launcher} onClick={()=>setOpen(o=>!o)} aria-expanded={open} aria-controls={`${id}-panel`}>☷ Lab notebook &amp; tools</button>
    {open&&<section className="slw-panel" ref={panel} id={`${id}-panel`} tabIndex={-1} aria-label={`${lab?.title} notebook`}>
      <header className="slw-header"><div><small>{studio?.name}</small><h2>{lab?.title}: investigate</h2></div><button aria-label="Close lab notebook" onClick={()=>{setOpen(false);launcher.current?.focus();}}>×</button></header>
      <p className="slw-goal"><strong>Your task:</strong> Change {ux.controls}; explain the evidence in {ux.evidence}.</p>
      {!stored&&<p role="status">Local saving is unavailable. Export your notebook before leaving this page.</p>}
      {imported&&<div className="slw-notice"><p>A shared setup is ready. Applying it changes exposed controls; assignment locks remain respected.</p><button onClick={()=>{restore(imported);setImported(null);}}>Apply shared setup</button><button onClick={()=>setImported(null)}>Dismiss</button></div>}
      <div className="slw-tabs" role="tablist" aria-label="Notebook learning modes">{modes.map((m,i)=><button key={m} role="tab" id={`${id}-tab-${m}`} aria-selected={mode===m} aria-controls={`${id}-mode-${m}`} tabIndex={mode===m?0:-1} onClick={()=>selectMode(m)} onKeyDown={e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?modes.length-1:(i+(e.key==='ArrowRight'?1:-1)+modes.length)%modes.length;selectMode(modes[n]);(e.currentTarget.parentElement?.children[n] as HTMLElement)?.focus();}}>{m}</button>)}</div>
      <div className="slw-mode" role="tabpanel" id={`${id}-mode-${mode}`} aria-labelledby={`${id}-tab-${mode}`} tabIndex={0}>
        {mode==='Observe'&&<><h3>Look for the relationship</h3><p>{chapter.core}</p><p><strong>Visual guide:</strong> {ux.visual}.</p><p><strong>Track:</strong> {ux.evidence}.</p><details><summary>Model assumptions and limits</summary><p>{chapter.assumptions}</p></details><button onClick={()=>{selectMode('Predict');}}>Make a prediction</button></>}
        {mode==='Predict'&&<><h3>Predict before comparing</h3><p>How will changing {ux.controls} affect {ux.evidence}?</p><label>Your prediction and physical reasoning<textarea value={book.prediction} onChange={e=>patch({prediction:e.target.value,revealed:false})}/></label><button onClick={()=>{refresh();selectMode('Experiment');}} disabled={!book.prediction.trim()}>Save prediction &amp; investigate</button><p>Your prediction stays saved when you change tabs or return to this lab.</p></>}
        {mode==='Experiment'&&<><h3>A controlled investigation</h3><ol className="slw-checklist">{steps.map((s,i)=><li key={s}><label><input type="checkbox" checked={book.checks[i]} onChange={e=>patch({checks:book.checks.map((c,j)=>j===i?e.target.checked:c)})}/>{s}</label></li>)}</ol><label>Plan, observations and units<textarea value={book.notes} onChange={e=>patch({notes:e.target.value})}/></label><button onClick={record}>Record trial</button><p>{book.checks.filter(Boolean).length}/4 investigation steps checked</p></>}
        {mode==='Explain'&&<><h3>Connect evidence to the model</h3><p>{chapter.core}</p><button className="slw-equation" onClick={()=>document.getElementById(`${id}-units`)?.focus()}>{chapter.equation}</button><details id={`${id}-units`} tabIndex={-1} open><summary>Symbols and units</summary><p>{chapter.symbols}</p><p>Locate these quantities in the controls and evidence table below.</p></details><h4>Derivation</h4><ol>{(showAll?chapter.derivation:chapter.derivation.slice(0,step+1)).map(s=><li key={s}>{s}</li>)}</ol><div className="slw-actions"><button disabled={step===0} onClick={()=>setStep(s=>s-1)}>Previous derivation step</button><button disabled={step>=chapter.derivation.length-1} onClick={()=>setStep(s=>s+1)}>Next derivation step</button><button aria-pressed={showAll} onClick={()=>setShowAll(s=>!s)}>{showAll?'Step by step':'Show all derivation steps'}</button></div><h4>Worked example replay</h4><p className="slw-reference">Reference calculation, not a live run. Use matching settings in the apparatus to compare.</p><ol>{chapter.example.slice(0,exampleStep+1).map(s=><li key={s}>{s}</li>)}</ol><button disabled={exampleStep===0} onClick={()=>setExampleStep(s=>s-1)}>Previous example step</button><button disabled={exampleStep>=chapter.example.length-1} onClick={()=>setExampleStep(s=>s+1)}>Next example step</button><p><strong>Check this misconception:</strong> {chapter.misconception}</p><details><summary>Beyond this model</summary><p>{chapter.extension}</p></details></>}
        {mode==='Challenge'&&<><h3>Apply and explain</h3><p>{chapter.question}</p><label>Your result, units and reasoning<textarea value={book.reason} onChange={e=>patch({reason:e.target.value,revealed:false})}/></label><button onClick={()=>setHint(h=>!h)} aria-expanded={hint}>{hint?'Hide hint':'Show a hint'}</button>{hint&&<p>Start from {chapter.equation}. Use these units: {chapter.symbols}</p>}<button disabled={!book.reason.trim()} onClick={()=>patch({revealed:true})}>Reveal reference reasoning</button>{book.revealed&&<div className="slw-notice"><p>{chapter.answer}</p><p>Compare your assumptions and reasoning as well as the final result. {chapter.misconception}</p></div>}<details><summary>Continue without hints</summary><p>{chapter.extension}</p><p>Write a prediction, choose a test within the available model and record evidence.</p></details></>}
      </div>
      {mode==='Challenge'&&book.revealed&&<fieldset className="slw-section"><legend>Self-assess result and reasoning separately</legend><p>This is your own reflection, not an automated grade. Compare with the reference reasoning above.</p><label>Result and units<select aria-label="Result and units" value={book.resultScore} onChange={e=>patch({resultScore:e.target.value})}><option value="">Not assessed</option><option value="0">0 — revise result or units</option><option value="1">1 — partly correct</option><option value="2">2 — correct result and units</option></select></label><label>Physical reasoning and assumptions<select aria-label="Physical reasoning and assumptions" value={book.reasoningScore} onChange={e=>patch({reasoningScore:e.target.value})}><option value="">Not assessed</option><option value="0">0 — revise the explanation</option><option value="1">1 — partly justified</option><option value="2">2 — justified with model limits</option></select></label></fieldset>}
      {mode==='Explain'&&<details className="slw-section"><summary>Explore equation symbols in the apparatus</summary><p>Select a symbol to outline matching labels in the apparatus. The full symbol definitions remain in the units drawer.</p><div className="slw-actions">{[...new Set(chapter.equation.match(/[\p{L}][\p{L}\p{N}₀-₉]*/gu)??[])].slice(0,24).map(symbol=><button key={symbol} onClick={()=>{const count=locateLabSymbol(symbol);setMessage(count?`${symbol}: ${count} matching apparatus labels outlined.`:`${symbol}: see the symbol definitions; there is no matching apparatus label in this view.`);}}>{symbol}</button>)}</div></details>}
      <details className="slw-section" open><summary>Live controls &amp; evidence</summary><p>These values come from this page’s exposed controls and displayed readouts. They are not independent experimental measurements.</p><button onClick={()=>{refresh();setMessage('Controls and displayed evidence refreshed.');}}>Refresh evidence</button>
        <details><summary>Precise controls</summary><div className="slw-control-grid">{snapshot?.controls.map(c=><ControlEditor key={c.key} control={c} change={value=>{setUndo(captureLab(route));if(!setLabControl(c.key,value))setMessage('Value is invalid, unavailable or locked.');refresh();}} focus={()=>locateLabQuantity(c.label,true)}/>)}</div></details>
        {readings.length>0?<><div className="slw-table"><table><caption>Current displayed evidence{compare?' and pinned baseline':''}</caption><thead><tr><th>Quantity</th><th>Current</th>{compare&&<th>Baseline</th>}</tr></thead><tbody>{readings.map((r,i)=><tr key={`${r.label}-${i}`} className={inspected===i?'slw-inspected':''}><th><button onClick={()=>setInspected(i)} aria-pressed={inspected===i}>{r.label}</button></th><td>{r.value}</td>{compare&&<td>{compare.readings.find(x=>x.label===r.label)?.value??'Not recorded'}</td>}</tr>)}</tbody></table></div><p><strong>Inspect:</strong> {readings[inspected]?.label}: {readings[inspected]?.value}</p></>:<p>This page has no exposed textual readouts in this view. Record a note describing the labeled apparatus; no values are invented.</p>}
        <div className="slw-actions"><button onClick={()=>{patch({baseline:{...refresh(),preview:captureLabPreview()}});setMessage('Baseline pinned. New controls can now be compared with it.');}}>Pin current baseline</button><button disabled={!compare} onClick={()=>compare&&restore(compare)}>Restore baseline controls</button><button disabled={!undo} onClick={()=>{if(undo){const previous=undo;setUndo(null);const result=restoreLab(previous,route);refresh();setMessage(`${result.applied} exposed controls restored by undo.`);}}}>Undo control restore/change</button></div>
        {compare&&<details><summary>Visual comparison</summary><button onClick={()=>{setVisual(captureLabPreview());setMessage('Visual capture requested. If the renderer has no readable frame, use the labeled evidence table.');}}>Capture current visual</button><div className="slw-visual-pair"><figure><figcaption>Pinned baseline</figcaption>{safeLabPreview(compare.preview)?<img src={safeLabPreview(compare.preview)} alt="Apparatus or graph at the pinned baseline; labeled numerical values are in the comparison table."/>:<p>No readable frame was available. Baseline values remain in the comparison table.</p>}</figure><figure><figcaption>Current capture</figcaption>{visual?<img src={visual} alt="Current apparatus or graph capture; compare its labeled values in the evidence table."/>:<p>Capture the current view after changing a setting.</p>}</figure></div><p>Captures show the first available canvas or graph, with its current camera and scale. They are visual records, not a second live simulation.</p></details>}
        <p className="slw-reference">Baseline restore and shared setups cover exposed inputs only. Hidden solver, camera and button-only choices may require setting in the apparatus. Current page Reset retains the notebook.</p>
      </details>
      <details className="slw-section"><summary>Trial notebook ({book.trials.length})</summary><button onClick={record}>Record current trial</button>{book.trials.map((t,i)=><article className="slw-trial" key={t.id}><h4>Trial {i+1} · {new Date(t.snapshot.at).toLocaleTimeString()}</h4><p>{t.note||'No observation note recorded.'}</p><details><summary>Recorded controls and evidence</summary><ul>{t.snapshot.controls.map(c=><li key={c.key}>{c.label}: {c.value}</li>)}{t.snapshot.readings.map((r,j)=><li key={j}>{r.label}: {r.value}</li>)}</ul></details><button onClick={()=>restore(t.snapshot)}>Restore trial controls</button><button onClick={()=>{setRemoved(t);patch({trials:book.trials.filter(x=>x.id!==t.id)});}}>Remove trial {i+1}</button></article>)}{removed&&<button onClick={()=>{patch({trials:[...book.trials,removed].slice(-40)});setRemoved(null);}}>Undo trial removal</button>}</details>
      <details className="slw-section"><summary>Display preferences</summary><label><input type="checkbox" checked={simple} onChange={e=>setSimple(e.target.checked)}/>Simplify decorative effects</label><label><input type="checkbox" checked={essential} onChange={e=>setEssential(e.target.checked)}/>Essential graph view: hide in-graph text annotations</label><label><input type="checkbox" checked={contrast} onChange={e=>setContrast(e.target.checked)}/>Emphasize labels and focus</label><label><input type="checkbox" checked={reduced} onChange={e=>setReduced(e.target.checked)}/>Reduce interface motion</label><button onClick={()=>{const button=[...(labRoot()?.querySelectorAll<HTMLButtonElement>('button')??[])].find(b=>!b.disabled&&(/^Pause(?:\s|$)/i.test(b.getAttribute('aria-label')??'')||/^(?:Ⅱ\s*)?Pause$/i.test(b.textContent?.trim()??'')));if(button){button.click();setMessage('Apparatus paused.');}else setMessage('No active Pause control is exposed in this view. Use the apparatus playback controls if available.');}}>Pause apparatus</button><p>Graph legends, units and recorded values remain available in the evidence table. Restore the detailed view before interpreting an unlabeled graph.</p></details>
      <div className="slw-actions"><button onClick={exportBook}>Export notebook JSON</button><button onClick={()=>downloadEvidenceImage(lab?.title??'Lab',refresh())}>Export evidence image</button><button onClick={share}>Copy setup link</button><button onClick={()=>window.print()}>Print learning summary</button></div>
      <details className="slw-section"><summary>Session recap &amp; next lab</summary><p><strong>Investigated:</strong> {ux.evidence}.</p><p><strong>Your prediction:</strong> {book.prediction||'Not recorded yet.'}</p><p><strong>Evidence collected:</strong> {book.trials.length} saved trials.</p><p>{chapter.core}</p>{next&&<Link to={next.route}>Continue in {studio?.name}: {next.title} →</Link>}<p>The next lab explores another part of {studio?.name.toLowerCase()}; compare its governing relationship with {chapter.equation}.</p></details>
      <p className="slw-status" role="status" aria-live="polite">{message||'Notebook stays on this device. Export a copy to keep or share it.'}</p>
    </section>}
  </div>;
}

function ControlEditor({control:c,change,focus}:{control:LabSnapshot['controls'][number];change:(value:string)=>void;focus:()=>void}) {
  const [value,setValue]=useState(c.value);
  useEffect(()=>setValue(c.value),[c.value]);
  const numeric=c.type==='range'||c.type==='number';
  const bump=(sign:number)=>{const scientific=c.value.match(/\.([0-9]+)e([+-]?\d+)/i);const resolution=scientific?10**(Number(scientific[2])-scientific[1].length):0;const increment=Math.max(resolution,Number(c.step)||(Math.abs(Number(c.value))>0?Math.abs(Number(c.value))*.01:1));const n=Number(c.value)+sign*increment;change(String(Number(Math.max(c.min!==''?Number(c.min):-Infinity,Math.min(c.max!==''?Number(c.max):Infinity,n)).toPrecision(12))));};
  return <div className="slw-control"><label>{c.label}{c.options?<select value={c.value} disabled={c.disabled} onChange={e=>change(e.target.value)}>{c.options.map(o=><option key={o} value={o}>{o}</option>)}</select>:['checkbox','radio'].includes(c.type)?<input type="checkbox" checked={c.value==='true'} disabled={c.disabled} onChange={e=>change(String(e.target.checked))}/>:<input aria-label={`${c.label} precise value`} type="number" value={value} min={c.min} max={c.max} step={c.step||'any'} disabled={c.disabled} onChange={e=>setValue(e.target.value)} onBlur={()=>{if(value!==c.value)change(value);}} onKeyDown={e=>{if(e.key==='Enter')change(value);}}/>}</label>{numeric&&<div><button aria-label={`Decrease ${c.label}`} disabled={c.disabled} onClick={()=>bump(-1)}>−</button><button aria-label={`Increase ${c.label}`} disabled={c.disabled} onClick={()=>bump(1)}>+</button></div>}<small>{c.disabled?'Locked':numeric?`Range ${c.min||'unbounded'} to ${c.max||'unbounded'}; step ${c.step||'any'}`:'Available choices from the apparatus'}</small><button onClick={focus}>Locate in apparatus</button></div>;
}
