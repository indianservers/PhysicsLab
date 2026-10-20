import * as THREE from "three";

// Reusable studio renderer. Only visible models are built; the bounded cache is
// disposed on unmount. Dimensions are calibrated to their declared axis.
export function createModelRenderer() {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" }); } catch { return null; }
  renderer.setSize(384, 384); renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0); renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xc6edff, 0x203044, 2.5));
  const key = new THREE.DirectionalLight(0xffeedb, 3); key.position.set(-3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x6cc9ff, 1.5); rim.position.set(3, 2, -3); scene.add(rim);
  const camera = new THREE.OrthographicCamera(-1.65, 1.65, 1.65, -1.65, 0.1, 30); camera.position.set(0, 0, 8);
  const cache = new Map();
  const unsupported = new Set();
  return {
    draw(ctx, object, x, y, width, height, angle = 0) {
      if (unsupported.has(object.id)) return false;
      const cacheKey = `${object.id}:${angle.toFixed(1)}`;
      let bitmap = cache.get(cacheKey);
      if (!bitmap) {
        const model = buildModel(object); if (!model) { unsupported.add(object.id); return false; }
        model.rotation.y = angle;
        const bounds = new THREE.Box3().setFromObject(model);
        const center = bounds.getCenter(new THREE.Vector3()); model.position.sub(center);
        const size = bounds.getSize(new THREE.Vector3()); const extent = Math.max(size.x, size.y, 0.001);
        model.scale.setScalar(2.8 / extent); model.position.multiplyScalar(2.8 / extent);
        scene.add(model); renderer.render(scene, camera);
        bitmap = document.createElement("canvas"); bitmap.width = 384; bitmap.height = 384;
        bitmap.getContext("2d").drawImage(renderer.domElement, 0, 0);
        scene.remove(model);
        model.traverse(child => { child.geometry?.dispose(); if (child.material) { child.material.map?.dispose(); child.material.dispose(); } });
        cache.set(cacheKey, bitmap); if (cache.size > 40) cache.delete(cache.keys().next().value);
      }
      // Geometry occupies 2.8 of the 3.3-unit viewport; blank border is accounted for.
      const extent = Math.max(width, height) * 3.3 / 2.8;
      ctx.drawImage(bitmap, x - extent / 2, y - extent / 2, extent, extent);
      return true;
    },
    destroy() { cache.clear(); renderer.dispose(); renderer.forceContextLoss(); },
  };
}

