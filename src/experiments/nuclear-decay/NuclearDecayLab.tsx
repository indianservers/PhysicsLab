import { useMemo, useState, useEffect, type CSSProperties } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  decayConstant,
  decayTimes,
  expectedActivity,
  expectedRemaining,
  observedRemaining,
  seededUniforms,
} from "./nuclearDecaySimulation";
import "./nuclear-decay.css";

const isotopes = {
  cs137: { label: "Cesium-137 (¹³⁷Cs)", half: 30.17, decay: "β⁻" },
  co60: { label: "Cobalt-60 (⁶⁰Co)", half: 5.271, decay: "β⁻ + γ" },
  i131: { label: "Iodine-131 (¹³¹I)", half: 8.02 / 365.25, decay: "β⁻" },
  rn222: { label: "Radon-222 (²²²Rn)", half: 3.8235 / 365.25, decay: "α" },
} as const;
type IsotopeKey = keyof typeof isotopes;
const fmtTime = (years: number) =>
  years < 0.08 ? `${(years * 365.25).toFixed(2)} d` : `${years.toFixed(2)} y`;

export function NuclearDecayLab({ experiment }: DedicatedExperimentLabProps) {
  const [isotope, setIsotope] = useState<IsotopeKey>("cs137");
  const [initial, setInitial] = useState(600);
  const [halfLife, setHalfLife] = useState<number>(isotopes.cs137.half);
  const [seed, setSeed] = useState(137);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [timeScale, setTimeScale] = useState(0.25);
  const [playback, setPlayback] = useState(1);
  const [efficiency, setEfficiency] = useState(35);
  const [background, setBackground] = useState(2);
  const [reduced, setReduced] = useState(false);
  const [mission, setMission] = useState(false);
  const [estimate, setEstimate] = useState(10);
  const [feedback, setFeedback] = useState("");
  const times = useMemo(
    () => decayTimes(initial, halfLife, seed),
    [halfLife, initial, seed],
  );
  const remaining = times.filter((t) => t > time).length;
  const expected = expectedRemaining(initial, time, halfLife);
  const activity = expectedActivity(remaining, halfLife);
  const observedRate = (activity * efficiency) / 100 + background;
  const progress = Math.min(1, time / (4 * halfLife));

  useEffect(() => {
    if (!running || progress >= 1) return;
    const id = window.setInterval(
      () =>
        setTime((t) =>
          Math.min(4 * halfLife, t + halfLife * 0.004 * timeScale * playback),
        ),
      reduced ? 140 : 35,
    );
    return () => clearInterval(id);
  }, [halfLife, playback, progress, reduced, running, timeScale]);

  const visual = useMemo(() => {
    const count = Math.min(180, initial);
    const xy = seededUniforms(count * 2, seed + 9001);
    const life = decayTimes(count, halfLife, seed);
    return Array.from({ length: count }, (_, i) => ({
      x: 11 + xy[i * 2] * 35,
      y: 22 + xy[i * 2 + 1] * 51,
      life: life[i],
    }));
  }, [halfLife, initial, seed]);
  const recentFlashes = visual.filter(
    (n) => n.life <= time && n.life > time - halfLife * 0.035,
  );
  const curve = Array.from({ length: 41 }, (_, i) => {
    const x = i / 10;
    return `${i ? "L" : "M"}${x * 125},${100 - 88 * 2 ** -x}`;
  }).join(" ");
  const observedPoints = Array.from({ length: 17 }, (_, i) => {
    const t = (i * halfLife) / 4;
    return {
      x: i * 31.25,
      y: 100 - (88 * observedRemaining(initial, halfLife, t, seed)) / initial,
    };
  });
  const reset = () => {
    setTime(0);
    setRunning(false);
    setSeed(137);
    setFeedback("");
    setMission(false);
  };
  const chooseIsotope = (key: IsotopeKey) => {
    setIsotope(key);
    setHalfLife(isotopes[key].half);
    setTime(0);
    setRunning(false);
    setFeedback("");
  };

  return (
    <section
      className="nd-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="nd-head" data-ui-theme="dark">
        <div>
          <span>SEE CHANCE BECOME A LAW</span>
          <h2>Radioactive decay</h2>
          <p>
            Individual nuclei are unpredictable; the ensemble has a precise
            half-life.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="nd-layout">
        <aside className="nd-controls">
          <h3>Setup</h3>
          <label>
            Isotope
            <select
              aria-label="Isotope"
              value={isotope}
              onChange={(e) => chooseIsotope(e.target.value as IsotopeKey)}
            >
              {Object.entries(isotopes).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
            <small>{isotopes[isotope].decay} decay</small>
          </label>
          <label>
            Initial nuclei N₀ <output>{initial}</output>
            <input
              aria-label="Initial nuclei"
              type="range"
              min="100"
              max="1000"
              step="50"
              value={initial}
              onChange={(e) => {
                setInitial(+e.target.value);
                setTime(0);
              }}
            />
          </label>
          <label>
            Half-life T½ <output>{fmtTime(halfLife)}</output>
            <input
              aria-label="Half-life"
              type="range"
              min="0.01"
              max="50"
              step="0.01"
              value={halfLife}
              onChange={(e) => {
                setHalfLife(+e.target.value);
                setTime(0);
              }}
            />
          </label>
          <label>
            Time scale
            <select
              aria-label="Time scale"
              value={timeScale}
              onChange={(e) => setTimeScale(+e.target.value)}
            >
                <option value="0.1">Careful · 0.1 T½/s</option>
                <option value="0.25">Normal · 0.25 T½/s</option>
              <option value="1">Fast · 1 T½/s</option>
            </select>
          </label>
          <label>
            Random seed{" "}
            <input
              aria-label="Random seed"
              type="number"
              min="1"
              max="999999"
              value={seed}
              onChange={(e) => {
                setSeed(Math.max(1, +e.target.value));
                setTime(0);
              }}
            />
          </label>
          <label>
            Detector efficiency <output>{efficiency}%</output>
            <input
              aria-label="Detector efficiency"
              type="range"
              min="5"
              max="100"
              value={efficiency}
              onChange={(e) => setEfficiency(+e.target.value)}
            />
          </label>
          <label>
            Background <output>{background.toFixed(1)}</output>
            <input
              aria-label="Background rate"
              type="range"
              min="0"
              max="10"
              step=".1"
              value={background}
              onChange={(e) => setBackground(+e.target.value)}
            />
          </label>
          <div className="nd-presets">
            <button
              onClick={() => {
                setInitial(100);
                setTime(0);
              }}
            >
              Minimums
            </button>
            <button
              onClick={() => {
                setInitial(600);
                setTime(0);
              }}
            >
              Typical
            </button>
            <button
              onClick={() => {
                setInitial(1000);
                setTime(0);
              }}
            >
              Maximums
            </button>
          </div>
        </aside>
        <main className="nd-center">
          <div className="nd-transport">
            <button onClick={() => setRunning(true)}>▶ Play</button>
            <button onClick={() => setRunning(false)}>Ⅱ Pause</button>
            <button
              onClick={() =>
                setTime((t) => Math.min(4 * halfLife, t + halfLife * 0.02))
              }
            >
              ▷ Step
            </button>
            <button onClick={() => setTime(0)}>↺ Replay</button>
            <label>
              Speed{" "}
              <select
                aria-label="Playback speed"
                value={playback}
                onChange={(e) => setPlayback(+e.target.value)}
              >
                <option value="0.25">0.25×</option>
                <option value="0.5">0.5×</option>
                <option>1</option>
                <option>2</option>
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
          <div
            className="nd-stage"
            role="img"
            aria-label={`${remaining} of ${initial} nuclei remain at ${fmtTime(time)} for random seed ${seed}`}
          >
            <img
              src="/assets/experiments/nuclear-decay/decay-chamber.png"
              alt="Radioactive sample chamber and Geiger detector"
            />
            <div className="nd-nuclei">
              {visual.map((n, i) => (
                <i
                  key={i}
                  className={n.life <= time ? "decayed" : ""}
                  style={
                    {
                      left: `${n.x}%`,
                      top: `${n.y}%`,
                      "--delay": `${(i % 9) * -0.1}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            {recentFlashes.map((n, i) => (
              <b
                className="nd-flash"
                key={i}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                ✦
              </b>
            ))}
            <strong className="nd-counter">
              {observedRate.toFixed(1)}
              <small> counts / y</small>
            </strong>
          </div>
          <p className="nd-caption">
            Each flash is one seeded random event. Replay the seed for the same
            history.
          </p>
        </main>
        <aside className="nd-readings">
          <h3>Live measurements</h3>
          <dl>
            <div>
              <dt>Time t</dt>
              <dd>{fmtTime(time)}</dd>
            </div>
            <div>
              <dt>Nuclei remaining</dt>
              <dd>
                {remaining} <small>(expected {expected.toFixed(1)})</small>
              </dd>
            </div>
            <div>
              <dt>Activity A=λN</dt>
              <dd>{activity.toFixed(2)} y⁻¹</dd>
            </div>
            <div>
              <dt>Detected rate</dt>
              <dd>{observedRate.toFixed(2)} y⁻¹</dd>
            </div>
          </dl>
          <div className="nd-equation">
            N(t)=N₀e<sup>−λt</sup>
            <br />
            A(t)=λN(t)<small>λ=ln 2 / T½</small>
          </div>
          <h3>Half-life markers</h3>
          <div className="nd-markers">
            <i style={{ width: `${progress * 100}%` }} />
          </div>
        </aside>
      </div>
      <div className="nd-bottom">
        <section>
          <h3>Remaining nuclei vs time</h3>
          <svg
            viewBox="0 0 520 110"
            role="img"
            aria-label="Observed stochastic counts compared with expected exponential curve"
          >
            <path d={curve} />
            {observedPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3" />
            ))}
            <line x1="125" x2="125" y1="5" y2="104" />
            <line x1="250" x2="250" y1="5" y2="104" />
            <line x1="375" x2="375" y1="5" y2="104" />
          </svg>
          <p>● seeded observation · — expected exponential</p>
        </section>
        <section>
          <h3>Statistics</h3>
          <p>
            Surviving fraction <b>{(remaining / initial).toFixed(3)}</b>
          </p>
          <p>
            Expected fraction <b>{(expected / initial).toFixed(3)}</b>
          </p>
          <p>
            Decay constant <b>{decayConstant(halfLife).toFixed(4)} y⁻¹</b>
          </p>
          <p>
            Mean lifetime <b>{fmtTime(1 / decayConstant(halfLife))}</b>
          </p>
        </section>
        <section>
          <h3>Repeatability</h3>
          <p>Seed {seed} fixes every lifetime.</p>
          <button
            onClick={() => {
              setSeed((s) => s + 1);
              setTime(0);
            }}
          >
            New random run
          </button>
          <button onClick={() => setTime(0)}>Replay same seed</button>
        </section>
      </div>
      <div className="nd-mission">
        <div>
          <span>UNKNOWN HALF-LIFE MISSION</span>
          <b>Estimate an unknown sample whose count halves near 12.5 years.</b>
          <small>Read the curve near N/N₀=0.5.</small>
          <output>{feedback}</output>
        </div>
        <button
          onClick={() => {
            setMission(true);
            setHalfLife(12.5);
            setTime(50);
            setRunning(false);
            setFeedback("Study the completed curve, then enter your estimate.");
          }}
        >
          Start mission
        </button>
        {mission && (
          <>
            <label>
              Estimate{" "}
              <input
                aria-label="Half-life estimate"
                type="number"
                step=".1"
                value={estimate}
                onChange={(e) => setEstimate(+e.target.value)}
              />{" "}
              y
            </label>
            <button
              onClick={() =>
                setFeedback(
                  Math.abs(estimate - 12.5) <= 0.8
                    ? `✓ ${estimate.toFixed(1)} y agrees with the 12.5 y sample.`
                    : `Not yet: use the 50% crossing, not a single decay.`,
                )
              }
            >
              Check estimate
            </button>
          </>
        )}
      </div>
    </section>
  );
}
