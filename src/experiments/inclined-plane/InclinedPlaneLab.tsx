import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { DirectAxisControl } from "../shared-2d/DirectAxisControl";
import {
  simulateInclinedPlane,
  type InclinedPlaneInput,
} from "./inclined-planeSimulation";
import "./inclined-plane.css";

const D: InclinedPlaneInput = {
  angleDegrees: 22,
  massKg: 0.5,
  frictionCoefficient: 0.35,
  appliedForceN: 0,
  gravity: 9.81,
};
const f = (n: number, d = 2) => n.toFixed(d);
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
  onChange: (n: number) => void;
}) {
  return (
    <label className="ip-range">
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
export function InclinedPlaneLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(D),
    [velocity, setVelocity] = useState(0),
    [position, setPosition] = useState(0),
    [running, setRunning] = useState(false),
    [sweeping, setSweeping] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [mission, setMission] = useState(false),
    [guess, setGuess] = useState(""),
    [feedback, setFeedback] = useState("");
  const state = useMemo(
    () => simulateInclinedPlane(input, velocity),
    [input, velocity],
  );
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => {
        const dt = (reduced ? 0.12 : 0.035) * speed;
        if (sweeping)
          setInput((o) => ({
            ...o,
            angleDegrees: Math.min(60, o.angleDegrees + 4 * dt),
          }));
        setVelocity((v) => v + state.accelerationDownMps2 * dt);
        setPosition((p) => {
          const n =
            p + velocity * dt + 0.5 * state.accelerationDownMps2 * dt * dt;
          if (Math.abs(n) > 3.8) {
            setRunning(false);
            return Math.sign(n) * 3.8;
          }
          return n;
        });
      },
      reduced ? 120 : 35,
    );
    return () => clearInterval(id);
  }, [reduced, running, speed, state.accelerationDownMps2, sweeping, velocity]);
  const update = (c: Partial<InclinedPlaneInput>) => {
    setInput((o) => ({ ...o, ...c }));
    setVelocity(0);
    setPosition(0);
    setRunning(false);
    setSweeping(false);
    setFeedback("");
  };
  const reset = () => {
    setInput(D);
    setVelocity(0);
    setPosition(0);
    setRunning(false);
    setSweeping(false);
    setSpeed(1);
    setMission(false);
    setGuess("");
    setFeedback("");
  };
  const check = () => {
    const n = Number(guess),
      err = Math.abs(n - input.frictionCoefficient);
    setFeedback(
      Number.isFinite(n) && err <= 0.02
        ? `✓ μs = tan(${f(state.criticalAngleDegrees, 1)}°) = ${f(input.frictionCoefficient)}.`
        : `Use μs = tan θcritical. Expected ${f(input.frictionCoefficient)}; error ${Number.isFinite(err) ? f(err) : "not a number"}.`,
    );
  };
  const vec = (n: number) => Math.min(150, Math.abs(n) * 18);
  return (
    <section
      className="ip-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header data-ui-theme="dark">
        <div>
          <span>FORCES ON AN ADJUSTABLE RAMP</span>
          <h2>Inclined Plane · Friction &amp; Motion</h2>
          <p>Resolve weight, raise the plane, and watch the angle of repose.</p>
        </div>
        <button type="button" onClick={reset}>
          ↻ Reset experiment
        </button>
      </header>
      <div className="ip-layout">
        <aside className="ip-controls">
          <h3>Setup</h3>
          <Range
            label="Incline angle"
            value={input.angleDegrees}
            min={0}
            max={60}
            step={1}
            unit="°"
            onChange={(angleDegrees) => update({ angleDegrees })}
          />
          <Range
            label="Mass"
            value={input.massKg}
            min={0.1}
            max={5}
            step={0.1}
            unit="kg"
            onChange={(massKg) => update({ massKg })}
          />
          <Range
            label="Friction coefficient"
            value={input.frictionCoefficient}
            min={0}
            max={1}
            step={0.01}
            unit=""
            onChange={(frictionCoefficient) => update({ frictionCoefficient })}
          />
          <Range
            label="Applied force upslope"
            value={input.appliedForceN}
            min={-20}
            max={30}
            step={0.5}
            unit="N"
            onChange={(appliedForceN) => update({ appliedForceN })}
          />
          <div className="ip-presets" aria-label="Condition presets">
            <button
              type="button"
              onClick={() =>
                update({
                  angleDegrees: 0,
                  massKg: 0.1,
                  frictionCoefficient: 0,
                  appliedForceN: -20,
                })
              }
            >
              Minimums
            </button>
            <button type="button" onClick={() => update(D)}>
              Typical
            </button>
            <button
              type="button"
              onClick={() =>
                update({
                  angleDegrees: 60,
                  massKg: 5,
                  frictionCoefficient: 1,
                  appliedForceN: 30,
                })
              }
            >
              Maximums
            </button>
          </div>
          <p>
            Positive applied force is upslope. Kinetic friction is modeled as
            0.8 μsN after breakaway.
          </p>
        </aside>
        <main className="ip-main">
          <div className="ip-toolbar">
            <button
              type="button"
              onClick={() => {
                setRunning(true);
                setSweeping(false);
              }}
            >
              ▶ Play
            </button>
            <button type="button" onClick={() => setRunning(false)}>
              Ⅱ Pause
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setVelocity((v) => v + state.accelerationDownMps2 * 0.08);
                setPosition((p) => p + velocity * 0.08);
              }}
            >
              ▷ Step
            </button>
            <button
              type="button"
              className="sweep"
              onClick={() => {
                setInput((o) => ({ ...o, angleDegrees: 0, appliedForceN: 0 }));
                setVelocity(0);
                setPosition(0);
                setSweeping(true);
                setRunning(true);
              }}
            >
              ↗ Sweep angle
            </button>
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
            className={`ip-stage ${state.motionState}`}
            aria-label={`${state.motionState}; angle ${f(input.angleDegrees)} degrees; acceleration ${f(state.accelerationDownMps2)} metres per second squared`}
          >
            <DirectAxisControl
              className="ip-direct-angle"
              label="Ramp angle"
              value={input.angleDegrees}
              min={0}
              max={60}
              step={1}
              onChange={(angleDegrees) => update({ angleDegrees })}
            />
            <img
              src="/assets/experiments/inclined-plane/inclined-plane-rig.png"
              alt="Adjustable inclined-plane apparatus"
            />
            <div
              className="ip-live-ramp"
              style={{ rotate: `${-input.angleDegrees}deg` }}
            >
              <div
                className="ip-block"
                style={{ translate: `${position * 10}% 0` }}
              >
                {f(input.massKg, 1)} kg
              </div>
              <span
                className="ip-v weight"
                style={{ height: `${vec(state.weightN)}px` }}
              >
                mg {f(state.weightN, 1)} N ↓
              </span>
              <span
                className="ip-v normal"
                style={{ height: `${vec(state.normalForceN)}px` }}
              >
                ↑ N {f(state.normalForceN, 1)} N
              </span>
              <span
                className="ip-v parallel"
                style={{ width: `${vec(state.parallelWeightN)}px` }}
              >
                ← mg sinθ {f(state.parallelWeightN, 1)} N
              </span>
              <span
                className="ip-v friction"
                style={{ width: `${vec(state.frictionForceN)}px` }}
              >
                f {f(Math.abs(state.frictionForceN), 1)} N →
              </span>
            </div>
            <strong>
              {state.motionState === "held"
                ? "HELD · static friction balances"
                : state.motionState === "impending"
                  ? "IMPENDING · near angle of repose"
                  : "SLIDING · kinetic friction acts"}
            </strong>
          </section>
          <section className="ip-equations">
            <b>mg sinθ</b>
            <b>N = mg cosθ</b>
            <b>tanθc = μs</b>
          </section>
        </main>
        <aside className="ip-data">
          <h3>Live measurements</h3>
          <dl>
            <div>
              <dt>Angle θ</dt>
              <dd>{f(input.angleDegrees, 1)}°</dd>
            </div>
            <div>
              <dt>Weight mg</dt>
              <dd>{f(state.weightN)} N</dd>
            </div>
            <div>
              <dt>mg sinθ</dt>
              <dd>{f(state.parallelWeightN)} N</dd>
            </div>
            <div>
              <dt>Normal N</dt>
              <dd>{f(state.normalForceN)} N</dd>
            </div>
            <div>
              <dt>Friction f</dt>
              <dd>{f(state.frictionForceN)} N</dd>
            </div>
            <div>
              <dt>Net downslope</dt>
              <dd>{f(state.netDownSlopeN)} N</dd>
            </div>
            <div>
              <dt>Acceleration</dt>
              <dd>{f(state.accelerationDownMps2)} m/s²</dd>
            </div>
          </dl>
          <section className="ip-gauge">
            <b>Angle of repose</b>
            <div
              style={
                {
                  "--critical": `${(state.criticalAngleDegrees / 60) * 100}%`,
                  "--angle": `${(input.angleDegrees / 60) * 100}%`,
                } as React.CSSProperties
              }
            />
            <small>Theoretical θc = {f(state.criticalAngleDegrees, 2)}°</small>
          </section>
        </aside>
      </div>
      <section className="ip-mission">
        <div>
          <span>ANGLE-OF-REPOSE MISSION</span>
          <b>Find μs from the measured breakaway angle.</b>
          <small>
            Sweep with zero pull, record θcritical, then use tanθcritical.
          </small>
        </div>
        <button
          type="button"
          onClick={() => {
            setMission(true);
            setFeedback("Run the angle sweep, then enter μs.");
          }}
        >
          Start mission
        </button>
        {mission && (
          <input
            aria-label="Estimated friction coefficient"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="μs"
            inputMode="decimal"
          />
        )}
        {mission && (
          <button
            type="button"
            onClick={() =>
              setGuess(
                f(Math.tan((state.criticalAngleDegrees * Math.PI) / 180), 2),
              )
            }
          >
            Use measured angle
          </button>
        )}
        {mission && (
          <button type="button" onClick={check}>
            Check
          </button>
        )}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
