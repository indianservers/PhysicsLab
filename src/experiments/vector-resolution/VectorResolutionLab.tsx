import { useEffect, useMemo, useState, type PointerEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { resolveVector } from "./vectorResolutionSimulation";
import "./vector-resolution.css";

type Snap = 0 | 15 | 45;
const f = (value: number, digits = 1) => value.toFixed(digits);
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const normalize = (angle: number) =>
  ((((angle + 180) % 360) + 360) % 360) - 180;

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
    <label className="vr-range">
      <span>
        {label}
        <b>
          {f(value)} {unit}
        </b>
      </span>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <small>
        <i>{min}</i>
        <i>{max}</i>
      </small>
    </label>
  );
}

export function VectorResolutionLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [magnitude, setMagnitude] = useState(50),
    [angleDeg, setAngleDeg] = useState(35),
    [axisRotationDeg, setAxisRotationDeg] = useState(0),
    [snap, setSnap] = useState<Snap>(15),
    [phase, setPhase] = useState(1),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(false),
    [mission, setMission] = useState(false),
    [feedback, setFeedback] = useState("");
  const resolved = resolveVector({ magnitude, angleDeg, axisRotationDeg });
  const origin = { x: 250, y: 275 },
    scale = 2.35;
  const point = (length: number, degrees: number) => ({
    x: origin.x + length * scale * Math.cos((degrees * Math.PI) / 180),
    y: origin.y - length * scale * Math.sin((degrees * Math.PI) / 180),
  });
  const tip = point(magnitude, angleDeg),
    xTip = point(resolved.xComponent, axisRotationDeg),
    yTip = { x: tip.x, y: tip.y };
  const axisX = point(125, axisRotationDeg),
    axisXn = point(-125, axisRotationDeg),
    axisY = point(105, axisRotationDeg + 90),
    axisYn = point(-105, axisRotationDeg + 90);
  const visibleXTip = {
    x: origin.x + (xTip.x - origin.x) * phase,
    y: origin.y + (xTip.y - origin.y) * phase,
  };
  const visibleTip = {
    x: xTip.x + (tip.x - xTip.x) * phase,
    y: xTip.y + (tip.y - xTip.y) * phase,
  };
  const projection = useMemo(
    () =>
      `${origin.x},${origin.y} ${xTip.x},${xTip.y} ${tip.x},${tip.y} ${origin.x + (tip.x - xTip.x)},${origin.y + (tip.y - xTip.y)} ${origin.x},${origin.y}`,
    [tip.x, tip.y, xTip.x, xTip.y],
  );

  const applyAngle = (raw: number) => {
    const normalized = normalize(raw);
    setAngleDeg(
      snap ? Math.round(normalized / snap) * snap : Math.round(normalized),
    );
    setPhase(0);
    setRunning(true);
    setFeedback("");
  };
  const setFromPointer = (event: PointerEvent<SVGCircleElement>) => {
    const rect = event.currentTarget.ownerSVGElement!.getBoundingClientRect(),
      x = ((event.clientX - rect.left) / rect.width) * 640 - origin.x,
      y = origin.y - ((event.clientY - rect.top) / rect.height) * 390;
    setMagnitude(clamp(Math.hypot(x, y) / scale, 5, 100));
    applyAngle((Math.atan2(y, x) * 180) / Math.PI);
  };
  const drag = (event: PointerEvent<SVGCircleElement>) => {
    if (event.buttons & 1) setFromPointer(event);
  };
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setPhase((old) => {
          const next = Math.min(1, old + (reduced ? 0.12 : 0.025) * speed);
          if (next >= 1) setRunning(false);
          return next;
        }),
      reduced ? 100 : 20,
    );
    return () => window.clearInterval(id);
  }, [reduced, running, speed]);
  const reset = () => {
    setMagnitude(50);
    setAngleDeg(35);
    setAxisRotationDeg(0);
    setSnap(15);
    setPhase(1);
    setRunning(false);
    setMission(false);
    setFeedback("");
  };
  const missionPass =
    Math.abs(magnitude - 60) <= 1 &&
    Math.abs(normalize(angleDeg - 30)) <= 1 &&
    Math.abs(resolved.xComponent) <= 55 &&
    Math.abs(resolved.yComponent) <= 35;

  return (
    <section
      className="vr-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="vr-head" data-ui-theme="dark">
        <div>
          <span>VECTOR COMPONENT STUDIO</span>
          <h2>Pull once. Measure twice.</h2>
          <p>
            Drag the purple handle; perpendicular projections rebuild the
            original vector.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="vr-layout">
        <aside className="vr-controls">
          <h3>Vector setup</h3>
          <Range
            label="Magnitude"
            value={magnitude}
            min={5}
            max={100}
            step={1}
            unit="N"
            onChange={(value) => {
              setMagnitude(value);
              setPhase(0);
            }}
          />
          <Range
            label="Angle"
            value={angleDeg}
            min={-180}
            max={180}
            step={1}
            unit="°"
            onChange={applyAngle}
          />
          <Range
            label="Axis rotation"
            value={axisRotationDeg}
            min={-90}
            max={90}
            step={1}
            unit="°"
            onChange={(value) => {
              setAxisRotationDeg(value);
              setPhase(0);
            }}
          />
          <label className="vr-snap">
            Snap mode
            <select
              aria-label="Snap mode"
              value={snap}
              onChange={(event) => setSnap(Number(event.target.value) as Snap)}
            >
              <option value={0}>Off</option>
              <option value={15}>15°</option>
              <option value={45}>45°</option>
            </select>
          </label>
          <div className="vr-presets">
            <button
              onClick={() => {
                setMagnitude(5);
                applyAngle(-180);
                setAxisRotationDeg(-90);
              }}
            >
              Minimums
            </button>
            <button onClick={reset}>Typical</button>
            <button
              onClick={() => {
                setMagnitude(100);
                applyAngle(180);
                setAxisRotationDeg(90);
              }}
            >
              Maximums
            </button>
          </div>
          <div className="vr-tools">
            <button onClick={() => setPhase(0)}>Hide projections</button>
            <button
              onClick={() => {
                setPhase(0);
                setRunning(true);
              }}
            >
              Recombine
            </button>
          </div>
        </aside>
        <div className="vr-center">
          <div className="vr-transport">
            <button onClick={() => setRunning(true)}>▶ Play</button>
            <button onClick={() => setRunning(false)}>Ⅱ Pause</button>
            <button
              onClick={() => {
                setRunning(false);
                setPhase((old) => Math.min(1, old + 0.1));
              }}
            >
              ▷ Step
            </button>
            <button
              onClick={() => {
                setPhase(0);
                setRunning(true);
              }}
            >
              ↺ Replay
            </button>
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
          </div>
          <section
            className="vr-stage"
            aria-label={`Vector ${f(magnitude)} newtons at ${f(angleDeg)} degrees; components ${f(resolved.xComponent)} and ${f(resolved.yComponent)} newtons`}
          >
            <img
              src="/assets/experiments/vector-resolution/crate-rope.png"
              alt="Wooden crate with rope anchor"
            />
            <svg
              viewBox="0 0 640 390"
              onPointerMove={(event) => {
                if (event.target instanceof SVGCircleElement)
                  drag(event as unknown as PointerEvent<SVGCircleElement>);
              }}
            >
              <defs>
                <marker
                  id="vr-purple"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0,0 L8,4 L0,8z" />
                </marker>
                <marker
                  id="vr-blue"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0,0 L8,4 L0,8z" />
                </marker>
                <marker
                  id="vr-green"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0,0 L8,4 L0,8z" />
                </marker>
              </defs>
              <g className="vr-grid">
                {[80, 140, 200, 260, 320, 380, 440, 500, 560].map((x) => (
                  <line key={`x${x}`} x1={x} y1="20" x2={x} y2="370" />
                ))}
                {[35, 95, 155, 215, 275, 335].map((y) => (
                  <line key={`y${y}`} x1="25" y1={y} x2="615" y2={y} />
                ))}
              </g>
              <g className="vr-axes">
                <line x1={axisXn.x} y1={axisXn.y} x2={axisX.x} y2={axisX.y} />
                <line x1={axisYn.x} y1={axisYn.y} x2={axisY.x} y2={axisY.y} />
              </g>
              <polyline className="vr-parallelogram" points={projection} />
              <line
                className="vr-xcomp"
                x1={origin.x}
                y1={origin.y}
                x2={visibleXTip.x}
                y2={visibleXTip.y}
                markerEnd="url(#vr-blue)"
              />
              <line
                className="vr-ycomp"
                x1={xTip.x}
                y1={xTip.y}
                x2={visibleTip.x}
                y2={visibleTip.y}
                markerEnd="url(#vr-green)"
              />
              <line
                className="vr-resultant"
                x1={origin.x}
                y1={origin.y}
                x2={tip.x}
                y2={tip.y}
                markerEnd="url(#vr-purple)"
              />
              <circle
                className="vr-handle"
                cx={tip.x}
                cy={tip.y}
                r="10"
                tabIndex={0}
                aria-label="Drag vector head"
                onPointerDown={(event) =>
                  event.currentTarget.setPointerCapture(event.pointerId)
                }
                onPointerMove={drag}
                onPointerUp={(event) => {
                  setFromPointer(event);
                  event.currentTarget.releasePointerCapture(event.pointerId);
                  setRunning(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowRight")
                    applyAngle(angleDeg + (snap || 1));
                  if (event.key === "ArrowDown" || event.key === "ArrowLeft")
                    applyAngle(angleDeg - (snap || 1));
                }}
              />
              <text x={tip.x + 12} y={tip.y - 10}>
                A = {f(magnitude)} N
              </text>
              <text
                className="vr-xtext"
                x={(origin.x + xTip.x) / 2}
                y={(origin.y + xTip.y) / 2 + 18}
              >
                Aₓ {f(resolved.xComponent)}
              </text>
              <text
                className="vr-ytext"
                x={xTip.x + 8}
                y={(xTip.y + tip.y) / 2}
              >
                Aᵧ {f(resolved.yComponent)}
              </text>
            </svg>
            <div className="vr-angle">
              θ = {f(resolved.relativeAngleDeg)}° relative to x′
            </div>
          </section>
        </div>
        <aside className="vr-readings">
          <h3>Live measurements</h3>
          <dl>
            <div>
              <dt>A applied</dt>
              <dd>{f(magnitude)} N</dd>
            </div>
            <div>
              <dt>Aₓ along x′</dt>
              <dd>{f(resolved.xComponent)} N</dd>
            </div>
            <div>
              <dt>Aᵧ along y′</dt>
              <dd>{f(resolved.yComponent)} N</dd>
            </div>
            <div>
              <dt>√(Aₓ²+Aᵧ²)</dt>
              <dd>{f(resolved.recombinedMagnitude)} N</dd>
            </div>
            <div>
              <dt>Direction</dt>
              <dd>{f(resolved.recombinedAngleDeg)}°</dd>
            </div>
          </dl>
          <div className="vr-formulas">
            <b>Aₓ = A cos(θ−φ)</b>
            <b>Aᵧ = A sin(θ−φ)</b>
            <small>φ is the rotated x′ axis.</small>
          </div>
          <div className="vr-bars">
            <i style={{ height: `${Math.abs(resolved.xComponent)}%` }}>x</i>
            <i style={{ height: `${Math.abs(resolved.yComponent)}%` }}>y</i>
            <i style={{ height: `${magnitude}%` }}>A</i>
          </div>
        </aside>
      </div>
      <section className="vr-mission">
        <div>
          <span>COMPONENT-LIMIT MISSION</span>
          <b>Create 60 N at 30°.</b>
          <small>Limits: |Aₓ| ≤ 55 N and |Aᵧ| ≤ 35 N.</small>
        </div>
        <button
          onClick={() => {
            setMission(true);
            setFeedback("Adjust magnitude and angle, then test the resultant.");
          }}
        >
          Start mission
        </button>
        {mission && (
          <button
            onClick={() => {
              setMagnitude(60);
              setAngleDeg(30);
              setAxisRotationDeg(0);
              setPhase(0);
              setRunning(true);
            }}
          >
            Load target setup
          </button>
        )}
        {mission && (
          <button
            onClick={() =>
              setFeedback(
                missionPass
                  ? `✓ Target reached: ${f(magnitude)} N at ${f(angleDeg)}°; components remain within limits.`
                  : `Result is ${f(magnitude)} N at ${f(angleDeg)}°. Adjust toward 60 N at 30°.`,
              )
            }
          >
            Check resultant
          </button>
        )}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
