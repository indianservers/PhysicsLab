import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { coreMaterials, solveTransformer, type CoreMaterial, type TransformerInput } from "./transformerPhysics";
import "./transformer-lab.css";

type RunState = "idle" | "running" | "paused";
const DEFAULT_INPUT: TransformerInput = { primaryVoltage: 120, frequency: 50, primaryTurns: 600, secondaryTurns: 120, loadResistance: 24, coreMaterial: "silicon-steel" };
const missionInput: TransformerInput = { primaryVoltage: 230, frequency: 50, primaryTurns: 920, secondaryTurns: 48, loadResistance: 24, coreMaterial: "silicon-steel" };
const format = (value: number, digits = 2) => Number.isFinite(value) ? value.toFixed(digits) : "—";
function wavePoints(amplitude: number, phase = 0) {
  return Array.from({ length: 81 }, (_, index) => `${8 + index * 3.55},${62 - Math.sin((index / 20) * Math.PI * 2 + phase) * amplitude}`).join(" ");
}

export function TransformerLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [runState, setRunState] = useState<RunState>("running");
  const [speed, setSpeed] = useState(1);
  const [phase, setPhase] = useState(0);
  const [missionActive, setMissionActive] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  const result = useMemo(() => solveTransformer(input), [input]);

  useEffect(() => {
    if (runState !== "running") return;
    const interval = window.setInterval(() => setPhase((value) => (value + 0.16 * speed) % (Math.PI * 2)), reducedMotion ? 240 : 55);
    return () => window.clearInterval(interval);
  }, [runState, speed, reducedMotion]);

  const update = (patch: Partial<TransformerInput>) => { setInput((current) => ({ ...current, ...patch })); setFeedback(""); };
  const reset = () => { setInput(DEFAULT_INPUT); setRunState("running"); setPhase(0); setMissionActive(false); setFeedback(""); };
  const setPreset = (name: "step-up" | "step-down" | "isolation") => {
    const presets = { "step-up": { primaryVoltage: 24, primaryTurns: 240, secondaryTurns: 960 }, "step-down": { primaryVoltage: 230, primaryTurns: 920, secondaryTurns: 48 }, isolation: { primaryVoltage: 120, primaryTurns: 600, secondaryTurns: 600 } } as const;
    update(presets[name]);
  };
  const beginMission = () => { setMissionActive(true); setInput({ ...missionInput, secondaryTurns: 120 }); setFeedback("Target 12.00 V rms. Use Vs/Vp = Ns/Np to choose Ns."); };
  const checkMission = () => {
    const accurate = Math.abs(result.inducedSecondaryVoltage - 12) <= 0.12;
    setFeedback(accurate ? `✓ Design verified: ${input.primaryTurns}:${input.secondaryTurns} turns induces ${format(result.inducedSecondaryVoltage)} V at ${result.secondaryFrequency} Hz.` : `Not yet: induced voltage is ${format(result.inducedSecondaryVoltage)} V. Required Ns = 12 × ${input.primaryTurns} / ${input.primaryVoltage}.`);
  };
  const flux = Math.sin(phase);
  const outputScale = Math.min(1, result.inducedSecondaryVoltage / 120);

  return <section className="transformer-lab" data-run-state={runState} aria-label={`${experiment.title} interactive laboratory`}>
    <header className="transformer-head"><div><span>ELECTRICITY · ELECTROMAGNETIC INDUCTION</span><h2>Transformer Bench · Voltage, Current & Power</h2><p>Follow alternating flux from the primary coil to the loaded secondary.</p></div><button onClick={reset}>↻ Reset experiment</button></header>
    <div className="transformer-layout">
      <aside className="transformer-controls" aria-label="Transformer controls">
        <h3>Experiment controls</h3>
        <label className="transformer-select"><span>Preset setup</span><select aria-label="Preset setup" value={result.classification} onChange={(event) => setPreset(event.target.value as "step-up" | "step-down" | "isolation")}><option value="step-down">Step-down</option><option value="step-up">Step-up</option><option value="isolation">Isolation 1:1</option></select></label>
        <Control label="Primary voltage" aria="Primary voltage" value={input.primaryVoltage} min={0} max={240} step={2} unit="V rms" onChange={(value) => update({ primaryVoltage: value })} />
        <Control label="Frequency" aria="Frequency" value={input.frequency} min={20} max={100} step={1} unit="Hz" onChange={(value) => update({ frequency: value })} />
        <Control label="Primary turns Np" aria="Primary turns" value={input.primaryTurns} min={50} max={1200} step={10} unit="turns" onChange={(value) => update({ primaryTurns: value })} />
        <Control label="Secondary turns Ns" aria="Secondary turns" value={input.secondaryTurns} min={20} max={1200} step={4} unit="turns" onChange={(value) => update({ secondaryTurns: value })} />
        <Control label="Load resistance" aria="Load resistance" value={input.loadResistance} min={5} max={500} step={1} unit="Ω" onChange={(value) => update({ loadResistance: value })} />
        <label className="transformer-select"><span>Core material</span><select aria-label="Core material" value={input.coreMaterial} onChange={(event) => update({ coreMaterial: event.target.value as CoreMaterial })}>{Object.entries(coreMaterials).map(([id, material]) => <option key={id} value={id}>{material.label}</option>)}</select></label>
        <div className="model-note"><b>2D apparatus model</b><span>The asset is illustrative; all readings come from the equations, not image geometry.</span></div>
      </aside>
      <main className="transformer-main">
        <div className="transformer-toolbar"><div><button onClick={() => setRunState("running")} disabled={runState === "running"}>▶ Play</button><button onClick={() => setRunState("paused")} disabled={runState === "paused"}>Ⅱ Pause</button><button onClick={() => { setRunState("paused"); setPhase((value) => value + Math.PI / 8); }}>▷ Step</button></div><label>Speed <select aria-label="Animation speed" value={speed} onChange={(event) => setSpeed(Number(event.target.value))}><option value="0.5">0.5×</option><option value="1">1×</option><option value="2">2×</option></select></label><label className="motion-toggle"><input type="checkbox" checked={reducedMotion} onChange={(event) => setReducedMotion(event.target.checked)} /> Reduced motion</label></div>
        <section className="transformer-stage" aria-label="Animated two-dimensional transformer apparatus">
          <img src="/assets/experiments/transformer-lab/transformer-apparatus.png" alt="Iron-core transformer with primary and secondary copper windings, AC source and load" />
          <svg viewBox="0 0 1000 560" role="img" aria-label={`Magnetic flux is ${flux >= 0 ? "clockwise" : "counterclockwise"}; it reverses every half-cycle`}><defs><marker id="flux-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" /></marker></defs><path className={`flux-path ${flux < 0 ? "reverse" : ""}`} d="M385 145 H625 Q680 145 680 200 V390 Q680 430 625 430 H385 Q330 430 330 390 V200 Q330 145 385 145" markerEnd="url(#flux-arrow)" /><text className="flux-label" x="505" y="122">Φ {flux >= 0 ? "CLOCKWISE" : "COUNTERCLOCKWISE"} · {format(Math.abs(flux) * result.peakFluxMilliWeber, 3)} mWb</text><g className="meter primary"><rect x="145" y="372" width="150" height="70" rx="9" /><text x="220" y="397">PRIMARY</text><text x="220" y="426">{format(input.primaryVoltage, 1)} V · {format(result.primaryCurrent, 3)} A</text></g><g className="meter secondary"><rect x="700" y="372" width="170" height="70" rx="9" /><text x="785" y="397">SECONDARY</text><text x="785" y="426">{format(result.inducedSecondaryVoltage, 1)} V · {format(result.secondaryCurrent, 3)} A</text></g><circle className="source-pulse" style={{ opacity: 0.35 + Math.abs(flux) * 0.65 }} cx="132" cy="345" r="18" /><circle className="load-glow" style={{ opacity: 0.15 + outputScale * 0.8 }} cx="910" cy="300" r="42" /></svg>
          <div className="ratio-strip"><span>Faraday coupling</span><b>Vs / Vp = Ns / Np = {format(result.turnsRatio, 4)}</b><strong>{result.classification.toUpperCase()}</strong></div>
        </section>
        <div className="transformer-meters" aria-label="Live transformer readings"><Reading label="Vp rms" value={`${format(input.primaryVoltage, 1)} V`} /><Reading label="Vs induced" value={`${format(result.inducedSecondaryVoltage, 2)} V`} /><Reading label="Vload terminal" value={`${format(result.terminalVoltage, 2)} V`} /><Reading label="frequency" value={`${result.secondaryFrequency} Hz`} /></div>
        <section className="wave-panel" aria-label="Synchronized voltage waveforms"><div><span>DUAL-CHANNEL OSCILLOSCOPE</span><strong>same period · same frequency</strong></div><svg viewBox="0 0 300 124" role="img" aria-label="Primary and secondary sinusoidal voltage waveforms with equal frequency"><path className="axis" d="M8 62H294 M8 12V112" /><polyline className="primary-wave" points={wavePoints(38, phase)} /><polyline className="secondary-wave" points={wavePoints(38 * Math.min(1, Math.max(0.18, result.turnsRatio)), phase)} /><text x="12" y="21">Vp</text><text x="47" y="21">Vs</text></svg></section>
      </main>
      <aside className="transformer-analysis" aria-label="Power and efficiency analysis">
        <h3>Live measurements</h3><Reading label="Primary current Ip" value={`${format(result.primaryCurrent, 3)} A`} /><Reading label="Secondary current Is" value={`${format(result.secondaryCurrent, 3)} A`} /><Reading label="Peak core flux" value={`${format(result.peakFluxMilliWeber, 3)} mWb`} /><Reading label="Frequency in/out" value={`${result.primaryFrequency} / ${result.secondaryFrequency} Hz`} />
        <section><h4>Power & efficiency</h4><Reading label="Input Pin" value={`${format(result.inputPower, 2)} W`} /><Reading label="Output Pout" value={`${format(result.outputPower, 2)} W`} /><Reading label="Core loss" value={`${format(result.coreLoss, 3)} W`} /><Reading label="Copper loss" value={`${format(result.copperLoss, 3)} W`} /><Reading label="Efficiency η" value={`${format(result.efficiency, 1)} %`} /></section>
        <div className="balance"><b>Energy account closes</b><code>Pin = Pout + Pcore + Pcopper</code><span>{format(result.inputPower, 3)} W = {format(result.outputPower, 3)} + {format(result.coreLoss, 3)} + {format(result.copperLoss, 3)}</span></div>
        <section className="theory"><h4>Ideal relationships</h4><p>Vs / Vp = Ns / Np</p><p>Ip / Is = Ns / Np</p><p>fp = fs</p><small>“Vs induced” is ideal winding emf. “Vload terminal” includes coupling and secondary winding resistance.</small></section>
      </aside>
    </div>
    <section className="transformer-mission" aria-label="Transformer design mission"><div><span>DESIGN CHALLENGE</span><b>Build a 230 V → 12 V step-down transformer for a 24 Ω load.</b><small>Keep Np = 920. Calculate and set Ns.</small></div><button onClick={beginMission}>Start challenge</button>{missionActive && <button onClick={() => update({ secondaryTurns: 48 })}>Apply calculated turns</button>}{missionActive && <button onClick={checkMission}>Check design</button>}<output aria-live="polite">{feedback}</output></section>
  </section>;
}

function Control({ label, aria, value, min, max, step, unit, onChange }: { label: string; aria: string; value: number; min: number; max: number; step: number; unit: string; onChange: (value: number) => void }) {
  return <label className="transformer-control"><span>{label}<strong>{value} {unit}</strong></span><input aria-label={aria} type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} /><small>{min} — {max} {unit}</small></label>;
}
function Reading({ label, value }: { label: string; value: string }) { return <div className="transformer-reading"><span>{label}</span><strong>{value}</strong></div>; }
