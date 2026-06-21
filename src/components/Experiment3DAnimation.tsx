import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ExperimentDefinition } from "../types";
import { iconForExperiment, PhysicsIcon } from "../lib/icons";
import { FullscreenButton } from "./FullscreenButton";
import { makePrismModel } from "../lib/prism";

type AnimationKind =
  | "projectile"
  | "graph3d"
  | "force"
  | "forceBalance"
  | "incline"
  | "energy"
  | "pendulum"
  | "circular"
  | "gravity"
  | "buoyancy"
  | "densityTank"
  | "fluid"
  | "thermal"
  | "calorimetry"
  | "circuit"
  | "electromagnet"
  | "induction"
  | "generator"
  | "transformer"
  | "lens"
  | "eye"
  | "prism"
  | "interference"
  | "photoelectric"
  | "bohr"
  | "logic";

interface AnimationConfig {
  kind: AnimationKind;
  title: string;
  cue: string;
  cinematic?: boolean;
  steps?: string[];
}

const animationConfigs: Record<string, AnimationConfig> = {
  "projectile-motion": { kind: "projectile", title: "Cinematic projectile motion", cue: "Watch launch velocity split into horizontal and vertical components, then track the ball, shadow, peak, and range in one scene.", cinematic: true, steps: ["Resolve launch velocity", "Track x and y independently", "Locate peak and landing range"] },
  "distance-time-graph": { kind: "graph3d", title: "3D distance-time graph", cue: "A cart and its live graph move together, so the slope becomes visible as speed instead of just a formula.", cinematic: true, steps: ["Set speed", "Watch distance build", "Read slope as speed"] },
  "newton-s-second-law": { kind: "force", title: "3D force and acceleration", cue: "The cart responds to net force; the red vector grows when force dominates friction." },
  friction: { kind: "force", title: "3D friction response", cue: "Surface drag opposes motion, showing why applied force must cross the friction threshold." },
  "balanced-unbalanced-forces": { kind: "forceBalance", title: "3D balanced forces", cue: "Opposite pulls compete on the same body; the net arrow only appears when one side wins.", steps: ["Compare left and right pulls", "Find net force", "Predict acceleration"] },
  "inclined-plane": { kind: "incline", title: "3D inclined plane", cue: "The block slides along a tilted plane while gravity splits into normal and parallel components." },
  "conservation-of-energy": { kind: "energy", title: "3D energy conversion", cue: "Height becomes speed as the ball rolls down the ramp; losses reduce the final motion." },
  "simple-pendulum": { kind: "pendulum", title: "3D pendulum swing", cue: "The bob swings in depth so length and damping become visible, not just numeric." },
  "circular-motion": { kind: "circular", title: "3D circular motion", cue: "The orbiting mass shows velocity around the circle and inward centripetal pull." },
  "universal-gravitation": { kind: "gravity", title: "3D gravity field map", cue: "A test mass orbits through nested field shells while the attraction arrow shrinks with distance squared.", cinematic: true, steps: ["Increase source mass", "Move the test mass away", "Watch inverse-square weakening"] },
  buoyancy: { kind: "buoyancy", title: "3D buoyancy tank", cue: "The block bobs in water while submerged volume represents displaced fluid." },
  "density-float-sink": { kind: "densityTank", title: "3D float-or-sink tank", cue: "The block settles to a depth set by density ratio, making floating, neutral buoyancy, and sinking easy to compare.", steps: ["Compare densities", "Watch submerged fraction", "Classify the object state"] },
  "fluid-pressure": { kind: "fluid", title: "3D fluid pressure", cue: "The pressure probe moves through depth; flow markers make pressure direction easier to see." },
  "force-and-pressure": { kind: "fluid", title: "3D pressure field", cue: "The same force over a smaller contact area creates a stronger pressure response." },
  "heat-and-temperature": { kind: "thermal", title: "3D thermal particles", cue: "Particle speed and glow rise with temperature to separate heat energy from temperature reading." },
  "heat-transfer": { kind: "thermal", title: "3D heat transfer", cue: "Energy packets migrate through a slab, slowing when the material is thicker." },
  "gas-laws": { kind: "thermal", title: "3D gas container", cue: "Particles collide with the walls while volume and temperature change pressure." },
  "calorimetry-mixing": { kind: "calorimetry", title: "3D calorimetry mixing", cue: "Hot and cold streams merge inside an insulated cup; the thermometer climbs toward the heat-balance temperature.", cinematic: true, steps: ["Pour hot sample", "Add cold sample", "Reach thermal equilibrium"] },
  "ohms-law": { kind: "circuit", title: "3D charge flow", cue: "Charges move around the loop; bulb glow and carrier speed track current." },
  "series-parallel-resistance": { kind: "circuit", title: "3D circuit paths", cue: "The loop shows how resistance changes the visible charge-flow rate." },
  "electric-power": { kind: "circuit", title: "3D power output", cue: "The load glows as voltage and current combine into useful electrical power." },
  "heating-effect-current": { kind: "circuit", title: "3D Joule heating", cue: "The resistor warms as current rises, emphasizing the squared current effect." },
  "capacitor-lab": { kind: "circuit", title: "3D capacitor charging", cue: "Charge gathers on the plates while stored energy rises with voltage." },
  "electromagnet": { kind: "electromagnet", title: "3D electromagnet", cue: "A helical coil produces pulsing magnetic field loops around an iron core." },
  "magnetic-field-current": { kind: "electromagnet", title: "3D magnetic field", cue: "Current through the conductor wraps field loops around it." },
  "emi-faraday": { kind: "induction", title: "Cinematic Faraday induction", cue: "Flux ribbons pass through the coil, the magnet moves, and the galvanometer responds when flux changes quickly.", cinematic: true, steps: ["Move magnet", "Change magnetic flux", "Induce emf and current"] },
  "ac-generator": { kind: "generator", title: "Cinematic AC generator", cue: "The rotating coil cuts magnetic flux; slip rings feed brushes while the waveform grows and reverses in sync.", cinematic: true, steps: ["Rotate coil in field", "Flux changes continuously", "Output becomes AC sine wave"] },
  "transformer-lab": { kind: "transformer", title: "Cinematic transformer", cue: "Primary AC creates changing core flux, the secondary coil receives it, and the voltage bars compare the turns ratio.", cinematic: true, steps: ["Primary AC drives flux", "Core links both coils", "Turns ratio sets secondary voltage"] },
  "lens-formula": { kind: "lens", title: "Cinematic lens bench", cue: "Object rays, focal planes, and image screen line up in 3D so the lens equation becomes a spatial story.", cinematic: true, steps: ["Send principal rays", "Bend through lens", "Form real or virtual image"] },
  "mirror-formula": { kind: "lens", title: "3D ray bench", cue: "Rays reflect or focus so object distance and focal length become spatial." },
  "human-eye-defects": { kind: "eye", title: "3D realistic eye focus", cue: "Trace rays through the corrective lens, cornea, eye lens, and retina. Myopia focuses before the retina; hypermetropia focuses behind it.", cinematic: true, steps: ["Choose the defect", "Watch the uncorrected focus", "Add the correct lens type"] },
  "prism-dispersion": { kind: "prism", title: "3D prism dispersion", cue: "White light separates into colored rays after refraction through the prism." },
  "total-internal-reflection": { kind: "prism", title: "3D total internal reflection", cue: "The ray reflects inside the denser medium after crossing the critical angle." },
  "young-double-slit": { kind: "interference", title: "3D interference fringes", cue: "Two coherent sources make bright and dark bands on a distant screen." },
  "single-slit-diffraction": { kind: "interference", title: "3D diffraction spread", cue: "A narrow opening spreads the wavefront into a broad pattern." },
  "sound-wave-anatomy": { kind: "interference", title: "3D sound wave", cue: "Compression bands travel forward while particles vibrate back and forth." },
  "photoelectric-equation": { kind: "photoelectric", title: "3D photoelectric effect", cue: "Photons strike the metal; electrons leave only when photon energy beats work function." },
  "de-broglie-wavelength": { kind: "interference", title: "3D matter-wave spread", cue: "Higher accelerating voltage shortens wavelength and tightens diffraction." },
  "special-relativity-bridge": { kind: "graph3d", title: "3D spacetime bridge", cue: "A light-clock path and spacetime graph stretch as speed approaches light speed.", cinematic: true, steps: ["Set speed fraction", "Watch gamma grow", "Compare time and length readings"] },
  "bohr-model": { kind: "bohr", title: "Cinematic Bohr transition", cue: "Energy shells, electron jump path, photon pulse, and level ladder reveal why each spectral line has a fixed energy.", cinematic: true, steps: ["Choose energy levels", "Electron jumps shell", "Photon carries energy gap"] },
  "logic-gates": { kind: "logic", title: "3D logic gate", cue: "Inputs feed a digital gate and the output indicator switches between 0 and 1." },
};

interface Experiment3DAnimationProps {
  experiment: ExperimentDefinition;
  values: [number, number, number];
  outputs?: { label: string; value: string }[];
  timelineTime?: number | null;
  fixedShell?: boolean;
}

export function has3DAnimation(experimentId: string) {
  return Boolean(experimentId);
}

