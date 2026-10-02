import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  freeFallState,
  impactTime,
  type FreeFallInput,
} from "./freeFallSimulation";
import "./free-fall.css";
const D: FreeFallInput = {
    heightM: 20,
    initialVelocityMps: 0,
    gravity: 9.81,
    airResistance: false,
  },
  f = (n: number, d = 2) => n.toFixed(d);
function R({
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
    <label className="ff-range">
      <span>
        {label}
        <b>
          {f(value, step < 0.1 ? 2 : 1)} {unit}
        </b>
      </span>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <small>
        {min}
        <i>{max}</i>
      </small>
    </label>
  );
}
export function FreeFallLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(D),
    [time, setTime] = useState(0),
    [running, setRunning] = useState(false),
    [countdown, setCountdown] = useState(0),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [mission, setMission] = useState(false),
    [prediction, setPrediction] = useState(""),
    [feedback, setFeedback] = useState("");
  const state = useMemo(() => freeFallState(input, time), [input, time]),
    impact = useMemo(() => impactTime(input), [input]);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => {
        if (countdown > 0) {
          setCountdown((c) => Math.max(0, c - 1));
          return;
        }
        setTime((t) => {
          const n = Math.min(impact, t + (reduced ? 0.15 : 0.035) * speed);
          if (n >= impact) setRunning(false);
          return n;
        });
      },
      countdown > 0 ? 600 : reduced ? 150 : 35,
    );
    return () => clearInterval(id);
  }, [countdown, impact, reduced, running, speed]);
  const update = (c: Partial<FreeFallInput>) => {
      setInput((o) => ({ ...o, ...c }));
      setTime(0);
      setRunning(false);
      setFeedback("");
    },
    reset = () => {
      setInput(D);
      setTime(0);
      setRunning(false);
      setCountdown(0);
      setSpeed(1);
      setMission(false);
      setPrediction("");
      setFeedback("");
    },
    start = () => {
      if (time >= impact) setTime(0);
      setCountdown(3);
      setRunning(true);
    },
    check = () => {
      const p = Number(prediction),
        err = Math.abs(p - impact);
      setFeedback(
        Number.isFinite(p) && err <= 0.02
          ? `✓ Prediction within 0.02 s: expected ${f(impact, 3)} s, error ${f(err, 3)} s.`
          : `Impact is ${f(impact, 3)} s. Your error is ${Number.isFinite(err) ? f(err, 3) : "not a number"} s; use y=0.`,
      );
    };
  const py = 12 + (1 - state.heightM / input.heightM) * 460,
    vlen = Math.min(140, Math.abs(state.velocityMps) * 7),
    samples = Array.from({ length: 31 }, (_, i) =>
      freeFallState(input, (impact * i) / 30),
    ),
    path = (
      key: "heightM" | "velocityMps" | "accelerationMps2",
      min: number,
      max: number,
    ) =>
      samples
        .map(
          (s, i) =>
            `${12 + i * 5.8},${105 - ((s[key] - min) / (max - min)) * 88}`,
        )
        .join(" ");
  return (
    <section
      className="ff-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header data-ui-theme="dark">
        <div>
          <span>CINEMATIC DROP-TOWER LAB</span>
          <h2>Free Fall & Vertical Motion</h2>
          <p>
            Gravity changes velocity every second—mass does not change ideal
            acceleration.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="ff-layout">
        <aside className="ff-controls">
          <h3>Initial conditions</h3>
          <R
            label="Initial height"
            value={input.heightM}
            min={2}
            max={50}
            step={1}
            unit="m"
            onChange={(heightM) => update({ heightM })}
          />
          <R
            label="Initial velocity"
            value={input.initialVelocityMps}
            min={-15}
            max={15}
            step={0.5}
            unit="m/s"
            onChange={(initialVelocityMps) => update({ initialVelocityMps })}
          />
          <R
            label="Gravity"
            value={input.gravity}
            min={1.62}
            max={24.79}
            step={0.01}
            unit="m/s²"
            onChange={(gravity) => update({ gravity })}
          />
          <label className="ff-switch">
            <input
              aria-label="Air resistance"
              type="checkbox"
              checked={input.airResistance}
              onChange={(e) => update({ airResistance: e.target.checked })}
            />
            <span>Air resistance</span>
            <b>{input.airResistance ? "ON" : "OFF"}</b>
          </label>
          <div className="ff-presets">
            <button onClick={() => update({ gravity: 1.62 })}>Moon</button>
            <button onClick={() => update({ gravity: 9.81 })}>Earth</button>
            <button onClick={() => update({ gravity: 24.79 })}>Jupiter</button>
          </div>
          <div className="ff-condition-presets" aria-label="Condition presets">
            <button
              onClick={() =>
                update({
                  heightM: 2,
                  initialVelocityMps: -15,
                  gravity: 1.62,
                  airResistance: false,
                })
              }
            >
              Minimums
            </button>
            <button onClick={() => update(D)}>Typical</button>
            <button
              onClick={() =>
                update({
                  heightM: 50,
                  initialVelocityMps: 15,
                  gravity: 24.79,
                  airResistance: true,
                })
              }
            >
              Maximums
            </button>
          </div>
          <p>
            Without drag: a = −g for every mass. With quadratic drag,
            acceleration depends on velocity.
          </p>
        </aside>
        <main className="ff-main">
          <div className="ff-toolbar">
            <div>
              <button onClick={start}>▶ Release</button>
              <button onClick={() => setRunning(false)}>Ⅱ Pause</button>
              <button
                onClick={() => {
                  setRunning(false);
                  setTime((t) => Math.min(impact, t + 0.05));
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
            className="ff-stage"
            aria-label={`Mass height ${f(state.heightM)} metres, velocity ${f(state.velocityMps)} metres per second, acceleration ${f(state.accelerationMps2)} metres per second squared`}
          >
            <img
              src="/assets/experiments/free-fall/drop-tower.png"
              alt="Transparent free-fall drop tower"
            />
            <div
              className={state.impacted ? "ff-ball impact" : "ff-ball"}
              style={{ top: `${Math.min(86, py / 5.1)}%` }}
            />
            <span
              className="ff-vector"
              style={{
                top: `${Math.min(84, py / 5.1) + 4}%`,
                height: `${vlen}px`,
              }}
            >
              ↓
            </span>
            {countdown > 0 && <strong>{countdown}</strong>}
            <div className="ff-clock">{f(time, 3)} s</div>
            {state.impacted && <em>IMPACT · t = {f(impact, 3)} s</em>}
          </section>
          <section className="ff-equations">
            <b>y = y₀ + v₀t − ½gt²</b>
            <b>v = v₀ − gt</b>
            <b>a = −g</b>
          </section>
        </main>
        <aside className="ff-data">
          <h3>Live measurements</h3>
          <dl>
            <div>
              <dt>Time</dt>
              <dd>{f(time, 3)} s</dd>
            </div>
            <div>
              <dt>Height y</dt>
              <dd>{f(state.heightM)} m</dd>
            </div>
            <div>
              <dt>Velocity v</dt>
              <dd>{f(state.velocityMps)} m/s</dd>
            </div>
            <div>
              <dt>Acceleration a</dt>
              <dd>{f(state.accelerationMps2)} m/s²</dd>
            </div>
          </dl>
          {[
            ["Position y", path("heightM", 0, input.heightM)],
            [
              "Velocity v",
              path(
                "velocityMps",
                -Math.max(1, Math.sqrt(2 * input.gravity * input.heightM)),
                Math.max(1, input.initialVelocityMps),
              ),
            ],
            [
              "Acceleration a",
              path("accelerationMps2", -input.gravity * 1.1, 1),
            ],
          ].map(([n, p]) => (
            <section className="ff-graph" key={n}>
              <b>{n}</b>
              <svg viewBox="0 0 190 115">
                <line x1="10" y1="105" x2="185" y2="105" />
                <polyline points={p} />
              </svg>
            </section>
          ))}
        </aside>
      </div>
      <section className="ff-mission">
        <div>
          <span>CHALLENGE</span>
          <b>Predict impact time before release.</b>
          <small>
            Use the current height, upward-positive initial velocity, gravity
            and drag setting.
          </small>
        </div>
        <button
          onClick={() => {
            setMission(true);
            setTime(0);
            setFeedback("Enter a prediction before pressing Release.");
          }}
        >
          Start challenge
        </button>
        {mission && (
          <input
            aria-label="Predicted impact time"
            inputMode="decimal"
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
            placeholder="seconds"
          />
        )}
        {mission && (
          <button onClick={() => setPrediction(f(impact, 3))}>
            Use calculated prediction
          </button>
        )}
        {mission && <button onClick={check}>Check prediction</button>}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
