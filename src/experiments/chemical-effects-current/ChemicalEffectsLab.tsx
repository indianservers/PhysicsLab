import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  computeChemicalEffects,
  type ChemicalEffectsInput,
  type Electrolyte,
} from "./chemicalEffectsPhysics";
import "./chemical-effects-current.css";
import "./chemical-effects-2d.css";

const ROOT = "/assets/experiments/chemical-effects-current";
const DEFAULTS = {
  voltage: 6,
  electrodeGap: 0.03,
  concentration: 1,
  duration: 300,
  electrolyte: "copper-sulfate" as Electrolyte,
  polarityReversed: false,
};
type RunState = "idle" | "running" | "paused" | "result";

export function ChemicalEffectsLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [values, setValues] = useState(DEFAULTS);
  const [elapsed, setElapsed] = useState(0);
  const [runState, setRunState] = useState<RunState>("idle");
  const [playback, setPlayback] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(
    () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  const [selectedPart, setSelectedPart] = useState("electrode_cathode");
  const [missionFeedback, setMissionFeedback] = useState("");
  const [trials, setTrials] = useState<
    Array<{
      electrolyte: Electrolyte;
      current: number;
      time: number;
      mass: number;
      temperature: number;
    }>
  >([]);
  const input = useMemo<ChemicalEffectsInput>(
    () => ({ ...values, duration: elapsed }),
    [values, elapsed],
  );
  const result = useMemo(() => computeChemicalEffects(input), [input]);
  const projected = useMemo(
    () => computeChemicalEffects({ ...values, duration: values.duration }),
    [values],
  );

  useEffect(() => {
    if (runState !== "running") return;
    let frame = 0,
      previous = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      setElapsed((time) => {
        const next = Math.min(values.duration, time + dt * 10 * playback);
        if (next >= values.duration) setRunState("result");
        return next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [runState, values.duration, playback]);

  const update = <K extends keyof typeof DEFAULTS>(
    key: K,
    value: (typeof DEFAULTS)[K],
  ) => setValues((current) => ({ ...current, [key]: value }));
  const reset = () => {
    setValues(DEFAULTS);
    setElapsed(0);
    setRunState("idle");
    setMissionFeedback("");
    setTrials([]);
  };
  const record = () =>
    setTrials((current) => [
      ...current,
      {
        electrolyte: values.electrolyte,
        current: result.current,
        time: elapsed,
        mass: result.depositedMassG,
        temperature: result.temperatureC,
      },
    ]);
  const missionComplete =
    values.electrolyte === "copper-sulfate" &&
    Math.abs(result.depositedMassG - 0.12) <= 0.008 &&
    !result.overheated;
  const reactionPhase =
    elapsed === 0
      ? "Solvated ions are dispersed"
      : elapsed < values.duration * 0.2
        ? "Ions drift toward opposite charges"
        : elapsed < values.duration * 0.7
          ? "Electrode reactions transfer electrons"
          : "Products accumulate at the electrodes";

  return (
    <section
      className="chem-lab"
      data-ui-theme="dark"
      data-run-state={runState}
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="chem-head">
        <div>
          <span>ELECTROCHEMISTRY · CLASS 8</span>
          <h2>Chemical Effects of Electric Current — Electrolysis Lab</h2>
          <p>
            Follow ions, identify products, and weigh Faraday's deposited
            copper.
          </p>
        </div>
        <div>
          <button onClick={() => { update("electrodeGap",DEFAULTS.electrodeGap); setSelectedPart("electrode_cathode"); }}>
            ◎ Reset vessel
          </button>
          <button onClick={reset}>↻ Rinse & reset</button>
        </div>
      </header>
      <div className="chem-bench">
        <main className="chem-stage">
          <ElectrolysisScene
            input={input}
            current={result.current}
            progress={values.duration ? elapsed / values.duration : 0}
            running={runState === "running"}
            reducedMotion={reducedMotion}
            selectedPart={selectedPart}
            onSelect={setSelectedPart}
            onGap={(electrodeGap)=>update("electrodeGap",electrodeGap)}
            onVoltage={(voltage)=>update("voltage",voltage)}
          />
          <div className="chem-polarity">
            <b>{values.polarityReversed ? "CATHODE (−)" : "ANODE (+)"}</b>
            <span>← anions</span>
            <span>cations →</span>
            <b>{values.polarityReversed ? "ANODE (+)" : "CATHODE (−)"}</b>
          </div>
          <div className="chem-phase">
            <b>{reactionPhase}</b>
            <span>
              {runState.toUpperCase()} · {elapsed.toFixed(0)} /{" "}
              {values.duration} s
            </span>
          </div>
          <div className="chem-parts">
            {[
              "battery_body",
              "battery_positive",
              "electrode_anode",
              "electrode_cathode",
              "ion_00",
              "ion_01",
            ].map((name) => (
              <button
                key={name}
                className={selectedPart === name ? "active" : ""}
                onClick={() => setSelectedPart(name)}
              >
                {name.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </main>
        <aside className="chem-controls" aria-label="Electrolysis setup">
          <h3>Setup</h3>
          <label className="chem-select">
            Electrolyte
            <select
              aria-label="Electrolyte type"
              value={values.electrolyte}
              onChange={(event) =>
                update("electrolyte", event.target.value as Electrolyte)
              }
            >
              <option value="copper-sulfate">Copper sulfate (CuSO₄)</option>
              <option value="acidified-water">Acidified water (H₂O)</option>
              <option value="sodium-chloride">Sodium chloride (NaCl)</option>
            </select>
          </label>
          <Control
            label="Voltage"
            value={values.voltage}
            min={0}
            max={12}
            step={0.1}
            unit="V"
            onChange={(v) => update("voltage", v)}
          />
          <Control
            label="Electrode spacing"
            value={values.electrodeGap * 100}
            min={1}
            max={5}
            step={0.1}
            unit="cm"
            onChange={(v) => update("electrodeGap", v / 100)}
          />
          <Control
            label="Concentration"
            value={values.concentration}
            min={0.25}
            max={2}
            step={0.05}
            unit="mol/L rel."
            onChange={(v) => update("concentration", v)}
          />
          <Control
            label="Experiment duration"
            value={values.duration}
            min={10}
            max={600}
            step={10}
            unit="s"
            onChange={(v) => {
              update("duration", v);
              setElapsed(Math.min(elapsed, v));
            }}
          />
          <div className="chem-actions">
            <button className="primary" onClick={() => setRunState("running")}>
              ▶ {runState === "paused" ? "Resume" : "Start current"}
            </button>
            <button
              disabled={runState !== "running"}
              onClick={() => setRunState("paused")}
            >
              Ⅱ Pause
            </button>
            <button
              onClick={() => {
                setElapsed((t) => Math.min(values.duration, t + 10));
                setRunState("paused");
              }}
            >
              ▮▶ Step 10 s
            </button>
            <button
              onClick={() =>
                update("polarityReversed", !values.polarityReversed)
              }
            >
              ⇄ Reverse polarity
            </button>
          </div>
          <label className="chem-time">
            Timeline{" "}
            <input
              type="range"
              aria-label="Elapsed time"
              min="0"
              max={values.duration}
              step="1"
              value={elapsed}
              onChange={(event) => {
                setElapsed(Number(event.target.value));
                setRunState("paused");
              }}
            />
          </label>
          <div className="chem-options">
            <label>
              Speed{" "}
              <select
                aria-label="Playback speed"
                value={playback}
                onChange={(event) => setPlayback(Number(event.target.value))}
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
                onChange={(event) => setReducedMotion(event.target.checked)}
              />{" "}
              Reduced motion
            </label>
          </div>
        </aside>
      </div>
      <section className="chem-readings">
        <Readout label="Current I" value={`${result.current.toFixed(3)} A`} />
        <Readout
          label="Charge Q = It"
          value={`${result.charge.toFixed(1)} C`}
        />
        <Readout
          label="Deposited mass"
          value={`${result.depositedMassG.toFixed(3)} g`}
        />
        <Readout
          label="Solution temperature"
          value={`${result.temperatureC.toFixed(1)} °C`}
          danger={result.overheated}
        />
        <Readout
          label="Projected final mass"
          value={`${projected.depositedMassG.toFixed(3)} g`}
        />
      </section>
      <div className="chem-analysis">
        <section className="chem-graph">
          <header>
            <span>DEPOSITED MASS vs CHARGE</span>
            <b>m ∝ It</b>
          </header>
          <MassGraph result={result} projected={projected} />
          <p>Doubling current or time doubles charge and deposited mass.</p>
        </section>
        <section className="chem-reactions">
          <span>ELECTRODE REACTIONS</span>
          <h3>
            {values.electrolyte === "copper-sulfate"
              ? "Copper plating"
              : values.electrolyte === "acidified-water"
                ? "Water electrolysis"
                : "Brine electrolysis"}
          </h3>
          <p>
            <b>Cathode (−)</b>
            <span>{result.cathodeProduct}</span>
            <small>
              {values.polarityReversed ? "left electrode" : "right electrode"}
            </small>
          </p>
          <p>
            <b>Anode (+)</b>
            <span>{result.anodeProduct}</span>
            <small>
              {values.polarityReversed ? "right electrode" : "left electrode"}
            </small>
          </p>
          <div>
            <span>Cathode gas {result.cathodeGasMl.toFixed(2)} mL</span>
            <span>Anode gas {result.anodeGasMl.toFixed(2)} mL</span>
          </div>
        </section>
        <section className="chem-laws">
          <span>FARADAY'S LAW</span>
          <h3>m = MIt / nF</h3>
          <p>Q = It = {result.charge.toFixed(1)} C</p>
          <p>mol e⁻ = Q/F = {result.electronMoles.toExponential(2)}</p>
          <p>mol Cu²⁺ discharged = mol e⁻ / 2</p>
          <small>
            Charge is conserved: electrons through the wire match ionic
            equivalents discharged.
          </small>
        </section>
        <section
          className={`chem-mission ${missionComplete ? "complete" : ""}`}
        >
          <span>MINI-MISSION</span>
          <h3>Plate 0.120 g without overheating</h3>
          <p>
            Use CuSO₄. Target 0.112–0.128 g and keep the solution at or below 42
            °C.
          </p>
          <button
            className="primary"
            onClick={() => {
              const massError = Math.abs(result.depositedMassG - 0.12);
              setMissionFeedback(
                missionComplete
                  ? `✓ Target reached: ${result.depositedMassG.toFixed(3)} g at ${result.temperatureC.toFixed(1)} °C.`
                  : result.overheated
                    ? `Too hot by ${(result.temperatureC - 42).toFixed(1)} °C. Lower voltage or concentration.`
                    : `Mass is ${massError.toFixed(3)} g from target. Adjust charge Q = It.`,
              );
              if (missionComplete) record();
            }}
          >
            Check result
          </button>
          <p aria-live="polite">
            {missionFeedback ||
              "Hint: the default setup reaches the target near 300 s."}
          </p>
        </section>
      </div>
      <section className="chem-trials">
        <header>
          <h3>Observation table</h3>
          <button disabled={elapsed === 0} onClick={record}>
            ＋ Record trial
          </button>
        </header>
        <div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Electrolyte</th>
                <th>I (A)</th>
                <th>t (s)</th>
                <th>m (g)</th>
                <th>T (°C)</th>
              </tr>
            </thead>
            <tbody>
              {trials.map((trial, index) => (
                <tr key={`${index}-${trial.time}`}>
                  <td>{index + 1}</td>
                  <td>{trial.electrolyte}</td>
                  <td>{trial.current.toFixed(3)}</td>
                  <td>{trial.time.toFixed(0)}</td>
                  <td>{trial.mass.toFixed(3)}</td>
                  <td>{trial.temperature.toFixed(1)}</td>
                </tr>
              ))}
              {!trials.length && (
                <tr>
                  <td colSpan={6}>Run the cell, then record a result.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <p className="chem-sr" aria-live="polite">
        {reactionPhase}. Current {result.current.toFixed(3)} amperes, charge{" "}
        {result.charge.toFixed(1)} coulombs, deposit{" "}
        {result.depositedMassG.toFixed(3)} grams, temperature{" "}
        {result.temperatureC.toFixed(1)} degrees Celsius.{" "}
        {result.cathodeProduct} at the cathode; {result.anodeProduct} at the
        anode.
      </p>
    </section>
  );
}

function Control({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="chem-control">
      <span>
        <b>{label}</b>
        <strong>
          {value.toFixed(step < 0.1 ? 2 : 1)} {unit}
        </strong>
      </span>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <small>
        {min} — {max} {unit}
      </small>
    </label>
  );
}
function Readout({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className={danger ? "danger" : ""}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function MassGraph({
  result,
  projected,
}: {
  result: ReturnType<typeof computeChemicalEffects>;
  projected: ReturnType<typeof computeChemicalEffects>;
}) {
  const w = 380,
    h = 180,
    p = 26,
    maxQ = Math.max(1, projected.charge),
    maxM = Math.max(0.01, projected.depositedMassG);
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="Deposited mass against charge graph"
    >
      <line x1={p} y1={h - p} x2={w - p} y2={h - p} />
      <line x1={p} y1={p} x2={p} y2={h - p} />
      <path
        d={`M${p},${h - p} L${w - p},${h - p - (projected.depositedMassG / maxM) * (h - 2 * p)}`}
      />
      <circle
        cx={p + (result.charge / maxQ) * (w - 2 * p)}
        cy={h - p - (result.depositedMassG / maxM) * (h - 2 * p)}
        r="5"
      />
      <text x={w / 2} y={h - 4}>
        Charge Q (C)
      </text>
      <text x={8} y={18}>
        m (g)
      </text>
    </svg>
  );
}

function ElectrolysisScene({ input, current, progress, running, reducedMotion, selectedPart, onSelect, onGap, onVoltage }: { input:ChemicalEffectsInput; current:number; progress:number; running:boolean; reducedMotion:boolean; selectedPart:string; onSelect:(name:string)=>void; onGap:(value:number)=>void; onVoltage:(value:number)=>void }) {
  const gapPx=145+((input.electrodeGap-.01)/.09)*255;
  const moveGap=(event:React.PointerEvent<HTMLButtonElement>)=>{if(event.type==="pointermove"&&!event.currentTarget.hasPointerCapture(event.pointerId))return;if(event.type==="pointerdown")event.currentTarget.setPointerCapture(event.pointerId);const rect=event.currentTarget.parentElement!.getBoundingClientRect();const dx=Math.abs(event.clientX-(rect.left+rect.width*.35));onGap(.01+Math.max(0,Math.min(1,(dx-72)/255))*.09);};
  const moveVoltage=(event:React.PointerEvent<HTMLButtonElement>)=>{if(event.type==="pointermove"&&!event.currentTarget.hasPointerCapture(event.pointerId))return;if(event.type==="pointerdown")event.currentTarget.setPointerCapture(event.pointerId);const rect=event.currentTarget.getBoundingClientRect();onVoltage(Math.max(0,Math.min(12,(event.clientX-rect.left)/rect.width*12)));};
  return <div className="chem-2d" role="application" aria-label="Interactive two-dimensional electrolysis vessel. Drag electrodes to change their gap and drag the power dial to set voltage.">
    <img src={`${ROOT}/sprites/electrolysis-bench.png`} alt="Glass electrolysis vessel, copper electrodes and DC supply" draggable={false}/>
    <div className="chem-live-vessel">
      <button className={`chem-electrode left ${selectedPart.includes("anode")?"active":""}`} style={{transform:`translateX(${-gapPx/2}px)`}} aria-label="Drag left electrode" onPointerDown={moveGap} onPointerMove={moveGap} onClick={()=>onSelect("electrode_anode")}/>
      <button className={`chem-electrode right ${selectedPart.includes("cathode")?"active":""}`} style={{transform:`translateX(${gapPx/2}px)`}} aria-label="Drag right electrode" onPointerDown={moveGap} onPointerMove={moveGap} onClick={()=>onSelect("electrode_cathode")}/>
      <div className="chem-ions" data-running={running&&!reducedMotion}>{Array.from({length:22},(_,i)=><i key={i} className={i%2?"cation":"anion"} style={{left:`${8+(i*37)%84}%`,top:`${12+(i*53)%76}%`,animationDelay:`${i*.07}s`}}>{i%2?"+":"−"}</i>)}</div>
      <div className="chem-deposit" style={{height:`${Math.min(100,progress*100)}%`}}/><div className="chem-bubbles" style={{opacity:running?.25+Math.min(.75,current):0}}>{Array.from({length:10},(_,i)=><i key={i} style={{left:`${i*9}%`,animationDelay:`${i*.12}s`}}/> )}</div>
    </div>
    <button className="chem-voltage-dial" aria-label={`Voltage ${input.voltage.toFixed(1)} volts`} onPointerDown={moveVoltage} onPointerMove={moveVoltage}><i style={{left:`${input.voltage/12*100}%`}}/></button>
    <span className="chem-direct-hint">DRAG ELECTRODES ↔ GAP · DRAG POWER DIAL ↔ VOLTAGE</span>
  </div>;
}

/* Legacy GLB scene intentionally retired in the 2D studio conversion.
function LegacyElectrolysisScene({
  input,
  current,
  progress,
  running,
  reducedMotion,
  resetViewSignal,
  selectedPart,
  onSelect,
}: {
  input: ChemicalEffectsInput;
  current: number;
  progress: number;
  running: boolean;
  reducedMotion: boolean;
  resetViewSignal: number;
  selectedPart: string;
  onSelect: (name: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null),
    runtimeRef = useRef<{
      camera: THREE.PerspectiveCamera;
      controls: OrbitControls;
    } | null>(null),
    propsRef = useRef({
      input,
      current,
      progress,
      running,
      reducedMotion,
      selectedPart,
      onSelect,
    });
  propsRef.current = {
    input,
    current,
    progress,
    running,
    reducedMotion,
    selectedPart,
    onSelect,
  };
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100);
    camera.position.set(5.8, 4.2, 6.8);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 4;
    controls.maxDistance = 13;
    controls.target.set(0, 0, -0.6);
    runtimeRef.current = { camera, controls };
    scene.add(new THREE.HemisphereLight(0xeaf7ff, 0x152620, 2.4));
    const light = new THREE.DirectionalLight(0xffffff, 3.2);
    light.position.set(4, 7, 5);
    scene.add(light);
    const group = new THREE.Group();
    scene.add(group);
    const named = new Map<string, THREE.Object3D>(),
      originals = new Map<string, THREE.Vector3>();
    new GLTFLoader().load(`${ROOT}/chemical-effects-current.glb`, (gltf) => {
      const box = new THREE.Box3().setFromObject(gltf.scene),
        size = box.getSize(new THREE.Vector3()),
        center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.sub(center);
      gltf.scene.scale.setScalar(5.1 / Math.max(size.x, size.y, size.z));
      gltf.scene.traverse((object) => {
        if (object.name) {
          named.set(object.name, object);
          originals.set(object.name, object.position.clone());
        }
      });
      group.add(gltf.scene);
    });
    new THREE.TextureLoader().load(
      `${ROOT}/effects/interaction_overlay.png`,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            opacity: 0.1,
          }),
        );
        sprite.name = "chem_effect";
        sprite.scale.set(4.6, 2.6, 1);
        sprite.position.set(0, 0.4, 0.2);
        scene.add(sprite);
      },
    );
    const raycaster = new THREE.Raycaster(),
      pointer = new THREE.Vector2();
    const select = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      let node: THREE.Object3D | null =
        raycaster.intersectObjects(group.children, true)[0]?.object ?? null;
      while (node && !named.has(node.name)) node = node.parent;
      if (node?.name) propsRef.current.onSelect(node.name);
    };
    renderer.domElement.addEventListener("pointerup", select);
    let frame = 0;
    const resize = () => {
      const width = host.clientWidth,
        height = host.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    const animate = () => {
      const props = propsRef.current;
      named.forEach((object, name) => {
        const original = originals.get(name);
        if (original && name.startsWith("ion_")) {
          const index = Number(name.slice(4)) || 0,
            direction =
              (index % 2 === 0 ? 1 : -1) *
              (props.input.polarityReversed ? -1 : 1);
          object.position.x =
            original.x +
            (props.running && !props.reducedMotion
              ? direction * ((props.progress * 1.6 + index * 0.07) % 1) * 0.16
              : 0);
        }
        if (original && name.includes("electrode")) {
          const sign = name === "electrode_anode" ? -1 : 1;
          object.position.x =
            original.x + sign * (props.input.electrodeGap - 0.03) * 2;
        }
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const materials = Array.isArray(child.material)
              ? child.material
              : [child.material];
            materials.forEach((material) => {
              if ("emissive" in material) {
                const standard = material as THREE.MeshStandardMaterial;
                standard.emissive.set(
                  name === props.selectedPart
                    ? 0x20cfff
                    : name === "electrode_cathode" &&
                        props.input.electrolyte === "copper-sulfate"
                      ? 0x5b1f05
                      : 0,
                );
                standard.emissiveIntensity =
                  name === props.selectedPart
                    ? 0.65
                    : name === "electrode_cathode"
                      ? props.progress * 0.35
                      : 0;
              }
            });
          }
        });
      });
      const effect = scene.getObjectByName("chem_effect") as
        | THREE.Sprite
        | undefined;
      if (effect)
        (effect.material as THREE.SpriteMaterial).opacity = props.running
          ? 0.12 + Math.min(0.5, props.current * 0.1)
          : 0.06;
      controls.update();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerup", select);
      controls.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);
  useEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;
    runtime.camera.position.set(5.8, 4.2, 6.8);
    runtime.controls.target.set(0, 0, -0.6);
    runtime.controls.update();
  }, [resetViewSignal]);
  return (
    <div
      ref={hostRef}
      className="chem-canvas"
      role="img"
      aria-label={`Interactive electrolysis cell. Selected ${selectedPart.replace(/_/g, " ")}. Cations move to the cathode and anions to the anode. Drag to orbit; wheel or pinch to zoom.`}
    />
  );
}
*/
