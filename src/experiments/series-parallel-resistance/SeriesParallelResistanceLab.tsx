import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  DEFAULT_NETWORK_INPUT,
  solveNetwork,
  type NetworkInput,
  type NetworkTopology,
} from "./seriesParallelPhysics";
import "./series-parallel-resistance.css";

type RunState = "idle" | "running" | "paused" | "result";
type SavedNetwork = { input: NetworkInput; resistance: number };

export function SeriesParallelResistanceLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(DEFAULT_NETWORK_INPUT);
  const [runState, setRunState] = useState<RunState>("idle");
  const [traceStep, setTraceStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(
    () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  const [saved, setSaved] = useState<SavedNetwork | null>(null);
  const [feedback, setFeedback] = useState("");
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const result = useMemo(() => solveNetwork(input), [input]);

  useEffect(() => {
    if (runState !== "running") return;
    const timer = window.setTimeout(
      () =>
        setTraceStep((step) => {
          if (step >= 4) {
            setRunState("result");
            return 4;
          }
          return step + 1;
        }),
      (reducedMotion ? 1300 : 700) / speed,
    );
    return () => window.clearTimeout(timer);
  }, [runState, traceStep, speed, reducedMotion]);

  const update = (patch: Partial<NetworkInput>) => {
    setInput((current) => ({ ...current, ...patch }));
    setFeedback("");
    setTraceStep(0);
    setRunState("idle");
  };
  const setResistor = (index: number, value: number) =>
    setInput((current) => ({
      ...current,
      resistors: current.resistors.map((r, i) =>
        i === index ? value : r,
      ) as NetworkInput["resistors"],
    }));
  const toggle = (index: number) =>
    setInput((current) => ({
      ...current,
      switches: current.switches.map((on, i) =>
        i === index ? !on : on,
      ) as NetworkInput["switches"],
    }));
  const reset = () => {
    setInput(DEFAULT_NETWORK_INPUT);
    setRunState("idle");
    setTraceStep(0);
    setSaved(null);
    setFeedback("");
  };
  const play = () => {
    if (runState === "result") setTraceStep(0);
    setRunState("running");
  };
  const step = () => {
    setRunState("paused");
    setTraceStep((step) => (step >= 4 ? 0 : step + 1));
  };
  const saveNetwork = () => {
    if (!Number.isFinite(result.equivalentResistance)) {
      setFeedback("Connect at least one resistor before saving.");
      return;
    }
    setSaved({
      input: structuredClone(input),
      resistance: result.equivalentResistance,
    });
    setFeedback(
      `Network A saved at ${result.equivalentResistance.toFixed(2)} Ω. Build a different matching network.`,
    );
  };
  const sameSignature =
    saved && JSON.stringify(saved.input) === JSON.stringify(input);
  const checkMission = () =>
    setFeedback(
      !saved
        ? "Save Network A first."
        : sameSignature
          ? "Change the topology, values, or switch pattern before checking."
          : Math.abs(saved.resistance - result.equivalentResistance) < 0.01
            ? `✓ Match: two different networks both equal ${result.equivalentResistance.toFixed(2)} Ω.`
            : `Not yet: Network A is ${saved.resistance.toFixed(2)} Ω; this network is ${Number.isFinite(result.equivalentResistance) ? result.equivalentResistance.toFixed(2) : "open"} Ω.`,
    );
  const missionA = () => {
    const next: NetworkInput = {
      voltage: 12,
      resistors: [2, 4, 6],
      switches: [true, true, false],
      topology: "series",
    };
    setInput(next);
    setSaved({ input: structuredClone(next), resistance: 6 });
    setFeedback(
      "Network A saved: 2 Ω + 4 Ω = 6 Ω. Now make a different 6 Ω network.",
    );
  };
  const missionB = () => {
    setInput({
      voltage: 12,
      resistors: [2, 4, 6],
      switches: [false, false, true],
      topology: "parallel",
    });
    setFeedback(
      "Network B loaded. Check whether its equivalent resistance matches.",
    );
  };
  const maxCurrent = Math.max(
    result.totalCurrent,
    ...result.branchCurrents,
    0.1,
  );

  return (
    <section
      className="network-lab"
      data-ui-theme="light"
      data-run-state={runState}
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="network-head">
        <div>
          <span>ELECTRICITY · CLASS 10 / 12</span>
          <h2>Circuit Construction · Series vs Parallel</h2>
          <p>
            Connect real branches, then compare current, voltage, equivalent
            resistance and power.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="network-layout">
        <aside
          className="network-controls"
          aria-label="Circuit components and controls"
        >
          <h3>Components</h3>
          <p>Drag a resistor to the board, or tap it to connect/disconnect.</p>
          {input.resistors.map((resistance, index) => (
            <div className="resistor-control" key={index}>
              <button
                draggable
                aria-pressed={input.switches[index]}
                onPointerDown={() => setDraggingIndex(index)}
                onDragStart={(event) =>
                  event.dataTransfer.setData("text/resistor", String(index))
                }
                onClick={() => {
                  toggle(index);
                  setDraggingIndex(null);
                }}
              >
                <i className={`band b${index + 1}`} /> R{index + 1} ·{" "}
                {input.switches[index] ? "connected" : "open"}
              </button>
              <label>
                <span>{resistance.toFixed(0)} Ω</span>
                <input
                  aria-label={`Resistor R${index + 1}`}
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={resistance}
                  onChange={(event) =>
                    setResistor(index, Number(event.target.value))
                  }
                />
              </label>
            </div>
          ))}
          <h3>Source & topology</h3>
          <label className="voltage-control">
            <span>
              Supply voltage <b>{input.voltage.toFixed(1)} V</b>
            </span>
            <input
              aria-label="Supply voltage"
              type="range"
              min="0"
              max="24"
              step=".5"
              value={input.voltage}
              onChange={(event) =>
                update({ voltage: Number(event.target.value) })
              }
            />
          </label>
          <div className="topology-choice">
            {(["series", "parallel"] as NetworkTopology[]).map((topology) => (
              <button
                key={topology}
                className={input.topology === topology ? "active" : ""}
                aria-pressed={input.topology === topology}
                onClick={() => update({ topology })}
              >
                {topology}
              </button>
            ))}
          </div>
          <div className="network-presets">
            <button
              onClick={() =>
                setInput({
                  voltage: 0,
                  resistors: [1, 1, 1],
                  switches: [true, false, false],
                  topology: "series",
                })
              }
            >
              Minimum setup
            </button>
            <button onClick={() => setInput(DEFAULT_NETWORK_INPUT)}>
              Typical setup
            </button>
            <button
              onClick={() =>
                setInput({
                  voltage: 24,
                  resistors: [20, 20, 20],
                  switches: [true, true, true],
                  topology: "parallel",
                })
              }
            >
              Maximum setup
            </button>
          </div>
        </aside>
        <main className="network-main">
          <div className="network-toolbar">
            <div>
              <button onClick={play} disabled={runState === "running"}>
                ▶ {runState === "result" ? "Replay" : "Play current"}
              </button>
              <button
                onClick={() => setRunState("paused")}
                disabled={runState !== "running"}
              >
                Ⅱ Pause
              </button>
              <button onClick={step}>▮▶ Step</button>
            </div>
            <strong>
              {input.topology} · trace {traceStep}/4
            </strong>
          </div>
          <div
            className="network-stage"
            onDragOver={(event) => event.preventDefault()}
            onPointerUp={() => {
              if (draggingIndex !== null && !input.switches[draggingIndex])
                toggle(draggingIndex);
              setDraggingIndex(null);
            }}
            onDrop={(event) => {
              event.preventDefault();
              const index = Number(event.dataTransfer.getData("text/resistor"));
              if (Number.isInteger(index) && !input.switches[index])
                toggle(index);
            }}
          >
            <img
              src="/assets/experiments/series-parallel-resistance/construction-board.png"
              alt="Two-space wooden circuit construction board with source, resistor and meter modules"
            />
            <svg
              viewBox="0 0 1000 520"
              role="img"
              aria-label={`${input.topology} resistor network with live current paths`}
            >
              <NetworkDrawing
                input={input}
                currents={result.branchCurrents}
                totalCurrent={result.totalCurrent}
                maxCurrent={maxCurrent}
              />
              <text className="drop-cue" x="500" y="490">
                Drop resistor here to connect · tap component for keyboard/touch
              </text>
            </svg>
          </div>
          <div className="network-equations">
            <div>
              <span>EQUIVALENT</span>
              <strong>
                {input.topology === "series" ? "Rₛ = ΣRᵢ" : "1/Rₚ = Σ(1/Rᵢ)"}
              </strong>
              <b>
                {Number.isFinite(result.equivalentResistance)
                  ? result.equivalentResistance.toFixed(3)
                  : "∞"}{" "}
                Ω
              </b>
            </div>
            <div>
              <span>KCL</span>
              <strong>I = ΣIᵢ at split</strong>
              <b>{result.kclResidual.toExponential(1)} A</b>
            </div>
            <div>
              <span>POWER</span>
              <strong>VI = ΣIᵢ²Rᵢ</strong>
              <b>{result.powerResidual.toExponential(1)} W</b>
            </div>
          </div>
        </main>
        <aside
          className="network-readings"
          aria-label="Live network measurements"
        >
          <h3>Live measurements</h3>
          <Reading
            label="Supply voltage"
            value={`${input.voltage.toFixed(2)} V`}
          />
          <Reading
            label="Total current"
            value={`${result.totalCurrent.toFixed(3)} A`}
          />
          <Reading
            label="Equivalent R"
            value={`${Number.isFinite(result.equivalentResistance) ? result.equivalentResistance.toFixed(3) : "∞"} Ω`}
          />
          <Reading
            label="Source power"
            value={`${result.sourcePower.toFixed(3)} W`}
          />
          {input.resistors.map((resistance, index) => (
            <section
              key={index}
              className={input.switches[index] ? "connected" : "open"}
            >
              <strong>
                R{index + 1} · {resistance.toFixed(0)} Ω
              </strong>
              <span>
                I{index + 1} = {result.branchCurrents[index].toFixed(3)} A
              </span>
              <span>
                ΔV{index + 1} = {result.voltageDrops[index].toFixed(3)} V
              </span>
            </section>
          ))}
          <div className="verification">
            <b>
              ✓ {result.activeCount} active path
              {result.activeCount === 1 ? "" : "s"}
            </b>
            <span>✓ KCL residual {result.kclResidual.toExponential(1)} A</span>
            <span>✓ power totals agree</span>
          </div>
        </aside>
      </div>
      <section className="network-mission">
        <div>
          <span>MINI-MISSION</span>
          <h3>Build two different networks with the same Rₑq</h3>
          <p>Switches count: an open branch is not part of the network.</p>
        </div>
        <button onClick={missionA}>Load & save 6 Ω Network A</button>
        <button onClick={missionB}>Build different Network B</button>
        <button onClick={saveNetwork}>Save current as A</button>
        <button onClick={checkMission}>Check match</button>
        {feedback && (
          <p
            className={feedback.startsWith("✓") ? "success" : ""}
            aria-live="polite"
          >
            {feedback}
          </p>
        )}
      </section>
      <footer className="network-footer">
        <button onClick={play} disabled={runState === "running"}>
          ▶ Resume
        </button>
        <button
          onClick={() => setRunState("paused")}
          disabled={runState !== "running"}
        >
          Ⅱ Pause
        </button>
        <button onClick={step}>▮▶ Step</button>
        <label>
          Speed{" "}
          <select
            aria-label="Playback speed"
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
          >
            {[0.25, 0.5, 1, 1.5, 2].map((value) => (
              <option key={value} value={value}>
                {value}×
              </option>
            ))}
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(event) => setReducedMotion(event.target.checked)}
          />{" "}
          Reduced motion
        </label>
        <span>Line thickness ∝ branch current</span>
      </footer>
      <p className="sr-only" aria-live="polite">
        {input.topology} network. Equivalent resistance{" "}
        {Number.isFinite(result.equivalentResistance)
          ? result.equivalentResistance.toFixed(3)
          : "infinite"}{" "}
        ohms. Total current {result.totalCurrent.toFixed(3)} amperes.
      </p>
    </section>
  );
}

