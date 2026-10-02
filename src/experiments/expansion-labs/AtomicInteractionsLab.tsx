import { useEffect, useId, useRef, useState } from "react";
import * as THREE from "three";
import { atomicDefaults, atomicInteraction } from "./atomicInteractionPhysics";
import "./atomic-interactions.css";

const display = (value: number) => Math.abs(value) >= 10000 ? value.toExponential(2) : value.toFixed(2);
export function AtomicInteractionsLab() {
  const [values, setValues] = useState(atomicDefaults);
  const [clouds, setClouds] = useState(true);
  const result = atomicInteraction(values.separation, values.sigma, values.epsilon);
  const changeDistance = (value: number) => setValues(previous => ({ ...previous, separation: Math.max(2, Math.min(8, value)) }));
  const setPreset = (kind: "repulsive" | "balanced" | "attractive") => changeDistance(kind === "balanced" ? result.equilibrium : kind === "repulsive" ? values.sigma * .95 : values.sigma * 1.5);
  return <section className="atomic-lab" aria-label="Atomic interactions laboratory">
    <header className="atomic-title"><div><span>ATOMIC PHYSICS · POTENTIAL ENERGY</span><h2>Atomic Interactions</h2><p>At what separation do attraction and repulsion balance?</p></div><button onClick={() => { setValues(atomicDefaults); setClouds(true); }}>⟳ &nbsp; Reset</button></header>
    <div className="atomic-columns">
      <aside className="atomic-card atomic-controls"><h3><span>☷</span> CONTROL THE ATOMS</h3><p className="atomic-muted">Adjust the parameters and observe how the potential and forces change in real time.</p>
        {([
          ["separation", "Separation r", "Å", 2, 8, .05], ["sigma", "Atomic size σ", "Å", 2, 6, .05], ["epsilon", "Well depth ε", "meV", 1, 20, .5],
        ] as const).map(([key, label, unit, min, max, step]) => <div className="atomic-control" key={key}><label htmlFor={`atomic-${key}`}>{label}<output>{key === "epsilon" ? values[key].toFixed(1).replace(/\.0$/, "") : values[key].toFixed(2)} {unit}</output></label><div className="atomic-slider-row"><button aria-label={`Decrease ${label}`} onClick={() => setValues(previous => ({ ...previous, [key]: Math.max(min, previous[key] - step) }))}>−</button><input id={`atomic-${key}`} aria-label={label} type="range" min={min} max={max} step={step} value={values[key]} onChange={event => setValues(previous => ({ ...previous, [key]: Number(event.target.value) }))} /><button aria-label={`Increase ${label}`} onClick={() => setValues(previous => ({ ...previous, [key]: Math.min(max, previous[key] + step) }))}>+</button></div><div className="atomic-ticks">{Array.from({ length: 5 }, (_, index) => <span key={index}>{(min + (max - min) * index / 4).toFixed(key === "epsilon" ? 0 : 1)}</span>)}</div></div>)}
        <div className="atomic-presets"><h4>QUICK PRESETS</h4><div><button className="repulsive" onClick={() => setPreset("repulsive")}><span aria-hidden="true">◉◉</span>Repulsive</button><button className="balanced" onClick={() => setPreset("balanced")}><span aria-hidden="true">◉◉</span>Equilibrium</button><button className="attractive" onClick={() => setPreset("attractive")}><span aria-hidden="true">◉ ◉</span>Attractive</button></div></div>
      </aside>
      <main className="atomic-card atomic-visual"><div className="atomic-visual-heading"><h3><span>⚛</span> ATOMIC INTERACTION VISUALIZATION</h3><div className="atomic-toggle" role="group" aria-label="Atom appearance"><button aria-pressed={clouds} onClick={() => setClouds(true)}>Electron clouds</button><button aria-pressed={!clouds} onClick={() => setClouds(false)}>Nuclei only</button></div></div>
        <AtomicObjects separation={values.separation} sigma={values.sigma} force={result.force} clouds={clouds} onDistance={changeDistance} />
        <div className="atomic-graph-title"><h3><span>⌁</span> LENNARD–JONES POTENTIAL ENERGY CURVE</h3><code>U(r) = 4ε[(σ/r)¹² − (σ/r)⁶]</code></div>
        <PotentialGraph values={values} onDistance={changeDistance} />
      </main>
      <aside className="atomic-card atomic-evidence"><h3><span>▥</span> LIVE EVIDENCE</h3><p className="atomic-muted">Values update in real time as you adjust the controls.</p>
        <div className="atomic-reading"><span className="atomic-reading-icon purple">ϟ</span><div><h4>POTENTIAL ENERGY</h4><strong data-testid="atomic-potential">{display(result.potential)} meV</strong><p>Energy relative to infinite separation (U → 0 as r → ∞).</p></div></div>
        <div className="atomic-reading"><span className="atomic-reading-icon pink">↔</span><div><h4>RADIAL FORCE</h4><strong data-testid="atomic-force">{result.force > 0 ? "+" : ""}{display(result.force)} meV/Å</strong><p>Positive = repulsive (pushes atoms apart). Negative = attractive (pulls together).</p></div></div>
        <div className="atomic-reading"><span className="atomic-reading-icon teal">⚛</span><div><h4>INTERACTION</h4><strong data-testid="atomic-interaction">{result.interaction.toUpperCase()}</strong><p>{result.interaction === "Repulsive" ? "Short-range repulsion dominates." : result.interaction === "Attractive" ? "Dispersion attraction dominates." : "Attraction and repulsion balance."}</p></div></div>
        <div className={`atomic-status ${result.interaction.toLowerCase()}`}><span>{result.interaction === "Balanced" ? "✓" : "!"}</span><div><strong>{result.interaction === "Repulsive" ? "Too close" : result.interaction === "Attractive" ? "Pulled together" : "Stable equilibrium"}</strong><p>{result.interaction === "Repulsive" ? "Electron-cloud overlap produces a net repulsive force." : result.interaction === "Attractive" ? "Increasing separation weakens the long-range attraction." : `Minimum potential at r₀ = ${result.equilibrium.toFixed(2)} Å; F = 0.`}</p></div></div>
        <h4>FORCE BALANCE INDICATOR</h4><div className="atomic-force-meter"><i style={{ left: `${50 + 47 * Math.tanh(result.force * values.sigma / (24 * values.epsilon))}%` }} /><b /></div><div className="atomic-meter-labels"><span>Attraction</span><span>Balance<br />(F = 0)</span><span>Repulsion</span></div>
      </aside>
    </div>
    <footer className="atomic-investigation"><div className="atomic-investigation-heading"><h3>☼ &nbsp; INVESTIGATION</h3><p>Predict first, change only one control, then explain the force direction using the displayed relationship.</p></div><div className="atomic-investigation-steps">{[["Predict", "What do you expect to happen to potential energy and force?"], ["Adjust one variable", "Move a slider, drag an atom, or drag the point on the graph."], ["Explain what changed", "Use the graph and equation to justify your observation."]].map(([title, copy], index) => <div key={title}><b>{index + 1}</b><section><strong>{title}</strong><p>{copy}</p></section></div>)}<div className="atomic-formula"><section><p>Lennard–Jones potential</p><strong>U(r) = 4ε[(σ/r)¹² − (σ/r)⁶]</strong></section></div></div><small>Clouds are schematic, not literal electron trajectories. Separation is held at your chosen value; arrows show the force that would act if released. Force-indicator scale is compressed for readability.</small></footer>
  </section>;
}

