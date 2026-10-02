import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  generateEnsembleSamples,
  solveEnsembleTheory,
  summarizeSamples,
  type EnsembleSample,
  type EnsembleType,
} from "./statisticalEnsembleSimulation";
import "./statistical-ensemble-lab.css";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const ease = (n: number) => n * n * (3 - 2 * n);
const frac = (n: number) => n - Math.floor(n);

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
  const decimals = step < 0.1 ? 2 : step < 1 ? 1 : 0;
  return (
    <label className="ensemble-range">
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

function histogram(
  samples: EnsembleSample[],
  key: "energyQuanta" | "particleCount",
  bins = 12,
) {
  const values = samples.map((item) => item[key]);
  const min = Math.min(...values);
  const max = Math.max(...values, min + 1);
  const width = (max - min + 1) / bins;
  const counts = Array.from({ length: bins }, () => 0);
  values.forEach((value) => {
    counts[clamp(Math.floor((value - min) / width), 0, bins - 1)] += 1;
  });
  const peak = Math.max(...counts, 1);
  return { min, max, counts, peak, width };
}

const ensembleCopy: Record<
  EnsembleType,
  { short: string; exchange: string; constraints: string; formula: string }
> = {
  microcanonical: {
    short: "Microcanonical",
    exchange: "Isolated: no energy or particle exchange",
    constraints: "E, N, V fixed",
    formula: "Pᵢ = 1/Ω(E,N,V)",
  },
  canonical: {
    short: "Canonical",
    exchange: "Thermal bath exchanges energy",
    constraints: "T, N, V fixed",
    formula: "P(q) = C(N,q)p^q(1−p)^(N−q)",
  },
  "grand-canonical": {
    short: "Grand canonical",
    exchange: "Bath exchanges energy and particles",
    constraints: "T, μ, V fixed",
    formula: "P(N) = e^(−λ)λᴺ/N!",
  },
};

export function StatisticalEnsembleLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [ensemble, setEnsemble] = useState<EnsembleType>("microcanonical");
  const [particleCount, setParticleCount] = useState(48);
  const [energyPerParticle, setEnergyPerParticle] = useState(0.35);
  const [samplingDuration, setSamplingDuration] = useState(1200);
  const [time, setTime] = useState(0);
  const [manualSamples, setManualSamples] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reduced, setReduced] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [predictionLocked, setPredictionLocked] = useState(false);
  const [missionFeedback, setMissionFeedback] = useState("");
  const [selectedParticle, setSelectedParticle] = useState<number | null>(null);

  const theory = solveEnsembleTheory(
    ensemble,
    particleCount,
    energyPerParticle,
  );
  const allSamples = useMemo(
    () =>
      generateEnsembleSamples(
        ensemble,
        particleCount,
        energyPerParticle,
        samplingDuration,
      ),
    [ensemble, particleCount, energyPerParticle, samplingDuration],
  );
  const progress = ease(clamp(time / 8, 0, 1));
  const sampleCount = clamp(
    Math.max(1, Math.floor(progress * samplingDuration) + manualSamples),
    1,
    samplingDuration,
  );
  const visibleSamples = allSamples.slice(0, sampleCount);
  const summary = summarizeSamples(visibleSamples);
  const current = visibleSamples[visibleSamples.length - 1];
  const energyHistogram = histogram(visibleSamples, "energyQuanta");
  const particleHistogram = histogram(visibleSamples, "particleCount");
  const status =
    time === 0 && manualSamples === 0
      ? "READY"
      : time >= 8 || sampleCount >= samplingDuration
        ? "RESULT"
        : running
          ? "SAMPLING"
          : "PAUSED";
  const ensembleInfo = ensembleCopy[ensemble];
  const meanError = summary.meanEnergy - theory.meanEnergyQuanta;
  const standardError =
    Math.sqrt(Math.max(theory.energyVariance, 0)) / Math.sqrt(sampleCount);
  const convergence = Math.abs(meanError) <= Math.max(2 * standardError, 0.15);

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

  const resetRun = () => {
    setTime(0);
    setManualSamples(0);
    setRunning(false);
    setSelectedParticle(null);
    setMissionFeedback("");
  };
  const change = <T,>(setter: (value: T) => void, value: T) => {
    setter(value);
    resetRun();
    setPredictionLocked(false);
    setPrediction("");
  };
  const reset = () => {
    setEnsemble("microcanonical");
    setParticleCount(48);
    setEnergyPerParticle(0.35);
    setSamplingDuration(1200);
    setTime(0);
    setManualSamples(0);
    setRunning(false);
    setSpeed(1);
    setReduced(false);
    setPrediction("");
    setPredictionLocked(false);
    setMissionFeedback("");
    setSelectedParticle(null);
  };
  const lockPrediction = () => {
    if (prediction === "")
      setMissionFeedback("Enter an excited-particle count first.");
    else {
      setPredictionLocked(true);
      setMissionFeedback("Prediction locked. Now sample the ensemble.");
    }
  };
  const checkMission = () => {
    if (!predictionLocked) {
      setMissionFeedback("Lock a prediction before checking.");
      return;
    }
    const value = Number(prediction);
    const correct = value === theory.mostProbableEnergy;
    setMissionFeedback(
      correct
        ? `Correct — q* = ${theory.mostProbableEnergy} is the most probable macrostate for ${ensembleInfo.short.toLowerCase()}.`
        : `Observed peak is near q* = ${theory.mostProbableEnergy}. Use the fixed E constraint or the mode of the relevant binomial/Poisson law.`,
    );
  };
  const particleIndices = useMemo(
    () =>
      Array.from(
        { length: Math.min(current.particleCount, 120) },
        (_, id) => id,
      ).sort(
        (a, b) =>
          frac(Math.sin((a + 1) * (sampleCount + 13) * 12.9898) * 43758.5) -
          frac(Math.sin((b + 1) * (sampleCount + 13) * 12.9898) * 43758.5),
      ),
    [current.particleCount, sampleCount],
  );
  const excited = new Set(
    particleIndices.slice(
      0,
      Math.min(current.energyQuanta, particleIndices.length),
    ),
  );
  const particles = particleIndices.map((id) => {
    const x0 = 105 + frac(Math.sin((id + 1) * 91.73) * 43758.5) * 425;
    const y0 = 102 + frac(Math.sin((id + 1) * 47.11) * 24634.6) * 206;
    const motion =
      running && !reduced ? time * (18 + energyPerParticle * 34) : 0;
    const x =
      105 +
      Math.abs(
        ((((x0 - 105 + motion * Math.cos(id * 2.17)) % 850) + 850) % 850) - 425,
      );
    const boundedX = x > 530 ? 955 - x : x;
    const y =
      102 +
      Math.abs(
        ((((y0 - 102 + motion * Math.sin(id * 1.73)) % 412) + 412) % 412) - 206,
      );
    const boundedY = y > 308 ? 514 - y : y;
    return (
      <g
        key={id}
        className={selectedParticle === id ? "selected" : ""}
        role="button"
        tabIndex={0}
        aria-label={`Particle ${id + 1}, ${excited.has(id) ? "excited" : "ground state"}`}
        onClick={() => setSelectedParticle(id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setSelectedParticle(id);
          }
        }}
      >
        <circle
          cx={boundedX}
          cy={boundedY}
          r={selectedParticle === id ? 7 : 5}
          fill={excited.has(id) ? "#f3a51c" : "#1f86cf"}
          stroke="#fff"
          strokeWidth="1.5"
        />
        <path
          d={`M${boundedX - 8} ${boundedY}h-7`}
          stroke={excited.has(id) ? "#e26822" : "#69b7df"}
          strokeWidth="1.2"
        />
      </g>
    );
  });
  const bars = (data: ReturnType<typeof histogram>, color: string) =>
    data.counts.map((count, index) => {
      const height = (count / data.peak) * 78;
      return (
        <rect
          key={index}
          x={22 + index * 14.2}
          y={107 - height}
          width="11"
          height={height}
          rx="1"
          fill={color}
          opacity={0.82}
        />
      );
    });
  const constraintRows =
    ensemble === "microcanonical"
      ? [
          ["Energy E", `${current.energyQuanta} ε`, "fixed"],
          ["Particles N", `${current.particleCount}`, "fixed"],
          ["Temperature", "emergent", "—"],
        ]
      : ensemble === "canonical"
        ? [
            ["Energy E", `${current.energyQuanta} ε`, "fluctuates"],
            ["Particles N", `${current.particleCount}`, "fixed"],
            ["βε", theory.betaEpsilon.toFixed(3), "fixed"],
          ]
        : [
            ["Energy E", `${current.energyQuanta} ε`, "fluctuates"],
            ["Particles N", `${current.particleCount}`, "fluctuates"],
            ["βμ", theory.betaChemicalPotential?.toFixed(3) ?? "—", "fixed"],
          ];

  return (
    <section
      className="ensemble-lab"
      aria-label={`${experiment.title} interactive lab`}
    >
      <header className="ensemble-hero">
        <div>
          <span>STATISTICAL MECHANICS · 2D</span>
          <h1>One macrostate, many microstates</h1>
          <p>
            Sample a two-level particle system and watch probability emerge from
            repeated microscopic arrangements.
          </p>
        </div>
        <div className={`ensemble-status ${status.toLowerCase()}`}>
          {status}
        </div>
      </header>
      <div className="ensemble-layout">
        <aside className="ensemble-controls">
          <section className="ensemble-card">
            <p className="eyebrow">1 · ENSEMBLE</p>
            <div
              className="ensemble-types"
              role="group"
              aria-label="Ensemble type"
            >
              {(
                [
                  "microcanonical",
                  "canonical",
                  "grand-canonical",
                ] as EnsembleType[]
              ).map((item) => (
                <button
                  key={item}
                  className={ensemble === item ? "active" : ""}
                  onClick={() => change(setEnsemble, item)}
                >
                  <b>{ensembleCopy[item].short}</b>
                  <span>{ensembleCopy[item].constraints}</span>
                </button>
              ))}
            </div>
            <p className="exchange">{ensembleInfo.exchange}</p>
          </section>
          <section className="ensemble-card">
            <p className="eyebrow">2 · CONTROL PARAMETERS</p>
            <Range
              label="Particle count"
              value={particleCount}
              min={12}
              max={120}
              step={4}
              unit="target N"
              onChange={(v) => change(setParticleCount, v)}
            />
            <Range
              label="Energy per particle"
              value={energyPerParticle}
              min={0.05}
              max={0.95}
              step={0.05}
              unit="ε"
              onChange={(v) => change(setEnergyPerParticle, v)}
            />
            <Range
              label="Sampling duration"
              value={samplingDuration}
              min={100}
              max={5000}
              step={100}
              unit="samples"
              onChange={(v) => change(setSamplingDuration, v)}
            />
            <p className="fluctuation-note">
              Relative σE/⟨E⟩ ={" "}
              <b>{(theory.relativeEnergyFluctuation * 100).toFixed(1)}%</b>. For
              canonical sampling it falls as 1/√N.
            </p>
          </section>
          <section className="ensemble-card mission">
            <p className="eyebrow">3 · PREDICT THE MACROSTATE</p>
            <p>
              Before sampling, predict the most probable number q* of excited
              particles.
            </p>
            <label>
              <span>Predicted q*</span>
              <input
                aria-label="Predicted most probable excited count"
                type="number"
                min="0"
                max="160"
                value={prediction}
                disabled={predictionLocked}
                onChange={(e) => {
                  setPrediction(e.target.value);
                  setMissionFeedback("");
                }}
              />
            </label>
            <div>
              <button onClick={lockPrediction} disabled={predictionLocked}>
                Lock prediction
              </button>
              <button className="primary" onClick={checkMission}>
                Check result
              </button>
            </div>
            {missionFeedback && (
              <small
                className={
                  missionFeedback.startsWith("Correct") ? "success" : "feedback"
                }
                role="status"
              >
                {missionFeedback}
              </small>
            )}
          </section>
        </aside>

        <main className="ensemble-main">
          <section className="ensemble-card ensemble-stage">
            <div className="stage-head">
              <div>
                <span>LIVE MICROSTATE CHAMBER</span>
                <h2>{ensembleInfo.short} ensemble</h2>
              </div>
              <div>
                <b>Sample {sampleCount}</b>
                <small>
                  {current.particleCount} particles · {current.energyQuanta} ε
                </small>
              </div>
            </div>
            <div
              className={`ensemble-visual ${running && !reduced ? "live" : ""}`}
            >
              <img
                src="/assets/experiments/statistical-ensemble-lab/ensemble-chamber.png"
                alt="Glass ensemble chamber with movable piston and reservoir port"
              />
              <img
                className="ensemble-fx blue"
                src="/assets/experiments/statistical-ensemble-lab/concept-effect.png"
                alt=""
                aria-hidden="true"
              />
              <img
                className="ensemble-fx amber"
                src="/assets/experiments/statistical-ensemble-lab/interaction-overlay.png"
                alt=""
                aria-hidden="true"
              />
              <svg
                viewBox="0 0 640 390"
                role="img"
                aria-label={`${ensembleInfo.short} microstate with ${current.particleCount} particles and energy ${current.energyQuanta} epsilon`}
              >
                <rect
                  x="92"
                  y="82"
                  width="455"
                  height="245"
                  rx="16"
                  className="chamber-zone"
                />
                {particles}
                <g className="macro-badge">
                  <rect x="222" y="337" width="196" height="36" rx="8" />
                  <text x="320" y="351">
                    MACROSTATE
                  </text>
                  <text x="320" y="366">
                    N = {current.particleCount} · E = {current.energyQuanta} ε
                  </text>
                </g>
              </svg>
            </div>
            <div className="ensemble-transport">
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
                  setTime((v) => Math.min(8, v + 0.4));
                }}
              >
                ▶| Step
              </button>
              <button
                onClick={() => {
                  setRunning(false);
                  setManualSamples((v) =>
                    Math.min(samplingDuration - 1, v + 1),
                  );
                }}
              >
                ◉ Sample once
              </button>
              <button onClick={resetRun}>↺ Reset run</button>
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
            <label className="ensemble-scrub">
              <span>{sampleCount} samples</span>
              <input
                aria-label="Sampling timeline"
                type="range"
                min="0"
                max="8"
                step=".1"
                value={time}
                onChange={(e) => {
                  setTime(Number(e.target.value));
                  setRunning(false);
                }}
              />
              <span>{samplingDuration}</span>
            </label>
          </section>
          <section className="ensemble-card ensemble-law">
            <b>{ensembleInfo.constraints}</b>
            <span>
              {ensemble === "microcanonical"
                ? `All sampled microstates have exactly E = ${theory.fixedEnergyQuanta} ε; Ω = exp(${theory.multiplicityLog.toFixed(2)}).`
                : ensemble === "canonical"
                  ? "N is fixed while the bath makes E fluctuate around the canonical average."
                  : "Both N and E fluctuate; the reservoir fixes temperature and chemical potential."}
            </span>
            <code>{ensembleInfo.formula}</code>
          </section>
          {selectedParticle !== null && (
            <section className="ensemble-card inspected" role="status">
              <b>Particle #{selectedParticle + 1}</b>
              <span>
                {excited.has(selectedParticle)
                  ? "Excited state · energy ε"
                  : "Ground state · energy 0"}
              </span>
              <button onClick={() => setSelectedParticle(null)}>
                Close inspection
              </button>
            </section>
          )}
        </main>

        <aside className="ensemble-analysis">
          <section className="ensemble-card">
            <p className="eyebrow">ENERGY HISTOGRAM · P(E)</p>
            <svg
              className="ensemble-chart"
              viewBox="0 0 205 126"
              role="img"
              aria-label="Normalized sampled energy histogram"
            >
              <path d="M18 9V108H198" />
              {bars(energyHistogram, "#eda126")}
              <line
                x1={
                  22 +
                  clamp(
                    ((theory.meanEnergyQuanta - energyHistogram.min) /
                      (energyHistogram.max - energyHistogram.min + 1)) *
                      170,
                    0,
                    170,
                  )
                }
                y1="14"
                x2={
                  22 +
                  clamp(
                    ((theory.meanEnergyQuanta - energyHistogram.min) /
                      (energyHistogram.max - energyHistogram.min + 1)) *
                      170,
                    0,
                    170,
                  )
                }
                y2="108"
              />
              <text x="2" y="12">
                P
              </text>
              <text x="181" y="121">
                E/ε
              </text>
            </svg>
            <div className="chart-range">
              <span>{energyHistogram.min}</span>
              <span>mean {summary.meanEnergy.toFixed(2)}</span>
              <span>{energyHistogram.max}</span>
            </div>
          </section>
          <section className="ensemble-card">
            <p className="eyebrow">PARTICLE-NUMBER HISTOGRAM · P(N)</p>
            <svg
              className="ensemble-chart particle-chart"
              viewBox="0 0 205 126"
              role="img"
              aria-label="Normalized sampled particle-number histogram"
            >
              <path d="M18 9V108H198" />
              {bars(particleHistogram, "#2589c9")}
              <text x="2" y="12">
                P
              </text>
              <text x="187" y="121">
                N
              </text>
            </svg>
            <div className="chart-range">
              <span>{particleHistogram.min}</span>
              <span>
                {ensemble === "grand-canonical" ? "N fluctuates" : "N fixed"}
              </span>
              <span>{particleHistogram.max}</span>
            </div>
          </section>
          <section className="ensemble-card macro-read">
            <p className="eyebrow">MACROSTATE & CONSTRAINTS</p>
            {constraintRows.map(([label, value, state]) => (
              <div key={label}>
                <span>{label}</span>
                <b>{value}</b>
                <small className={state === "fixed" ? "fixed" : "varies"}>
                  {state}
                </small>
              </div>
            ))}
            <div>
              <span>ΣP</span>
              <b>{summary.normalization.toFixed(6)}</b>
              <small className="fixed">normalized</small>
            </div>
          </section>
          <section className="ensemble-card convergence">
            <p className="eyebrow">AVERAGE CONVERGENCE</p>
            <div>
              <span>Sample ⟨E⟩</span>
              <b>{summary.meanEnergy.toFixed(3)} ε</b>
              <span>Ensemble ⟨E⟩</span>
              <b>{theory.meanEnergyQuanta.toFixed(3)} ε</b>
              <span>Difference</span>
              <b>
                {meanError >= 0 ? "+" : ""}
                {meanError.toFixed(3)} ε
              </b>
            </div>
            <p className={convergence ? "converged" : "sampling"}>
              {convergence
                ? "Within the expected sampling band"
                : "Keep sampling—the time average is still fluctuating"}
            </p>
          </section>
        </aside>
      </div>
      <footer className="ensemble-foot">
        <b>Two-level model</b>
        <span>
          Each distinguishable particle has energy 0 or ε. Canonical p = 1/(1 +
          eᵝᵋ); grand-canonical N is Poisson with mean λ. A fixed seed makes
          comparisons reproducible.
        </span>
        <button onClick={reset}>Reset entire lab</button>
      </footer>
    </section>
  );
}
