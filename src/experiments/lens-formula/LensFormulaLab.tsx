import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  focalLengthFromPositions,
  solveLens,
  type LensType,
} from "./lens-formulaSimulation";
import "./lens-formula.css";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
export function LensFormulaLab({ experiment }: DedicatedExperimentLabProps) {
  const [objectDistance, setObjectDistance] = useState(30),
    [focalLength, setFocalLength] = useState(15),
    [objectHeight, setObjectHeight] = useState(2),
    [lensType, setLensType] = useState<LensType>("convex"),
    [lensOffset, setLensOffset] = useState(0),
    [screenDistance, setScreenDistance] = useState(30),
    [showRays, setShowRays] = useState(true),
    [showFocus, setShowFocus] = useState(true),
    [phase, setPhase] = useState(1),
    [running, setRunning] = useState(false),
    [playback, setPlayback] = useState(1),
    [reduced, setReduced] = useState(false),
    [drag, setDrag] = useState<"object" | "lens" | null>(null),
    [answer, setAnswer] = useState(""),
    [feedback, setFeedback] = useState("");
  const stageRef = useRef<HTMLDivElement>(null);
  const result = solveLens({
    objectDistanceCm: objectDistance,
    focalLengthCm: focalLength,
    objectHeightCm: objectHeight,
    lensType,
  });
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setPhase((p) => {
          const n = Math.min(1, p + (reduced ? 0.12 : 0.025) * playback);
          if (n >= 1) setRunning(false);
          return n;
        }),
      reduced ? 180 : 35,
    );
    return () => clearInterval(id);
  }, [playback, reduced, running]);
  const reset = () => {
    setObjectDistance(30);
    setFocalLength(15);
    setObjectHeight(2);
    setLensType("convex");
    setLensOffset(0);
    setScreenDistance(30);
    setShowRays(true);
    setShowFocus(true);
    setPhase(1);
    setRunning(false);
    setPlayback(1);
    setReduced(false);
    setFeedback("");
    setAnswer("");
  };
  const pointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag || !stageRef.current) return;
    const box = stageRef.current.getBoundingClientRect(),
      x = ((e.clientX - box.left) / box.width) * 900,
      pos = (x - 450) / 5;
    if (drag === "lens") setLensOffset(clamp(pos, -20, 20));
    else setObjectDistance(clamp(lensOffset - pos, 10, 80));
  };
  const sharp =
    Number.isFinite(result.vCm) && result.isReal
      ? Math.max(0, 100 - Math.abs(result.vCm - screenDistance) * 4)
      : 0;
  return (
    <section
      className="lf-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="lf-head" data-ui-theme="dark">
        <div>
          <span>OPTICAL RAIL & RAY DIAGRAM</span>
          <h2>Move the object. Build the image.</h2>
          <p>
            Use the Cartesian sign convention and watch principal rays reveal
            the result.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="lf-layout">
        <aside className="lf-controls">
          <h3>Apparatus</h3>
          <Range
            label="Object distance |u|"
            value={objectDistance}
            min={10}
            max={80}
            step={1}
            unit=" cm"
            onChange={setObjectDistance}
          />
          <Range
            label="Focal length |f|"
            value={focalLength}
            min={5}
            max={30}
            step={1}
            unit=" cm"
            onChange={setFocalLength}
          />
          <Range
            label="Object height"
            value={objectHeight}
            min={1}
            max={5}
            step={0.25}
            unit=" cm"
            onChange={setObjectHeight}
          />
          <h3>Lens type</h3>
          <div className="lf-types">
            <button
              className={lensType === "convex" ? "active" : ""}
              onClick={() => setLensType("convex")}
            >
              () Convex
            </button>
            <button
              className={lensType === "concave" ? "active" : ""}
              onClick={() => setLensType("concave")}
            >
              ) ( Concave
            </button>
          </div>
          <Range
            label="Screen distance"
            value={screenDistance}
            min={5}
            max={80}
            step={1}
            unit=" cm"
            onChange={setScreenDistance}
          />
          <label className="lf-check">
            <input
              type="checkbox"
              checked={showRays}
              onChange={(e) => setShowRays(e.target.checked)}
            />{" "}
            Show principal rays
          </label>
          <label className="lf-check">
            <input
              type="checkbox"
              checked={showFocus}
              onChange={(e) => setShowFocus(e.target.checked)}
            />{" "}
            Show focal points
          </label>
          <div className="lf-presets">
            <button
              onClick={() => {
                setObjectDistance(10);
                setFocalLength(5);
                setObjectHeight(1);
              }}
            >
              Minimums
            </button>
            <button
              onClick={() => {
                setObjectDistance(30);
                setFocalLength(15);
                setObjectHeight(2);
                setLensType("convex");
              }}
            >
              Typical
            </button>
            <button
              onClick={() => {
                setObjectDistance(80);
                setFocalLength(30);
                setObjectHeight(5);
              }}
            >
              Maximums
            </button>
          </div>
        </aside>
        <main className="lf-main">
          <div className="lf-transport">
            <button onClick={() => setRunning(true)}>▶ Play</button>
            <button onClick={() => setRunning(false)}>Ⅱ Pause</button>
            <button onClick={() => setPhase((p) => Math.min(1, p + 0.1))}>
              ▷ Step
            </button>
            <button
              onClick={() => {
                setRunning(false);
                setPhase(0);
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
                  <option key={v} value={v}>
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
          <LensBench
            stageRef={stageRef}
            result={result}
            lensOffset={lensOffset}
            objectDistance={objectDistance}
            objectHeight={objectHeight}
            screenDistance={screenDistance}
            phase={phase}
            showRays={showRays}
            showFocus={showFocus}
            onPointerMove={pointerMove}
            setDrag={setDrag}
          />
          <p className="lf-caption" role="status">
            {Number.isFinite(result.vCm)
              ? `${result.isReal ? "Real" : "Virtual"}, ${result.isInverted ? "inverted" : "upright"} image at v=${result.vCm.toFixed(2)} cm; m=${result.magnification.toFixed(2)}.`
              : "Object at the focal point: emerging rays are parallel and the image is at infinity."}
          </p>
        </main>
        <aside className="lf-readings">
          <h3>Measurements</h3>
          <dl>
            <dt>u</dt>
            <dd>{result.uCm.toFixed(1)} cm</dd>
            <dt>v</dt>
            <dd>
              {Number.isFinite(result.vCm)
                ? `${result.vCm > 0 ? "+" : ""}${result.vCm.toFixed(2)} cm`
                : "∞"}
            </dd>
            <dt>f</dt>
            <dd>
              {result.fCm > 0 ? "+" : ""}
              {result.fCm.toFixed(1)} cm
            </dd>
            <dt>Object height</dt>
            <dd>+{objectHeight.toFixed(2)} cm</dd>
            <dt>Image height</dt>
            <dd>
              {Number.isFinite(result.imageHeightCm)
                ? `${result.imageHeightCm > 0 ? "+" : ""}${result.imageHeightCm.toFixed(2)} cm`
                : "∞"}
            </dd>
            <dt>Magnification</dt>
            <dd>
              {Number.isFinite(result.magnification)
                ? result.magnification.toFixed(2)
                : "∞"}
            </dd>
            <dt>Image</dt>
            <dd>
              {result.isReal ? "Real" : "Virtual"},{" "}
              {result.isInverted ? "inverted" : "upright"}
            </dd>
          </dl>
          <div className="lf-equation">
            1/f = 1/v − 1/u
            <br />m = v/u = hᵢ/hₒ
          </div>
          <div className="lf-residual">
            Equation residual {result.equationResidual.toExponential(1)} ✓
          </div>
          <h3>Autofocus score</h3>
          <strong className="lf-score">{sharp.toFixed(0)}%</strong>
          <progress max="100" value={sharp} />
          <small>
            {sharp > 95
              ? "Image is sharp on the screen."
              : "Move the screen to v for a sharp real image."}
          </small>
        </aside>
      </div>
      <div className="lf-lower">
        <UVGraph focalLength={result.fCm} />
        <section className="lf-mission">
          <span>CHALLENGE</span>
          <h3>Determine the unknown focal length</h3>
          <p>Object at u=−24.0 cm. A sharp real image forms at v=+48.0 cm.</p>
          <label>
            Focal length{" "}
            <input
              aria-label="Mission focal length"
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />{" "}
            cm
          </label>
          <button
            onClick={() => {
              const expected = focalLengthFromPositions(-24, 48);
              setFeedback(
                Math.abs(+answer - expected) <= 0.1
                  ? `✓ Correct: f=+${expected.toFixed(1)} cm.`
                  : `Use 1/f=1/v−1/u. The result is positive for this convex lens.`,
              );
            }}
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
    <label className="lf-range">
      {label}
      <output>
        {value.toFixed(step < 1 ? 2 : 1)}
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
function LensBench({
  stageRef,
  result,
  lensOffset,
  objectDistance,
  objectHeight,
  screenDistance,
  phase,
  showRays,
  showFocus,
  onPointerMove,
  setDrag,
}: {
  stageRef: React.RefObject<HTMLDivElement>;
  result: ReturnType<typeof solveLens>;
  lensOffset: number;
  objectDistance: number;
  objectHeight: number;
  screenDistance: number;
  phase: number;
  showRays: boolean;
  showFocus: boolean;
  onPointerMove: (e: PointerEvent<SVGSVGElement>) => void;
  setDrag: (v: "object" | "lens" | null) => void;
}) {
  const axis = 250,
    scale = 5,
    lensX = 450 + lensOffset * scale,
    objectX = lensX - objectDistance * scale,
    tipY = axis - objectHeight * 28,
    imageX = lensX + result.vCm * scale,
    imageY = axis - result.imageHeightCm * 28,
    screenX = lensX + screenDistance * scale;
  const virtual = result.vCm < 0;
  const lineY = (
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    x: number,
  ) => fromY + ((toY - fromY) * (x - fromX)) / (toX - fromX);
  const rayEndX = 860,
    parallelEndY = virtual
      ? lineY(imageX, imageY, lensX, tipY, rayEndX)
      : imageY,
    centerEndY = virtual ? lineY(imageX, imageY, lensX, axis, rayEndX) : imageY;
  return (
    <div className="lf-stage" ref={stageRef}>
      <img
        src="/assets/experiments/lens-formula/optical-rail-2d.png"
        alt="Optical rail with illuminated object, lens holder, and screen"
      />
      <svg
        viewBox="0 0 900 500"
        role="img"
        aria-label={`Ray diagram with object ${objectDistance} centimetres from a ${result.fCm > 0 ? "convex" : "concave"} lens; image ${result.isReal ? "real" : "virtual"}`}
        onPointerMove={onPointerMove}
        onPointerUp={() => setDrag(null)}
        onPointerLeave={() => setDrag(null)}
      >
        <line x1="25" y1={axis} x2="875" y2={axis} className="axis" />
        <g className="dynamic-apparatus">
          <line
            x1={objectX}
            y1={axis}
            x2={objectX}
            y2={tipY}
            className="object"
          />
          <path
            d={`M${objectX - 8} ${tipY + 12}L${objectX} ${tipY}L${objectX + 8} ${tipY + 12}`}
            className="object"
          />
          <ellipse
            cx={lensX}
            cy={axis}
            rx={result.fCm > 0 ? 15 : 8}
            ry="92"
            className={result.fCm > 0 ? "lens convex" : "lens concave"}
          />
          <line
            x1={screenX}
            y1="135"
            x2={screenX}
            y2="365"
            className="screen"
          />
        </g>
        {showFocus && (
          <>
            <circle
              cx={lensX - Math.abs(result.fCm) * scale}
              cy={axis}
              r="5"
              className="focus"
            />
            <circle
              cx={lensX + Math.abs(result.fCm) * scale}
              cy={axis}
              r="5"
              className="focus"
            />
            <text x={lensX - Math.abs(result.fCm) * scale - 8} y={axis + 24}>
              F
            </text>
            <text x={lensX + Math.abs(result.fCm) * scale - 8} y={axis + 24}>
              F′
            </text>
          </>
        )}
        {showRays && (
          <g style={{ opacity: 0.15 + 0.85 * phase }}>
            <line
              x1={objectX}
              y1={tipY}
              x2={lensX}
              y2={tipY}
              className="ray one"
            />
            <line
              x1={lensX}
              y1={tipY}
              x2={virtual ? rayEndX : imageX}
              y2={virtual ? parallelEndY : imageY}
              className="ray one"
            />
            <line
              x1={objectX}
              y1={tipY}
              x2={lensX}
              y2={axis}
              className="ray two"
            />
            <line
              x1={lensX}
              y1={axis}
              x2={virtual ? rayEndX : imageX}
              y2={virtual ? centerEndY : imageY}
              className="ray two"
            />
            {virtual && (
              <>
                <line
                  x1={imageX}
                  y1={imageY}
                  x2={lensX}
                  y2={tipY}
                  className="extension"
                />
                <line
                  x1={imageX}
                  y1={imageY}
                  x2={lensX}
                  y2={axis}
                  className="extension"
                />
              </>
            )}
          </g>
        )}
        {phase > 0.65 && Number.isFinite(result.vCm) && (
          <g style={{ opacity: (phase - 0.65) / 0.35 }}>
            <line
              x1={imageX}
              y1={axis}
              x2={imageX}
              y2={imageY}
              className={result.isReal ? "image real" : "image virtual"}
            />
            <path
              d={`M${imageX - 8} ${imageY + (result.imageHeightCm < 0 ? -12 : 12)}L${imageX} ${imageY}L${imageX + 8} ${imageY + (result.imageHeightCm < 0 ? -12 : 12)}`}
              className={result.isReal ? "image real" : "image virtual"}
            />
          </g>
        )}
        <rect
          x={objectX - 22}
          y={tipY - 20}
          width="44"
          height={axis - tipY + 40}
          className="drag-zone"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setDrag("object");
          }}
        />
        <rect
          x={lensX - 28}
          y="140"
          width="56"
          height="220"
          className="drag-zone"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setDrag("lens");
          }}
        />
        <text x={objectX - 24} y={tipY - 12}>
          Object
        </text>
        <text x={lensX - 18} y="134">
          Lens
        </text>
        <text x={screenX - 24} y="128">
          Screen
        </text>
      </svg>
    </div>
  );
}
function UVGraph({ focalLength }: { focalLength: number }) {
  const pts = [];
  for (let u = -80; u <= -6; u += 2) {
    const inv = 1 / focalLength + 1 / u,
      v = Math.abs(inv) < 1e-9 ? Infinity : 1 / inv;
    if (Number.isFinite(v) && Math.abs(v) < 90)
      pts.push(`${170 + u * 1.8},${120 - v * 1.1}`);
  }
  return (
    <section className="lf-graph">
      <h3>u–v graph</h3>
      <svg
        viewBox="0 0 340 230"
        role="img"
        aria-label="Object distance versus image distance graph"
      >
        <line x1="20" y1="120" x2="325" y2="120" />
        <line x1="170" y1="15" x2="170" y2="215" />
        <polyline points={pts.join(" ")} />
        <text x="286" y="142">
          u
        </text>
        <text x="178" y="28">
          v
        </text>
      </svg>
    </section>
  );
}