function NetworkDrawing({
  input,
  currents,
  totalCurrent,
  maxCurrent,
}: {
  input: NetworkInput;
  currents: [number, number, number];
  totalCurrent: number;
  maxCurrent: number;
}) {
  const active = input.switches
    .map((on, index) => (on ? index : -1))
    .filter((index) => index >= 0);
  if (input.topology === "series")
    return (
      <g className="circuit series">
        <path
          className="wire total"
          style={{ strokeWidth: 4 + (8 * totalCurrent) / maxCurrent }}
          d="M120 110H860V390H120Z"
        />
        <Battery x={120} y={250} />
        {active.map((index, order) => (
          <Resistor
            key={index}
            x={300 + order * 210}
            y={110}
            label={`R${index + 1}`}
            value={input.resistors[index]}
            current={currents[index]}
            max={maxCurrent}
          />
        ))}
        {active.length === 0 && (
          <text x="420" y="250">
            OPEN CIRCUIT
          </text>
        )}
      </g>
    );
  return (
    <g className="circuit parallel">
      <path
        className="wire total"
        style={{ strokeWidth: 4 + (8 * totalCurrent) / maxCurrent }}
        d="M120 90H860M120 410H860M120 90V410M860 90V410"
      />
      <Battery x={120} y={250} />
      {active.map((index, order) => {
        const x = 340 + order * 190;
        return (
          <g key={index}>
            <path
              className="wire branch"
              style={{ strokeWidth: 3 + (8 * currents[index]) / maxCurrent }}
              d={`M${x} 90V410`}
            />
            <Resistor
              x={x}
              y={250}
              label={`R${index + 1}`}
              value={input.resistors[index]}
              current={currents[index]}
              max={maxCurrent}
              vertical
            />
          </g>
        );
      })}
      {active.length === 0 && (
        <text x="420" y="250">
          ALL BRANCHES OPEN
        </text>
      )}
    </g>
  );
}
function Resistor({
  x,
  y,
  label,
  value,
  current,
  max,
  vertical,
}: {
  x: number;
  y: number;
  label: string;
  value: number;
  current: number;
  max: number;
  vertical?: boolean;
}) {
  return (
    <g
      className="resistor"
      transform={`translate(${x} ${y}) ${vertical ? "rotate(90)" : ""}`}
    >
      <line x1="-60" x2="-38" />
      <path d="M-38 0l10-13 15 26 15-26 15 26 15-26 10 13" />
      <line x1="42" x2="60" />
      <text y="-24">
        {label} {value} Ω
      </text>
      <text y="34">{current.toFixed(2)} A</text>
      <circle r={4 + (5 * current) / max} />
    </g>
  );
}
function Battery({ x, y }: { x: number; y: number }) {
  return (
    <g className="battery" transform={`translate(${x} ${y})`}>
      <line y1="-60" y2="-15" />
      <line x1="-22" x2="22" y1="-14" y2="-14" />
      <line x1="-13" x2="13" y1="12" y2="12" />
      <line y1="13" y2="60" />
      <text x="30" y="5">
        SOURCE
      </text>
    </g>
  );
}
function Reading({ label, value }: { label: string; value: string }) {
  return (
    <div className="network-reading">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
