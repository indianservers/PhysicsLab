import { useEffect, useMemo, useRef, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  pointAt,
  projectileDefaults,
  projectileFlight,
  type ProjectileInput,
} from "./projectile-motionSimulation";
import "./projectile-motion.css";

const f = (n: number, d = 2) => n.toFixed(d);
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
  return (
    <label className="pm-range">
      <span>
        {label}
        <b>
          {f(value, step < 0.1 ? 2 : 1)} {unit}
        </b>
      </span>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <small>
        {min}
        <i>{max}</i>
      </small>
    </label>
  );
}
function MiniGraph({
  title,
  points,
  field,
  color,
}: {
  title: string;
  points: { t: number; x: number; y: number; vx: number; vy: number }[];
  field: "x" | "y" | "vx" | "vy";
  color: string;
}) {
  const vals = points.map((p) => p[field]),
    min = Math.min(0, ...vals),
    max = Math.max(1, ...vals),
    last = points[points.length - 1]?.t || 1,
    coords = points
      .map(
        (p) =>
          `${12 + (p.t / last) * 176},${90 - ((p[field] - min) / (max - min || 1)) * 74}`,
      )
      .join(" ");
  return (
    <section className="pm-graph">
      <b>{title}</b>
      <svg viewBox="0 0 200 100">
        <line x1="10" y1="90" x2="192" y2="90" />
        <line x1="10" y1="90" x2="10" y2="8" />
        <polyline points={coords} style={{ stroke: color }} />
      </svg>
    </section>
  );
}
export function ProjectileMotionLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [input, setInput] = useState<ProjectileInput>(projectileDefaults),
    [time, setTime] = useState(0),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [target, setTarget] = useState({ x: 40, y: 2 }),
    [mission, setMission] = useState(false),
    [feedback, setFeedback] = useState(""),
    [compare, setCompare] = useState(false);
  const stamp = useRef(0);
  const flight = useMemo(() => projectileFlight(input), [input]),
    point = pointAt(flight.points, time),
    comp = useMemo(
      () =>
        projectileFlight({
          ...input,
          angleDeg: 90 - input.angleDeg,
          airResistance: false,
          heightM: 0,
        }),
      [input],
    );
  const update = (change: Partial<ProjectileInput>) => {
    setInput((o) => ({ ...o, ...change }));
    setTime(0);
    setRunning(false);
    setFeedback("");
  };
  useEffect(() => {
    if (!running) return;
    if (reduced) {
      const id = setInterval(
        () =>
          setTime((old) => {
            const next = Math.min(flight.timeS, old + 0.15);
            if (next >= flight.timeS) setRunning(false);
            return next;
          }),
        350 / speed,
      );
      return () => clearInterval(id);
    }
    let frame = 0;
    const tick = (now: number) => {
      if (!stamp.current) stamp.current = now;
      const dt = Math.min(0.04, (now - stamp.current) / 1000) * speed;
      stamp.current = now;
      setTime((old) => {
        const next = Math.min(flight.timeS, old + dt);
        if (next >= flight.timeS) setRunning(false);
        return next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      stamp.current = 0;
    };
  }, [flight.timeS, reduced, running, speed]);
  useEffect(() => {
    if (time < flight.timeS) return;
    const miss = Math.min(
      ...flight.points.map((p) => Math.hypot(p.x - target.x, p.y - target.y)),
    );
    if (mission)
      setFeedback(
        miss <= 1.5
          ? `✓ HIT · closest approach ${f(miss)} m.`
          : `Missed by ${f(miss)} m. Adjust speed or angle.`,
      );
  }, [flight.points, flight.timeS, mission, target, time]);
  const maxX = Math.max(50, flight.rangeM, target.x) * 1.08,
    maxY = Math.max(12, flight.peakM, target.y + 3) * 1.08,
    xy = (p: { x: number; y: number }) =>
      `${35 + (p.x / maxX) * 760},${320 - (p.y / maxY) * 270}`,
    trajectory = flight.points.map(xy).join(" "),
    current = xy(point).split(",");
  const aim = () => {
    const a = (input.angleDeg * Math.PI) / 180,
      den =
        2 *
        Math.cos(a) ** 2 *
        (input.heightM + target.x * Math.tan(a) - target.y);
    if (den <= 0) {
      setFeedback("That angle cannot reach the target from this height.");
      return;
    }
    update({
      speedMps: Math.min(
        50,
        Math.sqrt((input.gravityMps2 * target.x ** 2) / den),
      ),
      airResistance: false,
    });
  };
  return (
    <section
      className="pm-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header data-ui-theme="dark">
        <div>
          <span>PROJECTILE RANGE · COMPONENT LAB</span>
          <h2>One flight. Two independent motions.</h2>
          <p>
            Scrub the launch and watch horizontal and vertical components evolve
            together.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setInput(projectileDefaults);
            setTime(0);
            setRunning(false);
            setTarget({ x: 40, y: 2 });
            setMission(false);
            setCompare(false);
            setFeedback("");
          }}
        >
          ↻ Reset experiment
        </button>
      </header>
      <div className="pm-layout">
        <aside className="pm-controls">
          <h3>Launcher controls</h3>
          <Range
            label="Launch speed"
            value={input.speedMps}
            min={5}
            max={50}
            step={1}
            unit="m/s"
            onChange={(speedMps) => update({ speedMps })}
          />
          <Range
            label="Launch angle"
            value={input.angleDeg}
            min={5}
            max={85}
            step={1}
            unit="°"
            onChange={(angleDeg) => update({ angleDeg })}
          />
          <Range
            label="Launch height"
            value={input.heightM}
            min={0}
            max={10}
            step={0.5}
            unit="m"
            onChange={(heightM) => update({ heightM })}
          />
          <Range
            label="Gravity"
            value={input.gravityMps2}
            min={1.62}
            max={24.79}
            step={0.01}
            unit="m/s²"
            onChange={(gravityMps2) => update({ gravityMps2 })}
          />
          <label className="pm-toggle">
            <input
              aria-label="Air resistance"
              type="checkbox"
              checked={input.airResistance}
              onChange={(e) => update({ airResistance: e.target.checked })}
            />{" "}
            Air resistance
          </label>
          {input.airResistance && (
            <Range
              label="Drag coefficient"
              value={input.dragCoefficient}
              min={0}
              max={1}
              step={0.01}
              unit=""
              onChange={(dragCoefficient) => update({ dragCoefficient })}
            />
          )}
          <div className="pm-presets">
            <button
              type="button"
              onClick={() =>
                update({
                  speedMps: 5,
                  angleDeg: 5,
                  heightM: 0,
                  gravityMps2: 1.62,
                  airResistance: false,
                })
              }
            >
              Minimums
            </button>
            <button type="button" onClick={() => update(projectileDefaults)}>
              Typical
            </button>
            <button
              type="button"
              onClick={() =>
                update({
                  speedMps: 50,
                  angleDeg: 85,
                  heightM: 10,
                  gravityMps2: 24.79,
                  airResistance: true,
                  dragCoefficient: 1,
                })
              }
            >
              Maximums
            </button>
          </div>
          <p>
            {flight.rangeFormulaValid
              ? "Level-ground range formula is valid."
              : "R = v₀²sin(2θ)/g is hidden: it requires level ground and no drag."}
          </p>
        </aside>
        <main className="pm-main">
          <div className="pm-toolbar">
            <button
              type="button"
              onClick={() => {
                if (time >= flight.timeS) setTime(0);
                setRunning(true);
              }}
            >
              ▶ Launch
            </button>
            <button type="button" onClick={() => setRunning(false)}>
              Ⅱ Pause
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setTime((t) => Math.min(flight.timeS, t + 0.05));
              }}
            >
              ▷ Step
            </button>
            <label>
              Speed{" "}
              <select
                aria-label="Playback speed"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              >
                <option value=".25">0.25×</option>
                <option value=".5">0.5×</option>
                <option value="1">1×</option>
                <option value="2">2×</option>
              </select>
            </label>
            <label>
              <input
                aria-label="Reduced motion"
                type="checkbox"
                checked={reduced}
                onChange={(e) => setReduced(e.target.checked)}
              />{" "}
              Reduced motion
            </label>
          </div>
          <section
            className="pm-stage"
            aria-label={`Projectile at x ${f(point.x)} metres, y ${f(point.y)} metres`}
          >
            <svg viewBox="0 0 820 350" preserveAspectRatio="none">
              <line x1="25" y1="320" x2="805" y2="320" />
              <polyline className="path" points={trajectory} />
              {compare && (
                <polyline
                  className="compare"
                  points={comp.points.map((p) => xy(p)).join(" ")}
                />
              )}
              <line
                className="ghost-x"
                x1="35"
                y1={current[1]}
                x2={current[0]}
                y2={current[1]}
              />
              <line
                className="ghost-y"
                x1={current[0]}
                y1="320"
                x2={current[0]}
                y2={current[1]}
              />
              <circle className="ball" cx={current[0]} cy={current[1]} r="7" />
              <line
                className="vx"
                x1={current[0]}
                y1={current[1]}
                x2={Number(current[0]) + point.vx * 2}
                y2={current[1]}
              />
              <line
                className="vy"
                x1={current[0]}
                y1={current[1]}
                x2={current[0]}
                y2={Number(current[1]) - point.vy * 2}
              />
            </svg>
            <div className="pm-launcher">
              <img
                src="/assets/experiments/projectile-motion/launcher-target.png"
                alt="Ball launcher"
              />
            </div>
            <div
              className="pm-target"
              style={{
                left: `${4 + (target.x / maxX) * 92}%`,
                bottom: `${9 + (target.y / maxY) * 77}%`,
              }}
            >
              <img
                src="/assets/experiments/projectile-motion/launcher-target.png"
                alt="Movable target"
              />
            </div>
            <div className="pm-apex">
              Peak <b>{f(flight.peakM)} m</b>
            </div>
          </section>
          <input
            className="pm-scrub"
            aria-label="Flight time"
            type="range"
            min="0"
            max={flight.timeS}
            step=".01"
            value={time}
            onChange={(e) => {
              setTime(Number(e.target.value));
              setRunning(false);
            }}
          />
          <div className="pm-equations">
            <b>x=v₀cosθ·t</b>
            <b>y=h₀+v₀sinθ·t−½gt²</b>
            <b>vᵧ=v₀sinθ−gt</b>
          </div>
        </main>
        <aside className="pm-data">
          <h3>Live measurements</h3>
          <dl>
            <div>
              <dt>Time</dt>
              <dd>{f(time)} s</dd>
            </div>
            <div>
              <dt>x / y</dt>
              <dd>
                {f(point.x)} / {f(point.y)} m
              </dd>
            </div>
            <div>
              <dt>vₓ / vᵧ</dt>
              <dd>
                {f(point.vx)} / {f(point.vy)} m/s
              </dd>
            </div>
            <div>
              <dt>Time of flight</dt>
              <dd>{f(flight.timeS)} s</dd>
            </div>
            <div>
              <dt>Range</dt>
              <dd>{f(flight.rangeM)} m</dd>
            </div>
            <div>
              <dt>Peak</dt>
              <dd>{f(flight.peakM)} m</dd>
            </div>
          </dl>
          <button type="button" onClick={() => setCompare((v) => !v)}>
            {compare ? "Hide" : "Compare"} {90 - input.angleDeg}° complement
          </button>
        </aside>
      </div>
      <section className="pm-graphs">
        <MiniGraph
          title="x(t) horizontal"
          points={flight.points}
          field="x"
          color="#4a9b2f"
        />
        <MiniGraph
          title="y(t) vertical"
          points={flight.points}
          field="y"
          color="#2376c9"
        />
        <MiniGraph
          title="vₓ(t)"
          points={flight.points}
          field="vx"
          color="#d97619"
        />
        <MiniGraph
          title="vᵧ(t)"
          points={flight.points}
          field="vy"
          color="#7a46b5"
        />
      </section>
      <section className="pm-mission">
        <div>
          <span>TARGET MISSION</span>
          <b>Hit the movable target.</b>
          <small>
            Target: x={f(target.x, 1)} m, y={f(target.y, 1)} m · tolerance 1.5 m
          </small>
        </div>
        <label>
          Target x{" "}
          <input
            aria-label="Target x"
            type="number"
            min="10"
            max="100"
            value={target.x}
            onChange={(e) =>
              setTarget((o) => ({ ...o, x: Number(e.target.value) }))
            }
          />
        </label>
        <label>
          Target y{" "}
          <input
            aria-label="Target y"
            type="number"
            min="0"
            max="20"
            value={target.y}
            onChange={(e) =>
              setTarget((o) => ({ ...o, y: Number(e.target.value) }))
            }
          />
        </label>
        <button
          type="button"
          onClick={() => {
            setMission(true);
            setFeedback("Choose a launch, then play the full flight.");
          }}
        >
          Start mission
        </button>
        {mission && (
          <button type="button" onClick={aim}>
            Load ideal no-drag solution
          </button>
        )}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
