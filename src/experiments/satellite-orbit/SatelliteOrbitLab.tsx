import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import {
  buildSpeedCurves,
  deriveOrbit,
  EARTH_RADIUS,
  initialOrbitState,
  type OrbitDerived,
  type OrbitVectorState,
  type SatelliteOrbitInput,
  stepOrbit,
} from "./satelliteOrbitPhysics";
import "./satellite-orbit.css";

const ASSET_ROOT = "/assets/experiments/satellite-orbit";
const DEFAULT_INPUT: SatelliteOrbitInput = {
  planetMassEarths: 1,
  altitudeKm: 700,
  launchSpeedKmS: 7.49,
  directionDeg: 0,
  satelliteMassKg: 500,
};

type RunState = "idle" | "running" | "paused" | "result";

interface SatelliteSceneRuntime {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  satelliteNodes: THREE.Object3D[];
  interactionNodes: THREE.Object3D[];
  basePositions: THREE.Vector3[];
  velocityArrow: THREE.ArrowHelper;
  gravityArrow: THREE.ArrowHelper;
  trailLine: THREE.Line;
  overlays: THREE.Sprite[];
  selected?: THREE.Object3D;
  reset: () => void;
}

export function SatelliteOrbitLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [vectorState, setVectorState] = useState(() => initialOrbitState(DEFAULT_INPUT));
  const [trail, setTrail] = useState<OrbitVectorState[]>(() => [initialOrbitState(DEFAULT_INPUT)]);
  const [runState, setRunState] = useState<RunState>("idle");
  const [playback, setPlayback] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  const [resetViewSignal, setResetViewSignal] = useState(0);
  const [mission, setMission] = useState({ circular: false, escape: false });
  const lastFrameRef = useRef<number | null>(null);
  const inputRef = useRef(input);
  const stateRef = useRef(vectorState);
  const runRef = useRef(runState);
  const playbackRef = useRef(playback);
  const derived = useMemo(() => deriveOrbit(input, vectorState), [input, vectorState]);
  const launchDerived = useMemo(() => deriveOrbit(input, initialOrbitState(input)), [input]);

  useEffect(() => { inputRef.current = input; }, [input]);
  useEffect(() => { stateRef.current = vectorState; }, [vectorState]);
  useEffect(() => { runRef.current = runState; }, [runState]);
  useEffect(() => { playbackRef.current = playback; }, [playback]);

  useEffect(() => {
    let animationFrame = 0;
    const frame = (time: number) => {
      const previous = lastFrameRef.current ?? time;
      lastFrameRef.current = time;
      if (runRef.current === "running") {
        const simulatedSeconds = Math.min(45, ((time - previous) / 1000) * 900 * playbackRef.current);
        const substeps = Math.max(1, Math.ceil(simulatedSeconds / 3));
        let next = stateRef.current;
        for (let i = 0; i < substeps; i += 1) next = stepOrbit(next, inputRef.current, simulatedSeconds / substeps);
        stateRef.current = next;
        setVectorState(next);
        if (!reducedMotion || Math.floor(next.elapsed) % 120 < 5) {
          setTrail((points) => [...points.slice(-419), next]);
        }
        const live = deriveOrbit(inputRef.current, next);
        const radius = Math.hypot(next.x, next.y);
        if (radius <= EARTH_RADIUS || (live.specificEnergy >= 0 && radius > (EARTH_RADIUS + inputRef.current.altitudeKm * 1000) * 3.2)) {
          setRunState("result");
          runRef.current = "result";
        }
      }
      animationFrame = requestAnimationFrame(frame);
    };
    animationFrame = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animationFrame);
  }, [reducedMotion]);

  useEffect(() => {
    if (runState === "idle") return;
    if (launchDerived.regime === "circular") setMission((value) => ({ ...value, circular: true }));
    const atChallengeAltitude = Math.abs(input.altitudeKm - 400) <= 5;
    const atEscapeThreshold = Math.abs(input.launchSpeedKmS * 1000 - launchDerived.escapeSpeed) / launchDerived.escapeSpeed <= 0.012;
    if (mission.circular && atChallengeAltitude && atEscapeThreshold && Math.abs(input.directionDeg) <= 1) {
      setMission({ circular: true, escape: true });
    }
  }, [input, launchDerived, mission.circular, runState]);

  const resetTrajectory = (nextInput = input, nextState: RunState = "idle") => {
    const initial = initialOrbitState(nextInput);
    inputRef.current = nextInput;
    stateRef.current = initial;
    runRef.current = nextState;
    setInput(nextInput);
    setVectorState(initial);
    setTrail([initial]);
    setRunState(nextState);
    lastFrameRef.current = null;
  };

  const updateInput = <K extends keyof SatelliteOrbitInput>(key: K, value: SatelliteOrbitInput[K]) => {
    resetTrajectory({ ...input, [key]: value });
  };

  const applyPreset = (kind: "leo" | "geo" | "escape") => {
    if (kind === "leo") {
      const next = { ...input, planetMassEarths: 1, altitudeKm: 400, launchSpeedKmS: 7.67, directionDeg: 0 };
      resetTrajectory(next);
    } else if (kind === "geo") {
      const next = { ...input, planetMassEarths: 1, altitudeKm: 35_786, launchSpeedKmS: 3.07, directionDeg: 0 };
      resetTrajectory(next);
    } else {
      const base = { ...input, planetMassEarths: 1, altitudeKm: 400, directionDeg: 0 };
      const threshold = deriveOrbit(base, initialOrbitState(base)).escapeSpeed / 1000;
      resetTrajectory({ ...base, launchSpeedKmS: Number(threshold.toFixed(3)) });
    }
  };

  const stepOnce = () => {
    let next = vectorState;
    for (let i = 0; i < 10; i += 1) next = stepOrbit(next, input, 3);
    setVectorState(next);
    stateRef.current = next;
    setTrail((points) => [...points, next]);
    setRunState("paused");
    runRef.current = "paused";
  };

  const status = statusCopy(launchDerived.regime);

  return (
    <section className="satellite-lab" aria-label={`${experiment.title} interactive laboratory`} data-run-state={runState} data-regime={launchDerived.regime}>
      <header className="satellite-lab-head">
        <div>
          <span>ASTRONOMY · CLASS 11</span>
          <h2>Satellite Orbit &amp; Escape Speed</h2>
          <p>Change launch conditions, then watch gravity bend the path.</p>
        </div>
        <div className={`satellite-status satellite-status-${launchDerived.regime}`} role="status" aria-live="polite">
          <i /> {status}
        </div>
      </header>

      <div className="satellite-primary-grid">
        <div className="satellite-stage-card">
          <div className="satellite-legend" aria-label="Trajectory legend">
            <span><i className="legend-suborbital" />Collision path</span>
            <span><i className="legend-orbit" />Bound orbit</span>
            <span><i className="legend-escape" />Escape path</span>
          </div>
          <SatelliteScene
            input={input}
            state={vectorState}
            derived={derived}
            trail={trail}
            running={runState === "running"}
            reducedMotion={reducedMotion}
            resetViewSignal={resetViewSignal}
          />
          <div className="satellite-stage-help">Drag to rotate · Wheel or pinch to zoom · Arrow keys rotate</div>
        </div>

        <aside className="satellite-controls" aria-label="Satellite launch controls">
          <div className="satellite-panel-title"><h3>Controls</h3><button type="button" onClick={() => setResetViewSignal((value) => value + 1)}>Reset view</button></div>
          <OrbitSlider label="Launch speed" symbol="v₀" value={input.launchSpeedKmS} min={0} max={30} step={0.01} unit="km/s" accent="orange" onChange={(value) => updateInput("launchSpeedKmS", value)} />
          <OrbitSlider label="Altitude" symbol="h" value={input.altitudeKm} min={200} max={36000} step={10} unit="km" accent="blue" onChange={(value) => updateInput("altitudeKm", value)} />
          <OrbitSlider label="Planet mass" symbol="M" value={input.planetMassEarths} min={0.2} max={3} step={0.05} unit="M⊕" accent="green" onChange={(value) => updateInput("planetMassEarths", value)} />
          <OrbitSlider label="Satellite mass" symbol="m" value={input.satelliteMassKg} min={100} max={10000} step={100} unit="kg" accent="green" onChange={(value) => updateInput("satelliteMassKg", value)} />
          <OrbitSlider label="Launch direction" symbol="θ" value={input.directionDeg} min={-90} max={90} step={1} unit="°" accent="purple" onChange={(value) => updateInput("directionDeg", value)} />

          <div className="satellite-presets" aria-label="Orbit presets">
            <button type="button" onClick={() => applyPreset("leo")}><strong>Low Earth Orbit</strong><small>400 km · 7.67 km/s</small></button>
            <button type="button" onClick={() => applyPreset("geo")}><strong>Geostationary</strong><small>35,786 km · 3.07 km/s</small></button>
            <button type="button" onClick={() => applyPreset("escape")}><strong>Escape</strong><small>400 km · {speed(deriveOrbit({ ...input, planetMassEarths: 1, altitudeKm: 400 }, initialOrbitState({ ...input, planetMassEarths: 1, altitudeKm: 400 })).escapeSpeed)}</small></button>
          </div>

          <div className="satellite-playback" aria-label="Simulation controls">
            <button className="satellite-primary-button" type="button" onClick={() => { setRunState("running"); runRef.current = "running"; }}>▶ {runState === "paused" ? "Resume" : runState === "result" ? "Replay" : "Play"}</button>
            <button type="button" onClick={() => { setRunState("paused"); runRef.current = "paused"; }} disabled={runState !== "running"}>Ⅱ Pause</button>
            <button type="button" onClick={stepOnce}>▮▶ Step</button>
            <button type="button" onClick={() => resetTrajectory(DEFAULT_INPUT)}>↻ Reset</button>
          </div>
          <label className="satellite-select-label">Playback speed
            <select value={playback} onChange={(event) => setPlayback(Number(event.target.value))}>
              {[0.25, 0.5, 1, 1.5, 2].map((value) => <option key={value} value={value}>{value}×</option>)}
            </select>
          </label>
          <label className="satellite-motion-toggle"><input type="checkbox" checked={reducedMotion} onChange={(event) => setReducedMotion(event.target.checked)} /> Reduced motion</label>
        </aside>
      </div>

      <div className="satellite-data-grid">
        <Measurements derived={derived} input={input} />
        <SpeedGraph input={input} derived={launchDerived} />
        <section className="satellite-formula-card">
          <h3>Physics explained</h3>
          <div className="satellite-equations"><span>v<sub>orbit</sub> = √(GM/r)</span><span>v<sub>escape</sub> = √(2GM/r)</span></div>
          <dl><dt>G</dt><dd>6.67430 × 10⁻¹¹ N·m²/kg²</dd><dt>M</dt><dd>{input.planetMassEarths.toFixed(2)} Earth masses</dd><dt>r</dt><dd>{(EARTH_RADIUS / 1000 + input.altitudeKm).toLocaleString()} km from centre</dd></dl>
          <p>At one radius, escape speed is √2 times circular speed. Satellite mass cancels from both.</p>
        </section>
      </div>

      <div className="satellite-learning-grid">
        <article><span>◎</span><div><h3>Learning cue</h3><p>Predict collision, orbit, or escape before pressing Play.</p></div></article>
        <article><span>◌</span><div><h3>Observation prompt</h3><p>How do the path and total energy change as launch speed rises?</p></div></article>
        <article className={mission.escape ? "mission-complete" : ""}><span>♜</span><div><h3>Challenge</h3><p>{mission.escape ? "Mission complete: circular orbit and minimum escape found." : mission.circular ? "Circular orbit found. Now use Escape at 400 km and press Play." : "First place the satellite in circular orbit; then find minimum escape speed at 400 km."}</p></div></article>
      </div>
      <p className="satellite-sr-summary" aria-live="polite">{status}. Radius {(derived.radius / 1000).toFixed(0)} kilometres, speed {(derived.speed / 1000).toFixed(2)} kilometres per second, total energy {scientific(derived.totalEnergy)} joules, eccentricity {derived.eccentricity.toFixed(3)}.</p>
    </section>
  );
}

