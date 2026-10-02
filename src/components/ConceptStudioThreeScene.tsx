import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type Props = { studioId: string; level: number; running: boolean };
type LiveState = Pick<Props, "level" | "running">;
type Model = { update: (time: number, level: number) => void };

const cyan = 0x39d9ff;
const amber = 0xffa62e;
const white = 0xdff7ff;

export function ConceptStudioThreeScene({ studioId, level, running }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<LiveState>({ level, running });
  useEffect(() => { stateRef.current = { level, running }; }, [level, running]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      host.dataset.webgl = "unavailable";
      return;
    }
    renderer.setClearColor(0, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.replaceChildren(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06111b, .018);
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
    const root = new THREE.Group();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), .04);
    scene.environment = environment.texture;
    scene.add(root, new THREE.HemisphereLight(0xc9efff, 0x05090d, 1.4));
    const keyLight = new THREE.SpotLight(cyan, 95, 28, Math.PI / 5, .65, 1.4); keyLight.position.set(-5, 7, 8); keyLight.castShadow = true; keyLight.shadow.mapSize.set(1024, 1024); scene.add(keyLight, keyLight.target);
    const warmLight = new THREE.PointLight(amber, 42, 20, 1.6); warmLight.position.set(5, 1, 6); scene.add(warmLight);
    const rimLight = new THREE.DirectionalLight(white, 2.4); rimLight.position.set(2, 6, -7); scene.add(rimLight);
    camera.position.set(0, 1.1, 11.5);
    const model = buildModel(studioId, root);

    const orbit = { theta: 0, phi: 1.47, radius: 11.5 };
    const pointCamera = () => {
      camera.position.setFromSpherical(new THREE.Spherical(orbit.radius, orbit.phi, orbit.theta));
      camera.lookAt(0, 0, 0);
    };
    pointCamera();
    let dragging = false, lastX = 0, lastY = 0;
    const down = (e: PointerEvent) => { dragging = true; lastX = e.clientX; lastY = e.clientY; host.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!dragging) return; orbit.theta -= (e.clientX-lastX)*.005; orbit.phi = THREE.MathUtils.clamp(orbit.phi+(e.clientY-lastY)*.004,.7,2.25); lastX=e.clientX;lastY=e.clientY;pointCamera(); };
    const up = (e: PointerEvent) => { dragging=false; try { host.releasePointerCapture(e.pointerId); } catch { /* already released */ } };
    const wheel = (e: WheelEvent) => { e.preventDefault(); orbit.radius=THREE.MathUtils.clamp(orbit.radius+e.deltaY*.008,6.5,16);pointCamera(); };
    const key = (e: KeyboardEvent) => { if(e.key.startsWith("Arrow"))e.preventDefault();if(e.key==="ArrowLeft")orbit.theta-=.12;if(e.key==="ArrowRight")orbit.theta+=.12;if(e.key==="ArrowUp")orbit.radius=Math.max(6.5,orbit.radius-.6);if(e.key==="ArrowDown")orbit.radius=Math.min(16,orbit.radius+.6);if(e.key==="0"){orbit.theta=0;orbit.phi=1.47;orbit.radius=11.5}pointCamera(); };
    host.addEventListener("pointerdown",down);host.addEventListener("pointermove",move);host.addEventListener("pointerup",up);host.addEventListener("pointercancel",up);host.addEventListener("wheel",wheel,{passive:false});host.addEventListener("keydown",key);

    const resize = () => { const box=host.getBoundingClientRect();renderer.setSize(Math.max(1,box.width),Math.max(1,box.height),false);camera.aspect=box.width/Math.max(1,box.height);camera.updateProjectionMatrix(); };
    const observer = new ResizeObserver(resize); observer.observe(host); resize();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = new THREE.Timer(); timer.connect(document);
    let raf=0, simulationTime=0, previous=0;
    const frame=()=>{timer.update();const elapsed=timer.getElapsed();const delta=Math.min(.05,Math.max(0,elapsed-previous));previous=elapsed;if(stateRef.current.running&&!reduced.matches)simulationTime+=delta;model.update(simulationTime,stateRef.current.level);renderer.render(scene,camera);raf=requestAnimationFrame(frame)};frame();
    return()=>{cancelAnimationFrame(raf);timer.dispose();observer.disconnect();host.removeEventListener("pointerdown",down);host.removeEventListener("pointermove",move);host.removeEventListener("pointerup",up);host.removeEventListener("pointercancel",up);host.removeEventListener("wheel",wheel);host.removeEventListener("keydown",key);root.traverse(object=>{const mesh=object as THREE.Mesh;mesh.geometry?.dispose();const material=mesh.material as THREE.Material|THREE.Material[]|undefined;if(Array.isArray(material))material.forEach(item=>item.dispose());else material?.dispose()});environment.dispose();pmrem.dispose();renderer.dispose();host.replaceChildren()};
  }, [studioId]);

  return <div ref={hostRef} className={`csh-three csh-three-${studioId}`} role="application" tabIndex={0} aria-label={`Interactive 3D ${studioId.split("-").join(" ")} model. Drag to orbit, scroll to zoom, use arrow keys to inspect, and press 0 to reset the camera.`}/>;
}