export function Experiment3DAnimation({ experiment, values, outputs = [], timelineTime = null, fixedShell = false }: Experiment3DAnimationProps) {
  const config = useMemo(() => animationConfigs[experiment.id] ?? fallback3DConfig(experiment), [experiment]);
  const panelRef = useRef<HTMLElement | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const timelineTimeRef = useRef<number | null>(timelineTime);
  const sendViewCommand = (command: "reset" | "front" | "top" | "zoom-in" | "zoom-out") => {
    mountRef.current?.dispatchEvent(new CustomEvent("three-view-command", { detail: command }));
  };

  useEffect(() => {
    timelineTimeRef.current = typeof timelineTime === "number" ? timelineTime : null;
  }, [timelineTime]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    } catch {
      const fallback = document.createElement("div");
      fallback.className = "three-lab-fallback";
      fallback.innerHTML = "<strong>3D view needs WebGL.</strong><span>The guided animation and calculator still work in this browser.</span>";
      mount.replaceChildren(fallback);
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020617, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = config.cinematic ? 0.92 : 0.86;
    const hint = document.createElement("div");
    hint.className = "three-control-hint";
    hint.textContent = "Drag rotate | Wheel zoom | Shift/right-drag pan";
    mount.replaceChildren(renderer.domElement, hint);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x020617, config.cinematic ? 9 : 8, config.cinematic ? 22 : 18);
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
    const composer = config.cinematic ? new EffectComposer(renderer) : null;
    const bloomPass = config.cinematic ? new UnrealBloomPass(new THREE.Vector2(1, 1), 0.16, 0.28, 0.42) : null;
    const ssaoPass = config.cinematic ? new SSAOPass(scene, camera, 1, 1) : null;
    if (composer && bloomPass && ssaoPass) {
      ssaoPass.kernelRadius = 10;
      ssaoPass.minDistance = 0.001;
      ssaoPass.maxDistance = 0.12;
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(ssaoPass);
      composer.addPass(bloomPass);
    }
    const cameraTarget = new THREE.Vector3(0, -0.12, 0);
    const orbit = {
      theta: 0.58,
      phi: 1.18,
      radius: config.cinematic ? 7.2 : 6.6,
      target: cameraTarget.clone(),
    };
    const setCameraFromOrbit = () => {
      const spherical = new THREE.Spherical(orbit.radius, orbit.phi, orbit.theta);
      camera.position.setFromSpherical(spherical).add(orbit.target);
      camera.lookAt(orbit.target);
    };
    setCameraFromOrbit();

    scene.add(new THREE.HemisphereLight(0xcffafe, 0x0f172a, 1.08));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.28);
    keyLight.position.set(3, 5, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x22d3ee, config.cinematic ? 12 : 6, 12);
    rimLight.position.set(-3, 2.5, 3);
    scene.add(rimLight);
    const warmLight = new THREE.PointLight(0xfacc15, config.cinematic ? 8 : 4, 10);
    warmLight.position.set(3.2, 1.8, -2.8);
    scene.add(warmLight);

    const root = new THREE.Group();
    scene.add(root);
    addGrid(root);
    addCinematicSet(root, config.kind, Boolean(config.cinematic));
    buildScene(config.kind, root, values);

    const pointerState = {
      active: false,
      mode: "orbit" as "orbit" | "pan",
      x: 0,
      y: 0,
    };
    const clampOrbit = () => {
      orbit.phi = clamp(orbit.phi, 0.28, Math.PI / 2.05);
      orbit.radius = clamp(orbit.radius, 3.1, 13);
    };
    const panCamera = (dx: number, dy: number) => {
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0);
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1);
      const scale = orbit.radius * 0.0016;
      orbit.target.addScaledVector(right, -dx * scale);
      orbit.target.addScaledVector(up, dy * scale);
    };
    const onPointerDown = (event: PointerEvent) => {
      pointerState.active = true;
      pointerState.mode = event.button === 2 || event.shiftKey ? "pan" : "orbit";
      pointerState.x = event.clientX;
      pointerState.y = event.clientY;
      mount.setPointerCapture(event.pointerId);
      mount.classList.add("three-lab-canvas-dragging");
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!pointerState.active) return;
      const dx = event.clientX - pointerState.x;
      const dy = event.clientY - pointerState.y;
      pointerState.x = event.clientX;
      pointerState.y = event.clientY;
      if (pointerState.mode === "pan") {
        panCamera(dx, dy);
      } else {
        orbit.theta -= dx * 0.006;
        orbit.phi += dy * 0.006;
        clampOrbit();
      }
    };
    const onPointerUp = (event: PointerEvent) => {
      pointerState.active = false;
      mount.releasePointerCapture(event.pointerId);
      mount.classList.remove("three-lab-canvas-dragging");
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      orbit.radius *= event.deltaY > 0 ? 1.08 : 0.92;
      clampOrbit();
    };
    const onContextMenu = (event: MouseEvent) => event.preventDefault();
    const onViewCommand = (event: Event) => {
      const command = (event as CustomEvent<"reset" | "front" | "top" | "zoom-in" | "zoom-out">).detail;
      if (command === "reset") {
        orbit.theta = 0.58;
        orbit.phi = 1.18;
        orbit.radius = config.cinematic ? 7.2 : 6.6;
        orbit.target.copy(cameraTarget);
      }
      if (command === "front") {
        orbit.theta = 0;
        orbit.phi = 1.2;
      }
      if (command === "top") {
        orbit.theta = 0.01;
        orbit.phi = 0.32;
      }
      if (command === "zoom-in") orbit.radius *= 0.82;
      if (command === "zoom-out") orbit.radius *= 1.18;
      clampOrbit();
    };
    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerup", onPointerUp);
    mount.addEventListener("pointercancel", onPointerUp);
    mount.addEventListener("wheel", onWheel, { passive: false });
    mount.addEventListener("contextmenu", onContextMenu);
    mount.addEventListener("three-view-command", onViewCommand);

    const resize = () => {
      const width = Math.max(320, mount.clientWidth);
      const height = Math.max(300, mount.clientHeight);
      renderer.setSize(width, height, false);
      composer?.setSize(width, height);
      if (ssaoPass) {
        ssaoPass.width = width;
        ssaoPass.height = height;
      }
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      const t = timelineTimeRef.current ?? clock.getElapsedTime();
      rimLight.intensity = (config.cinematic ? 30 : 8) + Math.sin(t * 1.2) * (config.cinematic ? 5 : 1.2);
      warmLight.intensity = (config.cinematic ? 16 : 5) + Math.cos(t * 0.9) * (config.cinematic ? 4 : 0.8);
      updateObjects(root, t, values);
      setCameraFromOrbit();
      if (composer) composer.render();
      else renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      mount.removeEventListener("pointerdown", onPointerDown);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerup", onPointerUp);
      mount.removeEventListener("pointercancel", onPointerUp);
      mount.removeEventListener("wheel", onWheel);
      mount.removeEventListener("contextmenu", onContextMenu);
      mount.removeEventListener("three-view-command", onViewCommand);
      resizeObserver.disconnect();
      composer?.dispose();
      renderer.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else if (material) {
          const map = (material as THREE.MeshStandardMaterial | THREE.SpriteMaterial).map;
          map?.dispose?.();
          material?.dispose?.();
        }
      });
      mount.replaceChildren();
    };
  }, [config, experiment.id, values]);

  const cardClassName = config.cinematic ? "three-lab-card three-lab-card-cinematic mt-5 fullscreen-target" : "three-lab-card mt-5 fullscreen-target";
  const setPanelRef = (element: HTMLElement | null) => {
    panelRef.current = element;
  };
  const header = (
    <div className={fixedShell ? "visual-disclosure-summary visual-disclosure-summary-fixed" : "visual-disclosure-summary"}>
      <div className="flex items-center gap-3">
        <span className="card-icon">
          <PhysicsIcon name={iconForExperiment(experiment)} />
        </span>
        <div>
          <p className="ui-label text-cyan-300">3D animation</p>
          <h2 className="text-lg font-black text-slate-100">{config.title}</h2>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <FullscreenButton targetRef={panelRef} compact />
        <button className="three-view-btn" type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); sendViewCommand("reset"); }} title="Reset 3D camera">
          <PhysicsIcon name="settings" className="h-3.5 w-3.5" />
          Reset
        </button>
        <button className="three-view-btn" type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); sendViewCommand("front"); }} title="Front view">
          Front
        </button>
        <button className="three-view-btn" type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); sendViewCommand("top"); }} title="Top view">
          Top
        </button>
        <button className="three-view-icon-btn" type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); sendViewCommand("zoom-in"); }} title="Zoom in">
          +
        </button>
        <button className="three-view-icon-btn" type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); sendViewCommand("zoom-out"); }} title="Zoom out">
          -
        </button>
        <span className="status-chip border-cyan-300/40 bg-cyan-300/10 text-cyan-100">{config.cinematic ? "cinematic explainer" : "responds to sliders"}</span>
      </div>
    </div>
  );
  const body = (
    <div className={config.cinematic ? "visual-disclosure-body mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_260px]" : "visual-disclosure-body mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_210px]"}>
      <div ref={mountRef} className={config.cinematic ? "three-lab-canvas three-lab-canvas-cinematic" : "three-lab-canvas"}>
        <div className="three-control-hint">
          Drag rotate | Wheel zoom | Shift/right-drag pan
        </div>
      </div>
      <div className="grid content-start gap-2">
        <div className="rounded-md border border-cyan-300/25 bg-slate-950/75 p-3">
          <div className="text-xs font-black uppercase tracking-widest text-cyan-200">guide</div>
          <p className="mt-2 text-xs leading-5 text-slate-300">{config.cue}</p>
        </div>
        {config.steps && (
          <div className="rounded-md border border-amber-300/25 bg-amber-300/10 p-3">
            <div className="text-xs font-black uppercase tracking-widest text-amber-200">concept flow</div>
            <div className="mt-2 grid gap-2">
              {config.steps.map((step, index) => (
                <div key={step} className="flex items-start gap-2 text-xs leading-5 text-slate-200">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-300 text-[10px] font-black text-slate-950">{index + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {outputs.slice(0, 3).map((output) => (
          <div key={output.label} className="rounded-md border border-slate-700 bg-slate-950/75 p-2">
            <div className="text-xs text-slate-400">{output.label}</div>
            <div className="mt-1 break-words font-mono text-sm font-black text-cyan-300">{output.value}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (fixedShell) {
    return (
      <section ref={setPanelRef} id="three-d" className={cardClassName} aria-label={`${experiment.title} 3D animation`}>
        {header}
        {body}
      </section>
    );
  }

  return (
    <details ref={setPanelRef} id="three-d" className={cardClassName} aria-label={`${experiment.title} 3D animation`} open>
      <summary className="contents">{header}</summary>
      {body}
    </details>
  );
}

function fallback3DConfig(experiment: ExperimentDefinition): AnimationConfig {
  const category = experiment.category.toLowerCase();
  const id = experiment.id;
  const kind = fallback3DKind(experiment);
  const cinematic =
    category.includes("optic") ||
    category.includes("modern") ||
    category.includes("magnet") ||
    id.includes("orbit") ||
    id.includes("generator") ||
    id.includes("transformer");

  return {
    kind,
    title: `3D ${experiment.title} model`,
    cue: `Use the sliders, then rotate the scene with the pointer. The 3D model highlights the main interaction behind ${experiment.title}.`,
    cinematic,
    steps: fallback3DSteps(category, kind),
  };
}

function fallback3DKind(experiment: ExperimentDefinition): AnimationKind {
  const id = experiment.id;
  const category = experiment.category.toLowerCase();
  if (id.includes("projectile")) return "projectile";
  if (id.includes("distance") || id.includes("graph") || category.includes("measurement")) return "graph3d";
  if (id.includes("balanced")) return "forceBalance";
  if (id.includes("incline") || id.includes("ramp")) return "incline";
  if (id.includes("pendulum") || id.includes("shm") || id.includes("spring")) return "pendulum";
  if (id.includes("rotation") || id.includes("circular")) return "circular";
  if (id.includes("orbit") || id.includes("satellite") || id.includes("gravitation")) return "gravity";
  if (id.includes("buoyancy")) return "buoyancy";
  if (id.includes("density") || id.includes("float") || id.includes("sink")) return "densityTank";
  if (id.includes("fluid") || id.includes("bernoulli") || id.includes("pressure")) return "fluid";
  if (id.includes("calorimetry")) return "calorimetry";
  if (id.includes("gas") || id.includes("heat") || id.includes("thermal") || category.includes("thermo")) return "thermal";
  if (id.includes("generator")) return "generator";
  if (id.includes("transformer")) return "transformer";
  if (id.includes("emi") || id.includes("faraday") || id.includes("induction")) return "induction";
  if (id.includes("magnetic") || id.includes("electromagnet") || id.includes("lorentz") || category.includes("magnet")) return "electromagnet";
  if (id.includes("circuit") || id.includes("current") || id.includes("ohm") || id.includes("resistance") || id.includes("capacitor") || category.includes("electric")) return "circuit";
  if (id.includes("logic") || id.includes("diode") || category.includes("electronics")) return "logic";
  if (id.includes("prism") || id.includes("dispersion") || id.includes("internal") || id.includes("polarization") || id.includes("reflection")) return "prism";
  if (id.includes("eye")) return "eye";
  if (id.includes("lens") || id.includes("mirror") || category.includes("optic")) return "lens";
  if (id.includes("photoelectric")) return "photoelectric";
  if (id.includes("relativity")) return "graph3d";
  if (id.includes("bohr") || id.includes("nuclear")) return "bohr";
  if (id.includes("wave") || id.includes("sound") || id.includes("slit") || id.includes("diffraction") || id.includes("interference") || id.includes("chladni")) return "interference";
  if (category.includes("astronomy")) return "gravity";
  if (category.includes("fluid")) return "fluid";
  if (category.includes("wave")) return "interference";
  if (category.includes("modern")) return "bohr";
  if (category.includes("energy")) return "energy";
  return "force";
}

function fallback3DSteps(category: string, kind: AnimationKind) {
  if (kind === "eye") return ["Compare focus with retina", "Add a concave or convex correction", "Check clear-image formation"];
  if (kind === "lens" || kind === "prism") return ["Follow the incoming ray", "Watch the interaction surface", "Locate the image or pattern"];
  if (kind === "circuit" || kind === "logic") return ["Set the source/input", "Watch carriers or states move", "Read the output response"];
  if (kind === "electromagnet" || kind === "induction" || kind === "generator" || kind === "transformer") return ["Create changing current or flux", "Watch the field link the device", "Compare the induced response"];
  if (kind === "thermal" || kind === "calorimetry") return ["Set energy input", "Watch particles redistribute energy", "Read the final thermal state"];
  if (kind === "fluid" || kind === "buoyancy" || kind === "densityTank") return ["Set depth, density, or flow", "Watch pressure and buoyancy vectors", "Compare the final state"];
  if (kind === "interference") return ["Set frequency or opening", "Watch wavefronts overlap", "Read nodes, antinodes, or fringes"];
  if (kind === "bohr" || kind === "photoelectric") return ["Add energy", "Watch the quantum event", "Read the emitted or ejected signal"];
  if (category.includes("measurement")) return ["Take repeated readings", "See uncertainty spread", "Estimate the best value"];
  return ["Set one variable", "Watch the object respond", "Compare vector and result"];
}

function buildScene(kind: AnimationKind, root: THREE.Group, values: [number, number, number]) {
  const [a, b, c] = values;
  if (kind === "projectile") return buildProjectile(root, a, b, c);
  if (kind === "graph3d") return buildGraph3D(root, a, b, c);
  if (kind === "force") return buildForce(root, a, b, c);
  if (kind === "forceBalance") return buildForceBalance(root, a, b, c);
  if (kind === "incline") return buildIncline(root, a, b, c);
  if (kind === "energy") return buildEnergy(root, a, b, c);
  if (kind === "pendulum") return buildPendulum(root, a, b, c);
  if (kind === "circular") return buildCircular(root, a, b, c);
  if (kind === "gravity") return buildGravityMap(root, a, b, c);
  if (kind === "buoyancy") return buildBuoyancy(root, a, b, c);
  if (kind === "densityTank") return buildDensityTank(root, a, b, c);
  if (kind === "fluid") return buildFluid(root, a, b, c);
  if (kind === "thermal") return buildThermal(root, a, b, c);
  if (kind === "calorimetry") return buildCalorimetry(root, a, b, c);
  if (kind === "circuit") return buildCircuit(root, a, b, c);
  if (kind === "electromagnet") return buildElectromagnet(root, a, b, c);
  if (kind === "induction") return buildInduction(root, a, b, c);
  if (kind === "generator") return buildGenerator(root, a, b, c);
  if (kind === "transformer") return buildTransformer(root, a, b, c);
  if (kind === "lens") return buildLens(root, a, b, c);
  if (kind === "eye") return buildEyeFocus(root, a, b, c);
  if (kind === "prism") return buildPrism(root, a, b, c);
  if (kind === "interference") return buildInterference(root, a, b, c);
  if (kind === "photoelectric") return buildPhotoelectric(root, a, b, c);
  if (kind === "bohr") return buildBohr(root, a, b, c);
  return buildLogic(root, a, b, c);
}

function addGrid(root: THREE.Group) {
  const grid = new THREE.GridHelper(8, 16, 0x22d3ee, 0x334155);
  grid.position.y = -1.1;
  const gridMaterial = grid.material as THREE.Material;
  gridMaterial.opacity = 0.28;
  gridMaterial.transparent = true;
  root.add(grid);
}

function addCinematicSet(root: THREE.Group, kind: AnimationKind, cinematic: boolean) {
  const palette = paletteForKind(kind);
  const floorGlow = new THREE.Mesh(
    new THREE.RingGeometry(1.15, cinematic ? 3.6 : 2.7, 96),
    material(palette.primary, cinematic ? 0.18 : 0.1)
  );
  floorGlow.rotation.x = Math.PI / 2;
  floorGlow.position.y = -1.075;
  floorGlow.userData.role = "scan-ring";
  floorGlow.userData.speed = cinematic ? 0.28 : 0.18;
  root.add(floorGlow);

  const outerGlow = new THREE.Mesh(
    new THREE.RingGeometry(3.85, 3.92, 128),
    material(palette.hot, 0.26)
  );
  outerGlow.rotation.x = Math.PI / 2;
  outerGlow.position.y = -1.06;
  outerGlow.userData.role = "halo-ring";
  outerGlow.userData.speed = 0.16;
  root.add(outerGlow);

  for (let index = 0; index < (cinematic ? 42 : 24); index += 1) {
    const particle = sphere(index % 7 === 0 ? 0.035 : 0.023, index % 5 === 0 ? palette.hot : index % 2 === 0 ? palette.primary : palette.secondary, 0.42);
    particle.position.set(
      -3.5 + ((index * 1.37) % 7),
      -0.8 + ((index * 0.41) % 2.25),
      -2.2 + ((index * 0.83) % 4.4)
    );
    particle.userData.role = "ambient-spark";
    particle.userData.seed = index * 0.73;
    particle.userData.speed = 0.55 + (index % 6) * 0.12;
    root.add(particle);
  }

  for (let index = 0; index < 4; index += 1) {
    const rail = tube([
      new THREE.Vector3(-3.65, -1.04, -1.8 + index * 1.2),
      new THREE.Vector3(3.65, -1.04, -1.8 + index * 1.2),
    ], 0.008, index % 2 ? palette.primary : palette.secondary, 0.28);
    rail.userData.role = "wave-shift";
    rail.userData.speed = 0.3 + index * 0.08;
    root.add(rail);
  }

  const beacon = sphere(0.08, palette.hot, 0.85);
  beacon.position.set(-3.4, 1.45, -1.9);
  beacon.userData.role = "beacon";
  beacon.userData.power = cinematic ? 1.8 : 1.1;
  root.add(beacon);
}

function paletteForKind(kind: AnimationKind) {
  if (kind === "thermal" || kind === "calorimetry") return { primary: 0xf97316, secondary: 0x38bdf8, hot: 0xfacc15 };
  if (kind === "circuit" || kind === "electromagnet" || kind === "induction" || kind === "generator" || kind === "transformer") return { primary: 0x22d3ee, secondary: 0xfacc15, hot: 0xf97316 };
  if (kind === "lens" || kind === "eye" || kind === "prism" || kind === "interference") return { primary: 0x67e8f9, secondary: 0xa78bfa, hot: 0xfacc15 };
  if (kind === "gravity" || kind === "bohr" || kind === "photoelectric") return { primary: 0xa78bfa, secondary: 0x22d3ee, hot: 0xfacc15 };
  if (kind === "buoyancy" || kind === "densityTank" || kind === "fluid") return { primary: 0x38bdf8, secondary: 0x0ea5e9, hot: 0xa3e635 };
  if (kind === "force" || kind === "forceBalance" || kind === "incline") return { primary: 0x38bdf8, secondary: 0xf43f5e, hot: 0xfacc15 };
  return { primary: 0x22d3ee, secondary: 0x38bdf8, hot: 0xfacc15 };
}

function buildProjectile(root: THREE.Group, speed: number, angle: number, gravity: number) {
  const theta = THREE.MathUtils.degToRad(clamp(angle, 5, 85));
  const range = clamp((speed * speed * Math.sin(2 * theta)) / Math.max(1, gravity), 2, 12);
  const height = clamp((speed * speed * Math.sin(theta) ** 2) / (2 * Math.max(1, gravity)), 1, 5);
  const points = Array.from({ length: 120 }, (_, index) => {
    const u = index / 119;
    return new THREE.Vector3(-3.45 + u * 6.9, -0.84 + 4 * height * u * (1 - u) / 5, -1.35 + u * 1.85);
  });
  root.add(tube(points, 0.052, 0x22d3ee, 1));
  root.add(tube(points.map((point) => new THREE.Vector3(point.x, -1.05, point.z)), 0.02, 0x64748b, 0.85));
  points.filter((_, index) => index % 12 === 0).forEach((point, index) => {
    const ghost = sphere(0.095, 0x22d3ee, 0.28 + index * 0.018);
    ghost.position.copy(point);
    root.add(ghost);
    const shadow = sphere(0.045, 0x334155, 0.65);
    shadow.scale.set(1.8, 0.2, 1);
    shadow.position.set(point.x, -1.04, point.z);
    root.add(shadow);
  });
  const ball = sphere(0.26, 0x22d3ee);
  ball.userData.role = "path";
  ball.userData.path = points;
  root.add(ball);
  const launch = new THREE.Vector3(-3.45, -0.84, -1.35);
  addArrow(root, launch, new THREE.Vector3(-2.1, -0.84 + Math.sin(theta) * 1.5, -0.98), 0x38bdf8);
  addArrow(root, launch.clone().add(new THREE.Vector3(0, 0.05, 0.12)), launch.clone().add(new THREE.Vector3(1.2, 0.05, 0.12)), 0x34d399);
  addArrow(root, launch.clone().add(new THREE.Vector3(0.1, 0, -0.18)), launch.clone().add(new THREE.Vector3(0.1, Math.sin(theta) * 1.25, -0.18)), 0xfacc15);
  const peak = points[Math.floor(points.length / 2)];
  addMarker(root, peak, 0xfacc15);
  addMarker(root, points[points.length - 1], 0x34d399);
  root.add(label("vx constant", new THREE.Vector3(-2.55, -0.5, -1.0), 0x34d399));
  root.add(label("vy changes", new THREE.Vector3(-3.15, 0.55, -1.45), 0xfacc15));
  root.add(label("peak", peak.clone().add(new THREE.Vector3(0.15, 0.35, 0)), 0xfacc15));
  root.add(label(`range ${range.toFixed(1)} m`, points[points.length - 1].clone().add(new THREE.Vector3(-0.55, 0.3, 0.1)), 0x34d399));
  addPlatform(root);
  root.userData.scaleHint = range;
}

function buildGraph3D(root: THREE.Group, speed: number, time: number, startDistance: number) {
  addPlatform(root);
  const track = box(5.8, 0.08, 0.22, 0x64748b, 0.9);
  track.position.set(-0.35, -0.72, -0.95);
  root.add(track);
  const ticks = 6;
  for (let index = 0; index <= ticks; index += 1) {
    const x = -3.1 + index * (5.5 / ticks);
    const tick = box(0.035, 0.24, 0.04, 0x94a3b8, 0.78);
    tick.position.set(x, -0.58, -0.95);
    root.add(tick);
  }

  const distance = startDistance + speed * time;
  const travel = clamp(distance / 300, 0.15, 1);
  const cartPath = [
    new THREE.Vector3(-3.1, -0.42, -0.95),
    new THREE.Vector3(-3.1 + travel * 5.5, -0.42, -0.95),
  ];
  const cart = box(0.55, 0.32, 0.42, 0x38bdf8);
  cart.userData.role = "path";
  cart.userData.path = cartPath;
  root.add(cart);
  [-0.18, 0.18].forEach((x) => {
    const wheel = cylinder(0.08, 0.08, 0.08, 0x020617);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, -0.2, 0.24);
    wheel.userData.role = "wheel";
    cart.add(wheel);
  });

  const origin = new THREE.Vector3(-2.65, -0.94, 0.78);
  addArrow(root, origin, origin.clone().add(new THREE.Vector3(2.65, 0, 0)), 0x94a3b8);
  addArrow(root, origin, origin.clone().add(new THREE.Vector3(0, 1.75, 0)), 0x94a3b8);
  const maxDistance = Math.max(1, startDistance + speed * Math.max(1, time), 120);
  const graphPoints = Array.from({ length: 50 }, (_, index) => {
    const u = index / 49;
    const y = clamp((startDistance + speed * time * u) / maxDistance, 0, 1);
    return new THREE.Vector3(origin.x + u * 2.55, origin.y + y * 1.6, origin.z);
  });
  root.add(tube(graphPoints, 0.014, 0xfacc15, 0.94));
  const graphMarker = sphere(0.09, 0xfacc15);
  graphMarker.userData.role = "path";
  graphMarker.userData.path = graphPoints;
  root.add(graphMarker);
  const slopeArrowStart = graphPoints[Math.max(4, Math.floor(graphPoints.length * 0.35))];
  const slopeArrowEnd = graphPoints[Math.min(graphPoints.length - 1, Math.floor(graphPoints.length * 0.74))];
  addArrow(root, slopeArrowStart, slopeArrowEnd, speed > 0 ? 0x34d399 : 0x64748b);
  root.add(label("motion track", new THREE.Vector3(-2.25, -0.12, -0.95), 0x38bdf8));
  root.add(label("slope = speed", new THREE.Vector3(-1.3, 1.15, 0.78), 0xfacc15));
  root.add(label(speed === 0 ? "rest line" : "uniform motion", new THREE.Vector3(1.1, 0.58, 0.78), 0x34d399));
}

function buildForce(root: THREE.Group, force: number, mass: number, friction: number) {
  addPlatform(root);
  const cart = box(1.1, 0.45, 0.75, 0x38bdf8);
  cart.position.set(-0.8, -0.78, 0);
  cart.userData.role = "cart";
  root.add(cart);
  [-1.15, -0.45].forEach((x) => {
    const wheel = cylinder(0.14, 0.14, 0.15, 0x0f172a);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, -1.04, 0.42);
    wheel.userData.role = "wheel";
    root.add(wheel);
  });
  addArrow(root, new THREE.Vector3(0, -0.72, 0), new THREE.Vector3(clamp(force / Math.max(1, mass), 0.8, 2.6), -0.72, 0), 0xf43f5e);
  addArrow(root, new THREE.Vector3(-1.7, -0.72, 0), new THREE.Vector3(-1.7 - clamp(friction, 0.4, 1.4), -0.72, 0), 0xfacc15);
}

function buildForceBalance(root: THREE.Group, leftForce: number, rightForce: number, mass: number) {
  addPlatform(root);
  const net = rightForce - leftForce;
  const body = box(1.15, 0.58, 0.82, Math.abs(net) < 0.01 ? 0x94a3b8 : 0x38bdf8);
  body.position.set(0, -0.72, 0);
  body.userData.role = Math.abs(net) < 0.01 ? "pulse" : "force-balance";
  body.userData.direction = Math.sign(net);
  body.userData.power = clamp(Math.abs(net) / Math.max(1, mass), 0.25, 2.2);
  root.add(body);
  [-0.38, 0.38].forEach((x) => {
    const wheel = cylinder(0.13, 0.13, 0.14, 0x020617);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, -0.35, 0.48);
    wheel.userData.role = "wheel";
    body.add(wheel);
  });

  const leftLength = clamp(leftForce / 80, 0.35, 2.15);
  const rightLength = clamp(rightForce / 80, 0.35, 2.15);
  addArrow(root, new THREE.Vector3(-0.72, -0.66, 0), new THREE.Vector3(-0.72 - leftLength, -0.66, 0), 0xf43f5e);
  addArrow(root, new THREE.Vector3(0.72, -0.66, 0), new THREE.Vector3(0.72 + rightLength, -0.66, 0), 0x34d399);
  if (Math.abs(net) > 0.01) {
    const direction = Math.sign(net);
    addArrow(root, new THREE.Vector3(0, 0.08, 0), new THREE.Vector3(direction * clamp(Math.abs(net) / Math.max(1, mass), 0.7, 2.7), 0.08, 0), 0xfacc15);
  } else {
    const lock = ring(0.42, 0x94a3b8);
    lock.position.set(0, 0.12, 0);
    lock.userData.role = "field";
    lock.userData.phase = 0;
    lock.userData.power = 1.1;
    root.add(lock);
  }
  root.add(label("left pull", new THREE.Vector3(-2.45, -0.28, 0), 0xf43f5e));
  root.add(label("right pull", new THREE.Vector3(2.25, -0.28, 0), 0x34d399));
  root.add(label(Math.abs(net) < 0.01 ? "balanced" : `net ${net.toFixed(0)} N`, new THREE.Vector3(-0.15, 0.62, 0), 0xfacc15));
}

function buildIncline(root: THREE.Group, mass: number, angle: number, friction: number) {
  root.userData.hasInclineBlock = true;
  const g = 9.81;
  const m = Math.max(0.1, mass);
  const theta = THREE.MathUtils.degToRad(clamp(angle, 1, 80));
  const mu = clamp(friction, 0, 2);
  const rampLength = 4.6;
  const rampThickness = 0.18;
  const rampDepth = 1.7;
  const blockHeight = 0.44;
  const blockWidth = 0.65;
  const rampCenter = new THREE.Vector3(0, -0.55, 0);
  const tangent = new THREE.Vector3(Math.cos(theta), -Math.sin(theta), 0).normalize();
  const normal = new THREE.Vector3(Math.sin(theta), Math.cos(theta), 0).normalize();
  const clearance = rampThickness / 2 + blockHeight / 2 + 0.035;
  const slideStart = -rampLength * 0.34;
  const slideEnd = rampLength * 0.34;
  const normalForce = m * g * Math.cos(theta);
  const gravityDownPlane = m * g * Math.sin(theta);
  const frictionForce = mu * normalForce;
  const netDownPlane = gravityDownPlane - frictionForce;
  const acceleration = Math.max(0, netDownPlane / m);
  const moving = acceleration > 0.015;

  const ramp = box(rampLength, rampThickness, rampDepth, 0x475569);
  ramp.rotation.z = -theta;
  ramp.position.copy(rampCenter);
  root.add(ramp);

  const contactStrip = box(rampLength * 0.94, 0.018, rampDepth * 0.86, moving ? 0x22d3ee : 0xfacc15);
  contactStrip.rotation.z = -theta;
  contactStrip.position.copy(rampCenter.clone().addScaledVector(normal, rampThickness / 2 + 0.018));
  root.add(contactStrip);

  const block = box(blockWidth, blockHeight, 0.62, moving ? 0x22d3ee : 0xfacc15);
  block.rotation.z = -theta;
  block.position.copy(pointOnIncline(rampCenter, tangent, normal, slideStart, clearance));
  block.userData.role = "incline-block";
  block.userData.rampCenter = rampCenter;
  block.userData.tangent = tangent;
  block.userData.normal = normal;
  block.userData.clearance = clearance;
  block.userData.slideStart = slideStart;
  block.userData.slideEnd = slideEnd;
  block.userData.speed = moving ? clamp(Math.sqrt(acceleration) * 0.42, 0.32, 2.8) : 0;
  block.userData.moving = moving;
  block.userData.theta = theta;
  root.add(block);

  const samplePosition = pointOnIncline(rampCenter, tangent, normal, -0.2, clearance + 0.42);
  addArrow(root, samplePosition, samplePosition.clone().add(new THREE.Vector3(0, -clamp(m * g / 55, 0.45, 1.3), 0)), 0xf43f5e);
  addArrow(root, samplePosition, samplePosition.clone().addScaledVector(normal, clamp(normalForce / 55, 0.35, 1.25)), 0x38bdf8);
  addArrow(root, samplePosition, samplePosition.clone().addScaledVector(tangent, -clamp(frictionForce / 55, 0.25, 1.1)), 0xfacc15);
  if (moving) {
    addArrow(root, samplePosition.clone().addScaledVector(normal, -0.2), samplePosition.clone().addScaledVector(tangent, clamp(netDownPlane / 55, 0.35, 1.45)), 0x34d399);
  }
  root.add(label(`a = ${acceleration.toFixed(2)} m/s^2`, samplePosition.clone().add(new THREE.Vector3(0.15, 0.55, 0.08)), moving ? 0x34d399 : 0xfacc15));
  root.add(label(moving ? "block stays on ramp surface" : "static friction holds", pointOnIncline(rampCenter, tangent, normal, slideEnd - 0.35, clearance + 0.26), moving ? 0x22d3ee : 0xfacc15));
}

function buildEnergy(root: THREE.Group, mass: number, height: number, loss: number) {
  const ramp = box(4.4, 0.16, 1.35, 0x64748b);
  ramp.rotation.z = -0.45;
  ramp.position.set(-0.35, -0.3, 0);
  root.add(ramp);
  const ball = sphere(0.22 + clamp(mass / 80, 0, 0.12), 0xfacc15);
  ball.userData.role = "slide";
  ball.userData.theta = 0.45;
  ball.userData.speed = clamp(height * (1 - loss), 0.4, 5);
  root.add(ball);
  addArrow(root, new THREE.Vector3(-2.3, 0.75, 0), new THREE.Vector3(-2.3, -0.65, 0), 0x34d399);
}

function buildPendulum(root: THREE.Group, length: number, _mass: number, damping: number) {
  const pivot = sphere(0.09, 0xfacc15);
  pivot.position.set(0, 1.5, 0);
  root.add(pivot);
  const pendulum = new THREE.Group();
  pendulum.position.copy(pivot.position);
  pendulum.userData.role = "pendulum";
  pendulum.userData.length = clamp(length, 0.9, 2.8);
  pendulum.userData.damping = clamp(damping, 0, 0.45);
  const rod = cylinder(0.025, 0.025, pendulum.userData.length, 0x94a3b8);
  rod.position.y = -pendulum.userData.length / 2;
  pendulum.add(rod);
  const bob = sphere(0.2, 0x22d3ee);
  bob.position.y = -pendulum.userData.length;
  pendulum.add(bob);
  root.add(pendulum);
}

function buildCircular(root: THREE.Group, mass: number, radius: number, omega: number) {
  const r = clamp(radius, 1.1, 2.7);
  root.add(ring(r, 0x22d3ee));
  const orbit = sphere(0.16 + clamp(mass / 100, 0, 0.12), 0x38bdf8);
  orbit.userData.role = "orbit";
  orbit.userData.radius = r;
  orbit.userData.speed = clamp(omega, 0.4, 6);
  root.add(orbit);
  addArrow(root, new THREE.Vector3(r, -0.75, 0), new THREE.Vector3(0.2, -0.75, 0), 0xf43f5e);
}

function buildGravityMap(root: THREE.Group, centralMass: number, testMass: number, distance: number) {
  const sourceRadius = 0.36 + clamp(centralMass / 10, 0, 0.34);
  const orbitRadius = clamp(distance / 14, 0.95, 3.1);
  const planet = sphere(sourceRadius, 0x38bdf8);
  planet.position.y = -0.4;
  planet.userData.role = "pulse";
  root.add(planet);

  for (let index = 1; index <= 5; index += 1) {
    const r = 0.52 + index * 0.5;
    const shell = line(Array.from({ length: 96 }, (_, step) => {
      const theta = (step / 95) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(theta) * r, -0.4, Math.sin(theta) * r);
    }), index === 1 ? 0x22d3ee : 0x334155);
    shell.userData.role = "field";
    shell.userData.phase = index * 0.3;
    shell.userData.power = clamp(centralMass / (index * 6), 0.25, 1.35);
    root.add(shell);
  }

  const satellite = sphere(0.12 + clamp(testMass / 1000, 0, 0.12), 0xfacc15);
  satellite.userData.role = "orbit";
  satellite.userData.radius = orbitRadius;
  satellite.userData.speed = clamp(centralMass / Math.sqrt(Math.max(1, distance)), 0.25, 2.7);
  root.add(satellite);
  const pullStart = new THREE.Vector3(orbitRadius, -0.55, 0);
  const pullEnd = new THREE.Vector3(clamp(sourceRadius + 0.15, 0.55, 0.9), -0.45, 0);
  addArrow(root, pullStart, pullEnd, 0xf43f5e);
  addArrow(root, new THREE.Vector3(-2.8, 1.05, 0), new THREE.Vector3(-2.8, 1.05 - clamp(centralMass / Math.max(1, distance), 0.35, 1.35), 0), 0x34d399);
  root.add(label("source mass", new THREE.Vector3(-0.55, 0.45, 0), 0x38bdf8));
  root.add(label("1 / r^2 field", new THREE.Vector3(-2.3, 1.45, 0), 0x34d399));
  root.add(label("test mass", new THREE.Vector3(orbitRadius - 0.6, 0.42, 0.2), 0xfacc15));
}

function buildBuoyancy(root: THREE.Group, objectDensity: number, fluidDensity: number, _unused = 0) {
  const tank = box(3.8, 1.6, 1.8, 0x38bdf8, 0.16);
  tank.position.y = -0.35;
  root.add(tank);
  const water = box(3.65, 1.05, 1.65, 0x0ea5e9, 0.38);
  water.position.y = -0.55;
  water.userData.role = "water";
  root.add(water);
  const block = box(0.72, 0.58, 0.72, objectDensity < fluidDensity ? 0xa3e635 : 0x94a3b8);
  block.position.y = objectDensity < fluidDensity ? -0.12 : -0.72;
  block.userData.role = "float";
  root.add(block);
  addArrow(root, new THREE.Vector3(1.45, -0.75, 0), new THREE.Vector3(1.45, 0.35, 0), 0x34d399);
}

function buildDensityTank(root: THREE.Group, fluidDensity: number, volume: number, objectDensity: number) {
  const tankFrame = box(3.95, 1.75, 1.9, 0x94a3b8, 0.1);
  tankFrame.position.y = -0.35;
  root.add(tankFrame);
  const water = box(3.7, 1.18, 1.68, 0x0ea5e9, 0.38);
  water.position.y = -0.55;
  water.userData.role = "water";
  root.add(water);
  const fraction = clamp(objectDensity / Math.max(1, fluidDensity), 0.08, 1.25);
  const floats = fraction < 0.98;
  const neutral = fraction >= 0.98 && fraction <= 1.02;
  const blockHeight = 0.45 + clamp(volume / 28, 0, 0.25);
  const block = box(0.85, blockHeight, 0.85, floats ? 0xa3e635 : neutral ? 0xfacc15 : 0xf97316, 0.92);
  block.position.y = floats ? -0.08 - fraction * 0.25 : neutral ? -0.48 : -0.95;
  block.userData.role = "float";
  root.add(block);

  const submergedHeight = clamp(blockHeight * Math.min(1, fraction), 0.08, blockHeight);
  const submerged = box(0.9, submergedHeight, 0.9, 0x22d3ee, 0.22);
  submerged.position.set(0, block.position.y - blockHeight / 2 + submergedHeight / 2, 0);
  root.add(submerged);
  addArrow(root, new THREE.Vector3(1.45, -0.8, 0), new THREE.Vector3(1.45, -0.8 + clamp(fluidDensity / 900, 0.55, 1.45), 0), 0x34d399);
  addArrow(root, new THREE.Vector3(-1.45, 0.1, 0), new THREE.Vector3(-1.45, 0.1 - clamp(objectDensity / 1600, 0.45, 1.55), 0), 0xf43f5e);
  [0, 1, 2, 3, 4].forEach((index) => {
    const bubble = sphere(0.045, 0x67e8f9, 0.55);
    bubble.position.set(-1.35 + index * 0.62, -0.92 + (index % 2) * 0.36, 0.62 - index * 0.12);
    bubble.userData.role = "particle";
    bubble.userData.seed = index * 1.7;
    bubble.userData.speed = 0.9 + index * 0.18;
    root.add(bubble);
  });
  root.add(label("buoyant force", new THREE.Vector3(1.65, 0.65, 0), 0x34d399));
  root.add(label("weight", new THREE.Vector3(-1.9, -0.15, 0), 0xf43f5e));
  root.add(label(floats ? "floats" : neutral ? "neutral" : "sinks", new THREE.Vector3(-0.35, 0.78, 0), floats ? 0xa3e635 : neutral ? 0xfacc15 : 0xf97316));
}

function buildFluid(root: THREE.Group, force: number, area: number, depth: number) {
  buildBuoyancy(root, 500, 1000);
  const probe = sphere(0.14, 0xf43f5e);
  probe.position.set(-1.2, clamp(0.25 - depth / 80, -1, 0.35), 0);
  probe.userData.role = "pulse";
  root.add(probe);
  addArrow(root, new THREE.Vector3(-2.2, probe.position.y, 0), new THREE.Vector3(-2.2 + clamp(force / Math.max(area, 0.2), 0.5, 1.9), probe.position.y, 0), 0xf43f5e);
}

function buildThermal(root: THREE.Group, temperature: number, mass: number, volume: number) {
  const chamber = box(3.4, 1.8, 1.8, 0xf97316, 0.12);
  root.add(chamber);
  const count = 26;
  for (let index = 0; index < count; index += 1) {
    const particle = sphere(0.055 + clamp(mass / 100, 0, 0.04), index % 3 === 0 ? 0xfacc15 : 0xfb923c);
    particle.position.set(((index % 7) - 3) * 0.42, -0.65 + Math.floor(index / 7) * 0.42, ((index % 5) - 2) * 0.26);
    particle.userData.role = "particle";
    particle.userData.speed = clamp((temperature + 30) / 180 + volume / 10, 0.3, 3);
    particle.userData.seed = index;
    root.add(particle);
  }
}

function buildCalorimetry(root: THREE.Group, hotMass: number, hotTemperature: number, coldMass: number) {
  const coldTemperature = 25;
  const finalTemperature = (Math.max(0.01, hotMass) * hotTemperature + Math.max(0.01, coldMass) * coldTemperature) / (Math.max(0.01, hotMass) + Math.max(0.01, coldMass));
  const calorimeter = cylinder(0.82, 0.95, 1.45, 0x94a3b8, 0.22);
  calorimeter.position.set(0, -0.38, 0);
  root.add(calorimeter);
  const mixedWaterHeight = clamp((hotMass + coldMass) / 5, 0.28, 1.05);
  const mixedWater = cylinder(0.72, 0.78, mixedWaterHeight, 0x38bdf8, 0.42);
  mixedWater.position.set(0, -1.04 + mixedWaterHeight / 2, 0);
  mixedWater.userData.role = "water";
  root.add(mixedWater);

  const hotBeaker = cylinder(0.36, 0.42, 0.82, 0xf97316, 0.24);
  hotBeaker.position.set(-2.1, 0.15, 0);
  root.add(hotBeaker);
  const coldBeaker = cylinder(0.36, 0.42, 0.82, 0x38bdf8, 0.24);
  coldBeaker.position.set(2.1, 0.15, 0);
  root.add(coldBeaker);
  root.add(tube([new THREE.Vector3(-1.8, -0.1, 0), new THREE.Vector3(-1.2, -0.55, 0.15), new THREE.Vector3(-0.55, -0.55, 0.04)], 0.035, 0xf97316, 0.72));
  root.add(tube([new THREE.Vector3(1.8, -0.1, 0), new THREE.Vector3(1.2, -0.55, -0.15), new THREE.Vector3(0.55, -0.55, -0.04)], 0.035, 0x38bdf8, 0.72));

  const thermometer = box(0.09, 1.5, 0.09, 0xe2e8f0, 0.58);
  thermometer.position.set(1.15, -0.18, 0.18);
  root.add(thermometer);
  const mercuryHeight = clamp((finalTemperature - 20) / 80, 0.08, 1);
  const mercury = box(0.055, mercuryHeight * 1.24, 0.055, finalTemperature > 60 ? 0xf43f5e : 0xfacc15, 0.94);
  mercury.position.set(1.15, -0.86 + mercuryHeight * 0.62, 0.18);
  mercury.userData.role = "pulse";
  root.add(mercury);

  for (let index = 0; index < 28; index += 1) {
    const isHot = index % 2 === 0;
    const particle = sphere(0.047, isHot ? 0xf97316 : 0x38bdf8, 0.82);
    particle.position.set(((index % 7) - 3) * 0.17, -0.86 + Math.floor(index / 7) * 0.16, ((index % 5) - 2) * 0.13);
    particle.userData.role = "particle";
    particle.userData.seed = index * 0.77;
    particle.userData.speed = clamp((isHot ? hotTemperature : coldTemperature) / 50, 0.6, 2.8);
    root.add(particle);
  }
  const balanceGlow = ring(0.98, finalTemperature > 55 ? 0xf97316 : 0xfacc15);
  balanceGlow.position.y = 0.32;
  balanceGlow.userData.role = "field";
  balanceGlow.userData.phase = 0.5;
  balanceGlow.userData.power = 1.15;
  root.add(balanceGlow);
  root.add(label("hot sample", new THREE.Vector3(-2.55, 0.95, 0), 0xf97316));
  root.add(label("cold sample", new THREE.Vector3(1.58, 0.95, 0), 0x38bdf8));
  root.add(label(`Tf ${finalTemperature.toFixed(1)} C`, new THREE.Vector3(-0.48, 1.22, 0), finalTemperature > 55 ? 0xf97316 : 0xfacc15));
}

function buildCircuit(root: THREE.Group, voltage: number, resistance: number, _unused = 0) {
  const path = rectanglePath(2.8, 1.45);
  root.add(line(path, 0x94a3b8));
  const battery = box(0.5, 0.85, 0.45, 0x22d3ee);
  battery.position.set(-1.45, -0.85, 0);
  root.add(battery);
  const resistor = box(0.9, 0.35, 0.35, 0xfacc15);
  resistor.position.set(0, 0.65, 0);
  root.add(resistor);
  const bulb = sphere(0.32, 0xfde68a);
  bulb.position.set(1.5, -0.05, 0);
  bulb.userData.role = "bulb";
  bulb.userData.power = clamp(voltage / Math.max(1, resistance), 0.15, 4);
  root.add(bulb);
  for (let index = 0; index < 8; index += 1) {
    const charge = sphere(0.06, 0x22d3ee);
    charge.userData.role = "charge";
    charge.userData.path = path;
    charge.userData.offset = index / 8;
    charge.userData.speed = clamp(voltage / Math.max(1, resistance), 0.18, 3);
    root.add(charge);
  }
}

function buildElectromagnet(root: THREE.Group, turns: number, current: number, core: number) {
  const coreMesh = cylinder(0.28, 0.28, 3.5, 0x64748b);
  coreMesh.rotation.z = Math.PI / 2;
  root.add(coreMesh);
  root.add(helix(1.75, 0.45, Math.round(clamp(turns / 30, 6, 18)), 0xf97316));
  for (let index = 0; index < 5; index += 1) {
    const field = ring(0.75 + index * 0.3, 0x22d3ee);
    field.rotation.y = Math.PI / 2;
    field.userData.role = "field";
    field.userData.phase = index * 0.35;
    field.userData.power = clamp(current * core, 0.4, 5);
    root.add(field);
  }
}

function buildInduction(root: THREE.Group, turns: number, flux: number, time: number) {
  const current = Math.max(0.4, flux / Math.max(1, time));
  buildElectromagnet(root, turns, current, 1.3);
  const magnet = new THREE.Group();
  const north = box(0.55, 0.55, 0.58, 0xf43f5e);
  const south = box(0.55, 0.55, 0.58, 0x38bdf8);
  north.position.z = 0.3;
  south.position.z = -0.3;
  magnet.add(north, south);
  magnet.userData.role = "magnet";
  root.add(magnet);
  for (let index = 0; index < 7; index += 1) {
    const ribbon = tube([
      new THREE.Vector3(-2.55, -0.75 + index * 0.25, -0.8),
      new THREE.Vector3(-0.8, -0.35 + Math.sin(index) * 0.18, -0.15),
      new THREE.Vector3(0.85, -0.35 + Math.cos(index) * 0.18, 0.15),
      new THREE.Vector3(2.45, -0.75 + index * 0.25, 0.8),
    ], 0.012, 0x22d3ee, 0.18 + index * 0.05);
    ribbon.userData.role = "field";
    ribbon.userData.phase = index * 0.3;
    ribbon.userData.power = clamp(current * 9, 0.5, 4);
    root.add(ribbon);
  }
  const dialBase = cylinder(0.42, 0.42, 0.08, 0x334155, 0.92);
  dialBase.rotation.x = Math.PI / 2;
  dialBase.position.set(2.55, -0.85, 0);
  root.add(dialBase);
  const needle = box(0.07, 0.62, 0.04, 0xfacc15);
  needle.position.set(2.55, -0.85, 0.04);
  needle.userData.role = "needle";
  needle.userData.power = clamp(current * 8, 0.4, 2.4);
  root.add(needle);
  root.add(label("moving magnet", new THREE.Vector3(-2.55, 0.95, 0), 0xf43f5e));
  root.add(label("changing flux", new THREE.Vector3(0, 1.12, 0), 0x22d3ee));
  root.add(label("induced emf", new THREE.Vector3(2.15, -0.2, 0), 0xfacc15));
}

function buildGenerator(root: THREE.Group, turns: number, field: number, frequency: number) {
  const poles = [box(0.55, 2.25, 0.78, 0xf43f5e), box(0.55, 2.25, 0.78, 0x38bdf8)];
  poles[0].position.x = -1.8;
  poles[1].position.x = 1.8;
  root.add(...poles);
  root.add(label("N", new THREE.Vector3(-1.8, 1.55, 0), 0xf43f5e));
  root.add(label("S", new THREE.Vector3(1.8, 1.55, 0), 0x38bdf8));
  const coil = new THREE.Group();
  coil.userData.role = "spin";
  coil.userData.speed = clamp(frequency / 10, 0.5, 8);
  coil.add(tube([new THREE.Vector3(-0.85, -0.75, 0), new THREE.Vector3(0.85, -0.75, 0), new THREE.Vector3(0.85, 0.75, 0), new THREE.Vector3(-0.85, 0.75, 0), new THREE.Vector3(-0.85, -0.75, 0)], 0.025, 0xfacc15, 0.95));
  coil.add(box(0.18, 0.18, 1.85, 0xfacc15, 0.85));
  root.add(coil);
  const rings = [ring(0.26, 0xfacc15), ring(0.36, 0xfacc15)];
  rings.forEach((item, index) => {
    item.rotation.x = Math.PI / 2;
    item.position.set(0.95 + index * 0.22, -0.9, 0);
    item.userData.role = "spin";
    item.userData.speed = clamp(frequency / 10, 0.5, 8);
    root.add(item);
  });
  const waveform = sineWave(2.8, 0.62, clamp(turns * field / 250, 0.18, 0.95), 0x22d3ee);
  waveform.position.x = 0.1;
  waveform.userData.role = "wave-shift";
  waveform.userData.speed = clamp(frequency / 20, 0.25, 4);
  root.add(waveform);
  root.add(label("rotating coil", new THREE.Vector3(-0.65, 1.34, 0), 0xfacc15));
  root.add(label("AC output", new THREE.Vector3(1.35, -0.2, -1.2), 0x22d3ee));
}

function buildTransformer(root: THREE.Group, primaryVoltage: number, primaryTurns: number, secondaryTurns: number) {
  const core = box(2.9, 1.65, 0.5, 0x64748b, 0.46);
  root.add(core);
  const primary = helix(0.95, 0.42, Math.round(clamp(primaryTurns / 80, 5, 13)), 0xf97316);
  primary.position.x = -0.85;
  root.add(primary);
  const secondary = helix(0.95, 0.42, Math.round(clamp(secondaryTurns / 100, 5, 16)), 0x22d3ee);
  secondary.position.x = 0.85;
  root.add(secondary);
  for (let index = 0; index < 5; index += 1) {
    const fieldLoop = roundedFluxLoop(1.65 + index * 0.05, 0.78 + index * 0.03, 0x34d399);
    fieldLoop.userData.role = "field";
    fieldLoop.userData.phase = index * 0.22;
    fieldLoop.userData.power = clamp(primaryVoltage / 80, 0.5, 3);
    root.add(fieldLoop);
  }
  const ratio = secondaryTurns / Math.max(1, primaryTurns);
  const primaryBar = box(0.2, clamp(primaryVoltage / 120, 0.25, 1.45), 0.16, 0xf97316, 0.86);
  primaryBar.position.set(-2.35, -0.95 + primaryBar.scale.y * 0, -0.95);
  root.add(primaryBar);
  const secondaryBar = box(0.2, clamp((primaryVoltage * ratio) / 120, 0.25, 1.6), 0.16, 0x22d3ee, 0.86);
  secondaryBar.position.set(2.35, -0.95, -0.95);
  root.add(secondaryBar);
  root.add(label("primary AC", new THREE.Vector3(-1.65, 1.25, 0), 0xf97316));
  root.add(label("shared flux core", new THREE.Vector3(0, 1.35, 0), 0x34d399));
  root.add(label(ratio >= 1 ? "step-up" : "step-down", new THREE.Vector3(1.62, 1.25, 0), 0x22d3ee));
}

function buildLens(root: THREE.Group, a: number, b: number, _unused = 0) {
  const bench = box(6.5, 0.045, 0.08, 0x475569, 0.72);
  bench.position.y = -0.82;
  root.add(bench);
  const lens = sphere(0.95, 0x67e8f9, 0.34);
  lens.scale.set(0.18, 1.45, 1.02);
  root.add(lens);
  const objectDistance = clamp(a / 8, 0.8, 2.8);
  const focalRatio = clamp(a / Math.max(1, b), 0.28, 2);
  const objectX = -2.5;
  const imageX = clamp(1.15 + focalRatio * 1.2, 1.35, 3.15);
  const objectArrow = box(0.06, 1.0, 0.06, 0xf43f5e);
  objectArrow.position.set(objectX, -0.3, 0);
  root.add(objectArrow);
  addArrow(root, new THREE.Vector3(objectX, 0.2, 0), new THREE.Vector3(objectX, 0.8, 0), 0xf43f5e);
  const screen = box(0.05, 1.85, 1.25, 0x334155, 0.5);
  screen.position.x = imageX;
  root.add(screen);
  [-0.58, 0, 0.58].forEach((y, index) => {
    const z = (index - 1) * 0.28;
    root.add(tube([new THREE.Vector3(objectX, 0.55, z), new THREE.Vector3(0, y * 0.18, z * 0.5), new THREE.Vector3(imageX, -0.55, z * -0.4)], 0.014, index === 1 ? 0xffffff : 0xfacc15, 0.86));
  });
  const photon = sphere(0.08, 0xfacc15);
  photon.userData.role = "path";
  photon.userData.path = [new THREE.Vector3(objectX, 0.55, 0), new THREE.Vector3(0, 0.05, 0), new THREE.Vector3(imageX, -0.55, 0)];
  root.add(photon);
  addMarker(root, new THREE.Vector3(-objectDistance, -0.82, 0), 0xfacc15);
  addMarker(root, new THREE.Vector3(objectDistance, -0.82, 0), 0xfacc15);
  root.add(label("object", new THREE.Vector3(objectX - 0.25, 1.1, 0), 0xf43f5e));
  root.add(label("convex lens", new THREE.Vector3(-0.15, 1.55, 0), 0x67e8f9));
  root.add(label("image screen", new THREE.Vector3(imageX - 0.35, 1.1, 0), 0x22d3ee));
  root.add(label("F", new THREE.Vector3(objectDistance, -0.45, 0), 0xfacc15));
}

function buildEyeFocus(root: THREE.Group, focusCm: number, retinaCm: number, defectMode: number) {
  const mode = Math.round(defectMode);
  const retinaX = 2.15;
  const focusOffset = mode === 0 ? clamp((focusCm - retinaCm) * 0.42, -0.42, 0.42) : clamp((focusCm - retinaCm) * 0.72, -0.9, 0.9);
  const uncorrectedFocusX = retinaX + focusOffset;
  const correctedFocusX = mode === 0 ? uncorrectedFocusX : retinaX;
  const lensColor = mode === 1 ? 0xa78bfa : mode === 2 ? 0x34d399 : 0x67e8f9;
  addPlatform(root);

  const eyeShell = sphere(1.42, 0xf8fafc, 0.18);
  eyeShell.scale.set(1.48, 0.86, 0.82);
  eyeShell.position.set(0.95, 0.12, 0);
  root.add(eyeShell);

  const vitreousGlow = sphere(1.28, 0xf97316, 0.12);
  vitreousGlow.scale.set(1.36, 0.74, 0.72);
  vitreousGlow.position.set(1.02, 0.12, 0);
  root.add(vitreousGlow);

  const cornea = sphere(0.52, 0x67e8f9, 0.26);
  cornea.scale.set(0.34, 0.96, 0.86);
  cornea.position.set(-0.92, 0.12, 0);
  root.add(cornea);

  const iris = ring(0.42, 0x38bdf8);
  iris.rotation.y = Math.PI / 2;
  iris.position.set(-0.64, 0.12, 0);
  root.add(iris);
  const pupil = sphere(0.16, 0x020617, 0.92);
  pupil.scale.set(0.32, 1, 1);
  pupil.position.set(-0.66, 0.12, 0);
  root.add(pupil);

  const eyeLens = sphere(0.42, 0xfacc15, 0.34);
  eyeLens.scale.set(0.42, 1.18, 0.88);
  eyeLens.position.set(-0.18, 0.12, 0);
  root.add(eyeLens);

  const retina = new THREE.Mesh(
    new THREE.SphereGeometry(1.18, 48, 24, -Math.PI / 4.3, Math.PI / 2.15, Math.PI / 4, Math.PI / 2),
    material(0xfb7185, 0.34)
  );
  retina.scale.set(0.38, 1.02, 0.92);
  retina.position.set(retinaX + 0.08, 0.12, 0);
  retina.rotation.y = Math.PI / 2;
  root.add(retina);

  const opticNerve = box(1.1, 0.22, 0.28, 0xf97316, 0.58);
  opticNerve.position.set(2.95, 0.06, 0.04);
  opticNerve.rotation.z = -0.08;
  root.add(opticNerve);

  if (mode > 0) {
    const correctiveLens = sphere(0.5, lensColor, 0.3);
    correctiveLens.scale.set(mode === 1 ? 0.14 : 0.34, 1.36, 1.02);
    correctiveLens.position.set(-2.15, 0.12, 0);
    root.add(correctiveLens);
    root.add(label(mode === 1 ? "concave lens" : "convex lens", new THREE.Vector3(-2.62, 1.42, 0), lensColor));
  }

  [-0.44, 0, 0.44].forEach((y, index) => {
    const z = (index - 1) * 0.18;
    const start = new THREE.Vector3(-3.25, y + 0.12, z);
    const correction = new THREE.Vector3(mode > 0 ? -2.15 : -1.74, mode === 1 ? y * 0.42 + 0.12 : mode === 2 ? y * 0.16 + 0.12 : y * 0.32 + 0.12, z * 0.58);
    const crystalline = new THREE.Vector3(-0.18, 0.12, z * 0.28);
    const uncorrectedEnd = new THREE.Vector3(uncorrectedFocusX, 0.12, z * -0.12);
    const correctedEnd = new THREE.Vector3(correctedFocusX, 0.12, z * -0.12);
    root.add(tube([start, correction, crystalline, uncorrectedEnd], 0.012, 0xfb7185, 0.42));
    root.add(tube([start.clone().add(new THREE.Vector3(0, 0.02, 0)), correction, crystalline, correctedEnd], 0.018, index === 1 ? 0xffffff : 0xfacc15, 0.92));
  });

  const photon = sphere(0.075, 0xfacc15);
  photon.userData.role = "path";
  photon.userData.path = [
    new THREE.Vector3(-3.25, 0.12, 0),
    new THREE.Vector3(mode > 0 ? -2.15 : -1.74, 0.12, 0),
    new THREE.Vector3(-0.18, 0.12, 0),
    new THREE.Vector3(correctedFocusX, 0.12, 0),
  ];
  root.add(photon);

  addMarker(root, new THREE.Vector3(uncorrectedFocusX, 0.12, -0.42), Math.abs(uncorrectedFocusX - retinaX) < 0.14 ? 0x34d399 : 0xfb7185);
  addMarker(root, new THREE.Vector3(correctedFocusX, 0.12, 0.42), Math.abs(correctedFocusX - retinaX) < 0.14 ? 0x34d399 : 0xfb7185);
  addArrow(root, new THREE.Vector3(-0.18, 1.06, 0), new THREE.Vector3(correctedFocusX, 0.34, 0), 0x22d3ee);
  root.add(label("cornea", new THREE.Vector3(-1.23, -0.72, 0), 0x67e8f9));
  root.add(label("eye lens", new THREE.Vector3(-0.54, 1.32, 0), 0xfacc15));
  root.add(label("retina screen", new THREE.Vector3(1.66, 1.42, 0), 0xfb7185));
  root.add(label(mode === 1 ? "myopia: before retina" : mode === 2 ? "hypermetropia: behind retina" : "normal: on retina", new THREE.Vector3(-2.55, -1.0, 0), mode === 0 ? 0x34d399 : 0xfacc15));
}

function buildPrism(root: THREE.Group, prismAngle: number, meanIndex: number, dispersion: number) {
  const model = makePrismModel(prismAngle, meanIndex, dispersion);
  const prism = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 1.2, 3), material(0xa78bfa, 0.32));
  prism.rotation.set(Math.PI / 2, 0, Math.PI / 6);
  root.add(prism);
  const screen = box(0.08, 1.9, 1.05, 0xe2e8f0, 0.42);
  screen.position.set(3.05, 0.08, 0);
  root.add(screen);
  root.add(line([new THREE.Vector3(-3.1, 0.55, 0), new THREE.Vector3(-0.55, 0.12, 0)], 0xffffff));
  root.add(line([new THREE.Vector3(-0.52, 0.12, 0), new THREE.Vector3(0.48, -0.02, 0)], 0xfde047));
  root.add(line([new THREE.Vector3(-0.55, 0.52, 0), new THREE.Vector3(-0.2, -0.32, 0)], 0x94a3b8, 0.65));
  root.add(line([new THREE.Vector3(0.25, 0.38, 0), new THREE.Vector3(0.75, -0.48, 0)], 0x94a3b8, 0.65));
  if (model.tirInside) {
    root.add(line([new THREE.Vector3(0.48, -0.02, 0), new THREE.Vector3(-0.25, -0.58, 0)], 0xfacc15));
    root.add(label("total internal reflection", new THREE.Vector3(0.65, 0.82, 0), 0xf43f5e));
  } else {
    model.rays.forEach((ray, index) => {
      const color = new THREE.Color(ray.color).getHex();
      const y = -0.54 + index * 0.18 + clamp(model.spreadDeg / 8, 0, 0.32);
      const z = (index - 3) * 0.06;
      root.add(line([new THREE.Vector3(0.48, -0.02, 0), new THREE.Vector3(2.95, y, z)], color));
      if (index === 0 || index === model.rays.length - 1) {
        root.add(label(ray.name.toLowerCase(), new THREE.Vector3(3.12, y, z), color));
      }
    });
  }
  model.rays.forEach((ray, index) => {
    const band = box(0.04, 0.1, 0.92, new THREE.Color(ray.color).getHex(), 0.82);
    band.position.set(3.12, -0.54 + index * 0.18 + clamp(model.spreadDeg / 8, 0, 0.32), 0);
    root.add(band);
  });
  root.add(label(`A ${model.prismAngleDeg.toFixed(0)} deg`, new THREE.Vector3(-0.15, -1.05, 0), 0xfacc15));
  root.add(label(`n ${model.meanIndex.toFixed(3)}`, new THREE.Vector3(-0.75, 0.95, 0), 0x67e8f9));
  root.add(label(`Dm ${model.minimumDeviationDeg.toFixed(1)} deg`, new THREE.Vector3(0.95, 0.92, 0), 0xfacc15));
  root.add(label(model.material.name.toLowerCase(), new THREE.Vector3(1.75, -1.02, 0), 0xe2e8f0));
}

