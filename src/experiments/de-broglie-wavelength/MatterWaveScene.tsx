import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { diffractionRadius } from "./deBroglieSimulation";

type Props = {
  phase: number;
  wavelengthPm: number;
  spacingNm: number;
  distanceM: number;
  intensity: number;
  onDistance: (value: number) => void;
  onSpacing: (value: number) => void;
};

export function MatterWaveScene(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const current = useRef(props);
  current.current = props;
  const resetView = useRef(() => {});
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (!host.current) return;
    const mount = host.current;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { setUnavailable(true); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 80);
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;
    orbit.enablePan = false;
    orbit.minDistance = 8;
    orbit.maxDistance = 17;
    orbit.maxPolarAngle = Math.PI * .7;
    resetView.current = () => { camera.position.set(7, 3.5, 10); orbit.target.set(0, 0, 0); orbit.update(); };
    resetView.current();
    scene.add(new THREE.HemisphereLight(0xbfe8ff, 0x252132, 2.8));
    const lamp = new THREE.DirectionalLight(0xffffff, 4); lamp.position.set(2, 6, 5); scene.add(lamp);
    const steel = new THREE.MeshStandardMaterial({ color: 0x657888, metalness: .85, roughness: .3 });
    const copper = new THREE.MeshStandardMaterial({ color: 0xe19043, metalness: .75, roughness: .3 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x192633, metalness: .6, roughness: .4 });
    const green = new THREE.MeshBasicMaterial({ color: 0x8eff88, transparent: true });
    const blue = new THREE.MeshBasicMaterial({ color: 0x6bdfff, transparent: true });
    const addBox = (width: number, height: number, depth: number, material: THREE.Material, position: number[]) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
      mesh.position.set(position[0], position[1], position[2]); scene.add(mesh); return mesh;
    };
    addBox(8.2, .2, 2.4, dark, [0, -1.75, 0]);
    for (const depth of [-.7, .7]) addBox(7.8, .12, .12, steel, [0, -1.55, depth]);
    const gun = new THREE.Mesh(new THREE.CylinderGeometry(.4, .4, 1.4, 40), steel);
    gun.rotation.z = Math.PI / 2; gun.position.x = -3; scene.add(gun);
    const filament = new THREE.Mesh(new THREE.TorusGeometry(.25, .06, 10, 40), copper);
    filament.rotation.y = Math.PI / 2; filament.position.x = -2.25; scene.add(filament);
    addBox(.2, 1.3, .25, steel, [-3, -1, 0]);
    const crystal = new THREE.Group(); crystal.position.x = -.7; scene.add(crystal);
    const foil = new THREE.Mesh(new THREE.BoxGeometry(.07, 1, 1), new THREE.MeshStandardMaterial({ color: 0xd9b765, transparent: true, opacity: .45, side: THREE.DoubleSide }));
    foil.userData.drag = "crystal"; crystal.add(foil);
    const lattice: THREE.Mesh[] = [];
    for (let row = -2; row <= 2; row++) for (let col = -2; col <= 2; col++) {
      const atom = new THREE.Mesh(new THREE.SphereGeometry(.045, 10, 8), copper);
      atom.userData.row = row; atom.userData.col = col; atom.userData.drag = "crystal"; lattice.push(atom); crystal.add(atom);
    }
    addBox(.15, 1.2, .2, steel, [-.7, -1, 0]);
    const screen = new THREE.Group(); scene.add(screen);
    const plate = new THREE.Mesh(new THREE.CircleGeometry(1.55, 72), new THREE.MeshStandardMaterial({ color: 0x0a2118, roughness: .8, side: THREE.DoubleSide }));
    plate.rotation.y = Math.PI / 2; plate.userData.drag = "screen"; screen.add(plate);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.58, .07, 12, 72), steel); rim.rotation.y = Math.PI / 2; rim.userData.drag = "screen"; screen.add(rim);
    const rings = [1, 2, 3].map(() => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1, .012, 8, 96), green);
      ring.rotation.y = Math.PI / 2; ring.position.x = .025; screen.add(ring); return ring;
    });
    const center = new THREE.Mesh(new THREE.SphereGeometry(.035, 12, 8), green); center.position.x = .025; screen.add(center);
    const screenStand = new THREE.Mesh(new THREE.BoxGeometry(.16, 1.7, .2), steel); screenStand.position.y = -.9; screen.add(screenStand);
    const wavePositions = new Float32Array(121 * 3);
    const waveGeometry = new THREE.BufferGeometry(); waveGeometry.setAttribute("position", new THREE.BufferAttribute(wavePositions, 3));
    scene.add(new THREE.Line(waveGeometry, blue));
    const electrons = Array.from({ length: 30 }, () => { const dot = new THREE.Mesh(new THREE.SphereGeometry(.035, 8, 6), blue); scene.add(dot); return dot; });
    const ray = new THREE.Raycaster();
    let drag: "screen" | "crystal" | undefined;
    let startX = 0, startValue = 0;
    const down = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2), camera);
      const hit = ray.intersectObjects([crystal, screen], true).find(item => item.object.userData.drag);
      if (!hit) return;
      drag = hit.object.userData.drag; startX = event.clientX;
      startValue = drag === "screen" ? current.current.distanceM : current.current.spacingNm;
      orbit.enabled = false; renderer.domElement.setPointerCapture(event.pointerId);
      event.stopImmediatePropagation();
    };
    const move = (event: PointerEvent) => {
      if (!drag) return;
      const delta = (event.clientX - startX) / Math.max(200, mount.clientWidth);
      if (drag === "screen") current.current.onDistance(Math.max(.1, Math.min(.5, Math.round((startValue + delta * .7) * 100) / 100)));
      else current.current.onSpacing(Math.max(.2, Math.min(.8, Math.round((startValue + delta) * 200) / 200)));
    };
    const up = () => { drag = undefined; orbit.enabled = true; };
    renderer.domElement.addEventListener("pointerdown", down, true);
    renderer.domElement.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("pointerup", up);
    renderer.domElement.addEventListener("pointercancel", up);
    const resize = () => { const width = Math.max(1, mount.clientWidth), height = Math.max(1, mount.clientHeight); renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); };
    const observer = new ResizeObserver(resize); observer.observe(mount); resize();
    let frame = 0;
    const render = () => {
      frame = requestAnimationFrame(render);
      if (document.hidden) return;
      const { phase, wavelengthPm, spacingNm, distanceM, intensity } = current.current;
      screen.position.x = .8 + distanceM * 6;
      green.opacity = blue.opacity = intensity / 100;
      lattice.forEach(atom => atom.position.set(.06, atom.userData.row * spacingNm * .6, atom.userData.col * spacingNm * .6));
      rings.forEach((ring, index) => {
        const radius = diffractionRadius(wavelengthPm, spacingNm, distanceM, index + 1);
        ring.visible = radius !== null && radius * 9 < 1.5;
        ring.scale.setScalar(radius ? radius * 9 : 0);
      });
      const cycles = Math.min(50, 700 / Math.max(wavelengthPm, 1));
      for (let index = 0; index <= 120; index++) {
        const fraction = index / 120;
        wavePositions[index * 3] = -2.25 + fraction * (screen.position.x + 2.25);
        wavePositions[index * 3 + 1] = Math.sin(fraction * cycles * Math.PI * 2 - phase * Math.PI * 2) * .12;
      }
      waveGeometry.attributes.position.needsUpdate = true;
      electrons.forEach((dot, index) => {
        const fraction = (phase + index / electrons.length) % 1;
        dot.visible = index < intensity * .3;
        dot.position.set(-2.25 + fraction * (screen.position.x + 2.25), 0, 0);
        if (dot.position.x > -.7) {
          const radius = diffractionRadius(wavelengthPm, spacingNm, distanceM) ?? 0;
          const spread = (dot.position.x + .7) / (screen.position.x + .7) * radius * 9;
          dot.position.y = Math.cos(index * 2.399) * spread; dot.position.z = Math.sin(index * 2.399) * spread;
        }
      });
      orbit.update(); renderer.render(scene, camera);
    };
    render();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); orbit.dispose();
      renderer.domElement.removeEventListener("pointerdown", down, true); renderer.domElement.removeEventListener("pointermove", move); renderer.domElement.removeEventListener("pointerup", up); renderer.domElement.removeEventListener("pointercancel", up);
      const materials = new Set<THREE.Material>();
      scene.traverse(node => { const mesh = node as THREE.Mesh; mesh.geometry?.dispose(); if (mesh.material) (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(material => materials.add(material)); });
      materials.forEach(material => material.dispose()); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return <div className="db-live-apparatus" data-phase={props.phase.toFixed(4)} data-wavelength-pm={props.wavelengthPm}>
    <div ref={host} className="db-three-mount" aria-label="Matter-wave apparatus: drag the screen to change distance, drag the crystal to change spacing, or drag the background to rotate the view" />
    {unavailable && <p className="db-scene-help">3D rendering is unavailable. Use the controls and live diffraction measurement below.</p>}
    <button className="db-reset-view" onClick={() => resetView.current()}>Reset view</button>
    <div className="db-scene-help">Drag screen → distance · Drag crystal → spacing · Background → rotate</div>
  </div>;
}
