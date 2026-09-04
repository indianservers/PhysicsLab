import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  modeFrequencyHz,
  simulateChladniPlate,
  type BoundaryCondition,
  type PlateShape,
} from "./chladni-plateSimulation";
import "./chladni-plate.css";
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
    <label className="chl-range">
      <span>
        <b>{label}</b>
        <output>
          {value.toFixed(step < 0.1 ? 2 : step < 1 ? 1 : 0)} {unit}
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
function Plate({
  sim,
  shape,
  progress,
  time,
  running,
  overlay,
  reduced,
}: {
  sim: ReturnType<typeof simulateChladniPlate>;
  shape: PlateShape;
  progress: number;
  time: number;
  running: boolean;
  overlay: boolean;
  reduced: boolean;
}) {
  const settle = Math.min(1, progress * sim.coherence * 1.6);
  return (
    <div className={`chl-plate-scene ${shape}`}>
      <img
        src="/assets/experiments/chladni-plate/chladni-plate-apparatus.png"
        alt="Transparent Chladni vibration plate apparatus"
      />
      <svg
        viewBox="0 0 400 400"
        role="img"
        aria-label="Live modal plate and sand grains"
      >
        <defs>
          <clipPath id="plateClip">
            <circle cx="200" cy="200" r="154" />
          </clipPath>
          <clipPath id="squareClip">
            <rect x="53" y="53" width="294" height="294" rx="5" />
          </clipPath>
        </defs>
        <g
          clipPath={
            shape === "circular" ? "url(#plateClip)" : "url(#squareClip)"
          }
        >
          {sim.heatCells.map((row, y) =>
            row.map((v, x) => (
              <rect
                key={`${x}-${y}`}
                x={53 + x * 21}
                y={53 + y * 21}
                width="22"
                height="22"
                fill={`hsl(${210 - v * 170} 76% 52% / ${overlay ? 0.12 + v * 0.35 : 0.03})`}
              />
            )),
          )}
          {sim.sandParticles.map((p, i) => {
            const x = p.x + (p.nodeX - p.x) * settle,
              y = p.y + (p.nodeY - p.y) * settle,
              j = running && !reduced ? (1 - settle) * Math.sin(time * 18 + i) * 1.8 : 0;
            return (
              <circle
                key={i}
                cx={200 + x * 145 + j}
                cy={200 + y * 145 - j}
                r={1.5 + (i % 3) * 0.35}
                fill="#f5eee0"
                stroke="#5b4931"
                strokeWidth=".45"
              />
            );
          })}
        </g>
        <path
          d={
            shape === "circular"
              ? "M200 44a156 156 0 1 0 0 312a156 156 0 1 0 0-312"
              : "M53 53H347V347H53Z"
          }
          fill="none"
          stroke="#eef8ef"
          strokeWidth="3"
        />
        <circle cx="200" cy="200" r="5" fill="#152027" />
      </svg>
      <div className="chl-state">
        <b>{sim.coherence > 0.72 ? "RESONANCE" : "SEARCHING"}</b>
        <span>sand settled {Math.round(settle * 100)}%</span>
      </div>
    </div>
  );
}
export function ChladniPlateLab({ experiment }: DedicatedExperimentLabProps) {
  const [shape, setShape] = useState<PlateShape>("circular"),
    [boundary, setBoundary] = useState<BoundaryCondition>("clamped"),
    [n, setN] = useState(2),
    [m, setM] = useState(3),
    [frequency, setFrequency] = useState(560),
    [amplitude, setAmplitude] = useState(0.45),
    [damping, setDamping] = useState(0.28),
    [time, setTime] = useState(0),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(false),
    [overlay, setOverlay] = useState(true),
    [prediction, setPrediction] = useState(""),
    [feedback, setFeedback] = useState(""),
    [found, setFound] = useState<string[]>([]);
  const input = {
      modeN: n,
      modeM: m,
      frequency,
      amplitude,
      damping,
      shape,
      boundary,
    },
    sim = useMemo(
      () => simulateChladniPlate(input),
      [n, m, frequency, amplitude, damping, shape, boundary],
    ),
    progress = clamp(time / 8, 0, 1);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(
      () =>
        setTime((t) => {
          const next = t + 0.04 * speed;
          if (next >= 8) {
            setRunning(false);
            return 8;
          }
          return next;
        }),
      40,
    );
    return () => clearInterval(id);
  }, [running, speed]);
  const change = (fn: () => void) => {
    fn();
    setTime(0);
    setRunning(false);
  };
  const snap = () => {
    setFrequency(+sim.eigenfrequencyHz.toFixed(1));
    setTime(0);
  };
  const reset = () => {
    setShape("circular");
    setBoundary("clamped");
    setN(2);
    setM(3);
    setFrequency(560);
    setAmplitude(0.45);
    setDamping(0.28);
    setTime(0);
    setRunning(false);
    setSpeed(1);
    setReduced(false);
    setOverlay(true);
    setPrediction("");
    setFeedback("");
    setFound([]);
  };
  const peaks = Array.from({ length: 7 }, (_, i) => {
    const mm = 1 + (i % 3),
      nn = 1 + Math.floor(i / 3);
    return { f: modeFrequencyHz(nn, mm, shape, boundary), n: nn, m: mm };
  }).sort((a, b) => a.f - b.f);
  const record = () => {
    if (sim.coherence < 0.72) {
      setFeedback("Not yet — tune closer to the dashed eigenfrequency peak.");
      return;
    }
    const id = `(${n},${m})`;
    setFound((v) => (v.includes(id) ? v : [...v, id].slice(0, 3)));
    setFeedback(
      found.includes(id)
        ? "That mode is already logged. Change a mode index."
        : `Resonance ${id} logged — nodes remain still while antinodes drive grains away.`,
    );
  };
  return (
    <section className="chl-lab">
      <header className="chl-hero">
        <div>
          <span>WAVES · STANDING MODES</span>
          <h1>{experiment.title}</h1>
          <p>
            Drive the plate through resonance and watch grains migrate to
            stationary nodes.
          </p>
        </div>
        <div className={running ? "run" : ""}>
          {running ? "VIBRATING" : "READY"}
        </div>
      </header>
      <div className="chl-layout">
        <aside className="chl-card chl-controls">
          <div className="eyebrow">1 · PLATE & BOUNDARY</div>
          <div className="seg">
            <button
              className={shape === "circular" ? "active" : ""}
              onClick={() => change(() => setShape("circular"))}
            >
              ● Circular
            </button>
            <button
              className={shape === "square" ? "active" : ""}
              onClick={() => change(() => setShape("square"))}
            >
              □ Square
            </button>
          </div>
          <label>
            Boundary condition
            <select
              aria-label="Boundary condition"
              value={boundary}
              onChange={(e) =>
                change(() => setBoundary(e.target.value as BoundaryCondition))
              }
            >
              <option value="free">Free edge</option>
              <option value="clamped">Clamped edge</option>
              <option value="supported">Simply supported</option>
            </select>
          </label>
          <div className="eyebrow divide">2 · MODE & EXCITATION</div>
          <div className="mode-row">
            <Range
              label="Mode n"
              value={n}
              min={1}
              max={5}
              step={1}
              unit=""
              onChange={(v) => change(() => setN(v))}
            />
            <Range
              label="Mode m"
              value={m}
              min={1}
              max={5}
              step={1}
              unit=""
              onChange={(v) => change(() => setM(v))}
            />
          </div>
          <Range
            label="Frequency"
            value={frequency}
            min={100}
            max={1500}
            step={1}
            unit="Hz"
            onChange={(v) => change(() => setFrequency(v))}
          />
          <button className="snap" onClick={snap}>
            Tune to {sim.eigenfrequencyHz.toFixed(1)} Hz resonance
          </button>
          <Range
            label="Drive amplitude"
            value={amplitude}
            min={0.1}
            max={1}
            step={0.05}
            unit="mm pk"
            onChange={(v) => change(() => setAmplitude(v))}
          />
          <Range
            label="Particle settling"
            value={damping}
            min={0.05}
            max={0.8}
            step={0.05}
            unit=""
            onChange={(v) => change(() => setDamping(v))}
          />
          <div className="predict">
            <b>Before you run: where will sand collect?</b>
            <div>
              <button
                className={prediction === "nodes" ? "active" : ""}
                onClick={() => setPrediction("nodes")}
              >
                At nodes
              </button>
              <button
                className={prediction === "antinodes" ? "active" : ""}
                onClick={() => setPrediction("antinodes")}
              >
                At antinodes
              </button>
            </div>
            <p>
              {prediction === "nodes"
                ? "Prediction locked — observe the pale nodal lines."
                : prediction
                  ? "Test it: antinodes have the greatest motion."
                  : "Choose before pressing Play."}
            </p>
          </div>
        </aside>
        <main className="chl-card chl-stage">
          <div className="stage-head">
            <div>
              <span>OVERHEAD EXPERIMENT</span>
              <h2>
                Mode ({n}, {m})
              </h2>
            </div>
            <label>
              <input
                type="checkbox"
                checked={overlay}
                onChange={(e) => setOverlay(e.target.checked)}
              />{" "}
              Nodal overlay
            </label>
          </div>
          <Plate
            sim={sim}
            shape={shape}
            progress={progress}
            time={time}
            running={running}
            overlay={overlay}
            reduced={reduced}
          />
          <div className="transport">
            <button
              aria-label={running ? "Pause plate" : "Play plate"}
              onClick={() => {
                if (time >= 8) setTime(0);
                setRunning((v) => !v);
              }}
            >
              {running ? "❚❚ Pause" : "▶ Play"}
            </button>
            <button
              aria-label="Step plate"
              onClick={() => {
                setRunning(false);
                setTime((t) => clamp(t + 0.4, 0, 8));
              }}
            >
              ▶│ Step
            </button>
            <input
              aria-label="Emergence timeline"
              type="range"
              min="0"
              max="8"
              step=".05"
              value={time}
              onChange={(e) => {
                setRunning(false);
                setTime(+e.target.value);
              }}
            />
            <span>{time.toFixed(1)} s</span>
            <select
              aria-label="Playback speed"
              value={speed}
              onChange={(e) => setSpeed(+e.target.value)}
            >
              {[0.25, 0.5, 1, 1.5, 2].map((v) => (
                <option key={v}>{v}</option>
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
          <div className="response">
            <div className="response-title">
              <b>FREQUENCY RESPONSE</b>
              <span>calibrated teaching peaks</span>
            </div>
            <svg
              viewBox="0 0 600 120"
              role="img"
              aria-label="Frequency response with discrete resonances"
            >
              <line x1="35" y1="97" x2="580" y2="97" />
              <line x1="35" y1="12" x2="35" y2="97" />
              {peaks.map((p, i) => {
                const x = 35 + clamp((p.f - 100) / 1400, 0, 1) * 545;
                return (
                  <path
                    key={i}
                    d={`M${x - 22} 94 Q${x} ${22 + (i % 2) * 15} ${x + 22} 94`}
                  />
                );
              })}
              <line
                className="cursor"
                x1={35 + ((frequency - 100) / 1400) * 545}
                x2={35 + ((frequency - 100) / 1400) * 545}
                y1="10"
                y2="98"
              />
              <text x="35" y="114">
                100 Hz
              </text>
              <text x="540" y="114">
                1500 Hz
              </text>
            </svg>
          </div>
        </main>
        <aside className="chl-card chl-readings">
          <div className="eyebrow">MEASURED</div>
          <div className="meter-grid">
            <div>
              <span>Frequency</span>
              <b>{frequency.toFixed(1)}</b>
              <small>Hz</small>
            </div>
            <div>
              <span>Amplitude</span>
              <b>{(amplitude * sim.coherence).toFixed(2)}</b>
              <small>mm pk</small>
            </div>
            <div>
              <span>Mode indices</span>
              <b>
                {n}, {m}
              </b>
              <small>n, m</small>
            </div>
            <div>
              <span>Eigenfrequency</span>
              <b>{sim.eigenfrequencyHz.toFixed(1)}</b>
              <small>Hz</small>
            </div>
            <div>
              <span>Quality</span>
              <b>{sim.quality.toFixed(0)}</b>
              <small>Q</small>
            </div>
            <div>
              <span>Coherence</span>
              <b>{sim.coherence.toFixed(2)}</b>
              <small>0–1</small>
            </div>
          </div>
          <div className="model-note">
            <b>Teaching model</b>
            <code>
              {shape === "square"
                ? "w ∝ sin(nπx/L) sin(mπy/L)"
                : "w ∝ sin(nπr/R) cos(mθ)"}
            </code>
            <p>
              Zero-displacement curves are stationary nodes. Frequency peaks are
              calibrated; this is not a finite-element plate solver.
            </p>
          </div>
          <div className="mission">
            <span>CHALLENGE</span>
            <h2>Find three distinct modes</h2>
            <p>
              Use a clamped boundary, 100–1500 Hz, and log three resonance
              patterns.
            </p>
            <div className="found">
              {[0, 1, 2].map((i) => (
                <b key={i}>{found[i] ?? "—"}</b>
              ))}
            </div>
            <button onClick={record}>Log resonant mode</button>
            <p className={feedback.startsWith("Resonance") ? "ok" : ""}>
              {feedback}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
