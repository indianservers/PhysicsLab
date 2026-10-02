import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { workPowerState, type WorkPowerInput } from "./workPowerSimulation";
import "./work-power.css";

const defaults: WorkPowerInput = {
  massKg: 60,
  forceN: 180,
  distanceM: 12,
  angleDeg: 15,
  durationS: 8,
  frictionCoefficient: 0.25,
};
const f = (value: number, digits = 1) =>
  Number.isFinite(value) ? value.toFixed(digits) : "—";
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
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
    <label className="wp-range">
      <span>
        {label}
        <b>
          {f(value, step < 0.1 ? 2 : 1)} {unit}
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
        <i>{min}</i>
        <i>{max}</i>
      </small>
    </label>
  );
}

export function WorkPowerLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(defaults),
    [time, setTime] = useState(0),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(false),
    [mission, setMission] = useState(false),
    [feedback, setFeedback] = useState("");
  const timeRef = useRef(time);
  timeRef.current = time;
  const state = workPowerState(input, time),
    final = workPowerState(input, input.durationS);
  const resetMotion = (next = input) => {
    setTime(0);
    timeRef.current = 0;
    setRunning(false);
    setFeedback("");
    if (next !== input) setInput(next);
  };
  const update = (change: Partial<WorkPowerInput>) => {
    const next = { ...input, ...change };
    setInput(next);
    resetMotion(next);
  };
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => {
        const next = Math.min(
          input.durationS,
          timeRef.current + (reduced ? 0.04 : 0.008) * speed,
        );
        timeRef.current = next;
        setTime(next);
        if (
          next >= input.durationS ||
          workPowerState(input, next).reachedTarget
        )
          setRunning(false);
      },
      reduced ? 90 : 16,
    );
    return () => window.clearInterval(id);
  }, [input, reduced, running, speed]);
  const progress = input.distanceM ? state.travelledM / input.distanceM : 0;
  const samples = useMemo(
    () =>
      Array.from({ length: 61 }, (_, index) =>
        workPowerState(input, (input.durationS * index) / 60),
      ),
    [input],
  );
  const maxWork = Math.max(
      1,
      ...samples.map((sample) => Math.abs(sample.netWorkJ)),
    ),
    maxPower = Math.max(
      1,
      ...samples.map((sample) => Math.abs(sample.instantaneousAppliedPowerW)),
    );
  const workLine = samples
      .map(
        (sample, index) =>
          `${12 + index * 4.8},${105 - (sample.netWorkJ / maxWork) * 85}`,
      )
      .join(" "),
    powerLine = samples
      .map(
        (sample, index) =>
          `${12 + index * 4.8},${105 - (sample.instantaneousAppliedPowerW / maxPower) * 85}`,
      )
      .join(" ");
  const setForceFromPointer = (event: PointerEvent<HTMLButtonElement>) => {
    const stage = event.currentTarget
        .closest(".wp-stage")!
        .getBoundingClientRect(),
      cartX = stage.left + stage.width * (0.18 + progress * 0.65),
      cartY = stage.top + stage.height * 0.67,
      dx = event.clientX - cartX,
      dy = cartY - event.clientY;
    update({
      angleDeg: clamp((Math.atan2(dy, dx) * 180) / Math.PI, -90, 180),
      forceN: clamp(Math.hypot(dx, dy) * 1.6, 20, 500),
    });
  };
  const dragForce = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.buttons & 1) setForceFromPointer(event);
  };
  const setPathFromPointer = (event: PointerEvent<HTMLButtonElement>) => {
    const stage = event.currentTarget
        .closest(".wp-stage")!
        .getBoundingClientRect(),
      ratio = clamp((event.clientX - stage.left) / stage.width, 0.2, 0.92);
    update({ distanceM: 1 + ((ratio - 0.2) / 0.72) * 19 });
  };
  const missionPass =
    Math.abs(final.netWorkJ - 600) <= 10 &&
    final.averageNetPowerW <= 150 &&
    final.reachedTarget;
  return (
    <section
      className="wp-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="wp-head" data-ui-theme="dark">
        <div>
          <span>WAREHOUSE POWER LAB</span>
          <h2>Same work. Different rate.</h2>
          <p>
            Resolve the pull, overcome friction, and watch work become kinetic
            energy.
          </p>
        </div>
        <button
          onClick={() => {
            setMission(false);
            resetMotion(defaults);
          }}
        >
          ↻ Reset experiment
        </button>
      </header>
      <div className="wp-formulas">
        <b>W = ∫F·ds = Fd cosθ</b>
        <b>P̄ = W/Δt</b>
        <b>P = F·v</b>
      </div>
      <div className="wp-layout">
        <aside className="wp-controls">
          <h3>Load setup</h3>
          <Range
            label="Applied force"
            value={input.forceN}
            min={20}
            max={500}
            step={5}
            unit="N"
            onChange={(forceN) => update({ forceN })}
          />
          <Range
            label="Path distance"
            value={input.distanceM}
            min={1}
            max={20}
            step={0.5}
            unit="m"
            onChange={(distanceM) => update({ distanceM })}
          />
          <Range
            label="Force angle"
            value={input.angleDeg}
            min={-90}
            max={180}
            step={1}
            unit="°"
            onChange={(angleDeg) => update({ angleDeg })}
          />
          <Range
            label="Duration"
            value={input.durationS}
            min={1}
            max={30}
            step={0.5}
            unit="s"
            onChange={(durationS) => update({ durationS })}
          />
          <Range
            label="Kinetic friction μₖ"
            value={input.frictionCoefficient}
            min={0}
            max={0.8}
            step={0.01}
            unit=""
            onChange={(frictionCoefficient) => update({ frictionCoefficient })}
          />
          <div className="wp-presets">
            <button
              onClick={() =>
                update({
                  forceN: 20,
                  distanceM: 1,
                  angleDeg: -90,
                  durationS: 1,
                  frictionCoefficient: 0,
                })
              }
            >
              Minimums
            </button>
            <button onClick={() => resetMotion(defaults)}>Typical</button>
            <button
              onClick={() =>
                update({
                  forceN: 500,
                  distanceM: 20,
                  angleDeg: 180,
                  durationS: 30,
                  frictionCoefficient: 0.8,
                })
              }
            >
              Maximums
            </button>
          </div>
          <p className={state.netForceN > 0 ? "go" : "hold"}>
            {state.netForceN > 0
              ? "Net forward force: motion can start."
              : "No forward acceleration: friction/opposing pull holds the load."}
          </p>
        </aside>
        <div className="wp-center">
          <div className="wp-transport">
            <button onClick={() => setRunning(true)}>▶ Play</button>
            <button onClick={() => setRunning(false)}>Ⅱ Pause</button>
            <button
              onClick={() => {
                setRunning(false);
                setTime((old) => Math.min(input.durationS, old + 0.1));
              }}
            >
              ▷ Step
            </button>
            <button onClick={() => resetMotion()}>↺ Replay</button>
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
            className="wp-stage"
            aria-label={`Load travelled ${f(state.travelledM, 2)} metres; net work ${f(state.netWorkJ, 1)} joules; power ${f(state.instantaneousAppliedPowerW, 1)} watts`}
          >
            <div className="wp-warehouse">
              <i />
              <i />
              <i />
            </div>
            <div
              className="wp-displacement"
              style={{ width: `${progress * 65}%` }}
            >
              s = {f(state.travelledM, 2)} m
            </div>
            <img
              className="wp-load"
              style={{ left: `${18 + progress * 65}%` }}
              src="/assets/experiments/work-power/warehouse-load.png"
              alt="Wooden load on an industrial trolley"
            />
            <div
              className="wp-force"
              style={{
                left: `${18 + progress * 65}%`,
                transform: `rotate(${-input.angleDeg}deg)`,
                width: `${55 + input.forceN * 0.18}px`,
              }}
            >
              <span>F {f(input.forceN, 0)} N</span>
              <button
                aria-label="Drag force direction"
                onPointerDown={(event) =>
                  event.currentTarget.setPointerCapture(event.pointerId)
                }
                onPointerMove={dragForce}
                onPointerUp={(event) => {
                  setForceFromPointer(event);
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }}
              />
            </div>
            <div
              className="wp-friction"
              style={{
                left: `${18 + progress * 65}%`,
                width: `${35 + state.frictionForceN * 0.12}px`,
              }}
            >
              fₖ {f(state.frictionForceN, 0)} N
            </div>
            <button
              className="wp-path-handle"
              aria-label="Drag path endpoint"
              style={{ left: "88%" }}
              onPointerDown={(event) =>
                event.currentTarget.setPointerCapture(event.pointerId)
              }
              onPointerMove={(event) => {
                if (event.buttons & 1) setPathFromPointer(event);
              }}
              onPointerUp={(event) => {
                setPathFromPointer(event);
                event.currentTarget.releasePointerCapture(event.pointerId);
              }}
            >
              TARGET
              <br />
              {f(input.distanceM)} m
            </button>
            <div className="wp-meter">
              <b>{f(state.netWorkJ, 0)} J</b>
              <small>net work</small>
            </div>
          </section>
          <label className="wp-scrub">
            Time
            <input
              aria-label="Simulation time"
              type="range"
              min={0}
              max={input.durationS}
              step={0.01}
              value={time}
              onChange={(event) => {
                setRunning(false);
                setTime(Number(event.target.value));
              }}
            />
            <b>{f(time, 2)} s</b>
          </label>
        </div>
        <aside className="wp-readings">
          <h3>Live readings</h3>
          <dl>
            <div>
              <dt>F along path</dt>
              <dd>{f(state.parallelForceN)} N</dd>
            </div>
            <div>
              <dt>Normal force</dt>
              <dd>{f(state.normalForceN)} N</dd>
            </div>
            <div>
              <dt>Kinetic friction</dt>
              <dd>{f(state.frictionForceN)} N</dd>
            </div>
            <div>
              <dt>Net force</dt>
              <dd>{f(state.netForceN)} N</dd>
            </div>
            <div>
              <dt>Speed</dt>
              <dd>{f(state.speedMps, 2)} m/s</dd>
            </div>
            <div>
              <dt>Applied work</dt>
              <dd>{f(state.appliedWorkJ)} J</dd>
            </div>
            <div>
              <dt>Friction work</dt>
              <dd>{f(state.frictionWorkJ)} J</dd>
            </div>
            <div>
              <dt>Net work = ΔK</dt>
              <dd>{f(state.netWorkJ)} J</dd>
            </div>
            <div>
              <dt>Average net power</dt>
              <dd>{f(state.averageNetPowerW)} W</dd>
            </div>
            <div>
              <dt>Instant applied power</dt>
              <dd>{f(state.instantaneousAppliedPowerW)} W</dd>
            </div>
          </dl>
        </aside>
      </div>
      <section className="wp-graphs">
        <div>
          <b>Work vs time</b>
          <svg viewBox="0 0 310 115">
            <line x1="10" y1="105" x2="305" y2="105" />
            <polyline points={workLine} />
          </svg>
          <small>cumulative net work</small>
        </div>
        <div>
          <b>Power timeline</b>
          <svg viewBox="0 0 310 115">
            <line x1="10" y1="105" x2="305" y2="105" />
            <polyline points={powerLine} />
          </svg>
          <small>instantaneous applied F·v</small>
        </div>
        <div className="wp-energy">
          <b>Energy flow</b>
          <span>Applied {f(state.appliedWorkJ, 0)} J</span>
          <span>Heat {f(-state.frictionWorkJ, 0)} J</span>
          <span>Kinetic {f(state.kineticEnergyJ, 0)} J</span>
          <small>W applied + W friction = ΔK</small>
        </div>
      </section>
      <section className="wp-mission">
        <div>
          <span>POWER-LIMIT MISSION</span>
          <b>Deliver 600 J of net work at no more than 150 W average.</b>
          <small>
            The load must reach its path target before the duration ends.
          </small>
        </div>
        <button
          onClick={() => {
            setMission(true);
            setFeedback(
              "Tune the force, distance, angle, duration, and friction.",
            );
          }}
        >
          Start mission
        </button>
        {mission && (
          <button
            onClick={() =>
              update({
                forceN: 110,
                distanceM: 11.73,
                angleDeg: 0,
                durationS: 8,
                frictionCoefficient: 0.1,
              })
            }
          >
            Load viable setup
          </button>
        )}
        {mission && (
          <button
            onClick={() => {
              setTime(input.durationS);
              setRunning(false);
            }}
          >
            Run to deadline
          </button>
        )}
        {mission && (
          <button
            onClick={() =>
              setFeedback(
                missionPass
                  ? `✓ Delivered ${f(final.netWorkJ)} J at ${f(final.averageNetPowerW)} W average.`
                  : `Result: ${f(final.netWorkJ)} J at ${f(final.averageNetPowerW)} W. Check target, power, and arrival.`,
              )
            }
          >
            Check mission
          </button>
        )}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
