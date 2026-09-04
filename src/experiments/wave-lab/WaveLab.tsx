import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  nodePhaseDegrees,
  solveWaveLab,
  type WaveMode,
} from "./wave-labSimulation";
import "./wave-lab.css";

const defaults = {
  amplitudeM: 0.005,
  frequencyHz: 12,
  wavelengthM: 0.0417,
  phaseDeg: 0,
  secondWave: true,
  mode: "traveling" as WaveMode,
};
const targetNodeXM = 0.6;
const modes: { id: WaveMode; label: string }[] = [
  { id: "traveling", label: "Traveling" },
  { id: "standing", label: "Standing" },
  { id: "fixed", label: "Fixed reflection" },
  { id: "free", label: "Free reflection" },
];

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
  onChange: (value: number) => void;
}) {
  const shown =
    unit === "mm" ? value * 1000 : unit === "cm" ? value * 100 : value;
  const shownMin = unit === "mm" ? min * 1000 : unit === "cm" ? min * 100 : min;
  const shownMax = unit === "mm" ? max * 1000 : unit === "cm" ? max * 100 : max;
  return (
    <label className="wave79-range">
      <span>
        <b>{label}</b>
        <output>
          {shown.toFixed(unit === "cm" ? 2 : step < 0.01 ? 1 : 0)} {unit}
        </output>
      </span>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(+event.target.value)}
      />
      <small>
        <span>
          {shownMin} {unit}
        </span>
        <span>
          {shownMax} {unit}
        </span>
      </small>
    </label>
  );
}

const wavePath = (fn: (x: number) => number, y0: number, scale = 4200) =>
  Array.from({ length: 121 }, (_, index) => {
    const xM = index / 120;
    return `${index === 0 ? "M" : "L"}${50 + xM * 800},${y0 - fn(xM) * scale}`;
  }).join(" ");