function PotentialGraph({ values, onDistance }: { values: typeof atomicDefaults; onDistance: (value: number) => void }) {
  const identifier = useId().replace(/:/g, "");
  const result = atomicInteraction(values.separation, values.sigma, values.epsilon);
  const horizontal = (separation: number) => 85 + (separation - 2) / 6 * 680;
  const vertical = (potential: number) => 215 - (potential + 30) / 80 * 180;
  const curve = Array.from({ length: 501 }, (_, index) => { const distance = 2 + index / 500 * 6; return `${index ? "L" : "M"}${horizontal(distance)},${Math.max(-2000, vertical(atomicInteraction(distance, values.sigma, values.epsilon).potential))}`; }).join(" ");
  const pointX = horizontal(values.separation), pointY = Math.max(35, Math.min(215, vertical(result.potential)));
  const move = (event: React.PointerEvent<SVGSVGElement>) => { const rect = event.currentTarget.getBoundingClientRect(); onDistance(Math.max(2, Math.min(8, 2 + ((event.clientX - rect.left) / rect.width * 800 - 85) / 680 * 6))); };
  return <svg className="atomic-potential-graph" viewBox="0 0 800 260" role="slider" tabIndex={0} aria-label="Separation on potential energy graph" aria-valuemin={2} aria-valuemax={8} aria-valuenow={values.separation} aria-valuetext={`${values.separation.toFixed(2)} angstroms, potential ${display(result.potential)} millielectronvolts`} onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); onDistance(values.separation + (event.key === "ArrowRight" ? .05 : -.05)); } }} onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); move(event); }} onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) move(event); }} onPointerUp={event => event.currentTarget.releasePointerCapture(event.pointerId)}>
    <defs><clipPath id={`clip-${identifier}`}><rect x="85" y="35" width="680" height="180" /></clipPath><linearGradient id={`curve-${identifier}`}><stop stopColor="#ff405e" /><stop offset=".4" stopColor="#8047ff" /><stop offset="1" stopColor="#00a9ed" /></linearGradient></defs>
    <g clipPath={`url(#clip-${identifier})`}><rect x="85" y="35" width={horizontal(result.equilibrium) - 85} height="180" fill="#ffedf1" /><rect x={horizontal(result.equilibrium)} y="35" width="110" height="180" fill="#eee7ff" /><rect x={horizontal(result.equilibrium) + 110} y="35" width="680" height="180" fill="#e5f6ff" /><path d={curve} fill="none" stroke={`url(#curve-${identifier})`} strokeWidth="3" /></g>
    <path d={`M85 35V215H765 M85 ${vertical(0)}H765`} stroke="#47688d" fill="none" strokeWidth="1" />
    {[-20, 0, 20, 40].map(tick => <g key={tick}><path d={`M80 ${vertical(tick)}h5`} stroke="#47688d" /><text x="73" y={vertical(tick) + 4} textAnchor="end">{tick}</text></g>)}
    {[2, 3, 4, 5, 6, 7, 8].map(tick => <g key={tick}><path d={`M${horizontal(tick)} 215v5`} stroke="#47688d" /><text x={horizontal(tick)} y="235" textAnchor="middle">{tick}</text></g>)}
    <text x="420" y="255" textAnchor="middle">Separation r (Å)</text><text x="2" y="102">Potential</text><text x="2" y="117">energy</text><text x="2" y="132">U(r) (meV)</text>
    <text x="155" y="20" fill="#e33253">REPULSION</text><text x="365" y="20" fill="#7947e9">STABLE WELL</text><text x="600" y="20" fill="#008bce">ATTRACTION</text>
    <path d={`M${pointX} 35V215`} stroke="#426c91" strokeDasharray="5 5" /><circle cx={pointX} cy={pointY} r="7" fill="#00aeed" stroke="white" strokeWidth="2" />
    <g transform={`translate(${Math.max(100, Math.min(615, pointX - 65))},50)`}><rect width="140" height="43" rx="6" fill="white" stroke="#bdd4f4" /><text x="70" y="16" textAnchor="middle">r = {values.separation.toFixed(2)} Å</text><text x="70" y="33" textAnchor="middle">U = {display(result.potential)} meV</text></g>
    <circle cx={horizontal(result.equilibrium)} cy={vertical(-values.epsilon)} r="3" fill="#102445" /><text x="390" y="204">Equilibrium r₀ = {result.equilibrium.toFixed(2)} Å · F = 0</text>
  </svg>;
}

