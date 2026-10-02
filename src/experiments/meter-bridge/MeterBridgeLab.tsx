import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  DEFAULT_METER_BRIDGE_INPUT,
  normalizeMeterBridgeInput,
  solveMeterBridge,
  type MeterBridgeInput,
} from "./meterBridgePhysics";
import "./meter-bridge.css";

const ROOT = "/assets/experiments/meter-bridge";
type RunState = "idle" | "running" | "paused" | "result";

export function MeterBridgeLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(DEFAULT_METER_BRIDGE_INPUT);
  const [runState, setRunState] = useState<RunState>("idle");
  const [scanStep, setScanStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(
    () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  const [mission, setMission] = useState(false);
  const [guess, setGuess] = useState(20);
  const [feedback, setFeedback] = useState("");
  const result = useMemo(() => solveMeterBridge(input), [input]);
  const atNull = Math.abs(result.galvanometerMicroamps) < 0.02;
  const withinMissionNull = Math.abs(result.galvanometerMicroamps) < 0.5;

  const update = <K extends keyof MeterBridgeInput>(
    key: K,
    value: MeterBridgeInput[K],
  ) => {
    setInput((current) =>
      normalizeMeterBridgeInput({ ...current, [key]: value }),
    );
    setFeedback("");
  };

  useEffect(() => {
    if (runState !== "running") return;
    const delay = (reducedMotion ? 1400 : 800) / speed;
    const timer = window.setTimeout(() => {
      setScanStep((current) => {
        const next = current + 1;
        const target = solveMeterBridge(input).balancePositionCm;
        if (next === 1)
          update("jockeyPositionCm", target > input.wireLengthCm / 2 ? 75 : 25);
        if (next === 2)
          update("jockeyPositionCm", (input.jockeyPositionCm + target) / 2);
        if (next === 3)
          update("jockeyPositionCm", Math.round(target * 10) / 10);
        if (next >= 4) {
          update("jockeyPositionCm", target);
          setRunState("result");
          return 4;
        }
        return next;
      });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [runState, scanStep, speed, reducedMotion]);

  const reset = () => {
    setInput(DEFAULT_METER_BRIDGE_INPUT);
    setRunState("idle");
    setScanStep(0);
    setMission(false);
    setGuess(20);
    setFeedback("");
  };
  const play = () => {
    if (runState === "result") setScanStep(0);
    setRunState("running");
  };
  const step = () => {
    const target = result.balancePositionCm;
    const next = scanStep >= 4 ? 0 : scanStep + 1;
    setScanStep(next);
    setRunState("paused");
    if (next === 1)
      update("jockeyPositionCm", target > input.wireLengthCm / 2 ? 75 : 25);
    else if (next === 2)
      update("jockeyPositionCm", (input.jockeyPositionCm + target) / 2);
    else if (next === 3)
      update("jockeyPositionCm", Math.round(target * 10) / 10);
    else if (next === 4) update("jockeyPositionCm", target);
  };

  const startMission = () => {
    const hidden = 23.4;
    setInput({
      ...DEFAULT_METER_BRIDGE_INPUT,
      unknownResistance: hidden,
      jockeyPositionCm: 35,
    });
    setMission(true);
    setGuess(20);
    setFeedback(
      "Hidden resistance set. Move the jockey to null, then calculate X.",
    );
    setScanStep(0);
    setRunState("idle");
  };
  const checkMission = () => {
    const guessOk = Math.abs(guess - input.unknownResistance) <= 0.1;
    setFeedback(
      withinMissionNull && guessOk
        ? `✓ Correct: experimental null (|Iᵍ| < 0.5 µA) at ${input.jockeyPositionCm.toFixed(2)} cm gives X = ${input.unknownResistance.toFixed(1)} Ω.`
        : !withinMissionNull
          ? `Move ${Math.abs(result.nullErrorCm).toFixed(2)} cm ${result.nullErrorCm < 0 ? "right" : "left"}; the galvanometer is not at zero.`
          : `The bridge is null. Recheck X = R × l/(L − l); your result differs by ${Math.abs(guess - input.unknownResistance).toFixed(1)} Ω.`,
    );
  };

  const needle = Math.max(
    -48,
    Math.min(48, result.galvanometerMicroamps * 0.8),
  );
  const jockeyPct = (input.jockeyPositionCm / input.wireLengthCm) * 100;
  const direction =
    result.nullErrorCm < -0.02
      ? "Move jockey right →"
      : result.nullErrorCm > 0.02
        ? "← Move jockey left"
        : "Null found · Iᵍ = 0";

  return (
    <section
      className="meter-lab"
      data-ui-theme="light"
      data-run-state={runState}
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="meter-head">
        <div>
          <span>ELECTRICITY · CLASS 12</span>
          <h2>Meter Bridge · Unknown Resistance</h2>
          <p>
            Slide the jockey, watch the signed deflection, and close in on null.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>

      <div className="meter-layout">
        <aside className="meter-controls" aria-label="Bridge controls">
          <h3>Set apparatus</h3>
          <Control
            label="Known resistance R"
            value={input.knownResistance}
            min={1}
            max={100}
            step={0.5}
            unit="Ω"
            onChange={(v) => update("knownResistance", v)}
          />
          <Control
            label="Unknown resistance X"
            value={input.unknownResistance}
            min={1}
            max={100}
            step={0.1}
            unit={mission ? "Ω · hidden" : "Ω"}
            hiddenValue={mission}
            disabled={mission}
            onChange={(v) => update("unknownResistance", v)}
          />
          <Control
            label="Bridge-wire length L"
            value={input.wireLengthCm}
            min={50}
            max={200}
            step={10}
            unit="cm"
            onChange={(v) => update("wireLengthCm", v)}
          />
          <Control
            label="Jockey position l"
            value={input.jockeyPositionCm}
            min={0.5}
            max={input.wireLengthCm - 0.5}
            step={0.1}
            unit="cm"
            onChange={(v) => update("jockeyPositionCm", v)}
          />
          <div className="meter-presets">
            <button
              onClick={() =>
                setInput(
                  normalizeMeterBridgeInput({
                    ...DEFAULT_METER_BRIDGE_INPUT,
                    knownResistance: 1,
                    unknownResistance: 1,
                    wireLengthCm: 50,
                    jockeyPositionCm: 0.5,
                  }),
                )
              }
            >
              Minimum setup
            </button>
            <button onClick={() => setInput(DEFAULT_METER_BRIDGE_INPUT)}>
              Typical setup
            </button>
            <button
              onClick={() =>
                setInput(
                  normalizeMeterBridgeInput({
                    ...DEFAULT_METER_BRIDGE_INPUT,
                    knownResistance: 100,
                    unknownResistance: 100,
                    wireLengthCm: 200,
                    jockeyPositionCm: 199.5,
                  }),
                )
              }
            >
              Maximum setup
            </button>
          </div>
          <p className="meter-guard">
            Endpoints are limited to 0.5 cm so neither wire segment has zero
            resistance.
          </p>
        </aside>

        <main className="meter-main">
          <div className="meter-toolbar">
            <div>
              <button onClick={play} disabled={runState === "running"}>
                ▶ {runState === "result" ? "Replay scan" : "Play scan"}
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
              {
                [
                  "Ready for coarse scan",
                  "Coarse scan",
                  "Direction cue",
                  "Fine approach",
                  "Null result",
                ][scanStep]
              }
            </strong>
          </div>

          <div className="meter-stage">
            <img
              src={`${ROOT}/apparatus.png`}
              alt="Meter bridge with one-metre wire, jockey, galvanometer, cell and resistance boxes"
            />
            <div className="meter-wire" aria-hidden="true">
              <span
                className="meter-segment left"
                style={{ width: `${jockeyPct}%` }}
              />
              <span
                className="meter-segment right"
                style={{ left: `${jockeyPct}%` }}
              />
              <span
                className={`meter-jockey ${atNull ? "null" : ""}`}
                style={{ left: `${jockeyPct}%` }}
              >
                <i />
                <b>{input.jockeyPositionCm.toFixed(1)} cm</b>
              </span>
            </div>
            <input
              className="meter-drag"
              aria-label="Drag jockey on bridge wire"
              type="range"
              min={0.5}
              max={input.wireLengthCm - 0.5}
              step={0.1}
              value={input.jockeyPositionCm}
              onChange={(e) =>
                update("jockeyPositionCm", Number(e.target.value))
              }
            />
            <div className="meter-direction" aria-live="polite">
              {direction}
            </div>
          </div>

          <div className="meter-equation">
            <span>At null</span>
            <strong>X / R = l / (L − l)</strong>
            <b>
              {result.resistanceRatio.toFixed(4)} {atNull ? "=" : "≠"}{" "}
              {result.lengthRatio.toFixed(4)}
            </b>
          </div>
        </main>

        <aside className="meter-readings" aria-label="Live measurements">
          <h3>Live measurements</h3>
          <Reading
            label="Galvanometer"
            value={`${result.galvanometerMicroamps >= 0 ? "+" : ""}${result.galvanometerMicroamps.toFixed(2)} µA`}
          />
          <div
            className="meter-gauge"
            aria-label={`Galvanometer needle ${result.galvanometerMicroamps.toFixed(2)} microamperes`}
          >
            <span>−</span>
            <b>0</b>
            <span>+</span>
            <i style={{ transform: `rotate(${needle}deg)` }} />
          </div>
          <Reading
            label="Left gap l"
            value={`${input.jockeyPositionCm.toFixed(1)} cm`}
          />
          <Reading
            label="Right gap L − l"
            value={`${(input.wireLengthCm - input.jockeyPositionCm).toFixed(1)} cm`}
          />
          <Reading
            label="Known R"
            value={`${input.knownResistance.toFixed(1)} Ω`}
          />
          <Reading
            label="Unknown X"
            value={
              mission ? "hidden" : `${input.unknownResistance.toFixed(1)} Ω`
            }
          />
          <Reading
            label="Top junction"
            value={`${result.resistorJunctionPotential.toFixed(4)} V`}
          />
          <Reading
            label="Wire contact"
            value={`${result.wireContactPotential.toFixed(4)} V`}
          />
          <Reading
            label="Circuit current"
            value={`${(result.sourceCurrent * 1000).toFixed(1)} mA`}
          />
          <div className={`meter-status ${atNull ? "null" : ""}`}>
            <span>Balance status</span>
            <strong>{atNull ? "AT NULL ✓" : "NOT AT NULL"}</strong>
          </div>
          <svg
            className="meter-graph"
            viewBox="0 0 260 120"
            role="img"
            aria-label="Signed galvanometer deflection versus jockey position"
          >
            <path d="M20 60 H248 M20 10 V108" />
            <path d={`M20 100 Q130 60 248 20`} className="curve" />
            <circle
              cx={20 + jockeyPct * 2.28}
              cy={
                60 -
                Math.max(-45, Math.min(45, result.galvanometerMicroamps * 0.75))
              }
              r="5"
            />
            <text x="24" y="16">
              Iᵍ (signed)
            </text>
            <text x="194" y="113">
              position l
            </text>
          </svg>
        </aside>
      </div>

      <section className="meter-mission">
        <div>
          <span>MINI-MISSION · HIDDEN RESISTANCE</span>
          <h3>Find null, then calculate X</h3>
          <p>
            Use only R, l and L. The unknown stays hidden until your answer is
            checked.
          </p>
        </div>
        {!mission ? (
          <button className="mission-start" onClick={startMission}>
            Start hidden challenge
          </button>
        ) : (
          <>
            <label>
              Calculated X{" "}
              <input
                aria-label="Calculated unknown resistance"
                type="number"
                min="1"
                max="100"
                step="0.1"
                value={guess}
                onChange={(e) => setGuess(Number(e.target.value))}
              />{" "}
              Ω
            </label>
            <button onClick={checkMission}>Check mission</button>
          </>
        )}
        {feedback && (
          <p
            className={feedback.startsWith("✓") ? "success" : ""}
            aria-live="polite"
          >
            {feedback}
          </p>
        )}
      </section>

      <footer className="meter-footer">
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
            onChange={(e) => setSpeed(Number(e.target.value))}
          >
            {[0.25, 0.5, 1, 1.5, 2].map((v) => (
              <option key={v} value={v}>
                {v}×
              </option>
            ))}
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(e) => setReducedMotion(e.target.checked)}
          />{" "}
          Reduced motion
        </label>
        <span>Finite galvanometer · SI node solver</span>
      </footer>
      <p className="sr-only" aria-live="polite">
        Jockey {input.jockeyPositionCm.toFixed(2)} centimetres. Galvanometer{" "}
        {result.galvanometerMicroamps.toFixed(2)} microamperes. {direction}.
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
  hiddenValue,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  hiddenValue?: boolean;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <label className="meter-control">
      <span>
        <b>{label}</b>
        <strong>
          {hiddenValue ? "•••" : value.toFixed(step < 1 ? 1 : 0)} {unit}
        </strong>
      </span>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <small>
        {min} — {max} {unit.replace(" · hidden", "")}
      </small>
    </label>
  );
}

function Reading({ label, value }: { label: string; value: string }) {
  return (
    <div className="meter-reading">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
