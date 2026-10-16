import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { PendulumInput, PendulumRun, PendulumSample } from "../lib/pendulumStudio";

type BenchProps = { input: PendulumInput; run: PendulumRun; samples: PendulumSample[]; strobe: boolean; zoom: number; measured: number | null; onRelease: (angle: number) => void };

function configureCamera(camera:THREE.OrthographicCamera,height:number,aspect:number,zoom:number){
 const visibleHeight=(height+.25)/zoom;camera.left=-visibleHeight*aspect/2;camera.right=visibleHeight*aspect/2;camera.top=visibleHeight/2;camera.bottom=-visibleHeight/2;camera.position.set(0,height/2+1,5);camera.lookAt(0,height/2,0);camera.updateProjectionMatrix();camera.updateMatrixWorld();
}
export function PendulumBench(props: BenchProps) {
  const host = useRef<HTMLDivElement>(null), latest = useRef(props);
  latest.current = props;
  const runtime = useRef<{ update: () => void } | null>(null);
  const [fallback, setFallback] = useState(false);
  const dragging = useRef(false);
  const [size,setSize]=useState({width:800,height:760});
  const guideCamera=useMemo(()=>{const camera=new THREE.OrthographicCamera(-1,1,1,-1,.01,30);configureCamera(camera,Math.max(1.65,props.input.length+.35),size.width/size.height,props.zoom);return camera},[props.input.length,props.zoom,size]);
  const project=(x:number,y:number,z=.055)=>{const p=new THREE.Vector3(x,y,z).project(guideCamera);return {x:(p.x+.999999)*400,y:(1-p.y)*380}};
  const height=Math.max(1.65,props.input.length+.35),amplitude=props.input.angle*Math.PI/180;
  const arcPoint=(a:number,r=props.input.length+.17)=>project(r*Math.sin(a),height-.03-r*Math.cos(a));
  const arc=Array.from({length:61},(_,i)=>{const p=arcPoint(-amplitude+i/60*2*amplitude);return `${i?'L':'M'}${p.x},${p.y}`}).join(' ');
  const guideTop=project(0,height-.03),guideBottom=project(0,.18),left=arcPoint(-amplitude),right=arcPoint(amplitude);

  useEffect(() => {
    const element = host.current!;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" }); }
    catch { setFallback(true); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.setAttribute("aria-hidden", "true");
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .01, 30);
    const pmrem = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture;
    const steel = new THREE.MeshStandardMaterial({ color: 0xb5bcc1, metalness: .98, roughness: .22 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0xe0e2e5, metalness: 1, roughness: .1 });
    const black = new THREE.MeshStandardMaterial({ color: 0x080c12, metalness: .1, roughness: .8, envMapIntensity: .08 });
    const cord = new THREE.MeshStandardMaterial({ color: 0x9ca8b0, metalness: .5, roughness: .6 });
    const laserMaterial = new THREE.MeshBasicMaterial({ color: 0xff244a, transparent: true, opacity: .8 });
    const geometries: THREE.BufferGeometry[] = [], materials: THREE.Material[] = [steel, chrome, black, cord, laserMaterial];
    function box(w: number, h: number, d: number, material: THREE.Material, x = 0, y = 0, z = 0) {
      const geometry = new THREE.BoxGeometry(w, h, d); geometries.push(geometry);
      const mesh = new THREE.Mesh(geometry, material); mesh.position.set(x, y, z); scene.add(mesh); return mesh;
    }
    function rod(radius: number, height: number, material: THREE.Material) {
      const geometry = new THREE.CylinderGeometry(radius, radius, height, 24); geometries.push(geometry);
      const mesh = new THREE.Mesh(geometry, material); scene.add(mesh); return mesh;
    }
    const base = box(1.05, .05, .32, black, -.22, .025, 0);
    box(1.06, .012, .33, steel, -.22, .055, 0);
    const post = rod(.016, 1, chrome), beam = rod(.014, .69, steel); beam.rotation.z = Math.PI / 2;
    const clamp = box(.082, .12, .065, black), pivot = rod(.018, .025, chrome); pivot.rotation.x = Math.PI / 2;
    const collar = rod(.038, .065, steel); collar.position.set(-.58, .09, 0);
    for (const x of [-.68, .22]) for (const z of [-.12, .12]) box(.035, .035, .035, steel, x, .075, z);
    const swing = new THREE.Group(); scene.add(swing);
    const string = rod(.0013, 1, cord); scene.remove(string); swing.add(string);
    const sphereGeometry = new THREE.SphereGeometry(.047, 48, 32); geometries.push(sphereGeometry);
    const bob = new THREE.Mesh(sphereGeometry, chrome); swing.add(bob);
    const ghostSwings: THREE.Group[] = [];
    for (let i = 0; i < 11; i++) {
      const group = new THREE.Group(); scene.add(group);
      const ghostMaterial = new THREE.MeshStandardMaterial({ color: 0xabb8c5, metalness: .8, roughness: .3, transparent: true, opacity: .06 + i * .013, depthWrite: false });
      const threadMaterial = new THREE.MeshBasicMaterial({ color: 0xa8bacb, transparent: true, opacity: .05 + i * .014, depthWrite: false });
      materials.push(ghostMaterial, threadMaterial);
      const ghostBob = new THREE.Mesh(sphereGeometry, ghostMaterial); group.add(ghostBob);
      const thread = rod(.001, 1, threadMaterial); scene.remove(thread); group.add(thread); ghostSwings.push(group);
    }
    const gateBox = box(.62, .17, .23, black, 0, .12, .12);
    const gatePosts = [-.22, .22].map(x => { const mesh = rod(.012, 1, black); mesh.position.x = x; mesh.position.z = .04; return mesh; });
    const gateHeads = [-.22, .22].map(x => box(.045, .075, .075, black, x, .5, .04));
    const laser = rod(.0016, .44, laserMaterial); laser.rotation.z = Math.PI / 2; laser.position.z = .04;
    const displayCanvas = document.createElement("canvas"); displayCanvas.width = 512; displayCanvas.height = 160;
    const displayTexture = new THREE.CanvasTexture(displayCanvas);
    displayTexture.colorSpace = THREE.SRGBColorSpace;
    const displayMaterial = new THREE.MeshBasicMaterial({ map: displayTexture }); materials.push(displayMaterial);
    const display = new THREE.Mesh(new THREE.PlaneGeometry(.5, .13), displayMaterial); geometries.push(display.geometry);
    display.position.set(0, .12, .238); scene.add(display);
    const key = new THREE.DirectionalLight(0xd7e9ff, 4); key.position.set(-2, 3, 4); scene.add(key);
    const fill = new THREE.DirectionalLight(0x5088b8, 2); fill.position.set(3, 2, 1); scene.add(fill);
    const warm = new THREE.DirectionalLight(0xffe8ca, 2); warm.position.set(-1, 0, -2); scene.add(warm);
    scene.add(new THREE.AmbientLight(0xffffff, .5));
    let previousDisplay = "";
    function update() {
      const { input, run, samples, strobe, zoom, measured } = latest.current;
      const height = Math.max(1.65, input.length + .35), aspect = element.clientWidth / Math.max(1, element.clientHeight);
      configureCamera(camera,height,aspect,zoom);
      post.scale.y = height; post.position.set(-.58, height / 2, 0);
      beam.position.set(-.275, height, 0); clamp.position.set(0, height, .01); pivot.position.set(0, height - .025, .055);
      swing.position.set(0, height - .03, .055); swing.rotation.z = run.angle;
      string.scale.y = input.length; string.position.y = -input.length / 2;
      bob.position.y = -input.length; bob.scale.setScalar(Math.cbrt((input.mass ?? .2) / .2));
      const visibleSamples = samples.filter(s => s.time >= run.time - 2.2);
      const buckets = new Map<number, PendulumSample>(); visibleSamples.forEach(s => buckets.set(Math.floor(s.time * 5), s));
      const trail = [...buckets.values()].slice(-12, -1);
      ghostSwings.forEach((group, i) => {
        group.visible = strobe && i < trail.length;
        group.position.copy(swing.position);
        group.rotation.z = trail[i]?.angle ?? 0;
        const ghost = group.children[0] as THREE.Mesh; ghost.position.y = -input.length; ghost.scale.copy(bob.scale);
        const thread = group.children[1] as THREE.Mesh; thread.scale.y = input.length; thread.position.y = -input.length / 2;
      });
      const gateHeight = height - .03 - input.length;
      gatePosts.forEach(mesh => { mesh.scale.y = Math.max(.06, gateHeight - .2); mesh.position.y = .2 + (gateHeight - .2) / 2; });
      gateHeads.forEach(mesh => mesh.position.y = gateHeight);
      laser.position.y = gateHeight;
      const text = measured === null ? "—.——— s" : `${measured.toFixed(3)} s`;
      if (text !== previousDisplay) {
        previousDisplay = text;
        const ctx = displayCanvas.getContext("2d")!; ctx.fillStyle = "#020407"; ctx.fillRect(0, 0, 512, 160);
        ctx.textAlign = "center"; ctx.fillStyle = "#9da5ad"; ctx.font = "19px monospace"; ctx.fillText("TIMING GATE", 256, 30);
        ctx.shadowColor = "#ff2848"; ctx.shadowBlur = 12; ctx.fillStyle = "#ff4b5d"; ctx.font = "58px monospace"; ctx.fillText(text, 256, 113); displayTexture.needsUpdate = true;
      }
      renderer.render(scene, camera);
      void base; void gateBox;
    }
    const observer = new ResizeObserver(() => { const width=element.clientWidth,height=element.clientHeight;setSize(previous=>previous.width===width&&previous.height===height?previous:{width,height});renderer.setSize(width,height,false); update(); });
    observer.observe(element); renderer.setSize(element.clientWidth, element.clientHeight, false);
    runtime.current = { update }; update();
    return () => {
      runtime.current = null; observer.disconnect();
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); displayTexture.dispose();
      environment.dispose(); pmrem.dispose(); room.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    };
  }, []);

  useLayoutEffect(() => { runtime.current?.update(); }, [props]);
  const release = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const height = Math.max(1.65, props.input.length + .35), pivotY = rect.top + rect.height * .08;
    const angle = Math.max(-60, Math.min(60, Math.atan2(event.clientX - rect.left - rect.width / 2, Math.max(20, event.clientY - pivotY)) * 180 / Math.PI));
    props.onRelease(angle); void height;
  };
  return <div className="pds-bench" data-angle={props.run.angle} data-length={props.input.length} data-zoom={props.zoom} data-strobe={props.strobe}>
    <div className="pds-lab-backdrop"/>
    <div className="pds-poster pds-poster-left"><span>A SMALL<br/>CHANGE<br/>A BIGGER<br/>UNDERSTANDING</span><svg viewBox="0 0 90 110"><path d="M45 10V85M45 10L13 75M45 10L77 75M13 75Q45 110 77 75" fill="none" stroke="currentColor"/><circle cx="13" cy="75" r="4" fill="currentColor"/></svg><b>T = 2π√<span className="pds-poster-fraction">L<br/>g</span></b></div>
    <div className="pds-poster pds-poster-right">MEASURE<br/>ANALYZE<br/>EXPLORE<br/>REPEAT</div>
    <div ref={host} className="pds-three-host" role="application" aria-label="Interactive pendulum. Drag to choose a release angle; arrow keys change the angle." tabIndex={0}
      onPointerDown={e => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); release(e); }}
      onPointerMove={e => { if (dragging.current) release(e); }} onPointerUp={() => dragging.current = false} onPointerCancel={() => dragging.current = false}
      onKeyDown={e => { if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); props.onRelease(props.input.angle + (e.key === "ArrowLeft" ? -1 : 1)); } }}/>
    {fallback && <svg className="pds-fallback" viewBox="0 0 800 760" role="img" aria-label="Pendulum apparatus in the non-WebGL view"><defs><radialGradient id="pds-silver"><stop stopColor="#f4f7fa"/><stop offset=".5" stopColor="#728190"/><stop offset="1" stopColor="#152534"/></radialGradient></defs><path d="M170 690V45H400" stroke="#98a8b4" strokeWidth="12" fill="none"/><rect x="120" y="690" width="430" height="25" fill="#17232c"/><g transform={`translate(400 45) rotate(${-props.run.angle*180/Math.PI})`}><path d={`M0 0V${props.input.length*350}`} stroke="#b9c9d3" strokeWidth="2"/><circle cy={props.input.length*350} r="22" fill="url(#pds-silver)"/></g></svg>}
    <svg className="pds-bench-guides" viewBox="0 0 800 760" preserveAspectRatio="none" aria-hidden="true"><path d={`M${guideTop.x} ${guideTop.y}L${guideBottom.x} ${guideBottom.y}`} stroke="#c0d1e0" strokeDasharray="5 5" opacity=".55"/><path d={arc} fill="none" stroke="#d5e6f3" strokeWidth="1"/>{Array.from({length:13},(_,i)=>{const a=-amplitude+i/12*2*amplitude,p=arcPoint(a),q=arcPoint(a,props.input.length+.17+(i%3===0?.022:.012));return <path key={i} d={`M${p.x} ${p.y}L${q.x} ${q.y}`} stroke="#d5e6f3"/>})}<text x={left.x-8} y={left.y-16} fill="#dae8f4" fontSize="14">−θ</text><text x={right.x} y={right.y-16} fill="#dae8f4" fontSize="14">+θ</text></svg>
    <span className="pds-drag-hint">Drag the bob to set the release angle</span>
  </div>;
}
