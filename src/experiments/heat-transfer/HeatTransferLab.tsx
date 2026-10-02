import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  CONDUCTIVE_MATERIALS,
  INSULATION_MATERIALS,
  convectionState,
  fourierHeatRateW,
  insulationHeatLossW,
  radiationHeatRateW,
  type HeaterSide,
  type TransferMode,
} from "./heatTransferSimulation";
import "./heat-transfer.css";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const ease = (n: number) => n * n * (3 - 2 * n);
const formatWatts = (watts: number) =>
  `${watts < 0.01 ? watts.toFixed(4) : watts < 10 ? watts.toFixed(2) : watts.toFixed(1)} W`;
const materialIds = Object.keys(CONDUCTIVE_MATERIALS);
const insulationIds = Object.keys(
  INSULATION_MATERIALS,
) as (keyof typeof INSULATION_MATERIALS)[];

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
  const key = (event: KeyboardEvent<HTMLInputElement>) => {
    let next: number | undefined;
    if (event.key === "Home") next = min;
    if (event.key === "End") next = max;
    if (["ArrowLeft", "ArrowDown"].includes(event.key)) next = value - step;
    if (["ArrowRight", "ArrowUp"].includes(event.key)) next = value + step;
    if (next === undefined) return;
    event.preventDefault();
    onChange(clamp(next, min, max));
  };
  const decimals = step < 0.01 ? 3 : step < 0.1 ? 2 : step < 1 ? 1 : 0;
  return (
    <label className="transfer-range">
      <span>
        <b>{label}</b>
        <output>
          {value.toFixed(decimals)} {unit}
        </output>
      </span>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onKeyDown={key}
      />
    </label>
  );
}

