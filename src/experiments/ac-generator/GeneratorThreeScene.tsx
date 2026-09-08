import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { computeAcGenerator, normalizeAngle, type AcGeneratorInput } from "./acGeneratorPhysics";

type SceneProps = {
  input: AcGeneratorInput;
  running: boolean;
  reducedMotion: boolean;
  resetViewSignal: number;
  onAngle: (angleRad: number) => void;
};

type PoleAssembly = { group: THREE.Group; body: THREE.MeshStandardMaterial; face: THREE.MeshStandardMaterial; setLabel: (label: "N" | "S") => void };
type RotatingAssembly = { group: THREE.Group; currentArrows: THREE.ArrowHelper[] };

const RED = 0xb81f27;
const BLUE = 0x1451a5;
const COPPER = 0xb75920;
const STEEL = 0x687078;

export function GeneratorThreeScene({ input, running, reducedMotion, resetViewSignal, onAngle }: SceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef({ input, running, reducedMotion, onAngle });
  const resetCameraRef = useRef<() => void>(() => undefined);

  useEffect(() => { liveRef.current = { input, running, reducedMotion, onAngle }; }, [input, running, reducedMotion, onAngle]);
  useEffect(() => resetCameraRef.current(), [resetViewSignal]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x101820, 15, 25);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.minDistance = 11.8;
    controls.maxDistance = 16.8;
    controls.minAzimuthAngle = -0.28;
    controls.maxAzimuthAngle = 0.28;
    controls.minPolarAngle = 1.28;
    controls.maxPolarAngle = 1.76;
    const resetCamera = () => { camera.position.set(0, 2.1, 14.4); controls.target.set(0, -0.15, 0); controls.update(); };
    resetCameraRef.current = resetCamera;
    resetCamera();

    scene.add(new THREE.HemisphereLight(0xcce8ff, 0x101318, 2.25));
    const key = new THREE.DirectionalLight(0xfff4df, 4.6); key.position.set(-4, 8, 8); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); scene.add(key);
    const fill = new THREE.DirectionalLight(0x72aaff, 2.2); fill.position.set(7, 3, 6); scene.add(fill);
    const rim = new THREE.PointLight(0xff8d45, 24, 14); rim.position.set(-2, 2, 3); scene.add(rim);

    const base = createGeneratorBase(); scene.add(base);
    const leftPole = createMagnetAssembly("left", "N"); scene.add(leftPole.group);
    const rightPole = createMagnetAssembly("right", "S"); scene.add(rightPole.group);
    const rotating = createRotatingAssembly(); scene.add(rotating.group);
    const stationary = createStationaryHardware(); scene.add(stationary);
    const field = createFieldVisualization(); scene.add(field.group);
    const angle = createAngleIndicator(); scene.add(angle.group);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 14), new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.34 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -2.73; floor.receiveShadow = true; scene.add(floor);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let draggingCoil = false;
    let dragStartX = 0;
    let dragStartAngle = 0;
    const hitCoil = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(rotating.group.children, true).some(hit => hit.object.userData.coil === true);
    };
    const pointerDown = (event: PointerEvent) => {
      if (!hitCoil(event)) return;
      draggingCoil = true; dragStartX = event.clientX; dragStartAngle = liveRef.current.input.angleRad;
      controls.enabled = false; renderer.domElement.setPointerCapture(event.pointerId); renderer.domElement.style.cursor = "grabbing"; event.preventDefault();
    };
    const pointerMove = (event: PointerEvent) => {
      if (!draggingCoil) { renderer.domElement.style.cursor = hitCoil(event) ? "grab" : "default"; return; }
      const raw = dragStartAngle + (event.clientX - dragStartX) * Math.PI / 180;
      const snapped = Math.round(raw / (Math.PI / 36)) * (Math.PI / 36);
      liveRef.current.onAngle(normalizeAngle(snapped));
    };
    const pointerUp = (event: PointerEvent) => {
      if (!draggingCoil) return;
      draggingCoil = false; controls.enabled = true; renderer.domElement.style.cursor = "grab";
      if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
    };
    renderer.domElement.addEventListener("pointerdown", pointerDown);
    renderer.domElement.addEventListener("pointermove", pointerMove);
    renderer.domElement.addEventListener("pointerup", pointerUp);
    renderer.domElement.addEventListener("pointercancel", pointerUp);

    const resize = () => {
      const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight);
      renderer.setSize(width, height, false); camera.aspect = width / height; camera.fov = camera.aspect < 1 ? 48 : 32; camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize); observer.observe(host); resize();

    let frame = 0;
    const render = () => {
      frame = requestAnimationFrame(render);
      if (document.hidden) return;
      const live = liveRef.current;
      const result = computeAcGenerator(live.input);
      rotating.group.rotation.x = live.input.angleRad;
      field.setDirection(live.input.polarity);
      leftPole.body.color.setHex(live.input.polarity === 1 ? RED : BLUE); leftPole.face.color.copy(leftPole.body.color);
      rightPole.body.color.setHex(live.input.polarity === 1 ? BLUE : RED); rightPole.face.color.copy(rightPole.body.color);
      leftPole.setLabel(live.input.polarity === 1 ? "N" : "S"); rightPole.setLabel(live.input.polarity === 1 ? "S" : "N");
      const relative = result.peakEmf > 0 ? Math.abs(result.emf / result.peakEmf) : 0;
      rotating.currentArrows.forEach((arrow, index) => {
        arrow.visible = relative > 0.035;
        const sign = result.emf >= 0 ? 1 : -1;
        arrow.setDirection(new THREE.Vector3(0, index ? sign : -sign, 0));
        (arrow.line.material as THREE.LineBasicMaterial).opacity = Math.max(.28, relative);
        (arrow.cone.material as THREE.MeshBasicMaterial).opacity = Math.max(.28, relative);
      });
      angle.update(live.input.angleRad);
      controls.update();
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", pointerDown); renderer.domElement.removeEventListener("pointermove", pointerMove); renderer.domElement.removeEventListener("pointerup", pointerUp); renderer.domElement.removeEventListener("pointercancel", pointerUp);
      disposeTree(scene); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); resetCameraRef.current = () => undefined;
    };
  }, []);

  return <div ref={hostRef} className="ac-three ac-generator-three" role="application" tabIndex={0} aria-label="Interactive three-dimensional AC generator. Drag the copper coil to set its angle. Drag the background slightly to inspect the apparatus, use the wheel to zoom, arrow keys to step five degrees, and press zero to reset the camera." onKeyDown={event => { if (event.key === "0") resetCameraRef.current(); if (event.key === "ArrowLeft") { event.preventDefault(); onAngle(normalizeAngle(input.angleRad - Math.PI / 36)); } if (event.key === "ArrowRight") { event.preventDefault(); onAngle(normalizeAngle(input.angleRad + Math.PI / 36)); } }}><span className="ac-three-hint">DRAG COPPER COIL · ← → 5° · 0 RESET VIEW</span></div>;
}

