import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  finiteAmplitudePeriod,
  pendulumDefaults,
  pendulumEnergy,
  pendulumStep,
  radians,
  smallAnglePeriod,
  type PendulumInput,
  type PendulumDynamic,
} from "./simple-pendulumSimulation";
import "./simple-pendulum.css";
const f = (n: number, d = 2) => n.toFixed(d),
  clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
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
    <label className="sp-range">
      <span>
        {label}
        <b>
          {f(value, step < 0.01 ? 3 : 2)} {unit}
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
export function SimplePendulumLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState<PendulumInput>(pendulumDefaults),
    [motion, setMotion] = useState<PendulumDynamic>({
      thetaRad: radians(pendulumDefaults.amplitudeDeg),
      omegaRadS: 0,
    }),
    [time, setTime] = useState(0),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [history, setHistory] = useState<
      { t: number; a: number; ke: number; pe: number }[]
    >([]),
    [periods, setPeriods] = useState<number[]>([]),
    [mission, setMission] = useState(false),
    [guess, setGuess] = useState(""),
    [feedback, setFeedback] = useState("");
  const lastCross = useRef<number | null>(null),
    motionRef = useRef(motion),
    timeRef = useRef(time);
  motionRef.current = motion;
  timeRef.current = time;
  const energy = useMemo(() => pendulumEnergy(input, motion), [input, motion]),
    t0 = smallAnglePeriod(input.lengthM, input.gravityMps2),
    finiteT = finiteAmplitudePeriod(input),
    avg = periods.length
      ? periods.reduce((a, b) => a + b, 0) / periods.length
      : 0,
    estimate = avg ? (4 * Math.PI ** 2 * input.lengthM) / avg ** 2 : 0;
  const resetMotion = (next = input) => {
    setMotion({ thetaRad: radians(next.amplitudeDeg), omegaRadS: 0 });
    setTime(0);
    setRunning(false);
    setHistory([]);
    setPeriods([]);
    lastCross.current = null;
  };
  const update = (change: Partial<PendulumInput>) => {
    const next = { ...input, ...change };
    setInput(next);
    resetMotion(next);
    setFeedback("");
  };
  useEffect(() => {
    if (!running) return;
    const dt = (reduced ? 0.035 : 0.008) * speed,
      id = window.setInterval(
        () => {
          const prev = motionRef.current,
            next = pendulumStep(input, prev, dt),
            nextTime = timeRef.current + dt;
          motionRef.current = next;
          timeRef.current = nextTime;
          setMotion(next);
          setTime(nextTime);
          const e = pendulumEnergy(input, next);
          setHistory((h) => [
            ...h.slice(-239),
            {
              t: nextTime,
              a: (next.thetaRad * 180) / Math.PI,
              ke: e.kineticJ,
              pe: e.potentialJ,
            },
          ]);
          if (prev.thetaRad < 0 && next.thetaRad >= 0 && next.omegaRadS > 0) {
            const previousCross = lastCross.current;
            if (previousCross !== null)
              setPeriods((p) => [...p.slice(-7), nextTime - previousCross]);
            lastCross.current = nextTime;
          }
        },
        reduced ? 90 : 16,
      );
    return () => clearInterval(id);
  }, [input, reduced, running, speed]);
  const setAngleFromPointer = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.closest(".sp-stage")!.getBoundingClientRect(),
      x = e.clientX - (r.left + r.width * 0.5),
      y = e.clientY - (r.top + r.height * 0.14),
      angle = clamp((Math.atan2(x, y) * 180) / Math.PI, -60, 60),
      next = { ...input, amplitudeDeg: Math.abs(angle) };
    setInput(next);
    setMotion({ thetaRad: radians(angle), omegaRadS: 0 });
    setRunning(false);
    setPeriods([]);
    lastCross.current = null;
  };
  const drag = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.buttons & 1) setAngleFromPointer(e);
  };
  const trace = history
      .map(
        (p, i) =>
          `${10 + (i / Math.max(1, history.length - 1)) * 205},${60 - (p.a / 65) * 50}`,
      )
      .join(" "),
    ke = history
      .map(
        (p, i) =>
          `${10 + (i / Math.max(1, history.length - 1)) * 205},${75 - (p.ke / Math.max(0.001, energy.totalJ)) * 55}`,
      )
      .join(" "),
    pe = history
      .map(
        (p, i) =>
          `${10 + (i / Math.max(1, history.length - 1)) * 205},${75 - (p.pe / Math.max(0.001, energy.totalJ)) * 55}`,
      )
      .join(" ");
  return (
    <section
      className="sp-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header data-ui-theme="dark">
        <div>
          <span>PRECISION PENDULUM BENCH</span>
          <h2>Measure the swing, then infer gravity.</h2>
          <p>
            Drag the bob to release and test when the small-angle model holds.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setInput(pendulumDefaults);
            resetMotion(pendulumDefaults);
            setSpeed(1);
            setMission(false);
            setGuess("");
            setFeedback("");
          }}
        >
          ↻ Reset experiment
        </button>
      </header>
      <div className="sp-layout">
        <aside className="sp-controls">
          <h3>Pendulum setup</h3>
          <Range
            label="String length"
            value={input.lengthM}
            min={0.2}
            max={2}
            step={0.05}
            unit="m"
            onChange={(lengthM) => update({ lengthM })}
          />
          <Range
            label="Initial amplitude"
            value={input.amplitudeDeg}
            min={5}
            max={60}
            step={1}
            unit="°"
            onChange={(amplitudeDeg) => update({ amplitudeDeg })}
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
          <Range
            label="Damping"
            value={input.dampingPerS}
            min={0}
            max={0.2}
            step={0.005}
            unit="s⁻¹"
            onChange={(dampingPerS) => update({ dampingPerS })}
          />
          <Range
            label="Bob mass"
            value={input.bobMassKg}
            min={0.05}
            max={1}
            step={0.05}
            unit="kg"
            onChange={(bobMassKg) => update({ bobMassKg })}
          />
          <div className="sp-presets">
            <button
              type="button"
              onClick={() =>
                update({
                  lengthM: 0.2,
                  amplitudeDeg: 5,
                  gravityMps2: 1.62,
                  dampingPerS: 0,
                  bobMassKg: 0.05,
                })
              }
            >
              Minimums
            </button>
            <button type="button" onClick={() => update(pendulumDefaults)}>
              Typical
            </button>
            <button
              type="button"
              onClick={() =>
                update({
                  lengthM: 2,
                  amplitudeDeg: 60,
                  gravityMps2: 24.79,
                  dampingPerS: 0.2,
                  bobMassKg: 1,
                })
              }
            >
              Maximums
            </button>
          </div>
          <p className={input.amplitudeDeg > 15 ? "warn" : ""}>
            {input.amplitudeDeg > 15
              ? `Large-angle correction predicts ${f((finiteT / t0 - 1) * 100, 2)}% longer than T₀.`
              : "Small-angle approximation is within its intended range."}
          </p>
        </aside>
        <main className="sp-main">
          <div className="sp-toolbar">
            <button type="button" onClick={() => setRunning(true)}>
              ▶ Play
            </button>
            <button type="button" onClick={() => setRunning(false)}>
              Ⅱ Pause
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setMotion((s) => pendulumStep(input, s, 0.02));
              }}
            >
              ▷ Step
            </button>
            <button type="button" onClick={() => resetMotion()}>
              ↺ Release again
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
            className="sp-stage"
            aria-label={`Pendulum angle ${f((motion.thetaRad * 180) / Math.PI)} degrees, time ${f(time)} seconds`}
          >
            <img
              src="/assets/experiments/simple-pendulum/pendulum-stand.png"
              alt="Pendulum stand and photogate"
            />
            <div
              className="sp-swing"
              style={{
                height: `${150 + input.lengthM * 115}px`,
                transform: `translateX(-50%) rotate(${-motion.thetaRad}rad)`,
              }}
            >
              <i />
              <button
                aria-label="Drag bob to release"
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  setRunning(false);
                }}
                onPointerMove={drag}
                onPointerUp={(event) => {
                  setAngleFromPointer(event);
                  event.currentTarget.releasePointerCapture(event.pointerId);
                  setRunning(true);
                }}
                style={{
                  width: `${28 + input.bobMassKg * 12}px`,
                  height: `${28 + input.bobMassKg * 12}px`,
                }}
              />
            </div>
            <div className="sp-angle">
              θ = {f((motion.thetaRad * 180) / Math.PI, 1)}°
            </div>
            <div className="sp-gate">
              PHOTOGATE
              <br />
              <b>{periods.length} periods</b>
            </div>
            <div className="sp-force">restoring ∝ −sin θ</div>
          </section>
          <div className="sp-equations">
            <b>θ̈ + bθ̇ + (g/L)sinθ = 0</b>
            <b>T₀ ≈ 2π√(L/g)</b>
            <b>g ≈ 4π²L/T²</b>
          </div>
        </main>
        <aside className="sp-data">
          <h3>Measurements</h3>
          <dl>
            <div>
              <dt>Time</dt>
              <dd>{f(time)} s</dd>
            </div>
            <div>
              <dt>Angle</dt>
              <dd>{f((motion.thetaRad * 180) / Math.PI)}°</dd>
            </div>
            <div>
              <dt>Speed</dt>
              <dd>{f(energy.speedMps)} m/s</dd>
            </div>
            <div>
              <dt>T₀ small angle</dt>
              <dd>{f(t0, 3)} s</dd>
            </div>
            <div>
              <dt>Finite-amplitude T</dt>
              <dd>{f(finiteT, 3)} s</dd>
            </div>
            <div>
              <dt>Measured T</dt>
              <dd>{avg ? `${f(avg, 3)} s` : "waiting"}</dd>
            </div>
            <div>
              <dt>Mass effect on T</dt>
              <dd>none</dd>
            </div>
          </dl>
        </aside>
      </div>
      <section className="sp-graphs">
        <div>
          <b>Angle vs time</b>
          <svg viewBox="0 0 220 120">
            <line x1="8" y1="60" x2="215" y2="60" />
            <polyline points={trace} />
          </svg>
        </div>
        <div>
          <b>Energy exchange</b>
          <svg viewBox="0 0 220 90">
            <line x1="8" y1="75" x2="215" y2="75" />
            <polyline className="ke" points={ke} />
            <polyline className="pe" points={pe} />
          </svg>
          <small>Blue kinetic · green potential</small>
        </div>
      </section>
      <section className="sp-mission">
        <div>
          <span>LOCAL-g MISSION</span>
          <b>Determine gravity from measured periods.</b>
          <small>
            Use a small angle and low damping; collect at least two full
            periods.
          </small>
        </div>
        <button
          type="button"
          onClick={() => {
            setMission(true);
            setFeedback("Collect periods, then calculate g = 4π²L/T².");
          }}
        >
          Start mission
        </button>
        {mission && (
          <input
            aria-label="Estimated local gravity"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="m/s²"
            inputMode="decimal"
          />
        )}
        {mission && (
          <button
            type="button"
            onClick={() => setGuess(estimate ? f(estimate, 2) : "")}
          >
            Use measured periods
          </button>
        )}
        {mission && (
          <button
            type="button"
            onClick={() => {
              const n = Number(guess),
                err = Math.abs(n - input.gravityMps2);
              setFeedback(
                periods.length < 2
                  ? "Collect at least two measured periods first."
                  : Number.isFinite(n) && err <= 0.15
                    ? `✓ Local gravity ${f(input.gravityMps2)} m/s² recovered; error ${f(err)}.`
                    : `Estimate error ${f(err)} m/s². Reduce amplitude or damping.`,
              );
            }}
          >
            Check gravity
          </button>
        )}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
