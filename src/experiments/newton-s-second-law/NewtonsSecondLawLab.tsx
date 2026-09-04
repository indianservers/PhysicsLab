import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  motionAt,
  newtonDefaults,
  newtonState,
  type NewtonInput,
  type NewtonTrial,
} from "./newton-s-second-lawSimulation";
import "./newton-s-second-law.css";

const durationS = 3;
const palette = [
  "#58a63c",
  "#7448b8",
  "#dc6948",
  "#1786a8",
  "#b98a16",
  "#d34883",
];
const f = (n: number, digits = 2) => n.toFixed(digits);

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
    <label className="n2-range">
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
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <small>
        {min}
        <i>{max}</i>
      </small>
    </label>
  );
}

function TrialGraph({
  trials,
  kind,
  current,
}: {
  trials: NewtonTrial[];
  kind: "force" | "inverse";
  current: NewtonTrial;
}) {
  const all = [...trials, current];
  const toX = (trial: NewtonTrial) =>
    kind === "force"
      ? 122.5 + (trial.netForceN / 40) * 195
      : 25 + (1 / trial.massKg / 2) * 195;
  const toY = (trial: NewtonTrial) => 68 - (trial.accelerationMps2 / 40) * 100;
  const clipY = (value: number) => Math.max(14, Math.min(120, value));
  return (
    <section className="n2-graph">
      <b>
        {kind === "force"
          ? "Acceleration vs. net force"
          : "Acceleration vs. inverse mass"}
      </b>
      <svg
        viewBox="0 0 235 135"
        aria-label={`${kind} graph with ${trials.length} recorded trials`}
      >
        <line x1="24" y1="68" x2="225" y2="68" />
        <line x1="24" y1="118" x2="24" y2="12" />
        <line
          className="guide"
          x1="24"
          y1={kind === "force" ? clipY(68 + 50 / current.massKg) : 68}
          x2="220"
          y2={clipY(
            kind === "force"
              ? 68 - 50 / current.massKg
              : 68 - current.netForceN * 5,
          )}
        />
        {all.map((trial, index) => (
          <circle
            key={`${trial.id}-${index}`}
            cx={Math.min(220, toX(trial))}
            cy={clipY(toY(trial))}
            r={trial === current ? 5 : 4}
            fill={palette[index % palette.length]}
          />
        ))}
      </svg>
      <small>
        {kind === "force"
          ? `Guide slope 1/m = ${f(1 / current.massKg)} kg⁻¹`
          : `Guide slope |Fnet| = ${f(Math.abs(current.netForceN))} N`}
      </small>
    </section>
  );
}