const colors = { earth: 0x3288c5, mercury: 0x98908a, venus: 0xd9bc81, mars: 0xb96542, jupiter: 0xc2a281, saturn: 0xe0c49b, uranus: 0x9cdddd, neptune: 0x3c63d6, moon: 0xaaa9a5, titan: 0xd6ab67, europa: 0xd6d1b9, pluto: 0xb59c82, ceres: 0x92928d };
function buildModel(object) {
  const group = new THREE.Group(); const id = object.id;
  const material = (color, options = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.48, metalness: 0.12, ...options });
  const box = (w, h, d, x, y, z, color) => { const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material(color)); mesh.position.set(x, y, z); group.add(mesh); return mesh; };
  const sphere = (r, x, y, z, color, options) => { const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 28), material(color, options)); mesh.position.set(x, y, z); group.add(mesh); return mesh; };
  const cylinder = (r, length, x, y, z, color) => { const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, length, 24), material(color)); mesh.position.set(x, y, z); group.add(mesh); return mesh; };
  if (id in colors || object.category === "Star") {
    const star = object.category === "Star";
    const surface = sphere(1, 0, 0, 0, colors[id] ?? object.color, star ? { emissive: object.color, emissiveIntensity: 0.7 } : {});
    // Procedural surface cues are illustrative, explicitly not spacecraft textures.
    const texture = document.createElement("canvas"); texture.width = 512; texture.height = 256;
    const c = texture.getContext("2d"); c.fillStyle = `#${new THREE.Color(colors[id] ?? object.color).getHexString()}`; c.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 180; i++) { c.fillStyle = i % 2 ? "#ffffff25" : "#00000018"; c.beginPath(); c.ellipse((i * 113) % 512, (i * 71) % 256, id === "jupiter" || id === "saturn" ? 260 : 6 + i % 20, id === "jupiter" || id === "saturn" ? 2 : 3 + i % 9, 0, 0, Math.PI * 2); c.fill(); }
    if (id === "earth") { c.fillStyle = "#5c9869"; for (let i = 0; i < 28; i++) { c.beginPath(); c.ellipse(90 + (i * 39) % 320, 35 + (i * 29) % 180, 14 + i % 18, 10 + i % 14, i, 0, Math.PI * 2); c.fill(); } }
    surface.material.map = new THREE.CanvasTexture(texture); surface.material.map.colorSpace = THREE.SRGBColorSpace;
  } else if (id === "human") {
    sphere(0.12, 0, 0.75, 0, 0xbd947a); box(0.33, 0.48, 0.17, 0, 0.35, 0, 0x343e49);
    for (const s of [-1, 1]) { cylinder(0.065, 0.65, s * 0.1, -0.22, 0, 0x27374a); cylinder(0.048, 0.5, s * 0.24, 0.28, 0, 0x92715c); box(0.14, 0.08, 0.25, s * 0.1, -0.56, 0.04, 0x151c26); }
  } else if (["car", "school-bus", "minivan", "auto-rickshaw", "metro-train-car", "train"].includes(id)) {
    const bus = id === "school-bus" || id === "metro-train-car" || id === "train"; const length = bus ? 3.4 : 2.5;
    box(length, 0.55, 0.9, 0, 0, 0, bus ? 0xdda83f : 0x4e667b); box(length * 0.7, bus ? 0.6 : 0.35, 0.82, 0, 0.4, 0, bus ? 0xe5ad3c : 0x526b82);
    for (let i = 0; i < (bus ? 7 : 2); i++) box(bus ? 0.3 : 0.55, 0.27, 0.025, -length * 0.3 + i * (bus ? 0.33 : 0.65), 0.45, 0.43, 0x162d46);
    for (const x of [-length * 0.32, length * 0.32]) for (const z of [-0.46, 0.46]) { const wheel = cylinder(0.24, 0.14, x, -0.29, z, 0x151a21); wheel.rotation.x = Math.PI / 2; }
    group.rotation.y = -0.3;
  } else if (["door", "whiteboard", "classroom-window"].includes(id)) {
    box(id === "door" ? 0.9 : 2.4, id === "door" ? 2.1 : 1.3, 0.09, 0, 0, 0, id === "door" ? 0x845932 : 0xd9e8e6);
    if (id === "door") { for (const y of [-0.45, 0.45]) box(0.65, 0.65, 0.03, 0, y, 0.06, 0x694528); sphere(0.035, 0.32, 0, 0.1, 0xd2bc7a); }
  } else if (["laptop", "tablet", "monitor", "smartphone", "calculator"].includes(id)) {
    box(1.4, 0.9, 0.06, 0, 0.15, 0, 0x8997a3); box(1.28, 0.76, 0.02, 0, 0.15, 0.05, 0x0a2340);
    if (id === "laptop") { box(1.4, 0.045, 0.8, 0, -0.32, 0.35, 0x8c9eaa); for (let i = 0; i < 8; i++) box(0.1, 0.015, 0.33, -0.5 + i * 0.14, -0.29, 0.25, 0x344252); }
    group.rotation.y = -0.22;
  } else if (["chair", "desk", "laboratory-table", "garden-bench"].includes(id)) {
    const chair = id === "chair"; const w = chair ? 0.65 : 1.5;
    box(w, 0.09, 0.65, 0, 0, 0, 0xa17a4b); if (chair) box(w, 0.6, 0.08, 0, 0.36, -0.28, 0x9d794d);
    for (const x of [-w * 0.4, w * 0.4]) for (const z of [-0.26, 0.26]) cylinder(0.035, 0.6, x, -0.32, z, 0x7c8d97);
    group.rotation.y = -0.25;
  } else if (id === "telescope") {
    const tube = cylinder(.16, 1.2, 0, .3, 0, 0xd0d6dc); tube.rotation.z = -Math.PI / 2 + .25;
    const lens = cylinder(.155, .035, -.6, .15, 0, 0x213d55); lens.rotation.z = Math.PI / 2;
    cylinder(.035, .7, 0, -.25, 0, 0x687d90);
    for (const sign of [-1, 1]) { const leg = cylinder(.025, .65, sign * .2, -.65, 0, 0x8197a9); leg.rotation.z = sign * .5; }
    cylinder(.025, .7, 0, -.65, -.3, 0x8197a9);
  } else if (id === "microscope") {
    box(0.7, 0.08, 0.45, 0, -0.5, 0, 0x8f9ba5); box(0.12, 0.75, 0.12, 0.2, -0.1, 0, 0x697680); box(0.5, 0.06, 0.4, 0, -0.08, 0.05, 0x29343e);
    const tube = cylinder(0.1, 0.6, -0.05, 0.28, 0, 0xb4bec5); tube.rotation.z = -0.4; sphere(0.12, -0.23, 0.5, 0, 0x1a2733);
  } else if (["football", "basketball", "marble", "coin"].includes(id)) {
    sphere(1, 0, 0, 0, id === "football" ? 0xecece8 : id === "basketball" ? 0xc97838 : 0xb8c8d7);
    for (let i = 0; i < 5; i++) sphere(0.13, Math.cos(i * 1.3) * 0.65, Math.sin(i * 1.3) * 0.65, 0.75, id === "football" ? 0x25303a : 0x68432a);
  } else if (object.category === "Molecule" && ["water-molecule", "oxygen-molecule", "nitrogen-molecule", "carbon-dioxide"].includes(id)) {
    if (id !== "water-molecule") {
      const carbonDioxide = id === "carbon-dioxide";
      const atomColor = id === "nitrogen-molecule" ? 0x496ac6 : 0xe05247;
      if (carbonDioxide) sphere(.2, 0, 0, 0, 0x52636e);
      for (const sign of [-1, 1]) sphere(.24, sign * .48, 0, 0, atomColor);
      const bond = cylinder(.04, .96, 0, 0, 0, 0xadc6d7); bond.rotation.z = Math.PI / 2;
      return group;
    }
    const water = id === "water-molecule"; sphere(water ? 0.3 : 0.22, 0, 0, 0, 0xe14e45);
    const n = water ? 2 : 6;
    for (let i = 0; i < n; i++) { const a = water ? (-52.25 + i * 104.5) * Math.PI / 180 : i * Math.PI / 3; const x = Math.sin(a) * 0.65, y = Math.cos(a) * 0.65; const bond = cylinder(0.04, 0.65, x / 2, y / 2, 0, 0xa2b8c5); bond.rotation.z = -a; sphere(0.16, x, y, 0, water ? 0xeeeeee : 0x526779); }
  } else return null;
  return group;
}
