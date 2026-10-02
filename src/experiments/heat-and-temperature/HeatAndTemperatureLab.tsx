import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  THERMAL_MATERIALS,
  celsiusToFahrenheit,
  celsiusToKelvin,
  equilibriumTemperature,
  heatCapacity,
  heatRequired,
  temperatureAfterHeat,
  type MaterialId,
} from "./heatTemperatureSimulation";
import "./heat-and-temperature.css";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const ease = (n: number) => n * n * (3 - 2 * n);
const ids = Object.keys(THERMAL_MATERIALS) as MaterialId[];

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
  return (
    <label className="heat-range">
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
        onChange={(e) => onChange(Number(e.target.value))}
        onKeyDown={key}
      />
    </label>
  );
}

function SelectMaterial({
  label,
  value,
  onChange,
}: {
  label: string;
  value: MaterialId;
  onChange: (id: MaterialId) => void;
}) {
  return (
    <label className="heat-select">
      <span>{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value as MaterialId)}
      >
        {ids.map((id) => (
          <option key={id} value={id}>
            {THERMAL_MATERIALS[id].name} · {THERMAL_MATERIALS[id].specificHeat}{" "}
            J/kg·K
          </option>
        ))}
      </select>
    </label>
  );
}

export function HeatAndTemperatureLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [mode, setMode] = useState<"pulse" | "contact">("pulse");
  const [materialA, setMaterialA] = useState<MaterialId>("aluminium");
  const [materialB, setMaterialB] = useState<MaterialId>("copper");
  const [massA, setMassA] = useState(0.5);
  const [massB, setMassB] = useState(1);
  const [initialA, setInitialA] = useState(20);
  const [initialB, setInitialB] = useState(20);
  const [addedHeat, setAddedHeat] = useState(9000);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reduced, setReduced] = useState(false);
  const [missionChoice, setMissionChoice] = useState<MaterialId | "">("");
  const [missionFeedback, setMissionFeedback] = useState("");

  const matA = THERMAL_MATERIALS[materialA];
  const matB = THERMAL_MATERIALS[materialB];
  const capacityA = heatCapacity(massA, matA.specificHeat);
  const capacityB = heatCapacity(massB, matB.specificHeat);
  const pulseA = temperatureAfterHeat(
    initialA,
    addedHeat,
    massA,
    matA.specificHeat,
  );
  const pulseB = temperatureAfterHeat(
    initialB,
    addedHeat,
    massB,
    matB.specificHeat,
  );
  const equilibrium = equilibriumTemperature(
    initialA,
    capacityA,
    initialB,
    capacityB,
  );
  const progress = ease(clamp(time / 8, 0, 1));
  const tempA =
    mode === "pulse"
      ? initialA + (pulseA - initialA) * progress
      : initialA + (equilibrium - initialA) * progress;
  const tempB =
    mode === "pulse"
      ? initialB + (pulseB - initialB) * progress
      : initialB + (equilibrium - initialB) * progress;
  const transferJ =
    mode === "pulse" ? addedHeat * progress : capacityA * (tempA - initialA);
  const direction =
    initialA === initialB
      ? "No net heat flow"
      : initialA > initialB
        ? "A → B"
        : "B → A";
  const state =
    time === 0
      ? "READY"
      : time >= 8
        ? "RESULT"
        : running
          ? "RUNNING"
          : "PAUSED";

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(
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
    return () => window.clearInterval(timer);
  }, [running, reduced, speed]);

  const restart = () => {
    setTime(0);
    setRunning(false);
    setMissionFeedback("");
  };
  const change = <T,>(setter: (value: T) => void, value: T) => {
    setter(value);
    restart();
  };
  const reset = () => {
    setMode("pulse");
    setMaterialA("aluminium");
    setMaterialB("copper");
    setMassA(0.5);
    setMassB(1);
    setInitialA(20);
    setInitialB(20);
    setAddedHeat(9000);
    setTime(0);
    setRunning(false);
    setSpeed(1);
    setReduced(false);
    setMissionChoice("");
    setMissionFeedback("");
  };
  const missionOptions: MaterialId[] = ["copper", "aluminium", "water"];
  const missionEnergy = useMemo(
    () =>
      missionOptions.map((id) => ({
        id,
        energy: heatRequired(20, 60, 0.1, THERMAL_MATERIALS[id].specificHeat),
      })),
    [],
  );
  const missionBest = missionEnergy.reduce((best, item) =>
    item.energy < best.energy ? item : best,
  ).id;
  const checkMission = () => {
    if (!missionChoice) setMissionFeedback("Choose a sample first.");
    else
      setMissionFeedback(
        missionChoice === missionBest
          ? "Correct — copper has the lowest heat capacity here, so it needs the least energy."
          : "Not quite. Compare mc for the same mass and temperature rise.",
      );
  };
  const chartPoints = (which: "a" | "b") =>
    Array.from({ length: 25 }, (_, i) => {
      const p = ease(i / 24);
      const start = which === "a" ? initialA : initialB;
      const end =
        mode === "pulse" ? (which === "a" ? pulseA : pulseB) : equilibrium;
      const t = start + (end - start) * p;
      const y = 116 - clamp((t + 10) / 150, 0, 1) * 92;
      return `${18 + i * 7},${y.toFixed(1)}`;
    }).join(" ");
  const particles = (side: "a" | "b", temperature: number) =>
    Array.from({ length: 14 }, (_, i) => {
      const baseX = side === "a" ? 186 : 542;
      const x = baseX + ((i * 41) % 205);
      const y = 270 + ((i * 29) % 92);
      const activity = clamp((temperature + 10) / 120, 0.1, 1);
      const dx = Math.sin(i * 2.7 + time * 4) * 8 * activity;
      const dy = Math.cos(i * 1.9 + time * 3) * 7 * activity;
      return (
        <g key={`${side}-${i}`} transform={`translate(${x + dx} ${y + dy})`}>
          <circle
            r={4.2}
            fill={side === "a" ? matA.color : matB.color}
            stroke="#fff"
            strokeWidth="1.4"
          />
          <path
            d={`M-8 0 L${-11 - activity * 6} 0`}
            stroke={temperature > 55 ? "#e65324" : "#2087b8"}
            strokeWidth="1.5"
          />
        </g>
      );
    });

  return (
    <section
      className="heat-lab"
      aria-label={`${experiment.title} interactive lab`}
    >
      <header className="heat-hero">
        <div>
          <span>THERMAL-CONTACT BENCH · 2D</span>
          <h1>Heat is transfer. Temperature is a reading.</h1>
          <p>
            Give two samples the same energy—or let unequal temperatures reach
            equilibrium.
          </p>
        </div>
        <div className={`heat-status ${state.toLowerCase()}`}>{state}</div>
      </header>
      <div className="heat-layout">
        <aside className="heat-controls">
          <section className="heat-card">
            <p className="eyebrow">1 · INVESTIGATION</p>
            <div
              className="heat-mode"
              role="group"
              aria-label="Investigation mode"
            >
              <button
                className={mode === "pulse" ? "active" : ""}
                onClick={() => change(setMode, "pulse")}
              >
                Equal heat pulse
              </button>
              <button
                className={mode === "contact" ? "active" : ""}
                onClick={() => change(setMode, "contact")}
              >
                Thermal contact
              </button>
            </div>
            <p className="heat-hint">
              {mode === "pulse"
                ? "Both samples receive exactly the same Q. Their ΔT values need not match."
                : "No external heat: energy moves spontaneously from hotter to colder."}
            </p>
          </section>
          <section className="heat-card sample-a">
            <p className="eyebrow">SAMPLE A</p>
            <SelectMaterial
              label="Material A"
              value={materialA}
              onChange={(v) => change(setMaterialA, v)}
            />
            <Range
              label="Mass A"
              value={massA}
              min={0.1}
              max={2}
              step={0.1}
              unit="kg"
              onChange={(v) => change(setMassA, v)}
            />
            <Range
              label="Initial temperature A"
              value={initialA}
              min={-10}
              max={100}
              step={1}
              unit="°C"
              onChange={(v) => change(setInitialA, v)}
            />
          </section>
          <section className="heat-card sample-b">
            <p className="eyebrow">SAMPLE B</p>
            <SelectMaterial
              label="Material B"
              value={materialB}
              onChange={(v) => change(setMaterialB, v)}
            />
            <Range
              label="Mass B"
              value={massB}
              min={0.1}
              max={2}
              step={0.1}
              unit="kg"
              onChange={(v) => change(setMassB, v)}
            />
            <Range
              label="Initial temperature B"
              value={initialB}
              min={-10}
              max={100}
              step={1}
              unit="°C"
              onChange={(v) => change(setInitialB, v)}
            />
            {mode === "pulse" && (
              <Range
                label="Added heat to each"
                value={addedHeat}
                min={1000}
                max={20000}
                step={500}
                unit="J"
                onChange={(v) => change(setAddedHeat, v)}
              />
            )}
          </section>
        </aside>

        <main className="heat-main">
          <section className="heat-stage heat-card">
            <div className="heat-stage-head">
              <div>
                <span>LIVE 2D MODEL</span>
                <h2>
                  {mode === "pulse"
                    ? "Identical energy, different response"
                    : "Heat flows toward equilibrium"}
                </h2>
              </div>
              <div className="heat-scale">
                {tempA.toFixed(1)} °C <i /> {tempB.toFixed(1)} °C
              </div>
            </div>
            <div className="heat-visual">
              <img
                src="/assets/experiments/heat-and-temperature/thermal-contact-apparatus.png"
                alt="Two insulated sample blocks on a thermal bench"
              />
              <img
                className={`heat-fx heat-fx-a ${running ? "live" : ""}`}
                src="/assets/experiments/heat-and-temperature/concept-effect.png"
                alt=""
                aria-hidden="true"
                style={{
                  opacity: 0.08 + clamp((tempA + 10) / 130, 0, 1) * 0.22,
                }}
              />
              <img
                className={`heat-fx heat-fx-b ${running ? "live" : ""}`}
                src="/assets/experiments/heat-and-temperature/interaction-overlay.png"
                alt=""
                aria-hidden="true"
                style={{
                  opacity: 0.08 + clamp((tempB + 10) / 130, 0, 1) * 0.22,
                }}
              />
              <svg
                viewBox="0 0 900 500"
                role="img"
                aria-label={`Sample A ${tempA.toFixed(1)} degrees Celsius; sample B ${tempB.toFixed(1)} degrees Celsius`}
              >
                <defs>
                  <linearGradient id="thermA" x1="0" y1="1" x2="0" y2="0">
                    <stop stopColor="#258bc1" />
                    <stop offset="1" stopColor="#ed4e28" />
                  </linearGradient>
                  <marker
                    id="heatArrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M0 0L8 4L0 8Z" fill="#f36b21" />
                  </marker>
                </defs>
                <rect
                  x="273"
                  y={227 - clamp((tempA + 10) / 130, 0, 1) * 105}
                  width="9"
                  height={clamp((tempA + 10) / 130, 0, 1) * 105}
                  rx="4"
                  fill="url(#thermA)"
                />
                <circle
                  cx="277.5"
                  cy="231"
                  r="9"
                  fill={tempA > 50 ? "#e65027" : "#238bc0"}
                />
                <rect
                  x="630"
                  y={227 - clamp((tempB + 10) / 130, 0, 1) * 105}
                  width="9"
                  height={clamp((tempB + 10) / 130, 0, 1) * 105}
                  rx="4"
                  fill="url(#thermA)"
                />
                <circle
                  cx="634.5"
                  cy="231"
                  r="9"
                  fill={tempB > 50 ? "#e65027" : "#238bc0"}
                />
                {particles("a", tempA)}
                {particles("b", tempB)}
                <g
                  className={running ? "heat-flow live" : "heat-flow"}
                  opacity={time > 0 ? 1 : 0}
                >
                  {mode === "pulse" ? (
                    <>
                      <path d="M275 450V398" markerEnd="url(#heatArrow)" />
                      <path d="M635 450V398" markerEnd="url(#heatArrow)" />
                    </>
                  ) : (
                    initialA !== initialB && (
                      <path
                        d={
                          initialA > initialB ? "M405 327H500" : "M500 327H405"
                        }
                        markerEnd="url(#heatArrow)"
                      />
                    )
                  )}
                </g>
                <g className="heat-label" transform="translate(160 373)">
                  <rect width="250" height="64" rx="10" />
                  <text x="15" y="24">
                    A · {matA.name} · {massA.toFixed(1)} kg
                  </text>
                  <text x="15" y="48">
                    C = {capacityA.toFixed(0)} J/K · ΔT{" "}
                    {(tempA - initialA).toFixed(1)} °C
                  </text>
                </g>
                <g className="heat-label" transform="translate(515 373)">
                  <rect width="250" height="64" rx="10" />
                  <text x="15" y="24">
                    B · {matB.name} · {massB.toFixed(1)} kg
                  </text>
                  <text x="15" y="48">
                    C = {capacityB.toFixed(0)} J/K · ΔT{" "}
                    {(tempB - initialB).toFixed(1)} °C
                  </text>
                </g>
              </svg>
            </div>
            <div className="heat-transport">
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
              <label className="check">
                <input
                  type="checkbox"
                  checked={reduced}
                  onChange={(e) => setReduced(e.target.checked)}
                />{" "}
                Reduced motion
              </label>
            </div>
            <label className="heat-scrub">
              <span>{time.toFixed(1)} s</span>
              <input
                aria-label="Experiment timeline"
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
          <section className="heat-explain heat-card">
            <b>{mode === "pulse" ? "Same Q, unequal ΔT" : direction}</b>
            <span>
              {mode === "pulse"
                ? `ΔT = Q/(mc). ${capacityA < capacityB ? "A" : capacityB < capacityA ? "B" : "Both"} has ${capacityA === capacityB ? "the same" : "the smaller"} heat capacity.`
                : `Predicted equilibrium: ${equilibrium.toFixed(2)} °C. It lies between the starting temperatures.`}
            </span>
            <code>Q = mcΔT</code>
          </section>
        </main>

        <aside className="heat-analysis">
          <section className="heat-card">
            <p className="eyebrow">LIVE READOUTS</p>
            <div className="heat-read">
              <span>Temperature A</span>
              <b className="red">{tempA.toFixed(2)} °C</b>
              <span>Temperature B</span>
              <b className="blue">{tempB.toFixed(2)} °C</b>
              <span>{mode === "pulse" ? "Heat into each" : "Heat into A"}</span>
              <b>
                {transferJ >= 0 ? "+" : ""}
                {(transferJ / 1000).toFixed(2)} kJ
              </b>
              <span>Direction</span>
              <b>{mode === "pulse" ? "source → A & B" : direction}</b>
            </div>
            <div className="heat-scales">
              <span>{celsiusToKelvin(tempA).toFixed(2)} K</span>
              <span>{celsiusToFahrenheit(tempA).toFixed(1)} °F</span>
            </div>
          </section>
          <section className="heat-card">
            <p className="eyebrow">TEMPERATURE vs TIME</p>
            <svg
              className="heat-chart"
              viewBox="0 0 205 138"
              role="img"
              aria-label="Temperature versus time graph"
            >
              <path d="M18 10V116H198" />
              <path d="M18 70H198" className="grid" />
              <polyline points={chartPoints("a")} className="line-a" />
              <polyline points={chartPoints("b")} className="line-b" />
              <circle
                cx={18 + progress * 168}
                cy={116 - clamp((tempA + 10) / 150, 0, 1) * 92}
                r="3"
                className="dot-a"
              />
              <circle
                cx={18 + progress * 168}
                cy={116 - clamp((tempB + 10) / 150, 0, 1) * 92}
                r="3"
                className="dot-b"
              />
              <text x="2" y="12">
                T
              </text>
              <text x="183" y="132">
                time
              </text>
            </svg>
            <div className="legend">
              <span className="red">— A</span>
              <span className="blue">— B</span>
            </div>
          </section>
          <section className="heat-card heat-mission">
            <p className="eyebrow">LEARNER CHALLENGE</p>
            <h2>Reach 60 °C with least energy</h2>
            <p>
              Each sample is 0.10 kg and starts at 20 °C. Which needs the
              smallest Q?
            </p>
            <div className="mission-options">
              {missionEnergy.map(({ id, energy }) => (
                <button
                  key={id}
                  className={missionChoice === id ? "selected" : ""}
                  onClick={() => {
                    setMissionChoice(id);
                    setMissionFeedback("");
                  }}
                >
                  <b>{THERMAL_MATERIALS[id].name}</b>
                  <span>{(energy / 1000).toFixed(2)} kJ</span>
                </button>
              ))}
            </div>
            <button className="primary full" onClick={checkMission}>
              Check choice
            </button>
            {missionFeedback && (
              <p
                className={
                  missionChoice === missionBest ? "success" : "feedback"
                }
                role="status"
              >
                {missionFeedback}
              </p>
            )}
          </section>
          <button className="heat-reset" onClick={reset}>
            Reset entire lab
          </button>
        </aside>
      </div>
      <footer className="heat-foot">
        <b>Model boundary</b>
        <span>
          Samples are internally uniform, specific heat is constant, and the
          bench is insulated. “Energy at a temperature” needs a reference state;
          the model reports transferred heat instead.
        </span>
      </footer>
    </section>
  );
}