function material(color:number, metalness=.32, roughness=.28){return new THREE.MeshPhysicalMaterial({color,metalness,roughness,clearcoat:.28,clearcoatRoughness:.2});}
function metal(color=0x9db2bd,roughness=.2){return new THREE.MeshPhysicalMaterial({color,metalness:.92,roughness,clearcoat:.38,clearcoatRoughness:.16});}
function glass(color=0x79dfff,opacity=.38){return new THREE.MeshPhysicalMaterial({color,metalness:0,roughness:.06,transmission:.82,transparent:true,opacity,thickness:.8,ior:1.46,clearcoat:1,clearcoatRoughness:.06,side:THREE.DoubleSide});}
function glow(color:number,intensity=2.3){return new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:intensity,metalness:.15,roughness:.2});}
function mesh(parent:THREE.Object3D,geometry:THREE.BufferGeometry,color:number,position:[number,number,number]=[0,0,0],surface?:THREE.Material){const object=new THREE.Mesh(geometry,surface??material(color));object.position.set(...position);object.castShadow=true;object.receiveShadow=true;parent.add(object);return object;}
function line(parent:THREE.Object3D,points:THREE.Vector3[],color=cyan,opacity=.8){const value=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color,transparent:true,opacity}));parent.add(value);return value;}

function buildModel(id:string,root:THREE.Group):Model{
  if(id==="atlas")return buildAtlas(root);
  if(id==="measurement")return buildMeasurement(root);
  if(id==="motion-kinematics"||id==="force-newton")return buildTrack(root,id==="force-newton");
  if(id==="work-energy-power")return buildEnergy(root);
  if(id==="gravitation"||id==="astronomy-astrophysics")return buildOrbit(root,id==="astronomy-astrophysics");
  if(id==="oscillations")return buildPendulum(root);
  if(id==="waves-sound"||id==="fluid-mechanics")return buildWave(root,id==="fluid-mechanics");
  if(id==="optics")return buildOptics(root);
  if(id==="electricity"||id==="electronics")return buildCircuit(root,id==="electronics");
  if(id==="magnetism")return buildMagnet(root);
  if(id==="thermodynamics")return buildGas(root);
  if(id==="modern-physics")return buildAtom(root);
  return buildMechanics(root);
}

