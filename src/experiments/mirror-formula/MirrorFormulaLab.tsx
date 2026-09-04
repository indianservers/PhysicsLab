import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { solveMirror, type MirrorType } from "./mirrorFormulaSimulation";
import "./mirror-formula.css";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const pointOnLine = (
  x: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) => y1 + ((y2 - y1) * (x - x1)) / (x2 - x1 || 0.001);

function Control({
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
    <label className="mf-control">
      <span>
        <b>{label}</b>
        <output>
          {value.toFixed(step < 1 ? 1 : 0)} {unit}
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

export function MirrorFormulaLab({ experiment }: DedicatedExperimentLabProps) {
  const [mirrorType, setMirrorType] = useState<MirrorType>("concave");
  const [objectRailCm, setObjectRailCm] = useState(60),
    [mirrorOffsetCm, setMirrorOffsetCm] = useState(0),
    [focalLengthCm, setFocalLengthCm] = useState(20),
    [objectHeightCm, setObjectHeightCm] = useState(3),
    [apertureCm, setApertureCm] = useState(8);
  const [showAxis, setShowAxis] = useState(true),
    [showPoints, setShowPoints] = useState(true),
    [phase, setPhase] = useState(1),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(false),
    [drag, setDrag] = useState<"object" | "mirror" | null>(null),
    [prediction, setPrediction] = useState(""),
    [feedback, setFeedback] = useState("");
  const stageRef = useRef<HTMLDivElement>(null);
  const objectDistanceCm = clamp(objectRailCm + mirrorOffsetCm, 10, 100);
  const result = solveMirror({
    mirrorType,
    objectDistanceCm,
    focalLengthCm,
    objectHeightCm,
  });
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setPhase((p) => {
          const next = Math.min(1, p + (reduced ? 0.1 : 0.022) * speed);
          if (next >= 1) setRunning(false);
          return next;
        }),
      reduced ? 170 : 35,
    );
    return () => clearInterval(id);
  }, [running, speed, reduced]);
  const reset = () => {
    setMirrorType("concave");
    setObjectRailCm(60);
    setMirrorOffsetCm(0);
    setFocalLengthCm(20);
    setObjectHeightCm(3);
    setApertureCm(8);
    setShowAxis(true);
    setShowPoints(true);
    setPhase(1);
    setRunning(false);
    setSpeed(1);
    setReduced(false);
    setPrediction("");
    setFeedback("");
  };
  const poleX = 650 + mirrorOffsetCm * 4,
    axisY = 226,
    objectX = 650 - objectRailCm * 4,
    objectY = axisY - objectHeightCm * 15;
  const focalX = poleX + result.fCm * 4,
    centreX = poleX + result.radiusCm * 4;
  const imageXRaw = Number.isFinite(result.vCm) ? poleX + result.vCm * 4 : -999;
  const imageX = clamp(imageXRaw, 34, 866),
    imageY = Number.isFinite(result.imageHeightCm)
      ? axisY - result.imageHeightCm * 15
      : axisY;
  const secondHitY = pointOnLine(poleX, objectX, objectY, focalX, axisY);
  const reflectedEdgeY = pointOnLine(40, poleX, objectY, imageXRaw, imageY);
  const rayOpacity = (threshold: number) => (phase >= threshold ? 1 : 0.12);
  const graphPath = useMemo(() => {
    const pts: string[] = [];
    let drawing = false;
    for (let d = 10; d <= 100; d += 1) {
      const v = solveMirror({
        mirrorType,
        objectDistanceCm: d,
        focalLengthCm,
        objectHeightCm,
      }).vCm;
      if (!Number.isFinite(v) || Math.abs(v) > 105) {
        drawing = false;
        continue;
      }
      const x = 38 + ((100 - d) / 90) * 390,
        y = 95 - (v / 100) * 70;
      pts.push(`${drawing ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`);
      drawing = true;
    }
    return pts.join(" ");
  }, [mirrorType, focalLengthCm, objectHeightCm]);
  const pointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag || !stageRef.current) return;
    const box = stageRef.current.getBoundingClientRect(),
      x = ((e.clientX - box.left) / box.width) * 900;
    if (drag === "object")
      setObjectRailCm(
        clamp((650 - x) / 4, 10 - mirrorOffsetCm, 100 - mirrorOffsetCm),
      );
    else setMirrorOffsetCm(clamp((x - 650) / 4, -10, 10));
  };
  const keyboardMove = (
    target: "object" | "mirror",
    e: KeyboardEvent<SVGGElement>,
  ) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const delta = e.key === "ArrowLeft" ? -1 : 1;
    if (target === "object")
      setObjectRailCm((v) =>
        clamp(v - delta, 10 - mirrorOffsetCm, 100 - mirrorOffsetCm),
      );
    else setMirrorOffsetCm((v) => clamp(v + delta, -10, 10));
  };
  const setDistance = (value: number) =>
    setObjectRailCm(value - mirrorOffsetCm);
  const missionPass =
    mirrorType === "concave" &&
    result.isVirtual &&
    result.orientation === "upright" &&
    result.magnification > 1;
  return (
    <section
      className="mf-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="mf-hero">
        <div>
          <span>SPHERICAL MIRROR BENCH · 2D</span>
          <h1>{experiment.title}</h1>
          <p>
            Drag the object or mirror. Principal rays and signed readings update
            together.
          </p>
        </div>
        <div className="mf-sign">
          <small>SIGN CONVENTION</small>
          <b>New Cartesian</b>
        </div>
      </header>
      <div className="mf-layout">
        <aside className="mf-panel mf-controls">
          <h2>
            <i>1</i> Select mirror
          </h2>
          <div className="mf-mirror-tabs">
            <button
              className={mirrorType === "concave" ? "active" : ""}
              onClick={() => {
                setMirrorType("concave");
                setFeedback("");
              }}
            >
              ◖ Concave
            </button>
            <button
              className={mirrorType === "convex" ? "active" : ""}
              onClick={() => {
                setMirrorType("convex");
                setFeedback("");
              }}
            >
              ◗ Convex
            </button>
          </div>
          <h2>
            <i>2</i> Mirror controls
          </h2>
          <Control
            label="Focal length magnitude"
            value={focalLengthCm}
            min={10}
            max={40}
            step={1}
            unit="cm"
            onChange={setFocalLengthCm}
          />
          <Control
            label="Aperture diameter"
            value={apertureCm}
            min={4}
            max={12}
            step={1}
            unit="cm"
            onChange={setApertureCm}
          />
          <h2>
            <i>3</i> Object
          </h2>
          <Control
            label="Object distance"
            value={objectDistanceCm}
            min={10}
            max={100}
            step={1}
            unit="cm"
            onChange={setDistance}
          />
          <Control
            label="Object height"
            value={objectHeightCm}
            min={1}
            max={7}
            step={0.5}
            unit="cm"
            onChange={setObjectHeightCm}
          />
          <div className="mf-prediction">
            <b>Prediction before run</b>
            <label>
              Image distance (cm)
              <input
                value={prediction}
                inputMode="decimal"
                onChange={(e) => setPrediction(e.target.value)}
              />
            </label>
            <button
              onClick={() => {
                const guess = Number(prediction);
                setFeedback(
                  Number.isFinite(guess) &&
                    Number.isFinite(result.vCm) &&
                    Math.abs(guess - result.vCm) <= 2
                    ? "Prediction matches the signed image distance."
                    : `Compare signs: the calculated image distance is ${Number.isFinite(result.vCm) ? result.vCm.toFixed(1) : "∞"} cm.`,
                );
              }}
            >
              Check prediction
            </button>
            {feedback && <p role="status">{feedback}</p>}
          </div>
        </aside>
        <main className="mf-main">
          <section className="mf-stage mf-panel" ref={stageRef}>
            <div className="mf-stage-tools">
              <label>
                <input
                  type="checkbox"
                  checked={showAxis}
                  onChange={(e) => setShowAxis(e.target.checked)}
                />{" "}
                Principal axis
              </label>
              <button onClick={() => setShowPoints((v) => !v)}>
                {showPoints ? "Hide" : "Show"} points (P, F, C)
              </button>
            </div>
            <div className="mf-canvas">
              <img
                className="mf-asset mf-rail-part"
                src="/assets/experiments/mirror-formula/mirror-optical-bench.png"
                alt="Transparent spherical mirror optical bench"
              />
              <img
                className="mf-asset mf-object-part"
                style={{
                  transform: `translateX(${((objectX - 80) / 9).toFixed(2)}%)`,
                }}
                src="/assets/experiments/mirror-formula/mirror-optical-bench.png"
                alt=""
                aria-hidden="true"
              />
              {result.isReal && Number.isFinite(result.vCm) && (
                <img
                  className="mf-asset mf-screen-part"
                  style={{
                    transform: `translateX(${((imageX - 250) / 9).toFixed(2)}%)`,
                  }}
                  src="/assets/experiments/mirror-formula/mirror-optical-bench.png"
                  alt=""
                  aria-hidden="true"
                />
              )}
              <img
                className="mf-asset mf-mirror-part"
                style={{
                  transform: `translateX(${((poleX - 800) / 9).toFixed(2)}%)`,
                }}
                src="/assets/experiments/mirror-formula/mirror-optical-bench.png"
                alt=""
                aria-hidden="true"
              />
              <svg
                viewBox="0 0 900 430"
                onPointerMove={pointerMove}
                onPointerUp={() => setDrag(null)}
                onPointerLeave={() => setDrag(null)}
                aria-label={`Ray diagram: ${result.isReal ? "real" : result.isVirtual ? "virtual" : "infinite"}, ${result.orientation} ${result.size} image`}
              >
                {showAxis && (
                  <line
                    className="axis"
                    x1="24"
                    y1={axisY}
                    x2="880"
                    y2={axisY}
                  />
                )}
                {showPoints && (
                  <g className="points">
                    <circle cx={poleX} cy={axisY} r="4" />
                    <text x={poleX - 4} y={axisY + 22}>
                      P
                    </text>
                    <circle cx={focalX} cy={axisY} r="4" />
                    <text x={focalX - 4} y={axisY + 22}>
                      F
                    </text>
                    <circle cx={centreX} cy={axisY} r="4" />
                    <text x={centreX - 5} y={axisY + 22}>
                      C
                    </text>
                  </g>
                )}
                <path
                  className={`mirror ${mirrorType}`}
                  d={`M ${poleX + (mirrorType === "concave" ? 8 : -8)} ${axisY - apertureCm * 10} Q ${poleX + (mirrorType === "concave" ? -10 : 10)} ${axisY} ${poleX + (mirrorType === "concave" ? 8 : -8)} ${axisY + apertureCm * 10}`}
                />
                <g
                  className="object"
                  role="button"
                  tabIndex={0}
                  aria-label="Draggable object; use left and right arrow keys"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDrag("object");
                  }}
                  onKeyDown={(e) => keyboardMove("object", e)}
                >
                  <line x1={objectX} y1={axisY} x2={objectX} y2={objectY} />
                  <path
                    d={`M${objectX - 7} ${objectY + 10}L${objectX} ${objectY}L${objectX + 7} ${objectY + 10}`}
                  />
                </g>
                <g opacity={rayOpacity(0.1)}>
                  <line
                    className="incident red"
                    x1={objectX}
                    y1={objectY}
                    x2={poleX}
                    y2={objectY}
                  />
                  <line
                    className="incident blue"
                    x1={objectX}
                    y1={objectY}
                    x2={poleX}
                    y2={secondHitY}
                  />
                </g>
                <g opacity={rayOpacity(0.42)}>
                  {result.isReal ? (
                    <>
                      <line
                        className="reflected red"
                        x1={poleX}
                        y1={objectY}
                        x2={imageX}
                        y2={imageY}
                      />
                      <line
                        className="reflected blue"
                        x1={poleX}
                        y1={secondHitY}
                        x2={imageX}
                        y2={imageY}
                      />
                    </>
                  ) : (
                    <>
                      <line
                        className="reflected red"
                        x1={poleX}
                        y1={objectY}
                        x2="40"
                        y2={reflectedEdgeY}
                      />
                      <line
                        className="reflected blue"
                        x1={poleX}
                        y1={secondHitY}
                        x2="40"
                        y2={secondHitY}
                      />
                    </>
                  )}
                </g>
                {result.isVirtual && (
                  <g opacity={rayOpacity(0.72)}>
                    <line
                      className="extension red"
                      x1={poleX}
                      y1={objectY}
                      x2={imageX}
                      y2={imageY}
                    />
                    <line
                      className="extension blue"
                      x1={poleX}
                      y1={secondHitY}
                      x2={imageX}
                      y2={imageY}
                    />
                  </g>
                )}
                {Number.isFinite(result.vCm) && (
                  <g
                    className={`image ${result.isVirtual ? "virtual" : "real"}`}
                    opacity={rayOpacity(0.78)}
                  >
                    <line x1={imageX} y1={axisY} x2={imageX} y2={imageY} />
                    <path
                      d={`M${imageX - 7} ${imageY + (result.imageHeightCm >= 0 ? 10 : -10)}L${imageX} ${imageY}L${imageX + 7} ${imageY + (result.imageHeightCm >= 0 ? 10 : -10)}`}
                    />
                    <text x={imageX + 9} y={imageY}>
                      IMAGE
                    </text>
                  </g>
                )}
                <g
                  className="mirror-hit"
                  role="button"
                  tabIndex={0}
                  aria-label="Draggable mirror; use left and right arrow keys"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDrag("mirror");
                  }}
                  onKeyDown={(e) => keyboardMove("mirror", e)}
                >
                  <rect
                    x={poleX - 24}
                    y={axisY - 115}
                    width="48"
                    height="230"
                  />
                </g>
                <text
                  className="distance"
                  x={(objectX + poleX) / 2 - 30}
                  y={axisY + 62}
                >
                  u = {result.uCm.toFixed(1)} cm
                </text>
                <text
                  className="distance"
                  x={clamp((imageX + poleX) / 2 - 30, 40, 800)}
                  y={axisY + 86}
                >
                  v ={" "}
                  {Number.isFinite(result.vCm) ? result.vCm.toFixed(1) : "∞"} cm
                </text>
              </svg>
            </div>
            <div className="mf-transport">
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
                {running ? "Pause" : "Play rays"}
              </button>
              <button
                onClick={() => {
                  setRunning(false);
                  setPhase((v) => Math.min(1, v + 1 / 3));
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
          </section>
          <section className="mf-graph mf-panel">
            <div>
              <h2>u–v graph</h2>
              <svg
                viewBox="0 0 470 190"
                aria-label="Signed image distance versus signed object distance"
              >
                <line x1="38" y1="95" x2="442" y2="95" />
                <line x1="428" y1="25" x2="428" y2="170" />
                <line className="zero" x1="38" y1="95" x2="442" y2="95" />
                <path d={graphPath} />
                {Number.isFinite(result.vCm) && Math.abs(result.vCm) <= 100 && (
                  <circle
                    cx={38 + ((100 - objectDistanceCm) / 90) * 390}
                    cy={95 - (result.vCm / 100) * 70}
                    r="5"
                  />
                )}
                <text x="394" y="181">
                  u (cm)
                </text>
                <text x="4" y="18">
                  v (cm)
                </text>
              </svg>
            </div>
            <div className="mf-equation">
              <span>GOVERNING EQUATIONS</span>
              <b>1/f = 1/v + 1/u</b>
              <b>m = −v/u = h′/h</b>
              <small>All distances are signed from pole P.</small>
            </div>
          </section>
        </main>
        <aside className="mf-side">
          <section className="mf-panel mf-readings">
            <h2>Live readings</h2>
            <div>
              <span>u (object)</span>
              <b>{result.uCm.toFixed(1)} cm</b>
            </div>
            <div>
              <span>v (image)</span>
              <b>
                {Number.isFinite(result.vCm)
                  ? `${result.vCm.toFixed(1)} cm`
                  : "∞"}
              </b>
            </div>
            <div>
              <span>f (focus)</span>
              <b>{result.fCm.toFixed(1)} cm</b>
            </div>
            <div>
              <span>Magnification</span>
              <b>
                {Number.isFinite(result.magnification)
                  ? `${result.magnification.toFixed(2)}×`
                  : "∞"}
              </b>
            </div>
            <div>
              <span>Image height</span>
              <b>
                {Number.isFinite(result.imageHeightCm)
                  ? `${result.imageHeightCm.toFixed(2)} cm`
                  : "∞"}
              </b>
            </div>
            <div>
              <span>Nature</span>
              <b className="nature">
                {result.isReal
                  ? "Real"
                  : result.isVirtual
                    ? "Virtual"
                    : "At infinity"}
                , {result.orientation}
              </b>
            </div>
            <div>
              <span>Formula residual</span>
              <b>{result.equationResidual.toExponential(1)} cm⁻¹</b>
            </div>
          </section>
          <section className="mf-panel mf-mission">
            <span>CHALLENGE</span>
            <h2>Magnified upright image</h2>
            <p>
              Use a concave mirror to make a virtual, upright image larger than
              the object.
            </p>
            <button
              onClick={() => {
                setMirrorType("concave");
                setFocalLengthCm(20);
                setMirrorOffsetCm(0);
                setObjectRailCm(12);
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
                    ? `Mission complete — ${result.magnification.toFixed(2)}× upright virtual image.`
                    : "Move the object between P and F: |u| must be less than |f|.",
                )
              }
            >
              Check result
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
    </section>
  );
}