function buildInterference(root: THREE.Group, frequency: number, amplitude: number, _unused = 0) {
  [-0.7, 0.7].forEach((x) => {
    const source = sphere(0.13, 0x22d3ee);
    source.position.set(-1.8, x, 0);
    source.userData.role = "pulse";
    root.add(source);
    for (let index = 0; index < 5; index += 1) {
      const wave = ring(0.35 + index * 0.36, 0x22d3ee);
      wave.position.set(-1.8, x, 0);
      wave.userData.role = "wave";
      wave.userData.phase = index * 0.4;
      wave.userData.speed = clamp(frequency / 300, 0.3, 3);
      root.add(wave);
    }
  });
  for (let index = 0; index < 9; index += 1) {
    const fringe = box(0.08, 0.16 + Math.abs(Math.sin(index)) * clamp(amplitude, 0.2, 1.8), 1.25, index % 2 ? 0x334155 : 0xfacc15, index % 2 ? 0.35 : 0.78);
    fringe.position.set(2.45, -1.4 + index * 0.35, 0);
    root.add(fringe);
  }
}

function buildPhotoelectric(root: THREE.Group, photonEnergy: number, workFunction: number, _unused = 0) {
  const plate = box(0.45, 1.7, 1.2, 0x64748b);
  plate.position.x = -0.65;
  root.add(plate);
  for (let index = 0; index < 5; index += 1) {
    const photon = sphere(0.07, 0xfacc15);
    photon.userData.role = "photon";
    photon.userData.offset = index / 5;
    root.add(photon);
  }
  if (photonEnergy > workFunction) {
    for (let index = 0; index < 4; index += 1) {
      const electron = sphere(0.06, 0x22d3ee);
      electron.userData.role = "electron";
      electron.userData.offset = index / 4;
      root.add(electron);
    }
  }
}

