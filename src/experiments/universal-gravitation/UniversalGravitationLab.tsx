import { useEffect, useMemo, useState } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { computeGravitation, G, samplePotentialLine, type GravitationInput } from "./universalGravitationPhysics";
import "./universal-gravitation.css";

const DEFAULTS = { massALog: 30.3, massBLog: Math.log10(5.972e24), separationLog: Math.log10(1.5e11), probeStageX: .28, probeStageY: .35, softeningLog: 9 };
type FieldState = "idle" | "running" | "paused";
type Values = typeof DEFAULTS;

const visualSeparation = (logValue: number) => .9 + ((logValue - 9) / 4) * 1.2;

export function UniversalGravitationLab({ experiment }: DedicatedExperimentLabProps) {
  const [values, setValues] = useState(DEFAULTS);
  const [fieldState, setFieldState] = useState<FieldState>("idle");
  const [phase, setPhase] = useState(0);
  const [playback, setPlayback] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  const visualSep = visualSeparation(values.separationLog);
  const input = useMemo<GravitationInput>(() => {
    const separation = 10 ** values.separationLog;
    return {
      massA: 10 ** values.massALog,
      massB: 10 ** values.massBLog,
      separation,
      probeX: values.probeStageX / visualSep * separation,
      probeY: values.probeStageY / visualSep * separation,
      softening: 10 ** values.softeningLog,
    };
  }, [values, visualSep]);
  const result = useMemo(() => computeGravitation(input), [input]);
  const zeroStageX = result.zeroFieldX / input.separation * visualSep;
  const missionComplete = Math.hypot(values.probeStageX - zeroStageX, values.probeStageY) < visualSep * .025;

  useEffect(() => {
    if (fieldState !== "running") return;
    let frame = 0;
    let previous = performance.now();
    const animate = (time: number) => {
      const dt = Math.min(.05, (time - previous) / 1000);
      previous = time;
      setPhase(value => value + dt * playback * (reducedMotion ? .2 : 1));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [fieldState, playback, reducedMotion]);

  const update = (key: keyof Values, value: number) => setValues(current => ({ ...current, [key]: value }));
  const preset = (kind: "star" | "binary" | "earthMoon" | "equal") => {
    const next = kind === "star" ? { massALog: 30.3, massBLog: 24.78, separationLog: 11.176 }
      : kind === "binary" ? { massALog: 30, massBLog: 30, separationLog: 11.5 }
      : kind === "earthMoon" ? { massALog: 24.776, massBLog: 22.866, separationLog: 8.585 }
      : { massALog: 27, massBLog: 27, separationLog: 10.5 };
    setValues({ ...values, ...next, probeStageX: 0, probeStageY: 0, softeningLog: Math.min(9, next.separationLog - 2) });
    setFieldState("idle");
    setPhase(0);
  };
  const reset = () => { setValues(DEFAULTS); setFieldState("idle"); setPhase(0); };

  return <section className="gravity-lab" data-ui-theme="dark" aria-label={`${experiment.title} interactive laboratory`} data-field-state={fieldState} data-mission={missionComplete ? "complete" : "searching"}>
    <header className="gravity-lab-head">
      <div><span>ASTRONOMY · CLASS 9 / 11</span><h2>Universal Gravitation — Field Map</h2><p>Explore inverse-square fields, superposition, and gravitational potential.</p></div>
      <div className="gravity-head-actions"><button type="button" onClick={reset}>↻ Reset field</button><button type="button" onClick={() => setValues(current => ({ ...current, probeStageX: 0, probeStageY: 0 }))}>◎ Center probe</button></div>
    </header>
    <div className="gravity-primary-grid">
      <div className="gravity-stage">
        <FieldOverlay input={input} visualSep={visualSep} probeX={values.probeStageX} probeY={values.probeStageY} zeroX={zeroStageX} phase={phase} onProbe={(x, y) => setValues(current => ({ ...current, probeStageX: x, probeStageY: y }))} onSeparation={separationLog => setValues(current => ({ ...current, separationLog }))} />
        <div className="gravity-legend"><span><i />Field vectors</span><span><i />Equipotential contours</span><span><i />Net-field probe</span></div>
        <div className="gravity-scale">↔ {formatScientific(input.separation)} m separation</div>
      </div>
      <aside className="gravity-controls" aria-label="System parameters">
        <div className="gravity-panel-title"><h3>System parameters</h3><button type="button" onClick={() => setValues(current => ({ ...current, probeStageX: 0, probeStageY: 0 }))}>Center probe</button></div>
        <LogControl label="Mass A" symbol="M₁" value={values.massALog} min={20} max={32} step={.05} unit="kg" onChange={value => update("massALog", value)} />
        <LogControl label="Mass B" symbol="M₂" value={values.massBLog} min={20} max={32} step={.05} unit="kg" onChange={value => update("massBLog", value)} />
        <LogControl label="Separation" symbol="r₁₂" value={values.separationLog} min={7} max={13} step={.02} unit="m" onChange={value => update("separationLog", value)} />
        <div className="gravity-probe-controls"><h4>Probe position</h4><NumberControl label="Probe x" value={values.probeStageX} min={-1.5} max={1.5} step={.01} unit="map" onChange={value => update("probeStageX", value)} /><NumberControl label="Probe y" value={values.probeStageY} min={-1.1} max={1.1} step={.01} unit="map" onChange={value => update("probeStageY", value)} /></div>
        <LogControl label="Softening" symbol="ε" value={values.softeningLog} min={6} max={11} step={.1} unit="m" onChange={value => update("softeningLog", value)} />
        <div className="gravity-presets"><button onClick={() => preset("star")}><strong>Star–planet</strong><small>Sun-like + Earth-like</small></button><button onClick={() => preset("binary")}><strong>Binary stars</strong><small>Equal stellar masses</small></button><button onClick={() => preset("earthMoon")}><strong>Earth–Moon</strong><small>Measured masses</small></button><button onClick={() => preset("equal")}><strong>Equal masses</strong><small>Zero at midpoint</small></button></div>
        <div className="gravity-playback"><button className="gravity-primary-button" onClick={() => setFieldState("running")}>▶ {fieldState === "paused" ? "Resume" : "Play"}</button><button onClick={() => setFieldState("paused")} disabled={fieldState !== "running"}>Ⅱ Pause</button><button onClick={() => { setPhase(value => value + .25 * playback); setFieldState("paused"); }}>▮▶ Step</button><button onClick={reset}>↻ Reset</button></div>
        <div className="gravity-options"><label>Speed <select aria-label="Playback speed" value={playback} onChange={event => setPlayback(Number(event.target.value))}>{[.25,.5,1,1.5,2].map(value => <option key={value} value={value}>{value}×</option>)}</select></label><label><input type="checkbox" checked={reducedMotion} onChange={event => setReducedMotion(event.target.checked)} /> Reduced motion</label></div>
      </aside>
    </div>
    <div className="gravity-data-grid">
      <ProbeReadings input={input} result={result} missionComplete={missionComplete} />
      <PotentialGraph input={input} probeX={input.probeX} zeroX={result.zeroFieldX} />
      <section className="gravity-formulas"><h3>Physics at a glance</h3><div><article><strong>Gravitational force</strong><span>F = Gm₁m₂/r²</span></article><article><strong>Field is a vector</strong><span>g = −GM r⃗/r³</span></article><article><strong>Potential is scalar</strong><span>V = −Σ GMᵢ/rᵢ</span></article><article><strong>Superposition</strong><span>g⃗<sub>net</sub> = Σ g⃗ᵢ</span></article></div><p>{missionComplete ? "✓ Mission complete — vector fields cancel here, while potential remains negative." : "Mission: drag the probe to the point where the net field is zero."}</p></section>
    </div>
    <p className="gravity-sr-summary" aria-live="polite">Net field {formatScientific(result.netFieldMagnitude)} newtons per kilogram. Potential {formatScientific(result.potential)} joules per kilogram. {missionComplete ? "Zero-field mission complete." : "Probe is not at the zero-field point."}</p>
  </section>;
}

function LogControl({ label, symbol, value, min, max, step, unit, onChange }: { label:string; symbol:string; value:number; min:number; max:number; step:number; unit:string; onChange:(value:number)=>void }) {
  return <label className="gravity-control"><span><strong>{label} <em>{symbol}</em></strong><span className="gravity-number"><input aria-label={`${label} exponent`} type="number" value={value.toFixed(2)} min={min} max={max} step={step} onChange={event => onChange(Math.max(min, Math.min(max, Number(event.target.value))))} /><small>10ˣ {unit}</small></span></span><input aria-label={label} type="range" value={value} min={min} max={max} step={step} onChange={event => onChange(Number(event.target.value))} /><small><span>10^{min}</span><span>10^{max}</span></small></label>;
}

function NumberControl({ label, value, min, max, step, unit, onChange }: { label:string; value:number; min:number; max:number; step:number; unit:string; onChange:(value:number)=>void }) {
  return <label><span>{label}</span><input aria-label={label} type="number" value={value.toFixed(2)} min={min} max={max} step={step} onChange={event => onChange(Math.max(min, Math.min(max, Number(event.target.value))))} /><small>{unit}</small></label>;
}

function FieldOverlay({ input, visualSep, probeX, probeY, zeroX, phase, onProbe, onSeparation }: { input:GravitationInput; visualSep:number; probeX:number; probeY:number; zeroX:number; phase:number; onProbe:(x:number,y:number)=>void; onSeparation:(value:number)=>void }) {
  const width = 900, height = 440;
  const mx = (x:number) => width / 2 + x * 260;
  const my = (y:number) => height / 2 - y * 180;
  const fieldArrows = useMemo(() => buildFieldArrows(input, visualSep), [input, visualSep]);
  const contours = useMemo(() => buildContours(input, visualSep), [input, visualSep]);
  const probeResult = useMemo(() => computeGravitation(input), [input]);
  const probeMagnitude = Math.hypot(probeResult.netField.x, probeResult.netField.y);
  const probeScale = probeMagnitude ? .2 / probeMagnitude : 0;
  const drag = (event: React.PointerEvent<SVGCircleElement>) => event.currentTarget.setPointerCapture(event.pointerId);
  const move = (event: React.PointerEvent<SVGCircleElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const rect = event.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width * width - width / 2) / 260;
    const y = (height / 2 - (event.clientY - rect.top) / rect.height * height) / 180;
    onProbe(Math.max(-1.5, Math.min(1.5, x)), Math.max(-1.1, Math.min(1.1, y)));
  };
  const moveMass = (event: React.PointerEvent<SVGGElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const rect = event.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const mapX = ((event.clientX - rect.left) / rect.width * width - width / 2) / 260;
    const nextSep = Math.max(.3, Math.min(2.1, Math.abs(mapX) * 2));
    onSeparation(Math.max(7, Math.min(13, 9 + (nextSep - .9) / 1.2 * 4)));
  };
  const pulse = .72 + Math.sin(phase * Math.PI * 2) * .18;
  return <svg className="gravity-field-overlay" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Superposed gravitational field vectors, potential contours, and draggable probe">
    <defs><radialGradient id="mass-a"><stop offset="0" stopColor="#fff5bd"/><stop offset=".35" stopColor="#ffb23f"/><stop offset="1" stopColor="#d54a14"/></radialGradient><radialGradient id="mass-b"><stop offset="0" stopColor="#d9f4ff"/><stop offset=".42" stopColor="#4db5e8"/><stop offset="1" stopColor="#123c7a"/></radialGradient><marker id="gravity-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10Z" /></marker><marker id="probe-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" /></marker></defs>
    <g className="gravity-contours">{contours.map((path, index) => <path key={index} d={path} />)}</g>
    <g className="gravity-field-arrows" opacity={pulse}>{fieldArrows.map((arrow, index) => <line key={index} x1={mx(arrow.x)} y1={my(arrow.y)} x2={mx(arrow.x + arrow.dx)} y2={my(arrow.y + arrow.dy)} />)}</g>
    <line className="gravity-distance-line" x1={mx(-visualSep/2)} y1={my(0)} x2={mx(visualSep/2)} y2={my(0)} />
    <g className="gravity-mass gravity-mass-a" transform={`translate(${mx(-visualSep/2)} ${my(0)})`} role="slider" tabIndex={0} aria-label="Drag mass A to change separation" onPointerDown={event => event.currentTarget.setPointerCapture(event.pointerId)} onPointerMove={moveMass}><circle className="gravity-mass-glow" r="46"/><circle r="30"/><text y="52">M₁</text></g>
    <g className="gravity-mass gravity-mass-b" transform={`translate(${mx(visualSep/2)} ${my(0)})`} role="slider" tabIndex={0} aria-label="Drag mass B to change separation" onPointerDown={event => event.currentTarget.setPointerCapture(event.pointerId)} onPointerMove={moveMass}><circle className="gravity-mass-glow" r="40"/><circle r="25"/><text y="46">M₂</text></g>
    <g className="gravity-zero-marker" transform={`translate(${mx(zeroX)} ${my(0)})`}><circle r="8" /><path d="M-12 0H12M0-12V12" /><text y="-16">g = 0</text></g>
    <g className="gravity-probe-vector"><line x1={mx(probeX)} y1={my(probeY)} x2={mx(probeX + probeResult.netField.x * probeScale)} y2={my(probeY + probeResult.netField.y * probeScale)} /></g>
    <circle className="gravity-probe" cx={mx(probeX)} cy={my(probeY)} r="12" tabIndex={0} role="slider" aria-valuetext={`x ${probeX.toFixed(2)}, y ${probeY.toFixed(2)}`} aria-label="Field probe" onPointerDown={drag} onPointerMove={move} onKeyDown={event => { if(event.key === "ArrowLeft") onProbe(probeX-.02,probeY); if(event.key === "ArrowRight") onProbe(probeX+.02,probeY); if(event.key === "ArrowUp") onProbe(probeX,probeY+.02); if(event.key === "ArrowDown") onProbe(probeX,probeY-.02); }} />
    <text className="gravity-probe-label" x={mx(probeX)+15} y={my(probeY)-13}>P</text>
  </svg>;
}

function buildFieldArrows(input: GravitationInput, visualSep: number) {
  const arrows: {x:number; y:number; dx:number; dy:number}[] = [];
  for (let yi = -4; yi <= 4; yi++) for (let xi = -8; xi <= 8; xi++) {
    const x = xi / 5.6, y = yi / 4;
    if ((Math.abs(x + visualSep/2) < .12 || Math.abs(x - visualSep/2) < .12) && Math.abs(y) < .15) continue;
    const result = computeGravitation({ ...input, probeX: x / visualSep * input.separation, probeY: y / visualSep * input.separation });
    const magnitude = Math.hypot(result.netField.x, result.netField.y);
    if (!magnitude) continue;
    const length = .055 + Math.min(.09, Math.log10(1 + magnitude) * .006);
    arrows.push({ x, y, dx: result.netField.x / magnitude * length, dy: result.netField.y / magnitude * length });
  }
  return arrows;
}

function buildContours(input: GravitationInput, visualSep: number) {
  const nx = 45, ny = 27, xMin = -1.58, xMax = 1.58, yMin = -1.18, yMax = 1.18;
  const grid = Array.from({ length: ny }, (_, j) => Array.from({ length: nx }, (_, i) => computeGravitation({
    ...input,
    probeX: (xMin + i / (nx-1) * (xMax-xMin)) / visualSep * input.separation,
    probeY: (yMax - j / (ny-1) * (yMax-yMin)) / visualSep * input.separation,
  }).potential));
  const base = G * (input.massA + input.massB) / input.separation;
  const levels = [-.35,-.65,-1.1,-1.8,-3.2,-5.5].map(value => value * base);
  return levels.map(level => {
    let path = "";
    for (let j = 0; j < ny-1; j++) for (let i = 0; i < nx-1; i++) {
      const values = [grid[j][i], grid[j][i+1], grid[j+1][i+1], grid[j+1][i]];
      const points: Array<[number,number]> = [];
      const corners = [[i,j],[i+1,j],[i+1,j+1],[i,j+1]];
      for (let edge = 0; edge < 4; edge++) {
        const next = (edge + 1) % 4;
        if ((values[edge] < level) !== (values[next] < level)) {
          const t = (level-values[edge]) / (values[next]-values[edge]);
          points.push([corners[edge][0] + (corners[next][0]-corners[edge][0])*t, corners[edge][1] + (corners[next][1]-corners[edge][1])*t]);
        }
      }
      const map = ([gx,gy]: [number,number]) => [450 + (xMin + gx/(nx-1)*(xMax-xMin))*260, 220 - (yMax - gy/(ny-1)*(yMax-yMin))*180];
      if (points.length >= 2) {
        const a = map(points[0]), b = map(points[1]);
        path += `M${a[0].toFixed(1)},${a[1].toFixed(1)}L${b[0].toFixed(1)},${b[1].toFixed(1)}`;
        if (points.length === 4) { const c = map(points[2]), d = map(points[3]); path += `M${c[0].toFixed(1)},${c[1].toFixed(1)}L${d[0].toFixed(1)},${d[1].toFixed(1)}`; }
      }
    }
    return path;
  });
}

function ProbeReadings({ input, result, missionComplete }: { input:GravitationInput; result:ReturnType<typeof computeGravitation>; missionComplete:boolean }) {
  const items = [["Position",`(${formatScientific(input.probeX)}, ${formatScientific(input.probeY)}) m`],["r₁ to M₁",`${formatScientific(result.distanceToA)} m`],["r₂ to M₂",`${formatScientific(result.distanceToB)} m`],["g₁",`${formatScientific(Math.hypot(result.fieldFromA.x,result.fieldFromA.y))} N/kg`],["g₂",`${formatScientific(Math.hypot(result.fieldFromB.x,result.fieldFromB.y))} N/kg`],["|g net|",`${formatScientific(result.netFieldMagnitude)} N/kg`],["Potential",`${formatScientific(result.potential)} J/kg`],["Force pair",`±${formatScientific(result.forceMagnitude)} N`]];
  return <section className="gravity-readings"><h3>Probe readings <span>{missionComplete ? "✓ Zero field" : "● Live"}</span></h3><div>{items.map(([key,value]) => <dl key={key}><dt>{key}</dt><dd>{value}</dd></dl>)}</div></section>;
}

function PotentialGraph({ input, probeX, zeroX }: { input:GravitationInput; probeX:number; zeroX:number }) {
  const data = useMemo(() => samplePotentialLine(input, 121), [input]);
  const w=520,h=205,l=45,r=12,t=18,b=31, values=data.map(point => point.potential);
  const min = Math.max(Math.min(...values), -G*(input.massA+input.massB)/input.softening*1.5), max = Math.max(...values);
  const x = (value:number) => l + (value/input.separation+1.5)/3*(w-l-r);
  const y = (value:number) => t + (1-(value-min)/(max-min || 1))*(h-t-b);
  const path = data.map((point,index) => `${index ? "L" : "M"}${x(point.x).toFixed(1)},${y(Math.max(min,point.potential)).toFixed(1)}`).join(" ");
  return <section className="gravity-graph"><h3>Gravitational potential V along y = 0</h3><svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Negative gravitational potential curve along the line through both masses"><line x1={l} x2={w-r} y1={h-b} y2={h-b}/><path d={path}/><line className="probe-line" x1={x(probeX)} x2={x(probeX)} y1={t} y2={h-b}/><line className="zero-line" x1={x(zeroX)} x2={x(zeroX)} y1={t} y2={h-b}/><text x={x(probeX)} y={t+9}>P</text><text className="zero-text" x={x(zeroX)} y={h-b-6}>g=0</text><text x={l} y={h-8}>−1.5r</text><text x={w-r} y={h-8} textAnchor="end">+1.5r</text></svg><p>Potential stays negative at the zero-field point because potential is scalar.</p></section>;
}

/* Legacy GLB scene intentionally retired in the 2D studio conversion.
type SceneRuntime = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  renderer: THREE.WebGLRenderer;
  primary?: THREE.Object3D;
  secondary?: THREE.Object3D;
  shells: THREE.Object3D[];
  overlays: THREE.Sprite[];
  selected?: THREE.Object3D;
  reset: () => void;
};

function GravityScene({ input, visualSep, phase, running, reducedMotion, resetViewSignal }: { input:GravitationInput; visualSep:number; phase:number; running:boolean; reducedMotion:boolean; resetViewSignal:number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const runtime = useRef<SceneRuntime | null>(null);
  const live = useRef({ input, visualSep, phase, running, reducedMotion });
  const [selectedName, setSelectedName] = useState("none");
  useEffect(() => { live.current = { input, visualSep, phase, running, reducedMotion }; }, [input, visualSep, phase, running, reducedMotion]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, .01, 100);
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, preserveDrawingBuffer:true });
    renderer.setPixelRatio(Math.min(2, devicePixelRatio));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    host.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 4;
    controls.maxDistance = 14;
    const reset = () => { camera.position.set(0, 4.6, 8.5); controls.target.set(0,0,0); controls.update(); };
    reset();
    scene.add(new THREE.HemisphereLight(0xccecff, 0x07111f, 2.2));
    const key = new THREE.DirectionalLight(0xffffff, 3);
    key.position.set(4,5,5);
    scene.add(key);
    const state: SceneRuntime = { scene, camera, controls, renderer, shells:[], overlays:[], reset };
    runtime.current = state;

    new GLTFLoader().load(`${ASSET_ROOT}/universal-gravitation.glb`, gltf => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const centre = box.getCenter(new THREE.Vector3());
      const scale = 3.2 / Math.max(size.x,size.y,size.z);
      model.scale.setScalar(scale);
      model.position.sub(centre.multiplyScalar(scale));
      scene.add(model);
      state.primary = model.getObjectByName("primary_mass");
      state.secondary = model.getObjectByName("secondary_mass");
      state.shells = ["field_shell_0.95","field_shell_1.2","field_shell_1.45"].map(name => model.getObjectByName(name)).filter((node): node is THREE.Object3D => Boolean(node));
      ["force_on_primary_shaft","force_on_primary_head","force_on_secondary_shaft","force_on_secondary_head"].forEach(name => { const node=model.getObjectByName(name); if(node) node.visible=false; });
    });
    ["concept_effect.png","interaction_overlay.png"].forEach((name,index) => new THREE.TextureLoader().load(`${ASSET_ROOT}/effects/${name}`, texture => {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map:texture, transparent:true, opacity:index ? .04 : .07, blending:THREE.AdditiveBlending, depthWrite:false }));
      sprite.scale.set(4,4,1);
      sprite.position.z = -.5;
      scene.add(sprite);
      state.overlays.push(sprite);
    }));
    const resize = () => { const width=Math.max(1,host.clientWidth),height=Math.max(1,host.clientHeight); renderer.setSize(width,height,false); camera.aspect=width/height; camera.fov=camera.aspect<1 ? 80 : 42; camera.updateProjectionMatrix(); };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    let frame = 0;
    const draw = () => {
      const now = live.current;
      if (state.primary) state.primary.position.x = -now.visualSep * .78;
      if (state.secondary) state.secondary.position.x = now.visualSep * .78;
      state.shells.forEach((shell,index) => {
        const massScale = .8 + (Math.log10(now.input.massA)-20)/24;
        shell.scale.setScalar(massScale * (1 + (now.running && !now.reducedMotion ? Math.sin(now.phase*3+index)*.04 : 0)));
      });
      state.overlays.forEach((sprite,index) => { (sprite.material as THREE.SpriteMaterial).opacity = now.running ? (index ? .09 : .13) : (index ? .035 : .06); sprite.material.rotation = now.reducedMotion ? 0 : (index ? -now.phase*.1 : now.phase*.08); });
      controls.update();
      renderer.render(scene,camera);
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); controls.dispose(); renderer.dispose(); host.removeChild(renderer.domElement); runtime.current=null; };
  }, []);

  useEffect(() => runtime.current?.reset(), [resetViewSignal]);
  const selectNamed = (name: "Mass A" | "Mass B") => {
    const state = runtime.current;
    if (!state) return;
    state.selected = name === "Mass A" ? state.primary : state.secondary;
    setSelectedName(state.selected ? name : "none");
  };
  const select = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = runtime.current;
    if (!state) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2((event.clientX-rect.left)/rect.width*2-1, -((event.clientY-rect.top)/rect.height*2-1)), state.camera);
    const targets = [state.primary,state.secondary].filter((node): node is THREE.Object3D => Boolean(node));
    const hit = raycaster.intersectObjects(targets,true)[0];
    state.selected = hit ? targets.find(target => target === hit.object || target.getObjectById(hit.object.id)) : undefined;
    setSelectedName(state.selected === state.primary ? "Mass A" : state.selected === state.secondary ? "Mass B" : "none");
  };
  return <div ref={hostRef} className="gravity-three-scene" role="application" tabIndex={0} aria-label="Rotatable three-dimensional two-mass gravitational scene. Drag to rotate, wheel or pinch to zoom, click a mass to select it." onClick={select} onKeyDown={event => { const state=runtime.current; if(!state)return; if(event.key==="0")state.reset(); if(event.key==="ArrowLeft")state.camera.position.applyAxisAngle(new THREE.Vector3(0,1,0),.12); if(event.key==="ArrowRight")state.camera.position.applyAxisAngle(new THREE.Vector3(0,1,0),-.12); if(event.key==="+")state.camera.position.multiplyScalar(.9); if(event.key==="-")state.camera.position.multiplyScalar(1.1); state.camera.lookAt(state.controls.target); }}>
    <span className="gravity-selection">3D selected: {selectedName}</span>
    <span className="gravity-target-picker"><button type="button" onClick={event => { event.stopPropagation(); selectNamed("Mass A"); }}>Select Mass A</button><button type="button" onClick={event => { event.stopPropagation(); selectNamed("Mass B"); }}>Select Mass B</button></span>
  </div>;
}

*/
function formatScientific(value:number) {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";
  const [mantissa,exponent] = value.toExponential(2).split("e");
  return `${mantissa} × 10${Number(exponent) >= 0 ? "" : "−"}${Math.abs(Number(exponent))}`;
}
