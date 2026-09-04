import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  RETINA_DISTANCE_M,
  correctionForMyopicFarPoint,
  farPointM,
  nearPointM,
  solveEye,
  type EyeDefect,
} from "./human-eye-defectsSimulation";
import "./human-eye-defects.css";

const BASE_POWER = 1 / RETINA_DISTANCE_M;
const defectCopy: Record<EyeDefect, [string, string]> = {
  normal: ["Normal vision", "Focus reaches the retina"],
  myopia: ["Myopia", "Uncorrected distant focus is before retina"],
  hyperopia: ["Hyperopia", "Uncorrected focus tends behind retina"],
  presbyopia: ["Presbyopia", "Reduced accommodation moves the near point away"],
};

export function HumanEyeDefectsLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [defect, setDefect] = useState<EyeDefect>("normal"),
    [objectDistance, setObjectDistance] = useState(2),
    [eyePower, setEyePower] = useState(BASE_POWER),
    [accommodation, setAccommodation] = useState(0.5),
    [correction, setCorrection] = useState(0),
    [phase, setPhase] = useState(1),
    [running, setRunning] = useState(false),
    [playback, setPlayback] = useState(1),
    [reduced, setReduced] = useState(false),
    [selectedAnswer, setSelectedAnswer] = useState<number | null>(null),
    [feedback, setFeedback] = useState("");
  const maxAccommodation = defect === "presbyopia" ? 2 : 4;
  const appliedCorrection = correction * phase;
  const result = useMemo(
    () =>
      solveEye({
        objectDistanceM: objectDistance,
        eyePowerD: eyePower,
        correctionPowerD: appliedCorrection,
        accommodationD: accommodation,
      }),
    [accommodation, appliedCorrection, eyePower, objectDistance],
  );
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setPhase((p) => {
          const next = Math.min(1, p + (reduced ? 0.1 : 0.025) * playback);
          if (next >= 1) setRunning(false);
          return next;
        }),
      reduced ? 180 : 35,
    );
    return () => clearInterval(id);
  }, [playback, reduced, running]);

  const chooseDefect = (next: EyeDefect) => {
    setDefect(next);
    setPhase(1);
    setCorrection(0);
    setFeedback("");
    if (next === "normal") {
      setObjectDistance(2);
      setEyePower(BASE_POWER);
      setAccommodation(0.5);
    } else if (next === "myopia") {
      setObjectDistance(10);
      setEyePower(BASE_POWER + 1.25);
      setAccommodation(0);
    } else if (next === "hyperopia") {
      setObjectDistance(2);
      setEyePower(BASE_POWER - 2);
      setAccommodation(0);
    } else {
      setObjectDistance(0.25);
      setEyePower(BASE_POWER);
      setAccommodation(2);
    }
  };
  const reset = () => {
    setDefect("normal");
    setObjectDistance(2);
    setEyePower(BASE_POWER);
    setAccommodation(0.5);
    setCorrection(0);
    setPhase(1);
    setRunning(false);
    setPlayback(1);
    setReduced(false);
    setSelectedAnswer(null);
    setFeedback("");
  };
  const relaxedFar = farPointM(eyePower);
  const near = nearPointM(eyePower, maxAccommodation);
  const lensKind =
    correction < -0.05 ? "concave" : correction > 0.05 ? "convex" : "none";
  const focusTone = result.onRetina
    ? "good"
    : result.focusErrorM < 0
      ? "before"
      : "behind";

  return (
    <section
      className="eye-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="eye-head" data-ui-theme="dark">
        <div>
          <span>VISION & CORRECTION LAB</span>
          <h2>Bring the focus onto the retina.</h2>
          <p>
            Compare eye power, accommodation, and signed corrective-lens power.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="eye-layout">
        <aside className="eye-controls">
          <h3>1. Eye model</h3>
          <div className="eye-defects" role="group" aria-label="Eye defect">
            {(Object.keys(defectCopy) as EyeDefect[]).map((id) => (
              <button
                key={id}
                className={defect === id ? "active" : ""}
                aria-pressed={defect === id}
                onClick={() => chooseDefect(id)}
              >
                <b>{defectCopy[id][0]}</b>
                <small>{defectCopy[id][1]}</small>
              </button>
            ))}
          </div>
          <h3>2. Object & eye</h3>
          <Range
            label="Object distance"
            value={objectDistance}
            min={0.25}
            max={10}
            step={0.05}
            unit=" m"
            onChange={setObjectDistance}
          />
          <Range
            label="Relaxed eye power"
            value={eyePower}
            min={52}
            max={66}
            step={0.1}
            unit=" D"
            onChange={setEyePower}
          />
          <Range
            label="Accommodation"
            value={Math.min(accommodation, maxAccommodation)}
            min={0}
            max={maxAccommodation}
            step={0.1}
            unit=" D"
            onChange={setAccommodation}
          />
          <div className="eye-presets">
            <button onClick={() => chooseDefect("normal")}>Minimums</button>
            <button onClick={() => chooseDefect("myopia")}>Typical</button>
            <button
              onClick={() => {
                setDefect("presbyopia");
                setObjectDistance(0.25);
                setEyePower(66);
                setAccommodation(2);
                setCorrection(8);
                setPhase(1);
              }}
            >
              Maximums
            </button>
          </div>
        </aside>

        <main className="eye-main">
          <div className="eye-legend">
            <span>— incoming</span>
            <span>— eye focus</span>
            <span>— after correction</span>
            <strong className={focusTone}>Focus {result.focusPosition}</strong>
          </div>
          <EyeStage
            result={result}
            phase={phase}
            correction={correction}
            objectDistance={objectDistance}
            lensKind={lensKind}
          />
          <div className="eye-transport">
            <button onClick={() => setPhase((p) => Math.max(0, p - 0.1))}>
              ◁ Step back
            </button>
            <button onClick={() => setPhase((p) => Math.min(1, p + 0.1))}>
              ▷ Step
            </button>
            <button onClick={() => setRunning(true)}>▶ Play</button>
            <button onClick={() => setRunning(false)}>Ⅱ Pause</button>
            <button
              onClick={() => {
                setPhase(0);
                setRunning(false);
              }}
            >
              ↺ Replay
            </button>
            <label>
              Speed{" "}
              <select
                aria-label="Playback speed"
                value={playback}
                onChange={(e) => setPlayback(+e.target.value)}
              >
                {[0.25, 0.5, 1, 2].map((v) => (
                  <option value={v} key={v}>
                    {v}×
                  </option>
                ))}
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                checked={reduced}
                onChange={(e) => setReduced(e.target.checked)}
              />{" "}
              Reduced motion
            </label>
          </div>
          <p className="eye-caption" role="status">
            {result.onRetina
              ? "Clear retinal focus: the combined power matches this object distance."
              : `Blur: focus is ${Math.abs(result.focusErrorM * 1000).toFixed(2)} mm ${result.focusErrorM < 0 ? "before" : "behind"} the retina.`}
          </p>
        </main>

        <aside className="eye-correction">
          <h3>3. Corrective lens</h3>
          <div
            className="eye-lenses"
            role="group"
            aria-label="Corrective lens type"
          >
            <button
              className={lensKind === "none" ? "active" : ""}
              onClick={() => setCorrection(0)}
            >
              ⊘<small>None</small>
            </button>
            <button
              className={lensKind === "concave" ? "active" : ""}
              onClick={() =>
                setCorrection(-Math.max(1.25, Math.abs(correction)))
              }
            >
              )(<small>Concave</small>
            </button>
            <button
              className={lensKind === "convex" ? "active" : ""}
              onClick={() =>
                setCorrection(Math.max(1.25, Math.abs(correction)))
              }
            >
              ()<small>Convex</small>
            </button>
          </div>
          <Range
            label="Corrective-lens power"
            value={correction}
            min={-8}
            max={8}
            step={0.25}
            unit=" D"
            onChange={(v) => {
              setCorrection(v);
              setPhase(1);
            }}
          />
          <button
            className="eye-auto"
            onClick={() => {
              setCorrection(Math.round(result.neededCorrectionD * 4) / 4);
              setPhase(0);
            }}
          >
            Suggest nearest 0.25 D
          </button>
          <h3>Live measurements</h3>
          <dl>
            <dt>Object distance</dt>
            <dd>{objectDistance.toFixed(2)} m</dd>
            <dt>Applied correction</dt>
            <dd>{appliedCorrection.toFixed(2)} D</dd>
            <dt>Image distance</dt>
            <dd>
              {Number.isFinite(result.imageDistanceM)
                ? `${(result.imageDistanceM * 1000).toFixed(2)} mm`
                : "∞"}
            </dd>
            <dt>Retina distance</dt>
            <dd>17.00 mm</dd>
            <dt>Far point</dt>
            <dd>
              {Number.isFinite(relaxedFar)
                ? `${relaxedFar.toFixed(2)} m`
                : "Infinity"}
            </dd>
            <dt>Near point</dt>
            <dd>
              {Number.isFinite(near)
                ? `${(near * 100).toFixed(1)} cm`
                : "Infinity"}
            </dd>
            <dt>Needed correction</dt>
            <dd>{result.neededCorrectionD.toFixed(2)} D</dd>
          </dl>
          <div className="eye-equation">
            1/f = 1/u + 1/v
            <br />P = 1/f
          </div>
        </aside>
      </div>

      <div className="eye-lower">
        <section>
          <h3>Near / far point logic</h3>
          <p>
            <b>Myopia:</b> finite far point; a negative lens creates a virtual
            image there.
          </p>
          <p>
            <b>Hyperopia:</b> extra positive power helps near and sometimes
            distant focus.
          </p>
          <p>
            <b>Presbyopia:</b> the accommodation range shrinks, so the near
            point moves farther away.
          </p>
        </section>
        <section className="eye-mission">
          <span>CHALLENGE</span>
          <h3>Correct a myopic far point</h3>
          <p>
            A myopic eye has a far point of 0.80 m. What lens power lets it see
            a distant object?
          </p>
          <div>
            {[-2.5, -1.25, -0.75, 1.25].map((answer) => (
              <button
                key={answer}
                className={selectedAnswer === answer ? "active" : ""}
                onClick={() => {
                  setSelectedAnswer(answer);
                  setDefect("myopia");
                  setObjectDistance(10);
                  setEyePower(BASE_POWER + 1.25);
                  setAccommodation(0);
                  setCorrection(answer);
                  setPhase(1);
                }}
              >
                {answer > 0 ? "+" : ""}
                {answer.toFixed(2)} D
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setFeedback(
                selectedAnswer === correctionForMyopicFarPoint(0.8)
                  ? "✓ Correct: P=−1/far point=−1.25 D; a concave lens diverges the incoming rays."
                  : "Try again: myopia requires negative power, and |P|=1/0.80 m.",
              )
            }
          >
            Check answer
          </button>
          {feedback && (
            <p
              className={feedback.startsWith("✓") ? "success" : "hint"}
              role="status"
            >
              {feedback}
            </p>
          )}
        </section>
      </div>
    </section>
  );
}

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
  onChange: (v: number) => void;
}) {
  return (
    <label className="eye-range">
      {label}
      <output>
        {value.toFixed(step < 0.1 ? 2 : 1)}
        {unit}
      </output>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <small>
        <span>{min}</span>
        <span>{max}</span>
      </small>
    </label>
  );
}

