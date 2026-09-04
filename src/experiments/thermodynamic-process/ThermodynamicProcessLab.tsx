import { useEffect, useMemo, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  compareSameEndpoint,
  solveThermodynamicProcess,
  type ThermodynamicInput,
  type ThermodynamicProcess,
} from "./thermodynamicProcessSimulation";
import "./thermodynamic-process.css";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const ease = (n: number) => n * n * (3 - 2 * n);
const frac = (n: number) => n - Math.floor(n);
const signed = (n: number, digits = 1) =>
  `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(digits)}`;

const processCopy: Record<
  ThermodynamicProcess,
  { name: string; constant: string; law: string; color: string }
> = {
  isothermal: { name: "Isothermal", constant: "T constant", law: "PV = constant", color: "#16a8bb" },
  adiabatic: { name: "Adiabatic", constant: "Q = 0", law: "PVᵞ = constant", color: "#8c68d7" },
  isobaric: { name: "Isobaric", constant: "P constant", law: "V/T = constant", color: "#df8c16" },
  isochoric: { name: "Isochoric", constant: "V constant", law: "P/T = constant", color: "#dd5d53" },
};

function Range({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  unit: string; onChange: (n: number) => void;
}) {
  const key = (event: KeyboardEvent<HTMLInputElement>) => {
    let next: number | undefined;
    if (event.key === "Home") next = min;
    if (event.key === "End") next = max;
    if (["ArrowLeft", "ArrowDown"].includes(event.key)) next = value - step;
    if (["ArrowRight", "ArrowUp"].includes(event.key)) next = value + step;
    if (next === undefined) return;
    event.preventDefault();
    onChange(clamp(next, min, max));
  };
  const digits = step < 0.1 ? 2 : step < 1 ? 1 : 0;
  return <label className="thermo-range">
    <span><b>{label}</b><output>{value.toFixed(digits)} {unit}</output></span>
    <input aria-label={label} type="range" min={min} max={max} step={step}
      value={value} onChange={(event) => onChange(Number(event.target.value))}
      onKeyDown={key} />
  </label>;
}

function PvGraph({ process, input, progress }: {
  process: ThermodynamicProcess; input: ThermodynamicInput; progress: number;
}) {
  const points = Array.from({ length: 49 }, (_, index) =>
    solveThermodynamicProcess(process, input, index / 48));
  const active = solveThermodynamicProcess(process, input, progress);
  const endpoint = points[points.length - 1];
  const pMax = Math.max(input.pressureKPa, ...points.map((p) => p.pressureKPa)) * 1.18;
  const vMax = Math.max(input.volumeL, ...points.map((p) => p.volumeL)) * 1.18;
  const vMin = Math.min(input.volumeL, ...points.map((p) => p.volumeL)) * 0.78;
  const x = (v: number) => 54 + ((v - vMin) / Math.max(0.01, vMax - vMin)) * 342;
  const y = (p: number) => 276 - (p / pMax) * 224;
  const path = points.map((p, i) => `${i ? "L" : "M"}${x(p.volumeL).toFixed(1)},${y(p.pressureKPa).toFixed(1)}`).join(" ");
  const fill = `${path} L${x(endpoint.volumeL).toFixed(1)},276 L${x(points[0].volumeL).toFixed(1)},276 Z`;
  const color = processCopy[process].color;
  return <div className="pv-panel">
    <div className="panel-title"><span>P–V DIAGRAM</span><b>{active.volumeL >= input.volumeL ? "Expansion · W > 0" : active.volumeL < input.volumeL ? "Compression · W < 0" : "No boundary work"}</b></div>
    <svg className="pv-graph" viewBox="0 0 430 315" role="img" aria-label={`${processCopy[process].name} pressure volume graph`}>
      <defs><linearGradient id="workFill" x1="0" y1="0" x2="0" y2="1"><stop stopColor={color} stopOpacity=".42"/><stop offset="1" stopColor={color} stopOpacity=".06"/></linearGradient></defs>
      {[0, .25, .5, .75, 1].map((f) => <g key={f}><line x1="54" y1={276-f*224} x2="396" y2={276-f*224} className="grid-line"/><text x="46" y={280-f*224} textAnchor="end">{(pMax*f).toFixed(0)}</text></g>)}
      {[0, .25, .5, .75, 1].map((f) => <g key={f}><line x1={54+f*342} y1="52" x2={54+f*342} y2="276" className="grid-line"/><text x={54+f*342} y="294" textAnchor="middle">{(vMin+(vMax-vMin)*f).toFixed(1)}</text></g>)}
      <path d={fill} fill="url(#workFill)" />
      <path d={path} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"/>
      <circle cx={x(input.volumeL)} cy={y(input.pressureKPa)} r="7" className="point-a"/><text x={x(input.volumeL)-12} y={y(input.pressureKPa)-12} className="point-label">A</text>
      <circle cx={x(endpoint.volumeL)} cy={y(endpoint.pressureKPa)} r="7" className="point-b"/><text x={x(endpoint.volumeL)+10} y={y(endpoint.pressureKPa)-10} className="point-label">B</text>
      <circle cx={x(active.volumeL)} cy={y(active.pressureKPa)} r="6" fill="#fff" stroke={color} strokeWidth="4"/>
      <text x="18" y="40" className="axis-label">P (kPa)</text><text x="354" y="309" className="axis-label">V (L)</text>
    </svg>
    <div className="graph-formula"><span style={{ background: color }}/><b>{processCopy[process].law}</b><small>Shaded area = signed work ∫P dV</small></div>
  </div>;
}

