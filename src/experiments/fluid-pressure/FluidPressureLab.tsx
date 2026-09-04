import { useEffect, useMemo, useState, type PointerEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { ATMOSPHERIC_PRESSURE_KPA, solveFluidPressure, type FluidPressureInput, type VesselShape } from "./fluidPressurePhysics";
import "./fluid-pressure.css";

type RunState = "idle" | "running" | "paused" | "result";
const DEFAULT: FluidPressureInput = { density: 1025, depthM: 0.75, gravity: 9.80665, surfacePressureKPa: ATMOSPHERIC_PRESSURE_KPA, vesselShape: "cylinder" };
const fmt = (value: number, digits = 2) => value.toFixed(digits);

export function FluidPressureLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(DEFAULT);
  const [runState, setRunState] = useState<RunState>("idle");
  const [speed, setSpeed] = useState(1);
  const [phase, setPhase] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  const [dragging, setDragging] = useState(false);
  const [probeBDepth, setProbeBDepth] = useState(1.25);
  const [mission, setMission] = useState(false);
  const [feedback, setFeedback] = useState("");
  const result = useMemo(() => solveFluidPressure(input), [input]);
  const pressureB = input.density * input.gravity * probeBDepth;

  useEffect(() => {
    if (runState !== "running") return;
    const timer = window.setInterval(() => setPhase((old) => {
      const next = Math.min(100, old + speed * 0.8);
      if (next >= 100) setRunState("result");
      return next;
    }), reducedMotion ? 160 : 40);
    return () => window.clearInterval(timer);
  }, [runState, speed, reducedMotion]);

  const update = (patch: Partial<FluidPressureInput>) => { setInput((old) => ({ ...old, ...patch })); setFeedback(""); };
  const reset = () => { setInput(DEFAULT); setProbeBDepth(1.25); setRunState("idle"); setPhase(0); setMission(false); setFeedback(""); };
  const startMission = () => { setMission(true); setInput({ ...DEFAULT, vesselShape: "narrow", depthM: 0.6 }); setProbeBDepth(1.4); setFeedback("Match probe B in the tapered vessel to probe A's depth, then compare."); };
  const checkMission = () => {
    const difference = Math.abs(result.gaugePressurePa - pressureB);
    const pass = Math.abs(input.depthM - probeBDepth) <= 0.01 && difference <= 0.1;
    setFeedback(pass ? `✓ Equal depth, equal pressure: both probes read ${fmt(result.gaugePressurePa / 1000, 3)} kPa despite different vessel shapes.` : `Not equal yet: A is ${fmt(input.depthM)} m and B is ${fmt(probeBDepth)} m; pressure differs by ${fmt(difference / 1000, 3)} kPa.`);
    if (pass) setRunState("result");
  };
  const dragProbe = (event: PointerEvent<SVGGElement>) => {
    if (!dragging) return;
    const box = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const y = ((event.clientY - box.top) / box.height) * 1024;
    update({ depthM: Math.max(0, Math.min(2, (y - 215) / 300)) });
    setRunState("paused");
  };
  const probeY = 215 + input.depthM * 300;
  const fill = reducedMotion ? 1 : Math.min(1, phase / 25);
  const reveal = reducedMotion ? 1 : Math.max(0, Math.min(1, (phase - 20) / 25));
  const jetReveal = reducedMotion ? 1 : Math.max(0, Math.min(1, (phase - 45) / 20));
  const vesselX = input.vesselShape === "narrow" ? 270 : input.vesselShape === "cylinder" ? 625 : 1010;

  return <section className="pressure-lab" aria-label={`${experiment.title} interactive laboratory`}>
    <header className="pressure-head"><div><span>HYDROSTATICS · CLASS 8 / 11</span><h2>Pressure-with-Depth Bench</h2><p>Move the probe, compare vessel shapes, and watch deeper holes launch faster jets.</p></div><button onClick={reset}>↻ Reset experiment</button></header>
    <div className="pressure-layout">
      <aside className="pressure-controls" aria-label="Hydrostatic pressure controls"><h3>Fluid & planet</h3>
        <Control label="Fluid density ρ" aria="Fluid density" value={input.density} min={500} max={1500} step={25} unit="kg/m³" onChange={(value) => update({ density: value })}/>
        <Control label="Probe depth h" aria="Probe depth" value={input.depthM} min={0} max={2} step={0.05} unit="m" onChange={(value) => update({ depthM: value })}/>
        <Control label="Gravity g" aria="Gravity" value={input.gravity} min={1.62} max={24.79} step={0.01} unit="m/s²" onChange={(value) => update({ gravity: value })}/>
        <h3>Vessel shape</h3><div className="shape-select">{(["narrow", "cylinder", "tapered"] as VesselShape[]).map((shape) => <button key={shape} className={input.vesselShape === shape ? "active" : ""} onClick={() => update({ vesselShape: shape })}>{shape}</button>)}</div>
        <section className="pressure-equation"><b>P = P₀ + ρgh</b><span>{fmt(input.surfacePressureKPa, 3)} + ({input.density} × {fmt(input.gravity, 2)} × {fmt(input.depthM, 2)})/1000</span></section>
      </aside>
      <main className="pressure-main"><div className="pressure-toolbar"><div><button onClick={() => setRunState("running")} disabled={runState === "running"}>▶ Fill & reveal</button><button onClick={() => setRunState("paused")} disabled={runState === "paused"}>Ⅱ Pause</button><button onClick={() => { setRunState("paused"); setPhase((old) => Math.min(100, old + 5)); }}>▷ Step</button></div><label>Speed <select aria-label="Playback speed" value={speed} onChange={(event) => setSpeed(Number(event.target.value))}><option value="0.25">0.25×</option><option value="0.5">0.5×</option><option value="1">1×</option><option value="2">2×</option></select></label><label><input aria-label="Reduced motion" type="checkbox" checked={reducedMotion} onChange={(event) => setReducedMotion(event.target.checked)}/> Reduced motion</label></div>
        <section className="pressure-stage" aria-label="Three differently shaped vessels with a movable pressure probe and animated jets"><img src="/assets/experiments/fluid-pressure/hydrostatic-vessels.png" alt="Transparent connected hydrostatic vessels and U-tube manometer" style={{ opacity: 0.28 + 0.72 * fill }}/><svg viewBox="0 0 1536 1024" role="img" aria-label={`Probe at ${fmt(input.depthM)} metres reads ${fmt(result.gaugePressurePa / 1000)} kilopascals gauge in a ${input.vesselShape} vessel`}>
          <defs><linearGradient id="pressure-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#65d9ff" stopOpacity="0"/><stop offset="1" stopColor="#0d4fae" stopOpacity={0.7 * reveal}/></linearGradient></defs><rect className="gradient" x="205" y="205" width="1040" height="600" fill="url(#pressure-gradient)" opacity={reveal}/>
          <g className="probe" role="slider" aria-label="Move pressure probe" aria-valuemin={0} aria-valuemax={2} aria-valuenow={input.depthM} tabIndex={0} transform={`translate(${vesselX} ${probeY})`} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); }} onPointerMove={dragProbe} onPointerUp={(event) => { event.currentTarget.releasePointerCapture(event.pointerId); setDragging(false); }} onKeyDown={(event) => { if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); update({ depthM: Math.max(0, Math.min(2, input.depthM + (event.key === "ArrowDown" ? 0.05 : -0.05))) }); } }}><line x1="-70" x2="70"/><circle r="14"/><text x="24" y="-18">{fmt(result.gaugePressurePa / 1000)} kPa</text></g>
          {[310, 620, 1010].map((x) => <g className="equal-marker" key={x} transform={`translate(${x} ${probeY})`} opacity={reveal}><circle r="7"/><line x1="-25" x2="25"/></g>)}
          <g className="normal-arrows" opacity={reveal}><path d="M455 520h-75l20-14m-20 14 20 14M805 600h75l-20-14m20 14-20 14M1080 500l55-44-24 2m24-2-7 23"/></g>
          <g className="jets" opacity={jetReveal}>{result.jets.map((jet, index) => { const y = 420 + index * 130; const range = jet.rangeM * 145; return <g key={jet.depthM}><circle cx="1225" cy={y} r="7"/><path d={`M1230 ${y} Q ${1230 + range * .55} ${y + 10} ${1230 + range} 825`}/><text x="1170" y={y - 15}>{fmt(jet.depthM, 1)} m · {fmt(jet.exitSpeed)} m/s</text></g>; })}</g>
        </svg><div className="pressure-readout"><b>{fmt(result.absolutePressurePa / 1000, 3)} kPa absolute</b><span>{fmt(result.gaugePressurePa / 1000, 3)} kPa gauge</span><span>Δh = {fmt(result.manometerHeadM, 2)} m</span></div></section>
        <section className="pressure-chart" aria-label="Pressure versus depth graph"><header><b>Gauge pressure vs depth</b><span>linear slope ρg = {fmt(input.density * input.gravity, 1)} Pa/m</span></header><svg viewBox="0 0 500 145"><line x1="42" y1="120" x2="480" y2="120"/><line x1="42" y1="15" x2="42" y2="120"/><line className="plot" x1="42" y1="120" x2="480" y2="20"/><circle cx={42 + input.depthM / 2 * 438} cy={120 - input.depthM / 2 * 100} r="5"/><text x="235" y="140">Depth h</text><text x="5" y="18">Pg</text></svg></section>
      </main>
      <aside className="pressure-analysis" aria-label="Live pressure measurements"><h3>Live measurements</h3><Reading label="Probe depth" value={`${fmt(input.depthM)} m`}/><Reading label="Gauge pressure" value={`${fmt(result.gaugePressurePa / 1000, 3)} kPa`} hot/><Reading label="Absolute pressure" value={`${fmt(result.absolutePressurePa / 1000, 3)} kPa`}/><Reading label="Hatch force (0.12 m²)" value={`${fmt(result.hatchForceN / 1000, 2)} kN`}/><section className="shape-proof"><b>Shape independence</b>{result.equalDepthPressuresPa.map((pressure, index) => <span key={index}>{["Narrow", "Cylinder", "Tapered"][index]}: {fmt(pressure / 1000, 3)} kPa</span>)}</section><section className="normal-proof"><b>Surface force</b><span>Pressure acts perpendicular (normal) to every vessel wall.</span></section></aside>
    </div>
    <section className="pressure-mission" aria-label="Equal depth comparison mission"><div><span>CHALLENGE</span><b>Match pressure across different vessel shapes.</b><small>Move probe B in the tapered vessel to the same depth as probe A.</small></div><button onClick={startMission}>Start challenge</button>{mission && <Control label="Probe B depth" aria="Probe B depth" value={probeBDepth} min={0} max={2} step={0.05} unit="m" onChange={(value) => { setProbeBDepth(value); setFeedback(""); }}/>} {mission && <button onClick={() => setProbeBDepth(input.depthM)}>Match equal depth</button>}{mission && <button onClick={checkMission}>Compare readings</button>}<output aria-live="polite">{feedback}</output></section>
  </section>;
}

function Reading({ label, value, hot = false }: { label: string; value: string; hot?: boolean }) { return <div className={hot ? "pressure-reading hot" : "pressure-reading"}><span>{label}</span><strong>{value}</strong></div>; }
function Control({ label, aria, value, min, max, step, unit, onChange }: { label: string; aria: string; value: number; min: number; max: number; step: number; unit: string; onChange: (value: number) => void }) { return <label className="pressure-control"><span>{label}<strong>{value} {unit}</strong></span><input aria-label={aria} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))}/><small>{min} — {max} {unit}</small></label>; }
