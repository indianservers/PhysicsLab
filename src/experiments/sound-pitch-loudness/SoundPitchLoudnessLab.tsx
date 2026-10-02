import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { solveSoundPitch, type SoundWaveform } from "./soundPitchSimulation";
import "./sound-pitch-loudness.css";

const defaults = {
  frequencyHz: 440,
  peakPressurePa: 0.2,
  waveform: "sine" as SoundWaveform,
};
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

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
  return (
    <label className="spl-range">
      <span>
        <b>{label}</b>
        <output>
          {value.toFixed(step < 0.1 ? 2 : 0)} {unit}
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
          {min} {unit}
        </span>
        <span>
          {max} {unit}
        </span>
      </small>
    </label>
  );
}

function waveValue(waveform: SoundWaveform, angle: number) {
  const cycle = (((angle / (Math.PI * 2)) % 1) + 1) % 1;
  if (waveform === "square") return cycle < 0.5 ? 1 : -1;
  if (waveform === "sawtooth") return 1 - 2 * cycle;
  if (waveform === "triangle") return 1 - 4 * Math.abs(cycle - 0.5);
  return Math.sin(angle);
}

export function SoundPitchLoudnessLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(defaults);
  const [phase, setPhase] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reduced, setReduced] = useState(false);
  const [hearing, setHearing] = useState(false);
  const [prediction, setPrediction] = useState<
    "frequency" | "amplitude" | null
  >(null);
  const [predictionFeedback, setPredictionFeedback] = useState("");
  const [missionFeedback, setMissionFeedback] = useState("");
  const result = useMemo(() => solveSoundPitch(input), [input]);
  const target = { frequencyHz: 523, peakPressurePa: 0.25 };
  const missionSuccess =
    Math.abs(input.frequencyHz - target.frequencyHz) <= 3 &&
    Math.abs(input.peakPressurePa - target.peakPressurePa) <= 0.015;

  useEffect(() => {
    if (!running || reduced) return;
    const timer = window.setInterval(
      () => setPhase((value) => (value + 0.018 * speed) % 1),
      40,
    );
    return () => window.clearInterval(timer);
  }, [running, reduced, speed]);

  useEffect(() => {
    if (!hearing || !running) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = input.waveform;
    oscillator.frequency.value = input.frequencyHz;
    gain.gain.value = clamp((input.peakPressurePa / 1.4) * 0.035, 0.002, 0.035);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    return () => {
      oscillator.stop();
      void context.close();
    };
  }, [
    hearing,
    input.frequencyHz,
    input.peakPressurePa,
    input.waveform,
    running,
  ]);

  const change = (patch: Partial<typeof input>) => {
    setInput((current) => ({ ...current, ...patch }));
    setRunning(false);
    setPhase(0);
    setMissionFeedback("");
  };
  const reset = () => {
    setInput(defaults);
    setPhase(0);
    setRunning(false);
    setSpeed(1);
    setReduced(false);
    setHearing(false);
    setPrediction(null);
    setPredictionFeedback("");
    setMissionFeedback("");
  };
  const cycles = input.frequencyHz / 180;
  const amplitudePx = 18 + (input.peakPressurePa / 1.4) * 58;
  const waveformPoints = Array.from({ length: 121 }, (_, index) => {
    const x = 180 + (index / 120) * 540;
    const angle = (index / 120) * cycles * Math.PI * 2 - phase * Math.PI * 2;
    return `${x},${181 - waveValue(input.waveform, angle) * amplitudePx}`;
  }).join(" ");
  const tracePoints = Array.from({ length: 121 }, (_, index) => {
    const x = 30 + (index / 120) * 510;
    const angle = (index / 120) * cycles * Math.PI * 2;
    return `${x},${112 - waveValue(input.waveform, angle) * (24 + input.peakPressurePa * 42)}`;
  }).join(" ");
  const speakerPulse =
    Math.sin(phase * Math.PI * 2) * (4 + input.peakPressurePa * 5);
  const harmonics =
    input.waveform === "sine"
      ? [1, 0, 0, 0, 0]
      : input.waveform === "triangle"
        ? [1, 0, 0.11, 0, 0.04]
        : input.waveform === "square"
          ? [1, 0, 0.33, 0, 0.2]
          : [1, 0.5, 0.33, 0.25, 0.2];

  return (
    <section className="spl-lab">
      <header className="spl-hero">
        <div>
          <span>WAVES · CLASS 8–9</span>
          <h1>{experiment.title}</h1>
          <p>Frequency changes pitch. Pressure amplitude changes loudness.</p>
        </div>
        <button
          className={hearing ? "on" : ""}
          aria-pressed={hearing}
          onClick={() => setHearing((value) => !value)}
        >
          ◖)) Hearing {hearing ? "on" : "off"}
        </button>
      </header>
      <div className="spl-layout">
        <aside className="spl-card spl-controls">
          <span className="spl-eyebrow">1 · SOUND SOURCE</span>
          <Range
            label="Frequency"
            value={input.frequencyHz}
            min={110}
            max={880}
            step={1}
            unit="Hz"
            onChange={(frequencyHz) => change({ frequencyHz })}
          />
          <Range
            label="Peak pressure amplitude"
            value={input.peakPressurePa}
            min={0.02}
            max={1.4}
            step={0.01}
            unit="Pa"
            onChange={(peakPressurePa) => change({ peakPressurePa })}
          />
          <span className="spl-eyebrow spl-divide">WAVEFORM / TIMBRE</span>
          <div className="wave-types" role="group" aria-label="Waveform">
            {(
              ["sine", "triangle", "square", "sawtooth"] as SoundWaveform[]
            ).map((waveform) => (
              <button
                key={waveform}
                className={input.waveform === waveform ? "active" : ""}
                onClick={() => change({ waveform })}
              >
                {waveform}
              </button>
            ))}
          </div>
          <div
            className="spl-presets"
            role="group"
            aria-label="Sound setting presets"
          >
            <button
              onClick={() => change({ frequencyHz: 110, peakPressurePa: 0.02 })}
            >
              Minimums
            </button>
            <button onClick={() => change(defaults)}>Reference</button>
            <button
              onClick={() => change({ frequencyHz: 880, peakPressurePa: 1.4 })}
            >
              Maximums
            </button>
          </div>
          <span className="spl-eyebrow spl-divide">CHANGE ONE PROPERTY</span>
          <button
            className="compare"
            onClick={() =>
              change({ frequencyHz: input.frequencyHz === 440 ? 660 : 440 })
            }
          >
            Pitch only · hold amplitude
          </button>
          <button
            className="compare"
            onClick={() =>
              change({
                peakPressurePa: input.peakPressurePa === 0.2 ? 0.4 : 0.2,
              })
            }
          >
            Loudness only · hold frequency
          </button>
        </aside>

        <main className="spl-card spl-stage">
          <div className="spl-stage-head">
            <span>2 · SOUND BENCH</span>
            <b>
              {result.pitchBand} ·{" "}
              {result.safe ? "safe modeled level" : "high modeled level"}
            </b>
          </div>
          <div className="sound-bench">
            <img
              src="/assets/experiments/sound-pitch-loudness/sound-bench.png"
              alt="Studio speaker facing a measurement microphone"
            />
            <svg
              viewBox="0 0 900 390"
              role="img"
              aria-label={`${input.frequencyHz} hertz ${input.waveform} wave at ${input.peakPressurePa} pascal peak pressure`}
            >
              <defs>
                <filter id="sound-glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle
                className="cone"
                cx="174"
                cy="186"
                r={37 + speakerPulse}
              />
              <polyline className="sound-wave" points={waveformPoints} />
              {Array.from({ length: 22 }, (_, index) => {
                const x = 215 + index * 23;
                const angle =
                  (index / 22) * cycles * Math.PI * 2 - phase * Math.PI * 2;
                const pressure = waveValue(input.waveform, angle);
                return (
                  <circle
                    key={index}
                    className="air-particle"
                    cx={x + pressure * input.peakPressurePa * 7}
                    cy={250 + (index % 3) * 10}
                    r={3 + Math.abs(pressure) * 2}
                    style={{ opacity: 0.3 + Math.abs(pressure) * 0.6 }}
                  />
                );
              })}
              <line
                className="period-line"
                x1="300"
                x2={300 + clamp(260 / cycles, 42, 180)}
                y1="86"
                y2="86"
              />
              <text x={300 + clamp(260 / cycles, 42, 180) / 2} y="74">
                T = {(result.periodSeconds * 1000).toFixed(2)} ms
              </text>
              <text x="174" y="94">
                vibrating source
              </text>
              <text x="715" y="94">
                microphone
              </text>
            </svg>
          </div>
          <div className="spl-transport">
            <button
              aria-label={
                running ? "Pause sound animation" : "Play sound animation"
              }
              onClick={() => setRunning((value) => !value)}
            >
              {running ? "❚❚ Pause" : "▶ Play"}
            </button>
            <button
              onClick={() => {
                setRunning(false);
                setPhase((value) => (value + 0.08) % 1);
              }}
            >
              ▶│ Step
            </button>
            <input
              aria-label="Sound phase timeline"
              type="range"
              min="0"
              max="1"
              step=".005"
              value={phase}
              onChange={(event) => {
                setRunning(false);
                setPhase(+event.target.value);
              }}
            />
            <select
              aria-label="Sound playback speed"
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
                  if (event.target.checked) setRunning(false);
                }}
              />{" "}
              Reduced motion
            </label>
            <button onClick={reset}>↻ Reset</button>
          </div>
        </main>

        <aside className="spl-card spl-readings">
          <span className="spl-eyebrow">3 · LIVE READOUTS</span>
          <div className="readout-grid">
            <div>
              <span>Frequency f</span>
              <b>{input.frequencyHz.toFixed(0)} Hz</b>
            </div>
            <div>
              <span>Period T</span>
              <b>{(result.periodSeconds * 1000).toFixed(2)} ms</b>
            </div>
            <div>
              <span>Peak pressure</span>
              <b>{input.peakPressurePa.toFixed(2)} Pa</b>
            </div>
            <div>
              <span>RMS pressure</span>
              <b>{result.rmsPressurePa.toFixed(3)} Pa</b>
            </div>
            <div>
              <span>Relative intensity</span>
              <b>{result.relativeIntensity.toFixed(2)}×</b>
            </div>
            <div>
              <span>Modeled SPL</span>
              <b>
                {Number.isFinite(result.soundPressureLevelDb)
                  ? result.soundPressureLevelDb.toFixed(1)
                  : "−∞"}{" "}
                dB
              </b>
            </div>
          </div>
          <div className={`safety ${result.safe ? "safe" : "high"}`}>
            <b>
              {result.safe
                ? "✓ Below 85 dB model limit"
                : "! Above 85 dB model limit"}
            </b>
            <span>
              Optional audio gain is capped independently; this pressure model
              is educational, not a calibrated device.
            </span>
          </div>
          <div className="predict">
            <span className="spl-eyebrow">PREDICT FIRST</span>
            <p>Which control changes pitch?</p>
            <div>
              <button
                className={prediction === "frequency" ? "active" : ""}
                onClick={() => setPrediction("frequency")}
              >
                Frequency
              </button>
              <button
                className={prediction === "amplitude" ? "active" : ""}
                onClick={() => setPrediction("amplitude")}
              >
                Amplitude
              </button>
            </div>
            <button
              onClick={() =>
                setPredictionFeedback(
                  prediction === "frequency"
                    ? "Correct — pitch tracks frequency; amplitude controls level."
                    : "Try again: count cycles per second, not wave height.",
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

      <section className="spl-bottom">
        <div className="spl-card spl-graph">
          <span className="spl-eyebrow">4 · OSCILLOSCOPE</span>
          <svg
            viewBox="0 0 570 150"
            role="img"
            aria-label="Pressure waveform over time"
          >
            <line x1="30" x2="540" y1="112" y2="112" />
            <line x1="30" x2="30" y1="18" y2="135" />
            <polyline points={tracePoints} />
            <text x="285" y="145">
              time
            </text>
            <text x="18" y="15">
              p
            </text>
          </svg>
        </div>
        <div className="spl-card spectrum-card">
          <span className="spl-eyebrow">5 · HARMONIC CONTENT</span>
          <div className="bars">
            {harmonics.map((height, index) => (
              <i key={index} style={{ height: `${12 + height * 105}px` }}>
                <span>{index + 1}f</span>
              </i>
            ))}
          </div>
          <p>
            Waveform changes timbre while the fundamental frequency stays fixed.
          </p>
        </div>
        <div className="spl-card spl-mission">
          <span className="spl-eyebrow">6 · MATCH THE REFERENCE</span>
          <h2>523 Hz · 0.25 Pa</h2>
          <p>Match both pitch and loudness visually.</p>
          <div className="match-grid">
            <span>
              Pitch error{" "}
              <b>
                {Math.abs(input.frequencyHz - target.frequencyHz).toFixed(0)} Hz
              </b>
            </span>
            <span>
              Amplitude error{" "}
              <b>
                {Math.abs(input.peakPressurePa - target.peakPressurePa).toFixed(
                  2,
                )}{" "}
                Pa
              </b>
            </span>
          </div>
          <div>
            <button onClick={() => change(target)}>Set reference</button>
            <button
              onClick={() =>
                setMissionFeedback(
                  missionSuccess
                    ? "Excellent — pitch and loudness both match."
                    : "Keep both errors inside their green target ranges.",
                )
              }
            >
              Evaluate match
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
        {input.frequencyHz} hertz, period{" "}
        {(result.periodSeconds * 1000).toFixed(2)} milliseconds, relative
        intensity {result.relativeIntensity.toFixed(2)}.
      </p>
    </section>
  );
}
