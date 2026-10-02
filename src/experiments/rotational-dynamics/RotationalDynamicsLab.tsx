import { useEffect, useMemo, useState, type PointerEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  rotationalDefaults,
  rotationalState,
  type RotationalInput,
} from "./rotationalDynamicsSimulation";
import "./rotational-dynamics.css";

const f = (n: number, d = 3) => n.toFixed(d),
  clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
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
    <label className="rd-range">
      <span>
        {label}
        <b>
          {f(value, step < 0.01 ? 3 : 2)} {unit}
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
export function RotationalDynamicsLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [input, setInput] = useState<RotationalInput>(rotationalDefaults),
    [omega, setOmega] = useState(0),
    [theta, setTheta] = useState(0),
    [time, setTime] = useState(0),
    [running, setRunning] = useState(false),
    [forceApplied, setForceApplied] = useState(true),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [history, setHistory] = useState<{ t: number; w: number }[]>([
      { t: 0, w: 0 },
    ]),
    [missionAlpha, setMissionAlpha] = useState<number | null>(null),
    [feedback, setFeedback] = useState("");
  const state = useMemo(
    () => rotationalState(input, omega, forceApplied),
    [forceApplied, input, omega],
  );
  const update = (change: Partial<RotationalInput>) => {
    setInput((o) => ({ ...o, ...change }));
    setRunning(false);
    setFeedback("");
  };
  useEffect(() => {
    if (!running) return;
    const dt = (reduced ? 0.08 : 0.03) * speed,
      id = window.setInterval(
        () =>
          setOmega((w) => {
            const a = rotationalState(
              input,
              w,
              forceApplied,
            ).angularAccelerationRadS2;
            let next = w + a * dt;
            if (
              !forceApplied &&
              input.axleDampingNmS > 0 &&
              Math.sign(next) !== Math.sign(w)
            )
              next = 0;
            setTheta((angle) => angle + next * dt);
            setTime((t) => {
              const nextTime = t + dt;
              setHistory((h) => [...h.slice(-119), { t: nextTime, w: next }]);
              return nextTime;
            });
            return next;
          }),
        reduced ? 160 : 30,
      );
    return () => clearInterval(id);
  }, [forceApplied, input, reduced, running, speed]);
  const reset = () => {
    setInput(rotationalDefaults);
    setOmega(0);
    setTheta(0);
    setTime(0);
    setRunning(false);
    setForceApplied(true);
    setSpeed(1);
    setHistory([{ t: 0, w: 0 }]);
    setMissionAlpha(null);
    setFeedback("");
  };
  const moveMass = (e: PointerEvent<HTMLButtonElement>) => {
    if (!(e.buttons & 1)) return;
    const r = e.currentTarget.parentElement!.getBoundingClientRect(),
      dx = e.clientX - (r.left + r.width / 2),
      dy = e.clientY - (r.top + r.height / 2),
      radius = clamp(
        (Math.hypot(dx, dy) / (Math.min(r.width, r.height) / 2)) * 0.25,
        0.05,
        0.25,
      );
    update({ massRadiusM: radius });
  };
  const moveForce = (e: PointerEvent<HTMLButtonElement>) => {
    if (!(e.buttons & 1)) return;
    const r = e.currentTarget.parentElement!.getBoundingClientRect();
    update({ forceN: clamp(((r.bottom - e.clientY) / r.height) * 10, 0, 10) });
  };
  const idealAlpha = rotationalState(input, 0, true).angularAccelerationRadS2,
    graphX = 20 + (state.netTorqueNm / 0.9) * 180,
    graphY = 112 - (state.angularAccelerationRadS2 / 12) * 95,
    hist = history
      .map(
        (p, i) =>
          `${10 + (i / Math.max(1, history.length - 1)) * 205},${70 - (clamp(p.w, -20, 20) / 40) * 55}`,
      )
      .join(" ");
  const loadMatch = () => {
    if (missionAlpha === null) return;
    const massRadiusM = input.massRadiusM < 0.2 ? 0.25 : 0.1,
      nextI = 0.5 * 2 * 0.25 ** 2 + 2 * input.pointMassKg * massRadiusM ** 2,
      forceN = clamp((missionAlpha * nextI) / input.leverArmM, 0, 10);
    update({ massRadiusM, forceN });
    setFeedback(
      "Matched design loaded. Check the new α with a changed mass radius and force.",
    );
  };
  const check = () => {
    if (missionAlpha === null) return;
    const diff = Math.abs(idealAlpha - missionAlpha),
      distinct =
        Math.abs(input.massRadiusM - rotationalDefaults.massRadiusM) > 0.01 ||
        Math.abs(input.forceN - rotationalDefaults.forceN) > 0.05;
    setFeedback(
      diff <= 0.05 && distinct
        ? `✓ Matched α = ${f(idealAlpha, 2)} rad/s² with a different configuration.`
        : `Difference ${f(diff, 2)} rad/s². Keep τ/I constant while changing the configuration.`,
    );
  };
  return (
    <section
      className="rd-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header data-ui-theme="dark">
        <div>
          <span>ROTATIONAL MOTION SENSOR</span>
          <h2>Torque competes with rotational inertia.</h2>
          <p>
            Move the masses, pull tangentially, then release and watch the disk
            coast.
          </p>
        </div>
        <button type="button" onClick={reset}>
          ↻ Reset experiment
        </button>
      </header>
      <div className="rd-layout">
        <aside className="rd-controls">
          <h3>Experiment controls</h3>
          <Range
            label="Applied force"
            value={input.forceN}
            min={0}
            max={10}
            step={0.1}
            unit="N"
            onChange={(forceN) => update({ forceN })}
          />
          <Range
            label="Lever arm"
            value={input.leverArmM}
            min={0.05}
            max={0.4}
            step={0.01}
            unit="m"
            onChange={(leverArmM) => update({ leverArmM })}
          />
          <Range
            label="Point mass"
            value={input.pointMassKg}
            min={0.1}
            max={1}
            step={0.05}
            unit="kg"
            onChange={(pointMassKg) => update({ pointMassKg })}
          />
          <Range
            label="Mass radius"
            value={input.massRadiusM}
            min={0.05}
            max={0.25}
            step={0.01}
            unit="m"
            onChange={(massRadiusM) => update({ massRadiusM })}
          />
          <Range
            label="Axle damping"
            value={input.axleDampingNmS}
            min={0}
            max={0.1}
            step={0.002}
            unit="N·m·s"
            onChange={(axleDampingNmS) => update({ axleDampingNmS })}
          />
          <div className="rd-presets">
            <button
              type="button"
              onClick={() =>
                update({
                  forceN: 0,
                  leverArmM: 0.05,
                  pointMassKg: 0.1,
                  massRadiusM: 0.05,
                  axleDampingNmS: 0,
                })
              }
            >
              Minimums
            </button>
            <button type="button" onClick={() => update(rotationalDefaults)}>
              Typical
            </button>
            <button
              type="button"
              onClick={() =>
                update({
                  forceN: 10,
                  leverArmM: 0.4,
                  pointMassKg: 1,
                  massRadiusM: 0.25,
                  axleDampingNmS: 0.1,
                })
              }
            >
              Maximums
            </button>
          </div>
          <p>
            Drag either colored mass radially. Drag the green force handle
            vertically to change the tangential pull.
          </p>
        </aside>
        <main className="rd-main">
          <div className="rd-toolbar">
            <button type="button" onClick={() => setRunning(true)}>
              ▶ Play
            </button>
            <button type="button" onClick={() => setRunning(false)}>
              Ⅱ Pause
            </button>
            <button
              type="button"
              onClick={() => {
                setForceApplied(false);
                setRunning(true);
              }}
            >
              Release &amp; coast
            </button>
            <button type="button" onClick={() => setForceApplied(true)}>
              Apply torque
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                const dt = 0.05;
                setOmega(
                  (w) =>
                    w +
                    rotationalState(input, w, forceApplied)
                      .angularAccelerationRadS2 *
                      dt,
                );
                setTheta((a) => a + omega * dt);
              }}
            >
              ▷ Step
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
            className="rd-stage"
            aria-label={`Disk angle ${f(theta, 2)} radians, angular speed ${f(omega, 2)} radians per second, angular acceleration ${f(state.angularAccelerationRadS2, 2)} radians per second squared`}
          >
            <img
              src="/assets/experiments/rotational-dynamics/rotational-rig.png"
              alt="Rotational dynamics disk, radial masses and pulley"
            />
            <div
              className="rd-rotor"
              style={{ transform: `translate(-50%,-50%) rotate(${theta}rad)` }}
            >
              <button
                aria-label="Drag red mass radius"
                className="rd-mass red"
                style={{ left: `${50 - (input.massRadiusM / 0.25) * 38}%` }}
                onPointerMove={moveMass}
              />
              <button
                aria-label="Drag blue mass radius"
                className="rd-mass blue"
                style={{ left: `${50 + (input.massRadiusM / 0.25) * 38}%` }}
                onPointerMove={moveMass}
              />
            </div>
            <button
              aria-label="Drag tangential force"
              className="rd-force"
              onPointerMove={moveForce}
              style={{ height: `${12 + input.forceN * 2.5}%` }}
            >
              F {f(input.forceN, 1)} N
            </button>
            <div className="rd-torque">
              τ = rF <b>{f(state.appliedTorqueNm)} N·m</b>
            </div>
            <strong>{forceApplied ? "TORQUE APPLIED" : "COASTING"}</strong>
          </section>
          <div className="rd-equations">
            <b>τ = r × F</b>
            <b>I = ½MR² + Σmr²</b>
            <b>
              α = τ<sub>net</sub>/I
            </b>
            <b>L = Iω</b>
          </div>
        </main>
        <aside className="rd-data">
          <h3>Live measurements</h3>
          <dl>
            <div>
              <dt>Applied torque</dt>
              <dd>{f(state.appliedTorqueNm)} N·m</dd>
            </div>
            <div>
              <dt>Friction torque</dt>
              <dd>{f(state.frictionTorqueNm)} N·m</dd>
            </div>
            <div>
              <dt>Total I</dt>
              <dd>{f(state.inertiaKgm2, 4)} kg·m²</dd>
            </div>
            <div>
              <dt>α</dt>
              <dd>{f(state.angularAccelerationRadS2, 2)} rad/s²</dd>
            </div>
            <div>
              <dt>ω</dt>
              <dd>{f(omega, 2)} rad/s</dd>
            </div>
            <div>
              <dt>L</dt>
              <dd>{f(state.angularMomentumKgM2S)} kg·m²/s</dd>
            </div>
            <div>
              <dt>Krot</dt>
              <dd>{f(state.rotationalEnergyJ)} J</dd>
            </div>
          </dl>
        </aside>
      </div>
      <section className="rd-graphs">
        <div>
          <b>Angular acceleration vs net torque</b>
          <svg viewBox="0 0 220 125">
            <line x1="18" y1="112" x2="210" y2="112" />
            <line x1="18" y1="112" x2="18" y2="10" />
            <line
              className="fit"
              x1="18"
              y1="112"
              x2="200"
              y2={Math.max(12, 112 - (0.9 / state.inertiaKgm2 / 12) * 95)}
            />
            <circle
              cx={clamp(graphX, 18, 210)}
              cy={clamp(graphY, 12, 112)}
              r="5"
            />
          </svg>
          <small>Slope = 1/I = {f(1 / state.inertiaKgm2, 2)} (kg·m²)⁻¹</small>
        </div>
        <div>
          <b>Angular speed history</b>
          <svg viewBox="0 0 220 90">
            <line x1="8" y1="70" x2="216" y2="70" />
            <polyline points={hist} />
          </svg>
          <small>Coast is level only when axle damping = 0.</small>
        </div>
      </section>
      <section className="rd-mission">
        <div>
          <span>MATCHED-α MISSION</span>
          <b>Achieve the same angular acceleration with two configurations.</b>
          <small>
            {missionAlpha === null
              ? "Save configuration A, then change mass distribution and torque."
              : `Target α = ${f(missionAlpha, 2)} rad/s²`}
          </small>
        </div>
        <button
          type="button"
          onClick={() => {
            setMissionAlpha(idealAlpha);
            setFeedback("Configuration A saved. Change radius and force.");
          }}
        >
          Save configuration A
        </button>
        {missionAlpha !== null && (
          <button type="button" onClick={loadMatch}>
            Load matched design
          </button>
        )}
        {missionAlpha !== null && (
          <button type="button" onClick={check}>
            Check match
          </button>
        )}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
