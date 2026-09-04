import { useEffect, useMemo, useState, type PointerEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { animatedImmersion, solveBuoyancy, type BuoyancyInput } from "./buoyancySimulation";
import "./buoyancy.css";

type RunState = "idle" | "running" | "paused" | "result";
const DEFAULT: BuoyancyInput = { objectDensity: 650, fluidDensity: 1000, volumeCm3: 250, immersionFraction: 0.35 };
const fmt = (n: number, d = 2) => n.toFixed(d);

export function BuoyancyLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(DEFAULT);
  const [runState, setRunState] = useState<RunState>("idle");
  const [speed, setSpeed] = useState(1);
  const [time, setTime] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  const [dragging, setDragging] = useState(false);
  const [mission, setMission] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [feedback, setFeedback] = useState("");
  const result = useMemo(() => solveBuoyancy(input), [input]);

  useEffect(() => {
    if (runState !== "running") return;
    const timer = window.setInterval(() => {
      setTime((old) => {
        const next = Math.min(8, old + 0.04 * speed);
        setInput((current) => ({ ...current, immersionFraction: animatedImmersion(next, Math.min(current.objectDensity / current.fluidDensity, 1), reducedMotion) }));
        if (next >= 8) setRunState("result");
        return next;
      });
    }, 40);
    return () => window.clearInterval(timer);
  }, [runState, speed, reducedMotion]);

  const update = (patch: Partial<BuoyancyInput>) => { setInput((old) => ({ ...old, ...patch })); setFeedback(""); };
  const reset = () => { setInput(DEFAULT); setRunState("idle"); setTime(0); setMission(false); setPrediction(""); setFeedback(""); };
  const play = () => { if (time >= 8) setTime(0); setRunState("running"); };
  const step = () => {
    const next = Math.min(8, time + 0.25);
    setTime(next);
    update({ immersionFraction: animatedImmersion(next, Math.min(input.objectDensity / input.fluidDensity, 1), reducedMotion) });
    setRunState(next >= 8 ? "result" : "paused");
  };
  const startMission = () => { setMission(true); setInput({ objectDensity: 720, fluidDensity: 1200, volumeCm3: 300, immersionFraction: 0.2 }); setPrediction(""); setFeedback("Predict the floating fraction before testing this object."); setRunState("idle"); setTime(0); };
  const testPrediction = () => {
    const guessed = Number(prediction) / 100;
    if (!Number.isFinite(guessed) || prediction.trim() === "") { setFeedback("Enter a prediction from 0% to 100%."); return; }
    const actual = result.floatingFraction;
    setInput((old) => ({ ...old, immersionFraction: Math.min(actual, 1) }));
    setRunState("result");
    setFeedback(Math.abs(guessed - actual) <= 0.02 ? `✓ Prediction confirmed: ρobject/ρfluid = 720/1200 = ${fmt(actual * 100, 1)}%. At this immersion Fb = W.` : `Measured ${fmt(actual * 100, 1)}%. Use ρobject/ρfluid = 720/1200, then try ${fmt(actual * 100, 0)}%.`);
  };
  const dragObject = (event: PointerEvent<SVGGElement>) => {
    if (!dragging) return;
    const box = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const y = ((event.clientY - box.top) / box.height) * 1024;
    update({ immersionFraction: Math.max(0, Math.min(1, (y - 555) / 190)) });
  };
  const objectSize = 88 * Math.cbrt(input.volumeCm3 / 250);
  const objectY = 555 + input.immersionFraction * 190;
  const arrowScale = Math.max(result.weightN, result.buoyantForceN, 0.1);
  const status = result.state === "held" ? (result.netForceN > 0 ? "Rises if released" : "Falls if released") : result.state.toUpperCase();
  const graph = Array.from({ length: 11 }, (_, i) => { const f = i / 10; const r = solveBuoyancy({ ...input, immersionFraction: f }); return { f, fb: r.buoyantForceN, w: r.weightN }; });

  return <section className="buoyancy-lab" data-run-state={runState} aria-label={`${experiment.title} interactive laboratory`}>
    <header className="buoyancy-head"><div><span>ARCHIMEDES’ PRINCIPLE · FLUID MECHANICS</span><h2>Buoyancy Balance Bench</h2><p>Drag the object through the water and resolve displaced-fluid force against weight.</p></div><button onClick={reset}>↻ Reset experiment</button></header>
    <div className="buoyancy-layout">
      <aside className="buoyancy-controls" aria-label="Buoyancy controls">
        <h3>1 · Object</h3>
        <Control label="Object density ρobject" aria="Object density" value={input.objectDensity} min={100} max={8000} step={50} unit="kg/m³" onChange={(v) => update({ objectDensity: v })} />
        <Control label="Object volume V" aria="Object volume" value={input.volumeCm3} min={20} max={500} step={10} unit="cm³" onChange={(v) => update({ volumeCm3: v })} />
        <h3>2 · Fluid</h3>
        <Control label="Fluid density ρfluid" aria="Fluid density" value={input.fluidDensity} min={500} max={1500} step={25} unit="kg/m³" onChange={(v) => update({ fluidDensity: v })} />
        <h3>3 · Immersion</h3>
        <Control label="Immersed fraction" aria="Immersion depth" value={Math.round(input.immersionFraction * 100)} min={0} max={100} step={1} unit="%" onChange={(v) => { setRunState("paused"); update({ immersionFraction: v / 100 }); }} />
        <div className="density-presets"><button onClick={() => update({ objectDensity: 450, fluidDensity: 1000 })}>Cork-like</button><button onClick={() => update({ objectDensity: 1000, fluidDensity: 1000 })}>Neutral</button><button onClick={() => update({ objectDensity: 2700, fluidDensity: 1000 })}>Aluminum</button></div>
      </aside>
      <main className="buoyancy-main">
        <div className="buoyancy-toolbar"><div><button onClick={play} disabled={runState === "running"}>▶ Play</button><button onClick={() => setRunState("paused")} disabled={runState === "paused"}>Ⅱ Pause</button><button onClick={step}>▷ Step</button></div><label>Speed <select aria-label="Playback speed" value={speed} onChange={(e) => setSpeed(Number(e.target.value))}><option value="0.25">0.25×</option><option value="0.5">0.5×</option><option value="1">1×</option><option value="2">2×</option></select></label><label><input aria-label="Reduced motion" type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} /> Reduced motion</label></div>
        <section className="buoyancy-stage" aria-label="Two-dimensional buoyancy tank with draggable test object">
          <img src="/assets/experiments/buoyancy/buoyancy-bench.png" alt="Transparent buoyancy tank, spring scale, graduated cylinder and bench scale" />
          <svg viewBox="0 0 1536 1024" role="img" aria-label={`${fmt(input.immersionFraction * 100, 0)} percent immersed; buoyant force ${fmt(result.buoyantForceN)} newtons; weight ${fmt(result.weightN)} newtons`}>
            <g className="test-object" role="slider" aria-label="Drag object vertically" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(input.immersionFraction * 100)} tabIndex={0} transform={`translate(690 ${objectY})`} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); setRunState("paused"); }} onPointerMove={dragObject} onPointerUp={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); setDragging(false); }} onKeyDown={(e) => { if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); update({ immersionFraction: Math.max(0, Math.min(1, input.immersionFraction + (e.key === "ArrowDown" ? 0.02 : -0.02))) }); } }}>
              <line className="hanger" x1="0" y1={-objectY + 430} x2="0" y2={-objectSize / 2} />
              <rect x={-objectSize / 2} y={-objectSize / 2} width={objectSize} height={objectSize} rx="8" /><text y="7">{fmt(input.objectDensity / 1000, 2)} g/cm³</text>
              <g className="force up" transform={`translate(${objectSize * .72} 0)`}><line y1="0" y2={-45 - 85 * result.buoyantForceN / arrowScale} /><path d={`M-10 ${-35 - 85 * result.buoyantForceN / arrowScale} L0 ${-50 - 85 * result.buoyantForceN / arrowScale} L10 ${-35 - 85 * result.buoyantForceN / arrowScale}`} /><text x="15" y={-50 - 85 * result.buoyantForceN / arrowScale}>Fb {fmt(result.buoyantForceN)} N</text></g>
              <g className="force down" transform={`translate(${-objectSize * .72} 0)`}><line y1="0" y2={45 + 85 * result.weightN / arrowScale} /><path d={`M-10 ${35 + 85 * result.weightN / arrowScale} L0 ${50 + 85 * result.weightN / arrowScale} L10 ${35 + 85 * result.weightN / arrowScale}`} /><text x="-15" y={65 + 85 * result.weightN / arrowScale}>W {fmt(result.weightN)} N</text></g>
            </g><line className="live-waterline" x1="315" y1="650" x2="1125" y2="650" />
          </svg>
          <div className="stage-readout"><b>{status}</b><span>Drag object ↑↓ or use arrow keys</span><span>Vdisplaced = {fmt(result.displacedVolumeCm3, 1)} cm³</span></div>
        </section>
        <section className="buoyancy-equation"><span>Archimedes’ principle</span><b>Fb = ρfluid g Vdisplaced</b><em>{input.fluidDensity} × 9.80665 × {result.displacedVolumeM3.toExponential(3)} = {fmt(result.buoyantForceN)} N</em></section>
        <section className="force-graph" aria-label="Force versus immersion graph"><header><b>Force vs immersed fraction</b><span>blue Fb · red W</span></header><svg viewBox="0 0 500 160"><line x1="42" y1="130" x2="480" y2="130"/><line x1="42" y1="15" x2="42" y2="130"/><polyline className="weight-line" points={graph.map((p) => `${42 + p.f * 438},${130 - p.w / arrowScale * 105}`).join(" ")} /><polyline className="float-line" points={graph.map((p) => `${42 + p.f * 438},${130 - p.fb / arrowScale * 105}`).join(" ")} /><circle cx={42 + input.immersionFraction * 438} cy={130 - result.buoyantForceN / arrowScale * 105} r="5"/><text x="245" y="154">Immersed fraction</text><text x="4" y="18">Force</text></svg></section>
      </main>
      <aside className="buoyancy-analysis" aria-label="Live buoyancy measurements">
        <h3>Live measurements</h3><Reading label="Weight in air, W" value={`${fmt(result.weightN)} N`} /><Reading label="Buoyant force, Fb" value={`${fmt(result.buoyantForceN)} N`} hot /><Reading label="Apparent weight" value={`${fmt(result.apparentWeightN)} N`} /><Reading label="Displaced volume" value={`${fmt(result.displacedVolumeCm3, 1)} cm³`} /><Reading label="Object density" value={`${fmt(input.objectDensity / 1000, 3)} g/cm³`} /><Reading label="Fluid density" value={`${fmt(input.fluidDensity / 1000, 3)} g/cm³`} />
        <section className={`balance-card ${Math.abs(result.netForceN) < .01 ? "balanced" : "unbalanced"}`}><b>{Math.abs(result.netForceN) < .01 ? "✓ FORCES BALANCED" : result.netForceN > 0 ? "↑ NET FORCE UP" : "↓ NET FORCE DOWN"}</b><span>ΣFy = Fb − W = {fmt(result.netForceN)} N</span></section>
        <section className="fraction-card"><span>Free-floating prediction</span><b>ρobject / ρfluid = {fmt(result.floatingFraction * 100, 1)}%</b><small>{result.floatingFraction <= 1 ? "This fraction submerges at equilibrium." : "Ratio exceeds 100%: the object sinks."}</small></section>
      </aside>
    </div>
    <section className="buoyancy-mission" aria-label="Floating fraction prediction mission"><div><span>CHALLENGE</span><b>Predict, then test the floating fraction.</b><small>Find the submerged percentage for an unknown pairing.</small></div><button onClick={startMission}>Start prediction</button>{mission && <label>Your prediction <input aria-label="Floating fraction prediction" type="number" min="0" max="100" value={prediction} onChange={(e) => setPrediction(e.target.value)} /> %</label>}{mission && <button onClick={testPrediction}>Test prediction</button>}<output aria-live="polite">{feedback}</output></section>
  </section>;
}

function Reading({ label, value, hot = false }: { label: string; value: string; hot?: boolean }) { return <div className={`buoyancy-reading ${hot ? "hot" : ""}`}><span>{label}</span><strong>{value}</strong></div>; }
function Control({ label, aria, value, min, max, step, unit, onChange }: { label: string; aria: string; value: number; min: number; max: number; step: number; unit: string; onChange: (value: number) => void }) { return <label className="buoyancy-control"><span>{label}<strong>{value} {unit}</strong></span><input aria-label={aria} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}/><small>{min} — {max} {unit}</small></label>; }
