import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
  values: [number, number];
  stage: number;
  playing: boolean;
  reducedMotion: boolean;
}

type LiveState = Props;

const NODE_POSITIONS: Array<[number, number, number]> = [
  [0, 2.55, 0], [-3.55, .45, .15], [3.55, .45, .15], [-2.45, -2.45, 0], [2.45, -2.45, 0],
];

export function StringTheoryNetworkThreeScene({ values, stage, playing, reducedMotion }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<LiveState>({ values, stage, playing, reducedMotion });
  useEffect(() => { stateRef.current = { values, stage, playing, reducedMotion }; }, [values, stage, playing, reducedMotion]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    } catch {
      host.innerHTML = "<p>Interactive 3D model requires WebGL.</p>";
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    host.replaceChildren(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x01090e, .035);
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 80);
    const root = new THREE.Group();
    scene.add(root);
    scene.add(new THREE.HemisphereLight(0x83eaff, 0x02080c, 1.2));
    const keyLight = new THREE.PointLight(0x30d9ff, 34, 24); keyLight.position.set(0, 1, 6); scene.add(keyLight);
    const amberLight = new THREE.PointLight(0xffa62f, 18, 16); amberLight.position.set(3, -3, 4); scene.add(amberLight);

    const colors = [0x42ddff, 0x42ddff, 0x42ddff, 0x49e5ae, 0xffb03b];
    const portals = NODE_POSITIONS.map((position, index) => buildPortal(root, position, colors[index], index));
    const links: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>[] = [];
    for (let a = 0; a < NODE_POSITIONS.length; a++) {
      for (let b = a + 1; b < NODE_POSITIONS.length; b++) {
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...NODE_POSITIONS[a]), new THREE.Vector3(...NODE_POSITIONS[b])]),
          new THREE.LineBasicMaterial({ color: (a === 4 || b === 4) ? 0xffa83a : 0x40dfff, transparent: true, opacity: .22 }),
        );
        root.add(line); links.push(line);
      }
    }
    root.rotation.x = -.08;
    const orbit = { theta: 0, phi: Math.PI / 2, radius: 12 };
    const updateCamera = () => {
      camera.position.setFromSpherical(new THREE.Spherical(orbit.radius, orbit.phi, orbit.theta));
      camera.lookAt(0, 0, 0);
    };
    updateCamera();

    let dragging = false, lastX = 0, lastY = 0;
    const down = (event: PointerEvent) => { dragging = true; lastX = event.clientX; lastY = event.clientY; host.setPointerCapture(event.pointerId); };
    const move = (event: PointerEvent) => { if (!dragging) return; orbit.theta -= (event.clientX - lastX) * .004; orbit.phi = clamp(orbit.phi + (event.clientY - lastY) * .0025, 1.08, 2.02); lastX = event.clientX; lastY = event.clientY; updateCamera(); };
    const up = (event: PointerEvent) => { dragging = false; try { host.releasePointerCapture(event.pointerId); } catch { /* no-op */ } };
    const wheel = (event: WheelEvent) => { event.preventDefault(); orbit.radius = clamp(orbit.radius + event.deltaY * .007, 8.8, 16); updateCamera(); };
    const key = (event: KeyboardEvent) => { if (event.key.startsWith("Arrow")) event.preventDefault(); if (event.key === "ArrowLeft") orbit.theta -= .1; if (event.key === "ArrowRight") orbit.theta += .1; if (event.key === "ArrowUp") orbit.radius = clamp(orbit.radius - .5, 8.8, 16); if (event.key === "ArrowDown") orbit.radius = clamp(orbit.radius + .5, 8.8, 16); if (event.key === "0") { orbit.theta = 0; orbit.phi = Math.PI / 2; orbit.radius = 12; } updateCamera(); };
    host.addEventListener("pointerdown", down); host.addEventListener("pointermove", move); host.addEventListener("pointerup", up); host.addEventListener("pointercancel", up); host.addEventListener("wheel", wheel, { passive: false }); host.addEventListener("keydown", key);

    const resize = () => { const r = host.getBoundingClientRect(); renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false); camera.aspect = r.width / Math.max(1, r.height); camera.updateProjectionMatrix(); };
    const observer = new ResizeObserver(resize); observer.observe(host); resize();
    const timer = new THREE.Timer(); timer.connect(document); let raf = 0;
    const animate = () => {
      timer.update();
      const t = timer.getElapsed(), state = stateRef.current;
      const active = state.stage % 5;
      const coupling = clamp(state.values[0], 0, 2);
      const chirality = state.values[1] < 0 ? -1 : 1;
      portals.forEach((portal, index) => {
        const selected = index === active;
        portal.scale.setScalar(THREE.MathUtils.lerp(portal.scale.x, selected ? 1.18 : .93, .08));
        portal.children.forEach((child) => {
          const mesh = child as THREE.Mesh;
          const material = mesh.material as THREE.MeshStandardMaterial | undefined;
          if (material?.emissiveIntensity !== undefined) material.emissiveIntensity = selected ? 2.7 : 1.25;
        });
        if (state.playing && !state.reducedMotion) {
          portal.rotation.z += (.0015 + index * .0003) * chirality;
          const knot = portal.userData.knot as THREE.Mesh | undefined;
          if (knot) { knot.rotation.x = Math.sin(t * .6 + index) * .22; knot.rotation.z += .003 * chirality; }
        }
      });
      links.forEach((line, index) => { line.material.opacity = .1 + coupling * .11 + (index % 4 === active % 4 ? .16 : 0); });
      updateCamera(); renderer.render(scene, camera); raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf); timer.dispose(); observer.disconnect();
      host.removeEventListener("pointerdown", down); host.removeEventListener("pointermove", move); host.removeEventListener("pointerup", up); host.removeEventListener("pointercancel", up); host.removeEventListener("wheel", wheel); host.removeEventListener("keydown", key);
      root.traverse((object) => { const mesh = object as THREE.Mesh; mesh.geometry?.dispose(); const material = mesh.material as THREE.Material | THREE.Material[] | undefined; if (Array.isArray(material)) material.forEach((item) => item.dispose()); else material?.dispose(); });
      renderer.dispose(); host.replaceChildren();
    };
  }, []);

  return <div className="st-three-scene st-network-three-scene" ref={hostRef} role="application" tabIndex={0} aria-label="Interactive three-dimensional map of the five superstring theories. Select a theory, adjust coupling and chirality, drag to rotate, use arrow keys to inspect, and press zero to reset the camera." />;
}

function buildPortal(root: THREE.Group, position: [number, number, number], color: number, index: number) {
  const portal = new THREE.Group(); portal.position.set(...position); root.add(portal);
  for (let ring = 0; ring < 4; ring++) {
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(.76 + ring * .095, .018 + ring * .006, 8, 96),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.5, roughness: .25, transparent: true, opacity: .76 - ring * .1 }),
    );
    torus.rotation.z = ring * .21; portal.add(torus);
  }
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(.36, .042, 120, 10, index % 2 ? 3 : 2, index % 3 + 2),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 2.1, metalness: .2, roughness: .18 }),
  );
  portal.add(knot); portal.userData.knot = knot;
  const halo = new THREE.Mesh(new THREE.CircleGeometry(.91, 72), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .035, side: THREE.DoubleSide })); halo.position.z = -.04; portal.add(halo);
  return portal;
}

function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
