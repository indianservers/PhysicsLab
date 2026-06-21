import { useEffect, useRef } from "react";
import * as THREE from "three";

export type ConceptThreeVariant = "strings" | "particles";

export interface ConceptThreeSceneProps {
  variant: ConceptThreeVariant;
  mode: number;
  intensity: number;
  dimensions?: number;
}

export function ConceptThreeScene({ variant, mode, intensity, dimensions = 10 }: ConceptThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ variant, mode, intensity, dimensions });

  useEffect(() => {
    stateRef.current = { variant, mode, intensity, dimensions };
  }, [variant, mode, intensity, dimensions]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    } catch {
      mount.innerHTML = "<div class='concept-three-fallback'>3D concept view needs WebGL.</div>";
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020617, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    mount.replaceChildren(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x020617, 8, 22);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
    camera.position.set(0, 1.9, 8.4);
    const root = new THREE.Group();
    scene.add(root);
    scene.add(new THREE.HemisphereLight(0xcffafe, 0x0f172a, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.35);
    key.position.set(3.2, 5, 4.2);
    scene.add(key);
    const rim = new THREE.PointLight(0x22d3ee, 11, 16);
    rim.position.set(-3.6, 2.3, 2.4);
    scene.add(rim);
    const warm = new THREE.PointLight(0xf59e0b, 7, 13);
    warm.position.set(3.4, -1.3, 2.8);
    scene.add(warm);

    const assets = variant === "strings" ? buildStringScene(root) : buildParticleScene(root);
    const stars = makeStars();
    root.add(stars);

    const orbit = { theta: 0.04, phi: 1.33, radius: 8.2, target: new THREE.Vector3(0, 0.15, 0) };
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
      orbit.phi = clamp(orbit.phi + dy * 0.004, 0.64, 2.18);
      updateCamera();
    };
    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      try { mount.releasePointerCapture(event.pointerId); } catch { /* noop */ }
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      orbit.radius = clamp(orbit.radius + event.deltaY * 0.006, 4.8, 13.5);
      updateCamera();
    };
    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerup", onPointerUp);
    mount.addEventListener("pointercancel", onPointerUp);
    mount.addEventListener("wheel", onWheel, { passive: false });

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(320, Math.floor(rect.width));
      const height = Math.max(360, Math.floor(rect.height));
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
      const settings = stateRef.current;
      root.rotation.y += 0.0014;
      stars.rotation.y -= 0.0008;
      if (settings.variant === "strings") animateStringScene(assets as StringSceneAssets, t, settings.mode, settings.intensity, settings.dimensions);
      else animateParticleScene(assets as ParticleSceneAssets, t, settings.mode, settings.intensity);
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
  }, [variant]);

  return (
    <div className="concept-three-stage" ref={mountRef}>
      <div className="concept-three-hint">Drag rotate | Wheel zoom</div>
    </div>
  );
}

interface StringSceneAssets {
  stringLine: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  stringGlow: THREE.Points;
  particles: THREE.Mesh[];
  dimensions: THREE.Group;
  sheet: THREE.LineSegments;
}

interface ParticleSceneAssets {
  fermions: THREE.Mesh[];
  bosons: THREE.Mesh[];
  forceLines: THREE.Line[];
  collider: THREE.Group;
  higgs: THREE.Mesh;
  hadron: THREE.Group;
}

function buildStringScene(root: THREE.Group): StringSceneAssets {
  root.add(makeGridSheet());
  const positions = new Float32Array(96 * 3);
  const stringGeometry = new THREE.BufferGeometry();
  stringGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const stringLine = new THREE.Line(stringGeometry, new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.95 }));
  root.add(stringLine);

  const glowGeometry = new THREE.BufferGeometry();
  glowGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(96 * 3), 3));
  const stringGlow = new THREE.Points(glowGeometry, new THREE.PointsMaterial({ color: 0xfacc15, size: 0.05, transparent: true, opacity: 0.9 }));
  root.add(stringGlow);

  const particles = [
    sphere(0.22, 0x38bdf8, -2.65, -1.05, 0.1),
    sphere(0.22, 0xfb923c, -0.85, -1.08, -0.2),
    sphere(0.18, 0xfacc15, 0.85, -1.06, 0.2),
    sphere(0.2, 0xa855f7, 2.55, -1.05, -0.1),
  ];
  particles.forEach((particle) => root.add(particle));

  const dimensions = new THREE.Group();
  for (let i = 0; i < 7; i += 1) {
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.34 + i * 0.025, 0.008, 8, 80),
      new THREE.MeshStandardMaterial({ color: i % 2 ? 0x22d3ee : 0xf59e0b, emissive: i % 2 ? 0x0891b2 : 0x92400e, emissiveIntensity: 0.28, roughness: 0.35 })
    );
    torus.position.set(-2.4 + i * 0.18, 1.32 + Math.sin(i) * 0.09, -1.25 + i * 0.07);
    torus.rotation.set(Math.PI / 2, i * 0.5, i * 0.28);
    dimensions.add(torus);
  }
  root.add(dimensions);

  const sheet = makeGridSheet(0x60a5fa, 0.28);
  sheet.position.y = -1.75;
  sheet.scale.set(0.72, 0.72, 0.72);
  root.add(sheet);
  return { stringLine, stringGlow, particles, dimensions, sheet };
}

