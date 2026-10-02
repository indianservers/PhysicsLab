import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { DirectAxisControl } from "../shared-2d/DirectAxisControl";
import { simulateFriction, type FrictionInput } from "./frictionSimulation";
import "./friction.css";

const DEFAULTS: FrictionInput = {
  mass: 2,
  gravity: 9.8,
  muS: 0.36,
  muK: 0.3,
  appliedForce: 5,
  inclineDegrees: 0,
};
const f = (value: number, digits = 2) => value.toFixed(digits);

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
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="fr-range">
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
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <small>
        {min}
        <i>{max}</i>
      </small>
    </label>
  );
}

export function FrictionLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(DEFAULTS);
  const [position, setPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [running, setRunning] = useState(false);
  const [ramping, setRamping] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reduced, setReduced] = useState(
    () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  const [mission, setMission] = useState(false);
  const [muSGuess, setMuSGuess] = useState("");
  const [muKGuess, setMuKGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const state = useMemo(
    () => simulateFriction(input, velocity),
    [input, velocity],
  );

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(
      () => {
        const dt = (reduced ? 0.12 : 0.035) * speed;
        if (ramping) {
          setInput((current) => ({
            ...current,
            appliedForce: Math.min(160, current.appliedForce + 5 * dt),
          }));
        }
        setVelocity((current) => current + state.acceleration * dt);
        setPosition((current) => {
          const next =
            current + velocity * dt + 0.5 * state.acceleration * dt * dt;
          if (Math.abs(next) >= 3.4) {
            setRunning(false);
            return Math.sign(next) * 3.4;
          }
          return next;
        });
      },
      reduced ? 120 : 35,
    );
    return () => clearInterval(interval);
  }, [ramping, reduced, running, speed, state.acceleration, velocity]);

  const update = (change: Partial<FrictionInput>) => {
    setInput((current) => ({ ...current, ...change }));
    setPosition(0);
    setVelocity(0);
    setRunning(false);
    setRamping(false);
    setFeedback("");
  };
  const reset = () => {
    setInput(DEFAULTS);
    setPosition(0);
    setVelocity(0);
    setRunning(false);
    setRamping(false);
    setSpeed(1);
    setMission(false);
    setMuSGuess("");
    setMuKGuess("");
    setFeedback("");
  };
  const step = () => {
    const dt = 0.08;
    setRunning(false);
    setVelocity((current) => current + state.acceleration * dt);
    setPosition((current) =>
      Math.max(-3.4, Math.min(3.4, current + velocity * dt)),
    );
  };
  const checkMission = () => {
    const s = Number(muSGuess);
    const k = Number(muKGuess);
    const goodS = Math.abs(s - input.muS) <= 0.01;
    const goodK = Math.abs(k - input.muK) <= 0.01;
    setFeedback(
      goodS && goodK
        ? `✓ Both measured coefficients are correct: μs=${f(input.muS)} and μk=${f(input.muK)}.`
        : `Use μs = (Fbreak − mg sinθ)/N and μk = |fk|/N. Expected ${f(input.muS)} and ${f(input.muK)}.`,
    );
  };

  const threshold = Math.max(1, state.thresholdAppliedForce);
  const plotMax = Math.max(30, threshold * 1.7);
  const points = Array.from({ length: 31 }, (_, index) => {
    const applied = (plotMax * index) / 30;
    const test = simulateFriction(
      { ...input, appliedForce: applied },
      applied > threshold ? 0.1 : 0,
    );
    return `${12 + index * 5.7},${108 - (Math.abs(test.frictionForce) / Math.max(1, state.maximumStaticFriction)) * 82}`;
  }).join(" ");
  const forceScale = 1.6;
  const incline = input.inclineDegrees > 0;

  return (
    <section
      className="fr-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header data-ui-theme="dark">
        <div>
          <span>BLOCK &amp; FORCE-SENSOR BENCH</span>
          <h2>Static → Kinetic Friction</h2>
          <p>
            Pull slowly. Static friction adapts, peaks, then drops at breakaway.
          </p>
        </div>
        <button type="button" onClick={reset}>
          ↻ Reset experiment
        </button>
      </header>
      <div className="fr-layout">
        <aside className="fr-controls">
          <h3>Surface &amp; pull</h3>
          <Range
            label="Applied force"
            value={input.appliedForce}
            min={0}
            max={160}
            step={1}
            unit="N"
            onChange={(appliedForce) => update({ appliedForce })}
          />
          <Range
            label="Mass"
            value={input.mass}
            min={1}
            max={20}
            step={0.5}
            unit="kg"
            onChange={(mass) => update({ mass })}
          />
          <Range
            label="Static coefficient μs"
            value={input.muS}
            min={0}
            max={1.2}
            step={0.01}
            onChange={(muS) => update({ muS, muK: Math.min(input.muK, muS) })}
          />
          <Range
            label="Kinetic coefficient μk"
            value={input.muK}
            min={0}
            max={1}
            step={0.01}
            onChange={(muK) => update({ muK: Math.min(muK, input.muS) })}
          />
          <label className="fr-switch">
            <input
              type="checkbox"
              aria-label="Incline"
              checked={incline}
              onChange={(event) =>
                update({ inclineDegrees: event.target.checked ? 20 : 0 })
              }
            />
            <span>20° incline</span>
            <b>{incline ? "ON" : "OFF"}</b>
          </label>
          <div className="fr-presets" aria-label="Condition presets">
            <button
              type="button"
              onClick={() =>
                update({
                  mass: 1,
                  muS: 0,
                  muK: 0,
                  appliedForce: 0,
                  inclineDegrees: 0,
                })
              }
            >
              Minimums
            </button>
            <button type="button" onClick={() => update(DEFAULTS)}>
              Typical
            </button>
            <button
              type="button"
              onClick={() =>
                update({
                  mass: 20,
                  muS: 1.2,
                  muK: 1,
                  appliedForce: 160,
                  inclineDegrees: 20,
                })
              }
            >
              Maximums
            </button>
          </div>
          <p>
            Constraint: μk is kept at or below μs. Positive friction always
            points opposite the motion or tendency.
          </p>
        </aside>
        <main className="fr-main">
          <div className="fr-toolbar">
            <button
              type="button"
              onClick={() => {
                setRunning(true);
                setRamping(false);
              }}
            >
              ▶ Play
            </button>
            <button type="button" onClick={() => setRunning(false)}>
              Ⅱ Pause
            </button>
            <button type="button" onClick={step}>
              ▷ Step
            </button>
            <button
              type="button"
              className="ramp"
              onClick={() => {
                setInput((current) => ({ ...current, appliedForce: 0 }));
                setPosition(0);
                setVelocity(0);
                setRamping(true);
                setRunning(true);
              }}
            >
              ↗ Ramp force
            </button>
            <label>
              Speed{" "}
              <select
                aria-label="Playback speed"
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
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
                onChange={(event) => setReduced(event.target.checked)}
              />{" "}
              Reduced motion
            </label>
          </div>
          <section
            className={`fr-stage ${state.motionState} ${incline ? "inclined" : ""}`}
            aria-label={`${state.motionState}; applied force ${f(input.appliedForce)} newtons; friction ${f(state.frictionForce)} newtons; acceleration ${f(state.acceleration)} metres per second squared`}
          >
            <DirectAxisControl
              className="fr-direct-force"
              label="Pull force"
              value={input.appliedForce}
              min={0}
              max={160}
              step={1}
              onChange={(appliedForce) => update({ appliedForce })}
            />
            <div
              className="fr-apparatus"
              style={{ rotate: `${-input.inclineDegrees}deg` }}
            >
              <div className="fr-surface" />
              <img
                src="/assets/experiments/friction/friction-bench.png"
                alt="Spring-scale friction bench"
              />
              <div
                className="fr-block"
                style={{ translate: `${position * 8}% 0` }}
              >
                <span>{f(input.mass, 1)} kg</span>
              </div>
              <div
                className="fr-force applied"
                style={{
                  width: `${Math.min(180, input.appliedForce * forceScale)}px`,
                }}
              >
                Fapp {f(input.appliedForce, 1)} N →
              </div>
              <div
                className="fr-force friction"
                style={{
                  width: `${Math.min(180, Math.abs(state.frictionForce) * forceScale)}px`,
                }}
              >
                ← f {f(Math.abs(state.frictionForce), 1)} N
              </div>
              <div className="fr-force normal">
                ↑ N {f(state.normalForce, 1)} N
              </div>
              <div className="fr-force weight">
                ↓ W {f(input.mass * input.gravity, 1)} N
              </div>
            </div>
            <strong>
              {state.motionState === "static"
                ? "STATIC · friction matches demand"
                : state.motionState === "impending"
                  ? "IMPENDING MOTION · near μsN"
                  : "BREAKAWAY · kinetic friction μkN"}
            </strong>
          </section>
          <section className="fr-equations">
            <b>|fs| ≤ μsN</b>
            <b>|fk| = μkN</b>
            <b>N = mg cosθ</b>
          </section>
        </main>
        <aside className="fr-data">
          <h3>Force sensor</h3>
          <output className="fr-meter">{f(input.appliedForce)} N</output>
          <dl>
            <div>
              <dt>Normal N</dt>
              <dd>{f(state.normalForce)} N</dd>
            </div>
            <div>
              <dt>Static limit</dt>
              <dd>{f(state.maximumStaticFriction)} N</dd>
            </div>
            <div>
              <dt>Friction f</dt>
              <dd>{f(state.frictionForce)} N</dd>
            </div>
            <div>
              <dt>Net force</dt>
              <dd>{f(state.netForce)} N</dd>
            </div>
            <div>
              <dt>Acceleration</dt>
              <dd>{f(state.acceleration)} m/s²</dd>
            </div>
          </dl>
          <section className="fr-plot">
            <b>Friction vs applied force</b>
            <svg viewBox="0 0 190 125" aria-label="Friction force plot">
              <line x1="10" y1="108" x2="185" y2="108" />
              <line x1="10" y1="108" x2="10" y2="12" />
              <line
                className="threshold"
                x1={12 + (threshold / plotMax) * 171}
                y1="10"
                x2={12 + (threshold / plotMax) * 171}
                y2="108"
              />
              <polyline points={points} />
            </svg>
            <small>
              Breakaway at Fapp = {f(state.thresholdAppliedForce)} N
            </small>
          </section>
        </aside>
      </div>
      <section className="fr-mission">
        <div>
          <span>MEASUREMENT MISSION</span>
          <b>Recover μs from breakaway and μk from sliding.</b>
          <small>
            Read the threshold and steady friction, then divide out the normal
            force.
          </small>
        </div>
        <button
          type="button"
          onClick={() => {
            setMission(true);
            setFeedback("Ramp the force and record both values.");
          }}
        >
          Start mission
        </button>
        {mission && (
          <input
            aria-label="Measured static coefficient"
            value={muSGuess}
            onChange={(event) => setMuSGuess(event.target.value)}
            placeholder="μs"
            inputMode="decimal"
          />
        )}
        {mission && (
          <input
            aria-label="Measured kinetic coefficient"
            value={muKGuess}
            onChange={(event) => setMuKGuess(event.target.value)}
            placeholder="μk"
            inputMode="decimal"
          />
        )}
        {mission && (
          <button
            type="button"
            onClick={() => {
              setMuSGuess(f(input.muS));
              setMuKGuess(f(input.muK));
            }}
          >
            Use measurements
          </button>
        )}
        {mission && (
          <button type="button" onClick={checkMission}>
            Check
          </button>
        )}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
