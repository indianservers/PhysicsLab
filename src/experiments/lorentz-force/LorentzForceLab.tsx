import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  simulateTrajectory,
  solveLorentz,
  type ChargeSpecies,
  type LorentzInput,
  type Vec3,
} from "./lorentzForceSimulation";
import "./lorentz-force.css";

type RunState = "idle" | "running" | "paused" | "result";
const defaults: LorentzInput = {
  species: "proton",
  speed: 2e6,
  velocityAngleDeg: 90,
  electricField: 0,
  magneticField: 0.2,
};
const fmt = (value: number, digits = 2) =>
  Number.isFinite(value) ? value.toExponential(digits) : "—";

function Slider({
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
    <label className="lorentz-slider">
      <span>
        {label}{" "}
        <b>
          {value.toLocaleString()} {unit}
        </b>
      </span>
      <input
        aria-label={label}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <small>
        <i>{min.toLocaleString()}</i>
        <i>{max.toLocaleString()}</i>
      </small>
    </label>
  );
}

function Reading({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={accent ? "lorentz-reading accent" : "lorentz-reading"}>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function project(point: Vec3, yaw: number) {
  const angle = (yaw * Math.PI) / 180;
  return {
    x: point.x * Math.cos(angle) + point.z * Math.sin(angle),
    y:
      point.y - 0.35 * (-point.x * Math.sin(angle) + point.z * Math.cos(angle)),
  };
}

function scaledPath(points: Vec3[], yaw: number) {
  const projected = points.map((point) => project(point, yaw));
  const xs = projected.map((point) => point.x);
  const ys = projected.map((point) => point.y);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs),
    minY = Math.min(...ys),
    maxY = Math.max(...ys);
  const width = Math.max(maxX - minX, 1e-12),
    height = Math.max(maxY - minY, 1e-12);
  const scale = Math.min(820 / width, 280 / height);
  return projected.map((point) => ({
    x: 210 + (point.x - minX) * scale,
    y: 470 - (point.y - minY) * scale,
  }));
}

export function LorentzForceLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(defaults);
  const [run, setRun] = useState<RunState>("idle");
  const [progress, setProgress] = useState(0.58);
  const [speed, setSpeed] = useState(1);
  const [reduced, setReduced] = useState(
    () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  const [yaw, setYaw] = useState(18);
  const [mission, setMission] = useState(false);
  const [feedback, setFeedback] = useState("");
  const drag = useRef<{ x: number; yaw: number } | null>(null);
  const trajectory = useMemo(() => simulateTrajectory(input), [input]);
  const result = trajectory.solved;
  const displayPoints = useMemo(
    () => scaledPath(trajectory.points, yaw),
    [trajectory.points, yaw],
  );
  const shown = Math.max(2, Math.floor(displayPoints.length * progress));
  const visiblePoints = displayPoints.slice(0, shown);
  const current = visiblePoints[visiblePoints.length - 1] ?? displayPoints[0];
  const path = visiblePoints
    .map(
      (point, index) =>
        `${index ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`,
    )
    .join(" ");

  useEffect(() => {
    if (run !== "running") return;
    const id = window.setInterval(
      () => {
        setProgress((old) => {
          const next = reduced ? 1 : Math.min(1, old + 0.008 * speed);
          if (next >= 1) setRun("result");
          return next;
        });
      },
      reduced ? 120 : 42,
    );
    return () => clearInterval(id);
  }, [run, speed, reduced]);

  const update = (change: Partial<LorentzInput>) => {
    setInput((old) => ({ ...old, ...change }));
    setProgress(0.58);
    setRun("paused");
    setFeedback("");
  };
  const reset = () => {
    setInput(defaults);
    setRun("idle");
    setProgress(0.58);
    setYaw(18);
    setMission(false);
    setFeedback("");
  };
  const startMission = () => {
    setMission(true);
    setInput({
      ...defaults,
      velocityAngleDeg: 90,
      speed: 2e6,
      electricField: 2e5,
      magneticField: 0.15,
    });
    setProgress(1);
    setRun("paused");
    setFeedback(
      "Pass only the 2.00 × 10⁶ m/s beam. Balance electric and magnetic forces with E = vB.",
    );
  };
  const checkMission = () => {
    const target = 2e6;
    const targetPass =
      Math.abs(input.electricField - target * input.magneticField) <= 1500;
    const rejectSlow =
      Math.abs(input.electricField - 1.5e6 * input.magneticField) > 25000;
    const pass =
      input.velocityAngleDeg === 90 &&
      targetPass &&
      rejectSlow &&
      Math.abs(input.magneticField) >= 0.05;
    setFeedback(
      pass
        ? `✓ Selector tuned: E/B = ${(result.selectorSpeed / 1e6).toFixed(2)} × 10⁶ m/s. The 2.00 × 10⁶ m/s beam passes; 1.50 × 10⁶ m/s deflects.`
        : `Set θ = 90° and make E/B = 2.00 × 10⁶ m/s. Current selected speed: ${Number.isFinite(result.selectorSpeed) ? (result.selectorSpeed / 1e6).toFixed(2) : "—"} × 10⁶ m/s.`,
    );
    if (pass) setRun("result");
  };
  const pointerDown = (event: PointerEvent<SVGSVGElement>) => {
    drag.current = { x: event.clientX, yaw };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (drag.current)
      setYaw(
        Math.max(
          -70,
          Math.min(
            70,
            drag.current.yaw + (event.clientX - drag.current.x) * 0.3,
          ),
        ),
      );
  };
  const pointerUp = () => {
    drag.current = null;
  };
  const forceScale = Math.min(
    90,
    25 + Math.log10(Math.max(result.forceMagnitude, 1e-30) / 1e-20 + 1) * 12,
  );
  const direction = Math.sign(result.force.y || 1);

  return (
    <section
      className="lorentz-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="lorentz-head">
        <div>
          <span>MAGNETISM · CLASS 12</span>
          <h2>2D Charged-Particle Chamber</h2>
          <p>
            Explore the vector law behind straight, circular, helical and
            crossed-field motion.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="lorentz-grid">
        <aside
          className="lorentz-controls"
          aria-label="Particle and field controls"
        >
          <h3>Particle</h3>
          <div
            className="species-buttons"
            role="group"
            aria-label="Charge sign"
          >
            {(["proton", "electron"] as ChargeSpecies[]).map((species) => (
              <button
                key={species}
                className={input.species === species ? "active" : ""}
                onClick={() => update({ species })}
              >
                {species === "proton" ? "+ Proton" : "− Electron"}
              </button>
            ))}
          </div>
          <Slider
            label="Speed v"
            value={input.speed}
            min={5e5}
            max={5e6}
            step={1e5}
            unit="m/s"
            onChange={(value) => update({ speed: value })}
          />
          <Slider
            label="Velocity angle θ"
            value={input.velocityAngleDeg}
            min={0}
            max={180}
            step={5}
            unit="° to B"
            onChange={(value) => update({ velocityAngleDeg: value })}
          />
          <h3>Crossed fields</h3>
          <Slider
            label="Electric field E"
            value={input.electricField}
            min={-5e5}
            max={5e5}
            step={1e4}
            unit="N/C"
            onChange={(value) => update({ electricField: value })}
          />
          <Slider
            label="Magnetic field B"
            value={input.magneticField}
            min={-0.5}
            max={0.5}
            step={0.01}
            unit="T"
            onChange={(value) => update({ magneticField: value })}
          />
          <button
            className="flip-field"
            onClick={() => update({ magneticField: -input.magneticField })}
          >
            ⇄ Flip B direction
          </button>
          <h3>Trajectory presets</h3>
          <div className="trajectory-presets">
            <button onClick={() => update({ velocityAngleDeg: 0, electricField: 0, magneticField: 0.2 })}>Straight ∥ B</button>
            <button onClick={() => update({ velocityAngleDeg: 90, electricField: 0, magneticField: 0.2 })}>Circular</button>
            <button onClick={() => update({ velocityAngleDeg: 35, electricField: 0, magneticField: 0.2 })}>Helical</button>
            <button onClick={() => update({ velocityAngleDeg: 90, electricField: 2e5, magneticField: 0.2 })}>Crossed fields</button>
          </div>
        </aside>

        <main className="lorentz-main">
          <div className="lorentz-toolbar">
            <div>
              <button
                onClick={() => {
                  if (progress >= 1) setProgress(0);
                  setRun("running");
                }}
              >
                ▶ Launch
              </button>
              <button onClick={() => setRun("paused")}>Ⅱ Pause</button>
              <button
                onClick={() => {
                  setRun("paused");
                  setProgress((old) => Math.min(1, old + 0.04));
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
                onChange={(event) => setSpeed(Number(event.target.value))}
              >
                <option value=".25">0.25×</option>
                <option value=".5">0.5×</option>
                <option value="1">1×</option>
                <option value="2">2×</option>
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
          </div>
          <section
            className="lorentz-stage"
            aria-label={`Two-dimensional projected ${result.trajectory} trajectory; force ${fmt(result.forceMagnitude)} newtons`}
          >
            <img
              src="/assets/experiments/lorentz-force/charged-particle-chamber.png"
              alt="Transparent charged-particle chamber with source and detector"
            />
            <svg
              viewBox="0 0 1200 620"
              role="img"
              tabIndex={0}
              aria-label="Drag or use arrow keys to rotate the projected trajectory"
              onPointerDown={pointerDown}
              onPointerMove={pointerMove}
              onPointerUp={pointerUp}
              onPointerCancel={pointerUp}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft")
                  setYaw((old) => Math.max(-70, old - 5));
                if (event.key === "ArrowRight")
                  setYaw((old) => Math.min(70, old + 5));
              }}
            >
              <defs>
                <filter id="particle-glow">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {Array.from({ length: 11 }, (_, index) => (
                <line
                  className="field-line"
                  key={index}
                  x1={230 + index * 74}
                  y1="190"
                  x2={230 + index * 74}
                  y2="480"
                />
              ))}
              <path className="particle-trail" d={path} />
              <circle
                className={input.species}
                cx={current.x}
                cy={current.y}
                r="11"
                filter="url(#particle-glow)"
              />
              <g
                className="live-vectors"
                transform={`translate(${current.x} ${current.y})`}
              >
                <line className="v-vector" x2="72" y2="-36" />
                <text x="76" y="-38">
                  v
                </text>
                <line className="f-vector" y2={direction * forceScale} />
                <text x="8" y={direction * forceScale}>
                  F
                </text>
              </g>
              <g className="field-key">
                <line
                  className="e-vector"
                  x1="840"
                  y1="130"
                  x2="930"
                  y2="130"
                />
                <text x="940" y="136">
                  E
                </text>
                <circle className="b-symbol" cx="1090" cy="130" r="18" />
                <text x="1083" y="138">
                  {input.magneticField >= 0 ? "•" : "×"}
                </text>
                <text x="1117" y="136">
                  B
                </text>
              </g>
            </svg>
            <div className="view-controls">
              <span>Projected view {yaw.toFixed(0)}°</span>
              <button onClick={() => setYaw(0)}>Top</button>
              <button onClick={() => setYaw(70)}>Side</button>
              <button onClick={() => setYaw(18)}>2.5D</button>
              <button onClick={() => setYaw(18)}>Reset view</button>
            </div>
            <div className="trajectory-badge">
              <b>{result.trajectory.replace("-", " ")}</b>
              <span>
                {input.species === "proton" ? "positive" : "negative"} charge
              </span>
            </div>
          </section>
          <section className="lorentz-equation">
            <b>F⃗ = q(E⃗ + v⃗ × B⃗)</b>
            <span>r = mv⊥/(|q|B) · T = 2πm/(|q|B) · selector v = E/B</span>
          </section>
          <section
            className="trajectory-plots"
            aria-label="Top and side trajectory projections"
          >
            <MiniPlot
              title="Top view (x–y)"
              points={trajectory.points}
              axes={["x", "y"]}
            />
            <MiniPlot
              title="Side view (x–z)"
              points={trajectory.points}
              axes={["x", "z"]}
            />
          </section>
        </main>

        <aside className="lorentz-analysis" aria-label="Live measurements">
          <h3>Live measurements</h3>
          <Reading
            label="Charge q"
            value={`${input.species === "proton" ? "+" : "−"}${fmt(Math.abs(result.charge), 3)} C`}
          />
          <Reading label="Speed |v|" value={`${fmt(input.speed)} m/s`} />
          <Reading
            label="Perpendicular v⊥"
            value={`${fmt(result.perpendicularSpeed)} m/s`}
          />
          <Reading
            label="Parallel v∥"
            value={`${fmt(result.parallelSpeed)} m/s`}
          />
          <Reading
            label="Force |F|"
            value={`${fmt(result.forceMagnitude)} N`}
            accent
          />
          <Reading label="Signed force Fy" value={`${fmt(result.force.y)} N`} />
          <Reading
            label="Magnetic |qv×B|"
            value={`${fmt(result.magneticForceMagnitude)} N`}
          />
          <Reading
            label="Magnetic radius"
            value={
              Number.isFinite(result.radius) ? `${fmt(result.radius)} m` : "∞"
            }
          />
          <Reading
            label="Cyclotron period"
            value={
              Number.isFinite(result.period) ? `${fmt(result.period)} s` : "—"
            }
          />
          <Reading
            label="Helix pitch"
            value={
              Number.isFinite(result.pitch) ? `${fmt(result.pitch)} m` : "—"
            }
          />
          <section
            className={
              result.selectorPass ? "selector-status pass" : "selector-status"
            }
          >
            <b>
              {result.selectorPass
                ? "✓ NET TRANSVERSE FORCE ≈ 0"
                : "CROSSED-FIELD DEFLECTION"}
            </b>
            <span>
              Selected speed{" "}
              {Number.isFinite(result.selectorSpeed)
                ? `${(result.selectorSpeed / 1e6).toFixed(2)} × 10⁶ m/s`
                : "requires B ≠ 0"}
            </span>
          </section>
          <section className="vector-note">
            <b>Direction check</b>
            <span>
              q changes the direction of both electric and magnetic forces. When
              v ∥ B, v × B = 0.
            </span>
          </section>
        </aside>
      </div>
      <section
        className="lorentz-mission"
        aria-label="Velocity selector mission"
      >
        <div>
          <span>CHALLENGE</span>
          <b>Tune a selector for 2.00 × 10⁶ m/s.</b>
          <small>
            Let the target beam pass straight while a 1.50 × 10⁶ m/s beam
            deflects.
          </small>
        </div>
        <button onClick={startMission}>Start challenge</button>
        {mission && (
          <button
            onClick={() =>
              update({
                velocityAngleDeg: 90,
                speed: 2e6,
                electricField: 3e5,
                magneticField: 0.15,
              })
            }
          >
            Set calculated fields
          </button>
        )}
        {mission && <button onClick={checkMission}>Test selector</button>}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}

function MiniPlot({
  title,
  points,
  axes,
}: {
  title: string;
  points: Vec3[];
  axes: [keyof Vec3, keyof Vec3];
}) {
  const xs = points.map((point) => point[axes[0]]),
    ys = points.map((point) => point[axes[1]]);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs),
    minY = Math.min(...ys),
    maxY = Math.max(...ys);
  const sx = (value: number) =>
    20 + ((value - minX) / Math.max(maxX - minX, 1e-20)) * 210;
  const sy = (value: number) =>
    95 - ((value - minY) / Math.max(maxY - minY, 1e-20)) * 75;
  const path = points
    .map(
      (point, index) =>
        `${index ? "L" : "M"}${sx(point[axes[0]]).toFixed(1)} ${sy(point[axes[1]]).toFixed(1)}`,
    )
    .join(" ");
  return (
    <div>
      <b>{title}</b>
      <svg viewBox="0 0 250 115" role="img" aria-label={title}>
        <line x1="20" y1="95" x2="235" y2="95" />
        <line x1="20" y1="15" x2="20" y2="95" />
        <path d={path} />
      </svg>
    </div>
  );
}