export function createMagnetAssembly(side: "left" | "right", pole: "N" | "S"): PoleAssembly {
  const group = new THREE.Group(); group.name = `${side}_pole_assembly`;
  const color = pole === "N" ? RED : BLUE;
  const body = new THREE.MeshStandardMaterial({ color, metalness: .68, roughness: .28 });
  const face = new THREE.MeshStandardMaterial({ color, metalness: .42, roughness: .2 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x252b30, metalness: .82, roughness: .32 });
  const x = side === "left" ? -4.05 : 4.05, inward = side === "left" ? 1 : -1;
  const spine = box(1.25, 3.95, 1.25, body); spine.position.set(x, -.15, 0); group.add(spine);
  [-1, 1].forEach(ySign => { const arm=box(1.55, .72, 1.32, body); arm.position.set(x + inward*.88, ySign*1.46, 0); group.add(arm); const shoe=box(.55, .92, 1.48, face); shoe.position.set(x+inward*1.75,ySign*1.46,0); group.add(shoe); });
  const backCoil = new THREE.Mesh(new THREE.TorusGeometry(1.72,.17,10,64), new THREE.MeshStandardMaterial({color:COPPER,metalness:.73,roughness:.3})); backCoil.rotation.y=Math.PI/2; backCoil.position.x=x-inward*.52; backCoil.scale.y=.83; group.add(backCoil);
  const label = makeLabel(pole); label.mesh.position.set(x, -.1, .66); label.mesh.scale.set(.68,.9,1); group.add(label.mesh);
  const brace=box(.3,4.25,1.52,dark); brace.position.set(x-inward*.67,-.15,-.08); group.add(brace);
  group.traverse(node=>{const mesh=node as THREE.Mesh;if(mesh.isMesh){mesh.castShadow=true;mesh.receiveShadow=true;}});
  return { group, body, face, setLabel: label.set };
}

