import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  APPLIANCES,
  computeElectricPower,
  type Appliance,
  type ElectricPowerInput,
} from "./electricPowerPhysics";
import "./electric-power.css";
import "./electric-power-2d.css";

const ROOT = "/assets/experiments/electric-power",
  DEFAULTS = {
    voltage: 230,
    resistance: APPLIANCES.lamp.resistance,
    operatingTimeHours: 4,
    appliance: "lamp" as Appliance,
    fuseLimit: 5,
    enabled: false,
  };
type RunState = "idle" | "ramping" | "running" | "paused" | "result";
export function ElectricPowerLab({ experiment }: DedicatedExperimentLabProps) {
  const [values, setValues] = useState(DEFAULTS),
    [elapsed, setElapsed] = useState(0),
    [runState, setRunState] = useState<RunState>("idle"),
    [playback, setPlayback] = useState(1),
    [reducedMotion, setReducedMotion] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [selectedPart, setSelectedPart] = useState("resistor"),
    [feedback, setFeedback] = useState("");
  const input = useMemo<ElectricPowerInput>(
      () => ({ ...values, operatingTimeHours: elapsed }),
      [values, elapsed],
    ),
    result = useMemo(() => computeElectricPower(input), [input]),
    projected = useMemo(
      () =>
        computeElectricPower({
          ...values,
          operatingTimeHours: values.operatingTimeHours,
        }),
      [values],
    );
  useEffect(() => {
    if (runState !== "ramping" && runState !== "running") return;
    let frame = 0,
      previous = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      setElapsed((time) => {
        const rate = runState === "ramping" ? 0.03 : 0.12,
          next = Math.min(
            values.operatingTimeHours,
            time + dt * rate * playback,
          );
        if (runState === "ramping" && next >= 0.02) setRunState("running");
        if (next >= values.operatingTimeHours) setRunState("result");
        return next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [runState, values.operatingTimeHours, playback]);
  const update = <K extends keyof typeof DEFAULTS>(
      key: K,
      value: (typeof DEFAULTS)[K],
    ) => setValues((v) => ({ ...v, [key]: value })),
    choose = (appliance: Appliance) =>
      setValues((v) => ({
        ...v,
        appliance,
        resistance: APPLIANCES[appliance].resistance,
      })),
    reset = () => {
      setValues(DEFAULTS);
      setElapsed(0);
      setRunState("idle");
      setFeedback("");
    };
  const missionComplete =
    Math.abs(result.energyKWh - 0.24) <= 0.01 &&
    result.current <= 5 &&
    !result.overload;
  return (
    <section
      className="power-lab"
      data-ui-theme="dark"
      data-run-state={runState}
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="power-head">
        <div>
          <span>SMART HOME ENERGY LAB · CLASS 10</span>
          <h2>Electrical Energy in Daily Life</h2>
          <p>Connect voltage, resistance, power, heating, and energy cost.</p>
        </div>
        <div>
          <button onClick={() => { choose("lamp"); setSelectedPart("lamp"); }}>
            ◎ Reset home
          </button>
          <button onClick={reset}>↻ Reset experiment</button>
        </div>
      </header>
      <div className="power-bench">
        <main className="power-stage">
          <PowerScene
            input={input}
            power={result.powerVI}
            phase={elapsed}
            running={runState === "ramping" || runState === "running"}
            reducedMotion={reducedMotion}
            selectedPart={selectedPart}
            onSelect={setSelectedPart}
            appliance={values.appliance}
            enabled={values.enabled}
            onChoose={choose}
            onToggle={()=>update("enabled",!values.enabled)}
          />
          <div className="power-flow" style={{ display: "none" }}>
            {Array.from({ length: 8 }, (_, i) => (
              <i key={i} style={{ animationDelay: `${-i * 0.13}s` }}>
                ●
              </i>
            ))}
          </div>
          <div className={`power-status ${result.overload ? "danger" : ""}`}>
            <b>
              {result.overload
                ? `OVERLOAD · ${result.current.toFixed(2)} A > ${values.fuseLimit} A`
                : values.enabled
                  ? `${APPLIANCES[values.appliance].label} ON`
                  : "Main switch OFF"}
            </b>
            <span>
              {runState === "ramping"
                ? "Appliance starting — current stabilizing"
                : runState === "running"
                  ? "Energy accumulating on timeline"
                  : "Ready"}
            </span>
          </div>
          <div className="power-parts" style={{ display: "none" }}>
            {[
              "battery_body",
              "battery_positive",
              "resistor",
              "meter_dial",
              "inductor_000",
              "inductor_004",
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
        <aside className="power-controls" aria-label="Energy controls">
          <h3>Live setup</h3>
          <Control
            label="Voltage"
            value={values.voltage}
            min={0}
            max={240}
            step={1}
            unit="V"
            onChange={(v) => update("voltage", v)}
          />
          <Control
            label="Resistance"
            value={values.resistance}
            min={1}
            max={1000}
            step={1}
            unit="Ω"
            onChange={(v) => update("resistance", v)}
          />
          <Control
            label="Operating time"
            value={values.operatingTimeHours}
            min={0.1}
            max={24}
            step={0.1}
            unit="h"
            onChange={(v) => {
              update("operatingTimeHours", v);
              setElapsed(Math.min(elapsed, v));
            }}
          />
          <label className="power-fuse">
            Safety fuse
            <select
              aria-label="Fuse limit"
              value={values.fuseLimit}
              onChange={(e) => update("fuseLimit", Number(e.target.value))}
            >
              {[1, 3, 5, 10, 15, 20].map((v) => (
                <option value={v} key={v}>
                  {v} A
                </option>
              ))}
            </select>
          </label>
          <div className="power-actions">
            <button
              className="primary"
              onClick={() => {
                update("enabled", true);
                setRunState(elapsed === 0 ? "ramping" : "running");
              }}
            >
              ▶ {runState === "paused" ? "Resume" : "Power on"}
            </button>
            <button
              disabled={runState !== "running" && runState !== "ramping"}
              onClick={() => setRunState("paused")}
            >
              Ⅱ Pause
            </button>
            <button
              onClick={() => {
                setElapsed((t) =>
                  Math.min(values.operatingTimeHours, t + 0.25),
                );
                setRunState("paused");
              }}
            >
              ▮▶ Step 15 min
            </button>
            <button
              onClick={() => {
                update("enabled", !values.enabled);
                setRunState("paused");
              }}
            >
              {values.enabled ? "Switch off" : "Switch on"}
            </button>
          </div>
          <label className="power-time">
            Energy timeline
            <input
              aria-label="Elapsed operating time"
              type="range"
              min="0"
              max={values.operatingTimeHours}
              step=".01"
              value={elapsed}
              onChange={(e) => {
                setElapsed(Number(e.target.value));
                setRunState("paused");
              }}
            />
          </label>
          <div className="power-options">
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
      <section className="power-appliances" aria-label="Appliance selection">
        {(
          Object.entries(APPLIANCES) as Array<
            [Appliance, (typeof APPLIANCES)[Appliance]]
          >
        ).map(([id, item]) => (
          <button
            key={id}
            className={values.appliance === id ? "active" : ""}
            onClick={() => choose(id)}
          >
            <span>
              {id === "lamp"
                ? "💡"
                : id === "fan"
                  ? "✣"
                  : id === "kettle"
                    ? "♨"
                    : "▥"}
            </span>
            <b>{item.label}</b>
            <small>{item.ratedPower} W at 230 V</small>
          </button>
        ))}
      </section>
      <section className="power-readings">
        <Readout label="Voltage" value={`${values.voltage.toFixed(1)} V`} />
        <Readout
          label="Current"
          value={`${result.current.toFixed(3)} A`}
          danger={result.overload}
        />
        <Readout label="Total power" value={`${result.powerVI.toFixed(1)} W`} />
        <Readout label="Energy" value={`${result.energyKWh.toFixed(3)} kWh`} />
        <Readout
          label="Heat"
          value={`${(result.heatJ / 1000).toFixed(1)} kJ`}
        />
      </section>
      <div className="power-analysis">
        <section className="power-graph">
          <header>
            <span>CUMULATIVE ENERGY</span>
            <b>Area under P–t curve</b>
          </header>
          <EnergyGraph
            projected={projected}
            result={result}
            elapsed={elapsed}
          />
          <footer>
            <span>{result.energyJ.toFixed(0)} J</span>
            <b>=</b>
            <span>{result.energyKWh.toFixed(4)} kWh</span>
          </footer>
        </section>
        <section className="power-identities">
          <span>POWER IDENTITIES</span>
          <h3>One result, three routes</h3>
          <p>
            <b>P = VI</b>
            <strong>{result.powerVI.toFixed(3)} W</strong>
          </p>
          <p>
            <b>P = I²R</b>
            <strong>{result.powerI2R.toFixed(3)} W</strong>
          </p>
          <p>
            <b>P = V²/R</b>
            <strong>{result.powerV2R.toFixed(3)} W</strong>
          </p>
          <small>
            All three agree because I = V/R. E = Pt and 1 kWh = 3.6 × 10⁶ J.
          </small>
        </section>
        <section
          className={`power-mission ${missionComplete ? "complete" : ""}`}
        >
          <span>MINI-MISSION</span>
          <h3>Use 0.240 kWh safely</h3>
          <p>
            Reach 0.230–0.250 kWh while current stays at or below 5.0 A and the
            selected fuse does not overload.
          </p>
          <button
            className="primary"
            onClick={() =>
              setFeedback(
                missionComplete
                  ? `✓ Target met: ${result.energyKWh.toFixed(3)} kWh at ${result.current.toFixed(2)} A.`
                  : result.overload
                    ? `Overload: choose more resistance or a lower voltage. Current is ${result.current.toFixed(2)} A.`
                    : `Energy is ${Math.abs(0.24 - result.energyKWh).toFixed(3)} kWh from target.`,
              )
            }
          >
            Check result
          </button>
          <p aria-live="polite">
            {feedback || "Hint: a 60 W lamp needs 4.00 h."}
          </p>
        </section>
        <section className={`power-safety ${result.overload ? "danger" : ""}`}>
          <span>SAFETY</span>
          <h3>{result.overload ? "Fuse would trip" : "No overload"}</h3>
          <p>
            I = {result.current.toFixed(2)} A · fuse = {values.fuseLimit} A
          </p>
          <p>
            {result.overload
              ? "Open the circuit before continuing."
              : "Current remains within the selected protection limit."}
          </p>
        </section>
      </div>
      <p className="power-sr" aria-live="polite">
        {values.enabled ? "Appliance on" : "Appliance off"}. Current{" "}
        {result.current.toFixed(3)} amperes, power {result.powerVI.toFixed(1)}{" "}
        watts, energy {result.energyKWh.toFixed(3)} kilowatt-hours.{" "}
        {result.overload ? "Overload" : "Safe"}.
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
    <label className="power-control">
      <span>
        <b>{label}</b>
        <strong>
          {value.toFixed(step < 1 ? 1 : 0)} {unit}
        </strong>
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
function EnergyGraph({
  projected,
  result,
  elapsed,
}: {
  projected: ReturnType<typeof computeElectricPower>;
  result: ReturnType<typeof computeElectricPower>;
  elapsed: number;
}) {
  const w = 440,
    h = 190,
    p = 28,
    maxE = Math.max(0.01, projected.energyKWh),
    maxT = Math.max(
      0.1,
      elapsed,
      projected.energyKWh / (projected.powerVI / 1000 || 1),
    );
  const x = p + (elapsed / maxT) * (w - 2 * p),
    y = h - p - (result.energyKWh / maxE) * (h - 2 * p);
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="Cumulative electrical energy timeline"
    >
      <line x1={p} y1={h - p} x2={w - p} y2={h - p} />
      <line x1={p} y1={p} x2={p} y2={h - p} />
      <path d={`M${p},${h - p} L${w - p},${p}`} />
      <path className="fill" d={`M${p},${h - p} L${x},${y} L${x},${h - p} Z`} />
      <circle cx={x} cy={y} r="5" />
      <text x={w / 2} y={h - 5}>
        Operating time (h)
      </text>
      <text x={7} y={17}>
        E (kWh)
      </text>
    </svg>
  );
}

function PowerScene({ input, power, phase, running, reducedMotion, selectedPart, onSelect, appliance, enabled, onChoose, onToggle }: { input:ElectricPowerInput; power:number; phase:number; running:boolean; reducedMotion:boolean; selectedPart:string; onSelect:(name:string)=>void; appliance:Appliance; enabled:boolean; onChoose:(appliance:Appliance)=>void; onToggle:()=>void }) {
  const hotspots:Array<{id:Appliance;label:string;x:number;y:number}>=[{id:"fan",label:"Fan",x:32,y:23},{id:"lamp",label:"Lamp",x:22,y:68},{id:"television",label:"TV",x:34,y:72},{id:"refrigerator",label:"Fridge",x:62,y:70},{id:"kettle",label:"Kettle",x:76,y:72},{id:"iron",label:"Iron",x:72,y:27},{id:"heater",label:"Heater",x:87,y:74}];
  return <div className="power-2d" role="application" aria-label="Interactive two-dimensional smart home. Select an appliance hotspot and use the main switch.">
    <img src={`${ROOT}/sprites/smart-home.png`} alt="Cutaway smart home with seven electrical appliances and visible wiring" draggable={false}/>
    {hotspots.map(item=><button key={item.id} className={`power-hotspot ${appliance===item.id?"active":""} ${enabled&&appliance===item.id?"on":""}`} style={{left:`${item.x}%`,top:`${item.y}%`}} onClick={()=>{onChoose(item.id);onSelect(item.id)}} aria-label={`Select ${item.label}`}><i/>{item.label}</button>)}
    <button className={`power-main-switch ${enabled?"on":""}`} onClick={onToggle}>{enabled?"MAIN ON":"MAIN OFF"}</button>
    <div className="power-live-wire" data-running={running&&!reducedMotion}>{Array.from({length:12},(_,i)=><i key={i} style={{animationDelay:`${i*.08}s`,opacity:.2+Math.min(.8,power/2000)}}/> )}</div>
    <output className="power-house-meter">{selectedPart.toUpperCase()} · {input.voltage.toFixed(0)} V · {power.toFixed(0)} W · t {phase.toFixed(2)} h</output>
  </div>;
}

/* Legacy GLB scene intentionally retired in the 2D studio conversion.
function LegacyPowerScene({
  input,
  power,
  phase,
  running,
  reducedMotion,
  resetViewSignal,
  selectedPart,
  onSelect,
}: {
  input: ElectricPowerInput;
  power: number;
  phase: number;
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
      power,
      phase,
      running,
      reducedMotion,
      selectedPart,
      onSelect,
    });
  propsRef.current = {
    input,
    power,
    phase,
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
    scene.add(new THREE.HemisphereLight(0xfff5da, 0x19251e, 2.3));
    const key = new THREE.DirectionalLight(0xffe8b0, 3.4);
    key.position.set(4, 7, 5);
    scene.add(key);
    const group = new THREE.Group();
    scene.add(group);
    const named = new Map<string, THREE.Object3D>();
    new GLTFLoader().load(`${ROOT}/electric-power.glb`, (gltf) => {
      const box = new THREE.Box3().setFromObject(gltf.scene),
        size = box.getSize(new THREE.Vector3()),
        center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.sub(center);
      gltf.scene.scale.setScalar(5.2 / Math.max(size.x, size.y, size.z));
      gltf.scene.traverse((object) => {
        if (object.name) named.set(object.name, object);
      });
      group.add(gltf.scene);
    });
    new THREE.TextureLoader().load(
      `${ROOT}/effects/concept_effect.png`,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            opacity: 0.08,
          }),
        );
        sprite.name = "power_effect";
        sprite.scale.set(4.6, 2.6, 1);
        sprite.position.set(0, 0.4, 0.15);
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
      named.forEach((object, name) =>
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const mats = Array.isArray(child.material)
              ? child.material
              : [child.material];
            mats.forEach((material) => {
              if ("emissive" in material) {
                const standard = material as THREE.MeshStandardMaterial,
                  isCoil = name.startsWith("inductor_");
                standard.emissive.set(
                  name === props.selectedPart
                    ? 0x39c8ff
                    : isCoil && props.input.enabled
                      ? 0xff531a
                      : 0,
                );
                standard.emissiveIntensity =
                  name === props.selectedPart
                    ? 0.7
                    : isCoil
                      ? Math.min(1.2, props.power / 1300) *
                        (props.running && !props.reducedMotion
                          ? 0.75 + 0.25 * Math.sin(props.phase * 50)
                          : 0.7)
                      : 0;
              }
            });
          }
        }),
      );
      const effect = scene.getObjectByName("power_effect") as
        | THREE.Sprite
        | undefined;
      if (effect)
        (effect.material as THREE.SpriteMaterial).opacity = props.running
          ? 0.12 + Math.min(0.5, props.power / 4000)
          : 0.05;
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
      className="power-canvas"
      role="img"
      aria-label={`Interactive appliance power circuit. Selected ${selectedPart.replace(/_/g, " ")}. Coil glow tracks power. Drag to orbit; wheel or pinch to zoom.`}
    />
  );
}
*/