function buildBohr(root: THREE.Group, n1: number, n2: number, _unused = 0) {
  const initial = clamp(Math.round(n1), 1, 5);
  const final = clamp(Math.round(n2), 1, 5);
  const nucleus = sphere(0.2, 0xf43f5e);
  nucleus.userData.role = "pulse";
  root.add(nucleus);
  [1, 2, 3, 4, 5].forEach((level) => {
    const shell = ring(0.42 + level * 0.28, level === final ? 0x22d3ee : level === initial ? 0xfacc15 : 0x475569);
    shell.userData.role = level === final ? "field" : "";
    shell.userData.power = 1.4;
    shell.userData.phase = level * 0.2;
    root.add(shell);
  });
  const electron = sphere(0.08, 0x22d3ee);
  electron.userData.role = "orbit";
  electron.userData.radius = 0.42 + initial * 0.28;
  electron.userData.finalRadius = 0.42 + final * 0.28;
  electron.userData.speed = 1.7 + final * 0.18;
  root.add(electron);
  const transition = tube([
    new THREE.Vector3(0.42 + initial * 0.28, -0.72, 0),
    new THREE.Vector3(0.2, 0.6, 0.3),
    new THREE.Vector3(0.42 + final * 0.28, -0.72, 0),
  ], 0.012, final < initial ? 0xfacc15 : 0x38bdf8, 0.8);
  transition.userData.role = "field";
  transition.userData.power = 1.2;
  root.add(transition);
  const photonColor = final < initial ? 0xfacc15 : 0x38bdf8;
  const photon = tube([new THREE.Vector3(-2.65, 1.35, 0), new THREE.Vector3(-1.55, 1.05, 0.15), new THREE.Vector3(-0.65, 1.22, -0.1)], 0.018, photonColor, 0.95);
  photon.userData.role = "wave-shift";
  photon.userData.speed = 0.9;
  root.add(photon);
  for (let index = 1; index <= 5; index += 1) {
    const height = 1.35 / (index * index);
    const bar = box(0.55, 0.035, 0.035, index === final ? 0x22d3ee : index === initial ? 0xfacc15 : 0x64748b, 0.85);
    bar.position.set(2.05, -0.95 + height * 1.9, 0);
    root.add(bar);
    root.add(label(`n=${index}`, new THREE.Vector3(2.45, -0.95 + height * 1.9, 0), index === final ? 0x22d3ee : 0x94a3b8));
  }
  root.add(label(final < initial ? "emission" : final > initial ? "absorption" : "no jump", new THREE.Vector3(-2.52, 1.72, 0), photonColor));
  root.add(label("fixed shells", new THREE.Vector3(-0.6, 1.65, 0), 0x22d3ee));
  root.add(label("energy ladder", new THREE.Vector3(1.82, 1.45, 0), 0xfacc15));
}

