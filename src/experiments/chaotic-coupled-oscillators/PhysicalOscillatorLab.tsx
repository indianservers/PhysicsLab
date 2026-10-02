import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { defaultCoupledParams, oscillatorEnergy, rk4Step, type CoupledOscillatorParams, type OscillatorState } from "./chaotic-coupled-oscillatorsSimulation";
import "./physical-oscillator.css";

export type EnergyCase = "undamped" | "damped" | "driven";
export const energyCases = {
  undamped: { label: "Ideal · no damping", description: "No friction and no motor. Total mechanical energy stays constant while the pendulums exchange energy.", damping: 0, drive: 0 },
  damped: { label: "Damped · free motion", description: "Friction removes mechanical energy. The swing envelope decays toward rest; the oscillation frequency need not slow much.", damping: .06, drive: 0 },
  driven: { label: "Driven · motor on", description: "A periodic torque drives pendulum 1 while friction removes energy. Motion can persist because the motor supplies energy.", damping: .06, drive: .15 },
} as const;
export const caseParams = (mode: EnergyCase): CoupledOscillatorParams => ({ ...defaultCoupledParams, dampingNmsPerRad: energyCases[mode].damping, driveAmplitudeNm: energyCases[mode].drive });
const initialState = (params: CoupledOscillatorParams): OscillatorState => ({ theta1: params.angle1Deg * Math.PI / 180, theta2: params.angle2Deg * Math.PI / 180, omega1: 0, omega2: 0 });
const STEP = 1 / 240;

