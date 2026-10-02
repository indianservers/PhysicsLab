import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  defaultCoupledParams,
  normalModeMetrics,
  oscillatorEnergy,
  presetParams,
  simulateCoupledOscillators,
  toDegrees,
  type CoupledOscillatorParams,
  type OscillatorPreset,
} from "./chaotic-coupled-oscillatorsSimulation";
import "./chaotic-coupled-oscillators.css";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const rad = (degrees: number) => (degrees * Math.PI) / 180;
const wrappedDegrees = (angleRad: number) =>
  toDegrees(Math.atan2(Math.sin(angleRad), Math.cos(angleRad)));

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
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    let next: number | undefined;
    if (event.key === "Home") next = min;
    if (event.key === "End") next = max;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown")
      next = value - step;
    if (event.key === "ArrowRight" || event.key === "ArrowUp")
      next = value + step;
    if (next === undefined) return;
    event.preventDefault();
    onChange(clamp(Number(next.toFixed(5)), min, max));
  };
  return (
    <label className="cco-range">
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
        onKeyDown={onKeyDown}
      />
    </label>
  );
}

function springPath(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1,
    dy = y2 - y1,
    length = Math.hypot(dx, dy),
    nx = -dy / length,
    ny = dx / length;
  const points = Array.from({ length: 25 }, (_, index) => {
    const p = index / 24,
      amplitude = index === 0 || index === 24 ? 0 : index % 2 ? 9 : -9;
    return `${x1 + dx * p + nx * amplitude},${y1 + dy * p + ny * amplitude}`;
  });
  return `M${points.join(" L")}`;
}

function pathFrom(points: { x: number; y: number }[]) {
  return points
    .map(
      (point, index) =>
        `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`,
    )
    .join(" ");
}

export function ChaoticCoupledOscillatorsLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [params, setParams] =
    useState<CoupledOscillatorParams>(defaultCoupledParams);
  const [preset, setPreset] = useState<OscillatorPreset>("beats"),
    [time, setTime] = useState(0),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(false),
    [trails, setTrails] = useState(true),
    [showEnergy, setShowEnergy] = useState(true),
    [dragBob, setDragBob] = useState<1 | 2 | null>(null);
  const [prediction, setPrediction] = useState(""),
    [predictionFeedback, setPredictionFeedback] = useState(""),
    [missionFeedback, setMissionFeedback] = useState("");
  const trajectory = useMemo(
    () => simulateCoupledOscillators(params, 40, 0.04, 0.004),
    [params],
  );
  const sampleIndex = clamp(
    Math.round(time / 0.04),
    0,
    trajectory.samples.length - 1,
  );
  const sample = trajectory.samples[sampleIndex] ?? trajectory.samples[0];
  const modes = normalModeMetrics(
    (params.mass1Kg + params.mass2Kg) / 2,
    (params.length1M + params.length2M) / 2,
    params.couplingNPerM,
  );
  const update = <K extends keyof CoupledOscillatorParams>(
    key: K,
    value: CoupledOscillatorParams[K],
  ) => {
    setParams((old) => ({ ...old, [key]: value }));
    setTime(0);
    setRunning(false);
    setMissionFeedback("");
  };
  const loadPreset = (next: OscillatorPreset) => {
    setPreset(next);
    setParams((old) => ({ ...old, ...presetParams(next) }));
    setTime(0);
    setRunning(false);
    setPredictionFeedback("");
    setMissionFeedback("");
  };
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setTime((old) => {
          const next = old + (reduced ? 0.18 : 0.04) * speed;
          if (next >= 40) {
            setRunning(false);
            return 40;
          }
          return next;
        }),
      reduced ? 160 : 40,
    );
    return () => window.clearInterval(id);
  }, [running, reduced, speed]);
  const reset = () => {
    setParams(defaultCoupledParams);
    setPreset("beats");
    setTime(0);
    setRunning(false);
    setSpeed(1);
    setReduced(false);
    setTrails(true);
    setShowEnergy(true);
    setPrediction("");
    setPredictionFeedback("");
    setMissionFeedback("");
    setDragBob(null);
  };
  const pivots = [
    { x: 300, y: 95 },
    { x: 600, y: 95 },
  ];
  const bobPoint = (
    theta: number,
    length: number,
    pivot: { x: number; y: number },
  ) => ({
    x: pivot.x + Math.sin(theta) * length * 190,
    y: pivot.y + Math.cos(theta) * length * 190,
  });
  const bob1 = bobPoint(sample.theta1, params.length1M, pivots[0]),
    bob2 = bobPoint(sample.theta2, params.length2M, pivots[1]);
  const history = trajectory.samples.slice(
    Math.max(0, sampleIndex - 180),
    sampleIndex + 1,
  );
  const trail1 = history.map((item) =>
    bobPoint(item.theta1, params.length1M, pivots[0]),
  );
  const trail2 = history.map((item) =>
    bobPoint(item.theta2, params.length2M, pivots[1]),
  );
  const maxEnergy = Math.max(0.01, trajectory.initialEnergy);
  const regime =
    preset === "chaos"
      ? "SENSITIVE NONLINEAR"
      : preset === "symmetric"
        ? "SYMMETRIC MODE"
        : preset === "antisymmetric"
          ? "ANTISYMMETRIC MODE"
          : "BEATING · ENERGY EXCHANGE";
  const pointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragBob) return;
    const box = event.currentTarget.getBoundingClientRect(),
      x = ((event.clientX - box.left) / box.width) * 900,
      y = ((event.clientY - box.top) / box.height) * 430,
      pivot = pivots[dragBob - 1];
    const angle = clamp(
      toDegrees(Math.atan2(x - pivot.x, y - pivot.y)),
      -140,
      140,
    );
    update(dragBob === 1 ? "angle1Deg" : "angle2Deg", angle);
  };
  const bobKey = (which: 1 | 2, event: KeyboardEvent<SVGGElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home"].includes(event.key)) return;
    event.preventDefault();
    const key = which === 1 ? "angle1Deg" : "angle2Deg";
    update(
      key,
      event.key === "Home"
        ? 0
        : clamp(params[key] + (event.key === "ArrowLeft" ? -1 : 1), -140, 140),
    );
  };
  const graphSamples = trajectory.samples.filter((_, index) => index % 8 === 0);
  const angleSeries1 = graphSamples.map((item) => ({
    x: 30 + (item.time / 40) * 270,
    y: 80 - (wrappedDegrees(item.theta1) / 140) * 65,
  }));
  const angleSeries2 = graphSamples.map((item) => ({
    x: 30 + (item.time / 40) * 270,
    y: 80 - (wrappedDegrees(item.theta2) / 140) * 65,
  }));
  const phaseSeries = graphSamples.map((item) => ({
    x: 160 + (wrappedDegrees(item.theta1) / 140) * 130,
    y: 80 - (item.omega1 / 8) * 65,
  }));
  const divergenceSeries = graphSamples.map((item) => ({
    x: 30 + (item.time / 40) * 270,
    y:
      145 -
      (clamp(Math.log10(Math.max(item.divergence, 1e-6)) + 6, 0, 6) / 6) * 125,
  }));
  const beatPass =
    Math.abs(modes.beatPeriodS - 10) <= 0.5 &&
    params.driveAmplitudeNm === 0 &&
    params.dampingNmsPerRad <= 0.01 &&
    Math.abs(params.angle1Deg) > 1 &&
    Math.abs(params.angle2Deg) < 2;
  return (
    <section
      className="cco-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="cco-hero">
        <div>
          <span>NONLINEAR DYNAMICS · 2D</span>
          <h1>{experiment.title}</h1>
          <p>
            Compare normal modes, measure energy transfer, then reveal sensitive
            motion.
          </p>
        </div>
        <strong className={`cco-status ${preset}`}>{regime}</strong>
      </header>
      <nav className="cco-tabs" aria-label="Oscillator demonstrations">
        {(
          ["symmetric", "antisymmetric", "beats", "chaos"] as OscillatorPreset[]
        ).map((item) => (
          <button
            key={item}
            className={preset === item ? "active" : ""}
            onClick={() => loadPreset(item)}
          >
            {item === "symmetric"
              ? "1 · In-phase"
              : item === "antisymmetric"
                ? "2 · Out-of-phase"
                : item === "beats"
                  ? "3 · Beats"
                  : "4 · Nearby chaos"}
          </button>
        ))}
      </nav>
      <div className="cco-layout">
        <aside className="cco-controls cco-card">
          <h2>APPARATUS</h2>
          <div className="cco-segment">
            <button
              className={preset !== "chaos" ? "active" : ""}
              onClick={() => loadPreset("beats")}
            >
              Coupled pendulums
            </button>
            <button
              className={preset === "chaos" ? "active" : ""}
              onClick={() => loadPreset("chaos")}
            >
              Driven nonlinear
            </button>
          </div>
          <h2>SYSTEM PARAMETERS</h2>
          <Range
            label="Mass m₁"
            value={params.mass1Kg}
            min={0.1}
            max={0.6}
            step={0.01}
            unit=" kg"
            onChange={(v) => update("mass1Kg", v)}
          />
          <Range
            label="Mass m₂"
            value={params.mass2Kg}
            min={0.1}
            max={0.6}
            step={0.01}
            unit=" kg"
            onChange={(v) => update("mass2Kg", v)}
          />
          <Range
            label="Length L₁"
            value={params.length1M}
            min={0.5}
            max={1.3}
            step={0.01}
            unit=" m"
            onChange={(v) => update("length1M", v)}
          />
          <Range
            label="Length L₂"
            value={params.length2M}
            min={0.5}
            max={1.3}
            step={0.01}
            unit=" m"
            onChange={(v) => update("length2M", v)}
          />
          <Range
            label="Coupling k"
            value={params.couplingNPerM}
            min={0.05}
            max={2}
            step={0.01}
            unit=" N/m"
            onChange={(v) => update("couplingNPerM", v)}
          />
          <Range
            label="Damping b"
            value={params.dampingNmsPerRad}
            min={0}
            max={0.08}
            step={0.001}
            unit=" N·m·s/rad"
            onChange={(v) => update("dampingNmsPerRad", v)}
          />
          <h2>INITIAL ANGLES</h2>
          <Range
            label="Initial angle θ₁"
            value={params.angle1Deg}
            min={-140}
            max={140}
            step={1}
            unit="°"
            onChange={(v) => update("angle1Deg", v)}
          />
          <Range
            label="Initial angle θ₂"
            value={params.angle2Deg}
            min={-140}
            max={140}
            step={1}
            unit="°"
            onChange={(v) => update("angle2Deg", v)}
          />
          <h2>DRIVE</h2>
          <Range
            label="Drive amplitude"
            value={params.driveAmplitudeNm}
            min={0}
            max={0.2}
            step={0.01}
            unit=" N·m"
            onChange={(v) => update("driveAmplitudeNm", v)}
          />
          <Range
            label="Drive frequency"
            value={params.driveFrequencyRadS}
            min={1}
            max={8}
            step={0.1}
            unit=" rad/s"
            onChange={(v) => update("driveFrequencyRadS", v)}
          />
          <label className="cco-check">
            <input
              type="checkbox"
              checked={trails}
              onChange={(event) => setTrails(event.target.checked)}
            />{" "}
            Motion trails
          </label>
          <label className="cco-check">
            <input
              type="checkbox"
              checked={showEnergy}
              onChange={(event) => setShowEnergy(event.target.checked)}
            />{" "}
            Energy bars
          </label>
        </aside>
        <main className="cco-main">
          <section className="cco-stage cco-card">
            <div className="cco-stage-head">
              <div>
                <span>COUPLED PENDULUM RIG</span>
                <h2>Nonlinear exchange laboratory</h2>
              </div>
              <div>
                <b>{time.toFixed(2)} s</b>
                <small>
                  {trajectory.stable
                    ? "integrator stable"
                    : "integration stopped"}
                </small>
              </div>
            </div>
            <div className="cco-canvas">
              <img
                src="/assets/experiments/chaotic-coupled-oscillators/coupled-pendulum-frame.png"
                alt="Transparent two-dimensional coupled-pendulum support frame"
              />
              <svg
                viewBox="0 0 900 430"
                onPointerMove={pointerMove}
                onPointerUp={() => setDragBob(null)}
                onPointerLeave={() => setDragBob(null)}
                aria-label={`Pendulum one ${wrappedDegrees(sample.theta1).toFixed(1)} degrees; pendulum two ${wrappedDegrees(sample.theta2).toFixed(1)} degrees; divergence ${toDegrees(sample.divergence).toFixed(3)} degrees`}
              >
                {trails && (
                  <>
                    <path className="trail one" d={pathFrom(trail1)} />
                    <path className="trail two" d={pathFrom(trail2)} />
                  </>
                )}
                <line className="vertical" x1="300" y1="95" x2="300" y2="390" />
                <line className="vertical" x1="600" y1="95" x2="600" y2="390" />
                <line
                  className="string one"
                  x1="300"
                  y1="95"
                  x2={bob1.x}
                  y2={bob1.y}
                />
                <line
                  className="string two"
                  x1="600"
                  y1="95"
                  x2={bob2.x}
                  y2={bob2.y}
                />
                <path
                  className="spring"
                  d={springPath(bob1.x, bob1.y, bob2.x, bob2.y)}
                />
                <line
                  className="nearby"
                  x1="300"
                  y1="95"
                  x2={
                    bobPoint(sample.nearbyTheta1, params.length1M, pivots[0]).x
                  }
                  y2={
                    bobPoint(sample.nearbyTheta1, params.length1M, pivots[0]).y
                  }
                />
                <circle
                  className="nearby-bob"
                  cx={
                    bobPoint(sample.nearbyTheta1, params.length1M, pivots[0]).x
                  }
                  cy={
                    bobPoint(sample.nearbyTheta1, params.length1M, pivots[0]).y
                  }
                  r="20"
                />
                <g
                  className="bob one"
                  role="button"
                  tabIndex={0}
                  aria-label="Pendulum one bob; drag or use arrow keys"
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    setDragBob(1);
                  }}
                  onKeyDown={(event) => bobKey(1, event)}
                >
                  <circle
                    cx={bob1.x}
                    cy={bob1.y}
                    r={24 + params.mass1Kg * 18}
                  />
                  <text x={bob1.x} y={bob1.y + 5}>
                    m₁
                  </text>
                </g>
                <g
                  className="bob two"
                  role="button"
                  tabIndex={0}
                  aria-label="Pendulum two bob; drag or use arrow keys"
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    setDragBob(2);
                  }}
                  onKeyDown={(event) => bobKey(2, event)}
                >
                  <circle
                    cx={bob2.x}
                    cy={bob2.y}
                    r={24 + params.mass2Kg * 18}
                  />
                  <text x={bob2.x} y={bob2.y + 5}>
                    m₂
                  </text>
                </g>
                <text className="angle-label" x={bob1.x - 42} y={bob1.y - 38}>
                  θ₁ {wrappedDegrees(sample.theta1).toFixed(1)}°
                </text>
                <text className="angle-label" x={bob2.x + 12} y={bob2.y - 38}>
                  θ₂ {wrappedDegrees(sample.theta2).toFixed(1)}°
                </text>
              </svg>
              {showEnergy && (
                <div className="cco-energy">
                  <span>
                    E₁
                    <i
                      style={{
                        height: `${clamp(((sample.kinetic1 + sample.potential1) / maxEnergy) * 100, 2, 100)}%`,
                      }}
                    />
                  </span>
                  <span>
                    Ec
                    <i
                      style={{
                        height: `${clamp((sample.couplingEnergy / maxEnergy) * 100, 2, 100)}%`,
                      }}
                    />
                  </span>
                  <span>
                    E₂
                    <i
                      style={{
                        height: `${clamp(((sample.kinetic2 + sample.potential2) / maxEnergy) * 100, 2, 100)}%`,
                      }}
                    />
                  </span>
                </div>
              )}
            </div>
            <div className="cco-transport">
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
                  if (time >= 40) setTime(0);
                  setRunning((old) => !old);
                }}
              >
                {running ? "Pause" : "Play"}
              </button>
              <button
                onClick={() => {
                  setRunning(false);
                  setTime((old) => Math.min(40, old + 0.2));
                }}
              >
                Step
              </button>
              <Range
                label="Timeline"
                value={time}
                min={0}
                max={40}
                step={0.04}
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
                  onChange={(event) => setSpeed(Number(event.target.value))}
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
                  onChange={(event) => setReduced(event.target.checked)}
                />{" "}
                Reduced motion
              </label>
              <button onClick={reset}>Reset</button>
            </div>
          </section>
          <section className="cco-graphs">
            <div className="cco-card">
              <h2>Time series</h2>
              <svg viewBox="0 0 320 165">
                <line x1="30" y1="80" x2="305" y2="80" />
                <path className="g1" d={pathFrom(angleSeries1)} />
                <path className="g2" d={pathFrom(angleSeries2)} />
                <text x="240" y="158">
                  time (s)
                </text>
                <text x="3" y="16">
                  θ (°)
                </text>
              </svg>
            </div>
            <div className="cco-card">
              <h2>Phase portrait · θ₁ vs ω₁</h2>
              <svg viewBox="0 0 320 165">
                <line x1="25" y1="80" x2="300" y2="80" />
                <line x1="160" y1="12" x2="160" y2="150" />
                <path className="phase" d={pathFrom(phaseSeries)} />
                <text x="248" y="158">
                  θ₁
                </text>
                <text x="4" y="16">
                  ω₁
                </text>
              </svg>
            </div>
            <div className="cco-card">
              <h2>Nearby-state divergence</h2>
              <svg viewBox="0 0 320 165">
                <line x1="30" y1="145" x2="300" y2="145" />
                <path className="divergence" d={pathFrom(divergenceSeries)} />
                <text x="238" y="158">
                  time (s)
                </text>
                <text x="4" y="16">
                  log Δ
                </text>
              </svg>
            </div>
          </section>
        </main>
        <aside className="cco-side">
          <section className="cco-card cco-predict">
            <span>PREDICT BEFORE YOU RUN</span>
            <h2>What will the beats preset show?</h2>
            {[
              ["exchange", "Energy moves back and forth"],
              ["sync", "Complete synchronization"],
              ["random", "Random motion"],
            ].map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="cco-prediction"
                  value={value}
                  checked={prediction === value}
                  onChange={(event) => {
                    setPrediction(event.target.value);
                    setPredictionFeedback("");
                  }}
                />{" "}
                {label}
              </label>
            ))}
            <button
              onClick={() =>
                setPredictionFeedback(
                  prediction === "exchange"
                    ? "Correct — two nearby normal frequencies make a slow energy envelope."
                    : prediction
                      ? "Try again: watch E₁ and E₂ trade amplitude."
                      : "Choose a prediction first.",
                )
              }
            >
              Submit prediction
            </button>
            {predictionFeedback && <p>{predictionFeedback}</p>}
          </section>
          <section className="cco-card cco-readings">
            <h2>LIVE READINGS</h2>
            <div>
              <span>
                Time<b>{time.toFixed(2)} s</b>
              </span>
              <span>
                θ₁<b>{wrappedDegrees(sample.theta1).toFixed(2)}°</b>
              </span>
              <span>
                θ₂<b>{wrappedDegrees(sample.theta2).toFixed(2)}°</b>
              </span>
              <span>
                ω₁<b>{sample.omega1.toFixed(3)} rad/s</b>
              </span>
              <span>
                ω₂<b>{sample.omega2.toFixed(3)} rad/s</b>
              </span>
              <span>
                Total E<b>{sample.totalEnergy.toFixed(4)} J</b>
              </span>
            </div>
          </section>
          <section className="cco-card cco-metrics">
            <h2>KEY METRICS</h2>
            <span>
              Beat transfer period <b>{modes.beatPeriodS.toFixed(2)} s</b>
            </span>
            <span>
              In-phase f₊ <b>{modes.frequencySymmetricHz.toFixed(3)} Hz</b>
            </span>
            <span>
              Out-of-phase f₋{" "}
              <b>{modes.frequencyAntisymmetricHz.toFixed(3)} Hz</b>
            </span>
            <span>
              {params.dampingNmsPerRad === 0 && params.driveAmplitudeNm === 0
                ? "Energy drift "
                : "Energy change "}
              <b>{(trajectory.relativeEnergyDrift * 100).toExponential(2)}%</b>
            </span>
            <span>
              Max divergence{" "}
              <b>{toDegrees(trajectory.maximumDivergence).toFixed(2)}°</b>
            </span>
            <span>
              Integrator <b>{trajectory.stable ? "Stable" : "Stopped"}</b>
            </span>
          </section>
          <section className="cco-card cco-mission">
            <span>🏆 CHALLENGE</span>
            <h2>Tune a 10 s energy transfer</h2>
            <p>
              Start only pendulum 1. Keep drive off and damping low. Tune
              coupling until the predicted transfer period is 10.0 ± 0.5 s.
            </p>
            <button onClick={() => loadPreset("beats")}>Load beat setup</button>
            <button
              className="check"
              onClick={() =>
                setMissionFeedback(
                  beatPass
                    ? `Mission complete — transfer period ${modes.beatPeriodS.toFixed(2)} s.`
                    : params.driveAmplitudeNm > 0
                      ? "Turn the drive off so the beat belongs to the coupled system."
                      : Math.abs(params.angle2Deg) >= 2
                        ? "Release pendulum 2 close to zero."
                        : `Current transfer period is ${modes.beatPeriodS.toFixed(2)} s. Adjust coupling.`,
                )
              }
            >
              Check period
            </button>
            {missionFeedback && <p>{missionFeedback}</p>}
          </section>
        </aside>
      </div>
      <footer className="cco-equation">
        <b>Iᵢθ̈ᵢ + bθ̇ᵢ + mᵢgLᵢ sinθᵢ + ∂[½k(x₁−x₂)²]/∂θᵢ = τᵢ(t)</b>
        <span>
          xᵢ=Lᵢ sinθᵢ · damping off + drive off ⇒ total mechanical energy
          conserved
        </span>
      </footer>
    </section>
  );
}
