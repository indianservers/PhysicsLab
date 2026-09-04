import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  maxwellSpeedDensity,
  processWorkJ,
  solveGasState,
  type GasProcessMode,
} from "./gas-lawsSimulation";
import "./gas-laws.css";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const ease = (value: number) => value * value * (3 - 2 * value);
const frac = (value: number) => value - Math.floor(value);
const path = (points: { x: number; y: number }[]) =>
  points
    .map(
      (point, index) =>
        `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`,
    )
    .join(" ");

function Range({
  label,
  value,
  min,
  max,
  step,
  unit,
  disabled = false,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  const decimals = step < 0.1 ? 2 : step < 1 ? 1 : 0;
  const key = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
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
    <label className={`gas-range ${disabled ? "locked" : ""}`}>
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
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        onKeyDown={key}
      />
      {disabled && <small>Locked by process mode</small>}
    </label>
  );
}

const reflected = (value: number, min: number, max: number) => {
  const span = max - min;
  const wrapped = (((value - min) % (2 * span)) + 2 * span) % (2 * span);
  return wrapped <= span ? min + wrapped : max - (wrapped - span);
};

const modeCopy: Record<
  GasProcessMode,
  { lock: string; name: string; law: string; cue: string }
> = {
  isothermal: {
    lock: "T",
    name: "Isothermal",
    law: "Boyle: PV = constant",
    cue: "The run compresses the gas while temperature stays fixed.",
  },
  isobaric: {
    lock: "P",
    name: "Isobaric",
    law: "Charles: V/T = constant",
    cue: "The run heats the gas and the piston rises to hold pressure.",
  },
  isochoric: {
    lock: "V",
    name: "Isochoric",
    law: "Pressure law: P/T = constant",
    cue: "The run heats the trapped gas at fixed volume.",
  },
};

interface ParticlePoint {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  colliding: boolean;
}

