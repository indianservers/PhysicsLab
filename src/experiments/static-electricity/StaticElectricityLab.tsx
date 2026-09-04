import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  AIR_BREAKDOWN_FIELD,
  materialPairs,
  solveStaticElectricity,
  type MaterialPair,
  type StaticInput,
} from "./staticElectricityPhysics";
import "./static-electricity.css";

type RunState = "idle" | "running" | "paused" | "result";
const DEFAULT_INPUT: StaticInput = {
  pair: "pvc-wool",
  rubbing: 60,
  grounded: false,
  separation: 0.6,
};

export function StaticElectricityLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [runState, setRunState] = useState<RunState>("idle");
  const [stage, setStage] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(
    () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  const [inductionStage, setInductionStage] = useState(0);
  const [electroscopeCharge, setElectroscopeCharge] = useState(0);
  const [touched, setTouched] = useState(false);
  const [feedback, setFeedback] = useState("");
  const result = useMemo(() => solveStaticElectricity(input), [input]);
  const pair = materialPairs[input.pair];
  const polarization =
    input.separation < 0.7
      ? Math.min(1, 0.25 / input.separation) * Math.abs(result.negativeCharge)
      : 0;
  const leafAngle = Math.min(
    58,
    ((Math.abs(electroscopeCharge) + polarization * 0.45) / 1e-6) * 55,
  );

  useEffect(() => {
    if (runState !== "running") return;
    const timer = window.setTimeout(
      () =>
        setStage((current) => {
          const next = current + 1;
          if (next === 1) setInput((value) => ({ ...value, rubbing: 100 }));
          if (next === 2) setInput((value) => ({ ...value, separation: 0.3 }));
          if (next === 3) setInput((value) => ({ ...value, grounded: true }));
          if (next === 4) setInput((value) => ({ ...value, grounded: false }));
          if (next >= 5) {
            setRunState("result");
            return 5;
          }
          return next;
        }),
      (reducedMotion ? 1400 : 800) / speed,
    );
    return () => window.clearTimeout(timer);
  }, [runState, stage, speed, reducedMotion]);

  const update = (patch: Partial<StaticInput>) => {
    setInput((current) => ({ ...current, ...patch }));
    setFeedback("");
  };
  const reset = () => {
    setInput(DEFAULT_INPUT);
    setRunState("idle");
    setStage(0);
    setInductionStage(0);
    setElectroscopeCharge(0);
    setTouched(false);
    setFeedback("");
  };
  const play = () => {
    if (runState === "result") setStage(0);
    setRunState("running");
  };
  const step = () => {
    setRunState("paused");
    setStage((current) => (current >= 5 ? 0 : current + 1));
  };
  const startMission = () => {
    setInput({
      pair: "pvc-wool",
      rubbing: 80,
      grounded: false,
      separation: 1.2,
    });
    setInductionStage(0);
    setElectroscopeCharge(0);
    setTouched(false);
    setFeedback(
      "Rod charged. Bring it near the cap without entering the contact zone.",
    );
  };
  const approach = () => {
    update({ separation: 0.2 });
    setInductionStage(1);
    setFeedback("Charges polarize. The electroscope is still neutral overall.");
  };
  const ground = () => {
    if (inductionStage < 1)
      return setFeedback("Bring the charged rod near first.");
    update({ grounded: true });
    setInductionStage(2);
    setFeedback(
      "Ground connected: mobile electrons leave the electroscope; protons remain bound.",
    );
  };
  const unground = () => {
    if (inductionStage !== 2 || !input.grounded)
      return setFeedback("Ground it while the rod is still near.");
    update({ grounded: false });
    setElectroscopeCharge(Math.abs(result.negativeCharge) * 0.4);
    setInductionStage(3);
    setFeedback(
      "Ground removed first: the electroscope keeps a positive net charge.",
    );
  };
  const withdraw = () => {
    if (inductionStage !== 3)
      return setFeedback("Disconnect ground before withdrawing the rod.");
    update({ separation: 1.5 });
    setInductionStage(4);
    setFeedback(
      "Rod withdrawn. Like charge spreads to both leaves, so they remain apart.",
    );
  };
  const checkMission = () =>
    setFeedback(
      inductionStage === 4 && electroscopeCharge > 0 && !touched
        ? "✓ Induction complete: electroscope charged without contact; only electrons moved."
        : touched
          ? "Contact occurred. Reset the mission and keep separation above 0.08 m."
          : "Complete approach → ground → disconnect ground → withdraw, in that order.",
    );
  const stages = [
    "Ready",
    "Rub materials",
    "Separate charge",
    "Induce",
    "Ground electrons",
    "Discharge / result",
  ];

  return (
    <section
      className="static-lab"
      data-ui-theme="light"
      data-run-state={runState}
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="static-head">
        <div>
          <span>ELECTRICITY · CLASS 8 / 12 FOUNDATION</span>
          <h2>Static Electricity · Electroscope & Lightning</h2>
          <p>
            Track electrons through friction, induction, grounding, force and
            discharge.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="static-layout">
        <aside
          className="static-controls"
          aria-label="Static electricity controls"
        >
          <h3>Charge generator</h3>
          <label className="static-select">
            <span>Material pair</span>
            <select
              aria-label="Material pair"
              value={input.pair}
              onChange={(event) =>
                update({ pair: event.target.value as MaterialPair })
              }
            >
              {Object.entries(materialPairs).map(([id, value]) => (
                <option key={id} value={id}>
                  {value.negative} / {value.positive}
                </option>
              ))}
            </select>
          </label>
          <Control
            label="Rubbing amount"
            value={input.rubbing}
            min={0}
            max={100}
            step={4}
            unit="%"
            onChange={(value) => update({ rubbing: value })}
          />
          <Control
            label="Separation"
            value={input.separation}
            min={0.05}
            max={2}
            step={0.05}
            digits={2}
            unit="m"
            onChange={(value) => {
              if (value <= 0.08) setTouched(true);
              update({ separation: value });
            }}
          />
          <label className="ground-toggle">
            <input
              type="checkbox"
              checked={input.grounded}
              onChange={(event) => update({ grounded: event.target.checked })}
            />{" "}
            Ground / lightning rod connected
          </label>
          <div className="static-presets">
            <button
              onClick={() =>
                setInput({
                  pair: "pvc-wool",
                  rubbing: 0,
                  grounded: false,
                  separation: 2,
                })
              }
            >
              Minimum setup
            </button>
            <button onClick={() => setInput(DEFAULT_INPUT)}>
              Typical setup
            </button>
            <button
              onClick={() =>
                setInput({
                  pair: "glass-silk",
                  rubbing: 100,
                  grounded: false,
                  separation: 0.05,
                })
              }
            >
              Maximum field
            </button>
          </div>
          <p className="electron-note">
            Electron packets move. Atomic nuclei—and therefore protons—stay
            fixed in each material.
          </p>
        </aside>
        <main className="static-main">
          <div className="static-toolbar">
            <div>
              <button onClick={play} disabled={runState === "running"}>
                ▶ {runState === "result" ? "Replay" : "Play sequence"}
              </button>
              <button
                onClick={() => setRunState("paused")}
                disabled={runState !== "running"}
              >
                Ⅱ Pause
              </button>
              <button onClick={step}>▮▶ Step</button>
            </div>
            <strong>{stages[stage]}</strong>
          </div>
          <div
            className={`static-stage ${result.lightning ? "breakdown" : ""}`}
          >
            <img
              src="/assets/experiments/static-electricity/static-lab.png"
              alt="Van de Graaff generator, electroscope, storm cloud, lightning rod, PVC rod and wool"
            />
            <svg
              viewBox="0 0 1000 560"
              role="img"
              aria-label="Discrete electrons, electric field, electroscope leaves and lightning path"
            >
              <defs>
                <marker
                  id="field-arrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0 0L8 4L0 8Z" />
                </marker>
              </defs>
              {Array.from(
                { length: Math.min(result.packets, 22) },
                (_, index) => (
                  <g
                    className="electron"
                    key={index}
                    transform={`translate(${155 + (index % 5) * 35} ${110 + Math.floor(index / 5) * 38})`}
                  >
                    <circle r="11" />
                    <text y="5">−</text>
                  </g>
                ),
              )}
              {Array.from(
                { length: Math.min(result.packets, 12) },
                (_, index) => (
                  <g
                    className="positive"
                    key={index}
                    transform={`translate(${690 + (index % 4) * 34} ${95 + Math.floor(index / 4) * 35})`}
                  >
                    <circle r="10" />
                    <text y="5">+</text>
                  </g>
                ),
              )}
              {[0, 1, 2, 3, 4].map((line) => (
                <path
                  key={line}
                  className="field"
                  d={`M330 ${145 + line * 32} Q470 ${95 + line * 54} 610 ${170 + line * 25}`}
                  markerEnd="url(#field-arrow)"
                />
              ))}
              <g className="leaves" transform="translate(500 350)">
                <line y1="-85" y2="0" />
                <line
                  y1="0"
                  x2={-Math.sin((leafAngle * Math.PI) / 180) * 75}
                  y2={Math.cos((leafAngle * Math.PI) / 180) * 75}
                />
                <line
                  y1="0"
                  x2={Math.sin((leafAngle * Math.PI) / 180) * 75}
                  y2={Math.cos((leafAngle * Math.PI) / 180) * 75}
                />
              </g>
              {result.lightning && (
                <path
                  className="lightning"
                  d="M775 160l-38 72 29-8-45 84 22-10-38 90"
                />
              )}
              {input.grounded && (
                <g className="ground" transform="translate(850 470)">
                  <path d="M0-70V0M-28 0H28M-19 10H19M-10 20H10" />
                  <text x="-35" y="43">
                    GROUND
                  </text>
                </g>
              )}
              <text className="force-label" x="390" y="72">
                {result.interaction.toUpperCase()} · F ={" "}
                {result.force.toExponential(2)} N
              </text>
            </svg>
            <div className="transfer-strip">
              <b>
                e⁻ transfer: {pair.positive} → {pair.negative}
              </b>
              <span>
                {result.packets} visible packets represent{" "}
                {result.transferredElectrons.toExponential(2)} electrons
              </span>
              <strong>q₋ + q₊ = {result.totalCharge.toExponential(1)} C</strong>
            </div>
          </div>
          <div className="static-meters">
            <Reading
              label="Net charge on each"
              value={`±${Math.abs(result.negativeCharge * 1e6).toFixed(2)} µC`}
            />
            <Reading
              label="Electric field"
              value={`${(result.electricField / 1e6).toFixed(2)} MV/m`}
            />
            <Reading
              label="Electroscope leaf angle"
              value={`${leafAngle.toFixed(1)}°`}
            />
            <Reading
              label="Air breakdown"
              value={`${(AIR_BREAKDOWN_FIELD / 1e6).toFixed(1)} MV/m`}
            />
          </div>
        </main>
        <aside
          className="static-analysis"
          aria-label="Charge and field analysis"
        >
          <h3>Live state</h3>
          <div className={result.lightning ? "danger" : "safe"}>
            <strong>
              {result.lightning
                ? "⚡ LIGHTNING DISCHARGE"
                : input.grounded
                  ? "GROUND PATH ACTIVE"
                  : "BELOW BREAKDOWN"}
            </strong>
            <span>
              {result.lightning ? "E ≥ 3.0 MV/m" : "Air remains insulating"}
            </span>
          </div>
          <Reading
            label={`${pair.negative} charge`}
            value={`${(result.negativeCharge * 1e6).toFixed(2)} µC`}
          />
          <Reading
            label={`${pair.positive} charge`}
            value={`${(result.positiveCharge * 1e6).toFixed(2)} µC`}
          />
          <Reading
            label="Total charge"
            value={`${result.totalCharge.toExponential(1)} C`}
          />
          <Reading label="Force direction" value={result.interaction} />
          <Reading
            label="Force magnitude"
            value={`${result.force.toExponential(2)} N`}
          />
          <section>
            <h4>Field & force</h4>
            <p>E = k|q|/r²</p>
            <p>F = k|q₁q₂|/r²</p>
            <small>
              Unlike signs attract; like signs repel. Arrow direction follows
              the sign product.
            </small>
          </section>
          <section>
            <h4>Induction state</h4>
            <p>
              {
                [
                  "Not started",
                  "Polarized, net neutral",
                  "Grounded: electrons flow",
                  "Ground removed: charge trapped",
                  "Charged and rod withdrawn",
                ][inductionStage]
              }
            </p>
            <small>
              Electroscope net charge: {(electroscopeCharge * 1e6).toFixed(2)}{" "}
              µC
            </small>
          </section>
        </aside>
      </div>
      <section className="static-mission">
        <div>
          <span>MINI-MISSION</span>
          <h3>Charge the electroscope by induction—never touch it</h3>
          <p>Order matters: remove the ground before the charged rod.</p>
        </div>
        <button onClick={startMission}>Start mission</button>
        <button onClick={approach}>1 · Bring near</button>
        <button onClick={ground}>2 · Ground</button>
        <button onClick={unground}>3 · Disconnect ground</button>
        <button onClick={withdraw}>4 · Withdraw rod</button>
        <button onClick={checkMission}>Check induction</button>
        {feedback && (
          <p
            className={feedback.startsWith("✓") ? "success" : ""}
            aria-live="polite"
          >
            {feedback}
          </p>
        )}
      </section>
      <footer className="static-footer">
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
        <span>Charge conserved · protons fixed</span>
      </footer>
      <p className="sr-only" aria-live="polite">
        {result.packets} electron packets transferred from {pair.positive} to{" "}
        {pair.negative}. Total charge {result.totalCharge} coulombs. Force is{" "}
        {result.interaction}. Electric field{" "}
        {(result.electricField / 1e6).toFixed(2)} megavolts per metre.
      </p>
    </section>
  );
}
function Control({
  label,
  value,
  min,
  max,
  step,
  unit,
  digits = 0,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  digits?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="static-control">
      <span>
        <b>{label}</b>
        <strong>
          {value.toFixed(digits)} {unit}
        </strong>
      </span>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <small>
        {min} — {max} {unit}
      </small>
    </label>
  );
}
function Reading({ label, value }: { label: string; value: string }) {
  return (
    <div className="static-reading">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
