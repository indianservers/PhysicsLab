import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { DirectAxisControl } from "../shared-2d/DirectAxisControl";
import {
  simulateElasticCollision,
  type ElasticCollisionInput,
} from "./elastic-collisionSimulation";
import "./elastic-collision.css";

const D: ElasticCollisionInput = {
  m1: 0.5,
  m2: 0.5,
  u1: 0.6,
  u2: -0.4,
  restitution: 1,
};
const f = (n: number, d = 2) => (n >= 0 ? "+" : "") + n.toFixed(d);
function Range({
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
    <label className="ec-range">
      <span>
        {label}
        <b>
          {f(value)} {unit}
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
export function ElasticCollisionLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(D),
    [time, setTime] = useState(-1.2),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [mission, setMission] = useState(false),
    [feedback, setFeedback] = useState("");
  const result = useMemo(() => simulateElasticCollision(input), [input]),
    approaching = input.u1 > input.u2;
  useEffect(() => {
    if (!running || !approaching) return;
    const id = window.setInterval(
      () =>
        setTime((old) => {
          const slow = Math.abs(old) < 0.16 ? 0.25 : 1,
            next = old + (reduced ? 0.09 : 0.035) * speed * slow;
          if (next >= 1.2) {
            setRunning(false);
            return 1.2;
          }
          return next;
        }),
      reduced ? 150 : 35,
    );
    return () => clearInterval(id);
  }, [approaching, reduced, running, speed]);
  const update = (change: Partial<ElasticCollisionInput>) => {
    setInput((old) => ({ ...old, ...change }));
    setTime(-1.2);
    setRunning(false);
    setFeedback("");
  };
  const reset = () => {
    setInput(D);
    setTime(-1.2);
    setRunning(false);
    setMission(false);
    setFeedback("");
  };
  const before = time < 0,
    contact = Math.abs(time) < 0.09,
    v1 = before ? input.u1 : result.v1,
    v2 = before ? input.u2 : result.v2,
    r1 = 4 + input.m1 * 1.6,
    r2 = 4 + input.m2 * 1.6,
    x1 = 50 - r1 + (before ? input.u1 * time * 13 : result.v1 * time * 13),
    x2 = 50 + r2 + (before ? input.u2 * time * 13 : result.v2 * time * 13),
    displayX1 = Math.max(r1, Math.min(100 - r1, x1)),
    displayX2 = Math.max(r2, Math.min(100 - r2, x2)),
    phase = contact
      ? "COMPRESSION / CONTACT"
      : before
        ? "APPROACH"
        : "SEPARATION";
  const setStopCase = () =>
    update({ m1: 1, m2: 1, u1: 3, u2: 0, restitution: 1 });
  const check = () =>
    setFeedback(
      Math.abs(result.v1) < 0.02 && approaching
        ? `✓ Cart A stops: v₁f = ${f(result.v1)} m/s while cart B leaves at ${f(result.v2)} m/s.`
        : `Cart A leaves at ${f(result.v1)} m/s. For stationary B and e=1, try equal masses.`,
    );
  return (
    <section
      className="ec-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header>
        <div>
          <span>MOMENTUM & COLLISIONS · AIR TRACK</span>
          <h2>One-Dimensional Collision Lab</h2>
          <p>
            Watch approach, compression and separation while testing both
            conservation laws.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="ec-layout">
        <aside className="ec-controls">
          <h3>Cart A · blue</h3>
          <Range
            label="Mass A"
            value={input.m1}
            min={0.1}
            max={3}
            step={0.1}
            unit="kg"
            onChange={(m1) => update({ m1 })}
          />
          <Range
            label="Velocity A"
            value={input.u1}
            min={-4}
            max={4}
            step={0.1}
            unit="m/s"
            onChange={(u1) => update({ u1 })}
          />
          <h3>Cart B · green</h3>
          <Range
            label="Mass B"
            value={input.m2}
            min={0.1}
            max={3}
            step={0.1}
            unit="kg"
            onChange={(m2) => update({ m2 })}
          />
          <Range
            label="Velocity B"
            value={input.u2}
            min={-4}
            max={4}
            step={0.1}
            unit="m/s"
            onChange={(u2) => update({ u2 })}
          />
          <h3>Collision</h3>
          <Range
            label="Restitution"
            value={input.restitution ?? 1}
            min={0}
            max={1}
            step={0.05}
            unit=""
            onChange={(restitution) => update({ restitution })}
          />
          <div className="ec-presets">
            <button
              onClick={() =>
                update({ m1: 0.1, m2: 0.1, u1: 0.2, u2: -0.2, restitution: 0 })
              }
            >
              Minimums
            </button>
            <button onClick={() => update(D)}>Elastic</button>
            <button
              onClick={() =>
                update({ m1: 3, m2: 3, u1: 4, u2: -4, restitution: 1 })
              }
            >
              Maximums
            </button>
          </div>
          {!approaching && (
            <p className="ec-warning">
              The carts are not closing: choose u₁ &gt; u₂ before running.
            </p>
          )}
        </aside>
        <main className="ec-main">
          <div className="ec-toolbar">
            <div>
              <button disabled={!approaching} onClick={() => setRunning(true)}>
                ▶ Run
              </button>
              <button onClick={() => setRunning(false)}>Ⅱ Pause</button>
              <button
                onClick={() => {
                  setRunning(false);
                  setTime((t) => Math.min(1.2, t + 0.04));
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
            className={contact ? "ec-stage contact" : "ec-stage"}
            aria-label={`${phase}; cart A velocity ${f(v1)} metres per second, cart B velocity ${f(v2)} metres per second`}
          >
            <DirectAxisControl className="ec-direct-launch" label="DRAG CART A VELOCITY ↔" value={input.u1} min={-2} max={2} step={.1} onChange={u1=>update({u1})}/>
            <img
              src="/assets/experiments/elastic-collision/air-track.png"
              alt="Transparent laboratory air track"
            />
            <div
              className="cart a"
              style={{
                left: `${displayX1}%`,
                width: `${r1 * 2}%`,
                transform: `translateX(-50%) scaleX(${contact ? 0.88 : 1})`,
              }}
            >
              <b>A</b>
              <i />
              <i />
            </div>
            <div
              className="cart b"
              style={{
                left: `${displayX2}%`,
                width: `${r2 * 2}%`,
                transform: `translateX(-50%) scaleX(${contact ? 0.88 : 1})`,
              }}
            >
              <b>B</b>
              <i />
              <i />
            </div>
            <span className="velocity va" style={{ left: `${displayX1}%` }}>
              {v1 < 0 ? "←" : "→"} {f(v1)} m/s
            </span>
            <span className="velocity vb" style={{ left: `${displayX2}%` }}>
              {v2 < 0 ? "←" : "→"} {f(v2)} m/s
            </span>
            <strong>{phase}</strong>
            {contact && <em>IMPACT · 0.25× local slow motion</em>}
          </section>
          <input
            className="ec-scrub"
            aria-label="Collision timeline"
            type="range"
            min="-1.2"
            max="1.2"
            step=".01"
            value={time}
            onChange={(e) => {
              setRunning(false);
              setTime(Number(e.target.value));
            }}
          />
          <div className="ec-timeline">
            <span>Approach</span>
            <span>Impact 0 s</span>
            <span>Separate</span>
          </div>
          <section className="ec-equations">
            <b>p = mv</b>
            <b>e = (v₂f − v₁f)/(u₁ − u₂)</b>
            <b>
              {input.restitution === 1
                ? "Elastic: Kf = Ki"
                : "Inelastic: Kf < Ki"}
            </b>
          </section>
        </main>
        <aside className="ec-data">
          <h3>Conservation checks</h3>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Before</th>
                <th>After</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>v₁</th>
                <td>{f(input.u1)}</td>
                <td>{f(result.v1)}</td>
              </tr>
              <tr>
                <th>v₂</th>
                <td>{f(input.u2)}</td>
                <td>{f(result.v2)}</td>
              </tr>
              <tr>
                <th>Momentum</th>
                <td>{f(result.momentumBefore)} kg·m/s</td>
                <td>{f(result.momentumAfter)} kg·m/s</td>
              </tr>
              <tr>
                <th>Kinetic E</th>
                <td>{result.kineticBefore.toFixed(3)} J</td>
                <td>{result.kineticAfter.toFixed(3)} J</td>
              </tr>
            </tbody>
          </table>
          <div className="ec-check">
            <b>Δp</b>
            <strong>
              {(result.momentumAfter - result.momentumBefore).toExponential(1)}{" "}
              kg·m/s
            </strong>
            <span>CONSERVED</span>
          </div>
          <div
            className={input.restitution === 1 ? "ec-check" : "ec-check loss"}
          >
            <b>ΔK</b>
            <strong>
              {(result.kineticAfter - result.kineticBefore).toFixed(3)} J
            </strong>
            <span>{input.restitution === 1 ? "CONSERVED" : "DISSIPATED"}</span>
          </div>
          <section className="ec-bars">
            <b>Momentum contribution</b>
            {[
              ["A before", input.m1 * input.u1, "#2877d4"],
              ["B before", input.m2 * input.u2, "#55a846"],
              ["A after", input.m1 * result.v1, "#2877d4"],
              ["B after", input.m2 * result.v2, "#55a846"],
            ].map(([n, v, c]) => (
              <div key={String(n)}>
                <span>{n}</span>
                <i
                  style={{
                    width: `${Math.min(100, Math.abs(Number(v)) * 28)}%`,
                    background: String(c),
                  }}
                />
                <small>{f(Number(v))}</small>
              </div>
            ))}
          </section>
        </aside>
      </div>
      <section className="ec-mission">
        <div>
          <span>CHALLENGE</span>
          <b>Make cart A stop after collision.</b>
          <small>
            Find masses, velocities and restitution that give v₁f ≈ 0.
          </small>
        </div>
        <button
          onClick={() => {
            setMission(true);
            setFeedback(
              "Tune the five collision inputs, then test the analytic result.",
            );
          }}
        >
          Start challenge
        </button>
        {mission && <button onClick={setStopCase}>Load candidate</button>}
        {mission && <button onClick={check}>Check solution</button>}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
