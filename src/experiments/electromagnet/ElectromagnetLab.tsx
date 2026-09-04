import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  minimumCurrentForLoad,
  solveElectromagnet,
  type CoreMaterial,
  type ElectromagnetInput,
} from "./electromagnetSimulation";
import "./electromagnet.css";
import "./electromagnet-direct.css";
type Run = "idle" | "running" | "paused" | "result";
const D: ElectromagnetInput = {
  currentA: 2.5,
  turns: 800,
  core: "iron",
  polarity: 1,
  airGapMm: 2,
  targetLoad: 20,
};
const f = (n: number, d = 2) => n.toFixed(d);
export function ElectromagnetLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(D),
    [run, setRun] = useState<Run>("idle"),
    [speed, setSpeed] = useState(1),
    [energized, setEnergized] = useState(1),
    [phase, setPhase] = useState(0),
    [reduced, setReduced] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [mission, setMission] = useState(false),
    [feedback, setFeedback] = useState("");
  const result = useMemo(
    () =>
      solveElectromagnet({ ...input, currentA: input.currentA * energized }),
    [input, energized],
  );
  useEffect(() => {
    if (run !== "running") return;
    const id = window.setInterval(
      () => {
        setEnergized((v) => {
          const next = Math.min(1, v + (reduced ? 1 : 0.015 * speed));
          if (next >= 1) setRun("result");
          return next;
        });
        setPhase((p) => (p + 2 * speed) % 100);
      },
      reduced ? 180 : 45,
    );
    return () => clearInterval(id);
  }, [run, speed, reduced]);
  const update = (p: Partial<ElectromagnetInput>) => {
    setInput((v) => ({ ...v, ...p }));
    setFeedback("");
  };
  const reset = () => {
    setInput(D);
    setRun("idle");
    setEnergized(1);
    setPhase(0);
    setMission(false);
    setFeedback("");
  };
  const play = () => {
    if (energized >= 1) setEnergized(0);
    setRun("running");
  };
  const startMission = () => {
    const base = {
      ...D,
      turns: 1200,
      core: "iron" as CoreMaterial,
      airGapMm: 1,
      targetLoad: 25,
      polarity: 1 as 1,
    };
    setMission(true);
    setInput({ ...base, currentA: 1 });
    setEnergized(1);
    setFeedback(
      "Lift 25 washers using the lowest safe current. Temperature must stay below 70 °C and voltage below 24 V.",
    );
  };
  const optimal = minimumCurrentForLoad(input, input.targetLoad);
  const check = () => {
    const pass =
      result.liftedWashers >= input.targetLoad &&
      result.safe &&
      input.currentA <= optimal + 0.001;
    setFeedback(
      pass
        ? `✓ Optimal safe lift: ${result.liftedWashers} washers at ${f(input.currentA)} A (${input.turns * input.currentA} ampere-turns).`
        : `Current design lifts ${result.liftedWashers}/${input.targetLoad}. Lowest safe solution is ${f(optimal)} A for this coil, core and gap.`,
    );
    if (pass) setRun("result");
  };
  const polaritySign = input.polarity === 1 ? 1 : -1,
    lift = Math.min(175, result.liftedWashers * 5) * energized;
  return (
    <section
      className="magnet-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header>
        <div>
          <span>MAGNETISM · CLASS 7 / 10</span>
          <h2>Electromagnet Crane</h2>
          <p>
            Build ampere-turns, reverse the poles, and lift iron while
            respecting electrical limits.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="magnet-layout">
        <aside className="magnet-controls" aria-label="Electromagnet controls">
          <h3>Core & coil</h3>
          <Control
            label="Turns N"
            aria="Coil turns"
            value={input.turns}
            min={100}
            max={2000}
            step={50}
            unit="turns"
            onChange={(v) => update({ turns: v })}
          />
          <div className="core-buttons">
            {(["air", "iron", "steel"] as CoreMaterial[]).map((c) => (
              <button
                className={input.core === c ? "active" : ""}
                onClick={() => update({ core: c })}
                key={c}
              >
                {c}
              </button>
            ))}
          </div>
          <h3>Current & polarity</h3>
          <Control
            label="Current I"
            aria="Current"
            value={input.currentA}
            min={0}
            max={5}
            step={0.05}
            unit="A"
            onChange={(v) => update({ currentA: v })}
          />
          <button
            className="polarity"
            onClick={() =>
              update({ polarity: (input.polarity === 1 ? -1 : 1) as 1 | -1 })
            }
          >
            ⇄ Reverse current · {input.polarity === 1 ? "normal" : "reversed"}
          </button>
          <h3>Magnetic circuit</h3>
          <Control
            label="Air gap g"
            aria="Air gap"
            value={input.airGapMm}
            min={0}
            max={10}
            step={0.25}
            unit="mm"
            onChange={(v) => update({ airGapMm: v })}
          />
          <Control
            label="Target load"
            aria="Target washers"
            value={input.targetLoad}
            min={1}
            max={50}
            step={1}
            unit="washers"
            onChange={(v) => update({ targetLoad: v })}
          />
        </aside>
        <main className="magnet-main">
          <div className="magnet-toolbar">
            <div>
              <button onClick={play} disabled={run === "running"}>
                ▶ Energize
              </button>
              <button
                onClick={() => setRun("paused")}
                disabled={run === "paused"}
              >
                Ⅱ Pause
              </button>
              <button
                onClick={() => {
                  setRun("paused");
                  setEnergized((v) => Math.min(1, v + 0.05));
                  setPhase((p) => p + 5);
                }}
              >
                ▷ Step
              </button>
            </div>
            <label>
              Speed{" "}
              <select
                aria-label="Playback speed"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              >
                <option value=".25">0.25×</option>
                <option value=".5">0.5×</option>
                <option value="1">1×</option>
                <option value="2">2×</option>
              </select>
            </label>
            <label>
              <input
                aria-label="Reduced motion"
                type="checkbox"
                checked={reduced}
                onChange={(e) => setReduced(e.target.checked)}
              />{" "}
              Reduced motion
            </label>
          </div>
          <section
            className="magnet-stage"
            aria-label="Two-dimensional electromagnet crane with current, field and lifted iron"
          >
            <img
              src="/assets/experiments/electromagnet/electromagnet-crane.png"
              alt="Transparent electromagnet crane and steel washer tray"
            />
            <button className="magnet-direct-current" aria-label={`Drag electromagnet current, ${input.currentA.toFixed(1)} amperes`}
              onPointerDown={event=>event.currentTarget.setPointerCapture(event.pointerId)}
              onPointerMove={event=>{if(!event.currentTarget.hasPointerCapture(event.pointerId))return;const rect=event.currentTarget.getBoundingClientRect();update({currentA:Math.max(0,Math.min(5,(event.clientX-rect.left)/rect.width*5))})}}
              onKeyDown={event=>{if(event.key==="ArrowLeft")update({currentA:input.currentA-.1});if(event.key==="ArrowRight")update({currentA:input.currentA+.1})}}><i style={{left:`${input.currentA/5*100}%`}}/><span>DRAG CURRENT ↔</span></button>
            <svg
              viewBox="0 0 1536 1024"
              role="img"
              aria-label={`${f(result.signedB, 3)} tesla; ${result.liftedWashers} washers lifted; ${input.polarity === 1 ? "bottom north" : "top north"}`}
            >
              <g
                className="field-lines"
                opacity={Math.min(0.9, result.magnitudeB / 0.7)}
                transform={`translate(810 380) scale(1 ${polaritySign})`}
              >
                {[0, 1, 2, 3].map((i) => (
                  <path
                    key={i}
                    d={`M${-70 - i * 18} 20C${-250 - i * 30} ${100 + i * 22} ${-235 - i * 25} ${290 + i * 24} 0 ${330 + i * 18}C${235 + i * 25} ${290 + i * 24} ${250 + i * 30} ${100 + i * 22} ${70 + i * 18} 20`}
                  />
                ))}
              </g>
              <g className="pole-labels">
                <text x="780" y="320">
                  {input.polarity === 1 ? "S" : "N"}
                </text>
                <text x="780" y="610">
                  {input.polarity === 1 ? "N" : "S"}
                </text>
              </g>
              <g className="current-packets">
                {Array.from({ length: 12 }, (_, i) => (
                  <circle
                    key={i}
                    cx={735 + (i % 3) * 38}
                    cy={250 + ((i * 57 + phase * 7) % 270)}
                    r="6"
                  />
                ))}
              </g>
              <g className="lifted" transform={`translate(0 ${-lift})`}>
                {Array.from(
                  { length: Math.min(result.liftedWashers, 30) },
                  (_, i) => (
                    <circle
                      key={i}
                      cx={730 + (i % 6) * 30}
                      cy={870 + Math.floor(i / 6) * 25}
                      r="10"
                    />
                  ),
                )}
              </g>
            </svg>
            <div className="magnet-readout">
              <b>{f(result.signedB, 3)} T</b>
              <span>{result.liftedWashers} washers lifted</span>
              <span>{result.northPole} pole is N</span>
            </div>
          </section>
          <section className="magnet-equation">
            <b>B ≈ μ₀NI / (g + ℓcore/μr)</b>
            <span>
              {f(result.ampereTurns, 0)} A·turn · saturation-limited to{" "}
              {f(result.magnitudeB, 3)} T
            </span>
          </section>
          <section
            className="strength-graph"
            aria-label="Magnetic field versus current graph"
          >
            <header>
              <b>B vs current</b>
              <span>current core, turns and gap</span>
            </header>
            <svg viewBox="0 0 500 145">
              <line x1="42" y1="120" x2="480" y2="120" />
              <line x1="42" y1="15" x2="42" y2="120" />
              <polyline
                points={Array.from({ length: 21 }, (_, i) => {
                  const q = solveElectromagnet({ ...input, currentA: i / 4 });
                  return `${42 + (i * 438) / 20},${120 - (q.magnitudeB / 2) * 100}`;
                }).join(" ")}
              />
              <circle
                cx={42 + (input.currentA / 5) * 438}
                cy={120 - (result.magnitudeB / 2) * 100}
                r="5"
              />
            </svg>
          </section>
        </main>
        <aside
          className="magnet-analysis"
          aria-label="Live electromagnet measurements"
        >
          <h3>Live data</h3>
          <Reading label="Current" value={`${f(result.currentA)} A`} />
          <Reading
            label="Ampere-turns NI"
            value={`${f(result.ampereTurns, 0)} A·turn`}
          />
          <Reading
            label="Flux density B"
            value={`${f(result.signedB, 3)} T`}
            hot
          />
          <Reading label="Lift force" value={`${f(result.liftForceN)} N`} />
          <Reading
            label="Battery voltage"
            value={`${f(result.batteryVoltage)} V`}
          />
          <Reading label="Power" value={`${f(result.powerW)} W`} />
          <Reading
            label="Coil temperature"
            value={`${f(result.temperatureC, 1)} °C`}
          />
          <section className={result.safe ? "safety safe" : "safety danger"}>
            <b>{result.safe ? "✓ SAFE OPERATING POINT" : "⚠ LIMIT EXCEEDED"}</b>
            <span>T ≤ 70 °C · V ≤ 24 V</span>
          </section>
          <section className="hand-rule">
            <b>Right-hand grip rule</b>
            <span>
              Fingers follow conventional current; thumb points to the core's
              north pole. Reversing I swaps N and S, not |B|.
            </span>
          </section>
        </aside>
      </div>
      <section
        className="magnet-mission"
        aria-label="Lowest safe current lifting mission"
      >
        <div>
          <span>CHALLENGE</span>
          <b>Lift 25 washers at the lowest safe current.</b>
          <small>Use 1200 turns, iron core and a 1 mm air gap.</small>
        </div>
        <button onClick={startMission}>Start challenge</button>
        {mission && (
          <button onClick={() => update({ currentA: optimal })}>
            Set calculated minimum
          </button>
        )}
        {mission && <button onClick={check}>Test lift</button>}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
function Reading({
  label,
  value,
  hot = false,
}: {
  label: string;
  value: string;
  hot?: boolean;
}) {
  return (
    <div className={hot ? "magnet-reading hot" : "magnet-reading"}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function Control({
  label,
  aria,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  aria: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="magnet-control">
      <span>
        {label}
        <strong>
          {value} {unit}
        </strong>
      </span>
      <input
        aria-label={aria}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <small>
        {min} — {max} {unit}
      </small>
    </label>
  );
}