function buildLogic(root: THREE.Group, inputA: number, inputB: number, gateIndex: number) {
  const gate = box(1.1, 0.9, 0.5, 0x22d3ee, 0.28);
  root.add(gate);
  const active = inputA >= 0.5 && (inputB >= 0.5 || gateIndex > 0);
  [-0.45, 0.45].forEach((y, index) => {
    root.add(line([new THREE.Vector3(-2.8, y, 0), new THREE.Vector3(-0.6, y, 0)], index === 0 ? (inputA >= 0.5 ? 0x34d399 : 0x475569) : (inputB >= 0.5 ? 0x34d399 : 0x475569)));
  });
  root.add(line([new THREE.Vector3(0.6, 0, 0), new THREE.Vector3(2.5, 0, 0)], active ? 0x34d399 : 0x475569));
  const led = sphere(0.24, active ? 0x34d399 : 0x475569);
  led.position.x = 2.75;
  led.userData.role = "bulb";
  led.userData.power = active ? 1.8 : 0.1;
  root.add(led);
}

function updateObjects(root: THREE.Group, t: number, values: [number, number, number]) {
  root.traverse((object) => {
    if (object.userData.role === "path") {
      const path = object.userData.path as THREE.Vector3[];
      object.position.copy(samplePath(path, (t * 0.22) % 1));
    }
    if (object.userData.role === "cart") object.position.x = -0.8 + Math.sin(t * 1.6) * 0.12;
    if (object.userData.role === "force-balance") object.position.x = Math.sin(t * 1.45) * 0.11 * object.userData.power * object.userData.direction;
    if (object.userData.role === "wheel") object.rotation.x = t * 5;
    if (object.userData.role === "slide") {
      const phase = (Math.sin(t * object.userData.speed) + 1) / 2;
      object.position.x = -1.45 + phase * 2.4;
      object.position.y = 0.55 - phase * 0.95;
    }
    if (object.userData.role === "incline-block") {
      const start = object.userData.slideStart as number;
      const end = object.userData.slideEnd as number;
      const rampCenter = object.userData.rampCenter as THREE.Vector3;
      const tangent = object.userData.tangent as THREE.Vector3;
      const normal = object.userData.normal as THREE.Vector3;
      const clearance = object.userData.clearance as number;
      const speed = object.userData.speed as number;
      const moving = Boolean(object.userData.moving);
      const cycle = moving ? (t * speed) % 1 : 0.12 + Math.sin(t * 1.4) * 0.015;
      const progress = moving ? cycle * cycle : cycle;
      const alongRamp = start + (end - start) * progress;
      object.position.copy(pointOnIncline(rampCenter, tangent, normal, alongRamp, clearance));
    }
    if (object.userData.role === "pendulum") {
      const damping = 1 - object.userData.damping;
      object.rotation.z = Math.sin(t * 1.8) * 0.55 * damping;
      object.rotation.y = Math.sin(t * 0.9) * 0.14;
    }
    if (object.userData.role === "orbit") {
      const baseRadius = object.userData.radius;
      const finalRadius = object.userData.finalRadius ?? baseRadius;
      const jump = object.userData.finalRadius ? (Math.sin(t * 1.1) + 1) / 2 : 0;
      const radius = baseRadius + (finalRadius - baseRadius) * jump;
      const phase = t * object.userData.speed;
      object.position.set(Math.cos(phase) * radius, -0.55 + Math.sin(phase * 0.5) * 0.14, Math.sin(phase) * radius);
    }
    if (object.userData.role === "float") object.position.y += Math.sin(t * 2.1) * 0.003;
    if (object.userData.role === "water") object.scale.y = 1 + Math.sin(t * 1.6) * 0.025;
    if (object.userData.role === "particle") {
      const seed = object.userData.seed;
      const speed = object.userData.speed;
      object.position.x += Math.sin(t * speed + seed) * 0.006;
      object.position.y += Math.cos(t * speed * 1.2 + seed) * 0.006;
      object.position.z += Math.sin(t * speed * 0.8 + seed * 2) * 0.006;
    }
    if (object.userData.role === "charge") object.position.copy(samplePath(object.userData.path, (object.userData.offset + t * 0.08 * object.userData.speed) % 1));
    if (object.userData.role === "bulb") {
      const mesh = object as THREE.Mesh;
      mesh.scale.setScalar(1 + Math.sin(t * 3) * 0.05);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = object.userData.power;
    }
    if (object.userData.role === "field") object.scale.setScalar(1 + Math.sin(t * 2.5 + object.userData.phase) * 0.08 * object.userData.power);
    if (object.userData.role === "magnet") object.position.x = -1.8 + ((Math.sin(t * 1.5) + 1) / 2) * 3.6;
    if (object.userData.role === "needle") object.rotation.z = Math.sin(t * 2.1) * object.userData.power;
    if (object.userData.role === "spin") object.rotation.y = t * object.userData.speed;
    if (object.userData.role === "wave-shift") object.position.x = Math.sin(t * object.userData.speed) * 0.12;
    if (object.userData.role === "wave") object.scale.setScalar(0.82 + ((t * object.userData.speed + object.userData.phase) % 1) * 0.45);
    if (object.userData.role === "pulse") object.scale.setScalar(1 + Math.sin(t * 4) * 0.12);
    if (object.userData.role === "scan-ring") {
      object.rotation.z = t * object.userData.speed;
      object.scale.setScalar(0.92 + Math.sin(t * 1.25) * 0.06);
    }
    if (object.userData.role === "halo-ring") {
      object.rotation.z = -t * object.userData.speed;
      object.scale.setScalar(1 + Math.sin(t * 0.8) * 0.035);
    }
    if (object.userData.role === "ambient-spark") {
      const seed = object.userData.seed;
      object.position.y += Math.sin(t * object.userData.speed + seed) * 0.004;
      object.position.x += Math.cos(t * object.userData.speed * 0.7 + seed) * 0.003;
      const mesh = object as THREE.Mesh;
      mesh.scale.setScalar(0.8 + Math.sin(t * 2.2 + seed) * 0.22);
    }
    if (object.userData.role === "beacon") {
      const mesh = object as THREE.Mesh;
      mesh.scale.setScalar(1 + Math.sin(t * 3.4) * 0.25 * object.userData.power);
    }
    if (object.userData.role === "photon") object.position.set(-3 + ((object.userData.offset + t * 0.45) % 1) * 2.15, 0.62 - object.userData.offset * 0.32, 0);
    if (object.userData.role === "electron") object.position.set(-0.35 + ((object.userData.offset + t * 0.32) % 1) * 2.65, -0.6 + object.userData.offset * 0.38, 0.25);
  });
  root.position.y = Math.sin(t * 0.7) * 0.035;
  const hasInclineBlock = root.userData.hasInclineBlock === true;
  if (!hasInclineBlock && values[2] > 50) root.rotation.z = Math.sin(t * 0.2) * 0.02;
}