export function WaveLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(defaults);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reduced, setReduced] = useState(false);
  const [sampleXM, setSampleXM] = useState(0.72);
  const [prediction, setPrediction] = useState<
    "constructive" | "destructive" | null
  >(null);
  const [feedback, setFeedback] = useState("");
  const [missionFeedback, setMissionFeedback] = useState("");
  const result = useMemo(
    () => solveWaveLab({ ...input, timeS: time, sampleXM }),
    [input, time, sampleXM],
  );
  const targetResult = useMemo(
    () => solveWaveLab({ ...input, timeS: time, sampleXM: targetNodeXM }),
    [input, time],
  );
  useEffect(() => {
    if (!running || reduced) return;
    const timer = window.setInterval(
      () => setTime((value) => (value + 0.008 * speed) % 1),
      32,
    );
    return () => window.clearInterval(timer);
  }, [running, reduced, speed]);
  const change = (patch: Partial<typeof input>) => {
    setInput((current) => ({ ...current, ...patch }));
    setRunning(false);
    setMissionFeedback("");
  };
  const reset = () => {
    setInput(defaults);
    setTime(0);
    setRunning(false);
    setSpeed(1);
    setReduced(false);
    setSampleXM(0.72);
    setPrediction(null);
    setFeedback("");
    setMissionFeedback("");
  };
  const rippleSpacing = 26 + input.wavelengthM * 600;
  const rippleOffset =
    ((time * result.speedMs * rippleSpacing) / input.wavelengthM) %
    rippleSpacing;
  const missionSuccess =
    input.mode === "standing" &&
    input.secondWave &&
    targetResult.nodeEnvelopeM <= 0.0005;
  const targetPhase = nodePhaseDegrees(targetNodeXM, input.wavelengthM);
  const detectorClass =
    Math.abs(result.resultant) < input.amplitudeM * 0.25
      ? "node"
      : Math.abs(result.resultant) > input.amplitudeM * 1.5
        ? "antinode"
        : "partial";

  return (
    <section className="wave79-lab">
      <header className="wave79-head">
        <div>
          <span>WAVES · LESSON 079</span>
          <h1>{experiment.title}</h1>
          <p>Build, reflect and superpose measurable transverse waves.</p>
        </div>
        <div className="wave79-transport">
          <button
            disabled={reduced}
            onClick={() => setRunning((value) => !value)}
          >
            {running ? "❚❚ Pause" : "▶ Play"}
          </button>
          <button
            onClick={() => {
              setRunning(false);
              setTime((value) => (value + 0.01) % 1);
            }}
          >
            ▶│ Step
          </button>
          <select
            aria-label="Wave playback speed"
            value={speed}
            onChange={(event) => setSpeed(+event.target.value)}
          >
            {[0.25, 0.5, 1, 1.5, 2].map((value) => (
              <option key={value} value={value}>
                {value}×
              </option>
            ))}
          </select>
          <label>
            <input
              type="checkbox"
              checked={reduced}
              onChange={(event) => {
                setReduced(event.target.checked);
                setRunning(false);
              }}
            />{" "}
            Reduced motion
          </label>
          <button onClick={reset}>↻ Reset</button>
        </div>
      </header>

      <div className="wave79-grid">
        <aside className="wave79-card wave79-controls">
          <span className="wave79-kicker">1 · WAVE CONTROLS</span>
          <Range
            label="Amplitude"
            value={input.amplitudeM}
            min={0.001}
            max={0.015}
            step={0.001}
            unit="mm"
            onChange={(amplitudeM) => change({ amplitudeM })}
          />
          <Range
            label="Frequency"
            value={input.frequencyHz}
            min={2}
            max={30}
            step={1}
            unit="Hz"
            onChange={(frequencyHz) => change({ frequencyHz })}
          />
          <Range
            label="Wavelength"
            value={input.wavelengthM}
            min={0.01}
            max={0.1}
            step={0.001}
            unit="cm"
            onChange={(wavelengthM) => change({ wavelengthM })}
          />
          <Range
            label="Second-wave phase"
            value={input.phaseDeg}
            min={-180}
            max={180}
            step={1}
            unit="°"
            onChange={(phaseDeg) => change({ phaseDeg })}
          />
          <label className="wave79-switch">
            <input
              type="checkbox"
              checked={input.secondWave}
              onChange={(event) => change({ secondWave: event.target.checked })}
            />
            <span>Second coherent wave</span>
          </label>
          <div className="wave79-modes" role="group" aria-label="Wave behavior">
            {modes.map((mode) => (
              <button
                key={mode.id}
                className={input.mode === mode.id ? "active" : ""}
                onClick={() =>
                  change({
                    mode: mode.id,
                    secondWave:
                      mode.id === "traveling" ? input.secondWave : true,
                  })
                }
              >
                {mode.label}
              </button>
            ))}
          </div>
          <div className="wave79-presets">
            <button
              onClick={() =>
                change({
                  amplitudeM: 0.001,
                  frequencyHz: 2,
                  wavelengthM: 0.01,
                  phaseDeg: -180,
                })
              }
            >
              Minimums
            </button>
            <button onClick={() => change(defaults)}>Reference</button>
            <button
              onClick={() =>
                change({
                  amplitudeM: 0.015,
                  frequencyHz: 30,
                  wavelengthM: 0.1,
                  phaseDeg: 180,
                })
              }
            >
              Maximums
            </button>
          </div>
          <div className="wave79-equation">
            <strong>v = fλ</strong>
            <span>
              {result.speedMs.toFixed(3)} m/s = {input.frequencyHz.toFixed(0)}{" "}
              Hz × {input.wavelengthM.toFixed(3)} m
            </span>
          </div>
        </aside>

        <main className="wave79-card wave79-stage">
          <div className="wave79-stage-title">
            <span>2 · LIVE RIPPLE TANK & MEDIUM POINTS</span>
            <b>
              {input.mode
                .replace("fixed", "fixed-end")
                .replace("free", "free-end")}
            </b>
          </div>
          <div className="wave79-tank">
            <img
              src="/assets/experiments/wave-lab/ripple-tank.png"
              alt="Top-view ripple tank apparatus"
            />
            <svg
              viewBox="0 0 900 500"
              role="img"
              aria-label={`Two-wave tank with detector at ${sampleXM.toFixed(2)} metres`}
              onPointerDown={(event) => {
                const box = event.currentTarget.getBoundingClientRect();
                setSampleXM(
                  Math.max(
                    0,
                    Math.min(1, (event.clientX - box.left) / box.width),
                  ),
                );
              }}
            >
              <g
                className="wave79-ripples"
                style={{ opacity: 0.45 + (input.amplitudeM / 0.015) * 0.45 }}
              >
                {Array.from({ length: 18 }, (_, index) => (
                  <circle
                    key={`a${index}`}
                    cx="270"
                    cy="250"
                    r={Math.max(
                      4,
                      (index * rippleSpacing + rippleOffset) % 560,
                    )}
                  />
                ))}
                {input.secondWave &&
                  Array.from({ length: 18 }, (_, index) => (
                    <circle
                      key={`b${index}`}
                      className="source-two"
                      cx="630"
                      cy="250"
                      r={Math.max(
                        4,
                        (index * rippleSpacing +
                          rippleOffset +
                          (input.phaseDeg / 360) * rippleSpacing +
                          560) %
                          560,
                      )}
                    />
                  ))}
              </g>
              <circle className="source source-a" cx="270" cy="250" r="18" />
              <text x="270" y="256">
                S₁
              </text>
              <circle
                className={`source source-b ${input.secondWave ? "" : "off"}`}
                cx="630"
                cy="250"
                r="18"
              />
              <text x="630" y="256">
                S₂
              </text>
              <line
                className="target-line"
                x1={50 + targetNodeXM * 800}
                x2={50 + targetNodeXM * 800}
                y1="82"
                y2="418"
              />
              <text className="target-label" x={50 + targetNodeXM * 800} y="74">
                mission x = 0.60 m
              </text>
              <g
                className={`detector ${detectorClass}`}
                transform={`translate(${50 + sampleXM * 800} 160)`}
              >
                <circle r="16" />
                <circle r="5" />
                <text y="-22">D</text>
              </g>
              <path className="medium-base" d="M50 365H850" />
              {Array.from({ length: 41 }, (_, index) => {
                const xM = index / 40;
                return (
                  <circle
                    className="medium-point"
                    key={index}
                    cx={50 + xM * 800}
                    cy={365 - result.resultantAt(xM) * 3600}
                    r="4"
                  />
                );
              })}
              <path
                className="result-wave"
                d={wavePath(result.resultantAt, 365, 3600)}
              />
              <path
                className="component-a"
                d={wavePath(result.firstAt, 445, 1900)}
              />
              {input.secondWave && (
                <path
                  className="component-b"
                  d={wavePath(result.secondAt, 445, 1900)}
                />
              )}
            </svg>
            <div className="wave79-key">
              <span>
                <i className="key-a" /> y₁
              </span>
              <span>
                <i className="key-b" /> y₂
              </span>
              <span>
                <i className="key-r" /> y₁+y₂
              </span>
            </div>
          </div>
          <div className="wave79-time">
            <input
              aria-label="Wave timeline"
              type="range"
              min="0"
              max="1"
              step=".001"
              value={time}
              onChange={(event) => {
                setRunning(false);
                setTime(+event.target.value);
              }}
            />
            <span>t = {time.toFixed(3)} s</span>
          </div>
        </main>

        <aside className="wave79-card wave79-readings">
          <span className="wave79-kicker">3 · DETECTOR READINGS</span>
          <dl>
            <div>
              <dt>Position xᴅ</dt>
              <dd>{sampleXM.toFixed(3)} m</dd>
            </div>
            <div>
              <dt>Component y₁</dt>
              <dd>{(result.y1 * 1000).toFixed(2)} mm</dd>
            </div>
            <div>
              <dt>Component y₂</dt>
              <dd>{(result.y2 * 1000).toFixed(2)} mm</dd>
            </div>
            <div>
              <dt>Resultant y</dt>
              <dd>{(result.resultant * 1000).toFixed(2)} mm</dd>
            </div>
            <div>
              <dt>Period T</dt>
              <dd>{result.periodS.toFixed(3)} s</dd>
            </div>
          </dl>
          <div className={`wave79-status ${detectorClass}`}>
            <b>
              {detectorClass === "node"
                ? "NODE / CANCELLATION"
                : detectorClass === "antinode"
                  ? "ANTINODE / REINFORCEMENT"
                  : "PARTIAL INTERFERENCE"}
            </b>
            <span>y = y₁ + y₂ exactly</span>
          </div>
          <div className="wave79-boundary">
            <b>Boundary check</b>
            <p>
              {input.mode === "fixed"
                ? `Fixed end inverts: y(L) = ${(result.fixedBoundaryResidual * 1000).toExponential(1)} mm.`
                : input.mode === "free"
                  ? `Free end does not invert: slope at L = ${result.freeBoundarySlope.toExponential(1)}.`
                  : input.mode === "standing"
                    ? "Opposite waves create stationary nodes and antinodes."
                    : "Co-propagating waves preserve their phase offset."}
            </p>
          </div>
          <div className="wave79-predict">
            <b>Predict before observing</b>
            <p>At equal phase, two equal waves at the same point are…</p>
            <div>
              <button
                className={prediction === "constructive" ? "active" : ""}
                onClick={() => setPrediction("constructive")}
              >
                Constructive
              </button>
              <button
                className={prediction === "destructive" ? "active" : ""}
                onClick={() => setPrediction("destructive")}
              >
                Destructive
              </button>
            </div>
            <button
              onClick={() =>
                setFeedback(
                  prediction === "constructive"
                    ? "Correct — equal displacements add."
                    : "Try again: equal phase means crest meets crest.",
                )
              }
            >
              Check
            </button>
            {feedback && <p aria-live="polite">{feedback}</p>}
          </div>
        </aside>
      </div>

      <section className="wave79-card wave79-mission">
        <div>
          <span className="wave79-kicker">4 · STATIONARY-NODE CHALLENGE</span>
          <h2>Create a node at x = {targetNodeXM.toFixed(2)} m</h2>
          <p>
            Use standing mode, two waves and phase so this point stays still for
            the entire cycle.
          </p>
        </div>
        <div className="mission-meter">
          <span
            style={{
              width: `${Math.min(100, (targetResult.nodeEnvelopeM / Math.max(2 * input.amplitudeM, 1e-9)) * 100)}%`,
            }}
          />
          <i>
            Envelope at target: {(targetResult.nodeEnvelopeM * 1000).toFixed(3)}{" "}
            mm
          </i>
        </div>
        <div>
          <button onClick={() => setSampleXM(targetNodeXM)}>
            Place detector at target
          </button>
          <button
            onClick={() =>
              change({
                mode: "standing",
                secondWave: true,
                phaseDeg: targetPhase,
              })
            }
          >
            Set node phase ({targetPhase.toFixed(0)}°)
          </button>
          <button
            onClick={() =>
              setMissionFeedback(
                missionSuccess
                  ? "Success — the envelope is zero, so the node is stationary."
                  : "Not yet — use standing mode and tune the phase until the envelope is below 0.5 mm.",
              )
            }
          >
            Evaluate
          </button>
        </div>
        {missionFeedback && (
          <p className={missionSuccess ? "success" : "try"} aria-live="polite">
            {missionFeedback}
          </p>
        )}
      </section>
      <p className="sr-only" aria-live="polite">
        Wave speed {result.speedMs.toFixed(3)} metres per second. Detector
        resultant {(result.resultant * 1000).toFixed(2)} millimetres.
      </p>
    </section>
  );
}
