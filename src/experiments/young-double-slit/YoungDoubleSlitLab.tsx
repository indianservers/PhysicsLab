import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { solveYoungDoubleSlit } from "./young-double-slitSimulation";
import "./young-double-slit.css";

const defaults = {
  wavelengthM: 632.8e-9,
  slitSeparationM: 0.25e-3,
  screenDistanceM: 1.5,
  coherence: 1,
};
const referenceBetaM =
  (defaults.wavelengthM * defaults.screenDistanceM) / defaults.slitSeparationM;

function Range({
  label,
  value,
  min,
  max,
  step,
  unit,
  scale,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  scale: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="yds-range">
      <span>
        <b>{label}</b>
        <output>
          {(value * scale).toFixed(unit === "nm" ? 0 : unit === "mm" ? 3 : 2)}{" "}
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
        onChange={(event) => onChange(+event.target.value)}
      />
      <small>
        <span>{(min * scale).toFixed(unit === "mm" ? 2 : 1)}</span>
        <span>{(max * scale).toFixed(unit === "mm" ? 2 : 1)}</span>
      </small>
    </label>
  );
}

const wavelengthColor = (metres: number) => {
  const nm = metres * 1e9;
  const hue =
    nm < 500
      ? 260 - (nm - 380) * 1.05
      : nm < 590
        ? 134 - (nm - 500) * 1.15
        : Math.max(0, 32 - (nm - 590) * 0.29);
  return `hsl(${hue} 94% 54%)`;
};

