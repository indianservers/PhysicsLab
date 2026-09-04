import { useEffect, useMemo, useState, type PointerEvent } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  compileJourney,
  sampleJourney,
  type DirectionMode,
  type JourneySegment,
} from "./distanceTimeSimulation";
import "./distance-time-graph.css";

const DEFAULTS: JourneySegment[] = [
  { id: 1, durationS: 1, speedMps: 0 },
  { id: 2, durationS: 2, speedMps: 1.5 },
  { id: 3, durationS: 1, speedMps: 4.5 },
];
const f = (n: number, d = 1) => n.toFixed(d);
export function DistanceTimeGraphLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [segments, setSegments] = useState(DEFAULTS),
    [mode, setMode] = useState<DirectionMode>("distance"),
    [selected, setSelected] = useState(1),
    [draftDuration, setDraftDuration] = useState(2),
    [draftSlope, setDraftSlope] = useState(2),
    [time, setTime] = useState(0),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [dragging, setDragging] = useState<number | null>(null),
    [mission, setMission] = useState(false),
    [feedback, setFeedback] = useState("");
  const journey = useMemo(
      () => compileJourney(segments, mode),
      [segments, mode],
    ),
    sample = useMemo(
      () => sampleJourney(segments, time, mode),
      [segments, time, mode],
    );
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setTime((old) => {
          const next = old + (reduced ? 0.15 : 0.04) * speed;
          if (next >= journey.totalTimeS) {
            setRunning(false);
            return journey.totalTimeS;
          }
          return next;
        }),
      reduced ? 170 : 40,
    );
    return () => clearInterval(id);
  }, [journey.totalTimeS, reduced, running, speed]);
  const replace = (id: number, change: Partial<JourneySegment>) => {
    setSegments((old) =>
      old.map((s) => (s.id === id ? { ...s, ...change } : s)),
    );
    setFeedback("");
  };
  const add = (pause = false) => {
    const id = Math.max(0, ...segments.map((s) => s.id)) + 1;
    setSegments((old) => [
      ...old,
      { id, durationS: draftDuration, speedMps: pause ? 0 : draftSlope },
    ]);
    setSelected(id);
    setFeedback(
      pause
        ? "Horizontal segment added: the vehicle rests while time continues."
        : "",
    );
  };
  const reset = () => {
    setSegments(DEFAULTS);
    setMode("distance");
    setSelected(1);
    setTime(0);
    setRunning(false);
    setMission(false);
    setFeedback("");
  };
  const points = [
    [0, 0],
    ...journey.intervals.map((s) => [s.endTimeS, s.endDistanceM]),
  ] as [number, number][];
  const values = points.map((p) => p[1]),
    minD = Math.min(0, ...values) - 1,
    maxD = Math.max(1, ...values) + 1,
    spanD = maxD - minD,
    maxT = Math.max(1, journey.totalTimeS),
    gx = (t: number) => 48 + (t / maxT) * 440,
    gy = (d: number) => 280 - ((d - minD) / spanD) * 240,
    poly = points.map((p) => `${gx(p[0])},${gy(p[1])}`).join(" ");
  const move = (e: PointerEvent<SVGSVGElement>) => {
    if (dragging === null) return;
    const box = e.currentTarget.getBoundingClientRect(),
      y = ((e.clientY - box.top) / box.height) * 320,
      target = minD + ((280 - y) / 240) * spanD,
      interval = journey.intervals[dragging],
      newSpeed = (target - interval.startDistanceM) / interval.durationS;
    replace(interval.id, {
      speedMps: Math.max(mode === "distance" ? 0 : -5, Math.min(5, newSpeed)),
    });
  };
  const applyMission = () => {
    setSegments([
      { id: 1, durationS: 2, speedMps: 1 },
      { id: 2, durationS: 2, speedMps: 0 },
      { id: 3, durationS: 1, speedMps: 4 },
    ]);
    setMode("distance");
    setTime(0);
    setFeedback("");
  };
  const check = () => {
    const rests = segments.some((s) => Math.abs(s.speedMps) < 0.05),
      moving = segments
        .filter((s) => Math.abs(s.speedMps) >= 0.05)
        .map((s) => Math.abs(s.speedMps)),
      pass =
        rests &&
        moving.length >= 2 &&
        Math.max(...moving) - Math.min(...moving) >= 1.5;
    setFeedback(
      pass
        ? "✓ Journey includes rest, slow motion and fast motion; every join is continuous."
        : "Include one horizontal rest plus two moving segments whose speeds differ by at least 1.5 m/s.",
    );
  };
  const range = Math.max(1, maxD - minD),
    vehiclePct = 8 + ((sample.distanceM - minD) / range) * 84;
  return (
    <section
      className="dt-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header>
        <div>
          <span>KINEMATICS · GRAPH → MOTION</span>
          <h2>Split Interactive Motion Studio</h2>
          <p>
            Build a continuous journey; the vehicle follows the graph slope.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="dt-summary">
        <b>
          {f(sample.timeS)} s<small>TIME</small>
        </b>
        <b>
          {f(sample.distanceM)} m
          <small>{mode === "distance" ? "DISTANCE" : "POSITION"}</small>
        </b>
        <b>
          {f(sample.speedMps)} m/s<small>SLOPE / SPEED</small>
        </b>
        <b>
          Segment {sample.segmentIndex + 1}
          <small>
            {Math.abs(sample.speedMps) < 0.01
              ? "AT REST"
              : sample.speedMps > 0
                ? "FORWARD"
                : "RETURNING"}
          </small>
        </b>
      </div>
      <div className="dt-layout">
        <aside className="dt-controls">
          <h3>Journey builder</h3>
          <span className="dt-label">Direction mode</span>
          <div className="dt-toggle">
            <button
              className={mode === "distance" ? "active" : ""}
              onClick={() => {
                setMode("distance");
                setSegments((old) =>
                  old.map((s) => ({ ...s, speedMps: Math.max(0, s.speedMps) })),
                );
              }}
            >
              Distance only
            </button>
            <button
              className={mode === "position" ? "active" : ""}
              onClick={() => setMode("position")}
            >
              Position / return
            </button>
          </div>
          <label>
            Segment duration <b>{f(draftDuration)} s</b>
            <input
              aria-label="Segment duration"
              type="range"
              min=".5"
              max="6"
              step=".5"
              value={draftDuration}
              onChange={(e) => setDraftDuration(Number(e.target.value))}
            />
          </label>
          <label>
            Segment slope <b>{f(draftSlope)} m/s</b>
            <input
              aria-label="Segment slope"
              type="range"
              min={mode === "distance" ? 0 : -5}
              max="5"
              step=".5"
              value={draftSlope}
              onChange={(e) => setDraftSlope(Number(e.target.value))}
            />
          </label>
          <div className="dt-add">
            <button onClick={() => add(false)}>+ Motion</button>
            <button onClick={() => add(true)}>+ Pause</button>
          </div>
          <p className="dt-warning">
            Vertical jumps are impossible: distance cannot change when Δt = 0.
            Every new segment begins at the previous endpoint.
          </p>
          <h3>Segments</h3>
          <div className="dt-segments">
            {journey.intervals.map((s, i) => (
              <button
                key={s.id}
                className={selected === s.id ? "active" : ""}
                onClick={() => setSelected(s.id)}
              >
                <b>{i + 1}</b>
                <span>
                  {f(s.durationS)} s · {f(s.speedMps)} m/s
                </span>
              </button>
            ))}
          </div>
          {journey.intervals.some((segment) => segment.id === selected) && (
            <button
              className="dt-remove"
              onClick={() =>
                setSegments((old) =>
                  old.filter((segment) => segment.id !== selected),
                )
              }
            >
              Remove selected
            </button>
          )}
        </aside>
        <main className="dt-main">
          <section
            className="dt-road"
            aria-label={`Vehicle at ${f(sample.distanceM)} metres moving at ${f(sample.speedMps)} metres per second`}
          >
            <img
              className="track"
              src="/assets/experiments/distance-time-graph/motion-track.png"
              alt="Transparent classroom motion track"
            />
            <div className="markers">
              {Array.from({ length: 11 }, (_, i) => (
                <i key={i} style={{ left: `${6 + i * 8.7}%` }}>
                  {i}
                </i>
              ))}
            </div>
            <img
              className="vehicle"
              src="/assets/experiments/distance-time-graph/robot-cart.png"
              alt="Robot cart"
              style={{
                left: `${Math.max(4, Math.min(90, vehiclePct))}%`,
                transform: `translateX(-50%) scaleX(${sample.speedMps < 0 ? -1 : 1})`,
              }}
            />
            <span className="direction">
              {sample.speedMps < 0
                ? "← return"
                : sample.speedMps > 0
                  ? "forward →"
                  : "rest"}
            </span>
          </section>
          <div className="dt-toolbar">
            <div>
              <button onClick={() => setRunning(true)}>▶ Play</button>
              <button onClick={() => setRunning(false)}>Ⅱ Pause</button>
              <button
                onClick={() => {
                  setRunning(false);
                  setTime((t) => Math.min(journey.totalTimeS, t + 0.1));
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
          <input
            className="dt-scrub"
            aria-label="Playback time"
            type="range"
            min="0"
            max={journey.totalTimeS}
            step=".01"
            value={time}
            onChange={(e) => {
              setRunning(false);
              setTime(Number(e.target.value));
            }}
          />
        </main>
        <aside className="dt-graph">
          <h3>
            Distance–Time Graph <small>slope = Δd / Δt</small>
          </h3>
          <svg
            viewBox="0 0 520 320"
            aria-label="Editable piecewise distance time graph"
            onPointerMove={move}
            onPointerUp={() => setDragging(null)}
          >
            <line className="axis" x1="48" y1="280" x2="500" y2="280" />
            <line className="axis" x1="48" y1="25" x2="48" y2="280" />
            <text x="470" y="305">
              time (s)
            </text>
            <text x="8" y="20">
              d (m)
            </text>
            <polyline className="journey" points={poly} />
            {points.map((p, i) => (
              <circle
                key={i}
                className="graph-point"
                cx={gx(p[0])}
                cy={gy(p[1])}
                r="8"
                role={i ? "slider" : undefined}
                tabIndex={i ? 0 : undefined}
                aria-label={i ? `Segment ${i} endpoint` : undefined}
                onPointerDown={
                  i
                    ? (e) => {
                        setDragging(i - 1);
                        e.currentTarget.setPointerCapture(e.pointerId);
                      }
                    : undefined
                }
                onKeyDown={
                  i
                    ? (e) => {
                        if (e.key === "ArrowUp")
                          replace(journey.intervals[i - 1].id, {
                            speedMps: journey.intervals[i - 1].speedMps + 0.25,
                          });
                        if (e.key === "ArrowDown")
                          replace(journey.intervals[i - 1].id, {
                            speedMps: journey.intervals[i - 1].speedMps - 0.25,
                          });
                      }
                    : undefined
                }
              />
            ))}
            <line
              className="cursor"
              x1={gx(sample.timeS)}
              x2={gx(sample.timeS)}
              y1="25"
              y2="280"
            />
            <circle
              className="cursor-dot"
              cx={gx(sample.timeS)}
              cy={gy(sample.distanceM)}
              r="6"
            />
          </svg>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Δt</th>
                <th>Δd</th>
                <th>slope</th>
              </tr>
            </thead>
            <tbody>
              {journey.intervals.map((s, i) => (
                <tr key={s.id}>
                  <td>{i + 1}</td>
                  <td>{f(s.durationS)} s</td>
                  <td>{f(s.endDistanceM - s.startDistanceM)} m</td>
                  <td>{f(s.speedMps)} m/s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>
      </div>
      <section className="dt-mission">
        <div>
          <span>CHALLENGE</span>
          <b>Draw rest, slow motion and fast motion.</b>
          <small>
            The journey must stay continuous and use metres, seconds and m/s.
          </small>
        </div>
        <button
          onClick={() => {
            setMission(true);
            setFeedback("Build three distinct motion phases.");
          }}
        >
          Start challenge
        </button>
        {mission && <button onClick={applyMission}>Load valid journey</button>}
        {mission && <button onClick={check}>Check journey</button>}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
