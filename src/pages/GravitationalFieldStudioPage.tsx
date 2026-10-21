import {StudioLabNav} from '../components/StudioLabNav';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NumberInput } from "../components/NumberInput";
import { MasteryChallengeDialog } from "../components/MasteryChallengeDialog";
import { GravitationalFieldScene, InverseSquareGraph, fieldProbe, type FieldView } from "../components/GravitationalFieldScene";
import { FIELD_DEFAULTS, fieldSettings, fieldSolution, type FieldInput } from "../lib/fieldStudio";
import "../friction-studio.css";
import "./gravitational-field.css";

function Control({ label, value, min, max, unit, logarithmic=false, onChange }: {label:string;value:number;min:number;max:number;unit:string;logarithmic?:boolean;onChange:(n:number)=>void}) {
 return <label className="gfield-control"><span>{label}<NumberInput aria-label={label+" value"} type="number" min={min} max={max} step={logarithmic?"any":1} value={value} onChange={e=>onChange(Number(e.target.value))}/><small>{unit}</small></span><input aria-label={label} type="range" min={logarithmic?Math.log10(min):min} max={logarithmic?Math.log10(max):max} step={logarithmic ? .01 : 1} value={logarithmic?Math.log10(value):value} onChange={e=>onChange(logarithmic?10**Number(e.target.value):Number(e.target.value))}/><small><i>{logarithmic?min.toExponential(0):min}</i><i>{logarithmic?max.toExponential(0):max}</i></small></label>;
}

export default function GravitationalFieldStudioPage() {
 const [input,setInput]=useState(FIELD_DEFAULTS),[view,setView]=useState<FieldView>("Field View"),[panel,setPanel]=useState<string|null>(null),[zoom,setZoom]=useState(1),[time,setTime]=useState(0),[running,setRunning]=useState(false),[answer,setAnswer]=useState("");
 const s=fieldSolution(input),probe=fieldProbe(input,time);
 useEffect(()=>{if(!running)return;const start=performance.now(),initial=time;let id:number;const frame=(now:number)=>{setTime(initial+(now-start)/1000*1000);id=requestAnimationFrame(frame)};id=requestAnimationFrame(frame);return()=>cancelAnimationFrame(id)},[running]);
 const update=(patch:Partial<FieldInput>)=>{setInput(fieldSettings({...input,...patch}));setTime(0);setRunning(false)};
 const reset=()=>{setInput(FIELD_DEFAULTS);setView("Field View");setZoom(1);setTime(0);setRunning(false);setAnswer("");setPanel(null)};
 const open=(name:string)=>{setRunning(false);setAnswer("");setPanel(name==="Observe"?null:name)};
 const controls=<><Control label="Planet Mass M" value={input.mass} min={1e23} max={1e26} unit="kg" logarithmic onChange={mass=>update({mass})}/><Control label="Probe Radius r" value={input.radius} min={1e6} max={1e9} unit="m" logarithmic onChange={radius=>update({radius})}/><Control label="Vector Density" value={input.density} min={5} max={40} unit="" onChange={density=>update({density})}/></>;
 return <div className="frs-page gravitational-field-page" data-ui-theme="dark"><aside className="frs-side"><Link className="frs-brand" to="/concept-studio/gravitation">⚛ PHYSICS STUDIO</Link><StudioLabNav studioId="gravitation"/></aside><main id="content" className="frs-main gfield-main">
 <header className="gfield-header"><h1>GRAVITATION — GRAVITATIONAL FIELD</h1><p>Explore the gravitational field around a massive body.</p></header>
 <div className="gfield-mode-row"><nav className="gfield-modes" aria-label="Learning modes">{["Observe","Predict","Experiment","Explain"].map(mode=><button key={mode} aria-pressed={(panel??"Observe")===mode} onClick={()=>open(mode)}>{mode}</button>)}</nav><nav className="gfield-views" aria-label="Field views">{(["Field View","Potential View","Trajectories"] as FieldView[]).map(name=><button key={name} aria-pressed={view===name} onClick={()=>setView(name)}>{name}</button>)}</nav></div>
 <div className="gfield-layout"><section className="gfield-scene" aria-label="Gravitational field apparatus"><GravitationalFieldScene input={input} view={view} time={time} zoom={zoom}/></section>
 <aside className="gfield-inspector"><section className="gfield-panel"><h2>CONTROLS</h2>{controls}</section>
 <section className="gfield-panel gfield-readings"><h2>LIVE READINGS (AT PROBE)</h2><dl><div><dt>Field Strength |g|</dt><dd data-field-reading="">{s.g.toFixed(3)} m/s²</dd></div><div><dt>Direction θ (from +x)</dt><dd>{probe.direction.toFixed(1)}°</dd></div><div><dt>Position (x, y)</dt><dd>({probe.x.toExponential(2)}, {probe.y.toExponential(2)}) m</dd></div><div><dt>Gravitational Potential Φ</dt><dd>{s.phi.toExponential(2)} J/kg</dd></div></dl></section>
 <section className="gfield-panel gfield-equation"><h2>EQUATION</h2><b>g(r) = GM / r²</b><small>G = 6.674 × 10⁻¹¹ m³ kg⁻¹ s⁻²</small></section>
 <section className="gfield-panel gfield-graph"><h2>INVERSE-SQUARE LAW</h2><InverseSquareGraph input={input}/></section></aside>
 <div className="gfield-actions"><button aria-label="Reset" onClick={reset}>↻ Reset</button><button aria-label={running?"Pause":"Play"} onClick={()=>setRunning(v=>!v)}>{running?"Ⅱ Pause":"▷ Play"}</button><label>Zoom<input aria-label="Zoom" type="range" min=".6" max="1.5" step=".05" value={zoom} onChange={e=>setZoom(Number(e.target.value))}/></label><button className="gfield-next" onClick={()=>open("Challenge")}>Next Challenge →</button></div></div>
 <footer className="gfield-footer">M = {input.mass.toExponential(2)} kg　 r = {input.radius.toExponential(2)} m　 |g| = {s.g.toFixed(3)} m/s²　 θ = {probe.direction.toFixed(1)}° <span>t = {time.toFixed(0)} s · playback: 1000 simulated s / real s</span></footer>
 </main>{panel&&<MasteryChallengeDialog title={panel} close={()=>setPanel(null)}>{panel==="Explain"?<><p>A positive point mass produces an inward gravitational field with magnitude GM/r². Its potential is −GM/r, taking zero at infinity.</p><p>The planet is a visual marker, not a body drawn to physical scale. This model represents a point source; it does not model the interior density of Earth. Arrow lengths use a logarithmic display scale.</p><p>The trajectory is an ideal circular orbit at speed √(GM/r). The particle has negligible mass.</p></>:panel==="Experiment"?<><p>Change the mass and radius, then compare the vectors, potential contours and live graph.</p>{controls}</>:<><p>Keep the mass fixed and double the probe radius. What fraction of the original field strength remains?</p>{[["One quarter","quarter"],["One half","half"],["Twice as much","double"]].map(([label,value])=><button key={value} aria-pressed={answer===value} onClick={()=>setAnswer(value)}>{label}</button>)}{answer&&<p role="status">{answer==="quarter"?"Correct. Doubling r divides GM/r² by four.":"Try again: square the factor by which the radius changes."}</p>}</>}</MasteryChallengeDialog>}</div>;
}
