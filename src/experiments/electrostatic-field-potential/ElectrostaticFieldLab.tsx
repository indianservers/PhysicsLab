import { useEffect, useMemo, useRef, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  computeElectrostatic,
  fieldAndPotential,
  type ElectrostaticInput,
} from "./electrostaticPhysics";
import "./electrostatic-field.css";
import "./electrostatic-field-2d.css";
const DEFAULTS = {
    charge1: 3e-6,
    charge2: -3e-6,
    separation: 2,
    probeX: 0,
    probeY: 1.5,
    testCharge: 1e-6,
  };
type RunState = "idle" | "running" | "paused" | "result";
export function ElectrostaticFieldLab({
  experiment,
}: DedicatedExperimentLabProps) {
  const [values, setValues] = useState(DEFAULTS),
    [runState, setRunState] = useState<RunState>("idle"),
    [phase, setPhase] = useState(0),
    [playback, setPlayback] = useState(1),
    [reducedMotion, setReducedMotion] = useState(
      () => matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    ),
    [feedback, setFeedback] = useState("");
  const input = useMemo<ElectrostaticInput>(() => values, [values]),
    result = useMemo(() => computeElectrostatic(input), [input]);
  useEffect(() => {
    if (runState !== "running") return;
    let frame = 0,
      previous = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      setPhase((p) => (p + dt * playback * (reducedMotion ? 0.15 : 1)) % 1);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [runState, playback, reducedMotion]);
  const update = (key: keyof typeof DEFAULTS, value: number) =>
      setValues((v) => ({ ...v, [key]: value })),
    reset = () => {
      setValues(DEFAULTS);
      setRunState("idle");
      setPhase(0);
      setFeedback("");
    };
  const missionComplete =
    Math.abs(result.potential) < 1 && result.fieldMagnitude > 100;
  return (
    <section
      className="electro-lab"
      data-ui-theme="dark"
      data-run-state={runState}
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="electro-head">
        <div>
          <span>ELECTROSTATICS · CLASS 12</span>
          <h2>Electrostatic Sandbox: Fields, Potentials & Work</h2>
          <p>
            Vector field is directional; potential is scalar. Drag the probe and
            compare both.
          </p>
        </div>
        <div>
          <button onClick={() => { update("probeX",0); update("probeY",0); }}>
            ◎ Center probe
          </button>
          <button onClick={reset}>↻ Reset experiment</button>
        </div>
      </header>
      <div className="electro-work">
        <aside className="electro-controls" aria-label="Charge controls">
          <h3>Charges</h3>
          <Control
            label="Charge Q₁"
            value={values.charge1 * 1e6}
            min={-20}
            max={20}
            step={0.5}
            unit="μC"
            onChange={(v) => update("charge1", v * 1e-6)}
          />
          <Control
            label="Charge Q₂"
            value={values.charge2 * 1e6}
            min={-20}
            max={20}
            step={0.5}
            unit="μC"
            onChange={(v) => update("charge2", v * 1e-6)}
          />
          <Control
            label="Separation"
            value={values.separation}
            min={0.2}
            max={4}
            step={0.1}
            unit="m"
            onChange={(v) => update("separation", v)}
          />
          <h3>Test-charge probe</h3>
          <Control
            label="Probe x"
            value={values.probeX}
            min={-4}
            max={4}
            step={0.1}
            unit="m"
            onChange={(v) => update("probeX", v)}
          />
          <Control
            label="Probe y"
            value={values.probeY}
            min={-3}
            max={3}
            step={0.1}
            unit="m"
            onChange={(v) => update("probeY", v)}
          />
          <Control
            label="Test charge"
            value={values.testCharge * 1e6}
            min={-10}
            max={10}
            step={0.5}
            unit="μC"
            onChange={(v) => update("testCharge", v * 1e-6)}
          />
          {result.singularityPrevented && (
            <p className="electro-warning">
              Probe kept 0.08 m from a source to prevent a singularity.
            </p>
          )}
          <div className="electro-presets">
            <button
              onClick={() =>
                setValues((v) => ({ ...v, charge1: 3e-6, charge2: -3e-6 }))
              }
            >
              Dipole
            </button>
            <button
              onClick={() =>
                setValues((v) => ({ ...v, charge1: 3e-6, charge2: 3e-6 }))
              }
            >
              Like charges
            </button>
            <button
              onClick={() =>
                setValues((v) => ({ ...v, charge1: 6e-6, charge2: -3e-6 }))
              }
            >
              Unequal
            </button>
          </div>
        </aside>
        <main className="electro-stage">
          <FieldMap
            input={input}
            result={result}
            onProbe={(x, y) =>
              setValues((v) => ({ ...v, probeX: x, probeY: y }))
            }
            onSeparation={(separation) => update("separation", separation)}
          />
          <div className="electro-2d-guide" style={{opacity:.86+(runState === "running" ? Math.sin(phase*Math.PI*2)*.12 : 0)}}><strong>DIRECT FIELD TOOLS</strong><span>Drag charges ↔ to change separation</span><span>Drag probe anywhere · arrow keys fine-tune</span><span>Compare E vector and scalar V at the same point</span></div>
        </main>
        <aside className="electro-results">
          <span>PROBE READOUT</span>
          <h3>
            At ({result.probeX.toFixed(2)}, {result.probeY.toFixed(2)}) m
          </h3>
          <Readout
            label="Potential V"
            value={`${format(result.potential)} V`}
          />
          <Readout
            label="Field magnitude |E|"
            value={`${format(result.fieldMagnitude)} N/C`}
          />
          <Readout
            label="Field vector"
            value={`(${format(result.fieldX)}, ${format(result.fieldY)}) N/C`}
          />
          <Readout
            label="Work by field"
            value={`${format(result.workByField)} J`}
          />
          <section className="electro-equations">
            <h3>Superposition</h3>
            <p>V = k Σ(qᵢ/rᵢ)</p>
            <p>
              <b>E</b> = k Σ(qᵢ <b>r̂</b>ᵢ/rᵢ²)
            </p>
            <p>
              <b>E</b> = −∇V
            </p>
            <p>
              W<sub>field</sub> = −qΔV
            </p>
          </section>
          <section
            className={`electro-mission ${missionComplete ? "complete" : ""}`}
          >
            <span>MINI-MISSION</span>
            <h3>V = 0 but |E| ≠ 0</h3>
            <p>
              For a dipole, find a zero-potential point where the vector field
              remains non-zero.
            </p>
            <button
              onClick={() =>
                setFeedback(
                  missionComplete
                    ? `✓ Found: V = ${result.potential.toFixed(2)} V while |E| = ${format(result.fieldMagnitude)} N/C.`
                    : `Not yet: |V| is ${format(Math.abs(result.potential))} V. Try the perpendicular bisector of equal opposite charges.`,
                )
              }
            >
              Check point
            </button>
            <p aria-live="polite">
              {feedback ||
                "Hint: scalar contributions can cancel while vectors reinforce."}
            </p>
          </section>
        </aside>
      </div>
      <footer className="electro-play">
        <button className="primary" onClick={() => setRunState("running")}>
          ▶ {runState === "paused" ? "Resume" : "Animate probe"}
        </button>
        <button
          disabled={runState !== "running"}
          onClick={() => setRunState("paused")}
        >
          Ⅱ Pause
        </button>
        <button
          onClick={() => {
            setPhase((p) => (p + 0.1) % 1);
            setRunState("paused");
          }}
        >
          ▮▶ Step
        </button>
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
        <span>
          {runState === "running"
            ? "Positive test charge follows the local field direction"
            : "Field geometry stable"}
        </span>
      </footer>
      <p className="electro-sr" aria-live="polite">
        Potential {format(result.potential)} volts. Electric field{" "}
        {format(result.fieldMagnitude)} newtons per coulomb, vector{" "}
        {format(result.fieldX)}, {format(result.fieldY)}.{" "}
        {result.singularityPrevented
          ? "Probe moved away from singularity."
          : "Probe position valid."}
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
    <label className="electro-control">
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
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <small>
        {min} — {max} {unit}
      </small>
    </label>
  );
}
function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="electro-readout">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
const format = (v: number) =>
  Math.abs(v) >= 1e4 || (Math.abs(v) < 0.01 && v !== 0)
    ? v.toExponential(2)
    : v.toFixed(2);

function FieldMap({
  input,
  result,
  onProbe,
  onSeparation,
}: {
  input: ElectrostaticInput;
  result: ReturnType<typeof computeElectrostatic>;
  onProbe: (x: number, y: number) => void;
  onSeparation: (s: number) => void;
}) {
  const width = 700,
    height = 470,
    p = 28,
    drag = useRef<"probe" | "q1" | "q2" | null>(null),
    sx = (x: number) => p + ((x + 4) / 8) * (width - 2 * p),
    sy = (y: number) => p + ((3 - y) / 6) * (height - 2 * p),
    world = (event: React.PointerEvent<SVGSVGElement>) => {
      const r = event.currentTarget.getBoundingClientRect();
      return {
        x:
          ((((event.clientX - r.left) / r.width) * width - p) /
            (width - 2 * p)) *
            8 -
          4,
        y:
          3 -
          ((((event.clientY - r.top) / r.height) * height - p) /
            (height - 2 * p)) *
            6,
      };
    };
  const vectors = useMemo(() => {
    const rows = [];
    for (let y = -2.5; y <= 2.5; y += 0.625)
      for (let x = -3.5; x <= 3.5; x += 0.7) {
        const f = fieldAndPotential(input, x, y),
          angle = (Math.atan2(f.fieldY, f.fieldX) * 180) / Math.PI;
        rows.push({ x, y, angle, magnitude: f.fieldMagnitude });
      }
    return rows;
  }, [input]);
  const heat = useMemo(() => {
    const cells = [];
    for (let yi = 0; yi < 15; yi++)
      for (let xi = 0; xi < 20; xi++) {
        const x = -4 + (xi + 0.5) * 0.4,
          y = -3 + (yi + 0.5) * 0.4,
          v = fieldAndPotential(input, x, y).potential,
          c = Math.max(-1, Math.min(1, v / 60000));
        cells.push({ x: -4 + xi * 0.4, y: -3 + yi * 0.4, c });
      }
    return cells;
  }, [input]);
  const contours = useMemo(() => makeContours(input), [input]);
  const move = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const pos = world(event);
    if (drag.current === "probe")
      onProbe(
        Math.max(-4, Math.min(4, pos.x)),
        Math.max(-3, Math.min(3, pos.y)),
      );
    else onSeparation(Math.max(0.2, Math.min(4, Math.abs(pos.x) * 2)));
  };
  return (
    <svg
      className="electro-map"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Computed electric field vectors, equipotential contours, two draggable charges, and a draggable test probe"
      onPointerMove={move}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
    >
      <rect x="0" y="0" width={width} height={height} fill="#f8fbff" />
      {heat.map((cell, i) => (
        <rect
          key={i}
          x={sx(cell.x)}
          y={sy(cell.y + 0.4)}
          width={(width - 2 * p) / 20 + 1}
          height={(height - 2 * p) / 15 + 1}
          fill={
            cell.c >= 0
              ? `rgba(244,121,52,${0.06 + Math.abs(cell.c) * 0.35})`
              : `rgba(48,139,224,${0.06 + Math.abs(cell.c) * 0.35})`
          }
        />
      ))}
      {contours.map((segment, i) => (
        <line
          className="contour"
          key={i}
          x1={sx(segment.x1)}
          y1={sy(segment.y1)}
          x2={sx(segment.x2)}
          y2={sy(segment.y2)}
        />
      ))}
      {vectors.map((v, i) => (
        <g
          key={i}
          transform={`translate(${sx(v.x)} ${sy(v.y)}) rotate(${-v.angle})`}
        >
          <line className="vector" x1="-7" x2="7" y1="0" y2="0" />
          <path className="arrow" d="M7 0 L3 -2 L3 2 Z" />
        </g>
      ))}
      <line className="axis" x1={p} x2={width - p} y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1={p} y2={height - p} />
      <g
        className="charge positive"
        transform={`translate(${sx(-input.separation / 2)} ${sy(0)})`}
        onPointerDown={(e) => {
          drag.current = "q1";
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
      >
        <circle r="20" />
        <text y="6">{input.charge1 >= 0 ? "+" : "−"}</text>
      </g>
      <g
        className="charge negative"
        transform={`translate(${sx(input.separation / 2)} ${sy(0)})`}
        onPointerDown={(e) => {
          drag.current = "q2";
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
      >
        <circle r="20" />
        <text y="6">{input.charge2 >= 0 ? "+" : "−"}</text>
      </g>
      <g
        className="probe"
        transform={`translate(${sx(result.probeX)} ${sy(result.probeY)})`}
        onPointerDown={(e) => {
          drag.current = "probe";
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
      >
        <circle r="10" />
        <line
          x1="0"
          y1="0"
          x2={Math.max(
            -55,
            Math.min(55, (result.fieldX / result.fieldMagnitude) * 48 || 0),
          )}
          y2={Math.max(
            -55,
            Math.min(55, (-result.fieldY / result.fieldMagnitude) * 48 || 0),
          )}
        />
        <text x="13" y="-10">
          PROBE
        </text>
      </g>
      <text className="map-label" x={width / 2} y={height - 6}>
        x (m)
      </text>
      <text
        className="map-label"
        transform={`translate(12 ${height / 2}) rotate(-90)`}
      >
        y (m)
      </text>
    </svg>
  );
}
function makeContours(input: ElectrostaticInput) {
  const nx = 34,
    ny = 26,
    xmin = -4,
    xmax = 4,
    ymin = -3,
    ymax = 3,
    values: Array<Array<number>> = [];
  let scale = 0;
  for (let j = 0; j <= ny; j++) {
    values[j] = [];
    for (let i = 0; i <= nx; i++) {
      const v = fieldAndPotential(
        input,
        xmin + (i * (xmax - xmin)) / nx,
        ymin + (j * (ymax - ymin)) / ny,
      ).potential;
      values[j][i] = v;
      if (Number.isFinite(v))
        scale = Math.max(scale, Math.min(150000, Math.abs(v)));
    }
  }
  const segments: Array<{ x1: number; y1: number; x2: number; y2: number }> =
    [];
  for (const level of [-0.75, -0.4, 0, 0.4, 0.75].map((v) => v * scale)) {
    for (let j = 0; j < ny; j++)
      for (let i = 0; i < nx; i++) {
        const x = xmin + (i * (xmax - xmin)) / nx,
          y = ymin + (j * (ymax - ymin)) / ny,
          dx = (xmax - xmin) / nx,
          dy = (ymax - ymin) / ny,
          c = [
            { x, y, v: values[j][i] },
            { x: x + dx, y, v: values[j][i + 1] },
            { x: x + dx, y: y + dy, v: values[j + 1][i + 1] },
            { x, y: y + dy, v: values[j + 1][i] },
          ],
          points: Array<{ x: number; y: number }> = [];
        for (const [a, b] of [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 0],
        ] as Array<[number, number]>) {
          const ca = c[a],
            cb = c[b];
          if ((ca.v - level) * (cb.v - level) <= 0 && ca.v !== cb.v) {
            const t = (level - ca.v) / (cb.v - ca.v);
            if (t >= 0 && t <= 1)
              points.push({
                x: ca.x + t * (cb.x - ca.x),
                y: ca.y + t * (cb.y - ca.y),
              });
          }
        }
        if (points.length >= 2)
          segments.push({
            x1: points[0].x,
            y1: points[0].y,
            x2: points[1].x,
            y2: points[1].y,
          });
      }
  }
  return segments;
}

/* Legacy GLB scene intentionally retired in the 2D studio conversion.
function ChargeScene({
  input,
  phase,
  running,
  reducedMotion,
  resetViewSignal,
  selectedPart,
  onSelect,
}: {
  input: ElectrostaticInput;
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
      phase,
      running,
      reducedMotion,
      selectedPart,
      onSelect,
    });
  propsRef.current = {
    input,
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
      camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
    camera.position.set(5, 4, 6);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, devicePixelRatio));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 3.5;
    controls.maxDistance = 12;
    controls.target.set(0, 0, -0.4);
    runtimeRef.current = { camera, controls };
    scene.add(new THREE.HemisphereLight(0xe8f4ff, 0x172132, 2.3));
    const key = new THREE.DirectionalLight(0xffffff, 3);
    key.position.set(4, 6, 4);
    scene.add(key);
    const group = new THREE.Group();
    scene.add(group);
    const named = new Map<string, THREE.Object3D>(),
      originals = new Map<string, THREE.Vector3>();
    new GLTFLoader().load(
      `${ROOT}/electrostatic-field-potential.glb`,
      (gltf) => {
        const box = new THREE.Box3().setFromObject(gltf.scene),
          size = box.getSize(new THREE.Vector3()),
          center = box.getCenter(new THREE.Vector3());
        gltf.scene.position.sub(center);
        gltf.scene.scale.setScalar(4.7 / Math.max(size.x, size.y, size.z));
        gltf.scene.traverse((object) => {
          if (object.name) {
            named.set(object.name, object);
            originals.set(object.name, object.position.clone());
          }
        });
        group.add(gltf.scene);
      },
    );
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
            opacity: 0.1,
          }),
        );
        sprite.name = "electro_effect";
        sprite.scale.set(4.4, 2.2, 1);
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
      const w = host.clientWidth,
        h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    const animate = () => {
      const props = propsRef.current;
      for (const name of ["positive_charge", "negative_charge"]) {
        const object = named.get(name),
          original = originals.get(name);
        if (object && original) {
          const sign = name === "positive_charge" ? -1 : 1;
          object.position.x =
            original.x + sign * (props.input.separation - 2) * 0.2;
          object.position.y =
            original.y +
            (props.running && !props.reducedMotion
              ? 0.04 * Math.sin(props.phase * 6.28)
              : 0);
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              const mats = Array.isArray(child.material)
                ? child.material
                : [child.material];
              mats.forEach((material) => {
                if ("emissive" in material) {
                  const standard = material as THREE.MeshStandardMaterial;
                  standard.emissive.set(
                    name === props.selectedPart ? 0x54eaff : 0,
                  );
                  standard.emissiveIntensity =
                    name === props.selectedPart ? 0.7 : 0;
                }
              });
            }
          });
        }
      }
      const effect = scene.getObjectByName("electro_effect") as
        | THREE.Sprite
        | undefined;
      if (effect)
        (effect.material as THREE.SpriteMaterial).opacity = props.running
          ? 0.18
          : 0.08;
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
    const r = runtimeRef.current;
    if (!r) return;
    r.camera.position.set(5, 4, 6);
    r.controls.target.set(0, 0, -0.4);
    r.controls.update();
  }, [resetViewSignal]);
  return (
    <div
      ref={hostRef}
      className="electro-canvas"
      role="img"
      aria-label={`Orbitable supplied dipole model. Selected ${selectedPart.replace(/_/g, " ")}. Drag to orbit; wheel or pinch to zoom.`}
    />
  );
}
*/
