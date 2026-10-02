import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  solveBernoulli,
  WATER_VAPOR_PRESSURE_KPA,
  type BernoulliInput,
} from "./bernoulliPhysics";
import "./bernoulli-fluid-flow.css";
import "./bernoulli-direct.css";
type RunState = "idle" | "running" | "paused" | "result";
const DEFAULT: BernoulliInput = {
  inletPressureKPa: 140,
  flowRateLps: 1.2,
  radius1Mm: 25,
  radius2Mm: 12.5,
  radius3Mm: 25,
  density: 1000,
  elevation1: 2,
  elevation2: 1.95,
  elevation3: 1.9,
};
const fmt = (v: number, d = 2) => v.toFixed(d);
export function BernoulliFluidFlowLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(DEFAULT);
  const [runState, setRunState] = useState<RunState>("idle");
  const [speed, setSpeed] = useState(1);
  const [phase, setPhase] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  const [mission, setMission] = useState(false);
  const [feedback, setFeedback] = useState("");
  const result = useMemo(() => solveBernoulli(input), [input]);
  useEffect(() => {
    if (runState !== "running") return;
    const timer = window.setInterval(
      () => setPhase((p) => (p + 2 * speed) % 100),
      reducedMotion ? 220 : 55,
    );
    return () => window.clearInterval(timer);
  }, [runState, speed, reducedMotion]);
  const update = (patch: Partial<BernoulliInput>) => {
    setInput((v) => ({ ...v, ...patch }));
    setFeedback("");
  };
  const reset = () => {
    setInput(DEFAULT);
    setRunState("idle");
    setPhase(0);
    setMission(false);
    setFeedback("");
  };
  const startMission = () => {
    setMission(true);
    setInput({ ...DEFAULT, radius2Mm: 20, inletPressureKPa: 90 });
    setFeedback(
      "Target throat speed: 2.45 ± 0.10 m/s. Keep pressure above the 2.34 kPa vapor threshold.",
    );
  };
  const check = () => {
    const v = result.stations[1].velocity;
    const pass = Math.abs(v - 2.45) <= 0.1 && !result.cavitation;
    setFeedback(
      pass
        ? `✓ Venturi accepted: v₂=${fmt(v)} m/s, Pmin=${fmt(result.minimumPressureKPa)} kPa, safety margin ${fmt(result.safetyMarginKPa)} kPa.`
        : `Not yet: v₂=${fmt(v)} m/s and Pmin=${fmt(result.minimumPressureKPa)} kPa. Adjust throat radius or inlet pressure.`,
    );
    if (pass) setRunState("result");
  };
  const column = (pressure: number) => Math.max(8, Math.min(82, pressure / 2));
  return (
    <section
      className="bernoulli-lab"
      data-run-state={runState}
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="bernoulli-head">
        <div>
          <span>FLUID MECHANICS · CLASS 11</span>
          <h2>Venturi Flow Bench</h2>
          <p>
            Watch continuity accelerate the fluid while Bernoulli pressure and
            height trade energy.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="bernoulli-layout">
        <aside className="bernoulli-controls" aria-label="Venturi controls">
          <h3>Setup & flow</h3>
          <Control
            label="Inlet pressure P₁"
            aria="Inlet pressure"
            value={input.inletPressureKPa}
            min={20}
            max={200}
            step={5}
            unit="kPa abs"
            onChange={(v) => update({ inletPressureKPa: v })}
          />
          <Control
            label="Flow rate Q"
            aria="Flow rate"
            value={input.flowRateLps}
            min={0.2}
            max={3}
            step={0.1}
            unit="L/s"
            onChange={(v) => update({ flowRateLps: v })}
          />
          <Control
            label="Fluid density ρ"
            aria="Density"
            value={input.density}
            min={500}
            max={1500}
            step={50}
            unit="kg/m³"
            onChange={(v) => update({ density: v })}
          />
          <div className="flow-presets">
            <button onClick={() => setInput(DEFAULT)}>Safe reference</button>
            <button
              onClick={() =>
                update({ inletPressureKPa: 20, flowRateLps: 3, radius2Mm: 8 })
              }
            >
              Cavitation case
            </button>
          </div>
          <h3>Pipe radii</h3>
          <Control
            label="Upstream r₁"
            aria="Upstream radius"
            value={input.radius1Mm}
            min={15}
            max={40}
            step={0.5}
            unit="mm"
            onChange={(v) => update({ radius1Mm: v })}
          />
          <Control
            label="Throat r₂"
            aria="Throat radius"
            value={input.radius2Mm}
            min={8}
            max={30}
            step={0.5}
            unit="mm"
            onChange={(v) => update({ radius2Mm: v })}
          />
          <Control
            label="Downstream r₃"
            aria="Downstream radius"
            value={input.radius3Mm}
            min={15}
            max={40}
            step={0.5}
            unit="mm"
            onChange={(v) => update({ radius3Mm: v })}
          />
          <h3>Elevation</h3>
          <Control
            label="Upstream z₁"
            aria="Upstream elevation"
            value={input.elevation1}
            min={0}
            max={3}
            step={0.05}
            unit="m"
            onChange={(v) => update({ elevation1: v })}
          />
          <Control
            label="Throat z₂"
            aria="Throat elevation"
            value={input.elevation2}
            min={0}
            max={3}
            step={0.05}
            unit="m"
            onChange={(v) => update({ elevation2: v })}
          />
          <Control
            label="Downstream z₃"
            aria="Downstream elevation"
            value={input.elevation3}
            min={0}
            max={3}
            step={0.05}
            unit="m"
            onChange={(v) => update({ elevation3: v })}
          />
        </aside>
        <main className="bernoulli-main">
          <div className="bernoulli-toolbar">
            <div>
              <button
                onClick={() => setRunState("running")}
                disabled={runState === "running"}
              >
                ▶ Play flow
              </button>
              <button
                onClick={() => setRunState("paused")}
                disabled={runState === "paused"}
              >
                Ⅱ Pause
              </button>
              <button
                onClick={() => {
                  setRunState("paused");
                  setPhase((p) => p + 5);
                }}
              >
                ▷ Step
              </button>
            </div>
            <label>
              Speed{" "}
              <select
                aria-label="Playback speed"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              >
                <option value="0.25">0.25×</option>
                <option value="0.5">0.5×</option>
                <option value="1">1×</option>
                <option value="2">2×</option>
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
              />{" "}
              Reduced motion
            </label>
          </div>
          <section
            className="venturi-stage"
            aria-label="Two-dimensional Venturi apparatus with moving fluid markers"
          >
            <img
              src="/assets/experiments/bernoulli-fluid-flow/venturi-bench.png"
              alt="Transparent Venturi pipe with reservoir, pump and three piezometer taps"
            />
            <button className="venturi-direct-throat" aria-label={`Drag Venturi throat radius, ${input.radius2Mm.toFixed(1)} millimetres`}
              onPointerDown={event=>event.currentTarget.setPointerCapture(event.pointerId)}
              onPointerMove={event=>{if(!event.currentTarget.hasPointerCapture(event.pointerId))return;const rect=event.currentTarget.getBoundingClientRect();const f=1-Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height));update({radius2Mm:8+f*22})}}
              onKeyDown={event=>{if(event.key==="ArrowUp")update({radius2Mm:input.radius2Mm+.5});if(event.key==="ArrowDown")update({radius2Mm:input.radius2Mm-.5})}}><i style={{top:`${(30-input.radius2Mm)/22*100}%`}}/><span>DRAG THROAT ↕</span></button>
            <svg
              viewBox="0 0 1000 540"
              role="img"
              aria-label={`Flow accelerates from ${fmt(result.stations[0].velocity)} to ${fmt(result.stations[1].velocity)} metres per second at the throat`}
            >
              <defs>
                <clipPath id="flow-clip">
                  <path d="M245 300H390Q450 300 485 340Q515 370 550 340Q590 300 650 300H940V390H650Q590 390 550 350Q515 320 485 350Q450 390 390 390H245Z" />
                </clipPath>
              </defs>
              <g clipPath="url(#flow-clip)">
                {Array.from({ length: 16 }, (_, i) => (
                  <circle
                    key={i}
                    className="fluid-marker"
                    cx={((180 + i * 67 + phase * 7) % 850) + 140}
                    cy={330 + (i % 3) * 18}
                    r="5"
                  />
                ))}
              </g>
              {[result.stations[0], result.stations[1], result.stations[2]].map(
                (s, i) => (
                  <g key={i} className="pressure-column">
                    <rect
                      x={i === 0 ? 380 : i === 1 ? 585 : 765}
                      y={265 - column(s.pressurePa / 1000) * 1.7}
                      width="22"
                      height={column(s.pressurePa / 1000) * 1.7}
                    />
                    <text x={i === 0 ? 391 : i === 1 ? 596 : 776} y="85">
                      P{i + 1} {fmt(s.pressurePa / 1000, 1)} kPa
                    </text>
                  </g>
                ),
              )}
            </svg>
            <div className="continuity-banner">
              <b>A₁v₁ = A₂v₂ = A₃v₃ = Q</b>
              <span>
                {fmt(result.stations[0].flowCheck * 1000, 4)} ={" "}
                {fmt(result.stations[1].flowCheck * 1000, 4)} ={" "}
                {fmt(result.stations[2].flowCheck * 1000, 4)} L/s
              </span>
            </div>
          </section>
          <div className="station-cards">
            {result.stations.map((s, i) => (
              <section key={i}>
                <h4>
                  {i === 0
                    ? "1 · Upstream"
                    : i === 1
                      ? "2 · Throat"
                      : "3 · Downstream"}
                </h4>
                <Reading label="Area" value={`${s.area.toExponential(3)} m²`} />
                <Reading label="Velocity" value={`${fmt(s.velocity)} m/s`} />
                <Reading
                  label="Pressure"
                  value={`${fmt(s.pressurePa / 1000, 1)} kPa`}
                />
                <Reading label="Elevation" value={`${fmt(s.elevation)} m`} />
              </section>
            ))}
          </div>
          <section
            className="energy-bars"
            aria-label="Bernoulli energy terms at three stations"
          >
            <header>
              <b>Pressure + kinetic + elevation energy</b>
              <span>Pa · equal totals</span>
            </header>
            {result.stations.map((s, i) => {
              const total = s.totalEnergyPa;
              return (
                <div key={i}>
                  <label>{i + 1}</label>
                  <i
                    className="static"
                    style={{
                      width: `${Math.max(0, (s.staticHead / total) * 100)}%`,
                    }}
                  />
                  <i
                    className="kinetic"
                    style={{ width: `${(s.velocityHead / total) * 100}%` }}
                  />
                  <i
                    className="height"
                    style={{ width: `${(s.elevationHead / total) * 100}%` }}
                  />
                  <strong>{fmt(total / 1000, 2)} kPa</strong>
                </div>
              );
            })}
          </section>
        </main>
        <aside
          className="bernoulli-analysis"
          aria-label="Bernoulli validation and cavitation"
        >
          <h3>Live checks</h3>
          <section className="check-card">
            <b>✓ Continuity closes</b>
            <span>
              max Δ(Av) = {result.continuityResidual.toExponential(1)} m³/s
            </span>
          </section>
          <section className="check-card">
            <b>✓ Bernoulli closes</b>
            <span>max ΔE = {result.energyResidual.toExponential(1)} Pa</span>
          </section>
          <section className={result.cavitation ? "cav danger" : "cav safe"}>
            <b>
              {result.cavitation ? "⚠ CAVITATION RISK" : "✓ CAVITATION SAFE"}
            </b>
            <span>Minimum: {fmt(result.minimumPressureKPa)} kPa abs</span>
            <span>Vapor pressure: {WATER_VAPOR_PRESSURE_KPA} kPa abs</span>
            <strong>Margin: {fmt(result.safetyMarginKPa)} kPa</strong>
          </section>
          <section className="formula">
            <h4>Along one streamline</h4>
            <p>P + ½ρv² + ρgh = constant</p>
            <small>
              Steady, incompressible, inviscid flow with no pump energy added
              between stations.
            </small>
          </section>
          <div className="cause">
            <b>Narrower throat</b>
            <span>smaller A → larger v → lower P</span>
          </div>
        </aside>
      </div>
      <section className="bernoulli-mission" aria-label="Target speed mission">
        <div>
          <span>CHALLENGE</span>
          <b>Reach 2.45 ± 0.10 m/s at the throat without cavitation.</b>
          <small>Keep Q=1.20 L/s and tune r₂; raise P₁ if needed.</small>
        </div>
        <button onClick={startMission}>Start challenge</button>
        {mission && (
          <button
            onClick={() => update({ radius2Mm: 12.5, inletPressureKPa: 90 })}
          >
            Set calculated throat
          </button>
        )}
        {mission && <button onClick={check}>Check design</button>}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
function Reading({ label, value }: { label: string; value: string }) {
  return (
    <div className="bernoulli-reading">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function Control({
  label,
  aria,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  aria: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="bernoulli-control">
      <span>
        {label}
        <strong>
          {value} {unit}
        </strong>
      </span>
      <input
        aria-label={aria}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <small>
        {min} — {max} {unit}
      </small>
    </label>
  );
}