function OrbitSlider({ label, symbol, value, min, max, step, unit, accent, onChange }: { label: string; symbol: string; value: number; min: number; max: number; step: number; unit: string; accent: string; onChange: (value: number) => void }) {
  return <label className={`satellite-control satellite-control-${accent}`}>
    <span><strong>{label} <em>{symbol}</em></strong><span className="satellite-number-wrap"><input aria-label={`${label} value`} type="number" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Math.max(min, Math.min(max, Number(event.target.value))))} /><small>{unit}</small></span></span>
    <input aria-label={label} type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} />
    <small><span>{min.toLocaleString()} {unit}</span><span>{max.toLocaleString()} {unit}</span></small>
  </label>;
}

function Measurements({ derived, input }: { derived: OrbitDerived; input: SatelliteOrbitInput }) {
  const items = [
    ["Orbital radius", `${(derived.radius / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })} km`],
    ["Speed", `${(derived.speed / 1000).toFixed(2)} km/s`],
    ["Orbital period", `${(derived.period / 60).toFixed(1)} min`],
    ["Gravity", `${derived.acceleration.toFixed(2)} m/s²`],
    ["Kinetic energy", `${scientific(derived.kineticEnergy)} J`],
    ["Potential energy", `${scientific(derived.potentialEnergy)} J`],
    ["Total energy", `${scientific(derived.totalEnergy)} J`],
    ["Specific energy", `${scientific(derived.specificEnergy)} J/kg`],
    ["Angular momentum", `${scientific(derived.angularMomentum * input.satelliteMassKg)} kg·m²/s`],
    ["Eccentricity", `${derived.eccentricity.toFixed(3)} (${derived.regime})`],
  ];
  return <section className="satellite-measurements"><h3>Live measurements</h3><div>{items.map(([label, value]) => <dl key={label}><dt>{label}</dt><dd>{value}</dd></dl>)}</div><div className="energy-meter"><span>Negative · bound</span><i style={{ left: `${Math.max(2, Math.min(98, 50 + (derived.specificEnergy / Math.max(1, derived.escapeSpeed ** 2)) * 100))}%` }} /><span>Positive · unbound</span></div></section>;
}

