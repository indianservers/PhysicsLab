import {
  useEffect,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  alignedObserver,
  solvePlaneMirror,
  type Vec2,
} from "./reflection-plane-mirrorSimulation";
import "./reflection-plane-mirror.css";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const round = (value: number, digits = 1) => Number(value.toFixed(digits));
const toScreen = (point: Vec2) => ({
  x: 450 + point.x * 18,
  y: 240 - point.y * 16,
});
const add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });
const scale = (a: Vec2, value: number): Vec2 => ({
  x: a.x * value,
  y: a.y * value,
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
    <label className="pm-range">
      <span>
        <b>{label}</b>
        <output aria-label={`${label} ${value}`}>
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
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Pin({
  point,
  image = false,
  selected = false,
  mirrorAngle = 0,
}: {
  point: Vec2;
  image?: boolean;
  selected?: boolean;
  mirrorAngle?: number;
}) {
  const p = toScreen(point);
  const reflectionTransform = image
    ? `translate(${p.x} ${p.y}) rotate(${mirrorAngle - 90}) scale(1 -1) rotate(${90 - mirrorAngle})`
    : `translate(${p.x} ${p.y})`;
  return (
    <g
      className={`pm-pin ${image ? "image" : ""}`}
      transform={reflectionTransform}
    >
      <path d="M -7 13 L -5 -14 Q 0 -26 5 -14 L 7 13 Z" />
      <path className="flame" d="M 0 -32 Q 10 -20 0 -12 Q -9 -20 0 -32 Z" />
      <ellipse cy="15" rx="11" ry="4" />
      <path className="side-mark" d="M -15 -2 L -7 -7 L -7 3 Z" />
      {selected && <circle className="selected-point" cy="-30" r="5" />}
    </g>
  );
}

export function ReflectionPlaneMirrorLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [mirrorAngle, setMirrorAngle] = useState(0);
  const [object, setObject] = useState<Vec2>({ x: -12, y: -2 });
  const [observer, setObserver] = useState<Vec2>({ x: -12, y: 6 });
  const [rayAngle, setRayAngle] = useState(15);
  const [phase, setPhase] = useState(1);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showConstruction, setShowConstruction] = useState(true);
  const [drag, setDrag] = useState<
    "object" | "observer" | "mirror" | "ray" | null
  >(null);
  const [prediction, setPrediction] = useState("");
  const [feedback, setFeedback] = useState("");

  const result = solvePlaneMirror({
    mirrorAngleDeg: mirrorAngle,
    object,
    observer,
    rayAngleDeg: rayAngle,
  });
  const missionPass =
    result.probeHitsMirror &&
    result.selectedPointVisible &&
    result.observerMissCm <= 0.8;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setPhase((current) => {
          const next = Math.min(
            1,
            current + (reducedMotion ? 0.14 : 0.025) * speed,
          );
          if (next >= 1) setRunning(false);
          return next;
        }),
      reducedMotion ? 170 : 35,
    );
    return () => window.clearInterval(id);
  }, [running, speed, reducedMotion]);

  const reset = () => {
    setMirrorAngle(0);
    setObject({ x: -12, y: -2 });
    setObserver({ x: -12, y: 6 });
    setRayAngle(15);
    setPhase(1);
    setRunning(false);
    setSpeed(1);
    setReducedMotion(false);
    setShowConstruction(true);
    setDrag(null);
    setPrediction("");
    setFeedback("");
  };

  const pointerToWorld = (event: PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const sx = ((event.clientX - bounds.left) / bounds.width) * 900;
    const sy = ((event.clientY - bounds.top) / bounds.height) * 480;
    return { x: (sx - 450) / 18, y: (240 - sy) / 16 };
  };
  const pointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const point = pointerToWorld(event);
    if (drag === "object")
      setObject({ x: clamp(point.x, -18, -4), y: clamp(point.y, -8, 8) });
    if (drag === "observer")
      setObserver({ x: clamp(point.x, -18, -4), y: clamp(point.y, -9, 9) });
    if (drag === "mirror") {
      const angle = (Math.atan2(point.x, point.y) * 180) / Math.PI;
      setMirrorAngle(round(clamp(angle, -20, 20), 0));
    }
    if (drag === "ray") {
      const angle =
        (Math.atan2(point.y - object.y, point.x - object.x) * 180) / Math.PI;
      setRayAngle(round(clamp(angle, -35, 35), 0));
    }
    setFeedback("");
  };
  const startDrag = (
    kind: "object" | "observer" | "mirror" | "ray",
    event: PointerEvent<SVGGElement>,
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag(kind);
  };
  const moveWithKeys = (
    kind: "object" | "observer",
    event: KeyboardEvent<SVGGElement>,
  ) => {
    const delta: Vec2 = {
      x:
        event.key === "ArrowLeft" ? -0.5 : event.key === "ArrowRight" ? 0.5 : 0,
      y: event.key === "ArrowDown" ? -0.5 : event.key === "ArrowUp" ? 0.5 : 0,
    };
    if (!delta.x && !delta.y) return;
    event.preventDefault();
    const setter = kind === "object" ? setObject : setObserver;
    setter((current) => ({
      x: clamp(current.x + delta.x, -18, -4),
      y: clamp(
        current.y + delta.y,
        kind === "object" ? -8 : -9,
        kind === "object" ? 8 : 9,
      ),
    }));
    setFeedback("");
  };
  const adjustWithKeys = (
    kind: "mirror" | "ray",
    event: KeyboardEvent<SVGGElement>,
  ) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const delta = event.key === "ArrowLeft" ? -1 : 1;
    if (kind === "mirror")
      setMirrorAngle((value) => clamp(value + delta, -20, 20));
    else setRayAngle((value) => clamp(value + delta, -35, 35));
    setFeedback("");
  };

  const mirrorStart = toScreen(
    scale(result.tangent, -result.mirrorHalfHeightCm),
  );
  const mirrorEnd = toScreen(scale(result.tangent, result.mirrorHalfHeightCm));
  const normalStart = toScreen(scale(result.normal, -4));
  const normalEnd = toScreen(scale(result.normal, 4));
  const objectScreen = toScreen(object);
  const observerScreen = toScreen(observer);
  const probeScreen = toScreen(result.probeHit);
  const reflectedEnd = toScreen(
    add(result.probeHit, scale(result.reflectedDirection, 18)),
  );
  const sightScreen = toScreen(result.sightHit);
  const imageScreen = toScreen(result.selectedImagePoint);
  const rayHandle = toScreen(add(object, scale(result.incidentDirection, 6)));
  const objectFoot = toScreen(subAlongNormal(object, result.normal));
  const imageFoot = toScreen(subAlongNormal(result.image, result.normal));

  return (
    <section
      className="pm-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="pm-header">
        <div>
          <span>RAY BOX &amp; PIN-PARALLAX BENCH · 2D</span>
          <h1>Reflection by Plane Mirror</h1>
          <p>
            Move the candle, ray, mirror, and eye; the construction follows one
            geometry.
          </p>
        </div>
        <div className={`pm-verdict ${missionPass ? "ready" : ""}`}>
          {missionPass
            ? "SELECTED POINT VISIBLE"
            : result.probeHitsMirror
              ? "ALIGN THE EYE"
              : "RAY MISSES MIRROR"}
        </div>
      </header>

      <div className="pm-grid">
        <aside
          className="pm-controls"
          aria-label="Object, mirror, ray, and observer controls"
        >
          <section>
            <h2>
              <span>1</span> Object candle
            </h2>
            <Range
              label="Object x"
              value={object.x}
              min={-18}
              max={-4}
              step={0.5}
              unit="cm"
              onChange={(x) => setObject({ ...object, x })}
            />
            <Range
              label="Object y"
              value={object.y}
              min={-8}
              max={8}
              step={0.5}
              unit="cm"
              onChange={(y) => setObject({ ...object, y })}
            />
          </section>
          <section>
            <h2>
              <span>2</span> Mirror &amp; ray
            </h2>
            <Range
              label="Mirror angle"
              value={mirrorAngle}
              min={-20}
              max={20}
              step={1}
              unit="°"
              onChange={setMirrorAngle}
            />
            <Range
              label="Ray direction"
              value={rayAngle}
              min={-35}
              max={35}
              step={1}
              unit="°"
              onChange={setRayAngle}
            />
          </section>
          <section>
            <h2>
              <span>3</span> Observer eye
            </h2>
            <Range
              label="Observer x"
              value={observer.x}
              min={-18}
              max={-4}
              step={0.5}
              unit="cm"
              onChange={(x) => setObserver({ ...observer, x })}
            />
            <Range
              label="Observer y"
              value={observer.y}
              min={-9}
              max={9}
              step={0.5}
              unit="cm"
              onChange={(y) => setObserver({ ...observer, y })}
            />
            <label className="pm-check">
              <input
                type="checkbox"
                checked={showConstruction}
                onChange={(event) => setShowConstruction(event.target.checked)}
              />{" "}
              Show construction
            </label>
          </section>
        </aside>

        <main className="pm-workspace">
          <div className="pm-stage-heading">
            <div>
              <span>EXPERIMENT</span>
              <h2>Equal angles · symmetric image</h2>
            </div>
            <div>
              <strong>
                {result.incidenceAngleDeg.toFixed(1)}° ={" "}
                {result.reflectionAngleDeg.toFixed(1)}°
              </strong>
              <small>incidence = reflection</small>
            </div>
          </div>
          <div className="pm-board">
            <img
              src="/assets/experiments/reflection-plane-mirror/ray-optics-board.png"
              alt="Transparent framed ray-optics board"
            />
            <svg
              viewBox="0 0 900 480"
              role="img"
              aria-label={`Plane mirror diagram. Incidence ${result.incidenceAngleDeg.toFixed(1)} degrees, reflection ${result.reflectionAngleDeg.toFixed(1)} degrees, object and image distance ${result.objectNormalDistanceCm.toFixed(1)} centimetres.`}
              onPointerMove={pointerMove}
              onPointerUp={() => setDrag(null)}
              onPointerCancel={() => setDrag(null)}
            >
              <defs>
                <marker
                  id="pm-arrow-orange"
                  markerWidth="7"
                  markerHeight="7"
                  refX="5"
                  refY="3.5"
                  orient="auto"
                >
                  <path d="M0 0 L7 3.5 L0 7 Z" fill="#ec6b16" />
                </marker>
                <marker
                  id="pm-arrow-blue"
                  markerWidth="7"
                  markerHeight="7"
                  refX="5"
                  refY="3.5"
                  orient="auto"
                >
                  <path d="M0 0 L7 3.5 L0 7 Z" fill="#1667aa" />
                </marker>
              </defs>
              <line
                className="pm-normal"
                x1={normalStart.x}
                y1={normalStart.y}
                x2={normalEnd.x}
                y2={normalEnd.y}
              />
              {result.probeHitsMirror && (
                <>
                  <line
                    className="pm-incident"
                    x1={objectScreen.x}
                    y1={objectScreen.y}
                    x2={probeScreen.x}
                    y2={probeScreen.y}
                    opacity={phase > 0.08 ? 1 : 0.1}
                  />
                  <line
                    className="pm-reflected"
                    x1={probeScreen.x}
                    y1={probeScreen.y}
                    x2={reflectedEnd.x}
                    y2={reflectedEnd.y}
                    opacity={phase > 0.4 ? 1 : 0.08}
                  />
                  <circle
                    className="pm-hit"
                    cx={probeScreen.x}
                    cy={probeScreen.y}
                    r="6"
                  />
                  <text
                    className="pm-angle-label"
                    x={probeScreen.x - 58}
                    y={probeScreen.y - 18}
                  >
                    i {result.incidenceAngleDeg.toFixed(1)}°
                  </text>
                  <text
                    className="pm-angle-label blue"
                    x={probeScreen.x - 52}
                    y={probeScreen.y + 34}
                  >
                    r {result.reflectionAngleDeg.toFixed(1)}°
                  </text>
                </>
              )}
              {!result.probeHitsMirror && (
                <line
                  className="pm-missed"
                  x1={objectScreen.x}
                  y1={objectScreen.y}
                  x2={rayHandle.x}
                  y2={rayHandle.y}
                />
              )}
              {showConstruction && (
                <g opacity={phase > 0.68 ? 1 : 0.08}>
                  <line
                    className="pm-sight"
                    x1={observerScreen.x}
                    y1={observerScreen.y}
                    x2={sightScreen.x}
                    y2={sightScreen.y}
                  />
                  <line
                    className="pm-extension"
                    x1={sightScreen.x}
                    y1={sightScreen.y}
                    x2={imageScreen.x}
                    y2={imageScreen.y}
                  />
                  <line
                    className="pm-distance"
                    x1={objectScreen.x}
                    y1={objectScreen.y + 52}
                    x2={objectFoot.x}
                    y2={objectFoot.y + 52}
                  />
                  <line
                    className="pm-distance image-distance"
                    x1={imageFoot.x}
                    y1={imageFoot.y + 52}
                    x2={toScreen(result.image).x}
                    y2={toScreen(result.image).y + 52}
                  />
                  <text
                    className="pm-distance-label"
                    x={(objectScreen.x + objectFoot.x) / 2 - 24}
                    y={(objectScreen.y + objectFoot.y) / 2 + 70}
                  >
                    dₒ {result.objectNormalDistanceCm.toFixed(1)} cm
                  </text>
                  <text
                    className="pm-distance-label blue"
                    x={(imageScreen.x + imageFoot.x) / 2 - 24}
                    y={(imageScreen.y + imageFoot.y) / 2 + 70}
                  >
                    dᵢ {result.imageNormalDistanceCm.toFixed(1)} cm
                  </text>
                </g>
              )}
              <Pin point={object} selected />
              <Pin point={result.image} image mirrorAngle={mirrorAngle} />
              <g
                className="pm-eye"
                transform={`translate(${observerScreen.x} ${observerScreen.y})`}
              >
                <path d="M -22 0 Q 0 -19 22 0 Q 0 19 -22 0 Z" />
                <circle r="8" />
                <circle r="3" />
              </g>
              <line
                className="pm-mirror-shadow"
                x1={mirrorStart.x}
                y1={mirrorStart.y}
                x2={mirrorEnd.x}
                y2={mirrorEnd.y}
              />
              <line
                className="pm-mirror"
                x1={mirrorStart.x}
                y1={mirrorStart.y}
                x2={mirrorEnd.x}
                y2={mirrorEnd.y}
              />
              <g
                className="pm-handle"
                role="button"
                tabIndex={0}
                aria-label="Movable candle; use arrow keys"
                transform={`translate(${objectScreen.x} ${objectScreen.y})`}
                onPointerDown={(event) => startDrag("object", event)}
                onKeyDown={(event) => moveWithKeys("object", event)}
              >
                <circle r="28" />
              </g>
              <g
                className="pm-handle"
                role="button"
                tabIndex={0}
                aria-label="Movable observer; use arrow keys"
                transform={`translate(${observerScreen.x} ${observerScreen.y})`}
                onPointerDown={(event) => startDrag("observer", event)}
                onKeyDown={(event) => moveWithKeys("observer", event)}
              >
                <circle r="30" />
              </g>
              <g
                className="pm-handle"
                role="button"
                tabIndex={0}
                aria-label="Rotatable mirror; use left and right arrow keys"
                onPointerDown={(event) => startDrag("mirror", event)}
                onKeyDown={(event) => adjustWithKeys("mirror", event)}
              >
                <line
                  x1={mirrorStart.x}
                  y1={mirrorStart.y}
                  x2={mirrorEnd.x}
                  y2={mirrorEnd.y}
                />
                <circle cx="450" cy="240" r="24" />
              </g>
              <g
                className="pm-handle ray-handle"
                role="button"
                tabIndex={0}
                aria-label="Rotatable incident ray; use left and right arrow keys"
                transform={`translate(${rayHandle.x} ${rayHandle.y})`}
                onPointerDown={(event) => startDrag("ray", event)}
                onKeyDown={(event) => adjustWithKeys("ray", event)}
              >
                <circle r="18" />
              </g>
            </svg>
          </div>
          <div className="pm-transport">
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
                setRunning((value) => !value);
              }}
            >
              {running ? "Pause" : "Play construction"}
            </button>
            <button
              onClick={() => {
                setRunning(false);
                setPhase((value) => Math.min(1, value + 1 / 3));
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
        </main>

        <aside className="pm-readings" aria-label="Live mirror measurements">
          <h2>Measurements</h2>
          <section>
            <h3>Angles</h3>
            <div>
              <span>Incident angle (i)</span>
              <b>{result.incidenceAngleDeg.toFixed(1)}°</b>
            </div>
            <div>
              <span>Reflected angle (r)</span>
              <b>{result.reflectionAngleDeg.toFixed(1)}°</b>
            </div>
            <div>
              <span>i − r</span>
              <b className="ok">{result.angleResidualDeg.toFixed(2)}°</b>
            </div>
          </section>
          <section>
            <h3>Perpendicular distances</h3>
            <div>
              <span>Object distance dₒ</span>
              <b>{result.objectNormalDistanceCm.toFixed(1)} cm</b>
            </div>
            <div>
              <span>Image distance dᵢ</span>
              <b>{result.imageNormalDistanceCm.toFixed(1)} cm</b>
            </div>
            <div>
              <span>dₒ − dᵢ</span>
              <b className="ok">{result.distanceResidualCm.toFixed(2)} cm</b>
            </div>
          </section>
          <section>
            <h3>Image</h3>
            <div>
              <span>Type</span>
              <b>Virtual</b>
            </div>
            <div>
              <span>Orientation</span>
              <b>Upright</b>
            </div>
            <div>
              <span>Size</span>
              <b>Same size</b>
            </div>
            <div>
              <span>Left–right</span>
              <b>Laterally inverted</b>
            </div>
          </section>
          <section
            className={result.selectedPointVisible ? "visible" : "blocked"}
          >
            <h3>Selected flame point</h3>
            <p>
              {result.selectedPointVisible
                ? "Sightline reaches the finite mirror."
                : "Sightline falls outside the mirror."}
            </p>
            <b>
              {Number.isFinite(result.observerMissCm)
                ? `${result.observerMissCm.toFixed(1)} cm from ray`
                : "Probe ray misses"}
            </b>
          </section>
        </aside>
      </div>

      <div className="pm-bottom">
        <section className="pm-card pm-law">
          <span>PHYSICS PRINCIPLE</span>
          <h2>One reflection, three checks</h2>
          <div>
            <b>θᵢ = θᵣ</b>
            <b>dₒ = dᵢ</b>
            <b>normal coordinate reverses</b>
          </div>
          <p>
            Angles are measured from the normal—not from the mirror surface.
          </p>
        </section>
        <section className="pm-card pm-mission">
          <span>CHALLENGE</span>
          <h2>Align the eye with the selected flame point</h2>
          <p>
            Move the observer onto the reflected probe ray while the sightline
            still meets the finite mirror.
          </p>
          <div>
            <button
              onClick={() => {
                const next = alignedObserver({
                  mirrorAngleDeg: mirrorAngle,
                  object,
                  observer,
                  rayAngleDeg: rayAngle,
                });
                setObserver({
                  x: clamp(next.x, -18, -4),
                  y: clamp(next.y, -9, 9),
                });
                setFeedback("");
              }}
            >
              Load alignment setup
            </button>
            <button
              className="check"
              onClick={() =>
                setFeedback(
                  missionPass
                    ? `Mission complete — the eye is ${result.observerMissCm.toFixed(2)} cm from the reflected ray.`
                    : !result.probeHitsMirror
                      ? "The incident ray misses the finite mirror. Aim it toward the mirror first."
                      : !result.selectedPointVisible
                        ? "The selected flame point is outside the eye's mirror window. Move the eye vertically."
                        : `The eye is ${result.observerMissCm.toFixed(1)} cm from the reflected ray. Move it onto the blue path.`,
                )
              }
            >
              Check alignment
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
        <section className="pm-card pm-predict">
          <span>PREDICT BEFORE YOU RUN</span>
          <h2>Image distance</h2>
          <label>
            If dₒ = {result.objectNormalDistanceCm.toFixed(1)} cm, dᵢ is{" "}
            <input
              aria-label="Predicted image distance"
              inputMode="decimal"
              value={prediction}
              onChange={(event) => setPrediction(event.target.value)}
            />{" "}
            cm
          </label>
          <button
            onClick={() =>
              setFeedback(
                Math.abs(Number(prediction) - result.imageNormalDistanceCm) <=
                  0.2
                  ? "Prediction correct — a plane mirror places the virtual image equally far behind it."
                  : `Calculated image distance: ${result.imageNormalDistanceCm.toFixed(1)} cm.`,
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

function subAlongNormal(point: Vec2, normal: Vec2) {
  return add(point, scale(normal, -dotPoint(point, normal)));
}

function dotPoint(a: Vec2, b: Vec2) {
  return a.x * b.x + a.y * b.y;
}
