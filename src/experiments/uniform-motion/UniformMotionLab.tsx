import { useEffect, useMemo, useRef, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { simulateUniformMotion } from "./uniform-motionSimulation";
import "./uniform-motion.css";

type Direction = 1 | -1;
type Setup = {
  speed: number;
  direction: Direction;
  startPosition: number;
  observationInterval: number;
};
const defaults: Setup = {
  speed: 0.45,
  direction: 1,
  startPosition: 0.2,
  observationInterval: 0.5,
};
const f = (value: number, digits = 2) => value.toFixed(digits);

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
    <label className="um-range">
      <span>
        {label}{" "}
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

export function UniformMotionLab({ experiment }: DedicatedExperimentLabProps) {
  const [setup, setSetup] = useState(defaults),
    [time, setTime] = useState(0),
    [running, setRunning] = useState(false),
    [playback, setPlayback] = useState(1),
    [reduced, setReduced] = useState(false),
    [mission, setMission] = useState(false),
    [prediction, setPrediction] = useState(""),
    [feedback, setFeedback] = useState("");
  const timeRef = useRef(time);
  timeRef.current = time;
  const velocity = setup.speed * setup.direction,
    duration = setup.observationInterval * 6;
  const result = simulateUniformMotion({
    x0: setup.startPosition,
    velocity,
    time,
  });
  const final = simulateUniformMotion({
    x0: setup.startPosition,
    velocity,
    time: duration,
  });
  const trackMin = Math.min(setup.startPosition, final.finalPosition) - 0.45,
    trackMax = Math.max(setup.startPosition, final.finalPosition) + 0.45;
  const positionPct =
    ((result.finalPosition - trackMin) / (trackMax - trackMin)) * 100;
  const markers = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const markerTime = index * setup.observationInterval;
        return {
          t: markerTime,
          x: setup.startPosition + velocity * markerTime,
        };
      }),
    [setup, velocity],
  );
  const reset = (next = setup) => {
    setTime(0);
    setRunning(false);
    setFeedback("");
    timeRef.current = 0;
    if (next !== setup) setSetup(next);
  };
  const update = (change: Partial<Setup>) => {
    const next = { ...setup, ...change };
    setSetup(next);
    reset(next);
  };
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => {
        const next = Math.min(
          duration,
          timeRef.current + (reduced ? 0.04 : 0.008) * playback,
        );
        timeRef.current = next;
        setTime(next);
        if (next >= duration) setRunning(false);
      },
      reduced ? 90 : 16,
    );
    return () => window.clearInterval(id);
  }, [duration, playback, reduced, running]);
  const positionLine = `20,${100 - ((setup.startPosition - trackMin) / (trackMax - trackMin)) * 75} 300,${100 - ((final.finalPosition - trackMin) / (trackMax - trackMin)) * 75}`;
  const cursorX = 20 + (time / duration) * 280,
    cursorY =
      100 - ((result.finalPosition - trackMin) / (trackMax - trackMin)) * 75,
    velocityY = velocity >= 0 ? 38 : 82;
  return (
    <section
      className="um-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="um-head" data-ui-theme="dark">
        <div>
          <span>CONSTANT VELOCITY LAB</span>
          <h2>Equal times. Equal displacements.</h2>
          <p>
            Run, pause, or scrub—the cart and both graphs stay synchronized.
          </p>
        </div>
        <button
          onClick={() => {
            setMission(false);
            setPrediction("");
            reset(defaults);
          }}
        >
          ↻ Reset experiment
        </button>
      </header>
      <div className="um-layout">
        <aside className="um-controls">
          <h3>Motion settings</h3>
          <Range
            label="Speed"
            value={setup.speed}
            min={0.1}
            max={1}
            step={0.05}
            unit="m/s"
            onChange={(speed) => update({ speed })}
          />
          <Range
            label="Starting position"
            value={setup.startPosition}
            min={-1}
            max={2}
            step={0.1}
            unit="m"
            onChange={(startPosition) => update({ startPosition })}
          />
          <Range
            label="Observation interval"
            value={setup.observationInterval}
            min={0.25}
            max={1.5}
            step={0.25}
            unit="s"
            onChange={(observationInterval) => update({ observationInterval })}
          />
          <fieldset>
            <legend>Direction</legend>
            <button
              className={setup.direction === -1 ? "active" : ""}
              onClick={() => update({ direction: -1 })}
            >
              ← Left
            </button>
            <button
              className={setup.direction === 1 ? "active" : ""}
              onClick={() => update({ direction: 1 })}
            >
              Right →
            </button>
          </fieldset>
          <div className="um-presets">
            <button
              onClick={() =>
                update({
                  speed: 0.1,
                  startPosition: -1,
                  observationInterval: 0.25,
                  direction: -1,
                })
              }
            >
              Minimums
            </button>
            <button onClick={() => update(defaults)}>Typical</button>
            <button
              onClick={() =>
                update({
                  speed: 1,
                  startPosition: 2,
                  observationInterval: 1.5,
                  direction: 1,
                })
              }
            >
              Maximums
            </button>
          </div>
          <div className="um-equation">
            <b>x = x₀ + vt</b>
            <small>Slope of x–t = v · acceleration = 0</small>
          </div>
        </aside>
        <div className="um-center">
          <div className="um-transport">
            <button onClick={() => setRunning(true)}>▶ Play</button>
            <button onClick={() => setRunning(false)}>Ⅱ Pause</button>
            <button
              onClick={() => {
                setRunning(false);
                setTime((old) => Math.min(duration, old + 0.1));
              }}
            >
              ▷ Step
            </button>
            <button onClick={() => reset()}>↺ Replay</button>
            <label>
              Speed{" "}
              <select
                aria-label="Playback speed"
                value={playback}
                onChange={(event) => setPlayback(Number(event.target.value))}
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
            className="um-stage"
            aria-label={`Cart at ${f(result.finalPosition, 3)} metres after ${f(time, 2)} seconds, moving ${setup.direction === 1 ? "right" : "left"}`}
          >
            <div className="um-live">
              <small>LIVE CART POSITION</small>
              <b>{f(result.finalPosition, 3)} m</b>
            </div>
            <img
              src="/assets/experiments/uniform-motion/linear-track.png"
              alt="Linear track with two photogates and a motion sensor"
            />
            {markers
              .filter((marker) => marker.t <= time + 1e-6)
              .map((marker) => (
                <i
                  className="um-marker"
                  key={marker.t}
                  style={{
                    left: `${((marker.x - trackMin) / (trackMax - trackMin)) * 100}%`,
                  }}
                >
                  <span>{f(marker.t, 2)} s</span>
                </i>
              ))}
            <div
              className={`um-cart ${setup.direction < 0 ? "left" : ""}`}
              style={{ left: `${positionPct}%` }}
              tabIndex={0}
              aria-label="Moving smart cart"
            >
              <i />
              <b>SMART CART</b>
            </div>
            <div
              className={`um-vector ${setup.direction < 0 ? "left" : ""}`}
              style={{ left: `${positionPct}%` }}
            >
              v = {f(velocity, 2)} m/s
            </div>
            <div className="um-gates">
              <span>PHOTOGATE A · tracking</span>
              <span>PHOTOGATE B · ready</span>
            </div>
          </section>
          <label className="um-scrub">
            Observation time{" "}
            <input
              aria-label="Observation time"
              type="range"
              min={0}
              max={duration}
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
        <aside className="um-readings">
          <h3>Measurements</h3>
          <dl>
            <div>
              <dt>Position</dt>
              <dd>{f(result.finalPosition, 3)} m</dd>
            </div>
            <div>
              <dt>Displacement</dt>
              <dd>{f(result.displacement, 3)} m</dd>
            </div>
            <div>
              <dt>Signed velocity</dt>
              <dd>{f(velocity, 2)} m/s</dd>
            </div>
            <div>
              <dt>x–t slope</dt>
              <dd>{f(velocity, 2)} m/s</dd>
            </div>
            <div>
              <dt>Acceleration</dt>
              <dd>0.00 m/s²</dd>
            </div>
            <div>
              <dt>Marker spacing</dt>
              <dd>{f(Math.abs(velocity) * setup.observationInterval, 3)} m</dd>
            </div>
          </dl>
          <p>Each dot marks one equal observation interval.</p>
        </aside>
      </div>
      <section className="um-graphs">
        <div>
          <b>Position vs time</b>
          <svg viewBox="0 0 320 115" aria-label="Linear position-time graph">
            <line x1="20" y1="100" x2="305" y2="100" />
            <line x1="20" y1="10" x2="20" y2="100" />
            <polyline points={positionLine} />
            <circle cx={cursorX} cy={cursorY} r="4" />
          </svg>
          <small>constant slope = {f(velocity, 2)} m/s</small>
        </div>
        <div>
          <b>Velocity vs time</b>
          <svg viewBox="0 0 320 115" aria-label="Constant velocity-time graph">
            <line x1="20" y1="60" x2="305" y2="60" />
            <line x1="20" y1="10" x2="20" y2="100" />
            <line
              className="velocity"
              x1="20"
              y1={velocityY}
              x2="305"
              y2={velocityY}
            />
            <circle className="velocity" cx={cursorX} cy={velocityY} r="4" />
          </svg>
          <small>horizontal line · signed v</small>
        </div>
      </section>
      <section className="um-mission">
        <div>
          <span>PREDICTION MISSION</span>
          <b>Where will the cart be at t = {f(duration, 2)} s?</b>
          <small>
            Use x = x₀ + vt, then reveal the future by running or scrubbing.
          </small>
        </div>
        <button
          onClick={() => {
            setMission(true);
            setFeedback("Enter the predicted signed position.");
          }}
        >
          Start mission
        </button>
        {mission && (
          <input
            aria-label="Predicted future position"
            inputMode="decimal"
            placeholder="position in m"
            value={prediction}
            onChange={(event) => setPrediction(event.target.value)}
          />
        )}{" "}
        {mission && (
          <button onClick={() => setPrediction(f(final.finalPosition, 2))}>
            Use equation
          </button>
        )}{" "}
        {mission && (
          <button
            onClick={() => {
              const error = Math.abs(Number(prediction) - final.finalPosition);
              setFeedback(
                Number.isFinite(Number(prediction)) && error <= 0.02
                  ? `✓ Correct. x = ${f(final.finalPosition, 2)} m; the graph endpoint matches.`
                  : `Not yet. Signed-position error: ${f(error)} m.`,
              );
            }}
          >
            Check prediction
          </button>
        )}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