function SpeedGraph({ input, derived }: { input: SatelliteOrbitInput; derived: OrbitDerived }) {
  const points = useMemo(() => buildSpeedCurves(input.planetMassEarths), [input.planetMassEarths]);
  const width = 460, height = 205, left = 42, right = 12, top = 20, bottom = 35;
  const x = (altitude: number) => left + (Math.log10(altitude) - Math.log10(200)) / (Math.log10(36000) - Math.log10(200)) * (width - left - right);
  const maxSpeed = Math.max(16, points[0].escapeKmS * 1.08);
  const y = (value: number) => top + (1 - value / maxSpeed) * (height - top - bottom);
  const line = (key: "circularKmS" | "escapeKmS") => points.map((point, index) => `${index ? "L" : "M"}${x(point.altitudeKm).toFixed(1)},${y(point[key]).toFixed(1)}`).join(" ");
  return <section className="satellite-graph"><h3>Orbital &amp; escape speed vs. altitude</h3><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Orbital and escape speed decrease as altitude increases">
    {[0, 5, 10, 15, 20].filter((tick) => tick <= maxSpeed).map((tick) => <g key={tick}><line x1={left} x2={width-right} y1={y(tick)} y2={y(tick)} /><text x={left-7} y={y(tick)+4} textAnchor="end">{tick}</text></g>)}
    <path className="graph-orbit-line" d={line("circularKmS")} /><path className="graph-escape-line" d={line("escapeKmS")} />
    <line className="graph-current-line" x1={x(input.altitudeKm)} x2={x(input.altitudeKm)} y1={top} y2={height-bottom} />
    <circle className="graph-orbit-dot" cx={x(input.altitudeKm)} cy={y(derived.circularSpeed/1000)} r="5" /><circle className="graph-escape-dot" cx={x(input.altitudeKm)} cy={y(derived.escapeSpeed/1000)} r="5" />
    <text x={left} y={height-8}>200 km</text><text x={width-right} y={height-8} textAnchor="end">36,000 km</text>
  </svg><div><span><i className="graph-key-orbit" />Orbital speed</span><span><i className="graph-key-escape" />Escape speed</span></div></section>;
}

