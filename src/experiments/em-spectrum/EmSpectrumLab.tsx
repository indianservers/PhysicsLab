import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type DragEvent,
} from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  bands,
  media,
  representativeFrequency,
  solveSpectrum,
  type BandId,
  type MediumId,
} from "./emSpectrumSimulation";
import "./em-spectrum.css";

const LOG_MIN = 6;
const LOG_MAX = 20;
const DEFAULT_LOG = Math.log10(5.5e14);
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
const sci = (n: number, digits = 3) =>
  n
    .toExponential(digits - 1)
    .replace("e+", " × 10^")
    .replace("e-", " × 10^−");
const metricLength = (m: number) =>
  m >= 1
    ? `${m.toPrecision(3)} m`
    : m >= 1e-2
      ? `${(m * 100).toPrecision(3)} cm`
      : m >= 1e-3
        ? `${(m * 1e3).toPrecision(3)} mm`
        : m >= 1e-6
          ? `${(m * 1e6).toPrecision(3)} µm`
          : m >= 1e-9
            ? `${(m * 1e9).toPrecision(3)} nm`
            : `${sci(m)} m`;

const missionItems = [
  { id: "fm", label: "FM radio", band: "radio" },
  { id: "wifi", label: "Wi-Fi router", band: "microwave" },
  { id: "thermal", label: "Thermal camera", band: "infrared" },
  { id: "dental", label: "Dental image", band: "xray" },
] as const;

