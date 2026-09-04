import { useEffect, useState, type CSSProperties } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  C,
  gammaFor,
  intervalM2,
  lightClock,
  lorentzEvent,
} from "./relativitySimulation";
import "./relativity.css";

export function RelativityLab({ experiment }: DedicatedExperimentLabProps) {
  const [beta, setBeta] = useState(0.8),
    [frame, setFrame] = useState<"earth" | "ship">("earth"),
    [spacing, setSpacing] = useState(600),
    [phase, setPhase] = useState(0),
    [running, setRunning] = useState(false),
    [playback, setPlayback] = useState(1),
    [reduced, setReduced] = useState(false),
    [mission, setMission] = useState(false),
    [feedback, setFeedback] = useState("");
  const height = 100,
    properLength = 300,
    gamma = gammaFor(beta),
    clock = lightClock(beta, height),
    earthLength = properLength / gamma;
  const eventA = { x: -spacing / 2, t: 2 },
    eventB = { x: spacing / 2, t: 2 },
    aPrime = lorentzEvent(beta, eventA.x, eventA.t),
    bPrime = lorentzEvent(beta, eventB.x, eventB.t),
    deltaPrime = bPrime.timePrimeUs - aPrime.timePrimeUs;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => setPhase((p) => (p + (reduced ? 0.05 : 0.015) * playback) % 1),
      reduced ? 140 : 30,
    );
    return () => clearInterval(id);
  }, [playback, reduced, running]);
  const pulseY = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
  const reset = () => {
    setBeta(0.8);
    setFrame("earth");
    setSpacing(600);
    setPhase(0);
    setRunning(false);
    setPlayback(1);
    setReduced(false);
    setMission(false);
    setFeedback("");
  };
  return (
    <section
      className="sr-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="sr-head" data-ui-theme="dark">
        <div>
          <span>LIGHT CLOCK & SPACETIME LAB</span>
          <h2>Same light. Different time.</h2>
          <p>
            Compare synchronized frames without ever changing the speed of
            light.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="sr-layout">
        <aside className="sr-controls">
          <h3>Experiment setup</h3>
          <label>
            Relative speed v <output>{beta.toFixed(2)} c</output>
            <input
              aria-label="Relative speed"
              type="range"
              min="0"
              max=".99"
              step=".01"
              value={beta}
              onChange={(e) => setBeta(+e.target.value)}
            />
          </label>
          <label>
            Current frame
            <select
              aria-label="Reference frame"
              value={frame}
              onChange={(e) => setFrame(e.target.value as "earth" | "ship")}
            >
              <option value="earth">Earth frame S</option>
              <option value="ship">Ship frame S′</option>
            </select>
          </label>
          <label>
            Event spacing Δx <output>{spacing} m</output>
            <input
              aria-label="Event spacing"
              type="range"
              min="100"
              max="1000"
              step="20"
              value={spacing}
              onChange={(e) => setSpacing(+e.target.value)}
            />
          </label>
          <label>
            Spacecraft proper length <output>{properLength} m</output>
          </label>
          <label>
            Light-clock height <output>{height} m</output>
          </label>
          <div className="sr-presets">
            <button onClick={() => setBeta(0)}>Minimums</button>
            <button onClick={() => setBeta(0.8)}>Typical</button>
            <button onClick={() => setBeta(0.99)}>Maximums</button>
          </div>
          <p>
            Speed is clamped below c. Massive frames cannot reach or exceed
            light speed.
          </p>
        </aside>
        <main className="sr-center">
          <div className="sr-transport">
            <button onClick={() => setRunning(true)}>▶ Play</button>
            <button onClick={() => setRunning(false)}>Ⅱ Pause</button>
            <button onClick={() => setPhase((p) => (p + 0.05) % 1)}>
              ▷ Step
            </button>
            <button onClick={() => setPhase(0)}>↺ Replay</button>
            <label>
              Speed{" "}
              <select
                aria-label="Playback speed"
                value={playback}
                onChange={(e) => setPlayback(+e.target.value)}
              >
                <option value=".25">0.25×</option>
                <option value=".5">0.5×</option>
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
            className="sr-stage"
            role="img"
            aria-label={`${frame} frame at ${beta.toFixed(2)} c; gamma ${gamma.toFixed(4)}; light speed remains c`}
          >
            <div
              className="sr-ship"
              style={
                {
                  width: `${frame === "earth" ? 80 / gamma : 80}%`,
                } as CSSProperties
              }
            >
              <img
                src="/assets/experiments/special-relativity-bridge/spacecraft.png"
                alt="Side-view spacecraft carrying a light clock"
              />
              <i className="sr-mirror top" />
              <i className="sr-mirror bottom" />
              <b className="sr-pulse" style={{ top: `${31 + pulseY * 27}%` }} />
            </div>
            <div className="sr-vector">v = {beta.toFixed(2)}c →</div>
            <div className="sr-ground">
              {[-2, -1, 0, 1, 2].map((n, i) => (
                <div key={n}>
                  <i />
                  <b>
                    {frame === "earth"
                      ? `${(2 + n * 2).toFixed(1)} μs`
                      : `${(gamma * (2 + n * 2 - (beta * ((n * spacing) / 2)) / 299.792458)).toFixed(1)} μs`}
                  </b>
                </div>
              ))}
            </div>
          </div>
          <p className="sr-caption">
            In S the moving light follows a longer diagonal path; in S′ the
            clock is at rest.
          </p>
        </main>
        <aside className="sr-readings">
          <h3>Live measurements</h3>
          <dl>
            <div>
              <dt>Lorentz factor γ</dt>
              <dd>{gamma.toFixed(4)}</dd>
            </div>
            <div>
              <dt>Proper one-way tick</dt>
              <dd>{(clock.properTimeS * 1e6).toFixed(3)} μs</dd>
            </div>
            <div>
              <dt>Earth-frame tick</dt>
              <dd>{(clock.earthTimeS * 1e6).toFixed(3)} μs</dd>
            </div>
            <div>
              <dt>Ship length in S</dt>
              <dd>{earthLength.toFixed(2)} m</dd>
            </div>
            <div>
              <dt>Measured light speed</dt>
              <dd>{(clock.measuredLightSpeed / C).toFixed(6)} c</dd>
            </div>
          </dl>
          <div className="sr-equation">
            γ=1/√(1−v²/c²)
            <br />
            Δt=γΔτ · L=L₀/γ
          </div>
          <p className="sr-safe">✓ v&lt;c · no superluminal signal</p>
        </aside>
      </div>
      <div className="sr-bottom">
        <section>
          <h3>Minkowski spacetime diagram</h3>
          <svg
            viewBox="0 0 420 250"
            role="img"
            aria-label="Spacetime diagram with light cone and two events"
          >
            <line className="axis" x1="210" x2="210" y1="10" y2="240" />
            <line className="axis" x1="10" x2="410" y1="125" y2="125" />
            <line className="light" x1="90" x2="330" y1="245" y2="5" />
            <line className="light" x1="90" x2="330" y1="5" y2="245" />
            <line
              className="prime"
              x1="40"
              x2="390"
              y1={125 + beta * 80}
              y2={125 - beta * 80}
            />
            <circle className="event-a" cx={210 - spacing / 10} cy="78" r="7" />
            <circle className="event-b" cx={210 + spacing / 10} cy="78" r="7" />
            <text x={205 - spacing / 10} y="67">
              A
            </text>
            <text x={205 + spacing / 10} y="67">
              B
            </text>
          </svg>
          <label>
            Event scrubber{" "}
            <input
              aria-label="Event scrubber"
              type="range"
              min="0"
              max="1"
              step=".01"
              value={phase}
              onChange={(e) => setPhase(+e.target.value)}
            />
          </label>
        </section>
        <section>
          <h3>Event coordinates</h3>
          <p>Earth S: Δt = 0.000 μs · Δx = {spacing} m</p>
          <p>Ship S′: Δt′ = {deltaPrime.toFixed(3)} μs</p>
          <p>
            A′: ({aPrime.xPrimeM.toFixed(1)} m, {aPrime.timePrimeUs.toFixed(3)}{" "}
            μs)
          </p>
          <p>
            B′: ({bPrime.xPrimeM.toFixed(1)} m, {bPrime.timePrimeUs.toFixed(3)}{" "}
            μs)
          </p>
          <p>
            Interval A: {intervalM2(eventA.x, eventA.t).toExponential(3)} m²
          </p>
        </section>
        <section>
          <h3>Paired light clocks</h3>
          <div className="sr-clocks">
            <i>
              <b style={{ height: `${pulseY * 70}%` }} />
            </i>
            <i>
              <b style={{ height: `${(pulseY * 70) / gamma}%` }} />
            </i>
          </div>
          <p>Proper clock · Earth view</p>
          <p>Both pulses locally travel at c.</p>
        </section>
      </div>
      <div className="sr-mission">
        <div>
          <span>SIMULTANEITY MISSION</span>
          <b>
            Events A and B occur at the same Earth time. Which frame calls them
            simultaneous?
          </b>
          <small>At nonzero v, compare Δt with Δt′.</small>
          <output>{feedback}</output>
        </div>
        <button
          onClick={() => {
            setMission(true);
            setBeta(0.6);
            setSpacing(600);
            setFeedback("Choose a frame, then inspect both time differences.");
          }}
        >
          Start mission
        </button>
        {mission && (
          <>
            <button
              onClick={() =>
                setFeedback(
                  "✓ Earth frame S: Δt=0, while S′ assigns different times.",
                )
              }
            >
              Earth S
            </button>
            <button
              onClick={() =>
                setFeedback("Not S′: relativity of simultaneity gives Δt′≠0.")
              }
            >
              Ship S′
            </button>
          </>
        )}
      </div>
    </section>
  );
}
