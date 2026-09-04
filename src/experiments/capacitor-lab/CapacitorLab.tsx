import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  computeCapacitor,
  type Arrangement,
  type CapacitorInput,
} from "./capacitorPhysics";
import "./capacitor-lab.css";
import "./capacitor-2d.css";
const ROOT = "/assets/experiments/capacitor-lab",
  DEFAULTS = {
    plateArea: 0.02,
    spacing: 0.002,
    dielectric: 1,
    voltage: 12,
    arrangement: "single" as Arrangement,
    count: 1,
    connected: true,
  };
type RunState = "idle" | "charging" | "running" | "paused" | "result";
export function CapacitorLab({ experiment }: DedicatedExperimentLabProps) {
  const [values, setValues] = useState(DEFAULTS),
    [runState, setRunState] = useState<RunState>("idle"),
    [progress, setProgress] = useState(0),
    [playback, setPlayback] = useState(1),
    [reducedMotion, setReducedMotion] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [storedCharge, setStoredCharge] = useState(0);
  const input = useMemo<CapacitorInput>(() => ({ ...values, storedCharge }), [values, storedCharge]),
    result = useMemo(() => computeCapacitor(input), [input]),
    missionComplete =
      values.arrangement === "parallel" &&
      values.count === 3 &&
      values.connected;
  useEffect(() => {
    if (runState !== "charging" && runState !== "running") return;
    let frame = 0,
      last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setProgress((p) => {
        const next = p + dt * playback * (reducedMotion ? 0.25 : 1);
        if (runState === "charging" && next >= 1) {
          setRunState("running");
          return 1;
        }
        return runState === "running" ? next % 1 : next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [runState, playback, reducedMotion]);
  const update = (
      key: keyof typeof DEFAULTS,
      value: number | boolean | Arrangement,
    ) => setValues((v) => ({ ...v, [key]: value })),
    reset = () => {
      setValues(DEFAULTS);
      setRunState("idle");
      setProgress(0);
      setStoredCharge(0);
    };
  const chargeFraction = values.connected ? Math.min(1, progress) : 1;
  return (
    <section
      className="cap-lab"
      data-ui-theme="dark"
      data-run-state={runState}
      data-mission={missionComplete ? "complete" : "building"}
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="cap-head">
        <div>
          <span>CAPACITOR LAB · CLASS 12</span>
          <h2>Capacitor Energy & Combinations</h2>
          <p>Change plate geometry, charge the field, and wire a network.</p>
        </div>
        <div>
          <button onClick={() => { update("spacing", DEFAULTS.spacing); update("plateArea", DEFAULTS.plateArea); }}>
            ◎ Reset plates
          </button>
          <button onClick={reset}>↻ Reset experiment</button>
        </div>
      </header>
      <div className="cap-top">
        <main className="cap-stage">
          <CapScene
            input={input}
            result={result}
            progress={chargeFraction}
            running={runState === "charging" || runState === "running"}
            reducedMotion={reducedMotion}
            onSpacing={(spacing) => update("spacing", spacing)}
            onDielectric={(dielectric) => update("dielectric", dielectric)}
          />
          <div className="cap-connection">
            <span>
              {values.connected ? "🔌 Battery connected" : "◇ Battery disconnected"}
            </span>
            <small>
              {values.connected
                  ? "V constant · Q and U respond"
                  : "Q constant · V and U respond"}
            </small>
          </div>
          <div className="cap-dimension">
            <b>↔ d = {(values.spacing * 1000).toFixed(1)} mm</b>
            <b>↕ A = {values.plateArea.toFixed(3)} m²</b>
          </div>
          <div
            className="cap-field"
            style={{ opacity: 0.15 + 0.8 * chargeFraction }}
          >
            {Array.from({ length: 9 }, (_, i) => (
              <i key={i}>→</i>
            ))}
          </div>
        </main>
        <aside className="cap-controls" aria-label="Capacitor controls">
          <h3>Geometry & dielectric</h3>
          <Control
            label="Plate area"
            symbol="A"
            value={values.plateArea}
            min={0.005}
            max={0.05}
            step={0.001}
            unit="m²"
            onChange={(v) => update("plateArea", v)}
          />
          <Control
            label="Plate spacing"
            symbol="d"
            value={values.spacing * 1000}
            min={0.5}
            max={10}
            step={0.1}
            unit="mm"
            onChange={(v) => update("spacing", v / 1000)}
          />
          <Control
            label="Dielectric constant"
            symbol="κ"
            value={values.dielectric}
            min={1}
            max={10}
            step={0.1}
            unit=""
            onChange={(v) => update("dielectric", v)}
          />
          <Control
            label="Voltage"
            symbol="V"
            value={values.voltage}
            min={0}
            max={24}
            step={0.1}
            unit="V"
            onChange={(v) => update("voltage", v)}
          />
          <div className="cap-dielectrics">
            <button onClick={() => update("dielectric", 1)}>Air κ1</button>
            <button onClick={() => update("dielectric", 4.7)}>
              Glass κ4.7
            </button>
            <button onClick={() => update("dielectric", 5.4)}>Mica κ5.4</button>
            <button onClick={() => update("dielectric", 3.5)}>
              Paper κ3.5
            </button>
          </div>
          <div className="cap-play">
            <button
              className="primary"
              onClick={() => {
                setProgress(0);
                setRunState("charging");
                update("connected", true);
              }}
            >
              ⚡ Charge
            </button>
            <button
              onClick={() => setRunState("paused")}
              disabled={
                !(["charging", "running"] as RunState[]).includes(runState)
              }
            >
              Ⅱ Pause
            </button>
            <button
              onClick={() => {
                setProgress((p) => Math.min(1, p + 0.1));
                setRunState("paused");
              }}
            >
              ▮▶ Step
            </button>
            <button onClick={() => { if(values.connected){ setStoredCharge(result.charge); update("connected",false); } else { update("connected",true); } }}>
              {values.connected ? "Disconnect (hold Q)" : "Reconnect battery"}
            </button>
          </div>
          <div className="cap-options">
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
      <div className="cap-bottom">
        <NetworkBoard
          arrangement={values.arrangement}
          count={values.count}
          capacitance={result.singleCapacitance}
          onArrangement={(arrangement, count) =>
            setValues((v) => ({ ...v, arrangement, count }))
          }
        />
        <section className="cap-equivalent">
          <h3>Equivalent capacitance</h3>
          <p>
            {values.arrangement === "series"
              ? "1/Ceq = 1/C₁ + 1/C₂ + 1/C₃"
              : values.arrangement === "parallel"
                ? "Ceq = C₁ + C₂ + C₃"
                : "Ceq = C"}
          </p>
          <strong>{format(result.equivalentCapacitance, "F")}</strong>
          <div>
            <i
              style={{
                height: `${values.arrangement === "series" ? 33 : values.arrangement === "parallel" ? 100 : 50}%`,
              }}
            />
            <span>Series</span>
            <i style={{ height: "50%" }} />
            <span>Single</span>
            <i
              style={{
                height: `${values.arrangement === "parallel" ? 100 : 50}%`,
              }}
            />
            <span>Parallel</span>
          </div>
        </section>
        <Readings result={result} />
        <section className="cap-equations">
          <h3>Key equations</h3>
          <p>C = κε₀A/d</p>
          <p>Q = CV</p>
          <p>U = ½CV² = Q²/(2C)</p>
          <small>
            {values.connected
              ? "Battery connected: voltage remains constant."
              : "Battery disconnected: charge remains constant while V and U respond to C."}
          </small>
        </section>
      </div>
      <section className={`cap-mission ${missionComplete ? "complete" : ""}`}>
        <div>
          <span>MINI-MISSION</span>
          <h3>Wire maximum capacitance and stored energy</h3>
        </div>
        <strong>
          {values.count} capacitors · {values.arrangement}
        </strong>
        <p>
          {missionComplete
            ? `✓ Parallel network complete: Ceq = 3C and U = ${format(result.energy, "J")}.`
            : "Place all three equal capacitors in parallel. Drag a card to a rail or use the arrangement buttons."}
        </p>
      </section>
      <p className="cap-sr" aria-live="polite">
        Capacitance {format(result.equivalentCapacitance, "farads")}. Charge{" "}
        {format(result.charge, "coulombs")}. Energy{" "}
        {format(result.energy, "joules")}. Arrangement {values.arrangement} with{" "}
        {values.count} capacitors. Mission{" "}
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
    <label className="cap-control">
      <span>
        <b>
          {label} <i>{symbol}</i>
        </b>
        <span>
          <input
            type="number"
            aria-label={`${label} value`}
            value={Number(value.toFixed(step < 1 ? 3 : 0))}
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
function NetworkBoard({
  arrangement,
  count,
  capacitance,
  onArrangement,
}: {
  arrangement: Arrangement;
  count: number;
  capacitance: number;
  onArrangement: (a: Arrangement, c: number) => void;
}) {
  const [dragging, setDragging] = useState<number | null>(null);
  return (
    <section className="cap-network">
      <h3>
        Capacitor network board <span>Drag to wire circuits</span>
      </h3>
      <div className="cap-modes">
        <button
          className={arrangement === "single" ? "active" : ""}
          onClick={() => onArrangement("single", 1)}
        >
          Single
        </button>
        <button
          className={arrangement === "series" ? "active" : ""}
          onClick={() => onArrangement("series", 3)}
        >
          Series
        </button>
        <button
          className={arrangement === "parallel" ? "active" : ""}
          onClick={() => onArrangement("parallel", 3)}
        >
          Parallel
        </button>
      </div>
      <div
        className={`cap-circuit ${arrangement}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => {
          if (dragging !== null)
            onArrangement(
              arrangement === "single" ? "parallel" : arrangement,
              3,
            );
          setDragging(null);
        }}
      >
        <b>A</b>
        {Array.from({ length: count }, (_, i) => (
          <span key={i}>
            ┃ ┃
            <small>
              C{i + 1}
              <br />
              {format(capacitance, "F")}
            </small>
          </span>
        ))}
        <b>B</b>
      </div>
      <div className="cap-palette">
        {[1, 2, 3].map((i) => (
          <button
            draggable
            key={i}
            onDragStart={() => setDragging(i)}
            onClick={() =>
              onArrangement(
                arrangement === "single" ? "parallel" : arrangement,
                3,
              )
            }
          >
            C{i}
            <span>┃ ┃</span>
          </button>
        ))}
      </div>
    </section>
  );
}
function Readings({ result }: { result: ReturnType<typeof computeCapacitor> }) {
  return (
    <section className="cap-readings">
      <h3>Live readings</h3>
      {[
        ["Capacitance", format(result.equivalentCapacitance, "F")],
        ["Charge", format(result.charge, "C")],
        ["Electric field", format(result.electricField, "V/m")],
        ["Stored energy", format(result.energy, "J")],
        ["Energy density", format(result.energyDensity, "J/m³")],
        ["Plate force", format(result.plateForce, "N")],
      ].map(([k, v]) => (
        <dl key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </dl>
      ))}
    </section>
  );
}
const format = (v: number, u: string) =>
  `${Math.abs(v) >= 1000 || (Math.abs(v) < 0.01 && v !== 0) ? v.toExponential(2) : v.toFixed(2)} ${u}`;

function CapScene({ input, result, progress, running, reducedMotion, onSpacing, onDielectric }: { input:CapacitorInput; result:ReturnType<typeof computeCapacitor>; progress:number; running:boolean; reducedMotion:boolean; onSpacing:(spacing:number)=>void; onDielectric:(dielectric:number)=>void }) {
  const plateGap=72 + ((input.spacing-.0005)/.0095)*155;
  const plateSize=.72 + ((input.plateArea-.005)/.045)*.34;
  const movePlate=(event:React.PointerEvent<HTMLButtonElement>)=>{if(event.type==="pointermove"&&!event.currentTarget.hasPointerCapture(event.pointerId))return;if(event.type==="pointerdown")event.currentTarget.setPointerCapture(event.pointerId);const rect=event.currentTarget.parentElement!.getBoundingClientRect();const distance=Math.abs(event.clientX-(rect.left+rect.width/2));onSpacing(.0005+Math.max(0,Math.min(1,(distance-36)/155))*.0095);};
  const moveDielectric=(event:React.PointerEvent<HTMLButtonElement>)=>{if(event.type==="pointermove"&&!event.currentTarget.hasPointerCapture(event.pointerId))return;if(event.type==="pointerdown")event.currentTarget.setPointerCapture(event.pointerId);const rect=event.currentTarget.parentElement!.getBoundingClientRect();const fraction=1-Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height));onDielectric(1+fraction*9);};
  return <div className="cap-2d" role="application" aria-label="Interactive two-dimensional capacitor. Drag either plate horizontally to change spacing; drag the dielectric handle vertically to change dielectric constant.">
    <img src={`${ROOT}/sprites/capacitor-bench.png`} alt="Capacitor plates, battery, leads and switch" draggable={false}/>
    <div className="cap-live-plates" style={{transform:`translate(-50%,-50%) scale(${plateSize})`}}>
      <button aria-label="Drag left capacitor plate" className="cap-plate left" style={{transform:`translateX(${-plateGap}px)`}} onPointerDown={movePlate} onPointerMove={movePlate}><span>+</span></button>
      <button aria-label="Drag right capacitor plate" className="cap-plate right" style={{transform:`translateX(${plateGap}px)`}} onPointerDown={movePlate} onPointerMove={movePlate}><span>−</span></button>
      <div className="cap-live-field" style={{width:`${plateGap*2-24}px`,opacity:.18+.75*progress}}>{Array.from({length:7},(_,i)=><i key={i}>→</i>)}</div>
      <button aria-label="Drag dielectric insertion" className="cap-dielectric-handle" style={{height:`${20+(input.dielectric-1)/9*150}px`}} onPointerDown={moveDielectric} onPointerMove={moveDielectric}><span>κ {input.dielectric.toFixed(1)}</span></button>
    </div>
    <div className="cap-charge-flow" data-running={running&&!reducedMotion}>{Array.from({length:8},(_,i)=><i key={i} style={{animationDelay:`${i*.12}s`}}/> )}</div>
    <span className="cap-direct-hint">DRAG PLATES ↔ SPACING · DRAG κ HANDLE ↕ DIELECTRIC</span>
    <output className="cap-live-output">C {format(result.equivalentCapacitance,"F")} · Q {format(result.charge,"C")}</output>
  </div>;
}

/* Legacy GLB scene intentionally retired in the 2D studio conversion.
type SceneRuntime = {
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  plates: THREE.Object3D[];
  field?: THREE.Object3D;
  effects: THREE.Sprite[];
  reset: () => void;
};
function CapScene({
  input,
  result,
  progress,
  running,
  reducedMotion,
  resetViewSignal,
}: {
  input: CapacitorInput;
  result: ReturnType<typeof computeCapacitor>;
  progress: number;
  running: boolean;
  reducedMotion: boolean;
  resetViewSignal: number;
}) {
  const host = useRef<HTMLDivElement>(null),
    runtime = useRef<SceneRuntime | null>(null),
    live = useRef({ input, result, progress, running, reducedMotion }),
    [selected, setSelected] = useState("plate 0");
  useEffect(() => {
    live.current = { input, result, progress, running, reducedMotion };
  }, [input, result, progress, running, reducedMotion]);
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
    renderer.toneMappingExposure = 1.35;
    el.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 4;
    controls.maxDistance = 14;
    const reset = () => {
      camera.position.set(4.5, 4.2, 7);
      controls.target.set(0, 0, 0);
      controls.update();
    };
    reset();
    scene.add(new THREE.HemisphereLight(0xf0f6ff, 0x14202c, 2.6));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(5, 7, 5);
    scene.add(light);
    const data: SceneRuntime = {
      camera,
      controls,
      plates: [],
      effects: [],
      reset,
    };
    runtime.current = data;
    new GLTFLoader().load(`${ROOT}/capacitor-lab.glb`, (g) => {
      const model = g.scene,
        box = new THREE.Box3().setFromObject(model),
        size = box.getSize(new THREE.Vector3()),
        center = box.getCenter(new THREE.Vector3()),
        scale = 4.8 / Math.max(size.x, size.y, size.z);
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));
      scene.add(model);
      data.plates = [0, 1, 2, 3]
        .map((i) => model.getObjectByName(`capacitor_plate_${i}`))
        .filter((v): v is THREE.Object3D => Boolean(v));
      data.field = model.getObjectByName("electric_field_shaft");
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
        separation = 0.45 + ((now.input.spacing - 0.0005) / 0.0095) * 0.75,
        areaScale = 0.65 + ((now.input.plateArea - 0.005) / 0.045) * 0.7;
      data.plates.forEach((plate, i) => {
        const pair = i < 2 ? -1 : 1,
          inner = i % 2 === 0 ? -1 : 1;
        plate.position.x = pair * 0.65 + inner * separation * 0.25;
        plate.scale.y = areaScale;
        plate.scale.z = areaScale;
      });
      if (data.field)
        data.field.scale.x =
          0.5 + Math.min(2, now.result.electricField / 12000);
      data.effects.forEach((s, i) => {
        (s.material as THREE.SpriteMaterial).opacity = now.running
          ? now.progress * (i ? 0.08 : 0.14)
          : i
            ? 0.025
            : 0.05;
        s.material.rotation = now.reducedMotion
          ? 0
          : now.progress * (i ? -0.08 : 0.06);
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
      className="cap-three"
      role="application"
      tabIndex={0}
      aria-label="Rotatable capacitor plate apparatus. Drag to orbit and wheel or pinch to zoom."
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
      <span className="cap-selection">Selected: {selected}</span>
      <span className="cap-parts">
        {[0, 1, 2, 3].map((i) => (
          <button key={i} onClick={() => setSelected(`plate ${i}`)}>
            Plate {i + 1}
          </button>
        ))}
      </span>
    </div>
  );
}
*/