function SatelliteScene({ input, state, derived, trail, running, reducedMotion, resetViewSignal }: { input: SatelliteOrbitInput; state: OrbitVectorState; derived: OrbitDerived; trail: OrbitVectorState[]; running: boolean; reducedMotion: boolean; resetViewSignal: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<SatelliteSceneRuntime | null>(null);
  const liveRef = useRef({ input, state, derived, trail, running, reducedMotion });
  useEffect(() => { liveRef.current = { input, state, derived, trail, running, reducedMotion }; }, [input, state, derived, trail, running, reducedMotion]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 100);
    camera.position.set(0, 3.2, 6.3);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    host.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 3.4;
    controls.maxDistance = 10;
    controls.target.set(0, 0, 0);
    const reset = () => { const compactDistance = host.clientWidth / Math.max(1, host.clientHeight) < 1.1 ? 12.5 : 6.3; camera.position.set(0, compactDistance * 0.42, compactDistance); controls.target.set(0, 0, 0); controls.update(); };
    scene.add(new THREE.HemisphereLight(0xbfe9ff, 0x07111f, 2.2));
    const key = new THREE.DirectionalLight(0xffffff, 3.4); key.position.set(4, 5, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0x38bdf8, 2.2); rim.position.set(-4, 1, -3); scene.add(rim);
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(420 * 3);
    for (let i = 0; i < starPositions.length; i += 3) { const radius = 9 + (i % 17) * 0.18; const a = i * 1.71; const b = i * 0.37; starPositions[i] = Math.sin(a) * radius; starPositions[i+1] = Math.sin(b) * radius * 0.6; starPositions[i+2] = Math.cos(a) * radius; }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xdff7ff, size: 0.025 })));
    const velocityArrow = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(), 1, 0xfb923c, 0.18, 0.1);
    const gravityArrow = new THREE.ArrowHelper(new THREE.Vector3(-1,0,0), new THREE.Vector3(), 1, 0xfacc15, 0.18, 0.1);
    scene.add(velocityArrow, gravityArrow);
    const trailLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.88 }));
    scene.add(trailLine);
    const runtime: SatelliteSceneRuntime = { renderer, scene, camera, controls, satelliteNodes: [], interactionNodes: [], basePositions: [], velocityArrow, gravityArrow, trailLine, overlays: [], reset };
    runtimeRef.current = runtime;
    const loader = new GLTFLoader();
    loader.load(`${ASSET_ROOT}/satellite-orbit.glb`, (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      model.scale.setScalar(3.35 / Math.max(size.x, size.y, size.z));
      const centre = box.getCenter(new THREE.Vector3()).multiplyScalar(model.scale.x);
      model.position.sub(centre);
      scene.add(model);
      const names = ["satellite_body", "solar_panel_left", "solar_panel_right"];
      runtime.satelliteNodes = names.map((name) => model.getObjectByName(name)).filter((node): node is THREE.Object3D => Boolean(node));
      runtime.interactionNodes = ["earth", ...names].map((name) => model.getObjectByName(name)).filter((node): node is THREE.Object3D => Boolean(node));
      runtime.basePositions = runtime.satelliteNodes.map((node) => node.position.clone());
      ["velocity_vector_shaft", "velocity_vector_head", "gravity_vector_shaft", "gravity_vector_head", "orbit_path"].forEach((name) => { const node = model.getObjectByName(name); if (node) node.visible = false; });
      model.traverse((object) => { if ((object as THREE.Mesh).isMesh) { const mesh = object as THREE.Mesh; mesh.castShadow = true; mesh.receiveShadow = true; } });
      reset();
    });
    ["concept_effect.png", "interaction_overlay.png"].forEach((filename, index) => {
      new THREE.TextureLoader().load(`${ASSET_ROOT}/effects/${filename}`, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: index ? 0.055 : 0.1, blending: THREE.AdditiveBlending, depthWrite: false });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(index ? 3.25 : 4.1, index ? 3.25 : 4.1, 1);
        sprite.position.z = index ? 0.04 : -0.2;
        scene.add(sprite);
        runtime.overlays.push(sprite);
      });
    });
    let fitted = false;
    const resize = () => { const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight); renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); if (!fitted) { fitted = true; reset(); } };
    const observer = new ResizeObserver(resize); observer.observe(host); resize();
    const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2();
    let dragPart: { node: THREE.Object3D; startX: number; rotationY: number } | null = null;
    const onPointerDown = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect(); pointer.set(((event.clientX-rect.left)/rect.width)*2-1, -((event.clientY-rect.top)/rect.height)*2+1); raycaster.setFromCamera(pointer,camera);
      const hit = raycaster.intersectObjects(runtime.interactionNodes,true)[0];
      const target = hit ? runtime.interactionNodes.find((candidate) => { let node: THREE.Object3D | null = hit.object; while (node) { if (node === candidate) return true; node = node.parent; } return false; }) : undefined;
      runtime.selected = target;
      if (target) { host.dataset.selected = target.name; dragPart = { node: target, startX: event.clientX, rotationY: target.rotation.y }; controls.enabled = false; renderer.domElement.setPointerCapture(event.pointerId); }
    };
    const onPointerMove = (event: PointerEvent) => { if (dragPart) dragPart.node.rotation.y = dragPart.rotationY + (event.clientX - dragPart.startX) * 0.012; };
    const onPointerUp = (event: PointerEvent) => { if (!dragPart) return; dragPart = null; controls.enabled = true; if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId); };
    renderer.domElement.addEventListener("pointerdown", onPointerDown, true);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    let animation = 0;
    const draw = () => {
      const live = liveRef.current;
      const rScale = 1.48 / Math.max(1, (EARTH_RADIUS + live.input.altitudeKm * 1000) / EARTH_RADIUS);
      const sx = (live.state.x / EARTH_RADIUS) * rScale, sz = (live.state.y / EARTH_RADIUS) * rScale;
      runtime.satelliteNodes.forEach((node, index) => { const base = runtime.basePositions[index]; if (base) { node.position.x = base.x + sx - 1.48; node.position.z = base.z + sz; if (node.name.includes("solar_panel") && live.running && !live.reducedMotion) node.rotation.y += 0.003; } });
      const origin = new THREE.Vector3(sx, 0.35, sz);
      const vdir = new THREE.Vector3(live.state.vx, 0, live.state.vy).normalize();
      const gdir = new THREE.Vector3(-live.state.x, 0, -live.state.y).normalize();
      runtime.velocityArrow.position.copy(origin); runtime.velocityArrow.setDirection(vdir); runtime.velocityArrow.setLength(Math.min(1.35, 0.45 + live.derived.speed / Math.max(1, live.derived.escapeSpeed)));
      runtime.gravityArrow.position.copy(origin); runtime.gravityArrow.setDirection(gdir); runtime.gravityArrow.setLength(Math.min(1.2, 0.35 + live.derived.acceleration / 12));
      const trailPoints = live.trail.map((point) => new THREE.Vector3((point.x/EARTH_RADIUS)*rScale, 0.02, (point.y/EARTH_RADIUS)*rScale));
      runtime.trailLine.geometry.dispose(); runtime.trailLine.geometry = new THREE.BufferGeometry().setFromPoints(trailPoints);
      runtime.overlays.forEach((overlay, index) => {
        (overlay.material as THREE.SpriteMaterial).opacity = live.running ? (index ? 0.11 : 0.16) : (index ? 0.035 : 0.07);
        if (live.running && !live.reducedMotion) overlay.material.rotation += index ? -0.0015 : 0.002;
      });
      controls.update(); renderer.render(scene,camera); animation = requestAnimationFrame(draw);
    };
    animation = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animation); observer.disconnect(); renderer.domElement.removeEventListener("pointerdown", onPointerDown, true); renderer.domElement.removeEventListener("pointermove", onPointerMove); renderer.domElement.removeEventListener("pointerup", onPointerUp); controls.dispose(); renderer.dispose(); host.removeChild(renderer.domElement); runtimeRef.current = null; };
  }, []);

  useEffect(() => { runtimeRef.current?.reset(); }, [resetViewSignal]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const runtime = runtimeRef.current; if (!runtime) return;
    if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","+","-","0"].includes(event.key)) event.preventDefault();
    if (event.key === "0") return runtime.reset();
    if (event.key === "+" || event.key === "=") runtime.camera.position.multiplyScalar(0.9);
    else if (event.key === "-") runtime.camera.position.multiplyScalar(1.1);
    else { const axis = event.key === "ArrowUp" || event.key === "ArrowDown" ? new THREE.Vector3(1,0,0) : new THREE.Vector3(0,1,0); const angle = (event.key === "ArrowLeft" || event.key === "ArrowUp") ? 0.12 : -0.12; runtime.camera.position.applyAxisAngle(axis, angle); runtime.camera.lookAt(runtime.controls.target); }
  };
  return <div ref={hostRef} className="satellite-three-scene" role="application" tabIndex={0} onKeyDown={onKeyDown} aria-label="Interactive three-dimensional Earth and satellite. Drag to rotate, wheel or pinch to zoom, arrow keys to rotate, plus and minus to zoom, zero to reset view." />;
}

function statusCopy(regime: OrbitDerived["regime"]) {
  if (regime === "circular") return "Stable circular orbit";
  if (regime === "elliptical") return "Stable elliptical orbit";
  if (regime === "escape") return "Unbound escape trajectory";
  return "Collision trajectory";
}

function scientific(value: number) { return value.toExponential(2).replace("e+", " × 10^").replace("e-", " × 10^−"); }
function speed(value: number) { return `${(value / 1000).toFixed(2)} km/s`; }
