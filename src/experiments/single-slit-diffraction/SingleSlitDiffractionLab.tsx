import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { simulateSingleSlit } from "./single-slit-diffractionSimulation";
import "./single-slit-diffraction.css";

const defaults = {
  wavelengthNm: 650,
  slitWidthUm: 80,
  distanceM: 1.2,
  intensityScale: 1,
  markerOrder: 1,
};
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
const cm = (m: number) => m * 100;

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
    <label className="ssd-range">
      <span>
        <b>{label}</b>
        <output>
          {value.toFixed(step < 1 ? 2 : 0)} {unit}
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

function wavelengthColor(wavelength: number) {
  if (wavelength < 450) return "#725bff";
  if (wavelength < 495) return "#168cff";
  if (wavelength < 570) return "#10a95a";
  if (wavelength < 590) return "#e3bd19";
  if (wavelength < 620) return "#ff7b19";
  return "#f0362f";
}

export function SingleSlitDiffractionLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(defaults);
  const [phase, setPhase] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reduced, setReduced] = useState(false);
  const [prediction, setPrediction] = useState("0.98");
  const [predictionFeedback, setPredictionFeedback] = useState("");
  const [missionFeedback, setMissionFeedback] = useState("");
  const result = useMemo(
    () =>
      simulateSingleSlit({
        wavelengthNm: input.wavelengthNm,
        slitWidthMm: input.slitWidthUm / 1000,
        screenDistanceM: input.distanceM,
        order: input.markerOrder,
      }),
    [input],
  );
  const color = wavelengthColor(input.wavelengthNm);
  const firstCm = cm(result.firstMinimaPosition);
  const selectedCm = cm(result.selectedMinimaPosition);
  const targetCm = 1.5;
  const targetSlitUm = useMemo(() => {
    const theta = Math.atan(targetCm / 100 / input.distanceM);
    return ((input.wavelengthNm * 1e-9) / Math.sin(theta)) * 1e6;
  }, [input.distanceM, input.wavelengthNm]);
  const missionSuccess = Math.abs(firstCm - targetCm) <= 0.05;

  useEffect(() => {
    if (!running || reduced) return;
    const timer = window.setInterval(
      () => setPhase((value) => (value + 0.018 * speed) % 1),
      40,
    );
    return () => window.clearInterval(timer);
  }, [running, reduced, speed]);

  const change = (patch: Partial<typeof input>) => {
    setInput((current) => ({ ...current, ...patch }));
    setPhase(0);
    setRunning(false);
    setPredictionFeedback("");
    setMissionFeedback("");
  };
  const reset = () => {
    setInput(defaults);
    setPhase(0);
    setRunning(false);
    setSpeed(1);
    setReduced(false);
    setPrediction("0.98");
    setPredictionFeedback("");
    setMissionFeedback("");
  };
  const spreadPx = clamp(firstCm * 22, 18, 76);
  const graphPoints = result.intensityPoints
    .map(
      (point, index) =>
        `${32 + (index / (result.intensityPoints.length - 1)) * 536},${clamp(154 - point.y * 118 * input.intensityScale, 24, 154)}`,
    )
    .join(" ");
  const wavelets = Array.from(
    { length: 7 },
    (_, index) => 30 + ((index * 70 + phase * 90) % 450),
  );
  const screenSamples = Array.from({ length: 49 }, (_, index) => {
    const sample =
      result.intensityPoints[
        Math.round((index / 48) * (result.intensityPoints.length - 1))
      ]?.y ?? 0;
    return {
      y: 75 + index * 5.1,
      opacity: clamp(sample * input.intensityScale, 0.02, 1),
      height: sample > 0.4 ? 7 : 5,
    };
  });

  return (
    <section className="ssd-lab" style={{ "--beam": color } as CSSProperties}>
      <header className="ssd-hero">
        <div>
          <span>WAVES · DIFFRACTION</span>
          <h1>{experiment.title}</h1>
          <p>
            Explore how slit width, wavelength and distance shape the
            diffraction envelope.
          </p>
        </div>
        <div className={running ? "running" : ""}>
          ● {running ? "BUILDING PATTERN" : "READY TO MEASURE"}
        </div>
      </header>

      <div className="ssd-layout">
        <aside className="ssd-card ssd-controls">
          <span className="ssd-eyebrow">1 · BEAM SETTINGS</span>
          <Range
            label="Wavelength"
            value={input.wavelengthNm}
            min={400}
            max={700}
            step={5}
            unit="nm"
            onChange={(wavelengthNm) => change({ wavelengthNm })}
          />
          <div className="spectrum" aria-hidden="true">
            <i
              style={{ left: `${((input.wavelengthNm - 400) / 300) * 100}%` }}
            />
          </div>
          <Range
            label="Slit width"
            value={input.slitWidthUm}
            min={20}
            max={300}
            step={1}
            unit="µm"
            onChange={(slitWidthUm) => change({ slitWidthUm })}
          />
          <Range
            label="Screen distance"
            value={input.distanceM}
            min={0.5}
            max={2}
            step={0.05}
            unit="m"
            onChange={(distanceM) => change({ distanceM })}
          />
          <Range
            label="Intensity scale"
            value={input.intensityScale}
            min={0.25}
            max={1.5}
            step={0.05}
            unit="×"
            onChange={(intensityScale) => change({ intensityScale })}
          />
          <div
            className="limit-presets"
            role="group"
            aria-label="Beam setting presets"
          >
            <button
              onClick={() =>
                change({
                  wavelengthNm: 400,
                  slitWidthUm: 20,
                  distanceM: 0.5,
                  intensityScale: 0.25,
                })
              }
            >
              Minimums
            </button>
            <button onClick={() => change(defaults)}>Reference</button>
            <button
              onClick={() =>
                change({
                  wavelengthNm: 700,
                  slitWidthUm: 300,
                  distanceM: 2,
                  intensityScale: 1.5,
                })
              }
            >
              Maximums
            </button>
          </div>
          <span className="ssd-eyebrow ssd-divide">2 · MINIMUM MARKER</span>
          <div
            className="order-buttons"
            role="group"
            aria-label="Minimum marker order"
          >
            {[1, 2, 3].map((order) => (
              <button
                key={order}
                className={input.markerOrder === order ? "active" : ""}
                onClick={() => change({ markerOrder: order })}
              >
                m = ±{order}
              </button>
            ))}
          </div>
          <p className="control-note">
            The dashed markers move to the calculated minima on both sides of
            the centre.
          </p>
        </aside>

        <main className="ssd-card ssd-stage">
          <div className="ssd-stage-head">
            <span>3 · OPTICAL BENCH</span>
            <b>
              Fraunhofer pattern · λ/a ={" "}
              {(result.wavelengthM / result.slitWidthM).toExponential(2)}
            </b>
          </div>
          <div className="ssd-bench">
            <img
              src="/assets/experiments/single-slit-diffraction/diffraction-bench.png"
              alt="Laser, adjustable single slit and detector screen on an optical rail"
            />
            <svg
              viewBox="0 0 900 390"
              role="img"
              aria-label={`Wavefronts pass through an ${input.slitWidthUm} micrometre slit and form a ${result.centralMaximumWidth * 100} centimetre central maximum`}
            >
              <defs>
                <filter id="ssd-glow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <clipPath id="ssd-forward-half-space">
                  <rect x="420" y="0" width="480" height="390" />
                </clipPath>
              </defs>
              <line
                className="incident-beam"
                x1="168"
                x2="414"
                y1="191"
                y2="191"
              />
              {Array.from({ length: 5 }, (_, i) => (
                <line
                  key={i}
                  className="incident-front"
                  x1={190 + ((i * 50 + phase * 65) % 230)}
                  x2={190 + ((i * 50 + phase * 65) % 230)}
                  y1="154"
                  y2="228"
                />
              ))}
              <path
                className="diffract-cone"
                d={`M420 191L790 ${191 - spreadPx}L790 ${191 + spreadPx}Z`}
              />
              <g clipPath="url(#ssd-forward-half-space)">
                {wavelets.map((radius, index) => (
                  <circle
                    key={index}
                    className="wavelet"
                    cx="420"
                    cy="191"
                    r={radius}
                    style={{ opacity: clamp(1 - radius / 500, 0.1, 0.8) }}
                  />
                ))}
              </g>
              <g className="screen-pattern" filter="url(#ssd-glow)">
                {screenSamples.map((sample, index) => (
                  <rect
                    key={index}
                    x="790"
                    y={sample.y}
                    width="18"
                    height={sample.height}
                    rx="2"
                    style={{ opacity: sample.opacity }}
                  />
                ))}
              </g>
              <line
                className="screen-centre"
                x1="779"
                x2="820"
                y1="197"
                y2="197"
              />
              <line
                className="minimum-ray"
                x1="420"
                x2="790"
                y1="191"
                y2={191 - spreadPx * input.markerOrder}
              />
              <line
                className="minimum-ray"
                x1="420"
                x2="790"
                y1="191"
                y2={191 + spreadPx * input.markerOrder}
              />
              <text x="420" y="89">
                a = {input.slitWidthUm.toFixed(0)} µm
              </text>
              <text x="620" y="335">
                L = {input.distanceM.toFixed(2)} m
              </text>
              <text x="802" y="60">
                detector
              </text>
            </svg>
          </div>
          <div className="ssd-transport">
            <button
              aria-label={
                running
                  ? "Pause diffraction animation"
                  : "Play diffraction animation"
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
              aria-label="Diffraction build timeline"
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
              aria-label="Diffraction playback speed"
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

        <aside className="ssd-card ssd-readings">
          <span className="ssd-eyebrow">4 · PREDICTION & DATA</span>
          <div className="ssd-big">
            <span>CENTRAL MAXIMUM</span>
            <b>{cm(result.centralMaximumWidth).toFixed(3)} cm</b>
            <small>between first minima</small>
          </div>
          <dl>
            <div>
              <dt>First minimum y₁</dt>
              <dd>±{firstCm.toFixed(3)} cm</dd>
            </div>
            <div>
              <dt>Selected y{input.markerOrder}</dt>
              <dd>±{selectedCm.toFixed(3)} cm</dd>
            </div>
            <div>
              <dt>θ{input.markerOrder}</dt>
              <dd>{((result.selectedAngleRad * 180) / Math.PI).toFixed(3)}°</dd>
            </div>
            <div>
              <dt>Screen distance</dt>
              <dd>{input.distanceM.toFixed(2)} m</dd>
            </div>
          </dl>
          <div className="ssd-equation">
            <b>MINIMA</b>
            <code>a sin θₘ = mλ</code>
            <span>
              {result.slitWidthM.toExponential(2)} × sin(
              {((result.selectedAngleRad * 180) / Math.PI).toFixed(3)}°) ={" "}
              {input.markerOrder} × {result.wavelengthM.toExponential(2)} m
            </span>
          </div>
          <div className="prediction-box">
            <label>
              Predict y₁{" "}
              <span>
                <input
                  aria-label="Predicted first minimum centimetres"
                  type="number"
                  min="0"
                  step="0.01"
                  value={prediction}
                  onChange={(event) => setPrediction(event.target.value)}
                />{" "}
                cm
              </span>
            </label>
            <button
              onClick={() =>
                setPredictionFeedback(
                  Math.abs(+prediction - firstCm) <= 0.05
                    ? "Prediction agrees within 0.05 cm."
                    : "Use y₁ ≈ Lλ/a, then refine with tan(arcsin(λ/a)).",
                )
              }
            >
              Check
            </button>
            {predictionFeedback && (
              <p aria-live="polite">{predictionFeedback}</p>
            )}
          </div>
        </aside>
      </div>

      <section className="ssd-bottom">
        <div className="ssd-card ssd-graph">
          <span className="ssd-eyebrow">5 · INTENSITY PROFILE</span>
          <svg
            viewBox="0 0 600 185"
            role="img"
            aria-label="Single slit sinc squared intensity profile with movable minima markers"
          >
            <line x1="32" x2="568" y1="154" y2="154" />
            <line x1="32" x2="32" y1="24" y2="154" />
            <polyline points={graphPoints} />
            {[input.markerOrder, -input.markerOrder].map((order) => (
              <g key={order}>
                <line
                  className="graph-marker"
                  x1={300 + order * (536 / 6.5)}
                  x2={300 + order * (536 / 6.5)}
                  y1="40"
                  y2="154"
                />
                <text x={300 + order * (536 / 6.5)} y="34">
                  m={order}
                </text>
              </g>
            ))}
            <text x="280" y="179">
              screen position y
            </text>
            <text x="7" y="20">
              I/I₀
            </text>
          </svg>
          <p>Narrower slit → larger θ₁ → wider central maximum.</p>
        </div>
        <div className="ssd-card ssd-mission">
          <span className="ssd-eyebrow">6 · CHALLENGE</span>
          <h2>Place the first minimum at 1.50 cm</h2>
          <p>Adjust slit width. Wavelength and distance may also be changed.</p>
          <div className="target-meter">
            <i style={{ width: `${clamp((firstCm / 3) * 100, 0, 100)}%` }} />
            <em>target 1.50 cm</em>
          </div>
          <div>
            <button
              disabled={targetSlitUm < 20 || targetSlitUm > 300}
              onClick={() => change({ slitWidthUm: targetSlitUm })}
            >
              Set exact target
            </button>
            <button
              onClick={() =>
                setMissionFeedback(
                  missionSuccess
                    ? `Mission complete — y₁ = ${firstCm.toFixed(3)} cm.`
                    : `Current y₁ is ${firstCm.toFixed(3)} cm; ${firstCm < targetCm ? "narrow the slit" : "widen the slit"}.`,
                )
              }
            >
              Evaluate setting
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
        First minimum {firstCm.toFixed(3)} centimetres; central maximum{" "}
        {cm(result.centralMaximumWidth).toFixed(3)} centimetres.
      </p>
    </section>
  );
}
