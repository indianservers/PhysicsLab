import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  computeFaraday,
  FARADAY_TRACK_LIMIT,
  sampleFaradayPass,
  type FaradayInput,
} from "./emi-faradaySimulation";
import "./emi-faraday.css";

const ROOT = "/assets/experiments/emi-faraday";
const DEFAULTS: FaradayInput = {
  magnetStrength: 0.7,
  speed: 0.8,
  turns: 500,
  direction: 1,
  resistance: 10,
  pole: 1,
  position: -FARADAY_TRACK_LIMIT,
};
type RunState = "idle" | "running" | "paused" | "result";
type Prediction = "positive" | "negative" | "zero" | "";

export function EmiFaradayLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(DEFAULTS);
  const [runState, setRunState] = useState<RunState>("idle");
  const [playback, setPlayback] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(
    () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  const [manualPulse, setManualPulse] = useState(false);
  const [peaks, setPeaks] = useState({ positive: 0, negative: 0 });
  const [prediction, setPrediction] = useState<Prediction>("");
  const [predictionFeedback, setPredictionFeedback] = useState("");
  const [missionFeedback, setMissionFeedback] = useState("");
  const [showDimensions, setShowDimensions] = useState(false);
  const drag = useRef(false);
  const pulseTimer = useRef<number | undefined>(undefined);

  const moving = runState === "running" || manualPulse;
  const result = useMemo(() => computeFaraday(input, moving), [input, moving]);
  const pass = useMemo(
    () => sampleFaradayPass(input),
    [
      input.magnetStrength,
      input.speed,
      input.turns,
      input.direction,
      input.resistance,
      input.pole,
    ],
  );
  const theoreticalPeaks = useMemo(
    () => ({
      positive: Math.max(...pass.map((point) => point.emf)),
      negative: Math.abs(Math.min(...pass.map((point) => point.emf))),
    }),
    [pass],
  );

  useEffect(() => {
    if (runState !== "running") return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      setInput((current) => {
        const visualRate =
          current.speed * 0.12 * playback * (reducedMotion ? 0.35 : 1);
        const next = current.position + current.direction * visualRate * dt;
        if (Math.abs(next) >= FARADAY_TRACK_LIMIT) {
          const edge = current.direction * FARADAY_TRACK_LIMIT;
          setRunState("result");
          setPeaks(theoreticalPeaks);
          return { ...current, position: edge };
        }
        return { ...current, position: next };
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [runState, playback, reducedMotion, theoreticalPeaks]);

  useEffect(() => {
    if (!moving) return;
    setPeaks((old) => ({
      positive: Math.max(old.positive, result.emf),
      negative: Math.max(old.negative, -result.emf),
    }));
  }, [moving, result.emf]);

  const update = <K extends keyof FaradayInput>(
    key: K,
    value: FaradayInput[K],
  ) => setInput((current) => ({ ...current, [key]: value }));

  const reset = () => {
    setInput(DEFAULTS);
    setRunState("idle");
    setPeaks({ positive: 0, negative: 0 });
    setPrediction("");
    setPredictionFeedback("");
    setMissionFeedback("");
    setManualPulse(false);
  };
  const begin = () => {
    const start =
      input.direction > 0 ? -FARADAY_TRACK_LIMIT : FARADAY_TRACK_LIMIT;
    if (
      runState === "result" ||
      input.position * input.direction >= FARADAY_TRACK_LIMIT - 0.002
    ) {
      setInput((current) => ({ ...current, position: start }));
      setPeaks({ positive: 0, negative: 0 });
      setMissionFeedback("");
    }
    setRunState("running");
  };
  const step = () => {
    setRunState("paused");
    update(
      "position",
      Math.max(
        -FARADAY_TRACK_LIMIT,
        Math.min(FARADAY_TRACK_LIMIT, input.position + input.direction * 0.015),
      ),
    );
    setManualPulse(true);
    window.clearTimeout(pulseTimer.current);
    pulseTimer.current = window.setTimeout(() => setManualPulse(false), 260);
  };
  const setDirection = (direction: -1 | 1) => {
    setRunState("idle");
    setInput((current) => ({
      ...current,
      direction,
      position: direction > 0 ? -FARADAY_TRACK_LIMIT : FARADAY_TRACK_LIMIT,
    }));
    setPeaks({ positive: 0, negative: 0 });
  };
  const dragMagnet = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const normalized = (event.clientX - bounds.left) / bounds.width;
    const next = Math.max(
      -FARADAY_TRACK_LIMIT,
      Math.min(
        FARADAY_TRACK_LIMIT,
        (normalized - 0.5) * FARADAY_TRACK_LIMIT * 2.5,
      ),
    );
    const direction: -1 | 1 = next < input.position ? -1 : 1;
    setInput((current) => ({ ...current, position: next, direction }));
    setRunState("paused");
    setManualPulse(true);
    window.clearTimeout(pulseTimer.current);
    pulseTimer.current = window.setTimeout(() => setManualPulse(false), 280);
  };

  const peakDifference =
    Math.max(peaks.positive, peaks.negative) === 0
      ? 1
      : Math.abs(peaks.positive - peaks.negative) /
        Math.max(peaks.positive, peaks.negative);
  const missionComplete =
    peaks.positive > 0.1 && peaks.negative > 0.1 && peakDifference <= 0.05;
  const progress =
    input.direction > 0
      ? (input.position + FARADAY_TRACK_LIMIT) / (2 * FARADAY_TRACK_LIMIT)
      : (FARADAY_TRACK_LIMIT - input.position) / (2 * FARADAY_TRACK_LIMIT);
  const magnetLeft =
    12 +
    ((input.position + FARADAY_TRACK_LIMIT) / (2 * FARADAY_TRACK_LIMIT)) * 42;
  const needleAngle = Math.max(-52, Math.min(52, result.current * 4.5));

  return (
    <section
      className="faraday-lab"
      data-ui-theme="light"
      data-run-state={runState}
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="faraday-head">
        <div>
          <span>ELECTRICITY · CLASS 12</span>
          <h2>Electromagnetic Induction</h2>
          <p>
            Move a magnet through the coil and watch changing flux create emf.
          </p>
        </div>
        <div className="faraday-head-actions">
          <button onClick={() => setShowDimensions((value) => !value)}>
            {showDimensions ? "Hide" : "Show"} coil dimensions
          </button>
          <button onClick={reset}>↻ Reset experiment</button>
        </div>
      </header>

      <div className="faraday-layout">
        <aside className="faraday-controls" aria-label="Apparatus controls">
          <h3>Apparatus controls</h3>
          <Control
            label="Magnet strength"
            value={input.magnetStrength}
            min={0.1}
            max={1.2}
            step={0.1}
            unit="T"
            onChange={(value) => update("magnetStrength", value)}
          />
          <Control
            label="Motion speed"
            value={input.speed}
            min={0}
            max={2}
            step={0.05}
            unit="m/s"
            onChange={(value) => update("speed", value)}
          />
          {input.speed === 0 && (
            <p className="faraday-note">
              At rest: dΦ/dt = 0, so induced emf is zero.
            </p>
          )}
          <div className="faraday-button-control">
            <span>Direction</span>
            <div>
              <button
                className={input.direction === -1 ? "active" : ""}
                aria-pressed={input.direction === -1}
                onClick={() => setDirection(-1)}
              >
                ← Left
              </button>
              <button
                className={input.direction === 1 ? "active" : ""}
                aria-pressed={input.direction === 1}
                onClick={() => setDirection(1)}
              >
                Right →
              </button>
            </div>
          </div>
          <div className="faraday-button-control">
            <span>Leading pole</span>
            <button
              className="pole-button"
              onClick={() => update("pole", input.pole === 1 ? -1 : 1)}
            >
              {input.pole === 1 ? "S  |  N" : "N  |  S"} · Reverse
            </button>
          </div>
          <h3>Coil</h3>
          <Control
            label="Turns N"
            value={input.turns}
            min={100}
            max={1000}
            step={50}
            unit=""
            digits={0}
            onChange={(value) => update("turns", value)}
          />
          <Control
            label="Resistance R"
            value={input.resistance}
            min={1}
            max={50}
            step={1}
            unit="Ω"
            digits={0}
            onChange={(value) => update("resistance", value)}
          />
          <div className="faraday-presets">
            <button
              onClick={() =>
                setInput((old) => ({
                  ...old,
                  magnetStrength: 0.1,
                  speed: 0,
                  turns: 100,
                  resistance: 50,
                }))
              }
            >
              Minimum setup
            </button>
            <button onClick={() => setInput(DEFAULTS)}>Typical setup</button>
            <button
              onClick={() =>
                setInput((old) => ({
                  ...old,
                  magnetStrength: 1.2,
                  speed: 2,
                  turns: 1000,
                  resistance: 1,
                }))
              }
            >
              Maximum setup
            </button>
          </div>
        </aside>

        <main className="faraday-main">
          <div className="faraday-transport">
            <div className="faraday-instruction">
              <span>ⓘ</span>
              Drag the magnet or play a full pass through the coil.
            </div>
            <div className="faraday-play">
              <button
                aria-label={
                  runState === "result" ? "Replay induction" : "Play induction"
                }
                onClick={begin}
                disabled={runState === "running"}
              >
                ▶ {runState === "result" ? "Replay" : "Play"}
              </button>
              <button
                aria-label="Pause induction"
                onClick={() => setRunState("paused")}
                disabled={runState !== "running"}
              >
                Ⅱ Pause
              </button>
              <button aria-label="Step induction" onClick={step}>
                ▮▶ Step
              </button>
            </div>
          </div>

          <div
            className="faraday-stage"
            onPointerMove={dragMagnet}
            onPointerUp={() => (drag.current = false)}
            onPointerLeave={() => (drag.current = false)}
          >
            <div
              className="faraday-field"
              style={{
                opacity: Math.min(0.72, 0.18 + Math.abs(result.flux) * 190),
                transform: `translateX(${input.position * 150}px) scale(${0.8 + input.magnetStrength * 0.25})`,
              }}
              aria-hidden="true"
            >
              <img
                src={`${ROOT}/effects/${result.emf >= 0 ? "concept_effect.png" : "interaction_overlay.png"}`}
                alt=""
              />
            </div>
            <img
              className="faraday-apparatus"
              src={`${ROOT}/faraday-apparatus.png`}
              alt="Copper solenoid connected to a center-zero galvanometer and oscilloscope"
            />
            <div
              className={`faraday-magnet ${input.pole < 0 ? "reversed" : ""}`}
              style={{ left: `${magnetLeft}%` }}
              role="slider"
              aria-label="Magnet position"
              aria-valuemin={-24}
              aria-valuemax={24}
              aria-valuenow={Math.round(input.position * 100)}
              tabIndex={0}
              onPointerDown={(event) => {
                drag.current = true;
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                  event.preventDefault();
                  const direction = event.key === "ArrowLeft" ? -1 : 1;
                  update(
                    "position",
                    Math.max(
                      -FARADAY_TRACK_LIMIT,
                      Math.min(
                        FARADAY_TRACK_LIMIT,
                        input.position + direction * 0.01,
                      ),
                    ),
                  );
                  update("direction", direction);
                  setManualPulse(true);
                  window.clearTimeout(pulseTimer.current);
                  pulseTimer.current = window.setTimeout(
                    () => setManualPulse(false),
                    260,
                  );
                }
              }}
            >
              <span>S</span>
              <span>N</span>
            </div>
            <div
              className="faraday-needle"
              style={{ transform: `rotate(${needleAngle}deg)` }}
              aria-hidden="true"
            />
            <div
              className={`faraday-current ${result.current < 0 ? "reverse" : ""}`}
            >
              {result.lenzDirection === "none"
                ? "No induced current"
                : `${result.lenzDirection} current ${result.current > 0 ? "↺" : "↻"}`}
            </div>
            {showDimensions && (
              <div className="faraday-dimensions">
                A = 40.0 cm² · N = {input.turns} turns
              </div>
            )}
            <div className="faraday-ruler">
              <span>−24 cm</span>
              <span>coil centre</span>
              <span>+24 cm</span>
            </div>
          </div>

          <div className="faraday-phase" aria-live="polite">
            <strong>
              {result.phase === "rest" ? "At rest" : result.phase}
            </strong>
            <span>
              {result.phase === "centre"
                ? "Flux is momentarily maximum; dΦ/dt and emf cross zero."
                : result.lenzDirection === "none"
                  ? "Flux is not changing, so the circuit has no induced current."
                  : `Flux is ${result.fluxRate > 0 ? "increasing" : "decreasing"}; the coil creates a field to the ${result.opposingField} to oppose that change.`}
            </span>
          </div>

          <div className="faraday-readouts">
            <Readout
              label="Magnetic flux Φ"
              value={result.flux * 1000}
              unit="mWb"
              tone="blue"
            />
            <Readout
              label="dΦ/dt"
              value={result.fluxRate}
              unit="Wb/s"
              tone="green"
            />
            <Readout
              label="Induced emf ε"
              value={result.emf}
              unit="V"
              tone="red"
            />
            <Readout
              label="Current I"
              value={result.current}
              unit="A"
              tone="purple"
            />
            <div className="faraday-lenz">
              <span>Lenz's law</span>
              <strong>{result.lenzDirection}</strong>
              <small>opposes the flux change</small>
            </div>
          </div>
        </main>

        <aside className="faraday-graphs" aria-label="Live graphs">
          <h3>Live graphs</h3>
          <MiniGraph
            label="Magnetic flux Φ"
            points={pass.map((point) => point.flux)}
            progress={progress}
            color="#1683e2"
          />
          <MiniGraph
            label="Rate dΦ/dt"
            points={pass.map((point) => point.fluxRate)}
            progress={progress}
            color="#1c9c4f"
          />
          <MiniGraph
            label="Induced emf ε"
            points={pass.map((point) => point.emf)}
            progress={progress}
            color="#e33030"
          />
          <p className="faraday-equation">ε = −N dΦ/dt</p>
        </aside>
      </div>

      <div className="faraday-challenges">
        <section>
          <span>PREDICTION CHALLENGE</span>
          <h3>
            Just after the magnet crosses the centre, what is the sign of emf?
          </h3>
          <div className="faraday-predictions">
            {(["positive", "negative", "zero"] as const).map((choice) => (
              <button
                key={choice}
                className={prediction === choice ? "active" : ""}
                aria-pressed={prediction === choice}
                onClick={() => setPrediction(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              const expected =
                input.pole * input.direction > 0 ? "negative" : "positive";
              setPredictionFeedback(
                prediction === expected
                  ? `✓ Correct: withdrawal reverses the emf to ${expected}.`
                  : `Try again: after centre crossing, dΦ/dt reverses sign; ε = −N dΦ/dt.`,
              );
            }}
          >
            Check prediction
          </button>
          {predictionFeedback && <p aria-live="polite">{predictionFeedback}</p>}
        </section>
        <section className={missionComplete ? "complete" : ""}>
          <span>MINI-MISSION</span>
          <h3>Create equal and opposite emf peaks</h3>
          <p>
            Run the magnet all the way through the coil with constant speed.
          </p>
          <div className="faraday-peak-pair">
            <strong>+{peaks.positive.toFixed(2)} V</strong>
            <strong>−{peaks.negative.toFixed(2)} V</strong>
          </div>
          <button
            onClick={() =>
              setMissionFeedback(
                missionComplete
                  ? `✓ Symmetric peaks within ${(peakDifference * 100).toFixed(1)}%.`
                  : "Complete a full pass so both polarity peaks are recorded.",
              )
            }
          >
            Check peaks
          </button>
          {missionFeedback && <p aria-live="polite">{missionFeedback}</p>}
        </section>
        <section className="faraday-key">
          <span>KEY EQUATION</span>
          <strong>ε = −N ΔΦ / Δt</strong>
          <p>
            The minus sign encodes Lenz's law: induced current opposes the
            change.
          </p>
        </section>
      </div>

      <footer className="faraday-footer">
        <div>
          <button
            aria-label={
              runState === "result"
                ? "Replay induction from footer"
                : "Resume induction from footer"
            }
            onClick={begin}
            disabled={runState === "running"}
          >
            ▶ {runState === "result" ? "Replay" : "Resume"}
          </button>
          <button
            aria-label="Pause induction from footer"
            onClick={() => setRunState("paused")}
            disabled={runState !== "running"}
          >
            Ⅱ Pause
          </button>
          <button aria-label="Step induction from footer" onClick={step}>
            ▮▶ Step
          </button>
        </div>
        <label>
          Speed
          <select
            aria-label="Playback speed"
            value={playback}
            onChange={(event) => setPlayback(Number(event.target.value))}
          >
            {[0.25, 0.5, 1, 1.5, 2].map((value) => (
              <option key={value} value={value}>
                {value}×
              </option>
            ))}
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(event) => setReducedMotion(event.target.checked)}
          />
          Reduced motion
        </label>
        <span>
          {runState === "result"
            ? "Pass complete"
            : `${Math.round(progress * 100)}% through pass`}
        </span>
      </footer>
      <p className="sr-only" aria-live="polite">
        Magnet at {(input.position * 100).toFixed(1)} centimetres. Flux{" "}
        {(result.flux * 1000).toFixed(3)} mill webers. Flux rate{" "}
        {result.fluxRate.toFixed(3)} webers per second. Induced emf{" "}
        {result.emf.toFixed(3)} volts. Current {result.current.toFixed(3)}{" "}
        amperes. {result.lenzDirection} current.
      </p>
    </section>
  );
}

function Control({
  label,
  value,
  min,
  max,
  step,
  unit,
  digits = 2,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  digits?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="faraday-control">
      <span>
        <b>{label}</b>
        <strong>
          {value.toFixed(digits)} {unit}
        </strong>
      </span>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <small>
        {min} — {max} {unit}
      </small>
    </label>
  );
}

function Readout({
  label,
  value,
  unit,
  tone,
}: {
  label: string;
  value: number;
  unit: string;
  tone: string;
}) {
  return (
    <div className={`faraday-readout ${tone}`}>
      <span>{label}</span>
      <strong>
        {Math.abs(value) < 0.005 ? "" : value > 0 ? "+" : "−"}
        {Math.abs(value).toFixed(2)} <small>{unit}</small>
      </strong>
    </div>
  );
}

function MiniGraph({
  label,
  points,
  progress,
  color,
}: {
  label: string;
  points: number[];
  progress: number;
  color: string;
}) {
  const width = 240;
  const height = 108;
  const maximum = Math.max(...points.map(Math.abs), 1e-9);
  const polyline = points
    .map(
      (value, index) =>
        `${(index / (points.length - 1)) * width},${height / 2 - (value / maximum) * (height * 0.38)}`,
    )
    .join(" ");
  return (
    <figure className="faraday-graph">
      <figcaption>{label}</figcaption>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${label} versus time`}
      >
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          className="zero"
        />
        <line
          x1={progress * width}
          y1="0"
          x2={progress * width}
          y2={height}
          className="cursor"
        />
        <polyline
          points={polyline}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
        />
      </svg>
      <small>time →</small>
    </figure>
  );
}
