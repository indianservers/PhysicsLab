import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type AstroThreeMode = "orbits" | "galaxy" | "black-hole" | "waves";

export function AstroThreeScene({ mode, intensity = 1 }: { mode: AstroThreeMode; intensity?: number }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ mode, intensity });

  useEffect(() => {
    stateRef.current = { mode, intensity };
  }, [mode, intensity]);

  const label = useMemo(() => {
    if (mode === "black-hole") return "3D black-hole lensing model";
    if (mode === "galaxy") return "3D rotating galaxy model";
    if (mode === "waves") return "3D gravitational-wave model";
    return "3D orbital mechanics model";
  }, [mode]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    } catch {
      mount.innerHTML = "<div class='concept-three-fallback'>3D view needs WebGL.</div>";
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020617, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    mount.replaceChildren(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x020617, 9, 26);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 90);
    const root = new THREE.Group();
    scene.add(root);
    scene.add(new THREE.HemisphereLight(0xe0f2fe, 0x020617, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(3, 5, 5);
    scene.add(key);
    const cyan = new THREE.PointLight(0x22d3ee, 12, 18);
    cyan.position.set(-4, 2, 4);
    scene.add(cyan);
    const amber = new THREE.PointLight(0xf59e0b, 9, 16);
    amber.position.set(4, -1, 3);
    scene.add(amber);

    const assets = buildAstroScene(root);
    const orbit = { theta: 0.1, phi: 1.28, radius: 8.6, target: new THREE.Vector3(0, 0, 0) };
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const updateCamera = () => {
      const spherical = new THREE.Spherical(orbit.radius, orbit.phi, orbit.theta);
      camera.position.setFromSpherical(spherical).add(orbit.target);
      camera.lookAt(orbit.target);
    };
    updateCamera();

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      mount.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      orbit.theta -= dx * 0.006;
      orbit.phi = clamp(orbit.phi + dy * 0.004, 0.62, 2.18);
      updateCamera();
    };
    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      try { mount.releasePointerCapture(event.pointerId); } catch { /* noop */ }
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      orbit.radius = clamp(orbit.radius + event.deltaY * 0.006, 5.2, 14);
      updateCamera();
    };
    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerup", onPointerUp);
    mount.addEventListener("pointercancel", onPointerUp);
    mount.addEventListener("wheel", onWheel, { passive: false });

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(300, Math.floor(rect.width));
      const height = Math.max(300, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      animateAstroScene(assets, stateRef.current.mode, t, stateRef.current.intensity);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      mount.removeEventListener("pointerdown", onPointerDown);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerup", onPointerUp);
      mount.removeEventListener("pointercancel", onPointerUp);
      mount.removeEventListener("wheel", onWheel);
      disposeObject(root);
      renderer.dispose();
      mount.replaceChildren();
    };
  }, []);

  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-md border border-cyan-300/20 bg-slate-950">
      <div ref={mountRef} className="absolute inset-0" aria-label={label} />
      <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-cyan-300/25 bg-slate-950/80 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
        Drag rotate | Wheel zoom
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-md border border-slate-700 bg-slate-950/80 p-3">
        <p className="text-sm font-black text-white">{label}</p>
        <p className="mt-1 text-xs font-semibold text-slate-400">Mode changes with selected concept and calculator context.</p>
      </div>
    </div>
  );
}

interface AstroSceneAssets {
  solar: THREE.Group;
  galaxy: THREE.Group;
  blackHole: THREE.Group;
  waves: THREE.Group;
  stars: THREE.Points;
}

function buildAstroScene(root: THREE.Group): AstroSceneAssets {
  const solar = buildSolarSystem();
  const galaxy = buildGalaxy();
  const blackHole = buildBlackHole();
  const waves = buildWaves();
  const stars = makeStars();
  root.add(stars, solar, galaxy, blackHole, waves);
  return { solar, galaxy, blackHole, waves, stars };
}

function buildSolarSystem() {
  const group = new THREE.Group();
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.55, 48, 24), material(0xfde047, 1, 0.7)));
  const colors = [0xa3a3a3, 0xf59e0b, 0x38bdf8, 0xef4444, 0xf97316, 0xfacc15, 0x67e8f9, 0x2563eb];
  colors.forEach((color, index) => {
    const radius = 1.05 + index * 0.38;
    const ring = new THREE.Mesh(new THREE.RingGeometry(radius - 0.006, radius + 0.006, 96), new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.24, side: THREE.DoubleSide }));
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
    const planet = new THREE.Mesh(new THREE.SphereGeometry(0.07 + index * 0.01, 24, 12), material(color, 1, 0.1));
    planet.userData = { radius, speed: 0.35 / Math.sqrt(index + 1), phase: index * 0.8 };
    group.add(planet);
  });
  return group;
}

