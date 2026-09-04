import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  runWorkflow,
  type NumericalModel,
  type WorkflowInput,
} from "./computationalPhysicsSimulation";
import "./computational-physics-workflow.css";

type Run = "idle" | "running" | "paused" | "result";
const D: WorkflowInput = {
  model: "explicit-diffusion",
  meshN: 40,
  timeStep: 0.001,
  tolerance: 1e-3,
  seed: 20240517,
};
const f = (n: number, d = 2) =>
  Number.isFinite(n) ? n.toExponential(d) : "diverged";

export function ComputationalPhysicsWorkflowLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(D),
    [run, setRun] = useState<Run>("idle"),
    [stage, setStage] = useState(4),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [mission, setMission] = useState(false),
    [feedback, setFeedback] = useState("");
  const result = useMemo(() => runWorkflow(input), [input]);
  useEffect(() => {
    if (run !== "running") return;
    const id = window.setInterval(
      () =>
        setStage((old) => {
          const next = reduced ? 4 : old + 1;
          if (next >= 4) setRun("result");
          return Math.min(4, next);
        }),
      reduced ? 120 : 650 / speed,
    );
    return () => clearInterval(id);
  }, [run, speed, reduced]);
  const update = (change: Partial<WorkflowInput>) => {
    setInput((old) => ({ ...old, ...change }));
    setStage(0);
    setRun("paused");
    setFeedback("");
  };
  const reset = () => {
    setInput(D);
    setRun("idle");
    setStage(4);
    setMission(false);
    setFeedback("");
  };
  const startMission = () => {
    setMission(true);
    setInput({ ...D, meshN: 80, timeStep: 0.02, tolerance: 1e-3 });
    setStage(4);
    setFeedback(
      "Reach RMS error below 1.00×10⁻³ with cost at or below 12,000 work units. Unstable runs are rejected.",
    );
  };
  const check = () => {
    const pass = result.stable && result.error < 1e-3 && result.cost <= 12000;
    setFeedback(
      pass
        ? `✓ Accuracy achieved: RMS ${f(result.error)} at cost ${result.cost.toLocaleString()} · ${result.reproducibilityId}.`
        : `${result.stable ? `RMS ${f(result.error)}; cost ${result.cost.toLocaleString()}` : `Unstable: λ = ${result.stabilityNumber.toFixed(2)} > 0.50`}. Refine only as much as needed.`,
    );
    if (pass) setRun("result");
  };
  const chart = result.values
    .map(
      (value, index) =>
        `${30 + (index * 470) / Math.max(1, result.values.length - 1)},${120 - Math.max(-1.2, Math.min(1.2, value)) * 65}`,
    )
    .join(" ");
  const exact = result.exact
    .map(
      (value, index) =>
        `${30 + (index * 470) / Math.max(1, result.exact.length - 1)},${120 - Math.max(-1.2, Math.min(1.2, value)) * 65}`,
    )
    .join(" ");
  const conv = result.convergence
    .filter((p) => Number.isFinite(p.error))
    .map(
      (p, index) =>
        `${40 + index * 100},${130 - Math.max(0, Math.min(110, -Math.log10(Math.max(p.error, 1e-8)) * 24))}`,
    )
    .join(" ");
  const blocks = ["Problem", "Model", "Discretize", "Solve", "Verify"];
  return (
    <section
      className="compute-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header>
        <div>
          <span>MEASUREMENT · RESEARCH</span>
          <h2>Executable Computational Workflow</h2>
          <p>
            Model → discretize → solve → verify, with every numerical choice
            exposed.
          </p>
        </div>
        <button onClick={reset}>↻ Reset workflow</button>
      </header>
      <div className="compute-layout">
        <aside
          className="compute-controls"
          aria-label="Numerical method controls"
        >
          <h3>Model choice</h3>
          <select
            aria-label="Numerical model"
            value={input.model}
            onChange={(e) =>
              update({ model: e.target.value as NumericalModel })
            }
          >
            <option value="explicit-diffusion">Explicit 1D diffusion</option>
            <option value="implicit-diffusion">Implicit 1D diffusion</option>
            <option value="oscillator-rk4">Oscillator RK4</option>
          </select>
          <h3>Discretization</h3>
          <label>
            Mesh cells N <b>{input.meshN}</b>
            <input
              aria-label="Mesh cells"
              type="range"
              min="10"
              max="80"
              step="10"
              value={input.meshN}
              onChange={(e) => update({ meshN: Number(e.target.value) })}
            />
          </label>
          <div className="compute-presets">
            <button onClick={() => update({ meshN: 10 })}>N 10</button>
            <button onClick={() => update({ meshN: 40 })}>N 40</button>
            <button onClick={() => update({ meshN: 80 })}>N 80</button>
          </div>
          <label>
            Time step Δt <b>{input.timeStep} s</b>
            <input
              aria-label="Time step"
              type="range"
              min=".0005"
              max=".02"
              step=".0005"
              value={input.timeStep}
              onChange={(e) => update({ timeStep: Number(e.target.value) })}
            />
          </label>
          <div className="compute-presets">
            <button onClick={() => update({ timeStep: 0.0005 })}>Fine</button>
            <button onClick={() => update({ timeStep: 0.005 })}>Typical</button>
            <button onClick={() => update({ timeStep: 0.02 })}>Coarse</button>
          </div>
          <h3>Solver</h3>
          <label>
            Tolerance
            <select
              aria-label="Solver tolerance"
              value={input.tolerance}
              onChange={(e) => update({ tolerance: Number(e.target.value) })}
            >
              <option value=".001">1×10⁻³</option>
              <option value=".00001">1×10⁻⁵</option>
              <option value=".0000001">1×10⁻⁷</option>
            </select>
          </label>
          <label>
            Reproducible seed
            <input
              aria-label="Reproducible seed"
              type="number"
              value={input.seed}
              onChange={(e) => update({ seed: Number(e.target.value) || 1 })}
            />
          </label>
        </aside>
        <main className="compute-main">
          <div className="compute-toolbar">
            <div>
              <button
                onClick={() => {
                  setStage(0);
                  setRun("running");
                }}
              >
                ▶ Run pipeline
              </button>
              <button onClick={() => setRun("paused")}>Ⅱ Pause</button>
              <button
                onClick={() => {
                  setRun("paused");
                  setStage((old) => Math.min(4, old + 1));
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
            className="pipeline-stage"
            aria-label={`Workflow ${result.reproducibilityId}; ${result.stable ? "stable" : "unstable"}; RMS error ${f(result.error)}`}
          >
            <img
              src="/assets/experiments/computational-physics-workflow/numerical-workflow-bench.png"
              alt="Transparent numerical-method workstation with five connected modules"
            />
            <div className="pipeline-blocks">
              {blocks.map((block, index) => (
                <button
                  key={block}
                  className={index <= stage ? "done" : ""}
                  onClick={() => setStage(index)}
                >
                  <i>{index + 1}</i>
                  <b>{block}</b>
                  <small>
                    {index === 0
                      ? "PDE / ODE"
                      : index === 1
                        ? result.label
                        : index === 2
                          ? `N ${input.meshN} · Δt ${input.timeStep}`
                          : index === 3
                            ? `${result.steps} steps`
                            : `RMS ${f(result.error, 1)}`}
                  </small>
                </button>
              ))}
            </div>
            <div
              className="data-pulse"
              style={{ left: `${12 + stage * 19}%` }}
            />
          </section>
          <section className="compute-charts">
            <div>
              <b>Numerical vs analytical reference</b>
              <svg viewBox="0 0 530 200">
                <line x1="30" y1="120" x2="510" y2="120" />
                <polyline className="reference" points={exact} />
                <polyline className="numeric" points={chart} />
              </svg>
              <span>error = RMS(uₙᵤₘ − uᵣₑ𝒻)</span>
            </div>
            <div>
              <b>Convergence study</b>
              <svg viewBox="0 0 460 160">
                <line x1="35" y1="130" x2="445" y2="130" />
                <polyline points={conv} />
              </svg>
              <span>smaller Δt → lower truncation error</span>
            </div>
          </section>
        </main>
        <aside className="compute-analysis">
          <h3>Run diagnostics</h3>
          <Reading label="RMS error" value={f(result.error)} hot />
          <Reading label="Work cost" value={result.cost.toLocaleString()} />
          <Reading label="Time steps" value={result.steps.toLocaleString()} />
          <Reading
            label="Solver iterations"
            value={result.iterations.toLocaleString()}
          />
          <Reading
            label="Stability number"
            value={result.stabilityNumber.toFixed(3)}
          />
          <section
            className={
              result.stable
                ? "compute-status stable"
                : "compute-status unstable"
            }
          >
            <b>{result.stable ? "✓ STABLE" : "⚠ UNSTABLE"}</b>
            <span>
              {input.model === "explicit-diffusion"
                ? "Explicit diffusion requires λ=αΔt/Δx² ≤ 0.5."
                : "This method is stable in the selected range."}
            </span>
          </section>
          <section className="repro">
            <b>Reproducibility pack</b>
            <code>{result.reproducibilityId}</code>
            <small>{result.settings}</small>
          </section>
          <table>
            <caption>Convergence runs</caption>
            <thead>
              <tr>
                <th>Δt</th>
                <th>RMS error</th>
              </tr>
            </thead>
            <tbody>
              {result.convergence.map((p) => (
                <tr key={p.timeStep}>
                  <td>{p.timeStep}</td>
                  <td>{f(p.error, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>
      </div>
      <section className="compute-mission">
        <div>
          <span>CHALLENGE</span>
          <b>Reach target accuracy at minimum cost.</b>
          <small>RMS &lt; 1×10⁻³ · cost ≤ 12,000 · stable · reproducible</small>
        </div>
        <button onClick={startMission}>Start challenge</button>
        {mission && (
          <button
            onClick={() =>
              update({
                model: "explicit-diffusion",
                meshN: 20,
                timeStep: 0.005,
                tolerance: 1e-3,
              })
            }
          >
            Set efficient candidate
          </button>
        )}
        {mission && <button onClick={check}>Verify run</button>}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
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
    <div className={hot ? "compute-reading hot" : "compute-reading"}>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
