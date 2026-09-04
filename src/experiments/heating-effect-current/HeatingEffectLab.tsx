import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  advanceHeating,
  AMBIENT_TEMPERATURE,
  computeHeatingResult,
  DEFAULT_HEATING_INPUT,
  INITIAL_HEATING_STATE,
  MATERIALS,
  normalizeHeatingInput,
  simulateHeatingProfile,
  type HeatingInput,
  type HeatingState,
  type WireMaterial,
} from "./heatingEffectPhysics";
import "./heating-effect-current.css";

const ROOT = "/assets/experiments/heating-effect-current";
type RunState = "idle" | "running" | "paused" | "cooling" | "result";

export function HeatingEffectLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState<HeatingInput>(DEFAULT_HEATING_INPUT);
  const [state, setState] = useState<HeatingState>(INITIAL_HEATING_STATE);
  const [runState, setRunState] = useState<RunState>("idle");
  const [playback, setPlayback] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(
    () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  const [prediction, setPrediction] = useState(60);
  const [predictionFeedback, setPredictionFeedback] = useState("");
  const [missionFeedback, setMissionFeedback] = useState("");

  const result = useMemo(
    () => computeHeatingResult(input, state),
    [input, state],
  );
  const profile = useMemo(() => simulateHeatingProfile(input), [input]);
  const projected = profile[profile.length - 1] ?? {
    ...INITIAL_HEATING_STATE,
    ...computeHeatingResult(input, INITIAL_HEATING_STATE),
  };

  useEffect(() => {
    if (runState !== "running" && runState !== "cooling") return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const realDelta = Math.min(0.08, (now - previous) / 1000);
      previous = now;
      const simulationDelta =
        realDelta * 12 * playback * (reducedMotion ? 0.35 : 1);
      setState((current) => {
        let next = current;
        let remaining = simulationDelta;
        while (remaining > 0) {
          const slice = Math.min(1, remaining);
          next = advanceHeating(input, next, slice, runState === "running");
          remaining -= slice;
        }
        const nextResult = computeHeatingResult(input, next);
        if (
          next.temperature >= nextResult.meltingPoint ||
          next.temperature >= nextResult.safeLimit + 30
        ) {
          setRunState("result");
        } else if (runState === "running" && next.elapsed >= input.duration) {
          setRunState("result");
        } else if (
          runState === "cooling" &&
          next.temperature <= AMBIENT_TEMPERATURE + 0.15
        ) {
          setRunState("idle");
        }
        return next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [runState, input, playback, reducedMotion]);

  const update = <K extends keyof HeatingInput>(
    key: K,
    value: HeatingInput[K],
  ) => {
    setInput((current) => normalizeHeatingInput({ ...current, [key]: value }));
    if (state.elapsed > 0) {
      setState(INITIAL_HEATING_STATE);
      setRunState("idle");
      setMissionFeedback("");
      setPredictionFeedback("");
    }
  };
  const reset = () => {
    setInput(DEFAULT_HEATING_INPUT);
    setState(INITIAL_HEATING_STATE);
    setRunState("idle");
    setMissionFeedback("");
    setPredictionFeedback("");
  };
  const play = () => {
    if (runState === "result") setState(INITIAL_HEATING_STATE);
    setRunState("running");
  };
  const step = () => {
    setRunState("paused");
    setState((current) => advanceHeating(input, current, 5, true));
  };
  const missionComplete =
    Math.abs(state.temperature - result.targetTemperature) <= 2 &&
    state.temperature < result.safeLimit &&
    result.status !== "melted";
  const temperatureRatio = Math.max(
    0,
    Math.min(1, (state.temperature - AMBIENT_TEMPERATURE) / 110),
  );
  const powerOn = runState === "running";
  const glow = `hsl(${Math.max(0, 34 - temperatureRatio * 34)} 100% ${55 + temperatureRatio * 12}%)`;

  return (
    <section
      className="joule-lab"
      data-ui-theme="light"
      data-run-state={runState}
      aria-label={`${experiment.title} interactive laboratory`}
      style={
        {
          "--heat": temperatureRatio,
          "--wire-color": glow,
          "--electron-speed": `${Math.max(0.35, 3.2 - input.current * 0.5)}s`,
          "--jitter": `${Math.min(5, temperatureRatio * 5)}px`,
        } as CSSProperties
      }
    >
      <header className="joule-head">
        <div>
          <span>ELECTRICITY · CLASS 7 / CLASS 10</span>
          <h2>Joule Heating Calorimeter</h2>
          <p>
            See electrical energy become thermal energy through lattice
            collisions.
          </p>
        </div>
        <div>
          <button
            onClick={() => setRunState("cooling")}
            disabled={state.temperature <= AMBIENT_TEMPERATURE + 0.1}
          >
            ◌ Switch off & cool
          </button>
          <button onClick={reset}>↻ Reset experiment</button>
        </div>
      </header>

      <div className="joule-layout">
        <aside className="joule-controls" aria-label="Heating controls">
          <h3>Apparatus controls</h3>
          <Control
            label="Current"
            value={input.current}
            min={0}
            max={5}
            step={0.1}
            unit="A"
            onChange={(value) => update("current", value)}
          />
          <Control
            label="Reference resistance"
            value={input.referenceResistance}
            min={0.5}
            max={20}
            step={0.5}
            unit="Ω"
            onChange={(value) => update("referenceResistance", value)}
          />
          <label className="joule-select">
            <span>Wire material</span>
            <select
              aria-label="Wire material"
              value={input.material}
              onChange={(event) =>
                update("material", event.target.value as WireMaterial)
              }
            >
              {(Object.keys(MATERIALS) as WireMaterial[]).map((material) => (
                <option key={material}>{material}</option>
              ))}
            </select>
          </label>
          <Control
            label="Wire diameter"
            value={input.diameter}
            min={0.2}
            max={2}
            step={0.1}
            unit="mm"
            onChange={(value) => update("diameter", value)}
          />
          <Control
            label="Experiment time"
            value={input.duration}
            min={10}
            max={300}
            step={10}
            unit="s"
            digits={0}
            onChange={(value) => update("duration", value)}
          />
          <div className="joule-presets">
            <button
              onClick={() =>
                setInput({
                  ...DEFAULT_HEATING_INPUT,
                  current: 0,
                  referenceResistance: 0.5,
                  diameter: 2,
                  duration: 10,
                })
              }
            >
              Minimum setup
            </button>
            <button onClick={() => setInput(DEFAULT_HEATING_INPUT)}>
              Typical setup
            </button>
            <button
              onClick={() =>
                setInput({
                  ...DEFAULT_HEATING_INPUT,
                  current: 5,
                  referenceResistance: 20,
                  diameter: 0.2,
                  duration: 300,
                })
              }
            >
              Maximum setup
            </button>
          </div>
          <div className={`joule-safety ${result.status}`}>
            <strong>
              {result.status === "melted"
                ? "Wire melted"
                : state.temperature >= result.safeLimit
                  ? "Unsafe temperature"
                  : "Temperature safe"}
            </strong>
            <span>
              Safe limit {result.safeLimit.toFixed(0)} °C · melting point{" "}
              {result.meltingPoint.toFixed(0)} °C
            </span>
          </div>
        </aside>

        <main className="joule-main">
          <div className="joule-transport">
            <div>
              <button
                aria-label={
                  runState === "result" ? "Replay heating" : "Play heating"
                }
                onClick={play}
                disabled={runState === "running"}
              >
                ▶ {runState === "result" ? "Replay" : "Play"}
              </button>
              <button
                aria-label="Pause heating"
                onClick={() => setRunState("paused")}
                disabled={runState !== "running" && runState !== "cooling"}
              >
                Ⅱ Pause
              </button>
              <button aria-label="Step heating five seconds" onClick={step}>
                ▮▶ Step +5 s
              </button>
            </div>
            <span className={`joule-run-state ${runState}`}>
              {runState} · {state.elapsed.toFixed(0)} / {input.duration} s
            </span>
          </div>

          <div className="joule-stage">
            <img
              className="joule-apparatus"
              src={`${ROOT}/joule-calorimeter.png`}
              alt="Power supply connected to a resistance coil immersed in an insulated water calorimeter with thermometer and thermal camera"
            />
            <div className="joule-screen joule-supply-screen">
              <strong>{input.current.toFixed(2)} A</strong>
              <span>{result.power.toFixed(1)} W</span>
            </div>
            <div className="joule-screen joule-thermometer-screen">
              {state.temperature.toFixed(1)} °C
            </div>
            <div
              className="joule-thermal-overlay"
              aria-hidden="true"
              style={{ opacity: 0.06 + temperatureRatio * 0.7 }}
            >
              <img src={`${ROOT}/effects/interaction_overlay.png`} alt="" />
            </div>
            <div
              className="joule-wire-model"
              aria-label="Electron and lattice view of the resistance wire"
            >
              <div className="joule-wire-line" />
              {Array.from({ length: 15 }, (_, index) => (
                <i
                  className="joule-atom"
                  key={`atom-${index}`}
                  style={{
                    left: `${6 + index * 6.3}%`,
                    animationDelay: `${-index * 0.07}s`,
                  }}
                />
              ))}
              {Array.from({ length: 9 }, (_, index) => (
                <b
                  className="joule-electron"
                  key={`electron-${index}`}
                  style={{ animationDelay: `${-index * 0.32}s` }}
                >
                  −
                </b>
              ))}
            </div>
            <div className="joule-collision-note">
              {powerOn && input.current > 0
                ? `Electrons drift through ${input.material.toLowerCase()} and transfer energy in collisions.`
                : state.temperature > AMBIENT_TEMPERATURE + 0.5
                  ? "Current is off; the wire transfers stored thermal energy to its surroundings."
                  : "Switch on current to begin electron–lattice energy transfer."}
            </div>
          </div>

          <div className="joule-equations">
            <div>
              <span>Electrical input</span>
              <strong>H = I²Rt</strong>
              <small>{state.inputEnergy.toFixed(1)} J</small>
            </div>
            <div>
              <span>Stored thermal energy</span>
              <strong>Q = CΔT</strong>
              <small>{result.storedHeat.toFixed(1)} J</small>
            </div>
            <div>
              <span>Thermal loss</span>
              <strong>∫k(T−Tₐ)dt</strong>
              <small>{state.heatLoss.toFixed(1)} J</small>
            </div>
          </div>
        </main>

        <aside className="joule-readouts" aria-label="Live measurements">
          <h3>Live measurements</h3>
          <Readout
            icon="♨"
            label="Temperature θ"
            value={state.temperature}
            unit="°C"
          />
          <Readout icon="⚡" label="Current I" value={input.current} unit="A" />
          <Readout
            icon="〽"
            label="Resistance R(T)"
            value={result.effectiveResistance}
            unit="Ω"
          />
          <Readout icon="◷" label="Time t" value={state.elapsed} unit="s" />
          <Readout
            icon="▣"
            label="Energy input"
            value={state.inputEnergy}
            unit="J"
          />
          <Readout icon="⌁" label="Heat loss" value={state.heatLoss} unit="J" />
          <Readout
            icon="✓"
            label="Energy residual"
            value={result.energyResidual}
            unit="J"
          />
          <div className="joule-efficiency">
            <span>Stored / input</span>
            <strong>{(result.efficiency * 100).toFixed(1)}%</strong>
          </div>
        </aside>
      </div>

      <div className="joule-bottom">
        <section>
          <span>PREDICTION</span>
          <h3>Predict the final wire temperature</h3>
          <label>
            Your prediction
            <input
              aria-label="Predicted final temperature"
              type="number"
              min={25}
              max={500}
              value={prediction}
              onChange={(event) => setPrediction(Number(event.target.value))}
            />
            °C
          </label>
          <button
            onClick={() =>
              setPredictionFeedback(
                `Projected: ${projected.temperature.toFixed(1)} °C · error ${Math.abs(prediction - projected.temperature).toFixed(1)} °C`,
              )
            }
          >
            Check prediction
          </button>
          {predictionFeedback && <p aria-live="polite">{predictionFeedback}</p>}
        </section>
        <section className="joule-chart-section">
          <span>TEMPERATURE & ENERGY VS TIME</span>
          <HeatingChart
            profile={profile}
            elapsed={state.elapsed}
            duration={input.duration}
          />
        </section>
        <section className={missionComplete ? "complete" : ""}>
          <span>MINI-MISSION</span>
          <h3>
            Reach {result.targetTemperature.toFixed(0)} °C without exceeding the
            safe limit
          </h3>
          <p>
            Adjust current, resistance, material, diameter and duration, then
            heat the wire.
          </p>
          <button
            onClick={() =>
              setMissionFeedback(
                missionComplete
                  ? `✓ Target reached at ${state.temperature.toFixed(1)} °C; wire remains intact.`
                  : state.temperature >= result.safeLimit
                    ? "Too hot—switch off, cool, and reduce power."
                    : `Keep heating: target band is ${(result.targetTemperature - 2).toFixed(0)}–${(result.targetTemperature + 2).toFixed(0)} °C.`,
              )
            }
          >
            Check target
          </button>
          {missionFeedback && <p aria-live="polite">{missionFeedback}</p>}
        </section>
      </div>

      <footer className="joule-footer">
        <div>
          <button
            aria-label="Resume heating from footer"
            onClick={play}
            disabled={runState === "running"}
          >
            ▶ Resume
          </button>
          <button
            aria-label="Pause heating from footer"
            onClick={() => setRunState("paused")}
            disabled={runState !== "running" && runState !== "cooling"}
          >
            Ⅱ Pause
          </button>
          <button aria-label="Step heating from footer" onClick={step}>
            ▮▶ Step
          </button>
        </div>
        <label>
          Speed
          <select
            aria-label="Playback speed"
            value={playback}
            onChange={(event) => setPlayback(Number(event.target.value))}
          >
            {[0.25, 0.5, 1, 1.5, 2].map((value) => (
              <option key={value} value={value}>
                {value}×
              </option>
            ))}
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(event) => setReducedMotion(event.target.checked)}
          />{" "}
          Reduced motion
        </label>
        <span>
          Input = stored heat + loss · residual{" "}
          {result.energyResidual.toExponential(1)} J
        </span>
      </footer>
      <p className="sr-only" aria-live="polite">
        Temperature {state.temperature.toFixed(1)} degrees Celsius. Effective
        resistance {result.effectiveResistance.toFixed(2)} ohms. Power{" "}
        {result.power.toFixed(1)} watts. Input energy{" "}
        {state.inputEnergy.toFixed(1)} joules, stored heat{" "}
        {result.storedHeat.toFixed(1)} joules, thermal loss{" "}
        {state.heatLoss.toFixed(1)} joules.
      </p>
    </section>
  );
}

function Control({
  label,
  value,
  min,
  max,
  step,
  unit,
  digits = 2,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  digits?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="joule-control">
      <span>
        <b>{label}</b>
        <strong>
          {value.toFixed(digits)} {unit}
        </strong>
      </span>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <small>
        {min} — {max} {unit}
      </small>
    </label>
  );
}

function Readout({
  icon,
  label,
  value,
  unit,
}: {
  icon: string;
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="joule-readout">
      <i>{icon}</i>
      <span>{label}</span>
      <strong>
        {Math.abs(value) < 0.005 ? "0.00" : value.toFixed(2)} {unit}
      </strong>
    </div>
  );
}

function HeatingChart({
  profile,
  elapsed,
  duration,
}: {
  profile: ReturnType<typeof simulateHeatingProfile>;
  elapsed: number;
  duration: number;
}) {
  const width = 470,
    height = 155;
  const maxTemperature = Math.max(
    ...profile.map((point) => point.temperature),
    60,
  );
  const maxEnergy = Math.max(...profile.map((point) => point.inputEnergy), 1);
  const temperature = profile
    .map(
      (point) =>
        `${(point.elapsed / duration) * width},${height - ((point.temperature - 20) / (maxTemperature - 20)) * (height - 16)}`,
    )
    .join(" ");
  const energy = profile
    .map(
      (point) =>
        `${(point.elapsed / duration) * width},${height - (point.inputEnergy / maxEnergy) * (height - 16)}`,
    )
    .join(" ");
  return (
    <svg
      className="joule-chart"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Temperature and electrical input energy versus time"
    >
      <line
        className="axis"
        x1="0"
        y1={height - 1}
        x2={width}
        y2={height - 1}
      />
      <polyline className="temperature" points={temperature} />
      <polyline className="energy" points={energy} />
      <line
        className="cursor"
        x1={(elapsed / duration) * width}
        y1="0"
        x2={(elapsed / duration) * width}
        y2={height}
      />
      <text x="8" y="15">
        temperature
      </text>
      <text x="8" y="31">
        energy input
      </text>
    </svg>
  );
}