export function GasLawsLab({ experiment }: DedicatedExperimentLabProps) {
  const [mode, setMode] = useState<GasProcessMode>("isothermal");
  const [temperatureK, setTemperatureK] = useState(350);
  const [volumeL, setVolumeL] = useState(2.5);
  const [particleCount, setParticleCount] = useState(200);
  const [lockedTemperatureK, setLockedTemperatureK] = useState(350);
  const [lockedPressureKPa, setLockedPressureKPa] = useState(101.325);
  const [lockedVolumeL, setLockedVolumeL] = useState(2.5);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reduced, setReduced] = useState(false);
  const [showVectors, setShowVectors] = useState(true);
  const [showCollisions, setShowCollisions] = useState(true);
  const [graphMode, setGraphMode] = useState<"pv" | "pt">("pv");
  const [selectedParticle, setSelectedParticle] = useState(0);
  const [missionActive, setMissionActive] = useState(false);
  const [missionPrediction, setMissionPrediction] = useState("");
  const [missionFeedback, setMissionFeedback] = useState("");

  const progress = clamp(time / 8, 0, 1);
  const runProgress = ease(progress);
  const requestedTemperatureK =
    mode === "isothermal"
      ? temperatureK
      : temperatureK + Math.min(150, 600 - temperatureK) * runProgress;
  const requestedVolumeL =
    mode === "isothermal"
      ? Math.max(0.75, volumeL * (1 - 0.35 * runProgress))
      : volumeL;

  const baseInput = useMemo(
    () => ({
      mode,
      requestedTemperatureK: temperatureK,
      requestedVolumeL: volumeL,
      particleCount,
      lockedTemperatureK,
      lockedPressureKPa,
      lockedVolumeL,
    }),
    [
      mode,
      temperatureK,
      volumeL,
      particleCount,
      lockedTemperatureK,
      lockedPressureKPa,
      lockedVolumeL,
    ],
  );
  const baseState = solveGasState(baseInput);
  const state = solveGasState({
    ...baseInput,
    requestedTemperatureK,
    requestedVolumeL,
  });

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

  const resetRun = () => {
    setTime(0);
    setRunning(false);
  };
  const changeStart = (setter: (value: number) => void, value: number) => {
    setter(value);
    resetRun();
    setMissionFeedback("");
  };
  const selectMode = (next: GasProcessMode) => {
    setTemperatureK(state.temperatureK);
    setVolumeL(state.volumeL);
    setLockedTemperatureK(state.temperatureK);
    setLockedPressureKPa(state.pressureKPa);
    setLockedVolumeL(state.volumeL);
    setMode(next);
    setMissionActive(false);
    setMissionPrediction("");
    setMissionFeedback("");
    resetRun();
  };
  const reset = () => {
    setMode("isothermal");
    setTemperatureK(350);
    setVolumeL(2.5);
    setParticleCount(200);
    setLockedTemperatureK(350);
    setLockedPressureKPa(101.325);
    setLockedVolumeL(2.5);
    setTime(0);
    setRunning(false);
    setSpeed(1);
    setReduced(false);
    setShowVectors(true);
    setShowCollisions(true);
    setGraphMode("pv");
    setSelectedParticle(0);
    setMissionActive(false);
    setMissionPrediction("");
    setMissionFeedback("");
  };

  const chamber = {
    left: 284,
    right: 620,
    bottom: 500,
    pistonY: 227 + (1 - (state.volumeL - 0.75) / 5.75) * 207,
  };
  const particleSpeed = 44 * Math.sqrt(state.temperatureK / 350);
  const visibleParticles = Math.round(particleCount / 5);
  const particles = useMemo<ParticlePoint[]>(() => {
    const top = chamber.pistonY + 16;
    const left = chamber.left + 12;
    const right = chamber.right - 12;
    const bottom = chamber.bottom - 12;
    return Array.from({ length: visibleParticles }, (_, id) => {
      const x0 =
        left + frac(Math.sin((id + 1) * 91.73) * 43758.5) * (right - left);
      const y0 =
        top + frac(Math.sin((id + 1) * 47.11) * 24634.6) * (bottom - top);
      const angle = frac(Math.sin((id + 1) * 13.17) * 12587.3) * Math.PI * 2;
      const magnitude = particleSpeed * (0.72 + (id % 7) * 0.055);
      const vx = Math.cos(angle) * magnitude;
      const vy = Math.sin(angle) * magnitude;
      const x = reflected(x0 + vx * time, left, right);
      const y = reflected(y0 + vy * time, top, bottom);
      return {
        id,
        x,
        y,
        vx,
        vy,
        colliding:
          x - left < 7 || right - x < 7 || y - top < 7 || bottom - y < 7,
      };
    });
  }, [
    chamber.bottom,
    chamber.left,
    chamber.pistonY,
    chamber.right,
    particleSpeed,
    time,
    visibleParticles,
  ]);

  const workJ = processWorkJ(
    mode,
    state.amountMol,
    baseState.temperatureK,
    baseState.pressureKPa,
    baseState.volumeL,
    state.volumeL,
  );
  const invariantDrift =
    Math.abs(state.invariantValue - baseState.invariantValue) /
    Math.max(Math.abs(baseState.invariantValue), 1e-12);

  const theoretical = Array.from({ length: 51 }, (_, index) => {
    const fraction = index / 50;
    if (mode === "isothermal") {
      const volume = 0.75 + fraction * 5.75;
      const pressure =
        (state.amountMol * 8.31446261815324 * state.temperatureK) / volume;
      return { volume, temperature: state.temperatureK, pressure };
    }
    if (mode === "isobaric") {
      const temperature = 250 + fraction * 350;
      const volume =
        (state.amountMol * 8.31446261815324 * temperature) / lockedPressureKPa;
      return { volume, temperature, pressure: lockedPressureKPa };
    }
    const temperature = 250 + fraction * 350;
    const pressure =
      (state.amountMol * 8.31446261815324 * temperature) / state.volumeL;
    return { volume: state.volumeL, temperature, pressure };
  });
  const pMax = Math.max(
    220,
    state.pressureKPa * 1.18,
    ...theoretical.map((point) => point.pressure * 1.05),
  );
  const graphX = (value: number) =>
    graphMode === "pv"
      ? 38 + ((value - 0.75) / 5.75) * 292
      : 38 + ((value - 250) / 350) * 292;
  const graphY = (pressure: number) =>
    178 - (clamp(pressure, 0, pMax) / pMax) * 150;
  const graphPoints = theoretical.map((point) => ({
    x: graphX(graphMode === "pv" ? point.volume : point.temperature),
    y: graphY(point.pressure),
  }));
  const currentGraphX = graphX(
    graphMode === "pv" ? state.volumeL : state.temperatureK,
  );
  const currentGraphY = graphY(state.pressureKPa);

  const speedSamples = Array.from({ length: 61 }, (_, index) => {
    const speedMS = index * 20;
    return {
      speedMS,
      density: maxwellSpeedDensity(speedMS, state.temperatureK),
    };
  });
  const maxDensity = Math.max(...speedSamples.map((sample) => sample.density));
  const speedPath = path(
    speedSamples.map((sample) => ({
      x: 36 + (sample.speedMS / 1200) * 294,
      y: 128 - (sample.density / maxDensity) * 98,
    })),
  );

  const updatePistonVolume = (value: number) => {
    changeStart(setVolumeL, value);
    if (mode === "isochoric") setLockedVolumeL(value);
  };
  const pistonControlKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (mode === "isobaric") return;
    let next: number | undefined;
    if (event.key === "Home") next = 0.75;
    if (event.key === "End") next = 6.5;
    if (["ArrowDown", "ArrowLeft"].includes(event.key)) next = volumeL - 0.05;
    if (["ArrowUp", "ArrowRight"].includes(event.key)) next = volumeL + 0.05;
    if (next === undefined) return;
    event.preventDefault();
    updatePistonVolume(clamp(Number(next.toFixed(2)), 0.75, 6.5));
  };

  const startMission = () => {
    setMode("isothermal");
    setTemperatureK(350);
    setLockedTemperatureK(350);
    setParticleCount(200);
    setVolumeL(4);
    setLockedVolumeL(4);
    const start = solveGasState({
      mode: "isothermal",
      requestedTemperatureK: 350,
      requestedVolumeL: 4,
      particleCount: 200,
      lockedTemperatureK: 350,
      lockedPressureKPa: 101.325,
      lockedVolumeL: 4,
    });
    setLockedPressureKPa(start.pressureKPa);
    setMissionActive(true);
    setMissionPrediction("");
    setMissionFeedback(
      "Compress from 4.00 L to 2.00 L without changing 350 K, then predict the final pressure.",
    );
    resetRun();
  };
  const checkMission = () => {
    const predicted = Number(missionPrediction);
    const target = solveGasState({
      ...baseInput,
      mode: "isothermal",
      requestedTemperatureK: 350,
      requestedVolumeL: 2,
      particleCount: 200,
      lockedTemperatureK: 350,
      lockedVolumeL: 4,
    }).pressureKPa;
    if (!missionPrediction || !Number.isFinite(predicted) || predicted <= 0) {
      setMissionFeedback("Enter a positive pressure prediction in kPa.");
      return;
    }
    if (Math.abs(volumeL - 2) > 0.06) {
      setMissionFeedback(
        `Move the piston to 2.00 L first; it is currently ${volumeL.toFixed(2)} L.`,
      );
      return;
    }
    const predictionError = Math.abs(predicted - target) / target;
    if (predictionError > 0.02) {
      setMissionFeedback(
        `Use P₁V₁=P₂V₂. Your prediction is ${Math.abs(predicted - target).toFixed(1)} kPa away.`,
      );
      return;
    }
    setMissionFeedback(
      `Mission complete — halving V doubled P to ${target.toFixed(1)} kPa while PV stayed constant.`,
    );
  };

  const status = running
    ? "RUNNING"
    : time >= 8
      ? "RESULT"
      : time > 0
        ? "PAUSED"
        : "READY";

  return (
    <section
      className="gas-lab"
      aria-label="Gas Laws and Kinetic Theory interactive laboratory"
    >
      <header className="gas-hero">
        <div>
          <span>THERMODYNAMICS · 2D MOLECULAR LAB</span>
          <h1>{experiment.title}</h1>
          <p>
            Connect molecular collisions to pressure, volume, and Kelvin
            temperature.
          </p>
        </div>
        <strong className={`gas-status ${status.toLowerCase()}`}>
          {status}
        </strong>
      </header>

      <div className="gas-layout">
        <aside className="gas-controls">
          <section className="gas-card">
            <h2>EXPERIMENT CONTROLS</h2>
            <p className="eyebrow">What is held constant?</p>
            <div
              className="gas-modes"
              role="group"
              aria-label="Gas process mode"
            >
              {(Object.keys(modeCopy) as GasProcessMode[]).map((key) => (
                <button
                  key={key}
                  className={mode === key ? "active" : ""}
                  aria-pressed={mode === key}
                  onClick={() => selectMode(key)}
                >
                  <small>LOCK</small>
                  <b>{modeCopy[key].lock}</b>
                  <span>{modeCopy[key].name}</span>
                </button>
              ))}
            </div>
            <div className="gas-law-cue">
              <b>{modeCopy[mode].law}</b>
              <span>{modeCopy[mode].cue}</span>
            </div>
            <Range
              label="Molecule count"
              value={particleCount}
              min={100}
              max={300}
              step={25}
              unit="display particles"
              onChange={(value) => changeStart(setParticleCount, value)}
            />
            <Range
              label="Piston volume"
              value={time > 0 || mode === "isobaric" ? state.volumeL : volumeL}
              min={0.75}
              max={6.5}
              step={0.05}
              unit="L"
              disabled={mode === "isobaric"}
              onChange={updatePistonVolume}
            />
            <Range
              label="Temperature"
              value={
                time > 0 || mode === "isothermal"
                  ? state.temperatureK
                  : temperatureK
              }
              min={250}
              max={600}
              step={5}
              unit="K"
              disabled={mode === "isothermal"}
              onChange={(value) => changeStart(setTemperatureK, value)}
            />
          </section>

          <section className="gas-card gas-prediction">
            <h2>ISOTHERMAL CHALLENGE</h2>
            <p>
              Compress the gas to half its starting volume and verify Boyle's
              law.
            </p>
            <button className="mission-start" onClick={startMission}>
              {missionActive ? "Restart challenge" : "Start challenge"}
            </button>
            {missionActive && (
              <>
                <div
                  className="mission-progress"
                  aria-label="Challenge progress"
                >
                  <span className={volumeL <= 3.95 ? "done" : ""}>
                    4.00 L start
                  </span>
                  <i />
                  <span className={Math.abs(volumeL - 2) <= 0.06 ? "done" : ""}>
                    2.00 L target
                  </span>
                </div>
                <label>
                  Predicted final pressure
                  <span>
                    <input
                      aria-label="Predicted final pressure"
                      type="number"
                      min="1"
                      step="0.1"
                      value={missionPrediction}
                      onChange={(event) =>
                        setMissionPrediction(event.target.value)
                      }
                    />
                    kPa
                  </span>
                </label>
                <button onClick={checkMission}>Check invariant</button>
              </>
            )}
            {missionFeedback && <p role="status">{missionFeedback}</p>}
          </section>
        </aside>

        <main className="gas-main">
          <section className="gas-stage gas-card">
            <div className="gas-stage-head">
              <div>
                <span>MOLECULAR PISTON CHAMBER</span>
                <h2>{modeCopy[mode].name} process</h2>
              </div>
              <div className="gas-formula">
                <small>GOVERNING EQUATION</small>
                <b>PV = nRT</b>
              </div>
            </div>
            <div className={`gas-canvas ${running ? "running" : ""}`}>
              <img
                src="/assets/experiments/gas-laws/gas-laws-apparatus.png"
                alt="Transparent two-dimensional gas piston chamber with pressure gauge and thermometer"
              />
              <div
                className="gas-effect cold"
                style={{
                  opacity: clamp((600 - state.temperatureK) / 700, 0.08, 0.28),
                }}
              />
              <div
                className="gas-effect hot"
                style={{
                  opacity: clamp((state.temperatureK - 200) / 1000, 0.05, 0.35),
                }}
              />
              <input
                className="piston-drag-control"
                aria-label="Drag piston"
                type="range"
                min="0.75"
                max="6.5"
                step="0.05"
                value={state.volumeL}
                disabled={mode === "isobaric"}
                onChange={(event) =>
                  updatePistonVolume(Number(event.target.value))
                }
                onKeyDown={pistonControlKey}
              />
              <svg
                viewBox="0 0 900 580"
                aria-label={`${status}; ${modeCopy[mode].name}; pressure ${state.pressureKPa.toFixed(1)} kilopascals; volume ${state.volumeL.toFixed(2)} litres; temperature ${state.temperatureK.toFixed(0)} kelvin`}
              >
                <defs>
                  <clipPath id="gasChamberClip">
                    <rect
                      x={chamber.left}
                      y={chamber.pistonY}
                      width={chamber.right - chamber.left}
                      height={chamber.bottom - chamber.pistonY}
                      rx="14"
                    />
                  </clipPath>
                </defs>
                <g clipPath="url(#gasChamberClip)">
                  <rect
                    className="gas-fill"
                    x={chamber.left}
                    y={chamber.pistonY}
                    width={chamber.right - chamber.left}
                    height={chamber.bottom - chamber.pistonY}
                  />
                  {particles.map((particle) => (
                    <g key={particle.id}>
                      {showVectors && (
                        <line
                          className="velocity-vector"
                          x1={particle.x}
                          y1={particle.y}
                          x2={particle.x + particle.vx * 0.13}
                          y2={particle.y + particle.vy * 0.13}
                        />
                      )}
                      {showCollisions && particle.colliding && (
                        <circle
                          className="collision-flash"
                          cx={particle.x}
                          cy={particle.y}
                          r="12"
                        />
                      )}
                      <circle
                        className={
                          selectedParticle === particle.id
                            ? "molecule selected"
                            : "molecule"
                        }
                        cx={particle.x}
                        cy={particle.y}
                        r={selectedParticle === particle.id ? 6.5 : 4.5}
                        aria-hidden="true"
                        onClick={() => setSelectedParticle(particle.id)}
                      />
                    </g>
                  ))}
                </g>
                <g
                  className={`piston-target ${mode === "isobaric" ? "automatic" : ""}`}
                  aria-hidden="true"
                >
                  <rect
                    x={chamber.left - 5}
                    y={chamber.pistonY - 8}
                    width={chamber.right - chamber.left + 10}
                    height="18"
                    rx="7"
                  />
                  <line
                    x1={(chamber.left + chamber.right) / 2}
                    y1="188"
                    x2={(chamber.left + chamber.right) / 2}
                    y2={chamber.pistonY - 8}
                  />
                  <path
                    className="drag-cue"
                    d={`M${chamber.right - 26} ${chamber.pistonY - 28}v-20m0 0-7 8m7-8 7 8m-7 28 7-8m-7 8-7-8`}
                  />
                </g>
                <g
                  className="gauge-needle"
                  transform={`rotate(${clamp(-122 + state.pressureKPa * 0.48, -122, 122)} 169 245)`}
                >
                  <line x1="169" y1="245" x2="169" y2="181" />
                  <circle cx="169" cy="245" r="5" />
                </g>
                <rect
                  className="thermometer-column"
                  x="726"
                  y={448 - ((state.temperatureK - 250) / 350) * 118}
                  width="7"
                  height={28 + ((state.temperatureK - 250) / 350) * 118}
                  rx="3"
                />
                <g className="stage-readout pressure">
                  <rect x="80" y="353" width="145" height="44" rx="8" />
                  <text x="152" y="381" textAnchor="middle">
                    {state.pressureKPa.toFixed(1)} kPa
                  </text>
                </g>
                <g className="stage-readout volume">
                  <rect x="382" y="520" width="140" height="42" rx="8" />
                  <text x="452" y="547" textAnchor="middle">
                    {state.volumeL.toFixed(2)} L
                  </text>
                </g>
                <g className="stage-readout temperature">
                  <rect x="683" y="475" width="120" height="42" rx="8" />
                  <text x="743" y="502" textAnchor="middle">
                    {state.temperatureK.toFixed(0)} K
                  </text>
                </g>
              </svg>
            </div>
            <div className="gas-transport">
              <button
                aria-label="Replay process"
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
                  if (time >= 8) setTime(0);
                  setRunning((value) => !value);
                }}
              >
                {running
                  ? "Pause"
                  : time > 0 && time < 8
                    ? "Resume"
                    : "Run process"}
              </button>
              <button
                onClick={() => {
                  setRunning(false);
                  setTime((value) => Math.min(8, value + 0.25));
                }}
              >
                Step
              </button>
              <Range
                label="Timeline"
                value={time}
                min={0}
                max={8}
                step={0.25}
                unit="s"
                onChange={(value) => {
                  setTime(value);
                  setRunning(false);
                }}
              />
              <label>
                Speed
                <select
                  aria-label="Playback speed"
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                >
                  <option value="0.25">0.25×</option>
                  <option value="0.5">0.5×</option>
                  <option value="1">1×</option>
                  <option value="2">2×</option>
                </select>
              </label>
              <label>
                <input
                  aria-label="Reduced motion"
                  type="checkbox"
                  checked={reduced}
                  onChange={(event) => setReduced(event.target.checked)}
                />
                Reduced motion
              </label>
              <button onClick={reset}>Reset</button>
            </div>
            <div className="gas-readings" aria-label="Live gas measurements">
              <span>
                P<b>{state.pressureKPa.toFixed(1)} kPa</b>
              </span>
              <span>
                V<b>{state.volumeL.toFixed(2)} L</b>
              </span>
              <span>
                T<b>{state.temperatureK.toFixed(0)} K</b>
              </span>
              <span>
                n<b>{state.amountMol.toFixed(4)} mol</b>
              </span>
              <span>
                W by gas<b>{workJ.toFixed(1)} J</b>
              </span>
              <span>
                ⟨KE⟩<b>{state.meanKineticEnergyJ.toExponential(2)} J</b>
              </span>
            </div>
            <div className="gas-view-toggles">
              <label>
                <input
                  aria-label="Show velocity vectors"
                  type="checkbox"
                  checked={showVectors}
                  onChange={(event) => setShowVectors(event.target.checked)}
                />
                Velocity vectors
              </label>
              <label>
                <input
                  aria-label="Show collision flashes"
                  type="checkbox"
                  checked={showCollisions}
                  onChange={(event) => setShowCollisions(event.target.checked)}
                />
                Collision flashes
              </label>
              <label className="track-select">
                Track molecule
                <select
                  aria-label="Tracked molecule"
                  value={Math.min(selectedParticle, particles.length - 1)}
                  onChange={(event) =>
                    setSelectedParticle(Number(event.target.value))
                  }
                >
                  {particles.map((particle) => (
                    <option key={particle.id} value={particle.id}>
                      {particle.id + 1}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>
        </main>

        <aside className="gas-analysis">
          <section className="gas-card gas-graph">
            <div className="graph-head">
              <h2>PROCESS GRAPH</h2>
              <div role="group" aria-label="Graph axes">
                <button
                  className={graphMode === "pv" ? "active" : ""}
                  aria-pressed={graphMode === "pv"}
                  onClick={() => setGraphMode("pv")}
                >
                  P–V
                </button>
                <button
                  className={graphMode === "pt" ? "active" : ""}
                  aria-pressed={graphMode === "pt"}
                  onClick={() => setGraphMode("pt")}
                >
                  P–T
                </button>
              </div>
            </div>
            <svg
              viewBox="0 0 360 210"
              aria-label={`${graphMode === "pv" ? "Pressure versus volume" : "Pressure versus temperature"} for the selected process`}
            >
              <line x1="38" y1="178" x2="338" y2="178" />
              <line x1="38" y1="20" x2="38" y2="178" />
              {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
                <g key={tick}>
                  <line
                    className="grid"
                    x1="38"
                    y1={178 - tick * 150}
                    x2="338"
                    y2={178 - tick * 150}
                  />
                  <text x="3" y={182 - tick * 150}>
                    {(pMax * tick).toFixed(0)}
                  </text>
                </g>
              ))}
              <path className="process-curve" d={path(graphPoints)} />
              {missionActive && graphMode === "pv" && (
                <>
                  <circle
                    className="mission-point"
                    cx={graphX(4)}
                    cy={graphY((baseState.invariantValue || 1) / 4)}
                    r="5"
                  />
                  <circle
                    className="mission-target"
                    cx={graphX(2)}
                    cy={graphY((baseState.invariantValue || 1) / 2)}
                    r="7"
                  />
                </>
              )}
              <circle
                className="current-point"
                cx={currentGraphX}
                cy={currentGraphY}
                r="6"
              />
              <text x="252" y="203">
                {graphMode === "pv" ? "Volume (L)" : "Temperature (K)"}
              </text>
              <text x="4" y="13">
                P (kPa)
              </text>
            </svg>
            <div className="invariant">
              <span>{state.invariantLabel}</span>
              <b>
                {state.invariantValue.toFixed(mode === "isothermal" ? 2 : 4)}
              </b>
              <small>{state.invariantUnit}</small>
              <em>drift {(invariantDrift * 100).toExponential(1)}%</em>
            </div>
          </section>

          <section className="gas-card gas-speed">
            <h2>MAXWELL–BOLTZMANN SPEEDS</h2>
            <svg
              viewBox="0 0 360 155"
              aria-label={`Air molecule speed distribution at ${state.temperatureK.toFixed(0)} kelvin`}
            >
              <line x1="36" y1="128" x2="334" y2="128" />
              <line x1="36" y1="20" x2="36" y2="128" />
              <path className="speed-fill" d={`${speedPath}L330,128L36,128Z`} />
              <path className="speed-line" d={speedPath} />
              <line
                className="mean-speed"
                x1={36 + (state.meanSpeedMS / 1200) * 294}
                y1="24"
                x2={36 + (state.meanSpeedMS / 1200) * 294}
                y2="128"
              />
              <text x="258" y="150">
                speed (m/s)
              </text>
              <text x="3" y="14">
                f(v)
              </text>
            </svg>
            <div>
              <span>
                Mean speed<b>{state.meanSpeedMS.toFixed(0)} m/s</b>
              </span>
              <span>
                RMS speed<b>{state.rmsSpeedMS.toFixed(0)} m/s</b>
              </span>
              <span>
                Collision index<b>{state.collisionIndex.toFixed(2)}×</b>
              </span>
            </div>
          </section>

          <section className="gas-card gas-assumption">
            <span>MODEL NOTE</span>
            <b>n = N / Nₐ</b>
            <p>
              Display particles are scaled molecular packets. The calculation
              uses
              {` ${state.amountMol.toFixed(4)} mol = ${state.moleculeEquivalent.toExponential(2)} molecules`}
              .
            </p>
            <small>
              Ideal gas: negligible particle volume and intermolecular forces.
            </small>
          </section>
        </aside>
      </div>
    </section>
  );
}
