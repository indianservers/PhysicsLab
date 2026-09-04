import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  solveLongitudinalWave,
  soundMedia,
  type SoundMedium,
} from "./sound-wave-anatomySimulation";
import "./sound-wave-anatomy.css";

const D = {
  frequencyHz: 512,
  pressureAmplitudePa: 7.5,
  medium: "air" as SoundMedium,
  spacing: 1,
  probeM: 1.21,
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
    <label className="sound-range">
      <span>
        <b>{label}</b>
        <output>
        {value.toFixed(step <= 0.01 ? 2 : step < 1 ? 1 : 0)} {unit}
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
        <span>{min}</span>
        <span>{max}</span>
      </small>
    </label>
  );
}
export function SoundWaveAnatomyLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(D),
    [time, setTime] = useState(0),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(false),
    [tracked, setTracked] = useState(36),
    [answer, setAnswer] = useState<"" | "parallel" | "perpendicular">(""),
    [feedback, setFeedback] = useState(
      "Track the green particle, then compare its motion with the compression band.",
    );
  const result = useMemo(() => solveLongitudinalWave(input), [input]);
  const phase = time * 2 * Math.PI;
  useEffect(() => {
    if (!running || reduced) return;
    const id = window.setInterval(
      () => setTime((t) => (t + 0.025 * speed) % 1),
      40,
    );
    return () => window.clearInterval(id);
  }, [running, reduced, speed]);
  const change = (patch: Partial<typeof input>) => {
    setInput((v) => ({ ...v, ...patch }));
    setTime(0);
    setRunning(false);
    setFeedback(
      "Track the green particle, then compare its motion with the compression band.",
    );
  };
  const reset = () => {
    setInput(D);
    setTime(0);
    setRunning(false);
    setSpeed(1);
    setReduced(false);
    setTracked(36);
    setAnswer("");
    setFeedback(
      "Track the green particle, then compare its motion with the compression band.",
    );
  };
  const tubeX = (m: number) => 150 + (m / 2) * 590;
  const particleCount = Math.round(54 * input.spacing);
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const eqM = (i / (particleCount - 1)) * 2;
    const local = Math.sin((2 * Math.PI * eqM) / result.wavelengthM - phase);
    return {
      eqM,
      x: tubeX(eqM) + local * result.visualDisplacementPx,
      y: 145 + (i % 3) * 34,
      local,
    };
  });
  const trackedParticle =
    particles[clamp(tracked, 0, particles.length - 1)] ?? particles[0];
  const pressurePoints = Array.from({ length: 101 }, (_, i) => {
    const m = i / 50,
      p =
        input.pressureAmplitudePa *
        Math.cos((2 * Math.PI * m) / result.wavelengthM - phase);
    return `${44 + i * 6.9},${105 - (p / input.pressureAmplitudePa) * 55}`;
  }).join(" ");
  const pressureAtProbe =
    input.pressureAmplitudePa *
    Math.cos((2 * Math.PI * input.probeM) / result.wavelengthM - phase);
  const probeState =
    Math.abs(pressureAtProbe) < 0.5
      ? "near equilibrium"
      : pressureAtProbe > 0
        ? "compression"
        : "rarefaction";
  return (
    <section className="sound-lab">
      <header className="sound-hero">
        <div>
          <span>WAVES · CLASS 8–9</span>
          <h1>{experiment.title}</h1>
          <p>
            Watch a pressure pattern travel while each particle only oscillates
            about equilibrium.
          </p>
        </div>
        <div className={running ? "running" : ""}>
          ● {running ? "WAVE RUNNING" : time ? "PAUSED" : "READY"}
        </div>
      </header>
      <div className="sound-layout">
        <aside className="sound-card sound-controls">
          <span className="eyebrow">1 · CONTROLS</span>
          <Range
            label="Frequency"
            value={input.frequencyHz}
            min={100}
            max={1200}
          step={1}
            unit="Hz"
            onChange={(frequencyHz) => change({ frequencyHz })}
          />
          <Range
            label="Pressure amplitude"
            value={input.pressureAmplitudePa}
            min={1}
            max={20}
            step={0.5}
            unit="Pa"
            onChange={(pressureAmplitudePa) => change({ pressureAmplitudePa })}
          />
          <label className="sound-select">
            <b>Medium</b>
            <select
              aria-label="Medium"
              value={input.medium}
              onChange={(e) =>
                change({ medium: e.target.value as SoundMedium })
              }
            >
              {Object.entries(soundMedia).map(([id, m]) => (
                <option key={id} value={id}>
                  {m.label} · {m.speedMps} m/s
                </option>
              ))}
            </select>
          </label>
          <Range
            label="Particle spacing"
            value={input.spacing}
            min={0.6}
            max={1.6}
            step={0.1}
            unit="×"
            onChange={(spacing) => change({ spacing })}
          />
          <div className="sound-principle">
            <b>LONGITUDINAL</b>
            <p>
              Particle displacement is parallel to wave travel. The particles
              carry energy onward—not matter.
            </p>
          </div>
        </aside>
        <main className="sound-card sound-stage">
          <div className="sound-stage-head">
            <span>2 · PARTICLE TUBE</span>
            <b>
              Probe: {input.probeM.toFixed(2)} m · {probeState}
            </b>
          </div>
          <div className="tube">
            <img
              src="/assets/experiments/sound-wave-anatomy/sound-tube.png"
              alt="Loudspeaker, transparent tube and pressure probe"
            />
            <svg
              viewBox="0 0 800 330"
              role="img"
              aria-label="Longitudinal particles oscillating parallel to a traveling pressure wave"
            >
              {[0, 1, 2, 3].map((i) => (
                <rect
                  key={i}
                  x={150 + ((time * 590 + i * result.wavelengthPx) % 590)}
                  y="125"
                  width={Math.max(18, result.wavelengthPx * 0.18)}
                  height="105"
                  rx="16"
                  className="compression"
                />
              ))}
              <line
                x1={tubeX(input.probeM)}
                x2={tubeX(input.probeM)}
                y1="90"
                y2="250"
                className="probe"
              />
              {particles.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={i === clamp(tracked, 0, particles.length - 1) ? 7 : 3.2}
                  className={
                    i === clamp(tracked, 0, particles.length - 1)
                      ? "tracked"
                      : "particle"
                  }
                />
              ))}
              <line
                x1="150"
                x2={Math.min(740, 150 + result.wavelengthPx)}
                y1="78"
                y2="78"
                className="lambda"
              />
              <path
                d={`M150 72v12M${Math.min(740, 150 + result.wavelengthPx)} 72v12`}
                className="lambda"
              />
              <text
                x={150 + Math.min(590, result.wavelengthPx) / 2}
                y="65"
                className="lambda-label"
              >
                λ = {result.wavelengthM.toFixed(3)} m
              </text>
              <path d="M165 270h105l-15-9m15 9-15 9" className="travel" />
              <text x="165" y="297">
                wave travels →
              </text>
              <path
                d={`M${trackedParticle.x - 24} 260h48m-38-7-10 7 10 7m28-14 10 7-10 7`}
                className="oscillate"
              />
              <text x={clamp(trackedParticle.x - 55, 150, 650)} y="320">
                particle oscillates ↔
              </text>
            </svg>
          </div>
          <div className="sound-transport">
            <button
              aria-label={running ? "Pause wave" : "Play wave"}
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
              aria-label="Wave phase timeline"
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
          <Range
            label="Probe position"
            value={input.probeM}
            min={0}
            max={2}
            step={0.01}
            unit="m"
            onChange={(probeM) => setInput((v) => ({ ...v, probeM }))}
          />
        </main>
        <aside className="sound-card sound-readings">
          <span className="eyebrow">3 · MEASUREMENTS</span>
          <dl>
            <div>
              <dt>Frequency, f</dt>
              <dd>{input.frequencyHz} Hz</dd>
            </div>
            <div>
              <dt>Wavelength, λ</dt>
              <dd>{result.wavelengthM.toFixed(3)} m</dd>
            </div>
            <div>
              <dt>Wave speed, v</dt>
              <dd>{result.speedMps} m/s</dd>
            </div>
            <div>
              <dt>Pressure amplitude</dt>
              <dd>{input.pressureAmplitudePa.toFixed(1)} Pa</dd>
            </div>
            <div>
              <dt>Particle amplitude</dt>
              <dd>{(result.displacementAmplitudeM * 1e6).toFixed(2)} µm</dd>
            </div>
            <div>
              <dt>Probe pressure</dt>
              <dd>
                {pressureAtProbe >= 0 ? "+" : ""}
                {pressureAtProbe.toFixed(2)} Pa
              </dd>
            </div>
          </dl>
          <div className="sound-check">
            <b>Consistency check</b>
            <code>
              fλ = {(input.frequencyHz * result.wavelengthM).toFixed(1)} m/s
            </code>
            <span>
              Matches {soundMedia[input.medium].label.toLowerCase()} speed ✓
            </span>
          </div>
          <label className="track">
            <b>Tracked particle</b>
            <input
              aria-label="Tracked particle"
              type="range"
              min="0"
              max={particles.length - 1}
              value={clamp(tracked, 0, particles.length - 1)}
              onChange={(e) => setTracked(+e.target.value)}
            />
            <span>
              Instant displacement:{" "}
              {(
                trackedParticle.local *
                result.displacementAmplitudeM *
                1e6
              ).toFixed(2)}{" "}
              µm
            </span>
          </label>
        </aside>
      </div>
      <section className="sound-bottom">
        <div className="pressure-card">
          <span>4 · PRESSURE GRAPH</span>
          <svg
            viewBox="0 0 760 180"
            role="img"
            aria-label="Pressure variation against position"
          >
            <line x1="44" x2="734" y1="105" y2="105" />
            <polyline points={pressurePoints} />
            <line
              x1={44 + input.probeM * 345}
              x2={44 + input.probeM * 345}
              y1="35"
              y2="164"
              className="graph-probe"
            />
            <text x="45" y="176">
              0 m
            </text>
            <text x="700" y="176">
              2 m
            </text>
            <text x="48" y="28">
              ΔP (Pa)
            </text>
          </svg>
        </div>
        <div className="sound-mission">
          <span>MISSION · FOLLOW ONE PARTICLE</span>
          <h2>How does its motion compare with wave travel?</h2>
          <div>
            <button
              className={answer === "parallel" ? "selected" : ""}
              onClick={() => setAnswer("parallel")}
            >
              Parallel
            </button>
            <button
              className={answer === "perpendicular" ? "selected" : ""}
              onClick={() => setAnswer("perpendicular")}
            >
              Perpendicular
            </button>
            <button
              onClick={() =>
                setFeedback(
                  answer === "parallel"
                    ? "Mission complete — the marked particle oscillates parallel to propagation but stays near its equilibrium position."
                    : answer
                      ? "Try again: watch the green particle move left–right along the direction arrow."
                      : "Choose a direction first.",
                )
              }
            >
              Check
            </button>
          </div>
          <p
            className={feedback.startsWith("Mission") ? "success" : ""}
            aria-live="polite"
          >
            {feedback}
          </p>
          <footer>
            <b>v = fλ</b>
            <span>
              Pressure amplitude changes loudness; frequency changes pitch.
            </span>
          </footer>
        </div>
      </section>
    </section>
  );
}
