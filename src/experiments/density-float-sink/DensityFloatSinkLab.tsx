import { useEffect, useMemo, useState, type PointerEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  settlingDepth,
  solveDensityTank,
  type DensityTankInput,
  type Shape,
} from "./densityTankPhysics";
import "./density-float-sink.css";
type Run = "idle" | "running" | "paused" | "result";
const D: DensityTankInput = {
  massG: 95,
  volumeCm3: 100,
  fluidDensity: 1000,
  depthFraction: 0.12,
  layered: true,
  shape: "cube",
};
const f = (n: number, d = 1) => n.toFixed(d);
export function DensityFloatSinkLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(D),
    [run, setRun] = useState<Run>("idle"),
    [speed, setSpeed] = useState(1),
    [time, setTime] = useState(0),
    [startDepth, setStartDepth] = useState(D.depthFraction),
    [reduced, setReduced] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [drag, setDrag] = useState(false),
    [mission, setMission] = useState(false),
    [feedback, setFeedback] = useState("");
  const r = useMemo(() => solveDensityTank(input), [input]);
  useEffect(() => {
    if (run !== "running") return;
    const id = window.setInterval(
      () =>
        setTime((t) => {
          const n = Math.min(8, t + 0.04 * speed);
          setInput((v) => ({
            ...v,
            depthFraction: settlingDepth(
              n,
              startDepth,
              solveDensityTank(v).equilibriumDepth,
              reduced,
            ),
          }));
          if (n >= 8) setRun("result");
          return n;
        }),
      40,
    );
    return () => clearInterval(id);
  }, [run, speed, reduced, startDepth]);
  const update = (p: Partial<DensityTankInput>) => {
    setInput((v) => ({ ...v, ...p }));
    setFeedback("");
  };
  const reset = () => {
    setInput(D);
    setRun("idle");
    setTime(0);
    setMission(false);
    setFeedback("");
  };
  const play = () => {
    setStartDepth(input.depthFraction);
    if (time >= 8) setTime(0);
    setRun("running");
  };
  const step = () => {
    const n = Math.min(8, time + 0.25);
    setTime(n);
    update({
      depthFraction: settlingDepth(n, startDepth, r.equilibriumDepth, reduced),
    });
    setRun("paused");
  };
  const startMission = () => {
    setMission(true);
    setInput({
      ...D,
      massG: 205,
      volumeCm3: 120,
      depthFraction: 0.4,
      shape: "cylinder",
    });
    setFeedback(
      "Keep mass at 205 g. Adjust volume until the object hovers in saltwater (1025 kg/m³).",
    );
  };
  const check = () => {
    const pass = Math.abs(r.objectDensity - 1025) <= 5;
    setFeedback(
      pass
        ? `✓ Hovering: 205 g ÷ 200 cm³ = ${f(r.objectDensity, 0)} kg/m³, matching saltwater. Fb = W = ${f(r.weightN, 3)} N.`
        : `Not neutral: density is ${f(r.objectDensity, 0)} kg/m³. Set V = m/ρ = 205000/1025 = 200 cm³.`,
    );
    if (pass) {
      setInput((value) => ({ ...value, depthFraction: 0.625 }));
      setRun("result");
    }
  };
  const move = (e: PointerEvent<SVGGElement>) => {
    if (!drag) return;
    const b = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!b) return;
    const y = (e.clientY - b.top) / b.height;
    update({ depthFraction: Math.max(0, Math.min(1, (y - 0.12) / 0.76)) });
  };
  const y = 180 + input.depthFraction * 620,
    size = 72 * Math.cbrt(input.volumeCm3 / 100),
    stateLabel =
      r.state === "suspend"
        ? "NEUTRALLY SUSPENDED"
        : r.state === "interface"
          ? "RESTS AT INTERFACE"
          : r.state.toUpperCase();
  return (
    <section
      className="density-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header>
        <div>
          <span>DENSITY · BUOYANCY · LAYERED FLUIDS</span>
          <h2>Float-or-Sink Explorer</h2>
          <p>
            Release an object and watch its density select a surface, layer,
            interface or bottom.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="density-layout">
        <aside className="density-controls" aria-label="Density tank controls">
          <h3>1 · Tank</h3>
          <label className="mode">
            <input
              type="checkbox"
              checked={input.layered}
              onChange={(e) => update({ layered: e.target.checked })}
            />{" "}
            Layered fluids
          </label>
          {!input.layered && (
            <Control
              label="Fluid density"
              aria="Fluid density"
              value={input.fluidDensity}
              min={500}
              max={1400}
              step={25}
              unit="kg/m³"
              onChange={(v) => update({ fluidDensity: v })}
            />
          )}
          <div className="layer-key">
            <i />
            Oil 850
            <i />
            Water 1000
            <i />
            Saltwater 1025
            <i />
            Dense 13600
          </div>
          <h3>2 · Object</h3>
          <Control
            label="Mass m"
            aria="Object mass"
            value={input.massG}
            min={10}
            max={1000}
            step={5}
            unit="g"
            onChange={(v) => update({ massG: v })}
          />
          <Control
            label="Volume V"
            aria="Object volume"
            value={input.volumeCm3}
            min={10}
            max={1000}
            step={5}
            unit="cm³"
            onChange={(v) => update({ volumeCm3: v })}
          />
          <div className="shape-buttons">
            {(["cube", "sphere", "cylinder"] as Shape[]).map((s) => (
              <button
                className={input.shape === s ? "active" : ""}
                onClick={() => update({ shape: s })}
                key={s}
              >
                {s}
              </button>
            ))}
          </div>
          <Control
            label="Drop depth"
            aria="Object depth"
            value={Math.round(input.depthFraction * 100)}
            min={0}
            max={100}
            step={1}
            unit="%"
            onChange={(v) => {
              setRun("paused");
              update({ depthFraction: v / 100 });
            }}
          />
        </aside>
        <main className="density-main">
          <div className="density-toolbar">
            <div>
              <button onClick={play} disabled={run === "running"}>
                ▶ Release
              </button>
              <button
                onClick={() => setRun("paused")}
                disabled={run === "paused"}
              >
                Ⅱ Pause
              </button>
              <button onClick={step}>▷ Step</button>
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
            className="layer-stage"
            aria-label="Layered fluid tank with draggable object"
          >
            <img
              src="/assets/experiments/density-float-sink/layered-tank.png"
              alt="Transparent tank containing oil, water, saltwater and dense liquid layers"
            />
            <svg
              viewBox="0 0 1536 1024"
              role="img"
              aria-label={`${stateLabel} in ${r.layer}; object density ${f(r.objectDensity, 0)} kilograms per cubic metre`}
            >
              <g
                className={`density-object ${input.shape}`}
                role="slider"
                aria-label="Drag object into fluids"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(input.depthFraction * 100)}
                tabIndex={0}
                transform={`translate(780 ${y}) rotate(${input.shape === "cylinder" ? 90 : 0})`}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setDrag(true);
                  setRun("paused");
                }}
                onPointerMove={move}
                onPointerUp={(e) => {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                  setDrag(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                    e.preventDefault();
                    update({
                      depthFraction: Math.max(
                        0,
                        Math.min(
                          1,
                          input.depthFraction +
                            (e.key === "ArrowDown" ? 0.02 : -0.02),
                        ),
                      ),
                    });
                  }
                }}
              >
                {input.shape === "sphere" ? (
                  <circle r={size / 2} />
                ) : (
                  <rect
                    x={-size / 2}
                    y={-size / 2}
                    width={size}
                    height={size}
                    rx={input.shape === "cylinder" ? size / 2 : 7}
                  />
                )}
                <text
                  transform={input.shape === "cylinder" ? "rotate(-90)" : ""}
                >
                  {f(r.objectDensity / 1000, 3)}
                </text>
              </g>
              {run === "running" && time < 0.8 && (
                <g className="splash">
                  <path d="M690 170q35-40 70 0M800 170q35-40 70 0" />
                </g>
              )}
            </svg>
            <div className="depth-readout">
              <b>{stateLabel}</b>
              <span>{r.layer}</span>
              <span>{f(input.depthFraction * 70, 1)} cm deep</span>
            </div>
          </section>
          <section className="density-formula">
            <b>
              ρobject = m/V = {f(input.massG, 0)} g / {f(input.volumeCm3, 0)}{" "}
              cm³ = {f(r.objectDensity, 0)} kg/m³
            </b>
            <span>{r.orientation}</span>
          </section>
        </main>
        <aside
          className="density-analysis"
          aria-label="Live density measurements"
        >
          <h3>Live measurements</h3>
          <Reading
            label="Object density"
            value={`${f(r.objectDensity, 0)} kg/m³`}
          />
          <Reading
            label="Local fluid"
            value={`${f(r.localFluidDensity, 0)} kg/m³`}
          />
          <Reading label="Weight W" value={`${f(r.weightN, 3)} N`} />
          <Reading
            label="Buoyant force Fb"
            value={`${f(r.buoyantForceN, 3)} N`}
            hot
          />
          <Reading
            label="Displaced volume"
            value={`${f(r.displacedCm3, 1)} cm³`}
          />
          <section
            className={Math.abs(r.netForceN) < 0.006 ? "balance ok" : "balance"}
          >
            <b>
              {Math.abs(r.netForceN) < 0.006 ? "✓ FORCE BALANCE" : "NET FORCE"}
            </b>
            <span>Fb − W = {f(r.netForceN, 3)} N</span>
          </section>
          <section className="state-card">
            <b>{stateLabel}</b>
            <span>Equilibrium depth {f(r.equilibriumDepth * 70, 1)} cm</span>
          </section>
        </aside>
      </div>
      <section
        className="density-mission"
        aria-label="Neutral buoyancy design mission"
      >
        <div>
          <span>DESIGN CHALLENGE</span>
          <b>Preserve 205 g mass; hover in saltwater.</b>
          <small>Modify volume until ρobject = 1025 kg/m³.</small>
        </div>
        <button onClick={startMission}>Start challenge</button>
        {mission && (
          <button onClick={() => update({ volumeCm3: 200 })}>
            Set calculated volume
          </button>
        )}
        {mission && <button onClick={check}>Check design</button>}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
function Reading({
  label,
  value,
  hot = false,
}: {
  label: string;
  value: string;
  hot?: boolean;
}) {
  return (
    <div className={hot ? "reading hot" : "reading"}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function Control({
  label,
  aria,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  aria: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (n: number) => void;
}) {
  return (
    <label className="density-control">
      <span>
        {label}
        <strong>
          {value} {unit}
        </strong>
      </span>
      <input
        aria-label={aria}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <small>
        {min} — {max} {unit}
      </small>
    </label>
  );
}
