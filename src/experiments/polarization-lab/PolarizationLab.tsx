import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  solvePolarization,
  type InputPolarization,
} from "./polarizationSimulation";
import "./polarization-lab.css";

const defaults = {
  inputType: "unpolarized" as InputPolarization,
  inputIntensityMw: 1,
  polarizerDeg: 0,
  analyzerDeg: 45,
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
    <label className="pol-range">
      <span>
        <b>{label}</b>
        <output>
          {value.toFixed(step < 1 ? 2 : 0)}
          {unit}
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
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </small>
    </label>
  );
}
function Axis({
  x,
  angle,
  label,
  color,
}: {
  x: number;
  angle: number;
  label: string;
  color: string;
}) {
  return (
    <g className="axis-control" style={{ "--axis": color } as CSSProperties}>
      <circle cx={x} cy="143" r="52" />
      <line
        x1={x}
        x2={x}
        y1="101"
        y2="185"
        transform={`rotate(${angle} ${x} 143)`}
      />
      <path
        d={`M${x - 6} 108L${x} 97l6 11M${x - 6} 178l6 11 6-11`}
        transform={`rotate(${angle} ${x} 143)`}
      />
      <text x={x} y="82">
        {label} · {angle.toFixed(0)}°
      </text>
    </g>
  );
}
export function PolarizationLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(defaults),
    [time, setTime] = useState(0),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(false),
    [prediction, setPrediction] = useState("50"),
    [predictionFeedback, setPredictionFeedback] = useState(""),
    [missionFeedback, setMissionFeedback] = useState("");
  const result = useMemo(() => solvePolarization(input), [input]);
  useEffect(() => {
    if (!running || reduced) return;
    const id = window.setInterval(
      () => setTime((t) => (t + 0.035 * speed) % 1),
      40,
    );
    return () => window.clearInterval(id);
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
    setPrediction("50");
    setPredictionFeedback("");
    setMissionFeedback("");
  };
  const phase = time * Math.PI * 2;
  const wave = (x1: number, x2: number, amp: number, angle: number) =>
    Array.from({ length: 61 }, (_, i) => {
      const x = x1 + ((x2 - x1) * i) / 60;
      const displacement = Math.sin((i / 60) * Math.PI * 4 - phase) * amp;
      const r = (angle * Math.PI) / 180;
      return `${x + displacement * Math.sin(r)},${143 - displacement * Math.cos(r)}`;
    }).join(" ");
  const graphPoints = Array.from(
    { length: 91 },
    (_, i) =>
      `${24 + i * 2.65},${126 - Math.cos((i * Math.PI) / 90) ** 2 * 94}`,
  ).join(" ");
  const detectorGlow = clamp(
    result.transmittedMw / Math.max(input.inputIntensityMw, 0.001),
    0,
    1,
  );
  const missionSuccess = Math.abs(result.analyzerFraction - 0.25) <= 0.02;
  return (
    <section className="pol-lab">
      <header className="pol-hero">
        <div>
          <span>WAVES · CLASS 12</span>
          <h1>{experiment.title}</h1>
          <p>
            Rotate two transmission axes and measure how a transverse electric
            field is selected.
          </p>
        </div>
        <div
          className={
            result.state === "Extinction" ? "extinct" : running ? "running" : ""
          }
        >
          ● {result.state.toUpperCase()}
        </div>
      </header>
      <div className="pol-layout">
        <aside className="pol-card pol-controls">
          <span className="eyebrow">1 · LIGHT SOURCE</span>
          <div
            className="input-types"
            role="group"
            aria-label="Input polarization"
          >
            {(["unpolarized", "linear", "circular"] as InputPolarization[]).map(
              (type) => (
                <button
                  key={type}
                  className={input.inputType === type ? "active" : ""}
                  onClick={() => change({ inputType: type })}
                >
                  {type[0].toUpperCase() + type.slice(1)}
                </button>
              ),
            )}
          </div>
          <div className={`source-state ${input.inputType}`}>
            <i />{" "}
            <b>
              {input.inputType === "linear"
                ? "Linear at 0°"
                : input.inputType === "circular"
                  ? "Circular field"
                  : "Random orientations"}
            </b>
          </div>
          <Range
            label="Input intensity"
            value={input.inputIntensityMw}
            min={0.1}
            max={2}
            step={0.05}
            unit=" mW"
            onChange={(inputIntensityMw) => change({ inputIntensityMw })}
          />
          <span className="eyebrow divide">2 · OPTICAL ELEMENTS</span>
          <Range
            label="Polarizer angle"
            value={input.polarizerDeg}
            min={0}
            max={180}
            step={1}
            unit="°"
            onChange={(polarizerDeg) => change({ polarizerDeg })}
          />
          <Range
            label="Analyzer angle"
            value={input.analyzerDeg}
            min={0}
            max={180}
            step={1}
            unit="°"
            onChange={(analyzerDeg) => change({ analyzerDeg })}
          />
          <div className="presets">
            <button onClick={() => change({ analyzerDeg: input.polarizerDeg })}>
              Parallel
            </button>
            <button
              onClick={() =>
                change({ analyzerDeg: (input.polarizerDeg + 60) % 180 })
              }
            >
              25%
            </button>
            <button
              onClick={() =>
                change({ analyzerDeg: (input.polarizerDeg + 90) % 180 })
              }
            >
              Crossed
            </button>
          </div>
        </aside>
        <main className="pol-card pol-stage">
          <div className="pol-stage-head">
            <span>3 · OPTICAL BENCH</span>
            <b>Relative angle θ = {result.relativeAngleDeg.toFixed(0)}°</b>
          </div>
          <div className="bench">
            <img
              src="/assets/experiments/polarization-lab/polarization-bench.png"
              alt="Laser, polarizer, analyser and photodiode on an optical rail"
            />
            <svg
              viewBox="0 0 800 300"
              role="img"
              aria-label="Electric field passing through polarizer and analyser"
            >
              <line
                className="beam"
                x1="112"
                x2="697"
                y1="143"
                y2="143"
                style={{ opacity: 0.15 + detectorGlow * 0.85 }}
              />
              <g className="input-field">
                {input.inputType === "unpolarized" ? (
                  [0, 45, 90, 135].map((a) => (
                    <line
                      key={a}
                      x1="155"
                      x2="218"
                      y1="143"
                      y2="143"
                      transform={`rotate(${a} 186 143)`}
                    />
                  ))
                ) : input.inputType === "circular" ? (
                  <ellipse cx="186" cy="143" rx="31" ry="16" />
                ) : (
                  <polyline points={wave(150, 222, 18, 0)} />
                )}
              </g>
              <polyline
                className="selected-wave"
                points={wave(336, 452, 22, input.polarizerDeg)}
              />
              <polyline
                className="output-wave"
                style={{ opacity: 0.08 + result.analyzerFraction * 0.92 }}
                points={wave(
                  548,
                  675,
                  22 * Math.sqrt(result.analyzerFraction),
                  input.analyzerDeg,
                )}
              />
              <Axis
                x={282}
                angle={input.polarizerDeg}
                label="POLARIZER"
                color="#1c7bc2"
              />
              <Axis
                x={502}
                angle={input.analyzerDeg}
                label="ANALYSER"
                color="#e34a36"
              />
              <circle
                className="detector-glow"
                cx="699"
                cy="143"
                r={14 + detectorGlow * 16}
                style={{ opacity: detectorGlow }}
              />
              <text x="184" y="220">
                input
              </text>
              <text x="393" y="220">
                plane polarized
              </text>
              <text x="626" y="220">
                attenuated
              </text>
            </svg>
          </div>
          <div className="pol-transport">
            <button
              aria-label={
                running ? "Pause field animation" : "Play field animation"
              }
              onClick={() => setRunning((v) => !v)}
            >
              {running ? "❚❚ Pause" : "▶ Play"}
            </button>
            <button
              onClick={() => {
                setRunning(false);
                setTime((t) => (t + 0.05) % 1);
              }}
            >
              ▶│ Step
            </button>
            <input
              aria-label="Field phase timeline"
              type="range"
              min="0"
              max="1"
              step=".005"
              value={time}
              onChange={(e) => {
                setRunning(false);
                setTime(+e.target.value);
              }}
            />
            <select
              aria-label="Playback speed"
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
          <p className="visual-note">
            Field amplitudes are visually enlarged; intensity is proportional to
            the square of field amplitude.
          </p>
        </main>
        <aside className="pol-card pol-readings">
          <span className="eyebrow">4 · MEASUREMENTS</span>
          <div className="big-reading">
            <span>TRANSMITTED</span>
            <b>{result.transmittedMw.toFixed(3)} mW</b>
            <small>
              {(result.analyzerFraction * 100).toFixed(1)}% of light after
              polarizer
            </small>
          </div>
          <dl>
            <div>
              <dt>After polarizer</dt>
              <dd>{result.afterPolarizerMw.toFixed(3)} mW</dd>
            </div>
            <div>
              <dt>Relative angle</dt>
              <dd>{result.relativeAngleDeg.toFixed(1)}°</dd>
            </div>
            <div>
              <dt>Analyzer fraction</dt>
              <dd>{(result.analyzerFraction * 100).toFixed(1)}%</dd>
            </div>
            <div>
              <dt>Of source intensity</dt>
              <dd>{(result.inputFraction * 100).toFixed(1)}%</dd>
            </div>
          </dl>
          <div className="malus">
            <b>MALUS'S LAW</b>
            <code>I = Iₚ cos²θ</code>
            <span>
              {result.afterPolarizerMw.toFixed(3)} × cos²(
              {result.relativeAngleDeg.toFixed(0)}°) ={" "}
              {result.transmittedMw.toFixed(3)} mW
            </span>
          </div>
          <svg
            className="malus-graph"
            viewBox="0 0 280 150"
            role="img"
            aria-label="Malus law intensity fraction versus relative angle"
          >
            <line x1="24" x2="263" y1="126" y2="126" />
            <line x1="24" x2="24" y1="25" y2="126" />
            <polyline points={graphPoints} />
            <circle
              cx={24 + result.relativeAngleDeg * 2.65}
              cy={126 - result.analyzerFraction * 94}
              r="5"
            />
            <text x="20" y="145">
              0°
            </text>
            <text x="239" y="145">
              90°
            </text>
          </svg>
        </aside>
      </div>
      <section className="pol-bottom">
        <div className="prediction">
          <span>5 · PREDICT BEFORE MEASURING</span>
          <p>
            At the current relative angle, what analyzer transmission do you
            expect?
          </p>
          <div>
            <input
              aria-label="Predicted transmission percent"
              type="number"
              min="0"
              max="100"
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
            />
            <b>%</b>
            <button
              onClick={() =>
                setPredictionFeedback(
                  Math.abs(+prediction - result.analyzerFraction * 100) <= 2
                    ? "Prediction agrees within 2%."
                    : `Use cos²(${result.relativeAngleDeg.toFixed(0)}°), then compare again.`,
                )
              }
            >
              Check prediction
            </button>
          </div>
          {predictionFeedback && <p aria-live="polite">{predictionFeedback}</p>}
        </div>
        <div className="pol-mission">
          <span>6 · CHALLENGE</span>
          <h2>Set analyser transmission to 25%</h2>
          <p>Rotate either axis until their smallest separation is 60°.</p>
          <div className="mission-meter">
            <i
              style={{
                width: `${clamp(result.analyzerFraction * 100, 0, 100)}%`,
              }}
            />
            <em>Target 25%</em>
          </div>
          <button
            onClick={() =>
              setMissionFeedback(
                missionSuccess
                  ? `Mission complete — θ=${result.relativeAngleDeg.toFixed(0)}° gives ${(result.analyzerFraction * 100).toFixed(1)}%.`
                  : `Current transmission is ${(result.analyzerFraction * 100).toFixed(1)}%. Move toward a 60° relative angle.`,
              )
            }
          >
            Evaluate setting
          </button>
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
    </section>
  );
}
