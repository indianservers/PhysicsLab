import { useEffect, useMemo, useState, type PointerEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  solveMagneticField,
  straightWireField,
  twoWireNullX,
  type FieldGeometry,
  type MagneticFieldInput,
} from "./magnetic-field-currentSimulation";
import "./magnetic-field-current.css";

type Run = "idle" | "running" | "paused" | "result";
const D: MagneticFieldInput = {
  geometry: "wire",
  currentA: 3,
  direction: 1,
  probeX: 0.045,
  probeY: 0.025,
  secondCurrentA: 3,
};
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
  onChange: (value: number) => void;
}) {
  return (
    <label className="field-slider">
      <span>
        {label}
        <b>
          {f(value, step < 0.01 ? 3 : 2)} {unit}
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
    <div className={hot ? "field-reading hot" : "field-reading"}>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

export function MagneticFieldCurrentLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(D),
    [run, setRun] = useState<Run>("idle"),
    [phase, setPhase] = useState(0),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [mission, setMission] = useState(false),
    [feedback, setFeedback] = useState("");
  const result = useMemo(() => solveMagneticField(input), [input]);
  useEffect(() => {
    if (run !== "running") return;
    const id = window.setInterval(
      () => setPhase((old) => (old + (reduced ? 25 : 2 * speed)) % 100),
      reduced ? 180 : 45,
    );
    return () => clearInterval(id);
  }, [run, speed, reduced]);
  const update = (change: Partial<MagneticFieldInput>) => {
    setInput((old) => ({ ...old, ...change }));
    setFeedback("");
  };
  const reset = () => {
    setInput(D);
    setRun("idle");
    setPhase(0);
    setMission(false);
    setFeedback("");
  };
  const probeScreen = {
    x: 350 + input.probeX * 2600,
    y: 310 - input.probeY * 2200,
  };
  const moveProbe = (event: PointerEvent<SVGSVGElement>) => {
    if (event.buttons !== 1) return;
    const box = event.currentTarget.getBoundingClientRect();
    update({
      probeX: Math.max(
        -0.1,
        Math.min(
          0.1,
          (((event.clientX - box.left) / box.width) * 700 - 350) / 2600,
        ),
      ),
      probeY: Math.max(
        -0.1,
        Math.min(
          0.1,
          (310 - ((event.clientY - box.top) / box.height) * 620) / 2200,
        ),
      ),
    });
  };
  const missionNull = twoWireNullX(input.currentA, input.secondCurrentA);
  const startMission = () => {
    setMission(true);
    setInput({
      ...D,
      geometry: "two-wire",
      currentA: 4,
      secondCurrentA: 2,
      probeX: 0,
      probeY: 0,
    });
    setFeedback(
      "Find the zero-field point between the two same-direction wires. Adjust wire 2 or move the Hall probe.",
    );
    setRun("paused");
  };
  const check = () => {
    const pass =
      input.geometry === "two-wire" &&
      result.magnitudeMicroT < 0.25 &&
      Math.abs(input.probeY) < 0.005;
    setFeedback(
      pass
        ? `✓ Null found at x = ${f(input.probeX * 100, 1)} cm. The two signed wire fields cancel by superposition.`
        : `Net field is ${f(result.magnitudeMicroT)} μT. For these currents, try x = ${f(missionNull * 100, 1)} cm on the line between the wires.`,
    );
    if (pass) setRun("result");
  };
  const geometryName =
    input.geometry === "wire"
      ? "Straight wire"
      : input.geometry === "loop"
        ? "Circular loop"
        : input.geometry === "solenoid"
          ? "Solenoid"
          : "Two wires";
  const graph = Array.from({ length: 20 }, (_, index) => {
    const r = 0.01 + index * 0.005;
    const b = straightWireField(input.currentA, r) * 1e6;
    return `${35 + index * 13},${115 - Math.min(100, b * 1.6)}`;
  }).join(" ");

  return (
    <section
      className="field-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="field-head">
        <div>
          <span>MAGNETISM · CLASS 10 / 12</span>
          <h2>Magnetic Field Bench</h2>
          <p>
            Map the field around wires and coils with a movable Hall probe and
            compass grid.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <nav className="geometry-tabs" aria-label="Wire geometry">
        {(["wire", "loop", "solenoid"] as FieldGeometry[]).map((geometry) => (
          <button
            key={geometry}
            className={input.geometry === geometry ? "active" : ""}
            onClick={() => update({ geometry })}
          >
            {geometry === "wire"
              ? "↕ Straight wire"
              : geometry === "loop"
                ? "◯ Circular loop"
                : "≋ Solenoid"}
          </button>
        ))}
      </nav>
      <div className="field-layout">
        <aside className="field-controls" aria-label="Magnetic field controls">
          <h3>Controls</h3>
          <Slider
            label="Current magnitude I"
            value={input.currentA}
            min={0}
            max={5}
            step={0.1}
            unit="A"
            onChange={(value) => update({ currentA: value })}
          />
          <div className="current-presets">
            <button onClick={() => update({ currentA: 0 })}>
              Zero current
            </button>
            <button onClick={() => update({ currentA: 3 })}>3 A typical</button>
            <button onClick={() => update({ currentA: 5 })}>5 A maximum</button>
          </div>
          <div
            className="direction-buttons"
            role="group"
            aria-label="Current direction"
          >
            <button
              className={input.direction === 1 ? "active" : ""}
              onClick={() => update({ direction: 1 })}
            >
              ↑ Out of board
            </button>
            <button
              className={input.direction === -1 ? "active" : ""}
              onClick={() => update({ direction: -1 })}
            >
              ↓ Into board
            </button>
          </div>
          {input.geometry === "two-wire" && (
            <Slider
              label="Wire 2 current"
              value={input.secondCurrentA}
              min={0.5}
              max={5}
              step={0.1}
              unit="A"
              onChange={(value) => update({ secondCurrentA: value })}
            />
          )}
          <h3>Probe position</h3>
          <Slider
            label="Probe x"
            value={input.probeX}
            min={-0.1}
            max={0.1}
            step={0.005}
            unit="m"
            onChange={(value) => update({ probeX: value })}
          />
          <Slider
            label="Probe y"
            value={input.probeY}
            min={-0.1}
            max={0.1}
            step={0.005}
            unit="m"
            onChange={(value) => update({ probeY: value })}
          />
          <p className="control-tip">
            Drag the blue probe on the board. Arrow keys move it by 5 mm.
          </p>
        </aside>
        <main className="field-main">
          <div className="field-toolbar">
            <div>
              <button onClick={() => setRun("running")}>▶ Grow fields</button>
              <button onClick={() => setRun("paused")}>Ⅱ Pause</button>
              <button
                onClick={() => {
                  setRun("paused");
                  setPhase((old) => (old + 8) % 100);
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
                onChange={(event) => setSpeed(Number(event.target.value))}
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
                onChange={(event) => setReduced(event.target.checked)}
              />{" "}
              Reduced motion
            </label>
          </div>
          <section
            className="field-stage"
            aria-label={`${geometryName}; field ${f(result.magnitudeMicroT)} microtesla at probe; direction ${f(result.angleDeg, 0)} degrees`}
          >
            <img
              src="/assets/experiments/magnetic-field-current/field-mapping-bench.png"
              alt="Transparent magnetic field mapping board with empty compass housings"
            />
            <svg
              viewBox="0 0 700 620"
              role="img"
              aria-label="Live field map and draggable Hall probe"
              onPointerDown={moveProbe}
              onPointerMove={moveProbe}
            >
              <CompassGrid input={input} />
              {(input.geometry === "wire" || input.geometry === "two-wire") && (
                <>
                  {(input.geometry === "wire" ? [350] : [240, 460]).map(
                    (cx, wireIndex) => (
                      <g key={cx}>
                        <circle className="wire-post" cx={cx} cy="310" r="17" />
                        <text
                          className="wire-sign"
                          x={cx}
                          y="318"
                          textAnchor="middle"
                        >
                          {input.direction === 1 ? "•" : "×"}
                        </text>
                        {[55, 90, 125, 160, 195].map((radius, index) => (
                          <circle
                            key={radius}
                            className="field-ring"
                            style={{
                              strokeDashoffset: `${input.direction * (phase + index * 13)}`,
                            }}
                            cx={cx}
                            cy="310"
                            r={Math.max(12, (radius + phase * 0.35) % 215)}
                          />
                        ))}
                        {input.geometry === "two-wire" && (
                          <text
                            className="wire-label"
                            x={cx}
                            y="290"
                            textAnchor="middle"
                          >
                            I{wireIndex + 1}
                          </text>
                        )}
                      </g>
                    ),
                  )}
                </>
              )}
              {input.geometry === "loop" && (
                <g className="loop-geometry">
                  <ellipse cx="350" cy="310" rx="150" ry="105" />
                  <path d="M205 310l18-12v24z" />
                  <text x="350" y="316" textAnchor="middle">
                    {input.direction === 1 ? "B ⊙" : "B ⊗"}
                  </text>
                </g>
              )}
              {input.geometry === "solenoid" && (
                <g className="solenoid-geometry">
                  {Array.from({ length: 11 }, (_, index) => (
                    <ellipse
                      key={index}
                      cx={220 + index * 26}
                      cy="310"
                      rx="20"
                      ry="100"
                    />
                  ))}
                  <line x1="185" y1="310" x2="515" y2="310" />
                  <text x="530" y="318">
                    B {input.direction === 1 ? "→" : "←"}
                  </text>
                </g>
              )}
              <g
                className="probe"
                transform={`translate(${probeScreen.x} ${probeScreen.y})`}
                tabIndex={0}
                role="button"
                aria-label={`Hall probe at x ${f(input.probeX)} metres y ${f(input.probeY)} metres`}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft")
                    update({ probeX: Math.max(-0.1, input.probeX - 0.005) });
                  if (event.key === "ArrowRight")
                    update({ probeX: Math.min(0.1, input.probeX + 0.005) });
                  if (event.key === "ArrowUp")
                    update({ probeY: Math.min(0.1, input.probeY + 0.005) });
                  if (event.key === "ArrowDown")
                    update({ probeY: Math.max(-0.1, input.probeY - 0.005) });
                }}
              >
                <circle r="15" />
                <line
                  x1="0"
                  y1="0"
                  x2={45 * Math.cos((result.angleDeg * Math.PI) / 180)}
                  y2={-45 * Math.sin((result.angleDeg * Math.PI) / 180)}
                />
                <text x="19" y="-18">
                  {f(result.magnitudeMicroT)} μT
                </text>
              </g>
            </svg>
            <div className="field-legend">
              <b>{geometryName}</b>
              <span>
                {result.directionLabel} · right-hand field{" "}
                {input.direction === 1 ? "counterclockwise" : "clockwise"}
              </span>
            </div>
          </section>
          <section className="field-equation">
            <b>
              {input.geometry === "wire" || input.geometry === "two-wire"
                ? "B = μ₀I/(2πr)"
                : input.geometry === "loop"
                  ? "Baxis = μ₀IR²/[2(R²+x²)³ᐟ²]"
                  : "Bcenter ≈ μ₀(N/L)I"}
            </b>
            <span>Vector fields add component by component.</span>
          </section>
        </main>
        <aside
          className="field-analysis"
          aria-label="Live magnetic field measurements"
        >
          <h3>Live measurements</h3>
          <Reading
            label="Field magnitude |B|"
            value={`${f(result.magnitudeMicroT)} μT`}
            hot
          />
          <Reading label="Current" value={`${f(result.current)} A`} />
          <Reading label="Probe x" value={`${f(input.probeX * 100, 1)} cm`} />
          <Reading label="Probe y" value={`${f(input.probeY * 100, 1)} cm`} />
          <Reading
            label="Distance r"
            value={`${f(result.radiusM * 100, 1)} cm`}
          />
          <Reading label="Field angle" value={`${f(result.angleDeg, 0)}°`} />
          <section className="hand-rule">
            <b>Right-hand grip rule</b>
            <span>
              Thumb follows conventional current; curled fingers show B. Reverse
              I and every compass flips immediately.
            </span>
          </section>
          <section className="field-graph">
            <b>B vs distance · straight wire</b>
            <svg viewBox="0 0 300 130">
              <line x1="30" y1="115" x2="290" y2="115" />
              <line x1="30" y1="10" x2="30" y2="115" />
              <polyline points={graph} />
            </svg>
            <span>B ∝ I/r</span>
          </section>
        </aside>
      </div>
      <section
        className="field-mission"
        aria-label="Two wire zero field mission"
      >
        <div>
          <span>CHALLENGE</span>
          <b>Create a point of zero net magnetic field.</b>
          <small>
            Use two same-direction wires and place the probe where their
            opposite field vectors cancel.
          </small>
        </div>
        <button onClick={startMission}>Start challenge</button>
        {mission && (
          <button onClick={() => update({ probeX: missionNull, probeY: 0 })}>
            Set calculated null
          </button>
        )}
        {mission && <button onClick={check}>Test field</button>}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}

function CompassGrid({ input }: { input: MagneticFieldInput }) {
  return (
    <g className="compass-grid">
      {Array.from({ length: 35 }, (_, index) => {
        const col = index % 7,
          row = Math.floor(index / 7),
          x = 160 + col * 64,
          y = 180 + row * 65,
          px = (x - 350) / 2600,
          py = (310 - y) / 2200,
          local = solveMagneticField({ ...input, probeX: px, probeY: py }),
          rotation = -local.angleDeg;
        return (
          <g key={index} transform={`translate(${x} ${y}) rotate(${rotation})`}>
            <circle r="12" />
            <line x1="-9" x2="9" />
            <path d="M9 0l-5-4v8z" />
          </g>
        );
      })}
    </g>
  );
}