function buildParticleScene(root: THREE.Group): ParticleSceneAssets {
  const fermions: THREE.Mesh[] = [];
  const bosons: THREE.Mesh[] = [];
  const forceLines: THREE.Line[] = [];
  const colors = [0x38bdf8, 0xfb923c, 0xa78bfa, 0x34d399, 0xf43f5e, 0xfacc15];
  for (let gen = 0; gen < 3; gen += 1) {
    for (let row = 0; row < 4; row += 1) {
      const particle = sphere(0.16, colors[(gen + row) % colors.length], -3.0 + gen * 0.62, 1.05 - row * 0.42, 0);
      fermions.push(particle);
      root.add(particle);
    }
  }
  for (let i = 0; i < 5; i += 1) {
    const boson = sphere(0.18, colors[(i + 2) % colors.length], 2.05 + Math.cos(i * 1.25) * 0.75, 0.15 + Math.sin(i * 1.25) * 0.8, 0);
    bosons.push(boson);
    root.add(boson);
  }
  for (let i = 0; i < 5; i += 1) {
    const line = waveLine(1.0, 0.15 + i * 0.03, 0x67e8f9);
    line.position.set(0.35, 0.82 - i * 0.38, 0);
    forceLines.push(line);
    root.add(line);
  }
  const collider = new THREE.Group();
  for (let i = 0; i < 4; i += 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.15 + i * 0.12, 0.012, 10, 128),
      new THREE.MeshStandardMaterial({ color: i % 2 ? 0x38bdf8 : 0xf97316, emissive: i % 2 ? 0x0e7490 : 0x9a3412, emissiveIntensity: 0.35 })
    );
    ring.rotation.x = Math.PI / 2 + i * 0.08;
    collider.add(ring);
  }
  collider.position.set(1.35, -1.35, 0);
  root.add(collider);
  const higgs = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.48, 3),
    new THREE.MeshStandardMaterial({ color: 0xfde68a, emissive: 0xf59e0b, emissiveIntensity: 0.45, roughness: 0.28, metalness: 0.18 })
  );
  higgs.position.set(2.45, -1.1, 0.2);
  root.add(higgs);
  const hadron = makeHadron();
  hadron.position.set(-1.15, -1.35, 0);
  root.add(hadron);
  return { fermions, bosons, forceLines, collider, higgs, hadron };
}

function animateStringScene(assets: StringSceneAssets, t: number, mode: number, intensity: number, dimensions: number) {
  const amp = 0.22 + intensity * 0.35;
  const harmonic = mode + 1;
  const positions = assets.stringLine.geometry.attributes.position as THREE.BufferAttribute;
  const glowPositions = assets.stringGlow.geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < positions.count; i += 1) {
    const u = i / (positions.count - 1);
    const x = -3.2 + u * 6.4;
    const y = Math.sin(u * Math.PI * harmonic * 2 + t * (1.2 + intensity * 2.6)) * amp;
    const z = Math.cos(u * Math.PI * harmonic + t * 0.8) * amp * 0.55;
    positions.setXYZ(i, x, y, z);
    glowPositions.setXYZ(i, x, y, z);
  }
  positions.needsUpdate = true;
  glowPositions.needsUpdate = true;
  assets.particles.forEach((particle, index) => {
    particle.position.y = -1.05 + Math.sin(t * (1.4 + index * 0.24) + index) * 0.08;
    particle.scale.setScalar(1 + Math.sin(t * 2 + index) * 0.07 + intensity * 0.12);
  });
  assets.dimensions.visible = dimensions > 4;
  assets.dimensions.rotation.y += 0.006 + intensity * 0.012;
  assets.dimensions.scale.setScalar(0.72 + Math.max(0, dimensions - 4) * 0.045);
  assets.sheet.rotation.z = Math.sin(t * 0.45) * 0.03;
}

