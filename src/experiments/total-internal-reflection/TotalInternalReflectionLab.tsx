import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  solveFibre,
  solveTir,
  type MediumShape,
} from "./total-internal-reflectionSimulation";
import "./total-internal-reflection.css";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const rad = (degrees: number) => (degrees * Math.PI) / 180;
const colorForWavelength = (nm: number) =>
  `hsl(${clamp(270 - ((nm - 400) / 300) * 270, 0, 270)} 88% 50%)`;

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
  const key = (event: KeyboardEvent<HTMLInputElement>) => {
    let next: number | undefined;
    if (event.key === "Home") next = min;
    if (event.key === "End") next = max;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown")
      next = value - step;
    if (event.key === "ArrowRight" || event.key === "ArrowUp")
      next = value + step;
    if (next === undefined) return;
    event.preventDefault();
    onChange(clamp(Number(next.toFixed(4)), min, max));
  };
  return (
    <label className="tir-range">
      <span>
        <b>{label}</b>
        <output>
          {value.toFixed(step < 0.1 ? 2 : step < 1 ? 1 : 0)}
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
        onKeyDown={key}
      />
    </label>
  );
}

function BenchScene({
  incidence,
  result,
  wavelength,
  phase,
  shape,
  showNormal,
}: {
  incidence: number;
  result: ReturnType<typeof solveTir>;
  wavelength: number;
  phase: number;
  shape: MediumShape;
  showNormal: boolean;
}) {
  const hit = { x: 450, y: 157 },
    length = 205;
  const start = {
    x: hit.x - length * Math.sin(rad(incidence)),
    y: hit.y + length * Math.cos(rad(incidence)),
  };
  const reflected = {
    x: hit.x + length * Math.sin(rad(incidence)),
    y: hit.y + length * Math.cos(rad(incidence)),
  };
  const transmitted = Number.isFinite(result.transmissionDeg)
    ? {
        x: hit.x + length * Math.sin(rad(result.transmissionDeg)),
        y: hit.y - length * Math.cos(rad(result.transmissionDeg)),
      }
    : undefined;
  const rayColor = colorForWavelength(wavelength);
  return (
    <div className="tir-canvas">
      <img
        src="/assets/experiments/total-internal-reflection/tir-optical-bench.png"
        alt="Transparent two-dimensional optical rail with laser, semicircular glass block, and detector"
      />
      <svg
        viewBox="0 0 900 430"
        aria-label={`${shape} optical interface; ${result.regime}; incidence ${incidence.toFixed(1)} degrees`}
      >
        {shape === "slab" && (
          <rect
            className="tir-slab"
            x="272"
            y="157"
            width="356"
            height="174"
            rx="8"
          />
        )}
        {showNormal && (
          <line className="tir-normal" x1="450" y1="54" x2="450" y2="356" />
        )}
        <line
          className="tir-ray incident"
          style={{ stroke: rayColor }}
          x1={start.x}
          y1={start.y}
          x2={hit.x}
          y2={hit.y}
          pathLength="1"
          strokeDashoffset={1 - Math.min(1, phase * 3)}
        />
        <line
          className="tir-ray reflected"
          style={{
            stroke: rayColor,
            opacity: Math.max(0.08, result.reflectance),
          }}
          x1={hit.x}
          y1={hit.y}
          x2={reflected.x}
          y2={reflected.y}
          pathLength="1"
          strokeDashoffset={1 - clamp((phase - 0.32) * 3, 0, 1)}
        />
        {transmitted && (
          <line
            className="tir-ray transmitted"
            style={{
              stroke: rayColor,
              opacity: Math.max(0.08, result.transmittance),
            }}
            x1={hit.x}
            y1={hit.y}
            x2={transmitted.x}
            y2={transmitted.y}
            pathLength="1"
            strokeDashoffset={1 - clamp((phase - 0.32) * 3, 0, 1)}
          />
        )}
        {result.regime === "critical" && (
          <line
            className="tir-ray critical"
            style={{ stroke: rayColor }}
            x1={hit.x}
            y1={hit.y}
            x2="760"
            y2={hit.y}
          />
        )}
        <circle cx={hit.x} cy={hit.y} r="6" fill={rayColor} />
        <path
          className="tir-angle"
          d={`M450 205 A48 48 0 0 0 ${450 - 48 * Math.sin(rad(incidence))} ${157 + 48 * Math.cos(rad(incidence))}`}
        />
        <text x="390" y="211">
          θᵢ {incidence.toFixed(1)}°
        </text>
        <text x="476" y="211">
          θᵣ {incidence.toFixed(1)}°
        </text>
        {transmitted && (
          <text x="478" y="124">
            θₜ {result.transmissionDeg.toFixed(1)}°
          </text>
        )}
        {result.regime === "total-internal-reflection" && (
          <g className="tir-evanescent">
            <ellipse cx="450" cy="150" rx="82" ry="14" />
            <text x="374" y="126">
              evanescent field · no net transmitted power
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

function FibreScene({
  coupling,
  bend,
  output,
  wavelength,
  phase,
}: {
  coupling: number;
  bend: number;
  output: ReturnType<typeof solveFibre>;
  wavelength: number;
  phase: number;
}) {
  const color = colorForWavelength(wavelength);
  const fibre = `M55 230 C190 ${120 - bend} 260 ${330 + bend} 420 220 S650 ${105 - bend} 835 210`;
  const ray = `M55 230 L175 187 L292 260 L415 213 L535 170 L658 245 L835 210`;
  return (
    <div className="tir-fibre">
      <svg
        viewBox="0 0 900 430"
        aria-label={`Curved optical fibre with ${output.bounceCount} bounces and ${(output.outputFraction * 100).toFixed(1)} percent output`}
      >
        <path className="cladding" d={fibre} />
        <path className="core" d={fibre} />
        <path
          className={`fibre-ray ${output.allBouncesTrapped ? "trapped" : "leaking"}`}
          style={{ stroke: color, strokeDashoffset: `${1 - phase}` }}
          pathLength="1"
          d={ray}
        />
        {!output.allBouncesTrapped &&
          [292, 535, 658].map((x, i) => (
            <line
              key={x}
              className="leak"
              style={{ stroke: color }}
              x1={x}
              y1={i === 0 ? 260 : i === 1 ? 170 : 245}
              x2={x + 42}
              y2={i === 1 ? 110 : 330}
            />
          ))}
        {[175, 292, 415, 535, 658].map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy={[187, 260, 213, 170, 245][i]}
            r="5"
            fill={color}
          />
        ))}
        <text x="55" y="286">
          INPUT {coupling.toFixed(1)}°
        </text>
        <text x="672" y="286">
          OUTPUT {(output.outputFraction * 100).toFixed(1)}%
        </text>
      </svg>
    </div>
  );
}

export function TotalInternalReflectionLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [incidence, setIncidence] = useState(56),
    [n1, setN1] = useState(1.516),
    [n2, setN2] = useState(1),
    [wavelength, setWavelength] = useState(650),
    [shape, setShape] = useState<MediumShape>("semicircle");
  const [phase, setPhase] = useState(1),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(false),
    [showNormal, setShowNormal] = useState(true);
  const [prediction, setPrediction] = useState(""),
    [predictionFeedback, setPredictionFeedback] = useState(""),
    [coupling, setCoupling] = useState(18),
    [bend, setBend] = useState(24),
    [missionFeedback, setMissionFeedback] = useState("");
  const result = solveTir({ incidenceDeg: incidence, n1, n2 });
  const fibre = solveFibre({
    couplingDeg: coupling,
    bendDeg: bend,
    nCore: n1,
    nCladding: n2,
  });
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setPhase((old) => {
          const next = Math.min(1, old + (reduced ? 0.09 : 0.018) * speed);
          if (shape !== "fibre") setIncidence(20 + next * 50);
          if (next >= 1) setRunning(false);
          return next;
        }),
      reduced ? 150 : 35,
    );
    return () => clearInterval(id);
  }, [running, reduced, shape, speed]);
  const graph = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => {
        const angle = i * 2;
        return {
          angle,
          value: solveTir({ incidenceDeg: angle, n1, n2 }).reflectance,
        };
      }),
    [n1, n2],
  );
  const reset = () => {
    setIncidence(56);
    setN1(1.516);
    setN2(1);
    setWavelength(650);
    setShape("semicircle");
    setPhase(1);
    setRunning(false);
    setSpeed(1);
    setReduced(false);
    setShowNormal(true);
    setPrediction("");
    setPredictionFeedback("");
    setCoupling(18);
    setBend(24);
    setMissionFeedback("");
  };
  const setCritical = () => {
    if (Number.isFinite(result.criticalDeg)) {
      setIncidence(Number(result.criticalDeg.toFixed(2)));
      setPhase(1);
      setRunning(false);
    }
  };
  const status =
    result.regime === "total-internal-reflection"
      ? "TOTAL INTERNAL REFLECTION"
      : result.regime === "critical"
        ? "CRITICAL · GRAZING RAY"
        : result.regime === "ordinary-refraction"
          ? "NO CRITICAL ANGLE"
          : "REFRACTION + REFLECTION";
  return (
    <section
      className="tir-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="tir-hero">
        <div>
          <span>PHOTON LAB · 2D OPTICS</span>
          <h1>{experiment.title}</h1>
          <p>
            Cross the critical angle and watch transmitted energy vanish
            continuously.
          </p>
        </div>
        <strong className={`tir-status ${result.regime}`}>{status}</strong>
      </header>
      <div className="tir-layout">
        <aside className="tir-controls tir-card">
          <h2>
            <i>1</i> Materials (n)
          </h2>
          <label className="tir-select">
            Inside medium
            <select
              aria-label="Inside medium preset"
              onChange={(e) => setN1(Number(e.target.value))}
              value={n1}
            >
              <option value="1.516">Crown glass · 1.516</option>
              <option value="1.46">Fused silica · 1.460</option>
              <option value="1.62">Dense glass · 1.620</option>
              <option value="1.33">Water · 1.330</option>
            </select>
          </label>
          <Range
            label="Inside refractive index"
            value={n1}
            min={1.1}
            max={1.8}
            step={0.01}
            unit=""
            onChange={setN1}
          />
          <Range
            label="Outside refractive index"
            value={n2}
            min={1}
            max={1.6}
            step={0.01}
            unit=""
            onChange={setN2}
          />
          {n1 <= n2 && (
            <p className="tir-warning">
              Set n₁ &gt; n₂ for total internal reflection.
            </p>
          )}
          <h2>
            <i>2</i> Light source
          </h2>
          <Range
            label="Wavelength"
            value={wavelength}
            min={400}
            max={700}
            step={5}
            unit=" nm"
            onChange={setWavelength}
          />
          <div
            className="tir-spectrum"
            style={
              { "--light": colorForWavelength(wavelength) } as CSSProperties
            }
          />
          <h2>
            <i>3</i> Apparatus
          </h2>
          <Range
            label="Incident angle"
            value={incidence}
            min={0}
            max={89}
            step={0.1}
            unit="°"
            onChange={(v) => {
              setIncidence(v);
              setPhase(1);
              setRunning(false);
            }}
          />
          <label className="tir-select">
            Medium shape
            <select
              aria-label="Medium shape"
              value={shape}
              onChange={(e) => setShape(e.target.value as MediumShape)}
            >
              <option value="semicircle">Semicircular block</option>
              <option value="slab">Rectangular slab</option>
              <option value="fibre">Curved optical fibre</option>
            </select>
          </label>
          <label className="tir-check">
            <input
              type="checkbox"
              checked={showNormal}
              onChange={(e) => setShowNormal(e.target.checked)}
            />{" "}
            Show normal
          </label>
        </aside>
        <main className="tir-main">
          <section className="tir-stage tir-card">
            <div className="tir-stage-head">
              <div>
                <span>OPTICAL BENCH</span>
                <h2>
                  {shape === "fibre"
                    ? "Guided light in a curved core"
                    : "Denser-to-rarer interface"}
                </h2>
              </div>
              <button
                onClick={() =>
                  setShape(shape === "fibre" ? "semicircle" : "fibre")
                }
              >
                {shape === "fibre"
                  ? "Return to bench"
                  : "Switch to fibre mode →"}
              </button>
            </div>
            {shape === "fibre" ? (
              <FibreScene
                coupling={coupling}
                bend={bend}
                output={fibre}
                wavelength={wavelength}
                phase={phase}
              />
            ) : (
              <BenchScene
                incidence={incidence}
                result={result}
                wavelength={wavelength}
                phase={phase}
                shape={shape}
                showNormal={showNormal}
              />
            )}
            <div className="tir-transport">
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
                {running
                  ? "Pause"
                  : shape === "fibre"
                    ? "Play ray"
                    : "Play critical sweep"}
              </button>
              <button
                onClick={() => {
                  setRunning(false);
                  setPhase((v) => Math.min(1, v + 0.1));
                  if (shape !== "fibre")
                    setIncidence((v) => Math.min(70, v + 5));
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
          <section className="tir-bottom">
            <div className="tir-card tir-predict">
              <span>MAKE A PREDICTION</span>
              <h2>Beyond θc, transmitted intensity will…</h2>
              {[
                ["increase", "Increase"],
                ["same", "Stay the same"],
                ["zero", "Decrease to zero"],
              ].map(([v, l]) => (
                <label key={v}>
                  <input
                    type="radio"
                    name="tir-prediction"
                    value={v}
                    checked={prediction === v}
                    onChange={(e) => {
                      setPrediction(e.target.value);
                      setPredictionFeedback("");
                    }}
                  />{" "}
                  {l}
                </label>
              ))}
              <button
                onClick={() =>
                  setPredictionFeedback(
                    prediction === "zero"
                      ? "Correct — the interface carries no transmitted power in TIR."
                      : prediction
                        ? "Try again: follow T as θᵢ crosses θc."
                        : "Choose a prediction first.",
                  )
                }
              >
                Submit prediction
              </button>
              {predictionFeedback && <p>{predictionFeedback}</p>}
            </div>
            <div className="tir-card tir-mission">
              <span>🏆 LEARNER CHALLENGE</span>
              <h2>Guide the ray through the curved fibre</h2>
              <div className="mission-controls">
                <Range
                  label="Input coupling"
                  value={coupling}
                  min={0}
                  max={50}
                  step={1}
                  unit="°"
                  onChange={(v) => {
                    setCoupling(v);
                    setMissionFeedback("");
                  }}
                />
                <Range
                  label="Bend severity"
                  value={bend}
                  min={10}
                  max={55}
                  step={1}
                  unit="°"
                  onChange={(v) => {
                    setBend(v);
                    setMissionFeedback("");
                  }}
                />
              </div>
              <div className="tir-output">
                <span>
                  Minimum bounce angle{" "}
                  <b>{fibre.minimumIncidenceDeg.toFixed(1)}°</b>
                </span>
                <span>
                  Output <b>{(fibre.outputFraction * 100).toFixed(1)}%</b>
                </span>
              </div>
              <button onClick={() => setShape("fibre")}>Show fibre</button>
              <button
                className="check"
                onClick={() =>
                  setMissionFeedback(
                    fibre.allBouncesTrapped && fibre.outputFraction >= 0.85
                      ? "Mission complete — every bounce exceeds θc and output stays above 85%."
                      : !fibre.allBouncesTrapped
                        ? "Light leaks at the bend. Lower coupling or bend severity."
                        : "All bounces are trapped; reduce the input angle to raise coupling above 85%.",
                  )
                }
              >
                Check ray
              </button>
              {missionFeedback && <p>{missionFeedback}</p>}
            </div>
          </section>
        </main>
        <aside className="tir-side">
          <section className="tir-card tir-readings">
            <h2>⌁ Live readings</h2>
            <div>
              <span>
                θᵢ<b>{incidence.toFixed(1)}°</b>
              </span>
              <span>
                θₜ
                <b>
                  {Number.isFinite(result.transmissionDeg)
                    ? `${result.transmissionDeg.toFixed(1)}°`
                    : "—"}
                </b>
              </span>
              <span>
                θc
                <b>
                  {Number.isFinite(result.criticalDeg)
                    ? `${result.criticalDeg.toFixed(2)}°`
                    : "—"}
                </b>
              </span>
              <span>
                R<b>{(result.reflectance * 100).toFixed(1)}%</b>
              </span>
              <span>
                T<b>{(result.transmittance * 100).toFixed(1)}%</b>
              </span>
              <span>
                R + T
                <b>
                  {((result.reflectance + result.transmittance) * 100).toFixed(
                    1,
                  )}
                  %
                </b>
              </span>
            </div>
          </section>
          <section className="tir-card tir-equation">
            <span>GOVERNING EQUATION</span>
            <b>θc = sin⁻¹(n₂ / n₁)</b>
            <small>
              Valid only for n₁ &gt; n₂. At TIR, θrefl = θᵢ and R = 1.
            </small>
            <button
              onClick={setCritical}
              disabled={!Number.isFinite(result.criticalDeg)}
            >
              Set exact critical angle
            </button>
          </section>
          <section className="tir-card tir-graph">
            <h2>Reflectance vs incidence</h2>
            <svg
              viewBox="0 0 300 170"
              aria-label="Reflectance versus angle of incidence"
            >
              <line x1="30" y1="140" x2="288" y2="140" />
              <line x1="30" y1="12" x2="30" y2="140" />
              <polyline
                points={graph
                  .map(
                    ({ angle, value }) =>
                      `${30 + (angle / 90) * 258},${140 - value * 125}`,
                  )
                  .join(" ")}
              />
              {Number.isFinite(result.criticalDeg) && (
                <line
                  className="critical-mark"
                  x1={30 + (result.criticalDeg / 90) * 258}
                  y1="12"
                  x2={30 + (result.criticalDeg / 90) * 258}
                  y2="140"
                />
              )}
              <circle
                cx={30 + (incidence / 90) * 258}
                cy={140 - result.reflectance * 125}
                r="5"
              />
              <text x="4" y="18">
                R
              </text>
              <text x="230" y="161">
                θᵢ (°)
              </text>
            </svg>
          </section>
        </aside>
      </div>
    </section>
  );
}