function buildGalaxy() {
  const group = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.28, 48, 24), material(0xfef3c7, 1, 0.45));
  group.add(core);
  for (let arm = 0; arm < 2; arm += 1) {
    for (let i = 0; i < 130; i += 1) {
      const u = i / 130;
      const angle = u * Math.PI * 5 + arm * Math.PI;
      const r = 0.22 + u * 2.6;
      const star = new THREE.Mesh(new THREE.SphereGeometry(0.012 + (i % 5) * 0.002, 8, 6), material(i % 4 ? 0x93c5fd : 0xfde68a, 0.9, 0.2));
      star.position.set(Math.cos(angle) * r, (Math.random() - 0.5) * 0.08, Math.sin(angle) * r * 0.58);
      group.add(star);
    }
  }
  group.scale.set(1.25, 1.25, 1.25);
  return group;
}

function buildBlackHole() {
  const group = new THREE.Group();
  const horizon = new THREE.Mesh(new THREE.SphereGeometry(0.52, 64, 32), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  group.add(horizon);
  const disk = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.08, 16, 160), material(0xf97316, 0.95, 0.55));
  disk.rotation.x = Math.PI / 2.7;
  group.add(disk);
  const disk2 = new THREE.Mesh(new THREE.TorusGeometry(1.28, 0.035, 12, 160), material(0xfde68a, 0.7, 0.35));
  disk2.rotation.x = Math.PI / 2.65;
  group.add(disk2);
  const grid = new THREE.GridHelper(5, 22, 0x38bdf8, 0x334155);
  grid.position.y = -0.85;
  group.add(grid);
  return group;
}

function buildWaves() {
  const group = new THREE.Group();
  for (let i = 0; i < 7; i += 1) {
    const curve = new THREE.BufferGeometry();
    const positions = new Float32Array(140 * 3);
    curve.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const line = new THREE.Line(curve, new THREE.LineBasicMaterial({ color: i % 2 ? 0x22d3ee : 0xf59e0b, transparent: true, opacity: 0.8 }));
    line.userData = { offset: i * 0.45 };
    group.add(line);
  }
  return group;
}

function animateAstroScene(assets: AstroSceneAssets, mode: AstroThreeMode, t: number, intensity: number) {
  assets.stars.rotation.y += 0.0007;
  assets.solar.visible = mode === "orbits";
  assets.galaxy.visible = mode === "galaxy";
  assets.blackHole.visible = mode === "black-hole";
  assets.waves.visible = mode === "waves";
  assets.solar.rotation.y += 0.003;
  assets.solar.children.forEach((child) => {
    if (!("radius" in child.userData)) return;
    const radius = Number(child.userData.radius);
    const speed = Number(child.userData.speed);
    const phase = Number(child.userData.phase);
    child.position.set(Math.cos(t * speed + phase) * radius, 0, Math.sin(t * speed + phase) * radius);
  });
  assets.galaxy.rotation.y += 0.004 * intensity;
  assets.blackHole.rotation.y += 0.005;
  assets.blackHole.rotation.z = Math.sin(t * 0.28) * 0.06;
  assets.waves.children.forEach((line) => {
    const geometry = (line as THREE.Line).geometry as THREE.BufferGeometry;
    const position = geometry.getAttribute("position") as THREE.BufferAttribute;
    const offset = Number(line.userData.offset);
    for (let i = 0; i < position.count; i += 1) {
      const u = i / (position.count - 1);
      const x = -3.1 + u * 6.2;
      const y = Math.sin(u * Math.PI * 4 + t * 2 + offset) * 0.35;
      const z = -1.6 + offset;
      position.setXYZ(i, x, y, z);
    }
    position.needsUpdate = true;
  });
}

function makeStars() {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(700 * 3);
  for (let i = 0; i < 700; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 26;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xe0f2fe, size: 0.026, transparent: true, opacity: 0.75 }));
}

function material(color: number, opacity = 1, emissive = 0.12) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: emissive,
    transparent: opacity < 1,
    opacity,
    roughness: 0.32,
    metalness: 0.08,
  });
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    mesh.geometry?.dispose?.();
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((item) => item.dispose());
    else mat?.dispose?.();
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
