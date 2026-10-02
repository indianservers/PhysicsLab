import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  DEFAULT_KIRCHHOFF_INPUT,
  normalizeKirchhoffInput,
  solveKirchhoff,
  type KirchhoffInput,
} from "./kirchhoffPhysics";
import "./kirchhoff-circuit.css";

const ROOT = "/assets/experiments/kirchhoff-circuit";
type Loop = "left" | "right";
type Junction = "B" | "D";
type RunState = "idle" | "running" | "paused" | "result";

export function KirchhoffCircuitLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(DEFAULT_KIRCHHOFF_INPUT);
  const [loop, setLoop] = useState<Loop>("left");
  const [junction, setJunction] = useState<Junction>("B");
  const [traceStep, setTraceStep] = useState(0);
  const [runState, setRunState] = useState<RunState>("idle");
  const [playback, setPlayback] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(
    () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  const [missionFeedback, setMissionFeedback] = useState("");
  const [prediction, setPrediction] = useState<"up" | "down" | "zero" | "">("");
  const [predictionFeedback, setPredictionFeedback] = useState("");
  const result = useMemo(() => solveKirchhoff(input), [input]);
  const steps = loop === "left" ? 5 : 6;

  useEffect(() => {
    if (runState !== "running") return;
    const delay = (reducedMotion ? 1500 : 850) / playback;
    const timer = window.setTimeout(() => {
      setTraceStep((current) => {
        if (current >= steps) {
          setRunState("result");
          return current;
        }
        return current + 1;
      });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [runState, traceStep, steps, playback, reducedMotion]);

  const update = <K extends keyof KirchhoffInput>(
    key: K,
    value: KirchhoffInput[K],
  ) => {
    setInput((current) =>
      normalizeKirchhoffInput({ ...current, [key]: value }),
    );
    setMissionFeedback("");
    setPrediction("");
    setPredictionFeedback("");
  };
  const reset = () => {
    setInput(DEFAULT_KIRCHHOFF_INPUT);
    setLoop("left");
    setJunction("B");
    setTraceStep(0);
    setRunState("idle");
    setMissionFeedback("");
  };
  const play = () => {
    if (runState === "result") setTraceStep(0);
    setRunState("running");
    if (prediction) {
      const actual = Math.abs(result.sharedCurrent) < 1e-6 ? "zero" : result.sharedCurrent > 0 ? "down" : "up";
      setPredictionFeedback(prediction === actual ? `✓ Correct: shared current is ${actual}.` : `Observe the arrows: shared current is ${actual}.`);
    }
  };
  const step = () => {
    setRunState("paused");
    setTraceStep((current) => (current >= steps ? 0 : current + 1));
  };
  const missionComplete = Math.abs(result.sharedCurrent) < 1e-6;
  const balanceInRange =
    Number.isFinite(result.balanceResistance5) &&
    result.balanceResistance5 >= 10 &&
    result.balanceResistance5 <= 1000;
  const selectedResidual =
    loop === "left" ? result.kvlLeftResidual : result.kvlRightResidual;

  return (
    <section
      className="kirchhoff-lab"
      data-ui-theme="light"
      data-run-state={runState}
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="kirchhoff-head">
        <div>
          <span>ELECTRICITY · CLASS 12</span>
          <h2>Kirchhoff's Laws: Two-Loop Circuit</h2>
          <p>
            Trace signed currents, conserve charge at a junction, then close
            each voltage loop.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>

      <div className="kirchhoff-layout">
        <aside className="kirchhoff-controls" aria-label="Circuit controls">
          <h3>Sources</h3>
          <Control
            label="Source E₁"
            value={input.source1}
            min={0}
            max={24}
            step={0.5}
            unit="V"
            onChange={(value) => update("source1", value)}
          />
          <Control
            label="Source E₂"
            value={input.source2}
            min={0}
            max={24}
            step={0.5}
            unit="V"
            onChange={(value) => update("source2", value)}
          />
          <h3>Branch resistances</h3>
          <Control
            label="R₁ left top"
            value={input.resistance1}
            min={10}
            max={1000}
            step={10}
            unit="Ω"
            digits={0}
            onChange={(value) => update("resistance1", value)}
          />
          <Control
            label="R₂ left bottom"
            value={input.resistance2}
            min={10}
            max={1000}
            step={10}
            unit="Ω"
            digits={0}
            onChange={(value) => update("resistance2", value)}
          />
          <Control
            label="R₃ shared branch"
            value={input.sharedResistance}
            min={10}
            max={1000}
            step={10}
            unit="Ω"
            digits={0}
            onChange={(value) => update("sharedResistance", value)}
          />
          <Control
            label="R₄ right top"
            value={input.resistance4}
            min={10}
            max={1000}
            step={10}
            unit="Ω"
            digits={0}
            onChange={(value) => update("resistance4", value)}
          />
          <Control
            label="R₅ adjustable"
            value={input.resistance5}
            min={10}
            max={1000}
            step={2.5}
            unit="Ω"
            digits={1}
            onChange={(value) => update("resistance5", value)}
          />
          <div className="kirchhoff-presets">
            <button
              onClick={() =>
                setInput({
                  source1: 0,
                  source2: 0,
                  resistance1: 10,
                  resistance2: 10,
                  sharedResistance: 10,
                  resistance4: 10,
                  resistance5: 10,
                })
              }
            >
              Minimum setup
            </button>
            <button onClick={() => setInput(DEFAULT_KIRCHHOFF_INPUT)}>
              Typical setup
            </button>
            <button
              onClick={() =>
                setInput({
                  source1: 24,
                  source2: 24,
                  resistance1: 1000,
                  resistance2: 1000,
                  sharedResistance: 1000,
                  resistance4: 1000,
                  resistance5: 1000,
                })
              }
            >
              Maximum setup
            </button>
          </div>
        </aside>

        <main className="kirchhoff-main">
          <div className="kirchhoff-toolbar">
            <div>
              <button
                aria-label={
                  runState === "result"
                    ? "Replay circuit trace"
                    : "Play circuit trace"
                }
                onClick={play}
                disabled={runState === "running"}
              >
                ▶ {runState === "result" ? "Replay" : "Play"}
              </button>
              <button
                aria-label="Pause circuit trace"
                onClick={() => setRunState("paused")}
                disabled={runState !== "running"}
              >
                Ⅱ Pause
              </button>
              <button aria-label="Step circuit trace" onClick={step}>
                ▮▶ Step
              </button>
            </div>
            <span>
              {traceStep === 0
                ? "Junction balance"
                : `${loop} loop · step ${traceStep}/${steps}`}
            </span>
          </div>

          <div className="kirchhoff-board">
            <img
              src={`${ROOT}/breadboard.png`}
              alt="Empty solderless breadboard used as the circuit base"
            />
            <svg
              viewBox="0 0 760 390"
              role="img"
              aria-label="Two-loop circuit with two sources, five outer resistors and one shared resistor"
            >
              <defs>
                <marker
                  id="k-arrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0 0 L8 4 L0 8 Z" />
                </marker>
              </defs>
              <path
                className={`loop-path left ${loop === "left" && traceStep > 0 ? "selected" : ""}`}
                d="M92 82 H380 V310 H92 Z"
              />
              <path
                className={`loop-path right ${loop === "right" && traceStep > 0 ? "selected" : ""}`}
                d="M380 82 H668 V310 H380 Z"
              />
              <path className="wire current-wire" d="M92 82 H380" />
              <path
                className="wire current-wire right-current"
                d="M380 82 H668"
              />
              <path
                className="wire current-wire shared-current"
                d="M380 82 V310"
              />
              <path
                className="wire"
                d="M92 310 H380 M380 310 H668 M92 82 V310 M668 82 V310"
              />

              <Component
                x={215}
                y={82}
                label="R₁"
                value={input.resistance1}
                active={loop === "left" && traceStep === 2}
              />
              <g className="kirchhoff-direct-r5">
                <rect x="458" y="278" width="144" height="62" rx="8" tabIndex={0} role="slider" aria-label="Drag adjustable resistor R5" aria-valuemin={10} aria-valuemax={1000} aria-valuenow={input.resistance5}
                  onPointerDown={event => event.currentTarget.setPointerCapture(event.pointerId)}
                  onPointerMove={event => { if(!event.currentTarget.hasPointerCapture(event.pointerId)) return; const rect=event.currentTarget.ownerSVGElement!.getBoundingClientRect(); const x=(event.clientX-rect.left)/rect.width*760; update("resistance5",10+Math.max(0,Math.min(1,(x-458)/144))*990); }}
                  onKeyDown={event=>{if(event.key==="ArrowLeft")update("resistance5",input.resistance5-2.5);if(event.key==="ArrowRight")update("resistance5",input.resistance5+2.5);}} />
                <text x="530" y="352">DRAG R₅ ↔</text>
              </g>
              <Component
                x={220}
                y={310}
                label="R₂"
                value={input.resistance2}
                active={loop === "left" && traceStep === 3}
              />
              <Component
                x={380}
                y={192}
                label="R₃"
                value={input.sharedResistance}
                vertical
                active={traceStep === (loop === "left" ? 4 : 5)}
              />
              <Component
                x={530}
                y={82}
                label="R₄"
                value={input.resistance4}
                active={loop === "right" && traceStep === 2}
              />
              <Component
                x={530}
                y={310}
                label="R₅"
                value={input.resistance5}
                active={loop === "right" && traceStep === 3}
              />
              <Battery
                x={92}
                y={195}
                label="E₁"
                value={input.source1}
                active={loop === "left" && traceStep === 1}
              />
              <Battery
                x={668}
                y={195}
                label="E₂"
                value={input.source2}
                active={loop === "right" && traceStep === 1}
              />

              <Node x={92} y={82} label="A" active={false} />
              <Node
                x={380}
                y={82}
                label="B"
                active={junction === "B" && traceStep === 0}
              />
              <Node x={668} y={82} label="C" active={false} />
              <Node
                x={380}
                y={310}
                label="D"
                active={junction === "D" && traceStep === 0}
              />
              <text className="current-label i1" x="210" y="58">
                I₁ {(result.mesh1 * 1000).toFixed(2)} mA →
              </text>
              <text className="current-label i2" x="506" y="58">
                I₂ {(result.mesh2 * 1000).toFixed(2)} mA →
              </text>
              <text className="current-label ib" x="394" y="200">
                I₃ {(result.sharedCurrent * 1000).toFixed(2)} mA{" "}
                {result.sharedCurrent >= 0 ? "↓" : "↑"}
              </text>
            </svg>
          </div>

          <div className="kirchhoff-balances">
            <section
              className={Math.abs(result.kclResidual) < 1e-10 ? "pass" : ""}
            >
              <span>KCL AT JUNCTION {junction}</span>
              <strong>
                {junction === "B"
                  ? `I₁ − I₂ − I₃ = ${(result.kclResidual * 1000).toExponential(1)} mA`
                  : `I₂ + I₃ − I₁ = ${(-result.kclResidual * 1000).toExponential(1)} mA`}
              </strong>
              <small>ΣI in = ΣI out ✓</small>
            </section>
            <section
              className={Math.abs(selectedResidual) < 1e-10 ? "pass" : ""}
            >
              <span>KVL AROUND {loop.toUpperCase()} LOOP</span>
              <strong>ΣΔV = {selectedResidual.toExponential(2)} V</strong>
              <small>signed rises and drops return to zero ✓</small>
            </section>
            <section
              className={Math.abs(result.powerResidual) < 1e-10 ? "pass" : ""}
            >
              <span>POWER CHECK</span>
              <strong>{result.sourcePower.toFixed(3)} W supplied</strong>
              <small>{result.resistorPower.toFixed(3)} W dissipated</small>
            </section>
          </div>
        </main>

        <aside className="kirchhoff-analysis" aria-label="KCL and KVL analysis">
          <h3>Select junction</h3>
          <div className="kirchhoff-choice">
            {(["B", "D"] as const).map((item) => (
              <button
                key={item}
                className={junction === item ? "active" : ""}
                aria-pressed={junction === item}
                onClick={() => {
                  setJunction(item);
                  setTraceStep(0);
                }}
              >
                Junction {item}
              </button>
            ))}
          </div>
          <h3>Select loop</h3>
          <div className="kirchhoff-choice">
            {(["left", "right"] as const).map((item) => (
              <button
                key={item}
                className={loop === item ? "active" : ""}
                aria-pressed={loop === item}
                onClick={() => {
                  setLoop(item);
                  setTraceStep(0);
                  setRunState("idle");
                }}
              >
                {item === "left" ? "Loop 1" : "Loop 2"}
              </button>
            ))}
          </div>
          <h3>Signed voltage ledger</h3>
          <VoltageLedger
            input={input}
            result={result}
            loop={loop}
            traceStep={traceStep}
          />
          <div className="kirchhoff-matrix">
            <span>MATRIX SOLUTION</span>
            <strong>[A] [I] = [E]</strong>
            <code>
              [{input.resistance1 + input.resistance2 + input.sharedResistance},
              −{input.sharedResistance}]{"\n"}
              [−{input.sharedResistance},{" "}
              {input.resistance4 + input.resistance5 + input.sharedResistance}]
            </code>
          </div>
        </aside>
      </div>

      <div className="kirchhoff-mission">
        <div>
          <span>MINI-MISSION · NULL THE SHARED BRANCH</span>
          <h3>Adjust R₅ until I₃ = 0</h3>
          <p>
            At balance, both mesh currents are equal and the shared resistor has
            no voltage drop.
          </p>
        </div>
        <div className="kirchhoff-target">
          <span>PREDICT I₃ BEFORE TRACE</span>
          <div className="kirchhoff-prediction" role="group" aria-label="Shared current prediction">{(["up","zero","down"] as const).map(item=><button key={item} aria-label={`Predict ${item === "up" ? "upward" : item === "down" ? "downward" : "zero"} shared current`} className={prediction===item?"active":""} onClick={()=>{setPrediction(item);setPredictionFeedback("")}}>{item === "up" ? "↑" : item === "down" ? "↓" : "0"}</button>)}</div>
          {predictionFeedback && <small aria-live="polite">{predictionFeedback}</small>}
          <span>Calculated balance</span>
          <strong>
            {balanceInRange
              ? `${result.balanceResistance5.toFixed(1)} Ω`
              : "outside control range"}
          </strong>
          <button
            disabled={!balanceInRange}
            onClick={() => update("resistance5", result.balanceResistance5)}
          >
            Set calculated R₅
          </button>
        </div>
        <div className={missionComplete ? "complete" : ""}>
          <strong>I₃ = {(result.sharedCurrent * 1000).toFixed(4)} mA</strong>
          <button
            onClick={() =>
              setMissionFeedback(
                missionComplete
                  ? `✓ Balanced: R₅ = ${input.resistance5.toFixed(1)} Ω and the bridge branch is null.`
                  : "Keep adjusting R₅ until the shared current is within ±0.001 mA.",
              )
            }
          >
            Check balance
          </button>
          {missionFeedback && <p aria-live="polite">{missionFeedback}</p>}
        </div>
      </div>

      <footer className="kirchhoff-footer">
        <div>
          <button
            aria-label="Resume circuit trace from footer"
            onClick={play}
            disabled={runState === "running"}
          >
            ▶ Resume
          </button>
          <button
            aria-label="Pause circuit trace from footer"
            onClick={() => setRunState("paused")}
            disabled={runState !== "running"}
          >
            Ⅱ Pause
          </button>
          <button aria-label="Step circuit trace from footer" onClick={step}>
            ▮▶ Step
          </button>
        </div>
        <label>
          Speed{" "}
          <select
            aria-label="Playback speed"
            value={playback}
            onChange={(event) => setPlayback(Number(event.target.value))}
          >
            {[0.25, 0.5, 1, 1.5, 2].map((value) => (
              <option key={value} value={value}>
                {value}×
              </option>
            ))}
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(event) => setReducedMotion(event.target.checked)}
          />{" "}
          Reduced motion
        </label>
        <span>KCL and both KVL residuals verified</span>
      </footer>
      <p className="sr-only" aria-live="polite">
        Mesh current one {(result.mesh1 * 1000).toFixed(3)} milliamperes. Mesh
        current two {(result.mesh2 * 1000).toFixed(3)} milliamperes. Shared
        current {(result.sharedCurrent * 1000).toFixed(3)} milliamperes. KCL
        residual {result.kclResidual.toExponential(2)} amperes. Left loop
        residual {result.kvlLeftResidual.toExponential(2)} volts. Right loop
        residual {result.kvlRightResidual.toExponential(2)} volts.
      </p>
    </section>
  );
}

function Control({
  label,
  value,
  min,
  max,
  step,
  unit,
  digits = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  digits?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="kirchhoff-control">
      <span>
        <b>{label}</b>
        <strong>
          {value.toFixed(digits)} {unit}
        </strong>
      </span>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <small>
        {min} — {max} {unit}
      </small>
    </label>
  );
}

function Component({
  x,
  y,
  label,
  value,
  vertical = false,
  active,
}: {
  x: number;
  y: number;
  label: string;
  value: number;
  vertical?: boolean;
  active: boolean;
}) {
  return (
    <g
      className={`resistor ${active ? "active" : ""}`}
      transform={`translate(${x} ${y}) ${vertical ? "rotate(90)" : ""}`}
    >
      <line x1="-48" x2="-24" />
      <path d="M-24 0 l8 -10 l12 20 l12 -20 l12 20 l12 -20 l8 10" />
      <line x1="40" x2="48" />
      <text y="-18">
        {label} {value.toFixed(0)} Ω
      </text>
    </g>
  );
}
function Battery({
  x,
  y,
  label,
  value,
  active,
}: {
  x: number;
  y: number;
  label: string;
  value: number;
  active: boolean;
}) {
  return (
    <g
      className={`battery ${active ? "active" : ""}`}
      transform={`translate(${x} ${y})`}
    >
      <line y1="-42" y2="-11" />
      <line x1="-18" x2="18" y1="-10" y2="-10" />
      <line x1="-10" x2="10" y1="9" y2="9" />
      <line y1="10" y2="43" />
      <text x="26" y="5">
        {label} {value.toFixed(1)} V
      </text>
    </g>
  );
}
function Node({
  x,
  y,
  label,
  active,
}: {
  x: number;
  y: number;
  label: string;
  active: boolean;
}) {
  return (
    <g
      className={`node ${active ? "active" : ""}`}
      transform={`translate(${x} ${y})`}
    >
      <circle r="8" />
      <text y="-14">{label}</text>
    </g>
  );
}

function VoltageLedger({
  input,
  result,
  loop,
  traceStep,
}: {
  input: KirchhoffInput;
  result: ReturnType<typeof solveKirchhoff>;
  loop: Loop;
  traceStep: number;
}) {
  const rows =
    loop === "left"
      ? [
          ["E₁ rise", input.source1],
          ["R₁ drop", -result.mesh1 * input.resistance1],
          ["R₂ drop", -result.mesh1 * input.resistance2],
          ["R₃ drop", -result.sharedCurrent * input.sharedResistance],
        ]
      : [
          ["E₂ rise", input.source2],
          ["R₄ drop", -result.mesh2 * input.resistance4],
          ["R₅ drop", -result.mesh2 * input.resistance5],
          ["R₃ rise", result.sharedCurrent * input.sharedResistance],
        ];
  let cumulative = 0;
  return (
    <ol className="kirchhoff-ledger">
      {rows.map(([label, value], index) => {
        cumulative += Number(value);
        return (
          <li
            key={String(label)}
            className={traceStep === index + 1 ? "active" : ""}
          >
            <span>{label}</span>
            <strong>
              {Number(value) >= 0 ? "+" : ""}
              {Number(value).toFixed(3)} V
            </strong>
            <small>Σ {cumulative.toFixed(3)} V</small>
          </li>
        );
      })}
      <li className="total">
        <span>Loop closure</span>
        <strong>
          {(loop === "left"
            ? result.kvlLeftResidual
            : result.kvlRightResidual
          ).toExponential(1)}{" "}
          V
        </strong>
      </li>
    </ol>
  );
}
