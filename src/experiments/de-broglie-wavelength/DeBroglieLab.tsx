import { useEffect, useState } from "react";
import { MatterWaveScene } from "./MatterWaveScene";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  electronSpeedFromVoltage,
  diffractionRadius,
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
  const [distance, setDistance] = useState(0.25);
  const [sceneReset, setSceneReset] = useState(0);
  const [running, setRunning] = useState(true);
  const [phase, setPhase] = useState(0);
  const [playback, setPlayback] = useState(1);
  const [reduced, setReduced] = useState(false);
  const [mission, setMission] = useState(false);
  const [feedback, setFeedback] = useState("");
  const wave = matterWave(particle, speed, spacing, distance);
  const ringRadius = diffractionRadius(wave.wavelengthPm, spacing, distance);
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
    setSpeed(Math.sqrt(2 * 1.602176634e-19 * v / particles[particle].massKg));
    setFeedback("");
  };
  const setSpeedLinked = (v: number) => {
    setSpeed(v);
    setVoltage((0.5 * particles[particle].massKg * v ** 2) / 1.602176634e-19);
    setFeedback("");
  };
  const reset = () => {
    setSceneReset(value => value + 1);
    setParticle("electron");
    setVoltage(150);
    setSpeed(electronSpeedFromVoltage(150));
    setSpacing(0.335);
    setDistance(0.25);
    setIntensity(68);
    setRunning(true);
    setPhase(0);
    setPlayback(1);
    setReduced(false);
    setMission(false);
    setFeedback("");
  };
  const waveCycles = Math.max(
    5,
    Math.min(18, 8 + 500 / Math.max(wave.wavelengthPm, 30)),
  );
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
              disabled={!charged}
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
            Screen distance <output>{f(distance, 2)} m</output>
            <input aria-label="Screen distance" type="range" min="0.1" max="0.5" step="0.01" value={distance} onChange={event => setDistance(Number(event.target.value))} />
          </label>
          <label>
            Beam intensity <output>{intensity}%</output>
            <input
              aria-label="Beam intensity"
              type="range"
              min="0"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(+e.target.value)}
            />
          </label>
          <div className="db-presets">
            <button disabled={!charged} onClick={() => setVoltageLinked(50)}>Minimums</button>
            <button disabled={!charged} onClick={() => setVoltageLinked(150)}>Typical</button>
            <button disabled={!charged} onClick={() => setVoltageLinked(5000)}>Maximums</button>
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
            <button onClick={() => { setRunning(false); setPhase((p) => (p + 0.04) % 1); }}>
              ▷ Step
            </button>
            <button onClick={() => { setPhase(0); setRunning(true); }}>↺ Replay</button>
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
            aria-label={`${particles[particle].label} beam with wavelength ${f(wave.wavelengthPm, 2)} picometres and fringe spacing ${f(wave.fringeSpacingMm, 3)} millimetres`}
          >
            <MatterWaveScene key={sceneReset} phase={phase} wavelengthPm={wave.wavelengthPm} spacingNm={spacing} distanceM={distance} intensity={intensity} onDistance={setDistance} onSpacing={setSpacing} />
          </div>
          <p className="db-caption">
            Shorter λ tightens the diffraction pattern. Beam motion and wave amplitude are slowed and enlarged for visibility. Screen radius: {ringRadius === null ? "no forward ring" : `${f(ringRadius * 1000, 2)} mm`}.
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
            electron: λ = h/√(2mₑeV)<small>2d sin θ = λ · ring radius = L tan 2θ<br />Δy ≈ Lλ/d · L={f(distance, 3)} m</small>
          </div>
          <h3>Wavelength ruler</h3>
          <div className="db-ruler">
            <i style={{ left: `${Math.min(100, wave.wavelengthPm / 2)}%` }} />
          </div>
          <h3 style={{ marginTop: 20 }}>Detector · front view</h3>
          <svg className="db-detector" viewBox="-170 -170 340 340" role="img" aria-label="Diffraction pattern on a screen of radius 167 millimetres">
            <circle r="167" fill="#081e19" stroke="#637d82" strokeWidth="3" />
            {[1, 2, 3].map(order => {
              const radius = diffractionRadius(wave.wavelengthPm, spacing, distance, order);
              return radius !== null && radius * 1000 < 167 ? <circle key={order} r={radius * 1000} fill="none" stroke="#91ffa6" strokeWidth="2" opacity={intensity / 100} /> : null;
            })}
            <circle r="3" fill="#baffc2" opacity={intensity / 100} />
          </svg>
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
              <i style={{ width: `${50 / k}%` }} />
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
