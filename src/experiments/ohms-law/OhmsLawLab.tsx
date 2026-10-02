import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  DEFAULT_OHMS_INPUT,
  ohmsMaterials,
  solveOhms,
  sweepOhms,
  type OhmsInput,
  type OhmsMaterial,
} from "./ohmsLawPhysics";
import "./ohms-law.css";

type RunState = "idle" | "running" | "paused" | "result";
export function OhmsLawLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(DEFAULT_OHMS_INPUT);
  const [count, setCount] = useState(1);
  const [run, setRun] = useState<RunState>("idle");
  const [speed, setSpeed] = useState(1);
  const [reduced, setReduced] = useState(
    () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  const [mission, setMission] = useState(false);
  const [answer, setAnswer] = useState<"ohmic" | "non-ohmic" | "">("");
  const [feedback, setFeedback] = useState("");
  const solved = useMemo(() => solveOhms(input), [input]);
  const points = useMemo(
    () => sweepOhms(input),
    [input.material, input.resistance, input.temperature],
  );
  useEffect(() => {
    if (run !== "running") return;
    const timer = window.setTimeout(
      () =>
        setCount((c) => {
          const n = c + 1;
          setInput((v) => ({
            ...v,
            voltage: Math.min(12, (12 * (Math.min(n, 7) - 1)) / 6),
          }));
          if (n >= 7) {
            setRun("result");
            return 7;
          }
          return n;
        }),
      (reduced ? 1200 : 650) / speed,
    );
    return () => clearTimeout(timer);
  }, [run, count, speed, reduced]);
  const update = <K extends keyof OhmsInput>(key: K, value: OhmsInput[K]) => {
    setInput((v) => ({ ...v, [key]: value }));
    setCount(1);
    setRun("idle");
    setFeedback("");
  };
  const reset = () => {
    setInput(DEFAULT_OHMS_INPUT);
    setCount(1);
    setRun("idle");
    setMission(false);
    setAnswer("");
    setFeedback("");
  };
  const play = () => {
    if (run === "result") {
      setCount(1);
      setInput((v) => ({ ...v, voltage: 0 }));
    }
    if (run === "idle" && count === 1)
      setInput((v) => ({ ...v, voltage: 0 }));
    setRun("running");
  };
  const step = () => {
    setRun("paused");
    setCount((c) => {
      const n = c >= 7 ? 1 : c + 1;
        setInput((v) => ({
          ...v,
          voltage: (12 * (Math.min(n, 7) - 1)) / 6,
        }));
      return n;
    });
  };
  const visible = points.slice(0, count);
  const maxI = Math.max(...points.map((p) => p.current), 0.01);
  const path = visible
    .map(
      (p, i) =>
        `${i ? "L" : "M"} ${48 + (p.current / maxI) * 390} ${260 - (p.voltage / 12) * 220}`,
    )
    .join(" ");
  const finalPoint = points[points.length - 1];
  const slope = finalPoint.voltage / finalPoint.current;
  const startMission = () => {
    setMission(true);
    setInput({ ...DEFAULT_OHMS_INPUT, material: "filament" });
    setCount(7);
    setAnswer("");
    setFeedback(
      "Unknown sample loaded. Inspect whether V/I stays constant across the plotted points.",
    );
  };
  const check = () =>
    setFeedback(
      answer === "non-ohmic"
        ? "✓ Correct: the curved V–I trace and changing V/I identify a non-ohmic filament."
        : "Not quite. Its secant slope changes as voltage heats the filament.",
    );
  return (
    <section
      className="ohm-lab"
      data-ui-theme="light"
      data-run-state={run}
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="ohm-head">
        <div>
          <span>ELECTRICITY · CLASS 10 / 12</span>
          <h2>Ohm’s Law · Live V–I Graph</h2>
          <p>
            Raise voltage point by point; compare a straight ohmic trace with a
            heated filament.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="ohm-layout">
        <aside className="ohm-controls" aria-label="Ohm law controls">
          <h3>Experiment controls</h3>
          <Control
            label="Supply voltage"
            value={input.voltage}
            min={0}
            max={12}
            step={0.2}
            unit="V"
            onChange={(v) => update("voltage", v)}
          />
          <Control
            label="Reference resistance"
            value={input.resistance}
            min={1}
            max={40}
            step={1}
            unit="Ω"
            onChange={(v) => update("resistance", v)}
          />
          <label className="ohm-select">
            <span>Test material</span>
            <select
              aria-label="Test material"
              value={input.material}
              onChange={(e) =>
                update("material", e.target.value as OhmsMaterial)
              }
            >
              {Object.entries(ohmsMaterials).map(([id, m]) => (
                <option key={id} value={id}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
          <Control
            label="Sample temperature"
            value={input.temperature}
            min={-20}
            max={200}
            step={5}
            unit="°C"
            onChange={(v) => update("temperature", v)}
          />
          <div className="ohm-presets">
            <button
              onClick={() =>
                setInput({
                  voltage: 0,
                  resistance: 1,
                  material: "copper",
                  temperature: -20,
                })
              }
            >
              Minimum setup
            </button>
            <button onClick={() => setInput(DEFAULT_OHMS_INPUT)}>
              Typical setup
            </button>
            <button
              onClick={() =>
                setInput({
                  voltage: 12,
                  resistance: 40,
                  material: "filament",
                  temperature: 200,
                })
              }
            >
              Maximum setup
            </button>
          </div>
        </aside>
        <main className="ohm-main">
          <div className="ohm-toolbar">
            <div>
              <button onClick={play} disabled={run === "running"}>
                ▶ {run === "result" ? "Replay" : "Play sweep"}
              </button>
              <button
                onClick={() => setRun("paused")}
                disabled={run !== "running"}
              >
                Ⅱ Pause
              </button>
              <button onClick={step}>▮▶ Add point</button>
            </div>
            <strong>Point {count}/7</strong>
          </div>
          <div className="ohm-stage">
            <img
              src="/assets/experiments/ohms-law/apparatus.png"
              alt="DC supply, switch, ammeter, voltmeter, rheostat and sample on a wooden lab board"
            />
            <button className="ohm-direct-rheostat" aria-label={`Drag rheostat voltage, ${input.voltage.toFixed(1)} volts`}
              onPointerDown={event=>event.currentTarget.setPointerCapture(event.pointerId)}
              onPointerMove={event=>{if(!event.currentTarget.hasPointerCapture(event.pointerId))return;const rect=event.currentTarget.getBoundingClientRect();update("voltage",Math.max(0,Math.min(12,(event.clientX-rect.left)/rect.width*12)));}}
              onKeyDown={event=>{if(event.key==="ArrowLeft")update("voltage",input.voltage-.1);if(event.key==="ArrowRight")update("voltage",input.voltage+.1)}}>
              <i style={{left:`${input.voltage/12*100}%`}}/><span>DRAG RHEOSTAT</span>
            </button>
            <div className="ohm-meter current">
              <span>CURRENT</span>
              <b>{solved.current.toFixed(3)} A</b>
            </div>
            <div className="ohm-meter voltage">
              <span>VOLTAGE</span>
              <b>{input.voltage.toFixed(2)} V</b>
            </div>
            <div
              className="ohm-flow"
              style={{ opacity: Math.min(1, solved.current / 2) }}
            >
              ● · ● · ● · ●
            </div>
          </div>
          <div className="ohm-identities">
            <div>
              <span>MEASURED</span>
              <b>V = {input.voltage.toFixed(2)} V</b>
            </div>
            <div>
              <span>MEASURED</span>
              <b>I = {solved.current.toFixed(3)} A</b>
            </div>
            <div>
              <span>RATIO / SLOPE</span>
              <b>V/I = {solved.effectiveResistance.toFixed(2)} Ω</b>
            </div>
            <div>
              <span>POWER</span>
              <b>{solved.power.toFixed(2)} W</b>
            </div>
          </div>
        </main>
        <aside className="ohm-analysis" aria-label="V versus I graph">
          <h3>V versus I</h3>
          <p>Vertical axis V (V) · horizontal axis I (A)</p>
          <svg
            viewBox="0 0 470 300"
            role="img"
            aria-label="Voltage in volts versus current in amperes graph"
          >
            <path className="axes" d="M48 28V260H448" />
            <text x="8" y="35">
              V (V)
            </text>
            <text x="395" y="290">
              I (A)
            </text>
            {[0, 3, 6, 9, 12].map((v) => (
              <g key={v}>
                <line
                  x1="43"
                  x2="448"
                  y1={260 - (v / 12) * 220}
                  y2={260 - (v / 12) * 220}
                />
                <text x="22" y={264 - (v / 12) * 220}>
                  {v}
                </text>
              </g>
            ))}
            <path className="trace" d={path} />
            {visible.map((p, i) => (
              <circle
                key={i}
                cx={48 + (p.current / maxI) * 390}
                cy={260 - (p.voltage / 12) * 220}
                r="5"
              />
            ))}
          </svg>
          <div className={solved.ohmic ? "ohmic" : "non-ohmic"}>
            <strong>
              {mission
                ? "UNKNOWN SAMPLE"
                : solved.ohmic
                  ? "OHMIC SAMPLE"
                  : "NON-OHMIC SAMPLE"}
            </strong>
            <span>
              {solved.ohmic
                ? "Straight line through origin; ΔV/ΔI = R"
                : "Curved trace; V/I and slope change with heating"}
            </span>
            <b>End-point V/I = {slope.toFixed(2)} Ω</b>
          </div>
        </aside>
      </div>
      <section className="ohm-mission">
        <div>
          <span>MINI-MISSION</span>
          <h3>Classify the unknown sample</h3>
          <p>Use graph shape and slope—not appearance.</p>
        </div>
        {!mission ? (
          <button onClick={startMission}>Load unknown sample</button>
        ) : (
          <>
            <label>
              <input
                type="radio"
                name="classify"
                checked={answer === "ohmic"}
                onChange={() => setAnswer("ohmic")}
              />{" "}
              Ohmic
            </label>
            <label>
              <input
                type="radio"
                name="classify"
                checked={answer === "non-ohmic"}
                onChange={() => setAnswer("non-ohmic")}
              />{" "}
              Non-ohmic
            </label>
            <button onClick={check}>Check answer</button>
          </>
        )}
        {feedback && (
          <p
            className={feedback.startsWith("✓") ? "success" : ""}
            aria-live="polite"
          >
            {feedback}
          </p>
        )}
      </section>
      <footer className="ohm-footer">
        <button onClick={play} disabled={run === "running"}>
          ▶ Resume
        </button>
        <button onClick={() => setRun("paused")} disabled={run !== "running"}>
          Ⅱ Pause
        </button>
        <button onClick={step}>▮▶ Step</button>
        <label>
          Speed{" "}
          <select
            aria-label="Playback speed"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          >
            {[0.25, 0.5, 1, 1.5, 2].map((v) => (
              <option key={v} value={v}>
                {v}×
              </option>
            ))}
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={reduced}
            onChange={(e) => setReduced(e.target.checked)}
          />{" "}
          Reduced motion
        </label>
        <span>For a V-versus-I graph, slope ΔV/ΔI has unit Ω.</span>
      </footer>
      <p className="sr-only" aria-live="polite">
        Voltage {input.voltage.toFixed(2)} volts, current{" "}
        {solved.current.toFixed(3)} amperes, effective resistance{" "}
        {solved.effectiveResistance.toFixed(2)} ohms.
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
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="ohm-control">
      <span>
        <b>{label}</b>
        <strong>
          {value.toFixed(step < 1 ? 1 : 0)} {unit}
        </strong>
      </span>
      <input
        type="range"
        aria-label={label}
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
