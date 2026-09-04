import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { computeLcr, resonanceSeries, type LcrInput } from "./lcrPhysics";
import "./lcr-resonance.css";

const ROOT = "/assets/experiments/ac-lcr-resonance",
  DEFAULTS = {
    frequency: 50,
    resistance: 40,
    inductance: 0.2,
    capacitance: 50e-6,
    sourceVoltage: 10,
  };
type RunState = "idle" | "running" | "paused" | "result";
export function LcrResonanceLab({ experiment }: DedicatedExperimentLabProps) {
  const [values, setValues] = useState(DEFAULTS),
    [runState, setRunState] = useState<RunState>("idle"),
    [time, setTime] = useState(0),
    [playback, setPlayback] = useState(1),
    [reducedMotion, setReducedMotion] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [sweeping, setSweeping] = useState(false),
    [resetViewSignal, setResetViewSignal] = useState(0);
  const input = useMemo<LcrInput>(() => values, [values]),
    result = useMemo(() => computeLcr(input), [input]),
    atResonance =
      Math.abs(values.frequency - result.resonanceFrequency) /
        result.resonanceFrequency <
      0.005,
    missionClean =
      values.resistance === DEFAULTS.resistance &&
      values.inductance === DEFAULTS.inductance &&
      values.capacitance === DEFAULTS.capacitance &&
      values.sourceVoltage === DEFAULTS.sourceVoltage;
  useEffect(() => {
    if (runState !== "running") return;
    let frame = 0,
      last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setTime((currentTime) => {
        const nextTime = currentTime + dt * playback * (reducedMotion ? 0.12 : 1);
        if (sweeping) setValues((current) => {
          const f0 = computeLcr(current).resonanceFrequency;
          const frequency = f0 * (0.35 + 1.45 * ((Math.sin(nextTime * 0.75) + 1) / 2));
          return { ...current, frequency: Math.max(1, Math.min(500, frequency)) };
        });
        return nextTime;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [runState, playback, reducedMotion, sweeping]);
  const update = (key: keyof typeof DEFAULTS, value: number) =>
      setValues((v) => ({ ...v, [key]: value })),
    reset = () => {
      setValues(DEFAULTS);
      setRunState("idle");
      setTime(0);
      setSweeping(false);
    };
  const phase = 2 * Math.PI * values.frequency * time,
    energyL = Math.sin(phase) ** 2,
    energyC = Math.cos(phase) ** 2,
    missionComplete = atResonance && missionClean;
  return (
    <section
      className="lcr-lab"
      data-ui-theme="dark"
      data-run-state={runState}
      data-mission={missionComplete ? "complete" : "tuning"}
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="lcr-head">
        <div>
          <span>PHYSICS LAB · AC CIRCUITS</span>
          <h2>Series LCR Circuit — Resonance Lab</h2>
          <p>
            Tune frequency, compare reactances, and watch current phase change.
          </p>
        </div>
        <div>
          <button onClick={() => setResetViewSignal((v) => v + 1)}>
            ◎ Reset view
          </button>
          <button onClick={reset}>↻ Reset experiment</button>
        </div>
      </header>
      <div className="lcr-top">
        <main className="lcr-stage">
          <LcrScene
            result={result}
            phase={phase}
            running={runState === "running"}
            reducedMotion={reducedMotion}
            resetViewSignal={resetViewSignal}
          />
          <div className="lcr-source">
            <span>AC SOURCE</span>
            <strong>{values.frequency.toFixed(1)} Hz</strong>
            <b>{values.sourceVoltage.toFixed(1)} V RMS</b>
          </div>
          <div className="lcr-labels">
            <span>
              R<br />
              <b>{values.resistance} Ω</b>
            </span>
            <span>
              L<br />
              <b>{(values.inductance * 1000).toFixed(0)} mH</b>
            </span>
            <span>
              C<br />
              <b>{(values.capacitance * 1e6).toFixed(0)} μF</b>
            </span>
          </div>
          <div className="lcr-energy">
            <span>
              Capacitor energy <i style={{ width: `${energyC * 100}%` }} />
            </span>
            <span>
              Inductor energy <i style={{ width: `${energyL * 100}%` }} />
            </span>
          </div>
        </main>
        <aside className="lcr-controls" aria-label="LCR circuit controls">
          <h3>Parameters & controls</h3>
          <Control
            label="Frequency"
            symbol="f"
            value={values.frequency}
            min={1}
            max={500}
            step={0.1}
            unit="Hz"
            onChange={(v) => {
              update("frequency", v);
              setSweeping(false);
            }}
          />
          <Control
            label="Source voltage"
            symbol="V"
            value={values.sourceVoltage}
            min={0.1}
            max={100}
            step={0.1}
            unit="V"
            onChange={(v) => update("sourceVoltage", v)}
          />
          <Control
            label="Resistance"
            symbol="R"
            value={values.resistance}
            min={1}
            max={500}
            step={1}
            unit="Ω"
            onChange={(v) => update("resistance", v)}
          />
          <Control
            label="Inductance"
            symbol="L"
            value={values.inductance * 1000}
            min={1}
            max={2000}
            step={1}
            unit="mH"
            onChange={(v) => update("inductance", v / 1000)}
          />
          <Control
            label="Capacitance"
            symbol="C"
            value={values.capacitance * 1e6}
            min={0.1}
            max={1000}
            step={0.1}
            unit="μF"
            onChange={(v) => update("capacitance", v / 1e6)}
          />
          <div className="lcr-presets">
            <button
              onClick={() =>
                update("frequency", result.resonanceFrequency * 0.55)
              }
            >
              Below resonance
            </button>
            <button
              onClick={() => update("frequency", result.resonanceFrequency)}
            >
              Resonance
            </button>
            <button
              onClick={() =>
                update("frequency", result.resonanceFrequency * 1.8)
              }
            >
              Above resonance
            </button>
          </div>
          <div className="lcr-play">
            <button className="primary" onClick={() => setRunState("running")}>
              ▶ {runState === "paused" ? "Resume" : "Run"}
            </button>
            <button
              onClick={() => setRunState("paused")}
              disabled={runState !== "running"}
            >
              Ⅱ Pause
            </button>
            <button
              onClick={() => {
                setTime((t) => t + 1 / (values.frequency * 12));
                setRunState("paused");
              }}
            >
              ▮▶ Step
            </button>
            <button
              onClick={() => {
                setSweeping((v) => !v);
                setRunState("running");
              }}
            >
              {sweeping ? "■ Stop sweep" : "⌁ Sweep"}
            </button>
          </div>
          <div className="lcr-options">
            <label>
              Speed{" "}
              <select
                aria-label="Playback speed"
                value={playback}
                onChange={(e) => setPlayback(Number(e.target.value))}
              >
                {[0.25, 0.5, 1, 1.5, 2].map((v) => (
                  <option key={v} value={v}>
                    {v}×
                  </option>
                ))}
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
              />{" "}
              Reduced motion
            </label>
          </div>
        </aside>
      </div>
      <div className="lcr-meters">
        <Meter label="AC voltmeter" value={result.voltageR} unit="V RMS" />
        <Meter
          label="AC ammeter"
          value={result.current}
          unit="A RMS"
          tone="orange"
        />
        <Meter
          label="Real power"
          value={result.realPower}
          unit="W"
          tone="green"
        />
        <div className="lcr-values">
          {[
            ["Xᴸ", result.xL, "Ω"],
            ["Xᶜ", result.xC, "Ω"],
            ["Z", result.impedance, "Ω"],
            ["φ", result.phaseDeg, "°"],
            ["cos φ", result.powerFactor, ""],
          ].map(([k, v, u]) => (
            <dl key={k as string}>
              <dt>{k}</dt>
              <dd>
                {Number(v).toFixed(2)} {u}
              </dd>
            </dl>
          ))}
        </div>
        <div className="lcr-f0">
          <span>RESONANT FREQUENCY</span>
          <strong>{result.resonanceFrequency.toFixed(2)} Hz</strong>
        </div>
        <div
          className={`lcr-status ${atResonance ? "resonant" : result.currentRelation}`}
        >
          <span>STATUS</span>
          <strong>
            {atResonance
              ? "At resonance — V and I in phase"
              : values.frequency < result.resonanceFrequency
                ? "Below resonance — current leads"
                : "Above resonance — current lags"}
          </strong>
        </div>
      </div>
      <div className="lcr-analysis">
        <WaveGraph input={input} time={time} />
        <Phasor result={result} />
        <ResponseGraph input={input} />
        <section className="lcr-equations">
          <h3>Key equations</h3>
          <p>
            X<sub>L</sub> = 2πfL
          </p>
          <p>
            X<sub>C</sub> = 1/(2πfC)
          </p>
          <p>
            Z = √(R² + (X<sub>L</sub>−X<sub>C</sub>)²)
          </p>
          <p>f₀ = 1/(2π√LC)</p>
          <small>
            At resonance: X<sub>L</sub>=X<sub>C</sub>, Z=R, φ=0°, and current is
            maximum.
          </small>
        </section>
      </div>
      <section className={`lcr-mission ${missionComplete ? "complete" : ""}`}>
        <div>
          <span>MINI-MISSION · FREQUENCY ONLY</span>
          <h3>Tune the circuit to resonance</h3>
        </div>
        <strong>
          Δf ={" "}
          {Math.abs(values.frequency - result.resonanceFrequency).toFixed(2)} Hz
        </strong>
        <p>
          {!missionClean
            ? "Reset non-frequency controls; this mission permits only frequency changes."
            : missionComplete
              ? `✓ Resonance locked: Z = R = ${values.resistance.toFixed(1)} Ω and φ ≈ 0°.`
              : `Move frequency ${values.frequency < result.resonanceFrequency ? "up" : "down"} toward ${result.resonanceFrequency.toFixed(2)} Hz.`}
        </p>
      </section>
      <p className="lcr-sr" aria-live="polite">
        Frequency {values.frequency.toFixed(2)} hertz. Resonance{" "}
        {result.resonanceFrequency.toFixed(2)} hertz. Impedance{" "}
        {result.impedance.toFixed(2)} ohms. Current {result.current.toFixed(3)}{" "}
        amperes. Current {result.currentRelation} source voltage. Mission{" "}
        {missionComplete ? "complete" : "in progress"}.
      </p>
    </section>
  );
}
function Control({
  label,
  symbol,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="lcr-control">
      <span>
        <b>
          {label} <i>{symbol}</i>
        </b>
        <span>
          <input
            type="number"
            aria-label={`${label} value`}
            value={Number(value.toFixed(step < 1 ? 1 : 0))}
            min={min}
            max={max}
            step={step}
            onChange={(e) =>
              onChange(Math.max(min, Math.min(max, Number(e.target.value))))
            }
          />
          <small>{unit}</small>
        </span>
      </span>
      <input
        type="range"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
function Meter({
  label,
  value,
  unit,
  tone = "blue",
}: {
  label: string;
  value: number;
  unit: string;
  tone?: string;
}) {
  return (
    <section className={`lcr-meter ${tone}`}>
      <h3>{label}</h3>
      <strong>
        {value.toFixed(3)} <small>{unit}</small>
      </strong>
    </section>
  );
}

function WaveGraph({ input, time }: { input: LcrInput; time: number }) {
  const r = computeLcr(input),
    w = 420,
    h = 180,
    p = 20,
    phase = r.phaseRad;
  const voltage = Array.from({ length: 121 }, (_, i) => {
      const q = (i / 120) * Math.PI * 4;
      return [p + (i / 120) * (w - 2 * p), h / 2 - Math.sin(q) * (h / 2 - p)];
    }),
    current = voltage.map((point, i) => [
      point[0],
      h / 2 - Math.sin((i / 120) * Math.PI * 4 - phase) * (h / 2 - p) * 0.8,
    ]);
  const path = (pts: number[][]) =>
      pts.map((v, i) => `${i ? "L" : "M"}${v[0]},${v[1]}`).join(" "),
    cursor = p + (((time * input.frequency) % 2) / 2) * (w - 2 * p);
  return (
    <section className="lcr-wave">
      <h3>
        Oscilloscope <span>V & I</span>
      </h3>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Voltage and current oscilloscope showing their phase difference"
      >
        <path className="voltage" d={path(voltage)} />
        <path className="current" d={path(current)} />
        <line x1={cursor} x2={cursor} y1={p} y2={h - p} />
        <text x={p} y={12}>
          V source
        </text>
        <text x={w - p} y={12} textAnchor="end">
          I circuit
        </text>
      </svg>
    </section>
  );
}
function Phasor({ result }: { result: ReturnType<typeof computeLcr> }) {
  const w = 270,
    h = 180,
    cx = 120,
    cy = 92,
    scale = 70 / Math.max(result.voltageR, result.voltageL, result.voltageC, 1);
  return (
    <section className="lcr-phasor">
      <h3>Phasor diagram</h3>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Voltage phasors with current as horizontal reference"
      >
        <line className="axis" x1={20} x2={245} y1={cy} y2={cy} />
        <line
          className="vr"
          x1={cx}
          y1={cy}
          x2={cx + result.voltageR * scale}
          y2={cy}
        />
        <line
          className="vl"
          x1={cx}
          y1={cy}
          x2={cx}
          y2={cy - result.voltageL * scale}
        />
        <line
          className="vc"
          x1={cx}
          y1={cy}
          x2={cx}
          y2={cy + result.voltageC * scale}
        />
        <line
          className="vs"
          x1={cx}
          y1={cy}
          x2={cx + result.voltageR * scale}
          y2={cy - (result.voltageL - result.voltageC) * scale}
        />
        <text x={cx + result.voltageR * scale} y={cy - 5}>
          Vᴿ
        </text>
        <text x={cx + 5} y={cy - result.voltageL * scale}>
          Vᴸ
        </text>
        <text x={cx + 5} y={cy + result.voltageC * scale}>
          Vᶜ
        </text>
      </svg>
    </section>
  );
}
function ResponseGraph({ input }: { input: LcrInput }) {
  const data = useMemo(() => resonanceSeries(input, 181), [input]),
    r = computeLcr(input),
    w = 420,
    h = 180,
    l = 35,
    rr = 12,
    t = 18,
    b = 25,
    max = Math.max(...data.map((v) => v.current)),
    minF = data[0].frequency,
    maxF = data[data.length - 1].frequency,
    x = (f: number) => l + ((f - minF) / (maxF - minF)) * (w - l - rr),
    y = (i: number) => t + (1 - i / max) * (h - t - b),
    path = data
      .map((v, i) => `${i ? "L" : "M"}${x(v.frequency)},${y(v.current)}`)
      .join(" ");
  return (
    <section className="lcr-response">
      <h3>
        Resonance curve <span>I vs frequency</span>
      </h3>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Circuit current amplitude and phase response versus frequency"
      >
        <path d={path} />
        <line
          className="f0"
          x1={x(r.resonanceFrequency)}
          x2={x(r.resonanceFrequency)}
          y1={t}
          y2={h - b}
        />
        <line
          className="cursor"
          x1={x(input.frequency)}
          x2={x(input.frequency)}
          y1={t}
          y2={h - b}
        />
        <text x={x(r.resonanceFrequency)} y={14}>
          f₀
        </text>
        <text x={l} y={h - 4}>
          {minF.toFixed(0)} Hz
        </text>
        <text x={w - rr} y={h - 4} textAnchor="end">
          {maxF.toFixed(0)} Hz
        </text>
      </svg>
      <p>
        Bandwidth {r.bandwidth.toFixed(2)} Hz · Q {r.qualityFactor.toFixed(2)}
      </p>
    </section>
  );
}

type SceneRuntime = {
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  coils: THREE.Object3D[];
  meter?: THREE.Object3D;
  effects: THREE.Sprite[];
  reset: () => void;
};
function LcrScene({
  result,
  phase,
  running,
  reducedMotion,
  resetViewSignal,
}: {
  result: ReturnType<typeof computeLcr>;
  phase: number;
  running: boolean;
  reducedMotion: boolean;
  resetViewSignal: number;
}) {
  const host = useRef<HTMLDivElement>(null),
    runtime = useRef<SceneRuntime | null>(null),
    live = useRef({ result, phase, running, reducedMotion }),
    [selected, setSelected] = useState("inductor");
  useEffect(() => {
    live.current = { result, phase, running, reducedMotion };
  }, [result, phase, running, reducedMotion]);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(40, 1, 0.01, 100),
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
    renderer.setPixelRatio(Math.min(2, devicePixelRatio));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    el.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 4;
    controls.maxDistance = 14;
    const reset = () => {
      camera.position.set(4.8, 4.5, 7.5);
      controls.target.set(0, 0, 0);
      controls.update();
    };
    reset();
    scene.add(new THREE.HemisphereLight(0xe5f2ff, 0x18202a, 2.5));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(5, 7, 5);
    scene.add(light);
    const data: SceneRuntime = {
      camera,
      controls,
      coils: [],
      effects: [],
      reset,
    };
    runtime.current = data;
    new GLTFLoader().load(`${ROOT}/ac-lcr-resonance.glb`, (g) => {
      const model = g.scene,
        box = new THREE.Box3().setFromObject(model),
        size = box.getSize(new THREE.Vector3()),
        center = box.getCenter(new THREE.Vector3()),
        scale = 4.8 / Math.max(size.x, size.y, size.z);
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));
      scene.add(model);
      data.coils = Array.from({ length: 144 }, (_, i) =>
        model.getObjectByName(`inductor_${String(i).padStart(3, "0")}`),
      ).filter((v): v is THREE.Object3D => Boolean(v));
      data.meter = model.getObjectByName("meter_dial");
    });
    ["concept_effect.png", "interaction_overlay.png"].forEach((name, i) =>
      new THREE.TextureLoader().load(`${ROOT}/effects/${name}`, (texture) => {
        const s = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: i ? 0.04 : 0.07,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        s.scale.set(5, 3, 1);
        s.position.z = -1;
        scene.add(s);
        data.effects.push(s);
      }),
    );
    const resize = () => {
      const w = Math.max(1, el.clientWidth),
        h = Math.max(1, el.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = camera.aspect < 1 ? 72 : 40;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    let frame = 0;
    const draw = () => {
      const now = live.current,
        intensity = Math.min(
          1,
          (now.result.current * now.result.impedance) / 10,
        );
      data.coils.forEach((coil, i) => {
        const material = (coil as THREE.Mesh)
          .material as THREE.MeshStandardMaterial;
        if (material?.emissive) {
          material.emissive.set(0xff6b20);
          material.emissiveIntensity = now.running
            ? intensity * (0.25 + 0.2 * Math.sin(now.phase + i * 0.08))
            : 0;
        }
      });
      if (data.meter)
        data.meter.rotation.z =
          -0.6 + Math.min(1, now.result.current / 0.5) * 1.2;
      data.effects.forEach((s, i) => {
        (s.material as THREE.SpriteMaterial).opacity = now.running
          ? i
            ? 0.08
            : 0.13
          : i
            ? 0.025
            : 0.05;
        s.material.rotation = now.reducedMotion
          ? 0
          : now.phase * (i ? -0.01 : 0.015);
      });
      controls.update();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
      runtime.current = null;
    };
  }, []);
  useEffect(() => runtime.current?.reset(), [resetViewSignal]);
  return (
    <div
      ref={host}
      className="lcr-three"
      role="application"
      tabIndex={0}
      aria-label="Rotatable series LCR circuit. Drag to orbit and wheel or pinch to zoom."
      onKeyDown={(e) => {
        const r = runtime.current;
        if (!r) return;
        if (e.key === "0") r.reset();
        if (e.key === "ArrowLeft")
          r.camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.12);
        if (e.key === "ArrowRight")
          r.camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.12);
        if (e.key === "+") r.camera.position.multiplyScalar(0.9);
        if (e.key === "-") r.camera.position.multiplyScalar(1.1);
        r.camera.lookAt(r.controls.target);
      }}
    >
      <span className="lcr-selection">Selected: {selected}</span>
      <span className="lcr-parts">
        <button onClick={() => setSelected("AC source")}>AC source</button>
        <button onClick={() => setSelected("inductor")}>Inductor</button>
        <button onClick={() => setSelected("capacitor")}>Capacitor</button>
        <button onClick={() => setSelected("resistor")}>Resistor</button>
      </span>
    </div>
  );
}
