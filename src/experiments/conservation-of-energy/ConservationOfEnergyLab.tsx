import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  requiredReleaseHeight,
  solveEnergy,
  trackHeight,
  type EnergyInput,
} from "./conservation-of-energySimulation";
import "./conservation-of-energy.css";

const D: EnergyInput = {
  massKg: 0.5,
  startHeightM: 12,
  friction: 0.06,
  gravity: 9.81,
  releasePosition: 0,
};
const f = (n: number, d = 2) => n.toFixed(d);
function Slider({
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
    <label className="en-slider">
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
export function ConservationOfEnergyLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(D),
    [progress, setProgress] = useState(0),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [mission, setMission] = useState(false),
    [feedback, setFeedback] = useState("");
  const energy = useMemo(() => solveEnergy(input, progress), [input, progress]);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setProgress((old) => {
          const e = solveEnergy(input, old),
            next =
              old +
              Math.max(0.08, e.speedMps / 24) * (reduced ? 0.12 : 0.04) * speed;
          if (
            next >= 1 ||
            (old > input.releasePosition + 0.08 && e.kineticJ <= 0.001)
          ) {
            setRunning(false);
            return Math.min(1, next);
          }
          return next;
        }),
      reduced ? 160 : 40,
    );
    return () => clearInterval(id);
  }, [input, reduced, running, speed]);
  const update = (c: Partial<EnergyInput>) => {
    setInput((o) => ({ ...o, ...c }));
    setProgress(c.releasePosition ?? input.releasePosition);
    setRunning(false);
    setFeedback("");
  };
  const reset = () => {
    setInput(D);
    setProgress(0);
    setRunning(false);
    setMission(false);
    setFeedback("");
  };
  const targetProgress = 0.72,
    targetHeight = trackHeight(targetProgress, input.startHeightM),
    distance = Math.abs(targetProgress - input.releasePosition) * 24,
    target = requiredReleaseHeight(targetHeight, input.friction, distance);
  const check = () => {
    const excess = input.startHeightM - target;
    setFeedback(
      Math.abs(excess) < 0.08
        ? `✓ Target reached with minimal speed: release ${f(input.startHeightM)} m; predicted arrival speed ${f(Math.sqrt(Math.max(0, 2 * input.gravity * excess)))} m/s.`
        : excess < 0
          ? `Short by ${f(-excess)} m of energy height. Try ${f(target)} m.`
          : `Reaches the target, but carries excess speed. Lower release height by ${f(excess)} m.`,
    );
  };
  const x = 70 + progress * 760,
    y = 430 - (trackHeight(progress, input.startHeightM) / 18) * 320,
    total = Math.max(0.001, energy.totalJ),
    bars = [
      { n: "Kinetic", v: energy.kineticJ, c: "#1971d4" },
      { n: "Potential", v: energy.potentialJ, c: "#45a049" },
      { n: "Thermal", v: energy.thermalJ, c: "#ee7b2d" },
    ];
  return (
    <section
      className="energy-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header>
        <div>
          <span>ENERGY IN MOTION</span>
          <h2>Conservation of Energy Track</h2>
          <p>
            Release, descend, climb and settle while the energy budget stays
            exact.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="energy-layout">
        <aside className="energy-controls">
          <h3>Lab controls</h3>
          <Slider
            label="Start height"
            value={input.startHeightM}
            min={4}
            max={18}
            step={0.1}
            unit="m"
            onChange={(startHeightM) => update({ startHeightM })}
          />
          <Slider
            label="Cart mass"
            value={input.massKg}
            min={0.1}
            max={3}
            step={0.1}
            unit="kg"
            onChange={(massKg) => update({ massKg })}
          />
          <Slider
            label="Friction coefficient"
            value={input.friction}
            min={0}
            max={0.25}
            step={0.01}
            unit=""
            onChange={(friction) => update({ friction })}
          />
          <Slider
            label="Gravity"
            value={input.gravity}
            min={1.6}
            max={24.8}
            step={0.01}
            unit="m/s²"
            onChange={(gravity) => update({ gravity })}
          />
          <Slider
            label="Release position"
            value={input.releasePosition}
            min={0}
            max={0.28}
            step={0.01}
            unit="track"
            onChange={(releasePosition) => update({ releasePosition })}
          />
          <div className="en-presets">
            <button
              onClick={() =>
                update({
                  startHeightM: 4,
                  massKg: 0.1,
                  friction: 0,
                  gravity: 1.6,
                })
              }
            >
              Minimums
            </button>
            <button onClick={() => update(D)}>Earth demo</button>
            <button
              onClick={() =>
                update({
                  startHeightM: 18,
                  massKg: 3,
                  friction: 0.25,
                  gravity: 24.8,
                })
              }
            >
              Maximums
            </button>
          </div>
          <p>
            Friction removes mechanical energy, but the thermal bar grows by the
            same amount.
          </p>
        </aside>
        <main className="energy-main">
          <div className="energy-toolbar">
            <div>
              <button onClick={() => setRunning(true)}>▶ Play</button>
              <button onClick={() => setRunning(false)}>Ⅱ Pause</button>
              <button
                onClick={() => {
                  setRunning(false);
                  setProgress((p) => Math.min(1, p + 0.01));
                }}
              >
                → Step
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
            className="energy-stage"
            aria-label={`Ball height ${f(energy.heightM)} metres, speed ${f(energy.speedMps)} metres per second`}
          >
            <img
              src="/assets/experiments/conservation-of-energy/energy-track.png"
              alt="Transparent alpine energy track"
            />
            <svg viewBox="0 0 900 500">
              <line className="height-line" x1={x} x2={x} y1={y} y2="448" />
              <circle
                className="energy-ball"
                cx={x}
                cy={y}
                r={13 + input.massKg * 2}
              />
              <text x={x + 18} y={y - 14}>
                v = {f(energy.speedMps)} m/s
              </text>
              <line
                className="target-line"
                x1="602"
                x2="650"
                y1={430 - (targetHeight / 18) * 320}
                y2={430 - (targetHeight / 18) * 320}
              />
              <text x="655" y={430 - (targetHeight / 18) * 320 + 5}>
                target
              </text>
            </svg>
            <div className="energy-readout">
              <b>{f(progress * 24)} m</b>
              <b>{f(energy.heightM)} m high</b>
              <b>
                {running
                  ? "MOVING"
                  : Math.abs(progress - input.releasePosition) < 0.002
                    ? "READY"
                    : energy.kineticJ < 0.001
                      ? "SETTLED"
                      : "PAUSED"}
              </b>
            </div>
          </section>
          <section className="energy-equation">
            <b>
              mgh + ½mv² + E<sub>thermal</sub> = constant
            </b>
            <span>
              {f(energy.potentialJ)} + {f(energy.kineticJ)} +{" "}
              {f(energy.thermalJ)} = {f(energy.sumJ)} J
            </span>
          </section>
        </main>
        <aside className="energy-data">
          <h3>Energy (J)</h3>
          {bars.map((b) => (
            <div className="energy-meter" key={b.n}>
              <span>
                {b.n}
                <b>{f(b.v)} J</b>
              </span>
              <i>
                <em
                  style={{ width: `${(b.v / total) * 100}%`, background: b.c }}
                />
              </i>
            </div>
          ))}
          <div className="stacked-bar">
            {bars.map((b) => (
              <i
                key={b.n}
                style={{ width: `${(b.v / total) * 100}%`, background: b.c }}
              />
            ))}
          </div>
          <div className="energy-total">
            <span>Total</span>
            <b>{f(energy.totalJ)} J</b>
            <small>
              Budget error:{" "}
              {energy.sumJ - energy.totalJ < 1e-8 ? "0.000" : "check"} J
            </small>
          </div>
          <section>
            <b>Mass cancellation</b>
            <p>
              Dividing mgh = ½mv² by m gives v = √(2gΔh). Ideal speed does not
              depend on mass.
            </p>
          </section>
        </aside>
      </div>
      <section className="energy-mission">
        <div>
          <span>CHALLENGE</span>
          <b>Reach the marked hill with the smallest possible speed.</b>
          <small>
            Choose the minimum release height that pays for height gain and
            friction.
          </small>
        </div>
        <button
          onClick={() => {
            setMission(true);
            setFeedback(
              "Tune release height, then check the predicted arrival.",
            );
          }}
        >
          Start challenge
        </button>
        {mission && (
          <button onClick={() => update({ startHeightM: target })}>
            Set calculated height
          </button>
        )}
        {mission && <button onClick={check}>Check solution</button>}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
