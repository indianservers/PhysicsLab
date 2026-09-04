import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  computeAcGenerator,
  generatorSeries,
  normalizeAngle,
  type AcGeneratorInput,
} from "./acGeneratorPhysics";
import "./ac-generator.css";
import "./ac-generator-overrides.css";

const ROOT = "/assets/experiments/ac-generator";
const DEFAULTS = {
  magneticField: 0.5,
  coilArea: 0.02,
  turns: 200,
  angularSpeed: 40 * Math.PI,
  angleRad: Math.PI / 3,
  loadResistance: 20,
};
type RunState = "idle" | "narrated" | "running" | "paused" | "result";

export function AcGeneratorLab({ experiment }: DedicatedExperimentLabProps) {
  const [values, setValues] = useState(DEFAULTS);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [polarity, setPolarity] = useState<1 | -1>(1);
  const [runState, setRunState] = useState<RunState>("idle");
  const [playback, setPlayback] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(
    () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  const [introComplete, setIntroComplete] = useState(false);
  const [introTravel, setIntroTravel] = useState(0);
  const input = useMemo<AcGeneratorInput>(
    () => ({ ...values, direction, polarity }),
    [values, direction, polarity],
  );
  const result = useMemo(() => computeAcGenerator(input), [input]);
  const baselinePeak =
    DEFAULTS.turns *
    DEFAULTS.magneticField *
    DEFAULTS.coilArea *
    DEFAULTS.angularSpeed;
  const missionRatio = result.peakEmf / baselinePeak;
  const missionComplete =
    Math.abs(missionRatio - 2) < 0.04 &&
    values.turns !== DEFAULTS.turns &&
    values.angularSpeed !== DEFAULTS.angularSpeed;

  useEffect(() => {
    if (runState !== "running" && runState !== "narrated") return;
    let frame = 0,
      previous = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      const delta =
        runState === "narrated"
          ? dt * 0.8 * playback
          : dt * values.angularSpeed * direction * playback * (reducedMotion ? 0.05 : 1);
      setValues((current) => ({
        ...current,
        angleRad: normalizeAngle(current.angleRad + delta),
      }));
      if (runState === "narrated")
        setIntroTravel((travel) => {
          const next = travel + Math.abs(delta);
          if (next >= Math.PI * 2) {
            setIntroComplete(true);
            setRunState("running");
            return Math.PI * 2;
          }
          return next;
        });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [runState, values.angularSpeed, direction, playback, reducedMotion]);

  const update = (key: keyof typeof DEFAULTS, value: number) =>
    setValues((current) => ({ ...current, [key]: value }));
  const reset = () => {
    setValues(DEFAULTS);
    setDirection(1);
    setPolarity(1);
    setRunState("idle");
    setIntroComplete(false);
    setIntroTravel(0);
  };
  const start = () => setRunState(introComplete ? "running" : "narrated");
  const cue =
    runState === "narrated"
      ? narratedCue(values.angleRad)
      : result.phase.includes("peak")
        ? `${result.phase}: |ε| = NBAω`
        : result.phase.includes("zero")
          ? `${result.phase}: flux linkage is extremal`
          : "Continuous rotation — waveform and coil are synchronized";

  return (
    <section
      className="ac-lab"
      data-ui-theme="dark"
      data-run-state={runState}
      data-mission={missionComplete ? "complete" : "active"}
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="ac-head">
        <div>
          <span>ELECTROMAGNETIC INDUCTION · CLASS 12</span>
          <h2>AC Generator — Rotating Coil</h2>
          <p>
            Connect coil geometry to changing magnetic flux and sinusoidal emf.
          </p>
        </div>
        <div>
          <button onClick={() => update("angleRad", DEFAULTS.angleRad)}>
            ◎ Reset coil
          </button>
          <button onClick={reset}>↻ Reset experiment</button>
        </div>
      </header>
      <div className="ac-workbench">
        <main className="ac-stage">
          <GeneratorScene
            input={input}
            running={runState === "running" || runState === "narrated"}
            reducedMotion={reducedMotion}
            onAngle={(angleRad) => { update("angleRad", angleRad); setRunState("paused"); }}
          />
          <div className="ac-stage-badge">
            <span>COIL ANGLE</span>
            <strong>
              θ = {((values.angleRad * 180) / Math.PI).toFixed(0)}°
            </strong>
          </div>
          <div className="ac-poles">
            <span>N</span>
            <i>Magnetic field B →</i>
            <span>S</span>
          </div>
          <div className="ac-cue" data-phase={result.phase}>
            <b>
              {runState === "narrated"
                ? `NARRATED REVOLUTION · ${Math.round((introTravel / (2 * Math.PI)) * 100)}%`
                : runState.toUpperCase()}
            </b>
            <span>{cue}</span>
          </div>
        </main>
        <aside className="ac-controls" aria-label="Generator controls">
          <h3>
            Controls <button onClick={reset}>Reset</button>
          </h3>
          <Control
            label="Coil angle"
            symbol="θ"
            value={(values.angleRad * 180) / Math.PI}
            min={0}
            max={360}
            step={1}
            unit="°"
            onChange={(v) => {
              update("angleRad", (v * Math.PI) / 180);
              setRunState("paused");
            }}
          />
          <Control
            label="Angular speed"
            symbol="ω"
            value={values.angularSpeed}
            min={0}
            max={200}
            step={1}
            unit="rad/s"
            onChange={(v) => update("angularSpeed", v)}
          />
          <Control
            label="Turns"
            symbol="N"
            value={values.turns}
            min={1}
            max={500}
            step={1}
            unit="turns"
            onChange={(v) => update("turns", Math.round(v))}
          />
          <Control
            label="Coil area"
            symbol="A"
            value={values.coilArea}
            min={0.005}
            max={0.5}
            step={0.005}
            unit="m²"
            onChange={(v) => update("coilArea", v)}
          />
          <Control
            label="Magnetic field"
            symbol="B"
            value={values.magneticField}
            min={0}
            max={2}
            step={0.01}
            unit="T"
            onChange={(v) => update("magneticField", v)}
          />
          <div className="ac-switches">
            <label>
              Rotation{" "}
              <span>
                <button
                  className={direction === 1 ? "active" : ""}
                  onClick={() => setDirection(1)}
                >
                  CW
                </button>
                <button
                  className={direction === -1 ? "active" : ""}
                  onClick={() => setDirection(-1)}
                >
                  CCW
                </button>
              </span>
            </label>
            <label>
              Field polarity{" "}
              <button onClick={() => setPolarity((p) => (p === 1 ? -1 : 1))}>
                Reverse ({polarity === 1 ? "N → S" : "S → N"})
              </button>
            </label>
          </div>
          <div className="ac-play">
            <button className="primary" onClick={start}>
              ▶{" "}
              {runState === "paused"
                ? "Resume"
                : introComplete
                  ? "Rotate"
                  : "Narrated turn"}
            </button>
            <button
              onClick={() => setRunState("paused")}
              disabled={
                !(["running", "narrated"] as RunState[]).includes(runState)
              }
            >
              Ⅱ Pause
            </button>
            <button
              onClick={() => {
                update(
                  "angleRad",
                  normalizeAngle(values.angleRad + (direction * Math.PI) / 12),
                );
                setRunState("paused");
              }}
            >
              ↷ Step 15°
            </button>
          </div>
          <div className="ac-options">
            <label>
              Speed{" "}
              <select
                aria-label="Playback speed"
                value={playback}
                onChange={(e) => setPlayback(Number(e.target.value))}
              >
                {[0.25, 0.5, 1, 1.5, 2].map((v) => (
                  <option value={v} key={v}>
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
      <div className="ac-instruments">
        <Scope input={input} />
        <Meter
          label="Instantaneous emf"
          value={result.emf}
          unit="V"
          tone={result.emf >= 0 ? "green" : "amber"}
        />
        <Meter
          label="RMS current"
          value={result.rmsCurrent}
          unit="A"
          tone="green"
        />
        <Meter
          label="Frequency"
          value={result.frequency}
          unit="Hz"
          tone="blue"
        />
        <FluxGraph input={input} />
        <section className="ac-physics">
          <h3>Physics</h3>
          <p>
            <b>Flux linkage</b>
            <span>NΦ = NBA cos θ</span>
          </p>
          <p>
            <b>Induced emf</b>
            <span>ε = −d(NΦ)/dt = NBAω sin θ</span>
          </p>
          <small>
            Flux and emf are 90° out of phase. Direction or field reversal flips
            the emf sign.
          </small>
        </section>
      </div>
      <section className={`ac-mission ${missionComplete ? "complete" : ""}`}>
        <div>
          <span>MINI-MISSION</span>
          <h3>Double the default peak emf</h3>
          <p>
            Change both angular speed and turns. Keep B and A available for
            investigation.
          </p>
        </div>
        <strong>
          {missionRatio.toFixed(2)}× <small>target 2.00×</small>
        </strong>
        <p>
          {missionComplete
            ? "✓ Exact target reached: turns and speed both contribute to εpeak."
            : missionRatio < 2
              ? `${(2 - missionRatio).toFixed(2)}× more peak emf needed.`
              : `Reduce the product Nω by ${(missionRatio - 2).toFixed(2)}×.`}
        </p>
      </section>
      <p className="ac-sr" aria-live="polite">
        Angle {((values.angleRad * 180) / Math.PI).toFixed(0)} degrees. Flux
        linkage {fmt(result.fluxLinkage)} weber-turns. Emf {fmt(result.emf)}{" "}
        volts, {result.phase}. Peak emf {fmt(result.peakEmf)} volts. Mission{" "}
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
    <label className="ac-control">
      <span>
        <b>
          {label} <i>{symbol}</i>
        </b>
        <span>
          <input
            type="number"
            aria-label={`${label} value`}
            value={Number(value.toFixed(step < 0.01 ? 3 : step < 1 ? 2 : 0))}
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
  tone,
}: {
  label: string;
  value: number;
  unit: string;
  tone: string;
}) {
  return (
    <section className={`ac-meter ${tone}`}>
      <h3>{label}</h3>
      <strong>
        {value >= 0 ? "+" : ""}
        {fmt(value)} <small>{unit}</small>
      </strong>
    </section>
  );
}
function narratedCue(angle: number) {
  const q = Math.round(normalizeAngle(angle) / (Math.PI / 2)) % 4;
  return q === 0
    ? "Flux is maximum; emf crosses zero."
    : q === 1
      ? "Flux crosses zero; positive emf peaks."
      : q === 2
        ? "Flux is minimum; emf crosses zero and reverses."
        : "Flux crosses zero; negative emf peaks.";
}
const fmt = (v: number) =>
  Math.abs(v) >= 1000 || (Math.abs(v) < 0.01 && v !== 0)
    ? v.toExponential(2)
    : v.toFixed(2);

function Scope({ input }: { input: AcGeneratorInput }) {
  const points = useMemo(() => generatorSeries(input, 181), [input]);
  const w = 380,
    h = 160,
    p = 18,
    amp = Math.max(1, computeAcGenerator(input).peakEmf);
  const path = points
    .map(
      (v, i) =>
        `${i ? "L" : "M"}${p + (i / (points.length - 1)) * (w - 2 * p)},${h / 2 - (v.emf / amp) * (h / 2 - p)}`,
    )
    .join(" ");
  const x = p + (normalizeAngle(input.angleRad) / (2 * Math.PI)) * (w - 2 * p);
  return (
    <section className="ac-scope">
      <h3>
        Oscilloscope <span>ε vs θ</span>
      </h3>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Sinusoidal induced emf waveform synchronized to coil angle"
      >
        <path d={path} />
        <line x1={x} x2={x} y1={p} y2={h - p} />
        <circle
          cx={x}
          cy={h / 2 - (computeAcGenerator(input).emf / amp) * (h / 2 - p)}
          r="4"
        />
        <text x={p} y={13}>
          +ε peak
        </text>
        <text x={p} y={h - 4}>
          −ε peak
        </text>
      </svg>
    </section>
  );
}

function FluxGraph({ input }: { input: AcGeneratorInput }) {
  const points = useMemo(() => generatorSeries(input, 181), [input]);
  const w = 350,
    h = 160,
    p = 22,
    amp = Math.max(0.001, input.turns * input.magneticField * input.coilArea);
  const path = points
    .map(
      (v, i) =>
        `${i ? "L" : "M"}${p + (i / (points.length - 1)) * (w - 2 * p)},${h / 2 - (v.flux / amp) * (h / 2 - p)}`,
    )
    .join(" ");
  const x = p + (normalizeAngle(input.angleRad) / (2 * Math.PI)) * (w - 2 * p);
  return (
    <section className="ac-flux">
      <h3>
        Magnetic flux linkage <span>NΦ vs θ</span>
      </h3>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Cosine magnetic flux linkage graph synchronized to coil angle"
      >
        <path d={path} />
        <line x1={p} x2={w - p} y1={h / 2} y2={h / 2} />
        <line className="cursor" x1={x} x2={x} y1={p} y2={h - p} />
        <text x={p} y={h - 3}>
          0°
        </text>
        <text x={w - p} y={h - 3} textAnchor="end">
          360°
        </text>
      </svg>
    </section>
  );
}

function GeneratorScene({ input, running, reducedMotion, onAngle }: { input: AcGeneratorInput; running: boolean; reducedMotion: boolean; onAngle: (angleRad:number) => void }) {
  const setFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.type === "pointermove" && !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    if (event.type === "pointerdown") event.currentTarget.setPointerCapture(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    const angle = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) * Math.PI * 2;
    onAngle(angle);
  };
  const projectedWidth = Math.max(.07, Math.abs(Math.cos(input.angleRad)));
  return <div className="ac-2d" role="application" tabIndex={0} aria-label="Interactive two-dimensional AC generator. Drag across the coil to turn it; use arrow keys for precise rotation." onPointerDown={setFromPointer} onPointerMove={setFromPointer} onKeyDown={event => { if(event.key === "ArrowLeft") onAngle(normalizeAngle(input.angleRad - Math.PI/36)); if(event.key === "ArrowRight") onAngle(normalizeAngle(input.angleRad + Math.PI/36)); }}>
    <div className="ac-field-lines" aria-hidden="true">{Array.from({length:7},(_,i)=><i key={i}/>)}</div>
    <img className="ac-stator-sprite" src={`${ROOT}/sprites/stator.png`} alt="AC generator magnets, bearings, slip rings, brushes, and terminals" draggable={false}/>
    <img className="ac-coil-sprite" src={`${ROOT}/sprites/coil.png`} alt="Draggable rotating copper coil" draggable={false} style={{transform:`translate(-50%,-50%) scaleX(${projectedWidth})`, opacity: running && !reducedMotion ? .98 : 1}}/>
    <div className="ac-crank" style={{transform:`rotate(${input.angleRad}rad)`}} aria-hidden="true"><i/></div>
    <span className="ac-direct-hint">DRAG COIL TO ROTATE · ← → FOR 5° STEPS</span>
  </div>;
}

/* Legacy GLB scene intentionally retired in the 2D studio conversion.
type SceneData = {
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  coil?: THREE.Object3D;
  shaft?: THREE.Object3D;
  effects: THREE.Sprite[];
  reset: () => void;
};
function GeneratorScene({
  input,
  running,
  reducedMotion,
  resetViewSignal,
}: {
  input: AcGeneratorInput;
  running: boolean;
  reducedMotion: boolean;
  resetViewSignal: number;
}) {
  const host = useRef<HTMLDivElement>(null),
    runtime = useRef<SceneData | null>(null),
    live = useRef({ input, running, reducedMotion });
  const [selected, setSelected] = useState("rotating_coil");
  useEffect(() => {
    live.current = { input, running, reducedMotion };
  }, [input, running, reducedMotion]);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100),
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
    renderer.setPixelRatio(Math.min(2, devicePixelRatio));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    el.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 4;
    controls.maxDistance = 13;
    const reset = () => {
      camera.position.set(5, 4.2, 7);
      controls.target.set(0, 0, 0);
      controls.update();
    };
    reset();
    scene.add(new THREE.HemisphereLight(0xdceeff, 0x18202a, 2.4));
    const light = new THREE.DirectionalLight(0xffffff, 3.2);
    light.position.set(5, 7, 5);
    scene.add(light);
    const data: SceneData = { camera, controls, effects: [], reset };
    runtime.current = data;
    new GLTFLoader().load(`${ROOT}/ac-generator.glb`, (g) => {
      const model = g.scene,
        box = new THREE.Box3().setFromObject(model),
        size = box.getSize(new THREE.Vector3()),
        center = box.getCenter(new THREE.Vector3()),
        scale = 4.8 / Math.max(size.x, size.y, size.z);
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));
      scene.add(model);
      data.coil = model.getObjectByName("rotating_coil");
      data.shaft = model.getObjectByName("shaft");
    });
    ["concept_effect.png", "interaction_overlay.png"].forEach((name, i) =>
      new THREE.TextureLoader().load(`${ROOT}/effects/${name}`, (texture) => {
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: i ? 0.05 : 0.08,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        sprite.scale.set(5, 3, 1);
        sprite.position.z = -1;
        scene.add(sprite);
        data.effects.push(sprite);
      }),
    );
    const resize = () => {
      const w = Math.max(1, el.clientWidth),
        h = Math.max(1, el.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = camera.aspect < 1 ? 72 : 38;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    let frame = 0;
    const draw = () => {
      const now = live.current;
      if (data.coil)
        data.coil.rotation.y = now.input.angleRad * now.input.direction;
      if (data.shaft)
        data.shaft.rotation.y = now.input.angleRad * now.input.direction;
      data.effects.forEach((s, i) => {
        (s.material as THREE.SpriteMaterial).opacity = now.running
          ? i
            ? 0.1
            : 0.15
          : i
            ? 0.03
            : 0.06;
        s.material.rotation = now.reducedMotion
          ? 0
          : now.input.angleRad * (i ? -0.04 : 0.03);
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
  const choose = (name: string) => {
    const rt = runtime.current;
    if (!rt) return;
    const scene = (rt.coil ?? rt.shaft)?.parent;
    const node = scene?.getObjectByName(name);
    if (node) setSelected(name);
  };
  return (
    <div
      ref={host}
      className="ac-three"
      role="application"
      tabIndex={0}
      aria-label="Rotatable AC generator model. Drag to orbit, wheel or pinch to zoom."
      onKeyDown={(e) => {
        const rt = runtime.current;
        if (!rt) return;
        if (e.key === "0") rt.reset();
        if (e.key === "ArrowLeft")
          rt.camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.12);
        if (e.key === "ArrowRight")
          rt.camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.12);
        if (e.key === "+") rt.camera.position.multiplyScalar(0.9);
        if (e.key === "-") rt.camera.position.multiplyScalar(1.1);
        rt.camera.lookAt(rt.controls.target);
      }}
    >
      <span className="ac-selection">
        Selected: {selected.replace(/_/g, " ")}
      </span>
      <span className="ac-parts">
        {[
          "rotating_coil",
          "north_pole",
          "south_pole",
          "slip_ring_left",
          "slip_ring_right",
        ].map((name) => (
          <button
            key={name}
            onClick={(e) => {
              e.stopPropagation();
              choose(name);
            }}
          >
              {name.replace(/_/g, " ")}
          </button>
        ))}
      </span>
    </div>
  );
}
*/