function buildAtlas(root:THREE.Group):Model{
  const globe=mesh(root,new THREE.SphereGeometry(1.5,64,40),0x1766a4,[0,0,0],new THREE.MeshPhysicalMaterial({color:0x1d71ad,metalness:.08,roughness:.48,clearcoat:.6,clearcoatRoughness:.25,emissive:0x031c38,emissiveIntensity:.7}));
  const atmosphere=mesh(root,new THREE.SphereGeometry(1.56,64,40),cyan,[0,0,0],new THREE.MeshPhysicalMaterial({color:0x67dfff,transparent:true,opacity:.09,transmission:.6,roughness:.08,side:THREE.BackSide}));
  const cloud=mesh(root,new THREE.SphereGeometry(1.52,48,30),white,[0,0,0],new THREE.MeshPhysicalMaterial({color:white,transparent:true,opacity:.08,roughness:.7,wireframe:true}));
  const radii=[2.45,3.25,4.05];
  const nodes=radii.map((radius,index)=>{
    const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,.018,8,160),new THREE.MeshBasicMaterial({color:index===1?amber:cyan,transparent:true,opacity:.25}));ring.rotation.set(Math.PI/2+(index-1)*.17,index*.11,0);root.add(ring);
    const group=new THREE.Group();root.add(group);const core=mesh(group,new THREE.IcosahedronGeometry(.2+index*.05,2),index===1?amber:cyan,[0,0,0],glow(index===1?amber:cyan,1.6));
    const halo=mesh(group,new THREE.TorusGeometry(.34+index*.04,.018,8,64),white);halo.rotation.x=Math.PI/2;return {group,core,radius};
  });
  const starPositions=new Float32Array(360*3);for(let i=0;i<360;i++){const radius=6+((i*37)%100)/18,theta=i*2.399,phi=Math.acos(1-2*((i*53)%359)/359);starPositions[i*3]=Math.sin(phi)*Math.cos(theta)*radius;starPositions[i*3+1]=Math.cos(phi)*radius;starPositions[i*3+2]=Math.sin(phi)*Math.sin(theta)*radius}
  const stars=new THREE.Points(new THREE.BufferGeometry().setAttribute("position",new THREE.BufferAttribute(starPositions,3)),new THREE.PointsMaterial({color:white,size:.035,transparent:true,opacity:.7,sizeAttenuation:true}));root.add(stars);
  return{update:(t,l)=>{globe.rotation.y=t*.09;atmosphere.rotation.y=-t*.035;cloud.rotation.y=t*.125;stars.rotation.y=t*.008;nodes.forEach(({group,core,radius},index)=>{const angle=t*(.12+index*.04)*(1+l/180)+index*2.1;group.position.set(Math.cos(angle)*radius,Math.sin(angle*.7)*.32,Math.sin(angle)*radius);core.rotation.set(t*.35,t*.5,t*.24)})}};
}

