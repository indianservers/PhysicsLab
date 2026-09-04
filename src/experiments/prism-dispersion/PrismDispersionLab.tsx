import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  prismMaterials,
  solvePrismRay,
  solvePrismSpectrum,
  spectralLines,
  type PrismMaterial,
  type SpectrumMode,
} from "./prism-dispersionSimulation";
import "./prism-dispersion.css";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const rad = (degrees: number) => (degrees * Math.PI) / 180;
const wavelengthColor = (wavelengthNm: number) => {
  const hue = clamp(270 - ((wavelengthNm - 410) / (706.5 - 410)) * 270, 0, 270);
  return `hsl(${hue.toFixed(0)} 78% 52%)`;
};
type Point = { x: number; y: number };
function lineIntersection(point: Point, angleDeg: number, a: Point, b: Point) {
  const d = { x: Math.cos(rad(angleDeg)), y: Math.sin(rad(angleDeg)) },
    e = { x: b.x - a.x, y: b.y - a.y },
    cross = d.x * e.y - d.y * e.x;
  if (Math.abs(cross) < 1e-8) return b;
  const ap = { x: a.x - point.x, y: a.y - point.y },
    t = (ap.x * e.y - ap.y * e.x) / cross;
  return { x: point.x + t * d.x, y: point.y + t * d.y };
}
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
    <label className="pd-range">
      <span>
        <b>{label}</b>
        <output>
          {value.toFixed(step < 1 ? 1 : 0)}
          {unit}
        </output>
      </span>
      <input
        aria-label={label}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