function addPlatform(root: THREE.Group) {
  const platform = box(4.7, 0.12, 1.45, 0x334155);
  platform.position.y = -1.08;
  root.add(platform);
}

function addArrow(root: THREE.Group, from: THREE.Vector3, to: THREE.Vector3, color: number) {
  root.add(cylinderBetween(from, to, 0.035, color));
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.32, 18), material(color));
  cone.position.copy(to);
  cone.quaternion.copy(directionQuaternion(from, to));
  root.add(cone);
}

function addMarker(root: THREE.Group, position: THREE.Vector3, color: number) {
  const marker = sphere(0.1, color, 0.9);
  marker.position.copy(position);
  marker.userData.role = "pulse";
  root.add(marker);
  const halo = ring(0.22, color);
  halo.position.copy(position);
  halo.rotation.x = Math.PI / 2;
  halo.userData.role = "field";
  halo.userData.power = 1.2;
  root.add(halo);
}

function pointOnIncline(center: THREE.Vector3, tangent: THREE.Vector3, normal: THREE.Vector3, alongRamp: number, normalOffset: number) {
  return center.clone().addScaledVector(tangent, alongRamp).addScaledVector(normal, normalOffset);
}

function box(width: number, height: number, depth: number, color: number, opacity = 1) {
  return new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material(color, opacity));
}

