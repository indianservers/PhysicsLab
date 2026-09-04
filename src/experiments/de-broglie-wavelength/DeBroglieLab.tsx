import { useEffect, useState, type CSSProperties } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  electronSpeedFromVoltage,
  matterWave,
  particles,
  type ParticleKey,
} from "./deBroglieSimulation";
import "./de-broglie.css";

const f = (n: number, d = 2) => (Number.isFinite(n) ? n.toFixed(d) : "—");

export function DeBroglieLab({ experiment }: DedicatedExperimentLabProps) {
  const [particle, setParticle] = useState<ParticleKey>("electron");
  const [voltage, setVoltage] = useState(150);
  const [speed, setSpeed] = useState(electronSpeedFromVoltage(150));
  const [spacing, setSpacing] = useState(0.335);
  const [intensity, setIntensity] = useState(68);
  const [running, setRunning] = useState(true);
  const [phase, setPhase] = useState(0);
  const [playback, setPlayback] = useState(1);
  const [reduced, setReduced] = useState(false);
  const [mission, setMission] = useState(false);
  const [feedback, setFeedback] = useState("");
  const wave = matterWave(particle, speed, spacing);
  const charged = particles[particle].chargeE !== 0;
  const targetPm = 70.81;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => setPhase((p) => (p + (reduced ? 0.03 : 0.012) * playback) % 1),
      reduced ? 120 : 24,
    );
    return () => clearInterval(id);
  }, [playback, reduced, running]);

  const setVoltageLinked = (v: number) => {
    setVoltage(v);
    setParticle("electron");
    setSpeed(electronSpeedFromVoltage(v));
    setFeedback("");
  };
  const setSpeedLinked = (v: number) => {
    setSpeed(v);
    setVoltage((0.5 * particles[particle].massKg * v ** 2) / 1.602176634e-19);
    setFeedback("");
  };
  const reset = () => {
    setParticle("electron");
    setVoltage(150);
    setSpeed(electronSpeedFromVoltage(150));
    setSpacing(0.335);
    setIntensity(68);
    setRunning(true);
    setPhase(0);
    setPlayback(1);
    setReduced(false);
    setMission(false);
    setFeedback("");
  };
  const ringGap = Math.max(13, Math.min(35, 16 + wave.fringeSpacingMm * 75));
  const waveCycles = Math.max(
    5,
    Math.min(18, 8 + 500 / Math.max(wave.wavelengthPm, 30)),
  );
  const dots = Array.from({ length: 13 }, (_, i) => i);
  const path = Array.from({ length: 61 }, (_, i) => {
    const x = i * 10;
    const envelope = Math.sin((Math.PI * i) / 60) ** 1.4;
    const y =
      60 -
      Math.sin((i / 60) * Math.PI * 2 * waveCycles - phase * Math.PI * 2) *
        42 *
        envelope;
    return `${i ? "L" : "M"}${x},${y}`;
  }).join(" ");

  return (
    <section
      className="db-lab"
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="db-head" data-ui-theme="dark">
        <div>
          <span>MATTER-WAVE BENCH</span>
          <h2>Electron diffraction</h2>
          <p>Momentum writes the wavelength; the screen reveals it.</p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="db-layout">
        <aside className="db-controls">
          <h3>Setup</h3>
          <label>
            Particle
            <select
              aria-label="Particle type"
              value={particle}
              onChange={(e) => {
                const p = e.target.value as ParticleKey;
                setParticle(p);
                setVoltage(
                  (0.5 * particles[p].massKg * speed ** 2) / 1.602176634e-19,
                );
              }}
            >
              <option value="electron">Electron (e⁻)</option>
              <option value="proton">Proton (p⁺)</option>
              <option value="neutron">Neutron (n⁰)</option>
            </select>
          </label>
          <label>
            Accelerating voltage <output>{f(voltage / 1000, 3)} kV</output>
            <input
              aria-label="Accelerating voltage"
              type="range"
              min="50"
              max="5000"
              step="10"
              value={Math.min(5000, voltage)}
              onChange={(e) => setVoltageLinked(+e.target.value)}
            />
          </label>
          <label>
            Particle speed <output>{speed.toExponential(3)} m/s</output>
            <input
              aria-label="Particle speed"
              type="range"
              min="100000"
              max="150000000"
              step="100000"
              value={speed}
              onChange={(e) => setSpeedLinked(+e.target.value)}
            />
          </label>
          <label>
            Slit / plane spacing <output>{f(spacing, 3)} nm</output>
            <input
              aria-label="Slit spacing"
              type="range"
              min="0.2"
              max="0.8"
              step="0.005"
              value={spacing}
              onChange={(e) => setSpacing(+e.target.value)}
            />
          </label>
          <label>
            Beam intensity <output>{intensity}%</output>
            <input
              aria-label="Beam intensity"
              type="range"
              min="10"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(+e.target.value)}
            />
          </label>
          <div className="db-presets">
            <button onClick={() => setVoltageLinked(50)}>Minimums</button>
            <button onClick={() => setVoltageLinked(150)}>Typical</button>
            <button onClick={() => setVoltageLinked(5000)}>Maximums</button>
          </div>
          {!charged && (
            <p>
              Neutral particles are set by speed; the voltage readout is the
              equivalent kinetic energy per elementary charge.
            </p>
          )}
          {wave.beta > 0.2 && (
            <p className="db-warning">
              ⚠ v/c = {f(wave.beta, 2)}. The displayed classroom model is
              nonrelativistic.
            </p>
          )}
        </aside>
        <main className="db-center">
          <div className="db-transport">
            <button onClick={() => setRunning(true)}>▶ Play</button>
            <button onClick={() => setRunning(false)}>Ⅱ Pause</button>
            <button onClick={() => setPhase((p) => (p + 0.04) % 1)}>
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
                <option>.25</option>
                <option>.5</option>
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
            className="db-stage"
            role="img"
            aria-label={`${particles[particle].label} beam with wavelength ${f(wave.wavelengthPm, 2)} picometres and fringe spacing ${f(wave.fringeSpacingMm, 3)} millimetres`}
          >
            <img
              src="/assets/experiments/de-broglie-wavelength/electron-diffraction-apparatus.png"
              alt="Electron diffraction tube apparatus"
            />
            <div
              className="db-beam"
              style={{ "--beam-opacity": intensity / 100 } as CSSProperties}
            >
              {dots.map((i) => (
                <i
                  key={i}
                  style={{
                    left: `${28 + i * 3.1}%`,
                    animationDelay: `${-phase * 1.2 + i * 0.07}s`,
                  }}
                />
              ))}
            </div>
            <div
              className="db-rings"
              style={
                {
                  "--gap": `${ringGap}px`,
                  "--glow": intensity / 100,
                } as CSSProperties
              }
            >
              {[1, 2, 3, 4].map((i) => (
                <i
                  key={i}
                  style={{
                    width: `calc(var(--gap) * ${i})`,
                    height: `calc(var(--gap) * ${i})`,
                  }}
                />
              ))}
            </div>
            <b className="db-cathode">HEATED CATHODE</b>
            <b className="db-crystal">CRYSTAL</b>
            <b className="db-screen">DIFFRACTION SCREEN</b>
          </div>
          <p className="db-caption">
            Particles build a phase wave from source to screen; shorter λ
            tightens the diffraction pattern.
          </p>
        </main>
        <aside className="db-readings">
          <h3>Live measurements</h3>
          <dl>
            <div>
              <dt>Wavelength λ</dt>
              <dd>{f(wave.wavelengthPm, 3)} pm</dd>
            </div>
            <div>
              <dt>Momentum p</dt>
              <dd>{wave.momentum.toExponential(3)} kg·m/s</dd>
            </div>
            <div>
              <dt>Kinetic energy</dt>
              <dd>{f(wave.kineticEnergyJ / 1.602176634e-19, 2)} eV</dd>
            </div>
            <div>
              <dt>Fringe spacing</dt>
              <dd>{f(wave.fringeSpacingMm, 3)} mm</dd>
            </div>
          </dl>
          <div className="db-equation">
            λ = h/p
            <br />
            electron: λ = h/√(2mₑeV)<small>Δy ≈ Lλ/d · L=0.250 m</small>
          </div>
          <h3>Wavelength ruler</h3>
          <div className="db-ruler">
            <i style={{ left: `${Math.min(100, wave.wavelengthPm / 2)}%` }} />
          </div>
        </aside>
      </div>
      <div className="db-bottom">
        <section>
          <h3>Wave packet · real space</h3>
          <svg
            viewBox="0 0 600 120"
            role="img"
            aria-label="Animated localized phase wave"
          >
            <path d={path} />
          </svg>
        </section>
        <section>
          <h3>Momentum comparison</h3>
          {[0.5, 1, 2, 4].map((k) => (
            <p key={k}>
              <span>{f(k, 1)}p</span>
              <i style={{ width: `${100 / Math.sqrt(k)}%` }} />
              <b>{f(wave.wavelengthPm / k, 1)} pm</b>
            </p>
          ))}
        </section>
        <section>
          <h3>Observation</h3>
          <p>Double momentum → halve wavelength.</p>
          <p>Increase d → reduce fringe spacing.</p>
        </section>
      </div>
      <div className="db-mission">
        <div>
          <span>MATCH λ MISSION</span>
          <b>
            Set an electron wavelength of {targetPm} ± 0.50 pm using voltage.
          </b>
          <small>Hint: λ ∝ 1/√V.</small>
          <output>{feedback}</output>
        </div>
        <button
          onClick={() => {
            setMission(true);
            setFeedback("Adjust voltage, then check the ruler.");
          }}
        >
          Start mission
        </button>
        {mission && (
          <>
            <button onClick={() => setVoltageLinked(300)}>
              Load near target
            </button>
            <button
              onClick={() =>
                setFeedback(
                  particle === "electron" &&
                    Math.abs(wave.wavelengthPm - targetPm) <= 0.5
                    ? `✓ Matched ${f(wave.wavelengthPm, 2)} pm at ${f(voltage, 0)} V.`
                    : `Not yet: ${f(wave.wavelengthPm, 2)} pm. Adjust the voltage.`,
                )
              }
            >
              Check wavelength
            </button>
          </>
        )}
      </div>
    </section>
  );
}
