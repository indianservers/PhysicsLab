import { useEffect, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  solveOpticalInstrument,
  type FocusMode,
  type InstrumentMode,
} from "./opticalInstrumentsSimulation";
import "./optical-instruments.css";

const Range = ({
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
}) => (
  <label className="oi-range">
    <span>
      <b>{label}</b>
      <output>
        {value.toFixed(step < 1 ? 1 : 0)} {unit}
      </output>
    </span>
    <input
      type="range"
      aria-label={label}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </label>
);

export function OpticalInstrumentsLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [mode, setMode] = useState<InstrumentMode>("microscope");
  const [focusMode, setFocusMode] = useState<FocusMode>("normal");
  const [fo, setFo] = useState(10),
    [fe, setFe] = useState(25),
    [tube, setTube] = useState(160),
    [focus, setFocus] = useState(0),
    [aperture, setAperture] = useState(8);
  const [phase, setPhase] = useState(1),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(false),
    [feedback, setFeedback] = useState("");
  const result = solveOpticalInstrument({
    mode,
    focusMode,
    objectiveFocalMm: fo,
    eyepieceFocalMm: fe,
    tubeLengthMm: tube,
    focusOffsetMm: focus,
    apertureMm: aperture,
  });
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setPhase((p) => {
          const n = Math.min(1, p + (reduced ? 0.12 : 0.025) * speed);
          if (n >= 1) setRunning(false);
          return n;
        }),
      reduced ? 160 : 35,
    );
    return () => clearInterval(id);
  }, [running, speed, reduced]);
  const chooseMode = (next: InstrumentMode) => {
    setMode(next);
    setFocusMode("normal");
    setFeedback("");
    setFocus(0);
    setPhase(1);
    if (next === "microscope") {
      setFo(10);
      setFe(25);
      setTube(160);
      setAperture(8);
    } else {
      setFo(500);
      setFe(25);
      setTube(525);
      setAperture(50);
    }
  };
  const reset = () => chooseMode(mode);
  const target = () => {
    setFocusMode("normal");
    setFocus(0);
    if (mode === "microscope") {
      setFo(10);
      setFe(25);
      setTube(160);
      setAperture(10);
    } else {
      setFo(500);
      setFe(20);
      setTube(520);
    }
    setFeedback("");
  };
  const check = () => {
    const pass =
      result.focusScore >= 95 &&
      Math.abs(result.magnification) >= (mode === "microscope" ? 100 : 20);
    setFeedback(
      pass
        ? `Mission complete — sharp ${Math.abs(result.magnification).toFixed(1)}× inverted image.`
        : `Keep tuning: focus ≥ 95% and |M| ≥ ${mode === "microscope" ? 100 : 20}×.`,
    );
  };
  const opacity1 = phase > 0.08 ? 1 : 0.15,
    opacity2 = phase > 0.36 ? 1 : 0.12,
    opacity3 = phase > 0.68 ? 1 : 0.1;
  const micro = mode === "microscope";
  return (
    <section
      className="oi-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="oi-hero">
        <div>
          <span className="oi-kicker">OPTICAL INSTRUMENT STUDIO · 2D</span>
          <h1>{experiment.title}</h1>
          <p>
            Follow light through the objective, intermediate image and eyepiece.
            Every reading comes from the same thin-lens model.
          </p>
        </div>
        <div className="oi-live">
          <i /> LIVE RAY TRACE
        </div>
      </header>
      <nav className="oi-tabs" aria-label="Instrument mode">
        <button
          className={micro ? "active" : ""}
          onClick={() => chooseMode("microscope")}
        >
          🔬 Compound microscope
        </button>
        <button
          className={!micro ? "active" : ""}
          onClick={() => chooseMode("telescope")}
        >
          🔭 Astronomical telescope
        </button>
      </nav>
      <div className="oi-grid">
        <aside className="oi-controls oi-card">
          <h2>Instrument controls</h2>
          <p className="oi-muted">Tune the glass, spacing and focus.</p>
          <div className="oi-segment">
            <button
              className={focusMode === "normal" ? "active" : ""}
              onClick={() => setFocusMode("normal")}
            >
              Normal adjustment
            </button>
            <button
              className={focusMode === "near-point" ? "active" : ""}
              onClick={() => setFocusMode("near-point")}
            >
              Near point
            </button>
          </div>
          <Range
            label="Objective focal length fₒ"
            value={fo}
            min={micro ? 5 : 200}
            max={micro ? 25 : 800}
            step={micro ? 1 : 10}
            unit="mm"
            onChange={setFo}
          />
          <Range
            label="Eyepiece focal length fₑ"
            value={fe}
            min={10}
            max={50}
            step={1}
            unit="mm"
            onChange={setFe}
          />
          <Range
            label="Tube length L"
            value={tube}
            min={micro ? 90 : 220}
            max={micro ? 240 : 850}
            step={micro ? 1 : 5}
            unit="mm"
            onChange={setTube}
          />
          <Range
            label="Fine focus"
            value={focus}
            min={-8}
            max={8}
            step={0.5}
            unit="mm"
            onChange={setFocus}
          />
          {micro && (
            <Range
              label="Objective aperture"
              value={aperture}
              min={2}
              max={16}
              step={1}
              unit="mm"
              onChange={setAperture}
            />
          )}
          <label className="oi-check">
            <input
              type="checkbox"
              checked={reduced}
              onChange={(e) => setReduced(e.target.checked)}
            />{" "}
            Reduced motion
          </label>
          <div className="oi-actions">
            <button onClick={target}>Target setup</button>
            <button onClick={reset}>Reset</button>
          </div>
        </aside>
        <main className="oi-stage oi-card">
          <div className="oi-stage-head">
            <div>
              <span>{micro ? "SPECIMEN BENCH" : "DISTANT OBJECT"}</span>
              <h2>{micro ? "Two-stage magnification" : "Afocal ray path"}</h2>
            </div>
            <div
              className={`oi-focus ${result.focusScore >= 95 ? "sharp" : ""}`}
            >
              {result.focusScore.toFixed(0)}% focus
            </div>
          </div>
          <div
            className="oi-optics"
            role="img"
            aria-label={`${mode} ray diagram showing an inverted final image`}
          >
            <img
              src="/assets/experiments/optical-instruments/optical-instruments-rail.png"
              alt="Transparent optical rail with two lenses and an eye"
            />
            <svg viewBox="0 0 900 410" aria-hidden="true">
              <defs>
                <marker
                  id="oi-arrow"
                  markerWidth="7"
                  markerHeight="7"
                  refX="6"
                  refY="3.5"
                  orient="auto"
                >
                  <path d="M0 0L7 3.5L0 7z" fill="#ff7a36" />
                </marker>
              </defs>
              <line className="axis" x1="35" y1="218" x2="865" y2="218" />
              {micro ? (
                <>
                  <g opacity={opacity1}>
                    <line
                      className="ray amber"
                      x1="92"
                      y1="118"
                      x2="318"
                      y2="118"
                    />
                    <line
                      className="ray amber"
                      x1="92"
                      y1="118"
                      x2="318"
                      y2="218"
                    />
                  </g>
                  <g opacity={opacity2}>
                    <line
                      className="ray cyan"
                      x1="318"
                      y1="118"
                      x2="568"
                      y2="285"
                    />
                    <line
                      className="ray cyan"
                      x1="318"
                      y1="218"
                      x2="568"
                      y2="285"
                    />
                    <line
                      className="image-arrow"
                      x1="568"
                      y1="218"
                      x2="568"
                      y2="285"
                      markerEnd="url(#oi-arrow)"
                    />
                  </g>
                  <g opacity={opacity3}>
                    <line
                      className="ray violet"
                      x1="568"
                      y1="285"
                      x2="712"
                      y2="260"
                    />
                    <line
                      className="ray violet"
                      x1="568"
                      y1="285"
                      x2="712"
                      y2="218"
                    />
                    <line
                      className="ray violet"
                      x1="712"
                      y1="260"
                      x2="854"
                      y2="235"
                    />
                    <line
                      className="ray violet"
                      x1="712"
                      y1="218"
                      x2="854"
                      y2="218"
                    />
                  </g>
                </>
              ) : (
                <>
                  <g opacity={opacity1}>
                    <line
                      className="ray amber"
                      x1="32"
                      y1="145"
                      x2="318"
                      y2="145"
                    />
                    <line
                      className="ray amber"
                      x1="32"
                      y1="218"
                      x2="318"
                      y2="218"
                    />
                    <line
                      className="ray amber"
                      x1="32"
                      y1="291"
                      x2="318"
                      y2="291"
                    />
                  </g>
                  <g opacity={opacity2}>
                    <line
                      className="ray cyan"
                      x1="318"
                      y1="145"
                      x2="568"
                      y2="218"
                    />
                    <line
                      className="ray cyan"
                      x1="318"
                      y1="291"
                      x2="568"
                      y2="218"
                    />
                    <line
                      className="image-arrow"
                      x1="568"
                      y1="218"
                      x2="568"
                      y2="276"
                      markerEnd="url(#oi-arrow)"
                    />
                  </g>
                  <g opacity={opacity3}>
                    <line
                      className="ray violet"
                      x1="568"
                      y1="218"
                      x2="712"
                      y2="176"
                    />
                    <line
                      className="ray violet"
                      x1="568"
                      y1="218"
                      x2="712"
                      y2="218"
                    />
                    <line
                      className="ray violet"
                      x1="712"
                      y1="176"
                      x2="854"
                      y2="135"
                    />
                    <line
                      className="ray violet"
                      x1="712"
                      y1="218"
                      x2="854"
                      y2="218"
                    />
                  </g>
                </>
              )}
              <text x="305" y="387">
                OBJECTIVE
              </text>
              <text x="674" y="387">
                EYEPIECE
              </text>
              <text x="520" y="318">
                INTERMEDIATE IMAGE
              </text>
            </svg>
            <div className="oi-callout">
              <b>{result.finalImage}</b>
              <span>final virtual image · {result.orientation}</span>
            </div>
          </div>
          <div className="oi-transport">
            <button
              aria-label="Replay"
              onClick={() => {
                setPhase(0);
                setRunning(true);
              }}
            >
              ↺
            </button>
            <button
              className="primary"
              onClick={() => {
                if (phase >= 1) setPhase(0);
                setRunning(!running);
              }}
            >
              {running ? "Pause" : "Play rays"}
            </button>
            <button
              onClick={() => {
                setRunning(false);
                setPhase(Math.min(1, phase + 1 / 3));
              }}
            >
              Step
            </button>
            <label>
              Speed{" "}
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              >
                <option value={0.5}>0.5×</option>
                <option value={1}>1×</option>
                <option value={2}>2×</option>
              </select>
            </label>
            <progress value={phase} max={1} />
          </div>
        </main>
        <aside className="oi-readings">
          <section className="oi-card">
            <span className="oi-label">TOTAL MAGNIFICATION</span>
            <strong className="oi-big">
              {result.magnification.toFixed(1)}×
            </strong>
            <p>
              {result.orientation} image · {result.finalImage}
            </p>
            <div className="oi-meter">
              <i style={{ width: `${result.focusScore}%` }} />
            </div>
          </section>
          <section className="oi-card oi-data">
            <h2>Live readings</h2>
            {micro ? (
              <>
                <div>
                  <span>Specimen distance</span>
                  <b>{result.specimenDistanceMm.toFixed(2)} mm</b>
                </div>
                <div>
                  <span>Intermediate image</span>
                  <b>{result.intermediateDistanceMm.toFixed(1)} mm</b>
                </div>
                <div>
                  <span>Objective mₒ</span>
                  <b>{result.objectiveMagnification.toFixed(2)}×</b>
                </div>
                <div>
                  <span>Eyepiece Mₑ</span>
                  <b>{result.eyepieceMagnification.toFixed(2)}×</b>
                </div>
                <div>
                  <span>Resolution (550 nm)</span>
                  <b>{result.resolutionUm.toFixed(2)} μm</b>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span>Target tube length</span>
                  <b>{result.targetTubeLengthMm.toFixed(1)} mm</b>
                </div>
                <div>
                  <span>Focus error</span>
                  <b>{result.focusErrorMm.toFixed(1)} mm</b>
                </div>
                <div>
                  <span>Angular magnification</span>
                  <b>{result.magnification.toFixed(2)}×</b>
                </div>
              </>
            )}
          </section>
          <section className="oi-card oi-mission">
            <span className="oi-label">FOCUS CHALLENGE</span>
            <h2>Sharp, powerful view</h2>
            <p>
              Reach at least {micro ? "100×" : "20×"} magnification with 95%
              focus.
            </p>
            <button onClick={check}>Check instrument</button>
            {feedback && (
              <p
                className={feedback.startsWith("Mission") ? "success" : "hint"}
                role="status"
              >
                {feedback}
              </p>
            )}
          </section>
        </aside>
      </div>
      <footer className="oi-equation">
        <div>
          <span>MICROSCOPE</span>
          <b>M = mₒMₑ</b>
          <small>mₒ = −vₒ/uₒ · Mₑ = D/fₑ (normal)</small>
        </div>
        <div>
          <span>TELESCOPE</span>
          <b>M = −fₒ/fₑ</b>
          <small>Normal adjustment: L = fₒ + fₑ</small>
        </div>
        <p>
          The minus sign records the physically inverted final image. D = 250
          mm.
        </p>
      </footer>
    </section>
  );
}
