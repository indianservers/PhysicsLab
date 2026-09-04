import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { springState, type HookesLawInput } from "./hooke-s-lawSimulation";
import "./hooke-s-law.css";

const D: HookesLawInput = {
  springConstant: 18.6,
  loadMassKg: 0.1,
  naturalLengthM: 0.12,
  damping: 0.7,
  elasticLimitM: 0.18,
  permanentDeformation: false,
};
const fmt = (n: number, d = 2) => n.toFixed(d);
type Point = { massKg: number; forceN: number; extensionM: number };

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
    <label className="hk-range">
      <span>
        {label}
        <b>
          {fmt(value, step < 0.1 ? 2 : 1)} {unit}
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

export function HookesLawLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(D);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reduced, setReduced] = useState(
    () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  const [points, setPoints] = useState<Point[]>([]);
  const [mission, setMission] = useState(false);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const state = useMemo(() => springState(input, time), [input, time]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setTime((t) => {
          const next = t + (reduced ? 0.15 : 0.035) * speed;
          if (next >= 7) setRunning(false);
          return Math.min(7, next);
        }),
      reduced ? 150 : 35,
    );
    return () => clearInterval(id);
  }, [reduced, running, speed]);

  const update = (change: Partial<HookesLawInput>) => {
    setInput((old) => ({ ...old, ...change }));
    setTime(0);
    setRunning(false);
    setFeedback("");
  };
  const addMass = (kg: number) => {
    const loadMassKg = Math.min(1, input.loadMassKg + kg);
    const next = { ...input, loadMassKg };
    const settled = springState(next);
    setInput(next);
    setTime(0);
    setRunning(true);
    setPoints((old) =>
      [
        ...old.filter((p) => Math.abs(p.massKg - loadMassKg) > 1e-6),
        {
          massKg: loadMassKg,
          forceN: settled.forceN,
          extensionM: settled.equilibriumExtensionM,
        },
      ].sort((a, b) => a.massKg - b.massKg),
    );
  };
  const reset = () => {
    setInput(D);
    setTime(0);
    setRunning(false);
    setSpeed(1);
    setPoints([]);
    setMission(false);
    setGuess("");
    setFeedback("");
  };
  const plotPoints = points
    .map(
      (p) =>
        `${25 + Math.min(145, p.extensionM / 0.003)},${112 - Math.min(92, p.forceN * 14)}`,
    )
    .join(" ");
  const check = () => {
    const n = Number(guess),
      error = Math.abs(n - input.springConstant);
    setFeedback(
      Number.isFinite(n) && error <= 0.5
        ? `✓ Hidden spring measured: k = ${fmt(input.springConstant, 1)} N/m (error ${fmt(error, 1)} N/m).`
        : `Use the elastic-region slope ΔF/Δx. Expected ${fmt(input.springConstant, 1)} N/m; error ${Number.isFinite(error) ? fmt(error, 1) : "not a number"} N/m.`,
    );
  };
  const extensionPx = Math.min(150, state.displayedExtensionM * 500);
  return (
    <section
      className="hk-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header data-ui-theme="dark">
        <div>
          <span>PRECISION SPRING EXTENSION</span>
          <h2>Hooke's Law · F = kx</h2>
          <p>
            Add calibrated masses and read the slope before the elastic limit.
          </p>
        </div>
        <button type="button" onClick={reset}>
          ↻ Reset experiment
        </button>
      </header>
      <div className="hk-layout">
        <aside className="hk-controls">
          <h3>Spring &amp; load</h3>
          <Range
            label="Load mass"
            value={input.loadMassKg}
            min={0}
            max={1}
            step={0.05}
            unit="kg"
            onChange={(loadMassKg) => update({ loadMassKg })}
          />
          <Range
            label="Spring constant"
            value={input.springConstant}
            min={5}
            max={60}
            step={0.1}
            unit="N/m"
            onChange={(springConstant) => update({ springConstant })}
          />
          <Range
            label="Natural length"
            value={input.naturalLengthM}
            min={0.08}
            max={0.25}
            step={0.01}
            unit="m"
            onChange={(naturalLengthM) => update({ naturalLengthM })}
          />
          <Range
            label="Damping"
            value={input.damping}
            min={0.05}
            max={3}
            step={0.05}
            unit="N·s/m"
            onChange={(damping) => update({ damping })}
          />
          <label className="hk-switch">
            <input
              aria-label="Permanent deformation"
              type="checkbox"
              checked={input.permanentDeformation}
              onChange={(e) =>
                update({ permanentDeformation: e.target.checked })
              }
            />
            <span>Permanent deformation</span>
            <b>{input.permanentDeformation ? "ON" : "OFF"}</b>
          </label>
          <div className="hk-presets" aria-label="Condition presets">
            <button
              type="button"
              onClick={() =>
                update({
                  loadMassKg: 0,
                  springConstant: 5,
                  naturalLengthM: 0.08,
                  damping: 0.05,
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
                  loadMassKg: 1,
                  springConstant: 60,
                  naturalLengthM: 0.25,
                  damping: 3,
                  permanentDeformation: true,
                })
              }
            >
              Maximums
            </button>
          </div>
          <h3>Add calibrated masses</h3>
          <div className="hk-masses">
            {[0.05, 0.1, 0.2, 0.5].map((kg) => (
              <button type="button" key={kg} onClick={() => addMass(kg)}>
                + {kg * 1000} g
              </button>
            ))}
          </div>
          <p>
            Each added mass records one real equilibrium point. The graph slope
            has units N/m.
          </p>
        </aside>
        <main className="hk-main">
          <div className="hk-toolbar">
            <button type="button" onClick={() => setRunning(true)}>
              ▶ Play
            </button>
            <button type="button" onClick={() => setRunning(false)}>
              Ⅱ Pause
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setTime((t) => Math.min(7, t + 0.1));
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
            className={`hk-stage ${state.beyondElasticLimit ? "overlimit" : ""}`}
            aria-label={`Extension ${fmt(state.displayedExtensionM * 100)} centimetres, force ${fmt(state.forceN)} newtons`}
          >
            <img
              src="/assets/experiments/hooke-s-law/spring-stand.png"
              alt="Precision spring stand with ruler"
            />
            <div className="hk-mask" />
            <div
              className="hk-live-spring"
              style={{ height: `${145 + extensionPx}px` }}
            />
            <div
              className="hk-hanger"
              style={{ top: `${246 + extensionPx}px` }}
            >
              <b>{fmt(input.loadMassKg * 1000, 0)} g</b>
            </div>
            <div
              className="hk-extension"
              style={{ height: `${Math.max(12, extensionPx)}px` }}
            >
              x = {fmt(state.displayedExtensionM * 100)} cm
            </div>
            {state.beyondElasticLimit && (
              <strong>
                ⚠ BEYOND ELASTIC LIMIT
                {input.permanentDeformation
                  ? ` · permanent set ${fmt(state.permanentSetM * 100)} cm`
                  : ""}
              </strong>
            )}
          </section>
          <section className="hk-equations">
            <b>F = kx</b>
            <b>x = mg/k</b>
            <b>U = ½kx²</b>
          </section>
        </main>
        <aside className="hk-data">
          <h3>Live data</h3>
          <dl>
            <div>
              <dt>Force F</dt>
              <dd>{fmt(state.forceN)} N</dd>
            </div>
            <div>
              <dt>Extension x</dt>
              <dd>{fmt(state.displayedExtensionM * 100)} cm</dd>
            </div>
            <div>
              <dt>Length</dt>
              <dd>{fmt(state.totalLengthM * 100)} cm</dd>
            </div>
            <div>
              <dt>Energy U</dt>
              <dd>{fmt(state.energyJ, 3)} J</dd>
            </div>
          </dl>
          <section className="hk-graph">
            <b>Force F vs extension x</b>
            <svg
              viewBox="0 0 190 125"
              aria-label="Force versus extension graph"
            >
              <line x1="20" y1="112" x2="180" y2="112" />
              <line x1="20" y1="112" x2="20" y2="12" />
              <line className="fit" x1="20" y1="112" x2="170" y2="20" />
              <polyline points={plotPoints} />
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={25 + Math.min(145, p.extensionM / 0.003)}
                  cy={112 - Math.min(92, p.forceN * 14)}
                  r="4"
                />
              ))}
            </svg>
            <small>
              Elastic slope = {fmt(input.springConstant, 1)} N/m ·{" "}
              {points.length} measured points
            </small>
          </section>
          <table>
            <thead>
              <tr>
                <th>m (g)</th>
                <th>F (N)</th>
                <th>x (cm)</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.massKg}>
                  <td>{fmt(p.massKg * 1000, 0)}</td>
                  <td>{fmt(p.forceN)}</td>
                  <td>{fmt(p.extensionM * 100)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>
      </div>
      <section className="hk-mission">
        <div>
          <span>HIDDEN-SPRING MISSION</span>
          <b>Determine k from your measured slope.</b>
          <small>Add at least two masses, then calculate ΔF/Δx.</small>
        </div>
        <button
          type="button"
          onClick={() => {
            setMission(true);
            setFeedback(
              points.length >= 2
                ? "Enter the slope in N/m."
                : "Add at least two mass points first.",
            );
          }}
        >
          Identify hidden spring
        </button>
        {mission && (
          <input
            aria-label="Estimated spring constant"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="N/m"
            inputMode="decimal"
          />
        )}
        {mission && (
          <button
            type="button"
            onClick={() => setGuess(fmt(input.springConstant, 1))}
          >
            Use measured slope
          </button>
        )}
        {mission && (
          <button type="button" onClick={check} disabled={points.length < 2}>
            Check
          </button>
        )}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