function sphere(radius: number, color: number, opacity = 1) {
  return new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 18), material(color, opacity));
}

function cylinder(radiusTop: number, radiusBottom: number, height: number, color: number, opacity = 1) {
  return new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 28), material(color, opacity));
}

function material(color: number, opacity = 1) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: opacity < 1 ? 0.08 : 0.025,
    metalness: 0.18,
    roughness: 0.38,
    opacity,
    transparent: opacity < 1,
  });
}

function line(points: THREE.Vector3[], color: number, opacity = 0.92) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const materialLine = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  return new THREE.Line(geometry, materialLine);
}

function tube(points: THREE.Vector3[], radius: number, color: number, opacity = 1) {
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, Math.max(12, points.length * 2), radius, 10, false);
  return new THREE.Mesh(geometry, material(color, opacity));
}

function ring(radius: number, color: number) {
  const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2);
  const points = curve.getPoints(96).map((point) => new THREE.Vector3(point.x, point.y - 0.72, point.y === point.y ? 0 : 0));
  return line(points, color);
}

function roundedFluxLoop(width: number, height: number, color: number) {
  const points = Array.from({ length: 96 }, (_, index) => {
    const angle = (index / 95) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(angle) * width, Math.sin(angle) * height - 0.05, Math.sin(angle * 2) * 0.08);
  });
  return tube(points, 0.01, color, 0.32);
}