export function YoungDoubleSlitLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(defaults);
  const [probeYM, setProbeYM] = useState(0.0126);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reduced, setReduced] = useState(false);
  const [prediction, setPrediction] = useState<"larger" | "smaller" | null>(
    null,
  );
  const [predictionFeedback, setPredictionFeedback] = useState("");
  const [missionFeedback, setMissionFeedback] = useState("");
  const result = useMemo(
    () => solveYoungDoubleSlit({ ...input, probeYM }),
    [input, probeYM],
  );
  const color = wavelengthColor(input.wavelengthM);
  useEffect(() => {
    if (!running || reduced) return;
    const timer = window.setInterval(
      () => setTime((value) => (value + 0.012 * speed) % 1),
      35,
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
    setProbeYM(0.0126);
    setTime(0);
    setRunning(false);
    setSpeed(1);
    setReduced(false);
    setPrediction(null);
    setPredictionFeedback("");
    setMissionFeedback("");
  };
  const missionError =
    Math.abs(result.betaM - 2 * referenceBetaM) / (2 * referenceBetaM);
  const missionSuccess = missionError <= 0.02;
  const graphPath = Array.from({ length: 181 }, (_, index) => {
    const yM = -0.03 + (index / 180) * 0.06;
    return `${index ? "L" : "M"}${35 + (index / 180) * 650},${190 - result.intensityAt(yM) * 150}`;
  }).join(" ");
  const waveProgress = Math.min(1, time * 2.2);
  return (
    <section className="yds-lab">
      <header className="yds-head">
        <div>
          <span>INTERFERENCE · CLASS 12</span>
          <h1>{experiment.title}</h1>
          <p>Connect path difference to bright and dark fringes.</p>
        </div>
        <div className="yds-transport">
          <button
            disabled={reduced}
            onClick={() => setRunning((value) => !value)}
          >
            {running ? "❚❚ Pause" : "▶ Play"}
          </button>
          <button
            onClick={() => {
              setRunning(false);
              setTime((value) => (value + 0.02) % 1);
            }}
          >
            ▶│ Step
          </button>
          <select
            aria-label="Interference playback speed"
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
              aria-label="Reduced motion"
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
      <div className="yds-grid">
        <aside className="yds-card yds-controls">
          <span className="yds-kicker">1 · OPTICAL CONTROLS</span>
          <Range
            label="Wavelength"
            value={input.wavelengthM}
            min={380e-9}
            max={700e-9}
            step={5e-9}
            unit="nm"
            scale={1e9}
            onChange={(wavelengthM) => change({ wavelengthM })}
          />
          <Range
            label="Slit separation"
            value={input.slitSeparationM}
            min={0.05e-3}
            max={2e-3}
            step={0.01e-3}
            unit="mm"
            scale={1000}
            onChange={(slitSeparationM) => change({ slitSeparationM })}
          />
          <Range
            label="Screen distance"
            value={input.screenDistanceM}
            min={0.2}
            max={3}
            step={0.05}
            unit="m"
            scale={1}
            onChange={(screenDistanceM) => change({ screenDistanceM })}
          />
          <label className="yds-coherence">
            <span>
              <b>Source coherence</b>
              <output>{Math.round(input.coherence * 100)}%</output>
            </span>
            <select
              aria-label="Source coherence"
              value={input.coherence}
              onChange={(event) => change({ coherence: +event.target.value })}
            >
              <option value="1">High — coherent</option>
              <option value="0.65">Partial</option>
              <option value="0">Incoherent</option>
            </select>
          </label>
          <div className="yds-presets">
            <button
              onClick={() =>
                change({
                  wavelengthM: 380e-9,
                  slitSeparationM: 0.05e-3,
                  screenDistanceM: 0.2,
                  coherence: 0,
                })
              }
            >
              Minimums
            </button>
            <button onClick={() => change(defaults)}>Reference</button>
            <button
              onClick={() =>
                change({
                  wavelengthM: 700e-9,
                  slitSeparationM: 2e-3,
                  screenDistanceM: 3,
                  coherence: 1,
                })
              }
            >
              Maximums
            </button>
          </div>
          <div className="yds-equation">
            <strong>β = λD/d</strong>
            <span>
              {(result.betaM * 1000).toFixed(3)} mm ={" "}
              {(input.wavelengthM * 1e9).toFixed(0)} nm ×{" "}
              {input.screenDistanceM.toFixed(2)} m ÷{" "}
              {(input.slitSeparationM * 1000).toFixed(3)} mm
            </span>
          </div>
          <div className="yds-predict">
            <b>Predict first</b>
            <p>If slit separation increases, β becomes…</p>
            <div>
              <button
                className={prediction === "larger" ? "active" : ""}
                onClick={() => setPrediction("larger")}
              >
                Larger
              </button>
              <button
                className={prediction === "smaller" ? "active" : ""}
                onClick={() => setPrediction("smaller")}
              >
                Smaller
              </button>
            </div>
            <button
              onClick={() =>
                setPredictionFeedback(
                  prediction === "smaller"
                    ? "Correct — spacing is inversely proportional to d."
                    : "Try again: d is in the denominator.",
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
        <main className="yds-card yds-stage">
          <div className="yds-stage-title">
            <span>2 · COHERENT WAVEFRONTS & SCREEN</span>
            <b style={{ color }}>{(input.wavelengthM * 1e9).toFixed(0)} nm</b>
          </div>
          <div className="yds-bench">
            <img
              src="/assets/experiments/young-double-slit/optical-bench.png"
              alt="Laser, double-slit plate and detector screen on an optical rail"
            />
            <svg
              viewBox="0 0 900 430"
              role="img"
              aria-label={`Double slit fringe pattern with spacing ${(result.betaM * 1000).toFixed(3)} millimetres`}
              onPointerDown={(event) => {
                const box = event.currentTarget.getBoundingClientRect();
                const ySvg = ((event.clientY - box.top) / box.height) * 430;
                setProbeYM(
                  Math.max(-0.03, Math.min(0.03, ((160 - ySvg) / 90) * 0.03)),
                );
              }}
            >
              <defs>
                <filter id="ydsGlow">
                  <feGaussianBlur stdDeviation="5" />
                </filter>
              </defs>
              <line
                x1="180"
                x2={180 + (475 - 180) * Math.min(1, time * 3)}
                y1="205"
                y2="205"
                stroke={color}
                strokeWidth="3"
              />
              <g style={{ opacity: input.coherence }}>
                {Array.from({ length: 9 }, (_, index) => (
                  <circle
                    key={index}
                    cx="475"
                    cy={205 + (index % 2 ? 12 : -12)}
                    r={((index * 46 + time * 90) % 390) * waveProgress}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    opacity={0.55}
                  />
                ))}
              </g>
              <line
                x1="475"
                y1="193"
                x2="790"
                y2={160 - (probeYM / 0.03) * 90}
                stroke={color}
                strokeDasharray="5 4"
                opacity=".8"
              />
              <line
                x1="475"
                y1="217"
                x2="790"
                y2={160 - (probeYM / 0.03) * 90}
                stroke="#2975e8"
                strokeDasharray="5 4"
                opacity=".8"
              />
              <g
                className="yds-fringes"
                style={{ opacity: 0.25 + 0.75 * input.coherence }}
              >
                {Array.from({ length: 61 }, (_, index) => {
                  const yM = -0.03 + index * 0.001;
                  const intensity = result.intensityAt(yM);
                  return (
                    <rect
                      key={index}
                      x="752"
                      y={70 + index * 3}
                      width="64"
                      height="3.3"
                      rx="2"
                      fill={color}
                      opacity={intensity}
                      filter={intensity > 0.75 ? "url(#ydsGlow)" : undefined}
                    />
                  );
                })}
              </g>
              <line className="yds-axis" x1="830" x2="830" y1="70" y2="250" />
              <g
                className="yds-probe"
                transform={`translate(830 ${160 - (probeYM / 0.03) * 90})`}
              >
                <circle r="9" />
                <line x1="-14" x2="14" />
              </g>
              <text x="830" y="58">
                y = {(probeYM * 1000).toFixed(2)} mm
              </text>
              <text x="475" y="150">
                d = {(input.slitSeparationM * 1000).toFixed(3)} mm
              </text>
              <text x="630" y="385">
                D = {input.screenDistanceM.toFixed(2)} m
              </text>
            </svg>
          </div>
          <div className="yds-timeline">
            <input
              aria-label="Interference timeline"
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
            <span>build {Math.round(time * 100)}%</span>
          </div>
        </main>
        <aside className="yds-card yds-readings">
          <span className="yds-kicker">3 · SELECTED POINT</span>
          <dl>
            <div>
              <dt>r₁</dt>
              <dd>{result.rUpperM.toFixed(6)} m</dd>
            </div>
            <div>
              <dt>r₂</dt>
              <dd>{result.rLowerM.toFixed(6)} m</dd>
            </div>
            <div>
              <dt>Path difference Δ</dt>
              <dd>{(result.pathDifferenceM * 1e6).toFixed(2)} µm</dd>
            </div>
            <div>
              <dt>Phase δ</dt>
              <dd>{result.phaseDifferenceRad.toFixed(2)} rad</dd>
            </div>
            <div>
              <dt>Order Δ/λ</dt>
              <dd>{result.order.toFixed(2)}</dd>
            </div>
            <div>
              <dt>Intensity</dt>
              <dd>{(result.intensity * 100).toFixed(1)}%</dd>
            </div>
          </dl>
          <div className={`yds-class ${result.classification}`}>
            <b>
              {result.classification === "bright"
                ? "BRIGHT: Δ = mλ"
                : result.classification === "dark"
                  ? "DARK: Δ = (m+½)λ"
                  : result.classification === "incoherent"
                    ? "NO STABLE FRINGES"
                    : "BETWEEN EXTREMA"}
            </b>
            <span>
              {result.smallAngleValid
                ? "Small-angle approximation valid"
                : "Exact path lengths used; probe angle is large"}
            </span>
          </div>
          <div className="yds-phasor">
            <svg viewBox="0 0 180 150">
              <circle cx="78" cy="76" r="53" />
              <line x1="78" y1="76" x2="131" y2="76" />
              <line
                x1="78"
                y1="76"
                x2={78 + 53 * Math.cos(result.phaseDifferenceRad)}
                y2={76 - 53 * Math.sin(result.phaseDifferenceRad)}
              />
              <text x="78" y="143">
                δ = {result.phaseDifferenceRad.toFixed(2)} rad
              </text>
            </svg>
            <p>
              Probe the detector by clicking or dragging vertically on the
              stage.
            </p>
          </div>
        </aside>
      </div>
      <section className="yds-bottom">
        <div className="yds-card yds-graph">
          <span className="yds-kicker">4 · INTENSITY DISTRIBUTION ALONG y</span>
          <svg
            viewBox="0 0 720 220"
            role="img"
            aria-label="Interference intensity graph"
          >
            <line x1="35" x2="685" y1="190" y2="190" />
            <line x1="360" x2="360" y1="25" y2="195" />
            <path d={graphPath} stroke={color} />
            <circle
              cx={35 + ((probeYM + 0.03) / 0.06) * 650}
              cy={190 - result.intensity * 150}
              r="5"
            />
            <text x="35" y="210">
              −30 mm
            </text>
            <text x="360" y="210">
              0
            </text>
            <text x="685" y="210">
              +30 mm
            </text>
          </svg>
        </div>
        <div className="yds-card yds-mission">
          <span className="yds-kicker">5 · DOUBLE-SPACING CHALLENGE</span>
          <h2>
            Double β from {(referenceBetaM * 1000).toFixed(3)} to{" "}
            {(2 * referenceBetaM * 1000).toFixed(3)} mm
          </h2>
          <p>Change λ, D or d while keeping the small-angle condition valid.</p>
          <div className="yds-meter">
            <span
              style={{
                width: `${Math.min(100, (result.betaM / (2 * referenceBetaM)) * 100)}%`,
              }}
            />
          </div>
          <dl>
            <div>
              <dt>Current β</dt>
              <dd>{(result.betaM * 1000).toFixed(3)} mm</dd>
            </div>
            <div>
              <dt>Error</dt>
              <dd>{(missionError * 100).toFixed(1)}%</dd>
            </div>
          </dl>
          <div>
            <button onClick={() => change({ screenDistanceM: 3 })}>
              Double D
            </button>
            <button
              onClick={() =>
                setMissionFeedback(
                  missionSuccess
                    ? "Success — β doubled within 2%."
                    : "Keep tuning: target spacing must be within 2%.",
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
        Fringe spacing {(result.betaM * 1000).toFixed(3)} millimetres. Selected
        point {result.classification}.
      </p>
    </section>
  );
}
