import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { bohrTransition, levelEnergyEv } from "./bohrModelSimulation";
import "./bohr-model.css";
const f = (n: number, d = 2) => (Number.isFinite(n) ? n.toFixed(d) : "—");
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const atomNames: Record<number, string> = {
  1: "Hydrogen",
  2: "He⁺",
  3: "Li²⁺",
};
function wavelengthColor(nm: number) {
  if (nm < 380 || nm > 750) return "#aab2c8";
  if (nm < 440) return `hsl(${270 - (nm - 380) * 0.8} 90% 62%)`;
  if (nm < 510) return `hsl(${240 - (nm - 440) * 1.7} 90% 55%)`;
  if (nm < 580) return `hsl(${120 - (nm - 510) * 1.25} 92% 48%)`;
  if (nm < 645) return `hsl(${60 - (nm - 580) * 0.92} 96% 52%)`;
  return "#f12b3d";
}
export function BohrModelLab({ experiment }: DedicatedExperimentLabProps) {
  const runId = useRef(0);
  const completedRunId = useRef(0);
  const [z, setZ] = useState(1),
    [initial, setInitial] = useState(4),
    [finalLevel, setFinalLevel] = useState(2),
    [progress, setProgress] = useState(0),
    [running, setRunning] = useState(false),
    [speed, setSpeed] = useState(1),
    [reduced, setReduced] = useState(false),
    [history, setHistory] = useState<
      { from: number; to: number; nm: number; kind: string }[]
    >([]),
    [mission, setMission] = useState(false),
    [feedback, setFeedback] = useState("");
  const transition = bohrTransition({
    atomicNumber: z,
    initialLevel: initial,
    finalLevel,
  });
  const trigger = (targetLevel = finalLevel) => {
    if (initial === targetLevel) {
      setFeedback("Choose two different allowed levels.");
      return;
    }
    setProgress(0);
    runId.current += 1;
    setRunning(true);
    setFeedback("");
  };
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setProgress((old) =>
          Math.min(1, old + (reduced ? 0.13 : 0.025) * speed),
        ),
      reduced ? 100 : 20,
    );
    return () => clearInterval(id);
  }, [
    finalLevel,
    initial,
    reduced,
    running,
    speed,
    transition.kind,
    transition.wavelengthNm,
  ]);
  useEffect(() => {
    if (!running || progress < 1 || completedRunId.current === runId.current)
      return;
    completedRunId.current = runId.current;
    setRunning(false);
    setHistory((h) =>
      [
        {
          from: initial,
          to: finalLevel,
          nm: transition.wavelengthNm,
          kind: transition.kind,
        },
        ...h,
      ].slice(0, 6),
    );
  }, [
    finalLevel,
    initial,
    progress,
    running,
    transition.kind,
    transition.wavelengthNm,
  ]);
  const radius = (n: number) => 55 + n * 28,
    currentRadius =
      radius(initial) + (radius(finalLevel) - radius(initial)) * progress,
    electronAngle = progress * 160 + 25,
    ex = 50 + (Math.cos((electronAngle * Math.PI) / 180) * currentRadius) / 5.6,
    ey = 50 - (Math.sin((electronAngle * Math.PI) / 180) * currentRadius) / 5.6;
  const setLevelFromPointer = (event: PointerEvent<HTMLButtonElement>) => {
    const r = event.currentTarget.closest(".bm-stage")!.getBoundingClientRect(),
      dx = event.clientX - (r.left + r.width / 2),
      dy = event.clientY - (r.top + r.height / 2),
      n = clamp(Math.round((Math.hypot(dx, dy) - 55) / 28), 1, 6);
    setFinalLevel(n);
    return n;
  };
  const drag = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.buttons & 1) setLevelFromPointer(event);
  };
  const reset = () => {
    setZ(1);
    setInitial(4);
    setFinalLevel(2);
    setProgress(0);
    setRunning(false);
    setSpeed(1);
    setHistory([]);
    setMission(false);
    setFeedback("");
  };
  const color = wavelengthColor(transition.wavelengthNm),
    linePct = clamp(((transition.wavelengthNm - 380) / 370) * 100, 0, 100),
    missionPass =
      z === 1 &&
      initial === 3 &&
      finalLevel === 2 &&
      transition.kind === "emission" &&
      Math.abs(transition.wavelengthNm - 656.3) < 1;
  return (
    <section
      className="bm-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="bm-head" data-ui-theme="dark">
        <div>
          <span>HYDROGENIC SPECTRUM LAB</span>
          <h2>One jump. One photon.</h2>
          <p>
            Move only between allowed levels; the energy gap fixes the spectral
            line.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="bm-layout">
        <aside className="bm-controls">
          <h3>Transition setup</h3>
          <label>
            Atomic preset
            <select
              aria-label="Atomic number preset"
              value={z}
              onChange={(e) => {
                setZ(Number(e.target.value));
                setProgress(0);
              }}
            >
              <option value="1">Hydrogen · Z=1</option>
              <option value="2">He⁺ · Z=2</option>
              <option value="3">Li²⁺ · Z=3</option>
            </select>
          </label>
          <label>
            Initial level
            <select
              aria-label="Initial level"
              value={initial}
              onChange={(e) => {
                setInitial(Number(e.target.value));
                setProgress(0);
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  n = {n}
                </option>
              ))}
            </select>
          </label>
          <label>
            Final level
            <select
              aria-label="Final level"
              value={finalLevel}
              onChange={(e) => {
                setFinalLevel(Number(e.target.value));
                setProgress(0);
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  n = {n}
                </option>
              ))}
            </select>
          </label>
          <button className="bm-trigger" onClick={() => trigger()}>
            {transition.kind === "emission" ? "Emit photon" : "Absorb photon"}
          </button>
          <div className="bm-presets">
            <button
              onClick={() => {
                setZ(1);
                setInitial(1);
                setFinalLevel(2);
              }}
            >
              Minimums
            </button>
            <button
              onClick={() => {
                setZ(1);
                setInitial(4);
                setFinalLevel(2);
              }}
            >
              Typical
            </button>
            <button
              onClick={() => {
                setZ(3);
                setInitial(6);
                setFinalLevel(1);
              }}
            >
              Maximums
            </button>
          </div>
          <p>
            <b>Allowed:</b> integer n = 1…6 only. Dragging snaps the electron to
            the nearest shell.
          </p>
        </aside>
        <main className="bm-center">
          <div className="bm-transport">
            <button onClick={() => setRunning(true)}>▶ Play</button>
            <button onClick={() => setRunning(false)}>Ⅱ Pause</button>
            <button
              onClick={() => {
                setRunning(false);
                setProgress((p) => Math.min(1, p + 0.1));
              }}
            >
              ▷ Step
            </button>
            <button
              onClick={() => {
                setProgress(0);
                setRunning(true);
              }}
            >
              ↺ Replay
            </button>
            <label>
              Speed
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
          </div>
          <section
            className="bm-stage"
            aria-label={`${atomNames[z]} electron transitioning from level ${initial} to ${finalLevel}; ${transition.kind}`}
          >
            <img
              src="/assets/experiments/bohr-model/nucleus.png"
              alt={`${atomNames[z]} nucleus`}
            />
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <i
                key={n}
                className={`bm-shell ${n === initial || n === finalLevel ? "selected" : ""}`}
                style={{ width: radius(n) * 2, height: radius(n) * 2 }}
              >
                <b>n={n}</b>
              </i>
            ))}
            <button
              className="bm-electron"
              aria-label="Drag electron between allowed levels"
              style={{ left: `${ex}%`, top: `${ey}%` }}
              onPointerDown={(e) =>
                e.currentTarget.setPointerCapture(e.pointerId)
              }
              onPointerMove={drag}
              onPointerUp={(e) => {
                const level = setLevelFromPointer(e);
                e.currentTarget.releasePointerCapture(e.pointerId);
                trigger(level);
              }}
            >
              e⁻
            </button>
            <div
              className={`bm-photon ${transition.kind}`}
              style={
                {
                  "--photon": color,
                  left: `${transition.kind === "emission" ? 50 + progress * 46 : 96 - progress * 46}%`,
                } as CSSProperties
              }
            >
              <i />
              <i />
              <i />
            </div>
            <div className="bm-state">
              <b>n = {progress < 1 ? initial : finalLevel}</b>
              <small>
                {f(levelEnergyEv(z, progress < 1 ? initial : finalLevel), 3)} eV
              </small>
            </div>
          </section>
          <output className={`bm-kind ${transition.kind}`}>
            {transition.kind === "emission"
              ? "↓ Emission: atom loses energy; photon carries +|ΔE|."
              : "↑ Absorption: atom gains energy from an incoming photon."}
          </output>
        </main>
        <aside className="bm-readings">
          <h3>Photon & atom</h3>
          <dl>
            <div>
              <dt>Atomic ΔE</dt>
              <dd>{f(transition.atomEnergyChangeEv, 3)} eV</dd>
            </div>
            <div>
              <dt>Photon energy</dt>
              <dd>{f(transition.photonEnergyEv, 3)} eV</dd>
            </div>
            <div>
              <dt>Wavelength λ</dt>
              <dd>{f(transition.wavelengthNm, 1)} nm</dd>
            </div>
            <div>
              <dt>Frequency f</dt>
              <dd>{transition.frequencyHz.toExponential(3)} Hz</dd>
            </div>
            <div>
              <dt>Identity</dt>
              <dd>hf = hc/λ ✓</dd>
            </div>
          </dl>
          <div className="bm-equation">
            Eₙ = −13.606 Z²/n² eV
            <br />
            ΔEatom = Efinal − Einitial
          </div>
          <h3>Spectrometer</h3>
          <div className="bm-spectrum">
            <i
              style={{
                left: `${linePct}%`,
                background: color,
                boxShadow: `0 0 10px ${color}`,
              }}
            />
          </div>
          <b className="bm-color" style={{ color }}>
            {transition.visible ? "Visible line" : "UV / IR line"}
          </b>
        </aside>
      </div>
      <section className="bm-bottom">
        <div>
          <h3>Energy levels</h3>
          {[6, 5, 4, 3, 2, 1].map((n) => (
            <p
              key={n}
              className={n === initial || n === finalLevel ? "active" : ""}
            >
              <b>n={n}</b>
              <i />
              <span>{f(levelEnergyEv(z, n), 3)} eV</span>
            </p>
          ))}
        </div>
        <div>
          <h3>Transition history</h3>
          {history.length ? (
            history.map((h, i) => (
              <p key={i}>
                n {h.from} → {h.to} · {f(h.nm, 1)} nm · {h.kind}
              </p>
            ))
          ) : (
            <p>Run a transition to record its spectral line.</p>
          )}
        </div>
        <div className="bm-balmer">
          <h3>Balmer reference</h3>
          {[3, 4, 5, 6].map((n) => {
            const t = bohrTransition({
              atomicNumber: 1,
              initialLevel: n,
              finalLevel: 2,
            });
            return (
              <p key={n}>
                <span style={{ background: wavelengthColor(t.wavelengthNm) }} />
                H{["α", "β", "γ", "δ"][n - 3]} · {f(t.wavelengthNm, 1)} nm
              </p>
            );
          })}
        </div>
      </section>
      <section className="bm-mission">
        <div>
          <span>BALMER MISSION</span>
          <b>Produce the red Hα line near 656.3 nm.</b>
          <small>
            Use neutral hydrogen and an inward n=3 → n=2 transition.
          </small>
        </div>
        <button
          onClick={() => {
            setMission(true);
            setFeedback("Choose Z=1, initial n=3, final n=2, then emit.");
          }}
        >
          Start mission
        </button>
        {mission && (
          <button
            onClick={() => {
              setZ(1);
              setInitial(3);
              setFinalLevel(2);
              setProgress(0);
            }}
          >
            Load Hα setup
          </button>
        )}
        {mission && <button onClick={() => trigger()}>Run transition</button>}
        {mission && (
          <button
            onClick={() =>
              setFeedback(
                missionPass
                  ? `✓ Hα produced at ${f(transition.wavelengthNm, 1)} nm.`
                  : `Current line: ${f(transition.wavelengthNm, 1)} nm. Check Z and both levels.`,
              )
            }
          >
            Check line
          </button>
        )}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
