import { useCallback, useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  computeInternalResistance,
  fitTerminalVoltage,
  makeTerminalReading,
  type InternalResistanceInput,
  type TerminalReading,
} from "./internalResistancePhysics";
import "./internal-resistance-cell.css";
import "./internal-resistance-2d.css";

const ROOT = "/assets/experiments/internal-resistance-cell";
const DEFAULTS = { emf: 1.5, internalResistance: 0.8, externalResistance: 5 };
const LOAD_STEPS = [20, 10, 5, 2, 1, 0.5];
type RunState = "idle" | "running" | "paused" | "result";

export function InternalResistanceLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [values, setValues] = useState(DEFAULTS);
  const [switchClosed, setSwitchClosed] = useState(false);
  const [connectionsCorrect, setConnectionsCorrect] = useState(true);
  const [runState, setRunState] = useState<RunState>("idle");
  const [playback, setPlayback] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(
    () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  const [phase, setPhase] = useState(0);
  const [readings, setReadings] = useState<TerminalReading[]>([]);
  const [autoCollect, setAutoCollect] = useState(false);
  const [autoIndex, setAutoIndex] = useState(0);
  const [selectedPart, setSelectedPart] = useState("battery_body");
  const [missionMode, setMissionMode] = useState(false);
  const [estimate, setEstimate] = useState(0.5);
  const [missionFeedback, setMissionFeedback] = useState("");

  const input = useMemo<InternalResistanceInput>(
    () => ({
      ...values,
      switchClosed,
      meterConnectionsCorrect: connectionsCorrect,
    }),
    [values, switchClosed, connectionsCorrect],
  );
  const result = useMemo(() => computeInternalResistance(input), [input]);
  const fit = useMemo(() => fitTerminalVoltage(readings), [readings]);

  const record = useCallback((source: InternalResistanceInput) => {
    const reading = makeTerminalReading(source);
    if (!reading) return;
    setReadings((current) =>
      [
        ...current.filter(
          (point) => Math.abs(point.resistance - reading.resistance) > 1e-9,
        ),
        reading,
      ].sort((a, b) => b.resistance - a.resistance),
    );
  }, []);

  useEffect(() => {
    if (runState !== "running") return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      setPhase(
        (value) => (value + dt * playback * (reducedMotion ? 0.2 : 1)) % 1,
      );
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [runState, playback, reducedMotion]);

  useEffect(() => {
    if (!autoCollect || runState !== "running" || !switchClosed) return;
    const delay = Math.max(320, 900 / playback);
    const timer = window.setTimeout(() => {
      const resistance = LOAD_STEPS[autoIndex];
      const next = { ...input, externalResistance: resistance };
      setValues((current) => ({ ...current, externalResistance: resistance }));
      record(next);
      if (autoIndex === LOAD_STEPS.length - 1) {
        setAutoCollect(false);
        setRunState("result");
      } else setAutoIndex((index) => index + 1);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [autoCollect, runState, switchClosed, autoIndex, playback, input, record]);

  const update = (key: keyof typeof DEFAULTS, value: number) =>
    setValues((current) => ({ ...current, [key]: value }));
  const reset = () => {
    setValues(DEFAULTS);
    setSwitchClosed(false);
    setConnectionsCorrect(true);
    setRunState("idle");
    setPhase(0);
    setReadings([]);
    setAutoCollect(false);
    setAutoIndex(0);
    setMissionMode(false);
    setMissionFeedback("");
  };
  const start = () => {
    setSwitchClosed(true);
    setRunState("running");
  };
  const status = result.shortCircuitProtected
    ? "Protection tripped — R below 0.10 Ω"
    : !connectionsCorrect
      ? "Invalid meter connection — circuit isolated"
      : switchClosed
        ? "Key closed · readings live"
        : "Key open · no current";

  return (
    <section
      className="ir-lab"
      data-ui-theme="dark"
      data-run-state={runState}
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="ir-head">
        <div>
          <span>CURRENT ELECTRICITY · CLASS 12</span>
          <h2>Cell Internal Resistance — Terminal Voltage Lab</h2>
          <p>
            Load a real cell, record V and I, then recover E and r from the
            line.
          </p>
        </div>
        <div>
          <button onClick={() => { setSelectedPart("battery_body"); update("externalResistance",DEFAULTS.externalResistance); }}>
            ◎ Reset bench
          </button>
          <button onClick={reset}>↻ Reset experiment</button>
        </div>
      </header>

      <div className="ir-bench">
        <main className="ir-stage">
          <CellScene
            input={input}
            resultCurrent={result.current}
            phase={phase}
            running={runState === "running"}
            reducedMotion={reducedMotion}
            selectedPart={selectedPart}
            onSelect={setSelectedPart}
            onResistance={(externalResistance)=>update("externalResistance",externalResistance)}
            onSwitch={()=>setSwitchClosed(value=>!value)}
          />
          <div className="ir-current-flow" aria-hidden="true">
            {Array.from({ length: 8 }, (_, index) => (
              <i key={index} style={{ animationDelay: `${-index * 0.18}s` }}>
                ➜
              </i>
            ))}
          </div>
          <div
            className={`ir-status ${result.shortCircuitProtected || !connectionsCorrect ? "danger" : ""}`}
          >
            <b>{status}</b>
            <span>
              {switchClosed &&
              connectionsCorrect &&
              !result.shortCircuitProtected
                ? "Conventional current →"
                : "Current path interrupted"}
            </span>
          </div>
          <div className="ir-part-select" aria-label="3D part selection">
            {[
              "battery_body",
              "battery_positive",
              "electrode_anode",
              "electrode_cathode",
              "ion_00",
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

        <aside className="ir-controls" aria-label="Circuit parameters">
          <h3>Circuit parameters</h3>
          <Control
            label="Cell emf"
            symbol="E"
            value={values.emf}
            min={0.5}
            max={12}
            step={0.1}
            unit="V"
            onChange={(value) => update("emf", value)}
          />
          <Control
            label="Internal resistance"
            symbol="r"
            value={values.internalResistance}
            min={0.05}
            max={5}
            step={0.05}
            unit="Ω"
            hiddenValue={missionMode}
            onChange={(value) => update("internalResistance", value)}
          />
          <Control
            label="External resistance"
            symbol="R"
            value={values.externalResistance}
            min={0}
            max={20}
            step={0.1}
            unit="Ω"
            onChange={(value) => update("externalResistance", value)}
          />
          {values.externalResistance < 0.1 && (
            <p className="ir-warning">
              R &lt; 0.10 Ω would be a short circuit. The safety relay opens the
              path.
            </p>
          )}
          <div className="ir-presets">
            <button
              onClick={() =>
                setValues({
                  emf: 1.5,
                  internalResistance: 0.2,
                  externalResistance: 10,
                })
              }
            >
              Fresh cell
            </button>
            <button
              onClick={() =>
                setValues({
                  emf: 1.5,
                  internalResistance: 1.5,
                  externalResistance: 5,
                })
              }
            >
              Weak cell
            </button>
            <button onClick={() => update("externalResistance", 0)}>
              Protected short
            </button>
          </div>
          <label className="ir-connection">
            <input
              type="checkbox"
              checked={connectionsCorrect}
              onChange={(event) => setConnectionsCorrect(event.target.checked)}
            />
            Meters connected correctly{" "}
            <small>A in series · V in parallel</small>
          </label>
          <div className="ir-actions">
            <button className="primary" onClick={start}>
              ▶{" "}
              {runState === "paused"
                ? "Resume"
                : switchClosed
                  ? "Play"
                  : "Close key"}
            </button>
            <button
              onClick={() => setRunState("paused")}
              disabled={runState !== "running"}
            >
              Ⅱ Pause
            </button>
            <button
              onClick={() => {
                setPhase((value) => (value + 0.1) % 1);
                setRunState("paused");
              }}
            >
              ▮▶ Step
            </button>
            <button
              onClick={() => {
                setSwitchClosed((closed) => !closed);
                setRunState("paused");
              }}
            >
              {switchClosed ? "Open key" : "Close key"}
            </button>
          </div>
          <div className="ir-options">
            <label>
              Speed{" "}
              <select
                aria-label="Playback speed"
                value={playback}
                onChange={(event) => setPlayback(Number(event.target.value))}
              >
                {[0.25, 0.5, 1, 1.5, 2].map((value) => (
                  <option key={value} value={value}>
                    {value}×
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

      <section className="ir-meters" aria-label="Live meters">
        <Meter
          label="Ammeter"
          value={result.current}
          unit="A"
          maximum={Math.max(1, values.emf / values.internalResistance)}
        />
        <Meter
          label="Terminal voltmeter"
          value={result.terminalVoltage}
          unit="V"
          maximum={12}
        />
        <div className="ir-readout">
          <span>Lost volts Ir</span>
          <strong>{result.lostVoltage.toFixed(3)} V</strong>
          <small>Inside the cell</small>
        </div>
        <div className="ir-readout heat">
          <span>Internal heating I²r</span>
          <strong>{result.internalPower.toFixed(3)} W</strong>
          <small>Energy dissipated in cell</small>
        </div>
      </section>

      <div className="ir-data-grid">
        <section className="ir-table-panel">
          <header>
            <div>
              <span>OBSERVATIONS</span>
              <h3>Terminal-voltage readings</h3>
            </div>
            <button onClick={() => setReadings([])}>Clear</button>
          </header>
          <div className="ir-collect">
            <button
              className="primary"
              disabled={!result.circuitComplete}
              onClick={() => record(input)}
            >
              ● Record reading
            </button>
            <button
              disabled={!result.circuitComplete}
              onClick={() => {
                setAutoIndex(0);
                setAutoCollect(true);
                setRunState("running");
              }}
            >
              ↻ Auto collect
            </button>
          </div>
          <div className="ir-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>R (Ω)</th>
                  <th>I (A)</th>
                  <th>V (V)</th>
                  <th>Ir (V)</th>
                </tr>
              </thead>
              <tbody>
                {readings.map((reading, index) => (
                  <tr key={reading.resistance}>
                    <td>{index + 1}</td>
                    <td>{reading.resistance.toFixed(1)}</td>
                    <td>{reading.current.toFixed(3)}</td>
                    <td>{reading.voltage.toFixed(3)}</td>
                    <td>{(values.emf - reading.voltage).toFixed(3)}</td>
                  </tr>
                ))}
                {!readings.length && (
                  <tr>
                    <td colSpan={5}>
                      Close the key and record at least two loads.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <small>
            {readings.length} point(s) recorded · values are deterministic, not
            faked.
          </small>
        </section>

        <VoltageCurrentGraph
          readings={readings}
          emf={values.emf}
          internalResistance={values.internalResistance}
          fit={fit}
        />

        <section className="ir-physics">
          <span>PHYSICS EXPLANATION</span>
          <h3>Why terminal voltage sags</h3>
          <p>
            <b>V = E − Ir</b>
            <small>terminal voltage</small>
          </p>
          <p>
            <b>I = E / (R + r)</b>
            <small>circuit current</small>
          </p>
          <p>
            <b>
              P<sub>internal</sub> = I²r
            </b>
            <small>cell heating</small>
          </p>
          <div className="ir-fit">
            <b>Graph meaning</b>
            <span>intercept = E</span>
            <span>slope = −r</span>
          </div>
          <div className="ir-mission">
            <span>MINI-MISSION</span>
            <h3>Estimate the hidden r</h3>
            <button
              onClick={() => {
                setMissionMode(true);
                setMissionFeedback("");
              }}
            >
              Hide r and begin
            </button>
            <label>
              Your estimate{" "}
              <input
                type="number"
                min="0.05"
                max="5"
                step="0.05"
                value={estimate}
                onChange={(event) => setEstimate(Number(event.target.value))}
              />{" "}
              Ω
            </label>
            <button
              className="primary"
              disabled={!missionMode || readings.length < 2}
              onClick={() => {
                const error = Math.abs(estimate - values.internalResistance);
                setMissionFeedback(
                  error <= 0.05
                    ? `✓ Correct. The fitted slope is ${fit?.slope.toFixed(2)} V/A, so r = ${values.internalResistance.toFixed(2)} Ω.`
                    : `Not yet: use the magnitude of ΔV/ΔI. Your estimate differs by ${error.toFixed(2)} Ω.`,
                );
              }}
            >
              Check estimate
            </button>
            <p aria-live="polite">
              {missionFeedback ||
                "Collect at least two different loads, then use the graph slope."}
            </p>
          </div>
        </section>
      </div>
      <p className="ir-sr" aria-live="polite">
        {status}. Current {result.current.toFixed(3)} amperes. Terminal voltage{" "}
        {result.terminalVoltage.toFixed(3)} volts. Lost voltage{" "}
        {result.lostVoltage.toFixed(3)} volts. {readings.length} readings
        recorded.
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
  hiddenValue,
  onChange,
}: {
  label: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  hiddenValue?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <label className="ir-control">
      <span>
        <b>
          {label} <i>{symbol}</i>
        </b>
        <strong>
          {hiddenValue
            ? "Hidden"
            : `${value.toFixed(step < 0.1 ? 2 : 1)} ${unit}`}
        </strong>
      </span>
      <input
        type="range"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={hiddenValue}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <small>
        {min} — {max} {unit}
      </small>
    </label>
  );
}

function Meter({
  label,
  value,
  unit,
  maximum,
}: {
  label: string;
  value: number;
  unit: string;
  maximum: number;
}) {
  const angle = -58 + Math.min(1, Math.max(0, value / maximum)) * 116;
  return (
    <section className="ir-meter">
      <span>{label.toUpperCase()}</span>
      <div>
        <i style={{ transform: `rotate(${angle}deg)` }} />
        <b>{value.toFixed(3)}</b>
      </div>
      <strong>
        {value.toFixed(3)} {unit}
      </strong>
    </section>
  );
}

function VoltageCurrentGraph({
  readings,
  emf,
  internalResistance,
  fit,
}: {
  readings: TerminalReading[];
  emf: number;
  internalResistance: number;
  fit: ReturnType<typeof fitTerminalVoltage>;
}) {
  const w = 520,
    h = 300,
    left = 48,
    right = 18,
    top = 24,
    bottom = 42;
  const maxI = Math.max(1, ...readings.map((point) => point.current * 1.15));
  const maxV = Math.max(2, emf * 1.15);
  const x = (current: number) => left + (current / maxI) * (w - left - right);
  const y = (voltage: number) =>
    h - bottom - (voltage / maxV) * (h - top - bottom);
  return (
    <section className="ir-graph">
      <header>
        <span>TERMINAL VOLTAGE V vs CURRENT I</span>
        <b>
          {fit
            ? `V = ${fit.intercept.toFixed(2)} − ${fit.estimatedInternalResistance.toFixed(2)}I`
            : "Collect ≥ 2 points"}
        </b>
      </header>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Terminal voltage against current graph"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <g key={ratio}>
            <line
              x1={left}
              x2={w - right}
              y1={y(maxV * ratio)}
              y2={y(maxV * ratio)}
            />
            <text x={left - 7} y={y(maxV * ratio) + 4} textAnchor="end">
              {(maxV * ratio).toFixed(1)}
            </text>
            <text x={x(maxI * ratio)} y={h - 18} textAnchor="middle">
              {(maxI * ratio).toFixed(2)}
            </text>
          </g>
        ))}
        <line
          className="axis"
          x1={left}
          x2={w - right}
          y1={h - bottom}
          y2={h - bottom}
        />
        <line className="axis" x1={left} x2={left} y1={top} y2={h - bottom} />
        <path
          className="fit-line"
          d={`M${x(0)},${y(fit?.intercept ?? emf)} L${x(maxI)},${y((fit?.intercept ?? emf) + (fit?.slope ?? -internalResistance) * maxI)}`}
        />
        {readings.map((point) => (
          <circle
            key={point.resistance}
            cx={x(point.current)}
            cy={y(point.voltage)}
            r="5"
          >
            <title>
              R {point.resistance} Ω, I {point.current.toFixed(3)} A, V{" "}
              {point.voltage.toFixed(3)} V
            </title>
          </circle>
        ))}
        <text className="label" x={w / 2} y={h - 3}>
          Current I (A)
        </text>
        <text
          className="label"
          transform={`translate(14 ${h / 2}) rotate(-90)`}
        >
          Voltage V (V)
        </text>
      </svg>
      <footer>
        <span>Intercept E ≈ {fit?.intercept.toFixed(3) ?? "—"} V</span>
        <span>Slope −r ≈ {fit?.slope.toFixed(3) ?? "—"} V/A</span>
        <span>R² {fit?.rSquared.toFixed(3) ?? "—"}</span>
      </footer>
    </section>
  );
}

function CellScene({ input, resultCurrent, phase, running, reducedMotion, selectedPart, onSelect, onResistance, onSwitch }: { input:InternalResistanceInput; resultCurrent:number; phase:number; running:boolean; reducedMotion:boolean; selectedPart:string; onSelect:(name:string)=>void; onResistance:(value:number)=>void; onSwitch:()=>void }) {
  const moveRheostat=(event:React.PointerEvent<HTMLButtonElement>)=>{if(event.type==="pointermove"&&!event.currentTarget.hasPointerCapture(event.pointerId))return;if(event.type==="pointerdown")event.currentTarget.setPointerCapture(event.pointerId);const rect=event.currentTarget.getBoundingClientRect();onResistance(Math.max(0,Math.min(20,(event.clientX-rect.left)/rect.width*20)));};
  const slider=(input.externalResistance/20)*100;
  const needleA=-55+Math.min(1,resultCurrent/1)*110;
  const terminalVoltage=input.emf-resultCurrent*input.internalResistance;
  const needleV=-55+Math.min(1,terminalVoltage/5)*110;
  return <div className="ir-2d" role="application" aria-label="Interactive two-dimensional internal resistance bench. Drag the rheostat slider and click the key switch.">
    <img src={`${ROOT}/sprites/meter-bench.png`} alt="Cell, rheostat, ammeter, voltmeter and open key on a wired board" draggable={false}/>
    <button className={`ir-select ir-cell-select ${selectedPart==="battery_body"?"active":""}`} aria-label="Select cell" onClick={()=>onSelect("battery_body")}/>
    <button className="ir-rheostat-track" aria-label={`Rheostat ${input.externalResistance.toFixed(2)} ohms`} onPointerDown={moveRheostat} onPointerMove={moveRheostat}><i style={{left:`${slider}%`}}/></button>
    <button className={`ir-key-2d ${input.switchClosed?"closed":""}`} aria-label={input.switchClosed?"Open circuit key":"Close circuit key"} onClick={onSwitch}><i/></button>
    <i className="ir-needle ir-needle-a" style={{transform:`rotate(${needleA}deg)`}}/><i className="ir-needle ir-needle-v" style={{transform:`rotate(${needleV}deg)`}}/>
    <div className="ir-electrons" data-running={running&&!reducedMotion}>{Array.from({length:10},(_,i)=><i key={i} style={{animationDelay:`${i*.1}s`,opacity:.3+.7*Math.abs(Math.sin(phase*Math.PI*2+i))}}/> )}</div>
    <span className="ir-direct-hint">DRAG RHEOSTAT · CLICK KEY · SELECT CELL</span>
  </div>;
}

/* Legacy GLB scene intentionally retired in the 2D studio conversion.
function LegacyCellScene({
  input,
  resultCurrent,
  phase,
  running,
  reducedMotion,
  resetViewSignal,
  selectedPart,
  onSelect,
}: {
  input: InternalResistanceInput;
  resultCurrent: number;
  phase: number;
  running: boolean;
  reducedMotion: boolean;
  resetViewSignal: number;
  selectedPart: string;
  onSelect: (name: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<{
    controls: OrbitControls;
    camera: THREE.PerspectiveCamera;
  } | null>(null);
  const propsRef = useRef({
    input,
    resultCurrent,
    phase,
    running,
    reducedMotion,
    selectedPart,
    onSelect,
  });
  propsRef.current = {
    input,
    resultCurrent,
    phase,
    running,
    reducedMotion,
    selectedPart,
    onSelect,
  };
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100);
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
    runtimeRef.current = { controls, camera };
    scene.add(new THREE.HemisphereLight(0xeaf6ff, 0x1a241d, 2.2));
    const key = new THREE.DirectionalLight(0xfff2d5, 3.5);
    key.position.set(4, 7, 5);
    scene.add(key);
    const group = new THREE.Group();
    scene.add(group);
    const named = new Map<string, THREE.Object3D>();
    const originals = new Map<string, THREE.Vector3>();
    new GLTFLoader().load(`${ROOT}/internal-resistance-cell.glb`, (gltf) => {
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
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
    const textureLoader = new THREE.TextureLoader();
    [
      `${ROOT}/effects/concept_effect.png`,
      `${ROOT}/effects/interaction_overlay.png`,
    ].forEach((url, index) =>
      textureLoader.load(url, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0.18,
        });
        const sprite = new THREE.Sprite(material);
        sprite.name = `effect_${index}`;
        sprite.scale.set(4.5, 2.5, 1);
        sprite.position.set(0, 0.4, index ? 0.2 : -0.6);
        scene.add(sprite);
      }),
    );
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const select = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(group.children, true)[0]?.object;
      let node: THREE.Object3D | null = hit ?? null;
      while (node && !named.has(node.name)) node = node.parent;
      if (node?.name) propsRef.current.onSelect(node.name);
    };
    renderer.domElement.addEventListener("pointerup", select);
    let frame = 0;
    const resize = () => {
      const width = host.clientWidth,
        height = host.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
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
          const ionIndex = Number(name.slice(4)) || 0;
          object.position.x =
            original.x +
            (props.running && !props.reducedMotion
              ? Math.sin(props.phase * 6.28 + ionIndex) *
                0.035 *
                Math.min(1, props.resultCurrent)
              : 0);
        }
        object.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const mats = Array.isArray(child.material)
              ? child.material
              : [child.material];
            mats.forEach((material) => {
              if ("emissive" in material) {
                const standard = material as THREE.MeshStandardMaterial;
                standard.emissive.set(
                  name === props.selectedPart
                    ? 0x1fb6ff
                    : name === "battery_positive"
                      ? 0x351000
                      : 0x000000,
                );
                standard.emissiveIntensity =
                  name === props.selectedPart
                    ? 0.7
                    : name === "battery_positive"
                      ? Math.min(1, props.input.emf / 12)
                      : 0;
              }
            });
          }
        });
      });
      scene.children
        .filter((object) => object.name.startsWith("effect_"))
        .forEach((object, effectIndex) => {
          const sprite = object as THREE.Sprite;
          (sprite.material as THREE.SpriteMaterial).opacity = props.running
            ? 0.12 +
              Math.min(0.55, props.resultCurrent * 0.2) +
              (effectIndex ? 0.05 : 0)
            : 0.08;
        });
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
      className="ir-canvas"
      ref={hostRef}
      role="img"
      aria-label={`Interactive 3D cell model. Selected ${selectedPart.replace(/_/g, " ")}. Drag to orbit, wheel or pinch to zoom.`}
    />
  );
}
*/