export function createRotatingAssembly(): RotatingAssembly {
  const group = new THREE.Group(); group.name="rotating_assembly";
  const copper = new THREE.MeshPhysicalMaterial({color:COPPER,metalness:.82,roughness:.22,clearcoat:.35,clearcoatRoughness:.28});
  for(let index=0;index<7;index++){const loop=roundedRectTube(2.1+index*.045,3.0+index*.045,.055,copper);loop.position.z=(index-3)*.045;loop.userData.coil=true;group.add(loop);}
  const shaft = cylinder(.16,7.3,new THREE.MeshStandardMaterial({color:0x88939c,metalness:.95,roughness:.18})); shaft.rotation.z=Math.PI/2; shaft.castShadow=true; group.add(shaft);
  [-1.35,-1.02].forEach((x,index)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(.39,.11,12,48),new THREE.MeshStandardMaterial({color:index?0xd69a29:0xe0ad38,metalness:.9,roughness:.2}));ring.rotation.y=Math.PI/2;ring.position.x=x;ring.castShadow=true;group.add(ring);});
  const connectorMaterial=new THREE.MeshStandardMaterial({color:COPPER,metalness:.75,roughness:.25});
  group.add(tube([new THREE.Vector3(-1.02,-1.48,0),new THREE.Vector3(-1.02,-.45,.38),new THREE.Vector3(-1.02,0,.49)],.055,connectorMaterial));
  group.add(tube([new THREE.Vector3(1.02,-1.48,0),new THREE.Vector3(-1.35,-.55,-.3),new THREE.Vector3(-1.35,0,-.49)],.055,connectorMaterial));
  const arrows=[new THREE.ArrowHelper(new THREE.Vector3(0,1,0),new THREE.Vector3(-1.18,-.85,.3),.75,0xffdd54,.18,.1),new THREE.ArrowHelper(new THREE.Vector3(0,-1,0),new THREE.Vector3(1.18,.85,.3),.75,0xffdd54,.18,.1)];
  arrows.forEach(arrow=>{(arrow.line.material as THREE.LineBasicMaterial).transparent=true;(arrow.cone.material as THREE.MeshBasicMaterial).transparent=true;group.add(arrow);});
  return {group,currentArrows:arrows};
}

export function createStationaryHardware() {
  const group=new THREE.Group(); group.name="stationary_hardware";
  const cast=new THREE.MeshStandardMaterial({color:0x343b41,metalness:.82,roughness:.38});
  const steel=new THREE.MeshStandardMaterial({color:STEEL,metalness:.9,roughness:.25});
  [-2.35,2.35].forEach(x=>{const support=box(.72,1.55,1.15,cast);support.position.set(x,-1.65,0);group.add(support);const bearing=new THREE.Mesh(new THREE.TorusGeometry(.43,.16,12,48),steel);bearing.rotation.y=Math.PI/2;bearing.position.set(x,-.72,0);group.add(bearing);const collar=cylinder(.31,.48,steel);collar.rotation.z=Math.PI/2;collar.position.set(x,-.72,0);group.add(collar);});
  const brushMaterial=new THREE.MeshStandardMaterial({color:0x17191a,metalness:.15,roughness:.82});
  [-1.35,-1.02].forEach((x,index)=>{const brush=box(.24,.58,.34,brushMaterial);brush.position.set(x,-.58,index?.37:-.37);group.add(brush);const spring=box(.12,.48,.12,steel);spring.position.set(x,-.92,index?.37:-.37);group.add(spring);});
  const terminalRed=createTerminal(0xc51f2b);terminalRed.position.set(-2.9,-2.18,.75);group.add(terminalRed);
  const terminalBlue=createTerminal(0x1762bd);terminalBlue.position.set(2.9,-2.18,.75);group.add(terminalBlue);
  const redWire=new THREE.MeshStandardMaterial({color:0xcf2731,metalness:.25,roughness:.45}); const blueWire=new THREE.MeshStandardMaterial({color:0x176ed1,metalness:.25,roughness:.45});
  group.add(tube([new THREE.Vector3(-1.35,-.9,-.37),new THREE.Vector3(-1.8,-1.45,.45),new THREE.Vector3(-2.9,-2.0,.75)],.06,redWire));
  group.add(tube([new THREE.Vector3(-1.02,-.9,.37),new THREE.Vector3(1.8,-1.5,.45),new THREE.Vector3(2.9,-2.0,.75)],.06,blueWire));
  group.traverse(node=>{const mesh=node as THREE.Mesh;if(mesh.isMesh){mesh.castShadow=true;mesh.receiveShadow=true;}}); return group;
}

export function createGeneratorBase() {
  const group=new THREE.Group(); group.name="generator_base"; const cast=new THREE.MeshStandardMaterial({color:0x252b30,metalness:.78,roughness:.4});
  const plinth=box(10.4,.48,3.0,cast);plinth.position.y=-2.48;plinth.castShadow=true;plinth.receiveShadow=true;group.add(plinth);
  const upper=box(7.1,.34,2.1,new THREE.MeshStandardMaterial({color:0x363d43,metalness:.82,roughness:.34}));upper.position.y=-2.15;upper.castShadow=true;group.add(upper);
  const boltGeo=new THREE.CylinderGeometry(.1,.13,.12,16);const boltMat=new THREE.MeshStandardMaterial({color:0x9ca4aa,metalness:1,roughness:.2});[-4.5,-3,3,4.5].forEach(x=>[-.9,.9].forEach(z=>{const bolt=new THREE.Mesh(boltGeo,boltMat);bolt.position.set(x,-2.18,z);bolt.castShadow=true;group.add(bolt);})); return group;
}

