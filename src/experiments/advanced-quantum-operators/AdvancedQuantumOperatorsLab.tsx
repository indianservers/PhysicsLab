import { useEffect, useRef, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  applyAxisRotation,
  applyNamedOperator,
  bornProbabilities,
  blochVector,
  eigenstate,
  stateFromControls,
  type NamedOperator,
  type QuantumBasis,
  type QubitState,
} from "./quantumOperatorSimulation";
import "./advanced-quantum-operators.css";
const f = (n: number, d = 3) => n.toFixed(d);
const fmt = (z: { re: number; im: number }) =>
  `${f(z.re)} ${z.im < 0 ? "−" : "+"} ${f(Math.abs(z.im))}i`;
export function AdvancedQuantumOperatorsLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [alphaMag, setAlphaMag] = useState(Math.sqrt(0.7)),
    [phaseDeg, setPhaseDeg] = useState(35),
    [state, setState] = useState<QubitState>(() =>
      stateFromControls(Math.sqrt(0.7), 35),
    ),
    [axis, setAxis] = useState<QuantumBasis>("Z"),
    [basis, setBasis] = useState<QuantumBasis>("Z"),
    [rotationDeg, setRotationDeg] = useState(30),
    [running, setRunning] = useState(false),
    [playback, setPlayback] = useState(1),
    [reduced, setReduced] = useState(false),
    [counts, setCounts] = useState({ plus: 0, minus: 0 }),
    [sampling, setSampling] = useState(false),
    [lastOutcome, setLastOutcome] = useState("Prepared state"),
    [mission, setMission] = useState(false),
    [feedback, setFeedback] = useState("");
  const seed = useRef(1847);
  const bloch = blochVector(state),
    born = bornProbabilities(state, basis),
    norm = Math.hypot(
      state.alpha.re,
      state.alpha.im,
      state.beta.re,
      state.beta.im,
    ),
    total = counts.plus + counts.minus;
  const sync = (a: number, p: number) => {
    setAlphaMag(a);
    setPhaseDeg(p);
    setState(stateFromControls(a, p));
    setCounts({ plus: 0, minus: 0 });
    setFeedback("");
  };
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setState((old) =>
          applyAxisRotation(old, axis, (reduced ? 4 : 1) * playback),
        ),
      reduced ? 100 : 25,
    );
    return () => clearInterval(id);
  }, [axis, playback, reduced, running]);
  useEffect(() => {
    if (!sampling) return;
    const id = window.setInterval(
      () => {
        seed.current = (1664525 * seed.current + 1013904223) >>> 0;
        const plus = seed.current / 4294967296 < born.plus;
        setCounts((old) => {
          const next = plus
            ? { plus: old.plus + 1, minus: old.minus }
            : { plus: old.plus, minus: old.minus + 1 };
          if (next.plus + next.minus >= 100) setSampling(false);
          return next;
        });
      },
      reduced ? 80 : 20,
    );
    return () => clearInterval(id);
  }, [born.plus, reduced, sampling]);
  const apply = (op: NamedOperator) => {
    setRunning(false);
    setState((old) => applyNamedOperator(old, op));
    setCounts({ plus: 0, minus: 0 });
    setLastOutcome(`${op} applied · unitary norm preserved`);
  };
  const reset = () => {
    setAlphaMag(Math.sqrt(0.7));
    setPhaseDeg(35);
    setState(stateFromControls(Math.sqrt(0.7), 35));
    setAxis("Z");
    setBasis("Z");
    setRotationDeg(30);
    setCounts({ plus: 0, minus: 0 });
    setRunning(false);
    setSampling(false);
    setMission(false);
    setFeedback("");
    setLastOutcome("Prepared state");
  };
  const measure = () => {
    seed.current = (1664525 * seed.current + 1013904223) >>> 0;
    const plus = seed.current / 4294967296 < born.plus;
    setState(eigenstate(basis, plus));
    setCounts((old) =>
      plus ? { ...old, plus: old.plus + 1 } : { ...old, minus: old.minus + 1 },
    );
    setLastOutcome(`${basis} measurement collapsed to ${plus ? "+1" : "−1"}`);
  };
  const tx = 200 + 112 * (bloch.x + 0.32 * bloch.y),
    ty = 200 - 112 * (bloch.z + 0.22 * bloch.y),
    planeClass = `basis-${basis.toLowerCase()}`;
  return (
    <section
      className="qo-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="qo-head" data-ui-theme="dark">
        <div>
          <span>POSTGRADUATE OPERATOR STUDIO</span>
          <h2>Transform. Project. Measure.</h2>
          <p>
            Unitary operators rotate a normalized qubit; Hermitian observables
            return real outcomes.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="qo-layout">
        <aside className="qo-controls">
          <h3>Prepare |ψ〉</h3>
          <label>
            <span>
              |α|<b>{f(alphaMag)}</b>
            </span>
            <input
              aria-label="Alpha magnitude"
              type="range"
              min="0"
              max="1"
              step=".01"
              value={alphaMag}
              onChange={(e) => sync(Number(e.target.value), phaseDeg)}
            />
          </label>
          <label>
            <span>
              Relative phase δ<b>{f(phaseDeg, 0)}°</b>
            </span>
            <input
              aria-label="Relative phase"
              type="range"
              min="-180"
              max="180"
              step="1"
              value={phaseDeg}
              onChange={(e) => sync(alphaMag, Number(e.target.value))}
            />
          </label>
          <div className="qo-ket">
            |ψ〉 = α|0〉 + βe<sup>iδ</sup>|1〉
            <small>
              α {fmt(state.alpha)}
              <br />β {fmt(state.beta)}
            </small>
          </div>
          <h3>Named operators</h3>
          <div className="qo-ops">
            {(["X", "Y", "Z", "H", "S", "T"] as NamedOperator[]).map((op) => (
              <button key={op} onClick={() => apply(op)}>
                {op}
              </button>
            ))}
          </div>
          <label className="qo-select">
            Rotation axis
            <select
              aria-label="Operator axis"
              value={axis}
              onChange={(e) => setAxis(e.target.value as QuantumBasis)}
            >
              <option>X</option>
              <option>Y</option>
              <option>Z</option>
            </select>
          </label>
          <label>
            <span>
              Rotation step<b>{rotationDeg}°</b>
            </span>
            <input
              aria-label="Rotation angle"
              type="range"
              min="5"
              max="180"
              step="5"
              value={rotationDeg}
              onChange={(e) => setRotationDeg(Number(e.target.value))}
            />
          </label>
          <button
            onClick={() =>
              setState((old) => applyAxisRotation(old, axis, rotationDeg))
            }
          >
            Apply R{axis}({rotationDeg}°)
          </button>
        </aside>
        <main className="qo-center">
          <div className="qo-transport">
            <button onClick={() => setRunning(true)}>▶ Play</button>
            <button onClick={() => setRunning(false)}>Ⅱ Pause</button>
            <button
              onClick={() =>
                setState((old) => applyAxisRotation(old, axis, rotationDeg))
              }
            >
              ▷ Step
            </button>
            <button onClick={() => sync(Math.sqrt(0.7), 35)}>↺ Replay</button>
            <label>
              Speed
              <select
                aria-label="Playback speed"
                value={playback}
                onChange={(e) => setPlayback(Number(e.target.value))}
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
            className="qo-stage"
            aria-label={`Normalized qubit Bloch vector x ${f(bloch.x)}, y ${f(bloch.y)}, z ${f(bloch.z)}`}
          >
            <img
              src="/assets/experiments/advanced-quantum-operators/bloch-sphere.png"
              alt="Transparent Bloch sphere shell"
            />
            <div className={`qo-plane ${planeClass}`} />
            <svg viewBox="0 0 400 400">
              <defs>
                <marker
                  id="qo-arrow"
                  markerWidth="9"
                  markerHeight="9"
                  refX="8"
                  refY="4.5"
                  orient="auto"
                >
                  <path d="M0 0L9 4.5L0 9z" />
                </marker>
              </defs>
              <line
                x1="200"
                y1="200"
                x2={tx}
                y2={ty}
                markerEnd="url(#qo-arrow)"
              />
              <circle cx={tx} cy={ty} r="7" />
              <text x={tx + 10} y={ty - 10}>
                |ψ〉
              </text>
            </svg>
            <div className="qo-coords">
              r = ({f(bloch.x)}, {f(bloch.y)}, {f(bloch.z)})
            </div>
          </section>
          <output className="qo-event">{lastOutcome}</output>
        </main>
        <aside className="qo-readings">
          <h3>Born measurement</h3>
          <label className="qo-select">
            Basis
            <select
              aria-label="Measurement basis"
              value={basis}
              onChange={(e) => {
                setBasis(e.target.value as QuantumBasis);
                setCounts({ plus: 0, minus: 0 });
              }}
            >
              <option>X</option>
              <option>Y</option>
              <option>Z</option>
            </select>
          </label>
          <dl>
            <div>
              <dt>P(+{basis})</dt>
              <dd>{f(born.plus, 4)}</dd>
            </div>
            <div>
              <dt>P(−{basis})</dt>
              <dd>{f(born.minus, 4)}</dd>
            </div>
            <div>
              <dt>Sum</dt>
              <dd>{f(born.plus + born.minus, 4)}</dd>
            </div>
            <div>
              <dt>〈σ{basis}〉</dt>
              <dd>{f(born.expectation, 4)}</dd>
            </div>
            <div>
              <dt>〈ψ|ψ〉</dt>
              <dd>{f(norm ** 2, 6)}</dd>
            </div>
            <div>
              <dt>Observable</dt>
              <dd>Hermitian ✓</dd>
            </div>
          </dl>
          <button onClick={measure}>Measure once + collapse</button>
          <button
            onClick={() => {
              setCounts({ plus: 0, minus: 0 });
              setSampling(true);
            }}
          >
            Run 100 prepared copies
          </button>
          <button onClick={() => setSampling(false)}>Pause sampling</button>
          <div className="qo-hist">
            <i
              style={{ height: `${total ? (counts.plus / total) * 100 : 0}%` }}
            >
              <b>+ {counts.plus}</b>
            </i>
            <i
              style={{ height: `${total ? (counts.minus / total) * 100 : 0}%` }}
            >
              <b>− {counts.minus}</b>
            </i>
          </div>
          <small>
            {sampling
              ? `Sampling ${total}/100…`
              : `${total} trials · expected ${(born.plus * 100).toFixed(1)}% +`}
          </small>
        </aside>
      </div>
      <section className="qo-mission">
        <div>
          <span>BORN-RULE MISSION</span>
          <b>Prepare P(+Z)=75% and P(−Z)=25%.</b>
          <small>
            State must remain normalized; relative phase may be arbitrary.
          </small>
        </div>
        <button
          onClick={() => {
            setMission(true);
            setFeedback("Tune |α| because P(+Z)=|α|².");
          }}
        >
          Start mission
        </button>
        {mission && (
          <button onClick={() => sync(Math.sqrt(0.75), 0)}>
            Load target state
          </button>
        )}
        {mission && (
          <button
            onClick={() => {
              setBasis("Z");
              const p = bornProbabilities(state, "Z");
              setFeedback(
                Math.abs(p.plus - 0.75) <= 0.01 && Math.abs(norm - 1) < 1e-9
                  ? `✓ Born probabilities ${f(p.plus * 100, 1)}% / ${f(p.minus * 100, 1)}%; normalization preserved.`
                  : `P(+Z) is ${f(p.plus * 100, 1)}%. Adjust |α| toward √0.75.`,
              );
            }}
          >
            Check state
          </button>
        )}
        <output aria-live="polite">{feedback}</output>
      </section>
    </section>
  );
}