export function NewtonsSecondLawLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [input, setInput] = useState<NewtonInput>(newtonDefaults),
    [timeS, setTimeS] = useState(0),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [trials, setTrials] = useState<NewtonTrial[]>([]),
    [mission, setMission] = useState<NewtonTrial | null>(null),
    [feedback, setFeedback] = useState("");
  const lastFrame = useRef(0),
    recordedAt = useRef(-1),
    state = useMemo(() => newtonState(input), [input]),
    motion = motionAt(state.accelerationMps2, timeS);
  const current: NewtonTrial = {
    ...input,
    id: trials.length + 1,
    netForceN: state.netForceN,
    accelerationMps2: state.accelerationMps2,
    durationS,
  };
  const update = (change: Partial<NewtonInput>) => {
    setInput((old) => ({ ...old, ...change }));
    setRunning(false);
    setTimeS(0);
    recordedAt.current = -1;
    setFeedback("");
  };
  const record = () => {
    const trial = { ...current, id: trials.length + 1 };
    setTrials((old) => [...old.slice(-5), trial]);
    if (mission) {
      const same =
          Math.abs(mission.accelerationMps2 - trial.accelerationMps2) <= 0.05,
        distinct =
          Math.abs(mission.massKg - trial.massKg) > 0.01 ||
          Math.abs(mission.netForceN - trial.netForceN) > 0.05;
      setFeedback(
        same && distinct
          ? `✓ Matched ${f(trial.accelerationMps2)} m/s² with a different force–mass pair.`
          : !distinct
            ? "Change mass or net force before the second trial."
            : `Acceleration differs by ${f(Math.abs(mission.accelerationMps2 - trial.accelerationMps2))} m/s²; keep Fnet/m constant.`,
      );
      if (same && distinct) setMission(null);
    }
  };
  useEffect(() => {
    if (!running) return;
    if (reduced) {
      const interval = window.setInterval(() => {
        setTimeS((old) => {
          const next = Math.min(durationS, old + input.samplingIntervalS);
          if (next >= durationS) setRunning(false);
          return next;
        });
      }, 400 / speed);
      return () => window.clearInterval(interval);
    }
    let frame = 0;
    const tick = (now: number) => {
      if (!lastFrame.current) lastFrame.current = now;
      const dt = Math.min(0.04, (now - lastFrame.current) / 1000) * speed;
      lastFrame.current = now;
      setTimeS((old) => {
        const next = Math.min(durationS, old + dt);
        if (next >= durationS) setRunning(false);
        return next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      lastFrame.current = 0;
    };
  }, [input.samplingIntervalS, reduced, running, speed]);
  useEffect(() => {
    if (!running && timeS >= durationS && recordedAt.current !== timeS) {
      recordedAt.current = timeS;
      record();
    }
  }, [running, timeS]);
  const samples = Array.from(
    { length: Math.floor(timeS / input.samplingIntervalS) + 1 },
    (_, index) =>
      motionAt(state.accelerationMps2, index * input.samplingIntervalS),
  );
  const reset = () => {
    setInput(newtonDefaults);
    setTimeS(0);
    setRunning(false);
    setSpeed(1);
    setTrials([]);
    setMission(null);
    setFeedback("");
    recordedAt.current = -1;
  };
  return (
    <section
      className="n2-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header data-ui-theme="dark">
        <div>
          <span>DYNAMICS TRACK · NEWTON II</span>
          <h2>Net force writes the motion.</h2>
          <p>
            Run matched trials from rest and keep every result on the graphs.
          </p>
        </div>
        <button type="button" onClick={reset}>
          ↻ Reset experiment
        </button>
      </header>
      <div className="n2-layout">
        <aside className="n2-controls">
          <h3>1 · Set up</h3>
          <Range
            label="Cart mass"
            value={input.massKg}
            min={0.5}
            max={5}
            step={0.1}
            unit="kg"
            onChange={(massKg) => update({ massKg })}
          />
          <Range
            label="Applied force"
            value={input.appliedForceN}
            min={-20}
            max={20}
            step={0.5}
            unit="N"
            onChange={(appliedForceN) => update({ appliedForceN })}
          />
          <Range
            label="Friction"
            value={input.frictionN}
            min={0}
            max={10}
            step={0.5}
            unit="N"
            onChange={(frictionN) => update({ frictionN })}
          />
          <Range
            label="Sampling interval"
            value={input.samplingIntervalS}
            min={0.1}
            max={1}
            step={0.05}
            unit="s"
            onChange={(samplingIntervalS) => update({ samplingIntervalS })}
          />
          <div className="n2-presets" aria-label="Trial presets">
            <button
              type="button"
              onClick={() =>
                update({
                  massKg: 0.5,
                  appliedForceN: -20,
                  frictionN: 0,
                  samplingIntervalS: 0.1,
                })
              }
            >
              Minimums
            </button>
            <button type="button" onClick={() => update(newtonDefaults)}>
              Typical
            </button>
            <button
              type="button"
              onClick={() =>
                update({
                  massKg: 5,
                  appliedForceN: 20,
                  frictionN: 10,
                  samplingIntervalS: 1,
                })
              }
            >
              Maximums
            </button>
          </div>
          <h3>2 · Run</h3>
          <div className="n2-run">
            <button
              type="button"
              className="play"
              onClick={() => {
                if (timeS >= durationS) {
                  setTimeS(0);
                  recordedAt.current = -1;
                }
                setRunning(true);
              }}
            >
              ▶ Play
            </button>
            <button type="button" onClick={() => setRunning(false)}>
              Ⅱ Pause
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setTimeS((old) =>
                  Math.min(durationS, old + input.samplingIntervalS),
                );
              }}
            >
              ▷ Step
            </button>
          </div>
          <label className="n2-speed">
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
          <label className="n2-check">
            <input
              aria-label="Reduced motion"
              type="checkbox"
              checked={reduced}
              onChange={(event) => setReduced(event.target.checked)}
            />{" "}
            Reduced motion
          </label>
          <button
            type="button"
            className="n2-new"
            onClick={() => {
              setTimeS(0);
              setRunning(false);
              recordedAt.current = -1;
            }}
          >
            ＋ New trial
          </button>
        </aside>
        <main className="n2-main">
          <div className="n2-meters">
            <span>
              Time <b>{f(timeS)} s</b>
            </span>
            <span>
              Position <b>{f(motion.positionM)} m</b>
            </span>
            <span>
              Velocity <b>{f(motion.velocityMps)} m/s</b>
            </span>
            <span>
              Acceleration <b>{f(state.accelerationMps2)} m/s²</b>
            </span>
          </div>
          <section
            className="n2-stage"
            aria-label={`Cart mass ${f(input.massKg)} kilograms, net force ${f(state.netForceN)} newtons, acceleration ${f(state.accelerationMps2)} metres per second squared`}
          >
            <div
              className="n2-vector applied"
              style={
                {
                  "--length": `${Math.min(32, Math.abs(input.appliedForceN) * 1.4 + 5)}%`,
                } as CSSProperties
              }
            >
              F applied {f(input.appliedForceN)} N
            </div>
            <div
              className="n2-vector friction"
              style={
                {
                  "--length": `${Math.min(24, input.frictionN * 1.5 + 4)}%`,
                } as CSSProperties
              }
            >
              friction {f(input.frictionN)} N
            </div>
            <img
              src="/assets/experiments/newton-s-second-law/dynamics-track.png"
              alt="Cart, dynamics track, pulley and hanging mass"
            />
            <div
              className="n2-cart-label"
              style={{
                left: `${42 + Math.max(-17, Math.min(17, motion.positionM * 3))}%`,
              }}
            >
              {f(input.massKg, 1)} kg
            </div>
            <div className="n2-accel">
              Accelerometer <b>{f(state.accelerationMps2)} m/s²</b>
            </div>
            {state.staticHold && (
              <strong>
                STATIC HOLD · applied force does not exceed friction
              </strong>
            )}
            <div className="n2-ticker">
              {samples.slice(-18).map((sample, index) => (
                <i
                  key={index}
                  style={{
                    left: `${50 + Math.max(-46, Math.min(46, sample.positionM * 3))}%`,
                  }}
                />
              ))}
            </div>
          </section>
          <div className="n2-equation">
            <b>
              F<sub>net</sub> = F<sub>applied</sub> − F<sub>friction</sub> ={" "}
              {f(state.netForceN)} N
            </b>
            <b>
              a = F<sub>net</sub>/m = {f(state.accelerationMps2)} m/s²
            </b>
          </div>
        </main>
        <aside className="n2-fbd">
          <h3>Free-body data</h3>
          <div className="n2-body">
            <i>↑ N</i>
            <i>← f</i>
            <b>■</b>
            <i>F →</i>
            <i>↓ mg</i>
          </div>
          <dl>
            <div>
              <dt>Mass</dt>
              <dd>{f(input.massKg)} kg</dd>
            </div>
            <div>
              <dt>Net force</dt>
              <dd>{f(state.netForceN)} N</dd>
            </div>
            <div>
              <dt>1 / mass</dt>
              <dd>{f(state.inverseMassPerKg)} kg⁻¹</dd>
            </div>
            <div>
              <dt>Sample count</dt>
              <dd>{samples.length}</dd>
            </div>
          </dl>
          <p>Every trial starts at x₀ = 0 m and v₀ = 0 m/s.</p>
        </aside>
      </div>
      <section className="n2-results">
        <div className="n2-table">
          <h3>Recorded trials · overlays persist</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>m (kg)</th>
                <th>Fnet (N)</th>
                <th>a (m/s²)</th>
              </tr>
            </thead>
            <tbody>
              {trials.length ? (
                trials.map((trial, index) => (
                  <tr key={trial.id}>
                    <td style={{ color: palette[index % palette.length] }}>
                      ● {trial.id}
                    </td>
                    <td>{f(trial.massKg)}</td>
                    <td>{f(trial.netForceN)}</td>
                    <td>{f(trial.accelerationMps2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>Run a complete trial to add data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <TrialGraph trials={trials} current={current} kind="force" />
        <TrialGraph trials={trials} current={current} kind="inverse" />
      </section>
      <section className="n2-mission">
        <div>
          <span>MATCHED-ACCELERATION MISSION</span>
          <b>Design two different trials with identical acceleration.</b>
          <small>
            {mission
              ? `Trial A: ${f(mission.accelerationMps2)} m/s². Change mass and net force, then run again.`
              : "Record Trial A, alter both sides of Fnet/m, and match a within 0.05 m/s²."}
          </small>
        </div>
        <button
          type="button"
          onClick={() => {
            setMission(current);
            setFeedback(
              `Trial A saved at ${f(current.accelerationMps2)} m/s². Change mass or force.`,
            );
          }}
        >
          Start mission
        </button>
        {mission && (
          <button
            type="button"
            onClick={() =>
              update({
                massKg: mission.massKg * 2,
                appliedForceN:
                  Math.sign(mission.netForceN || 1) *
                  (Math.abs(mission.netForceN) * 2 + mission.frictionN),
              })
            }
          >
            Load matching design
          </button>
        )}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