export function createFieldVisualization() {
  const group=new THREE.Group(); group.name="magnetic_field"; const arrows:THREE.ArrowHelper[]=[];
  [-1.1,-.72,-.34,.04,.42,.8,1.18].forEach(y=>{const arrow=new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(-2.55,y,-.72),5.1,0x58baf5,.22,.13);(arrow.line.material as THREE.LineBasicMaterial).transparent=true;(arrow.line.material as THREE.LineBasicMaterial).opacity=.34;(arrow.cone.material as THREE.MeshBasicMaterial).transparent=true;(arrow.cone.material as THREE.MeshBasicMaterial).opacity=.65;arrows.push(arrow);group.add(arrow);});
  return {group,setDirection:(polarity:1|-1)=>arrows.forEach(arrow=>{arrow.position.x=polarity===1?-2.55:2.55;arrow.setDirection(new THREE.Vector3(polarity,0,0));})};
}

export function createAngleIndicator() {
  const group=new THREE.Group();group.name="coil_angle_indicator";group.position.set(-1.75,0,0);
  const material=new THREE.LineBasicMaterial({color:0xffd35a,transparent:true,opacity:.86});const geometry=new THREE.BufferGeometry();const line=new THREE.Line(geometry,material);group.add(line);
  return {group,update:(angle:number)=>{const extent=Math.min(Math.PI*2,normalizeAngle(angle));const points=Array.from({length:33},(_,i)=>{const a=extent*i/32;return new THREE.Vector3(0,Math.sin(a)*.62,Math.cos(a)*.62)});geometry.setFromPoints(points);}};
}

function makeLabel(initial:"N"|"S") { const canvas=document.createElement("canvas");canvas.width=256;canvas.height=320;const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false});const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1,1),material);let current="";const set=(label:"N"|"S")=>{if(label===current)return;current=label;const ctx=canvas.getContext("2d")!;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle="rgba(12,18,24,.48)";ctx.roundRect(18,18,220,284,22);ctx.fill();ctx.strokeStyle="rgba(255,255,255,.5)";ctx.lineWidth=6;ctx.stroke();ctx.fillStyle="#fff";ctx.font="bold 210px Georgia";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(label,128,170);texture.needsUpdate=true;};set(initial);return{mesh,set}; }
function roundedRectTube(width:number,height:number,radius:number,material:THREE.Material){const x=width/2,y=height/2,r=.23;const shape=new THREE.Shape();shape.moveTo(-x+r,-y);shape.lineTo(x-r,-y);shape.absarc(x-r,-y+r,r,-Math.PI/2,0,false);shape.lineTo(x,y-r);shape.absarc(x-r,y-r,r,0,Math.PI/2,false);shape.lineTo(-x+r,y);shape.absarc(-x+r,y-r,r,Math.PI/2,Math.PI,false);shape.lineTo(-x,-y+r);shape.absarc(-x+r,-y+r,r,Math.PI,Math.PI*1.5,false);const points=shape.getSpacedPoints(72).map(point=>new THREE.Vector3(point.x,point.y,0));const mesh=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points,true),96,radius,8,true),material);mesh.castShadow=true;return mesh;}
function box(x:number,y:number,z:number,material:THREE.Material){const radius=Math.min(.12,x*.16,y*.16,z*.16);const mesh=new THREE.Mesh(new RoundedBoxGeometry(x,y,z,3,radius),material);return mesh;}
function cylinder(radius:number,length:number,material:THREE.Material){return new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,length,32),material);}
function tube(points:THREE.Vector3[],radius:number,material:THREE.Material){const mesh=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),48,radius,8,false),material);mesh.castShadow=true;return mesh;}
function createTerminal(color:number){const group=new THREE.Group();const metal=new THREE.MeshStandardMaterial({color:0xc9a33e,metalness:.9,roughness:.22});const cap=new THREE.MeshStandardMaterial({color,metalness:.45,roughness:.28});const stem=cylinder(.14,.52,metal);stem.position.y=.18;group.add(stem);const top=cylinder(.27,.2,cap);top.position.y=.52;group.add(top);return group;}
function disposeTree(root:THREE.Object3D){root.traverse(node=>{const mesh=node as THREE.Mesh;if(mesh.geometry)mesh.geometry.dispose();const values=Array.isArray(mesh.material)?mesh.material:mesh.material?[mesh.material]:[];values.forEach(material=>{for(const value of Object.values(material)){if(value instanceof THREE.Texture)value.dispose();}material.dispose();});});}