function EyeStage({
  result,
  phase,
  correction,
  objectDistance,
  lensKind,
}: {
  result: ReturnType<typeof solveEye>;
  phase: number;
  correction: number;
  objectDistance: number;
  lensKind: string;
}) {
  const lensX = 395,
    retinaX = 790,
    centerY = 240;
  const focusX = Math.max(
    540,
    Math.min(
      900,
      lensX + (result.imageDistanceM / RETINA_DISTANCE_M) * (retinaX - lensX),
    ),
  );
  const upperAtLens = 190,
    lowerAtLens = 290;
  const rayY = (fromY: number, x: number) =>
    fromY + ((centerY - fromY) * (x - lensX)) / (focusX - lensX);
  const correctiveX = 185 + phase * 65;
  const corrShift = correction * phase * 3.2;
  return (
    <div
      className="eye-stage"
      style={{ "--lens-progress": phase } as CSSProperties}
    >
      <img
        src="/assets/experiments/human-eye-defects/eye-cutaway-2d.png"
        alt="Anatomical side cutaway of the cornea, iris, crystalline lens, retina, and optic nerve"
      />
      <svg
        viewBox="0 0 900 480"
        role="img"
        aria-label={`Eye rays focus ${result.focusPosition}; corrective lens ${lensKind}; object distance ${objectDistance.toFixed(2)} metres`}
      >
        <line x1="25" y1="180" x2={correctiveX} y2="180" className="incoming" />
        <line x1="25" y1="300" x2={correctiveX} y2="300" className="incoming" />
        {lensKind !== "none" && (
          <g className="corrective" transform={`translate(${correctiveX} 240)`}>
            {lensKind === "concave" ? (
              <path d="M-11-65 Q7 0-11 65 M11-65 Q-7 0 11 65" />
            ) : (
              <path d="M0-68 Q27 0 0 68 M0-68 Q-27 0 0 68" />
            )}
          </g>
        )}
        <polyline
          points={`${correctiveX},180 ${lensX},${upperAtLens - corrShift} ${focusX},${centerY}`}
          className="corrected"
        />
        <polyline
          points={`${correctiveX},300 ${lensX},${lowerAtLens + corrShift} ${focusX},${centerY}`}
          className="corrected"
        />
        <line
          x1={lensX}
          y1={upperAtLens - corrShift}
          x2={retinaX}
          y2={rayY(upperAtLens - corrShift, retinaX)}
          className="focused"
        />
        <line
          x1={lensX}
          y1={lowerAtLens + corrShift}
          x2={retinaX}
          y2={rayY(lowerAtLens + corrShift, retinaX)}
          className="focused"
        />
        <line x1={retinaX} y1="112" x2={retinaX} y2="368" className="retina" />
        <circle
          cx={focusX}
          cy={centerY}
          r="8"
          className={result.onRetina ? "focus good" : "focus"}
        />
        <text x={Math.min(focusX + 10, 830)} y={centerY - 12}>
          focus
        </text>
        <text x="747" y="104">
          retina
        </text>
        <text x="32" y="165">
          object rays
        </text>
      </svg>
    </div>
  );
}
