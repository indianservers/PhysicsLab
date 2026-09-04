import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  inferUnknownSpecificHeat,
  solveInsulatedMix,
  thermalMaterials,
  thermalStateAtTime,
  unknownSpecificHeatScenario,
  type ThermalMaterial,
} from "./calorimetry-mixingSimulation";
import "./calorimetry-mixing.css";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
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
    if (["ArrowLeft", "ArrowDown"].includes(event.key)) next = value - step;
    if (["ArrowRight", "ArrowUp"].includes(event.key)) next = value + step;
    if (next === undefined) return;
    event.preventDefault();
    onChange(clamp(Number(next.toFixed(5)), min, max));
  };
  return (
    <label className="cal-range">
      <span>
        <b>{label}</b>
        <output>
          {value.toFixed(step < 0.01 ? 3 : step < 0.1 ? 2 : step < 1 ? 1 : 0)}
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
        onChange={(event) => onChange(Number(event.target.value))}
        onKeyDown={key}
      />
    </label>
  );
}
const path = (points: { x: number; y: number }[]) =>
  points
    .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

export function CalorimetryMixingLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [hotMass, setHotMass] = useState(0.15),
    [hotTemp, setHotTemp] = useState(80),
    [hotMaterial, setHotMaterial] = useState<ThermalMaterial>("water"),
    [coldMass, setColdMass] = useState(0.15),
    [coldTemp, setColdTemp] = useState(20),
    [coldMaterial, setColdMaterial] = useState<ThermalMaterial>("water"),
    [calCapacity, setCalCapacity] = useState(20);
  const [heatLoss, setHeatLoss] = useState(false),
    [ambient, setAmbient] = useState(22),
    [time, setTime] = useState(0),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(false),
    [prediction, setPrediction] = useState(""),
    [predictionFeedback, setPredictionFeedback] = useState(""),
    [unknownAnswer, setUnknownAnswer] = useState(""),
    [missionFeedback, setMissionFeedback] = useState("");
  const input = useMemo(
    () => ({
      hotMassKg: hotMass,
      hotTemperatureC: hotTemp,
      hotSpecificHeatJkgK: thermalMaterials[hotMaterial].specificHeatJkgK,
      coldMassKg: coldMass,
      coldTemperatureC: coldTemp,
      coldSpecificHeatJkgK: thermalMaterials[coldMaterial].specificHeatJkgK,
      calorimeterHeatCapacityJK: calCapacity,
      calorimeterInitialTemperatureC: coldTemp,
    }),
    [
      hotMass,
      hotTemp,
      hotMaterial,
      coldMass,
      coldTemp,
      coldMaterial,
      calCapacity,
    ],
  );
  const equilibrium = solveInsulatedMix(input),
    state = thermalStateAtTime(input, time, heatLoss, ambient);
  const graph = useMemo(
    () =>
      Array.from({ length: 61 }, (_, i) =>
        thermalStateAtTime(input, i * 2, heatLoss, ambient),
      ),
    [input, heatLoss, ambient],
  );
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setTime((old) => {
          const next = old + (reduced ? 2.5 : 0.8) * speed;
          if (next >= 120) {
            setRunning(false);
            return 120;
          }
          return next;
        }),
      reduced ? 180 : 50,
    );
    return () => clearInterval(id);
  }, [running, reduced, speed]);
  const change = (setter: (v: number) => void, v: number) => {
    setter(v);
    setTime(0);
    setRunning(false);
    setPredictionFeedback("");
  };
  const reset = () => {
    setHotMass(0.15);
    setHotTemp(80);
    setHotMaterial("water");
    setColdMass(0.15);
    setColdTemp(20);
    setColdMaterial("water");
    setCalCapacity(20);
    setHeatLoss(false);
    setAmbient(22);
    setTime(0);
    setRunning(false);
    setSpeed(1);
    setReduced(false);
    setPrediction("");
    setPredictionFeedback("");
    setUnknownAnswer("");
    setMissionFeedback("");
  };
  const pour = clamp(time / 8, 0, 1),
    mixed = state.mixProgress,
    stageState =
      time === 0
        ? "READY TO POUR"
        : time < 8
          ? "POURING"
          : time < 45
            ? "RAPID HEAT EXCHANGE"
            : time < 115
              ? "SLOW EQUILIBRATION"
              : "STABLE READING";
  const minT = Math.min(hotTemp, coldTemp, ambient),
    maxT = Math.max(hotTemp, coldTemp, ambient),
    gy = (t: number) => 145 - ((t - minT) / Math.max(1, maxT - minT)) * 120;
  const hotCurve = graph.map((s) => ({
      x: 30 + (s.timeS / 120) * 270,
      y: gy(s.hotTemperatureC),
    })),
    coldCurve = graph.map((s) => ({
      x: 30 + (s.timeS / 120) * 270,
      y: gy(s.coldTemperatureC),
    })),
    mixCurve = graph.map((s) => ({
      x: 30 + (s.timeS / 120) * 270,
      y: gy(s.calorimeterTemperatureC),
    }));
  const thermometerFill = clamp(
      (state.calorimeterTemperatureC / 100) * 190,
      4,
      190,
    ),
    closure = Math.abs(state.residualJ) / Math.max(1, Math.abs(state.qHotJ));
  const unknownCalculated = inferUnknownSpecificHeat({
    ...unknownSpecificHeatScenario,
    finalTemperatureC: unknownSpecificHeatScenario.finalTemperatureC,
  });
  return (
    <section
      className="cal-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="cal-hero">
        <div>
          <span>THERMAL ENERGY · 2D</span>
          <h1>{experiment.title}</h1>
          <p>
            Mix two samples, track every joule, and read the equilibrium
            temperature.
          </p>
        </div>
        <strong className={`cal-status ${time >= 115 ? "stable" : ""}`}>
          {stageState}
        </strong>
      </header>
      <div className="cal-layout">
        <aside className="cal-controls cal-card">
          <h2>
            <i>1</i> Hot sample
          </h2>
          <label className="cal-select">
            Material
            <select
              aria-label="Hot material"
              value={hotMaterial}
              onChange={(e) => {
                setHotMaterial(e.target.value as ThermalMaterial);
                setTime(0);
              }}
            >
              {Object.entries(thermalMaterials).map(([id, m]) => (
                <option key={id} value={id}>
                  {m.label} · {m.specificHeatJkgK} J/kg·K
                </option>
              ))}
            </select>
          </label>
          <Range
            label="Hot mass"
            value={hotMass}
            min={0.05}
            max={0.5}
            step={0.01}
            unit=" kg"
            onChange={(v) => change(setHotMass, v)}
          />
          <Range
            label="Hot temperature"
            value={hotTemp}
            min={30}
            max={95}
            step={1}
            unit=" °C"
            onChange={(v) => change(setHotTemp, v)}
          />
          <h2>
            <i>2</i> Cold sample
          </h2>
          <label className="cal-select">
            Material
            <select
              aria-label="Cold material"
              value={coldMaterial}
              onChange={(e) => {
                setColdMaterial(e.target.value as ThermalMaterial);
                setTime(0);
              }}
            >
              {Object.entries(thermalMaterials).map(([id, m]) => (
                <option key={id} value={id}>
                  {m.label} · {m.specificHeatJkgK} J/kg·K
                </option>
              ))}
            </select>
          </label>
          <Range
            label="Cold mass"
            value={coldMass}
            min={0.05}
            max={0.5}
            step={0.01}
            unit=" kg"
            onChange={(v) => change(setColdMass, v)}
          />
          <Range
            label="Cold temperature"
            value={coldTemp}
            min={0}
            max={40}
            step={1}
            unit=" °C"
            onChange={(v) => change(setColdTemp, v)}
          />
          <h2>
            <i>3</i> Calorimeter
          </h2>
          <Range
            label="Calorimeter heat capacity"
            value={calCapacity}
            min={0}
            max={200}
            step={5}
            unit=" J/K"
            onChange={(v) => change(setCalCapacity, v)}
          />
          <label className="cal-toggle">
            <input
              type="checkbox"
              checked={heatLoss}
              onChange={(e) => {
                setHeatLoss(e.target.checked);
                setTime(0);
              }}
            />{" "}
            Heat loss to surroundings
          </label>
          {heatLoss && (
            <Range
              label="Ambient temperature"
              value={ambient}
              min={5}
              max={40}
              step={1}
              unit=" °C"
              onChange={(v) => change(setAmbient, v)}
            />
          )}
        </aside>
        <main className="cal-main">
          <section className="cal-stage cal-card">
            <div className="cal-stage-head">
              <div>
                <span>MIXING STATION</span>
                <h2>Hot + cold → equilibrium</h2>
              </div>
              <div>
                <b>{state.calorimeterTemperatureC.toFixed(2)} °C</b>
                <small>live thermometer</small>
              </div>
            </div>
            <div className="cal-canvas">
              <img
                src="/assets/experiments/calorimetry-mixing/calorimetry-station.png"
                alt="Transparent two-dimensional calorimetry station with hot beaker, insulated cup, and cold beaker"
              />
              <svg
                className={running ? "running" : undefined}
                viewBox="0 0 900 430"
                aria-label={`${stageState}; thermometer ${state.calorimeterTemperatureC.toFixed(2)} degrees Celsius`}
              >
                <defs>
                  <linearGradient id="mixFluid" x1="0" x2="1">
                    <stop stopColor="#ef6b48" />
                    <stop offset="1" stopColor="#3f8fd4" />
                  </linearGradient>
                </defs>
                <rect
                  className="hot-fluid"
                  x="92"
                  y={250 + pour * 72}
                  width="190"
                  height={82 * (1 - pour)}
                  rx="15"
                />
                <rect
                  className="cold-fluid"
                  x="650"
                  y={250 + pour * 72}
                  width="160"
                  height={82 * (1 - pour)}
                  rx="15"
                />
                {time > 0 && pour < 1 && (
                  <>
                    <path className="pour hot" d="M245 215 Q350 96 430 210" />
                    <path className="pour cold" d="M675 215 Q570 96 475 210" />
                  </>
                )}
                <rect
                  className="mixed-fluid"
                  x="365"
                  y={335 - pour * 118}
                  width="170"
                  height={pour * 118}
                  rx="16"
                  fill="url(#mixFluid)"
                  opacity={0.72}
                />
                {Array.from({ length: 26 }, (_, i) => {
                  const x =
                      385 + ((i * 47 + Math.sin(time * 0.2 + i) * 18) % 130),
                    y = 240 + ((i * 31 + Math.cos(time * 0.28 + i) * 15) % 82);
                  return (
                    <circle
                      key={i}
                      className={`particle ${i % 2 ? "cold" : "hot"}`}
                      cx={x}
                      cy={y}
                      r={3 + (i % 4)}
                      opacity={pour * (0.45 + 0.4 * mixed)}
                    />
                  );
                })}
                <rect
                  className="thermometer"
                  x="446"
                  y={330 - thermometerFill}
                  width="8"
                  height={thermometerFill}
                  rx="4"
                />
                <circle className="thermometer" cx="450" cy="333" r="12" />
                <text x="120" y="185">
                  HOT {state.hotTemperatureC.toFixed(1)}°C
                </text>
                <text x="662" y="185">
                  COLD {state.coldTemperatureC.toFixed(1)}°C
                </text>
                <text x="390" y="385">
                  MIXTURE {state.calorimeterTemperatureC.toFixed(1)}°C
                </text>
              </svg>
            </div>
            <div className="cal-transport">
              <button
                aria-label="Replay"
                onClick={() => {
                  setTime(0);
                  setRunning(true);
                }}
              >
                ↺
              </button>
              <button
                className="play"
                onClick={() => {
                  if (time >= 120) setTime(0);
                  setRunning((v) => !v);
                }}
              >
                {running ? "Pause" : "Play mixing"}
              </button>
              <button
                onClick={() => {
                  setRunning(false);
                  setTime((v) => Math.min(120, v + 5));
                }}
              >
                Step
              </button>
              <Range
                label="Timeline"
                value={time}
                min={0}
                max={120}
                step={1}
                unit=" s"
                onChange={(v) => {
                  setTime(v);
                  setRunning(false);
                }}
              />
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
          <section className="cal-bottom">
            <div className="cal-card cal-predict">
              <span>PREDICT BEFORE YOU MIX</span>
              <h2>What equilibrium temperature do you expect?</h2>
              <label>
                Your prediction{" "}
                <input
                  aria-label="Predicted equilibrium temperature"
                  type="number"
                  min={Math.min(hotTemp, coldTemp)}
                  max={Math.max(hotTemp, coldTemp)}
                  value={prediction}
                  onChange={(e) => {
                    setPrediction(e.target.value);
                    setPredictionFeedback("");
                  }}
                />{" "}
                °C
              </label>
              <button
                onClick={() => {
                  const value = Number(prediction);
                  setPredictionFeedback(
                    !prediction
                      ? "Enter a temperature first."
                      : value < Math.min(hotTemp, coldTemp) ||
                          value > Math.max(hotTemp, coldTemp)
                        ? "Equilibrium must lie between the initial temperatures."
                        : Math.abs(value - equilibrium.finalTemperatureC) <= 1
                          ? `Excellent — energy balance predicts ${equilibrium.finalTemperatureC.toFixed(2)} °C.`
                          : `Compare heat capacities m·c; the prediction is ${Math.abs(value - equilibrium.finalTemperatureC).toFixed(1)} °C away.`,
                  );
                }}
              >
                Check prediction
              </button>
              {predictionFeedback && <p>{predictionFeedback}</p>}
            </div>
            <div className="cal-card cal-mission">
              <span>🏆 UNKNOWN MATERIAL</span>
              <h2>Identify its specific heat</h2>
              <p>
                An 80 g metal sample at 95 °C enters 120 g water at 20 °C in a
                20 J/K cup. The measured equilibrium is{" "}
                <b>
                  {unknownSpecificHeatScenario.finalTemperatureC.toFixed(2)} °C
                </b>
                .
              </p>
              <label>
                c unknown{" "}
                <input
                  aria-label="Unknown specific heat answer"
                  type="number"
                  value={unknownAnswer}
                  onChange={(e) => {
                    setUnknownAnswer(e.target.value);
                    setMissionFeedback("");
                  }}
                />{" "}
                J/(kg·K)
              </label>
              <button
                className="check"
                onClick={() => {
                  const value = Number(unknownAnswer);
                  setMissionFeedback(
                    !unknownAnswer
                      ? "Enter your calculated specific heat."
                      : Math.abs(value - unknownCalculated) <= 20
                        ? `Mission complete — ${unknownCalculated.toFixed(0)} J/(kg·K), consistent with copper.`
                        : `Use heat lost by metal = heat gained by water + calorimeter. Your value is ${Math.abs(value - unknownCalculated).toFixed(0)} J/(kg·K) away.`,
                  );
                }}
              >
                Check material
              </button>
              {missionFeedback && <p>{missionFeedback}</p>}
            </div>
          </section>
        </main>
        <aside className="cal-side">
          <section className="cal-card cal-readings">
            <h2>LIVE MEASUREMENTS</h2>
            <div>
              <span>
                Equilibrium prediction
                <b>{equilibrium.finalTemperatureC.toFixed(2)} °C</b>
              </span>
              <span>
                Q hot<b>{state.qHotJ.toFixed(1)} J</b>
              </span>
              <span>
                Q cold<b>+{state.qColdJ.toFixed(1)} J</b>
              </span>
              <span>
                Q calorimeter<b>+{state.qCalorimeterJ.toFixed(1)} J</b>
              </span>
              <span>
                Q surroundings<b>{state.qSurroundingsJ.toFixed(1)} J</b>
              </span>
              <span>
                ΣQ<b>{state.residualJ.toExponential(1)} J</b>
              </span>
              <span>
                Energy closure<b>{(closure * 100).toExponential(1)}%</b>
              </span>
            </div>
          </section>
          <section className="cal-card cal-graph">
            <h2>Temperature vs time</h2>
            <svg
              viewBox="0 0 320 170"
              aria-label="Hot, cold, and mixture temperature versus time"
            >
              <line x1="30" y1="145" x2="305" y2="145" />
              <line x1="30" y1="12" x2="30" y2="145" />
              <path className="hot" d={path(hotCurve)} />
              <path className="cold" d={path(coldCurve)} />
              <path className="mix" d={path(mixCurve)} />
              <line
                className="cursor"
                x1={30 + (time / 120) * 270}
                y1="12"
                x2={30 + (time / 120) * 270}
                y2="145"
              />
              <text x="238" y="163">
                time (s)
              </text>
              <text x="2" y="14">
                T °C
              </text>
            </svg>
            <div className="legend">
              <i className="hot" />
              Hot <i className="cold" />
              Cold <i className="mix" />
              Mixture
            </div>
          </section>
          <section className="cal-card cal-equation">
            <span>GOVERNING EQUATION</span>
            <b>ΣQ = 0</b>
            <strong>Q = mcΔT</strong>
            <small>
              Insulated: heat lost + heat gained by samples and cup equals zero.
            </small>
          </section>
        </aside>
      </div>
    </section>
  );
}