function WavePlot({
  cycles,
  phase,
  color,
  intensity,
  reduced,
}: {
  cycles: number;
  phase: number;
  color: string;
  intensity: number;
  reduced: boolean;
}) {
  const points = (offset: number, amplitude: number) =>
    Array.from({ length: 121 }, (_, i) => {
      const x = 24 + i * 4.6;
      const y =
        offset + Math.sin((i / 120) * Math.PI * 2 * cycles - phase) * amplitude;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  return (
    <svg
      className="em-wave"
      viewBox="0 0 600 250"
      role="img"
      aria-label="Electric and magnetic fields oscillating at right angles while the wave travels to the detector"
    >
      <defs>
        <linearGradient id="beam" x1="0" x2="1">
          <stop stopColor={color} stopOpacity="0" />
          <stop offset=".5" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line className="axis" x1="18" y1="125" x2="582" y2="125" />
      <path className="arrow" d="M574 119l10 6-10 6" />
      <polyline
        className={reduced ? "field e reduced" : "field e"}
        style={{ stroke: color, opacity: 0.48 + intensity * 0.52 }}
        points={points(125, 70 * intensity)}
      />
      <polyline
        className={reduced ? "field b reduced" : "field b"}
        style={{ opacity: 0.48 + intensity * 0.52 }}
        points={points(125, 37 * intensity)}
      />
      <line
        className="beam"
        x1="20"
        y1="125"
        x2="580"
        y2="125"
        stroke="url(#beam)"
      />
      <text x="28" y="38" fill={color}>
        E field
      </text>
      <text x="28" y="226">
        B field
      </text>
      <text x="470" y="112">
        propagation
      </text>
    </svg>
  );
}

export function EmSpectrumLab({ experiment }: DedicatedExperimentLabProps) {
  const [logFrequency, setLogFrequency] = useState(DEFAULT_LOG);
  const [medium, setMedium] = useState<MediumId>("vacuum");
  const [intensity, setIntensity] = useState(0.72);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reduced, setReduced] = useState(false);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState(
    "Select a technology, then choose its spectrum band.",
  );
  const frequencyHz = 10 ** logFrequency;
  const result = useMemo(
    () => solveSpectrum(frequencyHz, medium),
    [frequencyHz, medium],
  );
  const cycles = 1.4 + ((logFrequency - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 5.6;
  const completed = missionItems.every(
    (item) => placements[item.id] === item.band,
  );

  useEffect(() => {
    if (!running || reduced) return;
    const id = window.setInterval(
      () => setTime((value) => (value + 0.045 * speed) % 8),
      45,
    );
    return () => window.clearInterval(id);
  }, [running, reduced, speed]);

  const chooseBand = (band: BandId) => {
    setLogFrequency(
      clamp(Math.log10(representativeFrequency(band)), LOG_MIN, LOG_MAX),
    );
  };
  const place = (band: string, techId = selectedTech) => {
    if (!techId) {
      setFeedback("Choose a technology card first.");
      return;
    }
    const item = missionItems.find((entry) => entry.id === techId)!;
    const correct = item.band === band;
    setPlacements((old) => ({ ...old, [techId]: band }));
    setFeedback(
      correct
        ? `${item.label}: correct — ${bands.find((b) => b.id === band)?.label}.`
        : `${item.label} does not belong there. Compare its use with the band notes.`,
    );
    if (correct) setSelectedTech(null);
  };
  const reset = () => {
    setLogFrequency(DEFAULT_LOG);
    setMedium("vacuum");
    setIntensity(0.72);
    setTime(0);
    setRunning(false);
    setSpeed(1);
    setReduced(false);
    setPlacements({});
    setSelectedTech(null);
    setFeedback("Select a technology, then choose its spectrum band.");
  };

  return (
    <section className="em-lab">
      <header className="em-hero">
        <div>
          <span>WAVES · CLASS 12</span>
          <h1>{experiment.title}</h1>
          <p>Travel from radio to gamma on one continuous logarithmic scale.</p>
        </div>
        <div className={result.band.id}>{result.band.label.toUpperCase()}</div>
      </header>
      <nav className="em-band-nav" aria-label="Spectrum band selector">
        {bands.map((band) => (
          <button
            key={band.id}
            className={result.band.id === band.id ? "active" : ""}
            style={{ "--band": band.color } as CSSProperties}
            onClick={() => chooseBand(band.id)}
          >
            <i />
            {band.label}
          </button>
        ))}
      </nav>
      <div className="em-grid">
        <aside className="em-card em-controls">
          <span className="eyebrow">1 · SELECT FREQUENCY</span>
          <label>
            <b>Log frequency</b>
            <output>{frequencyHz.toExponential(2)} Hz</output>
            <input
              aria-label="Logarithmic frequency scale"
              type="range"
              min={LOG_MIN}
              max={LOG_MAX}
              step="0.01"
              value={logFrequency}
              onChange={(e) => setLogFrequency(+e.target.value)}
            />
            <small>
              <span>10⁶ Hz</span>
              <span>10²⁰ Hz</span>
            </small>
          </label>
          <div className="log-value">
            log₁₀(f / Hz) = <b>{logFrequency.toFixed(2)}</b>
          </div>
          <label>
            <b>Propagation medium</b>
            <select
              aria-label="Propagation medium"
              value={medium}
              onChange={(e) => setMedium(e.target.value as MediumId)}
            >
              {Object.entries(media).map(([id, item]) => (
                <option key={id} value={id}>
                  {item.label} · n={item.refractiveIndex}
                </option>
              ))}
            </select>
          </label>
          <label>
            <b>Field amplitude</b>
            <output>{Math.round(intensity * 100)}%</output>
            <input
              aria-label="Field amplitude"
              type="range"
              min="0.2"
              max="1"
              step="0.01"
              value={intensity}
              onChange={(e) => setIntensity(+e.target.value)}
            />
          </label>
          <div className="em-note">
            Frequency and photon energy stay fixed across media. Speed and
            wavelength decrease by n.
          </div>
        </aside>
        <main className="em-card em-stage">
          <div className="stage-head">
            <div>
              <span>2 · LIVE FIELD VIEW</span>
              <b>
                {result.band.label} in {media[medium].label}
              </b>
            </div>
            <div className={running ? "live" : "paused"}>
              ● {running ? "RUNNING" : time ? "PAUSED" : "READY"}
            </div>
          </div>
          <div className="apparatus">
            <img
              src="/assets/experiments/em-spectrum/em-apparatus.png"
              alt="Electromagnetic transmitter at left and detector at right"
            />
            <WavePlot
              cycles={cycles}
              phase={time * Math.PI}
              color={result.band.color}
              intensity={intensity}
              reduced={reduced}
            />
            <div className="transmitter">TRANSMITTER</div>
            <div className="detector">DETECTOR</div>
          </div>
          <div className="transport">
            <button
              aria-label={running ? "Pause animation" : "Play animation"}
              onClick={() => setRunning((v) => !v)}
            >
              {running ? "❚❚ Pause" : "▶ Play"}
            </button>
            <button
              onClick={() => {
                setRunning(false);
                setTime((t) => (t + 0.25) % 8);
              }}
            >
              ▶│ Step
            </button>
            <input
              aria-label="Animation timeline"
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
          <p className="scale-copy">
            Wave spacing is a logarithmic visual encoding; the exact wavelength
            is shown in the measurements.
          </p>
        </main>
        <aside className="em-card em-readings">
          <span className="eyebrow">3 · MEASUREMENTS</span>
          <dl>
            <div>
              <dt>Band</dt>
              <dd style={{ color: result.band.color }}>{result.band.label}</dd>
            </div>
            <div>
              <dt>Frequency, f</dt>
              <dd>{frequencyHz.toExponential(3)} Hz</dd>
            </div>
            <div>
              <dt>Wavelength, λ</dt>
              <dd>{metricLength(result.wavelengthM)}</dd>
            </div>
            <div>
              <dt>Photon energy</dt>
              <dd>
                {result.photonEnergyEv < 0.001
                  ? result.photonEnergyEv.toExponential(3)
                  : result.photonEnergyEv.toPrecision(4)}{" "}
                eV
              </dd>
            </div>
            <div>
              <dt>Wave speed</dt>
              <dd>{result.speedMps.toExponential(4)} m/s</dd>
            </div>
            <div>
              <dt>Refractive index</dt>
              <dd>{result.refractiveIndex}</dd>
            </div>
          </dl>
          <div className="identity">
            <b>Consistency check</b>
            <code>
              fλ = {(result.frequencyHz * result.wavelengthM).toExponential(5)}{" "}
              m/s
            </code>
            <span>
              {medium === "vacuum"
                ? "Matches c in vacuum ✓"
                : `Matches c / ${result.refractiveIndex} in ${media[medium].label.toLowerCase()} ✓`}
            </span>
          </div>
          <div className="application">
            <b>COMMON USE</b>
            <p>{result.band.use}</p>
            <b>EXPOSURE NOTE</b>
            <p>{result.band.hazard}</p>
          </div>
        </aside>
      </div>
      <section className="em-bottom">
        <div className="em-equations">
          <span>GOVERNING RELATIONS</span>
          <div>
            <b>v = fλ</b>
            <b>E = hf</b>
            <b>v = c/n</b>
          </div>
          <p>h = 6.626 070 15 × 10⁻³⁴ J·s · c = 299 792 458 m/s</p>
        </div>
        <div className="em-mission">
          <span>4 · CHALLENGE — PLACE THE TECHNOLOGIES</span>
          <div className="tech-list">
            {missionItems.map((item) => (
              <button
                draggable
                key={item.id}
                className={`${selectedTech === item.id ? "selected" : ""} ${placements[item.id] === item.band ? "correct" : ""}`}
                onClick={() => setSelectedTech(item.id)}
                onDragStart={(e: DragEvent<HTMLButtonElement>) => {
                  e.dataTransfer.setData("text/plain", item.id);
                  setSelectedTech(item.id);
                }}
              >
                {item.label}
                {placements[item.id] === item.band ? " ✓" : ""}
              </button>
            ))}
          </div>
          <div className="drop-bands">
            {bands.map((band) => (
              <button
                key={band.id}
                style={{ "--band": band.color } as CSSProperties}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) =>
                  place(band.id, e.dataTransfer.getData("text/plain"))
                }
                onClick={() => place(band.id)}
              >
                {band.label}
              </button>
            ))}
          </div>
          <p className={completed ? "success" : ""} aria-live="polite">
            {completed
              ? "Mission complete — all four technologies are correctly placed."
              : feedback}
          </p>
        </div>
      </section>
    </section>
  );
}