function AtomicObjects({ separation, sigma, force, clouds, onDistance }: { separation: number; sigma: number; force: number; clouds: boolean; onDistance: (value: number) => void }) {
  const mount = useRef<HTMLDivElement>(null);
  const live = useRef({ separation, sigma, force, clouds, onDistance }); live.current = { separation, sigma, force, clouds, onDistance };
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!mount.current) return;
    const host = mount.current; let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true }); } catch { setFailed(true); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.setClearColor(0x04263d); host.appendChild(renderer.domElement);
    const scene = new THREE.Scene(); const camera = new THREE.OrthographicCamera(-5, 5, 2, -2, .1, 30); camera.position.z = 10;
    scene.add(new THREE.AmbientLight(0xb7efff, 2)); const light = new THREE.PointLight(0xffffff, 45); light.position.set(-2, 3, 4); scene.add(light);
    let seed = 41; const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const starPositions = new Float32Array(260 * 3); for (let index = 0; index < 260; index++) starPositions.set([(random() - .5) * 12, (random() - .5) * 7, -3 - random() * 2], index * 3);
    const starGeometry = new THREE.BufferGeometry(); starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3)); scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0x4cc9ff, size: .025, transparent: true, opacity: .6 })));
    const atoms = [0x1acbff, 0xae6cff].map(color => {
      const group = new THREE.Group(); scene.add(group);
      const nucleus = new THREE.Mesh(new THREE.SphereGeometry(.25, 40, 32), new THREE.MeshPhysicalMaterial({ color, emissive: color, emissiveIntensity: .45, metalness: .2, roughness: .15 })); group.add(nucleus);
      const cloud = new THREE.Group(); group.add(cloud);
      cloud.add(new THREE.Mesh(new THREE.SphereGeometry(1, 48, 40), new THREE.ShaderMaterial({
        uniforms: { tint: { value: new THREE.Color(color) } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        vertexShader: "varying vec3 normalView; varying vec3 eye; void main(){ vec4 point = modelViewMatrix * vec4(position,1.0); normalView = normalize(normalMatrix * normal); eye = normalize(-point.xyz); gl_Position = projectionMatrix * point; }",
        fragmentShader: "uniform vec3 tint; varying vec3 normalView; varying vec3 eye; void main(){ float rim = pow(1.0-abs(dot(normalize(normalView),normalize(eye))),2.5); gl_FragColor = vec4(tint + vec3(rim*.3), .025 + rim*.6); }",
      })));
      for (let index = 0; index < 7; index++) cloud.add(new THREE.Mesh(new THREE.SphereGeometry(.78 + index * .035, 40, 32), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .025, depthWrite: false, blending: THREE.AdditiveBlending })));
      const halo = new THREE.Mesh(new THREE.TorusGeometry(1, .012, 8, 96), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .7 })); cloud.add(halo);
      const positions = new Float32Array(220 * 3); for (let index = 0; index < 220; index++) { const azimuth = random() * Math.PI * 2, cosine = random() * 2 - 1, radius = Math.cbrt(random()) * .98; positions.set([Math.cos(azimuth) * Math.sqrt(1 - cosine ** 2) * radius, Math.sin(azimuth) * Math.sqrt(1 - cosine ** 2) * radius, cosine * radius], index * 3); }
      const geometry = new THREE.BufferGeometry(); geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3)); cloud.add(new THREE.Points(geometry, new THREE.PointsMaterial({ color, size: .028, transparent: true, opacity: .85 })));
      return { group, cloud };
    });
    const arrows = [-1, 1].map(direction => { const arrow = new THREE.ArrowHelper(new THREE.Vector3(direction, 0, 0), new THREE.Vector3(), .7, 0xff637b, .17, .13); scene.add(arrow); return arrow; });
    let dragging = false;
    const move = (event: PointerEvent) => { if (!dragging) return; const bounds = host.getBoundingClientRect(); const world = ((event.clientX - bounds.left) / bounds.width - .5) * 10; live.current.onDistance(Math.max(2, Math.min(8, Math.abs(world) * 2 / .9))); };
    const down = (event: PointerEvent) => { dragging = true; renderer.domElement.setPointerCapture(event.pointerId); move(event); };
    const up = () => { dragging = false; };
    renderer.domElement.addEventListener("pointerdown", down); renderer.domElement.addEventListener("pointermove", move); renderer.domElement.addEventListener("pointerup", up); renderer.domElement.addEventListener("pointercancel", up);
    const resize = () => { renderer.setSize(host.clientWidth, host.clientHeight, false); const halfHeight = 5 * host.clientHeight / host.clientWidth; camera.top = halfHeight; camera.bottom = -halfHeight; camera.updateProjectionMatrix(); }; const observer = new ResizeObserver(resize); observer.observe(host); resize();
    let frame = 0; const render = () => { frame = requestAnimationFrame(render); if (document.hidden) return; const current = live.current; const radius = current.sigma * .3; atoms.forEach((atom, index) => { const side = index ? 1 : -1; atom.group.position.x = side * current.separation * .45; atom.cloud.visible = current.clouds; atom.cloud.scale.setScalar(radius); const direction = side * (current.force > 0 ? 1 : -1); arrows[index].visible = Math.abs(current.force) > 1e-7; arrows[index].setColor(current.force > 0 ? 0xff637b : 0x34caff); arrows[index].position.set(atom.group.position.x + direction * (current.clouds ? radius * .85 : .35), 0, .1); arrows[index].setDirection(new THREE.Vector3(direction, 0, 0)); }); renderer.render(scene, camera); }; render();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); renderer.domElement.removeEventListener("pointerdown", down); renderer.domElement.removeEventListener("pointermove", move); renderer.domElement.removeEventListener("pointerup", up); renderer.domElement.removeEventListener("pointercancel", up); const materials = new Set<THREE.Material>(); scene.traverse(node => { const mesh = node as THREE.Mesh; mesh.geometry?.dispose(); if (mesh.material) (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(material => materials.add(material)); }); materials.forEach(material => material.dispose()); renderer.dispose(); renderer.domElement.remove(); };
  }, []);
  return <div className="atomic-objects" ref={mount} role="group" aria-label="Draggable 3D atoms"><div className="atomic-distance-label">↔ &nbsp; r = {separation.toFixed(2)} Å</div><span className="atomic-force-label left">{Math.abs(force) < 1e-7 ? "Balanced" : force > 0 ? "Repulsive" : "Attractive"}<br />force</span><span className="atomic-force-label right">{Math.abs(force) < 1e-7 ? "Balanced" : force > 0 ? "Repulsive" : "Attractive"}<br />force</span><small>Drag either atom to change separation</small>{failed && <p>3D unavailable. Use the live graph and controls below.</p>}</div>;
}
