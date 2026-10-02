import { useEffect, useMemo, useRef, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { evaluateGate, gateTypes, hasInversionBubble, nandXor, truthTable, validateNandXor, type GateType, type LogicInput, type LogicLevel } from "./logicGatesPhysics";
import "./logic-gates.css";

type RunState = "idle" | "running" | "paused" | "result";
const levelLabel = (value: LogicInput) => value === null ? "X (floating)" : `${value} (${value ? "HIGH" : "LOW"})`;

export function LogicGatesLab({ experiment }: DedicatedExperimentLabProps) {
  const [gate, setGate] = useState<GateType>("AND");
  const [inputA, setInputA] = useState<LogicInput>(0);
  const [inputB, setInputB] = useState<LogicInput>(0);
  const [clockRate, setClockRate] = useState(1);
  const [delayNs, setDelayNs] = useState(120);
  const [runState, setRunState] = useState<RunState>("running");
  const [speed, setSpeed] = useState(1);
  const [clockOn, setClockOn] = useState(false);
  const [clockLevel, setClockLevel] = useState<LogicLevel>(0);
  const [output, setOutput] = useState<LogicInput>(0);
  const [edgeId, setEdgeId] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  const [nandCount, setNandCount] = useState(0);
  const [missionWired, setMissionWired] = useState(false);
  const [feedback, setFeedback] = useState("");
  const previousOutput = useRef<LogicInput>(0);
  const effectiveA = clockOn ? clockLevel : inputA;
  const logicalOutput = useMemo(() => evaluateGate(gate, effectiveA, inputB), [gate, effectiveA, inputB]);

  useEffect(() => {
    if (!clockOn || runState !== "running") return;
    const timer = window.setInterval(() => setClockLevel((level) => level ? 0 : 1), Math.max(80, 500 / clockRate / speed));
    return () => window.clearInterval(timer);
  }, [clockOn, clockRate, runState, speed]);
  useEffect(() => {
    if (runState !== "running") return;
    const visualDelay = reducedMotion ? 0 : Math.max(45, delayNs / speed);
    setEdgeId((id) => id + 1);
    const timer = window.setTimeout(() => { previousOutput.current = logicalOutput; setOutput(logicalOutput); }, visualDelay);
    return () => window.clearTimeout(timer);
  }, [logicalOutput, delayNs, runState, speed, reducedMotion]);

  const reset = () => { setGate("AND"); setInputA(0); setInputB(0); setClockRate(1); setDelayNs(120); setRunState("idle"); setClockOn(false); setClockLevel(0); setOutput(0); setNandCount(0); setMissionWired(false); setFeedback(""); };
  const cycle = (value: LogicInput, setter: (value: LogicInput) => void) => setter(value === 0 ? 1 : value === 1 ? null : 0);
  const checkMission = () => {
    const rows = validateNandXor();
    const pass = nandCount === 4 && missionWired && rows.every((row) => row.actual === row.expected);
    setFeedback(pass ? "✓ XOR built from exactly four NAND gates. All four input rows match A ⊕ B." : nandCount !== 4 ? `Use exactly four NAND gates; the board currently has ${nandCount}.` : "Connect the standard four-NAND XOR wiring before checking.");
    if (pass) setRunState("result");
  };
  const rows = truthTable(gate);
  const inversion = hasInversionBubble(gate);
  const timingShift = Math.min(38, 4 + delayNs / 14);

  return <section className="logic-lab" data-run-state={runState} aria-label={`${experiment.title} interactive laboratory`}>
    <header className="logic-head"><div><span>ELECTRONICS · CLASS 12</span><h2>Digital Logic Workbench</h2><p>Wire inputs, inspect Boolean truth, and watch every edge arrive after propagation delay.</p></div><button onClick={reset}>↻ Reset experiment</button></header>
    <div className="logic-toolbar"><div><button onClick={() => setRunState("running")} disabled={runState === "running"}>▶ Run</button><button onClick={() => setRunState("paused")} disabled={runState === "paused"}>Ⅱ Pause</button><button onClick={() => { setRunState("paused"); setClockLevel((level) => level ? 0 : 1); setOutput(logicalOutput); }}>▷ Step</button></div><label>Speed <select aria-label="Playback speed" value={speed} onChange={(event) => setSpeed(Number(event.target.value))}><option value="0.25">0.25×</option><option value="0.5">0.5×</option><option value="1">1×</option><option value="2">2×</option></select></label><label><input type="checkbox" checked={reducedMotion} onChange={(event) => setReducedMotion(event.target.checked)} /> Reduced motion</label><output>Clock {clockRate.toFixed(1)} kHz · delay {delayNs} ns</output></div>
    <div className="logic-layout">
      <aside className="logic-controls" aria-label="Logic gate controls">
        <h3>Components</h3><div className="gate-assets"><img src="/assets/experiments/logic-gates/gate-modules.png" alt="AND, OR, NOT, NAND, NOR, XOR and XNOR gate modules" /></div>
        <label className="logic-select"><span>Gate type</span><select aria-label="Gate type" value={gate} onChange={(event) => setGate(event.target.value as GateType)}>{gateTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <button className={`logic-input ${effectiveA === 1 ? "high" : effectiveA === null ? "floating" : ""}`} onClick={() => cycle(inputA, setInputA)} disabled={clockOn}><b>Input A</b><span>{levelLabel(effectiveA)}</span><small>Click: 0 → 1 → floating</small></button>
        {gate !== "NOT" && <button className={`logic-input ${inputB === 1 ? "high" : inputB === null ? "floating" : ""}`} onClick={() => cycle(inputB, setInputB)}><b>Input B</b><span>{levelLabel(inputB)}</span><small>Click: 0 → 1 → floating</small></button>}
        <label className="clock-switch"><input type="checkbox" checked={clockOn} onChange={(event) => setClockOn(event.target.checked)} /> Drive A from clock</label>
        <Control label="Clock rate" aria="Clock rate" value={clockRate} min={0.5} max={5} step={0.5} unit="kHz" onChange={setClockRate} />
        <Control label="Propagation delay" aria="Propagation delay" value={delayNs} min={10} max={500} step={10} unit="ns" onChange={setDelayNs} />
        <div className="floating-note"><b>Floating is unknown—not LOW.</b><span>An unconnected CMOS input may drift. This model reports X and withholds a definite output.</span></div>
      </aside>
      <main className="logic-main">
        <section className="logic-stage" aria-label="Interactive wired logic gate">
          <div className="grid-label">CLICK INPUT TERMINALS TO CONNECT / FLOAT</div>
          <svg viewBox="0 0 820 430" role="img" aria-label={`${gate} gate with A ${levelLabel(effectiveA)}, B ${levelLabel(inputB)}, delayed output ${levelLabel(output)}`}>
            <path className={`wire a ${effectiveA === 1 ? "high" : effectiveA === null ? "unknown" : ""}`} d="M110 150H320" /><path className={`wire b ${inputB === 1 ? "high" : inputB === null ? "unknown" : ""}`} d="M110 280H320" /><path className={`wire y ${output === 1 ? "high" : output === null ? "unknown" : ""}`} d="M535 215H720" />
            <g className="terminal" role="button" tabIndex={0} onClick={() => !clockOn && cycle(inputA,setInputA)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") cycle(inputA,setInputA); }}><circle cx="95" cy="150" r="28" /><text x="95" y="156">A {effectiveA ?? "X"}</text></g>
            {gate !== "NOT" && <g className="terminal" role="button" tabIndex={0} onClick={() => cycle(inputB,setInputB)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") cycle(inputB,setInputB); }}><circle cx="95" cy="280" r="28" /><text x="95" y="286">B {inputB ?? "X"}</text></g>}
            <g className="gate-body"><path d={gate === "NOT" ? "M325 120L520 215L325 310Z" : gate === "AND" || gate === "NAND" ? "M320 105H410C515 105 555 155 555 215S515 325 410 325H320Z" : "M320 105Q405 135 555 215Q405 295 320 325Q365 215 320 105Z"} /><text x="427" y="224">{gate}</text>{inversion && <circle className="bubble" cx={gate === "NOT" ? 530 : 565} cy="215" r="10" />}</g>
            <g className={`led ${output === 1 ? "high" : output === null ? "unknown" : ""}`}><circle cx="755" cy="215" r="35" /><text x="755" y="222">Y {output ?? "X"}</text></g>
            {runState === "running" && <circle key={edgeId} className="signal-edge" style={{ animationDuration: `${Math.max(.35,delayNs/300)/speed}s` }} cx="325" cy="215" r="9" />}
          </svg>
          <div className="stage-status"><span>Combinational result: <b>{levelLabel(logicalOutput)}</b></span><span>Observed after {delayNs} ns: <strong>{levelLabel(output)}</strong></span></div>
        </section>
        <section className="timing" aria-label="Timing diagram"><header><b>Timing diagram</b><span>output shifted right by {delayNs} ns</span></header><div className="track"><label>A</label><i className={`digital ${effectiveA === 1 ? "high" : effectiveA === null ? "unknown" : ""}`} /></div>{gate !== "NOT" && <div className="track"><label>B</label><i className={`digital ${inputB === 1 ? "high" : inputB === null ? "unknown" : ""}`} /></div>}<div className="track output"><label>Y</label><i className={`digital ${output === 1 ? "high" : output === null ? "unknown" : ""}`} style={{ marginLeft: `${timingShift}px` }} /></div></section>
      </main>
      <aside className="logic-analysis" aria-label="Truth table and gate analysis">
        <h3>{gate} truth table</h3><table><thead><tr><th>A</th>{gate !== "NOT" && <th>B</th>}<th>Y</th></tr></thead><tbody>{rows.map((row,index) => <tr key={index} className={row.a === effectiveA && row.b === (gate === "NOT" ? null : inputB) ? "active" : ""}><td>{row.a}</td>{gate !== "NOT" && <td>{row.b}</td>}<td>{row.y}</td></tr>)}</tbody></table>
        <section><h4>Symbol audit</h4><div className="bubble-demo"><span className={inversion ? "show" : ""} /> {inversion ? "Output bubble = inversion" : "No bubble = non-inverting"}</div><p>{gate === "XOR" || gate === "XNOR" ? "Extra curved input line identifies exclusive logic." : "IEC/ANSI-style logic silhouette."}</p></section>
        <section><h4>Boolean expression</h4><code>{expressionFor(gate)}</code><p>{logicalOutput === null ? "Resolve every floating input before trusting Y." : `Current: Y = ${logicalOutput}`}</p></section>
        <section><h4>Timing model</h4><p>Y(t) = f[A(t − tp), B(t − tp)]</p><small>Physical nanoseconds are stretched for visible animation; the displayed timing and ordering remain causal.</small></section>
      </aside>
    </div>
    <section className="logic-mission" aria-label="XOR from NAND mission"><div><span>CHALLENGE</span><b>Implement XOR using exactly four basic NAND gates.</b><small>N1=A NAND B; N2=A NAND N1; N3=B NAND N1; Y=N2 NAND N3.</small></div><div className="mission-build"><button onClick={() => { setNandCount((count) => Math.min(5,count+1)); setFeedback(""); }}>+ Add NAND gate</button><button onClick={() => { setMissionWired(true); setFeedback("Standard XOR interconnect applied. Check all truth rows."); }}>Wire XOR network</button><button onClick={checkMission}>Check my build</button></div><div className="nand-board" aria-label={`${nandCount} NAND gates on mission board`}>{Array.from({length:nandCount},(_,index) => <span key={index}>NAND {index+1}{missionWired && index<4 ? " ✓" : ""}</span>)}</div><output aria-live="polite">{feedback}</output>{missionWired && nandCount === 4 && <div className="mission-rows">{([0,1] as LogicLevel[]).flatMap((a) => ([0,1] as LogicLevel[]).map((b) => <span key={`${a}${b}`}>{a}{b}→{nandXor(a,b)}</span>))}</div>}</section>
  </section>;
}

function expressionFor(gate: GateType) { return ({AND:"Y = A · B",OR:"Y = A + B",NOT:"Y = ¬A",NAND:"Y = ¬(A · B)",NOR:"Y = ¬(A + B)",XOR:"Y = A ⊕ B",XNOR:"Y = ¬(A ⊕ B)"} as Record<GateType,string>)[gate]; }
function Control({label,aria,value,min,max,step,unit,onChange}:{label:string;aria:string;value:number;min:number;max:number;step:number;unit:string;onChange:(value:number)=>void}) { return <label className="logic-control"><span>{label}<strong>{value} {unit}</strong></span><input aria-label={aria} type="range" min={min} max={max} step={step} value={value} onChange={(event)=>onChange(Number(event.target.value))}/><small>{min} — {max} {unit}</small></label>; }
