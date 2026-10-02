import {
  useEffect,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { solveEclipse, type EclipseMode } from "./shadows-eclipsesSimulation";
import "./shadows-eclipses.css";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const rad = (degrees: number) => (degrees * Math.PI) / 180;

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
  onChange: (value: number) => void;
}) {
  return (
    <label className="se-range">
      <span>
        <b>{label}</b>
        <output aria-label={`${label} ${value}`}>
          {value.toFixed(step < 0.1 ? 2 : 1)} {unit}
        </output>
      </span>
      <input
        aria-label={label}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        onKeyDown={(event) => {
          let next: number | undefined;
          if (event.key === "Home") next = min;
          if (event.key === "End") next = max;
          if (event.key === "ArrowLeft" || event.key === "ArrowDown")
            next = clamp(value - step, min, max);
          if (event.key === "ArrowRight" || event.key === "ArrowUp")
            next = clamp(value + step, min, max);
          if (next === undefined) return;
          event.preventDefault();
          onChange(next);
        }}
      />
    </label>
  );
}

const titleCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export function ShadowsEclipsesLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [mode, setMode] = useState<EclipseMode>("solar");
  const [sunScale, setSunScale] = useState(1);
  const [moonDistanceScale, setMoonDistanceScale] = useState(1);
  const [alignment, setAlignment] = useState(0.45);
  const [observerLatitude, setObserverLatitude] = useState(0);
  const [showRays, setShowRays] = useState(true);
  const [showUmbra, setShowUmbra] = useState(true);
  const [showPenumbra, setShowPenumbra] = useState(true);
  const [phase, setPhase] = useState(0.5);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [drag, setDrag] = useState<"moon" | "observer" | null>(null);
  const [prediction, setPrediction] = useState("");
  const [feedback, setFeedback] = useState("");

  const sweepOffset = Math.abs(phase * 2 - 1) * 0.72;
  const effectiveAlignment = alignment + sweepOffset;
  const result = solveEclipse({
    mode,
    sunRadiusScale: sunScale,
    moonDistanceScale,
    alignmentDeg: effectiveAlignment,
    observerLatitudeDeg: observerLatitude,
  });
  const controlledResult = solveEclipse({
    mode,
    sunRadiusScale: sunScale,
    moonDistanceScale,
    alignmentDeg: alignment,
    observerLatitudeDeg: observerLatitude,
  });
  const missionPass = mode === "solar" && result.eclipseType === "total";

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setPhase((current) => {
          const next = Math.min(
            1,
            current + (reducedMotion ? 0.11 : 0.018) * speed,
          );
          if (next >= 1) setRunning(false);
          return next;
        }),
      reducedMotion ? 180 : 35,
    );
    return () => window.clearInterval(id);
  }, [running, speed, reducedMotion]);

  const setPhysical = (setter: (value: number) => void, value: number) => {
    setter(value);
    setPhase(0.5);
    setRunning(false);
    setFeedback("");
  };
  const reset = () => {
    setMode("solar");
    setSunScale(1);
    setMoonDistanceScale(1);
    setAlignment(0.45);
    setObserverLatitude(0);
    setShowRays(true);
    setShowUmbra(true);
    setShowPenumbra(true);
    setPhase(0.5);
    setRunning(false);
    setSpeed(1);
    setReducedMotion(false);
    setDrag(null);
    setPrediction("");
    setFeedback("");
  };

  const stage =
    mode === "solar"
      ? { sourceX: 110, occX: 485, targetX: 760, occR: 20, targetR: 48 }
      : { sourceX: 110, occX: 455, targetX: 770, occR: 47, targetR: 21 };
  const sourceY = 240;
  const occY = mode === "solar" ? 240 + effectiveAlignment * 58 : 240;
  const targetY = mode === "solar" ? 240 : 240 + effectiveAlignment * 58;
  const signedCentralRadiusKm =
    mode === "solar"
      ? result.signedUmbraRadiusAtEarthKm
      : result.earthUmbraRadiusAtMoonKm;
  const centralRadiusPx = clamp(
    Math.abs(signedCentralRadiusKm) / (mode === "solar" ? 4 : 95),
    3,
    mode === "solar" ? 30 : 55,
  );
  const penumbraRadiusPx = clamp(
    (mode === "solar"
      ? result.penumbraRadiusAtEarthKm / 50
      : result.earthPenumbraRadiusAtMoonKm / 105) + 18,
    36,
    98,
  );
  const earthX = mode === "solar" ? stage.targetX : stage.occX;
  const earthY = mode === "solar" ? stage.targetX && targetY : occY;
  const earthRadius = 48;
  const observerX = earthX - Math.cos(rad(observerLatitude)) * earthRadius;
  const observerY = earthY - Math.sin(rad(observerLatitude)) * earthRadius;
  const moonX = mode === "solar" ? stage.occX : stage.targetX;
  const moonY = mode === "solar" ? occY : targetY;

  const pointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const y = ((event.clientY - bounds.top) / bounds.height) * 480;
    if (drag === "moon")
      setPhysical(setAlignment, clamp((y - 240) / 58, -1.2, 1.2));
    else {
      const latitude = clamp(
        (-Math.asin(clamp((y - earthY) / earthRadius, -1, 1)) * 180) / Math.PI,
        -60,
        60,
      );
      setPhysical(setObserverLatitude, latitude);
    }
  };
  const startDrag = (
    kind: "moon" | "observer",
    event: PointerEvent<SVGCircleElement>,
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag(kind);
  };
  const adjustKey = (
    kind: "moon" | "observer",
    event: KeyboardEvent<SVGCircleElement>,
  ) => {
    if (
      !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
    )
      return;
    event.preventDefault();
    const positive = event.key === "ArrowUp" || event.key === "ArrowRight";
    if (kind === "moon")
      setPhysical(
        setAlignment,
        clamp(alignment + (positive ? 0.05 : -0.05), -1.2, 1.2),
      );
    else
      setPhysical(
        setObserverLatitude,
        clamp(observerLatitude + (positive ? 2 : -2), -60, 60),
      );
  };

  const loadTotality = () => {
    const nextDistance = 0.94;
    const seed = solveEclipse({
      mode: "solar",
      sunRadiusScale: 1,
      moonDistanceScale: nextDistance,
      alignmentDeg: 0.42,
      observerLatitudeDeg: 0,
    });
    setMode("solar");
    setSunScale(1);
    setMoonDistanceScale(nextDistance);
    setAlignment(0.42);
    setObserverLatitude(seed.totalityCenterLatitudeDeg);
    setPhase(0.5);
    setRunning(false);
    setFeedback("");
  };

  const separationPx = clamp(result.apparentSeparationDeg * 135, 0, 70);
  const moonViewScale = clamp(
    result.moonAngularDiameterDeg / result.sunAngularDiameterDeg,
    0.75,
    1.25,
  );

  return (
    <section
      className="se-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="se-header">
        <div>
          <span>ECLIPSE GEOMETRY · 2D</span>
          <h1>Shadows and Eclipses</h1>
          <p>
            Follow the umbra, penumbra, and apparent disks through a complete
            alignment.
          </p>
        </div>
        <div className="se-mode-tabs" role="group" aria-label="Eclipse mode">
          <button
            className={mode === "solar" ? "active" : ""}
            onClick={() => {
              setMode("solar");
              setPhase(0.5);
              setFeedback("");
            }}
          >
            Solar eclipse
          </button>
          <button
            className={mode === "lunar" ? "active" : ""}
            onClick={() => {
              setMode("lunar");
              setPhase(0.5);
              setFeedback("");
            }}
          >
            Lunar eclipse
          </button>
        </div>
        <div className={`se-type ${result.eclipseType}`}>
          {titleCase(result.eclipseType)} {mode} eclipse
        </div>
      </header>

      <div className="se-layout">
        <aside className="se-controls" aria-label="Eclipse setup controls">
          <h2>Setup</h2>
          <section>
            <h3>Object parameters</h3>
            <Range
              label="Sun size"
              value={sunScale}
              min={0.8}
              max={1.2}
              step={0.01}
              unit="×"
              onChange={(value) => setPhysical(setSunScale, value)}
            />
            <Range
              label="Moon distance"
              value={moonDistanceScale}
              min={0.85}
              max={1.15}
              step={0.01}
              unit="× mean"
              onChange={(value) => setPhysical(setMoonDistanceScale, value)}
            />
          </section>
          <section>
            <h3>Orbit controls</h3>
            <Range
              label="Alignment"
              value={alignment}
              min={-1.2}
              max={1.2}
              step={0.05}
              unit="°"
              onChange={(value) => setPhysical(setAlignment, value)}
            />
            <Range
              label="Observer latitude"
              value={observerLatitude}
              min={-60}
              max={60}
              step={1}
              unit="°"
              onChange={(value) => setPhysical(setObserverLatitude, value)}
            />
          </section>
          <section className="se-switches">
            <h3>Display options</h3>
            <label>
              <input
                type="checkbox"
                checked={showRays}
                onChange={(event) => setShowRays(event.target.checked)}
              />{" "}
              Boundary rays
            </label>
            <label>
              <input
                type="checkbox"
                checked={showUmbra}
                onChange={(event) => setShowUmbra(event.target.checked)}
              />{" "}
              Umbra / antumbra
            </label>
            <label>
              <input
                type="checkbox"
                checked={showPenumbra}
                onChange={(event) => setShowPenumbra(event.target.checked)}
              />{" "}
              Penumbra
            </label>
          </section>
          <button className="se-default" onClick={reset}>
            Restore defaults
          </button>
        </aside>

        <main className="se-workspace">
          <div className="se-transport">
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
              className="play"
              onClick={() => {
                if (!running && phase >= 0.5) setPhase(0);
                setRunning((value) => !value);
              }}
            >
              {running ? "Pause" : "Play alignment"}
            </button>
            <button
              onClick={() => {
                setRunning(false);
                setPhase((value) => Math.min(1, value + 0.25));
              }}
            >
              Step
            </button>
            <label>
              Speed{" "}
              <select
                aria-label="Playback speed"
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
              >
                <option value={0.25}>0.25×</option>
                <option value={0.5}>0.5×</option>
                <option value={1}>1×</option>
                <option value={2}>2×</option>
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
            <button onClick={reset}>Reset</button>
          </div>
          <label className="se-scrubber">
            Alignment timeline{" "}
            <input
              aria-label="Alignment timeline"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={phase}
              onChange={(event) => {
                setPhase(Number(event.target.value));
                setRunning(false);
              }}
            />
            <span>
              {phase < 0.32
                ? "Partial begins"
                : phase < 0.68
                  ? "Maximum"
                  : "Partial ends"}
            </span>
          </label>
          <div className="se-stage">
            <div className="se-stars" />
            <svg
              viewBox="0 0 900 480"
              role="img"
              aria-label={`${result.bodyOrder}. ${titleCase(result.eclipseType)} ${mode} eclipse; apparent separation ${result.apparentSeparationDeg.toFixed(3)} degrees.`}
              onPointerMove={pointerMove}
              onPointerUp={() => setDrag(null)}
              onPointerCancel={() => setDrag(null)}
            >
              {showPenumbra && (
                <polygon
                  className="se-penumbra"
                  points={`${stage.occX},${occY - stage.occR} ${stage.targetX},${targetY - penumbraRadiusPx} ${stage.targetX},${targetY + penumbraRadiusPx} ${stage.occX},${occY + stage.occR}`}
                />
              )}
              {showUmbra && (
                <polygon
                  className={`se-umbra ${signedCentralRadiusKm < 0 ? "antumbra" : ""}`}
                  points={`${stage.occX},${occY - stage.occR} ${stage.targetX},${targetY - centralRadiusPx} ${stage.targetX},${targetY + centralRadiusPx} ${stage.occX},${occY + stage.occR}`}
                />
              )}
              {showRays && (
                <g className="se-rays">
                  <line
                    x1={stage.sourceX}
                    y1={sourceY - 72}
                    x2={stage.targetX}
                    y2={targetY - penumbraRadiusPx}
                  />
                  <line
                    x1={stage.sourceX}
                    y1={sourceY + 72}
                    x2={stage.targetX}
                    y2={targetY + penumbraRadiusPx}
                  />
                  <line
                    className="inner"
                    x1={stage.sourceX}
                    y1={sourceY - 72}
                    x2={stage.targetX}
                    y2={targetY + centralRadiusPx}
                  />
                  <line
                    className="inner"
                    x1={stage.sourceX}
                    y1={sourceY + 72}
                    x2={stage.targetX}
                    y2={targetY - centralRadiusPx}
                  />
                </g>
              )}
              <line className="se-axis" x1="45" y1="240" x2="855" y2="240" />
              <ellipse
                className="se-orbit"
                cx={earthX}
                cy={earthY}
                rx="86"
                ry="66"
              />
              <circle
                className="se-observer-pin"
                cx={observerX}
                cy={observerY}
                r="6"
              />
              <circle
                className="se-hit-target"
                role="button"
                tabIndex={0}
                aria-label="Movable Moon; use arrow keys"
                cx={moonX}
                cy={moonY}
                r="31"
                onPointerDown={(event) => startDrag("moon", event)}
                onKeyDown={(event) => adjustKey("moon", event)}
              />
              <circle
                className="se-hit-target observer"
                role="button"
                tabIndex={0}
                aria-label="Movable observer; use arrow keys"
                cx={observerX}
                cy={observerY}
                r="20"
                onPointerDown={(event) => startDrag("observer", event)}
                onKeyDown={(event) => adjustKey("observer", event)}
              />
              <text x={stage.sourceX} y="354">
                SUN
              </text>
              <text
                x={mode === "solar" ? stage.occX : stage.targetX}
                y={mode === "solar" ? occY + 58 : targetY + 48}
              >
                MOON
              </text>
              <text x={earthX} y={earthY + 76}>
                EARTH
              </text>
              <text
                className="se-shadow-label"
                x={(stage.occX + stage.targetX) / 2}
                y={targetY - 20}
              >
                UMBRA
              </text>
              <text
                className="se-shadow-label pen"
                x={(stage.occX + stage.targetX) / 2}
                y={targetY - penumbraRadiusPx - 12}
              >
                PENUMBRA
              </text>
            </svg>
            <div
              className="se-body sun"
              style={{ left: `${(stage.sourceX / 900) * 100}%`, top: "50%" }}
            />
            <div
              className={`se-body ${mode === "solar" ? "moon" : "earth"}`}
              style={{
                left: `${(stage.occX / 900) * 100}%`,
                top: `${(occY / 480) * 100}%`,
              }}
            />
            <div
              className={`se-body ${mode === "solar" ? "earth" : "moon"} ${mode === "lunar" && result.eclipseType !== "none" ? "eclipsed" : ""}`}
              style={{
                left: `${(stage.targetX / 900) * 100}%`,
                top: `${(targetY / 480) * 100}%`,
              }}
            />
            <div className="se-order">{result.bodyOrder}</div>
          </div>
        </main>

        <aside className="se-readouts" aria-label="Live eclipse measurements">
          <h2>Live readouts</h2>
          <section>
            <div>
              <span>Sun angular diameter</span>
              <b>{result.sunAngularDiameterDeg.toFixed(3)}°</b>
            </div>
            <div>
              <span>Moon angular diameter</span>
              <b>{result.moonAngularDiameterDeg.toFixed(3)}°</b>
            </div>
            <div>
              <span>Angular separation</span>
              <b>{result.apparentSeparationDeg.toFixed(3)}°</b>
            </div>
            <div>
              <span>Angular-size difference</span>
              <b
                className={
                  result.angularSizeDifferenceDeg >= 0 ? "positive" : "negative"
                }
              >
                {result.angularSizeDifferenceDeg.toFixed(3)}°
              </b>
            </div>
          </section>
          <section>
            <div>
              <span>
                {mode === "solar" ? "Moon umbra length" : "Earth umbra length"}
              </span>
              <b>
                {Math.round(
                  mode === "solar"
                    ? result.moonUmbraLengthKm
                    : result.earthUmbraLengthKm,
                ).toLocaleString()}{" "}
                km
              </b>
            </div>
            <div>
              <span>Umbra radius at target</span>
              <b>{Math.round(signedCentralRadiusKm).toLocaleString()} km</b>
            </div>
            <div>
              <span>Penumbra radius</span>
              <b>
                {Math.round(
                  mode === "solar"
                    ? result.penumbraRadiusAtEarthKm
                    : result.earthPenumbraRadiusAtMoonKm,
                ).toLocaleString()}{" "}
                km
              </b>
            </div>
          </section>
          <section className={`se-result ${result.eclipseType}`}>
            <span>ECLIPSE AT OBSERVER</span>
            <strong>{titleCase(result.eclipseType)}</strong>
            <p>
              {mode === "solar"
                ? result.centralCondition
                  ? result.angularSizeDifferenceDeg >= 0
                    ? "Moon fully covers the Sun."
                    : "A bright annulus remains."
                  : result.eclipseType === "partial"
                    ? "The disks overlap off-centre."
                    : "The disks do not overlap."
                : result.eclipseType === "total"
                  ? "Moon lies fully inside Earth's umbra."
                  : result.eclipseType === "partial"
                    ? "Moon crosses the umbra edge."
                    : result.eclipseType === "penumbral"
                      ? "Moon crosses only the penumbra."
                      : "Moon misses Earth's shadow."}
            </p>
          </section>
          <section className="se-view">
            <h3>Observer view</h3>
            <div className={`se-view-disc ${mode}`}>
              <i
                className="se-view-moon"
                style={{
                  width: `${moonViewScale * 54}%`,
                  height: `${moonViewScale * 54}%`,
                  transform: `translate(calc(-50% + ${separationPx}px), -50%)`,
                }}
              />
              <i
                className="se-view-shadow"
                style={{
                  transform: `translate(calc(-50% + ${clamp(result.moonOffsetKm / 100, 0, 65)}px), -50%)`,
                }}
              />
            </div>
            <small>{observerLatitude.toFixed(0)}° observer latitude</small>
          </section>
        </aside>
      </div>

      <div className="se-bottom">
        <section className="se-card se-equation">
          <span>GOVERNING EQUATION</span>
          <h2>Apparent angular diameter</h2>
          <strong>θ = 2 arctan(R / d)</strong>
          <p>
            Total solar eclipse: Moon appears at least as large as the Sun and
            their centres align.
          </p>
        </section>
        <section className="se-card se-mission">
          <span>LEARNER CHALLENGE</span>
          <h2>Find the narrow path of totality</h2>
          <p>
            Adjust the observer latitude until the larger apparent Moon is
            centred on the Sun.
          </p>
          <div>
            <button onClick={loadTotality}>Load near-totality setup</button>
            <button
              className="check"
              onClick={() =>
                setFeedback(
                  missionPass
                    ? `Mission complete — totality at ${observerLatitude.toFixed(1)}° latitude with ${result.apparentSeparationDeg.toFixed(3)}° separation.`
                    : mode !== "solar"
                      ? "Switch to Solar eclipse: totality requires Sun → Moon → Earth."
                      : result.angularSizeDifferenceDeg < 0
                        ? "The Moon appears too small. Reduce Moon distance or Sun size."
                        : `Current ${result.eclipseType} eclipse: move the observer toward ${controlledResult.totalityCenterLatitudeDeg.toFixed(1)}° latitude.`,
                )
              }
            >
              Check totality
            </button>
          </div>
          {feedback && (
            <p
              role="status"
              className={feedback.startsWith("Mission") ? "success" : "hint"}
            >
              {feedback}
            </p>
          )}
        </section>
        <section className="se-card se-predict">
          <span>PREDICT</span>
          <h2>Classify the eclipse</h2>
          <label>
            Your prediction{" "}
            <select
              aria-label="Predicted eclipse type"
              value={prediction}
              onChange={(event) => setPrediction(event.target.value)}
            >
              <option value="">Select…</option>
              {[
                "none",
                "partial",
                "annular",
                "total",
                ...(mode === "lunar" ? ["penumbral"] : []),
              ].map((value) => (
                <option key={value} value={value}>
                  {titleCase(value)}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={() =>
              setFeedback(
                prediction === result.eclipseType
                  ? `Prediction correct — this is a ${result.eclipseType} ${mode} eclipse.`
                  : `Calculated classification: ${result.eclipseType} ${mode} eclipse.`,
              )
            }
          >
            Check prediction
          </button>
        </section>
      </div>
    </section>
  );
}