function animateParticleScene(assets: ParticleSceneAssets, t: number, mode: number, intensity: number) {
  assets.fermions.forEach((particle, index) => {
    particle.rotation.y += 0.015 + index * 0.0008;
    particle.position.z = Math.sin(t * 1.2 + index) * (0.08 + intensity * 0.2);
    particle.scale.setScalar(mode === 0 || mode === 1 ? 1 : 0.72);
  });
  assets.bosons.forEach((particle, index) => {
    const angle = t * (0.45 + intensity * 0.4) + index * 1.25;
    particle.position.x = 2.05 + Math.cos(angle) * (0.75 + intensity * 0.18);
    particle.position.y = 0.15 + Math.sin(angle) * (0.8 + intensity * 0.18);
    particle.scale.setScalar(mode === 0 || mode === 2 ? 1.05 : 0.68);
  });
  assets.forceLines.forEach((line, index) => {
    const attr = line.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < attr.count; i += 1) {
      const u = i / (attr.count - 1);
      attr.setXYZ(i, -0.75 + u * 1.5, Math.sin(u * Math.PI * 8 + t * 3 + index) * (0.08 + intensity * 0.06), 0);
    }
    attr.needsUpdate = true;
    line.visible = mode !== 1;
  });
  assets.collider.rotation.z += 0.012 + intensity * 0.025;
  assets.collider.visible = mode === 0 || mode === 3;
  assets.higgs.rotation.x += 0.008;
  assets.higgs.rotation.y += 0.016;
  assets.higgs.scale.setScalar(mode === 4 ? 1.35 : 1);
  assets.hadron.rotation.y += 0.015 + intensity * 0.01;
  assets.hadron.visible = mode === 0 || mode === 1;
}

function sphere(radius: number, color: number, x: number, y: number, z: number) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 20),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.18, roughness: 0.28, metalness: 0.08 })
  );
  mesh.position.set(x, y, z);
  return mesh;
}

function waveLine(width: number, amplitude: number, color: number) {
  const positions = new Float32Array(80 * 3);
  const geometry = new THREE.BufferGeometry();
  for (let i = 0; i < 80; i += 1) {
    const u = i / 79;
    positions[i * 3] = -width / 2 + u * width;
    positions[i * 3 + 1] = Math.sin(u * Math.PI * 8) * amplitude;
    positions[i * 3 + 2] = 0;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 }));
}

function makeHadron() {
  const group = new THREE.Group();
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(0.62, 48, 24),
    new THREE.MeshStandardMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.2, roughness: 0.25 })
  );
  group.add(shell);
  group.add(sphere(0.18, 0x38bdf8, -0.18, 0.08, 0.18));
  group.add(sphere(0.18, 0xfb923c, 0.22, 0.04, -0.08));
  group.add(sphere(0.18, 0xf43f5e, -0.02, -0.24, -0.12));
  for (let i = 0; i < 5; i += 1) {
    const line = waveLine(0.8, 0.08, 0xdbeafe);
    line.rotation.z = i * 0.62;
    group.add(line);
  }
  return group;
}

function makeGridSheet(color = 0x38bdf8, opacity = 0.22) {
  const points: THREE.Vector3[] = [];
  for (let i = -5; i <= 5; i += 1) {
    points.push(new THREE.Vector3(-3.5, 0, i * 0.34), new THREE.Vector3(3.5, 0, i * 0.34));
    points.push(new THREE.Vector3(i * 0.7, 0, -1.7), new THREE.Vector3(i * 0.7, 0, 1.7));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
  line.rotation.x = -0.24;
  return line;
}

function makeStars() {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(180 * 3);
  for (let i = 0; i < 180; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = -5 - Math.random() * 9;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xe0f2fe, size: 0.035, transparent: true, opacity: 0.72 }));
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(material)) material.forEach((item) => item.dispose());
    else material?.dispose();
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