export function HeatTransferLab({ experiment }: DedicatedExperimentLabProps) {
  const [mode, setMode] = useState<TransferMode>("conduction");
  const [materialId, setMaterialId] = useState("aluminium");
  const [conductivity, setConductivity] = useState(205);
  const [temperatureDifference, setTemperatureDifference] = useState(60);
  const [heaterPower, setHeaterPower] = useState(220);
  const [heaterSide, setHeaterSide] = useState<HeaterSide>("left");
  const [emissivity, setEmissivity] = useState(0.8);
  const [sourceTemperature, setSourceTemperature] = useState(500);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reduced, setReduced] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [predictionFeedback, setPredictionFeedback] = useState("");
  const [insulationId, setInsulationId] =
    useState<keyof typeof INSULATION_MATERIALS>("wood");
  const [insulationThicknessCm, setInsulationThicknessCm] = useState(4);
  const [missionEmissivity, setMissionEmissivity] = useState(0.8);
  const [missionFeedback, setMissionFeedback] = useState("");

  const area = Math.PI * 0.005 ** 2;
  const rodLength = 0.3;
  const conductionRate = fourierHeatRateW(
    conductivity,
    area,
    temperatureDifference,
    rodLength,
  );
  const convection = convectionState(heaterPower, heaterSide);
  const radiationRate = Math.max(
    0,
    radiationHeatRateW(emissivity, 0.02, sourceTemperature, 20, 0.95),
  );
  const rates = {
    conduction: conductionRate,
    convection: convection.heatRateW,
    radiation: radiationRate,
  };
  const activeRate = rates[mode];
  const progress = ease(clamp(time / 8, 0, 1));
  const liveRate = activeRate * progress;
  const status =
    time === 0
      ? "READY"
      : time >= 8
        ? "RESULT"
        : running
          ? "RUNNING"
          : "PAUSED";
  const hotC = 20 + temperatureDifference;
  const probeTemps = [
    hotC,
    hotC - temperatureDifference * 0.5 * progress,
    hotC - temperatureDifference * progress,
  ];
  const tankTopC = 20 + convection.temperatureDifferenceK * 0.38 * progress;
  const tankBottomC = 20 + convection.temperatureDifferenceK * progress;
  const surfaceC =
    20 +
    (sourceTemperature - 20) * (1 - Math.exp(-time / 4)) * emissivity * 0.16;
  const missionMaterial = INSULATION_MATERIALS[insulationId];
  const missionLoss = insulationHeatLossW(
    missionMaterial.conductivityWMK,
    insulationThicknessCm / 100,
    missionEmissivity,
  );
  const missionPass = missionLoss.totalW < 60 && insulationThicknessCm <= 12;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setTime((old) => {
          const next = old + (reduced ? 0.25 : 0.05) * speed;
          if (next >= 8) {
            setRunning(false);
            return 8;
          }
          return next;
        }),
      reduced ? 220 : 50,
    );
    return () => window.clearInterval(id);
  }, [running, reduced, speed]);

  const restart = () => {
    setTime(0);
    setRunning(false);
    setPredictionFeedback("");
  };
  const change = <T,>(
    setter: (value: T) => void,
    value: T,
    nextMode?: TransferMode,
  ) => {
    setter(value);
    if (nextMode) setMode(nextMode);
    restart();
  };
  const reset = () => {
    setMode("conduction");
    setMaterialId("aluminium");
    setConductivity(205);
    setTemperatureDifference(60);
    setHeaterPower(220);
    setHeaterSide("left");
    setEmissivity(0.8);
    setSourceTemperature(500);
    setTime(0);
    setRunning(false);
    setSpeed(1);
    setReduced(false);
    setPrediction("");
    setPredictionFeedback("");
    setInsulationId("wood");
    setInsulationThicknessCm(4);
    setMissionEmissivity(0.8);
    setMissionFeedback("");
  };
  const selectMaterial = (id: string) => {
    setMaterialId(id);
    setConductivity(CONDUCTIVE_MATERIALS[id].conductivityWMK);
    setMode("conduction");
    restart();
  };
  const checkPrediction = () =>
    setPredictionFeedback(
      !prediction
        ? "Choose a prediction first."
        : prediction === "increase"
          ? "Correct. Fourier’s law makes heat rate directly proportional to ΔT."
          : "Recheck Q̇ = kAΔT/L: with all else fixed, a larger ΔT increases the rate.",
    );
  const checkMission = () =>
    setMissionFeedback(
      missionPass
        ? `Success — ${missionLoss.totalW.toFixed(1)} W is below the 60 W target within 12 cm.`
        : `Current loss is ${missionLoss.totalW.toFixed(1)} W. Lower k, add thickness, or choose a lower-emissivity surface.`,
    );
  const graphPoints = useMemo(
    () =>
      Array.from({ length: 31 }, (_, i) => {
        const yRate = activeRate * ease(i / 30);
        const max = Math.max(activeRate * 1.15, 1);
        return `${18 + i * 5.8},${116 - (yRate / max) * 91}`;
      }).join(" "),
    [activeRate],
  );
  const particles = Array.from({ length: 26 }, (_, i) => {
    const phase = (i / 26 + time * (0.025 + heaterPower / 22000)) % 1;
    const clockwise = heaterSide === "left";
    const p = clockwise ? phase : 1 - phase;
    let x: number;
    let y: number;
    if (p < 0.25) {
      x = 358;
      y = 323 - p * 520;
    } else if (p < 0.5) {
      x = 358 + (p - 0.25) * 760;
      y = 193;
    } else if (p < 0.75) {
      x = 548;
      y = 193 + (p - 0.5) * 520;
    } else {
      x = 548 - (p - 0.75) * 760;
      y = 323;
    }
    return (
      <circle
        key={i}
        cx={x}
        cy={y}
        r={2.5 + (i % 3)}
        fill={p < 0.38 ? "#f06428" : "#178cc7"}
        opacity={0.45 + progress * 0.5}
      />
    );
  });
  const lattice = Array.from({ length: 13 }, (_, i) => {
    const local = 1 - (i / 13) * progress;
    const amp =
      (2 + local * 5) *
      (running && !reduced ? Math.sin(time * 12 + i * 1.9) : 0);
    return (
      <g key={i} transform={`translate(${95 + i * 15} ${273 + amp})`}>
        <circle r="5" fill={`hsl(${18 + i * 13 * progress} 78% 52%)`} />
        <path d="M-7 0H-12" stroke="#a15a35" strokeWidth="1" />
      </g>
    );
  });

  return (
    <section
      className="transfer-lab"
      aria-label={`${experiment.title} interactive lab`}
    >
      <header className="transfer-hero">
        <div>
          <span>THERMOLAB · 2D EXPLORER</span>
          <h1>Three ways energy travels</h1>
          <p>
            Compare particle-to-particle conduction, circulating-fluid
            convection, and electromagnetic radiation.
          </p>
        </div>
        <div className={`transfer-status ${status.toLowerCase()}`}>
          {status}
        </div>
      </header>
      <nav className="transfer-tabs" aria-label="Heat transfer mechanism">
        {(["conduction", "convection", "radiation"] as TransferMode[]).map(
          (item, index) => (
            <button
              key={item}
              className={mode === item ? "active" : ""}
              aria-pressed={mode === item}
              onClick={() => change(setMode, item)}
            >
              <i>{index + 1}</i>
              {item}
            </button>
          ),
        )}
      </nav>
      <div className="transfer-layout">
        <aside className="transfer-controls">
          <section className="transfer-card">
            <p className="eyebrow">EXPERIMENT MODE</p>
            <div className="transfer-mode-list">
              <button
                className={mode === "conduction" ? "active" : ""}
                onClick={() => change(setMode, "conduction")}
              >
                <b>Conduction</b>
                <span>Solid lattice</span>
              </button>
              <button
                className={mode === "convection" ? "active" : ""}
                onClick={() => change(setMode, "convection")}
              >
                <b>Convection</b>
                <span>Moving fluid</span>
              </button>
              <button
                className={mode === "radiation" ? "active" : ""}
                onClick={() => change(setMode, "radiation")}
              >
                <b>Radiation</b>
                <span>No medium needed</span>
              </button>
            </div>
          </section>
          <section className={`transfer-card mechanism-controls ${mode}`}>
            <p className="eyebrow">LIVE CONTROLS</p>
            {mode === "conduction" && (
              <>
                <label className="transfer-select">
                  <span>Rod material</span>
                  <select
                    aria-label="Rod material"
                    value={materialId}
                    onChange={(e) => selectMaterial(e.target.value)}
                  >
                    {materialIds.map((id) => (
                      <option key={id} value={id}>
                        {CONDUCTIVE_MATERIALS[id].name}
                      </option>
                    ))}
                  </select>
                </label>
                <Range
                  label="Material conductivity"
                  value={conductivity}
                  min={0.1}
                  max={401}
                  step={0.1}
                  unit="W/m·K"
                  onChange={(v) => change(setConductivity, v, "conduction")}
                />
                <Range
                  label="Temperature difference"
                  value={temperatureDifference}
                  min={10}
                  max={100}
                  step={5}
                  unit="K"
                  onChange={(v) =>
                    change(setTemperatureDifference, v, "conduction")
                  }
                />
              </>
            )}
            {mode === "convection" && (
              <>
                <Range
                  label="Fluid heating"
                  value={heaterPower}
                  min={50}
                  max={500}
                  step={10}
                  unit="W"
                  onChange={(v) => change(setHeaterPower, v, "convection")}
                />
                <div
                  className="side-toggle"
                  role="group"
                  aria-label="Heater position"
                >
                  <button
                    className={heaterSide === "left" ? "active" : ""}
                    onClick={() => change(setHeaterSide, "left", "convection")}
                  >
                    Heat left
                  </button>
                  <button
                    className={heaterSide === "right" ? "active" : ""}
                    onClick={() => change(setHeaterSide, "right", "convection")}
                  >
                    Heat right
                  </button>
                </div>
              </>
            )}
            {mode === "radiation" && (
              <>
                <Range
                  label="Surface emissivity"
                  value={emissivity}
                  min={0.05}
                  max={1}
                  step={0.05}
                  unit="ε"
                  onChange={(v) => change(setEmissivity, v, "radiation")}
                />
                <Range
                  label="Source temperature"
                  value={sourceTemperature}
                  min={200}
                  max={800}
                  step={25}
                  unit="°C"
                  onChange={(v) => change(setSourceTemperature, v, "radiation")}
                />
              </>
            )}
          </section>
          <section className="transfer-card prediction">
            <p className="eyebrow">PREDICT → RUN</p>
            <p>
              If ΔT increases with geometry and k fixed, what happens to
              conduction rate?
            </p>
            <label>
              <span>Your prediction</span>
              <select
                aria-label="Conduction prediction"
                value={prediction}
                onChange={(e) => {
                  setPrediction(e.target.value);
                  setPredictionFeedback("");
                }}
              >
                <option value="">Choose…</option>
                <option value="increase">It increases</option>
                <option value="same">It stays the same</option>
                <option value="decrease">It decreases</option>
              </select>
            </label>
            <button onClick={checkPrediction}>Check prediction</button>
            {predictionFeedback && (
              <small role="status">{predictionFeedback}</small>
            )}
          </section>
        </aside>

        <main className="transfer-main">
          <section className="transfer-card transfer-stage">
            <div className="stage-head">
              <div>
                <span>LIVE MECHANISM</span>
                <h2>
                  {mode === "conduction"
                    ? "Lattice vibration passes energy along the rod"
                    : mode === "convection"
                      ? "Warm fluid rises; cooler fluid sinks"
                      : "Thermal radiation crosses empty space"}
                </h2>
              </div>
              <strong>{formatWatts(liveRate)}</strong>
            </div>
            <div
              className={`transfer-visual ${mode} ${running && !reduced ? "live" : ""}`}
            >
              <img
                src="/assets/experiments/heat-transfer/heat-transfer-apparatus.png"
                alt="Conduction rod, convection tank, and radiation apparatus"
              />
              <img
                className="transfer-fx cool"
                src="/assets/experiments/heat-transfer/concept-effect.png"
                alt=""
                aria-hidden="true"
              />
              <img
                className="transfer-fx warm"
                src="/assets/experiments/heat-transfer/interaction-overlay.png"
                alt=""
                aria-hidden="true"
              />
              <svg
                viewBox="0 0 900 470"
                role="img"
                aria-label={`${mode} heat transfer at ${formatWatts(liveRate)}`}
              >
                <defs>
                  <marker
                    id="transfer-arrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M0 0L8 4L0 8Z" fill="currentColor" />
                  </marker>
                  <linearGradient id="thermal-rod">
                    <stop stopColor="#ef4e27" />
                    <stop offset={progress} stopColor="#f7a42d" />
                    <stop offset="1" stopColor="#278cc2" />
                  </linearGradient>
                </defs>
                <g className="station-labels">
                  <text x="155" y="40">
                    CONDUCTION
                  </text>
                  <text x="435" y="40">
                    CONVECTION
                  </text>
                  <text x="744" y="40">
                    RADIATION
                  </text>
                </g>
                <g
                  className={
                    mode === "conduction" ? "active-station" : "dim-station"
                  }
                >
                  <rect
                    x="89"
                    y="257"
                    width="198"
                    height="19"
                    rx="9"
                    fill="url(#thermal-rod)"
                    opacity={0.45 + progress * 0.5}
                  />
                  {lattice}
                  <path
                    className="flow-arrow conduction-arrow"
                    d="M105 232H270"
                    markerEnd="url(#transfer-arrow)"
                  />
                  <g className="probe-labels">
                    <text x="94" y="211">
                      T₁ {probeTemps[0].toFixed(1)}°
                    </text>
                    <text x="165" y="196">
                      T₂ {probeTemps[1].toFixed(1)}°
                    </text>
                    <text x="239" y="211">
                      T₃ {probeTemps[2].toFixed(1)}°
                    </text>
                  </g>
                </g>
                <g
                  className={
                    mode === "convection" ? "active-station" : "dim-station"
                  }
                >
                  {particles}
                  <path
                    className={`convection-loop ${heaterSide}`}
                    d={
                      heaterSide === "left"
                        ? "M358 320V190H548V320H358"
                        : "M548 320V190H358V320H548"
                    }
                    markerEnd="url(#transfer-arrow)"
                  />
                  <text x="396" y="366">
                    {heaterSide === "left"
                      ? "CLOCKWISE ↻"
                      : "COUNTER-CLOCKWISE ↺"}
                  </text>
                </g>
                <g
                  className={
                    mode === "radiation" ? "active-station" : "dim-station"
                  }
                >
                  <path
                    className="radiation-wave w1"
                    d="M723 230Q750 200 777 230Q804 260 831 230"
                  />
                  <path
                    className="radiation-wave w2"
                    d="M723 260Q750 230 777 260Q804 290 831 260"
                  />
                  <circle
                    className="photon p1"
                    cx={723 + progress * 108}
                    cy="230"
                    r="5"
                  />
                  <circle
                    className="photon p2"
                    cx={723 + ((progress + 0.45) % 1) * 108}
                    cy="260"
                    r="4"
                  />
                  <text x="734" y="326">
                    ε = {emissivity.toFixed(2)}
                  </text>
                </g>
              </svg>
            </div>
            <div className="transfer-transport">
              <button
                className="primary"
                onClick={() => {
                  if (time >= 8) setTime(0);
                  setRunning(true);
                }}
                disabled={running}
              >
                ▶ {time >= 8 ? "Replay" : "Play"}
              </button>
              <button onClick={() => setRunning(false)} disabled={!running}>
                Ⅱ Pause
              </button>
              <button
                onClick={() => {
                  setRunning(false);
                  setTime((v) => Math.min(8, v + 0.5));
                }}
              >
                ▶| Step
              </button>
              <button onClick={restart}>↺ Reset run</button>
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
              <label className="reduced">
                <input
                  type="checkbox"
                  checked={reduced}
                  onChange={(e) => setReduced(e.target.checked)}
                />{" "}
                Reduced motion
              </label>
            </div>
            <label className="transfer-scrub">
              <span>{time.toFixed(1)} s</span>
              <input
                aria-label="Thermal time"
                type="range"
                min="0"
                max="8"
                step="0.1"
                value={time}
                onChange={(e) => {
                  setTime(Number(e.target.value));
                  setRunning(false);
                }}
              />
              <span>8.0 s</span>
            </label>
          </section>
          <section className="transfer-card mechanism-note">
            <b>
              {mode === "conduction"
                ? "Fourier trend"
                : mode === "convection"
                  ? "Buoyancy loop"
                  : "Fourth-power trend"}
            </b>
            <span>
              {mode === "conduction"
                ? "Rate grows with k and ΔT, and falls as length increases."
                : mode === "convection"
                  ? `${heaterSide === "left" ? "Left" : "Right"}-side heating makes less-dense warm fluid rise above the heater.`
                  : "Temperatures must be absolute kelvin inside T⁴; doubling °C is not a valid radiation ratio."}
            </span>
            <code>
              {mode === "conduction"
                ? "Q̇ = kAΔT/L"
                : mode === "convection"
                  ? "Q̇ = hAΔT"
                  : "Q̇ = εσAF(Tₛ⁴−Tₐ⁴)"}
            </code>
          </section>
        </main>

        <aside className="transfer-analysis">
          <section className="transfer-card">
            <p className="eyebrow">LIVE READOUTS</p>
            <div className="transfer-read">
              <span>Conduction</span>
              <b>{formatWatts(conductionRate)}</b>
              <span>Convection</span>
              <b>{formatWatts(convection.heatRateW)}</b>
              <span>Radiation</span>
              <b>{formatWatts(radiationRate)}</b>
              <span>Active mechanism</span>
              <b className="active-value">{formatWatts(liveRate)}</b>
            </div>
          </section>
          <section className="transfer-card">
            <p className="eyebrow">HEAT RATE vs TIME</p>
            <svg
              className="transfer-chart"
              viewBox="0 0 205 138"
              role="img"
              aria-label={`${mode} heat rate versus time graph`}
            >
              <path d="M18 10V116H198" />
              <path className="grid" d="M18 70H198" />
              <polyline points={graphPoints} />
              <circle cx={18 + progress * 174} cy={116 - progress * 79} r="4" />
              <text x="1" y="12">
                Q̇
              </text>
              <text x="179" y="132">
                time
              </text>
            </svg>
            <p className="chart-caption">
              Endpoint: {formatWatts(activeRate)} · animation shows approach to
              steady rate.
            </p>
          </section>
          <section className="transfer-card mode-metrics">
            <p className="eyebrow">MECHANISM DETAIL</p>
            {mode === "conduction" && (
              <>
                <span>Hot / cold ends</span>
                <b>{hotC.toFixed(0)} / 20 °C</b>
                <span>Rod area / length</span>
                <b>
                  {area.toExponential(2)} m² / {rodLength} m
                </b>
              </>
            )}
            {mode === "convection" && (
              <>
                <span>Bottom − top</span>
                <b>{(tankBottomC - tankTopC).toFixed(2)} K</b>
                <span>Flow regime</span>
                <b>{convection.regime}</b>
                <span>Circulation</span>
                <b>
                  {heaterSide === "left" ? "clockwise" : "counter-clockwise"}
                </b>
              </>
            )}
            {mode === "radiation" && (
              <>
                <span>Source / ambient</span>
                <b>{sourceTemperature} / 20 °C</b>
                <span>Surface response</span>
                <b>{surfaceC.toFixed(1)} °C</b>
                <span>View factor</span>
                <b>0.95</b>
              </>
            )}
          </section>
        </aside>
      </div>

      <section className="transfer-card transfer-mission">
        <div>
          <p className="eyebrow">DESIGN CHALLENGE</p>
          <h2>Insulate a container below 60 W</h2>
          <p>
            Keep the insulation at or below 12 cm. Minimize both conduction
            through the wall and radiation across its inner gap.
          </p>
        </div>
        <label>
          <span>Insulation</span>
          <select
            aria-label="Mission insulation"
            value={insulationId}
            onChange={(e) => {
              setInsulationId(
                e.target.value as keyof typeof INSULATION_MATERIALS,
              );
              setMissionFeedback("");
            }}
          >
            {insulationIds.map((id) => (
              <option key={id} value={id}>
                {INSULATION_MATERIALS[id].name} · k{" "}
                {INSULATION_MATERIALS[id].conductivityWMK}
              </option>
            ))}
          </select>
        </label>
        <Range
          label="Insulation thickness"
          value={insulationThicknessCm}
          min={2}
          max={12}
          step={1}
          unit="cm"
          onChange={(v) => {
            setInsulationThicknessCm(v);
            setMissionFeedback("");
          }}
        />
        <Range
          label="Inner surface emissivity"
          value={missionEmissivity}
          min={0.05}
          max={0.9}
          step={0.05}
          unit="ε"
          onChange={(v) => {
            setMissionEmissivity(v);
            setMissionFeedback("");
          }}
        />
        <div className="mission-result">
          <span>
            Conduction {missionLoss.conductionW.toFixed(1)} W + radiation{" "}
            {missionLoss.radiationW.toFixed(1)} W
          </span>
          <strong>{missionLoss.totalW.toFixed(1)} W</strong>
          <button className="primary" onClick={checkMission}>
            Run challenge
          </button>
          {missionFeedback && (
            <small className={missionPass ? "success" : "try"} role="status">
              {missionFeedback}
            </small>
          )}
        </div>
      </section>
      <footer className="transfer-foot">
        <b>Model limits</b>
        <span>
          One-dimensional steady conduction, a classroom-scale lumped convection
          model, and diffuse-grey radiation to large surroundings. Animation
          time is illustrative; rates and trends come from the equations.
        </span>
        <button onClick={reset}>Reset entire lab</button>
      </footer>
    </section>
  );
}