export function PhysicalOscillatorLab() {
  const [mode, setMode] = useState<EnergyCase>("damped");
  const [params, setParams] = useState(() => caseParams("damped"));
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [snapshot, setSnapshot] = useState(() => ({ state: initialState(params), time: 0 }));
  const [history, setHistory] = useState<{ time: number; energy: number }[]>([]);
  const simulation = useRef(snapshot);
  const [resetView, setResetView] = useState(0);
  const reset = (next = params) => {
    const start = { state: initialState(next), time: 0 };
    simulation.current = start; setSnapshot(start); setHistory([]); setParams(next);
  };
  const chooseCase = (next: EnergyCase) => { setMode(next); reset(caseParams(next)); setRunning(true); };
  const update = (key: keyof CoupledOscillatorParams, value: number) => reset({ ...params, [key]: value });
  useEffect(() => {
    if (!running) return;
    let frame = 0, previous = performance.now(), accumulator = 0, lastSample = simulation.current.time;
    const tick = (now: number) => {
      const delta = Math.min(.05, (now - previous) / 1000); previous = now;
      if (!document.hidden) {
        accumulator += delta * speed;
        while (accumulator >= STEP) {
          const current = simulation.current;
          simulation.current = { state: rk4Step(current.state, params, current.time, STEP), time: current.time + STEP };
          accumulator -= STEP;
        }
        setSnapshot({ ...simulation.current });
        if (simulation.current.time - lastSample >= .1) {
          lastSample = simulation.current.time;
          setHistory(old => [...old.slice(-399), { time: lastSample, energy: oscillatorEnergy(simulation.current.state, params).totalEnergy }]);
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, params, speed]);
  const energy = oscillatorEnergy(snapshot.state, params).totalEnergy;
  const initialEnergy = oscillatorEnergy(initialState(params), params).totalEnergy;
  const torque = params.driveAmplitudeNm * Math.sin(params.driveFrequencyRadS * snapshot.time);
  const lossPower = params.dampingNmsPerRad * (snapshot.state.omega1 ** 2 + snapshot.state.omega2 ** 2);
  const maxEnergy = Math.max(initialEnergy, ...history.map(point => point.energy), .001);
  const startTime = history[0]?.time ?? 0;
  const timeSpan = Math.max(10, snapshot.time - startTime);
  const path = history.map((point, index) => `${index ? "L" : "M"}${35 + (point.time - startTime) / timeSpan * 515},${145 - point.energy / maxEnergy * 120}`).join(" ");
  return <section className="physical-oscillator" aria-label="Physical coupled oscillator laboratory">
    <h2>Coupled pendulums · energy and damping</h2>
    <fieldset className="oscillator-cases"><legend>Choose the physical case</legend>{(Object.keys(energyCases) as EnergyCase[]).map(key => <label key={key} className={mode === key ? "selected" : ""}><input type="radio" name="oscillator-case" value={key} checked={mode === key} onChange={() => chooseCase(key)} />{energyCases[key].label}</label>)}</fieldset>
    <p>{energyCases[mode].description}</p>
    <div className="physical-oscillator-layout">
      <div><div className="oscillator-transport">
        <button onClick={() => setRunning(value => !value)}>{running ? "Pause" : "Play"}</button>
        <button onClick={() => { setRunning(false); let current = simulation.current; for (let index = 0; index < 24; index++) current = { state: rk4Step(current.state, params, current.time, STEP), time: current.time + STEP }; simulation.current = current; setSnapshot(current); setHistory(old => [...old.slice(-399), { time: current.time, energy: oscillatorEnergy(current.state, params).totalEnergy }]); }}>Step 0.1 s</button>
        <button onClick={() => { reset(caseParams(mode)); setResetView(value => value + 1); }}>Reset case</button>
        <label>Playback <select aria-label="Playback speed" value={speed} onChange={event => setSpeed(Number(event.target.value))}><option value="0.25">0.25×</option><option value="1">1×</option><option value="2">2×</option></select></label>
        <output data-testid="oscillator-time">{snapshot.time.toFixed(2)} s</output>
      </div>
      <OscillatorApparatus state={snapshot.state} params={params} torque={torque} resetView={resetView} />
      <p className="oscillator-note">Drag the background to rotate; wheel to zoom. Two separate pendulums are coupled through their horizontal displacements. Rods are rigid and massless; damping is viscous. The clock never automatically restarts.</p>
      <svg className="oscillator-energy-plot" viewBox="0 0 580 180" role="img" aria-label="Mechanical energy versus elapsed simulation time"><path d="M35 20V145H550" stroke="#7b96a9" fill="none" /><path d={path} stroke="#51e4c1" strokeWidth="2" fill="none" /><text x="38" y="15">Energy (J) · top {maxEnergy.toFixed(3)}</text><text x="35" y="168">{startTime.toFixed(1)} s</text><text x="480" y="168">{(startTime + timeSpan).toFixed(1)} s</text></svg>
      </div>
      <aside aria-label="Oscillator settings and measurements">
        {([
          ["angle1Deg", "Initial angle 1 (°)", -60, 60, 1], ["angle2Deg", "Initial angle 2 (°)", -60, 60, 1],
          ["couplingNPerM", "Coupling stiffness (N/m)", 0, 2, .05],
          ...(mode !== "undamped" ? [["dampingNmsPerRad", "Damping (N m s/rad)", .01, .3, .01]] : []),
          ...(mode === "driven" ? [["driveAmplitudeNm", "Drive torque amplitude (N m)", .01, .5, .01], ["driveFrequencyRadS", "Drive frequency (rad/s)", .5, 6, .1]] : []),
        ] as [keyof CoupledOscillatorParams, string, number, number, number][]).map(([key, label, min, max, step]) => <label className="oscillator-setting" key={key}>{label}<output>{params[key]}</output><input type="range" aria-label={label} min={min} max={max} step={step} value={params[key]} onChange={event => update(key, Number(event.target.value))} /></label>)}
        <p className="oscillator-note">Changing a setting starts a new trial from the selected initial angles. Masses: 0.25 kg each; lengths: 1 m each.</p>
        <dl><dt>Mechanical energy</dt><dd data-testid="oscillator-energy">{energy.toFixed(6)} J</dd><dt>Energy relative to release</dt><dd>{initialEnergy > 1e-12 ? `${(energy / initialEnergy * 100).toFixed(1)}%` : "Released from rest at equilibrium"}</dd><dt>Frictional loss rate</dt><dd>{lossPower.toFixed(5)} W</dd><dt>Motor power (signed)</dt><dd>{(torque * snapshot.state.omega1).toFixed(5)} W</dd><dt>Angles θ₁ / θ₂</dt><dd>{(snapshot.state.theta1 * 180 / Math.PI).toFixed(2)}° / {(snapshot.state.theta2 * 180 / Math.PI).toFixed(2)}°</dd></dl>
        <p className="oscillator-note">dE/dt = motor torque × ω₁ − b(ω₁² + ω₂²). Coupling transfers energy; it does not generate it. Irregular motion alone does not establish chaos.</p>
      </aside>
    </div>
  </section>;
}

function OscillatorApparatus({ state, params, torque, resetView }: { state: OscillatorState; params: CoupledOscillatorParams; torque: number; resetView: number }) {
  const mount = useRef<HTMLDivElement>(null);
  const live = useRef({ state, params, torque }); live.current = { state, params, torque };
  const resetCamera = useRef(() => {});
  const [failed, setFailed] = useState(false);
  useEffect(() => resetCamera.current(), [resetView]);
  useEffect(() => {
    if (!mount.current) return;
    const host = mount.current;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true }); } catch { setFailed(true); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setClearColor(0x0b1924); host.appendChild(renderer.domElement);
    const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(40, 1, .1, 30);
    const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.enablePan = false; controls.minDistance = 3.5; controls.maxDistance = 10;
    resetCamera.current = () => { camera.position.set(2, 1.7, 6); controls.target.set(0, .25, 0); controls.update(); }; resetCamera.current();
    scene.add(new THREE.HemisphereLight(0xe1f4ff, 0x1b2736, 3)); const light = new THREE.DirectionalLight(0xffffff, 4); light.position.set(2, 5, 4); scene.add(light);
    const metal = new THREE.MeshStandardMaterial({ color: 0x7c8c9c, metalness: .8, roughness: .28 });
    const addBox = (width: number, height: number, depth: number, position: number[]) => { const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), metal); mesh.position.set(position[0], position[1], position[2]); scene.add(mesh); };
    addBox(3.8, .16, 1.3, [0, -1.05, 0]); addBox(3.6, .12, .2, [0, 1.45, 0]); for (const side of [-1, 1]) addBox(.1, 2.5, .15, [side * 1.7, .2, 0]);
    const pivots = [-.85, .85].map(position => new THREE.Vector3(position, 1.35, 0));
    const rods = pivots.map(() => { const rod = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, 1, 12), metal); scene.add(rod); return rod; });
    const bobs = [0x22bfd4, 0xf5b949].map(color => { const bob = new THREE.Mesh(new THREE.SphereGeometry(.16, 28, 20), new THREE.MeshStandardMaterial({ color, metalness: .7, roughness: .2 })); scene.add(bob); return bob; });
    const springPoints = new Float32Array(81 * 3); const springGeometry = new THREE.BufferGeometry(); springGeometry.setAttribute("position", new THREE.BufferAttribute(springPoints, 3)); scene.add(new THREE.Line(springGeometry, new THREE.LineBasicMaterial({ color: 0x71edbf })));
    const drive = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), pivots[0], .4, 0xff786b); scene.add(drive);
    const resize = () => { const width = host.clientWidth, height = host.clientHeight; renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); }; const observer = new ResizeObserver(resize); observer.observe(host); resize();
    let frame = 0; const vertical = new THREE.Vector3(0, 1, 0);
    const render = () => {
      frame = requestAnimationFrame(render); if (document.hidden) return;
      const current = live.current;
      [current.state.theta1, current.state.theta2].forEach((angle, index) => {
        const length = index ? current.params.length2M : current.params.length1M;
        bobs[index].position.copy(pivots[index]).add(new THREE.Vector3(Math.sin(angle) * length, -Math.cos(angle) * length, 0));
        const displacement = bobs[index].position.clone().sub(pivots[index]); rods[index].position.copy(pivots[index]).addScaledVector(displacement, .5); rods[index].scale.y = length; rods[index].quaternion.setFromUnitVectors(vertical, displacement.normalize());
      });
      for (let index = 0; index <= 80; index++) { const portion = index / 80; const point = bobs[0].position.clone().lerp(bobs[1].position, portion); point.y += Math.sin(portion * Math.PI * 24) * .035; point.z += Math.cos(portion * Math.PI * 24) * .035; springPoints.set([point.x, point.y, point.z], index * 3); }
      springGeometry.attributes.position.needsUpdate = true;
      drive.visible = current.params.driveAmplitudeNm > 0; drive.setDirection(new THREE.Vector3(Math.sign(current.torque) || 1, 0, 0)); drive.setLength(.12 + Math.abs(current.torque) * 2, .08, .06);
      controls.update(); renderer.render(scene, camera);
    }; render();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); controls.dispose(); const materials = new Set<THREE.Material>(); scene.traverse(node => { const mesh = node as THREE.Mesh; mesh.geometry?.dispose(); if (mesh.material) (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(material => materials.add(material)); }); materials.forEach(material => material.dispose()); renderer.dispose(); renderer.domElement.remove(); };
  }, []);
  return <div className="physical-oscillator-scene" ref={mount} aria-label="Two pendulums with rods and coupling spring, following the calculated angles">{failed && <p>3D is unavailable. The energy graph and numerical measurements remain active.</p>}</div>;
}
