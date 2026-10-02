import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  inferSoundSpeed,
  solveEcho,
  type PulseShape,
} from "./echoSpeedSoundSimulation";
import "./echo-speed-sound.css";
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
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
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    let n;
    if (e.key === "Home") n = min;
    if (e.key === "End") n = max;
    if (["ArrowLeft", "ArrowDown"].includes(e.key)) n = value - step;
    if (["ArrowRight", "ArrowUp"].includes(e.key)) n = value + step;
    if (n === undefined) return;
    e.preventDefault();
    onChange(clamp(n, min, max));
  };
  return (
    <label className="echo-range">
      <span>
        <b>{label}</b>
        <output>
          {value.toFixed(step < 1 ? 1 : 0)} {unit}
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
        onKeyDown={key}
      />
    </label>
  );
}
function Trace({
  delayMs,
  startMs,
  endMs,
  maxMs,
  frequencyHz,
  amplitudePercent,
  pulseShape,
}: {
  delayMs: number;
  startMs: number;
  endMs: number;
  maxMs: number;
  frequencyHz: number;
  amplitudePercent: number;
  pulseShape: PulseShape;
}) {
  const envelopeWidth = pulseShape === "click" ? 4 : pulseShape === "tone-burst" ? 9 : 6;
  const cycles = 0.8 + frequencyHz / 2500;
  const level = amplitudePercent / 80;
  const packet = (center: number, scale: number) =>
    Array.from({ length: 41 }, (_, i) => {
      const t = center + ((i - 20) * maxMs) / 260,
        y =
          75 -
          Math.exp(-(((i - 20) / envelopeWidth) ** 2)) *
            Math.sin((i - 20) * cycles) *
            43 *
            scale * level;
      return `${i ? "L" : "M"}${45 + (t / maxMs) * 430},${y}`;
    }).join(" ");
  const x = (t: number) => 45 + (t / maxMs) * 430;
  return (
    <svg
      className="echo-trace"
      viewBox="0 0 510 130"
      role="img"
      aria-label="Oscilloscope trace showing trigger and reflected echo"
    >
      <line x1="45" y1="75" x2="475" y2="75" />
      <line x1="45" y1="18" x2="45" y2="112" />
      <path d={packet(0, 0.8)} />
      <path d={packet(delayMs, 0.64)} />
      <line
        className="marker direct"
        x1={x(startMs)}
        x2={x(startMs)}
        y1="18"
        y2="112"
      />
      <line
        className="marker echo"
        x1={x(endMs)}
        x2={x(endMs)}
        y1="18"
        y2="112"
      />
      <text x={Math.max(47, x(startMs) + 3)} y="16">
        A {startMs.toFixed(1)} ms
      </text>
      <text x={Math.min(420, x(endMs) + 3)} y="30">
        B {endMs.toFixed(1)} ms
      </text>
      <text x="45" y="126">
        0
      </text>
      <text x="443" y="126">
        {maxMs.toFixed(0)} ms
      </text>
    </svg>
  );
}
export function EchoSpeedSoundLab({ experiment }: DedicatedExperimentLabProps) {
  const defaults = {
    distanceM: 30,
    temperatureC: 22,
    frequencyHz: 2000,
    amplitudePercent: 80,
    pulseShape: "short" as PulseShape,
  };
  const [input, setInput] = useState(defaults),
    [time, setTime] = useState(0),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(false),
    [showPath, setShowPath] = useState(true),
    [markerA, setMarkerA] = useState(0),
    [markerB, setMarkerB] = useState(0),
    [prediction, setPrediction] = useState("343"),
    [predictionFeedback, setPredictionFeedback] = useState(""),
    [answer, setAnswer] = useState(""),
    [missionFeedback, setMissionFeedback] = useState("");
  const result = useMemo(() => solveEcho(input), [input]),
    duration = 8,
    progress = clamp(time / duration, 0, 1),
    physicalMs = result.echoDelayMs * progress,
    maxMs = Math.max(120, result.echoDelayMs * 1.22),
    measuredDelayMs = Math.max(0.1, markerB - markerA),
    measuredSpeed = inferSoundSpeed(input.distanceM, measuredDelayMs / 1000),
    pulseX = progress <= 0.5 ? 7 + progress * 170 : 92 - (progress - 0.5) * 170;
  useEffect(() => {
    setMarkerA(0);
    setMarkerB(+result.echoDelayMs.toFixed(1));
  }, [result.echoDelayMs]);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(
      () =>
        setTime((t) => {
          const next = t + 0.04 * speed;
          if (next >= duration) {
            setRunning(false);
            return duration;
          }
          return next;
        }),
      40,
    );
    return () => clearInterval(id);
  }, [running, speed]);
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
    setShowPath(true);
    setPrediction("343");
    setPredictionFeedback("");
    setAnswer("");
    setMissionFeedback("");
  };
  const checkMission = () => {
    const n = +answer;
    if (!Number.isFinite(n) || n <= 0) {
      setMissionFeedback("Enter a positive speed first.");
      return;
    }
    const error = Math.abs(n - result.soundSpeedMps);
    setMissionFeedback(
      error <= 2
        ? `Mission complete — ${n.toFixed(1)} m/s agrees within ${error.toFixed(1)} m/s.`
        : `Use the round trip: v = 2 × ${input.distanceM.toFixed(1)} ÷ ${(measuredDelayMs / 1000).toFixed(4)}. Do not use d/Δt.`,
    );
  };
  return (
    <section className="echo-lab">
      <header className="echo-hero">
        <div>
          <span>WAVES · CLASS 9</span>
          <h1>{experiment.title}</h1>
          <p>
            Measure a reflected pulse and uncover why echo distance is doubled.
          </p>
        </div>
        <div className={running ? "running" : time >= duration ? "done" : ""}>
          {running
            ? "PULSE IN FLIGHT"
            : time >= duration
              ? "ECHO RECEIVED"
              : "READY"}
        </div>
      </header>
      <div className="echo-layout">
        <aside className="echo-card echo-controls">
          <div className="eyebrow">EXPERIMENT CONTROLS</div>
          <label className="select-label">
            Source pulse
            <select
              aria-label="Source pulse"
              value={input.pulseShape}
              onChange={(e) =>
                change({ pulseShape: e.target.value as PulseShape })
              }
            >
              <option value="short">Short pulse</option>
              <option value="click">Sharp click</option>
              <option value="tone-burst">Tone burst</option>
            </select>
          </label>
          <Range
            label="Pulse frequency"
            value={input.frequencyHz}
            min={500}
            max={5000}
            step={100}
            unit="Hz"
            onChange={(frequencyHz) => change({ frequencyHz })}
          />
          <Range
            label="Pulse amplitude"
            value={input.amplitudePercent}
            min={20}
            max={100}
            step={5}
            unit="%"
            onChange={(amplitudePercent) => change({ amplitudePercent })}
          />
          <div className="eyebrow divide">ENVIRONMENT</div>
          <Range
            label="Air temperature"
            value={input.temperatureC}
            min={-10}
            max={40}
            step={1}
            unit="°C"
            onChange={(temperatureC) => change({ temperatureC })}
          />
          <Range
            label="Wall distance"
            value={input.distanceM}
            min={5}
            max={80}
            step={1}
            unit="m"
            onChange={(distanceM) => change({ distanceM })}
          />
          <label className="toggle">
            <input
              type="checkbox"
              checked={showPath}
              onChange={(e) => setShowPath(e.target.checked)}
            />{" "}
            Show path and wavefronts
          </label>
          <div className="prediction">
            <b>Predict speed under these conditions</b>
            <div>
              <input
                aria-label="Predicted speed"
                type="number"
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
              />
              <span>m/s</span>
            </div>
            <button
              onClick={() =>
                setPredictionFeedback(
                  Math.abs(+prediction - result.soundSpeedMps) <= 5
                    ? "Good prediction — now measure the echo."
                    : "Keep it near 331 m/s at 0 °C; warmer air is faster.",
                )
              }
            >
              Save prediction
            </button>
            {predictionFeedback && <p>{predictionFeedback}</p>}
          </div>
        </aside>
        <main className="echo-card echo-stage">
          <div
            className={`echo-notice ${result.distinctEcho ? "clear" : "merged"}`}
          >
            <b>
              {result.distinctEcho
                ? "✓ Distinct echo expected"
                : "! Echo overlaps direct sound"}
            </b>
            <span>
              {result.distinctEcho
                ? `Above the ${result.minimumDistinctDistanceM.toFixed(1)} m minimum at this temperature.`
                : `Move the wall beyond ${result.minimumDistinctDistanceM.toFixed(1)} m for a distinct echo.`}
            </span>
          </div>
          <div
            className="echo-scene"
            aria-label="Two dimensional pulse traveling to a wall and back"
          >
            <img
              src="/assets/experiments/echo-speed-sound/echo-apparatus.png"
              alt="Speaker microphones reflecting wall and measuring tape"
            />
            {showPath && (
              <>
                <div className="distance-line">
                  <span>0 m</span>
                  <b>{input.distanceM.toFixed(1)} m one way</b>
                  <span>wall</span>
                </div>
                <div
                  className={`pulse ${input.pulseShape} ${progress > 0.5 ? "return" : "out"} ${reduced ? "reduced" : ""}`}
                  style={{
                    left: `${pulseX}%`,
                    opacity: time > 0 && time < duration ? 0.35 + input.amplitudePercent / 155 : 0,
                    transform: `scale(${0.78 + input.amplitudePercent / 360})`,
                  }}
                >
                  <i />
                  <i />
                  <i />
                </div>
              </>
            )}
            <div className="scene-readout">
              <b>
                {progress < 0.5
                  ? "OUTBOUND"
                  : progress < 1
                    ? "REFLECTED"
                    : "RETURNED"}
              </b>
              <span>physical clock {physicalMs.toFixed(1)} ms</span>
            </div>
          </div>
          <div className="transport">
            <button
              aria-label={running ? "Pause pulse" : "Play pulse"}
              onClick={() => {
                if (time >= duration) setTime(0);
                setRunning((v) => !v);
              }}
            >
              {running ? "❚❚ Pause" : "▶ Play"}
            </button>
            <button
              aria-label="Step pulse"
              onClick={() => {
                setRunning(false);
                setTime((t) => clamp(t + 0.4, 0, duration));
              }}
            >
              ▶│ Step
            </button>
            <input
              aria-label="Pulse journey timeline"
              type="range"
              min="0"
              max={duration}
              step=".05"
              value={time}
              onChange={(e) => {
                setRunning(false);
                setTime(+e.target.value);
              }}
            />
            <span>{time.toFixed(1)} / 8 s visual</span>
            <select
              aria-label="Playback speed"
              value={speed}
              onChange={(e) => setSpeed(+e.target.value)}
            >
              {[0.25, 0.5, 1, 1.5, 2].map((v) => (
                <option key={v} value={v}>
                  {v}×
                </option>
              ))}
            </select>
            <label>
              <input
                type="checkbox"
                checked={reduced}
                onChange={(e) => setReduced(e.target.checked)}
              />{" "}
              Reduced
            </label>
            <button onClick={reset}>↻ Reset</button>
          </div>
          <div className="scale-note">
            Animation is slowed for observation; the physical clock and trace
            use the calculated sound speed.
          </div>
        </main>
        <aside className="echo-card echo-readings">
          <div className="trace-title">
            <span>OSCILLOSCOPE · MIC 1</span>
            <b>● LIVE</b>
          </div>
          <Trace
            delayMs={result.echoDelayMs}
            startMs={markerA}
            endMs={markerB}
            maxMs={maxMs}
            frequencyHz={input.frequencyHz}
            amplitudePercent={input.amplitudePercent}
            pulseShape={input.pulseShape}
          />
          <Range
            label="Marker A"
            value={markerA}
            min={0}
            max={maxMs * 0.35}
            step={0.1}
            unit="ms"
            onChange={setMarkerA}
          />
          <Range
            label="Marker B"
            value={markerB}
            min={maxMs * 0.35}
            max={maxMs}
            step={0.1}
            unit="ms"
            onChange={setMarkerB}
          />
          <div className="delay">
            <span>Measured Δt</span>
            <b>{measuredDelayMs.toFixed(1)} ms</b>
            <small>
              {result.distinctEcho ? "Distinct echo" : "Overlapping pulse"}
            </small>
          </div>
          <table>
            <caption>TIME OF FLIGHT</caption>
            <thead>
              <tr>
                <th>Path</th>
                <th>Distance</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Outbound</td>
                <td>{input.distanceM.toFixed(1)} m</td>
                <td>{(result.echoDelayMs / 2).toFixed(1)} ms</td>
              </tr>
              <tr>
                <td>Return</td>
                <td>{input.distanceM.toFixed(1)} m</td>
                <td>{(result.echoDelayMs / 2).toFixed(1)} ms</td>
              </tr>
              <tr>
                <td>Round trip</td>
                <td>{result.roundTripDistanceM.toFixed(1)} m</td>
                <td>{result.echoDelayMs.toFixed(1)} ms</td>
              </tr>
            </tbody>
          </table>
          <div className="speed-card">
            <span>SPEED OF SOUND</span>
            <div>
              <code>v = 2d / Δt</code>
              <b>{measuredSpeed.toFixed(1)} m/s</b>
            </div>
          </div>
        </aside>
      </div>
      <section className="echo-bottom">
        <div>
          <span>GOVERNING EQUATION</span>
          <b>v = 2d / Δt</b>
          <p>
            The pulse travels distance d to the wall and another d back.
            Temperature model: v = 331.3√(T/273.15).
          </p>
        </div>
        <div className="mission">
          <span>CHALLENGE · MEASURE THE ECHO</span>
          <h2>Calculate sound speed from your markers</h2>
          <p>
            d = {input.distanceM.toFixed(1)} m · measured Δt ={" "}
            {measuredDelayMs.toFixed(1)} ms
          </p>
          <div>
            <input
              aria-label="Calculated sound speed"
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={measuredSpeed.toFixed(1)}
            />
            <span>m/s</span>
            <button onClick={checkMission}>Check answer</button>
          </div>
          {missionFeedback && (
            <p className={missionFeedback.startsWith("Mission") ? "ok" : "try"}>
              {missionFeedback}
            </p>
          )}
        </div>
      </section>
    </section>
  );
}