function buildMeasurement(root:THREE.Group):Model{
  const ruler=mesh(root,new THREE.BoxGeometry(7,.18,.65),0xd8a73c,[0,-.8,0],metal(0xd8a73c,.24));
  for(let i=0;i<21;i++){const tick=mesh(root,new THREE.BoxGeometry(.025,i%5===0?.34:.2,.03),0x172532,[-3.35+i*.335,-.57,0.35],metal(0x182633,.34));tick.rotation.z=0}
  const block=mesh(root,new THREE.BoxGeometry(2.6,1.15,1),0x36d6e7,[0,.05,0],glass(0x36d6e7,.48));
  const jaws=[-1,1].map(sign=>mesh(root,new THREE.BoxGeometry(.13,1.9,.22),white,[sign*2,.35,.45],metal(white,.12)));
  return{update:(t,l)=>{const gap=.9+l*.018;jaws[0].position.x=-gap;jaws[1].position.x=gap;block.scale.x=.65+l*.007;root.rotation.y=Math.sin(t*.35)*.12;ruler.rotation.y=root.rotation.y}};
}
function buildTrack(root:THREE.Group,forces:boolean):Model{
  mesh(root,new THREE.BoxGeometry(8,.15,.8),0x536574,[0,-1.1,0],metal(0x607581,.3));
  const carts=[-1,1].map((sign,index)=>{const group=new THREE.Group();root.add(group);mesh(group,new THREE.BoxGeometry(1.4,.58,.9),index?0xffa62e:0x26d9f0,[0,0,0],metal(index?0xffa62e:0x26d9f0,.19));mesh(group,new THREE.BoxGeometry(.72,.12,.7),white,[0,.35,0],metal(white,.12));for(const x of [-.45,.45])for(const z of [-.5,.5]){const wheel=mesh(group,new THREE.CylinderGeometry(.14,.14,.12,20),0x101820,[x,-.38,z],material(0x080b0d,0,.82));wheel.rotation.x=Math.PI/2}group.position.set(sign*2,-.62,0);return group});
  return{update:(t,l)=>{const span=forces?1.25+l*.014:3.1;const travel=forces?Math.sin(t*1.8)*.12:((t*(.35+l*.008))%6)-3;carts[0].position.x=forces?-span:travel;carts[1].position.x=forces?span:-travel;carts.forEach((cart,i)=>cart.rotation.y=Math.sin(t+i)*.025)}};
}
function buildEnergy(root:THREE.Group):Model{
  const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-4,1.7,0),new THREE.Vector3(-2,-.7,0),new THREE.Vector3(0,.4,0),new THREE.Vector3(2,-.8,0),new THREE.Vector3(4,1.4,0)]);line(root,curve.getPoints(100),white,.7);const car=mesh(root,new THREE.BoxGeometry(.65,.35,.5),amber);
  return{update:(t,l)=>{const u=(t*(.06+l*.0015))%1;const p=curve.getPoint(u),tan=curve.getTangent(u);car.position.copy(p);car.rotation.z=Math.atan2(tan.y,tan.x)}};
}
function buildOrbit(root:THREE.Group,galaxy:boolean):Model{
  const center=mesh(root,new THREE.SphereGeometry(galaxy?.75:1.05,40,24),galaxy?0xf4cf8e:0x2975d8);center.material=new THREE.MeshStandardMaterial({color:galaxy?0xffd699:0x2579d4,emissive:galaxy?0x5a3518:0x07234a,emissiveIntensity:1.2});
  const satellites:number[]=[2.2,3.25,4.2];const bodies=satellites.map((radius,i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,.018,6,96),new THREE.MeshBasicMaterial({color:i?0x3b8cb3:cyan,transparent:true,opacity:.45}));ring.rotation.x=Math.PI/2+(i-1)*.13;root.add(ring);return mesh(root,new THREE.SphereGeometry(.16+i*.05,20,14),i===1?amber:white)});
  if(galaxy){for(let arm=0;arm<3;arm++)line(root,Array.from({length:60},(_,i)=>{const r=.05+i*.065,a=arm*Math.PI*2/3+i*.22;return new THREE.Vector3(Math.cos(a)*r,Math.sin(a)*r*.35,Math.sin(a)*.12)}),arm===1?amber:cyan,.35)}
  return{update:(t,l)=>{bodies.forEach((body,i)=>{const a=t*(.35+i*.18)*(1+l/160)+i*2.1;body.position.set(Math.cos(a)*satellites[i],Math.sin(a)*.15,Math.sin(a)*satellites[i]);});center.rotation.y=t*.12}};
}
function buildPendulum(root:THREE.Group):Model{
  mesh(root,new THREE.BoxGeometry(5,.16,.45),0x6b7e89,[0,2.7,0]);const cord=line(root,[new THREE.Vector3(0,2.65,0),new THREE.Vector3(0,-.8,0)],white,.75);const bob=mesh(root,new THREE.SphereGeometry(.52,32,20),amber,[0,-.8,0]);
  return{update:(t,l)=>{const angle=Math.sin(t*(.8+l*.015))*(.25+l*.006),length=3.45;const x=Math.sin(angle)*length,y=2.65-Math.cos(angle)*length;bob.position.set(x,y,0);cord.geometry.setFromPoints([new THREE.Vector3(0,2.65,0),bob.position.clone()])}};
}
function buildWave(root:THREE.Group,fluid:boolean):Model{
  const nodes:THREE.Mesh[]=[];for(let row=-3;row<=3;row++)for(let column=0;column<30;column++){const dot=mesh(root,new THREE.SphereGeometry(fluid?.055:.07,10,7),row===0?amber:cyan,[-4.6+column*.32,row*.34,0]);nodes.push(dot)}
  return{update:(t,l)=>nodes.forEach((dot,i)=>{const column=i%30,row=Math.floor(i/30)-3;const phase=column*.42-t*(1+l*.025);dot.position.y=row*.34+Math.sin(phase)*(.12+l*.002);dot.position.z=fluid?Math.cos(phase+row)*.22:0})};
}
function buildOptics(root:THREE.Group):Model{
  const prism=new THREE.Mesh(new THREE.CylinderGeometry(1.45,1.45,1.7,3),glass(0x8fdfff,.58));prism.castShadow=true;prism.rotation.z=Math.PI/2;root.add(prism);
  const lens=mesh(root,new THREE.SphereGeometry(1.18,48,28,0,Math.PI*2,.28,Math.PI-.56),0xa8edff,[-2.25,0,0],glass(0xa8edff,.32));lens.scale.z=.22;
  const colors=[0xff4c4c,0xffa62e,0xffee55,0x4cff8b,0x39bfff,0x9d6bff];const beams=colors.map((color,i)=>line(root,[new THREE.Vector3(-4,0,0),new THREE.Vector3(-.8,0,0),new THREE.Vector3(4,(i-2.5)*.42,0)],color,.8));
  return{update:(t,l)=>{prism.rotation.y=.25+Math.sin(t*.4)*.08;lens.rotation.y=-.08+Math.sin(t*.3)*.025;beams.forEach((beam,i)=>{(beam.material as THREE.LineBasicMaterial).opacity=.38+.45*(l/100)+Math.sin(t*2+i)*.08})}};
}
function buildCircuit(root:THREE.Group,board:boolean):Model{
  const path=[new THREE.Vector3(-3,-1.5,0),new THREE.Vector3(3,-1.5,0),new THREE.Vector3(3,1.5,0),new THREE.Vector3(-3,1.5,0),new THREE.Vector3(-3,-1.5,0)];line(root,path,0xe5a85c,.9);if(board)mesh(root,new THREE.BoxGeometry(3.3,.18,2.15),0x145c48,[0,0,-.25],new THREE.MeshPhysicalMaterial({color:0x145c48,metalness:.18,roughness:.5,clearcoat:.55}));
  for(const p of [[-3,-1.5],[3,-1.5],[3,1.5],[-3,1.5]] as Array<[number,number]>)mesh(root,new THREE.CylinderGeometry(.16,.19,.38,24),0xbfcbd2,[p[0],p[1],0],metal(0xbfcbd2,.14)).rotation.x=Math.PI/2;
  const resistor=mesh(root,new THREE.CylinderGeometry(.25,.25,1.25,28),0xd99b54,[0,1.5,0],material(0xd99b54,.18,.35));resistor.rotation.z=Math.PI/2;
  const lamp=mesh(root,new THREE.SphereGeometry(.43,30,20),0xffdd72,[0,-1.5,0],glow(0xffc84f,1));
  const charges=Array.from({length:16},()=>mesh(root,new THREE.SphereGeometry(.105,14,10),cyan,[0,0,0],glow(cyan,3.2)));
  return{update:(t,l)=>{(lamp.material as THREE.MeshStandardMaterial).emissiveIntensity=.4+l*.035;charges.forEach((charge,i)=>{let d=((i/charges.length+t*(.08+l*.002))%1)*12;if(d<6)charge.position.set(-3+d,-1.5,0);else if(d<9)charge.position.set(3,-1.5+(d-6),0);else charge.position.set(3-(d-9)*2,1.5,0)})}};
}
function buildMagnet(root:THREE.Group):Model{
  const north=mesh(root,new THREE.BoxGeometry(1.7,1,1),0xe44b4b,[-.85,0,0]);const south=mesh(root,new THREE.BoxGeometry(1.7,1,1),0x3b75d9,[.85,0,0]);const rings:Array<THREE.Mesh>=[];for(let i=0;i<6;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.5+i*.46,.018,6,96),new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.2+i*.055}));ring.rotation.x=Math.PI/2;ring.scale.y=.48;root.add(ring);rings.push(ring)}
  return{update:(t,l)=>{root.rotation.y=Math.sin(t*.35)*.22;rings.forEach((ring,i)=>ring.rotation.z=t*(.05+i*.008)*(1+l/100));north.scale.y=south.scale.y=.8+l*.004}};
}
function buildGas(root:THREE.Group):Model{
  const chamber=mesh(root,new THREE.BoxGeometry(6,4,3),0x62bfd8,[0,0,0],glass(0x62bfd8,.12));chamber.castShadow=false;
  const edges=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(6,4,3)),new THREE.LineBasicMaterial({color:0x8ce7ff,transparent:true,opacity:.62}));root.add(edges);
  const piston=mesh(root,new THREE.BoxGeometry(5.8,.18,2.8),0xaebdc4,[0,1.65,0],metal(0xaebdc4,.16));
  const particles=Array.from({length:42},(_,i)=>{const dot=mesh(root,new THREE.SphereGeometry(.1,12,8),i%4===0?amber:cyan,[0,0,0],glow(i%4===0?amber:cyan,1.4));dot.userData.base=new THREE.Vector3((Math.random()-.5)*5.2,(Math.random()-.5)*3,(Math.random()-.5)*2.3);return dot});
  return{update:(t,l)=>{piston.position.y=1.82-l*.015;particles.forEach((dot,i)=>{const speed=.35+l*.018,base=dot.userData.base as THREE.Vector3;dot.position.set(base.x+Math.sin(t*speed+i)*.42,Math.min(piston.position.y-.16,base.y+Math.sin(t*speed*1.31+i*2)*.34),base.z+Math.cos(t*speed*.8+i)*.28)})}};
}
function buildAtom(root:THREE.Group):Model{
  const nucleus=new THREE.Group();root.add(nucleus);for(let i=0;i<13;i++){const a=i*2.4,r=(i%4)*.13;mesh(nucleus,new THREE.SphereGeometry(.22,18,12),i%2?amber:0xe75470,[Math.cos(a)*r,((i%3)-1)*.2,Math.sin(a)*r])}const electrons:THREE.Mesh[]=[];for(let i=0;i<4;i++){const orbit=new THREE.Mesh(new THREE.TorusGeometry(1.4+i*.48,.014,5,90),new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.45}));orbit.rotation.set(i*.45,Math.PI/2,i*.3);root.add(orbit);electrons.push(mesh(root,new THREE.SphereGeometry(.1,14,9),cyan))}
  electrons.forEach(electron=>electron.material=glow(cyan,3.4));
  return{update:(t,l)=>{nucleus.rotation.y=t*.3;electrons.forEach((electron,i)=>{const radius=1.4+i*.48,a=t*(.7+i*.16)*(1+l/150)+i;electron.position.set(Math.cos(a)*radius,Math.sin(a)*radius*.55,Math.sin(a+i)*radius*.55)})}};
}
function buildMechanics(root:THREE.Group):Model{
  const ramp=mesh(root,new THREE.BoxGeometry(7,.18,2),0x536b78,[0,0,0],metal(0x536b78,.3));ramp.rotation.z=-.28;const block=mesh(root,new THREE.BoxGeometry(1.15,.9,1),amber,[-2,.25,0],metal(amber,.2));
  return{update:(t,l)=>{const travel=((t*(.18+l*.004))%1)*4.8-2.4;block.position.x=travel;block.position.y=-Math.tan(.28)*travel+.25;block.rotation.z=-.28}};
}