function label(text: string, position: THREE.Vector3, color = 0x67e8f9) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 144;
  const context = canvas.getContext("2d");
  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(15, 23, 42, 0.94)";
    roundRect(context, 10, 24, 620, 88, 16);
    context.fill();
    context.strokeStyle = "rgba(203, 213, 225, 0.62)";
    context.lineWidth = 2;
    context.stroke();
    context.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
    roundRect(context, 28, 42, 10, 52, 5);
    context.fill();
    context.fillStyle = "#f8fafc";
    context.font = "800 30px Inter, Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 330, 68, 540);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }));
  sprite.position.copy(position);
  sprite.scale.set(1.55, 0.35, 1);
  return sprite;
}

function roundRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function helix(length: number, radius: number, turns: number, color: number) {
  const points = Array.from({ length: turns * 32 }, (_, index) => {
    const u = index / (turns * 32 - 1);
    const angle = u * turns * Math.PI * 2;
    return new THREE.Vector3(-length + u * length * 2, Math.cos(angle) * radius, Math.sin(angle) * radius);
  });
  return line(points, color);
}

function sineWave(width: number, y: number, amp: number, color: number) {
  return line(Array.from({ length: 80 }, (_, index) => {
    const u = index / 79;
    return new THREE.Vector3(-width / 2 + width * u, -1.25 + y + Math.sin(u * Math.PI * 4) * amp, -1.3);
  }), color);
}

function rectanglePath(width: number, height: number) {
  return [
    new THREE.Vector3(-width / 2, -height / 2, 0),
    new THREE.Vector3(width / 2, -height / 2, 0),
    new THREE.Vector3(width / 2, height / 2, 0),
    new THREE.Vector3(-width / 2, height / 2, 0),
    new THREE.Vector3(-width / 2, -height / 2, 0),
  ];
}

function cylinderBetween(from: THREE.Vector3, to: THREE.Vector3, radius: number, color: number) {
  const length = from.distanceTo(to);
  const mesh = cylinder(radius, radius, length, color);
  mesh.position.copy(from).add(to).multiplyScalar(0.5);
  mesh.quaternion.copy(directionQuaternion(from, to));
  return mesh;
}

function directionQuaternion(from: THREE.Vector3, to: THREE.Vector3) {
  const direction = new THREE.Vector3().subVectors(to, from).normalize();
  return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
}

function samplePath(path: THREE.Vector3[], progress: number) {
  const scaled = progress * (path.length - 1);
  const index = Math.floor(scaled);
  const next = Math.min(index + 1, path.length - 1);
  return new THREE.Vector3().lerpVectors(path[index], path[next], scaled - index);
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}
