import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { solveShmSpring } from "./shmSpringSimulation";
import "./shm-spring.css";

const defaults = {
  massKg: 0.5,
  springConstantNm: 20,
  amplitudeM: 0.15,
  dampingNsM: 0,
  driveFrequencyHz: 1,
  driven: false,
};
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
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
    <label className="shm-range">
      <span>
        <b>{label}</b>
        <output>
          {value.toFixed(step < 0.1 ? 2 : 1)} {unit}
        </output>
      </span>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <small>
        <span>
          {min} {unit}
        </span>
        <span>
          {max} {unit}
        </span>
      </small>
    </label>
  );
}

export function ShmSpringLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(defaults),
    [time, setTime] = useState(0),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(false),
    [prediction, setPrediction] = useState<"mass" | "spring" | null>(null),
    [predictionFeedback, setPredictionFeedback] = useState(""),
    [missionFeedback, setMissionFeedback] = useState("");
  const result = useMemo(
    () => solveShmSpring({ ...input, timeS: time }),
    [input, time],
  );
  useEffect(() => {
    if (!running || reduced) return;
    const timer = window.setInterval(
      () => setTime((t) => (t + 0.02 * speed) % 5),
      40,
    );
    return () => window.clearInterval(timer);
  }, [running, reduced, speed]);
  const change = (patch: Partial<typeof input>) => {
    setInput((v) => ({ ...v, ...patch }));
    setTime(0);
    setRunning(false);
    setMissionFeedback("");
  };
  const reset = () => {
    setInput(defaults);
    setTime(0);
    setRunning(false);
    setSpeed(1);
    setReduced(false);
    setPrediction(null);
    setPredictionFeedback("");
    setMissionFeedback("");
  };
  const displayX = clamp(result.x, -0.3, 0.3),
    cartX = 500 + displayX * 700,
    springEnd = cartX - 70;
  const springPoints = Array.from({ length: 49 }, (_, i) => {
    const x = 112 + ((springEnd - 112) * i) / 48;
    const y =
      207 + (i === 0 || i === 48 ? 0 : Math.sin((i * Math.PI) / 2) * 18);
    return `${x},${y}`;
  }).join(" ");
  const arrow = (value: number, max: number) => clamp(value / max, -1, 1) * 72;
  const trace = (kind: "x" | "v" | "a", y0: number) =>
    Array.from({ length: 101 }, (_, i) => {
      const t = (i / 100) * 5,
        r = solveShmSpring({ ...input, timeS: t }),
        value =
          kind === "x"
            ? r.x / Math.max(input.amplitudeM, 0.001)
            : kind === "v"
              ? r.v / Math.max(result.omega0 * input.amplitudeM, 0.001)
              : r.acceleration /
                Math.max(result.omega0 ** 2 * input.amplitudeM, 0.001);
      return `${30 + i * 4.9},${y0 - value * 24}`;
    }).join(" ");
  const maxEnergy = Math.max(result.initialEnergyJ, result.totalEnergyJ, 0.001),
    energyFractionK = clamp(result.kineticJ / maxEnergy, 0, 1),
    energyFractionU = clamp(result.potentialJ / maxEnergy, 0, 1);
  const resonanceError =
      Math.abs(input.driveFrequencyHz - result.naturalFrequencyHz) /
      result.naturalFrequencyHz,
    missionSuccess = input.driven && resonanceError <= 0.02;
  const phaseAngle = Math.atan2(
    -result.v / Math.max(result.omega0, 0.001),
    result.x,
  );
  return (
    <section className="shm-lab">
      <header className="shm-hero">
        <div>
          <span>OSCILLATIONS · CLASS 11</span>
          <h1>{experiment.title}</h1>
          <p>
            Follow restoring force, phase and energy through one oscillation.
          </p>
        </div>
        <div className={input.driven ? "driven" : ""}>
          ● {input.driven ? "DRIVEN RESPONSE" : "FREE RELEASE"}
        </div>
      </header>
      <div className="shm-layout">
        <aside className="shm-card shm-controls">
          <span className="shm-eyebrow">1 · APPARATUS</span>
          <div
            className="mode-buttons"
            role="group"
            aria-label="Oscillation mode"
          >
            <button
              className={!input.driven ? "active" : ""}
              onClick={() => change({ driven: false })}
            >
              Free release
            </button>
            <button
              className={input.driven ? "active" : ""}
              onClick={() =>
                change({
                  driven: true,
                  dampingNsM: Math.max(input.dampingNsM, 0.2),
                })
              }
            >
              Driven
            </button>
          </div>
          <Range
            label="Mass"
            value={input.massKg}
            min={0.1}
            max={2}
            step={0.05}
            unit="kg"
            onChange={(massKg) => change({ massKg })}
          />
          <Range
            label="Spring constant"
            value={input.springConstantNm}
            min={5}
            max={50}
            step={1}
            unit="N/m"
            onChange={(springConstantNm) => change({ springConstantNm })}
          />
          <Range
            label="Release amplitude"
            value={input.amplitudeM}
            min={0.02}
            max={0.3}
            step={0.01}
            unit="m"
            onChange={(amplitudeM) => change({ amplitudeM })}
          />
          <Range
            label="Damping coefficient"
            value={input.dampingNsM}
            min={0}
            max={4}
            step={0.1}
            unit="N·s/m"
            onChange={(dampingNsM) => change({ dampingNsM })}
          />
          <Range
            label="Drive frequency"
            value={input.driveFrequencyHz}
            min={0.2}
            max={3}
            step={0.01}
            unit="Hz"
            onChange={(driveFrequencyHz) => change({ driveFrequencyHz })}
          />
          <div
            className="shm-presets"
            role="group"
            aria-label="SHM setting presets"
          >
            <button
              onClick={() =>
                change({
                  massKg: 0.1,
                  springConstantNm: 5,
                  amplitudeM: 0.02,
                  dampingNsM: 0,
                  driveFrequencyHz: 0.2,
                })
              }
            >
              Minimums
            </button>
            <button onClick={() => change(defaults)}>Reference</button>
            <button
              onClick={() =>
                change({
                  massKg: 2,
                  springConstantNm: 50,
                  amplitudeM: 0.3,
                  dampingNsM: 4,
                  driveFrequencyHz: 3,
                })
              }
            >
              Maximums
            </button>
          </div>
        </aside>
        <main className="shm-card shm-stage">
          <div className="shm-stage-head">
            <span>2 · SPRING TRACK</span>
            <b>
              x = {result.x >= 0 ? "+" : ""}
              {result.x.toFixed(3)} m
            </b>
          </div>
          <div className="shm-bench">
            <img
              className="track"
              src="/assets/experiments/shm-spring/shm-track.png"
              alt="Empty dynamics track and spring support"
            />
            <svg
              viewBox="0 0 900 390"
              role="img"
              aria-label={`Spring cart displacement ${result.x.toFixed(3)} metres, velocity ${result.v.toFixed(3)} metres per second`}
            >
              <line
                className="equilibrium"
                x1="500"
                x2="500"
                y1="70"
                y2="290"
              />
              <text x="500" y="58">
                equilibrium x=0
              </text>
              <polyline className="live-spring" points={springPoints} />
              <image
                href="/assets/experiments/shm-spring/shm-cart.png"
                x={cartX - 85}
                y="137"
                width="170"
                height="128"
                preserveAspectRatio="xMidYMid meet"
              />
              <g className="vectors">
                <line
                  className="x-vector"
                  x1={cartX}
                  x2={cartX + arrow(result.x, 0.3)}
                  y1="110"
                  y2="110"
                />
                <text x={cartX + arrow(result.x, 0.3)} y="101">
                  x
                </text>
                <line
                  className="v-vector"
                  x1={cartX}
                  x2={cartX + arrow(result.v, result.omega0 * 0.3)}
                  y1="88"
                  y2="88"
                />
                <text x={cartX + arrow(result.v, result.omega0 * 0.3)} y="79">
                  v
                </text>
                <line
                  className="a-vector"
                  x1={cartX}
                  x2={
                    cartX + arrow(result.acceleration, result.omega0 ** 2 * 0.3)
                  }
                  y1="66"
                  y2="66"
                />
                <text
                  x={
                    cartX + arrow(result.acceleration, result.omega0 ** 2 * 0.3)
                  }
                  y="57"
                >
                  a
                </text>
              </g>
              <text x="135" y="310">
                −0.30 m
              </text>
              <text x="765" y="310">
                +0.30 m
              </text>
            </svg>
          </div>
          <div className="shm-transport">
            <button
              aria-label={
                running ? "Pause SHM animation" : "Play SHM animation"
              }
              onClick={() => setRunning((v) => !v)}
            >
              {running ? "❚❚ Pause" : "▶ Play"}
            </button>
            <button
              onClick={() => {
                setRunning(false);
                setTime((t) => (t + 0.05) % 5);
              }}
            >
              ▶│ Step
            </button>
            <input
              aria-label="SHM timeline"
              type="range"
              min="0"
              max="5"
              step=".005"
              value={time}
              onChange={(e) => {
                setRunning(false);
                setTime(+e.target.value);
              }}
            />
            <select
              aria-label="SHM playback speed"
              value={speed}
              onChange={(e) => setSpeed(+e.target.value)}
            >
              {[0.25, 0.5, 1, 1.5, 2].map((n) => (
                <option key={n} value={n}>
                  {n}×
                </option>
              ))}
            </select>
            <label>
              <input
                type="checkbox"
                checked={reduced}
                onChange={(e) => {
                  setReduced(e.target.checked);
                  if (e.target.checked) setRunning(false);
                }}
              />{" "}
              Reduced motion
            </label>
            <button onClick={reset}>↻ Reset</button>
          </div>
        </main>
        <aside className="shm-card shm-readings">
          <span className="shm-eyebrow">3 · STATE & PHASE</span>
          <div className="shm-values">
            <div>
              <span>ω₀</span>
              <b>{result.omega0.toFixed(3)} rad/s</b>
            </div>
            <div>
              <span>Period T</span>
              <b>{result.periodS.toFixed(3)} s</b>
            </div>
            <div>
              <span>Velocity v</span>
              <b>{result.v.toFixed(3)} m/s</b>
            </div>
            <div>
              <span>Acceleration a</span>
              <b>{result.acceleration.toFixed(3)} m/s²</b>
            </div>
          </div>
          <svg
            className="phase-circle"
            viewBox="0 0 180 180"
            role="img"
            aria-label="Phase circle showing displacement and velocity quadrature"
          >
            <circle cx="90" cy="90" r="58" />
            <line
              x1="90"
              x2={90 + 58 * Math.cos(phaseAngle)}
              y1="90"
              y2={90 - 58 * Math.sin(phaseAngle)}
            />
            <circle
              className="phase-dot"
              cx={90 + 58 * Math.cos(phaseAngle)}
              cy={90 - 58 * Math.sin(phaseAngle)}
              r="6"
            />
            <line x1="25" x2="155" y1="90" y2="90" />
            <line x1="90" x2="90" y1="25" y2="155" />
            <text x="156" y="84">
              x
            </text>
            <text x="102" y="28">
              −v/ω
            </text>
          </svg>
          <div className="shm-equation">
            <code>ω₀ = √(k/m)</code>
            <span>
              {input.springConstantNm.toFixed(0)} N/m ÷{" "}
              {input.massKg.toFixed(2)} kg
            </span>
          </div>
          <div className="shm-predict">
            <p>To increase the period, which change works?</p>
            <div>
              <button
                className={prediction === "mass" ? "active" : ""}
                onClick={() => setPrediction("mass")}
              >
                Increase mass
              </button>
              <button
                className={prediction === "spring" ? "active" : ""}
                onClick={() => setPrediction("spring")}
              >
                Increase k
              </button>
            </div>
            <button
              onClick={() =>
                setPredictionFeedback(
                  prediction === "mass"
                    ? "Correct — T=2π√(m/k)."
                    : "Increasing k makes the period shorter.",
                )
              }
            >
              Check prediction
            </button>
            {predictionFeedback && (
              <p aria-live="polite">{predictionFeedback}</p>
            )}
          </div>
        </aside>
      </div>
      <section className="shm-bottom">
        <div className="shm-card time-plots">
          <span className="shm-eyebrow">4 · PHASED TIME PLOTS</span>
          <svg
            viewBox="0 0 540 230"
            role="img"
            aria-label="Displacement velocity and acceleration versus time"
          >
            <line x1="30" x2="520" y1="55" y2="55" />
            <line x1="30" x2="520" y1="120" y2="120" />
            <line x1="30" x2="520" y1="185" y2="185" />
            <polyline className="x-trace" points={trace("x", 55)} />
            <polyline className="v-trace" points={trace("v", 120)} />
            <polyline className="a-trace" points={trace("a", 185)} />
            <text x="15" y="55">
              x
            </text>
            <text x="15" y="120">
              v
            </text>
            <text x="15" y="185">
              a
            </text>
            <line
              className="cursor"
              x1={30 + (time / 5) * 490}
              x2={30 + (time / 5) * 490}
              y1="20"
              y2="210"
            />
          </svg>
        </div>
        <div className="shm-card energy-card">
          <span className="shm-eyebrow">5 · ENERGY EXCHANGE</span>
          <div>
            <label>
              Kinetic K <b>{result.kineticJ.toFixed(3)} J</b>
            </label>
            <i>
              <span style={{ width: `${energyFractionK * 100}%` }} />
            </i>
          </div>
          <div>
            <label>
              Spring U <b>{result.potentialJ.toFixed(3)} J</b>
            </label>
            <i>
              <span style={{ width: `${energyFractionU * 100}%` }} />
            </i>
          </div>
          <strong>Total {result.totalEnergyJ.toFixed(3)} J</strong>
          <p>
            {!input.driven && input.dampingNsM === 0
              ? "Undamped total energy is constant."
              : input.driven
                ? "The driver supplies and damping removes energy."
                : "Damping converts mechanical energy to thermal energy."}
          </p>
        </div>
        <div className="shm-card resonance-card">
          <span className="shm-eyebrow">6 · RESONANCE CHALLENGE</span>
          <h2>Tune fᵈ to f₀ = {result.naturalFrequencyHz.toFixed(3)} Hz</h2>
          <p>Use driven mode and maximize the steady-state response.</p>
          <div className="res-meter">
            <i
              style={{
                left: `${clamp((input.driveFrequencyHz / 3) * 100, 0, 100)}%`,
              }}
            />
            <em
              style={{
                left: `${clamp((result.naturalFrequencyHz / 3) * 100, 0, 100)}%`,
              }}
            >
              f₀
            </em>
          </div>
          <dl>
            <div>
              <dt>Drive frequency</dt>
              <dd>{input.driveFrequencyHz.toFixed(3)} Hz</dd>
            </div>
            <div>
              <dt>Response amplitude</dt>
              <dd>{result.responseAmplitudeM.toFixed(3)} m</dd>
            </div>
            <div>
              <dt>Frequency error</dt>
              <dd>{(resonanceError * 100).toFixed(1)}%</dd>
            </div>
          </dl>
          <div>
            <button
              onClick={() =>
                change({
                  driven: true,
                  dampingNsM: Math.max(input.dampingNsM, 0.2),
                  driveFrequencyHz: result.naturalFrequencyHz,
                })
              }
            >
              Tune to resonance
            </button>
            <button
              onClick={() =>
                setMissionFeedback(
                  missionSuccess
                    ? "Resonance found — drive and natural frequencies match."
                    : "Switch to driven mode and move fᵈ closer to f₀.",
                )
              }
            >
              Evaluate
            </button>
          </div>
          {missionFeedback && (
            <p
              className={missionSuccess ? "success" : "try"}
              aria-live="polite"
            >
              {missionFeedback}
            </p>
          )}
        </div>
      </section>
      <p className="sr-only" aria-live="polite">
        Displacement {result.x.toFixed(3)} metres, velocity{" "}
        {result.v.toFixed(3)} metres per second, acceleration{" "}
        {result.acceleration.toFixed(3)} metres per second squared.
      </p>
    </section>
  );
}
