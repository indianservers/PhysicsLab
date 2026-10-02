import { useEffect, useState, type CSSProperties } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  frequencyFromWavelengthNm,
  photoelectricState,
} from "./photoelectricSimulation";
import "./photoelectric.css";

const metals = {
  cesium: 1.95,
  potassium: 2.3,
  sodium: 2.28,
  calcium: 2.87,
  zinc: 4.31,
  silver: 4.26,
  copper: 4.7,
  unknown: 3.1,
} as const;
type Metal = keyof typeof metals;
const labels: Record<Metal, string> = {
  cesium: "Cesium (Cs)",
  potassium: "Potassium (K)",
  sodium: "Sodium (Na)",
  calcium: "Calcium (Ca)",
  zinc: "Zinc (Zn)",
  silver: "Silver (Ag)",
  copper: "Copper (Cu)",
  unknown: "Unknown sample",
};
const color = (nm: number) =>
  nm < 380
    ? "#874fff"
    : nm < 450
      ? "#4d55ff"
      : nm < 500
        ? "#00b8ff"
        : nm < 570
          ? "#25d47a"
          : nm < 590
            ? "#f0e51b"
            : nm < 630
              ? "#ff991c"
              : "#e9232e";

export function PhotoelectricLab({ experiment }: DedicatedExperimentLabProps) {
  const [wavelength, setWavelength] = useState(365),
    [intensity, setIntensity] = useState(68),
    [metal, setMetal] = useState<Metal>("zinc"),
    [work, setWork] = useState<number>(metals.zinc),
    [voltage, setVoltage] = useState(-0.85),
    [running, setRunning] = useState(true),
    [phase, setPhase] = useState(0),
    [playback, setPlayback] = useState(1),
    [reduced, setReduced] = useState(false),
    [mission, setMission] = useState(false),
    [estimate, setEstimate] = useState(2.5),
    [feedback, setFeedback] = useState("");
  const frequency = frequencyFromWavelengthNm(wavelength),
    state = photoelectricState(frequency, work, intensity, voltage),
    light = color(wavelength);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => setPhase((p) => (p + (reduced ? 0.08 : 0.025) * playback) % 1),
      reduced ? 140 : 35,
    );
    return () => clearInterval(id);
  }, [playback, reduced, running]);
  const chooseMetal = (m: Metal) => {
    setMetal(m);
    setWork(metals[m]);
    setFeedback("");
  };
  const reset = () => {
    setWavelength(365);
    setIntensity(68);
    setMetal("zinc");
    setWork(4.31);
    setVoltage(-0.85);
    setRunning(true);
    setPhase(0);
    setPlayback(1);
    setReduced(false);
    setMission(false);
    setFeedback("");
  };
  const photonCount = Math.max(1, Math.round(intensity / 10)),
    electronCount = state.emission
      ? Math.max(1, Math.round(intensity / 12))
      : 0;
  const graphPoints = Array.from({ length: 10 }, (_, i) => {
    const f = (5 + i) * 1e14,
      s = photoelectricState(f, work, 100, 0);
    return { x: i * 52, y: 110 - Math.min(100, s.stoppingPotentialV * 24) };
  });
  return (
    <section
      className="pe-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="pe-head" data-ui-theme="dark">
        <div>
          <span>PHOTON ENERGY LAB</span>
          <h2>Photoelectric effect</h2>
          <p>
            Cross the threshold, release electrons, then stop the fastest one.
          </p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="pe-layout">
        <aside className="pe-controls">
          <h3>Light source</h3>
          <label>
            Wavelength λ <output>{wavelength} nm</output>
            <input
              aria-label="Wavelength"
              type="range"
              min="200"
              max="800"
              value={wavelength}
              onChange={(e) => {
                setWavelength(+e.target.value);
                setFeedback("");
              }}
              style={{ accentColor: light }}
            />
          </label>
          <label>
            Frequency f <output>{(frequency / 1e14).toFixed(2)}×10¹⁴ Hz</output>
          </label>
          <label>
            Intensity <output>{intensity}%</output>
            <input
              aria-label="Intensity"
              type="range"
              min="0"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(+e.target.value)}
            />
          </label>
          <h3>Cathode</h3>
          <label>
            Material
            <select
              aria-label="Cathode material"
              value={metal}
              onChange={(e) => chooseMetal(e.target.value as Metal)}
            >
              {Object.keys(metals).map((k) => (
                <option key={k} value={k}>
                  {labels[k as Metal]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Work function φ <output>{work.toFixed(2)} eV</output>
            <input
              aria-label="Work function"
              type="range"
              min="1.5"
              max="5.5"
              step=".01"
              value={work}
              onChange={(e) => {
                setWork(+e.target.value);
                setFeedback("");
              }}
            />
          </label>
          <label>
            Applied voltage <output>{voltage.toFixed(2)} V</output>
            <input
              aria-label="Stopping voltage"
              type="range"
              min="-6"
              max="2"
              step=".01"
              value={voltage}
              onChange={(e) => setVoltage(+e.target.value)}
            />
          </label>
          <div className="pe-presets">
            <button onClick={() => setWavelength(800)}>Minimums</button>
            <button onClick={() => setWavelength(365)}>Typical</button>
            <button onClick={() => setWavelength(200)}>Maximums</button>
          </div>
        </aside>
        <main className="pe-center">
          <div className="pe-transport">
            <button onClick={() => setRunning(true)}>▶ Play</button>
            <button onClick={() => setRunning(false)}>Ⅱ Pause</button>
            <button onClick={() => setPhase((p) => (p + 0.08) % 1)}>
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
            className="pe-stage"
            role="img"
            aria-label={`${state.emission ? "Photoelectrons emitted" : "No emission"}; maximum kinetic energy ${state.kineticMaxEv.toFixed(2)} electron volts`}
          >
            <img
              src="/assets/experiments/photoelectric-equation/photoelectric-tube.png"
              alt="Photoelectric vacuum tube, lamp, ammeter, and voltage supply"
            />
            <div
              className="pe-photons"
              style={{ "--light": light } as CSSProperties}
            >
              {Array.from({ length: photonCount }, (_, i) => (
                <i
                  key={i}
                  style={{ animationDelay: `${-phase + i / photonCount}s` }}
                />
              ))}
            </div>
            <div className="pe-electrons">
              {Array.from({ length: electronCount }, (_, i) => (
                <i
                  key={i}
                  style={{
                    animationDelay: `${-phase + i / electronCount}s`,
                    animationDuration: `${Math.max(0.5, 1.5 - state.kineticMaxEv * 0.12)}s`,
                  }}
                />
              ))}
            </div>
            <strong className="pe-ammeter">
              {state.photocurrentUa.toFixed(2)}
              <small> μA</small>
            </strong>
            <strong className="pe-voltmeter">
              {voltage.toFixed(2)}
              <small> V</small>
            </strong>
          </div>
          <p className={`pe-status ${state.emission ? "on" : ""}`}>
            {state.emission
              ? `✓ hf exceeds φ by ${state.kineticMaxEv.toFixed(2)} eV; electrons emerge.`
              : `Threshold not reached: photon energy ${state.photonEnergyEv.toFixed(2)} eV ≤ φ.`}
          </p>
        </main>
        <aside className="pe-readings">
          <h3>Live measurements</h3>
          <dl>
            <div>
              <dt>Photon energy hf</dt>
              <dd>{state.photonEnergyEv.toFixed(3)} eV</dd>
            </div>
            <div>
              <dt>Work function φ</dt>
              <dd>{work.toFixed(3)} eV</dd>
            </div>
            <div>
              <dt>Kmax</dt>
              <dd>{state.kineticMaxEv.toFixed(3)} eV</dd>
            </div>
            <div>
              <dt>Stopping potential |Vs|</dt>
              <dd>{state.stoppingPotentialV.toFixed(3)} V</dd>
            </div>
            <div>
              <dt>Photocurrent</dt>
              <dd>{state.photocurrentUa.toFixed(2)} μA</dd>
            </div>
          </dl>
          <div className="pe-equation">
            K<sub>max</sub>=hf−φ=e|V<sub>s</sub>|
            <small>
              f₀=φ/h = {(state.thresholdHz / 1e14).toFixed(2)}×10¹⁴ Hz
            </small>
          </div>
        </aside>
      </div>
      <div className="pe-bottom">
        <section>
          <h3>Stopping potential vs frequency</h3>
          <svg
            viewBox="0 0 480 120"
            role="img"
            aria-label="Linear stopping potential versus frequency graph"
          >
            <polyline
              points={graphPoints.map((p) => `${p.x},${p.y}`).join(" ")}
            />
            <line
              x1={(state.thresholdHz / 1e14 - 5) * 52}
              x2={(state.thresholdHz / 1e14 - 5) * 52}
              y1="5"
              y2="115"
            />
          </svg>
          <p>Slope h/e · x-intercept f₀</p>
        </section>
        <section>
          <h3>Intensity comparison</h3>
          <p>
            20% <i style={{ width: "20%" }} /> Kmax{" "}
            {state.kineticMaxEv.toFixed(2)} eV
          </p>
          <p>
            60% <i style={{ width: "60%" }} /> Kmax{" "}
            {state.kineticMaxEv.toFixed(2)} eV
          </p>
          <p>
            100% <i style={{ width: "100%" }} /> Kmax{" "}
            {state.kineticMaxEv.toFixed(2)} eV
          </p>
        </section>
        <section>
          <h3>Threshold test</h3>
          <p>
            {wavelength} nm photons are {state.emission ? "above" : "below"}{" "}
            threshold.
          </p>
          <button
            onClick={() =>
              setWavelength(Math.round((299792458 / state.thresholdHz) * 1e9))
            }
          >
            Move to threshold
          </button>
        </section>
      </div>
      <div className="pe-mission">
        <div>
          <span>UNKNOWN METAL MISSION</span>
          <b>Infer φ from the graph’s threshold intercept.</b>
          <small>Unknown line crosses Vₛ=0 at f₀≈7.50×10¹⁴ Hz.</small>
          <output>{feedback}</output>
        </div>
        <button
          onClick={() => {
            setMission(true);
            setWork(3.1);
            setWavelength(300);
            setMetal("unknown");
            setFeedback("Read φ=hf₀ from the graph, then enter your estimate.");
          }}
        >
          Start mission
        </button>
        {mission && (
          <>
            <label>
              φ estimate{" "}
              <input
                aria-label="Work function estimate"
                type="number"
                step=".05"
                value={estimate}
                onChange={(e) => setEstimate(+e.target.value)}
              />{" "}
              eV
            </label>
            <button
              onClick={() =>
                setFeedback(
                  Math.abs(estimate - 3.1) <= 0.12
                    ? `✓ ${estimate.toFixed(2)} eV identifies the unknown work function.`
                    : `Not yet: multiply the x-intercept by h.`,
                )
              }
            >
              Check work function
            </button>
          </>
        )}
      </div>
    </section>
  );
}
