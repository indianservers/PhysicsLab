import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  G,
  solveForceBalance,
  stepMotion,
  surfaceFriction,
  type ForceInput,
  type MotionState,
  type Surface,
} from "./balancedForcesSimulation";
import "./balanced-unbalanced-forces.css";
type Run = "idle" | "running" | "paused" | "result";
const D: ForceInput = {
  leftForceN: 180,
  rightForceN: 220,
  massKg: 40,
  frictionCoefficient: 0.03,
  surface: "ice",
};
const M: MotionState = { positionM: 0, velocityMps: 0, timeS: 0 };
const f = (n: number, d = 2) => n.toFixed(d);
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
  onChange: (v: number) => void;
}) {
  return (
    <label className="force-slider">
      <span>
        {label}
        <b>
          {f(value, step < 1 ? 2 : 0)} {unit}
        </b>
      </span>
      <input
        aria-label={label}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <small>
        <i>{min}</i>
        <i>{max}</i>
      </small>
    </label>
  );
}
function Reading({
  label,
  value,
  hot,
}: {
  label: string;
  value: string;
  hot?: boolean;
}) {
  return (
    <div className={hot ? "force-reading hot" : "force-reading"}>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
export function BalancedUnbalancedForcesLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(D),
    [motion, setMotion] = useState(M),
    [run, setRun] = useState<Run>("idle"),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [mission, setMission] = useState(false),
    [feedback, setFeedback] = useState(""),
    [drag, setDrag] = useState<"left" | "right" | null>(null);
  const history = useRef<MotionState[]>([M]);
  const result = useMemo(
    () => solveForceBalance(input, motion.velocityMps),
    [input, motion.velocityMps],
  );
  useEffect(() => {
    if (run !== "running") return;
    const id = window.setInterval(
      () =>
        setMotion((old) => {
          const next = stepMotion(input, old, reduced ? 0.2 : 0.04 * speed);
          history.current = [...history.current.slice(-79), next];
          return next;
        }),
      reduced ? 180 : 45,
    );
    return () => clearInterval(id);
  }, [run, input, speed, reduced]);
  const update = (change: Partial<ForceInput>) => {
    setInput((old) => ({ ...old, ...change }));
    setFeedback("");
  };
  const reset = () => {
    setInput(D);
    setMotion(M);
    history.current = [M];
    setRun("idle");
    setMission(false);
    setFeedback("");
  };
  const arrowMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const box = event.currentTarget.getBoundingClientRect(),
      x = ((event.clientX - box.left) / box.width) * 1000;
    if (drag === "left")
      update({ leftForceN: Math.max(0, Math.min(300, (390 - x) * 1.45)) });
    else update({ rightForceN: Math.max(0, Math.min(300, (x - 610) * 1.45)) });
  };
  const startMission = () => {
    setMission(true);
    setInput({
      ...D,
      leftForceN: 100,
      rightForceN: 100,
      frictionCoefficient: 0.05,
      surface: "wood",
    });
    setMotion({ positionM: 0, velocityMps: 1, timeS: 0 });
    history.current = [{ positionM: 0, velocityMps: 1, timeS: 0 }];
    setFeedback(
      "The cart already moves right. Balance kinetic friction so acceleration is zero without stopping the cart.",
    );
    setRun("paused");
  };
  const targetRight =
    input.leftForceN + input.frictionCoefficient * input.massKg * G;
  const check = () => {
    const pass =
      Math.abs(result.netForceN) < 0.05 && Math.abs(motion.velocityMps) > 0.1;
    setFeedback(
      pass
        ? `✓ Constant velocity: v = ${f(motion.velocityMps)} m/s while ΣF = ${f(result.netForceN)} N and a = ${f(result.accelerationMps2, 3)} m/s².`
        : `Net force is ${f(result.netForceN)} N. For rightward motion, friction is leftward; try right force ${f(targetRight, 1)} N.`,
    );
    if (pass) setRun("result");
  };
  const cartX = 500 + motion.positionM * 24,
    leftLen = Math.min(230, input.leftForceN * 0.7),
    rightLen = Math.min(230, input.rightForceN * 0.7),
    fricLen = Math.min(150, Math.abs(result.frictionN) * 1.5);
  const points = history.current
    .map((p, i) => `${20 + i * 4.4},${105 - p.velocityMps * 20}`)
    .join(" ");
  return (
    <section
      className="force-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header>
        <div>
          <span>MECHANICS · CLASS 8 / 9</span>
          <h2>Force-Composition Cart</h2>
          <p>
            Drag the opposing arrows, predict the motion, and distinguish
            balance from rest.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="force-layout">
        <aside className="force-controls">
          <h3>Opposing pulls</h3>
          <Slider
            label="Left force"
            value={input.leftForceN}
            min={0}
            max={300}
            step={1}
            unit="N"
            onChange={(v) => update({ leftForceN: v })}
          />
          <Slider
            label="Right force"
            value={input.rightForceN}
            min={0}
            max={300}
            step={1}
            unit="N"
            onChange={(v) => update({ rightForceN: v })}
          />
          <div className="force-presets" aria-label="Force presets">
            <button onClick={() => update({ leftForceN: 0, rightForceN: 0 })}>
              Zero
            </button>
            <button
              onClick={() => update({ leftForceN: 180, rightForceN: 180 })}
            >
              Balanced
            </button>
            <button onClick={() => update({ leftForceN: 0, rightForceN: 300 })}>
              Max right
            </button>
          </div>
          <h3>Cart & surface</h3>
          <Slider
            label="Cart mass"
            value={input.massKg}
            min={10}
            max={100}
            step={1}
            unit="kg"
            onChange={(v) => update({ massKg: v })}
          />
          <div className="surface-buttons">
            {(["ice", "wood", "rubber"] as Surface[]).map((s) => (
              <button
                key={s}
                className={input.surface === s ? "active" : ""}
                onClick={() =>
                  update({
                    surface: s,
                    frictionCoefficient: surfaceFriction[s],
                  })
                }
              >
                {s}
              </button>
            ))}
          </div>
          <Slider
            label="Friction coefficient μ"
            value={input.frictionCoefficient}
            min={0}
            max={0.5}
            step={0.01}
            unit=""
            onChange={(v) => update({ frictionCoefficient: v })}
          />
          <p className="force-tip">
            Friction opposes velocity. At rest, static friction first balances
            the attempted motion up to its limit.
          </p>
        </aside>
        <main className="force-main">
          <div className="force-toolbar">
            <div>
              <button onClick={() => setRun("running")}>▶ Run</button>
              <button onClick={() => setRun("paused")}>Ⅱ Pause</button>
              <button
                onClick={() => {
                  setRun("paused");
                  setMotion((old) => stepMotion(input, old, 0.1));
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
            className="force-stage"
            aria-label={`${result.balanced ? "Balanced" : "Unbalanced"} forces; net ${f(result.netForceN)} newtons; acceleration ${f(result.accelerationMps2)} metres per second squared`}
          >
            <img
              src="/assets/experiments/balanced-unbalanced-forces/tug-of-war-cart.png"
              alt="Transparent tug-of-war teams pulling a wheeled cart"
              style={{ transform: `translateX(${motion.positionM * 7}px)` }}
            />
            <svg
              viewBox="0 0 1000 500"
              role="img"
              aria-label="Live force arrows; drag red or blue arrow handle"
              onPointerMove={arrowMove}
              onPointerUp={() => setDrag(null)}
              onPointerCancel={() => setDrag(null)}
            >
              <defs>
                <marker
                  id="force-red-tip"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0 0 8 4 0 8Z" fill="#e44b4b" />
                </marker>
                <marker
                  id="force-blue-tip"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0 0 8 4 0 8Z" fill="#0e79b2" />
                </marker>
                <marker
                  id="force-purple-tip"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0 0 8 4 0 8Z" fill="#7048a8" />
                </marker>
              </defs>
              <g transform={`translate(${cartX} 215)`}>
                <line
                  className="left-arrow"
                  x2={-leftLen}
                  markerEnd="url(#force-red-tip)"
                />
                <circle
                  className="arrow-handle left"
                  cx={-leftLen}
                  r="13"
                  role="slider"
                  tabIndex={0}
                  aria-label="Left force arrow"
                  aria-valuemin={0}
                  aria-valuemax={300}
                  aria-valuenow={Math.round(input.leftForceN)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft" || e.key === "ArrowUp")
                      update({
                        leftForceN: Math.min(300, input.leftForceN + 5),
                      });
                    if (e.key === "ArrowRight" || e.key === "ArrowDown")
                      update({ leftForceN: Math.max(0, input.leftForceN - 5) });
                  }}
                  onPointerDown={(e) => {
                    setDrag("left");
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }}
                />
                <text
                  x={-Math.max(95, leftLen / 2)}
                  y="-18"
                  textAnchor="middle"
                >
                  Fleft {f(input.leftForceN, 0)} N
                </text>
                <line
                  className="right-arrow"
                  x2={rightLen}
                  markerEnd="url(#force-blue-tip)"
                />
                <circle
                  className="arrow-handle right"
                  cx={rightLen}
                  r="13"
                  role="slider"
                  tabIndex={0}
                  aria-label="Right force arrow"
                  aria-valuemin={0}
                  aria-valuemax={300}
                  aria-valuenow={Math.round(input.rightForceN)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowUp")
                      update({
                        rightForceN: Math.min(300, input.rightForceN + 5),
                      });
                    if (e.key === "ArrowLeft" || e.key === "ArrowDown")
                      update({
                        rightForceN: Math.max(0, input.rightForceN - 5),
                      });
                  }}
                  onPointerDown={(e) => {
                    setDrag("right");
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }}
                />
                <text
                  x={Math.max(95, rightLen / 2)}
                  y="-18"
                  textAnchor="middle"
                >
                  Fright {f(input.rightForceN, 0)} N
                </text>
                {Math.abs(result.frictionN) > 0.01 && (
                  <>
                    <line
                      className="friction-arrow"
                      x1="0"
                      x2={Math.sign(result.frictionN) * fricLen}
                      y1="75"
                      y2="75"
                      markerEnd="url(#force-purple-tip)"
                    />
                    <text
                      x={(Math.sign(result.frictionN) * fricLen) / 2}
                      y="105"
                      textAnchor="middle"
                    >
                      friction {f(Math.abs(result.frictionN), 1)} N
                    </text>
                  </>
                )}
              </g>
            </svg>
            <div
              className={
                result.balanced ? "motion-status balanced" : "motion-status"
              }
            >
              <b>{result.balanced ? "BALANCED" : "UNBALANCED"}</b>
              <span>
                {result.balanced
                  ? motion.velocityMps === 0
                    ? "At rest · a = 0"
                    : "Moving at constant velocity · a = 0"
                  : `Accelerating ${result.accelerationMps2 > 0 ? "right" : "left"}`}
              </span>
            </div>
            <div className="motion-meters">
              <b>{f(motion.velocityMps)} m/s</b>
              <b>{f(result.accelerationMps2)} m/s²</b>
              <b>{f(motion.timeS)} s</b>
            </div>
          </section>
          <section className="force-equation">
            <b>ΣF = Fright − Fleft + Ffriction = ma</b>
            <span>
              {f(result.rightForceN)} − {f(result.leftForceN)} + (
              {f(result.frictionN)}) = {f(result.netForceN)} N
            </span>
          </section>
          <section className="force-graph">
            <b>Velocity vs time</b>
            <svg viewBox="0 0 380 130">
              <line x1="20" y1="105" x2="370" y2="105" />
              <polyline points={points} />
            </svg>
          </section>
        </main>
        <aside className="force-analysis">
          <h3>Force tally</h3>
          <Reading label="Left applied" value={`${f(result.leftForceN)} N`} />
          <Reading label="Right applied" value={`${f(result.rightForceN)} N`} />
          <Reading label="Friction" value={`${f(result.frictionN)} N`} />
          <Reading label="Normal" value={`${f(result.normalN)} N`} />
          <Reading label="Weight" value={`${f(result.weightN)} N`} />
          <Reading
            label="Net force ΣF"
            value={`${f(result.netForceN)} N`}
            hot
          />
          <Reading
            label="Acceleration"
            value={`${f(result.accelerationMps2)} m/s²`}
            hot
          />
          <section className="free-body">
            <b>Free-body summary</b>
            <span>Horizontal: applied pulls + friction</span>
            <span>Vertical: N − mg = 0</span>
            <strong>{result.regime} friction</strong>
          </section>
        </aside>
      </div>
      <section className="force-mission">
        <div>
          <span>CHALLENGE</span>
          <b>Create motion with zero net force.</b>
          <small>Keep the cart moving at nonzero constant velocity.</small>
        </div>
        <button onClick={startMission}>Start challenge</button>
        {mission && (
          <button onClick={() => update({ rightForceN: targetRight })}>
            Set calculated balance
          </button>
        )}
        {mission && <button onClick={check}>Check solution</button>}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
