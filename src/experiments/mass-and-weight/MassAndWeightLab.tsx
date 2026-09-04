import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  bodyData,
  massWeightState,
  type CelestialBody,
  type MassWeightInput,
} from "./massWeightSimulation";
import "./mass-and-weight.css";
const D: MassWeightInput = {
    massKg: 2,
    body: "Earth",
    altitudeKm: 0,
    elevatorAccelerationMps2: 0,
  },
  bodies: CelestialBody[] = ["Moon", "Mars", "Earth", "Jupiter"],
  f = (n: number, d = 2) => n.toFixed(d);
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
    <label className="mw-range">
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
export function MassAndWeightLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(D),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [station, setStation] = useState<"balance" | "scale">("balance"),
    [mission, setMission] = useState(false),
    [guess, setGuess] = useState(""),
    [feedback, setFeedback] = useState("");
  const state = useMemo(() => massWeightState(input), [input]);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => {
        setInput((o) => ({
          ...o,
          body: bodies[(bodies.indexOf(o.body) + 1) % bodies.length],
          altitudeKm: 0,
        }));
        setStation((s) => (s === "balance" ? "scale" : "balance"));
      },
      (reduced ? 1800 : 1200) / speed,
    );
    return () => clearInterval(id);
  }, [reduced, running, speed]);
  const update = (c: Partial<MassWeightInput>) => {
      setInput((o) => ({ ...o, ...c }));
      setRunning(false);
      setFeedback("");
    },
    choose = (body: CelestialBody) => {
      update({ body });
      setStation("scale");
    },
    reset = () => {
      setInput(D);
      setRunning(false);
      setSpeed(1);
      setStation("balance");
      setMission(false);
      setGuess("");
      setFeedback("");
    };
  const step = () => {
      setRunning(false);
      setInput((o) => ({
        ...o,
        body: bodies[(bodies.indexOf(o.body) + 1) % bodies.length],
        altitudeKm: 0,
      }));
      setStation((s) => (s === "balance" ? "scale" : "balance"));
    },
    check = () => {
      const n = Number(guess),
        err = Math.abs(n - state.apparentWeightN);
      setFeedback(
        Number.isFinite(n) && err <= 0.05
          ? `✓ Apparent weight ${f(state.apparentWeightN)} N = m(g + a).`
          : `Expected ${f(state.apparentWeightN)} N. Use upward-positive a; error ${Number.isFinite(err) ? f(err) : "not a number"} N.`,
      );
    };
  const graphY = (gravity: number) =>
    Math.max(12, 112 - input.massKg * gravity * 1.7);
  const graphPts = bodies
    .map((b) => {
      const g = bodyData[b].gravity;
      return `${18 + g * 5.8},${graphY(g)}`;
    })
    .join(" ");
  return (
    <section
      className="mw-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header data-ui-theme="dark">
        <div>
          <span>GRAVITY MEASUREMENT BAY</span>
          <h2>Mass stays. Weight changes.</h2>
          <p>Move one object between worlds and accelerating elevators.</p>
        </div>
        <button type="button" onClick={reset}>
          ↻ Reset experiment
        </button>
      </header>
      <div className="mw-layout">
        <aside className="mw-controls">
          <h3>Select station</h3>
          <div className="mw-bodies">
            {bodies.map((body) => (
              <button
                type="button"
                key={body}
                className={input.body === body ? "active" : ""}
                onClick={() => choose(body)}
              >
                <b>{body}</b>
                <small>g₀ = {bodyData[body].gravity} m/s²</small>
              </button>
            ))}
          </div>
          <Range
            label="Mass"
            value={input.massKg}
            min={0.1}
            max={10}
            step={0.1}
            unit="kg"
            onChange={(massKg) => update({ massKg })}
          />
          <Range
            label="Altitude"
            value={input.altitudeKm}
            min={0}
            max={500}
            step={10}
            unit="km"
            onChange={(altitudeKm) => update({ altitudeKm })}
          />
          <Range
            label="Elevator acceleration"
            value={input.elevatorAccelerationMps2}
            min={-20}
            max={20}
            step={0.1}
            unit="m/s²"
            onChange={(elevatorAccelerationMps2) =>
              update({ elevatorAccelerationMps2 })
            }
          />
          <div className="mw-presets" aria-label="Condition presets">
            <button
              type="button"
              onClick={() =>
                update({
                  massKg: 0.1,
                  altitudeKm: 0,
                  elevatorAccelerationMps2: -20,
                })
              }
            >
              Minimums
            </button>
            <button type="button" onClick={() => update(D)}>
              Typical
            </button>
            <button
              type="button"
              onClick={() =>
                update({
                  massKg: 10,
                  altitudeKm: 500,
                  elevatorAccelerationMps2: 20,
                })
              }
            >
              Maximums
            </button>
          </div>
          <div className="mw-modes">
            <button
              type="button"
              onClick={() => update({ elevatorAccelerationMps2: 0 })}
            >
              At rest
            </button>
            <button
              type="button"
              onClick={() => update({ elevatorAccelerationMps2: 2 })}
            >
              Elevator ↑
            </button>
            <button
              type="button"
              onClick={() =>
                update({ elevatorAccelerationMps2: -state.localGravityMps2 })
              }
            >
              Free fall
            </button>
          </div>
          <p>
            Altitude uses the inverse-square field. A spring scale reads normal
            force, not invariant mass.
          </p>
        </aside>
        <main className="mw-main">
          <div className="mw-toolbar">
            <button type="button" onClick={() => setRunning(true)}>
              ▶ Relocate
            </button>
            <button type="button" onClick={() => setRunning(false)}>
              Ⅱ Pause
            </button>
            <button type="button" onClick={step}>
              ▷ Step world
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
            className="mw-stage"
            aria-label={`${input.massKg} kilogram object on ${input.body}; weight ${f(state.trueWeightN)} newtons; apparent weight ${f(state.apparentWeightN)} newtons`}
          >
            <img
              src="/assets/experiments/mass-and-weight/mass-weight-station.png"
              alt="Balance and spring-scale measurement station"
            />
            <div className={`mw-object ${station}`}>
              <span>{f(input.massKg, 1)} kg</span>
            </div>
            <div className="mw-mass-readout">
              MASS
              <br />
              <b>{f(input.massKg, 3)} kg</b>
            </div>
            <div className="mw-weight-readout">
              APPARENT WEIGHT
              <br />
              <b>{f(state.apparentWeightN)} N</b>
            </div>
            <div className="mw-field">
              <b>{input.body}</b>
              <span>g = {f(state.localGravityMps2)} m/s² ↓</span>
            </div>
            {state.weightless && <strong>WEIGHTLESS · scale reads zero</strong>}
          </section>
          <section className="mw-equations">
            <b>W = mg</b>
            <b>N = m(g + a)</b>
            <b>g(h)=g₀[R/(R+h)]²</b>
          </section>
        </main>
        <aside className="mw-data">
          <h3>Data &amp; graph</h3>
          <dl>
            <div>
              <dt>Mass</dt>
              <dd>{f(input.massKg, 3)} kg</dd>
            </div>
            <div>
              <dt>Local g</dt>
              <dd>{f(state.localGravityMps2)} m/s²</dd>
            </div>
            <div>
              <dt>True weight</dt>
              <dd>{f(state.trueWeightN)} N</dd>
            </div>
            <div>
              <dt>Apparent weight</dt>
              <dd>{f(state.apparentWeightN)} N</dd>
            </div>
          </dl>
          <section className="mw-graph">
            <b>Weight vs gravitational field</b>
            <svg
              viewBox="0 0 190 125"
              aria-label="Weight versus gravitational field graph"
            >
              <line x1="15" y1="112" x2="182" y2="112" />
              <line x1="15" y1="112" x2="15" y2="10" />
              <polyline points={graphPts} />
              {bodies.map((b) => {
                const g = bodyData[b].gravity;
                return (
                  <circle
                    key={b}
                    cx={18 + g * 5.8}
                    cy={graphY(g)}
                    r={b === input.body ? 5 : 3}
                  />
                );
              })}
            </svg>
            <small>Slope = mass = {f(input.massKg, 2)} kg</small>
          </section>
          <table>
            <tbody>
              {bodies.map((b) => (
                <tr key={b}>
                  <th>{b}</th>
                  <td>{bodyData[b].gravity} m/s²</td>
                  <td>{f(input.massKg * bodyData[b].gravity)} N</td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>
      </div>
      <section className="mw-mission">
        <div>
          <span>ELEVATOR MISSION</span>
          <b>Predict the apparent weight.</b>
          <small>
            Use the current world, altitude and upward-positive elevator
            acceleration.
          </small>
        </div>
        <button
          type="button"
          onClick={() => {
            setMission(true);
            setFeedback("Enter the spring-scale reading.");
          }}
        >
          Start mission
        </button>
        {mission && (
          <input
            aria-label="Predicted apparent weight"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="newtons"
            inputMode="decimal"
          />
        )}
        {mission && (
          <button
            type="button"
            onClick={() => setGuess(f(state.apparentWeightN))}
          >
            Use calculation
          </button>
        )}
        {mission && (
          <button type="button" onClick={check}>
            Check
          </button>
        )}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
