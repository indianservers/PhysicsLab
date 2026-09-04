import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  circularVectors,
  simulateCircularMotion,
  tangentRelease,
  type CircularMotionInput,
} from "./circular-motionSimulation";
import "./circular-motion.css";

const DEFAULTS: CircularMotionInput = {
  mass: 0.5,
  radius: 2.6,
  omega: 2.2,
  direction: 1,
};
const fmt = (value: number, digits = 2) => value.toFixed(digits);
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
  return (
    <label className="cm-range">
      <span>
        {label}
        <b>
          {fmt(value, step < 0.1 ? 2 : 1)} {unit}
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
        <i>{min}</i>
        <i>{max}</i>
      </small>
    </label>
  );
}

export function CircularMotionLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(DEFAULTS),
    [angle, setAngle] = useState(-Math.PI / 4),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [released, setReleased] = useState<{ angle: number; time: number } | null>(
      null,
    ),
    [mission, setMission] = useState<{ force: number; radius: number } | null>(
      null,
    ),
    [feedback, setFeedback] = useState("");
  const result = useMemo(() => simulateCircularMotion(input), [input]);
  useEffect(() => {
    if (!running) return;
    const dt = reduced ? 0.12 : 0.035;
    const timer = window.setInterval(
      () => {
        if (released)
          setReleased((old) =>
            old ? { ...old, time: Math.min(1.7, old.time + dt * speed) } : old,
          );
        else setAngle((old) => old + result.angularVelocity * dt * speed);
      },
      reduced ? 150 : 35,
    );
    return () => clearInterval(timer);
  }, [released, reduced, result.angularVelocity, running, speed]);
  const update = (change: Partial<CircularMotionInput>) => {
    setInput((old) => ({ ...old, ...change }));
    setReleased(null);
    setFeedback("");
  };
  const reset = () => {
    setInput(DEFAULTS);
    setAngle(-Math.PI / 4);
    setRunning(false);
    setReleased(null);
    setMission(null);
    setFeedback("");
  };
  const beginMission = () => {
    setMission({ force: result.centripetalForce, radius: input.radius });
    setFeedback(
      "Change radius, then tune angular speed so the original centripetal force is restored.",
    );
  };
  const missionOmega = mission
    ? Math.sqrt(mission.force / (input.mass * input.radius))
    : input.omega;
  const checkMission = () => {
    if (!mission) return;
    const changed = Math.abs(input.radius - mission.radius) >= 0.4,
      error = Math.abs(result.centripetalForce - mission.force) / mission.force;
    setFeedback(
      changed && error < 0.005
        ? `✓ Constant force preserved: ${fmt(result.centripetalForce)} N at r = ${fmt(input.radius)} m; ω = ${fmt(input.omega)} rad/s.`
        : !changed
          ? "Change radius by at least 0.40 m first."
          : `Force differs by ${fmt(error * 100, 1)}%. Try ω = ${fmt(missionOmega, 2)} rad/s.`,
    );
  };
  const scale = 43,
    cx = 400,
    cy = 300,
    theta = released?.angle ?? angle,
    vectors = circularVectors(input, theta),
    free = released
      ? tangentRelease(input, released.angle, released.time)
      : vectors.position,
    px = cx + free.x * scale,
    py = cy - free.y * scale,
    radialX = cx + vectors.position.x * scale,
    radialY = cy - vectors.position.y * scale;
  const releasePath = released
      ? Array.from({ length: 25 }, (_, i) =>
          tangentRelease(input, released.angle, (released.time * i) / 24),
        )
          .map((p) => `${cx + p.x * scale},${cy - p.y * scale}`)
          .join(" ")
      : "",
    vNorm = Math.max(0.001, Math.abs(result.tangentialSpeed)),
    vx = (vectors.velocity.x / vNorm) * 78,
    vy = (-vectors.velocity.y / vNorm) * 78,
    aNorm = Math.max(0.001, result.centripetalAcceleration),
    ax = (vectors.acceleration.x / aNorm) * 72,
    ay = (-vectors.acceleration.y / aNorm) * 72;
  const graph = Array.from({ length: 9 }, (_, i) => {
      const omega = 0.5 + i * 0.65;
      return { x: omega ** 2, y: input.mass * input.radius * omega ** 2 };
    }),
    maxGraph = Math.max(...graph.map((p) => p.y));
  return (
    <section
      className="cm-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header>
        <div>
          <span>TOP-DOWN ROTATING PLATFORM LAB</span>
          <h2>Circular Motion: Centripetal Force</h2>
          <p>
            Velocity stays tangent while acceleration and force point inward.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="cm-layout">
        <aside className="cm-controls">
          <h3>
            <b>1</b> Apparatus
          </h3>
          <div className="cm-toggle">
            <button className="active">● Puck</button>
            <button disabled>Car mode</button>
          </div>
          <h3>
            <b>2</b> Parameters
          </h3>
          <Range
            label="Mass"
            value={input.mass}
            min={0.1}
            max={2}
            step={0.05}
            unit="kg"
            onChange={(mass) => update({ mass })}
          />
          <Range
            label="Radius"
            value={input.radius}
            min={0.8}
            max={5}
            step={0.1}
            unit="m"
            onChange={(radius) => update({ radius })}
          />
          <Range
            label="Angular speed"
            value={input.omega}
            min={0.5}
            max={6}
            step={0.05}
            unit="rad/s"
            onChange={(omega) => update({ omega })}
          />
          <div className="cm-presets" aria-label="Parameter presets">
            <button
              onClick={() => update({ mass: 0.1, radius: 0.8, omega: 0.5 })}
            >
              Minimums
            </button>
            <button
              onClick={() => update({ mass: 0.5, radius: 2.6, omega: 2.2 })}
            >
              Typical
            </button>
            <button onClick={() => update({ mass: 2, radius: 5, omega: 6 })}>
              Maximums
            </button>
          </div>
          <span className="cm-label">Rotation direction</span>
          <div className="cm-toggle">
            <button
              className={input.direction === 1 ? "active" : ""}
              onClick={() => update({ direction: 1 })}
            >
              ↻ CCW
            </button>
            <button
              className={input.direction === -1 ? "active" : ""}
              onClick={() => update({ direction: -1 })}
            >
              ↺ CW
            </button>
          </div>
          <button
            className={released ? "cm-release active" : "cm-release"}
            onClick={() => {
              setReleased({ angle, time: 0 });
              setRunning(true);
            }}
          >
            Release constraint
          </button>
          <p className="cm-note">
            On release, no inward constraint remains: the puck keeps its
            instantaneous tangential velocity.
          </p>
        </aside>
        <main className="cm-main">
          <div className="cm-toolbar">
            <div>
              <button onClick={() => setRunning(true)}>▶ Play</button>
              <button onClick={() => setRunning(false)}>Ⅱ Pause</button>
              <button
                onClick={() => {
                  setRunning(false);
                  released
                    ? setReleased((old) =>
                        old ? { ...old, time: old.time + 0.08 } : old,
                      )
                    : setAngle((old) => old + result.angularVelocity * 0.08);
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
            className="cm-stage"
            aria-label={`Tangential speed ${fmt(Math.abs(result.tangentialSpeed))} metres per second; inward acceleration ${fmt(result.centripetalAcceleration)} metres per second squared`}
          >
            <img
              src="/assets/experiments/circular-motion/rotating-platform.png"
              alt="Top-down circular-motion platform"
            />
            <svg
              viewBox="0 0 800 600"
              role="img"
              aria-label="Live rotating mass with tangent velocity and inward force vectors"
            >
              <defs>
                <marker
                  id="cm-green"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0 0 8 4 0 8Z" fill="#36d27d" />
                </marker>
                <marker
                  id="cm-orange"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0 0 8 4 0 8Z" fill="#ffb62e" />
                </marker>
              </defs>
              {!released && (
                <line
                  className="cm-string"
                  x1={cx}
                  y1={cy}
                  x2={radialX}
                  y2={radialY}
                />
              )}
              <circle
                className="cm-orbit"
                cx={cx}
                cy={cy}
                r={input.radius * scale}
              />
              {released && (
                <polyline className="cm-trail" points={releasePath} />
              )}
              <circle
                className="cm-mass"
                cx={px}
                cy={py}
                r={14 + input.mass * 3}
              />
              <line
                className="cm-velocity"
                x1={px}
                y1={py}
                x2={px + vx}
                y2={py + vy}
                markerEnd="url(#cm-green)"
              />
              <text x={px + vx + 6} y={py + vy - 5}>
                v tangent
              </text>
              {!released && (
                <>
                  <line
                    className="cm-force"
                    x1={radialX}
                    y1={radialY}
                    x2={radialX + ax}
                    y2={radialY + ay}
                    markerEnd="url(#cm-orange)"
                  />
                  <text x={radialX + ax} y={radialY + ay - 8}>
                    a, F inward
                  </text>
                </>
              )}
            </svg>
            <div className="cm-sensor">
              <span>TENSION</span>
              <b>{released ? "0.00" : fmt(result.centripetalForce)}</b>
              <i>N</i>
            </div>
            <div className={released ? "cm-state released" : "cm-state"}>
              {released
                ? "CONSTRAINT RELEASED · TANGENT ESCAPE"
                : input.direction === 1
                  ? "COUNTERCLOCKWISE"
                  : "CLOCKWISE"}
            </div>
          </section>
          <section className="cm-equations">
            <div>
              <span>Tangential speed</span>
              <b>v = ωr = {fmt(Math.abs(result.tangentialSpeed))} m/s</b>
            </div>
            <div>
              <span>Radial acceleration</span>
              <b>
                a<sub>c</sub> = v²/r = ω²r ={" "}
                {fmt(result.centripetalAcceleration)} m/s²
              </b>
            </div>
            <div>
              <span>Inward force</span>
              <b>
                F<sub>c</sub> = ma<sub>c</sub> = {fmt(result.centripetalForce)}{" "}
                N
              </b>
            </div>
          </section>
        </main>
        <aside className="cm-data">
          <h3>Live measurements</h3>
          <dl>
            <div>
              <dt>Speed v</dt>
              <dd>{fmt(Math.abs(result.tangentialSpeed))} m/s</dd>
            </div>
            <div>
              <dt>Radius r</dt>
              <dd>{fmt(input.radius)} m</dd>
            </div>
            <div>
              <dt>
                Acceleration a<sub>c</sub>
              </dt>
              <dd>{fmt(result.centripetalAcceleration)} m/s²</dd>
            </div>
            <div>
              <dt>
                Force F<sub>c</sub>
              </dt>
              <dd>{released ? "0.00" : fmt(result.centripetalForce)} N</dd>
            </div>
            <div>
              <dt>Period T</dt>
              <dd>{fmt(result.period)} s</dd>
            </div>
          </dl>
          <section className="cm-graph">
            <b>
              F<sub>c</sub> vs ω²
            </b>
            <svg viewBox="0 0 260 170">
              <line x1="28" y1="145" x2="250" y2="145" />
              <line x1="28" y1="15" x2="28" y2="145" />
              <polyline
                points={graph
                  .map(
                    (p, i) => `${28 + i * 27},${145 - (p.y / maxGraph) * 125}`,
                  )
                  .join(" ")}
              />
              {graph.map((p, i) => (
                <circle
                  key={p.x}
                  cx={28 + i * 27}
                  cy={145 - (p.y / maxGraph) * 125}
                  r="3"
                />
              ))}
            </svg>
            <small>
              Straight line; slope = mr = {fmt(input.mass * input.radius)} kg·m
            </small>
          </section>
          <section className="cm-insight">
            <b>Vector check</b>
            <span>
              v · a<sub>c</sub> = 0
            </span>
            <small>Perpendicular vectors change direction, not speed.</small>
          </section>
        </aside>
      </div>
      <section className="cm-mission">
        <div>
          <span>CHALLENGE</span>
          <b>Keep centripetal force constant while changing radius.</b>
          <small>
            {mission
              ? `Target: ${fmt(mission.force)} N · starting radius ${fmt(mission.radius)} m`
              : "Record the present force, then redesign the orbit."}
          </small>
        </div>
        <button onClick={beginMission}>Start challenge</button>
        {mission && (
          <button
            onClick={() => update({ radius: Math.min(5, mission.radius + 1) })}
          >
            Change radius
          </button>
        )}
        {mission && (
          <button onClick={() => update({ omega: missionOmega })}>
            Set calculated ω
          </button>
        )}
        {mission && <button onClick={checkMission}>Check solution</button>}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
