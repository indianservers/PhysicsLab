import { useEffect, useMemo, useState, type PointerEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  instrumentDefaults,
  solveMeasurements,
  type Instrument,
  type MeasurementInput,
} from "./measurementErrorsSimulation";
import "./measurement-errors.css";
type Run = "idle" | "running" | "paused" | "result";
const D: MeasurementInput = {
  trueMm: 24.48,
  instrument: "vernier",
  leastCountMm: 0.02,
  zeroErrorMm: 0.02,
  trials: 5,
  parallax: 0,
  seed: 31,
};
const f = (n: number, d = 3) => n.toFixed(d);
export function MeasurementErrorsLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(D),
    [jaw, setJaw] = useState(24.5),
    [run, setRun] = useState<Run>("idle"),
    [phase, setPhase] = useState(2),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [mission, setMission] = useState(false),
    [feedback, setFeedback] = useState("");
  const result = useMemo(() => solveMeasurements(input), [input]);
  useEffect(() => {
    if (run !== "running") return;
    const id = window.setInterval(
      () =>
        setPhase((old) => {
          const next = reduced ? 2 : old + 1;
          if (next >= 2) setRun("result");
          return Math.min(2, next);
        }),
      reduced ? 120 : 750 / speed,
    );
    return () => clearInterval(id);
  }, [run, speed, reduced]);
  const update = (change: Partial<MeasurementInput>) => {
    setInput((old) => ({ ...old, ...change }));
    setFeedback("");
  };
  const chooseInstrument = (instrument: Instrument) =>
    update({
      instrument,
      leastCountMm: instrumentDefaults[instrument],
      parallax: 0,
    });
  const reset = () => {
    setInput(D);
    setJaw(24.5);
    setRun("idle");
    setPhase(2);
    setMission(false);
    setFeedback("");
  };
  const moveJaw = (event: PointerEvent<SVGSVGElement>) => {
    if (event.buttons !== 1) return;
    const box = event.currentTarget.getBoundingClientRect();
    const value = Math.max(
      1,
      Math.min(100, ((event.clientX - box.left) / box.width) * 100),
    );
    setJaw(value);
  };
  const startMission = () => {
    setMission(true);
    setInput(D);
    setJaw(24.5);
    setFeedback(
      "Choose the only report whose uncertainty is rounded first and whose value matches its decimal place.",
    );
  };
  const check = (choice: "correct" | "over" | "under") => {
    const pass = choice === "correct";
    setFeedback(
      pass
        ? `✓ Correct report: ${result.reportText}. Intermediate readings stayed unrounded; rounding happened only at the end.`
        : choice === "over"
          ? "Over-precise: the reported value contains digits beyond the uncertainty's decimal place."
          : "Too coarse: this discards justified resolution from the combined uncertainty.",
    );
    if (pass) setRun("result");
  };
  return (
    <section
      className="measure-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header>
        <div>
          <span>MEASUREMENT · CLASS 11</span>
          <h2>Precision & Uncertainty Studio</h2>
          <p>
            Take corrected readings, repeat trials, propagate uncertainty, then
            report honestly.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="measure-layout">
        <aside className="measure-controls">
          <h3>Instrument</h3>
          {(["ruler", "vernier", "micrometer"] as Instrument[]).map(
            (instrument) => (
              <button
                key={instrument}
                className={input.instrument === instrument ? "active" : ""}
                onClick={() => chooseInstrument(instrument)}
              >
                {instrument === "ruler"
                  ? "Ruler · 1 mm"
                  : instrument === "vernier"
                    ? "Vernier · 0.02 mm"
                    : "Micrometer · 0.01 mm"}
              </button>
            ),
          )}
          <h3>Object & errors</h3>
          <Slider
            label="True dimension"
            value={input.trueMm}
            min={5}
            max={80}
            step={0.01}
            unit="mm"
            onChange={(value) => update({ trueMm: value })}
          />
          <Slider
            label="Least count"
            value={input.leastCountMm}
            min={0.01}
            max={1}
            step={0.01}
            unit="mm"
            onChange={(value) => update({ leastCountMm: value })}
          />
          <Slider
            label="Zero error"
            value={input.zeroErrorMm}
            min={-0.1}
            max={0.1}
            step={0.01}
            unit="mm"
            onChange={(value) => update({ zeroErrorMm: value })}
          />
          <Slider
            label="Repeated trials"
            value={input.trials}
            min={1}
            max={12}
            step={1}
            unit=""
            onChange={(value) => update({ trials: value })}
          />
          {input.instrument === "ruler" && (
            <Slider
              label="Eye parallax"
              value={input.parallax}
              min={-1}
              max={1}
              step={0.1}
              unit="offset"
              onChange={(value) => update({ parallax: value })}
            />
          )}
          <p className="measure-tip">
            Positive zero error is subtracted. Negative zero error is added.
          </p>
        </aside>
        <main className="measure-main">
          <div className="measure-toolbar">
            <div>
              <button
                onClick={() => {
                  setPhase(0);
                  setRun("running");
                }}
              >
                ▶ Demonstrate errors
              </button>
              <button onClick={() => setRun("paused")}>Ⅱ Pause</button>
              <button
                onClick={() => {
                  setRun("paused");
                  setPhase((old) => Math.min(2, old + 1));
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
            className="measure-stage"
            aria-label={`${input.instrument} measuring ${f(input.trueMm, 2)} millimetres; corrected mean ${f(result.mean)} millimetres`}
          >
            <img
              src="/assets/experiments/measurement-errors/measurement-instruments.png"
              alt="Transparent vernier caliper, cylindrical sample, balance and ruler"
            />
            <svg
              viewBox="0 0 900 530"
              role="img"
              aria-label="Drag or use arrow keys to close the live caliper jaw"
              onPointerDown={moveJaw}
              onPointerMove={moveJaw}
            >
              <g
                className="live-jaw"
                transform={`translate(${210 + jaw * 4.4} 80)`}
                tabIndex={0}
                role="slider"
                aria-label="Caliper jaw reading"
                aria-valuemin={1}
                aria-valuemax={100}
                aria-valuenow={jaw}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft")
                    setJaw((old) => Math.max(1, old - input.leastCountMm));
                  if (e.key === "ArrowRight")
                    setJaw((old) => Math.min(100, old + input.leastCountMm));
                }}
              >
                <path d="M0 0h26v150h-12V45H0z" />
                <text x="13" y="172" textAnchor="middle">
                  {f(jaw, 2)} mm
                </text>
              </g>
              {phase === 0 && (
                <g className="parallax">
                  <line x1="400" y1="25" x2="460" y2="190" />
                  <line x1="520" y1="25" x2="460" y2="190" />
                  <text x="460" y="20" textAnchor="middle">
                    parallax changes apparent alignment
                  </text>
                </g>
              )}
              {phase >= 1 && (
                <g className="correction">
                  <text x="470" y="240" textAnchor="middle">
                    corrected = raw − zero error
                  </text>
                  <text x="470" y="275" textAnchor="middle">
                    {f(result.readings[0].raw, 2)} − (
                    {input.zeroErrorMm >= 0 ? "+" : ""}
                    {f(input.zeroErrorMm, 2)}) ={" "}
                    {f(result.readings[0].corrected, 2)} mm
                  </text>
                </g>
              )}
            </svg>
            <div className="live-display">
              <b>{f(result.readings[0].corrected, 2)} mm</b>
              <span>corrected reading · jaw {f(jaw, 2)} mm</span>
            </div>
          </section>
          <section className="measure-equations">
            <b>x̄ = Σxᵢ/n</b>
            <span>Δx = √[(s/√n)² + (LC/2)²]</span>
            <span>ΔA/A = 2Δx/x for A=x²</span>
          </section>
          <section className="trial-table">
            <header>
              <b>Recorded trials</b>
              <span>unrounded values feed every calculation</span>
            </header>
            <table>
              <thead>
                <tr>
                  <th>Trial</th>
                  <th>Raw (mm)</th>
                  <th>Zero correction</th>
                  <th>Corrected (mm)</th>
                </tr>
              </thead>
              <tbody>
                {result.readings.map((reading) => (
                  <tr key={reading.trial}>
                    <td>{reading.trial}</td>
                    <td>{f(reading.raw, 2)}</td>
                    <td>{f(-input.zeroErrorMm, 2)}</td>
                    <td>{f(reading.corrected, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
        <aside className="measure-analysis">
          <h3>Statistics</h3>
          <Reading label="Mean x̄" value={`${f(result.mean)} mm`} hot />
          <Reading label="Sample s" value={`${f(result.sampleStd)} mm`} />
          <Reading
            label="Random s/√n"
            value={`${f(result.randomUncertainty)} mm`}
          />
          <Reading
            label="Instrument LC/2"
            value={`${f(result.instrumentUncertainty)} mm`}
          />
          <Reading
            label="Combined Δx"
            value={`${f(result.combinedUncertainty)} mm`}
          />
          <Reading
            label="Absolute error"
            value={`${f(result.absoluteError)} mm`}
          />
          <Reading
            label="Percentage error"
            value={`${f(result.percentageError)}%`}
          />
          <section className="final-report">
            <b>FINAL REPORT</b>
            <strong>{result.reportText}</strong>
            <span>uncertainty first; value to the same decimal place</span>
          </section>
          <section className="propagation">
            <b>Uncertainty propagation</b>
            <span>A = x² = {f(result.area)} mm²</span>
            <strong>ΔA = {f(result.areaUncertainty)} mm²</strong>
          </section>
        </aside>
      </div>
      <section className="measure-mission">
        <div>
          <span>CHALLENGE</span>
          <b>Report the length with valid significant figures.</b>
          <small>Select the scientifically honest result.</small>
        </div>
        <button onClick={startMission}>Start challenge</button>
        {mission && (
          <div className="report-choices">
            <button onClick={() => check("over")}>
              {result.mean.toFixed(5)} ± {result.combinedUncertainty.toFixed(5)}{" "}
              mm
            </button>
            <button onClick={() => check("correct")}>
              {result.reportText}
            </button>
            <button onClick={() => check("under")}>
              {result.mean.toFixed(1)} ± {result.combinedUncertainty.toFixed(1)}{" "}
              mm
            </button>
          </div>
        )}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
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
    <label className="measure-slider">
      <span>
        {label}
        <b>
          {value} {unit}
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
    <div className={hot ? "measure-reading hot" : "measure-reading"}>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
