import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

type Props = { position: number; mass: number; force: number; friction: number; extent: number; time: number };

/** Procedural apparatus. Positions are a labelled scaled view of the trial. */
export default function NewtonTrackScene(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const live = useRef(props);
  live.current = props;
  useEffect(() => {
    const mount = host.current!;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); }
    catch { mount.textContent = "WebGL is unavailable. Live numerical readings and graphs remain available."; return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x071422);
    scene.fog = new THREE.Fog(0x071422, 15, 35);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture;
    scene.environmentIntensity = .8;
    room.dispose(); pmrem.dispose();
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 80);
    camera.position.set(1.2, 2.8, 12.8);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, .35, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 3; controls.maxDistance = 19;
    controls.maxPolarAngle = Math.PI * .49;
    scene.add(new THREE.HemisphereLight(0xc6e8ff, 0x1b2635, .65));
    const key = new THREE.DirectionalLight(0xfff1d9, 3);
    key.position.set(-3,8,5); key.castShadow = true;
    key.shadow.mapSize.set(2048,2048);
    Object.assign(key.shadow.camera, {left:-7,right:7,top:5,bottom:-5});
    key.shadow.bias = -.001;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x6aafff, 1.5); fill.position.set(3,3,-4); scene.add(fill);
    const metal = new THREE.MeshStandardMaterial({color:0xa5b7c8,metalness:.8,roughness:.3});
    const dark = new THREE.MeshStandardMaterial({color:0x17212b,metalness:.45,roughness:.42});
    const blue = new THREE.MeshPhysicalMaterial({color:0x074bc4,metalness:.5,roughness:.27,clearcoat:1});
    const rubber = new THREE.MeshStandardMaterial({color:0x080b10,roughness:.86});
    const bolt = new THREE.MeshStandardMaterial({color:0xd7e1ed,metalness:.9,roughness:.2});
    const textures: THREE.Texture[] = [];
    const box = (parent:THREE.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,material:THREE.Material) => {
      const mesh = new THREE.Mesh(new RoundedBoxGeometry(w,h,d,3,Math.min(.035,w/5,h/5,d/5)),material);
      mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true; parent.add(mesh); return mesh;
    };
    const cylinder = (parent:THREE.Object3D,x:number,y:number,z:number,r:number,length:number,material:THREE.Material) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r,r,length,40),material);
      mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true; parent.add(mesh); return mesh;
    };
    const text = (parent:THREE.Object3D,content:string,x:number,y:number,z:number,width:number,color="white") => {
      const canvas=document.createElement("canvas");canvas.width=512;canvas.height=128;
      const ctx=canvas.getContext("2d")!;ctx.font="600 40px sans-serif";ctx.fillStyle=color;ctx.textAlign="center";ctx.fillText(content,256,78);
      const texture=new THREE.CanvasTexture(canvas); textures.push(texture);
      const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false}));
      sprite.position.set(x,y,z);sprite.scale.set(width,width/4,1);parent.add(sprite);
    };
    // Aluminium extrusion, twin running rails, measurement strip and levelling feet.
    box(scene,0,-.25,0,9,.42,1.1,metal);
    for(const z of [-.47,.47]) box(scene,0,.01,z,9,.09,.09,bolt);
    box(scene,0,-.22,.56,8.5,.18,.015,new THREE.MeshStandardMaterial({color:0xd5dce0,roughness:.5}));
    for(let i=0;i<=100;i++) box(scene,-4.15+i*.083,-.17-(i%10===0?.025:0),.574,.009,i%10===0?.1:.045,.009,dark);
    for(const x of [-3.75,3.75]) {
      box(scene,x,-.65,0,.22,.45,.8,dark);
      for(const z of [-.45,.45]) { cylinder(scene,x,-.95,z,.16,.16,rubber); cylinder(scene,x,-.82,z,.055,.2,bolt); }
    }
    box(scene,0,-1.12,0,24,.16,18,new THREE.MeshStandardMaterial({color:0x132537,metalness:.25,roughness:.4}));
    // Background lab cabinets are geometry, not a baked-in scene image.
    for(let i=0;i<7;i++) { box(scene,-8+i*2.6,1.4,-5,2.3,4,.6,dark); box(scene,-8+i*2.6,2,-4.67,2,.07,.02,metal); }
    const sensor=new THREE.Group();scene.add(sensor);
    box(sensor,-3.7,.48,0,1,.58,.65,dark);
    box(sensor,-3.7,.48,.34,.85,.43,.03,rubber);
    text(sensor,"FORCE SENSOR",-3.7,.5,.38,.9,"#b8e5ff");
    cylinder(sensor,-3.7,.14,0,.055,.28,bolt);
    const cart=new THREE.Group();cart.name="cart";cart.scale.setScalar(1.3);cart.position.y=.07;scene.add(cart);
    box(cart,0,.38,0,1.2,.45,.68,blue);
    box(cart,0,.63,0,1.1,.05,.62,metal);
    box(cart,0,.4,.349,.36,.22,.014,metal);
    text(cart,"m",0,.4,.38,.3,"#102030");
    for(const x of [-.52,.52]) for(const y of [.25,.55]) {const screw=cylinder(cart,x,y,.356,.025,.022,bolt);screw.rotation.x=Math.PI/2;}
    const wheels:THREE.Group[]=[];
    for(const x of [-.4,.4]) for(const z of [-.39,.39]) {
      const wheel=new THREE.Group();wheel.position.set(x,.15,z);cart.add(wheel);wheels.push(wheel);
      const tire=cylinder(wheel,0,0,0,.17,.12,rubber);tire.rotation.x=Math.PI/2;
      const hub=cylinder(wheel,0,0,z>0?.075:-.075,.105,.025,metal);hub.rotation.x=Math.PI/2;
      for(let n=0;n<5;n++) {const a=n*Math.PI*2/5;box(wheel,.066*Math.cos(a),.066*Math.sin(a),z>0?.092:-.092,.025,.025,.014,dark);}
    }
    const weights=new THREE.Group();cart.add(weights);
    for(let i=0;i<5;i++) cylinder(weights,0,.68+i*.065,0,.21,.055,metal);
    const applied=new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0),1,0x61ee91,.18,.12);
    const drag=new THREE.ArrowHelper(new THREE.Vector3(-1,0,0),new THREE.Vector3(0,.85,0),.7,0xc896ff,.15,.1);
    cart.add(applied,drag);
    text(cart,"F",.2,1.21,0,.3,"#66f59b");
    const resetView=()=>{const distance=Math.max(5.8,10/(2*Math.tan(Math.PI/10)*camera.aspect));camera.position.set(.35,distance*.13,distance);controls.target.set(0,.25,0);controls.update();};
    const resize=()=>{const w=mount.clientWidth,h=mount.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(1,h);camera.updateProjectionMatrix();resetView();};
    const observer=new ResizeObserver(resize);observer.observe(mount);resize();
    mount.addEventListener("reset-camera",resetView);
    let frame=0;
    const render=()=>{
      const v=live.current;
      cart.position.x=v.position/v.extent*2.9;
      mount.dataset.position=String(v.position);mount.dataset.time=String(v.time);
      weights.children.forEach((o,i)=>o.visible=i<Math.ceil(v.mass));
      wheels.forEach(w=>w.rotation.z=-v.position/.12);
      applied.visible=v.force!==0;drag.visible=v.force!==0&&v.friction>0;
      applied.setDirection(new THREE.Vector3(Math.sign(v.force)||1,0,0));
      applied.setLength(.35+Math.abs(v.force)/20*.85,.15,.1);
      drag.setDirection(new THREE.Vector3(-Math.sign(v.force)||-1,0,0));
      drag.setLength(.25+Math.min(v.friction,Math.abs(v.force))/10*.6,.12,.08);
      controls.update();if(!document.hidden) renderer.render(scene,camera);
      frame=requestAnimationFrame(render);
    };render();
    return ()=>{
      cancelAnimationFrame(frame);observer.disconnect();mount.removeEventListener("reset-camera",resetView);controls.dispose();
      const materials=new Set<THREE.Material>();scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}if(o instanceof THREE.Sprite)materials.add(o.material);if(o instanceof THREE.Line){o.geometry.dispose();materials.add(o.material as THREE.Material);}});
      materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());environment.dispose();renderer.dispose();renderer.domElement.remove();
    };
  },[]);
  return <div className="n2-apparatus"><div ref={host} className="n2-webgl" data-testid="newton-cart" aria-label="Interactive 3D dynamics track"/><button className="n2-camera" onClick={()=>host.current?.dispatchEvent(new Event("reset-camera"))}>Reset view</button><span className="n2-scene-help">Drag to orbit · Scroll to zoom · Track ±{props.extent.toFixed(1)} m (scaled)</span></div>;
}
