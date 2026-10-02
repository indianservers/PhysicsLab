import {
  useEffect,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { solveMultipleReflection } from "./multipleReflectionSimulation";
import "./multiple-reflection.css";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const polar = (cx: number, cy: number, radius: number, degrees: number) => ({
  x: cx + radius * Math.cos((degrees * Math.PI) / 180),
  y: cy + radius * Math.sin((degrees * Math.PI) / 180),
});

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
    <label className="mr-range">
      <span>
        <b>{label}</b>
        <output>
          {value.toFixed(step < 1 ? 1 : 0)}
          {unit}
        </output>
      </span>
      <input
        aria-label={label}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

export function MultipleReflectionLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [angleDeg, setAngleDeg] = useState(60),
    [mirrorCount, setMirrorCount] = useState<2 | 3>(3),
    [radiusCm, setRadiusCm] = useState(5),
    [positionPercent, setPositionPercent] = useState(50),
    [objectRotation, setObjectRotation] = useState(0),
    [objectCentered, setObjectCentered] = useState(true);
  const [showRays, setShowRays] = useState(true),
    [showImages, setShowImages] = useState(true),
    [showNormals, setShowNormals] = useState(false),
    [phase, setPhase] = useState(1),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(false),
    [dragging, setDragging] = useState(false),
    [prediction, setPrediction] = useState(""),
    [feedback, setFeedback] = useState("");
  const result = solveMultipleReflection({
    angleDeg,
    mirrorCount,
    objectCentered,
    positionPercent,
  });
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setPhase((p) => {
          const next = Math.min(1, p + (reduced ? 0.12 : 0.024) * speed);
          if (next >= 1) setRunning(false);
          return next;
        }),
      reduced ? 170 : 35,
    );
    return () => clearInterval(id);
  }, [running, speed, reduced]);
  const origin = { x: 350, y: 125 },
    mirrorLength = 275;
  const leftAngle = 90 + angleDeg / 2,
    rightAngle = 90 - angleDeg / 2;
  const leftEnd = polar(origin.x, origin.y, mirrorLength, leftAngle),
    rightEnd = polar(origin.x, origin.y, mirrorLength, rightAngle);
  const objectAngle = rightAngle + (angleDeg * positionPercent) / 100,
    objectRadius = radiusCm * 15,
    objectPoint = polar(origin.x, origin.y, objectRadius, objectAngle);
  const visibleImages = Math.round(result.imageCount * phase);
  const reset = () => {
    setAngleDeg(60);
    setMirrorCount(3);
    setRadiusCm(5);
    setPositionPercent(50);
    setObjectRotation(0);
    setObjectCentered(true);
    setShowRays(true);
    setShowImages(true);
    setShowNormals(false);
    setPhase(1);
    setRunning(false);
    setSpeed(1);
    setReduced(false);
    setPrediction("");
    setFeedback("");
  };
  const moveObject = (e: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const rect = e.currentTarget.getBoundingClientRect(),
      x = ((e.clientX - rect.left) / rect.width) * 700,
      y = ((e.clientY - rect.top) / rect.height) * 540,
      dx = x - origin.x,
      dy = y - origin.y,
      rawAngle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360,
      local = clamp(((rawAngle - rightAngle) / angleDeg) * 100, 10, 90);
    setPositionPercent(local);
    setRadiusCm(clamp(Math.hypot(dx, dy) / 15, 2, 10));
    setObjectCentered(Math.abs(local - 50) < 2);
  };
  const keyMove = (e: KeyboardEvent<SVGGElement>) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key))
      return;
    e.preventDefault();
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const next = clamp(
        positionPercent + (e.key === "ArrowLeft" ? -5 : 5),
        10,
        90,
      );
      setPositionPercent(next);
      setObjectCentered(next === 50);
    } else
      setRadiusCm((v) => clamp(v + (e.key === "ArrowUp" ? -0.5 : 0.5), 2, 10));
  };
  const missionPass =
    mirrorCount === 2 && angleDeg === 45 && result.imageCount === 7;
  const motifCount = Math.max(3, result.displayedMotifs);
  return (
    <section
      className="mr-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="mr-hero">
        <div>
          <span>MULTIPLE-REFLECTION STUDIO · 2D</span>
          <h1>{experiment.title}</h1>
          <p>
            Change the mirror wedge, then watch each virtual-image generation
            unfold.
          </p>
        </div>
        <div className="mr-badge">IDEAL PLANE MIRRORS</div>
      </header>
      <div className="mr-grid">
        <aside className="mr-controls mr-card">
          <h2>
            <i>1</i> Mirror geometry
          </h2>
          <Range
            label="Angle between mirrors"
            value={angleDeg}
            min={30}
            max={120}
            step={1}
            unit="°"
            onChange={(v) => {
              setAngleDeg(v);
              setPhase(1);
              setFeedback("");
            }}
          />
          <div className="mr-segment">
            <button
              className={mirrorCount === 2 ? "active" : ""}
              onClick={() => setMirrorCount(2)}
            >
              2 mirrors
            </button>
            <button
              className={mirrorCount === 3 ? "active" : ""}
              onClick={() => setMirrorCount(3)}
            >
              3 mirrors
            </button>
          </div>
          <h2>
            <i>2</i> Object
          </h2>
          <Range
            label="Radial position"
            value={radiusCm}
            min={2}
            max={10}
            step={0.5}
            unit=" cm"
            onChange={setRadiusCm}
          />
          <Range
            label="Position across wedge"
            value={positionPercent}
            min={10}
            max={90}
            step={5}
            unit="%"
            onChange={(v) => {
              setPositionPercent(v);
              setObjectCentered(v === 50);
            }}
          />
          <Range
            label="Object rotation"
            value={objectRotation}
            min={0}
            max={350}
            step={10}
            unit="°"
            onChange={setObjectRotation}
          />
          <label className="mr-check">
            <input
              type="checkbox"
              checked={objectCentered}
              onChange={(e) => {
                setObjectCentered(e.target.checked);
                if (e.target.checked) setPositionPercent(50);
              }}
            />{" "}
            Object on angle bisector
          </label>
          <h2>
            <i>3</i> View
          </h2>
          <label className="mr-check">
            <input
              type="checkbox"
              checked={showNormals}
              onChange={(e) => setShowNormals(e.target.checked)}
            />{" "}
            Normal lines
          </label>
          <label className="mr-check">
            <input
              type="checkbox"
              checked={showRays}
              onChange={(e) => setShowRays(e.target.checked)}
            />{" "}
            Reflection paths
          </label>
          <label className="mr-check">
            <input
              type="checkbox"
              checked={showImages}
              onChange={(e) => setShowImages(e.target.checked)}
            />{" "}
            Virtual images
          </label>
        </aside>
        <main className="mr-stage mr-card">
          <div className="mr-stage-head">
            <div>
              <span>TOP VIEW</span>
              <h2>
                {mirrorCount === 3
                  ? "Triangular kaleidoscope chamber"
                  : "Two-mirror image wedge"}
              </h2>
            </div>
            <div>
              <b>{visibleImages}</b> / {result.imageCount} images unfolded
            </div>
          </div>
          <div className="mr-chamber">
            <img
              src="/assets/experiments/multiple-reflection/kaleidoscope-chamber.png"
              alt="Transparent triangular kaleidoscope mirror chamber"
              className={mirrorCount === 2 ? "pair" : ""}
            />
            <svg
              viewBox="0 0 700 540"
              onPointerMove={moveObject}
              onPointerUp={() => setDragging(false)}
              onPointerLeave={() => setDragging(false)}
              aria-label={`${result.imageCount} virtual images from ${angleDeg} degree mirror angle`}
            >
              <line
                className="mirror-line"
                x1={origin.x}
                y1={origin.y}
                x2={leftEnd.x}
                y2={leftEnd.y}
              />
              <line
                className="mirror-line"
                x1={origin.x}
                y1={origin.y}
                x2={rightEnd.x}
                y2={rightEnd.y}
              />
              {mirrorCount === 3 && (
                <line
                  className="mirror-line third"
                  x1={leftEnd.x}
                  y1={leftEnd.y}
                  x2={rightEnd.x}
                  y2={rightEnd.y}
                />
              )}
              <path
                className="angle-arc"
                d={`M ${polar(origin.x, origin.y, 55, rightAngle).x} ${polar(origin.x, origin.y, 55, rightAngle).y} A 55 55 0 0 1 ${polar(origin.x, origin.y, 55, leftAngle).x} ${polar(origin.x, origin.y, 55, leftAngle).y}`}
              />
              <text className="angle-label" x={origin.x - 18} y={origin.y + 75}>
                θ {angleDeg}°
              </text>
              {showNormals && (
                <g className="normals">
                  <line
                    x1={(origin.x + leftEnd.x) / 2 - 28}
                    y1={(origin.y + leftEnd.y) / 2 - 16}
                    x2={(origin.x + leftEnd.x) / 2 + 28}
                    y2={(origin.y + leftEnd.y) / 2 + 16}
                  />
                  <line
                    x1={(origin.x + rightEnd.x) / 2 - 28}
                    y1={(origin.y + rightEnd.y) / 2 + 16}
                    x2={(origin.x + rightEnd.x) / 2 + 28}
                    y2={(origin.y + rightEnd.y) / 2 - 16}
                  />
                </g>
              )}
              {showRays && (
                <g className="ray-paths" opacity={phase > 0.18 ? 1 : 0.15}>
                  <polyline
                    points={`${objectPoint.x},${objectPoint.y} ${(origin.x + leftEnd.x) / 2},${(origin.y + leftEnd.y) / 2} 350,505`}
                  />
                  <polyline
                    points={`${objectPoint.x},${objectPoint.y} ${(origin.x + rightEnd.x) / 2},${(origin.y + rightEnd.y) / 2} 350,505`}
                  />
                </g>
              )}
              {showImages &&
                result.images.map((image, index) => {
                  const p = polar(
                    origin.x,
                    origin.y,
                    objectRadius,
                    image.angleDeg + rightAngle,
                  );
                  return (
                    <g
                      key={`${image.angleDeg}-${index}`}
                      className="virtual-object"
                      opacity={index < visibleImages ? 1 : 0.08}
                      transform={`translate(${p.x} ${p.y}) rotate(${objectRotation + image.angleDeg})`}
                    >
                      <circle r="9" />
                      <path d="M-6 -13L0 -23L6 -13Z" />
                      <text x="13" y="4">
                        {index + 1}
                      </text>
                    </g>
                  );
                })}
              <g
                className="real-object"
                role="button"
                tabIndex={0}
                aria-label="Draggable object; use arrow keys to move it"
                transform={`translate(${objectPoint.x} ${objectPoint.y}) rotate(${objectRotation})`}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setDragging(true);
                }}
                onKeyDown={keyMove}
              >
                <circle r="11" />
                <path d="M-7 -16L0 -28L7 -16Z" />
              </g>
              <g className="eye">
                <rect x="329" y="475" width="42" height="48" rx="12" />
                <circle cx="350" cy="492" r="8" />
              </g>
            </svg>
          </div>
          <div className="mr-transport">
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
                if (phase >= 1) setPhase(0);
                setRunning((v) => !v);
              }}
            >
              {running ? "Pause" : "Play generations"}
            </button>
            <button
              onClick={() => {
                setRunning(false);
                setPhase((v) =>
                  Math.min(1, v + 1 / Math.max(1, result.imageCount)),
                );
              }}
            >
              Step
            </button>
            <label>
              Speed{" "}
              <select
                aria-label="Playback speed"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
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
                checked={reduced}
                onChange={(e) => setReduced(e.target.checked)}
              />{" "}
              Reduced motion
            </label>
            <button onClick={reset}>Reset</button>
          </div>
        </main>
        <aside className="mr-side">
          <section className="mr-card mr-preview">
            <h2>Live kaleidoscope view</h2>
            <svg
              viewBox="0 0 240 240"
              aria-label={`${result.symmetryOrder}-sector kaleidoscope preview`}
            >
              <defs>
                <radialGradient id="mr-bg">
                  <stop stopColor="#173454" />
                  <stop offset="1" stopColor="#05080d" />
                </radialGradient>
                <clipPath id="mr-circle">
                  <circle cx="120" cy="120" r="105" />
                </clipPath>
              </defs>
              <circle cx="120" cy="120" r="112" fill="#070a0e" />
              <g clipPath="url(#mr-circle)">
                <rect width="240" height="240" fill="url(#mr-bg)" />
                {Array.from({ length: motifCount }, (_, i) => (
                  <g
                    key={i}
                    transform={`rotate(${objectRotation + (i * 360) / motifCount} 120 120) ${i % 2 ? "scale(-1 1) translate(-240 0)" : ""}`}
                    opacity={
                      i < Math.max(1, Math.round(motifCount * phase)) ? 1 : 0.1
                    }
                  >
                    <path d="M120 34L132 70L108 70Z" fill="#f6b81e" />
                    <rect
                      x="138"
                      y="63"
                      width="16"
                      height="16"
                      rx="3"
                      fill="#2477d4"
                      transform="rotate(45 146 71)"
                    />
                    <circle cx="98" cy="79" r="8" fill="#df3e39" />
                  </g>
                ))}
              </g>
              <circle
                cx="120"
                cy="120"
                r="105"
                fill="none"
                stroke="#c8d3da"
                strokeWidth="4"
              />
            </svg>
          </section>
          <section className="mr-card mr-readings">
            <h2>Live readings</h2>
            <div>
              <span>Angle θ</span>
              <b>{angleDeg.toFixed(1)}°</b>
            </div>
            <div>
              <span>360° / θ</span>
              <b>{result.quotient.toFixed(2)}</b>
            </div>
            <div>
              <span>Two-mirror images N</span>
              <b>{result.imageCount}</b>
            </div>
            <div>
              <span>Symmetry order</span>
              <b>{result.symmetryOrder}</b>
            </div>
            <div>
              <span>Displayed motifs</span>
              <b>{result.displayedMotifs}</b>
            </div>
            <p>
              {result.rule}
              {result.exactDivision
                ? " · exact division"
                : " · boundary truncated"}
            </p>
          </section>
          <section className="mr-card mr-mission">
            <span>CHALLENGE</span>
            <h2>Create exactly 7 images</h2>
            <p>Use two mirrors and an on-axis object.</p>
            <button
              onClick={() => {
                setMirrorCount(2);
                setAngleDeg(45);
                setObjectCentered(true);
                setPositionPercent(50);
                setFeedback("");
              }}
            >
              Load target
            </button>
            <button
              className="check"
              onClick={() =>
                setFeedback(
                  missionPass
                    ? "Mission complete — 45° divides 360° into 8 sectors, so N = 8 − 1 = 7."
                    : `Current result: ${result.imageCount} images. Adjust the two-mirror angle.`,
                )
              }
            >
              Check solution
            </button>
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
      <footer className="mr-bottom">
        <section className="mr-card mr-formula">
          <span>ALIGNED TWO-MIRROR RULE</span>
          <b>N = 360° / θ − 1</b>
          <small>
            When 360°/θ is integral and the even/centered condition holds;
            otherwise use floor(360°/θ).
          </small>
        </section>
        <section className="mr-card mr-predict">
          <h2>Prediction before run</h2>
          <label>
            Predicted images{" "}
            <input
              aria-label="Predicted images"
              inputMode="numeric"
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
            />
          </label>
          <button
            onClick={() =>
              setFeedback(
                Number(prediction) === result.imageCount
                  ? "Prediction matches the two-mirror result."
                  : `Calculated result: ${result.imageCount} images using ${result.rule}.`,
              )
            }
          >
            Check prediction
          </button>
        </section>
        <div className="mr-presets">
          <button onClick={() => setAngleDeg(90)}>Periscope · 90°</button>
          <button onClick={() => setAngleDeg(60)}>5 images · 60°</button>
          <button onClick={() => setAngleDeg(45)}>7 images · 45°</button>
          <button onClick={() => setAngleDeg(40)}>Odd boundary · 40°</button>
        </div>
      </footer>
    </section>
  );
}