export function PrismDispersionLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [apexAngle, setApexAngle] = useState(60),
    [incidenceAngle, setIncidenceAngle] = useState(50),
    [material, setMaterial] = useState<PrismMaterial>("bk7"),
    [spectrumMode, setSpectrumMode] = useState<SpectrumMode>("white"),
    [singleWavelength, setSingleWavelength] = useState(589.3);
  const [phase, setPhase] = useState(1),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(false),
    [drag, setDrag] = useState<"prism" | "ray" | null>(null),
    [showNormals, setShowNormals] = useState(true),
    [prediction, setPrediction] = useState(""),
    [feedback, setFeedback] = useState("");
  const result = solvePrismSpectrum({
    apexAngleDeg: apexAngle,
    incidenceAngleDeg: incidenceAngle,
    material,
  });
  const selectedRay = {
    ...solvePrismRay({
      apexAngleDeg: apexAngle,
      incidenceAngleDeg: incidenceAngle,
      material,
      wavelengthNm: singleWavelength,
    }),
    label: "Selected",
    color: wavelengthColor(singleWavelength),
  };
  const activeRays =
    spectrumMode === "white"
      ? result.rays
      : spectrumMode === "lines"
        ? result.rays.filter((_, index) => [1, 3, 4].includes(index))
        : [selectedRay];
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setPhase((p) => {
          const next = Math.min(1, p + (reduced ? 0.12 : 0.024) * speed);
          if (next >= 1) setRunning(false);
          return next;
        }),
      reduced ? 170 : 35,
    );
    return () => clearInterval(id);
  }, [running, speed, reduced]);
  const apex = { x: 450, y: 78 },
    baseY = 322,
    halfBase = (baseY - apex.y) * Math.tan(rad(apexAngle / 2)),
    left = { x: 450 - halfBase, y: baseY },
    right = { x: 450 + halfBase, y: baseY },
    entry = {
      x: apex.x + (left.x - apex.x) * 0.62,
      y: apex.y + (left.y - apex.y) * 0.62,
    };
  const paths = activeRays.map((ray) => {
    const internalAngle = apexAngle / 2 - ray.r1Deg,
      exit = lineIntersection(entry, internalAngle, apex, right),
      incomingAngle = apexAngle / 2 - incidenceAngle,
      start = {
        x: 42,
        y: entry.y - (entry.x - 42) * Math.tan(rad(incomingAngle)),
      };
    const outgoingAngle = -apexAngle / 2 + ray.emergenceAngleDeg,
      end = ray.totalInternalReflection
        ? { x: exit.x - 150, y: exit.y + 115 }
        : { x: 870, y: exit.y + (870 - exit.x) * Math.tan(rad(outgoingAngle)) };
    return { ...ray, start, exit, end };
  });
  const reset = () => {
    setApexAngle(60);
    setIncidenceAngle(50);
    setMaterial("bk7");
    setSpectrumMode("white");
    setSingleWavelength(589.3);
    setPhase(1);
    setRunning(false);
    setSpeed(1);
    setReduced(false);
    setDrag(null);
    setShowNormals(true);
    setPrediction("");
    setFeedback("");
  };
  const setMinimum = () => {
    if (Number.isFinite(result.minimumIncidenceDeg))
      setIncidenceAngle(clamp(result.minimumIncidenceDeg, 20, 75));
  };
  const pointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const box = e.currentTarget.getBoundingClientRect(),
      x = ((e.clientX - box.left) / box.width) * 900;
    if (drag === "prism")
      setApexAngle(clamp(Math.round(30 + ((x - 150) / 600) * 45), 30, 75));
    else setIncidenceAngle(clamp(20 + ((x - 150) / 600) * 55, 20, 75));
  };
  const keyRotateRay = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    setIncidenceAngle((v) =>
      clamp(v + (e.key === "ArrowLeft" ? -1 : 1), 20, 75),
    );
  };
  const keyRotatePrism = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    setApexAngle((v) => clamp(v + (e.key === "ArrowLeft" ? -1 : 1), 30, 75));
  };
  const missionPass =
    material === "sf6" &&
    apexAngle >= 55 &&
    !result.hasTir &&
    result.angularDispersionDeg >= 5;
  const graphPath = useMemo(
    () =>
      spectralLines
        .map((line, index) => {
          const n = result.rays[index].n,
            x = 30 + ((line.wavelengthNm - 400) / 320) * 260,
            y = 135 - ((n - 1.45) / 0.42) * 110;
          return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" "),
    [result.rays],
  );
  return (
    <section
      className="pd-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="pd-hero">
        <div>
          <span>PRISM SPECTROMETER · 2D</span>
          <h1>{experiment.title}</h1>
          <p>
            Trace every wavelength through both prism faces and measure its
            deviation.
          </p>
        </div>
        <div className={`pd-status ${result.hasTir ? "tir" : "safe"}`}>
          {result.hasTir
            ? `${6 - result.safeRayCount} lines in TIR`
            : "ALL LINES EMERGE"}
        </div>
      </header>
      <div className="pd-layout">
        <aside className="pd-controls pd-card">
          <h2>
            <i>1</i> Light source
          </h2>
          <label className="pd-select">
            Spectrum mode
            <select
              aria-label="Spectrum mode"
              value={spectrumMode}
              onChange={(e) => setSpectrumMode(e.target.value as SpectrumMode)}
            >
              <option value="white">White light</option>
              <option value="lines">Three spectral lines</option>
              <option value="single">Single wavelength</option>
            </select>
          </label>
          {spectrumMode === "single" && (
            <Range
              label="Wavelength"
              value={singleWavelength}
              min={410}
              max={706.5}
              step={0.1}
              unit=" nm"
              onChange={setSingleWavelength}
            />
          )}
          <h2>
            <i>2</i> Prism
          </h2>
          <label className="pd-select">
            Material
            <select
              aria-label="Prism material"
              value={material}
              onChange={(e) => setMaterial(e.target.value as PrismMaterial)}
            >
              {Object.entries(prismMaterials).map(([id, item]) => (
                <option value={id} key={id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <Range
            label="Apex angle"
            value={apexAngle}
            min={30}
            max={75}
            step={1}
            unit="°"
            onChange={(v) => {
              setApexAngle(v);
              setFeedback("");
            }}
          />
          <div className="pd-index">
            <span>n at 589.3 nm</span>
            <b>{result.referenceIndex.toFixed(5)}</b>
          </div>
          <h2>
            <i>3</i> Ray and detector
          </h2>
          <Range
            label="Angle of incidence"
            value={incidenceAngle}
            min={20}
            max={75}
            step={0.5}
            unit="°"
            onChange={setIncidenceAngle}
          />
          <button
            className="pd-minimum"
            onClick={setMinimum}
            disabled={!Number.isFinite(result.minimumIncidenceDeg)}
          >
            Lock minimum deviation
          </button>
          <label className="pd-check">
            <input
              type="checkbox"
              checked={showNormals}
              onChange={(e) => setShowNormals(e.target.checked)}
            />{" "}
            Face normals
          </label>
        </aside>
        <main className="pd-main">
          <section className="pd-stage pd-card">
            <div className="pd-stage-head">
              <div>
                <span>OPTICAL BENCH</span>
                <h2>Two-face wavelength trace</h2>
              </div>
              <div>
                <b>
                  {Number.isFinite(result.angularDispersionDeg)
                    ? result.angularDispersionDeg.toFixed(2)
                    : "—"}
                  °
                </b>
                <small>violet–red spread</small>
              </div>
            </div>
            <div className="pd-canvas">
              <img
                src="/assets/experiments/prism-dispersion/prism-spectrometer-bench.png"
                alt="Transparent prism spectrometer bench"
              />
              <svg
                viewBox="0 0 900 430"
                onPointerMove={pointerMove}
                onPointerUp={() => setDrag(null)}
                onPointerLeave={() => setDrag(null)}
                aria-label={`${prismMaterials[material].label} prism; ${result.hasTir ? "total internal reflection present" : `angular dispersion ${result.angularDispersionDeg.toFixed(2)} degrees`}`}
              >
                <polygon
                  className="prism"
                  points={`${apex.x},${apex.y} ${left.x},${left.y} ${right.x},${right.y}`}
                />
                {showNormals && (
                  <g className="pd-normals">
                    <line
                      x1={entry.x - 55}
                      y1={entry.y - 32}
                      x2={entry.x + 55}
                      y2={entry.y + 32}
                    />
                    <line
                      x1={right.x - 145}
                      y1={right.y - 8}
                      x2={right.x - 35}
                      y2={right.y - 72}
                    />
                  </g>
                )}
                <line
                  className="white-ray"
                  x1={paths[0]?.start.x}
                  y1={paths[0]?.start.y}
                  x2={entry.x}
                  y2={entry.y}
                  opacity={phase > 0.08 ? 1 : 0.12}
                />
                {paths.map((ray) => (
                  <g key={ray.wavelengthNm}>
                    <line
                      className="spectral-ray"
                      style={{ stroke: ray.color }}
                      x1={entry.x}
                      y1={entry.y}
                      x2={ray.exit.x}
                      y2={ray.exit.y}
                      opacity={phase > 0.35 ? 1 : 0.1}
                    />
                    <line
                      className={`spectral-ray ${ray.totalInternalReflection ? "tir" : ""}`}
                      style={{ stroke: ray.color }}
                      x1={ray.exit.x}
                      y1={ray.exit.y}
                      x2={ray.end.x}
                      y2={ray.end.y}
                      opacity={phase > 0.66 ? 1 : 0.08}
                    />
                  </g>
                ))}
                <text className="pd-angle" x={entry.x - 105} y={entry.y - 20}>
                  i = {incidenceAngle.toFixed(1)}°
                </text>
                <text className="pd-angle" x={apex.x - 25} y={apex.y - 16}>
                  A = {apexAngle.toFixed(1)}°
                </text>
                {result.hasTir && (
                  <text
                    className="pd-tir-label"
                    x={right.x - 120}
                    y={right.y - 92}
                  >
                    TOTAL INTERNAL REFLECTION
                  </text>
                )}
                <g
                  className="pd-hit prism-hit"
                  role="button"
                  tabIndex={0}
                  aria-label="Rotatable prism; use left and right arrow keys"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDrag("prism");
                  }}
                  onKeyDown={keyRotatePrism}
                >
                  <polygon
                    points={`${apex.x},${apex.y} ${left.x},${left.y} ${right.x},${right.y}`}
                  />
                </g>
                <g
                  className="pd-hit ray-hit"
                  role="button"
                  tabIndex={0}
                  aria-label="Rotatable incident ray; use left and right arrow keys"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDrag("ray");
                  }}
                  onKeyDown={keyRotateRay}
                >
                  <rect
                    x="40"
                    y={entry.y - 45}
                    width={entry.x - 40}
                    height="90"
                  />
                </g>
              </svg>
            </div>
            <div className="pd-transport">
              <button
                aria-label="Replay"
                onClick={() => {
                  setPhase(0);
                  setRunning(true);
                }}
              >
                ↺
              </button>
              <button
                className="play"
                onClick={() => {
                  if (phase >= 1) setPhase(0);
                  setRunning((v) => !v);
                }}
              >
                {running ? "Pause" : "Play spectrum"}
              </button>
              <button
                onClick={() => {
                  setRunning(false);
                  setPhase((v) => Math.min(1, v + 1 / 3));
                }}
              >
                Step
              </button>
              <label>
                Speed{" "}
                <select
                  aria-label="Playback speed"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                >
                  <option value={0.25}>0.25×</option>
                  <option value={0.5}>0.5×</option>
                  <option value={1}>1×</option>
                  <option value={2}>2×</option>
                </select>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={reduced}
                  onChange={(e) => setReduced(e.target.checked)}
                />{" "}
                Reduced motion
              </label>
              <button onClick={reset}>Reset</button>
            </div>
          </section>
          <section className="pd-data pd-card">
            <div>
              <h2>Dispersion curve</h2>
              <svg
                viewBox="0 0 320 160"
                aria-label="Refractive index versus wavelength"
              >
                <line x1="30" y1="135" x2="300" y2="135" />
                <line x1="30" y1="15" x2="30" y2="140" />
                <path d={graphPath} />
                {result.rays.map((ray, index) => (
                  <circle
                    key={ray.wavelengthNm}
                    cx={30 + ((ray.wavelengthNm - 400) / 320) * 260}
                    cy={135 - ((ray.n - 1.45) / 0.42) * 110}
                    r="4"
                    fill={spectralLines[index].color}
                  />
                ))}
                <text x="222" y="154">
                  wavelength (nm)
                </text>
                <text x="4" y="12">
                  n
                </text>
              </svg>
            </div>
            <div className="pd-equation">
              <span>MINIMUM DEVIATION</span>
              <b>n = sin[(A + δₘ)/2] / sin(A/2)</b>
              <small>At minimum deviation: i=e and r₁=r₂=A/2.</small>
              <button onClick={setMinimum}>Set symmetric path</button>
            </div>
          </section>
        </main>
        <aside className="pd-side">
          <section className="pd-card pd-table">
            <h2>Live measurements</h2>
            <div className="pd-row head">
              <span>λ (nm)</span>
              <span>δ (deg)</span>
              <span>n</span>
            </div>
            {result.rays.map((ray) => (
              <div
                className={`pd-row ${ray.totalInternalReflection ? "tir" : ""}`}
                key={ray.wavelengthNm}
              >
                <span style={{ color: ray.color }}>
                  {ray.wavelengthNm.toFixed(1)}
                </span>
                <span>
                  {ray.totalInternalReflection
                    ? "TIR"
                    : ray.deviationDeg.toFixed(2)}
                </span>
                <span>{ray.n.toFixed(5)}</span>
              </div>
            ))}
            <div className="pd-spread">
              <span>Angular dispersion</span>
              <b>
                {Number.isFinite(result.angularDispersionDeg)
                  ? `${result.angularDispersionDeg.toFixed(2)}°`
                  : "blocked by TIR"}
              </b>
            </div>
          </section>
          <section className="pd-card pd-mission">
            <span>CHALLENGE</span>
            <h2>Maximum safe dispersion</h2>
            <p>
              Reach at least 5° violet–red separation with no wavelength
              trapped.
            </p>
            <button
              onClick={() => {
                setMaterial("sf6");
                setApexAngle(60);
                setIncidenceAngle(70);
                setSpectrumMode("white");
                setFeedback("");
              }}
            >
              Load high-dispersion setup
            </button>
            <button
              className="check"
              onClick={() =>
                setFeedback(
                  missionPass
                    ? `Mission complete — ${result.angularDispersionDeg.toFixed(2)}° spread and all six lines emerge.`
                    : result.hasTir
                      ? "Some wavelengths undergo total internal reflection. Increase incidence angle or reduce apex angle."
                      : `Current spread is ${result.angularDispersionDeg.toFixed(2)}°. Try a denser flint glass.`,
                )
              }
            >
              Check solution
            </button>
            {feedback && (
              <p
                className={feedback.startsWith("Mission") ? "success" : "hint"}
                role="status"
              >
                {feedback}
              </p>
            )}
          </section>
          <section className="pd-card pd-predict">
            <h2>Prediction</h2>
            <label>
              Expected spread (°)
              <input
                aria-label="Expected angular dispersion"
                inputMode="decimal"
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
              />
            </label>
            <button
              onClick={() =>
                setFeedback(
                  Number.isFinite(result.angularDispersionDeg) &&
                    Math.abs(Number(prediction) - result.angularDispersionDeg) <
                      0.3
                    ? "Prediction matches the calculated angular dispersion."
                    : `Calculated spread: ${Number.isFinite(result.angularDispersionDeg) ? result.angularDispersionDeg.toFixed(2) : "unavailable during TIR"}°.`,
                )
              }
            >
              Check prediction
            </button>
          </section>
        </aside>
      </div>
    </section>
  );
}