function Apparatus({ state, input, process, time, running, reduced }: {
  state: ReturnType<typeof solveThermodynamicProcess>; input: ThermodynamicInput;
  process: ThermodynamicProcess; time: number; running: boolean; reduced: boolean;
}) {
  const volumeScale = clamp(state.volumeL / input.volumeL, .5, 2);
  const pistonY = 33 - (volumeScale - .5) * 10;
  const heat = clamp((state.temperatureK - 220) / 520, 0, 1);
  return <div className="apparatus-panel">
    <div className="panel-title"><span>MOLECULAR PISTON</span><b>{running ? "PROCESS RUNNING" : time > 0 ? "STATE HELD" : "READY"}</b></div>
    <div className="apparatus-scene" aria-label="Animated 2D piston and gas molecules">
      <div className="thermal-glow" style={{ opacity: .15 + heat * .45 }}/>
      <img className="apparatus-image" src="/assets/experiments/thermodynamic-process/thermodynamic-process-apparatus.png" alt="Transparent piston cylinder apparatus" />
      <div className="gas-window" style={{ top: `${pistonY}%`, background: `linear-gradient(#2fa7dd22, hsl(${210-heat*180} 84% 54% / .25))` }}>
        <img className="gas-effect cyan" src="/assets/experiments/thermodynamic-process/concept-effect.png" alt=""/>
        <img className="gas-effect amber" src="/assets/experiments/thermodynamic-process/interaction-overlay.png" alt=""/>
        {Array.from({length: 18}, (_, i) => {
          const motion = reduced ? 0 : time * (.45 + Math.sqrt(state.temperatureK / 300) * .4);
          return <i key={i} style={{ left: `${8 + frac(i*.618 + motion*(i%3+1)*.07)*84}%`, top: `${7 + frac(i*.413 + motion*(i%4+1)*.05)*84}%`, animationPlayState: running ? "running" : "paused" }}/>
        })}
      </div>
      <div className="live-piston" style={{ top: `${pistonY}%` }}><span/></div>
      <div className="piston-caption"><b>{state.volumeL.toFixed(2)} L</b><span>{state.temperatureK.toFixed(0)} K</span></div>
    </div>
    <div className="apparatus-key"><span><i className="hot"/>hotter / faster</span><span><i className="cold"/>cooler / slower</span></div>
  </div>;
}

export function ThermodynamicProcessLab({ experiment }: DedicatedExperimentLabProps) {
  const defaults: ThermodynamicInput = { pressureKPa: 120, volumeL: 3, temperatureK: 320, endpointRatio: 1.7, gamma: 1.4 };
  const [process, setProcess] = useState<ThermodynamicProcess>("isothermal");
  const [input, setInput] = useState(defaults);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reduced, setReduced] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [predictionFeedback, setPredictionFeedback] = useState("");
  const [missionChoice, setMissionChoice] = useState("");
  const [missionFeedback, setMissionFeedback] = useState("");
  const duration = 8;
  const progress = ease(clamp(time / duration, 0, 1));
  const state = useMemo(() => solveThermodynamicProcess(process, input, progress), [process, input, progress]);
  const final = useMemo(() => solveThermodynamicProcess(process, input), [process, input]);
  const comparison = useMemo(() => compareSameEndpoint(input), [input]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setTime((current) => {
      const next = current + .04 * speed;
      if (next >= duration) { setRunning(false); return duration; }
      return next;
    }), 40);
    return () => window.clearInterval(id);
  }, [running, speed]);

  const changeInput = (patch: Partial<ThermodynamicInput>) => {
    setInput((current) => ({ ...current, ...patch })); setTime(0); setRunning(false);
  };
  const selectProcess = (next: ThermodynamicProcess) => {
    setProcess(next); setTime(0); setRunning(false); setPredictionFeedback("");
  };
  const expectedSign = process === "isochoric" || input.endpointRatio === 1 ? "zero" : input.endpointRatio > 1 ? "positive" : "negative";
  const checkPrediction = () => setPredictionFeedback(!prediction ? "Choose a sign first." : prediction === expectedSign ? "Correct — the graph area and piston motion agree." : `Try again: work by the gas is ${expectedSign}.`);
  const reset = () => { setInput(defaults); setProcess("isothermal"); setTime(0); setRunning(false); setSpeed(1); setPrediction(""); setPredictionFeedback(""); setMissionChoice(""); setMissionFeedback(""); };
  const invariant = process === "isothermal" ? state.pressureKPa*state.volumeL/(input.pressureKPa*input.volumeL) : process === "adiabatic" ? state.pressureKPa*state.volumeL**input.gamma/(input.pressureKPa*input.volumeL**input.gamma) : process === "isobaric" ? state.pressureKPa/input.pressureKPa : state.volumeL/input.volumeL;

  return <section className="thermo-lab">
    <header className="thermo-hero"><div><span>THERMODYNAMICS · CLASS 11</span><h1>{experiment.title}</h1><p>Trace a path through state space. Measure work as area, then close the energy ledger.</p></div><div className={`thermo-status ${running ? "running" : time >= duration ? "done" : ""}`}>{running ? "IN PROCESS" : time >= duration ? "END STATE" : "STATE A"}</div></header>

    <nav className="process-tabs" aria-label="Thermodynamic process">
      {(Object.keys(processCopy) as ThermodynamicProcess[]).map((key) => <button key={key} className={process === key ? "active" : ""} style={{ "--process": processCopy[key].color } as CSSProperties} onClick={() => selectProcess(key)}><i/><span><b>{processCopy[key].name}</b><small>{processCopy[key].constant}</small></span></button>)}
    </nav>

    <div className="thermo-layout">
      <aside className="thermo-card controls-card"><div className="eyebrow">INITIAL STATE A</div>
        <Range label="Pressure" value={input.pressureKPa} min={80} max={300} step={5} unit="kPa" onChange={(pressureKPa) => changeInput({pressureKPa})}/>
        <Range label="Volume" value={input.volumeL} min={1} max={5} step={.1} unit="L" onChange={(volumeL) => changeInput({volumeL})}/>
        <Range label="Temperature" value={input.temperatureK} min={250} max={600} step={5} unit="K" onChange={(temperatureK) => changeInput({temperatureK})}/>
        <div className="mole-note"><span>Gas amount derived from A</span><b>n = {final.moles.toFixed(3)} mol</b><small>PV = nRT · 1 kPa·L = 1 J</small></div>
        <div className="eyebrow endpoint-head">ENDPOINT</div>
        <Range label={process === "isochoric" ? "Pressure ratio P₂/P₁" : "Volume ratio V₂/V₁"} value={input.endpointRatio} min={.5} max={2} step={.05} unit="×" onChange={(endpointRatio) => changeInput({endpointRatio})}/>
        <Range label="Heat capacity ratio γ" value={input.gamma} min={1.1} max={1.67} step={.01} unit="" onChange={(gamma) => changeInput({gamma})}/>
        <div className="prediction-box"><b>Predict the sign of work by the gas</b><div>{["positive","zero","negative"].map((value) => <button key={value} className={prediction === value ? "selected" : ""} onClick={() => setPrediction(value)}>{value === "positive" ? "+" : value === "negative" ? "−" : "0"} {value}</button>)}</div><button className="check-btn" onClick={checkPrediction}>Check prediction</button>{predictionFeedback && <p className={prediction === expectedSign ? "correct" : "try"}>{predictionFeedback}</p>}</div>
      </aside>

      <main className="thermo-stage thermo-card">
        <div className="stage-head"><div><span>LIVE STATE PATH</span><h2>{processCopy[process].name} process</h2></div><div className="law-chip">{processCopy[process].law}</div></div>
        <div className="workspace"><Apparatus state={state} input={input} process={process} time={time} running={running} reduced={reduced}/><PvGraph process={process} input={input} progress={progress}/></div>
        <div className="transport"><button onClick={() => { if(time >= duration) setTime(0); setRunning((v) => !v); }} aria-label={running ? "Pause process" : "Play process"}>{running ? "❚❚" : "▶"}</button><button onClick={() => { setRunning(false); setTime((t) => clamp(t + .4, 0, duration)); }} aria-label="Step process">▶│</button><input aria-label="Process timeline" type="range" min="0" max={duration} step=".05" value={time} onChange={(e) => {setRunning(false);setTime(Number(e.target.value));}}/><span>{time.toFixed(1)} / {duration}s</span><select aria-label="Playback speed" value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>{[.25,.5,1,1.5,2].map((n)=><option key={n} value={n}>{n}×</option>)}</select><label className="reduced"><input type="checkbox" checked={reduced} onChange={(e)=>setReduced(e.target.checked)}/> Reduced motion</label><button className="reset" onClick={reset}>↻ Reset</button></div>
      </main>

      <aside className="thermo-card readings-card"><div className="eyebrow">STATE MONITOR</div><div className="state-grid">{[["P",state.pressureKPa,"kPa"],["V",state.volumeL,"L"],["T",state.temperatureK,"K"]].map(([label,value,unit])=><div key={label as string}><span>{label}</span><b>{Number(value).toFixed(2)}</b><small>{unit}</small></div>)}</div>
        <div className="energy-ledger"><div><span>Heat into gas</span><b className={state.heatJ>=0?"in":"out"}>Q {signed(state.heatJ)} J</b></div><div><span>Work by gas</span><b className={state.workJ>=0?"in":"out"}>W {signed(state.workJ)} J</b></div><div><span>Internal energy</span><b>ΔU {signed(state.deltaInternalEnergyJ)} J</b></div></div>
        <div className="first-law"><span>FIRST-LAW CHECK</span><b>ΔU = Q − W</b><code>{signed(state.deltaInternalEnergyJ)} = {signed(state.heatJ)} − ({signed(state.workJ)}) J</code><small>residual {(state.heatJ-state.workJ-state.deltaInternalEnergyJ).toExponential(1)} J</small></div>
        <div className="invariant"><span>PROCESS INVARIANT</span><b>{processCopy[process].law}</b><div><i style={{width:`${Math.min(100, invariant*100)}%`}}/><em>{invariant.toFixed(6)}×</em></div><small>normalized to state A · target 1.000000</small></div>
      </aside>
    </div>

    <section className="mission-card"><div className="mission-copy"><span>LEARNER MISSION · SAME ENDPOINT, TWO PATHS</span><h2>Which path lets the gas do more work?</h2><p>Both paths finish at B: {comparison.finalPressureKPa.toFixed(1)} kPa, {comparison.finalVolumeL.toFixed(2)} L, {comparison.finalTemperatureK.toFixed(0)} K. Direct path is isothermal; path A→C→B is isochoric then isobaric.</p></div><div className="mini-paths"><svg viewBox="0 0 250 112" aria-label="Two paths between identical endpoints"><path d="M34 25 C92 34 146 58 216 88" className="direct"/><path d="M34 25 L34 88 L216 88" className="two-step"/><circle cx="34" cy="25" r="5"/><circle cx="216" cy="88" r="5"/><text x="19" y="18">A</text><text x="221" y="102">B</text><text x="15" y="105">C</text></svg><div><b>Direct: {comparison.directWorkJ.toFixed(1)} J</b><b>Two-step: {comparison.twoStepWorkJ.toFixed(1)} J</b></div></div><div className="mission-action"><div><button className={missionChoice==="direct"?"selected":""} onClick={()=>setMissionChoice("direct")}>Direct isothermal</button><button className={missionChoice==="two-step"?"selected":""} onClick={()=>setMissionChoice("two-step")}>Two-step path</button></div><button className="mission-check" onClick={()=>setMissionFeedback(!missionChoice?"Choose a path first.":missionChoice==="direct"?"Mission complete — the curved path encloses more area, so W and Q are larger while ΔU remains zero.":"Compare the enclosed P–V areas. Both endpoints give ΔU = 0, but the paths do not give equal work.")}>Check path</button>{missionFeedback && <p className={missionChoice==="direct"?"correct":"try"}>{missionFeedback}</p>}</div></section>
  </section>;
}
